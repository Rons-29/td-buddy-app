'use client';

import React from 'react';
import { ButtonType } from '../../hooks/useButtonState';

interface ActionButtonProps {
  type: ButtonType;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'accent' | 'gray' | 'green';
  className?: string;
  children?: React.ReactNode;
}

const buttonConfig = {
  copy: {
    icon: '📋',
    label: 'コピー',
    activeLabel: 'コピー済み',
    defaultVariant: 'primary' as const,
  },
  clear: {
    icon: '🗑️',
    label: 'クリア',
    activeLabel: 'クリア済み',
    defaultVariant: 'gray' as const,
  },
  replace: {
    icon: '↩️',
    label: '置き換え',
    activeLabel: '置き換え済み',
    defaultVariant: 'secondary' as const,
  },
  paste: {
    icon: '📋',
    label: '貼り付け',
    activeLabel: '貼り付け済み',
    defaultVariant: 'accent' as const,
  },
  generate: {
    icon: '🎯',
    label: '生成',
    activeLabel: '生成完了',
    defaultVariant: 'secondary' as const,
  },
  download: {
    icon: '💾',
    label: 'ダウンロード',
    activeLabel: 'ダウンロード済み',
    defaultVariant: 'accent' as const,
  },
};

const variantStyles = {
  primary: 'bg-td-primary-500 text-white hover:bg-td-primary-600',
  secondary: 'bg-td-secondary-500 text-white hover:bg-td-secondary-600',
  accent: 'bg-td-accent-500 text-white hover:bg-td-accent-600',
  gray: 'bg-td-gray-500 text-white hover:bg-td-gray-600',
  green: 'bg-green-500 text-white',
};

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base',
};

export function ActionButton({
  type,
  onClick,
  isActive = false,
  disabled = false,
  size = 'md',
  variant,
  className = '',
  children,
}: ActionButtonProps) {
  const config = buttonConfig[type];
  const finalVariant = isActive ? 'green' : (variant || config.defaultVariant);
  const label = isActive ? config.activeLabel : config.label;
  const icon = isActive ? '✅' : config.icon;

  const baseClasses = 'rounded transition-colors font-medium';
  const variantClasses = variantStyles[finalVariant];
  const sizeClasses = sizeStyles[size];
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  const finalClassName = `${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={finalClassName}
    >
      {children || (
        <span className="flex items-center space-x-1">
          <span>{icon}</span>
          <span>{label}</span>
        </span>
      )}
    </button>
  );
} 