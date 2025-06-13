'use client';

import React, { useEffect, useState } from 'react';

// スクリーンリーダー専用テキストコンポーネント
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return <span className="wb-sr-only">{children}</span>;
}

// 工具ステータス表示コンポーネント（色覚多様性対応）
interface ToolStatusProps {
  status: 'success' | 'warning' | 'error' | 'info';
  message: string;
  showIcon?: boolean;
}

export function ToolStatus({
  status,
  message,
  showIcon = true,
}: ToolStatusProps) {
  const statusMap = {
    success: { label: '成功', icon: '✓' },
    warning: { label: '警告', icon: '⚠' },
    error: { label: 'エラー', icon: '✗' },
    info: { label: '情報', icon: 'i' },
  };

  const statusInfo = statusMap[status];

  return (
    <div
      className={`wb-status-indicator wb-status-${status}`}
      role="status"
      aria-live={status === 'error' ? 'assertive' : 'polite'}
    >
      <ScreenReaderOnly>{statusInfo.label}:</ScreenReaderOnly>
      {message}
      {showIcon && (
        <ScreenReaderOnly>（{statusInfo.icon}アイコン表示）</ScreenReaderOnly>
      )}
    </div>
  );
}

// 工具タイプ識別コンポーネント（色覚多様性対応）
interface ToolTypeIndicatorProps {
  type: 'inspect' | 'join' | 'measure' | 'polish' | 'cut';
  children: React.ReactNode;
  showPattern?: boolean;
}

export function ToolTypeIndicator({
  type,
  children,
  showPattern = false,
}: ToolTypeIndicatorProps) {
  const typeMap = {
    inspect: {
      name: '検査工具',
      emoji: '🔍',
      pattern: 'wb-tool-pattern-inspect',
    },
    join: { name: '結合工具', emoji: '🔧', pattern: 'wb-tool-pattern-join' },
    measure: {
      name: '測定工具',
      emoji: '📏',
      pattern: 'wb-tool-pattern-measure',
    },
    polish: {
      name: '研磨工具',
      emoji: '✨',
      pattern: 'wb-tool-pattern-polish',
    },
    cut: { name: '切断工具', emoji: '✂️', pattern: 'wb-tool-pattern-cut' },
  };

  const typeInfo = typeMap[type];

  return (
    <div
      className={`wb-tool-type-indicator ${
        showPattern ? typeInfo.pattern : ''
      }`}
      data-tool-type={type}
    >
      <ScreenReaderOnly>
        {typeInfo.name}（{typeInfo.emoji}）:
      </ScreenReaderOnly>
      {children}
    </div>
  );
}

// キーボードナビゲーション対応ボタン
interface AccessibleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tool';
  toolType?: 'inspect' | 'join' | 'measure' | 'polish' | 'cut';
  description?: string;
  children: React.ReactNode;
}

export function AccessibleButton({
  variant = 'primary',
  toolType,
  description,
  children,
  className = '',
  ...props
}: AccessibleButtonProps) {
  const baseClass = variant === 'tool' ? 'td-button-wb' : 'td-button';
  const toolClass = toolType ? `wb-tool-${toolType}` : '';

  return (
    <button
      className={`${baseClass} ${toolClass} wb-focus-visible ${className}`}
      aria-describedby={description ? `desc-${props.id}` : undefined}
      {...props}
    >
      {toolType && (
        <ScreenReaderOnly>
          {toolType === 'inspect' && '検査工具: '}
          {toolType === 'join' && '結合工具: '}
          {toolType === 'measure' && '測定工具: '}
          {toolType === 'polish' && '研磨工具: '}
          {toolType === 'cut' && '切断工具: '}
        </ScreenReaderOnly>
      )}
      {children}
      {description && (
        <div id={`desc-${props.id}`} className="wb-sr-description">
          {description}
        </div>
      )}
    </button>
  );
}

