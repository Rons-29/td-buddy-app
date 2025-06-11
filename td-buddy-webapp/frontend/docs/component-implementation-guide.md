# 🔧 コンポーネント実装ガイド

## Progressive Disclosure 対応コンポーネント設計

### 🎯 実装ガイドの目的

このガイドは、Progressive Disclosure 方式の TestData Buddy を実装するための具体的なコンポーネント設計と実装方法を提供します。

### 📂 コンポーネント構成

```
components/
├── progressive/              # Progressive Disclosure関連
│   ├── ProgressiveContainer.tsx
│   ├── ProgressiveProvider.tsx
│   ├── LevelSelector.tsx
│   └── LevelWrapper.tsx
├── td/                      # TDキャラクター関連
│   ├── TDCharacter.tsx
│   ├── TDCharacterAdvanced.tsx
│   └── TDMessageSystem.tsx
├── ui/                      # 共通UIコンポーネント
│   ├── TDButton.tsx
│   ├── TDCard.tsx
│   ├── TDInput.tsx
│   └── TDModal.tsx
├── level1/                  # レベル1専用コンポーネント
│   ├── BasicPasswordGenerator.tsx
│   ├── BasicPersonalInfoGenerator.tsx
│   ├── BasicCSVGenerator.tsx
│   └── BasicUUIDGenerator.tsx
├── level2/                  # レベル2専用コンポーネント
│   ├── AdvancedSettingsPanel.tsx
│   ├── BatchProcessingInterface.tsx
│   └── PresetManager.tsx
└── accessibility/           # アクセシビリティ専用
    ├── SkipLinks.tsx
    ├── ScreenReaderOptimized.tsx
    └── FocusManager.tsx
```

### 🏗️ 1. Progressive Provider 実装

```typescript
// components/progressive/ProgressiveProvider.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface UserProgress {
  completedTasks: number;
  featuresUsed: string[];
  customizationLevel: number;
  totalUsageTime: number;
  lastLevelUnlock: number;
}

interface ProgressiveContextType {
  currentLevel: 1 | 2 | 3;
  setLevel: (level: 1 | 2 | 3) => void;
  userProgress: UserProgress;
  updateProgress: (action: string, data?: any) => void;
  isLevelUnlocked: (level: number) => boolean;
  canAdvanceLevel: () => boolean;
}

const ProgressiveContext = createContext<ProgressiveContextType | undefined>(
  undefined
);

export const useProgressive = () => {
  const context = useContext(ProgressiveContext);
  if (!context) {
    throw new Error('useProgressive must be used within ProgressiveProvider');
  }
  return context;
};

interface ProgressiveProviderProps {
  children: ReactNode;
  initialLevel?: 1 | 2 | 3;
}

export const ProgressiveProvider: React.FC<ProgressiveProviderProps> = ({
  children,
  initialLevel = 1,
}) => {
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3>(initialLevel);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedTasks: 0,
    featuresUsed: [],
    customizationLevel: 0,
    totalUsageTime: 0,
    lastLevelUnlock: 1,
  });

  // ローカルストレージからの進捗復元
  useEffect(() => {
    const savedProgress = localStorage.getItem('td-user-progress');
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setUserProgress(parsed);
      // 最後に使用していたレベルを復元
      setCurrentLevel(parsed.lastLevelUnlock);
    }
  }, []);

  // 進捗の保存
  useEffect(() => {
    localStorage.setItem('td-user-progress', JSON.stringify(userProgress));
  }, [userProgress]);

  const isLevelUnlocked = (level: number): boolean => {
    switch (level) {
      case 1:
        return true; // レベル1は常にアクセス可能
      case 2:
        return (
          userProgress.completedTasks >= 5 &&
          userProgress.featuresUsed.length >= 3
        );
      case 3:
        return (
          userProgress.completedTasks >= 20 &&
          userProgress.customizationLevel >= 3 &&
          userProgress.featuresUsed.length >= 6
        );
      default:
        return false;
    }
  };

  const canAdvanceLevel = (): boolean => {
    const nextLevel = (currentLevel + 1) as 1 | 2 | 3;
    return nextLevel <= 3 && isLevelUnlocked(nextLevel);
  };

  const updateProgress = (action: string, data?: any) => {
    setUserProgress(prev => {
      const updated = { ...prev };

      switch (action) {
        case 'task_completed':
          updated.completedTasks += 1;
          break;
        case 'feature_used':
          if (data && !updated.featuresUsed.includes(data)) {
            updated.featuresUsed.push(data);
          }
          break;
        case 'customization_made':
          updated.customizationLevel += 1;
          break;
        case 'session_time':
          updated.totalUsageTime += data || 0;
          break;
      }

      return updated;
    });
  };

  const setLevel = (level: 1 | 2 | 3) => {
    if (isLevelUnlocked(level)) {
      setCurrentLevel(level);
      setUserProgress(prev => ({
        ...prev,
        lastLevelUnlock: Math.max(prev.lastLevelUnlock, level),
      }));
    }
  };

  const value: ProgressiveContextType = {
    currentLevel,
    setLevel,
    userProgress,
    updateProgress,
    isLevelUnlocked,
    canAdvanceLevel,
  };

  return (
    <ProgressiveContext.Provider value={value}>
      {children}
    </ProgressiveContext.Provider>
  );
};
```

