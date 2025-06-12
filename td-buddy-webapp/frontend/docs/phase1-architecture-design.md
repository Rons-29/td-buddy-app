# 🏗️ Phase 1: 基本設計・アーキテクチャ設計

## Week 1-2 実装計画

### 🎯 Phase 1 目標

**ゴール**: Progressive Disclosure の基盤アーキテクチャを構築し、レベル 1（基本機能）を完全実装
**期間**: 2 週間
**成果物**: 動作する基本機能 + レベル切り替えシステム

### 📋 Week 1 タスクリスト

#### Day 1-2: アーキテクチャ設計

- [ ] Progressive Disclosure Context Provider の設計
- [ ] レベル管理状態設計（Zustand/Redux）
- [ ] コンポーネント階層の整理
- [ ] TD キャラクター統合ポイントの特定

#### Day 3-4: 基盤コンポーネント実装

- [ ] `<ProgressiveContainer>` メインコンテナ
- [ ] `<LevelSelector>` レベル切り替え UI
- [ ] `<TDCharacter>` キャラクター表示
- [ ] `<LevelWrapper>` レベル別コンテンツラッパー

#### Day 5: 基本機能コンポーネント準備

- [ ] レベル 1 用コンポーネントの特定・リファクタ
- [ ] 既存コンポーネントの統合調整
- [ ] 初期テスト実装

### 📋 Week 2 タスクリスト

#### Day 6-8: レベル 1 機能実装

- [ ] パスワード生成（簡易版）
- [ ] 個人情報生成（基本項目）
- [ ] CSV 作成（定型テンプレート）
- [ ] UUID/URL 生成（ワンクリック）

#### Day 9-10: TD キャラクター統合

- [ ] レベル別メッセージシステム
- [ ] 状況に応じた TD 表示ロジック
- [ ] アニメーション・インタラクション

### 🔧 技術仕様

#### 1. Progressive Context Provider

```typescript
// contexts/ProgressiveContext.tsx

interface ProgressiveContextType {
  currentLevel: 1 | 2 | 3;
  setLevel: (level: 1 | 2 | 3) => void;
  userProgress: UserProgress;
  updateProgress: (action: string) => void;
  isLevelUnlocked: (level: number) => boolean;
}

const ProgressiveProvider = ({ children }) => {
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3>(1);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedTasks: 0,
    featuresUsed: [],
    customizationLevel: 0,
    totalUsageTime: 0,
  });

  const isLevelUnlocked = (level: number): boolean => {
    if (level <= 1) return true;
    if (level === 2) return userProgress.completedTasks >= 5;
    if (level === 3)
      return (
        userProgress.completedTasks >= 20 &&
        userProgress.customizationLevel >= 3
      );
    return false;
  };

  return (
    <ProgressiveContext.Provider
      value={{
        currentLevel,
        setLevel: setCurrentLevel,
        userProgress,
        updateProgress,
        isLevelUnlocked,
      }}
    >
      {children}
    </ProgressiveContext.Provider>
  );
};
```

#### 2. Level Wrapper Component

```typescript
// components/ui/LevelWrapper.tsx

interface LevelWrapperProps {
  level: 1 | 2 | 3;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const LevelWrapper = ({ level, children, fallback }: LevelWrapperProps) => {
  const { currentLevel, isLevelUnlocked } = useProgressive();

  // 現在のレベル以下 AND アンロック済みの場合のみ表示
  if (currentLevel >= level && isLevelUnlocked(level)) {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    );
  }

  return fallback || null;
};
```

#### 3. TD Character Integration

