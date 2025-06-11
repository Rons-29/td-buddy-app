# 🎨 Phase 2: デザインシステム強化・UI 実装

## Week 3-6 実装計画

### 🎯 Phase 2 目標

**ゴール**: 一貫性のあるデザインシステムを構築し、レベル 2 機能を実装
**期間**: 4 週間  
**成果物**: 完整されたデザインシステム + 中級者向け機能

### 📋 Week 3-4 タスクリスト

#### Week 3: デザインシステム基盤

- [ ] TD ブランドガイドライン更新
- [ ] コンポーネントライブラリ拡張
- [ ] アニメーション・モーション設計
- [ ] アイコンシステム統一

#### Week 4: レベル 2 UI 実装

- [ ] 詳細設定パネルコンポーネント
- [ ] バッチ処理インターフェース
- [ ] プリセット管理システム
- [ ] エクスポート機能強化

### 📋 Week 5-6 タスクリスト

#### Week 5: 高度なインタラクション

- [ ] ドラッグ&ドロップ機能
- [ ] リアルタイムプレビュー
- [ ] ショートカットキー対応
- [ ] コンテキストメニュー

#### Week 6: 統合・最適化

- [ ] パフォーマンス最適化
- [ ] クロスブラウザ対応
- [ ] ユーザビリティテスト
- [ ] レスポンシブ最終調整

### 🎨 デザインシステム仕様

#### 1. TD ブランドガイドライン更新

```typescript
// styles/brand/td-design-tokens.ts

export const TDDesignTokens = {
  // ブランドカラー（既存を拡張）
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#3B82F6', // メイン
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    // TDキャラクター専用カラー
    td: {
      cute: '#FF6B9D', // TDの可愛らしさ
      friendly: '#4ECDC4', // 親しみやすさ
      smart: '#45B7D1', // 知的な印象
      warm: '#FFA07A', // 温かみのある色
    },
    // 機能別カラー
    functional: {
      password: '#FF6B6B', // パスワード生成
      personal: '#4ECDC4', // 個人情報
      csv: '#45B7D1', // ファイル関連
      advanced: '#96CEB4', // 上級機能
    },
  },

  // タイポグラフィ
  typography: {
    fontFamily: {
      primary: ['Inter', 'Hiragino Sans', 'Noto Sans JP', 'sans-serif'],
      mono: ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
    },
    fontSize: {
      'td-xs': '0.75rem', // 12px
      'td-sm': '0.875rem', // 14px
      'td-base': '1rem', // 16px
      'td-lg': '1.125rem', // 18px
      'td-xl': '1.25rem', // 20px
      'td-2xl': '1.5rem', // 24px
      'td-3xl': '1.875rem', // 30px
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // スペーシング
  spacing: {
    'td-1': '0.25rem', // 4px
    'td-2': '0.5rem', // 8px
    'td-3': '0.75rem', // 12px
    'td-4': '1rem', // 16px
    'td-5': '1.25rem', // 20px
    'td-6': '1.5rem', // 24px
    'td-8': '2rem', // 32px
    'td-10': '2.5rem', // 40px
    'td-12': '3rem', // 48px
  },

  // シャドウ
  shadow: {
    'td-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    'td-base':
      '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    'td-lg':
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    'td-xl':
      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  // ボーダーラジアス
  borderRadius: {
    'td-sm': '0.25rem', // 4px
    'td-base': '0.5rem', // 8px
    'td-lg': '0.75rem', // 12px
    'td-xl': '1rem', // 16px
    'td-full': '9999px', // 完全な円
  },
};
```

#### 2. コンポーネントライブラリ拡張

