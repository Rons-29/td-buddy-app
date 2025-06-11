# 🧩 TD共通コンポーネント設計ルール
# TestData Buddy (TD) プロジェクトの共通UI要素統一ガイドライン

## 🎯 共通コンポーネントの基本原則

### 設計思想
- **再利用性**: 一度作ったコンポーネントを様々な場面で活用
- **一貫性**: 全体のデザイン言語を統一
- **拡張性**: 将来的な機能追加に対応できる柔軟な設計
- **メンテナンス性**: 変更や修正が容易な構造

**TDからのメッセージ**: 「共通コンポーネントは、効率的な開発の基盤です！統一されたパーツで、美しいUIを組み立てましょう🧩✨」

## 🗂️ Cardコンポーネント

### 基本設計
```typescript
interface TDCardProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  children: React.ReactNode;
  className?: string;
}
```

### Cardバリアント
```scss
// Default - 基本カード
.td-card-default {
  background: white;
  border: 1px solid var(--td-gray-200);
  border-radius: var(--rounded-lg);
  box-shadow: var(--shadow-sm);
}

// Elevated - 浮上効果カード
.td-card-elevated {
  background: white;
  border: none;
  border-radius: var(--rounded-lg);
  box-shadow: var(--shadow-lg);
}

// Outlined - アウトラインカード
.td-card-outlined {
  background: white;
  border: 2px solid var(--td-primary-200);
  border-radius: var(--rounded-lg);
  box-shadow: none;
}

// Filled - 塗りつぶしカード
.td-card-filled {
  background: var(--td-primary-50);
  border: 1px solid var(--td-primary-100);
  border-radius: var(--rounded-lg);
  box-shadow: none;
}
```

### Cardサイズ・スペーシング
```scss
// サイズバリエーション
.td-card-sm { padding: var(--space-3); }  // 12px
.td-card-md { padding: var(--space-4); }  // 16px (デフォルト)
.td-card-lg { padding: var(--space-6); }  // 24px
.td-card-xl { padding: var(--space-8); }  // 32px

// インタラクティブ効果
.td-card-hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
  transition: all 0.2s ease-in-out;
}

.td-card-clickable {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.td-card-clickable:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
```

### Card使用例
```tsx
// 基本的なカード
<Card variant="default" size="md">
  <h3>パスワード生成</h3>
  <p>強力なパスワードを自動生成します</p>
</Card>

// インタラクティブカード
<Card 
  variant="elevated" 
  size="lg" 
  hover 
  clickable 
  onClick={handleCardClick}
>
  <FeatureContent />
</Card>

// 設定カード
<Card variant="outlined" size="sm">
  <SettingsForm />
</Card>
```

## 🔤 Inputコンポーネント

### 基本設計
```typescript
interface TDInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  success?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}
```

### Input状態スタイル
```scss
// 基本スタイル
.td-input {
  width: 100%;
  border-radius: var(--rounded-md);
  transition: all 0.2s ease-in-out;
  font-family: var(--font-primary);
}

// サイズバリエーション
.td-input-sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  height: 32px;
}

.td-input-md {
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
  height: 40px;
}

.td-input-lg {
  padding: var(--space-4) var(--space-5);
  font-size: var(--text-lg);
  height: 48px;
}

// 状態スタイル
.td-input-default {
  border: 1px solid var(--td-gray-300);
  background: white;
}

.td-input-default:focus {
  border-color: var(--td-primary-500);
  ring: 2px;
  ring-color: var(--td-primary-500);
  ring-opacity: 0.2;
  outline: none;
}

.td-input-error {
  border-color: var(--td-danger);
  ring: 2px;
  ring-color: var(--td-danger);
  ring-opacity: 0.2;
}

.td-input-success {
  border-color: var(--td-success);
  ring: 2px;
  ring-color: var(--td-success);
  ring-opacity: 0.2;
}

.td-input-disabled {
  background-color: var(--td-gray-100);
  border-color: var(--td-gray-200);
  color: var(--td-gray-400);
  cursor: not-allowed;
}
```

