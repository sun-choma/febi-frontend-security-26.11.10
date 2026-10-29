---
layout: section
routeAlias: start
---

<div class="section-num">01</div>

# Getting started

<div class="section-sub">From template to deploy</div>

---
routeAlias: setup
---

# Start from the template

<div class="sub">One-time setup</div>

<div class="flow">
  <div class="step">Use this template<small>GitHub</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step">pnpm install<small>pnpm dev</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step">pnpm pages<small>enable Pages</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step lit">Fill the TODOs<small>or /kickoff with AI</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step">push<small>auto-deploy</small></div>
</div>

<div class="notes">

- **Repo name**: `febi-<topic>-<talk date YY.MM.DD>` (the day you present, not the day you create it). The deck is served at `https://<owner>.github.io/<repo>/`
- **Pages**: run `pnpm pages` once; it enables Pages and starts the first deploy (without `gh`: Settings → Pages → **GitHub Actions**). Then every push to `master` / `main` deploys
- **Set up**: plan with `docs/talk-plan.md`, then replace the `TODO`s in `slides.md` and `pages/`. With Claude Code: `/kickoff`

</div>

---

# Commands

<div class="sub">pnpm only (Node 24)</div>

| Command | What it does |
|---|---|
| `pnpm dev` | Shows `slides.md` at http://localhost:3030 (second language: `pnpm dev slides.en.md`) |
| `pnpm guide` | This guide (`pnpm guide:en` in English) |
| `pnpm check` | Builds every deck + `pnpm preflight` + the talk-day checklist |
| `pnpm preflight` | Static checks: links, icons, base path, structure, Japanese punctuation… |
| `pnpm build` / `preview` | Build and serve at the production sub-path |
| `pnpm export` | Exports a PDF (`slides-export.pdf`) |
| `pnpm pages` | Enables GitHub Pages and starts the first deploy (once) |

<div class="foot"><lucide-info /> Links or images broken only after deploy? Check with <b>pnpm build && pnpm preview</b></div>

---

# File map

<div class="cols">
<div>

<pre class="tree"><span class="t">slides.md</span>          <span class="muted">your deck (a skeleton with TODOs)</span>
<span class="k">pages/</span>             <span class="muted">one file per section (+ .en.md)</span>
<span class="k">components/</span>        <span class="muted">this talk's demos (shared: common/)</span>
<span class="t">style.css</span>          <span class="muted">shared styles</span>
<span class="t">PRINCIPLES.md</span>      <span class="muted">what makes a good talk</span>
<span class="t">HANDBOOK.md</span>        <span class="muted">how to build in this template</span>
<span class="k">docs/</span>              <span class="muted">recipes, talk plan, checklists</span>
<span class="t">guide.md</span>           <span class="muted">this guide (not deployed)</span>
<span class="t">CLAUDE.local.md</span>    <span class="muted">this talk's plan and notes (not in git)</span>
<span class="muted">AGENTS.md, .claude/  for AI tools; ignore if unused</span></pre>

</div>
<div class="fit">

<div class="col-h">Pulling in a section</div>

```md
---
src: ./pages/01-intro.en.md
---
```

<div class="note">Styles used on 2+ slides<br>belong in <code>style.css</code></div>

</div>
</div>