```typescript
// components/ui/TDButton.tsx

interface TDButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'td-special';
  size: 'sm' | 'md' | 'lg' | 'xl';
  tdEmotion?: 'default' | 'excited' | 'helpful' | 'success';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const TDButton = ({
  variant = 'primary',
  size = 'md',
  tdEmotion = 'default',
  children,
  onClick,
  disabled,
  loading,
}: TDButtonProps) => {
  const getVariantClasses = () => {
    const baseClasses =
      'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    switch (variant) {
      case 'primary':
        return `${baseClasses} bg-td-primary-500 text-white hover:bg-td-primary-600 focus:ring-td-primary-500`;
      case 'secondary':
        return `${baseClasses} bg-td-secondary-500 text-white hover:bg-td-secondary-600 focus:ring-td-secondary-500`;
      case 'outline':
        return `${baseClasses} border-2 border-td-primary-500 text-td-primary-500 hover:bg-td-primary-50`;
      case 'ghost':
        return `${baseClasses} text-td-gray-700 hover:bg-td-gray-100`;
      case 'td-special':
        // TDキャラクターテーマの特別ボタン
        return `${baseClasses} bg-gradient-to-r from-td-cute to-td-friendly text-white hover:shadow-lg transform hover:scale-105`;
      default:
        return baseClasses;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-td-sm rounded-td-sm';
      case 'md':
        return 'px-4 py-2 text-td-base rounded-td-base';
      case 'lg':
        return 'px-6 py-3 text-td-lg rounded-td-lg';
      case 'xl':
        return 'px-8 py-4 text-td-xl rounded-td-xl';
      default:
        return 'px-4 py-2 text-td-base rounded-td-base';
    }
  };

  const getEmotionEffect = () => {
    switch (tdEmotion) {
      case 'excited':
        return 'animate-bounce';
      case 'helpful':
        return 'animate-pulse';
      case 'success':
        return 'animate-wiggle';
      default:
        return '';
    }
  };

  return (
    <button
      className={`${getVariantClasses()} ${getSizeClasses()} ${getEmotionEffect()} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <div className="animate-spin mr-2">⚡</div>
          処理中...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
```

#### 3. TD キャラクター進化版

```typescript
// components/td/TDCharacterAdvanced.tsx

interface TDCharacterAdvancedProps {
  level: 1 | 2 | 3;
  emotion:
    | 'happy'
    | 'thinking'
    | 'excited'
    | 'helping'
    | 'success'
    | 'concerned';
  message?: string;
  showAvatar?: boolean;
  showActions?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const TDCharacterAdvanced = ({
  level,
  emotion = 'happy',
  message,
  showAvatar = true,
  showActions = false,
  size = 'md',
}: TDCharacterAdvancedProps) => {
  const getEmotionData = () => {
    const emotions = {
      happy: { emoji: '😊', color: 'td-primary-500', bgColor: 'td-primary-50' },
      thinking: {
        emoji: '🤔',
        color: 'td-accent-500',
        bgColor: 'td-accent-50',
      },
      excited: {
        emoji: '🤩',
        color: 'td-secondary-500',
        bgColor: 'td-secondary-50',
      },
      helping: { emoji: '🤝', color: 'td-friendly', bgColor: 'td-gray-50' },
      success: { emoji: '🎉', color: 'td-success', bgColor: 'green-50' },
      concerned: { emoji: '😟', color: 'td-warning', bgColor: 'yellow-50' },
    };
    return emotions[emotion];
  };

  const getLevelData = () => {
    const levels = {
      1: { badge: '🎯', title: 'ビギナーサポート' },
      2: { badge: '🛠️', title: 'アドバンストガイド' },
      3: { badge: '🚀', title: 'エキスパートパートナー' },
    };
    return levels[level];
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return { container: 'p-3', avatar: 'w-8 h-8 text-sm', text: 'text-xs' };
      case 'md':
        return {
          container: 'p-4',
          avatar: 'w-12 h-12 text-lg',
          text: 'text-sm',
        };
      case 'lg':
        return {
          container: 'p-6',
          avatar: 'w-16 h-16 text-xl',
          text: 'text-base',
        };
      default:
        return {
          container: 'p-4',
          avatar: 'w-12 h-12 text-lg',
          text: 'text-sm',
        };
    }
  };

  const emotionData = getEmotionData();
  const levelData = getLevelData();
  const sizeClasses = getSizeClasses();

