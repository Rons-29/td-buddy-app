# 🛡️ QualityBuddy (QB)

**QA エンジニアの万能パートナー - テストデータ生成から品質保証のフルサイクルまで**

<div align="center">

```
    /\_/\
   ( ^.^ )
    > ◇ <  QB
  ┌─────────┐
  │ 品質保証 │
  │ 支援中… │
  └─────────┘
```

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue)](https://www.typescriptlang.org/)
[![AI Powered](https://img.shields.io/badge/AI-Claude%20Powered-purple)](https://www.anthropic.com/claude)

</div>

## 🎯 QualityBuddy とは？

**QualityBuddy（愛称：QB）** は、QA エンジニアの品質保証業務全般をサポートする AI 連携型統合プラットフォームです。QB くんが、テストデータ生成から品質管理まで、あらゆる品質業務をお手伝いします！

### 🚀 ビジョン

**「QA エンジニアの万能パートナー - テストデータ生成から品質保証のフルサイクルまで」**

### 🤝 QB の性格

- **忠実**: QA エンジニアの最高の相棒として、常に側に寄り添います
- **頼りになる**: どんなテストデータでも、品質課題でもお任せください
- **少しお茶目**: たまに意外なデータや提案をして驚かせるかも？
- **安全第一**: セキュリティと品質を最優先に考える慎重派

### ✨ QB の現在の能力

| 機能                  | 説明                                          | QB からのメッセージ                                         |
| --------------------- | --------------------------------------------- | ----------------------------------------------------------- |
| 🔐 **パスワード生成** | 強力で安全なパスワードを瞬時に生成            | _「セキュアなパスワード、できました〜！」_                  |
| 👤 **個人情報生成**   | 日本語対応の擬似個人情報を大量生成            | _「山田太郎さんから始まる 1000 人分、準備完了です！」_      |
| 📄 **ファイル生成**   | CSV、JSON、XML など様々な形式のテストファイル | _「100 万行の CSV ファイル、メモリ効率よく作りました ♪」_   |
| 🎨 **テキスト生成**   | ひらがな、漢字、旧字体など多様な文字種に対応  | _「旧字体の『學校』もお手の物です！」_                      |
| 🤖 **AI 連携**        | 自然言語でデータ生成を指示                    | _「『記号入りパスワード 5 個』って言うだけで、はい完成！」_ |
| 🔧 **Cursor 統合**    | IDE 内からシームレスなデータ生成              | _「開発中に必要なデータ、すぐにご用意します！」_            |

### 🌟 QB の今後の進化予定

| Phase        | 機能領域                | 主要機能                                                        | 提供開始予定 |
| ------------ | ----------------------- | --------------------------------------------------------------- | ------------ |
| **Phase 2A** | 🎯 **コア QA 機能**     | テストケース生成・バグ分析・品質メトリクス基盤                  | 3-4 ヶ月後   |
| **Phase 2B** | 🔄 **自動化支援**       | API テスト支援・テスト自動化・品質ダッシュボード                | 4-6 ヶ月後   |
| **Phase 3**  | 🚀 **高度品質機能**     | セキュリティテスト・パフォーマンステスト・AI 品質コンサルタント | 6-12 ヶ月後  |
| **Phase 4**  | 🏢 **エンタープライズ** | チーム機能・ワークフロー統合・高度レポート分析                  | 12-18 ヶ月後 |

**QB からのメッセージ**: _「現在のテストデータ生成は私の基本能力です。でも私の真の目標は、QA エンジニアの皆さんの品質保証業務全体をサポートすることなんです！一緒に、もっと効率的で楽しい品質管理を実現していきましょう ♪」_

## 🚀 クイックスタート

### 前提条件

- Node.js 18.0.0 以上
- pnpm 8.0.0 以上
- Claude API キー（AI 機能を使用する場合）

### セットアップ

```bash
# 1. プロジェクトクローン
git clone https://github.com/your-org/qualitybuddy-app.git
cd qualitybuddy-app

# 2. 依存関係インストール
pnpm install

# 3. 環境設定
cp .env.example .env
# .envファイルを編集してClaude APIキーを設定

# 4. データベース初期化
pnpm run db:migrate

# 5. 開発サーバー起動
cd td-buddy-webapp
npm run dev
```

### 初回起動

```bash
# http://localhost:3000 にアクセス
# QBくんがお出迎えしてくれます！
```

## 📖 使い方

### 基本的な使い方

1. **Web UI で直接操作**

   ```
   ブラウザで http://localhost:3000 を開く
   → 好きな機能を選択
   → パラメータを設定
   → 「生成」ボタンをクリック
   → QBくんがデータを作成！
   ```

2. **自然言語で AI 指示**

   ```
   「英数字12文字のパスワードを5個作って」
   「日本の住所を含む個人情報を100件生成して」
   「1万行のテスト用CSVファイルを作成して」
   ```

3. **Cursor IDE から直接利用**
   ```typescript
   // コメントで指示するだけ
   // QB: パスワード生成 16文字 記号含む
   const password = "aB3$dEf7&HiJ9@Kl";
   ```

### API 利用例

```typescript
// パスワード生成
const response = await fetch("/api/generate/password", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    length: 12,
    includeSymbols: true,
    count: 5,
  }),
});

// 個人情報生成
const personalData = await fetch("/api/generate/personal-info", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    count: 100,
    fields: ["fullName", "email", "address"],
    locale: "ja",
  }),
});
```

## 🏗️ アーキテクチャ

### 現在のアーキテクチャ（Phase 1: データ生成基盤）

```mermaid
graph TB
    QA[👨‍💻 QAエンジニア] --> |自然言語で指示| Cursor[📝 Cursor IDE]
    QA --> |GUI操作| WebUI[🎨 Web UI]

    Cursor --> |MCP Protocol| MCP[🤖 MCP Server]
    WebUI --> |REST API| API[⚡ API Gateway]

    MCP --> |AI解析| Claude[🧠 Claude AI]
    Claude --> |構造化指示| MCP

    MCP --> Core[🎯 Data Generation Core]
    API --> Core

    Core --> |生成| Files[📁 Files]
    Core --> |履歴| DB[(🗄️ SQLite)]

    subgraph "QBの頭脳 (NestJS Backend)"
        MCP
        API
        Core
    end

    subgraph "QBの顔 (Next.js Frontend)"
        WebUI
    end
```

### 目標アーキテクチャ（Phase 2-4: 品質保証統合プラットフォーム）

```mermaid
graph TB
    QA[👨‍💻 QAエンジニア] --> Dashboard[📊 品質ダッシュボード]
    QA --> TestGen[🧪 テスト生成]
    QA --> BugAnalysis[🐛 バグ分析]
    QA --> DataGen[📄 データ生成]

    Dashboard --> QualityAPI[🎯 品質API]
    TestGen --> TestAPI[🧪 テストAPI]
    BugAnalysis --> AnalysisAPI[🔍 分析API]
    DataGen --> DataAPI[📄 データAPI]

    QualityAPI --> AIEngine[🤖 AI分析エンジン]
    TestAPI --> AIEngine
    AnalysisAPI --> AIEngine
    DataAPI --> AIEngine

    AIEngine --> Claude[🧠 Claude AI]
    AIEngine --> QualityDB[(🗄️ 品質データベース)]

    subgraph "QBの進化した頭脳"
        QualityAPI
        TestAPI
        AnalysisAPI
        DataAPI
        AIEngine
    end
```

## 📁 プロジェクト構成

```
qualitybuddy-app/
├── td-buddy-webapp/         # 🎨 メインWebアプリケーション（移行中）
│   ├── frontend/            # Next.js フロントエンド
│   └── backend/             # NestJS バックエンド
├── docs/                    # 📚 ドキュメント
├── data/                    # 💾 生成データ・DB
├── src/                     # 🧠 コアロジック・スクリプト
└── tests/                   # 🧪 テストファイル
```

## 🔧 開発ガイド

### 開発の始め方

```bash
# 開発環境の確認
cd td-buddy-webapp && npm run diagnose

# テスト実行
cd td-buddy-webapp && npm run test

# コード品質チェック
cd td-buddy-webapp && npm run lint

# QBくんと一緒に開発開始！
cd td-buddy-webapp && npm run dev
```

### 主要コマンド

| コマンド                              | 説明                 | QB のコメント                        |
| ------------------------------------- | -------------------- | ------------------------------------ |
| `cd td-buddy-webapp && npm run dev`   | 開発サーバー起動     | _「開発環境、準備完了です！」_       |
| `cd td-buddy-webapp && npm run build` | プロダクションビルド | _「最適化して本番用にビルドします」_ |
| `cd td-buddy-webapp && npm run test`  | テスト実行           | _「品質チェック、お任せください」_   |
| `npm run db:migrate`                  | データベース初期化   | _「データベースの準備をします」_     |
| `cd td-buddy-webapp && npm run lint`  | コード品質チェック   | _「コードの健康状態をチェック中…」_  |

## 📊 パフォーマンス

QB くんの処理速度：

- **パスワード生成**: < 100ms ⚡
- **個人情報生成**: < 2 秒（1,000 件）💨
- **ファイル生成**: < 30 秒（100MB）🚀
- **AI 処理**: < 3 秒 🧠

## 🛡️ セキュリティ

QB くんは安全第一：

- ✅ 生成データは 24 時間で自動削除
- ✅ API キーは暗号化保存
- ✅ 入力値の厳格なバリデーション
- ✅ レート制限で DDoS 攻撃を防御
- ✅ ローカル環境での完全動作

## 📚 ドキュメント

| ドキュメント                                                                  | 対象者             | QB からの一言                          |
| ----------------------------------------------------------------------------- | ------------------ | -------------------------------------- |
| [🚀 QualityBuddy 拡張計画](docs/quality-buddy-expansion-overview-restored.md) | プロジェクト管理者 | _「将来のビジョンをご確認ください！」_ |
| [🔧 技術仕様書](docs/技術仕様書.md)                                           | 開発者             | _「技術的な詳細はこちら」_             |
| [🏗️ プロジェクト構成](docs/プロジェクト構成.md)                               | 開発者             | _「迷子にならないように」_             |
| [🛡️ セキュリティガイドライン](docs/セキュリティガイドライン.md)               | 全員               | _「安全が最優先です」_                 |
| [⚡ パフォーマンス最適化](docs/パフォーマンス最適化ガイド.md)                 | 開発者             | _「速さも重要ですね」_                 |
| [🚨 トラブルシューティング](docs/トラブルシューティングガイド.md)             | 全員               | _「困ったときはこちら」_               |

## 🗺️ ロードマップ

### 🎯 品質保証統合プラットフォームへの進化

**Phase 1: 基盤強化**（✅ 完了済み）

- テストデータ生成機能
- 基本的な AI 連携
- WebUI 基盤

**Phase 2A: コア QA 機能**（🎯 3-4 ヶ月）

- テストケース生成・管理
- バグ分析・分類支援
- 品質メトリクス基盤

**Phase 2B: 自動化支援**（🔄 4-6 ヶ月）

- API テスト支援
- テスト自動化ツール連携
- リアルタイム品質ダッシュボード

**Phase 3: 高度品質機能**（🚀 6-12 ヶ月）

- セキュリティテスト支援
- パフォーマンステスト分析
- AI 品質コンサルタント機能

**Phase 4: エンタープライズ対応**（🏢 12-18 ヶ月）

- チーム・組織機能
- ワークフロー統合
- 高度レポート・分析機能

## 🤝 コントリビューション

QB くんと一緒にプロジェクトを改善しませんか？

1. このリポジトリをフォーク
2. 機能ブランチを作成: `git checkout -b feature/amazing-feature`
3. 変更をコミット: `git commit -m 'feat: Add amazing feature'`
4. ブランチをプッシュ: `git push origin feature/amazing-feature`
5. Pull Request を作成

### 開発ルール

- 🧪 新機能には必ずテストを追加
- 📝 コードにはコメントを適切に記載
- 🎨 TypeScript の型安全性を重視
- 🐛 バグ修正には再現手順を明記

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルをご覧ください。

## 👥 クレジット

### チームメンバー

- **QB（キューピー）** - メインキャラクター & 品質アドバイザー
- **開発チーム** - QB の能力を実装する技術者たち

### 使用技術

- **Frontend**: Next.js + TypeScript + TailwindCSS
- **Backend**: NestJS + TypeScript + SQLite
- **AI**: Claude API (Anthropic)
- **Development**: npm + ESLint + Prettier + Jest

---

<div align="center">

**🛡️ 「品質のことなら、QB にお任せください！」**

_QualityBuddy は QA エンジニアの品質保証業務全体を支援します_

[📖 ドキュメント](docs/) | [🐛 Issue 報告](https://github.com/your-org/qualitybuddy-app/issues) | [💬 ディスカッション](https://github.com/your-org/qualitybuddy-app/discussions)

</div>
