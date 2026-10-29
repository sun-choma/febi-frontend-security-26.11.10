# ハンドブック

AIアシスタントを使う場合も使わない場合も、このリポジトリでFEBiデッキを作る方法をまとめています。*良い*トークとは何かは[PRINCIPLES.md](PRINCIPLES.md)にあります。コピー＆ペーストで使えるスライドのパターンは[docs/recipes.md](docs/recipes.md)にあり、`pnpm guide`を実行すると、すべてのパターンがソースと並べてレンダリングされます。

## ワークフロー

| 段階 | 手作業 | Claude Codeを使う場合 |
|---|---|---|
| 構成を決める | [docs/talk-plan.md](docs/talk-plan.md)を埋める → `CLAUDE.local.md` | `/kickoff` |
| 骨組みを埋める | `slides.md`と`pages/`の`TODO`を置き換える | `/kickoff` |
| スライドを書く | [docs/recipes.md](docs/recipes.md)、`pnpm guide` | `/slide` |
| デモを作る | `components/guide/ExampleDemo.vue`を`components/`にコピーする。このページの「デモ」を参照 | `/demo` |
| 第二言語（任意） | このページの「第二言語デッキ」 | `/translate` |
| 内容のレビュー | 同僚と[docs/checklists.md](docs/checklists.md) | `/review` |
| 技術チェック | `pnpm check` | `/preflight` |
| 発表当日 | [docs/checklists.md](docs/checklists.md) | |

## コマンド

```bash
pnpm dev                    # メインデッキ（slides.md）をhttp://localhost:3030で表示
pnpm dev slides.en.md       # 第二言語デッキ（トークにある場合）
pnpm guide                  # このテンプレートのガイド：すべてのレシピをソースつきで表示（pnpm guide:en）
pnpm check                  # 全デッキのビルド + pnpm preflight + 発表当日のチェックリスト
pnpm preflight              # 静的チェックのみ（--offlineで外部リンクのチェックをスキップ）
pnpm build                  # → dist/、/<repo-name>/で配信（git remoteから決定）
pnpm preview                # dist/をそのサブパスで配信し、base pathのバグを見つける
pnpm export                 # PDF → slides-export.pdf（別のデッキはpnpm export slides.en.md）
pnpm pages                  # リポジトリごとに1回：GitHub Pagesを有効化し、最初のデプロイを開始
```

pnpmのみを使い、npmやyarnは決して使いません。Node 24（22.13以上。`.node-version`を参照）。`pnpm install`はヘッドレスChromiumもダウンロードしますが、これは`pnpm export`でのみ使われます。エクスポート中にSlidev自体から出る`Failed to patch FloatingVue`エラーは無害で、PDFは問題ありません。

## ファイル構成

```
slides.md            メインデッキ（デフォルトは日本語）：表紙、アジェンダ、src: import、振り返り、まとめ、締め
slides.<lang>.md     任意の第二言語デッキ、同じ形（例：slides.en.md）
pages/0N-<alias>.md  セクションごとに1ファイル、セクション区切りから始まる（+ 対になる.<lang>.md）
components/          自動登録されるVueコンポーネント（ファイル名で登録。サブフォルダもOK）
  common/            共有コンポーネント（テンプレートのもの。下記の表）
  guide/             ガイド用（ExampleDemoなど）
  *.vue              このトークのデモやコンポーネント（components/直下）
utils/               i18n.ts（デッキ言語のUIテキスト）、release-focus.ts（キーボード操作を維持する）
style.css            共有クラス。2枚以上のスライドで使うものはここに置く
public/              静的ファイル。base pathで配信される
guide.md, guide/     テンプレートのガイド（pnpm guide）。そのままにしておく。トークとしてデプロイされるのはslides.mdだけです（public/guide/のファイルは一緒に配信されますが無害です）
docs/                レシピ、構成シート、チェックリスト
```

