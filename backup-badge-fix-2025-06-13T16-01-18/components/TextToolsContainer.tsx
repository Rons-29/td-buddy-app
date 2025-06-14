'use client';

import { FileText, HelpCircle, Type } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CharacterAnalysisTab } from './CharacterAnalysisTab';
import { CharacterCountTab } from './CharacterCountTab';
import { KanjiConversionTab } from './KanjiConversionTab';
import { TextGeneratorTab } from './TextGeneratorTab';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

type TabType = 'generator' | 'counter' | 'analysis' | 'kanji';

interface Tab {
  id: TabType;
  label: string;
  icon: string;
  description: string;
}

const tabs: Tab[] = [
  {
    id: 'generator',
    label: 'テキスト生成',
    icon: '✏️',
    description: 'ランダムテキストを生成',
  },
  {
    id: 'counter',
    label: '文字数カウント',
    icon: '📊',
    description: '文字数・バイト数・行数をカウント',
  },
  {
    id: 'analysis',
    label: '文字種解析',
    icon: '🔍',
    description: '文字の種別を詳細に分析',
  },
  {
    id: 'kanji',
    label: '旧字体変換',
    icon: '📜',
    description: '新字体⇔旧字体を変換',
  },
];

export function TextToolsContainer() {
  const [activeTab, setActiveTab] = useState<TabType>('generator');
  const [mounted, setMounted] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [brewMessage, setBrewMessage] = useState(
    '📝 テキスト仕上げ工具の準備完了！美しいテキストを仕上げましょう♪'
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setBrewMessage(
        `✨ 「${tab.label}」機能を選択しました - ${tab.description}`
      );
    }
  };

  if (!mounted) {
    return (
      <Card workbench className="bg-purple-50 border-purple-200">
        <div className="p-6 text-center">
          <Type className="h-8 w-8 text-purple-600 mx-auto mb-4" />
          <p className="text-purple-600">テキスト仕上げ工具を読み込み中...</p>
        </div>
      </Card>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'generator':
        return <TextGeneratorTab />;
      case 'counter':
        return <CharacterCountTab />;
      case 'analysis':
        return <CharacterAnalysisTab />;
      case 'kanji':
        return <KanjiConversionTab />;
      default:
        return <TextGeneratorTab />;
    }
  };

  return (
    <div className="min-h-screen wb-workbench-bg">
      {/* ワークベンチヘッダー */}
      <Card workbench className="mb-6 bg-purple-50 border-purple-200">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Type className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-purple-800">
                📝 テキスト仕上げ工具
              </h1>
              <p className="text-purple-600 mt-1">
                高品質なテキストデータの生成・解析・変換
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-purple-100 text-purple-700 border-purple-300"
            >
              仕上げ工具
            </Badge>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              workbench
              onClick={() => setShowGuide(!showGuide)}
              className={`${
                showGuide
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-700'
              }`}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              {showGuide ? 'ガイドを閉じる' : '仕上げガイド'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Brewメッセージ */}
      <Card workbench className="mb-6 bg-purple-50 border-purple-200">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🍺</div>
            <div>
              <div className="font-medium text-purple-800">
                Brew からのメッセージ
              </div>
              <div className="text-purple-700 mt-1">{brewMessage}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 機能選択タブ */}
      <Card workbench className="mb-6 bg-purple-50 border-purple-200">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-purple-800">
              テキスト仕上げ機能選択
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`p-4 border-2 rounded-lg text-center transition-all hover:shadow-md ${
                  activeTab === tab.id
                    ? 'border-purple-500 bg-purple-100'
                    : 'border-purple-200 hover:border-purple-300 bg-purple-50'
                }`}
              >
                <div className="text-2xl mb-2">{tab.icon}</div>
                <div className="font-medium text-purple-800 mb-1">
                  {tab.label}
                </div>
                <div className="text-xs text-purple-600">{tab.description}</div>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* 選択された機能のコンテンツ */}
      <Card workbench className="bg-purple-50 border-purple-200">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-2xl">
              {tabs.find(t => t.id === activeTab)?.icon}
            </span>
            <div>
              <h2 className="text-lg font-semibold text-purple-800">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-purple-600 text-sm">
                {tabs.find(t => t.id === activeTab)?.description}
              </p>
            </div>
          </div>

          {renderTabContent()}
        </div>
      </Card>

      {/* 仕上げガイド */}
      {showGuide && (
        <Card workbench className="mt-6 bg-purple-50 border-purple-200">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <HelpCircle className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-purple-800">
                テキスト仕上げ工具ガイド
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-purple-800 mb-3">
                  📝 テキスト生成機能
                </h3>
                <ul className="space-y-2 text-sm text-purple-700">
                  <li>• ランダムテキストの高品質生成</li>
                  <li>• 文字数・行数の精密制御</li>
                  <li>• 日本語・英語・記号対応</li>
                  <li>• カスタムパターン生成</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-purple-800 mb-3">
                  🔍 解析・変換機能
                </h3>
                <ul className="space-y-2 text-sm text-purple-700">
                  <li>• 文字数・バイト数の正確カウント</li>
                  <li>• 文字種別の詳細解析</li>
                  <li>• 新字体⇔旧字体変換</li>
                  <li>• 統計情報の可視化</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-purple-100 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">💡</span>
                <span className="font-medium text-purple-800">
                  Brewのヒント
                </span>
              </div>
              <p className="text-sm text-purple-700">
                各ツールはローカルで動作するため、プライバシーが保護されます。
                生成されたデータは24時間後に自動的に削除されます。
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
