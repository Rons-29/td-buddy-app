'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface MobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

interface ToolCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  tools: {
    href: string;
    icon: string;
    name: string;
    description: string;
  }[];
}

const toolCategories: ToolCategory[] = [
  {
    id: 'inspect',
    name: '検査工具',
    icon: '🔍',
    color: 'wb-tool-inspect',
    tools: [
      {
        href: '/password',
        icon: '🔐',
        name: 'パスワード生成',
        description: 'セキュアなパスワード生成',
      },
      {
        href: '/uuid',
        icon: '🆔',
        name: 'UUID生成',
        description: '一意識別子生成',
      },
    ],
  },
  {
    id: 'join',
    name: '結合工具',
    icon: '🔧',
    color: 'wb-tool-join',
    tools: [
      {
        href: '/personal',
        icon: '👤',
        name: '個人情報生成',
        description: 'テスト用個人データ',
      },
      {
        href: '/practical-data',
        icon: '📊',
        name: '実用データ生成',
        description: '業務用データセット',
      },
    ],
  },
  {
    id: 'measure',
    name: '測定工具',
    icon: '📏',
    color: 'wb-tool-measure',
    tools: [
      {
        href: '/number-boolean',
        icon: '🔢',
        name: '数値・真偽値',
        description: '数値データ生成',
      },
      {
        href: '/csv-detailed',
        icon: '📋',
        name: 'CSV生成',
        description: '構造化データ生成',
      },
      {
        href: '/datetime',
        icon: '📅',
        name: '日時生成',
        description: '日付・時刻データ',
      },
    ],
  },
  {
    id: 'polish',
    name: '研磨工具',
    icon: '✨',
    color: 'wb-tool-polish',
    tools: [
      {
        href: '/ai-chat',
        icon: '🤖',
        name: 'AI連携',
        description: 'AIデータ生成',
      },
      {
        href: '/text-tools',
        icon: '📝',
        name: 'テキスト工具',
        description: 'テキスト生成・加工',
      },
      {
        href: '/colors',
        icon: '🎨',
        name: 'カラー生成',
        description: 'カラーパレット生成',
      },
    ],
  },
  {
    id: 'cut',
    name: '切断工具',
    icon: '✂️',
    color: 'wb-tool-cut',
    tools: [
      {
        href: '/export',
        icon: '📤',
        name: 'データ出力',
        description: 'ファイル出力・変換',
      },
      {
        href: '/file-size-test',
        icon: '📏',
        name: 'ファイルサイズ',
        description: 'ファイルサイズテスト',
      },
    ],
  },
];