### Input使用例
```tsx
// 基本的な入力フィールド
<Input 
  label="パスワード長"
  placeholder="8-128文字"
  size="md"
  type="number"
/>

// エラー状態の入力
<Input 
  label="メールアドレス"
  value={email}
  onChange={handleEmailChange}
  error={emailError}
  helperText="有効なメールアドレスを入力してください"
/>

// アイコン付き入力
<Input 
  label="検索"
  icon={<SearchIcon />}
  iconPosition="left"
  placeholder="データタイプを検索..."
/>

// 成功状態の入力
<Input 
  label="API キー"
  value={apiKey}
  success={isValidApiKey}
  helperText="API キーが正常に検証されました"
/>
```

## 🏷️ Labelコンポーネント

### ラベル設計
```typescript
interface TDLabelProps {
  children: React.ReactNode;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  htmlFor?: string;
  variant?: 'default' | 'subtitle' | 'caption';
}
```

### ラベルスタイル
```scss
.td-label {
  display: block;
  font-weight: 500;
  color: var(--td-gray-700);
  margin-bottom: var(--space-1);
}

.td-label-sm { font-size: var(--text-sm); }
.td-label-md { font-size: var(--text-base); }
.td-label-lg { font-size: var(--text-lg); }

.td-label-required::after {
  content: " *";
  color: var(--td-danger);
}

.td-label-subtitle {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--td-gray-800);
  margin-bottom: var(--space-2);
}

.td-label-caption {
  font-size: var(--text-xs);
  font-weight: 400;
  color: var(--td-gray-500);
  margin-bottom: var(--space-1);
}
```

## 📄 Textareaコンポーネント

### テキストエリア設計
```typescript
interface TDTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
}
```

### テキストエリアスタイル
```scss
.td-textarea {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--td-gray-300);
  border-radius: var(--rounded-md);
  font-family: var(--font-primary);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  transition: all 0.2s ease-in-out;
  min-height: 80px;
}

.td-textarea:focus {
  border-color: var(--td-primary-500);
  ring: 2px;
  ring-color: var(--td-primary-500);
  ring-opacity: 0.2;
  outline: none;
}

.td-textarea-resize-none { resize: none; }
.td-textarea-resize-vertical { resize: vertical; }
.td-textarea-resize-horizontal { resize: horizontal; }
.td-textarea-resize-both { resize: both; }
```

## 🔘 Checkboxコンポーネント

### チェックボックス設計
```typescript
interface TDCheckboxProps {
  id: string;
  label?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success';
  onChange?: (checked: boolean) => void;
}
```

### チェックボックススタイル
```scss
.td-checkbox-container {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.td-checkbox {
  appearance: none;
  border: 2px solid var(--td-gray-300);
  border-radius: var(--rounded-sm);
  background: white;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
}

.td-checkbox-sm { width: 16px; height: 16px; }
.td-checkbox-md { width: 20px; height: 20px; }
.td-checkbox-lg { width: 24px; height: 24px; }

.td-checkbox:checked {
  background: var(--td-primary-500);
  border-color: var(--td-primary-500);
}

.td-checkbox:checked::after {
  content: "✓";
  position: absolute;
  color: white;
  font-size: 12px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.td-checkbox:focus {
  ring: 2px;
  ring-color: var(--td-primary-500);
  ring-opacity: 0.2;
  outline: none;
}
```

## 🔄 Radioコンポーネント

### ラジオボタン設計
```typescript
interface TDRadioProps {
  name: string;
  value: string;
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success';
  onChange?: (value: string) => void;
}
```

