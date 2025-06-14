import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'outline'
    | 'measure'
    | 'cut'
    | 'join'
    | 'inspect'
    | 'polish';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  workbench?: boolean; // ワークベンチスタイルを適用するかどうか
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      workbench = true,
      children,
      ...props
    },
    ref
  ) => {
    // ワークベンチスタイル
    const workbenchBaseStyles =
      'wb-badge transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

    // レガシースタイル（下位互換性のため）
    const legacyBaseStyles =
      'inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

    const workbenchVariants = {
      primary: 'wb-badge-primary',
      secondary: 'wb-badge-secondary',
      success: 'wb-badge-join',
      warning: 'wb-badge-warning',
      danger: 'wb-badge-cut',
      outline: 'wb-badge-outline',
      // 工具別バリアント
      measure: 'wb-badge-measure',
      cut: 'wb-badge-cut',
      join: 'wb-badge-join',
      inspect: 'wb-badge-inspect',
      polish: 'wb-badge-polish',
    };

    const legacyVariants = {
      primary: 'bg-orange-500 text-white',
      secondary: 'bg-gray-100 text-gray-800',
      success: 'bg-td-accent-500 text-white',
      warning: 'bg-td-secondary-500 text-white',
      danger: 'bg-red-500 text-white',
      outline: 'border border-gray-300 text-gray-700 bg-white',
      measure: 'bg-orange-500 text-white',
      cut: 'bg-red-500 text-white',
      join: 'bg-green-500 text-white',
      inspect: 'bg-blue-500 text-white',
      polish: 'bg-purple-500 text-white',
    };

    const workbenchSizes = {
      sm: 'wb-text-xs px-2 py-0.5',
      md: 'wb-text-sm px-2.5 py-1',
      lg: 'wb-text-base px-3 py-1.5',
    };

    const legacySizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    };

    const baseStyles = workbench ? workbenchBaseStyles : legacyBaseStyles;
    const variants = workbench ? workbenchVariants : legacyVariants;
    const sizes = workbench ? workbenchSizes : legacySizes;

    return (
      <span
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps };
