# 🔘 TDボタンコンポーネント設計ルール
# TestData Buddy (TD) プロジェクトのボタン統一ガイドライン

## 🎯 ボタンコンポーネントの基本原則

### 設計哲学
- **認識しやすさ**: ボタンだと一目で分かるデザイン
- **階層性**: 重要度に応じた視覚的優先順位
- **一貫性**: 全てのボタンで統一されたインタラクション
- **アクセシビリティ**: キーボードナビゲーション・スクリーンリーダー対応

**TDからのメッセージ**: 「ボタンは操作の入り口です！分かりやすく、使いやすいボタンを作りましょう🔘✨」

## 🎨 ボタンバリアント

### 1. Primary（プライマリボタン）
```typescript
// 最も重要なアクション用
variant: 'primary'

// 視覚的特徴
- 背景: td-gradient-primary
- テキスト: 白色
- シャドウ: shadow-lg → shadow-xl (hover)
- 使用場面: メインCTA、フォーム送信、重要な決定
```

### 2. Secondary（セカンダリボタン）
```typescript
// 副次的なアクション用
variant: 'secondary'

// 視覚的特徴
- 背景: gray-100 → gray-200 (hover)
- テキスト: gray-800
- ボーダー: gray-300
- 使用場面: キャンセル、戻る、追加オプション
```

### 3. Success（成功ボタン）
```typescript
// 成功・完了アクション用
variant: 'success'

// 視覚的特徴
- 背景: td-gradient-accent
- テキスト: 白色
- 使用場面: 保存完了、生成実行、データ確定
```

### 4. Warning（警告ボタン）
```typescript
// 注意が必要なアクション用
variant: 'warning'

// 視覚的特徴
- 背景: td-gradient-secondary
- テキスト: 白色
- 使用場面: 重要な変更、上書き、データ修正
```

### 5. Danger（危険ボタン）
```typescript
// 危険なアクション用
variant: 'danger'

// 視覚的特徴
- 背景: red-500 → red-600 (hover)
- テキスト: 白色
- 使用場面: 削除、リセット、データ破棄
```

### 6. Ghost（ゴーストボタン）
```typescript
// 軽微なアクション用
variant: 'ghost'

// 視覚的特徴
- 背景: 透明 → td-primary-50 (hover)
- テキスト: td-primary-600 → td-primary-700 (hover)
- 使用場面: ナビゲーション、設定変更、情報表示
```

## 📏 ボタンサイズ

### サイズバリエーション
```typescript
interface ButtonSize {
  sm: {
    padding: 'px-3 py-2',
    fontSize: 'text-sm',
    minHeight: '32px',
    iconSize: '16px'
  },
  md: {
    padding: 'px-4 py-3',
    fontSize: 'text-base',
    minHeight: '40px',
    iconSize: '20px'
  },
  lg: {
    padding: 'px-6 py-4',
    fontSize: 'text-lg',
    minHeight: '48px',
    iconSize: '24px'
  },
  xl: {
    padding: 'px-8 py-5',
    fontSize: 'text-xl',
    minHeight: '56px',
    iconSize: '28px'
  }
}
```

### サイズ使用指針
- **sm**: 密集したUI、データテーブル内のアクション
- **md**: 標準的なフォーム、一般的なボタン（デフォルト）
- **lg**: 重要なCTA、ランディングページ
- **xl**: ヒーローセクション、特別なプロモーション

## 🎭 ボタン状態

### 1. Default（通常状態）
```css
.td-button-default {
  opacity: 1;
  cursor: pointer;
  transform: scale(1);
  transition: all 0.2s ease-in-out;
}
```

### 2. Hover（ホバー状態）
```css
.td-button:hover {
  transform: scale(1.05);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  /* バリアント別背景色変更 */
}
```

### 3. Active（アクティブ状態）
```css
.td-button:active {
  transform: scale(0.95);
  transition-duration: 0.1s;
}
```

### 4. Focus（フォーカス状態）
```css
.td-button:focus {
  outline: none;
  ring: 4px;
  ring-opacity: 50%;
  ring-color: var(--focus-ring-color); /* バリアント依存 */
}
```

### 5. Disabled（無効状態）
```css
.td-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: scale(1);
  pointer-events: none;
}
```

### 6. Loading（読み込み状態）
```css
.td-button-loading {
  position: relative;
  pointer-events: none;
}

.td-button-loading::before {
  content: '';
  position: absolute;
  animation: spin 1s linear infinite;
  /* スピナーアニメーション */
}
```

## 🔄 ボタンインタラクション

### アニメーション仕様
```css
/* 基本トランジション */
.td-button {
  transition-property: transform, box-shadow, background-color, color;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* ホバーエフェクト */
@keyframes td-button-hover {
  0% { transform: scale(1); }
  100% { transform: scale(1.05); }
}

/* クリックエフェクト */
@keyframes td-button-click {
  0% { transform: scale(1.05); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

/* リップルエフェクト（オプション） */
@keyframes td-ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}
```

### フォーカス管理
```typescript
// キーボードナビゲーション対応
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onClick?.(event);
  }
};
```

