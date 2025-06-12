/**
 * Heavy Animations Component
 * 重いアニメーション用のコンポーネント（遅延読み込み対象）
 */

import React from 'react';

export interface HeavyAnimationProps {
  type?: 'particle' | 'explosion' | 'sparkle';
  intensity?: 'low' | 'medium' | 'high';
  isActive?: boolean;
}

/**
 * 重いアニメーションコンポーネント
 * パフォーマンスへの影響を考慮して遅延読み込みで使用
 */
const HeavyAnimations: React.FC<HeavyAnimationProps> = ({
  type = 'sparkle',
  intensity = 'medium',
  isActive = false,
}) => {
  if (!isActive) return null;

  // 軽量な代替実装（実際のヘビーアニメーションは無効化）
  return (
    <div className="heavy-animation-placeholder">
      <div className="animate-pulse text-xs text-gray-400">
        {type} animation ({intensity})
      </div>
    </div>
  );
};

export default HeavyAnimations;
