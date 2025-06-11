# 🧩 TD UI コンポーネントガイドライン

## 🎯 基本コンポーネント

### 1. ボタンコンポーネント

```tsx
// ✅ 基本ボタン（推奨）
<button className="td-button bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
  基本ボタン
</button>

// ✅ グラデーションボタン（特別な機能用）
<button className="td-button bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all">
  グラデーションボタン
</button>

// ✅ カテゴリ別ボタン
<button className="td-button bg-td-primary-500 text-white hover:bg-td-primary-600">
  プライマリボタン
</button>
<button className="td-button bg-td-secondary-500 text-white hover:bg-td-secondary-600">
  セカンダリボタン
</button>
<button className="td-button bg-td-accent-500 text-white hover:bg-td-accent-600">
  アクセントボタン
</button>
```

### 2. カードコンポーネント

```tsx
// ✅ 基本カード
<div className="td-card p-6">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">カードタイトル</h3>
  <p className="text-gray-600">カードコンテンツ</p>
</div>

// ✅ カテゴリ付きカード
<div className="td-card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
  <div className="text-3xl mb-3">🔐</div>
  <h3 className="text-lg font-semibold text-blue-800 mb-2">機能タイトル</h3>
  <p className="text-blue-600 mb-4">機能説明</p>
  <button className="td-button bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
    実行ボタン
  </button>
</div>
```

### 3. 入力フィールド

```tsx
// ✅ 基本入力フィールド
<div className="td-form-group">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    フィールド名
  </label>
  <input
    type="text"
    className="td-input w-full"
    placeholder="入力してください"
  />
</div>

// ✅ セレクトボックス
<select className="td-input w-full">
  <option value="">選択してください</option>
  <optgroup label="📧 カテゴリ1">
    <option value="option1">オプション1</option>
  </optgroup>
</select>

// ✅ テキストエリア
<textarea
  className="td-input w-full h-32 resize-none"
  placeholder="複数行テキスト"
/>
```

## 🏗️ レイアウトパターン

### 1. ページレイアウト

```tsx
// ✅ 標準ページレイアウト
<div className="min-h-screen bg-gradient-to-br from-{color}-50 to-{color}-100">
  <div className="container mx-auto px-4 py-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      {/* ヘッダー部分 */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4 td-heartbeat">🤖</div>
        <h1 className="text-4xl font-bold text-{color}-800 mb-4">
          ページタイトル
        </h1>
        <p className="text-xl text-{color}-600">ページ説明</p>
      </div>

      {/* メインコンテンツ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* カード配置 */}
      </div>

      {/* TDメッセージ */}
      <div className="mt-8 td-card p-6">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🤖</div>
          <p className="text-{color}-800 font-medium">TDからのメッセージ</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 2. グリッドレイアウト

```tsx
// ✅ レスポンシブグリッド
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* アイテム */}
</div>

// ✅ 2カラムレイアウト
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <div>メインコンテンツ</div>
  <div>サイドバー</div>
</div>

// ✅ カード専用グリッド
<div className="preset-grid">
  {/* プリセットカード */}
</div>
```

## 🎭 TD キャラクター統合

### 1. キャラクター表示

```tsx
// ✅ メインキャラクター（大）
<div className="text-6xl mb-4 td-heartbeat">🤖</div>

// ✅ インラインキャラクター（中）
<div className="text-3xl mb-3">🤖</div>

// ✅ 小さなキャラクター
<div className="text-xl">🤖</div>

// ✅ メッセージ付きキャラクター
<div className="flex items-center gap-3">
  <div className="text-2xl td-pulse-slow">🤖</div>
  <p className="text-blue-800 font-medium">TDからのメッセージ</p>
</div>
```

### 2. TD アニメーション

```tsx
// ✅ 利用可能なアニメーション
<div className="td-heartbeat">🤖</div>  {/* ハートビート */}
<div className="td-wiggle">🤖</div>     {/* 左右振り */}
<div className="td-float">🤖</div>      {/* 上下浮遊 */}
<div className="td-pulse-slow">🤖</div> {/* ゆっくり点滅 */}
```

## 📊 データ表示コンポーネント

### 1. 統計表示

```tsx
// ✅ 統計カード
<div className="td-card p-4">
  <div className="text-center">
    <div className="text-2xl font-bold text-blue-600">{count}</div>
    <div className="text-sm text-gray-600">生成件数</div>
  </div>
</div>

