# 🛠️ Quality Workbench + Brew

QA エンジニアの専用作業台 - データ生成から品質管理まで、助手のブリューがサポート

## 🎯 プロジェクト概要

Quality Workbench + Brew は、QA エンジニアのための**作業効率特化型プラットフォーム**です。まるで熟練職人の作業台のように、必要な工具が整理整頓され、最適な環境でテストデータの生成、品質管理、自動化ツールを提供します。

### 🛠️ ワークベンチコンセプト

- **🪵 Wood & Metal Design**: 温かみのある木材と信頼性の高い金属を組み合わせたデザイン
- **⚙️ Tool-Centric UX**: 各機能を専用工具として配置し、直感的な操作を実現
- **🔧 Craft Quality**: 職人品質の精密さと使いやすさを両立
- **📐 Precision First**: 測定・検証・改善のサイクルを重視

### 🍺 Brew について

Brew は、Quality Workbench の頼れる助手です。データ生成から品質チェックまで、あらゆる場面で QA エンジニアをサポートします。

## 🎨 デザインシステム

Quality Workbench は独自のワークベンチ特化デザインシステムを採用しています：

### **🪵 木材カラーパレット（メイン）**

- **Light Wood** `#d7ccc8` - 明るい木材色
- **Main Wood** `#8d6e63` - メイン木材色
- **Dark Wood** `#5d4037` - 濃い木材色
- **Accent Wood** `#6d4c41` - アクセント木材色

### **⚙️ 金属カラーパレット（セカンダリ）**

- **Light Metal** `#cfd8dc` - 明るい金属色
- **Main Metal** `#607d8b` - メイン金属色
- **Dark Metal** `#455a64` - 濃い金属色
- **Accent Metal** `#546e7a` - アクセント金属色

### **🔨 ツールカラーパレット（機能別）**

- **Measure** `#ff9800` - 測定ツール（オレンジ）
- **Cut** `#f44336` - 切断ツール（レッド）
- **Join** `#4caf50` - 接合ツール（グリーン）
- **Inspect** `#2196f3` - 検査ツール（ブルー）
- **Polish** `#9c27b0` - 仕上げツール（パープル）

### **📊 ステータスカラー**

- **Success** `#4caf50` - 作業完了
- **Warning** `#ff9800` - 注意・調整中
- **Error** `#f44336` - エラー・修正必要
- **Info** `#2196f3` - 情報・ガイド

詳細なデザインガイドラインは `td-buddy-webapp/frontend/styles/` を参照してください。

## 🏗️ アーキテクチャ

```
Quality Workbench + Brew
├── 🎨 フロントエンド (Next.js + TypeScript + Workbench Design System)
├── 🔧 バックエンド (Express + TypeScript + SQLite)
├── 🔌 リアルタイム通信 (WebSocket)
└── 🍺 Brew Assistant (AI連携)
```

## 🚀 クイックスタート

### 前提条件

- Node.js 18.0.0 以上
- npm 8.0.0 以上

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd qa-workbench

# 全依存関係をインストール
npm run install:all
```

### 開発サーバー起動

```bash
# 🍺 方法1: npmスクリプトで起動（推奨）
npm run dev

# 🍺 方法2: シェルスクリプトで起動
./start-dev.sh

