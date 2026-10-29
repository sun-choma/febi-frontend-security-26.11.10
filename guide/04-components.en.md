---
layout: section
routeAlias: components
style: "--accent: var(--orange)"
---

<div class="section-num">04</div>

# Components

<div class="section-sub">Shared components in components/common/, and icons</div>

---

# MdnLink and BrowserSupport

<div class="sub">Sources and support data, right where the claim is made</div>

<div class="cols middle">
<div class="card">
<MdnLink path="Web/CSS/Guides/Containment/Container_queries">Container queries</MdnLink>
<div class="note">The MDN locale follows the deck language: <code>/ja/</code> or <code>/en-US/</code></div>

<BrowserSupport class="mt-6" chrome="105" safari="16" firefox="110" baseline="2023" as-of="2026.10" />
<div class="note">A browser you leave out is shown as unsupported</div>
</div>
<div class="small-code">

```md
<MdnLink path="Web/CSS/Guides/Containment/Container_queries">
  Container queries
</MdnLink>

<BrowserSupport chrome="105" safari="16" firefox="110"
  baseline="2023" as-of="2026.10" />

<!-- omitted browser = unsupported -->
<BrowserSupport chrome="126" safari="18.2" …/>
```

<div class="note">Support data goes stale: always set <code>as-of</code></div>
</div>
</div>

---

# DemoEmbed

<div class="sub">Embed a page in a browser-style frame: an external site or a page in <code>public/</code></div>

<div class="cols">
<div>
<DemoEmbed src="/guide/embed-example.html" :height="230" />
</div>
<div class="small-code fit">

```md
<DemoEmbed src="/guide/embed-example.html" />

<DemoEmbed :tabs="[
  { label: 'SPA', src: 'https://…' },
  { label: 'MPA', src: '/demos/mpa.html' },
]" :height="300" :scale="0.6" />
```

<div class="note">Paths starting with <code>/</code> resolve against the base path.<br>Some external sites refuse to be embedded</div>
</div>
</div>

---

# SegmentedSwitch and Spoiler

<div class="sub">Switch demo variants; reveal extra detail on click</div>

<script setup>
import { ref } from 'vue'
const mode = ref('top')
</script>

<div class="cols">
<div class="card">
<SegmentedSwitch v-model="mode" :options="[{ value: 'top', label: 'top' }, { value: 'transform', label: 'transform' }]" />
<div class="note">Selected: <code>{{ mode }}</code>. Drive a demo's behaviour from this value</div>

<Spoiler class="mt-6" label="Why is transform fast?">

It skips layout and paint entirely; only compositing runs.

</Spoiler>
</div>
<div class="small-code">

```md
<script setup>
import { ref } from 'vue'
const mode = ref('top')
</script>

<SegmentedSwitch v-model="mode" :options="[
  { value: 'top', label: 'top' },
  { value: 'transform', label: 'transform' },
]" />

<Spoiler label="Why is transform fast?">

It skips layout and paint…

</Spoiler>
```

</div>
</div>

---

# Icons

<div class="sub">Bundled at build time, so they work offline. No imports needed</div>

<div class="cols middle">
<div class="card text-center">
<div class="flex justify-center gap-6 text-4xl">
  <lucide-rocket />
  <ph-lightning />
  <simple-icons-mdnwebdocs />
  <logos-chrome />
  <logos-vue />
</div>
<div class="flex justify-center gap-6 text-xs mt-2 opacity-60 font-mono">
  <span>lucide</span><span>ph</span><span>simple-icons</span><span>logos</span>
</div>
<div class="note mt-6"><b>lucide</b>: general / <b>ph</b>: general / <b>simple-icons</b>: brands / <b>logos</b>: browsers, frameworks</div>
</div>
<div class="small-code">

```md
<lucide-rocket />
<logos-chrome class="text-2xl" />
```

<div class="note">
  Search at <a href="https://icones.js.org" target="_blank">icones.js.org</a>.<br>
  Works the same inside <code>.vue</code> files.<br>
  For another set, add <code>@iconify-json/&lt;set&gt;</code> first
</div>
</div>
</div>

<div class="foot"><lucide-triangle-alert /> The class form <code>&lt;span class="i-lucide-x" /&gt;</code> renders 0×0 unless it's a flex item</div>

---

# Language-aware components

<div class="sub">UI text and the MDN locale follow the deck language</div>

<div class="cols">
<div>
<div class="col-h">Deck language (headmatter)</div>

```yaml
htmlAttrs:
  lang: en   # ja in slides.md
```

<div class="col-h mt-6">In a component</div>

```vue
<script setup lang="ts">
import { t } from '~/utils/i18n'
</script>

<template>
  <button>{{ t({ ja: '開始', en: 'Start' }) }}</button>
</template>
```

</div>
<div class="fit">
<div class="col-h">In this deck, right now</div>
<Spoiler />
<div class="note">No label passed.<br>An English deck shows English</div>
</div>
</div>

<div class="punch">New components shouldn't hardcode one language either</div>

---

# Your own demo

<div class="sub">Start by copying <code>components/guide/ExampleDemo.vue</code></div>

<div class="cols middle">
<div class="fit"><ExampleDemo /></div>
<div>

- **Runs only while its slide is shown**: `useIsSlideActive()`
- **Time-based motion**: slow frames skip ahead instead of slowing down
- **Crisp canvas**: `devicePixelRatio × $scale`
- **Clean up**: stop loops and listeners in `onUnmounted`
- **Keys still work after a click**: `releaseFocus($event)`

<div class="note">The full list of pitfalls is in <code>HANDBOOK.md</code> under "Demos"</div>
</div>
</div>
