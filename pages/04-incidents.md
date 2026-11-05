---
layout: section
routeAlias: incidents
style: "--accent: var(--orange)"
---

<div class="section-num">04</div>

# 実際に起きた

<div class="section-sub">実際のインシデントを、ここまでの内容に対応づける</div>


---
routeAlias: incidents-map
---

# 4つのインシデント、4つの侵入口

<div class="sub">どれも、このトークで扱った侵入口から入ってきた</div>

<div class="cols incidents">
<div class="card">
<div class="when">2024.06</div>
<div class="name">polyfill.io</div>
<div class="layer">サードパーティのスクリプト</div>
<div class="ref" style="--c: var(--cyan)"><lucide-corner-down-right /> セクション03：自分が書いていないコード</div>
</div>
<div class="card">
<div class="when">2025.09</div>
<div class="name">chalk &amp; debug</div>
<div class="layer">実行時の依存パッケージ</div>
<div class="ref" style="--c: var(--cyan)"><lucide-corner-down-right /> セクション03：自分が書いていないコード</div>
</div>
<div class="card">
<div class="when">2025.09</div>
<div class="name">Shai-Hulud</div>
<div class="layer">インストール時の依存パッケージ</div>
<div class="ref" style="--c: var(--cyan)"><lucide-corner-down-right /> セクション03：自分が書いていないコード</div>
</div>
<div class="card lit">
<div class="when">2025.12</div>
<div class="name">React2Shell</div>
<div class="layer">フレームワークそのもの</div>
<div class="ref" style="--c: var(--green)"><lucide-corner-down-right /> セクション02：危険なコード</div>
</div>
</div>

<div class="punch">どれも、被害者自身のコードのバグを必要としなかった</div>

<div class="note">次のスライドから、<span class="ng">⚠</span>は被害が起きるステップを示す</div>

<style>
.incidents { margin-top: 1.2rem; align-items: stretch; }
.incidents .card { display: flex; flex-direction: column; gap: 0.3rem; align-items: flex-start; }
.incidents .when { font-size: 0.75rem; color: var(--comment); }
.incidents .name { font-size: 1.15rem; font-weight: bold; color: var(--foreground); line-height: 1.3; }
.incidents .layer { font-size: 0.75rem; color: var(--comment); margin-bottom: 0.6rem; }
.incidents .ref { margin-top: auto; display: flex; gap: 0.3rem; font-size: 0.7rem; line-height: 1.4; color: var(--c); }
.incidents .ref svg { flex: 0 0 auto; margin-top: 0.1rem; }
</style>

---

# polyfill.io：CDNの持ち主が変わった <span class="badge" style="--c: var(--red)">2024</span>

<div class="sub">古いブラウザに足りないJavaScript機能を届ける無料サービス。10万以上のサイトが1つのscriptタグで読み込んでいた</div>

<div class="cols story">
<div>

<div class="col-h">何が起きたか</div>

1. 2024.02、ある企業がpolyfill.ioのドメインを買収した
2. <span class="here">新しい所有者がスクリプトを書き換えた：読み込んでいた全サイトが、それを訪問者に配った</span>
3. 一部のモバイル訪問者を賭博サイトへ送り、管理者やデスクトップの検証者からは隠れた
4. 2024.06.25、Sansecが報告した

</div>
<div class="card takeaway">

<div class="col-h">教訓</div>

別ドメインのスクリプトは、そのドメインが今日配るものを何でも実行する

- **不要なものは外す**：最近のブラウザには不要だった
- **残すものは自分でホストする**：自分が変えたときだけ変わる
- **または整合性ハッシュで固定する**：変わったファイルをブラウザが拒否する

</div>
</div>

<div class="foot">侵入口：サードパーティのスクリプト（セクション03）</div>

<div class="source"><lucide-link /><a href="https://sansec.io/research/polyfill-supply-chain-attack" target="_blank">Sansec：polyfill supply chain attack</a></div>

---

# chalk &amp; debug：フィッシングされた1人のメンテナー <span class="badge" style="--c: var(--red)">2025</span>

<div class="sub">週に20億回以上ダウンロードされる18のパッケージが、たった1人のアカウントから公開された</div>

<div class="cols story">
<div>

<div class="col-h">何が起きたか</div>

1. 偽の「npmサポート」メール：メンテナーがそっくりのサイトでサインインし、攻撃者がアカウントを手に入れた
2. 2025.09.08、chalk、debug、さらに16のパッケージの新バージョンを公開した
3. <span class="here">訪問者のブラウザで、新しいコードが暗号資産のウォレットアドレスを攻撃者のものにすり替えた</span>
4. セキュリティ企業が同じ日に見つけた

</div>
<div class="card takeaway">

<div class="col-h">教訓</div>

あなたのアプリは、メンテナーのアカウントが公開したものをそのまま届ける

- **ロックファイル**：使っていたバージョンを保つ
- **リリース経過時間の遅延**：出たばかりのバージョンを避ける

</div>
</div>

<div class="foot">侵入口：実行時の依存パッケージ（セクション03）</div>

<div class="source"><lucide-link /><a href="https://www.aikido.dev/blog/npm-debug-and-chalk-packages-compromised" target="_blank">Aikido：npm debug and chalk packages compromised</a></div>

---

# Shai-Hulud：インストールで広がるワーム <span class="badge" style="--c: var(--red)">2025</span>

<div class="sub">狙い：開発者の秘密情報（クラウド、GitHub、npmの認証情報）と、さらに広がるためのパッケージ</div>

<div class="cols story">
<div>

<div class="col-h">何が起きたか</div>

