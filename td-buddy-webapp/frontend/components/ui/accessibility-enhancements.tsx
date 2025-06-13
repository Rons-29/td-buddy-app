'use client';

import { Contrast, Eye, EyeOff, Type } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface AccessibilityEnhancementsProps {
  children: React.ReactNode;
}

export const AccessibilityEnhancements: React.FC<
  AccessibilityEnhancementsProps
> = ({ children }) => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isScreenReaderMode, setIsScreenReaderMode] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const announcementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // システム設定の検出
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    setIsReducedMotion(prefersReducedMotion);

    // 保存された設定の復元
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setIsHighContrast(settings.highContrast || false);
      setFontSize(settings.fontSize || 16);
      setIsScreenReaderMode(settings.screenReader || false);
    }
  }, []);

  useEffect(() => {
    // 設定の保存
    const settings = {
      highContrast: isHighContrast,
      fontSize,
      screenReader: isScreenReaderMode,
    };
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));

    // CSS変数の更新
    document.documentElement.style.setProperty(
      '--base-font-size',
      `${fontSize}px`
    );

    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (isReducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    }
  }, [isHighContrast, fontSize, isScreenReaderMode, isReducedMotion]);

  const announce = (message: string) => {
    setAnnouncements(prev => [...prev, message]);
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1));
    }, 3000);
  };

  const increaseFontSize = () => {
    if (fontSize < 24) {
      setFontSize(prev => prev + 2);
      announce('文字サイズを大きくしました');
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) {
      setFontSize(prev => prev - 2);
      announce('文字サイズを小さくしました');
    }
  };

  const toggleHighContrast = () => {
    setIsHighContrast(prev => !prev);
    announce(
      isHighContrast
        ? 'ハイコントラストを無効にしました'
        : 'ハイコントラストを有効にしました'
    );
  };

  const toggleScreenReaderMode = () => {
    setIsScreenReaderMode(prev => !prev);
    announce(
      isScreenReaderMode
        ? 'スクリーンリーダーモードを無効にしました'
        : 'スクリーンリーダーモードを有効にしました'
    );
  };

  return (
    <div className="accessibility-wrapper">
      {/* アクセシビリティツールバー */}
      <div
        className="fixed top-0 right-0 z-50 bg-white border-l border-b border-gray-200 p-2 shadow-lg"
        role="toolbar"
        aria-label="アクセシビリティ設定"
      >
        <div className="flex flex-col space-y-2">
          <button
            onClick={toggleHighContrast}
            className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={
              isHighContrast
                ? 'ハイコントラストを無効にする'
                : 'ハイコントラストを有効にする'
            }
            title="ハイコントラスト切り替え"
          >
            <Contrast className="w-5 h-5" />
          </button>

          <div className="flex flex-col space-y-1">
            <button
              onClick={increaseFontSize}
              className="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="文字サイズを大きくする"
              title="文字サイズ拡大"
            >
              <Type className="w-4 h-4" />
              <span className="text-xs">+</span>
            </button>
            <span className="text-xs text-center">{fontSize}px</span>
            <button
              onClick={decreaseFontSize}
              className="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="文字サイズを小さくする"
              title="文字サイズ縮小"
            >
              <Type className="w-4 h-4" />
              <span className="text-xs">-</span>
            </button>
          </div>

          <button
            onClick={toggleScreenReaderMode}
            className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={
              isScreenReaderMode
                ? 'スクリーンリーダーモードを無効にする'
                : 'スクリーンリーダーモードを有効にする'
            }
            title="スクリーンリーダーモード切り替え"
          >
            {isScreenReaderMode ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* ライブリージョン（スクリーンリーダー用アナウンス） */}
      <div
        ref={announcementRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcements.map((announcement, index) => (
          <div key={index}>{announcement}</div>
        ))}
      </div>

      {/* メインコンテンツ */}
      <div
        className={`
          accessibility-content
          ${isScreenReaderMode ? 'screen-reader-optimized' : ''}
          ${isHighContrast ? 'high-contrast-mode' : ''}
        `}
        style={{ fontSize: `${fontSize}px` }}
      >
        {children}
      </div>

      {/* アクセシビリティ用CSS */}
      <style jsx global>{`
        /* ハイコントラストモード */
        .high-contrast-mode {
          --conversion-primary: #000000;
          --conversion-secondary: #ffffff;
          --conversion-accent: #ffff00;
          --conversion-neutral: #000000;
        }

        .high-contrast-mode * {
          border-color: #000000 !important;
        }

        .high-contrast-mode .conv-cta-primary {
          background: #000000 !important;
          color: #ffffff !important;
          border: 2px solid #ffffff !important;
        }

        .high-contrast-mode .conv-cta-secondary {
          background: #ffffff !important;
          color: #000000 !important;
          border: 2px solid #000000 !important;
        }

        /* スクリーンリーダー最適化 */
        .screen-reader-optimized {
          line-height: 1.8;
          word-spacing: 0.1em;
          letter-spacing: 0.05em;
        }

        .screen-reader-optimized h1,
        .screen-reader-optimized h2,
        .screen-reader-optimized h3 {
          margin-bottom: 1em;
          margin-top: 1.5em;
        }

        .screen-reader-optimized p {
          margin-bottom: 1em;
        }

        /* 動きの軽減 */
        .reduced-motion *,
        .reduced-motion *::before,
        .reduced-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }

        /* フォーカス強化 */
        .accessibility-wrapper *:focus-visible {
          outline: 3px solid #0066cc;
          outline-offset: 2px;
          border-radius: 4px;
        }

        /* スキップリンク強化 */
        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          background: #000000;
          color: #ffffff;
          padding: 8px;
          text-decoration: none;
          border-radius: 4px;
          z-index: 1000;
          font-weight: bold;
        }

        .skip-link:focus {
          top: 6px;
        }

        /* タッチターゲット最適化 */
        .accessibility-wrapper button,
        .accessibility-wrapper a,
        .accessibility-wrapper input,
        .accessibility-wrapper select {
          min-height: 44px;
          min-width: 44px;
        }

        /* エラー状態の強化 */
        .accessibility-wrapper [aria-invalid='true'] {
          border: 2px solid #d32f2f;
          background-color: #ffebee;
        }

        .accessibility-wrapper [aria-invalid='true']:focus {
          outline-color: #d32f2f;
        }

        /* 必須フィールドの明示 */
        .accessibility-wrapper [aria-required='true']::after {
          content: ' *';
          color: #d32f2f;
          font-weight: bold;
        }

        /* 読み上げ専用テキスト */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* 読み上げ専用テキスト（フォーカス時表示） */
        .sr-only-focusable:focus {
          position: static;
          width: auto;
          height: auto;
          padding: inherit;
          margin: inherit;
          overflow: visible;
          clip: auto;
          white-space: normal;
        }
      `}</style>
    </div>
  );
};

// アクセシブルなフォームコンポーネント
interface AccessibleFormFieldProps {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
  description?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const AccessibleFormField: React.FC<AccessibleFormFieldProps> = ({
  id,
  label,
  type = 'text',
  required = false,
  error,
  description,
  value,
  onChange,
}) => {
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;

  return (
    <div className="form-field">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="必須">
            *
          </span>
        )}
      </label>

      {description && (
        <div id={descriptionId} className="text-sm text-gray-600 mb-2">
          {description}
        </div>
      )}

      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={`${description ? descriptionId : ''} ${
          error ? errorId : ''
        }`.trim()}
        className={`
          block w-full px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}
        `}
      />

      {error && (
        <div id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

// アクセシブルなモーダルコンポーネント
interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // フォーカストラップ
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0] as HTMLElement;
      const lastElement = focusableElements?.[
        focusableElements.length - 1
      ] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement?.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement?.focus();
              e.preventDefault();
            }
          }
        }
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => {
        document.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        />

        <div
          ref={modalRef}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3
              id="modal-title"
              className="text-lg leading-6 font-medium text-gray-900 mb-4"
            >
              {title}
            </h3>
            {children}
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
