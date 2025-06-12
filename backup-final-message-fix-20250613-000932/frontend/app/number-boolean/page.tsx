'use client';

import { useState } from 'react';
import { NumberBooleanGenerator } from '../../components/NumberBooleanGenerator';
import { NumberBooleanTDCard } from '../../components/NumberBooleanTDCard';
import { GeneratedNumberBoolean } from '../../types/numberboolean';

export default function NumberBooleanPage() {
  const [generatedData, setGeneratedData] = useState<GeneratedNumberBoolean[]>(
    []
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('integer');

  const handleGenerate = (data: GeneratedNumberBoolean[]) => {
    setGeneratedData(data);
  };

  const handleGenerationStart = () => {
    setIsGenerating(true);
  };

  const handleGenerationEnd = () => {
    setIsGenerating(false);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                🔢 数値・真偽値生成
              </h1>
            </div>
            <nav className="flex space-x-4">
              <a
                href="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                ホーム
              </a>
              <a
                href="/password"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                パスワード
              </a>
              <a
                href="/personal"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                個人情報
              </a>
              <a
                href="/datetime"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                日時
              </a>
              <a
                href="/number-boolean"
                className="bg-green-100 text-green-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                数値・真偽値
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 生成機能 (左側・メイン) */}
          <div className="lg:col-span-2">
            <NumberBooleanGenerator
              onGenerate={handleGenerate}
              onGenerationStart={handleGenerationStart}
              onGenerationEnd={handleGenerationEnd}
              onTypeChange={handleTypeChange}
            />
          </div>

          {/* TDサイドバー (右側) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <NumberBooleanTDCard
                generatedData={generatedData}
                isGenerating={isGenerating}
                selectedType={selectedType}
              />

              {/* クイックアクション */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  ⚡ クイックアクション
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    🔄 リセット
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="w-full bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    🖨️ 印刷
                  </button>
                  <a
                    href="/export"
                    className="w-full bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    📊 エクスポート
                  </a>
                </div>
              </div>

              {/* ヘルプ・サポート */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                  💡 ヘルプ・サポート
                </h3>
                <div className="space-y-3 text-sm text-indigo-800">
                  <div className="flex items-start gap-2">
                    <span>📚</span>
                    <div>
                      <div className="font-medium">使い方ガイド</div>
                      <div className="text-xs text-indigo-600">
                        基本的な操作方法を確認
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>🎯</span>
                    <div>
                      <div className="font-medium">ユースケース例</div>
                      <div className="text-xs text-indigo-600">
                        実際の活用方法を学習
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>🍺</span>
                    <div>
                      <div className="font-medium">TDに質問</div>
                      <div className="text-xs text-indigo-600">
                        AIアシスタントに相談
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* フッター */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍺</span>
              <div>
                <div className="font-semibold text-gray-900">
                  QA Workbench
                </div>
                <div className="text-sm text-gray-600">
                  AI連携型テストデータ生成ツール
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              © 2024 QA Workbench. TDがサポートしています♪
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
