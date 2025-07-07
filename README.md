# GitHub PRs Dashboard

このリポジトリは、GitHubのプルリクエスト（PR）を効率的に管理・レビューするためのダッシュボードアプリケーションです。

## 特徴
- GitHub APIと連携し、指定リポジトリのPR一覧を取得
- PRのレビュー状況や詳細を可視化
- レスポンシブなUI（React + Vite）

## セットアップ

1. リポジトリをクローン
   ```sh
   git clone <このリポジトリのURL>
   cd github-prs
   ```
2. 依存パッケージのインストール
   ```sh
   npm install
   ```
3. 開発サーバーの起動
   ```sh
   npm run dev
   ```
   ブラウザで `http://localhost:5173/github-prs/` を開いて動作を確認してください。

## ディレクトリ構成

```
src/
  api/         # API通信関連
  assets/      # 画像・アイコン等
  hooks/       # カスタムフック
  App.tsx      # メインコンポーネント
  main.tsx     # エントリーポイント
public/        # 公開用静的ファイル
```

## 必要な環境変数
GitHub APIを利用するため、`.env` ファイルに以下を設定してください。

```
VITE_GITHUB_TOKEN=your_github_token
```

## ライセンス
MIT
