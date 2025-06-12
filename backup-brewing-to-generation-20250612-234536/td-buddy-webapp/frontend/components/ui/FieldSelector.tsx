import React from 'react';
import { cn } from '../utils/cn';

interface FieldOption {
  id: string;
  label: string;
  icon: string;
  description: string;
  selected: boolean;
}

interface FieldSelectorProps {
  options: FieldOption[];
  onToggle: (id: string) => void;
  className?: string;
}

const FieldSelector: React.FC<FieldSelectorProps> = ({ options, onToggle, className }) => {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {options.map((option) => (
        <div
          key={option.id}
          onClick={() => onToggle(option.id)}
          className={cn(
            'group relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300 ease-in-out',
            'hover:scale-105 hover:shadow-lg transform',
            option.selected
              ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-td-primary-100 shadow-md'
              : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
          )}
        >
          {/* 選択状態のオーバーレイ */}
          {option.selected && (
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-td-primary-500">
              <svg 
                className="absolute -top-6 -right-1 h-4 w-4 text-white" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
          )}
          
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className={cn(
                'text-2xl transition-all duration-200',
                option.selected 
                  ? 'transform scale-110' 
                  : 'group-hover:transform group-hover:scale-110'
              )}>
                {option.icon}
              </div>
              <h3 className={cn(
                'font-semibold text-sm transition-colors duration-200',
                option.selected 
                  ? 'text-orange-700' 
                  : 'text-gray-700 group-hover:text-orange-600'
              )}>
                {option.label}
              </h3>
            </div>
            
            <p className={cn(
              'text-xs transition-colors duration-200',
              option.selected 
                ? 'text-orange-600' 
                : 'text-gray-500 group-hover:text-gray-600'
            )}>
              {option.description}
            </p>
          </div>

          {/* ホバー時のグロー効果 */}
          <div className={cn(
            'absolute inset-0 opacity-0 transition-opacity duration-300',
            'bg-gradient-to-br from-orange-500/10 to-td-accent-500/10',
            'group-hover:opacity-100'
          )} />
        </div>
      ))}
    </div>
  );
};

export { FieldSelector };
export type { FieldOption }; 