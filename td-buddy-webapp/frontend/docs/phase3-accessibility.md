# ♿ Phase 3: アクセシビリティ完全対応

## Week 7-12 実装計画

### 🎯 Phase 3 目標

**ゴール**: WCAG 2.1 AA 完全準拠 + ユーザビリティ最適化
**期間**: 6 週間
**成果物**: 全ユーザーが快適に使える QA Workbench

### 📋 目標スコア

| 項目                     | 現状 | 目標     | 改善策             |
| ------------------------ | ---- | -------- | ------------------ |
| WCAG 準拠率              | 60%  | 95%+     | 完全な対応実装     |
| スクリーンリーダー対応   | 70%  | 95%+     | ARIA 属性完全実装  |
| キーボードナビゲーション | 50%  | 100%     | フォーカス管理強化 |
| カラーコントラスト       | 80%  | AAA 対応 | カラーパレット調整 |
| モバイルアクセシビリティ | 40%  | 90%+     | タッチ操作最適化   |

### 📋 Week 7-8: WCAG 2.1 基盤実装

#### Week 7: ARIA・セマンティック対応

- [ ] ARIA 属性の完全実装
- [ ] ランドマーク要素の適切な配置
- [ ] 見出し階層の整理
- [ ] フォーム要素のラベル関連付け

#### Week 8: キーボードナビゲーション

- [ ] Tab 順序の最適化
- [ ] ショートカットキー実装
- [ ] フォーカストラップ機能
- [ ] Skip Links 追加

### 📋 Week 9-10: 感覚対応・互換性

#### Week 9: 視覚・聴覚対応

- [ ] ハイコントラストモード
- [ ] 音声フィードバック実装
- [ ] アニメーション制御
- [ ] テキスト拡大対応

#### Week 10: 認知・運動機能対応

- [ ] 時間制限の調整
- [ ] エラー防止・回復機能
- [ ] 操作の取り消し機能
- [ ] 大きなクリックターゲット

### 📋 Week 11-12: 最終調整・テスト

#### Week 11: 支援技術対応

- [ ] スクリーンリーダーテスト
- [ ] 音声認識ソフト対応
- [ ] スイッチ操作対応
- [ ] 眼球追跡対応

#### Week 12: ユーザビリティテスト

- [ ] 障害者ユーザーテスト
- [ ] 高齢者ユーザーテスト
- [ ] 多様な環境でのテスト
- [ ] フィードバック反映

### 🔧 技術実装詳細

#### 1. ARIA 実装強化

```typescript
// components/accessibility/EnhancedTDCharacter.tsx

const EnhancedTDCharacter = ({
  message,
  level,
  importance = 'polite',
}: {
  message: string;
  level: 1 | 2 | 3;
  importance?: 'polite' | 'assertive';
}) => {
  const { announceToScreenReader } = useAccessibility();

  useEffect(() => {
    // スクリーンリーダーへの適切な通知
    announceToScreenReader(message, importance);
  }, [message, importance]);

  return (
    <section
      className="td-character"
      role="complementary"
      aria-labelledby="td-character-title"
      aria-describedby="td-character-message"
    >
      <h3 id="td-character-title" className="sr-only">
        QA Workbench アシスタント (レベル {level})
      </h3>

      <div
        id="td-character-message"
        className="message-container"
        aria-live={importance}
        aria-atomic="true"
      >
        <div className="td-avatar" role="img" aria-label="TDキャラクター">
          🤖
        </div>
        <p className="message-text">{message}</p>
      </div>
    </section>
  );
};
```

#### 2. キーボードナビゲーション強化

