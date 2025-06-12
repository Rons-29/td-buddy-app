/**
 * 軽量ゲーミングシステム
 * QA Workbench (TD) - Lightweight Gaming Components
 * パフォーマンス重視の設計
 */

import React, { lazy, memo, useCallback, useMemo } from 'react';
import { performanceOptimizer } from '../../utils/performanceOptimizer';

// 遅延読み込み用のコンポーネント
const HeavyAnimations = lazy(() => import('./HeavyAnimations'));

// パフォーマンス重視の基本型定義
interface LightweightStats {
  count: number;
  streak: number;
  level: number;
  score: number;
}

interface GamingConfig {
  enableAnimations: boolean;
  enableParticles: boolean;
  enableSounds: boolean;
  performanceMode: 'low' | 'medium' | 'high';
}

/**
 * 軽量統計表示コンポーネント
 * メモ化により不要な再レンダリングを防止
 */
export const LightweightStatsDisplay = memo(
  ({ stats, config }: { stats: LightweightStats; config: GamingConfig }) => {
    // パフォーマンスモードに基づくスタイル選択
    const getOptimizedStyles = useMemo(() => {
      switch (config.performanceMode) {
        case 'low':
          return {
            container: 'bg-white p-4 rounded-lg shadow-sm',
            number: 'text-2xl font-bold text-gray-800',
            animation: '', // アニメーションなし
          };
        case 'medium':
          return {
            container:
              'bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg shadow-md transition-colors duration-300',
            number: 'text-2xl font-bold text-blue-600',
            animation: config.enableAnimations
              ? 'hover:scale-105 transition-transform duration-200'
              : '',
          };
        case 'high':
          return {
            container:
              'bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-xl shadow-xl text-white',
            number: 'text-3xl font-bold',
            animation: config.enableAnimations
              ? 'hover:scale-105 hover:shadow-2xl transition-all duration-300'
              : '',
          };
        default:
          return {
            container: 'bg-white p-4 rounded-lg shadow-sm',
            number: 'text-2xl font-bold text-gray-800',
            animation: '',
          };
      }
    }, [config.performanceMode, config.enableAnimations]);

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* データ醸造数 */}
        <div
          className={`${getOptimizedStyles.container} ${getOptimizedStyles.animation}`}
        >
          <div className="text-sm opacity-80 mb-1">総データ醸造</div>
          <div className={getOptimizedStyles.number}>
            {stats.count.toLocaleString()}
          </div>
        </div>

        {/* 連続利用 */}
        <div
          className={`${getOptimizedStyles.container} ${getOptimizedStyles.animation}`}
        >
          <div className="text-sm opacity-80 mb-1">連続利用</div>
          <div className={getOptimizedStyles.number}>{stats.streak}日</div>
        </div>

        {/* TDレベル */}
        <div
          className={`${getOptimizedStyles.container} ${getOptimizedStyles.animation}`}
        >
          <div className="text-sm opacity-80 mb-1">TDレベル</div>
          <div className={getOptimizedStyles.number}>{stats.level}</div>
        </div>

        {/* 効率スコア */}
        <div
          className={`${getOptimizedStyles.container} ${getOptimizedStyles.animation}`}
        >
          <div className="text-sm opacity-80 mb-1">効率スコア</div>
          <div className={getOptimizedStyles.number}>{stats.score}%</div>
        </div>
      </div>
    );
  }
);

/**
 * 軽量プログレスバー
 * CSS transforms のみ使用、JavaScript アニメーションは最小限
 */