  return (
    <motion.div
      className={`td-character-advanced flex items-start space-x-4 ${sizeClasses.container} 
                  bg-${emotionData.bgColor} rounded-td-lg border border-gray-200 shadow-td-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {showAvatar && (
        <div className="td-avatar flex-shrink-0">
          <div
            className={`${sizeClasses.avatar} bg-${emotionData.color} rounded-full 
                           flex items-center justify-center text-white font-bold`}
          >
            {emotionData.emoji}
          </div>
          <div className="mt-1 text-center">
            <span className="text-xs text-gray-500">{levelData.badge}</span>
          </div>
        </div>
      )}

      <div className="td-content flex-1">
        <div className="td-header mb-2">
          <h4 className="font-semibold text-gray-800 text-sm">
            TD - {levelData.title}
          </h4>
        </div>

        <div className="td-message">
          <p className={`text-gray-700 ${sizeClasses.text} leading-relaxed`}>
            {message || getDefaultMessage(level, emotion)}
          </p>
        </div>

        {showActions && (
          <div className="td-actions mt-3 flex space-x-2">
            <TDButton variant="ghost" size="sm">
              💡 ヒント
            </TDButton>
            <TDButton variant="ghost" size="sm">
              📚 ガイド
            </TDButton>
          </div>
        )}
      </div>
    </motion.div>
  );
};
```

### 🎛️ レベル 2 機能実装

#### 詳細設定パネル

```typescript
// components/level2/AdvancedSettingsPanel.tsx

const AdvancedSettingsPanel = ({ featureType }: { featureType: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [settings, setSettings] = useState({});

  return (
    <motion.div
      className="advanced-settings-panel bg-white rounded-td-lg border border-gray-200 shadow-td-sm"
      layout
    >
      <div
        className="panel-header p-4 border-b border-gray-100 cursor-pointer 
                   hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 flex items-center">
            ⚙️ 詳細設定
            <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-td-sm">
              Level 2
            </span>
          </h3>
          <div
            className={`transform transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          >
            ▼
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="panel-content p-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TDCharacterAdvanced
              level={2}
              emotion="helping"
              message="詳細設定で、より細かい調整ができますよ！"
              size="sm"
            />

            <div className="settings-grid mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 設定項目を動的に表示 */}
              {getSettingsForFeature(featureType).map(setting => (
                <SettingItem key={setting.key} setting={setting} />
              ))}
            </div>

            <div className="panel-actions mt-6 flex justify-end space-x-3">
              <TDButton variant="outline" size="sm">
                💾 プリセット保存
              </TDButton>
              <TDButton variant="primary" size="sm">
                ✨ 設定適用
              </TDButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
```

#### バッチ処理インターフェース

```typescript
// components/level2/BatchProcessingInterface.tsx

const BatchProcessingInterface = () => {
  const [batchSettings, setBatchSettings] = useState({
    count: 100,
    format: 'json',
    concurrent: false,
  });
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="batch-processing bg-white rounded-td-lg p-6 border border-gray-200 shadow-td-base">
      <div className="header mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          📊 バッチ処理
          <span className="ml-2 text-xs text-white bg-td-secondary-500 px-2 py-1 rounded-td-sm">
            Level 2
          </span>
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          大量のデータを効率的に一括生成できます
        </p>
      </div>

      <TDCharacterAdvanced
        level={2}
        emotion="excited"
        message="バッチ処理で大量データも一気に作成できますよ！効率的ですね♪"
        size="md"
      />

      <div className="batch-settings mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="setting-item">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            生成数
          </label>
          <input
            type="number"
            min="1"
            max="10000"
            value={batchSettings.count}
            onChange={e =>
              setBatchSettings({
                ...batchSettings,
                count: parseInt(e.target.value),
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-td-base 
                       focus:outline-none focus:ring-2 focus:ring-td-primary-500"
          />
        </div>

        <div className="setting-item">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            出力形式
          </label>
          <select
            value={batchSettings.format}
            onChange={e =>
              setBatchSettings({ ...batchSettings, format: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-td-base 
                       focus:outline-none focus:ring-2 focus:ring-td-primary-500"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="xml">XML</option>
            <option value="yaml">YAML</option>
          </select>
        </div>

        <div className="setting-item">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={batchSettings.concurrent}
              onChange={e =>
                setBatchSettings({
                  ...batchSettings,
                  concurrent: e.target.checked,
                })
              }
              className="mr-2 text-td-primary-500"
            />
            <span className="text-sm text-gray-700">並列処理</span>
          </label>
        </div>
      </div>

      {isProcessing && (
        <div className="progress-section mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">処理中...</span>
            <span className="text-sm text-gray-600">{progress}%</span>
          </div>
          <div className="progress-bar w-full bg-gray-200 rounded-td-full h-2">
            <div
              className="bg-td-primary-500 h-2 rounded-td-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="actions mt-6 flex justify-end space-x-3">
        <TDButton variant="outline" size="md">
          📋 プレビュー
        </TDButton>
        <TDButton
          variant="primary"
          size="md"
          tdEmotion="excited"
          disabled={isProcessing}
          loading={isProcessing}
        >
          🚀 バッチ実行
        </TDButton>
      </div>
    </div>
  );
};
```

### 🎭 アニメーション・モーション設計

```typescript
// utils/animations.ts

export const TDAnimations = {
  // ページ遷移
  pageTransition: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 },
  },

  // レベル切り替え
  levelTransition: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
    transition: { duration: 0.4, ease: 'easeInOut' },
  },

  // TDキャラクター登場
  tdEntrance: {
    initial: { opacity: 0, y: 30, scale: 0.8 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: {
      duration: 0.5,
      ease: 'backOut',
      scale: { type: 'spring', stiffness: 200 },
    },
  },

  // 成功アニメーション
  successPulse: {
    animate: {
      scale: [1, 1.05, 1],
      boxShadow: [
        '0 0 0 0 rgba(34, 197, 94, 0.4)',
        '0 0 0 20px rgba(34, 197, 94, 0)',
        '0 0 0 0 rgba(34, 197, 94, 0)',
      ],
    },
    transition: { duration: 0.6 },
  },

  // データ生成中のローディング
  generatingData: {
    animate: {
      rotate: [0, 360],
      scale: [1, 1.1, 1],
    },
    transition: {
      rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
      scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
    },
  },
};
```

### 📱 レスポンシブ設計強化

```css
/* styles/responsive-level2.css */

/* Level 2 専用レスポンシブ設計 */
.level-2-container {
  @apply grid gap-6;

  /* モバイル: 1列レイアウト */
  grid-template-columns: 1fr;

  /* タブレット: 2列レイアウト */
  @screen md {
    grid-template-columns: 1fr 1fr;
  }

  /* デスクトップ: 3列レイアウト（詳細パネル考慮） */
  @screen lg {
    grid-template-columns: 2fr 1fr;
  }

  /* 大画面: 完全展開 */
  @screen xl {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

/* 詳細設定パネルのレスポンシブ */
.advanced-settings-panel {
  /* モバイルではフルスクリーンモーダル */
  @screen max-md {
    .panel-content.expanded {
      @apply fixed inset-0 z-50 bg-white p-6 overflow-y-auto;
    }
  }

  /* タブレット以上では inline 展開 */
  @screen md {
    .panel-content {
      @apply relative;
    }
  }
}

/* TDキャラクターのレスポンシブサイズ */
.td-character-advanced {
  /* モバイル: コンパクト表示 */
  @screen max-md {
    @apply text-xs p-3;

    .td-avatar {
      @apply w-8 h-8 text-sm;
    }
  }

  /* デスクトップ: フル表示 */
  @screen lg {
    @apply text-sm p-4;

    .td-avatar {
      @apply w-12 h-12 text-lg;
    }
  }
}
```

### 🧪 テスト戦略

#### コンポーネントテスト

```typescript
// __tests__/components/level2/AdvancedSettingsPanel.test.tsx

describe('AdvancedSettingsPanel', () => {
  test('詳細設定パネルが展開・折りたたみできる', async () => {
    render(<AdvancedSettingsPanel featureType="password" />);

    const header = screen.getByText('⚙️ 詳細設定');
    fireEvent.click(header);

    await waitFor(() => {
      expect(
        screen.getByText('詳細設定で、より細かい調整ができますよ！')
      ).toBeInTheDocument();
    });
  });

  test('TDキャラクターが適切なメッセージを表示する', () => {
    render(<AdvancedSettingsPanel featureType="password" />);

    // 展開後にTDメッセージが表示されることを確認
    const header = screen.getByText('⚙️ 詳細設定');
    fireEvent.click(header);

    expect(
      screen.getByText(/詳細設定で、より細かい調整ができますよ/)
    ).toBeInTheDocument();
  });
});
```

#### インタラクションテスト

```typescript
// __tests__/integration/Level2Flow.test.tsx

describe('Level 2 User Flow', () => {
  test('レベル1からレベル2への自然な遷移', async () => {
    const { getByText, queryByText } = render(
      <ProgressiveProvider>
        <ProgressiveContainer />
      </ProgressiveProvider>
    );

    // レベル1での操作を完了
    // （5回以上のタスク完了でレベル2アンロック）

    // レベル2に切り替え
    const level2Button = getByText('🛠️ 詳細設定');
    fireEvent.click(level2Button);

    // レベル2機能が表示されることを確認
    await waitFor(() => {
      expect(getByText('📊 バッチ処理')).toBeInTheDocument();
      expect(getByText('⚙️ 詳細設定')).toBeInTheDocument();
    });
  });
});
```

### 📈 成功指標

#### Phase 2 完了条件

- [ ] 統一されたデザインシステムが実装されている
- [ ] レベル 2 の全機能が動作する
- [ ] TD キャラクターの表現力が向上している
- [ ] レスポンシブデザインが完璧に動作する
- [ ] アニメーションが適切に実装されている
- [ ] パフォーマンスが維持されている（<1 秒でレンダリング）

#### 定量的目標

- **デザイン一貫性スコア**: 95%以上
- **ユーザビリティスコア**: 85%以上（レベル 2 機能での測定）
- **モバイル体験スコア**: 90%以上
- **アニメーション滑らかさ**: 60fps 維持

### 💡 TD からのメッセージ

> 🤖 **TD より**: 「Phase 2 では、TD がもっと表現豊かになります！ユーザーの皆さんがレベルアップするのと一緒に、TD も成長していく感じがとても嬉しいです。美しく使いやすいインターフェースで、みんなの作業がもっと楽しくなりますように ♪」
