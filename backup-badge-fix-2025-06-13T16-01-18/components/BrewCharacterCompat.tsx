'use client';

import React, { useEffect, useState } from 'react';
import type {
  BrewAnimation,
  ExtendedBrewEmotion,
} from './brews/BrewsCompatibilityAdapter';
import { BrewsCompatibilityAdapter } from './brews/BrewsCompatibilityAdapter';

/**
 * 🔄 BrewCharacterCompat
 *
 * 既存のBrewCharacterコンポーネントのAPIを100%維持しながら、
 * 内部で新しいBrewsIconシステムを使用する互換性コンポーネント。
 *
 * ⚠️ LEGACY API PRESERVATION ⚠️
 * このコンポーネントは既存のコードとの100%互換性を維持します。
 * 既存のBrewCharacterの使用箇所はコード変更なしで動作します。
 */

// 旧BrewCharacterと同じ型定義を維持
export type BrewEmotion = ExtendedBrewEmotion;
export { BrewAnimation };

interface BrewCharacterProps {
  emotion?: BrewEmotion;
  message?: string;
  animation?: BrewAnimation;
  size?: 'small' | 'medium' | 'large';
  showBubble?: boolean;
  showSpeechBubble?: boolean;
  className?: string;
}

const BrewCharacterCompat: React.FC<BrewCharacterProps> = ({
  emotion = 'happy',
  message,
  animation = 'none',
  size = 'medium',
  showBubble = true,
  showSpeechBubble = true,
  className = '',
}) => {
  const [currentMessage, setCurrentMessage] = useState<string>(message || '');

  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
    }
  }, [message]);

  // 旧システムのデフォルトメッセージ生成（完全互換性）
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
      friendly: 'こんにちは！Brewです。よろしくお願いします♪',
      sad: '申し訳ありません...もう一度試してみましょう',
      curious: '興味深いですね！詳しく調べてみましょう🔍',
      worried: '少し心配です...大丈夫でしょうか？',
    };
    return messages[emotion] || 'こんにちは！Brewです。よろしくお願いします♪';
  };

  const displayMessage = currentMessage || getDefaultMessage(emotion);

  // 新しいBrewsCompatibilityAdapterを使用
  return (
    <div className={`brew-character-container ${className}`}>
      <BrewsCompatibilityAdapter
        emotion={emotion}
        message={displayMessage}
        animation={animation}
        size={size}
        showMessage={showBubble || showSpeechBubble}
        className="brew-character-legacy-wrapper"
        role="ai" // デフォルトロール
        autoMessage={true}
        onClick={() => {
          // 旧システムと同じクリック処理を維持
          console.log('BrewCharacter clicked - legacy compatibility mode');
        }}
      />
    </div>
  );
};

export default BrewCharacterCompat;

// 型エクスポート（他コンポーネントでの利用のため）
export type { BrewCharacterProps };
