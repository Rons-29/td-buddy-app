'use client';

import { Info } from 'lucide-react';
import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  showInfoIcon?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  showInfoIcon = true,
  position = 'top',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-800 border-t-[5px] border-x-transparent border-x-[5px] border-b-0',
    bottom:
      'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800 border-b-[5px] border-x-transparent border-x-[5px] border-t-0',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-800 border-l-[5px] border-y-transparent border-y-[5px] border-r-0',
    right:
      'right-full top-1/2 transform -translate-y-1/2 border-r-gray-800 border-r-[5px] border-y-transparent border-y-[5px] border-l-0',
  };

  return (
    <div className="relative inline-block">
      <div
        className="flex items-center gap-1 cursor-help"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        tabIndex={0}
        role="button"
        aria-describedby="tooltip"
        aria-label={`情報: ${content}`}
      >
        {children}
        {showInfoIcon && (
          <Info className="w-3 h-3 text-gray-400 hover:text-blue-500 transition-colors duration-200" />
        )}
      </div>

      {isVisible && (
        <div
          id="tooltip"
          role="tooltip"
          className={`absolute z-50 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg max-w-xs whitespace-normal ${positionClasses[position]}`}
          style={{ wordWrap: 'break-word' }}
        >
          {content}
          <div className={`absolute w-0 h-0 ${arrowClasses[position]}`}></div>
        </div>
      )}
    </div>
  );
};

// ラベル付きツールチップコンポーネント
interface LabelWithTooltipProps {
  label: string;
  tooltip: string;
  required?: boolean;
}

export const LabelWithTooltip: React.FC<LabelWithTooltipProps> = ({
  label,
  tooltip,
  required = false,
}) => {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      <Tooltip content={tooltip} position="top" />
    </div>
  );
};
