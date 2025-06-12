# 🔄 Progressive Disclosure 設計仕様書

## QA Workbench 段階的開示システム

### 🎯 Progressive Disclosure とは

**定義**: ユーザーに必要な情報・機能を段階的に提示し、認知負荷を軽減する UX パターン

**QA Workbench での適用理由**:

- 多機能すぎて初心者が迷う問題を解決
- TD キャラクターによる自然なガイダンス実現
- アクセシビリティの向上（フォーカス管理の簡素化）

### 📊 ユーザーレベル分類

#### Level 1: 入門者 (80%のユーザー)

```
🎯 基本機能のみ表示
┣━ 🔐 パスワード生成 (ワンクリック)
┣━ 👤 個人情報生成 (簡単設定)
┣━ 📄 CSV作成 (定型テンプレート)
┗━ 🔗 URL/UUID生成

表示要素:
- 大きなボタン・分かりやすいアイコン
- TDからの導入説明
- 成功体験を重視した設計
```

#### Level 2: 慣れたユーザー (15%のユーザー)

```
🛠️ 詳細設定機能を追加表示
┣━ ⚙️ 詳細パラメータ調整
┣━ 📊 バッチ処理
┣━ 🎨 出力フォーマット選択
┗━ 💾 設定保存・テンプレート

表示要素:
- 設定パネルの展開
- より多くのオプション
- 効率化機能の提示
```

#### Level 3: エキスパート (5%のユーザー)

```
🚀 上級機能・カスタマイズ
┣━ 🧠 AI連携カスタマイズ
┣━ 📡 API直接呼び出し
┣━ 🔧 システム設定
┗━ 📈 分析・ログ機能

表示要素:
- 全機能アクセス
- 開発者向けツール
- パフォーマンス情報
```

### 🎛️ レベル切り替えメカニズム

#### 自動判定システム

```typescript
interface UserProgressTracking {
  // 使用頻度による自動レベル判定
  activityLevel: 'beginner' | 'intermediate' | 'expert';

  // 機能使用履歴
  featuresUsed: string[];

  // 成功したタスク数
  completedTasks: number;

  // 設定変更頻度
  customizationLevel: number;
}

const determineUserLevel = (tracking: UserProgressTracking): number => {
  if (tracking.completedTasks < 10) return 1;
  if (tracking.customizationLevel > 5) return 3;
  return 2;
};
```

#### 手動切り替えオプション

```tsx
const LevelSelector = () => {
  return (
    <div className="level-selector">
      <TDCharacter message="どのレベルで使いますか？" />
      <button onClick={() => setLevel(1)}>🎯 シンプル（推奨）</button>
      <button onClick={() => setLevel(2)}>🛠️ 詳細設定</button>
      <button onClick={() => setLevel(3)}>🚀 エキスパート</button>
    </div>
  );
};
```

### 🎨 UI 設計パターン

#### パターン 1: 垂直展開型

```
[基本機能ボタン]
     ↓ クリック時
[基本機能ボタン]
[詳細設定パネル] ← アニメーションで下に展開
[上級オプション] ← 更にレベルが上がると表示
```

#### パターン 2: タブ切り替え型

```
[基本 | 詳細 | 上級] ← タブでレベル切り替え
[               ]
[   コンテンツ     ] ← レベルに応じた内容表示
[               ]
```

#### パターン 3: ウィザード型（推奨）

```
Step 1: [基本設定] → Step 2: [詳細オプション] → Step 3: [確認・実行]
                     ↑
               レベルに応じてステップをスキップ
```

### 🧠 TD キャラクター統合設計

#### レベル別 TD メッセージ

