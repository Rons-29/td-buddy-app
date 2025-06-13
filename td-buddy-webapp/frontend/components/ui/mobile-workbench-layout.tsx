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

interface MobileWorkbenchLayoutProps {
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
];

const toolTypeConfig = {
  measure: {
    color: 'orange',
    label: '測定',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  cut: {
    color: 'red',
    label: '切断',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  join: {
    color: 'green',
    label: '接合',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  inspect: {
    color: 'blue',
    label: '検査',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  polish: {
    color: 'purple',
    label: '仕上げ',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
};

export const MobileWorkbenchLayout: React.FC<MobileWorkbenchLayoutProps> = ({
  children,
  currentTool,
  tools = defaultTools,
}) => {
  const [isToolboxOpen, setIsToolboxOpen] = useState(false);
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
    <div className="min-h-screen wb-workbench-bg">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-gray-800">
              🍺 Quality Workbench
            </h1>
          </div>
          <Button
            onClick={() => setIsToolboxOpen(!isToolboxOpen)}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 p-2"
          >
            {isToolboxOpen ? '✕' : '🧰'}
          </Button>
        </div>

        {/* Current Tool Indicator */}
        {currentTool && (
          <div className="px-4 pb-3">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                現在の工具
              </Badge>
              <span className="text-sm font-medium text-gray-700">
                {currentTool}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Toolbox Overlay */}
      {isToolboxOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsToolboxOpen(false)}
        >
          <div
            className="absolute top-0 right-0 w-80 h-full bg-white shadow-xl overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">🧰 工具箱</h2>
                <Button
                  onClick={() => setIsToolboxOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  ✕
                </Button>
              </div>

              {/* Quick Access */}
              <div className="mb-6">
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
                        onClick={() => setIsToolboxOpen(false)}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">{tool.icon}</div>
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
                <div className="mb-6">
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
                          onClick={() => setIsToolboxOpen(false)}
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
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  🔧 工具カテゴリ
                </h3>
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
                              {categoryTools.length}個の工具
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
                                onClick={() => setIsToolboxOpen(false)}
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
        </div>
      )}

      {/* Main Content */}
      <div className="pb-20">{children}</div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
        <div className="grid grid-cols-4 gap-1 p-2">
          {popularTools.slice(0, 4).map(tool => {
            const config = toolTypeConfig[tool.type];
            const isActive = currentTool === tool.name;

            return (
              <a
                key={tool.id}
                href={tool.href}
                className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                  isActive
                    ? `${config.bgColor} ${config.borderColor} border-2`
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="text-lg mb-1">{tool.icon}</div>
                <div className="text-xs font-medium text-gray-700 text-center leading-tight">
                  {tool.name}
                </div>
                {isActive && (
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-1"></div>
                )}
              </a>
            );
          })}
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-30">
        <Button
          onClick={() => setIsToolboxOpen(true)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center text-xl"
        >
          🧰
        </Button>
      </div>
    </div>
  );
};
