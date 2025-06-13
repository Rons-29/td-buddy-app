import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'ghost'
    | 'measure'
    | 'cut'
    | 'join'
    | 'inspect'
    | 'polish';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  workbench?: boolean; // ワークベンチスタイルを適用するかどうか
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      workbench = true, // デフォルトでワークベンチスタイル
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // ワークベンチスタイル
    const workbenchBaseStyles =
      'wb-action-button transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';

    // レガシースタイル（下位互換性のため）
    const legacyBaseStyles =
      'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';

    const workbenchVariants = {
      primary: 'wb-action-primary',
      secondary: 'wb-action-secondary',
      success: 'wb-action-join',
      warning: 'wb-action-warning',
      danger: 'wb-action-cut',
      ghost: 'wb-action-ghost',
      // 工具別バリアント
      measure: 'wb-button-measure',
      cut: 'wb-button-cut',
      join: 'wb-button-join',
      inspect: 'wb-button-inspect',
      polish: 'wb-button-polish',
    };

    const legacyVariants = {
      primary:
        'bg-gradient-to-r from-orange-500 to-td-primary-600 hover:from-orange-600 hover:to-td-primary-700 text-white shadow-lg hover:shadow-xl focus:ring-td-primary-500',
      secondary:
        'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 shadow-md hover:shadow-lg focus:ring-gray-500',
      success:
        'bg-gradient-to-r from-td-accent-500 to-td-accent-600 hover:from-td-accent-600 hover:to-td-accent-700 text-white shadow-lg hover:shadow-xl focus:ring-td-accent-500',
      warning:
        'bg-gradient-to-r from-td-secondary-500 to-amber-600 hover:from-td-secondary-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl focus:ring-td-secondary-500',
      danger:
        'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500',
      ghost:
        'text-orange-600 hover:bg-orange-50 hover:text-orange-700 focus:ring-td-primary-500',
      measure:
        'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl focus:ring-orange-500',
      cut: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500',
      join: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl focus:ring-green-500',
      inspect:
        'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500',
      polish:
        'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-purple-500',
    };

    const workbenchSizes = {
      sm: 'wb-text-sm px-3 py-2',
      md: 'wb-text-base px-4 py-3',
      lg: 'wb-text-lg px-6 py-4',
      xl: 'wb-text-xl px-8 py-5',
    };

    const legacySizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-6 py-4 text-lg',
      xl: 'px-8 py-5 text-xl',
    };

    const baseStyles = workbench ? workbenchBaseStyles : legacyBaseStyles;
    const variants = workbench ? workbenchVariants : legacyVariants;
    const sizes = workbench ? workbenchSizes : legacySizes;

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
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
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
