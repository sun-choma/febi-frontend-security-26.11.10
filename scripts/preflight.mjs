#!/usr/bin/env node
// FEBi preflight: static checks for things that broke past decks. No dependencies.
//   pnpm preflight              all checks, including HTTP checks of external links
//   pnpm preflight --offline    skip the HTTP checks
//   pnpm preflight --guide      check the template guide (guide*.md) instead of the talk (slides*.md)
// Exit code 1 when there are errors. Builds are not run here: `pnpm check` runs both.
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { basename, dirname, join, relative } from 'node:path'

const ROOT = process.cwd()
const OFFLINE = process.argv.includes('--offline')
const PREFIX = process.argv.includes('--guide') ? 'guide' : 'slides'
const CI = !!process.env.GITHUB_ACTIONS
const git = (...a) => { try { return execFileSync('git', a, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() } catch { return '' } }
const errors = []
const warnings = []
const infos = []
const annotations = []
const rel = f => relative(ROOT, f).split('\\').join('/')
const note = (list, kind) => (f, line, msg) => {
  list.push(`${rel(f)}${line ? `:${line}` : ''}  ${msg}`)
  annotations.push(`::${kind} file=${rel(f)}${line ? `,line=${line}` : ''}::${msg}`)
}
const err = note(errors, 'error')
const warn = note(warnings, 'warning')
const info = msg => infos.push(msg)

// ---------- reading decks ----------

/** Lines of a file with flags for "inside a code fence" (``` or ````) and "inside <pre>/<style>". */
function scan(file) {
  const lines = readFileSync(file, 'utf8').split('\n')
  let fence = null
  let block = null
  return lines.map((text, i) => {
    const t = text.trim()
    const m = t.match(/^(`{3,})/)
    let inCode = false
    if (fence) {
      inCode = true
      if (m && t.replace(/`/g, '') === '' && m[1].length >= fence.length) fence = null
    }
    else if (m) { fence = m[1]; inCode = true }
    let inBlock = !!block
    if (!inCode && !block) {
      const open = t.match(/^<(pre|style)\b/)
      if (open && !t.includes(`</${open[1]}>`)) block = `</${open[1]}>`
      if (open) inBlock = true
    }
    else if (block && t.includes(block)) block = null
    return { text, no: i + 1, inCode, inBlock }
  })
}

