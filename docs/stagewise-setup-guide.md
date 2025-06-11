# 🎯 TD Buddy × Stagewise セットアップガイド

## 🚀 Stagewise Eyesight とは

**Stagewise Eyesight** = ブラウザUIとCursorを直接接続する革新的ツール

### 🎯 核心機能
- 🖱️ **ポイント&クリック**: ブラウザ上の任意の要素を選択
- 💬 **視覚的コメント**: 選択した要素に直接コメント
- 🧠 **AIコンテキスト**: DOM要素・スクリーンショット・メタデータをAIに送信
- ⚡ **リアルタイム編集**: Cursorで即座にコード変更

## 🛠️ TD Buddyプロジェクトでの導入手順

### Step 1: VS Code拡張機能のインストール

```bash
# VS Code Marketplaceから直接インストール
# https://marketplace.visualstudio.com/items?itemName=stagewise.stagewise-vscode-extension
```

**または**

1. Cursorを開く
2. 拡張機能タブ (`Cmd+Shift+X`)
3. "stagewise" で検索
4. **Install** クリック

### Step 2: TD Buddyフロントエンドに統合

#### 🪄 自動セットアップ（推奨）

1. Cursorでプロジェクトを開く
2. `Cmd+Shift+P` → コマンドパレット
3. `setupToolbar` と入力して実行
4. ✅ 自動でツールバーが初期化される

#### 🔧 手動セットアップ（詳細制御が必要な場合）

```bash
# TD Buddyフロントエンドディレクトリで実行
cd td-buddy-webapp/frontend
pnpm i -D @stagewise/toolbar-next
```

### Step 3: Next.js統合

```typescript
// td-buddy-webapp/frontend/src/app/layout.tsx
import { StagewiseToolbar } from '@stagewise/toolbar-next';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="font-td antialiased bg-gradient-to-br from-td-primary-50 to-td-secondary-50 min-h-full">
        {/* 🎯 Stagewise Toolbar - 開発環境でのみ表示 */}
        {process.env.NODE_ENV === 'development' && (
          <StagewiseToolbar
            config={{
              plugins: [
                // TD専用プラグイン設定
                {
                  name: 'td-context',
                  description: 'TD Buddy component context',
                  enabled: true
                }
              ],
            }}
          />
        )}
        
        <div className="min-h-full flex flex-col">
          <header className="bg-white shadow-sm border-b border-td-primary-200">
            {/* 既存のヘッダー */}
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-td-primary-800 text-white py-4">
            {/* 既存のフッター */}
          </footer>
        </div>
      </body>
    </html>
  );
}
```

### Step 4: 環境変数設定

```bash
# td-buddy-webapp/frontend/.env.local
NEXT_PUBLIC_STAGEWISE_ENABLED=true
STAGEWISE_PROJECT_NAME="td-buddy"
```

## 🎯 TD Buddyでの活用例

### 🔐 パスワード生成ページの改善

1. **Stagewise起動**: http://localhost:3000/password にアクセス
2. **要素選択**: パスワード生成フォームをクリック
3. **コメント**: "この生成フォームのUIをより直感的にして"
4. **AI実行**: CursorがDOM構造とスタイルを理解して改善提案

### 👤 個人情報生成の視覚改善

1. **要素選択**: 個人情報表示カードを選択
2. **コメント**: "このカードデザインをモダンなグラスモーフィズムスタイルに"
3. **AIアシスト**: 具体的なTailwindCSSクラスとスタイル提案

### 🧠 AIチャット画面の最適化

1. **画面要素**: チャット入力エリアを選択
2. **改善指示**: "リアルタイム入力予測とタイプヘッド機能を追加"
3. **統合実装**: AI機能とUI改善を同時進行

## 🚀 TD専用カスタマイズ

### stagewiseConfig.js作成

