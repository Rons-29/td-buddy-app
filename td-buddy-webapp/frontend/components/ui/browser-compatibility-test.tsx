'use client';

import { useEffect, useState } from 'react';

interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  platform: string;
  mobile: boolean;
}

interface CompatibilityTest {
  name: string;
  description: string;
  test: () => boolean;
  critical: boolean;
}

interface TestResult {
  name: string;
  passed: boolean;
  critical: boolean;
  error?: string;
}

export function BrowserCompatibilityTest() {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // ブラウザ情報を取得
  useEffect(() => {
    const detectBrowser = (): BrowserInfo => {
      const ua = navigator.userAgent;
      const platform = navigator.platform;
      const mobile = /Mobi|Android/i.test(ua);

      let name = 'Unknown';
      let version = 'Unknown';
      let engine = 'Unknown';

      // Chrome
      if (ua.includes('Chrome') && !ua.includes('Edg')) {
        name = 'Chrome';
        const match = ua.match(/Chrome\/(\d+)/);
        version = match ? match[1] : 'Unknown';
        engine = 'Blink';
      }
      // Firefox
      else if (ua.includes('Firefox')) {
        name = 'Firefox';
        const match = ua.match(/Firefox\/(\d+)/);
        version = match ? match[1] : 'Unknown';
        engine = 'Gecko';
      }
      // Safari
      else if (ua.includes('Safari') && !ua.includes('Chrome')) {
        name = 'Safari';
        const match = ua.match(/Version\/(\d+)/);
        version = match ? match[1] : 'Unknown';
        engine = 'WebKit';
      }
      // Edge
      else if (ua.includes('Edg')) {
        name = 'Edge';
        const match = ua.match(/Edg\/(\d+)/);
        version = match ? match[1] : 'Unknown';
        engine = 'Blink';
      }

      return { name, version, engine, platform, mobile };
    };

    setBrowserInfo(detectBrowser());
  }, []);

  // 互換性テスト定義
  const compatibilityTests: CompatibilityTest[] = [
    // CSS機能テスト
    {
      name: 'CSS Grid Support',
      description: 'CSS Grid Layout対応',
      critical: true,
      test: () => {
        return CSS.supports('display', 'grid');
      },
    },
    {
      name: 'CSS Flexbox Support',
      description: 'CSS Flexbox対応',
      critical: true,
      test: () => {
        return CSS.supports('display', 'flex');
      },
    },
    {
      name: 'CSS Custom Properties',
      description: 'CSS変数（カスタムプロパティ）対応',
      critical: true,
      test: () => {
        return CSS.supports('color', 'var(--test)');
      },
    },
    {
      name: 'CSS Transform Support',
      description: 'CSS Transform対応',
      critical: false,
      test: () => {
        return CSS.supports('transform', 'translateX(10px)');
      },
    },
    {
      name: 'CSS Transition Support',
      description: 'CSS Transition対応',
      critical: false,
      test: () => {
        return CSS.supports('transition', 'all 0.3s ease');
      },
    },

    // JavaScript API テスト
    {
      name: 'Local Storage Support',
      description: 'ローカルストレージ対応',
      critical: true,
      test: () => {
        try {
          const test = 'wb-test';
          localStorage.setItem(test, test);
          localStorage.removeItem(test);
          return true;
        } catch {
          return false;
        }
      },
    },
    {
      name: 'Fetch API Support',
      description: 'Fetch API対応',
      critical: true,
      test: () => {
        return typeof fetch !== 'undefined';
      },
    },
    {
      name: 'Promise Support',
      description: 'Promise対応',
      critical: true,
      test: () => {
        return typeof Promise !== 'undefined';
      },
    },
    {
      name: 'Arrow Functions Support',
      description: 'アロー関数対応',
      critical: true,
      test: () => {
        try {
          eval('(() => {})');
          return true;
        } catch {
          return false;
        }
      },
    },
    {
      name: 'Template Literals Support',
      description: 'テンプレートリテラル対応',
      critical: false,
      test: () => {
        try {
          eval('`test`');
          return true;
        } catch {
          return false;
        }
      },
    },

    // モバイル機能テスト
    {
      name: 'Touch Events Support',
      description: 'タッチイベント対応',
      critical: false,
      test: () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      },
    },
    {
      name: 'Viewport Meta Support',
      description: 'ビューポートメタタグ対応',
      critical: true,
      test: () => {
        const viewport = document.querySelector('meta[name="viewport"]');
        return viewport !== null;
      },
    },

    // ワークベンチ固有機能テスト
    {
      name: 'CSS Workbench Variables',
      description: 'ワークベンチCSS変数の読み込み',
      critical: true,
      test: () => {
        const testElement = document.createElement('div');
        testElement.style.color = 'var(--wb-wood-800)';
        document.body.appendChild(testElement);
        const computedStyle = getComputedStyle(testElement);
        const color = computedStyle.color;
        document.body.removeChild(testElement);
        return color !== '' && color !== 'var(--wb-wood-800)';
      },
    },
    {
      name: 'Workbench Font Loading',
      description: 'ワークベンチフォントの読み込み',
      critical: false,
      test: () => {
        const testElement = document.createElement('div');
        testElement.style.fontFamily = 'var(--font-inter)';
        document.body.appendChild(testElement);
        const computedStyle = getComputedStyle(testElement);
        const fontFamily = computedStyle.fontFamily;
        document.body.removeChild(testElement);
        return (
          fontFamily.includes('Inter') || fontFamily !== 'var(--font-inter)'
        );
      },
    },

    // パフォーマンス関連テスト
    {
      name: 'Intersection Observer Support',
      description: 'Intersection Observer対応（遅延読み込み用）',
      critical: false,
      test: () => {
        return 'IntersectionObserver' in window;
      },
    },
    {
      name: 'ResizeObserver Support',
      description: 'ResizeObserver対応（レスポンシブ用）',
      critical: false,
      test: () => {
        return 'ResizeObserver' in window;
      },
    },
  ];

  // テスト実行
  const runTests = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    for (const test of compatibilityTests) {
      try {
        const passed = test.test();
        results.push({
          name: test.name,
          passed,
          critical: test.critical,
        });
      } catch (error) {
        results.push({
          name: test.name,
          passed: false,
          critical: test.critical,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      // UIの更新のため少し待機
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    setTestResults(results);
    setIsRunning(false);
  };

  // 自動テスト実行
  useEffect(() => {
    if (browserInfo) {
      runTests();
    }
  }, [browserInfo]);

  const criticalFailures = testResults.filter(r => r.critical && !r.passed);
  const totalTests = testResults.length;
  const passedTests = testResults.filter(r => r.passed).length;
  const compatibilityScore =
    totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  const getCompatibilityLevel = (score: number) => {
    if (score >= 90)
      return { level: '優秀', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 80)
      return { level: '良好', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 70)
      return { level: '普通', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: '要改善', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const compatibility = getCompatibilityLevel(compatibilityScore);

  if (!browserInfo) {
    return (
      <div className="wb-card-mobile">
        <div className="text-center">
          <div className="animate-spin text-2xl mb-2">🔄</div>
          <p>ブラウザ情報を取得中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ブラウザ情報 */}
      <div className="wb-card-mobile">
        <h3 className="font-semibold text-wb-wood-800 mb-3 flex items-center">
          <span className="text-xl mr-2">🌐</span>
          ブラウザ情報
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-wb-wood-600">ブラウザ:</span>
            <div className="font-medium">
              {browserInfo.name} {browserInfo.version}
            </div>
          </div>
          <div>
            <span className="text-wb-wood-600">エンジン:</span>
            <div className="font-medium">{browserInfo.engine}</div>
          </div>
          <div>
            <span className="text-wb-wood-600">プラットフォーム:</span>
            <div className="font-medium">{browserInfo.platform}</div>
          </div>
          <div>
            <span className="text-wb-wood-600">デバイス:</span>
            <div className="font-medium">
              {browserInfo.mobile ? 'モバイル' : 'デスクトップ'}
            </div>
          </div>
        </div>
      </div>

      {/* 互換性スコア */}
      <div className={`wb-card-mobile ${compatibility.bg}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-wb-wood-800 flex items-center">
            <span className="text-xl mr-2">📊</span>
            互換性スコア
          </h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-wb-wood-600 hover:text-wb-wood-800"
          >
            {showDetails ? '詳細を隠す' : '詳細を表示'}
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className={`text-3xl font-bold ${compatibility.color}`}>
            {compatibilityScore}%
          </div>
          <div>
            <div className={`font-semibold ${compatibility.color}`}>
              {compatibility.level}
            </div>
            <div className="text-sm text-wb-wood-600">
              {passedTests}/{totalTests} テスト通過
            </div>
          </div>
        </div>

        {criticalFailures.length > 0 && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
            <div className="font-medium text-red-800 mb-1">
              ⚠️ 重要な機能で問題が検出されました
            </div>
            <div className="text-sm text-red-600">
              {criticalFailures.map(f => f.name).join(', ')}
            </div>
          </div>
        )}
      </div>

      {/* テスト詳細 */}
      {showDetails && (
        <div className="wb-card-mobile">
          <h3 className="font-semibold text-wb-wood-800 mb-3 flex items-center">
            <span className="text-xl mr-2">🧪</span>
            テスト詳細
            {isRunning && <span className="ml-2 animate-spin">🔄</span>}
          </h3>

          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 rounded ${
                  result.passed
                    ? 'bg-green-50 border border-green-200'
                    : result.critical
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-yellow-50 border border-yellow-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {result.passed ? '✅' : result.critical ? '❌' : '⚠️'}
                  </span>
                  <div>
                    <div className="font-medium text-sm">{result.name}</div>
                    {result.critical && (
                      <div className="text-xs text-red-600">重要</div>
                    )}
                  </div>
                </div>
                <div
                  className={`text-sm font-medium ${
                    result.passed ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {result.passed ? 'OK' : 'NG'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 推奨事項 */}
      <div className="wb-card-mobile">
        <h3 className="font-semibold text-wb-wood-800 mb-3 flex items-center">
          <span className="text-xl mr-2">💡</span>
          推奨事項
        </h3>

        <div className="space-y-2 text-sm">
          {browserInfo.name === 'Chrome' && (
            <div className="flex items-start space-x-2">
              <span>✅</span>
              <span>
                Chromeは最新の機能に対応しており、最適な体験を提供できます。
              </span>
            </div>
          )}

          {browserInfo.name === 'Firefox' && (
            <div className="flex items-start space-x-2">
              <span>✅</span>
              <span>
                Firefoxは優れたプライバシー機能とWeb標準対応を提供します。
              </span>
            </div>
          )}

          {browserInfo.name === 'Safari' && (
            <div className="flex items-start space-x-2">
              <span>⚠️</span>
              <span>
                Safariでは一部の最新機能が制限される場合があります。最新版への更新を推奨します。
              </span>
            </div>
          )}

          {browserInfo.name === 'Edge' && (
            <div className="flex items-start space-x-2">
              <span>✅</span>
              <span>
                Microsoft Edgeは優れたパフォーマンスとセキュリティを提供します。
              </span>
            </div>
          )}

          {browserInfo.mobile && (
            <div className="flex items-start space-x-2">
              <span>📱</span>
              <span>
                モバイルデバイスでは、タッチ操作に最適化されたインターフェースを提供します。
              </span>
            </div>
          )}

          {criticalFailures.length === 0 && (
            <div className="flex items-start space-x-2">
              <span>🎉</span>
              <span>
                すべての重要な機能が正常に動作します。Quality
                Workbenchを安心してご利用ください！
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 再テストボタン */}
      <div className="text-center">
        <button
          onClick={runTests}
          disabled={isRunning}
          className="wb-button-mobile bg-wb-wood-600 text-white hover:bg-wb-wood-700 disabled:opacity-50"
        >
          {isRunning ? '🔄 テスト実行中...' : '🔄 再テスト実行'}
        </button>
      </div>
    </div>
  );
}

// 開発者向けブラウザ互換性情報コンポーネント
export function BrowserCompatibilityInfo() {
  return (
    <div className="wb-card-mobile">
      <h3 className="font-semibold text-wb-wood-800 mb-3 flex items-center">
        <span className="text-xl mr-2">🛠️</span>
        開発者向け情報
      </h3>

      <div className="space-y-3 text-sm">
        <div>
          <h4 className="font-medium text-wb-wood-700 mb-1">対応ブラウザ</h4>
          <ul className="space-y-1 text-wb-wood-600">
            <li>• Chrome 90+ (推奨)</li>
            <li>• Firefox 88+ (推奨)</li>
            <li>• Safari 14+ (基本対応)</li>
            <li>• Edge 90+ (推奨)</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-wb-wood-700 mb-1">必須機能</h4>
          <ul className="space-y-1 text-wb-wood-600">
            <li>• CSS Grid Layout</li>
            <li>• CSS Custom Properties</li>
            <li>• ES6+ JavaScript</li>
            <li>• Fetch API</li>
            <li>• Local Storage</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-wb-wood-700 mb-1">推奨機能</h4>
          <ul className="space-y-1 text-wb-wood-600">
            <li>• Intersection Observer (遅延読み込み)</li>
            <li>• ResizeObserver (レスポンシブ)</li>
            <li>• Touch Events (モバイル)</li>
            <li>• CSS Transforms & Transitions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
