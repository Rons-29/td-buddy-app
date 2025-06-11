# 📱 TDレスポンシブ・アニメーションルール
# TestData Buddy (TD) プロジェクトのレスポンシブデザイン・インタラクション統一ガイドライン

## 🎯 レスポンシブデザインの基本原則

### モバイルファースト設計
- **Progressive Enhancement**: モバイルから始めてデスクトップに拡張
- **コンテンツ優先**: 最も重要な情報から優先的に表示
- **タッチフレンドリー**: 指でのタッチ操作に適したUIサイズ
- **パフォーマンス重視**: モバイル環境での高速動作

**TDからのメッセージ**: 「どんなデバイスでも快適に使える、思いやりのあるデザインを作りましょう📱✨」

## 📐 ブレークポイント定義

### TDブレークポイントシステム
```scss
// ブレークポイント定義
$td-breakpoints: (
  'xs': 0px,      // 〜575px   超小型デバイス（小型スマートフォン）
  'sm': 576px,    // 576px〜   小型デバイス（スマートフォン）
  'md': 768px,    // 768px〜   中型デバイス（タブレット縦向き）
  'lg': 1024px,   // 1024px〜  大型デバイス（タブレット横向き・小型ノートPC）
  'xl': 1280px,   // 1280px〜  特大デバイス（デスクトップ）
  '2xl': 1536px   // 1536px〜  超大型デバイス（大型デスクトップ）
);

// メディアクエリヘルパー
@mixin td-responsive($breakpoint) {
  @if map-has-key($td-breakpoints, $breakpoint) {
    @media (min-width: map-get($td-breakpoints, $breakpoint)) {
      @content;
    }
  }
}
```

### デバイス別設計指針
```scss
// XS (〜575px) - 小型スマートフォン
@media (max-width: 575px) {
  .td-container {
    padding: var(--space-3); // 12px
    max-width: 100%;
  }
  
  .td-grid {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }
  
  .td-text {
    font-size: var(--text-sm);
    line-height: var(--leading-relaxed);
  }
}

// SM (576px〜767px) - スマートフォン
@include td-responsive('sm') {
  .td-container {
    padding: var(--space-4); // 16px
    max-width: 540px;
  }
  
  .td-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }
}

// MD (768px〜1023px) - タブレット縦向き
@include td-responsive('md') {
  .td-container {
    padding: var(--space-6); // 24px
    max-width: 720px;
  }
  
  .td-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-5);
  }
}

// LG (1024px〜1279px) - タブレット横向き・小型ノートPC
@include td-responsive('lg') {
  .td-container {
    padding: var(--space-8); // 32px
    max-width: 960px;
  }
  
  .td-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-6);
  }
}

// XL (1280px〜1535px) - デスクトップ
@include td-responsive('xl') {
  .td-container {
    padding: var(--space-10); // 40px
    max-width: 1200px;
  }
  
  .td-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: var(--space-8);
  }
}

// 2XL (1536px〜) - 大型デスクトップ
@include td-responsive('2xl') {
  .td-container {
    padding: var(--space-12); // 48px
    max-width: 1400px;
  }
  
  .td-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: var(--space-10);
  }
}
```

## 📱 タッチ操作対応

### タッチターゲットサイズ
```scss
// 最小タッチターゲット（44px × 44px）
.td-touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-3);
  
  // アクセシビリティ向上のため、さらに大きくする場合
  &.td-touch-large {
    min-height: 48px;
    min-width: 48px;
    padding: var(--space-4);
  }
}

// タッチデバイスでのホバー効果無効化
@media (hover: none) and (pointer: coarse) {
  .td-hover-effect:hover {
    transform: none;
    box-shadow: none;
  }
}

// デスクトップでのみホバー効果を適用
@media (hover: hover) and (pointer: fine) {
  .td-hover-effect:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
}
```

### スワイプ・ジェスチャー対応
```css
/* スワイプ可能要素 */
.td-swipeable {
  touch-action: pan-x;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* 水平スクロール */
.td-scroll-horizontal {
  display: flex;
  gap: var(--space-4);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: var(--space-4);
}

.td-scroll-horizontal > * {
  flex: 0 0 auto;
  scroll-snap-align: start;
}
```

## 🎭 アニメーション設計原則

### アニメーション哲学
- **意味のあるアニメーション**: 目的と意図が明確
- **パフォーマンス重視**: 60FPS維持、GPU使用
- **ユーザー設定尊重**: reduced-motion対応
- **一貫性**: 統一されたタイミング・イージング

