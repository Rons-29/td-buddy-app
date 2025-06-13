'use client';

import { useEffect, useState } from 'react';

interface BundleInfo {
  page: string;
  jsSize: number;
  cssSize: number;
  totalSize: number;
  loadTime: number;
  grade: 'excellent' | 'good' | 'needs-improvement' | 'poor';
}

interface OptimizationSuggestion {
  type: 'critical' | 'important' | 'minor';
  title: string;
  description: string;
  impact: string;
  action: string;
}

export default function BundleAnalyzer() {
  const [bundleData, setBundleData] = useState<BundleInfo[]>([]);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'details' | 'suggestions'
  >('overview');

  useEffect(() => {
    // 開発環境でのみ表示
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
      analyzeBundles();
    }
  }, []);

  const analyzeBundles = async () => {
    // 実際のバンドル情報を取得（模擬データ）
    const mockBundleData: BundleInfo[] = [
      {
        page: 'index',
        jsSize: 87.8,
        cssSize: 12.3,
        totalSize: 100.1,
        loadTime: 1200,
        grade: 'excellent',
      },
      {
        page: 'brews-demo',
        jsSize: 195.4,
        cssSize: 15.2,
        totalSize: 210.6,
        loadTime: 2800,
        grade: 'needs-improvement',
      },
      {
        page: 'tools/password-generator',
        jsSize: 125.6,
        cssSize: 8.9,
        totalSize: 134.5,
        loadTime: 1800,
        grade: 'good',
      },
      {
        page: 'tools/csv-generator',
        jsSize: 98.2,
        cssSize: 7.1,
        totalSize: 105.3,
        loadTime: 1400,
        grade: 'excellent',
      },
      {
        page: 'tools/json-generator',
        jsSize: 102.8,
        cssSize: 6.8,
        totalSize: 109.6,
        loadTime: 1500,
        grade: 'excellent',
      },
    ];

    setBundleData(mockBundleData);

    // 最適化提案を生成
    const optimizationSuggestions: OptimizationSuggestion[] = [
      {
        type: 'critical',
        title: 'brews-demoページの最適化',
        description:
          'brews-demoページのバンドルサイズが210.6kBと大きく、読み込み時間が2.8秒かかっています。',
        impact: '読み込み時間を40%短縮（2.8s → 1.7s）',
        action: 'コード分割とレイジーローディングの実装',
      },
      {
        type: 'important',
        title: 'CSS最適化',
        description: '未使用CSSの除去により、全体的なCSSサイズを削減できます。',
        impact: 'CSSサイズを30%削減',
        action: 'PurgeCSSの導入とクリティカルCSS抽出',
      },
      {
        type: 'important',
        title: '画像最適化',
        description:
          '静的エクスポートでも最適化可能な画像形式の変更を検討してください。',
        impact: '画像サイズを50%削減',
        action: 'WebP形式への変換とサイズ最適化',
      },
      {
        type: 'minor',
        title: 'フォント最適化',
        description:
          'フォントの事前読み込みとサブセット化で初期表示を改善できます。',
        impact: 'フォント読み込み時間を20%短縮',
        action: 'font-displayとpreloadの最適化',
      },
    ];

    setSuggestions(optimizationSuggestions);
  };

  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case 'excellent':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'good':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'needs-improvement':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSuggestionColor = (type: string): string => {
    switch (type) {
      case 'critical':
        return 'border-l-red-500 bg-red-50';
      case 'important':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'minor':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getSuggestionIcon = (type: string): string => {
    switch (type) {
      case 'critical':
        return '🚨';
      case 'important':
        return '⚠️';
      case 'minor':
        return 'ℹ️';
      default:
        return '📝';
    }
  };

  const formatSize = (sizeKB: number): string => {
    if (sizeKB < 1) {
      return `${Math.round(sizeKB * 1000)}B`;
    }
    if (sizeKB < 1000) {
      return `${sizeKB.toFixed(1)}KB`;
    }
    return `${(sizeKB / 1000).toFixed(1)}MB`;
  };

  const calculateOverallScore = (): number => {
    if (bundleData.length === 0) {
      return 0;
    }

    const scores = bundleData.map(bundle => {
      switch (bundle.grade) {
        case 'excellent':
          return 100;
        case 'good':
          return 75;
        case 'needs-improvement':
          return 50;
        case 'poor':
          return 25;
        default:
          return 0;
      }
    });

    return Math.round(
      scores.reduce((a: number, b: number) => a + b, 0) / scores.length
    );
  };

  if (!isVisible) {
    return null;
  }

  const overallScore = calculateOverallScore();
  const totalSize = bundleData.reduce(
    (sum, bundle) => sum + bundle.totalSize,
    0
  );
  const averageLoadTime =
    bundleData.reduce((sum, bundle) => sum + bundle.loadTime, 0) /
    bundleData.length;

  return (
    <div className="fixed z-[9997] w-96 perf-monitor-container perf-analyzer-position perf-monitor-fade-in">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            📊 バンドル分析
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                overallScore >= 90
                  ? 'bg-green-100 text-green-800'
                  : overallScore >= 75
                  ? 'bg-blue-100 text-blue-800'
                  : overallScore >= 50
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {overallScore}点
            </span>
          </h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* タブナビゲーション */}
        <div className="flex border-b border-gray-200">
          {[
            { key: 'overview', label: '概要' },
            { key: 'details', label: '詳細' },
            { key: 'suggestions', label: '提案' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === tab.key
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* コンテンツ */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-2xl font-bold text-gray-800">
                    {formatSize(totalSize)}
                  </div>
                  <div className="text-xs text-gray-600">総バンドルサイズ</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-2xl font-bold text-gray-800">
                    {Math.round(averageLoadTime)}ms
                  </div>
                  <div className="text-xs text-gray-600">平均読み込み時間</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-800">
                  ページ別パフォーマンス
                </h4>
                {bundleData.slice(0, 5).map(bundle => (
                  <div
                    key={bundle.page}
                    className={`p-2 rounded border ${getGradeColor(
                      bundle.grade
                    )}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{bundle.page}</span>
                      <span className="text-xs">
                        {formatSize(bundle.totalSize)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-3">
              {bundleData.map(bundle => (
                <div
                  key={bundle.page}
                  className="border border-gray-200 rounded p-3"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-800">{bundle.page}</h4>
                    <span
                      className={`px-2 py-1 rounded text-xs ${getGradeColor(
                        bundle.grade
                      )}`}
                    >
                      {bundle.grade}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-gray-600">JS</div>
                      <div className="font-medium">
                        {formatSize(bundle.jsSize)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">CSS</div>
                      <div className="font-medium">
                        {formatSize(bundle.cssSize)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">読み込み</div>
                      <div className="font-medium">{bundle.loadTime}ms</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`border-l-4 p-3 rounded ${getSuggestionColor(
                    suggestion.type
                  )}`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">
                      {getSuggestionIcon(suggestion.type)}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-1">
                        {suggestion.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {suggestion.description}
                      </p>
                      <div className="text-xs space-y-1">
                        <div className="text-green-600 font-medium">
                          💡 効果: {suggestion.impact}
                        </div>
                        <div className="text-blue-600">
                          🔧 対策: {suggestion.action}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
