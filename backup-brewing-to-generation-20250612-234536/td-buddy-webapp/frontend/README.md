# QA Workbench Frontend

QA Workbench のフロントエンド（Next.js + TailwindCSS + TypeScript）

## 🚀 セットアップ

### 依存関係のインストール
```bash
cd td-buddy-webapp/frontend
pnpm install
```

### 開発サーバー起動
```bash
pnpm run dev
```

ブラウザで http://localhost:3000 にアクセス

## 🏗️ 技術スタック

- **Next.js 14** - React フレームワーク（App Router）
- **TypeScript** - 型安全性
- **TailwindCSS** - スタイリング
- **Framer Motion** - アニメーション
- **Lucide React** - アイコン

## 📁 ディレクトリ構成

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # メインページ
│   └── globals.css        # グローバルスタイル
├── components/            # Reactコンポーネント
│   ├── TDCharacter.tsx    # TDキャラクター
│   ├── PasswordGen.tsx    # パスワード生成
│   └── PersonalInfo.tsx   # 個人情報生成
├── types/                 # TypeScript型定義
├── utils/                 # ユーティリティ
└── public/                # 静的ファイル
```

## 🎨 TDデザインシステム

### カラーパレット
- **td-primary**: ブルー系（メイン）
- **td-secondary**: イエロー系（アクセント）
- **td-accent**: グリーン系（成功・完了）

### カスタムクラス
- `.td-button` - ボタンスタイル
- `.td-card` - カードスタイル
- `.td-input` - 入力フィールド
- `.td-heartbeat` - TDキャラクターアニメーション

## 🤖 TDキャラクター

TDくんの表情・感情をアニメーションで表現
- `td-heartbeat` - 心臓の鼓動アニメーション
- `td-wiggle` - ゆらゆらアニメーション

## 🔧 開発コマンド

```bash
# 開発サーバー起動
pnpm run dev

# プロダクションビルド
pnpm run build

# プロダクション起動
pnpm run start

# Linting
pnpm run lint

# 型チェック
pnpm run type-check
``` 