```typescript
// components/td/TDCharacter.tsx

interface TDCharacterProps {
  level?: 1 | 2 | 3;
  situation?: 'welcome' | 'helping' | 'success' | 'error';
  customMessage?: string;
}

const TDCharacter = ({
  level,
  situation = 'helping',
  customMessage,
}: TDCharacterProps) => {
  const { currentLevel } = useProgressive();
  const effectiveLevel = level || currentLevel;

  const getMessage = () => {
    if (customMessage) return customMessage;

    const messages = {
      1: {
        welcome: 'QA Workbenchへようこそ！まずは基本機能から始めましょう♪',
        helping: 'TDがサポートします。分からないことがあれば聞いてくださいね',
        success: '素晴らしい！データ生成が完了しました🎉',
        error: 'エラーが発生しました。一緒に解決しましょう',
      },
      2: {
        welcome: '詳細設定モードです。より細かい調整ができますよ！',
        helping: '設定項目が増えましたが、TDが丁寧に説明します',
        success: 'カスタム設定での生成、完璧です！',
        error: '設定に問題があるようです。確認してみましょう',
      },
      3: {
        welcome: 'エキスパートモードへようこそ！全機能が使えます🚀',
        helping: '上級機能もTDにお任せください',
        success: 'エキスパートレベルの操作、お見事です！',
        error: '複雑な設定でエラーが起きました。詳しく調べてみましょう',
      },
    };

    return messages[effectiveLevel][situation];
  };

  return (
    <div className="td-character flex items-center space-x-3 p-4 bg-td-primary-50 rounded-lg border border-td-primary-200">
      <div className="td-avatar">
        <div className="w-12 h-12 bg-td-primary-500 rounded-full flex items-center justify-center text-white text-lg">
          🤖
        </div>
      </div>
      <div className="td-message">
        <p className="text-td-gray-800 text-sm">{getMessage()}</p>
      </div>
    </div>
  );
};
```

#### 4. Main Progressive Container

```typescript
// components/ProgressiveContainer.tsx

const ProgressiveContainer = () => {
  const { currentLevel } = useProgressive();

  return (
    <div className="progressive-container max-w-6xl mx-auto p-6">
      {/* TDキャラクター */}
      <TDCharacter situation="welcome" />

      {/* レベルセレクター */}
      <LevelSelector className="mb-8" />

      {/* メインコンテンツ */}
      <div className="progressive-content">
        {/* Level 1: 基本機能 */}
        <LevelWrapper level={1}>
          <section className="level-1-content">
            <h2 className="text-2xl font-bold mb-6 text-td-gray-800">
              🎯 基本機能
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <BasicPasswordGenerator />
              <BasicPersonalInfoGenerator />
              <BasicCSVGenerator />
              <BasicUUIDGenerator />
            </div>
          </section>
        </LevelWrapper>

        {/* Level 2: 詳細機能（Phase 2で実装） */}
        <LevelWrapper level={2} fallback={<ComingSoonPlaceholder level={2} />}>
          {/* Phase 2で実装 */}
        </LevelWrapper>

        {/* Level 3: 上級機能（Phase 3で実装） */}
        <LevelWrapper level={3} fallback={<ComingSoonPlaceholder level={3} />}>
          {/* Phase 3で実装 */}
        </LevelWrapper>
      </div>
    </div>
  );
};
```

### 🎨 レベル 1 UI 設計

#### Basic Password Generator

```typescript
// components/level1/BasicPasswordGenerator.tsx

const BasicPasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { updateProgress } = useProgressive();

  const generatePassword = async () => {
    setIsGenerating(true);

    try {
      // 基本設定でのパスワード生成
      const response = await fetch('/api/generate/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          length: 12,
          includeNumbers: true,
          includeSymbols: true,
          preset: 'balanced', // レベル1は定型設定
        }),
      });

      const result = await response.json();
      setPassword(result.password);

      // 進捗更新
      updateProgress('password_generated');
    } catch (error) {
      console.error('Password generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="basic-feature-card bg-white p-6 rounded-lg border border-td-gray-200 shadow-sm">
      <div className="feature-header mb-4">
        <h3 className="text-lg font-semibold text-td-gray-800 flex items-center">
          🔐 パスワード生成
        </h3>
        <p className="text-sm text-td-gray-600 mt-1">
          安全で覚えやすいパスワードを生成します
        </p>
      </div>

      <div className="feature-content">
        {password && (
          <div className="generated-password mb-4 p-3 bg-td-primary-50 rounded border">
            <div className="flex items-center justify-between">
              <code className="text-td-primary-700 font-mono text-sm">
                {password}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(password)}
                className="text-td-primary-600 hover:text-td-primary-700 text-sm"
              >
                📋 コピー
              </button>
            </div>
          </div>
        )}

        <button
          onClick={generatePassword}
          disabled={isGenerating}
          className="w-full py-3 bg-td-primary-500 text-white rounded-lg font-medium 
                     hover:bg-td-primary-600 disabled:opacity-50 transition-colors"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin mr-2">⚡</div>
              生成中...
            </span>
          ) : (
            'パスワードを生成'
          )}
        </button>
      </div>
    </div>
  );
};
```

