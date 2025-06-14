'use client';

import { useEffect, useState } from 'react';
import BundleAnalyzer from './BundleAnalyzer';
import PerformanceMonitor from './PerformanceMonitor';
import PerformanceOptimizer from './PerformanceOptimizer';

interface DashboardMetrics {
  // Core Web Vitals
  lcp: number | null;
  fid: number | null;
  cls: number | null;

  // その他の指標
  fcp: number | null;
  ttfb: number | null;

  // リソース使用量
  jsHeapSize: number;
  domNodes: number;

  // ネットワーク
  connectionType: string;
  effectiveType: string;

  // 全体スコア
  overallScore: number;
}

interface PerformanceHistory {
  timestamp: number;
  score: number;
  lcp: number | null;
  fcp: number | null;
}

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    jsHeapSize: 0,
    domNodes: 0,
    connectionType: 'unknown',
    effectiveType: 'unknown',
    overallScore: 0,
  });

  const [history, setHistory] = useState<PerformanceHistory[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [activeView, setActiveView] = useState<
    'overview' | 'monitor' | 'analyzer' | 'optimizer'
  >('overview');

  useEffect(() => {
    // 開発環境でのみ表示
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
      collectMetrics();

      // 定期的なメトリクス収集
      const interval = setInterval(collectMetrics, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const collectMetrics = () => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      // Performance Observer for Core Web Vitals
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');

      // TTFB
      const ttfb = navigation.responseStart - navigation.fetchStart;

      // FCP
      const fcpEntry = paint.find(
        entry => entry.name === 'first-contentful-paint'
      );
      const fcp = fcpEntry ? fcpEntry.startTime : null;

      // LCP (模擬値 - 実際はPerformanceObserverで取得)
      const lcp = fcp ? fcp + Math.random() * 1000 : null;

      // メモリ使用量
      const memory = (performance as any).memory;
      const jsHeapSize = memory ? memory.usedJSHeapSize : 0;

      // DOM要素数
      const domNodes = document.querySelectorAll('*').length;

      // ネットワーク情報
      const connection =
        (navigator as any).connection ||
        (navigator as any).mozConnection ||
        (navigator as any).webkitConnection;
      const connectionType = connection
        ? connection.type || 'unknown'
        : 'unknown';
      const effectiveType = connection
        ? connection.effectiveType || 'unknown'
        : 'unknown';

      // 全体スコアの計算
      let score = 100;

      // LCP評価
      if (lcp) {
        if (lcp > 4000) {
          score -= 30;
        } else if (lcp > 2500) {
          score -= 15;
        }
      }

      // FCP評価
      if (fcp) {
        if (fcp > 3000) {
          score -= 20;
        } else if (fcp > 1800) {
          score -= 10;
        }
      }

      // TTFB評価
      if (ttfb > 800) {
        score -= 15;
      } else if (ttfb > 600) {
        score -= 8;
      }

      // DOM要素数評価
      if (domNodes > 1500) {
        score -= 10;
      } else if (domNodes > 1000) {
        score -= 5;
      }

      // メモリ使用量評価
      if (jsHeapSize > 50 * 1024 * 1024) {
        score -= 10;
      } // 50MB
      else if (jsHeapSize > 30 * 1024 * 1024) {
        score -= 5;
      } // 30MB

      const newMetrics: DashboardMetrics = {
        lcp,
        fid: Math.random() * 100, // 模擬値
        cls: Math.random() * 0.25, // 模擬値
        fcp,
        ttfb,
        jsHeapSize,
        domNodes,
        connectionType,
        effectiveType,
        overallScore: Math.max(0, Math.round(score)),
      };

      setMetrics(newMetrics);

      // 履歴に追加
      setHistory(prev => {
        const newHistory = [
          ...prev,
          {
            timestamp: Date.now(),
            score: newMetrics.overallScore,
            lcp: newMetrics.lcp,
            fcp: newMetrics.fcp,
          },
        ];

        // 最新20件のみ保持
        return newHistory.slice(-20);
      });
    } catch (error) {
      console.error('メトリクス収集エラー:', error);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) {
      return '0 B';
    }
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number | null): string => {
    if (ms === null) {
      return 'N/A';
    }
    if (ms < 1000) {
      return `${Math.round(ms)}ms`;
    }
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) {
      return 'text-green-600 bg-green-50 border-green-200';
    }
    if (score >= 75) {
      return 'text-blue-600 bg-blue-50 border-blue-200';
    }
    if (score >= 50) {
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getMetricGrade = (
    value: number | null,
    thresholds: { good: number; poor: number }
  ): string => {
    if (value === null) {
      return 'unknown';
    }
    if (value <= thresholds.good) {
      return 'good';
    }
    if (value <= thresholds.poor) {
      return 'needs-improvement';
    }
    return 'poor';
  };

  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case 'good':
        return 'text-green-600 bg-green-50';
      case 'needs-improvement':
        return 'text-yellow-600 bg-yellow-50';
      case 'poor':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className="fixed z-[9999] w-96 perf-monitor-container perf-dashboard-position perf-monitor-fade-in">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          {/* ヘッダー */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              📊 パフォーマンスダッシュボード
              <span
                className={`px-2 py-1 rounded text-xs font-medium border ${getScoreColor(
                  metrics.overallScore
                )}`}
              >
                {metrics.overallScore}点
              </span>
            </h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* ナビゲーション */}
          <div className="flex border-b border-gray-200">
            {[
              { key: 'overview', label: '概要', icon: '📊' },
              { key: 'monitor', label: '監視', icon: '👁️' },
              { key: 'analyzer', label: '分析', icon: '🔍' },
              { key: 'optimizer', label: '最適化', icon: '⚡' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveView(tab.key as any)}
                className={`flex-1 px-2 py-2 text-xs font-medium flex items-center justify-center gap-1 ${
                  activeView === tab.key
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* コンテンツ */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {activeView === 'overview' && (
              <div className="space-y-4">
                {/* Core Web Vitals */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Core Web Vitals
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div
                      className={`p-2 rounded text-center ${getGradeColor(
                        getMetricGrade(metrics.lcp, { good: 2500, poor: 4000 })
                      )}`}
                    >
                      <div className="text-xs text-gray-600">LCP</div>
                      <div className="font-medium">
                        {formatTime(metrics.lcp)}
                      </div>
                    </div>
                    <div
                      className={`p-2 rounded text-center ${getGradeColor(
                        getMetricGrade(metrics.fid, { good: 100, poor: 300 })
                      )}`}
                    >
                      <div className="text-xs text-gray-600">FID</div>
                      <div className="font-medium">
                        {formatTime(metrics.fid)}
                      </div>
                    </div>
                    <div
                      className={`p-2 rounded text-center ${getGradeColor(
                        getMetricGrade(metrics.cls, { good: 0.1, poor: 0.25 })
                      )}`}
                    >
                      <div className="text-xs text-gray-600">CLS</div>
                      <div className="font-medium">
                        {metrics.cls?.toFixed(3) || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* その他の指標 */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    その他の指標
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">FCP</span>
                      <span className="font-medium">
                        {formatTime(metrics.fcp)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">TTFB</span>
                      <span className="font-medium">
                        {formatTime(metrics.ttfb)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">JS Heap</span>
                      <span className="font-medium">
                        {formatBytes(metrics.jsHeapSize)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">DOM要素</span>
                      <span className="font-medium">
                        {metrics.domNodes.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ネットワーク情報 */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    ネットワーク
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">接続タイプ</span>
                      <span className="font-medium">
                        {metrics.connectionType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">実効速度</span>
                      <span className="font-medium">
                        {metrics.effectiveType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* パフォーマンス履歴 */}
                {history.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      スコア履歴
                    </h4>
                    <div className="h-16 flex items-end gap-1">
                      {history.slice(-10).map((entry, index) => (
                        <div
                          key={index}
                          className="flex-1 bg-blue-200 rounded-t"
                          style={{ height: `${(entry.score / 100) * 100}%` }}
                          title={`${entry.score}点`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      最新10回のスコア推移
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 他のコンポーネント */}
      {activeView === 'monitor' && <PerformanceMonitor />}
      {activeView === 'analyzer' && <BundleAnalyzer />}
      {activeView === 'optimizer' && <PerformanceOptimizer />}
    </>
  );
}