const isYaml = chunk => {
  const l = chunk.filter(x => x.text.trim())
  return l.length > 0 && l.every(x => /^[\w-]+:(\s|$)/.test(x.text) || /^\s+\S/.test(x.text))
}
const yamlValue = (chunk, key) => chunk.map(x => x.text.match(new RegExp(`^${key}:\\s*(.+)$`))).find(Boolean)?.[1].replace(/^["']|["']$/g, '').trim()

/** Slides of a deck file, following `src:` imports. Each slide: { file, fm, body } */
function slidesOf(file, seen = new Set()) {
  if (seen.has(file)) return []
  seen.add(file)
  const lines = scan(file)
  const chunks = [[]]
  for (const l of lines) {
    if (!l.inCode && l.text === '---') chunks.push([])
    else chunks.at(-1).push(l)
  }
  const out = []
  let i = 0
  if (lines[0]?.text === '---') { out.push({ file, fm: chunks[1], body: chunks[2] ?? [] }); i = 3 }
  else { out.push({ file, fm: [], body: chunks[0] }); i = 1 }
  while (i < chunks.length) {
    if (isYaml(chunks[i]) && i + 1 < chunks.length) { out.push({ file, fm: chunks[i], body: chunks[i + 1] }); i += 2 }
    else { out.push({ file, fm: [], body: chunks[i] }); i += 1 }
  }
  return out
    .filter((s, idx) => idx === 0 || s.fm.length || s.body.some(l => l.text.trim()))
    .flatMap((s) => {
      const src = yamlValue(s.fm, 'src')
      if (!src) return [s]
      const target = join(dirname(file), src)
      if (!existsSync(target)) { err(file, s.fm[0]?.no, `src: ${src} does not exist`); return [] }
      return slidesOf(target, seen)
    })
}

const entries = readdirSync(ROOT).filter(f => new RegExp(`^${PREFIX}(\\.[\\w-]+)?\\.md$`).test(f)).map(f => join(ROOT, f))
if (!entries.length) { console.error(`No ${PREFIX}*.md found. Run from the repo root.`); process.exit(1) }

const decks = entries.map((entry) => {
  const head = readFileSync(entry, 'utf8')
  // htmlAttrs.lang, else from the file name: slides.md → ja, slides.en.md / slides.eng.md → en
  const suffix = basename(entry).match(/^\w+\.([\w-]+)\.md$/)?.[1]
  const lang = head.match(/htmlAttrs:\s*\n\s+lang:\s*(\S+)/)?.[1] ?? (suffix ? suffix.replace(/^eng$/, 'en') : 'ja')
  const slides = slidesOf(entry)
  return { entry, suffix, lang, slides, files: [...new Set(slides.map(s => s.file))] }
})
const main = decks.find(d => !d.suffix) ?? decks[0]
for (const d of decks)
  info(`${rel(d.entry)}: ${d.slides.length} slides, lang=${d.lang}, ${d.files.length} file(s)`)

// components/ and its subfolders (common/ = shared, guide/ = the guide's, root = this talk's), registered by file name
const componentFiles = existsSync(join(ROOT, 'components'))
  ? readdirSync(join(ROOT, 'components'), { recursive: true }).filter(f => f.endsWith('.vue')).map(f => join(ROOT, 'components', f))
  : []
const dupes = componentFiles.map(f => basename(f, '.vue')).filter((n, i, a) => a.indexOf(n) !== i)
for (const n of new Set(dupes)) warn(join(ROOT, 'components'), 0, `two components are named ${n}.vue: only one of them is used`)

// ---------- slide links and aliases ----------

for (const d of decks) {
  const aliases = new Map()
  d.slides.forEach((s, i) => {
    const a = yamlValue(s.fm, 'routeAlias')
    if (!a) return
    if (aliases.has(a)) err(s.file, s.fm[0]?.no, `routeAlias "${a}" used twice`)
    aliases.set(a, i + 1)
  })
  for (const f of d.files) {
    for (const l of scan(f)) {
      if (l.inCode) continue
      for (const m of l.text.matchAll(/<Link\s[^>]*\bto="([^"]+)"/g)) {
        const to = m[1]
        if (/^\d+$/.test(to)) {
          if (+to > d.slides.length) err(f, l.no, `<Link to="${to}">: the deck has only ${d.slides.length} slides`)
          else warn(f, l.no, `<Link to="${to}"> uses a number; give the target a routeAlias so it survives inserted slides`)
        }
        else if (!aliases.has(to)) err(f, l.no, `<Link to="${to}">: no slide has routeAlias "${to}"`)
      }
    }
  }
}

// ---------- components ----------
// PascalCase tags must be a file in components/, a Slidev built-in, or a theme/Vue built-in
const builtinDir = join(ROOT, 'node_modules', '@slidev', 'client', 'builtin')
const known = new Set([
  ...componentFiles.map(f => basename(f, '.vue')),
  ...(existsSync(builtinDir) ? readdirSync(builtinDir).map(f => f.replace(/\.(vue|ts)$/, '')) : []),
  'Transition', 'TransitionGroup', 'KeepAlive', 'Teleport', 'Suspense', 'Component', 'RouterLink', 'RouterView',
])
for (const f of [...new Set(decks.flatMap(d => d.files))]) {
  for (const l of scan(f)) {
    if (l.inCode) continue
    for (const m of l.text.matchAll(/<([A-Z][A-Za-z0-9]+)(?=[\s/>])/g))
      if (!known.has(m[1])) warn(f, l.no, `<${m[1]}> is not in components/ or a Slidev built-in: it renders nothing (not built yet, or a typo)`)
  }
}

// ---------- deck structure ----------

const sectionNum = s => s.body.map(l => l.text.match(/class="section-num"[^>]*>\s*(\d+)/)?.[1]).find(Boolean)
for (const d of decks) {
  const dividers = d.slides.filter(s => yamlValue(s.fm, 'layout') === 'section')
  dividers.forEach((s, i) => {
    const n = sectionNum(s)
    if (n && +n !== i + 1) warn(s.file, s.body.find(l => l.text.includes('section-num'))?.no, `section number ${n}, but it is section ${i + 1} in order`)
  })
  const agendaCounts = d.slides
    .map(s => ({ s, n: s.body.filter(l => !l.inCode && /class="agenda-item"/.test(l.text)).length }))
    .filter(x => x.n)
  for (const { s, n } of agendaCounts)
    if (dividers.length && n !== dividers.length) warn(s.file, s.body.find(l => /agenda-item/.test(l.text))?.no, `agenda/recap lists ${n} item(s) but the deck has ${dividers.length} section(s)`)
  const last = d.slides.at(-1)
  if (last && yamlValue(last.fm, 'layout') !== 'center') warn(last.file, last.fm[0]?.no ?? last.body[0]?.no, 'the last slide is not a closing slide (layout: center, headline, cta, resource pills)')
  // a twin deck must import its own twin pages, not the main deck's
  if (d.suffix) {
    for (const f of d.files)
      if (f !== d.entry && !basename(f).endsWith(`.${d.suffix}.md`)) warn(d.entry, 0, `imports ${rel(f)}, a main-deck page: create its .${d.suffix}.md twin`)
  }
}

// full-width punctuation left in non-Japanese decks
for (const d of decks.filter(d => !d.lang.startsWith('ja'))) {
  for (const f of d.files) {
    for (const l of scan(f)) {
      if (l.inCode || l.inBlock) continue
      if (/[、。：（）「」]/.test(l.text.replace(/`[^`]*`/g, ''))) warn(f, l.no, 'full-width punctuation in a non-Japanese deck')
    }
  }
}

// soft limits from PRINCIPLES.md: info only, they're guidelines
for (const d of decks) {
  for (const s of d.slides) {
    // longest single code block (fence lines excluded)
    let fence = 0
    let run = 0
    for (const l of s.body) {
      if (l.inCode && !/^\s*`{3,}/.test(l.text)) run++
      else if (!l.inCode) { fence = Math.max(fence, run); run = 0 }
    }
    fence = Math.max(fence, run)
    const bullets = s.body.filter(l => !l.inCode && /^\s*([-*]|\d+\.)\s/.test(l.text)).length
    const at = `${rel(s.file)}:${s.body[0]?.no ?? s.fm[0]?.no}`
    if (fence > 15) info(`${at}  a code block has ${fence} lines (guideline: ≤ 12–15)`)
    if (bullets > 6) info(`${at}  slide has ${bullets} bullets (guideline: ~5)`)
  }
}

// ---------- base path ----------

for (const f of [...new Set(decks.flatMap(d => d.files)), ...componentFiles]) {
  for (const l of scan(f)) {
    if (l.inCode) continue
    if (/["'(]\/public\//.test(l.text)) err(f, l.no, 'path starts with /public/: files in public/ are served at the base path without "public"')
    if (/<a\s[^>]*href="\/(?!\/)/.test(l.text)) err(f, l.no, 'root-absolute <a href="/…"> breaks under the deploy base path (slides: <Link to>; files: BASE_URL)')
    if (/\bsrc="\/(?!\/)/.test(l.text) && !/<DemoEmbed\b/.test(l.text)) warn(f, l.no, 'root-absolute src="/…" may break under the base path (Vue: use import.meta.env.BASE_URL)')
  }
}

// ---------- icons ----------

const iconDir = join(ROOT, 'node_modules', '@iconify-json')
const sets = existsSync(iconDir) ? readdirSync(iconDir).sort((a, b) => b.length - a.length) : []
const setData = {}
const iconSet = name => sets.find(s => name.startsWith(`${s}-`))
function hasIcon(set, icon) {
  setData[set] ??= JSON.parse(readFileSync(join(iconDir, set, 'icons.json'), 'utf8'))
  return icon in setData[set].icons || icon in (setData[set].aliases ?? {})
}
const NOT_ICONS = new Set(['v', 'router', 'slidev', 'client', 'transition', 'keep', 'font'])
if (!sets.length) warn(join(ROOT, 'package.json'), 0, 'node_modules/@iconify-json not found: run pnpm install before preflight')
else {
  for (const f of [...new Set(decks.flatMap(d => d.files)), ...componentFiles]) {
    for (const l of scan(f)) {
      if (l.inCode) continue
      const names = [
        ...[...l.text.matchAll(/<([a-z][a-z0-9]*(?:-[a-z0-9]+)+)(?=[\s/>])/g)].map(m => m[1]).filter(n => !NOT_ICONS.has(n.split('-')[0])),
        ...[...l.text.matchAll(/class="[^"]*"/g)].flatMap(m => [...m[0].matchAll(/\bi-([a-z0-9]+(?:-[a-z0-9]+)+)/g)].map(x => x[1])),
      ]
      for (const n of names) {
        const set = iconSet(n)
        if (!set) { err(f, l.no, `icon "${n}": no installed icon set matches (add @iconify-json/<set>; renders nothing), or it's an unknown component`); continue }
        if (!hasIcon(set, n.slice(set.length + 1))) err(f, l.no, `icon "${n}" doesn't exist in @iconify-json/${set} (renders nothing)`)
      }
    }
  }
}

// ---------- markdown inside HTML ----------
// A line that starts with an HTML tag is an HTML block: markdown in it (`code`, **bold**) shows literally.
for (const f of [...new Set(decks.flatMap(d => d.files))]) {
  for (const l of scan(f)) {
    if (l.inCode || l.inBlock || !/^\s*<[A-Za-z]/.test(l.text)) continue
    const text = l.text.replace(/<code>.*?<\/code>/g, '')
    if (/`[^`]+`/.test(text) || /\*\*[^*]+\*\*/.test(text)) warn(f, l.no, 'markdown (`code` / **bold**) inside an HTML line renders literally: use <code> / <b>')
  }
}

// ---------- Japanese text ----------

const CJK = '[\\u3040-\\u30ff\\u3400-\\u9fff]'
for (const d of decks.filter(d => d.lang.startsWith('ja'))) {
  for (const f of d.files) {
    for (const l of scan(f)) {
      if (l.inCode || l.inBlock) continue
      const text = l.text.replace(/`[^`]*`/g, '``').replace(/<code>.*?<\/code>/g, '<code></code>')
      if (text.includes('—')) err(f, l.no, 'em-dash (—) in Japanese text: use 、。or ：')
      if (new RegExp(`${CJK} [A-Za-z0-9]|[A-Za-z0-9] ${CJK}`).test(text)) warn(f, l.no, 'half-width space between Japanese and Latin text')
    }
  }
}

// ---------- translation parity ----------

const shape = d => d.slides.map(s => ({
  alias: yamlValue(s.fm, 'routeAlias') ?? '',
  layout: yamlValue(s.fm, 'layout') ?? '',
  num: sectionNum(s) ?? '',
  clicks: s.body.filter(l => !l.inCode).map(l => (l.text.match(/\bv-clicks?\b/g) ?? []).length).reduce((a, b) => a + b, 0),
}))
for (const d of decks.filter(d => d !== main)) {
  const a = shape(main)
  const b = shape(d)
  // Only the main deck is deployed, so drift is a warning: fix it with /translate
  if (a.length !== b.length) { warn(d.entry, 0, `${b.length} slides vs ${a.length} in ${rel(main.entry)}: decks are out of sync (sync the twin deck; AI: /translate)`); continue }
  for (let i = 0; i < a.length; i++) {
    const s = d.slides[i]
    if (a[i].alias !== b[i].alias) warn(s.file, s.fm[0]?.no ?? s.body[0]?.no, `slide ${i + 1}: routeAlias "${b[i].alias}" vs "${a[i].alias}" in the main deck`)
    if (a[i].num !== b[i].num) warn(s.file, s.body[0]?.no, `slide ${i + 1}: section number ${b[i].num || '–'} vs ${a[i].num || '–'} in the main deck`)
    if (a[i].layout !== b[i].layout) warn(s.file, s.fm[0]?.no ?? s.body[0]?.no, `slide ${i + 1}: layout "${b[i].layout}" vs "${a[i].layout}" in the main deck`)
    if (a[i].clicks !== b[i].clicks) warn(s.file, s.body[0]?.no, `slide ${i + 1}: ${b[i].clicks} v-click(s) vs ${a[i].clicks} in the main deck`)
  }
}

// twin staleness: a main page committed (or edited) after its twin
if (git('rev-parse', '--is-inside-work-tree') === 'true') {
  // stale = the source page has uncommitted edits and the twin doesn't, or the source's last commit
  // comes after the twin's (commit order, not timestamps)
  const dirty = f => !!git('status', '--porcelain', '--', f)
  const last = f => git('log', '-1', '--format=%H', '--', f)
  const isAncestor = (a, b) => { try { execFileSync('git', ['merge-base', '--is-ancestor', a, b], { cwd: ROOT, stdio: 'ignore' }); return true } catch { return false } }
  for (const d of decks.filter(d => d.suffix)) {
    for (const twin of d.files) {
      const src = twin.replace(new RegExp(`\\.${d.suffix}\\.md$`), '.md')
      if (src === twin || !existsSync(src)) continue
      const [cs, ct] = [last(src), last(twin)]
      const stale = dirty(src) ? !dirty(twin) : !dirty(twin) && cs && ct && cs !== ct && isAncestor(ct, cs)
      if (stale) warn(twin, 0, `${rel(src)} changed after this twin: sync it`)
    }
  }
}

// ---------- browser support dates ----------

const now = new Date()
for (const f of [...new Set(decks.flatMap(d => d.files))]) {
  for (const l of scan(f)) {
    if (l.inCode || !l.text.includes('<BrowserSupport')) continue
    const asOf = l.text.match(/as-of="(\d{4})\.(\d{1,2})/)
    if (!asOf) { warn(f, l.no, '<BrowserSupport> without as-of: support data goes stale'); continue }
    const months = (now.getFullYear() - +asOf[1]) * 12 + now.getMonth() + 1 - +asOf[2]
    if (months > 6) warn(f, l.no, `<BrowserSupport> data is ${months} months old: re-check it`)
  }
}

// ---------- public-safety ----------

const SECRET = [/ghp_[A-Za-z0-9]{36}/, /github_pat_\w{20,}/, /xox[abprs]-[\w-]{10,}/, /AKIA[0-9A-Z]{16}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/, /\bsk-(?:ant-)?[A-Za-z0-9_-]{20,}/]
const PRIVATE = [/\b(?:10\.\d{1,3}|192\.168|172\.(?:1[6-9]|2\d|3[01]))\.\d{1,3}\.\d{1,3}\b/, /https?:\/\/[^\s"')]*\.(?:internal|corp|lan|local)\b/, /\b(?!www\.)[\w-]+\.sun-asterisk\.(?:com|vn|co\.jp)/]
const publicText = existsSync(join(ROOT, 'public'))
  ? readdirSync(join(ROOT, 'public'), { recursive: true }).filter(f => /\.(html|js|json|txt|md|css)$/.test(f)).map(f => join(ROOT, 'public', f))
  : []
const envFiles = ['.env'].map(f => join(ROOT, f)).filter(existsSync)
for (const f of [...new Set([...decks.flatMap(d => d.files), ...componentFiles, ...publicText, ...envFiles])]) {
  for (const l of scan(f)) {
    if (SECRET.some(r => r.test(l.text))) err(f, l.no, 'looks like a secret/token: the deck is public')
    else if (PRIVATE.some(r => r.test(l.text))) warn(f, l.no, 'internal-looking address or company domain: confirm it is safe to publish')
  }
}

// ---------- leftovers and hygiene ----------

if (PREFIX === 'slides') {
  if (/^title:.*\bTODO\b/m.test(readFileSync(main.entry, 'utf8'))) warn(main.entry, 0, 'the skeleton is not filled in yet: replace the TODOs listed below (AI: /kickoff)')
  const remote = git('config', '--get', 'remote.origin.url')
  const repo = remote ? basename(remote, '.git') : ''
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).name
  if (repo && repo !== 'febi-template') {
    if (!/^febi-[a-z0-9-]+-\d{2}\.\d{2}\.\d{2}$/.test(repo)) warn(join(ROOT, 'package.json'), 0, `repo name "${repo}" doesn't follow febi-<topic>-<talk date YY.MM.DD>`)
    if (pkg !== repo) warn(join(ROOT, 'package.json'), 0, `package.json name "${pkg}" doesn't match the repo name "${repo}"`)
  }
}
if (existsSync(join(ROOT, 'package-lock.json'))) warn(join(ROOT, 'package-lock.json'), 0, 'npm lockfile next to pnpm: delete it (pnpm only)')
for (const f of [...new Set(decks.flatMap(d => d.files))]) {
  for (const l of scan(f))
    if (PREFIX === 'slides' && !l.inCode && /\bTODO\b/.test(l.text)) warn(f, l.no, 'TODO left in the deck')
}
let hex = 0
for (const f of [...new Set(decks.flatMap(d => d.files)), ...componentFiles])
  for (const l of scan(f)) if (l.inBlock && /#[0-9a-fA-F]{3,8}\b/.test(l.text)) hex++
if (hex) info(`${hex} hardcoded hex colour(s) in <style> blocks: prefer theme variables`)

// ---------- external links (HTTP) ----------

if (!OFFLINE) {
  const urls = new Map() // url -> first location
  for (const d of decks) {
    const mdn = d.lang.startsWith('ja') ? 'ja' : 'en-US'
    for (const f of d.files) {
      for (const l of scan(f)) {
        if (l.inCode) continue
        const found = [
          ...[...l.text.matchAll(/href="(https?:\/\/[^"]+)"/g)].map(m => m[1]),
          ...[...l.text.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map(m => m[1]),
          ...[...l.text.matchAll(/<MdnLink\s[^>]*\bpath="([^"]+)"/g)].map(m => `https://developer.mozilla.org/${mdn}/docs/${m[1]}`),
        ]
        for (const u of found) if (!urls.has(u)) urls.set(u, [f, l.no])
      }
    }
  }
  const check = async (u) => {
    const ctl = AbortSignal.timeout(15000)
    try {
      let r = await fetch(u, { method: 'HEAD', redirect: 'follow', signal: ctl })
      if (r.status === 405 || r.status === 403) r = await fetch(u, { redirect: 'follow', signal: AbortSignal.timeout(15000) })
      return r.status
    }
    catch (e) { return e.name === 'TimeoutError' ? 'timeout' : 'unreachable' }
  }
  const list = [...urls.keys()]
  for (let i = 0; i < list.length; i += 6) {
    const batch = list.slice(i, i + 6)
    const res = await Promise.all(batch.map(check))
    batch.forEach((u, k) => {
      const [f, line] = urls.get(u)
      const s = res[k]
      if (s === 404 || s === 410) err(f, line, `${u} → ${s}`)
      else if (typeof s !== 'number' || s >= 400) warn(f, line, `${u} → ${s} (may block bots; check by hand)`)
    })
  }
  info(`${list.length} external link(s) checked`)
}
else info('external links not checked (--offline)')

// ---------- report ----------

// the same file can be reached from two decks: report each finding once
for (const list of [errors, warnings, infos, annotations]) list.splice(0, list.length, ...new Set(list))
if (CI) for (const a of annotations) console.log(a)
const section = (title, list) => list.length && console.log(`\n${title} (${list.length})\n${list.map(x => `  ${x}`).join('\n')}`)
console.log('FEBi preflight')
section('✖ errors', errors)
section('⚠ warnings', warnings)
section('ℹ info', infos)
console.log(errors.length ? '\nFix the errors before presenting.' : '\nNo errors.')
process.exit(errors.length ? 1 : 0)