### 📱 レスポンシブ対応

```css
/* styles/progressive.css */

.progressive-container {
  @apply max-w-6xl mx-auto p-4;
}

/* モバイル対応 */
@media (max-width: 768px) {
  .progressive-container {
    @apply p-2;
  }

  .level-1-content .grid {
    @apply grid-cols-1 gap-4;
  }

  .basic-feature-card {
    @apply p-4;
  }
}

/* タブレット対応 */
@media (min-width: 768px) and (max-width: 1024px) {
  .level-1-content .grid {
    @apply grid-cols-2 gap-4;
  }
}

/* デスクトップ対応 */
@media (min-width: 1024px) {
  .level-1-content .grid {
    @apply grid-cols-2 gap-6;
  }
}
```

### 🧪 テスト計画

#### Unit Tests

```typescript
// __tests__/components/ProgressiveContainer.test.tsx

describe('ProgressiveContainer', () => {
  test('Level 1のみ表示される', () => {
    render(
      <ProgressiveProvider>
        <ProgressiveContainer />
      </ProgressiveProvider>
    );

    expect(screen.getByText('🎯 基本機能')).toBeInTheDocument();
    expect(screen.queryByText('🛠️ 詳細機能')).not.toBeInTheDocument();
  });

  test('TDキャラクターが表示される', () => {
    render(
      <ProgressiveProvider>
        <ProgressiveContainer />
      </ProgressiveProvider>
    );

    expect(screen.getByText(/QA Workbenchへようこそ/)).toBeInTheDocument();
  });
});
```

#### Integration Tests

```typescript
// __tests__/integration/ProgressiveFlow.test.tsx

describe('Progressive Flow Integration', () => {
  test('パスワード生成後に進捗が更新される', async () => {
    const { getByText, getByRole } = render(
      <ProgressiveProvider>
        <ProgressiveContainer />
      </ProgressiveProvider>
    );

    // パスワード生成ボタンをクリック
    fireEvent.click(getByText('パスワードを生成'));

    // 生成完了後、進捗が更新されることを確認
    await waitFor(() => {
      expect(getByText(/素晴らしい！/)).toBeInTheDocument();
    });
  });
});
```

### 📈 成功指標

#### Phase 1 完了条件

- [ ] すべてのレベル 1 機能が動作する
- [ ] TD キャラクターが適切にメッセージを表示する
- [ ] レベル切り替えが正常に動作する
- [ ] レスポンシブデザインが機能する
- [ ] テストカバレッジ 80%以上
- [ ] アクセシビリティチェック通過

#### 定量的目標

- **レンダリング時間**: <500ms（レベル 1 機能）
- **バンドルサイズ**: +50KB 以下（追加分）
- **ユーザビリティ**: タスク完了率 70%以上（レベル 1 のみでのテスト）

### 💡 TD からのメッセージ

> 🤖 **TD より**: 「Phase 1 では、みんなが迷わずに基本機能を使えるようになることが最重要です！シンプルで分かりやすい設計を心がけて、一歩ずつ着実に進めていきましょう ♪」
