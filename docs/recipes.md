# スライドのレシピ

コピーして、内容に合わせて調整してください。クラスはすべて`style.css`のもので、色はテーマ変数です。各レシピの表示結果をソースと並べて見るには`pnpm guide`を実行します。例が日本語なのは、日本語がデフォルトのメインデッキだからです。デッキの言語に合わせて調整してください。ここに出てくるデモのコンポーネント（`<JankDemo />`、`<BouncingBall />`）はプレースホルダーです。実際にはこのトーク用のものに置き換えます（`components/guide/ExampleDemo.vue`をコピーして始めます）。

## デッキの構成

`slides.md`は骨組みの状態で用意されています：表紙、アジェンダ、3つのセクション、振り返り、まとめ、締めのスライド。`TODO`はすべて置き換えてください（残っているものは`pnpm preflight`で一覧できます）。

**セクションのファイル**：`pages/0N-<alias>.md`で、セクション区切りから始めます。`routeAlias`と固有のアクセントカラーを付けます。色は順に、なし（purple）、`var(--green)`、`var(--cyan)`、`var(--orange)`、`var(--pink)`です。

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

**セクションを追加する**：**先に**`pages/`のファイルを作り、次に`slides.md`へ`src:`のimportを追加し、それからアジェンダと振り返りの項目を追加します（起動中の`pnpm dev`は、ファイルがすでに存在するimportしか読み込みません。反映されていないように見えたら、`slides.md`をもう一度保存してください）。**セクションを削除する**：importを削除し、アジェンダと振り返りの項目を削除してから、ファイルを削除し、`section-num`の番号を振り直します。

**アジェンダ／振り返りの項目**（`<div class="agenda">`の中）：

```md
<Link to="polling" class="agenda-item" style="--accent: var(--orange)"><span class="num">04</span> ロングポーリング<small>一行で</small></Link>
```

振り返りには各セクションの**要点**を並べ、その要点を示すスライドへリンクします（そのスライドには`routeAlias`を付けます）。これらのHTMLの行の中ではMarkdownが解釈されないため、バッククォートではなく`<code>`を書きます。

**締めのスライド**：見出し、`<div class="cta">`、そのあとに見る価値のあるリソースをいくつか`.pill`リンクで並べます（`slides.md`の末尾を参照）。参考文献の一覧ではありません。

## 基本のスライド

1枚のスライドに1つのポイント：タイトル、サブタイトル（多くはMDNリンク付き）、短い箇条書き5つ程度まで、1行の要点。

```md
# @layer

<MdnLink path="Web/CSS/Reference/At-rules/@layer">カスケードの優先順位を明示する</MdnLink>

- **詳細度より順序**：後に宣言したレイヤーが優先されます
- **外部CSSを隔離**：ライブラリを下のレイヤーへ

<div v-click class="punch">詳細度の争いを、順序の設計に</div>
```

MDNリンクがない場合は、タイトルの下に`<div class="sub">…</div>`を使います。

## 問題から入るフック

セクション（またはトーク全体）を、聴衆が目で見てわかる「うまくいかない例」と問いかけで始めます。答えは後で示します（後のスライド、または発表者が開ける`<Spoiler>`）。

```md
# 同じアニメーション、2つの書き方

<div class="cols middle">
<div class="fit"><JankDemo /></div>
<div>

- **左**：`top`を毎フレーム変更
- **右**：`transform`を毎フレーム変更

<div class="ask">なぜ片方だけカクつく？</div>
</div>
</div>
```

## NG／OKの比較

````md
<div class="cols">
<div class="card">
<div class="col-h ng"><lucide-x /> NG</div>

```js
el.style.width = w
el.offsetHeight // 強制レイアウト
```

</div>
<div class="card lit">
<div class="col-h ok"><lucide-check /> OK</div>

```js
const h = el.offsetHeight
el.style.width = w
```

</div>
</div>
````

3つ以上を比べる場合：同じ`.cols`の中に`.card`を増やします。

## コード

12〜15行程度まで。`// ...`で省略します。ハイライトはクリックで段階的に移します。コメントはデッキの言語で書きます。

````md
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
````

- ブロックを小さくする：`<div class="small-code">…</div>`で囲みます。
- 実行場所を示す：ブロックの上に`<div class="where"><lucide-globe /> browser</div>`（または`<lucide-server />`）。
- 編集・実行できるコード：```` ```js {monaco} ```` / ```` ```js {monaco-run} ````、バージョン間の変化を見せる：```` ````md magic-move ````。本当に役立つときだけ使います。