// ✅ 進捗表示
<div className="w-full bg-gray-200 rounded-full h-3 mb-3">
  <div
    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
    style={{ width: `${progress}%` }}
  />
</div>
```

### 2. リスト表示

```tsx
// ✅ データリスト
<div className="space-y-2">
  {items.map((item, index) => (
    <div
      key={index}
      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
    >
      <span className="font-mono text-sm text-gray-800">{item}</span>
      <button className="text-blue-500 hover:text-blue-700">
        <Copy className="w-4 h-4" />
      </button>
    </div>
  ))}
</div>
```

## 🎨 カテゴリ別スタイル

### 1. ブルー系（基本データ生成）

```tsx
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
  <div className="td-card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
    <h3 className="text-lg font-semibold text-blue-800">タイトル</h3>
    <p className="text-blue-600">説明</p>
    <button className="td-button bg-blue-500 hover:bg-blue-600 text-white">
      実行
    </button>
  </div>
</div>
```

### 2. グリーン系（成功・安全・数値）

```tsx
<div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
  <div className="td-card p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
    <h3 className="text-lg font-semibold text-green-800">タイトル</h3>
    <p className="text-green-600">説明</p>
    <button className="td-button bg-green-500 hover:bg-green-600 text-white">
      実行
    </button>
  </div>
</div>
```

### 3. パープル系（AI・高度機能）

```tsx
<div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
  <div className="td-card p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
    <h3 className="text-lg font-semibold text-purple-800">タイトル</h3>
    <p className="text-purple-600">説明</p>
    <button className="td-button bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      実行
    </button>
  </div>
</div>
```

## 🔧 フォームコンポーネント

### 1. フォームグループ

```tsx
// ✅ 標準フォームグループ
<div className="space-y-6">
  <div className="td-form-group">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      ラベル名 <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      className="td-input w-full"
      placeholder="入力してください"
      required
    />
    <p className="text-xs text-gray-500 mt-1">ヘルプテキスト</p>
  </div>
</div>
```

### 2. チェックボックス・ラジオボタン

```tsx
// ✅ チェックボックス
<label className="flex items-center space-x-2">
  <input
    type="checkbox"
    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
  />
  <span className="text-sm text-gray-700">オプション名</span>
</label>

// ✅ ラジオボタン
<label className="flex items-center space-x-2">
  <input
    type="radio"
    name="option"
    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
  />
  <span className="text-sm text-gray-700">選択肢</span>
</label>
```

## 🚨 状態表示

### 1. ローディング状態

```tsx
// ✅ ローディングボタン
<button
  className="td-button bg-gray-400 text-white cursor-not-allowed flex items-center gap-2"
  disabled
>
  <Loader className="w-4 h-4 animate-spin" />
  処理中...
</button>

// ✅ ローディングカード
<div className="td-card p-6 text-center">
  <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
  <p className="text-gray-600">データを生成中...</p>
</div>
```

### 2. 成功・エラー表示

```tsx
// ✅ 成功メッセージ
<div className="bg-green-50 border border-green-200 rounded-lg p-4">
  <div className="flex items-center gap-2">
    <CheckCircle className="w-5 h-5 text-green-500" />
    <span className="text-green-800 font-medium">成功しました！</span>
  </div>
</div>

// ✅ エラーメッセージ
<div className="bg-red-50 border border-red-200 rounded-lg p-4">
  <div className="flex items-center gap-2">
    <AlertCircle className="w-5 h-5 text-red-500" />
    <span className="text-red-800 font-medium">エラーが発生しました</span>
  </div>
</div>
```

## 📐 実装チェックリスト

### ✅ 新コンポーネント作成時

- [ ] 適切なカテゴリカラーを使用
- [ ] `td-button`, `td-card`, `td-input` クラスを活用
- [ ] レスポンシブ対応（`grid`, `md:`, `lg:` 活用）
- [ ] TD キャラクター統合
- [ ] アクセシビリティ考慮（`aria-label`, `alt` 等）
- [ ] ホバー・フォーカス状態の定義
- [ ] ローディング・エラー状態の考慮

### ✅ 既存コンポーネント修正時

- [ ] 現在のカラーシステムとの整合性確認
- [ ] 統一クラス（`td-*`）への置き換え
- [ ] 不要なインラインスタイルの削除
- [ ] 一貫したスペーシング（`p-4`, `mb-6` 等）

---

**TD からのメッセージ**: 「統一されたコンポーネントで、開発効率も向上します！再利用可能で美しい UI を一緒に作りましょう 🎨✨」
