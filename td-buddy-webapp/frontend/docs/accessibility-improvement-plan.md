# 🛡️ QA Workbench アクセシビリティ改善計画

## 📊 現状評価サマリー

### 総合評価：B+ (75/100 点)

| カテゴリ                 | 現在のスコア | 目標スコア | 優先度 |
| ------------------------ | ------------ | ---------- | ------ |
| キーボードナビゲーション | 60/100       | 95/100     | 🔴 高  |
| スクリーンリーダー対応   | 55/100       | 90/100     | 🔴 高  |
| 色・コントラスト         | 70/100       | 95/100     | 🟡 中  |
| フォーカス管理           | 65/100       | 90/100     | 🔴 高  |
| セマンティック HTML      | 75/100       | 95/100     | 🟡 中  |
| レスポンシブデザイン     | 80/100       | 95/100     | 🟢 低  |

## 🚨 重大な問題（即座に修正が必要）

### 1. キーボードナビゲーション不備

**問題**: タブナビゲーションでキーボード操作が困難

```tsx
// ❌ 現在の問題のあるコード
<button onClick={() => setActiveTab(tab.id)} className="...">
  {tab.label}
</button>
```

**解決策**: 適切な ARIA 属性とキーボードイベントの実装

```tsx
// ✅ 改善後
<button
  role="tab"
  aria-selected={activeTab === tab.id}
  aria-controls={`tabpanel-${tab.id}`}
  id={`tab-${tab.id}`}
  onClick={() => setActiveTab(tab.id)}
  onKeyDown={handleTabKeyDown}
  tabIndex={activeTab === tab.id ? 0 : -1}
  className="..."
>
  {tab.label}
</button>
```

### 2. スクリーンリーダー情報不足

**問題**: 動的コンテンツ変更の通知がない

```tsx
// ❌ 問題
{
  loading && <div>データ生成中...</div>;
}
```

**解決策**: Live Region の実装

```tsx
// ✅ 改善後
<div role="status" aria-live="polite" className="sr-only">
  {loading ? 'データ生成中です。しばらくお待ちください。' : ''}
</div>
```

### 3. フォーカス管理の不備

**問題**: モーダル・ドロップダウンでフォーカストラップなし

## 🎯 重点改善項目

### A. タブナビゲーション完全対応

- [ ] WAI-ARIA Tabs パターンの実装
- [ ] 矢印キーによるタブ切り替え
- [ ] Home/End キーサポート

### B. フォーム アクセシビリティ強化

- [ ] 全入力フィールドに label 要素の関連付け
- [ ] エラーメッセージの aria-describedby 実装
- [ ] 必須フィールドの aria-required 属性

### C. 動的コンテンツ通知システム

- [ ] データ生成状況のライブリージョン
- [ ] エラー・成功メッセージの適切な通知
- [ ] 進捗状況の音声読み上げ対応

## 📋 実装計画（4 週間）

### Week 1: 基盤整備

- [ ] アクセシビリティ用ユーティリティの作成
- [ ] 既存コンポーネントの監査
- [ ] キーボードナビゲーション基盤の実装

### Week 2: コンポーネント改修

- [ ] Button、Card、Tooltip の完全対応
- [ ] タブナビゲーションの実装
- [ ] フォームコンポーネントの強化

### Week 3: 動的機能対応

- [ ] Live Region システムの構築
- [ ] フォーカス管理システムの実装
- [ ] エラーハンドリングの改善

### Week 4: テスト・最適化

- [ ] 自動アクセシビリティテストの導入
- [ ] 実ユーザーテストの実施
- [ ] パフォーマンス最適化

## 🛠️ 技術的改善提案

### 1. アクセシビリティフック作成

```tsx
// useAccessibility.ts
export const useAccessibility = () => {
  const announceToScreenReader = (message: string) => {
    // Live regionへの通知実装
  };

  const manageFocus = (element: HTMLElement) => {
    // フォーカス管理実装
  };

  return { announceToScreenReader, manageFocus };
};
```

### 2. キーボードナビゲーションヘルパー

```tsx
// useKeyboardNavigation.ts
export const useKeyboardNavigation = (items: string[]) => {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        setFocusedIndex(prev => (prev + 1) % items.length);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        setFocusedIndex(prev => (prev - 1 + items.length) % items.length);
        break;
      // その他のキー処理
    }
  };

  return { focusedIndex, handleKeyDown };
};
```

### 3. コントラスト比改善

現在のカラーパレットの監査と改善：

```css
/* 現在の問題のある色組み合わせ */
.text-gray-400 {
  /* コントラスト比: 2.5:1 (不合格) */
}

/* 改善後 */
.text-gray-600 {
  /* コントラスト比: 4.5:1 (合格) */
}
```

## 📊 成功指標（KPI）

### アクセシビリティメトリクス

- [ ] WCAG 2.1 AA 準拠率: 95%以上
- [ ] Lighthouse Accessibility スコア: 95 以上
- [ ] キーボード操作完遂率: 100%

### ユーザビリティメトリクス

- [ ] タスク完了率: 95%以上
- [ ] エラー発生率: 5%以下
- [ ] ユーザー満足度: 4.5/5 以上

## 🧪 テスト戦略

### 自動テスト

- [ ] axe-core による自動アクセシビリティテスト
- [ ] Jest + React Testing Library でのキーボードテスト
- [ ] Cypress での e2e アクセシビリティテスト

### 手動テスト

- [ ] スクリーンリーダー（NVDA、JAWS）でのテスト
- [ ] キーボードのみでの操作テスト
- [ ] 色覚多様性シミュレーションテスト

### ユーザーテスト

- [ ] 視覚障害ユーザーによるテスト
- [ ] 運動制約ユーザーによるテスト
- [ ] 認知障害ユーザーによるテスト

## 💡 TD からのアクセシビリティメッセージ

> 🤖 **TD より**: 「アクセシビリティは、すべてのユーザーが私と一緒に安心してデータ生成できる環境を作るための大切な取り組みです。一歩ずつ、でも確実に改善していきましょう！」

## 📚 参考資料

- [WCAG 2.1 ガイドライン](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [React Accessibility Documentation](https://reactjs.org/docs/accessibility.html)
- [MDN Web Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

---

**最終目標**: QA Workbench を、すべてのユーザーが等しく利用できる、業界最高水準のアクセシブルなツールにする