## コードとライブデモ

````md
# requestAnimationFrame

<div class="sub">ブラウザの描画タイミングに合わせて実行</div>

<div class="cols middle">
<div>

```js
function loop(t) {
  update(t)
  draw()
  requestAnimationFrame(loop)
}
```

<div class="note">タブが非表示の間は止まります</div>
</div>
<div class="fit"><BouncingBall /></div>
</div>

<div class="foot"><lucide-info /> DevTools → Performanceで<b>Animation Frame Fired</b>を確認</div>
````

デモのコンポーネントは`/demo`で作ります。

## 段階的に見せる

順序に意味があるとき、スライドの情報量が多いとき、結論を先に見せたくないときだけ使います。

```md
<v-clicks>

1. ブラウザがリクエストを送る
2. サーバーは返さずに待つ
3. 新しいデータが来たら返す

</v-clicks>

<div v-click class="punch">つまり、ほぼ常に接続している</div>
```

互いに積み上がらない順不同の箇条書きは、まとめて表示し、結論だけを`v-click`にします。表の場合は行ごとに`<tr v-click>`を使います。

## 図

構造は図で見せます。

```md
<div class="flow">
  <div class="step">HTML<small>parse</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step lit">DOM</div>
  <lucide-arrow-right class="arrow" />
  <div class="step">Layout</div>
</div>

<pre class="tree"><span class="t">div</span>.<span class="v">card</span>
  <span class="t">h2</span> <span class="s">"Title"</span>
  <span class="t">p</span>  <span class="muted">display:none → 描画されない</span></pre>
```

- `.tree`のspan：`.t`タグ／セレクター、`.s`文字列、`.k`キーワード、`.p`プロパティ、`.v`値、`.muted`。
- 段階的に見せる図：ステップに`v-click`を付けるか、`$clicks`でコンポーネントを動かします。
- 複雑なグラフ：Slidev組み込みの```` ```mermaid ````。
- 繰り返し使う図（例：複数のセクションに出てくるパイプライン）は、`active` / `reveal`のようなpropsを持つ小さなSVGコンポーネントにする価値があります。

## まとめ

リストよりも、チートシートや判断表のほうが伝わります。セルは色だけでなくアイコンで示します。

```md
# まとめ

| 変えるもの | Layout | Paint | Composite |
|---|:-:|:-:|:-:|
| `width`, `top` | <lucide-check class="ng" /> | <lucide-check class="ng" /> | <lucide-check class="ng" /> |
| `background-color` | | <lucide-check class="ng" /> | <lucide-check class="ng" /> |
| `transform`, `opacity` | | | <lucide-check class="ok" /> |

<div class="note text-center">✓ が多いほど高コスト</div>
```

または、3〜5個の要点を`.cols`の中の`.card`で並べます。それぞれ太字の見出しと1行の`.note`にします。

## 出典とブラウザ対応

- MDN：`<MdnLink path="<canonical path>">label</MdnLink>`。多くはサブタイトルとして使います。
- その他の出典：`<div class="source"><lucide-link /><a href="…" target="_blank">web.dev：タイトル</a></div>`（スライドの左下。日本語デッキでは、web.dev／Chromeのドキュメントに`?hl=ja`を付けます）。
- ブラウザ対応：`<BrowserSupport chrome="…" safari="…" firefox="…" baseline="YYYY" as-of="YYYY.MM" />`を、その機能名を出すスライドに置きます。

## 締めの一言と補助クラス

| クラス | 用途 |
|---|---|
| `.punch` | 1行の要点 |
| `.ask` | 後で答える問いかけ |
| `.bridge` | 次のスライドへのつなぎ（次の話題は`<b>`で） |
| `.foot` | アイコン付きの小さなヒント |
| `.note` / `.notes` | コードやデモの下の補足／下部に置く細かな注意点のリスト |
| `.badge` | タイトル内のインラインのピル。色は`style="--c: var(--green)"`で指定 |
| `<Spoiler>` | 任意の補足。クリックで開く（PDFでは開いた状態で表示） |

## 発表者ノート

任意です。末尾のHTMLコメントで、発表者モードで表示されます。説明がここにしかない、という状態にはしないでください。

```md
# スライドのタイトル

…

<!--
質問が出たら、ここでSafariのバグに触れる。
-->
```
