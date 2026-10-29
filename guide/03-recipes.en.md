---
layout: section
routeAlias: recipes
style: "--accent: var(--cyan)"
---

<div class="section-num">03</div>

# Recipes

<div class="section-sub">Slide patterns you'll reuse. Preview on the left, source on the right</div>

---

# Section divider

<div class="sub">The first slide of each <code>pages/</code> file. Each section gets its own accent</div>

<div class="cols middle">
<div class="card text-center py-10" style="--accent: var(--orange)">
  <div class="section-num">04</div>
  <div class="text-3xl font-bold mt-2 text-$purple">Long polling</div>
  <div class="section-sub">A clever workaround, and its limits</div>
</div>
<div class="small-code">

````md
---
layout: section
routeAlias: polling
style: "--accent: var(--orange)"
---

<div class="section-num">04</div>

# Long polling

<div class="section-sub">A clever workaround, and its limits</div>
````

</div>
</div>

---

# A basic slide

<div class="sub">Title, subtitle, short bullets, one-line takeaway</div>

<div class="cols middle">
<div class="card">
  <div class="text-2xl font-bold text-$purple">@layer</div>
  <MdnLink path="Web/CSS/Reference/At-rules/@layer" class="text-sm opacity-80">Make cascade priority explicit</MdnLink>
  <ul class="text-sm mt-3">
    <li><b>Order over specificity</b>: a later-declared layer takes priority</li>
    <li><b>Isolates third-party CSS</b>: put libraries in a lower layer</li>
  </ul>
  <div class="punch">Turn specificity fights into layer order</div>
</div>
<div class="small-code">

````md
# @layer

<MdnLink path="Web/CSS/Reference/At-rules/@layer">
  Make cascade priority explicit
</MdnLink>

- **Order over specificity**: a later-declared layer takes priority
- **Isolates third-party CSS**: put libraries in a lower layer

<div v-click class="punch">
  Turn specificity fights into layer order
</div>
````

</div>
</div>

---

# NG / OK comparison

<div class="sub"><code>.cols</code> + <code>.card</code> + <code>.col-h</code>; mark the good one <code>.lit</code></div>

<div class="cols middle">
<div class="cols">
<div class="card">
<div class="col-h ng"><lucide-x class="inline" /> NG</div>

```js
el.style.width = w
el.offsetHeight // forced layout
```

</div>
<div class="card lit">
<div class="col-h ok"><lucide-check class="inline" /> OK</div>

```js
const h = el.offsetHeight
el.style.width = w
```

</div>
</div>
<div class="small-code">

````md
<div class="cols">
<div class="card">
<div class="col-h ng"><lucide-x /> NG</div>

```js
…
```

</div>
<div class="card lit">
<div class="col-h ok"><lucide-check /> OK</div>
…
</div>
</div>
````

</div>
</div>

---

# Showing code

<div class="sub">Short and focused. Click to step the line highlight</div>

<div class="cols">
<div>

```js {2|5-7|8|all}
async function* pages(url) {
  let next = url
  // ...
  while (next) {
    const res = await fetch(next)
    const data = await res.json()
    next = data.next
    yield data.items
  }
}
```

<div class="note">Comments in the deck language, API names as-is</div>
</div>
<div class="small-code">

````md
```js {2|5-7|8|all}
async function* pages(url) {
  let next = url
  // ...
  while (next) {
    …
  }
}
```
````

<div class="note"><code>{2|5-7|8|all}</code>: lines to highlight on each click.<br>Wrap in <code>&lt;div class="small-code"&gt;</code> to shrink a block</div>
</div>
</div>

---

# Revealing step by step

<div class="sub">When order matters, or the conclusion shouldn't show early</div>

<div class="cols middle">
<div class="card">
  <div class="col-h">How long polling works</div>
  <v-clicks>

  1. The browser sends a request
  2. The server holds it open
  3. New data arrives: the server responds
  4. The browser reconnects at once

  </v-clicks>
  <div v-click class="punch">So it's almost always connected</div>
</div>
<div class="small-code">

````md
<v-clicks>

1. The browser sends a request
2. The server holds it open
3. New data arrives: the server responds
4. The browser reconnects at once

</v-clicks>

<div v-click class="punch">
  So it's almost always connected
</div>
````

<div class="note">If order doesn't matter, show the bullets together</div>
</div>
</div>

---

# Showing with diagrams

<div class="sub">Structure as diagrams: <code>.flow</code> for boxes and arrows, <code>.tree</code> for trees</div>

<div class="cols middle">
<div class="card">
<div class="flow">
  <div class="step">HTML</div><lucide-arrow-right class="arrow" />
  <div class="step lit">DOM</div><lucide-arrow-right class="arrow" />
  <div class="step">Layout</div>
</div>

<pre class="tree mt-4"><span class="t">div</span>.<span class="v">card</span>
  <span class="t">h2</span> <span class="s">"Title"</span>
  <span class="t">p</span>  <span class="muted">display:none → not rendered</span></pre>
</div>
<div class="small-code">

````md
<div class="flow">
  <div class="step">HTML</div>
  <lucide-arrow-right class="arrow" />
  <div class="step lit">DOM</div>
  …
</div>

<pre class="tree">
<span class="t">div</span> …
</pre>
````

<div class="note">For more complex diagrams, Slidev's built-in <code>```mermaid</code> works too</div>
</div>
</div>

---

# Small helpers

<div class="sub"><code>style.css</code> classes for closing lines and asides</div>

<div class="helpers">
  <code>.punch</code><div class="punch">The one-line takeaway</div>
  <code>.ask</code><div class="ask">A question answered later?</div>
  <code>.bridge</code><div class="bridge">Hand-off to the next slide: next up, <b>Paint</b></div>
  <code>.foot</code><div class="foot"><lucide-info /> A small hint: <b>DevTools → Rendering</b></div>
  <code>.note</code><div class="note">An aside under code or a demo</div>
  <code>.badge</code><div># Heading <span class="badge">experimental</span> <span class="badge" style="--c: var(--green)">new</span></div>
  <code>.where</code><div class="where"><lucide-globe /> browser</div>
  <code>.source</code><div class="note">A non-MDN source. See the bottom left of this slide</div>
</div>

<div class="source"><lucide-link /><a href="https://web.dev/articles/rendering-performance" target="_blank">web.dev: Rendering performance</a></div>

<style>
.helpers { display: grid; grid-template-columns: 5rem 1fr; gap: 0.7rem 1.25rem; align-items: center; }
.helpers > div { margin: 0 !important; }
.helpers > code { justify-self: start; }
</style>
