'use client';

import React from 'react';
import { LabelWithTooltip } from './Tooltip';

// === 📐 TD Design System v2.0準拠 コンパクトフォームコンポーネント ===

interface CompactFieldProps {
  label: string;
  tooltip: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  required?: boolean;
  className?: string;
}

interface CompactInputProps extends CompactFieldProps {
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  disabled?: boolean;
}

interface CompactSelectProps extends CompactFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
}

interface CompactCheckboxProps {
  label: string;
  tooltip: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

interface CompactLayoutProps {
  children: React.ReactNode;
  className?: string;
  type?: 'grid-2' | 'grid-3' | 'grid-4' | 'horizontal' | 'stacked';
}

// コンパクト入力フィールド
export const CompactInput: React.FC<CompactInputProps> = ({
  label,
  tooltip,
  tooltipPosition = 'auto',
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
  min,
  max,
  step,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`td-field-group ${className}`}>
      <LabelWithTooltip
        label={label}
        tooltip={tooltip}
        required={required}
        tooltipPosition={tooltipPosition}
      />
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="td-input-compact td-focus-ring"
      />
    </div>
  );
};

// コンパクトセレクト
export const CompactSelect: React.FC<CompactSelectProps> = ({
  label,
  tooltip,
  tooltipPosition = 'auto',
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`td-field-group ${className}`}>
      <LabelWithTooltip
        label={label}
        tooltip={tooltip}
        required={required}
        tooltipPosition={tooltipPosition}
      />
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="td-select-compact td-focus-ring"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// コンパクトチェックボックス
export const CompactCheckbox: React.FC<CompactCheckboxProps> = ({
  label,
  tooltip,
  tooltipPosition = 'auto',
  checked,
  onChange,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`td-checkbox-compact ${className}`}>
      <label className="cursor-pointer flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="td-focus-ring"
        />
        <span className="select-none">{label}</span>
      </label>
      <LabelWithTooltip
        label=""
        tooltip={tooltip}
        tooltipPosition={tooltipPosition}
      />
    </div>
  );
};

// レイアウトコンテナ
export const CompactLayout: React.FC<CompactLayoutProps> = ({
  children,
  className = '',
  type = 'grid-2',
}) => {
  const layoutClasses = {
    'grid-2': 'td-settings-grid td-settings-grid-2',
    'grid-3': 'td-settings-grid td-settings-grid-3',
    'grid-4': 'td-settings-grid td-settings-grid-4',
    horizontal: 'td-detail-layout-horizontal',
    stacked: 'td-detail-layout-stacked',
  };

  return (
    <div className={`${layoutClasses[type]} ${className}`}>{children}</div>
  );
};

// 設定パネル
interface CompactPanelProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  showTip?: boolean;
  tipText?: string;
}

export const CompactPanel: React.FC<CompactPanelProps> = ({
  title,
  children,
  className = '',
  showTip = true,
  tipText = '設定項目のインフォマーク（ℹ️）にホバーすると詳しい説明が表示されます',
}) => {
  return (
    <div className={`td-detail-panel ${className}`}>
      <div className="td-detail-panel-content">
        {title && (
          <div className="td-settings-header">
            <h3 className="td-settings-title">⚙️ {title}</h3>
          </div>
        )}
        {children}
        {showTip && (
          <div className="td-tip-compact">
            <p className="td-tip-text">
              💡 <span className="font-medium">TDからのTip:</span> {tipText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// インライン設定行
interface CompactRowProps {
  children: React.ReactNode;
  className?: string;
  justify?: 'between' | 'start' | 'center' | 'end';
}

export const CompactRow: React.FC<CompactRowProps> = ({
  children,
  className = '',
  justify = 'between',
}) => {
  const justifyClasses = {
    between: 'justify-between',
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
  };

  return (
    <div
      className={`td-settings-row-2 ${justifyClasses[justify]} ${className}`}
    >
      {children}
    </div>
  );
};

// インライングループ
interface CompactGroupProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'horizontal' | 'vertical';
}

export const CompactGroup: React.FC<CompactGroupProps> = ({
  children,
  className = '',
  direction = 'horizontal',
}) => {
  const directionClass =
    direction === 'horizontal' ? 'td-field-group-inline' : 'td-field-group';

  return <div className={`${directionClass} ${className}`}>{children}</div>;
};

// 区切り線
export const CompactDivider: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return <div className={`td-settings-divider ${className}`} />;
};

// レスポンシブラッパー
interface ResponsiveWrapperProps {
  children: React.ReactNode;
  mobile?: boolean;
  tablet?: boolean;
  desktop?: boolean;
  className?: string;
}

export const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  children,
  mobile = true,
  tablet = true,
  desktop = true,
  className = '',
}) => {
  let responsiveClass = '';

  if (!mobile && tablet && desktop) responsiveClass = 'td-tablet-up';
  else if (mobile && !tablet && !desktop) responsiveClass = 'td-mobile-only';
  else if (!mobile && !tablet && desktop) responsiveClass = 'td-desktop-only';

  return <div className={`${responsiveClass} ${className}`}>{children}</div>;
};
