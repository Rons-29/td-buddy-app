'use client';

import { BrewsEmotion, BrewsIconProps } from '@/types/brews';
import {
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
  showBubble = false,
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
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [animation, emotion, role]);

  // 感情に応じたオーバーレイアイコン
  const getEmotionOverlay = (emotion?: BrewsEmotion) => {
    if (!emotion) {
      return null;
    }
    const overlayIcons: Partial<
      Record<BrewsEmotion, React.ComponentType<any>>
    > = {
      success: LucideIcons.CheckCircle,
      error: LucideIcons.AlertTriangle,
      warning: LucideIcons.AlertTriangle,
      working: LucideIcons.Clock,
      excited: LucideIcons.Zap,
      happy: LucideIcons.Heart,
      thinking: LucideIcons.Brain,
      sleepy: LucideIcons.Moon,
      brewing: LucideIcons.Coffee,
      completed: LucideIcons.Star,
    };
    return overlayIcons[emotion];
  };

  const OverlayIcon = getEmotionOverlay(emotion);

  // オーバーレイサイズの計算
  const getOverlaySize = () => {
    if (size === 'small') {
      return {
        wrapper: 'w-3 h-3',
        iconSize: 8,
        position: 'top-0 right-0',
      };
    }
    if (size === 'large') {
      return {
        wrapper: 'w-6 h-6',
        iconSize: 14,
        position: '-top-1 -right-1',
      };
    }
    return {
      wrapper: 'w-4 h-4',
      iconSize: 10,
      position: '-top-1 -right-1',
    };
  };

  const overlaySize = getOverlaySize();

  // アニメーションクラスの取得
  const getAnimationClasses = () => {
    const animations = {
      bounce: 'animate-bounce',
      wiggle: 'animate-wiggle',
      pulse: 'animate-pulse',
      spin: 'animate-spin',
      heartbeat: 'animate-heartbeat',
      float: 'animate-float',
      none: '',
    };
    return animations[animation] || '';
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    // クリック時のバウンスアニメーション
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const containerClasses = [
    'relative inline-block',
    'transition-all duration-300 ease-in-out',
    'hover:scale-105',
    onClick && 'cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconClasses = [
    getSizeClasses(size),
    getColorClasses(config.color, emotion),
    'transition-all duration-200',
    getAnimationClasses(),
    isAnimating && 'animate-bounce',
  ]
    .filter(Boolean)
    .join(' ');

  const overlayClasses = [
    'absolute rounded-full flex items-center justify-center',
    'bg-white border-2 border-gray-300 shadow-lg',
    overlaySize.wrapper,
    overlaySize.position,
    'animate-in fade-in-0 duration-300',
    'transition-all duration-300 ease-in-out',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} onClick={handleClick}>
      {/* メッセージバブル */}
      {currentMessage && showBubble && (
        <div className="relative mb-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
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
      <div className="relative flex items-center justify-center">
        <div
          className={iconClasses}
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
              className="w-full h-full max-w-none transition-transform duration-200"
              style={{
                width:
                  size === 'small'
                    ? '16px'
                    : size === 'medium'
                    ? '24px'
                    : '32px',
                height:
                  size === 'small'
                    ? '16px'
                    : size === 'medium'
                    ? '24px'
                    : '32px',
              }}
              aria-hidden="true"
            />
          )}
        </div>

        {/* 感情オーバーレイ */}
        {emotion && OverlayIcon && (
          <div className={overlayClasses}>
            <OverlayIcon
              size={overlaySize.iconSize}
              className="transition-transform duration-200 hover:scale-110"
            />
          </div>
        )}
      </div>

      {/* 役割ラベル（小さいサイズでは非表示） */}
      {size !== 'small' && (
        <div className="text-center mt-2">
          <span className="text-xs font-medium text-gray-600">
            {config.name}
          </span>
        </div>
      )}
    </div>
  );
};

export default BrewsIcon;
