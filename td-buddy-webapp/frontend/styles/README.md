# 🎨 Quality Workbench - Styles Directory

## 📁 ファイル構成

### `quality-workbench-colors.css`

**Warm Craft カラーパレット**の完全な定義ファイル。

- **役割**: CSS カスタムプロパティによる色彩システム
- **対象**: ウォルナット系、メタルブルー系、アクセントカラー
- **機能**: ダークモード対応、ユーティリティクラス

### `color-demo.html`

カラーパレットの**視覚的確認**ができるデモページ。

- **役割**: 実際の色合いと UI コンポーネント例の表示
- **機能**:
  - カラーコードのクリックコピー
  - ダークモード切り替え
  - レスポンシブ対応
  - 実際の UI 要素での色確認

### `globals.css`

既存のグローバルスタイル。

## 🚀 使用方法

### 1. **基本的な導入**

```html
<!-- HTMLファイルのheadタグ内 -->
<link rel="stylesheet" href="styles/quality-workbench-colors.css" />
```

### 2. **CSS 変数の使用**

```css
.my-component {
  /* ブランドカラー */
  background: var(--qw-brand-primary);
  color: var(--qw-text-inverse);

  /* ボーダー・シャドウ */
  border: 1px solid var(--qw-border-light);
  box-shadow: var(--qw-shadow-md);
}

/* ホバー状態 */
.my-component:hover {
  background: var(--qw-brand-primary-hover);
}
```

### 3. **ユーティリティクラス使用**

```html
<!-- 背景色 -->
<div class="qw-bg-primary">メイン背景</div>
<div class="qw-bg-walnut">ウォルナット背景</div>
<div class="qw-bg-metal">メタル背景</div>

<!-- テキスト色 -->
<p class="qw-text-primary">プライマリテキスト</p>
<p class="qw-text-secondary">セカンダリテキスト</p>
<p class="qw-text-muted">ミュートテキスト</p>

<!-- ボーダー -->
<div class="qw-border">標準ボーダー</div>
<div class="qw-border-light">薄いボーダー</div>

<!-- シャドウ */
<div class="qw-shadow-sm">小さなシャドウ</div>
<div class="qw-shadow-md">中サイズシャドウ</div>
```

## 🎨 カラーパレット一覧

### 🟤 **ウォルナット系（木製作業台）**

```css
--qw-walnut-50   /* #FDFCFC - 薄い木目ベース */
--qw-walnut-100  /* #F7F3F0 - ライトオーク */
--qw-walnut-500  /* #795548 - ミディアムウォルナット ⭐ */
--qw-walnut-600  /* #8B4513 - リッチウォルナット ⭐ */
--qw-walnut-800  /* #4E342E - エスプレッソ */
```

### 🔘 **メタルブルー系（工業用作業台）**

```css
--qw-metal-100   /* #F1F5F9 - シルバーホワイト */
--qw-metal-300   /* #CBD5E1 - ソフトメタル */
--qw-metal-500   /* #607D8B - メタルブルー ⭐ */
--qw-metal-700   /* #455A64 - ガンメタル */
--qw-metal-900   /* #263238 - ダークスレート */
```

### ✨ **アクセントカラー**

```css
--qw-insight-500 /* #673AB7 - 洞察パープル */
--qw-verify-500  /* #4CAF50 - 検証グリーン */
--qw-warm-500    /* #D84315 - 温かみオレンジ */
```

### 🚦 **セマンティックカラー**

```css
--qw-success     /* #4CAF50 - 成功 */
--qw-warning     /* #FF9800 - 警告 */
--qw-error       /* #F44336 - エラー */
--qw-info        /* #607D8B - 情報 */
```

## 🌓 ダークモード

自動的に`prefers-color-scheme: dark`に対応します。

```css
/* ライトモード（デフォルト） */
.my-component {
  background: var(--qw-bg-primary); /* #FFFFFF */
  color: var(--qw-text-primary); /* #263238 */
}

/* ダークモード（自動切り替え） */
@media (prefers-color-scheme: dark) {
  .my-component {
    background: var(--qw-bg-primary); /* #263238 */
    color: var(--qw-text-primary); /* #FFFFFF */
  }
}
```

## 🛠️ カスタマイズ

### 独自の色を追加

```css
:root {
  /* Quality Workbench カラーを継承 */
  @import 'quality-workbench-colors.css';

  /* プロジェクト固有の色を追加 */
  --my-project-accent: #e91e63;
  --my-project-highlight: var(--qw-warm-500);
}
```

### Tailwind CSS との統合

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'qw-walnut': {
          50: '#FDFCFC',
          100: '#F7F3F0',
          500: '#795548',
          600: '#8B4513',
          800: '#4E342E',
        },
        'qw-metal': {
          100: '#F1F5F9',
          300: '#CBD5E1',
          500: '#607D8B',
          700: '#455A64',
          900: '#263238',
        },
        'qw-insight': '#673AB7',
        'qw-verify': '#4CAF50',
        'qw-warm': '#D84315',
      },
    },
  },
};
```

## 🧪 テスト・確認

### 1. **デモページで確認**

```bash
# ローカルサーバーで確認
cd td-buddy-webapp/frontend/styles
python -m http.server 8000
# ブラウザで http://localhost:8000/color-demo.html を開く
```

### 2. **カラーコードのコピー**

- デモページでカラーコードをクリック
- 自動的にクリップボードにコピー
- 成功時は背景色が緑色に変化

### 3. **ダークモード確認**

- デモページ右上の 🌓 ボタンでテーマ切り替え
- システム設定に応じた自動切り替えも確認

## 📱 レスポンシブ対応

カラーパレットは**すべてのデバイスサイズで同様**に動作します。

```css
/* モバイル対応の例 */
@media (max-width: 768px) {
  .mobile-card {
    background: var(--qw-bg-primary);
    padding: 1rem;
    margin: 0.5rem;
  }
}
```

## 🎯 ベストプラクティス

### ✅ **推奨**

- CSS 変数を使用した柔軟な色管理
- セマンティックカラーの適切な使用
- ダークモード対応の考慮
- アクセシビリティに配慮したコントラスト

### ❌ **非推奨**

- ハードコードされたカラーコード
- `#000000` や `#FFFFFF` の直接使用
- 過度な色の使用（情報の整理が困難）

## 🔗 関連ファイル

- **デザインシステム**: `../docs/design-system.md`
- **プロジェクトルール**: `../../docs/project_rules.mdc`
- **コンポーネント**: `../components/ui/`

---

**TD からのメッセージ**: 「このカラーパレットで、Quality ワークベンチらしい温かみと信頼性を表現できますね！実際にデモページで確認して、気に入った色はどんどん使ってください ♪」
