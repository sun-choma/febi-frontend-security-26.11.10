---
layout: section
routeAlias: start
---

<div class="section-num">01</div>

# はじめに

<div class="section-sub">テンプレートからデプロイまで</div>

---
routeAlias: setup
---

# テンプレートから始める

<div class="sub">最初の一回だけ必要な手順です</div>

<div class="flow">
  <div class="step">Use this template<small>GitHub</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step">pnpm install<small>pnpm dev</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step">pnpm pages<small>Pagesを有効化</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step lit">TODOを埋める<small>AIなら/kickoff</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step">push<small>自動デプロイ</small></div>
</div>

<div class="notes">

- **リポジトリ名**：`febi-<topic>-<発表日YY.MM.DD>`（作成日ではなく発表日）。公開URLは`https://<owner>.github.io/<repo>/`になります
- **Pages**：`pnpm pages`で一度だけ有効化し、最初のデプロイも始まります（`gh`がなければSettings → Pages → **GitHub Actions**）。以降は`master` / `main`へのpushで自動デプロイ
- **準備**：`docs/talk-plan.md`で構成を決め、`slides.md`と`pages/`の`TODO`を埋めます。Claude Codeなら`/kickoff`

</div>

---

# コマンド

<div class="sub">pnpmのみ使います（Node 24）</div>

| コマンド | 内容 |
|---|---|
| `pnpm dev` | `slides.md`をhttp://localhost:3030で表示（第二言語は`pnpm dev slides.en.md`） |
| `pnpm guide` | このガイド（英語は`pnpm guide:en`） |
| `pnpm check` | 全デッキのビルド + `pnpm preflight` + 当日のチェックリスト |
| `pnpm preflight` | リンク、アイコン、base path、構成、日本語の表記などを静的チェック |
| `pnpm build` / `preview` | 本番と同じサブパスでビルドして確認 |
| `pnpm export` | PDFを出力（`slides-export.pdf`） |
| `pnpm pages` | GitHub Pagesを有効化して最初のデプロイ（一度だけ） |

<div class="foot"><lucide-info /> リンクや画像が本番だけ壊れるときは<b>pnpm build && pnpm preview</b>で確認します</div>

---

# ファイル構成

<div class="cols">
<div>

<pre class="tree"><span class="t">slides.md</span>          <span class="muted">あなたのデッキ（TODO入りの骨組み）</span>
<span class="k">pages/</span>             <span class="muted">セクションごとに1ファイル（+ .en.md）</span>
<span class="k">components/</span>        <span class="muted">このトークのデモ（共有はcommon/）</span>
<span class="t">style.css</span>          <span class="muted">共有スタイル</span>
<span class="t">PRINCIPLES.md</span>      <span class="muted">良いトークの原則</span>
<span class="t">HANDBOOK.md</span>        <span class="muted">このテンプレートでの作り方</span>
<span class="k">docs/</span>              <span class="muted">レシピ、構成シート、チェックリスト</span>
<span class="t">guide.md</span>           <span class="muted">このガイド（デプロイされません）</span>
<span class="t">CLAUDE.local.md</span>    <span class="muted">トークの構成とメモ（git管理外）</span>
<span class="muted">AGENTS.md, .claude/  AI用。使わないなら無視</span></pre>

</div>
<div class="fit">

<div class="col-h">セクションの読み込み</div>

```md
---
src: ./pages/01-intro.md
---
```

<div class="note">2枚以上のスライドで使うスタイルは<br><code>style.css</code>に置きます</div>

</div>
</div>
