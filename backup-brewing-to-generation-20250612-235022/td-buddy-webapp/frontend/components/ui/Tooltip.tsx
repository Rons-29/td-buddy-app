'use client';

import { Info } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

// グローバルなツールチップ管理
let activeTooltips = new Set<string>();

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  showInfoIcon?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  id?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  showInfoIcon = true,
  position = 'auto',
  id = Math.random().toString(36).substr(2, 9),
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [computedPosition, setComputedPosition] = useState<
    'top' | 'bottom' | 'left' | 'right'
  >('top');
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // 位置を動的に計算
  const calculatePosition = () => {
    if (!triggerRef.current || position !== 'auto') {
      return position as 'top' | 'bottom' | 'left' | 'right';
    }

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 画面のどの位置にあるかを判定
    const isNearTop = rect.top < 100;
    const isNearBottom = rect.bottom > viewportHeight - 100;
    const isNearLeft = rect.left < 100;
    const isNearRight = rect.right > viewportWidth - 100;

    // 最適な位置を決定（優先度：top > bottom > right > left）
    if (!isNearTop) return 'top';
    if (!isNearBottom) return 'bottom';
    if (!isNearRight) return 'right';
    return 'left';
  };

  const handleShow = () => {
    // 他のツールチップを非表示にする
    activeTooltips.forEach(tooltipId => {
      if (tooltipId !== id) {
        const event = new CustomEvent('hideTooltip', { detail: tooltipId });
        window.dispatchEvent(event);
      }
    });

    const newPosition = calculatePosition();
    setComputedPosition(newPosition);
    setIsVisible(true);
    activeTooltips.add(id);
  };

  const handleHide = () => {
    setIsVisible(false);
    activeTooltips.delete(id);
  };

  useEffect(() => {
    const handleHideTooltip = (event: CustomEvent) => {
      if (event.detail === id) {
        handleHide();
      }
    };

    window.addEventListener('hideTooltip', handleHideTooltip as EventListener);
    return () => {
      window.removeEventListener(
        'hideTooltip',
        handleHideTooltip as EventListener
      );
      activeTooltips.delete(id);
    };
  }, [id]);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-3',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-800 border-t-[6px] border-x-transparent border-x-[6px] border-b-0',
    bottom:
      'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800 border-b-[6px] border-x-transparent border-x-[6px] border-t-0',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-800 border-l-[6px] border-y-transparent border-y-[6px] border-r-0',
    right:
      'right-full top-1/2 transform -translate-y-1/2 border-r-gray-800 border-r-[6px] border-y-transparent border-y-[6px] border-l-0',
  };

  return (
    <div className="relative inline-block" ref={triggerRef}>
      <div
        className="flex items-center gap-1 cursor-help"
        onMouseEnter={handleShow}
        onMouseLeave={handleHide}
        onFocus={handleShow}
        onBlur={handleHide}
        tabIndex={0}
        role="button"
        aria-describedby={`tooltip-${id}`}
        aria-label={`情報: ${content}`}
      >
        {children}
        {showInfoIcon && (
          <Info className="w-3 h-3 text-gray-400 hover:text-blue-500 transition-colors duration-200 flex-shrink-0" />
        )}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          id={`tooltip-${id}`}
          role="tooltip"
          className={`
            absolute z-[9999] px-3 py-2 text-xs text-white bg-gray-800 
            rounded-md shadow-xl max-w-sm whitespace-normal
            transition-opacity duration-200 ease-in-out
            border border-gray-700
            ${positionClasses[computedPosition]}
          `}
          style={{
            wordWrap: 'break-word',
            lineHeight: '1.4',
            // 画面外に出ないように調整
            ...(computedPosition === 'top' || computedPosition === 'bottom'
              ? {
                  maxWidth: 'min(20rem, 90vw)',
                }
              : {
                  maxWidth: 'min(16rem, 80vw)',
                }),
          }}
        >
          {content}
          <div
            className={`absolute w-0 h-0 ${arrowClasses[computedPosition]}`}
          ></div>
        </div>
      )}
    </div>
  );
};

// ラベル付きツールチップコンポーネント（改善版）
interface LabelWithTooltipProps {
  label: string;
  tooltip: string;
  required?: boolean;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
}

export const LabelWithTooltip: React.FC<LabelWithTooltipProps> = ({
  label,
  tooltip,
  required = false,
  tooltipPosition = 'auto',
}) => {
  return (
    <div className="flex items-center gap-1 min-w-0">
      <span className="text-xs font-medium text-gray-700 truncate">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      <Tooltip
        content={tooltip}
        position={tooltipPosition}
        id={`label-tooltip-${label.replace(/\s+/g, '-').toLowerCase()}`}
      />
    </div>
  );
};

// グローバルなツールチップクリーンアップ関数
export const clearAllTooltips = () => {
  activeTooltips.forEach(id => {
    const event = new CustomEvent('hideTooltip', { detail: id });
    window.dispatchEvent(event);
  });
  activeTooltips.clear();
};