### TD アニメーションライブラリ
```scss
// 基本タイミング
:root {
  --td-duration-instant: 0ms;
  --td-duration-fast: 150ms;
  --td-duration-normal: 200ms;
  --td-duration-slow: 300ms;
  --td-duration-slower: 500ms;
  
  // イージング関数
  --td-ease-linear: linear;
  --td-ease-in: cubic-bezier(0.4, 0, 1, 1);
  --td-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --td-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --td-ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

// アニメーション削減設定への対応
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 基本アニメーション
```scss
// フェードイン・アウト
@keyframes td-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes td-fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

// スライドアニメーション
@keyframes td-slide-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes td-slide-in-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes td-slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes td-slide-in-right {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// スケールアニメーション
@keyframes td-scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes td-scale-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
}

// 回転アニメーション
@keyframes td-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// パルスアニメーション
@keyframes td-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

// バウンスアニメーション
@keyframes td-bounce {
  0%, 20%, 53%, 80%, 100% {
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
    transform: translate3d(0, -30px, 0);
  }
  70% {
    animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
    transform: translate3d(0, -15px, 0);
  }
  90% { transform: translate3d(0,-4px,0); }
}
```

### TDキャラクター専用アニメーション
```scss
// TD wiggle（お茶目な動き）
@keyframes td-wiggle {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

// TD heartbeat（ドキドキ）
@keyframes td-heartbeat {
  0%, 50%, 100% { transform: scale(1); }
  25% { transform: scale(1.1); }
  75% { transform: scale(0.9); }
}

// TD float（ふわふわ）
@keyframes td-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

// TD thinking（考え中）
@keyframes td-thinking {
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(-2deg) scale(1.02); }
  50% { transform: rotate(2deg) scale(0.98); }
  75% { transform: rotate(-1deg) scale(1.01); }
}

// 使用例
.td-character {
  &.td-wiggle { animation: td-wiggle 1s ease-in-out infinite; }
  &.td-heartbeat { animation: td-heartbeat 1.5s ease-in-out infinite; }
  &.td-float { animation: td-float 3s ease-in-out infinite; }
  &.td-thinking { animation: td-thinking 2s ease-in-out infinite; }
}
```

## 🎮 インタラクションパターン

### ホバーエフェクト
```scss
// 基本ホバー効果
.td-hover-lift {
  transition: transform var(--td-duration-normal) var(--td-ease-out);
  
  @media (hover: hover) {
    &:hover {
      transform: translateY(-2px);
    }
  }
}

.td-hover-scale {
  transition: transform var(--td-duration-normal) var(--td-ease-out);
  
  @media (hover: hover) {
    &:hover {
      transform: scale(1.05);
    }
  }
}

.td-hover-shadow {
  transition: box-shadow var(--td-duration-normal) var(--td-ease-out);
  
  @media (hover: hover) {
    &:hover {
      box-shadow: var(--shadow-xl);
    }
  }
}

// 組み合わせホバー効果
.td-hover-interactive {
  transition: all var(--td-duration-normal) var(--td-ease-out);
  
  @media (hover: hover) {
    &:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: var(--shadow-xl);
    }
  }
}
```

### フォーカス効果
```scss
.td-focus-ring {
  outline: none;
  transition: box-shadow var(--td-duration-fast) var(--td-ease-out);
  
  &:focus-visible {
    box-shadow: 0 0 0 2px white, 0 0 0 4px var(--td-primary-500);
  }
}

.td-focus-glow {
  outline: none;
  transition: box-shadow var(--td-duration-fast) var(--td-ease-out);
  
  &:focus-visible {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
  }
}
```

### アクティブ効果
```scss
.td-active-press {
  transition: transform var(--td-duration-fast) var(--td-ease-in-out);
  
  &:active {
    transform: scale(0.95);
  }
}

.td-active-sink {
  transition: transform var(--td-duration-fast) var(--td-ease-in-out);
  
  &:active {
    transform: translateY(1px);
  }
}
```

## 🌊 ページトランジション

### ページ遷移アニメーション
```scss
// ページフェードイン
.td-page-enter {
  animation: td-fade-in var(--td-duration-slow) var(--td-ease-out);
}

// ページスライドイン
.td-page-slide-enter {
  animation: td-slide-in-right var(--td-duration-slow) var(--td-ease-out);
}

// モーダル表示
.td-modal-enter {
  animation: td-scale-in var(--td-duration-normal) var(--td-ease-out);
}

