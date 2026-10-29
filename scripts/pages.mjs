#!/usr/bin/env node
// One-time GitHub Pages setup for a new talk repo: `pnpm pages`
//   1. enables Pages with "GitHub Actions" as the source (the workflow can't: GITHUB_TOKEN may not)
//   2. starts the first deploy
// Needs the GitHub CLI (`gh`), logged in as someone with admin rights on the repo (whoever created it).
import { spawnSync } from 'node:child_process'

const MANUAL = `Do it by hand instead:
  1. GitHub → your repo → Settings → Pages → Source: "GitHub Actions"
  2. Actions tab → "Deploy Slidev to GitHub Pages" → Run workflow`

const gh = (...args) => {
  const r = spawnSync('gh', args, { encoding: 'utf8' })
  return { ok: r.status === 0, out: (r.stdout ?? '').trim(), err: (r.stderr ?? '').trim(), missing: !!r.error }
}
const fail = (msg) => { console.error(`✖ ${msg}\n\n${MANUAL}`); process.exit(1) }

if (gh('--version').missing) fail('GitHub CLI (gh) not found: https://cli.github.com')
if (!gh('auth', 'status').ok) fail('GitHub CLI is not logged in: run `gh auth login` first')

const view = gh('repo', 'view', '--json', 'nameWithOwner,defaultBranchRef', '-q', '.nameWithOwner + " " + .defaultBranchRef.name')
if (!view.ok) fail(`can't find this repo on GitHub (push it first, or check \`git remote -v\`)\n  ${view.err}`)
const [repo, branch] = view.out.split(' ')

const site = gh('api', `repos/${repo}/pages`)
if (site.ok && JSON.parse(site.out).build_type === 'workflow') {
  console.log(`✔ Pages already set up for ${repo}: ${JSON.parse(site.out).html_url}`)
}
else {
  const res = site.ok
    ? gh('api', '-X', 'PUT', `repos/${repo}/pages`, '-f', 'build_type=workflow') // was "deploy from a branch"
    : gh('api', '-X', 'POST', `repos/${repo}/pages`, '-f', 'build_type=workflow')
  if (!res.ok) fail(`couldn't enable Pages for ${repo}: the repo must be Public (free GitHub Pages) and you need admin rights on it\n  ${res.err}`)
  console.log(`✔ Pages enabled for ${repo} (source: GitHub Actions)`)
}

const run = gh('workflow', 'run', 'deploy.yml', '--ref', branch)
if (!run.ok) fail(`Pages is on, but the deploy couldn't be started\n  ${run.err}`)
const url = JSON.parse(gh('api', `repos/${repo}/pages`).out || '{}').html_url ?? `https://github.com/${repo}`
console.log(`✔ Deploy started on ${branch}. Follow it with \`gh run watch\`; the deck will be at ${url}`)