### 🎛️ 2. Level Selector 実装

```typescript
// components/progressive/LevelSelector.tsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressive } from './ProgressiveProvider';
import { TDCharacter } from '../td/TDCharacter';

interface LevelSelectorProps {
  className?: string;
  showDescription?: boolean;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({
  className = '',
  showDescription = true,
}) => {
  const { currentLevel, setLevel, isLevelUnlocked, canAdvanceLevel } =
    useProgressive();

  const levels = [
    {
      level: 1 as const,
      icon: '🎯',
      title: 'シンプル',
      description: '基本機能で簡単操作',
      color: 'td-primary-500',
      bgColor: 'td-primary-50',
    },
    {
      level: 2 as const,
      icon: '🛠️',
      title: '詳細設定',
      description: 'カスタマイズ機能',
      color: 'td-secondary-500',
      bgColor: 'td-secondary-50',
    },
    {
      level: 3 as const,
      icon: '🚀',
      title: 'エキスパート',
      description: '全機能フル活用',
      color: 'td-accent-500',
      bgColor: 'td-accent-50',
    },
  ];

  const handleLevelChange = (level: 1 | 2 | 3) => {
    if (isLevelUnlocked(level)) {
      setLevel(level);
    }
  };

  return (
    <div className={`level-selector ${className}`}>
      {showDescription && (
        <div className="mb-6">
          <TDCharacter
            level={currentLevel}
            situation="helping"
            customMessage="お好みのレベルを選んでください。いつでも変更できますよ♪"
          />
        </div>
      )}

      <div className="level-tabs flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {levels.map(levelData => {
          const isUnlocked = isLevelUnlocked(levelData.level);
          const isActive = currentLevel === levelData.level;

          return (
            <motion.button
              key={levelData.level}
              className={`
                relative flex-1 py-3 px-4 rounded-md font-medium text-sm transition-all duration-200
                ${
                  isActive
                    ? `bg-white text-${levelData.color} shadow-sm`
                    : isUnlocked
                    ? 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                    : 'text-gray-400 cursor-not-allowed'
                }
              `}
              onClick={() => handleLevelChange(levelData.level)}
              disabled={!isUnlocked}
              whileHover={isUnlocked ? { scale: 1.02 } : {}}
              whileTap={isUnlocked ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">{levelData.icon}</span>
                <span>{levelData.title}</span>
              </div>

              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 rounded-md">
                  <span className="text-xs text-gray-500">🔒</span>
                </div>
              )}

              {isActive && (
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${levelData.color} rounded-full`}
                  layoutId="activeTab"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {showDescription && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLevel}
            className="mt-4 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm text-gray-600">
              {levels.find(l => l.level === currentLevel)?.description}
            </p>

            {canAdvanceLevel() && (
              <motion.div
                className="mt-2 p-2 bg-green-50 rounded border border-green-200"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className="text-xs text-green-700">
                  💡 次のレベルがアンロックされました！
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default LevelSelector;
```

### 🎨 3. TD キャラクター実装

```typescript
// components/td/TDCharacter.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressive } from '../progressive/ProgressiveProvider';

interface TDCharacterProps {
  level?: 1 | 2 | 3;
  situation?: 'welcome' | 'helping' | 'success' | 'error' | 'thinking';
  customMessage?: string;
  showActions?: boolean;
  size?: 'sm' | 'md' | 'lg';
  emotion?: 'happy' | 'excited' | 'thinking' | 'concerned';
}

const TDCharacter: React.FC<TDCharacterProps> = ({
  level,
  situation = 'helping',
  customMessage,
  showActions = false,
  size = 'md',
  emotion,
}) => {
  const { currentLevel } = useProgressive();
  const effectiveLevel = level || currentLevel;
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getMessageData = () => {
    const messages = {
      1: {
        welcome: 'TestData Buddyへようこそ！まずは基本機能から始めましょう♪',
        helping: 'TDがサポートします。分からないことがあれば聞いてくださいね',
        success: '素晴らしい！データ生成が完了しました🎉',
        error: 'エラーが発生しました。一緒に解決しましょう',
        thinking: '最適なデータを生成しています...',
      },
      2: {
        welcome: '詳細設定モードです。より細かい調整ができますよ！',
        helping: '設定項目が増えましたが、TDが丁寧に説明します',
        success: 'カスタム設定での生成、完璧です！',
        error: '設定に問題があるようです。確認してみましょう',
        thinking: '複雑な設定を処理しています...',
      },
      3: {
        welcome: 'エキスパートモードへようこそ！全機能が使えます🚀',
        helping: '上級機能もTDにお任せください',
        success: 'エキスパートレベルの操作、お見事です！',
        error: '複雑な設定でエラーが起きました。詳しく調べてみましょう',
        thinking: '高度な処理を実行中です...',
      },
    };

    return customMessage || messages[effectiveLevel][situation];
  };

  const getEmotionData = () => {
    const defaultEmotion = {
      welcome: 'happy',
      helping: 'happy',
      success: 'excited',
      error: 'concerned',
      thinking: 'thinking',
    }[situation];

    const emotions = {
      happy: { emoji: '😊', color: 'blue-500' },
      excited: { emoji: '🤩', color: 'green-500' },
      thinking: { emoji: '🤔', color: 'purple-500' },
      concerned: { emoji: '😟', color: 'yellow-500' },
    };

    return emotions[emotion || defaultEmotion];
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

  // タイピングエフェクト
  useEffect(() => {
    const message = getMessageData();
    setIsTyping(true);
    setCurrentMessage('');

    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < message.length) {
        setCurrentMessage(message.substring(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [situation, customMessage, effectiveLevel]);

  const emotionData = getEmotionData();
  const sizeClasses = getSizeClasses();

  return (
    <motion.div
      className={`td-character flex items-start space-x-3 ${sizeClasses.container} 
                  bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-gray-200`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* アバター */}
      <motion.div
        className={`td-avatar ${sizeClasses.avatar} bg-${emotionData.color} rounded-full 
                   flex items-center justify-center text-white font-bold flex-shrink-0`}
        animate={{
          rotate: isTyping ? [0, 5, -5, 0] : 0,
          scale: situation === 'success' ? [1, 1.1, 1] : 1,
        }}
        transition={{
          rotate: { duration: 0.5, repeat: isTyping ? Infinity : 0 },
          scale: { duration: 0.5 },
        }}
      >
        {emotionData.emoji}
      </motion.div>

      {/* メッセージ部分 */}
      <div className="td-content flex-1 min-w-0">
        <div className="td-header mb-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold text-gray-800 text-sm">TD</h4>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              Level {effectiveLevel}
            </span>
          </div>
        </div>

        <div className="td-message">
          <p className={`text-gray-700 ${sizeClasses.text} leading-relaxed`}>
            {currentMessage}
            {isTyping && (
              <motion.span
                className="inline-block w-1 h-4 bg-gray-400 ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </p>
        </div>

        {showActions && !isTyping && (
          <motion.div
            className="td-actions mt-3 flex space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center">
              💡 ヒント
            </button>
            <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center">
              📚 詳細
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TDCharacter;
```

### 🔄 4. Level Wrapper 実装

```typescript
// components/progressive/LevelWrapper.tsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressive } from './ProgressiveProvider';

interface LevelWrapperProps {
  level: 1 | 2 | 3;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showComingSoon?: boolean;
}

const LevelWrapper: React.FC<LevelWrapperProps> = ({
  level,
  children,
  fallback,
  showComingSoon = true,
}) => {
  const { currentLevel, isLevelUnlocked } = useProgressive();

  const shouldShow = currentLevel >= level && isLevelUnlocked(level);

  if (shouldShow) {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    );
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showComingSoon && currentLevel < level) {
    return (
      <motion.div
        className="coming-soon p-6 border border-gray-200 rounded-lg bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            レベル {level} で利用可能
          </h3>
          <p className="text-sm text-gray-500">
            {level === 2 && 'もう少し基本機能を使ってみましょう'}
            {level === 3 && 'さらに上級者向けの機能です'}
          </p>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default LevelWrapper;
```

### 📋 5. 実装チェックリスト

#### Phase 1 実装チェックリスト

- [ ] ProgressiveProvider の実装
- [ ] LevelSelector の実装
- [ ] TDCharacter の基本実装
- [ ] LevelWrapper の実装
- [ ] レベル 1 コンポーネントの実装
- [ ] 基本的な状態管理
- [ ] ローカルストレージ連携
- [ ] 基本アニメーション

#### Phase 2 実装チェックリスト

- [ ] TDCharacterAdvanced の実装
- [ ] デザインシステム適用
- [ ] レベル 2 コンポーネント実装
- [ ] 詳細設定パネル
- [ ] バッチ処理機能
- [ ] プリセット管理
- [ ] パフォーマンス最適化

#### Phase 3 実装チェックリスト

- [ ] アクセシビリティ属性追加
- [ ] キーボードナビゲーション
- [ ] スクリーンリーダー対応
- [ ] カラーコントラスト調整
- [ ] フォーカス管理強化
- [ ] ARIA 属性実装
- [ ] 支援技術テスト

### 🧪 6. テスト実装例

```typescript
// __tests__/components/progressive/ProgressiveProvider.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import {
  ProgressiveProvider,
  useProgressive,
} from '../../../components/progressive/ProgressiveProvider';

const TestComponent = () => {
  const { currentLevel, setLevel, updateProgress, isLevelUnlocked } =
    useProgressive();

  return (
    <div>
      <span data-testid="current-level">{currentLevel}</span>
      <button onClick={() => updateProgress('task_completed')}>
        Complete Task
      </button>
      <button onClick={() => setLevel(2)} disabled={!isLevelUnlocked(2)}>
        Level 2
      </button>
    </div>
  );
};

describe('ProgressiveProvider', () => {
  test('初期レベルが1であること', () => {
    render(
      <ProgressiveProvider>
        <TestComponent />
      </ProgressiveProvider>
    );

    expect(screen.getByTestId('current-level')).toHaveTextContent('1');
  });

  test('タスク完了でプログレスが更新されること', () => {
    render(
      <ProgressiveProvider>
        <TestComponent />
      </ProgressiveProvider>
    );

    const completeButton = screen.getByText('Complete Task');

    // 5回タスクを完了してレベル2をアンロック
    for (let i = 0; i < 5; i++) {
      fireEvent.click(completeButton);
    }

    const level2Button = screen.getByText('Level 2');
    expect(level2Button).not.toBeDisabled();
  });
});
```

### 💡 TD からのメッセージ

> 🤖 **TD より**: 「このガイドを使って、みんなが使いやすい TestData Buddy を作りましょう！コンポーネントはレゴブロックのように組み合わせて使えるよう設計されています。困ったときは、いつでも TD が丁寧にサポートしますよ ♪」