export const LightweightProgressBar = memo(
  ({
    current,
    max,
    label,
    enableGlow = false,
  }: {
    current: number;
    max: number;
    label: string;
    enableGlow?: boolean;
  }) => {
    const percentage = Math.min((current / max) * 100, 100);

    return (
      <div className="w-full">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{label}</span>
          <span>
            {current}/{max}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`
            h-full transition-all duration-700 ease-out
            bg-gradient-to-r from-blue-400 to-cyan-500
            ${enableGlow ? 'shadow-lg shadow-blue-300/50' : ''}
          `}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

/**
 * パフォーマンス監視付きアチーブメント通知
 * 表示時間とアニメーションを自動調整
 */
export const PerformanceAwareNotification = memo(
  ({
    achievement,
    isVisible,
    onClose,
  }: {
    achievement: {
      title: string;
      icon: string;
      rarity: 'common' | 'rare' | 'epic';
    };
    isVisible: boolean;
    onClose: () => void;
  }) => {
    // パフォーマンス状況に基づく表示時間調整
    const getDisplayDuration = useCallback(() => {
      const performanceScore = performanceOptimizer.calculatePerformanceScore();

      if (performanceScore.score < 60) {
        return 2000; // 低パフォーマンス時は短時間表示
      } else if (performanceScore.score < 80) {
        return 3000; // 中パフォーマンス時は通常表示
      } else {
        return 4000; // 高パフォーマンス時は長時間表示
      }
    }, []);

    // 自動クローズ
    React.useEffect(() => {
      if (isVisible) {
        const timer = setTimeout(onClose, getDisplayDuration());
        return () => clearTimeout(timer);
      }
    }, [isVisible, onClose, getDisplayDuration]);

    const rarityColors = {
      common: 'from-gray-400 to-gray-500',
      rare: 'from-blue-400 to-blue-500',
      epic: 'from-purple-400 to-purple-500',
    };

    if (!isVisible) return null;

    return (
      <div
        className={`
      fixed top-4 right-4 z-50 max-w-sm
      transform transition-all duration-300 ease-out
      ${
        isVisible
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
      }
    `}
      >
        <div
          className={`
        bg-gradient-to-r ${rarityColors[achievement.rarity]}
        text-white p-4 rounded-lg shadow-lg
        flex items-center space-x-3
      `}
        >
          <div className="text-2xl">{achievement.icon}</div>
          <div>
            <div className="font-bold text-sm">アチーブメント獲得！</div>
            <div className="font-semibold">{achievement.title}</div>
          </div>
        </div>
      </div>
    );
  }
);

/**
 * Brewキャラクター（軽量版）
 * 表情変化のみ、複雑なアニメーションは避ける
 */
export const LightweightTDCharacter = memo(
  ({
    mood,
    message,
    size = 'medium',
  }: {
    mood: 'happy' | 'working' | 'excited' | 'focused';
    message?: string;
    size?: 'small' | 'medium' | 'large';
  }) => {
    const getTDFace = useMemo(() => {
      switch (mood) {
        case 'happy':
          return '😊';
        case 'working':
          return '⚙️';
        case 'excited':
          return '🤩';
        case 'focused':
          return '🧐';
        default:
          return '🍺';
      }
    }, [mood]);

    const sizeClasses = {
      small: 'text-2xl',
      medium: 'text-4xl',
      large: 'text-6xl',
    };

    return (
      <div className="flex items-center space-x-3">
        <div className={`${sizeClasses[size]} transition-all duration-300`}>
          {getTDFace}
        </div>
        {message && (
          <div className="bg-blue-50 p-2 rounded-lg max-w-xs">
            <p className="text-sm text-blue-800">{message}</p>
          </div>
        )}
      </div>
    );
  }
);

/**
 * パフォーマンス適応型ゲーミングシステム
 * システム負荷に応じて機能を自動調整
 */
export class AdaptiveGamingSystem {
  private static instance: AdaptiveGamingSystem | null = null;
  private config: GamingConfig;

  private constructor() {
    this.config = {
      enableAnimations: true,
      enableParticles: false,
      enableSounds: false,
      performanceMode: 'medium',
    };

    this.startPerformanceMonitoring();
  }

  static getInstance(): AdaptiveGamingSystem {
    if (!this.instance) {
      this.instance = new AdaptiveGamingSystem();
    }
    return this.instance;
  }

  private startPerformanceMonitoring(): void {
    // 30秒ごとにパフォーマンスをチェックして設定を調整
    setInterval(() => {
      this.adjustConfigBasedOnPerformance();
    }, 30000);
  }

  private adjustConfigBasedOnPerformance(): void {
    const performanceData = performanceOptimizer.generateReport();
    const score = performanceData.score.score;
    const memoryUsage = performanceData.metrics.memoryUsage;

    // パフォーマンススコアに基づく調整
    if (score < 60 || memoryUsage > 0.8) {
      // 低パフォーマンス時：最小限の機能のみ
      this.config = {
        enableAnimations: false,
        enableParticles: false,
        enableSounds: false,
        performanceMode: 'low',
      };
      console.log(
        '🍺 ブリューからのメッセージ: パフォーマンス重視モードに切り替えました'
      );
    } else if (score < 80 || memoryUsage > 0.6) {
      // 中パフォーマンス時：基本的な機能
      this.config = {
        enableAnimations: true,
        enableParticles: false,
        enableSounds: false,
        performanceMode: 'medium',
      };
    } else {
      // 高パフォーマンス時：全機能有効
      this.config = {
        enableAnimations: true,
        enableParticles: true,
        enableSounds: false, // 音は常にオフ（うるさくならないよう）
        performanceMode: 'high',
      };
    }
  }

  getConfig(): GamingConfig {
    return { ...this.config };
  }

  forcePerformanceMode(mode: 'low' | 'medium' | 'high'): void {
    this.config.performanceMode = mode;
    this.adjustConfigBasedOnPerformance();
  }
}

// パフォーマンス監視付きフック
export const useAdaptiveGaming = () => {
  const [config, setConfig] = React.useState<GamingConfig>(
    AdaptiveGamingSystem.getInstance().getConfig()
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      const newConfig = AdaptiveGamingSystem.getInstance().getConfig();
      setConfig(newConfig);
    }, 5000); // 5秒ごとに設定を更新

    return () => clearInterval(interval);
  }, []);

  return config;
};

export default {
  LightweightStatsDisplay,
  LightweightProgressBar,
  PerformanceAwareNotification,
  LightweightTDCharacter,
  AdaptiveGamingSystem,
  useAdaptiveGaming,
};
