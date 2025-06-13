import React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?:
    | 'default'
    | 'error'
    | 'success'
    | 'measure'
    | 'cut'
    | 'join'
    | 'inspect'
    | 'polish';
  fullWidth?: boolean;
  workbench?: boolean; // ワークベンチスタイルを適用するかどうか
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant = 'default',
      fullWidth = false,
      workbench = true,
      ...props
    },
    ref
  ) => {
    // ワークベンチスタイル
    const workbenchBaseClasses =
      'wb-text-input transition-colors duration-200 focus:outline-none focus:ring-2';

    // レガシースタイル（下位互換性のため）
    const legacyBaseClasses =
      'px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200';

    const workbenchVariantClasses = {
      default: 'wb-border wb-focus-ring',
      error:
        'border-wb-tool-cut-300 focus:ring-wb-tool-cut-500 focus:border-wb-tool-cut-500',
      success:
        'border-wb-tool-join-300 focus:ring-wb-tool-join-500 focus:border-wb-tool-join-500',
      measure:
        'border-wb-tool-measure-300 focus:ring-wb-tool-measure-500 focus:border-wb-tool-measure-500',
      cut: 'border-wb-tool-cut-300 focus:ring-wb-tool-cut-500 focus:border-wb-tool-cut-500',
      join: 'border-wb-tool-join-300 focus:ring-wb-tool-join-500 focus:border-wb-tool-join-500',
      inspect:
        'border-wb-tool-inspect-300 focus:ring-wb-tool-inspect-500 focus:border-wb-tool-inspect-500',
      polish:
        'border-wb-tool-polish-300 focus:ring-wb-tool-polish-500 focus:border-wb-tool-polish-500',
    };

    const legacyVariantClasses = {
      default: 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
      error: 'border-red-300 focus:ring-red-500 focus:border-red-500',
      success: 'border-green-300 focus:ring-green-500 focus:border-green-500',
      measure:
        'border-orange-300 focus:ring-orange-500 focus:border-orange-500',
      cut: 'border-red-300 focus:ring-red-500 focus:border-red-500',
      join: 'border-green-300 focus:ring-green-500 focus:border-green-500',
      inspect: 'border-blue-300 focus:ring-blue-500 focus:border-blue-500',
      polish: 'border-purple-300 focus:ring-purple-500 focus:border-purple-500',
    };

    const widthClasses = fullWidth ? 'w-full' : '';

    const baseClasses = workbench ? workbenchBaseClasses : legacyBaseClasses;
    const variantClasses = workbench
      ? workbenchVariantClasses
      : legacyVariantClasses;

    const combinedClasses = [
      baseClasses,
      variantClasses[variant],
      widthClasses,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <input type={type} className={combinedClasses} ref={ref} {...props} />
    );
  }
);

Input.displayName = 'Input';

export { Input };
