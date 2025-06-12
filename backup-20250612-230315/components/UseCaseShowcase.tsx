'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { 
  Lightbulb, 
  Code, 
  Database, 
  Shield, 
  Zap, 
  Globe, 
  CheckCircle, 
  Copy,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { 
  UseCaseExample, 
  CategoryInfo, 
  DifficultyInfo, 
  UseCaseCategory,
  DifficultyLevel
} from '../types/useCase';
import { USE_CASES } from '../data/useCaseData';

// カテゴリ情報の定義
const CATEGORY_INFO: Record<UseCaseCategory, CategoryInfo> = {
  security: { icon: Shield, label: 'セキュリティ', color: 'red' },
  performance: { icon: Zap, label: 'パフォーマンス', color: 'yellow' },
  automation: { icon: Code, label: '自動化', color: 'blue' },
  integration: { icon: Globe, label: '統合', color: 'green' },
  debug: { icon: Lightbulb, label: 'デバッグ', color: 'purple' }
};

// 難易度情報の定義
const DIFFICULTY_INFO: Record<DifficultyLevel, DifficultyInfo> = {
  beginner: { label: '初級', color: 'green' },
  intermediate: { label: '中級', color: 'yellow' },
  advanced: { label: '上級', color: 'red' }
};

export function UseCaseShowcase() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // フィルタリングされた活用例
  const filteredUseCases = useMemo(() => {
    return activeCategory === 'all' 
      ? USE_CASES 
      : USE_CASES.filter(useCase => useCase.category === activeCategory);
  }, [activeCategory]);

  // 現在の活用例
  const currentUseCase = useMemo(() => {
    return filteredUseCases[currentIndex];
  }, [filteredUseCases, currentIndex]);

  // コードコピー機能
  const handleCopyCode = useCallback(async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('コピーに失敗しました:', error);
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  }, []);

  // ナビゲーション
  const nextExample = useCallback(() => {
    console.log('🎯 次の活用例に移動');
    setCurrentIndex((prev) => (prev + 1) % filteredUseCases.length);
  }, [filteredUseCases.length]);

  const prevExample = useCallback(() => {
    console.log('🎯 前の活用例に移動');
    setCurrentIndex((prev) => (prev - 1 + filteredUseCases.length) % filteredUseCases.length);
  }, [filteredUseCases.length]);

  // カテゴリ変更（確実に動作するシンプルな関数）
  const handleCategoryChange = (category: string) => {
    console.log('🎯 カテゴリ変更:', category);
    setActiveCategory(category);
    setCurrentIndex(0);
  };

  // 設定適用
  const handleApplyConfig = useCallback(() => {
    if (!currentUseCase) return;
    
    console.log('🎯 設定適用:', currentUseCase.config);
    window.dispatchEvent(new CustomEvent('applyUseCaseConfig', {
      detail: currentUseCase.config
    }));
  }, [currentUseCase]);

  if (!currentUseCase) return null;

  const CategoryIcon = CATEGORY_INFO[currentUseCase.category].icon;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      {/* ヘッダー */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <CategoryIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              💡 活用例・テストシナリオ
            </h3>
            <p className="text-sm text-gray-600">
              {filteredUseCases.length}個の実用的な活用例
            </p>
          </div>
        </div>

        {/* カテゴリフィルター */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            style={{ cursor: 'pointer' }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
              activeCategory === 'all'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            すべて
          </button>
          
          <button
            type="button"
            onClick={() => handleCategoryChange('security')}
            style={{ cursor: 'pointer' }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
              activeCategory === 'security'
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            セキュリティ
          </button>
          
          <button
            type="button"
            onClick={() => handleCategoryChange('performance')}
            style={{ cursor: 'pointer' }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
              activeCategory === 'performance'
                ? 'bg-yellow-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            パフォーマンス
          </button>
          
          <button
            type="button"
            onClick={() => handleCategoryChange('automation')}
            style={{ cursor: 'pointer' }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
              activeCategory === 'automation'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            自動化
          </button>
          
          <button
            type="button"
            onClick={() => handleCategoryChange('integration')}
            style={{ cursor: 'pointer' }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
              activeCategory === 'integration'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            統合
          </button>
          
          <button
            type="button"
            onClick={() => handleCategoryChange('debug')}
            style={{ cursor: 'pointer' }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
              activeCategory === 'debug'
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            デバッグ
          </button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="space-y-6">
        {/* タイトル・ナビゲーション */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h4 className="text-xl font-bold text-gray-900">
                {currentUseCase.title}
              </h4>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                {DIFFICULTY_INFO[currentUseCase.difficulty].label}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {currentUseCase.format.toUpperCase()}
              </span>
            </div>
            <p className="text-gray-600 mb-3">
              {currentUseCase.description}
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>📍 {currentUseCase.scenario}</span>
            </div>
          </div>

          {/* ナビゲーション */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={prevExample}
              style={{ cursor: 'pointer' }}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
              aria-label="前の活用例"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-500 px-3 py-1">
              {currentIndex + 1} / {filteredUseCases.length}
            </span>
            <button
              type="button"
              onClick={nextExample}
              style={{ cursor: 'pointer' }}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
              aria-label="次の活用例"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 設定情報 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h5 className="font-medium text-gray-800 mb-2">推奨設定</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">フォーマット:</span>
              <span className="ml-2 font-medium">{currentUseCase.config.format.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-gray-500">件数:</span>
              <span className="ml-2 font-medium">{currentUseCase.config.count.toLocaleString()}件</span>
            </div>
            <div>
              <span className="text-gray-500">カテゴリ:</span>
              <span className="ml-2 font-medium">{CATEGORY_INFO[currentUseCase.category].label}</span>
            </div>
          </div>
        </div>

        {/* コード例 */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-medium text-gray-800">実装例</h5>
            <button
              type="button"
              onClick={() => handleCopyCode(currentUseCase.codeExample, currentUseCase.id)}
              style={{ cursor: 'pointer' }}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              {copiedCode === currentUseCase.id ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-green-500">コピー完了</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>コピー</span>
                </>
              )}
            </button>
          </div>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{currentUseCase.codeExample}</code>
          </pre>
        </div>

        {/* メリット */}
        <div>
          <h5 className="font-medium text-gray-800 mb-3">✨ このパターンのメリット</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {currentUseCase.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleApplyConfig}
            style={{ cursor: 'pointer' }}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            <span>この設定を適用</span>
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => window.open(`/docs/use-cases#${currentUseCase.id}`, '_blank')}
            style={{ cursor: 'pointer' }}
            className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
          >
            <span>詳細ドキュメント</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default UseCaseShowcase; 