// アクセシブルなカードコンポーネント
interface AccessibleCardProps {
  title: string;
  description?: string;
  toolType?: 'inspect' | 'join' | 'measure' | 'polish' | 'cut';
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function AccessibleCard({
  title,
  description,
  toolType,
  onClick,
  children,
  className = '',
}: AccessibleCardProps) {
  const cardId = `card-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div
      className={`td-card-wb wb-focus-visible ${className}`}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={e => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-labelledby={`${cardId}-title`}
      aria-describedby={description ? `${cardId}-desc` : undefined}
    >
      {toolType && (
        <ToolTypeIndicator type={toolType}>
          <div id={`${cardId}-title`} className="wb-tool-title">
            {title}
          </div>
        </ToolTypeIndicator>
      )}
      {!toolType && (
        <div id={`${cardId}-title`} className="wb-card-title">
          {title}
        </div>
      )}

      {description && (
        <div id={`${cardId}-desc`} className="wb-sr-description">
          {description}
        </div>
      )}

      {children}
    </div>
  );
}

// ドロップダウンメニューコンポーネント（キーボードナビゲーション対応）
interface AccessibleDropdownProps {
  trigger: React.ReactNode;
  items: Array<{
    label: string;
    onClick: () => void;
    disabled?: boolean;
    toolType?: 'inspect' | 'join' | 'measure' | 'polish' | 'cut';
  }>;
  className?: string;
}

export function AccessibleDropdown({
  trigger,
  items,
  className = '',
}: AccessibleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev <= 0 ? items.length - 1 : prev - 1));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0) {
          items[focusedIndex].onClick();
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  return (
    <div className={`wb-dropdown-menu ${className}`}>
      <button
        className="wb-focus-visible"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {trigger}
        <ScreenReaderOnly>
          {isOpen ? 'メニューを閉じる' : 'メニューを開く'}
        </ScreenReaderOnly>
      </button>

      {isOpen && (
        <div
          className="wb-dropdown-content"
          role="menu"
          aria-label="工具メニュー"
        >
          {items.map((item, index) => (
            <button
              key={index}
              className={`wb-dropdown-item wb-focus-visible ${
                index === focusedIndex ? 'focused' : ''
              }`}
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              onMouseEnter={() => setFocusedIndex(index)}
            >
              {item.toolType && (
                <ScreenReaderOnly>
                  {item.toolType === 'inspect' && '検査工具: '}
                  {item.toolType === 'join' && '結合工具: '}
                  {item.toolType === 'measure' && '測定工具: '}
                  {item.toolType === 'polish' && '研磨工具: '}
                  {item.toolType === 'cut' && '切断工具: '}
                </ScreenReaderOnly>
              )}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// アクセシビリティ設定検出フック
export function useAccessibilityPreferences() {
  const [preferences, setPreferences] = useState({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersLargeText: false,
  });

  useEffect(() => {
    const checkPreferences = () => {
      setPreferences({
        prefersReducedMotion: window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches,
        prefersHighContrast: window.matchMedia('(prefers-contrast: high)')
          .matches,
        prefersLargeText: window.matchMedia('(min-resolution: 2dppx)').matches,
      });
    };

    checkPreferences();

    // メディアクエリの変更を監視
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    const textQuery = window.matchMedia('(min-resolution: 2dppx)');

    motionQuery.addEventListener('change', checkPreferences);
    contrastQuery.addEventListener('change', checkPreferences);
    textQuery.addEventListener('change', checkPreferences);

    return () => {
      motionQuery.removeEventListener('change', checkPreferences);
      contrastQuery.removeEventListener('change', checkPreferences);
      textQuery.removeEventListener('change', checkPreferences);
    };
  }, []);

  return preferences;
}

// アクセシビリティ情報表示コンポーネント
export function AccessibilityInfo() {
  const preferences = useAccessibilityPreferences();

  return (
    <div className="wb-accessibility-info" role="status" aria-live="polite">
      <ScreenReaderOnly>
        アクセシビリティ設定:
        {preferences.prefersReducedMotion && '動きを減らす設定が有効、'}
        {preferences.prefersHighContrast && '高コントラスト設定が有効、'}
        {preferences.prefersLargeText && '大きなテキスト設定が有効'}
      </ScreenReaderOnly>
    </div>
  );
}

// キーボードショートカット表示コンポーネント
export function KeyboardShortcuts() {
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setShowShortcuts(!showShortcuts);
      }
      if (e.key === 'Escape') {
        setShowShortcuts(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showShortcuts]);

  if (!showShortcuts) {
    return (
      <ScreenReaderOnly>
        キーボードショートカット: Ctrl+? または Cmd+? で表示
      </ScreenReaderOnly>
    );
  }

  return (
    <div
      className="wb-keyboard-shortcuts"
      role="dialog"
      aria-label="キーボードショートカット"
    >
      <div className="wb-shortcuts-content">
        <h3>🍺 Brewのワークベンチ - キーボードショートカット</h3>
        <ul>
          <li>
            <kbd>Tab</kbd> - 次の要素に移動
          </li>
          <li>
            <kbd>Shift + Tab</kbd> - 前の要素に移動
          </li>
          <li>
            <kbd>Enter</kbd> / <kbd>Space</kbd> - ボタンやリンクを実行
          </li>
          <li>
            <kbd>↑↓</kbd> - ドロップダウンメニュー内を移動
          </li>
          <li>
            <kbd>Escape</kbd> - メニューを閉じる
          </li>
          <li>
            <kbd>Ctrl + ?</kbd> - このヘルプを表示/非表示
          </li>
        </ul>
        <button
          onClick={() => setShowShortcuts(false)}
          className="wb-focus-visible"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
