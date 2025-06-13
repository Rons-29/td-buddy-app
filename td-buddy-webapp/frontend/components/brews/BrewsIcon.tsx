'use client';

import { BrewsEmotion, BrewsIconProps } from '@/types/brews';
import {
  getAnimationClasses,
  getBrewsConfig,
  getColorClasses,
  getDefaultMessage,
  getSizeClasses,
} from '@/utils/brewsHelpers';
import * as LucideIcons from 'lucide-react';
import React, { useEffect, useState } from 'react';

const BrewsIcon: React.FC<BrewsIconProps> = ({
  role = 'support',
  emotion = 'happy',
  size = 'medium',
  animation = 'none',
  message,
  showBubble = true,
  className = '',
  onClick,
}) => {
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const config = getBrewsConfig(role);
  const displayMessage = message || getDefaultMessage(role, emotion);

  useEffect(() => {
    setCurrentMessage(displayMessage);
  }, [displayMessage]);

  // アイコンコンポーネントを動的に取得
  const IconComponent = LucideIcons[
    config.icon as keyof typeof LucideIcons
  ] as React.ComponentType<any>;

  // アニメーション処理
  useEffect(() => {
    if (animation !== 'none') {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1200); // アニメーション時間
      return () => clearTimeout(timer);
    }
  }, [animation, emotion, role]);

  // 感情に応じたオーバーレイアイコン
  const getEmotionOverlay = (emotion: BrewsEmotion) => {
    const overlayIcons: Partial<
      Record<BrewsEmotion, React.ComponentType<any>>
    > = {
      success: LucideIcons.CheckCircle,
      error: LucideIcons.AlertTriangle,
      warning: LucideIcons.AlertTriangle,
      working: LucideIcons.Clock,
      excited: LucideIcons.Zap,
    };
    return overlayIcons[emotion];
  };

  const OverlayIcon = getEmotionOverlay(emotion);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    // クリック時のバウンスアニメーション
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const baseClasses = `
    brews-icon
    ${getSizeClasses(size)}
    ${getColorClasses(config.color, emotion)}
    mx-auto
    flex items-center justify-center
    rounded-full
    border-2
    cursor-pointer
    transition-all duration-300
    hover:scale-105
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    ${isAnimating ? getAnimationClasses(animation) : ''}
    ${className}
  `;

  return (
    <div className="brews-icon-container">
      {/* メッセージバブル */}
      {showBubble && currentMessage && (
        <div className="relative mb-3">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-3 shadow-lg relative max-w-xs">
            <p className="text-gray-800 text-sm font-medium text-center">
              {currentMessage}
            </p>
            {/* 吹き出しの三角形 */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-200"></div>
            </div>
          </div>
        </div>
      )}

      {/* Brewsアイコン本体 */}
      <div className="relative">
        <div
          className={baseClasses}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          aria-label={`Brews の${config.name} - 現在の感情: ${emotion}, メッセージ: ${currentMessage}`}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick();
            }
          }}
        >
          {IconComponent && (
            <IconComponent
              className={`${
                size === 'small'
                  ? 'w-4 h-4'
                  : size === 'medium'
                  ? 'w-6 h-6'
                  : 'w-8 h-8'
              }`}
              aria-hidden="true"
            />
          )}
        </div>

        {/* 感情オーバーレイ */}
        {OverlayIcon && (
          <div
            className={`absolute ${
              size === 'small'
                ? '-top-1 -right-1'
                : size === 'large'
                ? '-top-3 -right-3'
                : '-top-2 -right-2'
            }`}
          >
            <div
              className={`
                ${
                  size === 'small'
                    ? 'w-5 h-5'
                    : size === 'large'
                    ? 'w-8 h-8'
                    : 'w-6 h-6'
                }
                rounded-full flex items-center justify-center shadow-lg border-2 border-white
                ${
                  emotion === 'success'
                    ? 'bg-green-500 text-white'
                    : emotion === 'error'
                    ? 'bg-red-500 text-white'
                    : emotion === 'warning'
                    ? 'bg-yellow-500 text-white'
                    : emotion === 'working'
                    ? 'bg-blue-500 text-white'
                    : emotion === 'excited'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-500 text-white'
                }
              `}
            >
              <OverlayIcon
                className={`${
                  size === 'small'
                    ? 'w-3 h-3'
                    : size === 'large'
                    ? 'w-5 h-5'
                    : 'w-3.5 h-3.5'
                }`}
                aria-hidden="true"
              />
            </div>
          </div>
        )}
      </div>

      {/* 役割ラベル */}
      <div className="text-center mt-2">
        <span
          className={`
            text-xs px-2 py-1 rounded-full font-medium
            ${getColorClasses(config.color, emotion)}
            ${emotion === 'brewing' ? 'animate-pulse' : ''}
          `}
        >
          {config.name}
        </span>
      </div>
    </div>
  );
};

export default BrewsIcon;
