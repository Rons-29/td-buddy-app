# 🎨 TD (TestData Buddy) デザインシステム v2.0

## 🌈 カラーパレット（統一版）

### メインブランドカラー

- **td-primary**: 青系統（#3B82F6）- メインブランドカラー
- **td-secondary**: 緑系統（#10B981）- サクセス・グリーン
- **td-accent**: 紫系統（#8B5CF6）- AI・アクセントカラー

### カテゴリ別カラー使用法

#### 🔵 td-primary（ブルー系）

```css
50: #f0f9ff   /* 最も薄い背景 */
100: #e0f2fe  /* 薄い背景 */
200: #bae6fd  /* ボーダー・区切り線 */
300: #7dd3fc  /* 非アクティブ要素 */
400: #38bdf8  /* ホバー状態 */
500: #3B82F6  /* メインカラー */
600: #2563eb  /* ボタンホバー */
700: #1d4ed8  /* アクティブ状態 */
800: #1e40af  /* 見出し・重要テキスト */
900: #1e3a8a  /* 最も濃いテキスト */
```

**使用箇所**:

- パスワード生成（`/password`）
- CSV 生成（`/csv-test`, `/csv-detailed`）
- ベースレイアウト
- ナビゲーション
- メインボタン

#### 🟢 td-secondary（グリーン系）

```css
50: #f0fdf4   /* 成功メッセージ背景 */
100: #dcfce7  /* 薄い背景 */
200: #bbf7d0  /* ボーダー */
300: #86efac  /* 非アクティブ */
400: #4ade80  /* ホバー */
500: #10B981  /* メインカラー */
600: #059669  /* ボタンホバー */
700: #047857  /* アクティブ */
800: #065f46  /* 見出し */
900: #064e3b  /* 濃いテキスト */
```

**使用箇所**:

- 個人情報生成（`/personal`）
- 日付・時刻生成（`/datetime`）
- 成功状態
- 実行完了
- データ生成完了

#### 🟣 td-accent（パープル系）

```css
50: #faf5ff   /* AI関連背景 */
100: #f3e8ff  /* 薄い背景 */
200: #e9d5ff  /* ボーダー */
300: #d8b4fe  /* 非アクティブ */
400: #c084fc  /* ホバー */
500: #8B5CF6  /* メインカラー */
600: #7c3aed  /* ボタンホバー */
700: #6d28d9  /* アクティブ */
800: #5b21b6  /* 見出し */
900: #4c1d95  /* 濃いテキスト */
```

**使用箇所**:

- AI チャット（`/ai-chat`）
- UUID 生成（`/uuid`）
- 数値・ブール値（`/number-boolean`）
- AI 関連機能
- アクセント要素

### 特殊カテゴリカラー

#### 📄 テキスト系（パープル → ピンク）

```css
bg-gradient-to-br from-purple-50 to-pink-100
```

**使用箇所**: テキストツール（`/text-tools`）

#### 🎨 カラー系（ピンク → ローズ）

```css
bg-gradient-to-br from-pink-50 to-rose-100
```

**使用箇所**: カラー生成（`/colors`）

#### 🔘 ベースカラー（td-gray）

```css
50: #F8FAFC   /* 背景 */
100: #F1F5F9  /* カード背景 */
200: #E2E8F0  /* ボーダー */
300: #CBD5E1  /* 区切り線 */
400: #94A3B8  /* プレースホルダー */
500: #64748B  /* 通常テキスト */
600: #475569  /* サブテキスト */
700: #334155  /* 見出し */
800: #1E293B  /* 重要見出し */
900: #0F172A  /* 最重要テキスト */
```

### ステータスカラー

```css
td-success: #22C55E  /* 成功 */
td-warning: #F59E0B  /* 警告 */
td-error: #EF4444    /* エラー */
td-info: #3B82F6     /* 情報 */
```

## 🏗️ レイアウトパターン

### 1. ページ基本構造

```tsx
<div className="min-h-screen bg-gradient-to-br from-{color}-50 to-{color}-100">
  <div className="container mx-auto px-4 py-6">
    <div className="max-w-4xl mx-auto">{/* コンテンツ */}</div>
  </div>
</div>
```

### 2. カテゴリ別背景グラデーション

- **ブルー系**: `from-blue-50 to-indigo-100`（パスワード、CSV）
- **グリーン系**: `from-green-50 to-emerald-100`（個人情報）
- **パープル系**: `from-purple-50 to-blue-100`（UUID）
- **TD 背景**: `from-td-primary-50 via-white to-td-secondary-50`（AI チャット）

### 3. カード構造

```tsx
<div className="td-card p-6">{/* カード内容 */}</div>
```

### 4. ボタンパターン

```tsx
{/* 基本ボタン */}
<button className="td-button bg-td-primary-500 text-white px-4 py-2 rounded-md hover:bg-td-primary-600 transition-colors">

{/* グラデーションボタン */}
<button className="td-button bg-gradient-to-r from-{color}-500 to-{color2}-500 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all">
```

## 🎭 TD キャラクター統合

### アニメーション

```css
.td-heartbeat {
  animation: td-heartbeat 1.5s ease-in-out infinite;
}
.td-wiggle {
  animation: td-wiggle 1s ease-in-out infinite;
}
.td-float {
  animation: td-float 3s ease-in-out infinite;
}
.td-pulse-slow {
  animation: td-pulse-slow 2s ease-in-out infinite;
}
```

### キャラクター配置

```tsx
<div className="text-6xl mb-4 td-heartbeat">🤖</div>
```

## 📱 レスポンシブ設計

### ブレークポイント

- **mobile**: `< 640px`
- **tablet**: `640px - 1024px`
- **desktop**: `> 1024px`

### グリッドパターン

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

## 🔧 カスタムユーティリティ

### 入力フィールド

```css
.td-input {
  @apply px-3 py-2 border border-td-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-td-primary-500 focus:border-td-primary-500 transition-colors duration-200;
}
```

### カード

```css
.td-card {
  @apply bg-white rounded-lg shadow-sm border border-td-primary-100 hover:shadow-md transition-shadow duration-200;
}
```

### ボタン

```css
.td-button {
  @apply transition-all duration-200 ease-in-out transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-td-primary-500 focus:ring-opacity-50;
}
```

## 🎯 実装ガイドライン

### 1. ページ作成時

1. 適切なカテゴリカラーを選択
2. 基本レイアウト構造を適用
3. TD キャラクターを統合
4. レスポンシブ対応を確認

### 2. カラー選択指針

- **ブルー系**: データ生成、基本機能
- **グリーン系**: 成功、完了、安全性
- **パープル系**: AI、高度機能、特殊機能
- **ピンク系**: クリエイティブ、装飾
- **グレー系**: ベース、非アクティブ

### 3. 統一性チェックリスト

- [ ] 適切なカテゴリカラーを使用
- [ ] td-button, td-card クラスを使用
- [ ] レスポンシブ設計を適用
- [ ] TD キャラクターを統合
- [ ] アクセシビリティを考慮

## 🚀 今後の拡張

### 新カテゴリ追加時

1. 専用カラーパレットを定義
2. 背景グラデーションを設定
3. カテゴリ固有のアイコン選定
4. デザインシステムを更新

---

**TD からのメッセージ**: 「統一されたデザインで、ユーザーにとって使いやすいインターフェースを提供しましょう！一貫性が美しさの鍵です ✨」
