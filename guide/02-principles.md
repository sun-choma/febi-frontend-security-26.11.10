---
layout: section
routeAlias: principles
style: "--accent: var(--green)"
---

<div class="section-num">02</div>

# 原則

<div class="section-sub">良いFEBiトークとは。詳しくはPRINCIPLES.mdへ</div>

---
routeAlias: show
---

# 語るより見せる

<div class="sub">文章で説明する代わりに、デモか図で見せます</div>

<div class="cols">
<div class="card">
<div class="col-h ng"><lucide-x class="inline" /> 語る</div>
<div class="text-xs leading-relaxed opacity-80">
ブラウザはHTMLを受け取るとパースしてDOMツリーを作り、同時にCSSからCSSOMを作ります。この2つを組み合わせてレンダーツリーを作り、各要素のサイズと位置を計算するレイアウトを行い、ピクセルを塗るペイントを経て、最後にレイヤーを合成して画面に表示します。
</div>
</div>
<div class="card lit">
<div class="col-h ok"><lucide-check class="inline" /> 見せる</div>
<div class="flow mt-6">
  <div class="step">DOM</div><lucide-arrow-right class="arrow" />
  <div class="step">Layout</div><lucide-arrow-right class="arrow" />
  <div class="step">Paint</div><lucide-arrow-right class="arrow" />
  <div class="step">Composite</div>
</div>
</div>
</div>

<div class="cols mt-6">
<div><b>振る舞い → デモ</b><div class="note">アニメーション、リサイズ、イベント、パフォーマンス</div></div>
<div><b>構造 → 図</b><div class="note">ツリー、フロー、パイプライン、レイヤー</div></div>
</div>

<div class="punch">画像1枚や一行で伝わるなら、デモは作りません</div>

---

# 3つの柱

<div class="cols mt-8">
<div class="card">
<div class="text-3xl">👀</div>

### 語るより見せる

<div class="note">振る舞いはデモで、構造は図で。デモには存在する理由が必要です</div>
</div>
<div class="card">
<div class="text-3xl">📦</div>

### 単体で伝わる

<div class="note">デッキは公開され、後から読まれます。大事な情報は全てスライドの上に。発表者ノートは補足だけ</div>
</div>
<div class="card">
<div class="text-3xl">✂️</div>

### 簡潔に、でも漏れなく

<div class="note">削るのは言葉で、情報ではありません。目安は1スライド5項目、各1行</div>
</div>
</div>

<div class="foot"><lucide-users /> 対象：ジュニアからシニアまで。核となる内容はジュニアでも理解できるように。発展的な内容も歓迎です</div>

---

# トークの構成

<div class="sub">時間は最大50分（60分の枠からQ&Aの10分を除く）</div>

<div class="flow mt-10">
  <div class="step">表紙<small>絵文字 + タイトル</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step">アジェンダ<small>番号付きセクション</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step lit">セクション × N<small>区切りスライドから</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step">振り返り<small>要点へのリンク</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step">まとめ<small>チートシート、要点</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step">締め<small>おすすめの資料</small></div>
</div>

<div class="notes">

- **問題から始める**：テーマが合えば、課題 → 素朴な解決 → より良い道具 の順に。合わなければ無理に当てはめません
- **振り返りとまとめ**：短いトークでは1枚にまとめても構いません
- **締めの資料**：参考文献の一覧ではなく、さらに学びたい人向けの数件だけ

</div>

---

# スライドのルール

<div class="cols mt-4">
<div class="card">

**<lucide-code class="inline" /> コード**

<div class="note">1ブロック12〜15行まで。不要な部分は<code>// ...</code>で省略し、行ハイライトで順に説明します</div>
</div>
<div class="card">

**<lucide-mouse-pointer-click class="inline" /> クリック**

<div class="note">順序が大事なとき、内容が多いとき、結論を先に見せたくないときだけ使います</div>
</div>
</div>

<div class="cols mt-4">
<div class="card">

**<lucide-link class="inline" /> 出典**

<div class="note">主張しているその場所に書きます。数値、引用、対応状況には必ず出典を。対応状況には日付も</div>
</div>
<div class="card">

**<lucide-globe class="inline" /> 公開が前提**

<div class="note">クライアント名、社内URL、社内ツールの画面、認証情報は載せません。例は架空のものを</div>
</div>
</div>

<div class="foot"><lucide-info /> どれも目安です。内容が必要とするなら、理由を分かった上で破って構いません</div>
