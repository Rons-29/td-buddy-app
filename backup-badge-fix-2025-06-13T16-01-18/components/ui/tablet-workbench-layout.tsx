'use client';

import React, { useState } from 'react';
import { Badge } from './Badge';
import { Button } from './Button';

interface Tool {
  id: string;
  name: string;
  icon: string;
  type: 'measure' | 'cut' | 'join' | 'inspect' | 'polish';
  description: string;
  href: string;
  isNew?: boolean;
  isPopular?: boolean;
}

interface TabletWorkbenchLayoutProps {
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
    description: '安全なパスワードを生成',
    href: '/password',
    isPopular: true,
  },
  {
    id: 'personal',
    name: '個人情報生成',
    icon: '👤',
    type: 'join',
    description: 'テスト用個人データ',
    href: '/personal',
    isPopular: true,
  },
  {
    id: 'csv',
    name: 'CSV生成',
    icon: '📊',
    type: 'measure',
    description: 'CSVデータ作成',
    href: '/csv-detailed',
    isPopular: true,
  },
  {
    id: 'ai-chat',
    name: 'AI連携',
    icon: '🤖',
    type: 'polish',
    description: 'AI対話でデータ生成',
    href: '/ai-chat',
    isNew: true,
  },
  {
    id: 'uuid',
    name: 'UUID生成',
    icon: '🆔',
    type: 'inspect',
    description: 'ユニークID生成',
    href: '/uuid',
  },
  {
    id: 'datetime',
    name: '日時生成',
    icon: '📅',
    type: 'measure',
    description: '日時データ生成',
    href: '/datetime',
  },
  {
    id: 'color',
    name: 'カラー生成',
    icon: '🎨',
    type: 'polish',
    description: 'カラーコード生成',
    href: '/color',
  },
  {
    id: 'number-boolean',
    name: '数値・真偽値',
    icon: '🔢',
    type: 'measure',
    description: '数値データ生成',
    href: '/number-boolean',
  },
  {
    id: 'text-tools',
    name: 'テキストツール',
    icon: '📝',
    type: 'polish',
    description: 'テキスト加工',
    href: '/text-tools',
  },
  {
    id: 'practical-data',
    name: '実用データ',
    icon: '🏢',
    type: 'join',
    description: '実用的なデータ生成',
    href: '/practical-data',
  },
];

const toolTypeConfig = {
  measure: {
    color: 'orange',
    label: '測定',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
  },
  cut: {
    color: 'red',
    label: '切断',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
  },
  join: {
    color: 'green',
    label: '接合',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
  },
  inspect: {
    color: 'blue',
    label: '検査',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
  },
  polish: {
    color: 'purple',
    label: '仕上げ',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
  },
};

export const TabletWorkbenchLayout: React.FC<TabletWorkbenchLayoutProps> = ({
  children,
  currentTool,
  tools = defaultTools,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categorizedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.type]) {
      acc[tool.type] = [];
    }
    acc[tool.type].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  const popularTools = tools.filter(tool => tool.isPopular);
  const newTools = tools.filter(tool => tool.isNew);

  return (
    <div className="min-h-screen wb-workbench-bg flex">
      {/* Tablet Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-80' : 'w-16'
        } transition-all duration-300 bg-white border-r border-gray-200 shadow-lg flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  🍺 Quality Workbench
                </h1>
                <p className="text-sm text-gray-600">職人の工房</p>
              </div>
            )}
            <Button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 p-2"
            >
              {isSidebarOpen ? '◀' : '▶'}
            </Button>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isSidebarOpen ? (
            <div className="space-y-6">
              {/* Current Tool */}
              {currentTool && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    🔧 現在の工具
                  </h3>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="font-medium text-blue-700">
                      {currentTool}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Access */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  ⚡ クイックアクセス
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {popularTools.map(tool => {
                    const config = toolTypeConfig[tool.type];
                    return (
                      <a
                        key={tool.id}
                        href={tool.href}
                        className={`p-3 rounded-lg border-2 ${config.bgColor} ${config.borderColor} hover:shadow-md transition-all`}
                      >
                        <div className="text-center">
                          <div className="text-xl mb-1">{tool.icon}</div>
                          <div className="text-xs font-medium text-gray-700">
                            {tool.name}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
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
                          className={`flex items-center p-3 rounded-lg border ${config.bgColor} ${config.borderColor} hover:shadow-md transition-all`}
                        >
                          <div className="text-lg mr-3">{tool.icon}</div>
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
                            className="bg-green-100 text-green-700 border-green-300 text-xs"
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
                <div className="space-y-2">
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
                            className={`w-full flex items-center justify-between p-3 rounded-lg border-2 ${config.bgColor} ${config.borderColor} hover:shadow-md transition-all`}
                          >
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="outline"
                                className={`bg-${config.color}-100 text-${config.color}-700 border-${config.color}-300`}
                              >
                                {config.label}
                              </Badge>
                              <span className="font-medium text-gray-700">
                                {categoryTools.length}個
                              </span>
                            </div>
                            <span className="text-gray-500">
                              {isExpanded ? '▼' : '▶'}
                            </span>
                          </Button>

                          {isExpanded && (
                            <div className="mt-2 space-y-1 pl-4">
                              {categoryTools.map(tool => (
                                <a
                                  key={tool.id}
                                  href={tool.href}
                                  className="flex items-center p-2 rounded hover:bg-gray-50 transition-colors"
                                >
                                  <span className="text-lg mr-2">
                                    {tool.icon}
                                  </span>
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-800">
                                      {tool.name}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {tool.description}
                                    </div>
                                  </div>
                                  {tool.isPopular && (
                                    <Badge
                                      variant="outline"
                                      className="bg-yellow-100 text-yellow-700 border-yellow-300 text-xs"
                                    >
                                      人気
                                    </Badge>
                                  )}
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
            </div>
          ) : (
            /* Collapsed Sidebar */
            <div className="space-y-4">
              {/* Collapsed Quick Access */}
              <div className="space-y-2">
                {popularTools.slice(0, 4).map(tool => {
                  const config = toolTypeConfig[tool.type];
                  return (
                    <a
                      key={tool.id}
                      href={tool.href}
                      className={`flex items-center justify-center p-3 rounded-lg border-2 ${config.bgColor} ${config.borderColor} hover:shadow-md transition-all`}
                      title={tool.name}
                    >
                      <div className="text-xl">{tool.icon}</div>
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
                        className={`w-full p-3 rounded-lg border-2 ${config.bgColor} ${config.borderColor} hover:shadow-md transition-all`}
                        title={`${config.label}工具 (${categoryTools.length}個)`}
                      >
                        <Badge
                          variant="outline"
                          className={`bg-${config.color}-100 text-${config.color}-700 border-${config.color}-300 text-xs`}
                        >
                          {config.label}
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
        <div className="p-4 border-t border-gray-200">
          {isSidebarOpen ? (
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">
                🍺 Brew からのメッセージ
              </p>
              <p className="text-xs text-gray-500 italic">
                「タブレットでも快適に工具を使えるぞ！」
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-lg">🍺</div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentTool && (
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-sm">
                    現在の工具
                  </Badge>
                  <span className="font-medium text-gray-800">
                    {currentTool}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-700 border-blue-300"
              >
                タブレット表示
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
