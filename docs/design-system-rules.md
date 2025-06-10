# 🎨 TDデザインシステムルール
# TestData Buddy (TD) プロジェクトのデザインシステム統一ガイドライン

## 🎯 デザインシステムの目的

### 基本方針
- **一貫性**: 全てのコンポーネントで統一されたデザイン言語
- **再利用性**: DRY原則に基づく効率的なコンポーネント設計
- **アクセシビリティ**: 全ユーザーが使いやすいインクルーシブデザイン
- **パフォーマンス**: 軽量で高速なユーザーインターフェース

**TDからのメッセージ**: 「美しく、使いやすく、一貫したデザインで、最高のユーザー体験を提供しましょう！✨」

## 🎨 カラーパレット

### TDブランドカラー
```scss
// プライマリカラー（TD メインブルー）
--td-primary-50: #eff6ff;
--td-primary-100: #dbeafe;
--td-primary-200: #bfdbfe;
--td-primary-300: #93c5fd;
--td-primary-400: #60a5fa;
--td-primary-500: #3b82f6;  // メインカラー
--td-primary-600: #2563eb;
--td-primary-700: #1d4ed8;
--td-primary-800: #1e40af;
--td-primary-900: #1e3a8a;

// セカンダリカラー（TD オレンジ）
--td-secondary-50: #fff7ed;
--td-secondary-100: #ffedd5;
--td-secondary-200: #fed7aa;
--td-secondary-300: #fdba74;
--td-secondary-400: #fb923c;
--td-secondary-500: #f97316;  // メインオレンジ
--td-secondary-600: #ea580c;
--td-secondary-700: #c2410c;
--td-secondary-800: #9a3412;
--td-secondary-900: #7c2d12;

// アクセントカラー（TD グリーン）
--td-accent-50: #f0fdf4;
--td-accent-100: #dcfce7;
--td-accent-200: #bbf7d0;
--td-accent-300: #86efac;
--td-accent-400: #4ade80;
--td-accent-500: #22c55e;   // メイングリーン
--td-accent-600: #16a34a;
--td-accent-700: #15803d;
--td-accent-800: #166534;
--td-accent-900: #14532d;
```

### セマンティックカラー
```scss
// 状態表現カラー
--td-success: var(--td-accent-500);     // 成功 #22c55e
--td-warning: var(--td-secondary-500);  // 警告 #f97316
--td-danger: #ef4444;                   // 危険 #ef4444
--td-info: var(--td-primary-500);       // 情報 #3b82f6

// ニュートラルカラー
--td-gray-50: #f9fafb;
--td-gray-100: #f3f4f6;
--td-gray-200: #e5e7eb;
--td-gray-300: #d1d5db;
--td-gray-400: #9ca3af;
--td-gray-500: #6b7280;   // メイングレー
--td-gray-600: #4b5563;
--td-gray-700: #374151;
--td-gray-800: #1f2937;
--td-gray-900: #111827;
```

### カラー使用ルール
1. **プライマリカラー**: メインCTA、重要なリンク、アクティブ状態
2. **セカンダリカラー**: 副次的なアクション、警告表示
3. **アクセントカラー**: 成功状態、ポジティブなフィードバック
4. **グレースケール**: テキスト、境界線、背景
5. **セマンティックカラー**: 状態表現、アラート、通知

## 🔤 タイポグラフィ

### フォントファミリー
```scss
// プライマリフォント（日本語対応）
--font-primary: 'Noto Sans JP', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif;

// セカンダリフォント（英数字・UI）
--font-secondary: 'Inter', 'SF Pro Display', 'Segoe UI', 'Roboto', sans-serif;

// モノスペースフォント（コード表示）
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace;
```

### 文字サイズ階層
```scss
// ヘッダー系
--text-xs: 0.75rem;     // 12px - キャプション
--text-sm: 0.875rem;    // 14px - 小さなテキスト
--text-base: 1rem;      // 16px - 基本テキスト
--text-lg: 1.125rem;    // 18px - 大きなテキスト
--text-xl: 1.25rem;     // 20px - サブタイトル
--text-2xl: 1.5rem;     // 24px - セクションタイトル
--text-3xl: 1.875rem;   // 30px - ページタイトル
--text-4xl: 2.25rem;    // 36px - メインタイトル
--text-5xl: 3rem;       // 48px - ヒーロータイトル
```

### 行間・文字間隔
```scss
--leading-tight: 1.25;    // タイトル用
--leading-normal: 1.5;    // 本文用
--leading-relaxed: 1.625; // 読みやすさ重視

--tracking-tight: -0.025em;  // タイトル用
--tracking-normal: 0;        // 通常
--tracking-wide: 0.025em;    // 強調用
```

## 📏 スペーシングシステム

### 基本単位（8px グリッドシステム）
```scss
--space-0: 0;        // 0px
--space-1: 0.25rem;  // 4px
--space-2: 0.5rem;   // 8px   - 基本単位
--space-3: 0.75rem;  // 12px
--space-4: 1rem;     // 16px  - 標準スペース
--space-5: 1.25rem;  // 20px
--space-6: 1.5rem;   // 24px
--space-8: 2rem;     // 32px  - セクション間
--space-10: 2.5rem;  // 40px
--space-12: 3rem;    // 48px  - 大きなセクション間
--space-16: 4rem;    // 64px
--space-20: 5rem;    // 80px
--space-24: 6rem;    // 96px
```

### スペーシング使用指針
- **要素内パディング**: space-2〜space-4 (8px〜16px)
- **要素間マージン**: space-4〜space-6 (16px〜24px)
- **セクション間**: space-8〜space-12 (32px〜48px)
- **ページレベル**: space-16〜space-24 (64px〜96px)

## 🔲 ボーダー・シャドウ

### ボーダー半径
```scss
--rounded-none: 0;
--rounded-sm: 0.125rem;   // 2px  - 小さな要素
--rounded-md: 0.375rem;   // 6px  - 標準
--rounded-lg: 0.5rem;     // 8px  - カード
--rounded-xl: 0.75rem;    // 12px - ボタン
--rounded-2xl: 1rem;      // 16px - 特別な要素
--rounded-full: 9999px;   // 完全な円
```

### シャドウ階層
```scss
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);           // 軽微
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);         // 標準
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);       // 強調
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);       // 浮上効果
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);    // 深い浮上
```

## 🎯 ブランド専用クラス

### TDブランドユーティリティ
```scss
// TDグラデーション
.td-gradient-primary {
  background: linear-gradient(135deg, var(--td-primary-500), var(--td-primary-700));
}

.td-gradient-secondary {
  background: linear-gradient(135deg, var(--td-secondary-500), var(--td-secondary-700));
}

.td-gradient-accent {
  background: linear-gradient(135deg, var(--td-accent-500), var(--td-accent-700));
}

// TD背景パターン
.td-gradient-bg {
  background: linear-gradient(135deg, 
    var(--td-primary-50) 0%, 
    rgba(255,255,255,1) 50%, 
    var(--td-accent-50) 100%);
}
```

---

**TDからのメッセージ**: 「これで基本的なデザインシステムの土台ができました！次はコンポーネント別の詳細ルールを作っていきますね🎨✨」 