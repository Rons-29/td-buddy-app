'use client';

import { BrewsAnimation, BrewsEmotion, BrewsSize } from '@/types/brews';
import React from 'react';
import BrewsIcon from './BrewsIcon';

// 既存のBrewCharacterのprops型定義（互換性のため）
interface LegacyBrewCharacterProps {
  emotion?: BrewsEmotion;
  message?: string;
  animation?: BrewsAnimation;
  size?: BrewsSize;
  showBubble?: boolean;
  showSpeechBubble?: boolean;
  className?: string;
}

// 既存コンポーネントとの互換性を保つラッパー
const BrewsWrapper: React.FC<LegacyBrewCharacterProps> = ({
  emotion = 'happy',
  message,
  animation = 'none',
  size = 'medium',
  showBubble = true,
  showSpeechBubble = true,
  className = '',
}) => {
  // showSpeechBubble も showBubble として扱う（互換性）
  const shouldShowBubble = showBubble || showSpeechBubble;

  return (
    <BrewsIcon
      role="support" // デフォルトは汎用サポート担当
      emotion={emotion}
      message={message}
      animation={animation}
      size={size}
      showBubble={shouldShowBubble}
      className={className}
    />
  );
};

export default BrewsWrapper;

// 既存のBrewCharacterとして使えるようにエクスポート
export { BrewsWrapper as BrewCharacter };