# 🍺 方法3: 個別起動
npm run dev:backend-only   # バックエンドのみ
npm run dev:frontend-only  # フロントエンドのみ
```

### アクセス

- 📱 **フロントエンド**: http://localhost:3000
- 🔧 **バックエンド**: http://localhost:3001
- 📊 **ヘルスチェック**: http://localhost:3001/health

### 開発サーバー停止

```bash
# 🍺 方法1: Ctrl+C (start-dev.sh使用時)
# 🍺 方法2: 停止スクリプト
./stop-dev.sh
```

## 📋 利用可能なスクリプト

### 🔧 開発用

```bash
npm run dev                 # フロントエンド + バックエンド同時起動
npm run dev:backend         # バックエンドのみ起動
npm run dev:frontend        # フロントエンドのみ起動
npm run dev:backend-only    # バックエンドのみ起動（エイリアス）
npm run dev:frontend-only   # フロントエンドのみ起動（エイリアス）
```

### 🏗️ ビルド用

```bash
npm run build               # フロントエンド + バックエンドビルド
npm run build:backend       # バックエンドビルド
npm run build:frontend      # フロントエンドビルド
```

### 🚀 本番用

```bash
npm run start               # フロントエンド + バックエンド本番起動
npm run start:backend       # バックエンド本番起動
npm run start:frontend      # フロントエンド本番起動
```

### 🧪 テスト・品質管理

```bash
npm run test                # 全テスト実行
npm run test:backend        # バックエンドテスト
npm run test:frontend       # フロントエンドテスト
npm run lint                # 全コード品質チェック
npm run lint:backend        # バックエンドlint
npm run lint:frontend       # フロントエンドlint
npm run type-check          # 全TypeScript型チェック
npm run type-check:backend  # バックエンド型チェック
npm run type-check:frontend # フロントエンド型チェック
```

### 🗄️ データベース管理

```bash
npm run db:setup            # データベース初期セットアップ
npm run db:init             # データベース初期化
npm run db:reset            # データベースリセット
```

## 🛠️ 開発環境設定

### 環境変数

バックエンドの環境変数を設定してください：

```bash
# td-buddy-webapp/backend/.env
PORT=3001
NODE_ENV=development
DATABASE_URL=file:./data/td-buddy.db
CLAUDE_API_KEY=your_claude_api_key_here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
FRONTEND_URL=http://localhost:3000
```

### データベース

SQLite データベースが自動的に初期化されます：

```bash
# 手動でデータベースを初期化する場合
npm run db:setup
```

## 🍺 主要機能

### データ生成機能

- 🔐 **パスワード生成**: 強度別、文字種別設定可能
- 👤 **個人情報生成**: 日本語対応、GDPR 準拠の仮データ
- 📄 **ファイル生成**: CSV, JSON, XML, SQL 等
- 🔤 **テキスト生成**: 多言語・文字種対応
- 🔢 **数値・真偽値生成**: 統計的分布を考慮
- 🆔 **UUID 生成**: v1, v4, v6, v7 対応
- 📅 **日時生成**: 様々な形式とタイムゾーン対応

### 品質管理機能

- 🧪 **テストデータ検証**: 生成データの品質チェック
- 📊 **パフォーマンス監視**: 生成速度とリソース使用量
- 🔍 **データ分析**: 統計情報とメトリクス
- 📈 **レポート生成**: 品質レポートの自動生成

### AI 連携機能

- 🤖 **Brew Assistant**: 自然言語でのデータ生成指示
- 💬 **チャット機能**: リアルタイムでのサポート
- 🎯 **最適化提案**: データ生成の改善提案
- 📚 **学習機能**: 使用パターンの学習と最適化

## 🔧 技術スタック

### フロントエンド

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Lucide React, Framer Motion
- **State Management**: React Hooks
- **Real-time**: Socket.IO Client

### バックエンド

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite (better-sqlite3)
- **Real-time**: Socket.IO
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Zod

### 開発ツール

- **Build Tool**: TypeScript Compiler
- **Linting**: ESLint
- **Testing**: Jest
- **Process Manager**: Nodemon
- **Package Manager**: npm

## 📁 プロジェクト構造

```
qa-workbench/
├── 📱 td-buddy-webapp/
│   ├── 🎨 frontend/          # Next.js フロントエンド
│   │   ├── app/              # App Router
│   │   ├── components/       # Reactコンポーネント
│   │   ├── hooks/            # カスタムフック
│   │   ├── lib/              # ユーティリティ
│   │   └── types/            # 型定義
│   └── 🔧 backend/           # Express バックエンド
│       ├── src/
│       │   ├── routes/       # APIルート
│       │   ├── services/     # ビジネスロジック
│       │   ├── database/     # データベース設定
│       │   ├── middleware/   # ミドルウェア
│       │   └── types/        # 型定義
│       └── data/             # SQLiteデータベース
├── 📜 scripts/               # 開発用スクリプト
├── 📚 docs/                  # ドキュメント
└── 🔧 設定ファイル
```

## 🤝 開発ガイドライン

### コーディング規約

- **言語**: TypeScript 必須、JavaScript は使用禁止
- **型安全性**: strict モードで開発、any は原則禁止
- **関数**: async/await を推奨、Promise チェーンは避ける
- **エラーハンドリング**: 必ず try-catch または Result 型を使用

### Git ワークフロー

```bash
# 新機能開発
git checkout -b feature/brew-new-feature
git commit -m "feat: 新機能を追加"
git push origin feature/brew-new-feature
```

### コミットメッセージ規約

```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: コードフォーマット修正
refactor: リファクタリング
test: テスト追加・修正
chore: ビルド処理・補助ツール修正
```

## 🛡️ セキュリティ

- **API キー管理**: 環境変数で管理、Git に含めない
- **レート制限**: API 使用量制限で DDoS 対策
- **入力検証**: 全入力値の厳格なバリデーション
- **データ暗号化**: 機密データの暗号化保存
- **自動削除**: 生成データの 24 時間自動削除

## 📊 パフォーマンス目標

- **パスワード生成**: < 100ms
- **個人情報生成**: < 2 秒（1,000 件）
- **ファイル生成**: < 30 秒（100MB）
- **AI 処理**: < 3 秒

## 🚨 トラブルシューティング

### よくある問題

1. **ポートが使用中**

   ```bash
   ./stop-dev.sh  # 全プロセス停止
   npm run dev    # 再起動
   ```

2. **データベースエラー**

   ```bash
   npm run db:reset  # データベースリセット
   ```

3. **依存関係エラー**
   ```bash
   npm run install:all  # 全依存関係再インストール
   ```

### ログ確認

```bash
# バックエンドログ
cd td-buddy-webapp/backend && npm run dev

# フロントエンドログ
cd td-buddy-webapp/frontend && npm run dev
```

## 📞 サポート

🍺 **Brew からのメッセージ**: 「困ったときは、いつでも Brew にお任せください！一緒に素晴らしい QA 環境を作りましょう！」

- **技術的な質問**: GitHub Issues
- **機能提案**: GitHub Discussions
- **緊急時**: プロジェクト管理者まで連絡

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。

---

🍺 **Brew**: 「今日も一緒に素晴らしい QA 作業を進めましょう！何かお手伝いできることがあれば、いつでもお声がけください ♪」