AIを使わない場合は、`.claude/`、`.mcp.json`、`CLAUDE.md`、`AGENTS.md`は無視してかまいません。

## トークを始める

1. [docs/talk-plan.md](docs/talk-plan.md)で計画します：ピッチ、要点つきのセクション、各セクションを語るのではなくどう*見せる*か、却下したアイデア。
2. リポジトリは自分のアカウントに**Public**で作ります（無料のGitHub PagesはPublicのみ）。名前は`febi-<topic>-<発表日YY.MM.DD>`（日付はリポジトリの作成日ではなく、発表する日）とし、`package.json`の`"name"`をそれに合わせます。GitHub Pagesは`pnpm pages`で一度だけ有効化します（[GitHub CLI](https://cli.github.com)が必要です。ない場合：Settings → Pages → Source: **GitHub Actions**、その後Actions → Run workflow）。
3. `slides.md`と`pages/`のすべての`TODO`を置き換え、セクションを追加・削除します（[docs/recipes.md](docs/recipes.md)の「デッキの構成」）。残っているTODOは`pnpm preflight`が一覧表示します。

## スライドを書く

- **1スライドに1つのポイント**：ポイントが2つなら、スライドを2枚にします。
- **収まり**：canvasは980×552です。タイトル、サブタイトル、本文の短い行10〜12行ほどで埋まります。きつい場合は削るか分割します。すべてを`small-code`に縮めることはしません。
- **デモの横に置くコード**は、そのデモが表示する内容を実際に生成するものにします。デモに追加のガードが必要なら、それも見せるか、省略した理由を述べます。
- **セクションの終わり**：各セクションの要点を示すスライドに`routeAlias`をつけ、振り返りの項目からそのスライドを指します。振り返りの後、締めの前に、まとめのスライド（チートシート、判断表、または3〜5個の要点）を置きます（骨組みに`TODO`があります）。短いトークでは振り返りと1枚にまとめても構いません。
- **発表者ノート**（末尾の`<!-- -->`コメント）は任意の補足であり、説明が書かれている唯一の場所には決してしません。

## スタイル

- CSSを書く前に`style.css`のクラスを使います：`.sub`、`.cols`（`.fit`、`.middle`）、`.col-h`、
  `.ok`/`.ng`、`.card`（`.lit`）、`.note`、`.notes`、`.punch`、`.ask`、`.bridge`、`.foot`、`.source`、
  `.badge`、`.where`、`.small-code`、`.tree`、`.flow`/`.step`/`.arrow`、`.agenda`/`.agenda-item`、
  `.cta`/`.pills`/`.pill`、`.emoji`。
- スライドごとの`<style>`はそのスライドにスコープされます。1回限りのものに使い、2回目に使うときにはルールを`style.css`へ移します。
- **色はテーマ変数**を使い、hexは決して使いません：`--purple`、`--green`、`--cyan`、`--orange`、`--pink`、`--red`、
  `--yellow`、`--comment`（muted）、`--foreground`、`--background`、`--current-line`、加えて`--panel`と`--border`。
- テーマはh1〜h6を紫、`**strong**`をオレンジ、`*em*`を黄色、リンクとリストマーカーをシアンにしており、IDレベルの詳細度（`#app …`）を持ちます。上書きするには詳細度を合わせます。例：`#app .slidev-layout a.pill`。
- 横並びのコンテンツには`two-cols-header`ではなく`.cols`を使います。
- **HTMLの行の中ではMarkdownは解釈されません**（`<div>…</div>`、`<Link>…</Link>`、`<small>`）：そこでは`<code>`、`<b>`、`<a>`を書き、バッククォートや`**`は決して使いません。HTML要素の中に独立した行として置くMarkdownの前後には、空行を入れます。
- フォントはテーマが提供します（Nunito Sans / JetBrains Mono）。フォント名を直接指定せず、等幅が必要なところでは`font-family: var(--slidev-code-font-family, monospace)`を使います。フォント自体を変えるときは、headmatterの`fonts`だけで行います。

## アイコン

ビルド時に`lucide`（汎用）、`ph`、`simple-icons`（ブランド、例：MDN）、`logos`（ブラウザ、フレームワーク）からバンドルされます。[icones.js.org](https://icones.js.org)で探せます。

- スライドでも`.vue`ファイルでも、importなしでコンポーネント形式を使います：`<lucide-check />`。
- クラス形式の`<span class="i-lucide-x" />`は、flexアイテムでない限り0×0で描画されます。
- `@iconify/vue`（実行時に取得する）や`@lucide/vue`は決して使いません。別のアイコンセットを使うには、`@iconify-json/<set>`をdevDependencyとして追加する必要があります。追加しないと、アイコンはエラーも出さずに表示されません。

## リンク、アセット、出典

デッキは`/`ではなく`/<repo>/`から配信されます。ルートからの絶対パスはデプロイ後に壊れます。

- スライドへのリンクは、`<Link to="alias">`と、リンク先スライドの`routeAlias`で張ります。番号（`<Link to="12">`）はスライドを追加するとずれます。`<a href="/12">`は決して使いません。
- `public/`のファイル：Vueでは`` `${import.meta.env.BASE_URL}file.png` ``。`<DemoEmbed>`は`/…`を自分で解決します。Markdownの`![](/file.png)`は問題ありません。`/public/…`は決して使いません。
- **すべての数値、引用、ブラウザサポートの主張には、スライド上に出典をつけます**。出典を開き、その特定の主張が書かれていることを確認してください。一般的な記事よりも、最も具体的なページ（その機能のMDNページやBaselineのエントリ）を優先します。
- **MDN**：`<MdnLink path="…">`に**正規パス**（リダイレクト後の最終的なen-USのURL、例：`Web/CSS/Reference/At-rules/@layer`）を指定します。古いパスは、翻訳が存在しない場合に`/ja/`の下で404になります。
- **その他の出典**：`<div class="source"><lucide-link /><a href="…" target="_blank">site: title</a></div>`を、スライドの下部に置きます。日本語デッキでは、web.devとChrome docsのURLに`?hl=ja`をつけます。

## 共有コンポーネント

`components/common/`にある、全トークで使える部品です。インポートなしで使えます。このトーク専用のコンポーネントは`components/`直下に置きます。

| コンポーネント | 用途 |
|---|---|
| `<MdnLink path="Web/CSS/Reference/At-rules/@layer">label</MdnLink>` | ラベルとMDNアイコンのリンク。ロケールはデッキに従う |
| `<BrowserSupport chrome="105" safari="16" firefox="110" baseline="2023" as-of="2026.10" />` | サポート状況の行。省略したブラウザは未サポートとして表示される。`as-of`は必ず設定し、スライド上で機能名を示す |
| `<DemoEmbed src="…" />` / `:tabs="[{ label, src }]"` | ブラウザ枠つきのiframe。`scale`、`height`のprops |
| `<SegmentedSwitch v-model="x" :options="[{ value, label }]" />` | デモのバリエーションを切り替えるトグル |
| `<Spoiler label="…">…</Spoiler>` | クリックで表示する。クリックステップとは独立。PDFエクスポートでは開いた状態になる。**任意の詳細だけに使い、必須の内容には決して使わない** |
| `<ExampleDemo />` | リファレンスのデモ（`components/guide/`）：`components/`にコピーし、名前を変えて自分のデモを作り始める |

**コンポーネントのUIテキストはデッキの言語に従います**。共有コンポーネントは`utils/i18n.ts`を通じて`htmlAttrs.lang`を読み取ります。表示テキストを持つ新しいコンポーネントも同じようにします：`import { t } from '~/utils/i18n'`して`t({ ja: '開始', en: 'Start' })`。

## デモ

### まず、そもそもコンポーネントにすべきか

デモには存在する理由が必要です（PRINCIPLES.md：語るより見せる）。次の順に確認し、最初に当てはまったところで止めます：

1. **振る舞いではなく構造か**：それなら図（`.flow`、`.tree`、mermaid）にします。
2. **既存のページで見せられるか**（MDNの例、Chromeのデモページ、CodePenなど）：`<DemoEmbed>`で埋め込むか、発表中に実際のタブで開きます。
3. **画像、GIF、またはスライド上の数行のCSSで足りるか**：それを使います。
4. **トークのテーマが技術そのもの（canvas、View Transitionsなど）か**：ここでその技術を使う本当の理由が必要です。素のHTML/CSSの方がうまくできるなら説得力がないので、「Xを使うべきでない場面」の反例として使うことを検討します。

### 小さく設計する

- **見せることは1つ**：デモ1つに概念1つ。聴衆に何の変化に気づいてほしいかを決めます。
- **操作は1つ**：通常はバリエーション（before/after、slow/fast）を切り替える`<SegmentedSwitch>`か、ボタン1つ。設定パネルは作りません。
- **サイズ**：置く列に合わせます（`.fit`の列はスライドの縮尺で約420×300px）。
- **違いを測れるようにする**（パフォーマンスのデモ）：FPS、カウンター、計測時間を表示します。
- **ネットワーク**：APIのエンドポイントは`VITE_*`環境変数から取得します。オフライン用の代替（記録したデータ、スクリーンショット）があると良いですが、必須ではありません。

### 作る

`components/<Name>.vue`として作成します（`components/guide/ExampleDemo.vue`をコピーして始めます。以下のパターンが約80行にまとまっています）。`components/common/`のファイル名と重ねないでください（同じ名前だと片方しか使われません）。ヘルパーは`~/utils/i18n`のように`~/`から読み込むと、フォルダを移動しても壊れません。

- `<script setup lang="ts">`、scopedスタイル、**テーマ変数**（canvasでは`getComputedStyle(el).getPropertyValue('--purple')`で読み取る）。hexやフォント名の直接指定は使いません（等幅には`var(--slidev-code-font-family)`）。
- UIテキストは`t({ ja: '開始', en: 'Start' })`。アイコンはコンポーネント形式（`<lucide-play />`、インポート不要）。
- 共有コンポーネントを再利用します：バリエーションには`SegmentedSwitch`、補足には`Spoiler`、ページには`DemoEmbed`。

### 過去のデッキで見つかった落とし穴

- **スライドは非表示のまま、サイズ0でマウントされます**：ループや計測はスライドの表示中だけ実行し（`@slidev/client`の`useIsSlideActive()`、または`onSlideEnter`/`onSlideLeave`。レイアウトの計測にはさらに`ResizeObserver`）、離れたら停止します。
- **後片付け**は`onUnmounted`で：アニメーションフレーム、タイマー、リスナー、オブザーバー、ソケット。
- **ボタン、リンク、入力欄にフォーカスがある間は、Slidevのキーボード操作が止まります**：クリックの後に発表者の矢印キーやクリッカーが効かなくなるため、すべての`@click`で`~/utils/release-focus`の`releaseFocus($event)`を呼びます（マウスクリックの後だけblurします）。range入力は`change`でblurします。
- **テキスト入力**は、入力中にキーボード操作が止まります（想定どおり）。→を押す前に外側をクリックするよう発表者に伝えるか、`Escape`でblurします。
- **くっきりしたcanvas**：バッキングサイズ = CSSサイズ × `devicePixelRatio` × `$scale`（`useSlideContext()`）とし、`setTransform`でCSSピクセル単位で描きます。`$scale`が変わったら再計算します。
- **時間ベースの動き**：位置は経過時間（`dt`）で積分します。遅いフレームでは動きが遅くなるのではなく先に進むので、「カクつく」と「遅い」を区別できます。
- **高速なマシンでのパフォーマンスデモ**（MシリーズのMacは、重いアニメーション1つなら滑らかに描きます）：悪い方が目に見えて苦しくなるまで処理を増やし（数百の要素）、数値（FPS）を表示し、DevTools（Performanceパネル、paint flashing）でコストを見せます。軽いreflowが1回起きる程度は問題ありません。ポイントは、何がスケールしにくいかです。
- **グローバルなCSSを漏らさない**：`:global(...)`、scopedでない`<style>`、`::view-transition-*`のルール、`document.documentElement`の変更はすべてのスライドに影響します。デモの中に閉じ込め（名前付きグループ、デモの実行中だけ付ける`data-`属性）、アンマウント時に元に戻します。
- **固定の要素idを使わない**：同じスライドが1ページに複数回描かれることがあるため（一覧表示、印刷）、`id` / `for` / `aria-*`の組には`vue`の`useId()`を使います。
- **再訪時はリセットする**（そうしない理由がない限り）：リハーサルの後に途中の状態が残らないようにします。
- **Slidevはスライドを拡大縮小します**（`transform: scale()`）。デモの文字がぼやけることがあるので、重要なら実際のタブで開くか、スライドでそう伝えます。

### スライドに置く

docs/recipes.mdの「コードとライブデモ」または「問題から入るフック」を使います。デモは`.fit`の列に置き、横のコードは12〜15行程度までにし、`.note`か`.foot`で何を試すかを書きます（「ease-outに切り替える」「DevTools → Rendering → Paint flashing」）。

## 第二言語デッキ

任意です。デプロイされるのは`slides.md`だけです。

**作成する**：`slides.md`を`slides.<lang>.md`に、各`pages/0N-<alias>.md`を`pages/0N-<alias>.<lang>.md`にコピーし（ページのファイルを先に、エントリーを最後に）、`src:`行をコピーに向け、`htmlAttrs.lang: <lang>`を設定します。`pnpm dev slides.<lang>.md`で表示し、`pnpm export slides.<lang>.md`でPDFにします。`utils/i18n.ts`は、日本語のデッキには日本語のUIテキストを、それ以外のすべての言語には英語を返します。必要なら拡張してください。

### 同一に保つもの

2つのデッキはスライド単位で対応させます（発表者、`<Link>`、`pnpm preflight`がこれに頼ります）：

- 同じスライドが同じ順序で並び、`routeAlias`、レイアウト、クリックのステップ（`v-click` / `v-clicks`の数、行ハイライトのステップ）が同じ
- 同じコンポーネント、デモ、props（`label`のようなUIテキストのpropsは除く）
- コードは同一（変えるのはコメントとユーザーに見える文字列だけ）
- セクション番号、アクセントカラー、図の構造

調整のためにどうしても構成を変える必要がある場合（ローカルな例に追加のステップが要るなど）は、発表者と合意し、その差分を`CLAUDE.local.md`に記録します。

### 翻訳ではなく、聴衆に合わせて調整する

目指すのは、その聴衆に向けてネイティブの発表者が作ったであろうデッキです。翻訳っぽく読めるスライドは、すべての文が正しくても失敗です。

- **言い回し**：ネイティブが書くように書き直します（文の順序を変える、結合・分割する）。保つのは文の形ではなく、意味とスライドの1つのポイントです。タイトルや決めの一言は自然な表現に言い換えます（"Show, don't tell" →「語るより見せる」）。慣用句、言葉遊び、ポップカルチャーへの言及は、同じ役割を果たす現地の表現に置き換えるか削ります。直訳はしません。
- **例とデータ**：架空の人名、会社名、地名は聴衆に自然なものに。通貨、数値の書式、日付、単位は現実的にローカライズします（`$48,200` → `¥6,820,000`、`Oct 14` → `10月14日`。記号を替えるだけにしない）。デモやコード内のサンプルテキストも、現実的なものにします（日本語のフォームには日本人の名前）。たとえ話は、通じなければ通じるものを探します。
- **参考資料**：`<MdnLink>`はロケールが自動で切り替わります。ローカライズ版のページが存在し（古いパスは翻訳がないと`/ja/`で404）、大きく古くなっていないことを確認し、そうでなければ`href`でen-USのページを渡します。その他は、ローカライズ版がありメンテナンスされていれば使います（web.dev / Chrome docsの`?hl=ja`、`ja.javascript.info`）。リンクのラベルは翻訳先の言語にします。締めのスライドでは、質の良い現地の資料を優先します。
- **用語**：辞書ではなく、その言語の開発者コミュニティで実際に使われる表記に従います（API、プロパティ、製品名はそのまま）。迷ったら、その言語のMDNや公式ドキュメントを確認します。デッキ全体で一貫させるため、`CLAUDE.local.md`の用語表を維持します。
- **発表者ノートと`<Spoiler>`**も調整の対象です。
- 翻訳元のスライド自体に問題（不明瞭、誤り、長すぎる）を見つけたら、片方だけで直さず、両方のデッキを直します。

### 日本語のテキスト

メインデッキを含む、すべての日本語のテキストに適用します：

- 自然なです/ます調で、硬くなりすぎないようにします。英語の修辞パターンを直訳しません（"Let's dive in!"、"Here's the thing:"）。落ち着いた正確な表現を優先し、聴衆への問いかけは「〜でしょうか」が合います。
- 箇条書きは`**強調**：説明`の形にします。
- **em-dash（U+2014）は使いません**。リンクのラベルも含みます。「、」「。」「：」を使い、日本語の文中では全角の（）、：、？を使います。
- **日本語と英字やインラインコードの間に半角スペースを入れません**（`DOMツリー`、`Pagesを有効化`、`<code>/kickoff</code>から`）。` / `区切りの前後と、コード内のスペースはそのままにします。
- API、プロトコル、ヘッダーの名前は英語のままにし（`EventSource`、`offsetHeight`）、一般的な技術名詞はカタカナにします（サーバー、ブラウザ、リクエスト）。製品名やAPI名の見出しは英語のままにします。
- コードのコメントは翻訳し、コードと識別子は翻訳しません。
- 日本語は1行あたりの情報量が多い一方、1文字の幅が広くなります。英語で一杯だったスライドは確認し直します。

### 英語のテキスト

平易で直接的な短い文と能動態。タイトルはsentence case。全角の句読点を残さず、ASCIIの句読点だけを使います。日本語で暗黙にしていたことを説明しすぎず、文に必要な主語や目的語は補います。

### その他の言語

その言語の開発者コミュニティの用語と文体の慣習に従います。UI文字列が必要なら`utils/i18n.ts`を拡張します。

## デプロイ

`master` / `main`へのpushごとに`slides.md`がビルドされ、GitHub Pagesにデプロイされます（`.github/workflows/deploy.yml`。Actionsタブ → Run workflowで手動で再デプロイできます）。ワークフローは`pnpm preflight`も実行して警告を表示しますが、デプロイはブロックしません。それでも、pushする前に`pnpm check`を実行してください。

- **Pagesが有効になる前**も、ワークフローはビルドを行います（ビルドエラーがわかるように）が、デプロイはスキップし、その旨を実行結果に表示します。`pnpm pages`で一度設定すれば解決します。
- **base path**：CIではGitHub Pages自体から取得するので、カスタムドメインや`<owner>.github.io`リポジトリでも動作します。ローカルではgit remoteから決定します。

## テンプレートを改善する

テンプレート自体（スタイル、コンポーネント、設定、ドキュメント）に誤りや不足を見つけましたか？自分のデッキで修正したうえで、[sun-choma/febi-template](https://github.com/sun-choma/febi-template/issues)にissueを作成してください。次のデッキがより良い状態から始められます。後方互換性はありません：各デッキはテンプレートのスナップショットです。
