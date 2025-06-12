'use client';

import React from 'react';
import { ButtonType } from '../../hooks/useButtonState';

interface ActionButtonProps {
  type: ButtonType;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'gray'
    | 'green'
    | 'danger'
    | 'warning';
  className?: string;
  children?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
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
    activeLabel: '醸造完了',
    defaultVariant: 'secondary' as const,
  },
  download: {
    icon: '💾',
    label: 'ダウンロード',
    activeLabel: 'ダウンロード済み',
    defaultVariant: 'accent' as const,
  },
};

// td-buttonスタイルと統合されたバリアント
const variantStyles = {
  primary:
    'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500',
  secondary:
    'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 shadow-md hover:shadow-lg focus:ring-gray-500',
  accent:
    'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl focus:ring-emerald-500',
  gray: 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg hover:shadow-xl focus:ring-gray-500',
  green:
    'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl focus:ring-green-500',
  danger:
    'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500',
  warning:
    'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl focus:ring-yellow-500',
};

const sizeStyles = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-6 py-4 text-lg',
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
  fullWidth = false,
  loading = false,
}: ActionButtonProps) {
  const config = buttonConfig[type];
  const finalVariant = isActive ? 'green' : variant || config.defaultVariant;
  const label = isActive ? config.activeLabel : config.label;
  const icon = isActive ? '✅' : config.icon;

  // td-buttonスタイルを統合した基本クラス
  const baseClasses =
    'td-button inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';

  const variantClasses = variantStyles[finalVariant];
  const sizeClasses = sizeStyles[size];
  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer';
  const fullWidthClasses = fullWidth ? 'w-full' : '';

  const finalClassName = `${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${fullWidthClasses} ${className}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={finalClassName}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {children || (
        <span className="flex items-center space-x-2">
          {!loading && <span>{icon}</span>}
          <span>{label}</span>
        </span>
      )}
    </button>
  );
}

// 新しい汎用Buttonコンポーネント（ActionButtonの拡張版）
interface TDButtonProps {
  onClick: () => void;
  variant?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'gray'
    | 'green'
    | 'danger'
    | 'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  children: React.ReactNode;
}

export function TDButton({
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  children,
}: TDButtonProps) {
  const baseClasses =
    'td-button inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';

  const variantClasses = variantStyles[variant];
  const sizeClasses = sizeStyles[size];
  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer';
  const fullWidthClasses = fullWidth ? 'w-full' : '';

  const finalClassName = `${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${fullWidthClasses} ${className}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={finalClassName}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2">{icon}</span>
      )}

      {children}

      {icon && iconPosition === 'right' && !loading && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
}