.td-modal-backdrop {
  animation: td-fade-in var(--td-duration-normal) var(--td-ease-out);
}

// ドロワー表示
.td-drawer-enter-left {
  animation: td-slide-in-left var(--td-duration-normal) var(--td-ease-out);
}

.td-drawer-enter-right {
  animation: td-slide-in-right var(--td-duration-normal) var(--td-ease-out);
}
```

### ローディングアニメーション
```scss
// スピナー
.td-spinner {
  animation: td-spin 1s linear infinite;
}

// パルス
.td-pulse {
  animation: td-pulse 2s ease-in-out infinite;
}

// ドット跳ね
@keyframes td-bounce-dots {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.td-loading-dots {
  display: flex;
  gap: var(--space-1);
  
  & > div {
    width: 8px;
    height: 8px;
    background: var(--td-primary-500);
    border-radius: 50%;
    animation: td-bounce-dots 1.4s ease-in-out infinite both;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
    &:nth-child(3) { animation-delay: 0s; }
  }
}

// プログレスバー
@keyframes td-progress-indeterminate {
  0% {
    left: -35%;
    right: 100%;
  }
  60% {
    left: 100%;
    right: -90%;
  }
  100% {
    left: 100%;
    right: -90%;
  }
}

.td-progress-indeterminate {
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: var(--td-primary-500);
    animation: td-progress-indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
  }
}
```

## 📊 データ表示アニメーション

### カウントアップ
```scss
// 数値カウントアップアニメーション
@keyframes td-count-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.td-count-up {
  animation: td-count-up var(--td-duration-slow) var(--td-ease-out);
}
```

### リスト項目アニメーション
```scss
// 順次表示アニメーション
.td-stagger-item {
  opacity: 0;
  transform: translateY(20px);
  animation: td-slide-in-up var(--td-duration-normal) var(--td-ease-out);
  animation-fill-mode: forwards;
}

.td-stagger-container {
  & > .td-stagger-item:nth-child(1) { animation-delay: 0ms; }
  & > .td-stagger-item:nth-child(2) { animation-delay: 50ms; }
  & > .td-stagger-item:nth-child(3) { animation-delay: 100ms; }
  & > .td-stagger-item:nth-child(4) { animation-delay: 150ms; }
  & > .td-stagger-item:nth-child(5) { animation-delay: 200ms; }
}
```

## 🎯 パフォーマンス最適化

### GPU加速の活用
```scss
// GPU加速を促進するプロパティ
.td-gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
}

// アニメーション中のみwill-changeを適用
.td-animated {
  will-change: transform, opacity;
  
  &:not(.animating) {
    will-change: auto;
  }
}
```

### アニメーション最適化
```scss
// 効率的なアニメーション（transform, opacity のみ使用）
.td-optimized-animation {
  transition: transform var(--td-duration-normal) var(--td-ease-out),
              opacity var(--td-duration-normal) var(--td-ease-out);
}

// レイアウトを変更しないアニメーション
.td-layout-stable {
  /* position, width, height の変更を避ける */
  transform: scale(1.05); /* ❌ width: 110%; の代わりに ✅ */
  opacity: 0.8; /* ❌ visibility: hidden; の代わりに ✅ */
}
```

## 📱 レスポンシブ・アニメーション統合チェックリスト

### デザイン確認
- [ ] 全ブレークポイントで適切に表示される
- [ ] タッチターゲットが44px以上確保されている
- [ ] テキストがreadableに保たれている
- [ ] 重要なコンテンツが適切に優先表示されている

### アニメーション確認
- [ ] 60FPSで滑らかに動作する
- [ ] reduced-motion設定に対応している
- [ ] GPU加速が適切に使用されている
- [ ] アニメーションに明確な目的がある

### パフォーマンス確認
- [ ] CLS（Cumulative Layout Shift）が最小化されている
- [ ] 不要なリフローが発生していない
- [ ] メモリリークが発生していない
- [ ] バッテリー消費が適切

### ユーザビリティ確認
- [ ] デバイス特有の操作（スワイプ等）に対応している
- [ ] 画面の向き変更に適切に対応している
- [ ] アクセシビリティガイドラインに準拠している
- [ ] 直感的で自然な操作感

---

**TDからの最終メッセージ**: 「レスポンシブデザインとアニメーションは、ユーザーとのコミュニケーション手段です。どんなデバイスでも、どんな状況でも、TDと一緒に快適な体験を提供しましょう！📱✨🎭」 