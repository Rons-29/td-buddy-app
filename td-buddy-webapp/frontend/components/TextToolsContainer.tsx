'use client';

import React, { useState, useEffect } from 'react';
import { TextGeneratorTab } from './TextGeneratorTab';
import { CharacterCountTab } from './CharacterCountTab';
import { CharacterAnalysisTab } from './CharacterAnalysisTab';
import { KanjiConversionTab } from './KanjiConversionTab';

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
    description: 'ランダムテキストを生成'
  },
  {
    id: 'counter',
    label: '文字数カウント',
    icon: '📊',
    description: '文字数・バイト数・行数をカウント'
  },
  {
    id: 'analysis',
    label: '文字種解析',
    icon: '🔍',
    description: '文字の種別を詳細に分析'
  },
  {
    id: 'kanji',
    label: '旧字体変換',
    icon: '📜',
    description: '新字体⇔旧字体を変換'
  }
];

export function TextToolsContainer() {
  const [activeTab, setActiveTab] = useState<TabType>('generator');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-td-accent-100 rounded-full mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              文字・テキスト系ツール
            </h1>
            <p className="text-gray-600">
              読み込み中...
            </p>
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
    <div className="max-w-7xl mx-auto">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-td-accent-100 rounded-full mb-4">
          <span className="text-3xl">📝</span>
        </div>
        <h1 className="text-4xl font-bold text-td-primary-900 mb-4">
          文字・テキスト系ツール
        </h1>
        <p className="text-xl text-td-gray-600 max-w-2xl mx-auto">
          テキスト生成、文字数カウント、文字種解析、旧字体変換など、
          文字・テキスト関連の便利な機能を集めました
        </p>
      </div>

      {/* TDキャラクター */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 border border-td-accent-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-td-accent-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              TD
            </div>
            <div>
              <p className="text-sm text-td-gray-600">
                TDからのメッセージ
              </p>
              <p className="text-td-gray-800 font-medium">
                文字・テキストの処理はTDにお任せください！📝✨
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="bg-white rounded-xl shadow-lg border border-td-gray-200 overflow-hidden">
        <div className="border-b border-td-gray-200">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-center border-r border-td-gray-200 last:border-r-0 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-td-accent-50 text-td-accent-700 border-b-2 border-td-accent-500'
                    : 'text-td-gray-600 hover:text-td-gray-900 hover:bg-td-gray-50'
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
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* フッター情報 */}
      <div className="mt-8 text-center">
        <div className="bg-white rounded-lg shadow-md p-4 border border-td-gray-200">
          <p className="text-sm text-td-gray-600">
            💡 <strong>TDのヒント:</strong> 
            各ツールはローカルで動作するため、プライバシーが保護されます。
            生成されたデータは24時間後に自動的に削除されます。
          </p>
        </div>
      </div>
    </div>
  );
} 