1. 攻撃者が、一部のメンテナーのnpmトークンを盗んだ
2. それを使って、そのメンテナーのパッケージに感染版を公開した。どれもインストールスクリプト付き
3. <span class="here">npm installが開発マシンやCIでそれを実行：npm、GitHub、クラウドの認証情報を集めた</span>
4. それらを、被害者自身のGitHub上の公開「Shai-Hulud」リポジトリに流出させ、プライベートリポジトリの公開コピーも作った
5. 被害者のnpmトークンで、その人のパッケージにも感染。こうして被害者全員がさらに広げた：数百のパッケージ

</div>
<div class="card takeaway">

<div class="col-h">教訓</div>

パッケージのインストールはそのコードを実行する。あなたの秘密情報が手の届く範囲で

- **インストールスクリプトを無効に**：pnpm 10以降のデフォルト
- **npmでは**：.npmrcに`ignore-scripts=true`
- **認証情報を更新する**：感染版が実行された場合

</div>
</div>

<div class="foot">侵入口：インストール時の依存パッケージ（セクション03）</div>

<div class="source"><lucide-link /><a href="https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem" target="_blank">CISAアラート、2025.09.23</a> · <a href="https://github.blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain/" target="_blank">GitHub：our plan for a more secure npm supply chain</a> · <a href="https://sysdig.com/blog/shai-hulud-the-novel-self-replicating-worm-infecting-hundreds-of-npm-packages" target="_blank">Sysdig：Shai-Hulud analysis</a></div>

---

# React2Shell：1回のPOSTでサーバー上のコードが動く <span class="badge" style="--c: var(--red)">2025</span>

<div class="sub">Server Function（Next.jsではServer Action）は、ログイン不要で届く公開POSTエンドポイント</div>

<div class="cols middle">
<div class="r2s-flow">
<div class="step"><b>POST</b>を任意のServer Functionエンドポイントへ<small>細工したボディ、ログイン不要</small></div>
<lucide-arrow-down class="arrow" />
<div class="step">Reactが<b>ボディをオブジェクトに組み直す</b><small>あなたのコードへ渡る前に</small></div>
<lucide-arrow-down class="arrow" />
<div class="step">ある値はReactがたどる<b>パス</b><small>Functionに届くよう細工 &rarr;</small></div>
<lucide-arrow-down class="arrow" />
<div class="step here"><b>Function("...")がサーバー上で実行される</b><small>Server Functionや認証チェックの前に</small></div>
</div>
<div>

```js
// ボディの値は、別の部分を参照できる：
//   "$1:user:name" = パート1、その .user .name
// [key] は継承したプロパティも読む。だからパス
//   "$1:constructor:constructor" はここに届く：
part.constructor   // その型 (Object)
  .constructor     // Function
Function('/* 任意のコード */')()   // 実質 eval
```

</div>
</div>

<div class="punch">コードに<code>eval</code>はない：プロパティを1つたどりすぎただけ。頭字語ではなく基礎が穴を見抜く</div>

<div class="note"><b>修正</b>：パスはそのオブジェクト自身のプロパティだけをたどれる</div>

<div class="source"><lucide-link /><a href="https://github.com/facebook/react/pull/35277" target="_blank">React：修正（#35277）</a> · <a href="https://www.trendaisecurity.com/en-us/resources-insights/trendai-security-blog/CVE-2025-55182-analysis-poc-itw" target="_blank">Trend Micro：React2Shell analysis</a></div>

<style>
.r2s-flow { display: flex; flex-direction: column; gap: 0.15rem; }
.r2s-flow .step { border: 1px solid var(--border); border-radius: 0.4rem; padding: 0.3rem 0.6rem; background: var(--panel); font-size: 0.8rem; line-height: 1.3; }
.r2s-flow .step small { display: block; color: var(--comment); font-size: 0.68rem; }
.r2s-flow .step.here { border-color: var(--red); }
.r2s-flow .arrow { align-self: center; color: var(--comment); }
.punch { margin-top: 0.6rem; }
.note { margin-top: 0.4rem; }
</style>

---

# React2Shell：穴はReact自身にあった <span class="badge" style="--c: var(--red)">2025</span>

<div class="sub">CVE-2025-55182、深刻度は10段階中10.0：脆弱性が取りうる最高スコア</div>

<div class="cols">
<div class="card">
<div class="col-h">なぜ10.0 / 10なのか</div>

- **認証不要**：ログインもアカウントも要らない
- **リモートコード実行**：攻撃者のコードがあなたのサーバープロセスで動く
- **React Server Componentsを使うアプリすべて**：自分のServer Functionが1つもなくても
- **あなたのコードに落ち度はない**：バグはReact側にあった

</div>
<div class="card" style="--accent: var(--red)">
<div class="col-h">なぜ全フレームワークが影響を受けたか</div>

- **Nextではなく、Reactのレベル**：バグはReact自身のRSCシリアライザ（`react-server-dom-*`）にあった
- **共有された1つのコア**：その上に作られた全フレームワークが一斉にさらされた
- **Next.js、React Router、Waku、Parcel、ViteのRSCプラグイン**

</div>
</div>

<div class="card takeaway" style="--accent: var(--red); margin-top: 1.4rem">
<div class="col-h">教訓</div>

- **フレームワークも依存パッケージ**：勧告が出た瞬間にパッチを。React2Shellは公開から数時間で悪用された
- **Next.jsでは**：`react`ではなく`next`を更新する

</div>

<div class="source"><lucide-link /><a href="https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components" target="_blank">react.dev：critical security vulnerability in RSC</a> · <a href="https://aws.amazon.com/blogs/security/china-nexus-cyber-threat-groups-rapidly-exploit-react2shell-vulnerability-cve-2025-55182/" target="_blank">AWS：rapid exploitation of React2Shell</a></div>

<style>
.cols { align-items: stretch; }
</style>
