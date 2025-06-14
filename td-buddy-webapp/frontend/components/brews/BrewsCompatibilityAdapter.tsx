'use client';

import type {
  BrewsAnimation,
  BrewsEmotion,
  BrewsIconProps,
  BrewsRole,
  BrewsSize,
} from '@/types/brews';
import React from 'react';
import BrewsIcon from './BrewsIcon';

// 旧BrewCharacterからの型インポート（互換性のため）
export type BrewEmotion = BrewsEmotion;
export type BrewAnimation = BrewsAnimation;

// 拡張された感情タイプ（旧システムとの互換性）
export type ExtendedBrewEmotion =
  | BrewsEmotion
  | 'neutral'
  | 'friendly'
  | 'sad'
  | 'curious'
  | 'worried'
  | 'confused'
  | 'determined';

// 旧BrewCharacterのProps（互換性のため）
export interface BrewCharacterCompatProps {
  emotion?: ExtendedBrewEmotion;
  message?: string;
  animation?: BrewAnimation;
  size?: 'small' | 'medium' | 'large';
  showMessage?: boolean;
  onClick?: () => void;
  className?: string;
  // 旧システム独自のProps
  role?: string;
  isActive?: boolean;
  isProcessing?: boolean;
  autoMessage?: boolean;
}

/**
 * 旧感情タイプを新感情タイプにマッピング
 */
const mapOldEmotionToNew = (emotion: ExtendedBrewEmotion): BrewsEmotion => {
  const emotionMap: Record<string, BrewsEmotion> = {
    neutral: 'happy',
    friendly: 'happy',
    sad: 'error',
    curious: 'thinking',
    worried: 'warning',
    confused: 'thinking',
    determined: 'working',
  };

  return emotionMap[emotion] || (emotion as BrewsEmotion);
};

/**
 * 旧ロール名を新ロール名にマッピング
 */
const mapOldRoleToNew = (role?: string): BrewsRole => {
  const roleMap: Record<string, BrewsRole> = {
    brew: 'ai',
    brewer: 'ai',
    helper: 'support',
    assistant: 'ai',
    generator: 'ai',
    data: 'csv',
    file: 'csv',
    'password-generator': 'password',
    'person-generator': 'personal',
    'csv-generator': 'csv',
    'json-generator': 'json',
    'text-generator': 'text',
    'number-generator': 'number',
    'date-generator': 'datetime',
    'uuid-generator': 'uuid',
  };

  return roleMap[role || ''] || 'ai';
};

/**
 * BrewsCompatibilityAdapter - 旧BrewCharacterから新BrewsIconへの変換アダプター
 *
 * このコンポーネントは既存のBrewCharacterのAPIを維持しながら、
 * 内部で新しいBrewsIconシステムを使用します。
 */
export const BrewsCompatibilityAdapter: React.FC<BrewCharacterCompatProps> = ({
  emotion = 'happy',
  message,
  animation = 'none',
  size = 'medium',
  showMessage = true,
  onClick,
  className = '',
  role,
  isActive = false,
  isProcessing = false,
  autoMessage = true,
}) => {
  // 旧APIから新APIへの変換
  const brewsProps: BrewsIconProps = {
    role: mapOldRoleToNew(role),
    emotion: mapOldEmotionToNew(emotion),
    animation: isProcessing ? 'spin' : animation,
    size: size as BrewsSize,
    message: message,
    showBubble: showMessage && Boolean(message),
    onClick,
    className: `brews-compat-adapter ${isActive ? 'active' : ''} ${className}`,
  };

  return (
    <div className="brews-compatibility-wrapper">
      <BrewsIcon {...brewsProps} />
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-1 bg-blue-500 rounded-full animate-ping" />
        </div>
      )}
    </div>
  );
};

/**
 * 直接的な互換性エイリアス
 * 既存コードでimport BrewCharacterとしている箇所用
 */
export const BrewCharacter = BrewsCompatibilityAdapter;

/**
 * レガシーサポート関数
 */
export const createLegacyBrewCharacter = (props: BrewCharacterCompatProps) => {
  return <BrewsCompatibilityAdapter {...props} />;
};

/**
 * マイグレーション用のヘルパー関数
 */
export const migrateBrewCharacterProps = (
  legacyProps: BrewCharacterCompatProps
): BrewsIconProps => {
  return {
    role: mapOldRoleToNew(legacyProps.role),
    emotion: mapOldEmotionToNew(legacyProps.emotion || 'happy'),
    animation: legacyProps.isProcessing ? 'spin' : legacyProps.animation,
    size: legacyProps.size as BrewsSize,
    message: legacyProps.message,
    showBubble: legacyProps.showMessage && Boolean(legacyProps.message),
    onClick: legacyProps.onClick,
    className: legacyProps.className,
  };
};
