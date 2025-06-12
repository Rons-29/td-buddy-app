# 🎨 TD カラーマッピング表

## 📄 ページ別カラー使用状況

| ページ/機能                          | 背景グラデーション                | メインカラー        | 使用パターン | 統一性 |
| ------------------------------------ | --------------------------------- | ------------------- | ------------ | ------ |
| **メインページ** (`/`)               | N/A                               | td-primary          | ✅ 統一済み  | ✅     |
| **パスワード生成** (`/password`)     | `blue-50 → indigo-100`            | ブルー系            | ✅ 統一済み  | ✅     |
| **個人情報生成** (`/personal`)       | `green-50 → emerald-100`          | グリーン系          | ✅ 統一済み  | ✅     |
| **CSV 基本** (`/csv-test`)           | `blue-50 → indigo-100`            | ブルー系/オレンジ系 | ⚠️ 要調整    | ⚠️     |
| **CSV 詳細** (`/csv-detailed`)       | `blue-50 → indigo-100`            | ブルー系            | ✅ 統一済み  | ✅     |
| **日付・時刻** (`/datetime`)         | `green-50 → teal-100`             | グリーン系          | ✅ 統一済み  | ✅     |
| **数値・ブール** (`/number-boolean`) | `gray-50`                         | ブルー系            | ⚠️ 要調整    | ⚠️     |
| **UUID 生成** (`/uuid`)              | `purple-50 → blue-100`            | パープル系          | ✅ 統一済み  | ✅     |
| **テキストツール** (`/text-tools`)   | `purple-50 → pink-100`            | パープル系          | ✅ 統一済み  | ✅     |
| **カラー生成** (`/colors`)           | `pink-50 → rose-100`              | ピンク系            | ✅ 統一済み  | ✅     |
| **AI チャット** (`/ai-chat`)         | `td-primary-50 → td-secondary-50` | td-primary/accent   | ✅ 統一済み  | ✅     |
| **データ選択** (`/data-selector`)    | `td-gray-50`                      | ブルー系            | ✅ 統一済み  | ✅     |
| **実用データ** (`/practical-data`)   | `td-gray-50`                      | ブルー系            | ✅ 統一済み  | ✅     |
| **エクスポート** (`/export`)         | `td-background`                   | td-primary          | ✅ 統一済み  | ✅     |

## 🔍 問題箇所の詳細分析

### ⚠️ CSV 基本機能 (`/csv-test`)

**現状**: オレンジ系とブルー系の混在

```tsx
// 現在のカラーパターン
bg-gradient-to-br from-orange-50 to-amber-50   // オレンジ背景
border-orange-200                              // オレンジボーダー
text-orange-800                                // オレンジテキスト
```

**推奨修正**:

```tsx
// 統一後のカラーパターン
bg-gradient-to-br from-blue-50 to-indigo-100  // ブルー背景
border-blue-200                               // ブルーボーダー
text-blue-800                                 // ブルーテキスト
```

### ⚠️ 数値・ブール値 (`/number-boolean`)

**現状**: グレー背景でカテゴリ感が薄い

```tsx
// 現在
bg - gray - 50;
```

**推奨修正**:

```tsx
// 統一後（数値 = グリーン系に統一）
bg-gradient-to-br from-green-50 to-emerald-100
```

## 🎯 カテゴリ別統一基準

### データ生成系

| カテゴリ       | カラー                    | 背景グラデーション       |
| -------------- | ------------------------- | ------------------------ |
| **基本データ** | ブルー (`td-primary`)     | `blue-50 → indigo-100`   |
| **個人情報**   | グリーン (`td-secondary`) | `green-50 → emerald-100` |
| **数値・計算** | グリーン (`td-secondary`) | `green-50 → emerald-100` |
| **テキスト**   | パープル (`td-accent`)    | `purple-50 → pink-100`   |
| **ID・識別子** | パープル (`td-accent`)    | `purple-50 → blue-100`   |

### 特殊機能系

| カテゴリ     | カラー                             | 背景グラデーション                |
| ------------ | ---------------------------------- | --------------------------------- |
| **AI 関連**  | TD 統合 (`td-primary`+`td-accent`) | `td-primary-50 → td-secondary-50` |
| **デザイン** | ピンク                             | `pink-50 → rose-100`              |
| **システム** | グレー (`td-gray`)                 | `td-gray-50`                      |

## 🛠️ 修正優先度

### 🔥 高優先度（即修正推奨）

1. **CSV 基本機能** - オレンジ → ブルー統一
2. **数値・ブール値** - グレー → グリーン統一

### 🔄 中優先度（次回更新時）

1. **ナビゲーション** - 全体統一性の確認
2. **ボタンスタイル** - td-button クラス適用徹底

### ✅ 統一済み（維持）

- メインページ
- パスワード生成
- 個人情報生成
- CSV 詳細
- 日付・時刻
- UUID 生成
- テキストツール
- カラー生成
- AI チャット

## 📐 実装テンプレート

### ブルー系ページ（データ生成基本）

```tsx
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
  <div className="container mx-auto px-4 py-6">
    <div className="td-card p-6">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">
        <button className="td-button bg-blue-500 text-white hover:bg-blue-600"></button>
      </h2>
    </div>
  </div>
</div>
```

### グリーン系ページ（成功・安全・数値）

```tsx
<div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
  <div className="container mx-auto px-4 py-6">
    <div className="td-card p-6">
      <h2 className="text-xl font-semibold text-green-800 mb-4">
        <button className="td-button bg-green-500 text-white hover:bg-green-600"></button>
      </h2>
    </div>
  </div>
</div>
```

### パープル系ページ（AI・高度機能）

```tsx
<div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
  <div className="container mx-auto px-4 py-6">
    <div className="td-card p-6">
      <h2 className="text-xl font-semibold text-purple-800 mb-4">
        <button className="td-button bg-purple-500 text-white hover:bg-purple-600"></button>
      </h2>
    </div>
  </div>
</div>
```

## 🎨 カラーツールキット

### Tailwind 設定確認

```javascript
// tailwind.config.js で定義済み
'td-primary': {
  500: '#3B82F6',  // メインブルー
  // 50-900 の段階的カラー
},
'td-secondary': {
  500: '#10B981',  // メイングリーン
  // 50-900 の段階的カラー
},
'td-accent': {
  500: '#8B5CF6',  // メインパープル
  // 50-900 の段階的カラー
}
```

### グローバル CSS 定義済み

```css
/* app/globals.css */
.td-button {
  /* ボタン統一スタイル */
}
.td-card {
  /* カード統一スタイル */
}
.td-input {
  /* 入力フィールド統一スタイル */
}
```

---

**TD からのメッセージ**: 「カラー統一で、もっと美しく使いやすいインターフェースにしましょう！一貫性があると、ユーザーも安心して使えます ♪」
