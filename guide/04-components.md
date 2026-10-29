---
layout: section
routeAlias: components
style: "--accent: var(--orange)"
---

<div class="section-num">04</div>

# コンポーネント

<div class="section-sub">components/common/の共有コンポーネントとアイコン</div>

---

# MdnLinkとBrowserSupport

<div class="sub">出典と対応状況を、主張したその場所に</div>

<div class="cols middle">
<div class="card">
<MdnLink path="Web/CSS/Guides/Containment/Container_queries">コンテナクエリ</MdnLink>
<div class="note">MDNのロケールはデッキの言語に合わせて<code>/ja/</code>か<code>/en-US/</code>になります</div>

<BrowserSupport class="mt-6" chrome="105" safari="16" firefox="110" baseline="2023" as-of="2026.10" />
<div class="note">省略したブラウザは「未対応」として表示されます</div>
</div>
<div class="small-code">

```md
<MdnLink path="Web/CSS/Guides/Containment/Container_queries">
  コンテナクエリ
</MdnLink>

<BrowserSupport chrome="105" safari="16" firefox="110"
  baseline="2023" as-of="2026.10" />

<!-- 省略したブラウザ = 未対応 -->
<BrowserSupport chrome="126" safari="18.2" …/>
```

<div class="note">対応状況は古くなります。<code>as-of</code>は必ず付けます</div>
</div>
</div>

---

# DemoEmbed

<div class="sub">ブラウザ風の枠でページを埋め込みます。外部サイトでも<code>public/</code>のページでも</div>

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

<div class="note"><code>/</code>から始まるパスはbase path付きで解決されます。<br>外部サイトによってはiframe埋め込みを拒否します</div>
</div>
</div>

---

# SegmentedSwitchとSpoiler

<div class="sub">デモの切り替えと、クリックで開く補足</div>

<script setup>
import { ref } from 'vue'
const mode = ref('top')
</script>

<div class="cols">
<div class="card">
<SegmentedSwitch v-model="mode" :options="[{ value: 'top', label: 'top' }, { value: 'transform', label: 'transform' }]" />
<div class="note">選択中：<code>{{ mode }}</code>。この値でデモの動きを切り替えます</div>

<Spoiler class="mt-6" label="なぜtransformは速い？">

レイアウトもペイントもやり直さず、合成だけで済むからです。

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

<Spoiler label="なぜtransformは速い？">

レイアウトもペイントもやり直さず…

</Spoiler>
```

</div>
</div>

---

# アイコン

<div class="sub">ビルド時に同梱されるのでオフラインでも表示されます。インポート不要</div>

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
<div class="note mt-6"><b>lucide</b>：汎用 / <b>ph</b>：汎用 / <b>simple-icons</b>：ブランド / <b>logos</b>：ブラウザ、フレームワーク</div>
</div>
<div class="small-code">

```md
<lucide-rocket />
<logos-chrome class="text-2xl" />
```

<div class="note">
  検索は<a href="https://icones.js.org" target="_blank">icones.js.org</a>。<br>
  <code>.vue</code>ファイルの中でも同じ書き方です。<br>
  他のセットは<code>@iconify-json/&lt;set&gt;</code>を追加してから使います
</div>
</div>
</div>

<div class="foot"><lucide-triangle-alert /> クラス形式<code>&lt;span class="i-lucide-x" /&gt;</code>はflexの子要素でないと0×0で見えません</div>

---

# 言語に合わせるコンポーネント

<div class="sub">UIの文言とMDNのロケールはデッキの言語に従います</div>

<div class="cols">
<div>
<div class="col-h">デッキの言語（headmatter）</div>

```yaml
htmlAttrs:
  lang: ja   # slides.en.md では en
```

<div class="col-h mt-6">コンポーネント側</div>

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
<div class="col-h">今このデッキでは</div>
<Spoiler />
<div class="note">ラベルは渡していません。<br>日本語のデッキでは日本語で表示されます</div>
</div>
</div>

<div class="punch">新しいコンポーネントも、文言を一つの言語に固定しません</div>

---

# 自作デモ

<div class="sub"><code>components/guide/ExampleDemo.vue</code>をコピーして始めます</div>

<div class="cols middle">
<div class="fit"><ExampleDemo /></div>
<div>

- **スライドが表示中のときだけ動く**：`useIsSlideActive()`
- **時間ベースの動き**：遅いフレームは飛ばし、遅くはしない
- **くっきりしたcanvas**：`devicePixelRatio × $scale`
- **後片付け**：`onUnmounted`でループやリスナーを止める
- **クリック後もキー操作が効く**：`releaseFocus($event)`

<div class="note">落とし穴の一覧は<code>HANDBOOK.md</code>の「デモ」にあります</div>
</div>
</div>
