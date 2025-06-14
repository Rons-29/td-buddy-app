'use client';

import { useEffect, useState } from 'react';

interface DevicePreset {
  name: string;
  width: number;
  height: number;
  icon: string;
  category: 'mobile' | 'tablet' | 'desktop';
}

interface ResponsiveTestResult {
  device: DevicePreset;
  timestamp: Date;
  issues: string[];
  score: number;
  screenshot?: string;
}

const DEVICE_PRESETS: DevicePreset[] = [
  // Mobile
  {
    name: 'iPhone SE',
    width: 375,
    height: 667,
    icon: '📱',
    category: 'mobile',
  },
  {
    name: 'iPhone 12',
    width: 390,
    height: 844,
    icon: '📱',
    category: 'mobile',
  },
  {
    name: 'iPhone 14 Pro Max',
    width: 430,
    height: 932,
    icon: '📱',
    category: 'mobile',
  },
  {
    name: 'Galaxy S21',
    width: 360,
    height: 800,
    icon: '📱',
    category: 'mobile',
  },

  // Tablet
  {
    name: 'iPad Mini',
    width: 768,
    height: 1024,
    icon: '📱',
    category: 'tablet',
  },
  {
    name: 'iPad Pro',
    width: 1024,
    height: 1366,
    icon: '📱',
    category: 'tablet',
  },
  {
    name: 'Galaxy Tab',
    width: 800,
    height: 1280,
    icon: '📱',
    category: 'tablet',
  },

  // Desktop
  { name: 'Laptop', width: 1366, height: 768, icon: '💻', category: 'desktop' },
  {
    name: 'Desktop HD',
    width: 1920,
    height: 1080,
    icon: '🖥️',
    category: 'desktop',
  },
  {
    name: 'Desktop 4K',
    width: 2560,
    height: 1440,
    icon: '🖥️',
    category: 'desktop',
  },
];

interface ResponsiveTestRunnerProps {
  autoTest?: boolean;
  showPreview?: boolean;
}

