---
layout: section
routeAlias: recipes
style: "--accent: var(--cyan)"
---

<div class="section-num">03</div>

# レシピ

<div class="section-sub">よく使うスライドの型。左がプレビュー、右がソースです</div>

---

# セクション区切り

<div class="sub">各<code>pages/</code>ファイルの最初のスライド。アクセント色はセクションごとに変えます</div>

<div class="cols middle">
<div class="card text-center py-10" style="--accent: var(--orange)">
  <div class="section-num">04</div>
  <div class="text-3xl font-bold mt-2 text-$purple">ロングポーリング</div>
  <div class="section-sub">賢い回避策と、その限界</div>
</div>
<div class="small-code">

````md
---
layout: section
routeAlias: polling
style: "--accent: var(--orange)"
---

<div class="section-num">04</div>

# ロングポーリング

<div class="section-sub">賢い回避策と、その限界</div>
````

</div>
</div>

---

# 基本のスライド

<div class="sub">タイトル、サブタイトル、短い箇条書き、最後に一行の要点</div>

<div class="cols middle">
<div class="card">
  <div class="text-2xl font-bold text-$purple">@layer</div>
  <MdnLink path="Web/CSS/Reference/At-rules/@layer" class="text-sm opacity-80">カスケードの優先順位を明示する</MdnLink>
  <ul class="text-sm mt-3">
    <li><b>詳細度より順序</b>：後に宣言したレイヤーが優先されます</li>
    <li><b>外部CSSを隔離</b>：ライブラリを下のレイヤーへ</li>
  </ul>
  <div class="punch">詳細度の争いを、順序の設計に</div>
</div>
<div class="small-code">

````md
# @layer

<MdnLink path="Web/CSS/Reference/At-rules/@layer">
  カスケードの優先順位を明示する
</MdnLink>

- **詳細度より順序**：後に宣言したレイヤーが優先されます
- **外部CSSを隔離**：ライブラリを下のレイヤーへ

<div v-click class="punch">
  詳細度の争いを、順序の設計に
</div>
````

</div>
</div>

---

# NG / OK比較

<div class="sub"><code>.cols</code> + <code>.card</code> + <code>.col-h</code>。良い方に<code>.lit</code>を付けます</div>

<div class="cols middle">
<div class="cols">
<div class="card">
<div class="col-h ng"><lucide-x class="inline" /> NG</div>

```js
el.style.width = w
el.offsetHeight // 強制レイアウト
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

# コードの見せ方

<div class="sub">短く、焦点を絞って。クリックで行ハイライトが進みます</div>

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

<div class="note">コメントはデッキの言語で、API名はそのまま</div>
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

<div class="note"><code>{2|5-7|8|all}</code>：クリックごとに強調する行。<br>小さくしたいときは<code>&lt;div class="small-code"&gt;</code>で囲みます</div>
</div>
</div>

---

# クリックで順に見せる

<div class="sub">順序が大事なとき、結論を先に見せたくないときに</div>

<div class="cols middle">
<div class="card">
  <div class="col-h">ロングポーリングの流れ</div>
  <v-clicks>

  1. ブラウザがリクエストを送る
  2. サーバーは返さずに待つ
  3. 新しいデータが来たら返す
  4. ブラウザはすぐ再接続する

  </v-clicks>
  <div v-click class="punch">つまり、ほぼ常に接続している</div>
</div>
<div class="small-code">

````md
<v-clicks>

1. ブラウザがリクエストを送る
2. サーバーは返さずに待つ
3. 新しいデータが来たら返す
4. ブラウザはすぐ再接続する

</v-clicks>

<div v-click class="punch">
  つまり、ほぼ常に接続している
</div>
````

<div class="note">順序に意味がない箇条書きは、まとめて表示します</div>
</div>
</div>

---

# 図で見せる

<div class="sub">構造は図で。<code>.flow</code>で箱と矢印、<code>.tree</code>でツリー</div>

<div class="cols middle">
<div class="card">
<div class="flow">
  <div class="step">HTML</div><lucide-arrow-right class="arrow" />
  <div class="step lit">DOM</div><lucide-arrow-right class="arrow" />
  <div class="step">Layout</div>
</div>

<pre class="tree mt-4"><span class="t">div</span>.<span class="v">card</span>
  <span class="t">h2</span> <span class="s">"Title"</span>
  <span class="t">p</span>  <span class="muted">display:none → 描画されない</span></pre>
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

<div class="note">もっと複雑な図には、Slidev組み込みの<code>```mermaid</code>も使えます</div>
</div>
</div>

---

# 小さな部品

<div class="sub">スライドの締めや補足に使う<code>style.css</code>のクラス</div>

<div class="helpers">
  <code>.punch</code><div class="punch">一行の要点</div>
  <code>.ask</code><div class="ask">後で答える問い？</div>
  <code>.bridge</code><div class="bridge">次のスライドへの橋渡し：次は<b>Paint</b></div>
  <code>.foot</code><div class="foot"><lucide-info /> 小さなヒント：<b>DevTools → Rendering</b></div>
  <code>.note</code><div class="note">コードやデモの下の補足</div>
  <code>.badge</code><div># 見出し <span class="badge">experimental</span> <span class="badge" style="--c: var(--green)">new</span></div>
  <code>.where</code><div class="where"><lucide-globe /> browser</div>
  <code>.source</code><div class="note">MDN以外の出典。このスライドの左下にあります（web.devは<code>?hl=ja</code>）</div>
</div>

<div class="source"><lucide-link /><a href="https://web.dev/articles/rendering-performance?hl=ja" target="_blank">web.dev：レンダリングのパフォーマンス</a></div>

<style>
.helpers { display: grid; grid-template-columns: 5rem 1fr; gap: 0.7rem 1.25rem; align-items: center; }
.helpers > div { margin: 0 !important; }
.helpers > code { justify-self: start; }
</style>