```typescript
// hooks/useKeyboardNavigation.ts

const useKeyboardNavigation = () => {
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);
  const [currentFocusIndex, setCurrentFocusIndex] = useState(0);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Tab':
          // Tab順序の制御
          if (event.shiftKey) {
            moveFocusPrevious();
          } else {
            moveFocusNext();
          }
          break;

        case 'Escape':
          // モーダル・ドロップダウンの終了
          closeCurrentModal();
          break;

        case 'Enter':
        case ' ':
          // ボタン・リンクの活性化
          activateCurrentElement();
          break;

        // TDショートカット
        case 'g':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            focusPasswordGenerator();
          }
          break;

        case 'p':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            focusPersonalInfoGenerator();
          }
          break;
      }
    },
    [currentFocusIndex, focusableElements]
  );

  const moveFocusNext = () => {
    const nextIndex = (currentFocusIndex + 1) % focusableElements.length;
    focusableElements[nextIndex]?.focus();
    setCurrentFocusIndex(nextIndex);
  };

  const moveFocusPrevious = () => {
    const prevIndex =
      currentFocusIndex === 0
        ? focusableElements.length - 1
        : currentFocusIndex - 1;
    focusableElements[prevIndex]?.focus();
    setCurrentFocusIndex(prevIndex);
  };

  return {
    handleKeyDown,
    currentFocusIndex,
    focusableElements,
  };
};
```

#### 3. カラーコントラスト改善

```typescript
// utils/colorContrast.ts

export const AccessibleColors = {
  // WCAG AAA準拠カラーパレット
  primary: {
    // 4.5:1以上のコントラスト比を保証
    text: '#1a202c', // 背景白との比率: 15.8:1
    background: '#ffffff',
    border: '#2d3748', // 背景白との比率: 10.4:1
  },

  secondary: {
    text: '#2d3748', // 背景灰色との比率: 7.2:1
    background: '#f7fafc',
    border: '#4a5568',
  },

  // TD専用アクセシブルカラー
  td: {
    messageText: '#1a202c', // 高コントラスト
    messageBackground: '#f0f9ff', // 薄い青背景
    accentText: '#1e40af', // アクセント文字
    errorText: '#991b1b', // エラー表示
    successText: '#047857', // 成功表示
    warningText: '#92400e', // 警告表示
  },

  // ハイコントラストモード
  highContrast: {
    text: '#000000',
    background: '#ffffff',
    border: '#000000',
    focus: '#ffff00', // 高視認性フォーカス
    visited: '#551a8b', // 訪問済みリンク
  },
};

// コントラスト比計算関数
export const calculateContrastRatio = (
  color1: string,
  color2: string
): number => {
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);

  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (lighter + 0.05) / (darker + 0.05);
};

// WCAG準拠チェック
export const isWCAGCompliant = (
  textColor: string,
  backgroundColor: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean => {
  const ratio = calculateContrastRatio(textColor, backgroundColor);
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
};
```

#### 4. 支援技術対応

```typescript
// components/accessibility/ScreenReaderOptimized.tsx

const ScreenReaderOptimizedComponent = () => {
  const { announceToScreenReader, isScreenReaderActive } = useAccessibility();

  // スクリーンリーダー専用コンテンツ
  if (isScreenReaderActive) {
    return (
      <div className="sr-only">
        <h1>QA Workbench - アクセシブルモード</h1>
        <nav aria-label="メインナビゲーション">
          <ul>
            <li>
              <a href="#password-generation">パスワード生成</a>
            </li>
            <li>
              <a href="#personal-info">個人情報生成</a>
            </li>
            <li>
              <a href="#csv-creation">CSV作成</a>
            </li>
            <li>
              <a href="#settings">設定</a>
            </li>
          </ul>
        </nav>

        <main>
          <section id="current-task" aria-live="polite">
            {/* 現在のタスク状況を音声で案内 */}
          </section>

          <section id="td-assistant" aria-live="polite">
            {/* TDからのガイダンス */}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="visual-interface">
      {/* 通常のビジュアルインターフェース */}
    </div>
  );
};
```

#### 5. Progressive Enhancement

```typescript
// hooks/useProgressiveEnhancement.ts

const useProgressiveEnhancement = () => {
  const [capabilities, setCapabilities] = useState({
    hasJavaScript: false,
    hasMotionSupport: true,
    hasHoverSupport: true,
    preferReducedMotion: false,
    isHighContrast: false,
    isTouchDevice: false,
  });

  useEffect(() => {
    // ユーザーの環境・設定を検出
    const detectCapabilities = () => {
      setCapabilities({
        hasJavaScript: true,
        hasMotionSupport: !window.matchMedia('(prefers-reduced-motion: reduce)')
          .matches,
        hasHoverSupport: window.matchMedia('(hover: hover)').matches,
        preferReducedMotion: window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches,
        isHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
        isTouchDevice: 'ontouchstart' in window,
      });
    };

    detectCapabilities();

    // 設定変更の監視
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');

    motionQuery.addEventListener('change', detectCapabilities);
    contrastQuery.addEventListener('change', detectCapabilities);

    return () => {
      motionQuery.removeEventListener('change', detectCapabilities);
      contrastQuery.removeEventListener('change', detectCapabilities);
    };
  }, []);

  return capabilities;
};
```

