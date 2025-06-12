'use client';

import React, { useEffect, useState } from 'react';

// Brewの感情状態
export type BrewEmotion =
  | 'happy'
  | 'excited'
  | 'working'
  | 'thinking'
  | 'success'
  | 'error'
  | 'warning'
  | 'sleepy'
  | 'confused'
  | 'determined'
  | 'neutral'
  | 'brewing'
  | 'completed';

// Brewのアニメーション
export type BrewAnimation =
  | 'bounce'
  | 'shake'
  | 'spin'
  | 'pulse'
  | 'wiggle'
  | 'heartbeat'
  | 'float'
  | 'none';

interface BrewCharacterProps {
  emotion?: BrewEmotion;
  message?: string;
  animation?: BrewAnimation;
  size?: 'small' | 'medium' | 'large';
  showBubble?: boolean;
  className?: string;
}

const BrewCharacter: React.FC<BrewCharacterProps> = ({
  emotion = 'happy',
  message,
  animation = 'none',
  size = 'medium',
  showBubble = true,
  className = '',
}) => {
  const [currentMessage, setCurrentMessage] = useState<string>(message || '');

  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
    }
  }, [message]);

  // サイズ設定
  const sizeClasses = {
    small: 'w-12 h-12 text-xs',
    medium: 'w-16 h-16 text-sm',
    large: 'w-20 h-20 text-base',
  };

  // アニメーションクラス
  const animationClasses = {
    bounce: 'animate-bounce',
    shake: 'animate-pulse',
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    wiggle: 'brew-wiggle',
    heartbeat: 'brew-heartbeat',
    float: 'brew-float',
    none: '',
  };

  const getDefaultMessage = (emotion: BrewEmotion): string => {
    const messages = {
      happy: 'データ生成の準備ができました！',
      excited: 'わくわく！新しいデータを生成しましょう♪',
      working: 'データ生成中です...しばらくお待ちください',
      thinking: 'どんなデータにしましょうか？🤔',
      success: '生成完了！完璧なデータができました✨',
      error: '問題が発生しました。Brewがサポートします！',
      warning: '注意が必要です。確認をお願いします',
      sleepy: 'ちょっと疲れました...😴',
      confused: 'あれ？どうしましょう？',
      determined: '頑張って生成します！💪',
      neutral: 'お疲れさまです。何かお手伝いできることはありますか？',
      brewing: '🍺 データを生成中...美味しいデータができそうです♪',
      completed: '生成完了！お役に立てて嬉しいです',
    };
    return messages[emotion] || 'こんにちは！Brewです。よろしくお願いします♪';
  };

  // 感情に応じた表情
  const getEmotionEmoji = (emotion: BrewEmotion): string => {
    const emojis = {
      happy: '😊',
      excited: '🤩',
      working: '⚙️',
      thinking: '🤔',
      success: '✨',
      error: '😅',
      warning: '⚠️',
      sleepy: '😴',
      confused: '🤨',
      determined: '💪',
      neutral: '🍺',
      brewing: '🍺',
      completed: '🎉',
    };
    return emojis[emotion] || '🍺';
  };

  const displayMessage = currentMessage || getDefaultMessage(emotion);

  return (
    <div className={`brew-character-container ${className}`}>
      {/* メッセージバブル */}
      {showBubble && displayMessage && (
        <div className="relative mb-3">
          <div className="bg-white border-2 border-orange-200 rounded-lg p-3 shadow-lg relative">
            <p className="text-gray-800 text-sm font-medium">
              {displayMessage}
            </p>
            {/* 吹き出しの三角形 */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-orange-200"></div>
            </div>
          </div>
        </div>
      )}

      {/* Brewキャラクター本体 */}
      <div
        className={`
          brew-character
          ${sizeClasses[size]}
          ${animationClasses[animation]}
          mx-auto
          flex items-center justify-center
          rounded-full
          text-2xl
          cursor-pointer
          transition-all duration-300
          hover:scale-110
          ${
            emotion === 'error'
              ? 'bg-orange-100 text-orange-800'
              : emotion === 'success'
              ? 'bg-green-100 text-green-800'
              : emotion === 'warning'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-orange-50 text-orange-600'
          }
        `}
        onClick={e => {
          e.preventDefault();
          // クリック時のアニメーション
          const target = e.currentTarget;
          target.classList.add('animate-pulse');
          setTimeout(() => {
            target.classList.remove('animate-pulse');
          }, 600);
        }}
        role="button"
        tabIndex={0}
        aria-label={`Brewキャラクター - 現在の感情: ${emotion}, メッセージ: ${displayMessage}`}
      >
        {getEmotionEmoji(emotion)}
      </div>

      {/* 感情ラベル */}
      <div className="text-center mt-2">
        <span
          className={`
          text-xs px-2 py-1 rounded-full
          ${
            emotion === 'error'
              ? 'bg-orange-100 text-orange-800'
              : emotion === 'success'
              ? 'bg-green-100 text-green-800'
              : emotion === 'warning'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-orange-100 text-orange-700'
          }
        `}
        >
          {emotion === 'brewing'
            ? '生成中'
            : emotion === 'completed'
            ? '完了'
            : emotion === 'working'
            ? '作業中'
            : 'Brew'}
        </span>
      </div>
    </div>
  );
};

export default BrewCharacter;
