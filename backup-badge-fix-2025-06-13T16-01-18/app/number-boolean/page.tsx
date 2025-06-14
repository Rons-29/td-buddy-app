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
    <div className="min-h-screen wb-workbench-bg">
      {/* ヘッダー */}
      <div className="wb-surface-primary shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold wb-text-primary flex items-center gap-2">
                🔢 数値・真偽値生成工具
              </h1>
            </div>
            <nav className="flex space-x-4">
              <a href="/" className="wb-nav-link">
                ホーム
              </a>
              <a href="/password" className="wb-nav-link">
                パスワード
              </a>
              <a href="/personal" className="wb-nav-link">
                個人情報
              </a>
              <a href="/datetime" className="wb-nav-link">
                日時
              </a>
              <a
                href="/number-boolean"
                className="wb-nav-link-active wb-bg-measure wb-text-white"
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
              <div className="wb-tool-panel">
                <h3 className="wb-section-title flex items-center gap-2">
                  ⚡ クイックアクション
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="wb-action-button wb-button-measure"
                  >
                    🔄 リセット
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="wb-action-button wb-button-inspect"
                  >
                    🖨️ 印刷
                  </button>
                  <a href="/export" className="wb-action-button wb-button-join">
                    📊 エクスポート
                  </a>
                </div>
              </div>

              {/* ヘルプ・サポート */}
              <div className="wb-info-panel wb-bg-polish">
                <h3 className="wb-section-title wb-text-polish flex items-center gap-2">
                  💡 ヘルプ・サポート
                </h3>
                <div className="space-y-3 text-sm wb-text-polish">
                  <div className="flex items-start gap-2">
                    <span>📚</span>
                    <div>
                      <div className="font-medium">使い方ガイド</div>
                      <div className="text-xs opacity-75">
                        基本的な操作方法を確認
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>🎯</span>
                    <div>
                      <div className="font-medium">ユースケース例</div>
                      <div className="text-xs opacity-75">
                        実際の活用方法を学習
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>🍺</span>
                    <div>
                      <div className="font-medium">TDに質問</div>
                      <div className="text-xs opacity-75">
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
      <footer className="wb-surface-primary border-t wb-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔧</span>
              <div>
                <div className="font-semibold wb-text-primary">
                  Quality Workbench
                </div>
                <div className="text-sm wb-text-muted">
                  AI連携型テストデータ生成工具
                </div>
              </div>
            </div>
            <div className="text-sm wb-text-muted">
              © 2024 Quality Workbench. TDがサポートしています♪
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
