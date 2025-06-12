import React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error' | 'success';
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, variant = 'default', fullWidth = false, ...props },
    ref
  ) => {
    const baseClasses =
      'px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200';

    const variantClasses = {
      default: 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
      error: 'border-red-300 focus:ring-red-500 focus:border-red-500',
      success: 'border-green-300 focus:ring-green-500 focus:border-green-500',
    };

    const widthClasses = fullWidth ? 'w-full' : '';

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
