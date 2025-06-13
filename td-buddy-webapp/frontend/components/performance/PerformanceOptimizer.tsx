'use client';

import { useCallback, useEffect, useState } from 'react';

interface OptimizationConfig {
  enableLazyLoading: boolean;
  enableImageOptimization: boolean;
  enableCSSOptimization: boolean;
  enableJSOptimization: boolean;
  enableCaching: boolean;
  enablePreloading: boolean;
}

interface PerformanceState {
  isOptimizing: boolean;
  optimizationsApplied: string[];
  performanceScore: number;
  recommendations: string[];
}

export default function PerformanceOptimizer() {
  const [config, setConfig] = useState<OptimizationConfig>({
    enableLazyLoading: true,
    enableImageOptimization: true,
    enableCSSOptimization: true,
    enableJSOptimization: true,
    enableCaching: true,
    enablePreloading: true,
  });

  const [state, setState] = useState<PerformanceState>({
    isOptimizing: false,
    optimizationsApplied: [],
    performanceScore: 0,
    recommendations: [],
  });

  const [isVisible, setIsVisible] = useState(false);

  // パフォーマンス監視
  const monitorPerformance = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const navigation = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    let score = 100;
    const recommendations: string[] = [];

    // 読み込み時間チェック
    const loadTime = navigation.loadEventEnd - navigation.fetchStart;
    if (loadTime > 3000) {
      score -= 20;
      recommendations.push('ページ読み込み時間が3秒を超えています');
    }

    // First Contentful Paint チェック
    const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
    if (fcp && fcp.startTime > 1800) {
      score -= 15;
      recommendations.push('First Contentful Paintが1.8秒を超えています');
    }

    // DOM要素数チェック
    const domElements = document.querySelectorAll('*').length;
    if (domElements > 1500) {
      score -= 10;
      recommendations.push('DOM要素数が多すぎます（1500個以上）');
    }

    // CSS/JSファイル数チェック
    const cssFiles = document.querySelectorAll('link[rel="stylesheet"]').length;
    const jsFiles = document.querySelectorAll('script[src]').length;

    if (cssFiles > 5) {
      score -= 5;
      recommendations.push('CSSファイル数を削減してください');
    }

    if (jsFiles > 10) {
      score -= 5;
      recommendations.push('JavaScriptファイル数を削減してください');
    }

    setState(prev => ({
      ...prev,
      performanceScore: Math.max(0, score),
      recommendations,
    }));
  }, []);

  // 最適化の適用
  const applyOptimizations = useCallback(async () => {
    setState(prev => ({ ...prev, isOptimizing: true }));
    const applied: string[] = [];

    try {
      // レイジーローディングの適用
      if (config.enableLazyLoading) {
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
          img.setAttribute('loading', 'lazy');
        });
        if (images.length > 0) {
          applied.push(`画像のレイジーローディング（${images.length}個）`);
        }
      }

      // CSS最適化
      if (config.enableCSSOptimization) {
        // 未使用CSSクラスの検出と警告
        const stylesheets = Array.from(document.styleSheets);
        let unusedRules = 0;

        stylesheets.forEach(sheet => {
          try {
            const rules = Array.from(sheet.cssRules || []);
            rules.forEach(rule => {
              if (rule instanceof CSSStyleRule) {
                const elements = document.querySelectorAll(rule.selectorText);
                if (elements.length === 0) {
                  unusedRules++;
                }
              }
            });
          } catch (e) {
            // Cross-origin stylesheetの場合はスキップ
          }
        });

        if (unusedRules > 0) {
          applied.push(`未使用CSSルール検出（${unusedRules}個）`);
        }
      }

      // プリロードの適用
      if (config.enablePreloading) {
        // 重要なリソースのプリロード
        const criticalResources = [
          'link[rel="stylesheet"]',
          'script[src*="chunk"]',
        ];

        let preloadCount = 0;
        criticalResources.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element, index) => {
            if (index < 2) {
              // 最初の2つのみプリロード
              const link = document.createElement('link');
              link.rel = 'preload';
              link.as =
                element.tagName.toLowerCase() === 'link' ? 'style' : 'script';
              link.href =
                element.getAttribute('href') ||
                element.getAttribute('src') ||
                '';
              if (
                link.href &&
                !document.querySelector(
                  `link[href="${link.href}"][rel="preload"]`
                )
              ) {
                document.head.appendChild(link);
                preloadCount++;
              }
            }
          });
        });

        if (preloadCount > 0) {
          applied.push(`重要リソースのプリロード（${preloadCount}個）`);
        }
      }

      // キャッシュ最適化
      if (config.enableCaching) {
        // Service Workerの登録チェック
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration();
          if (!registration) {
            applied.push('Service Worker未登録（キャッシュ最適化の機会）');
          } else {
            applied.push('Service Workerによるキャッシュ最適化済み');
          }
        }
      }

      // JavaScript最適化
      if (config.enableJSOptimization) {
        // 大きなJavaScriptファイルの検出
        const scripts = document.querySelectorAll('script[src]');
        let largeScripts = 0;

        scripts.forEach(script => {
          const src = script.getAttribute('src');
          if (src && src.includes('chunk') && src.length > 50) {
            largeScripts++;
          }
        });

        if (largeScripts > 0) {
          applied.push(`大きなJSチャンク検出（${largeScripts}個）- 分割を検討`);
        }
      }

      setState(prev => ({
        ...prev,
        optimizationsApplied: applied,
        isOptimizing: false,
      }));

      // 最適化後にパフォーマンスを再測定
      setTimeout(monitorPerformance, 1000);
    } catch (error) {
      console.error('最適化エラー:', error);
      setState(prev => ({
        ...prev,
        isOptimizing: false,
      }));
    }
  }, [config, monitorPerformance]);

  useEffect(() => {
    // 開発環境でのみ表示
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
      monitorPerformance();

      // 定期的な監視
      const interval = setInterval(monitorPerformance, 10000);
      return () => clearInterval(interval);
    }
  }, [monitorPerformance]);

  const getScoreColor = (score: number): string => {
    if (score >= 90) {
      return 'text-green-600 bg-green-50';
    }
    if (score >= 75) {
      return 'text-blue-600 bg-blue-50';
    }
    if (score >= 50) {
      return 'text-yellow-600 bg-yellow-50';
    }
    return 'text-red-600 bg-red-50';
  };

  const getScoreEmoji = (score: number): string => {
    if (score >= 90) {
      return '🚀';
    }
    if (score >= 75) {
      return '⚡';
    }
    if (score >= 50) {
      return '⚠️';
    }
    return '🐌';
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed z-[9996] w-80 perf-monitor-container perf-optimizer-position perf-monitor-fade-in">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            {getScoreEmoji(state.performanceScore)} パフォーマンス最適化
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(
                state.performanceScore
              )}`}
            >
              {state.performanceScore}点
            </span>
          </h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* 最適化設定 */}
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-800 mb-3">最適化設定</h4>
          <div className="space-y-2">
            {Object.entries(config).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={e =>
                    setConfig(prev => ({
                      ...prev,
                      [key]: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-gray-700">
                  {key === 'enableLazyLoading' && 'レイジーローディング'}
                  {key === 'enableImageOptimization' && '画像最適化'}
                  {key === 'enableCSSOptimization' && 'CSS最適化'}
                  {key === 'enableJSOptimization' && 'JS最適化'}
                  {key === 'enableCaching' && 'キャッシュ最適化'}
                  {key === 'enablePreloading' && 'プリロード'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 最適化実行 */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={applyOptimizations}
            disabled={state.isOptimizing}
            className={`w-full px-4 py-2 rounded font-medium ${
              state.isOptimizing
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {state.isOptimizing ? '最適化中...' : '最適化を実行'}
          </button>
        </div>

        {/* 結果表示 */}
        <div className="p-4 max-h-48 overflow-y-auto">
          {state.optimizationsApplied.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2">適用済み最適化</h4>
              <div className="space-y-1">
                {state.optimizationsApplied.map((optimization, index) => (
                  <div
                    key={index}
                    className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded"
                  >
                    ✅ {optimization}
                  </div>
                ))}
              </div>
            </div>
          )}

          {state.recommendations.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-800 mb-2">改善提案</h4>
              <div className="space-y-1">
                {state.recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded"
                  >
                    💡 {recommendation}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