```javascript
// td-buddy-webapp/frontend/stagewise.config.js
export const tdStagewiseConfig = {
  projectName: 'td-buddy',
  plugins: [
    {
      name: 'td-component-detector',
      description: 'TD Buddy専用コンポーネント識別',
      enabled: true,
      rules: [
        {
          selector: '[data-td-component]',
          context: 'TD Buddy コンポーネント',
          priority: 'high'
        },
        {
          selector: '.td-card, .td-button',
          context: 'TD デザインシステム要素',
          priority: 'medium'
        }
      ]
    },
    {
      name: 'td-ai-context',
      description: 'AI機能向けコンテキスト強化',
      enabled: true,
      extraContext: {
        framework: 'Next.js + TailwindCSS',
        designSystem: 'TD Design System',
        aiIntegration: 'Claude API',
        features: ['password-generation', 'personal-info', 'ai-chat']
      }
    }
  ],
  ui: {
    position: 'bottom-right',
    theme: 'td-theme',
    colors: {
      primary: '#0ea5e9',
      secondary: '#8b5cf6',
      accent: '#f59e0b'
    }
  }
};
```

## 🎨 デザインシステム統合

### TD専用データ属性の追加

```typescript
// td-buddy-webapp/frontend/src/components/PasswordGenerator.tsx
export default function PasswordGenerator() {
  return (
    <div 
      className="td-card p-6"
      data-td-component="password-generator"
      data-stagewise-context="パスワード生成メインコンポーネント"
    >
      <h2 
        className="text-lg font-semibold text-td-primary-800 mb-4"
        data-td-element="title"
      >
        🔐 パスワード生成
      </h2>
      
      <div 
        className="space-y-4"
        data-td-element="form-container"
        data-stagewise-hint="フォーム要素群 - 設定とオプション"
      >
        {/* フォーム要素 */}
      </div>
      
      <button 
        className="td-button bg-td-primary-500 text-white"
        data-td-element="generate-button"
        data-stagewise-action="パスワード生成実行"
      >
        生成開始
      </button>
    </div>
  );
}
```

## 🧪 テストとデバッグ

### 動作確認

1. **フロントエンド起動**
```bash
cd td-buddy-webapp/frontend && npm run dev
```

2. **Stagewise確認**
- ブラウザ右下にフローティングツールバーが表示される
- ツールバーのアイコンが緑色（接続成功）

3. **機能テスト**
- 任意の要素をクリック
- コメント入力
- Cursorでプロンプトが受信されるか確認

## 🚨 トラブルシューティング

### よくある問題

#### ❌ ツールバーが表示されない
```bash
# 解決方法
1. 拡張機能が有効か確認
2. 開発サーバーが起動中か確認
3. ブラウザの開発者ツールでコンソールエラーを確認
```

#### ❌ Cursorにプロンプトが届かない
```bash
# 解決方法
1. Cursorウィンドウが複数開いていないか確認
2. 拡張機能の再起動
3. プロジェクトフォルダがCursorで正しく開かれているか確認
```

#### ❌ 要素選択ができない
```bash
# 解決方法
1. data-stagewise-* 属性の追加
2. ツールバー設定の確認
3. ページの完全リロード
```

## 🌟 プロTips

### 💡 効率的な使い方

1. **コンポーネント別改善**
   - 一度に1つのコンポーネントに集中
   - data-td-component属性でコンテキスト強化

2. **デザインシステム活用**
   - TD専用クラス（td-card, td-button）を積極使用
   - TailwindCSSとの統合を最大化

3. **AI指示の最適化**
   - 具体的なデザイン要求（"グラスモーフィズム", "ネオモーフィズム"）
   - 機能的な要求（"アクセシビリティ向上", "レスポンシブ対応"）

## 🤖 TDからのアドバイス

**「Stagewise Eyesightで、視覚的な開発体験が革命的に向上します！」**

### 📈 期待できる効果
- ⚡ **80%の説明時間削減**: AIが視覚的コンテキストを理解
- 🎯 **精度向上**: DOM構造の正確な把握
- 🎨 **デザイン効率**: リアルタイムでの見た目調整
- 🚀 **開発速度**: 従来の3倍速でUI改善

### 🎯 TD専用ワークフロー
1. **要素選択**: 改善したいTDコンポーネント
2. **コンテキスト**: TD Design Systemとの整合性を指示
3. **実装**: AIがTailwindCSSとReactで最適化
4. **確認**: リアルタイムでブラウザ確認

**TDと一緒に、次世代の視覚的コーディング体験を楽しみましょう！🎯✨**

---

## 📞 サポート・参考資料

- **公式サイト**: https://stagewise.io/
- **拡張機能**: VS Code Marketplace
- **ドキュメント**: https://github.com/stagewise-io/stagewise
- **Discord**: 公式コミュニティサポート

**困ったときは、TDとStagewiseの組み合わせで最強の開発環境を構築しましょう！** 