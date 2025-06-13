'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift

  // その他のメトリクス
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  domContentLoaded?: number;
  loadComplete?: number;

  // リソース情報
  totalResources?: number;
  totalSize?: number;
  jsSize?: number;
  cssSize?: number;
  imageSize?: number;

  // メモリ使用量
  usedJSHeapSize?: number;
  totalJSHeapSize?: number;
  jsHeapSizeLimit?: number;
}

interface PerformanceTestResult {
  timestamp: Date;
  url: string;
  metrics: PerformanceMetrics;
  score: number;
  recommendations: string[];
}

interface PerformanceTestRunnerProps {
  autoRun?: boolean;
  showDetails?: boolean;
  onTestComplete?: (result: PerformanceTestResult) => void;
}

export function PerformanceTestRunner({
  autoRun = false,
  showDetails = true,
  onTestComplete,
}: PerformanceTestRunnerProps) {
  const [testResult, setTestResult] = useState<PerformanceTestResult | null>(
    null
  );
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runPerformanceTest = async () => {
    setIsRunning(true);
    setError(null);

    try {
      const metrics: PerformanceMetrics = {};
      const recommendations: string[] = [];
      let score = 100;

      // Performance API を使用してメトリクスを取得
      if ('performance' in window) {
        const navigation = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');

        // 基本的なタイミング
        if (navigation) {
          metrics.ttfb = navigation.responseStart - navigation.requestStart;
          metrics.domContentLoaded =
            navigation.domContentLoadedEventEnd - navigation.navigationStart;
          metrics.loadComplete =
            navigation.loadEventEnd - navigation.navigationStart;
        }

        // First Contentful Paint
        const fcpEntry = paint.find(
          entry => entry.name === 'first-contentful-paint'
        );
        if (fcpEntry) {
          metrics.fcp = fcpEntry.startTime;
        }

        // リソース情報
        const resources = performance.getEntriesByType(
          'resource'
        ) as PerformanceResourceTiming[];
        metrics.totalResources = resources.length;

        let totalSize = 0;
        let jsSize = 0;
        let cssSize = 0;
        let imageSize = 0;

        resources.forEach(resource => {
          const size = resource.transferSize || 0;
          totalSize += size;

          if (resource.name.includes('.js')) {
            jsSize += size;
          } else if (resource.name.includes('.css')) {
            cssSize += size;
          } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
            imageSize += size;
          }
        });

        metrics.totalSize = totalSize;
        metrics.jsSize = jsSize;
        metrics.cssSize = cssSize;
        metrics.imageSize = imageSize;

        // メモリ使用量（Chrome系ブラウザのみ）
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          metrics.usedJSHeapSize = memory.usedJSHeapSize;
          metrics.totalJSHeapSize = memory.totalJSHeapSize;
          metrics.jsHeapSizeLimit = memory.jsHeapSizeLimit;
        }
      }

      // Web Vitals の取得（利用可能な場合）
      try {
        // LCP の取得
        const lcpObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          metrics.lcp = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // CLS の取得
        let clsValue = 0;
        const clsObserver = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          metrics.cls = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // 少し待ってからオブザーバーを停止
        setTimeout(() => {
          lcpObserver.disconnect();
          clsObserver.disconnect();
        }, 3000);
      } catch (e) {
        // Web Vitals API が利用できない場合は無視
      }

      // スコア計算と推奨事項

      // TTFB チェック
      if (metrics.ttfb && metrics.ttfb > 600) {
        recommendations.push('サーバーレスポンス時間が遅いです (600ms以上)');
        score -= 15;
      }

      // FCP チェック
      if (metrics.fcp && metrics.fcp > 1800) {
        recommendations.push('First Contentful Paint が遅いです (1.8秒以上)');
        score -= 20;
      }

      // LCP チェック
      if (metrics.lcp && metrics.lcp > 2500) {
        recommendations.push('Largest Contentful Paint が遅いです (2.5秒以上)');
        score -= 25;
      }

      // CLS チェック
      if (metrics.cls && metrics.cls > 0.1) {
        recommendations.push('Cumulative Layout Shift が大きいです (0.1以上)');
        score -= 20;
      }

      // リソースサイズチェック
      if (metrics.totalSize && metrics.totalSize > 3 * 1024 * 1024) {
        recommendations.push('総リソースサイズが大きいです (3MB以上)');
        score -= 15;
      }

      if (metrics.jsSize && metrics.jsSize > 1 * 1024 * 1024) {
        recommendations.push('JavaScriptサイズが大きいです (1MB以上)');
        score -= 10;
      }

      // メモリ使用量チェック
      if (metrics.usedJSHeapSize && metrics.usedJSHeapSize > 50 * 1024 * 1024) {
        recommendations.push('メモリ使用量が多いです (50MB以上)');
        score -= 10;
      }

      // 推奨事項が少ない場合の追加
      if (recommendations.length === 0) {
        recommendations.push('パフォーマンスは良好です！');
      } else {
        recommendations.push('画像の最適化を検討してください');
        recommendations.push('不要なJavaScriptの削除を検討してください');
        recommendations.push('CDNの使用を検討してください');
      }

      const result: PerformanceTestResult = {
        timestamp: new Date(),
        url: window.location.href,
        metrics,
        score: Math.max(0, score),
        recommendations,
      };

      setTestResult(result);
      onTestComplete?.(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'パフォーマンステスト中にエラーが発生しました'
      );
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (autoRun) {
      // ページ読み込み完了後にテスト実行
      const timer = setTimeout(() => {
        runPerformanceTest();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [autoRun]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) {
      return '0 B';
    }
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) {
      return `${Math.round(ms)}ms`;
    }
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) {
      return 'text-green-700 bg-green-100';
    }
    if (score >= 70) {
      return 'text-yellow-700 bg-yellow-100';
    }
    if (score >= 50) {
      return 'text-orange-700 bg-orange-100';
    }
    return 'text-red-700 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) {
      return '🚀';
    }
    if (score >= 70) {
      return '⚡';
    }
    if (score >= 50) {
      return '⚠️';
    }
    return '🐌';
  };

  const getMetricStatus = (value: number, good: number, poor: number) => {
    if (value <= good) {
      return { status: 'good', color: 'text-green-600', icon: '✅' };
    }
    if (value <= poor) {
      return {
        status: 'needs-improvement',
        color: 'text-yellow-600',
        icon: '⚠️',
      };
    }
    return { status: 'poor', color: 'text-red-600', icon: '❌' };
  };

  return (
    <div className="wb-performance-test bg-white border border-wb-wood-200 rounded-lg p-6 shadow-sm">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">⚡</span>
          <div>
            <h3 className="text-lg font-semibold text-wb-wood-800">
              パフォーマンステスト
            </h3>
            <p className="text-sm text-wb-wood-600">
              Core Web Vitals & リソース最適化チェック
            </p>
          </div>
        </div>

        <button
          onClick={runPerformanceTest}
          disabled={isRunning}
          className="px-4 py-2 bg-wb-tool-measure-500 text-white rounded-lg hover:bg-wb-tool-measure-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? '🔄 測定中...' : '▶️ テスト実行'}
        </button>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-red-500">❌</span>
            <span className="text-red-700 font-medium">エラー</span>
          </div>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      )}

      {/* 実行中表示 */}
      {isRunning && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="text-blue-700">パフォーマンス測定中...</span>
          </div>
        </div>
      )}

      {/* テスト結果 */}
      {testResult && (
        <div className="space-y-6">
          {/* 総合スコア */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <span className="text-3xl">{getScoreIcon(testResult.score)}</span>
              <span
                className={`text-3xl font-bold px-4 py-2 rounded-lg ${getScoreColor(
                  testResult.score
                )}`}
              >
                {testResult.score}点
              </span>
            </div>
            <p className="text-sm text-gray-600">パフォーマンススコア</p>
          </div>

          {/* Core Web Vitals */}
          {showDetails && (
            <div>
              <h4 className="font-semibold text-wb-wood-700 mb-3">
                🎯 Core Web Vitals
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                {testResult.metrics.lcp && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">LCP</span>
                      <span
                        className={
                          getMetricStatus(testResult.metrics.lcp, 2500, 4000)
                            .color
                        }
                      >
                        {
                          getMetricStatus(testResult.metrics.lcp, 2500, 4000)
                            .icon
                        }
                      </span>
                    </div>
                    <div className="text-lg font-bold">
                      {formatTime(testResult.metrics.lcp)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Largest Contentful Paint
                    </div>
                  </div>
                )}

                {testResult.metrics.fid && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">FID</span>
                      <span
                        className={
                          getMetricStatus(testResult.metrics.fid, 100, 300)
                            .color
                        }
                      >
                        {getMetricStatus(testResult.metrics.fid, 100, 300).icon}
                      </span>
                    </div>
                    <div className="text-lg font-bold">
                      {formatTime(testResult.metrics.fid)}
                    </div>
                    <div className="text-xs text-gray-500">
                      First Input Delay
                    </div>
                  </div>
                )}

                {testResult.metrics.cls && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">CLS</span>
                      <span
                        className={
                          getMetricStatus(testResult.metrics.cls, 0.1, 0.25)
                            .color
                        }
                      >
                        {
                          getMetricStatus(testResult.metrics.cls, 0.1, 0.25)
                            .icon
                        }
                      </span>
                    </div>
                    <div className="text-lg font-bold">
                      {testResult.metrics.cls.toFixed(3)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Cumulative Layout Shift
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* その他のメトリクス */}
          {showDetails && (
            <div>
              <h4 className="font-semibold text-wb-wood-700 mb-3">
                📊 詳細メトリクス
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h5 className="font-medium text-wb-wood-600">読み込み時間</h5>
                  {testResult.metrics.ttfb && (
                    <div className="flex justify-between">
                      <span className="text-sm">TTFB</span>
                      <span className="text-sm font-mono">
                        {formatTime(testResult.metrics.ttfb)}
                      </span>
                    </div>
                  )}
                  {testResult.metrics.fcp && (
                    <div className="flex justify-between">
                      <span className="text-sm">FCP</span>
                      <span className="text-sm font-mono">
                        {formatTime(testResult.metrics.fcp)}
                      </span>
                    </div>
                  )}
                  {testResult.metrics.domContentLoaded && (
                    <div className="flex justify-between">
                      <span className="text-sm">DOM Content Loaded</span>
                      <span className="text-sm font-mono">
                        {formatTime(testResult.metrics.domContentLoaded)}
                      </span>
                    </div>
                  )}
                  {testResult.metrics.loadComplete && (
                    <div className="flex justify-between">
                      <span className="text-sm">Load Complete</span>
                      <span className="text-sm font-mono">
                        {formatTime(testResult.metrics.loadComplete)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium text-wb-wood-600">リソース情報</h5>
                  {testResult.metrics.totalResources && (
                    <div className="flex justify-between">
                      <span className="text-sm">総リソース数</span>
                      <span className="text-sm font-mono">
                        {testResult.metrics.totalResources}個
                      </span>
                    </div>
                  )}
                  {testResult.metrics.totalSize && (
                    <div className="flex justify-between">
                      <span className="text-sm">総サイズ</span>
                      <span className="text-sm font-mono">
                        {formatBytes(testResult.metrics.totalSize)}
                      </span>
                    </div>
                  )}
                  {testResult.metrics.jsSize && (
                    <div className="flex justify-between">
                      <span className="text-sm">JavaScript</span>
                      <span className="text-sm font-mono">
                        {formatBytes(testResult.metrics.jsSize)}
                      </span>
                    </div>
                  )}
                  {testResult.metrics.cssSize && (
                    <div className="flex justify-between">
                      <span className="text-sm">CSS</span>
                      <span className="text-sm font-mono">
                        {formatBytes(testResult.metrics.cssSize)}
                      </span>
                    </div>
                  )}
                  {testResult.metrics.imageSize && (
                    <div className="flex justify-between">
                      <span className="text-sm">画像</span>
                      <span className="text-sm font-mono">
                        {formatBytes(testResult.metrics.imageSize)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 推奨事項 */}
          <div>
            <h4 className="font-semibold text-wb-wood-700 mb-3">
              💡 改善推奨事項
            </h4>
            <ul className="space-y-2">
              {testResult.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-wb-wood-600">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* テスト情報 */}
          <div className="text-xs text-gray-500 border-t pt-3">
            <div>測定時刻: {testResult.timestamp.toLocaleString()}</div>
            <div>対象URL: {testResult.url}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PerformanceTestRunner;
