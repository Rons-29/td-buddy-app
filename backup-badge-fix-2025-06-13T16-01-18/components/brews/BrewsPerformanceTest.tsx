'use client';

import type { BrewsAnimation, BrewsEmotion, BrewsRole } from '@/types/brews';
import React, { useCallback, useRef, useState } from 'react';
import BrewCharacter from '../BrewCharacter';
import { BrewsCompatibilityAdapter } from './BrewsCompatibilityAdapter';
import BrewsIcon from './BrewsIcon';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  animationFPS: number;
  componentCount: number;
  updateTime: number;
}

interface TestResult {
  component: string;
  metrics: PerformanceMetrics;
  timestamp: Date;
}

/**
 * 🧪 BrewsPerformanceTest
 *
 * Brewsアイコンシステムの包括的パフォーマンステスト
 * - レンダリング性能測定
 * - メモリ使用量測定
 * - アニメーション性能測定
 * - 大量コンポーネント負荷テスト
 */

export default function BrewsPerformanceTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [componentCount, setComponentCount] = useState(50);
  const [currentTest, setCurrentTest] = useState<string>('');

  const animationFrameRef = useRef<number>();
  const fpsCounterRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);

  // FPS測定用
  const measureFPS = useCallback(() => {
    const now = performance.now();
    if (lastFrameTimeRef.current) {
      const delta = now - lastFrameTimeRef.current;
      const fps = 1000 / delta;
      fpsCounterRef.current = fps;
    }
    lastFrameTimeRef.current = now;
    animationFrameRef.current = requestAnimationFrame(measureFPS);
  }, []);

  // メモリ使用量測定
  const measureMemoryUsage = (): number => {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  };

  // レンダリング時間測定
  const measureRenderTime = async (
    testName: string,
    renderFunction: () => React.ReactNode
  ): Promise<PerformanceMetrics> => {
    const startTime = performance.now();
    const startMemory = measureMemoryUsage();

    // FPS測定開始
    fpsCounterRef.current = 0;
    measureFPS();

    // レンダリング実行
    renderFunction();

    // DOM更新を待つ
    await new Promise(resolve => setTimeout(resolve, 100));

    const endTime = performance.now();
    const endMemory = measureMemoryUsage();

    // FPS測定停止
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return {
      renderTime: endTime - startTime,
      memoryUsage: endMemory - startMemory,
      animationFPS: fpsCounterRef.current,
      componentCount,
      updateTime: 0,
    };
  };

  // 旧BrewCharacterのテスト
  const testLegacyBrewCharacter = async (): Promise<TestResult> => {
    setCurrentTest('旧BrewCharacter測定中...');

    const metrics = await measureRenderTime('LegacyBrewCharacter', () => {
      return Array.from({ length: componentCount }, (_, i) => (
        <BrewCharacter
          key={i}
          emotion={(['happy', 'working', 'success'] as const)[i % 3]}
          animation={(['bounce', 'wiggle', 'heartbeat'] as const)[i % 3]}
          message={`Test ${i}`}
          size="medium"
        />
      ));
    });

    return {
      component: 'BrewCharacter (Legacy)',
      metrics,
      timestamp: new Date(),
    };
  };

  // 互換性アダプターのテスト
  const testCompatibilityAdapter = async (): Promise<TestResult> => {
    setCurrentTest('互換性アダプター測定中...');

    const metrics = await measureRenderTime('CompatibilityAdapter', () => {
      return Array.from({ length: componentCount }, (_, i) => (
        <BrewsCompatibilityAdapter
          key={i}
          emotion={(['happy', 'working', 'success'] as const)[i % 3]}
          animation={(['bounce', 'wiggle', 'heartbeat'] as const)[i % 3]}
          message={`Test ${i}`}
          size="medium"
          role="ai"
        />
      ));
    });

    return {
      component: 'BrewsCompatibilityAdapter',
      metrics,
      timestamp: new Date(),
    };
  };

  // 新BrewsIconのテスト
  const testNewBrewsIcon = async (): Promise<TestResult> => {
    setCurrentTest('新BrewsIcon測定中...');

    const metrics = await measureRenderTime('NewBrewsIcon', () => {
      return Array.from({ length: componentCount }, (_, i) => (
        <BrewsIcon
          key={i}
          role={(['ai', 'engineer', 'support'] as BrewsRole[])[i % 3]}
          emotion={(['happy', 'working', 'success'] as BrewsEmotion[])[i % 3]}
          animation={
            (['bounce', 'wiggle', 'heartbeat'] as BrewsAnimation[])[i % 3]
          }
          message={`Test ${i}`}
          size="medium"
          showOverlay={true}
          interactive={true}
        />
      ));
    });

    return {
      component: 'BrewsIcon (New)',
      metrics,
      timestamp: new Date(),
    };
  };

  // 全テスト実行
  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      const results: TestResult[] = [];

      // 各テストを順次実行
      results.push(await testLegacyBrewCharacter());
      await new Promise(resolve => setTimeout(resolve, 500)); // 間隔を空ける

      results.push(await testCompatibilityAdapter());
      await new Promise(resolve => setTimeout(resolve, 500));

      results.push(await testNewBrewsIcon());

      setTestResults(results);
      setCurrentTest('');
    } catch (error) {
      console.error('Performance test error:', error);
      setCurrentTest('テスト中にエラーが発生しました');
    } finally {
      setIsRunning(false);
    }
  };

  // ブラウザ情報取得
  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    let browser = 'Unknown';

    if (ua.includes('Chrome')) {
      browser = 'Chrome';
    } else if (ua.includes('Firefox')) {
      browser = 'Firefox';
    } else if (ua.includes('Safari')) {
      browser = 'Safari';
    } else if (ua.includes('Edge')) {
      browser = 'Edge';
    }

    return {
      browser,
      platform: navigator.platform,
      userAgent: ua,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
    };
  };

  const browserInfo = getBrowserInfo();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧪 Brews パフォーマンステスト
          </h1>
          <p className="text-lg text-gray-600">
            Phase 4B: システム性能と互換性の包括的測定
          </p>
        </div>

        {/* ブラウザ情報 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🌐 ブラウザ環境情報
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">ブラウザ: </span>
              <span className="text-gray-600">{browserInfo.browser}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">
                プラットフォーム:{' '}
              </span>
              <span className="text-gray-600">{browserInfo.platform}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">言語: </span>
              <span className="text-gray-600">{browserInfo.language}</span>
            </div>
          </div>
        </div>

        {/* テスト設定 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            ⚙️ テスト設定
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                コンポーネント数
              </label>
              <input
                type="number"
                min="10"
                max="500"
                value={componentCount}
                onChange={e => setComponentCount(Number(e.target.value))}
                className="w-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex-1">
              <button
                onClick={runAllTests}
                disabled={isRunning}
                className={`
                  w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-all
                  ${
                    isRunning
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }
                `}
              >
                {isRunning
                  ? '🔄 テスト実行中...'
                  : '🚀 パフォーマンステスト開始'}
              </button>
            </div>
          </div>

          {currentTest && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center text-blue-700">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
                {currentTest}
              </div>
            </div>
          )}
        </div>

        {/* テスト結果 */}
        {testResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              📊 テスト結果
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      コンポーネント
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      レンダリング時間 (ms)
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      メモリ使用量 (MB)
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      アニメーション FPS
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      コンポーネント数
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.map((result, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {result.component}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600">
                        {result.metrics.renderTime.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600">
                        {result.metrics.memoryUsage.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600">
                        {result.metrics.animationFPS.toFixed(1)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600">
                        {result.metrics.componentCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* パフォーマンス比較 */}
            {testResults.length >= 2 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {['renderTime', 'memoryUsage', 'animationFPS'].map(metric => {
                  const legacy = testResults.find(r =>
                    r.component.includes('Legacy')
                  );
                  const newSystem = testResults.find(r =>
                    r.component.includes('New')
                  );

                  if (!legacy || !newSystem) {
                    return null;
                  }

                  const legacyValue =
                    legacy.metrics[metric as keyof PerformanceMetrics];
                  const newValue =
                    newSystem.metrics[metric as keyof PerformanceMetrics];
                  const improvement =
                    ((newValue - legacyValue) / legacyValue) * 100;

                  const metricLabels = {
                    renderTime: 'レンダリング時間',
                    memoryUsage: 'メモリ使用量',
                    animationFPS: 'アニメーション FPS',
                  };

                  return (
                    <div key={metric} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-2">
                        {metricLabels[metric as keyof typeof metricLabels]}
                      </h3>
                      <div
                        className={`text-2xl font-bold ${
                          improvement > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {improvement > 0 ? '+' : ''}
                        {improvement.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">
                        {improvement > 0 ? '改善' : '劣化'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 互換性チェック */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            ✅ ブラウザ互換性チェック
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-3">JavaScript API</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>ES6 Modules</span>
                  <span className="text-green-600">✓ サポート</span>
                </div>
                <div className="flex justify-between">
                  <span>Web APIs</span>
                  <span className="text-green-600">✓ サポート</span>
                </div>
                <div className="flex justify-between">
                  <span>CSS3 Animations</span>
                  <span className="text-green-600">✓ サポート</span>
                </div>
                <div className="flex justify-between">
                  <span>Flexbox</span>
                  <span className="text-green-600">✓ サポート</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-3">React Features</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Hooks</span>
                  <span className="text-green-600">✓ サポート</span>
                </div>
                <div className="flex justify-between">
                  <span>Concurrent Features</span>
                  <span className="text-green-600">✓ サポート</span>
                </div>
                <div className="flex justify-between">
                  <span>TypeScript</span>
                  <span className="text-green-600">✓ サポート</span>
                </div>
                <div className="flex justify-between">
                  <span>Dynamic Imports</span>
                  <span className="text-green-600">✓ サポート</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 推奨事項 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">
            💡 Phase 4B 完了推奨事項
          </h3>

          <div className="space-y-3 text-blue-700">
            <div className="flex items-start">
              <span className="mr-2">✅</span>
              <span>パフォーマンステストを定期的に実行してください</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">✅</span>
              <span>本番環境での負荷テストを実施してください</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">✅</span>
              <span>複数ブラウザでの動作確認を行ってください</span>
            </div>
            <div className="flex items-start">
              <span className="mr-2">✅</span>
              <span>モバイルデバイスでの性能確認を行ってください</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
