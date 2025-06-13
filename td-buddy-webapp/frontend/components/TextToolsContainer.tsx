'use client';

import { useEffect, useState } from 'react';
import { CharacterAnalysisTab } from './CharacterAnalysisTab';
import { CharacterCountTab } from './CharacterCountTab';
import { KanjiConversionTab } from './KanjiConversionTab';
import { TextGeneratorTab } from './TextGeneratorTab';

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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="wb-tool-panel wb-tool-polish">
        <div className="wb-tool-panel-header">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 bg-wb-tool-polish-500 rounded-full">
              <span className="text-xl text-white">📝</span>
            </div>
            <div>
              <h2 className="wb-tool-panel-title">テキスト生成工具</h2>
              <p className="wb-tool-panel-description">読み込み中...</p>
            </div>
          </div>
        </div>
      </div>
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
    <div className="space-y-6">
      {/* 工具パネルヘッダー */}
      <div className="wb-tool-panel-header">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-2 bg-wb-tool-polish-500 rounded-full">
            <span className="text-xl text-white">📝</span>
          </div>
          <div className="text-center">
            <h2 className="wb-tool-panel-title">テキスト生成工具</h2>
            <p className="wb-tool-panel-description">
              テキスト生成、文字数カウント、文字種解析、旧字体変換など、
              文字・テキスト関連の便利な機能を集めました
            </p>
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="wb-tool-panel wb-tool-polish">
        <div className="border-b border-wb-wood-200">
          <nav className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-center border-r border-wb-wood-200 last:border-r-0 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-wb-tool-polish-50 text-wb-tool-polish-700 border-b-2 border-wb-tool-polish-500'
                    : 'text-wb-wood-600 hover:text-wb-wood-900 hover:bg-wb-wood-50'
                }`}
              >
                <div className="space-y-1">
                  <div className="text-xl">{tab.icon}</div>
                  <div className="font-medium text-sm">{tab.label}</div>
                  <div className="text-xs opacity-75">{tab.description}</div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* タブコンテンツ */}
        <div className="p-6">{renderTabContent()}</div>
      </div>

      {/* 工具情報フッター */}
      <div className="wb-result-panel">
        <div className="text-center">
          <p className="text-sm text-wb-wood-600">
            💡 <strong>Brewのヒント:</strong>
            各ツールはローカルで動作するため、プライバシーが保護されます。
            生成されたデータは24時間後に自動的に削除されます。
          </p>
        </div>
      </div>
    </div>
  );
}