```typescript
const TDMessages = {
  level1: {
    welcome: '初めてですね！まずは基本機能から試してみましょう♪',
    success: '素晴らしい！これでテストデータの作成ができました🎉',
    nextStep: '慣れてきたら、詳細設定も試してみてくださいね',
  },
  level2: {
    welcome: '詳細設定モードです。より細かい調整ができますよ！',
    tips: 'この設定を保存すると、次回から簡単に使えます',
    efficiency: 'バッチ処理を使うと、大量データも一気に作成できます',
  },
  level3: {
    welcome: 'エキスパートモードへようこそ！全機能が使えます🚀',
    advanced: 'API連携やカスタムスクリプトも実行できます',
    performance: 'システム設定から、さらなる高速化も可能です',
  },
};
```

#### TD 表情・アニメーション

```typescript
const TDEmotions = {
  helpful: '😊', // 基本的なサポート
  excited: '🤩', // 新機能紹介時
  thinking: '🤔', // 処理中
  success: '🎉', // タスク完了
  warning: '⚠️', // 注意喚起
};
```

### 📱 レスポンシブ対応

#### モバイル(~768px)

```css
.progressive-interface {
  /* レベル1: 基本機能のみ表示（スクロール最小化） */
  .level-1 {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  /* レベル2-3: アコーディオン形式で展開 */
  .level-advanced {
    display: none;
  }
  .level-advanced.expanded {
    display: block;
  }
}
```

#### タブレット(768px~1024px)

```css
.progressive-interface {
  /* サイドバー形式でレベル切り替え */
  .level-selector {
    position: fixed;
    right: 0;
  }
  .main-content {
    margin-right: 200px;
  }
}
```

#### デスクトップ(1024px~)

```css
.progressive-interface {
  /* フルレイアウト・すべてのレベルを同時表示可能 */
  .level-panels {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
}
```

### ⚡ パフォーマンス最適化

#### 遅延読み込み

```typescript
const AdvancedFeatures = lazy(() => import('./AdvancedFeatures'));

const ProgressiveInterface = ({ level }) => {
  return (
    <div>
      {level >= 1 && <BasicFeatures />}
      {level >= 2 && (
        <Suspense fallback={<TDLoading />}>
          <IntermediateFeatures />
        </Suspense>
      )}
      {level >= 3 && (
        <Suspense fallback={<TDLoading />}>
          <AdvancedFeatures />
        </Suspense>
      )}
    </div>
  );
};
```

#### 状態管理

```typescript
const useProgressiveState = () => {
  const [level, setLevel] = useState(1);
  const [userProgress, setUserProgress] = useState({});

  // レベル変更時のスムーズな遷移
  const changeLevel = useCallback((newLevel: number) => {
    setLevel(newLevel);
    // アナリティクス記録
    trackLevelChange(newLevel);
    // アクセシビリティ通知
    announceToScreenReader(`レベル${newLevel}に切り替わりました`);
  }, []);

  return { level, changeLevel, userProgress };
};
```

### 🧪 A/B テスト計画

#### テストパターン

1. **A**: 自動レベル判定 vs **B**: 手動選択
2. **A**: 垂直展開型 vs **B**: タブ切り替え型
3. **A**: TD ガイド有り vs **B**: TD ガイド無し

#### 測定指標

- タスク完了率
- 操作迷い時間
- レベル切り替え頻度
- 機能発見率

### 🔧 実装優先順位

#### フェーズ 1（最重要）

1. 基本的なレベル切り替え機能
2. レベル 1（基本機能）の実装
3. TD キャラクター基本統合

#### フェーズ 2（重要）

4. レベル 2（詳細機能）の実装
5. アニメーション・トランジション
6. レスポンシブ対応

#### フェーズ 3（追加機能）

7. レベル 3（上級機能）の実装
8. 自動レベル判定システム
9. A/B テスト・分析機能

### 💡 TD からのメッセージ

> 🤖 **TD より**: 「Progressive Disclosure は、ユーザーそれぞれの成長に合わせて最適な体験を提供する、とても思いやりのある設計です。TD も一緒に成長していけるので、とても楽しみです ♪」