export function MobileNavigation({
  isOpen,
  onToggle,
  onClose,
}: MobileNavProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // モバイルメニューが開いている時はスクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCategoryToggle = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleToolClick = () => {
    onClose();
    setExpandedCategory(null);
  };

  return (
    <>
      {/* ハンバーガーメニューボタン */}
      <button
        onClick={onToggle}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-wb-wood-100 hover:bg-wb-wood-200 transition-colors"
        aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
        aria-expanded={isOpen}
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span
            className={`block w-5 h-0.5 bg-wb-wood-700 transition-all duration-300 ${
              isOpen ? 'rotate-45 translate-y-1' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-wb-wood-700 transition-all duration-300 mt-1 ${
              isOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-wb-wood-700 transition-all duration-300 mt-1 ${
              isOpen ? '-rotate-45 -translate-y-1' : ''
            }`}
          />
        </div>
      </button>

      {/* オーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* モバイルメニュー */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-wb-workshop-surface shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* メニューヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-wb-metal-200">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🍺</div>
            <div>
              <h2 className="font-bold text-wb-wood-800">Quality Workbench</h2>
              <p className="text-sm text-wb-wood-600">ブリューの工房</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-wb-wood-100 transition-colors"
            aria-label="メニューを閉じる"
          >
            <span className="text-wb-wood-600">✕</span>
          </button>
        </div>

        {/* メニューコンテンツ */}
        <div className="flex-1 overflow-y-auto">
          {/* ホームリンク */}
          <Link
            href="/"
            onClick={handleToolClick}
            className="flex items-center space-x-3 p-4 hover:bg-wb-wood-50 transition-colors border-b border-wb-metal-100"
          >
            <span className="text-xl">🏠</span>
            <span className="font-medium text-wb-wood-700">ホーム</span>
          </Link>

          {/* 工具カテゴリ */}
          {toolCategories.map(category => (
            <div key={category.id} className="border-b border-wb-metal-100">
              <button
                onClick={() => handleCategoryToggle(category.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-wb-wood-50 transition-colors"
                aria-expanded={expandedCategory === category.id}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{category.icon}</span>
                  <span className={`font-medium text-${category.color}-700`}>
                    {category.name}
                  </span>
                </div>
                <span
                  className={`text-wb-wood-500 transition-transform duration-200 ${
                    expandedCategory === category.id ? 'rotate-180' : ''
                  }`}
                >
                  ▼
                </span>
              </button>

              {/* 工具リスト */}
              {expandedCategory === category.id && (
                <div className="bg-wb-wood-25">
                  {category.tools.map(tool => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={handleToolClick}
                      className={`flex items-start space-x-3 p-4 pl-12 hover:bg-${category.color}-50 transition-colors`}
                    >
                      <span className="text-lg mt-0.5">{tool.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-medium text-${category.color}-700 mb-1`}
                        >
                          {tool.name}
                        </div>
                        <div
                          className={`text-sm text-${category.color}-600 leading-tight`}
                        >
                          {tool.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* メニューフッター */}
        <div className="p-4 border-t border-wb-metal-200 bg-wb-wood-25">
          <div className="text-center">
            <div className="text-sm text-wb-wood-600 mb-2">
              🍺 Brewと一緒に最高の品質を
            </div>
            <div className="text-xs text-wb-wood-500">
              Quality Workbench v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// モバイル専用工具カードコンポーネント
interface MobileToolCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
}

export function MobileToolCard({
  href,
  icon,
  title,
  description,
  category,
  categoryColor,
}: MobileToolCardProps) {
  return (
    <Link
      href={href}
      className={`block p-4 bg-wb-workshop-surface rounded-lg border-2 border-${categoryColor}-200 hover:border-${categoryColor}-300 transition-all duration-200 active:scale-95`}
      style={{ minHeight: '44px' }} // タッチターゲット最小サイズ
    >
      <div className="flex items-start space-x-3">
        <div className={`text-2xl text-${categoryColor}-600 flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-${categoryColor}-700 mb-1 text-base`}
          >
            {title}
          </h3>
          <p className={`text-sm text-${categoryColor}-600 leading-tight mb-2`}>
            {description}
          </p>
          <div className={`text-xs text-${categoryColor}-500`}>{category}</div>
        </div>
        <div className={`text-${categoryColor}-400 flex-shrink-0`}>→</div>
      </div>
    </Link>
  );
}

// モバイル専用クイックアクセスコンポーネント
export function MobileQuickAccess() {
  const quickTools = [
    {
      href: '/password',
      icon: '🔐',
      name: 'パスワード',
      color: 'wb-tool-inspect',
    },
    { href: '/personal', icon: '👤', name: '個人情報', color: 'wb-tool-join' },
    {
      href: '/csv-detailed',
      icon: '📋',
      name: 'CSV',
      color: 'wb-tool-measure',
    },
    { href: '/ai-chat', icon: '🤖', name: 'AI', color: 'wb-tool-polish' },
  ];

  return (
    <div className="md:hidden mb-6">
      <h3 className="font-semibold text-wb-wood-700 mb-3 text-center">
        ⚡ クイックアクセス
      </h3>
      <div className="flex justify-center space-x-2">
        {quickTools.map(tool => (
          <Link
            key={tool.href}
            href={tool.href}
            className={`flex flex-col items-center p-3 bg-${tool.color}-50 rounded-lg border border-${tool.color}-200 hover:bg-${tool.color}-100 transition-colors active:scale-95`}
            style={{ minWidth: '60px', minHeight: '60px' }}
          >
            <span className="text-xl mb-1">{tool.icon}</span>
            <span
              className={`text-xs text-${tool.color}-700 font-medium text-center`}
            >
              {tool.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// タッチ操作最適化フック
export function useTouchOptimization() {
  useEffect(() => {
    // iOS Safariでのタッチ遅延を無効化
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
      }
      
      button, a, [role="button"] {
        touch-action: manipulation;
      }
      
      .wb-touch-target {
        min-height: 44px;
        min-width: 44px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
}
