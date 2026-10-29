#!/usr/bin/env node
// Everything to run before pushing or presenting, in one command (no shell features: works on Windows):
//   1. build every deck: slides.md → dist/, slides.<lang>.md → dist-<lang>/  (--guide also builds guide*.md)
//   2. pnpm preflight (arguments like --offline are passed through; --guide also preflights the guide)
//   3. print the talk-day checklist
// Exit code 1 if a build fails or preflight reports errors.
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const ROOT = process.cwd()
const args = process.argv.slice(2)
const withGuide = args.includes('--guide')
const preflightArgs = args.filter(a => a !== '--guide')
const slidev = join(dirname(createRequire(join(ROOT, 'package.json')).resolve('@slidev/cli/package.json')), 'bin', 'slidev.mjs')
const run = (argv, label) => {
  console.log(`\n▶ ${label}`)
  return spawnSync(process.execPath, argv, { stdio: 'inherit', cwd: ROOT }).status === 0
}

const entries = readdirSync(ROOT)
  .filter(f => /^slides(\.[\w-]+)?\.md$/.test(f) || (withGuide && /^guide(\.[\w-]+)?\.md$/.test(f)))
  .sort()
let failed = 0
for (const entry of entries) {
  const lang = entry.match(/^\w+\.([\w-]+)\.md$/)?.[1]
  const out = entry.startsWith('guide') ? `dist-guide${lang ? `-${lang}` : ''}` : lang ? `dist-${lang}` : 'dist'
  if (!run([slidev, 'build', entry, '--out', out], `build ${entry} → ${out}/`)) { failed++; console.error(`✖ build failed: ${entry}`) }
}

let preflightOk = run([join(ROOT, 'scripts', 'preflight.mjs'), ...preflightArgs], 'preflight')
if (withGuide) preflightOk = run([join(ROOT, 'scripts', 'preflight.mjs'), ...preflightArgs, '--guide'], 'preflight --guide') && preflightOk

const checklist = existsSync(join(ROOT, 'docs', 'checklists.md'))
  ? readFileSync(join(ROOT, 'docs', 'checklists.md'), 'utf8').split('## 発表当日')[1]?.split('\n## ')[0]
  : null
// skip the intro line that tells you to run `pnpm check` (you just did)
if (checklist) console.log(`\n▶ 発表当日のチェックリスト (docs/checklists.md)${checklist.replace(/^[^\n]*`pnpm check`[^\n]*\n/m, '')}`)

const ok = !failed && preflightOk
console.log(ok ? '\n✔ check passed' : `\n✖ check failed (${failed} build(s) failed${preflightOk ? '' : ', preflight errors'})`)
process.exit(ok ? 0 : 1)