### ラジオボタンスタイル
```scss
.td-radio {
  appearance: none;
  border: 2px solid var(--td-gray-300);
  border-radius: 50%;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
}

.td-radio-sm { width: 16px; height: 16px; }
.td-radio-md { width: 20px; height: 20px; }
.td-radio-lg { width: 24px; height: 24px; }

.td-radio:checked {
  border-color: var(--td-primary-500);
}

.td-radio:checked::after {
  content: "";
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--td-primary-500);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

## 📋 Selectコンポーネント

### セレクト設計
```typescript
interface TDSelectProps {
  label?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string;
  placeholder?: string;
  error?: string | boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  onChange?: (value: string | string[]) => void;
}
```

### セレクトスタイル
```scss
.td-select {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--td-gray-300);
  border-radius: var(--rounded-md);
  background: white;
  cursor: pointer;
  font-family: var(--font-primary);
  font-size: var(--text-base);
  transition: all 0.2s ease-in-out;
}

.td-select:focus {
  border-color: var(--td-primary-500);
  ring: 2px;
  ring-color: var(--td-primary-500);
  ring-opacity: 0.2;
  outline: none;
}

.td-select-arrow {
  position: absolute;
  right: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--td-gray-400);
}
```

## 🏃‍♂️ Progressコンポーネント

### プログレス設計
```typescript
interface TDProgressProps {
  value: number; // 0-100
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'linear' | 'circular';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  indeterminate?: boolean;
}
```

### プログレススタイル
```scss
// Linear Progress
.td-progress-linear {
  width: 100%;
  background: var(--td-gray-200);
  border-radius: var(--rounded-full);
  overflow: hidden;
}

.td-progress-linear-sm { height: 4px; }
.td-progress-linear-md { height: 8px; }
.td-progress-linear-lg { height: 12px; }

.td-progress-bar {
  height: 100%;
  background: var(--td-primary-500);
  transition: width 0.3s ease-in-out;
  border-radius: var(--rounded-full);
}

.td-progress-indeterminate {
  animation: td-progress-indeterminate 2s linear infinite;
}

@keyframes td-progress-indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

// Circular Progress
.td-progress-circular {
  width: 40px;
  height: 40px;
  border: 4px solid var(--td-gray-200);
  border-top: 4px solid var(--td-primary-500);
  border-radius: 50%;
  animation: td-spin 1s linear infinite;
}

@keyframes td-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

## 🎨 Badgeコンポーネント

### バッジ設計
```typescript
interface TDBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}
```

### バッジスタイル
```scss
.td-badge {
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  border-radius: var(--rounded-md);
  transition: all 0.2s ease-in-out;
}

.td-badge-sm {
  padding: var(--space-1) var(--space-2);
  font-size: var(--text-xs);
}

.td-badge-md {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
}

.td-badge-lg {
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
}

.td-badge-default {
  background: var(--td-gray-100);
  color: var(--td-gray-800);
}

.td-badge-success {
  background: var(--td-accent-100);
  color: var(--td-accent-800);
}

.td-badge-warning {
  background: var(--td-secondary-100);
  color: var(--td-secondary-800);
}

.td-badge-danger {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.td-badge-rounded {
  border-radius: var(--rounded-full);
}
```

## 📝 コンポーネント使用指針

### 統一性チェックリスト
- [ ] デザイントークン（カラー、スペーシング、フォント）を使用している
- [ ] 一貫したサイズバリエーション（sm, md, lg）を提供している
- [ ] アクセシビリティ属性が適切に設定されている
- [ ] レスポンシブ対応が考慮されている
- [ ] エラー状態・成功状態の表現が統一されている

### パフォーマンス考慮
- [ ] 不要な再レンダリングを避けるためのmemo化
- [ ] 大量のデータを扱う際の仮想化対応
- [ ] 遅延読み込み（Lazy Loading）の実装
- [ ] 適切なキー設定

### メンテナンス性確保
- [ ] PropsのTypeScript型定義が完備されている
- [ ] ドキュメント・Storybookが整備されている
- [ ] 単体テストが記述されている
- [ ] コンポーネントの責任範囲が明確

---

**TDからの総括**: 「共通コンポーネントは、一度しっかり作れば長く使える資産です。ユーザー体験の向上と開発効率の両立を目指して、丁寧に設計していきましょう！🧩✨」 