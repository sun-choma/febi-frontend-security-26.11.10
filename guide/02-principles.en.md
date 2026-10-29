---
layout: section
routeAlias: principles
style: "--accent: var(--green)"
---

<div class="section-num">02</div>

# Principles

<div class="section-sub">What makes a good FEBi talk. Full version in PRINCIPLES.md</div>

---
routeAlias: show
---

# Show, don't tell

<div class="sub">Instead of explaining in prose, show it with a demo or a diagram</div>

<div class="cols">
<div class="card">
<div class="col-h ng"><lucide-x class="inline" /> Tell</div>
<div class="text-xs leading-relaxed opacity-80">
When the browser receives HTML, it parses it into a DOM tree, and in parallel builds a CSSOM from the CSS. It combines the two into a render tree, runs layout to compute each element's size and position, paints the pixels, and finally composites the layers onto the screen.
</div>
</div>
<div class="card lit">
<div class="col-h ok"><lucide-check class="inline" /> Show</div>
<div class="flow mt-6">
  <div class="step">DOM</div><lucide-arrow-right class="arrow" />
  <div class="step">Layout</div><lucide-arrow-right class="arrow" />
  <div class="step">Paint</div><lucide-arrow-right class="arrow" />
  <div class="step">Composite</div>
</div>
</div>
</div>

<div class="cols mt-6">
<div><b>Behaviour → demo</b><div class="note">Animation, resizing, events, performance</div></div>
<div><b>Structure → diagram</b><div class="note">Trees, flows, pipelines, layers</div></div>
</div>

<div class="punch">If an image or one line says it, don't build a demo</div>

---

# Three pillars

<div class="cols mt-8">
<div class="card">
<div class="text-3xl">👀</div>

### Show, don't tell

<div class="note">Behaviour as demos, structure as diagrams. A demo needs a reason to exist</div>
</div>
<div class="card">
<div class="text-3xl">📦</div>

### Self-contained

<div class="note">Decks are public and read later. Essential information lives on the slide; presenter notes are extras</div>
</div>
<div class="card">
<div class="text-3xl">✂️</div>

### Sparse, but complete

<div class="note">Cut words, not information. Aim for ~5 bullets per slide, one line each</div>
</div>
</div>

<div class="foot"><lucide-users /> Audience: juniors to seniors. The core must be followable by a junior; advanced content is welcome</div>

---

# Talk structure

<div class="sub">50 min at most (a 60 min slot minus 10 min of Q&A)</div>

<div class="flow mt-10">
  <div class="step">Cover<small>emoji + title</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step">Agenda<small>numbered sections</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step lit">Section × N<small>each opens with a divider</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step">Recap<small>links to key points</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step">Takeaways<small>cheat sheet, key points</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step">Closing<small>a few good resources</small></div>
</div>

<div class="notes">

- **Open with the problem** when the topic allows: pain point → naive fix → better tool. Don't force it
- **Recap and takeaways** may be one slide in a short talk
- **Closing resources**: a few links for those who want more, not a bibliography

</div>

---

# Slide rules

<div class="cols mt-4">
<div class="card">

**<lucide-code class="inline" /> Code**

<div class="note">≤ 12–15 lines per block. Cut the rest with <code>// ...</code> and walk through with line highlighting</div>
</div>
<div class="card">

**<lucide-mouse-pointer-click class="inline" /> Clicks**

<div class="note">Only when order matters, the slide holds a lot, or the conclusion shouldn't show early</div>
</div>
</div>

<div class="cols mt-4">
<div class="card">

**<lucide-link class="inline" /> Sources**

<div class="note">Cited where the claim is made. Numbers, quotes and browser support always sourced; support data dated</div>
</div>
<div class="card">

**<lucide-globe class="inline" /> Public by default**

<div class="note">No client names, internal URLs, internal tool screenshots or credentials. Use made-up examples</div>
</div>
</div>

<div class="foot"><lucide-info /> These are guidelines. Break one when the content needs it, and know why</div>