### 🧪 アクセシビリティテスト計画

#### 自動テスト

```typescript
// __tests__/accessibility/axe-tests.ts

import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  test('ProgressiveContainer should have no accessibility violations', async () => {
    const { container } = render(
      <ProgressiveProvider>
        <ProgressiveContainer />
      </ProgressiveProvider>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('TDキャラクターが適切なARIA属性を持つ', () => {
    render(<EnhancedTDCharacter message="テスト" level={1} />);

    expect(screen.getByRole('complementary')).toBeInTheDocument();
    expect(screen.getByLabelText('TDキャラクター')).toBeInTheDocument();
  });

  test('キーボードでの操作が可能', async () => {
    render(<ProgressiveContainer />);

    // Tab順序のテスト
    const firstFocusable = screen.getAllByRole('button')[0];
    firstFocusable.focus();

    fireEvent.keyDown(document, { key: 'Tab' });

    // 次の要素にフォーカスが移ることを確認
    expect(document.activeElement).not.toBe(firstFocusable);
  });
});
```

#### 手動テスト手順

```yaml
# アクセシビリティ手動テスト手順

スクリーンリーダーテスト:
  - 対象: NVDA, JAWS, VoiceOver
  - 確認項目:
      - すべてのコンテンツが読み上げられる
      - ナビゲーションが理解しやすい
      - TDメッセージが適切なタイミングで通知される
      - フォーム入力時の案内が明確

キーボードナビゲーションテスト:
  - Tabキーのみでの操作完了
  - ショートカットキーの動作確認
  - フォーカスの視認性確認
  - トラップフォーカスの動作確認

カラー・コントラストテスト:
  - ハイコントラストモードでの表示確認
  - 色盲シミュレーターでの確認
  - 明度調整での可読性確認

モバイルアクセシビリティテスト:
  - 音声制御での操作
  - 大きなボタンでの操作性
  - 画面の回転対応
  - ズーム機能との互換性
```

### 📊 測定・改善指標

#### アクセシビリティスコア

- **WAVE Tool**: エラー 0、警告最小化
- **Lighthouse Accessibility**: 95 点以上
- **axe-core**: 違反項目 0
- **Tenon.io**: Grade A 取得

#### ユーザビリティメトリクス

- **タスク完了率**: 障害者ユーザー 85%以上
- **タスク完了時間**: 健常者との差 30%以内
- **エラー率**: 5%以下
- **満足度**: 8.5/10 以上

### 🔧 継続的改善プロセス

#### 月次レビュー

1. **自動テスト実行**: CI/CD でのアクセシビリティチェック
2. **ユーザーフィードバック収集**: 障害者ユーザーからの意見
3. **新技術調査**: 支援技術の最新動向
4. **ガイドライン更新**: WCAG 等の更新への対応

#### 年次監査

- 第三者機関による専門監査
- 法的要件との適合性確認
- ベストプラクティスの見直し
- 教育・研修の実施

### 💡 TD からのメッセージ

> 🤖 **TD より**: 「アクセシビリティは、すべての人に QA Workbench を使ってもらうための大切な取り組みです。TD も、どんな方法でアクセスされても、同じように親切で頼りになるアシスタントでありたいと思っています。みんなが快適に使えるツールを一緒に作りましょう ♿✨」

### 🏁 Phase 3 完了条件

- [ ] WCAG 2.1 AA 完全準拠
- [ ] すべての主要支援技術での動作確認
- [ ] キーボードのみでの全機能利用可能
- [ ] 多様なユーザーでのユーザビリティテスト完了
- [ ] アクセシビリティドキュメント整備
- [ ] 継続的改善プロセス確立