## 🖼️ アイコン付きボタン

### アイコン配置ルール
```typescript
interface IconButtonProps {
  icon: React.ReactNode;
  iconPosition: 'left' | 'right' | 'only';
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
}

// 左アイコン
<Button icon={<SaveIcon />} iconPosition="left">
  保存する
</Button>

// 右アイコン
<Button icon={<ArrowRightIcon />} iconPosition="right">
  次へ進む
</Button>

// アイコンのみ
<Button icon={<CloseIcon />} iconPosition="only" aria-label="閉じる" />
```

### アイコンスペーシング
```css
/* 左アイコン */
.td-button-icon-left {
  margin-right: 0.5rem; /* 8px */
}

/* 右アイコン */
.td-button-icon-right {
  margin-left: 0.5rem; /* 8px */
}

/* アイコンサイズ調整 */
.td-button-icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
}
```

## 📱 レスポンシブ対応

### ブレークポイント別調整
```css
/* モバイル（〜640px） */
@media (max-width: 640px) {
  .td-button {
    min-height: 44px; /* タッチ操作に適したサイズ */
    padding: 12px 16px;
  }
  
  .td-button-text {
    font-size: 16px; /* iOSズーム防止 */
  }
}

/* タブレット（641px〜1024px） */
@media (min-width: 641px) and (max-width: 1024px) {
  .td-button-group {
    gap: 12px; /* ボタン間隔調整 */
  }
}

/* デスクトップ（1025px〜） */
@media (min-width: 1025px) {
  .td-button:hover {
    transform: scale(1.05); /* デスクトップのみホバー効果 */
  }
}
```

## 🎯 ボタングループ

### グループ化ルール
```typescript
// 関連アクションのグループ化
<ButtonGroup spacing="md" direction="horizontal">
  <Button variant="secondary">キャンセル</Button>
  <Button variant="primary">保存</Button>
</ButtonGroup>

// ツールバー
<ButtonGroup variant="ghost" size="sm">
  <Button icon={<BoldIcon />} />
  <Button icon={<ItalicIcon />} />
  <Button icon={<UnderlineIcon />} />
</ButtonGroup>
```

### グループスペーシング
```css
.td-button-group {
  display: flex;
  gap: var(--button-group-spacing);
}

.td-button-group-sm { --button-group-spacing: 0.5rem; }
.td-button-group-md { --button-group-spacing: 0.75rem; }
.td-button-group-lg { --button-group-spacing: 1rem; }
```

## ♿ アクセシビリティ

### 必須属性
```typescript
interface AccessibleButtonProps {
  'aria-label'?: string;      // アイコンのみボタンの場合必須
  'aria-describedby'?: string; // 説明テキストのID
  'aria-pressed'?: boolean;    // トグルボタンの場合
  'aria-expanded'?: boolean;   // ドロップダウンボタンの場合
  'aria-haspopup'?: boolean;   // ポップアップを開くボタンの場合
}
```

### フォーカス表示
```css
.td-button:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
}

/* ハイコントラストモード対応 */
@media (prefers-contrast: high) {
  .td-button {
    border: 2px solid currentColor;
  }
}

/* アニメーション削減設定対応 */
@media (prefers-reduced-motion: reduce) {
  .td-button {
    transition: none;
    transform: none !important;
  }
}
```

## 🧪 ボタンコンポーネント実装例

### TypeScript インターフェース
```typescript
interface TDButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right' | 'only';
  fullWidth?: boolean;
  ripple?: boolean;
  children?: React.ReactNode;
}
```

### 使用例
```tsx
// 基本的な使用
<Button variant="primary" size="md">
  データを生成
</Button>

// ローディング状態
<Button variant="primary" loading={isGenerating}>
  {isGenerating ? '生成中...' : 'データを生成'}
</Button>

// アイコン付き
<Button 
  variant="success" 
  icon={<DownloadIcon />} 
  iconPosition="left"
>
  CSVダウンロード
</Button>

// 全幅ボタン
<Button variant="primary" fullWidth>
  アカウントを作成
</Button>

// 危険なアクション
<Button 
  variant="danger" 
  onClick={handleDelete}
  aria-describedby="delete-warning"
>
  データを削除
</Button>
```

## 📝 ボタン使用チェックリスト

### デザイン確認
- [ ] 適切なバリアントを選択している
- [ ] サイズがコンテキストに適している
- [ ] アイコンがある場合、適切に配置されている
- [ ] 状態表現が明確である

### アクセシビリティ確認
- [ ] フォーカス表示が分かりやすい
- [ ] aria-label等の適切な属性が設定されている
- [ ] キーボードで操作可能
- [ ] スクリーンリーダーで読み上げ可能

### インタラクション確認
- [ ] ホバー・アクティブ状態が適切
- [ ] ローディング状態の表示が明確
- [ ] 無効状態の見た目が適切
- [ ] アニメーションが自然

---

**TDからのアドバイス**: 「ボタンはユーザーとの大切なタッチポイントです。一つ一つのボタンが、ユーザーの期待に応える設計になっているか確認しましょう！🔘✨」 