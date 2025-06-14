'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from './Badge';
import { Button } from './Button';
import { Card } from './Card';

interface Tool {
  id: string;
  name: string;
  icon: string;
  type: 'measure' | 'cut' | 'join' | 'inspect' | 'polish';
  description: string;
  href: string;
  isNew?: boolean;
  isPopular?: boolean;
  category?: string;
}

interface DesktopWorkbenchLayoutProps {
  children: React.ReactNode;
  currentTool?: string;
  tools?: Tool[];
}

const defaultTools: Tool[] = [
  {
    id: 'password',
    name: 'パスワード生成',
    icon: '🔐',
    type: 'inspect',
    description: '安全で強力なパスワードを生成',
    href: '/password',
    isPopular: true,
    category: 'セキュリティ',
  },
  {
    id: 'personal',
    name: '個人情報生成',
    icon: '👤',
    type: 'join',
    description: 'テスト用の個人データを生成',
    href: '/personal',
    isPopular: true,
    category: 'テストデータ',
  },
  {
    id: 'csv',
    name: 'CSV生成',
    icon: '📊',
    type: 'measure',
    description: 'カスタムCSVデータを作成',
    href: '/csv-detailed',
    isPopular: true,
    category: 'データ生成',
  },
  {
    id: 'ai-chat',
    name: 'AI連携',
    icon: '🤖',
    type: 'polish',
    description: 'AI対話でデータ生成を支援',
    href: '/ai-chat',
    isNew: true,
    category: 'AI支援',
  },
  {
    id: 'ai-settings',
    name: 'AI設定',
    icon: '⚙️',
    type: 'polish',
    description: 'OpenAI APIキーの設定',
    href: '/ai-settings',
    category: 'AI支援',
  },
  {
    id: 'uuid',
    name: 'UUID生成',
    icon: '🆔',
    type: 'inspect',
    description: 'ユニークIDを生成',
    href: '/uuid',
    category: 'ID生成',
  },
  {
    id: 'datetime',
    name: '日時生成',
    icon: '📅',
    type: 'measure',
    description: '日時データを生成',
    href: '/datetime',
    category: 'データ生成',
  },
  {
    id: 'color',
    name: 'カラー生成',
    icon: '🎨',
    type: 'polish',
    description: 'カラーコードを生成',
    href: '/color',
    category: 'デザイン',
  },
  {
    id: 'number-boolean',
    name: '数値・真偽値',
    icon: '🔢',
    type: 'measure',
    description: '数値データを生成',
    href: '/number-boolean',
    category: 'データ生成',
  },
  {
    id: 'text-tools',
    name: 'テキストツール',
    icon: '📝',
    type: 'polish',
    description: 'テキスト加工・変換',
    href: '/text-tools',
    category: 'テキスト処理',
  },
  {
    id: 'practical-data',
    name: '実用データ',
    icon: '🏢',
    type: 'join',
    description: '実用的なデータを生成',
    href: '/practical-data',
    category: 'テストデータ',
  },
];

const toolTypeConfig = {
  measure: {
    color: 'orange',
    label: '測定工具',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    hoverColor: 'hover:bg-orange-100',
  },
  cut: {
    color: 'red',
    label: '切断工具',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    hoverColor: 'hover:bg-red-100',
  },
  join: {
    color: 'green',
    label: '接合工具',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    hoverColor: 'hover:bg-green-100',
  },
  inspect: {
    color: 'blue',
    label: '検査工具',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    hoverColor: 'hover:bg-blue-100',
  },
  polish: {
    color: 'purple',
    label: '仕上げ工具',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    hoverColor: 'hover:bg-purple-100',
  },
};