export function ResponsiveTestRunner({
  autoTest = false,
  showPreview = true,
}: ResponsiveTestRunnerProps) {
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(
    DEVICE_PRESETS[0]
  );
  const [testResults, setTestResults] = useState<ResponsiveTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const runResponsiveTest = async (device: DevicePreset) => {
    setIsRunning(true);

    try {
      // レスポンシブテストの実行
      const issues: string[] = [];
      let score = 100;

      // ビューポートサイズをチェック
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      // 横スクロールチェック
      if (document.body.scrollWidth > device.width) {
        issues.push('横スクロールが発生しています');
        score -= 20;
      }

      // フォントサイズチェック（モバイル）
      if (device.category === 'mobile') {
        const smallTexts = document.querySelectorAll('*');
        let smallTextCount = 0;
        smallTexts.forEach(el => {
          const style = window.getComputedStyle(el);
          const fontSize = parseFloat(style.fontSize);
          if (fontSize < 14) {
            smallTextCount++;
          }
        });
        if (smallTextCount > 10) {
          issues.push('小さすぎるテキストが多数あります (14px未満)');
          score -= 15;
        }
      }

      // タッチターゲットサイズチェック（モバイル・タブレット）
      if (device.category !== 'desktop') {
        const buttons = document.querySelectorAll(
          'button, a, input[type="button"]'
        );
        let smallButtonCount = 0;
        buttons.forEach(btn => {
          const rect = btn.getBoundingClientRect();
          if (rect.width < 44 || rect.height < 44) {
            smallButtonCount++;
          }
        });
        if (smallButtonCount > 0) {
          issues.push(`タッチターゲットが小さすぎます (${smallButtonCount}個)`);
          score -= 10;
        }
      }

      // 画像の最適化チェック
      const images = document.querySelectorAll('img');
      let unoptimizedImages = 0;
      images.forEach(img => {
        if (!img.srcset && !img.sizes) {
          unoptimizedImages++;
        }
      });
      if (unoptimizedImages > 0) {
        issues.push(`レスポンシブ画像未対応 (${unoptimizedImages}個)`);
        score -= 10;
      }

      // メディアクエリの使用チェック
      const stylesheets = Array.from(document.styleSheets);
      let hasMediaQueries = false;
      try {
        stylesheets.forEach(sheet => {
          if (sheet.cssRules) {
            Array.from(sheet.cssRules).forEach(rule => {
              if (rule.type === CSSRule.MEDIA_RULE) {
                hasMediaQueries = true;
              }
            });
          }
        });
      } catch (e) {
        // CORS制限でアクセスできない場合は無視
      }

      if (!hasMediaQueries) {
        issues.push('メディアクエリが検出されませんでした');
        score -= 15;
      }

      const result: ResponsiveTestResult = {
        device,
        timestamp: new Date(),
        issues,
        score: Math.max(0, score),
      };

      setTestResults(prev => [result, ...prev]);
    } catch (error) {
      console.error('レスポンシブテストエラー:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runAllDeviceTests = async () => {
    setIsRunning(true);
    for (const device of DEVICE_PRESETS) {
      await runResponsiveTest(device);
      // 少し待機
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setIsRunning(false);
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
      return '✅';
    }
    if (score >= 70) {
      return '⚠️';
    }
    if (score >= 50) {
      return '🔶';
    }
    return '❌';
  };

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
    if (!previewMode) {
      // プレビューモード開始
      document.body.style.width = `${selectedDevice.width}px`;
      document.body.style.height = `${selectedDevice.height}px`;
      document.body.style.overflow = 'hidden';
      document.body.style.border = '2px solid #333';
      document.body.style.margin = '20px auto';
    } else {
      // プレビューモード終了
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
      document.body.style.border = '';
      document.body.style.margin = '';
    }
  };

  useEffect(() => {
    if (autoTest) {
      runAllDeviceTests();
    }
  }, [autoTest]);

  return (
    <div className="wb-responsive-test bg-white border border-wb-wood-200 rounded-lg p-6 shadow-sm">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">📱</span>
          <div>
            <h3 className="text-lg font-semibold text-wb-wood-800">
              レスポンシブデザインテスト
            </h3>
            <p className="text-sm text-wb-wood-600">
              デバイス別表示・操作性チェック
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={togglePreviewMode}
            className={`px-4 py-2 rounded-lg transition-colors ${
              previewMode
                ? 'bg-wb-tool-cut-500 text-white hover:bg-wb-tool-cut-600'
                : 'bg-wb-tool-measure-500 text-white hover:bg-wb-tool-measure-600'
            }`}
          >
            {previewMode ? '🔄 通常表示' : '👁️ プレビュー'}
          </button>
          <button
            onClick={runAllDeviceTests}
            disabled={isRunning}
            className="px-4 py-2 bg-wb-tool-inspect-500 text-white rounded-lg hover:bg-wb-tool-inspect-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? '🔄 テスト中...' : '▶️ 全デバイステスト'}
          </button>
        </div>
      </div>

      {/* デバイス選択 */}
      <div className="mb-6">
        <h4 className="font-semibold text-wb-wood-700 mb-3">📱 デバイス選択</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {DEVICE_PRESETS.map(device => (
            <button
              key={device.name}
              onClick={() => setSelectedDevice(device)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedDevice.name === device.name
                  ? 'border-wb-tool-inspect-500 bg-wb-tool-inspect-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-lg mb-1">{device.icon}</div>
              <div className="text-xs font-medium">{device.name}</div>
              <div className="text-xs text-gray-500">
                {device.width}×{device.height}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 個別テスト */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-wb-wood-700">
            🎯 選択デバイステスト
          </h4>
          <button
            onClick={() => runResponsiveTest(selectedDevice)}
            disabled={isRunning}
            className="px-3 py-1 bg-wb-tool-measure-500 text-white text-sm rounded hover:bg-wb-tool-measure-600 disabled:opacity-50"
          >
            テスト実行
          </button>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{selectedDevice.icon}</span>
            <div>
              <div className="font-medium">{selectedDevice.name}</div>
              <div className="text-sm text-gray-600">
                {selectedDevice.width}×{selectedDevice.height}px (
                {selectedDevice.category})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* テスト結果 */}
      {testResults.length > 0 && (
        <div>
          <h4 className="font-semibold text-wb-wood-700 mb-3">📊 テスト結果</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {testResults.map((result, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{result.device.icon}</span>
                    <div>
                      <div className="font-medium">{result.device.name}</div>
                      <div className="text-xs text-gray-500">
                        {result.timestamp.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {getScoreIcon(result.score)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(
                        result.score
                      )}`}
                    >
                      {result.score}点
                    </span>
                  </div>
                </div>

                {result.issues.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm font-medium text-red-700 mb-1">
                      検出された問題:
                    </div>
                    <ul className="text-sm text-red-600 space-y-1">
                      {result.issues.map((issue, issueIndex) => (
                        <li
                          key={issueIndex}
                          className="flex items-start space-x-1"
                        >
                          <span>•</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.issues.length === 0 && (
                  <div className="mt-2 text-sm text-green-600">
                    ✅ 問題は検出されませんでした
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* レスポンシブガイド */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">
          💡 レスポンシブデザインのベストプラクティス
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• モバイルファーストでデザイン</li>
          <li>• タッチターゲットは44px以上</li>
          <li>• フォントサイズは14px以上</li>
          <li>• 横スクロールを避ける</li>
          <li>• 画像はsrcset/sizesを使用</li>
          <li>• メディアクエリで段階的に調整</li>
        </ul>
      </div>
    </div>
  );
}

export default ResponsiveTestRunner;
