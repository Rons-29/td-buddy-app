import React from 'react';
import { cn } from '../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | 'default'
    | 'glass'
    | 'elevated'
    | 'bordered'
    | 'tool'
    | 'measure'
    | 'cut'
    | 'join'
    | 'inspect'
    | 'polish';
  hover?: boolean;
  workbench?: boolean; // ワークベンチスタイルを適用するかどうか
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      hover = false,
      workbench = true,
      ...props
    },
    ref
  ) => {
    // ワークベンチスタイル
    const workbenchVariants = {
      default: 'wb-tool-panel',
      glass: 'wb-surface-secondary backdrop-blur-lg',
      elevated: 'wb-surface-primary shadow-2xl border-0',
      bordered: 'wb-surface-primary wb-border-2',
      tool: 'wb-tool-card',
      measure: 'wb-tool-card wb-tool-measure',
      cut: 'wb-tool-card wb-tool-cut',
      join: 'wb-tool-card wb-tool-join',
      inspect: 'wb-tool-card wb-tool-inspect',
      polish: 'wb-tool-card wb-tool-polish',
    };

    // レガシースタイル（下位互換性のため）
    const legacyVariants = {
      default: 'bg-white shadow-lg border border-gray-200',
      glass: 'bg-white/80 backdrop-blur-lg shadow-xl border border-white/20',
      elevated: 'bg-white shadow-2xl border-0',
      bordered: 'bg-white shadow-md border-2 border-orange-200',
      tool: 'bg-white shadow-lg border border-gray-200',
      measure: 'bg-orange-50 shadow-lg border border-orange-200',
      cut: 'bg-red-50 shadow-lg border border-red-200',
      join: 'bg-green-50 shadow-lg border border-green-200',
      inspect: 'bg-blue-50 shadow-lg border border-blue-200',
      polish: 'bg-purple-50 shadow-lg border border-purple-200',
    };

    const variants = workbench ? workbenchVariants : legacyVariants;

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl p-6 transition-all duration-300 ease-in-out',
          variants[variant],
          hover &&
            'hover:transform hover:scale-105 hover:shadow-2xl cursor-pointer',
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-4', className)}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & { workbench?: boolean }
>(({ className, workbench = true, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      workbench
        ? 'wb-tool-panel-title'
        : 'text-2xl font-semibold leading-none tracking-tight text-gray-800',
      className
    )}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { workbench?: boolean }
>(({ className, workbench = true, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      workbench ? 'wb-tool-panel-description' : 'text-sm text-gray-600',
      className
    )}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-0', className)} {...props} />
));

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4', className)}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
