import React, { useRef, useState } from 'react';
import { useAccessibility } from '../../hooks/useAccessibility';
import { useTabNavigation } from '../../hooks/useKeyboardNavigation';

interface Tab {
  id: string;
  label: string;
  icon?: string;
  description?: string;
  content: React.ReactNode;
}

interface AccessibleTabNavigationProps {
  tabs: Tab[];
  defaultActiveTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
}

/**
 * WCAG 2.1 AA準拠のアクセシブルなタブナビゲーション
 * WAI-ARIA Tabsパターンに従って実装
 */
export const AccessibleTabNavigation: React.FC<
  AccessibleTabNavigationProps
> = ({
  tabs,
  defaultActiveTab,
  onTabChange,
  className = '',
  variant = 'default',
}) => {
  const [activeTabId, setActiveTabId] = useState(
    defaultActiveTab || tabs[0]?.id
  );
  const tabListRef = useRef<HTMLDivElement>(null);
  const { announceToScreenReader, announceBrewMessage } = useAccessibility();

  const activeTabIndex = tabs.findIndex(tab => tab.id === activeTabId);
  const tabIds = tabs.map(tab => tab.id);

  const { focusedTabIndex, setFocusedTabIndex, handleTabKeyDown, setTabRef } =
    useTabNavigation(tabIds);

  // アクティブタブが変更されたときの処理
  const handleTabActivation = (tabId: string, index: number) => {
    setActiveTabId(tabId);
    setFocusedTabIndex(index);
    onTabChange?.(tabId);

    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      announceToScreenReader(`${tab.label}タブが選択されました`);
      announceBrewMessage(`${tab.label}の画面に切り替わりました！`);
    }
  };

  // バリアント別のスタイル
  const getTabListStyles = () => {
    const baseStyles = 'flex border-b border-gray-200';

    switch (variant) {
      case 'pills':
        return 'flex space-x-1 bg-gray-100 p-1 rounded-lg';
      case 'underline':
        return `${baseStyles} space-x-8`;
      default:
        return baseStyles;
    }
  };

  const getTabStyles = (isActive: boolean, isFocused: boolean) => {
    const baseStyles = `
      px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    let variantStyles = '';

    switch (variant) {
      case 'pills':
        variantStyles = isActive
          ? 'bg-white text-blue-700 shadow-sm'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50';
        break;
      case 'underline':
        variantStyles = isActive
          ? 'border-b-2 border-blue-500 text-blue-600'
          : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
        break;
      default:
        variantStyles = isActive
          ? 'border-b-2 border-blue-500 text-blue-600'
          : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
    }

    const focusStyles = isFocused ? 'ring-2 ring-blue-500 ring-offset-2' : '';

    return `${baseStyles} ${variantStyles} ${focusStyles}`.trim();
  };

  // タブパネルのスタイル
  const getTabPanelStyles = () => {
    return 'mt-6 focus:outline-none';
  };

  return (
    <div className={`w-full ${className}`}>
      {/* タブリスト */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-label="データ生成機能"
        className={getTabListStyles()}
        onKeyDown={handleTabKeyDown}
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTabId;
          const isFocused = index === focusedTabIndex;

          return (
            <button
              key={tab.id}
              ref={el => setTabRef(index, el)}
              role="tab"
              id={`tab-${tab.id}`}
              aria-controls={`tabpanel-${tab.id}`}
              aria-selected={isActive}
              aria-describedby={
                tab.description ? `tab-desc-${tab.id}` : undefined
              }
              tabIndex={isFocused ? 0 : -1}
              className={getTabStyles(isActive, isFocused)}
              onClick={() => handleTabActivation(tab.id, index)}
              onFocus={() => setFocusedTabIndex(index)}
            >
              {/* タブの内容 */}
              <div className="flex items-center space-x-2">
                {tab.icon && (
                  <span aria-hidden="true" className="text-lg">
                    {tab.icon}
                  </span>
                )}
                <span>{tab.label}</span>
              </div>

              {/* スクリーンリーダー用の説明テキスト */}
              {tab.description && (
                <span id={`tab-desc-${tab.id}`} className="sr-only">
                  {tab.description}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* アクティブなタブパネル */}
      {tabs.map(tab => {
        const isActive = tab.id === activeTabId;

        return (
          <div
            key={tab.id}
            id={`tabpanel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            className={getTabPanelStyles()}
            hidden={!isActive}
            tabIndex={0}
          >
            {isActive && tab.content}
          </div>
        );
      })}

      {/* ライブリージョン：タブ変更の通知用 */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id={`tab-announcements`}
      />

      {/* 使用方法のヘルプテキスト（最初のタブでのみ表示） */}
      {activeTabIndex === 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-blue-500 mt-0.5" aria-hidden="true">
              ℹ️
            </span>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">キーボード操作</p>
              <ul className="text-xs space-y-1">
                <li>• 矢印キー（←→）でタブ切り替え</li>
                <li>• Home/End キーで最初/最後のタブに移動</li>
                <li>• Enter/Space キーでタブを選択</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibleTabNavigation;
