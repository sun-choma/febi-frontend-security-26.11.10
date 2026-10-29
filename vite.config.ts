import { execSync } from 'node:child_process'
import { basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const root = dirname(fileURLToPath(import.meta.url))

// GitHub Pages serves the deck at /<repo-name>/. Derive it from the git remote for build and preview,
// so `pnpm build` works the same on macOS, Linux and Windows (no shell tricks in package.json).
function repoBase() {
  try {
    const url = execSync('git config --get remote.origin.url', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
    return url ? `/${basename(url, '.git')}/` : '/'
  }
  catch {
    return '/' // no git or no remote yet: serve from the root
  }
}

// In CI, the deploy workflow sets PAGES_BASE_PATH from GitHub itself ("/<repo>", or "" for a
// custom domain / <owner>.github.io repo), which is authoritative. Locally, derive it from the remote.
const base = () => process.env.PAGES_BASE_PATH !== undefined ? `${process.env.PAGES_BASE_PATH}/` : repoBase()

export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? base() : '/',
  resolve: {
    // `~/utils/i18n` from any component, wherever it lives in components/ (~icons/… is left alone)
    alias: [{ find: /^~\//, replacement: `${root}/` }],
  },
}))