export const DesktopWorkbenchLayout: React.FC<DesktopWorkbenchLayoutProps> = ({
  children,
  currentTool,
  tools = defaultTools,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categorizedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.type]) {
      acc[tool.type] = [];
    }
    acc[tool.type].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  const popularTools = tools.filter(tool => tool.isPopular);
  const newTools = tools.filter(tool => tool.isNew);

  const filteredTools = tools.filter(
    tool =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            setIsSidebarOpen(!isSidebarOpen);
            break;
          case 'k':
            e.preventDefault();
            document.getElementById('search-input')?.focus();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen wb-workbench-bg flex">
      {/* Desktop Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-96' : 'w-16'
        } transition-all duration-300 bg-white border-r border-gray-200 shadow-lg flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  🍺 Quality Workbench
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  職人の工房 - デスクトップ版
                </p>
              </div>
            )}
            <Button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 p-2"
              title={`サイドバーを${
                isSidebarOpen ? '閉じる' : '開く'
              } (Ctrl+B)`}
            >
              {isSidebarOpen ? '◀' : '▶'}
            </Button>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto">
          {isSidebarOpen ? (
            <div className="p-6 space-y-6">
              {/* Search */}
              <div>
                <div className="relative">
                  <input
                    id="search-input"
                    type="text"
                    placeholder="工具を検索... (Ctrl+K)"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    🔍
                  </div>
                </div>
              </div>

              {/* Current Tool */}
              {currentTool && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    🔧 現在の工具
                  </h3>
                  <Card workbench className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <div className="font-medium text-blue-700">
                        {currentTool}
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* View Mode Toggle */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">
                  ⚡ クイックアクセス
                </h3>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <Button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 text-xs rounded ${
                      viewMode === 'grid'
                        ? 'bg-white shadow-sm'
                        : 'bg-transparent'
                    }`}
                  >
                    グリッド
                  </Button>
                  <Button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 text-xs rounded ${
                      viewMode === 'list'
                        ? 'bg-white shadow-sm'
                        : 'bg-transparent'
                    }`}
                  >
                    リスト
                  </Button>
                </div>
              </div>

              {/* Quick Access */}
              <div>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-3 gap-3">
                    {popularTools.map(tool => {
                      const config = toolTypeConfig[tool.type];
                      return (
                        <a
                          key={tool.id}
                          href={tool.href}
                          className={`p-4 rounded-lg border-2 ${config.bgColor} ${config.borderColor} ${config.hoverColor} hover:shadow-md transition-all group`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                              {tool.icon}
                            </div>
                            <div className="text-xs font-medium text-gray-700">
                              {tool.name}
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {popularTools.map(tool => {
                      const config = toolTypeConfig[tool.type];
                      return (
                        <a
                          key={tool.id}
                          href={tool.href}
                          className={`flex items-center p-3 rounded-lg border ${config.bgColor} ${config.borderColor} ${config.hoverColor} hover:shadow-md transition-all`}
                        >
                          <div className="text-xl mr-3">{tool.icon}</div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">
                              {tool.name}
                            </div>
                            <div className="text-xs text-gray-600">
                              {tool.description}
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-yellow-100 text-yellow-700 border-yellow-300 text-xs"
                          >
                            人気
                          </Badge>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* New Tools */}
              {newTools.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    ✨ 新しい工具
                  </h3>
                  <div className="space-y-2">
                    {newTools.map(tool => {
                      const config = toolTypeConfig[tool.type];
                      return (
                        <a
                          key={tool.id}
                          href={tool.href}
                          className={`flex items-center p-4 rounded-lg border ${config.bgColor} ${config.borderColor} ${config.hoverColor} hover:shadow-md transition-all group`}
                        >
                          <div className="text-xl mr-3 group-hover:scale-110 transition-transform">
                            {tool.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">
                              {tool.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {tool.description}
                            </div>
                            {tool.category && (
                              <div className="text-xs text-gray-500 mt-1">
                                {tool.category}
                              </div>
                            )}
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-700 border-green-300"
                          >
                            NEW
                          </Badge>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tool Categories */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  🔧 工具カテゴリ
                </h3>
                <div className="space-y-3">
                  {Object.entries(categorizedTools).map(
                    ([type, categoryTools]) => {
                      const config =
                        toolTypeConfig[type as keyof typeof toolTypeConfig];
                      const isExpanded = selectedCategory === type;

                      return (
                        <div key={type}>
                          <Button
                            onClick={() =>
                              setSelectedCategory(isExpanded ? null : type)
                            }
                            className={`w-full flex items-center justify-between p-4 rounded-lg border-2 ${config.bgColor} ${config.borderColor} ${config.hoverColor} hover:shadow-md transition-all`}
                          >
                            <div className="flex items-center space-x-3">
                              <Badge
                                variant="outline"
                                className={`bg-${config.color}-100 text-${config.color}-700 border-${config.color}-300`}
                              >
                                {config.label}
                              </Badge>
                              <span className="font-medium text-gray-700">
                                {categoryTools.length}個の工具
                              </span>
                            </div>
                            <span className="text-gray-500">
                              {isExpanded ? '▼' : '▶'}
                            </span>
                          </Button>

                          {isExpanded && (
                            <div className="mt-3 space-y-2 pl-6">
                              {categoryTools.map(tool => (
                                <a
                                  key={tool.id}
                                  href={tool.href}
                                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                >
                                  <span className="text-lg mr-3 group-hover:scale-110 transition-transform">
                                    {tool.icon}
                                  </span>
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-800">
                                      {tool.name}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {tool.description}
                                    </div>
                                    {tool.category && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        {tool.category}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex space-x-1">
                                    {tool.isPopular && (
                                      <Badge
                                        variant="outline"
                                        className="bg-yellow-100 text-yellow-700 border-yellow-300 text-xs"
                                      >
                                        人気
                                      </Badge>
                                    )}
                                    {tool.isNew && (
                                      <Badge
                                        variant="outline"
                                        className="bg-green-100 text-green-700 border-green-300 text-xs"
                                      >
                                        NEW
                                      </Badge>
                                    )}
                                  </div>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Search Results */}
              {searchQuery && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    🔍 検索結果 ({filteredTools.length}件)
                  </h3>
                  <div className="space-y-2">
                    {filteredTools.map(tool => {
                      const config = toolTypeConfig[tool.type];
                      return (
                        <a
                          key={tool.id}
                          href={tool.href}
                          className={`flex items-center p-3 rounded-lg border ${config.bgColor} ${config.borderColor} ${config.hoverColor} hover:shadow-md transition-all`}
                        >
                          <span className="text-lg mr-3">{tool.icon}</span>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-800">
                              {tool.name}
                            </div>
                            <div className="text-xs text-gray-600">
                              {tool.description}
                            </div>
                            {tool.category && (
                              <div className="text-xs text-gray-500 mt-1">
                                {tool.category}
                              </div>
                            )}
                          </div>
                          <Badge
                            variant="outline"
                            className={`bg-${config.color}-100 text-${config.color}-700 border-${config.color}-300 text-xs`}
                          >
                            {config.label}
                          </Badge>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Collapsed Sidebar */
            <div className="p-4 space-y-4">
              {/* Collapsed Quick Access */}
              <div className="space-y-2">
                {popularTools.slice(0, 6).map(tool => {
                  const config = toolTypeConfig[tool.type];
                  return (
                    <a
                      key={tool.id}
                      href={tool.href}
                      className={`flex items-center justify-center p-3 rounded-lg border-2 ${config.bgColor} ${config.borderColor} ${config.hoverColor} hover:shadow-md transition-all group`}
                      title={`${tool.name} - ${tool.description}`}
                    >
                      <div className="text-xl group-hover:scale-110 transition-transform">
                        {tool.icon}
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Collapsed Categories */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                {Object.entries(categorizedTools).map(
                  ([type, categoryTools]) => {
                    const config =
                      toolTypeConfig[type as keyof typeof toolTypeConfig];

                    return (
                      <Button
                        key={type}
                        onClick={() => {
                          setSelectedCategory(type);
                          setIsSidebarOpen(true);
                        }}
                        className={`w-full p-3 rounded-lg border-2 ${config.bgColor} ${config.borderColor} ${config.hoverColor} hover:shadow-md transition-all`}
                        title={`${config.label} (${categoryTools.length}個の工具)`}
                      >
                        <Badge
                          variant="outline"
                          className={`bg-${config.color}-100 text-${config.color}-700 border-${config.color}-300 text-xs`}
                        >
                          {config.label.charAt(0)}
                        </Badge>
                      </Button>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-gray-200">
          {isSidebarOpen ? (
            <div>
              <div className="text-center mb-3">
                <p className="text-sm text-gray-600 mb-1">
                  🍺 Brew からのメッセージ
                </p>
                <p className="text-sm text-gray-500 italic">
                  「デスクトップでは全ての工具が手の届く場所にあるぞ！」
                </p>
              </div>
              <div className="text-xs text-gray-400 text-center space-y-1">
                <div>ショートカット: Ctrl+B (サイドバー), Ctrl+K (検索)</div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-2xl mb-2">🍺</div>
              <div className="text-xs text-gray-500">Brew</div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentTool && (
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="text-sm">
                    現在の工具
                  </Badge>
                  <span className="text-lg font-medium text-gray-800">
                    {currentTool}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Badge
                variant="outline"
                className="bg-green-100 text-green-700 border-green-300"
              >
                デスクトップ最適化
              </Badge>
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
