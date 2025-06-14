'use client';

import { useEffect, useState } from 'react';

interface AccessibilityTestResult {
  violations: any[];
  passes: any[];
  incomplete: any[];
  inapplicable: any[];
  timestamp: Date;
  url: string;
}

interface AccessibilityTestRunnerProps {
  autoRun?: boolean;
  showResults?: boolean;
  onTestComplete?: (results: AccessibilityTestResult) => void;
}

export function AccessibilityTestRunner({
  autoRun = false,
  showResults = true,
  onTestComplete,
}: AccessibilityTestRunnerProps) {
  const [testResults, setTestResults] =
    useState<AccessibilityTestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAccessibilityTest = async () => {
    setIsRunning(true);
    setError(null);

    try {
      // 動的にaxe-coreをインポート
      const axe = await import('axe-core');

      // テスト実行（設定は簡略化）
      const results = await (axe as any).run(document.body, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21aa'],
        },
      });

      const testResult: AccessibilityTestResult = {
        violations: results.violations,
        passes: results.passes,
        incomplete: results.incomplete,
        inapplicable: results.inapplicable,
        timestamp: new Date(),
        url: window.location.href,
      };

      setTestResults(testResult);
      onTestComplete?.(testResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'テスト実行中にエラーが発生しました'
      );
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (autoRun) {
      // ページ読み込み完了後にテスト実行
      const timer = setTimeout(() => {
        runAccessibilityTest();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoRun]);

  const getSeverityColor = (impact: string) => {
    switch (impact) {
      case 'critical':
        return 'text-red-700 bg-red-100';
      case 'serious':
        return 'text-orange-700 bg-orange-100';
      case 'moderate':
        return 'text-yellow-700 bg-yellow-100';
      case 'minor':
        return 'text-blue-700 bg-blue-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getSeverityIcon = (impact: string) => {
    switch (impact) {
      case 'critical':
        return '🚨';
      case 'serious':
        return '⚠️';
      case 'moderate':
        return '⚡';
      case 'minor':
        return 'ℹ️';
      default:
        return '📋';
    }
  };

  if (!showResults && !isRunning) {
    return null;
  }

  return (
    <div className="wb-accessibility-test bg-white border border-wb-wood-200 rounded-lg p-6 shadow-sm">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🔍</span>
          <div>
            <h3 className="text-lg font-semibold text-wb-wood-800">
              アクセシビリティテスト
            </h3>
            <p className="text-sm text-wb-wood-600">WCAG 2.1 AA準拠チェック</p>
          </div>
        </div>

        <button
          onClick={runAccessibilityTest}
          disabled={isRunning}
          className="px-4 py-2 bg-wb-tool-inspect-500 text-white rounded-lg hover:bg-wb-tool-inspect-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? '🔄 テスト中...' : '▶️ テスト実行'}
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
            <span className="text-blue-700">
              アクセシビリティテスト実行中...
            </span>
          </div>
        </div>
      )}

      {/* テスト結果 */}
      {testResults && (
        <div className="space-y-6">
          {/* サマリー */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-700">
                {testResults.violations.length}
              </div>
              <div className="text-sm text-red-600">違反</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-700">
                {testResults.passes.length}
              </div>
              <div className="text-sm text-green-600">合格</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-700">
                {testResults.incomplete.length}
              </div>
              <div className="text-sm text-yellow-600">要確認</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-700">
                {testResults.inapplicable.length}
              </div>
              <div className="text-sm text-gray-600">対象外</div>
            </div>
          </div>

          {/* 違反詳細 */}
          {testResults.violations.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-red-700 mb-3">
                🚨 アクセシビリティ違反 ({testResults.violations.length}件)
              </h4>
              <div className="space-y-3">
                {testResults.violations.map((violation, index) => (
                  <div
                    key={index}
                    className="border border-red-200 rounded-lg p-4 bg-red-50"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">
                        {getSeverityIcon(violation.impact)}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h5 className="font-semibold text-red-800">
                            {violation.help}
                          </h5>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(
                              violation.impact
                            )}`}
                          >
                            {violation.impact}
                          </span>
                        </div>
                        <p className="text-red-700 text-sm mb-2">
                          {violation.description}
                        </p>
                        <div className="text-xs text-red-600">
                          <strong>影響要素:</strong> {violation.nodes.length}個
                        </div>
                        {violation.helpUrl && (
                          <a
                            href={violation.helpUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xs underline"
                          >
                            詳細情報 →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 成功メッセージ */}
          {testResults.violations.length === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-green-500 text-xl">✅</span>
                <div>
                  <h4 className="font-semibold text-green-800">
                    アクセシビリティテスト合格！
                  </h4>
                  <p className="text-green-700 text-sm">
                    WCAG 2.1 AA基準の違反は検出されませんでした。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* テスト情報 */}
          <div className="text-xs text-gray-500 border-t pt-3">
            <div>テスト実行時刻: {testResults.timestamp.toLocaleString()}</div>
            <div>対象URL: {testResults.url}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccessibilityTestRunner;
