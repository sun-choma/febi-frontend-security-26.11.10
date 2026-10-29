# 🧩 FEBi Template

FEBi（Frontend Biweekly）のトークを[Slidev](https://sli.dev)で作るためのテンプレートです。手作業でも、Claude Codeと一緒でも使えます。ガイド：[sun-choma.github.io/febi-template](https://sun-choma.github.io/febi-template/) ・ [English below](#english)

## 流れ

1. GitHubで **Use this template**。自分のアカウントに**Public**で作成（リポジトリ名：`febi-<テーマ>-<発表日YY.MM.DD>`。作成日ではなく発表日）
2. クローンして`pnpm install`（Node 24。pnpmがなければ`corepack enable`）
3. `pnpm guide`でガイドを見る（レシピと部品の使い方）
4. `pnpm pages`でGitHub Pagesを有効化（一度だけ。[GitHub CLI](https://cli.github.com)が必要。なければSettings → Pages → Source：GitHub Actions）
5. [docs/talk-plan.md](docs/talk-plan.md)で構成を決め、`pnpm dev`を開いたまま`slides.md`と`pages/`の`TODO`を埋める（Claude Codeなら`/kickoff`）
6. `pnpm check`が通ったらpush → 自動でデプロイ

デッキは公開されます。社外秘の情報は載せないでください。

## コマンド

| コマンド | 内容 |
|---|---|
| `pnpm dev` | デッキを<http://localhost:3030>で表示 |
| `pnpm guide` | テンプレートのガイド |
| `pnpm check` | ビルドとチェック（push前に） |
| `pnpm pages` | GitHub Pagesを有効化（一度だけ） |
| `pnpm export` | PDFを出力 |

詳しくは[HANDBOOK.md](HANDBOOK.md)、良いトークの条件は[PRINCIPLES.md](PRINCIPLES.md)へ。

---

## English

A template for FEBi (Frontend Biweekly) talks built with [Slidev](https://sli.dev), by hand or with Claude Code. Guide: [sun-choma.github.io/febi-template](https://sun-choma.github.io/febi-template/)

### Flow

1. On GitHub, **Use this template**, under your own account, **Public** (repo name: `febi-<topic>-<talk date YY.MM.DD>`, the day you present, not the day you create it)
2. Clone it and run `pnpm install` (Node 24; no pnpm? `corepack enable`)
3. Run `pnpm guide:en` to see the guide in English (recipes and components)
4. Run `pnpm pages` once to enable GitHub Pages (needs the [GitHub CLI](https://cli.github.com); without it: Settings → Pages → Source: GitHub Actions)
5. Plan the talk with [docs/talk-plan.md](docs/talk-plan.md), then with `pnpm dev` open, replace the `TODO`s in `slides.md` and `pages/` (or `/kickoff` in Claude Code)
6. Once `pnpm check` passes, push: it deploys automatically

Decks are public: nothing confidential.

### Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Shows the deck at http://localhost:3030 |
| `pnpm guide:en` | The template guide in English (`pnpm guide` in Japanese) |
| `pnpm check` | Build and checks (before pushing) |
| `pnpm pages` | Enables GitHub Pages (once) |
| `pnpm export` | Exports a PDF |

The docs ([HANDBOOK.md](HANDBOOK.md), [PRINCIPLES.md](PRINCIPLES.md), `docs/`) are in Japanese; the guide is available in English.
