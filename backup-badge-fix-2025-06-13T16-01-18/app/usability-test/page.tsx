'use client';

import AccessibilityScenarioTest from '@/components/ui/AccessibilityScenarioTest';
import MobileScenarioTest from '@/components/ui/MobileScenarioTest';
import UsabilityTestRunner from '@/components/ui/UsabilityTestRunner';
import { useState } from 'react';

interface UsabilityTestResult {
  scenarioId: string;
  userType: string;
  startTime: Date;
  endTime?: Date;
  totalTime?: number;
  completedSteps: number;
  totalSteps: number;
  successRate: number;
  difficulties: string[];
  feedback: string;
  score: number;
}

interface AccessibilityTestResult {
  scenarioId: string;
  startTime: Date;
  endTime?: Date;
  totalTime?: number;
  completedSteps: number;
  totalSteps: number;
  keyboardOnlySuccess: boolean;
  screenReaderCompatible: boolean;
  wcagCompliance: number;
  difficulties: string[];
  feedback: string;
  score: number;
}

interface MobileTestResult {
  scenarioId: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  startTime: Date;
  endTime?: Date;
  totalTime?: number;
  completedSteps: number;
  totalSteps: number;
  touchFriendly: boolean;
  responsiveDesign: boolean;
  performanceScore: number;
  difficulties: string[];
  feedback: string;
  score: number;
}

export default function UsabilityTestPage() {
  const [testResults, setTestResults] = useState<UsabilityTestResult[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>('');

  const handleTestComplete = (result: UsabilityTestResult) => {
    setTestResults(prev => [...prev, result]);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) {
      return 'text-green-600';
    }
    if (score >= 60) {
      return 'text-yellow-600';
    }
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) {
      return '優秀';
    }
    if (score >= 60) {
      return '良好';
    }
    return '要改善';
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const averageScore =
    testResults.length > 0
      ? testResults.reduce((sum, result) => sum + result.score, 0) /
        testResults.length
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-wb-wood-50 to-wb-wood-100">
      {/* ヘッダー */}
      <div className="bg-white border-b border-wb-wood-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-wb-tool-inspect-500 to-wb-tool-inspect-600 p-3 rounded-xl shadow-lg">
                <span className="text-2xl text-white">👥</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-wb-wood-800">
                  ユーザビリティテスト
                </h1>
                <p className="text-wb-wood-600 mt-1">
                  実際の使用シナリオでUI/UXの操作性を評価
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-wb-wood-600">実行済みテスト</div>
                <div className="text-xl font-bold text-wb-wood-800">
                  {testResults.length}件
                </div>
              </div>
              {testResults.length > 0 && (
                <div className="text-right">
                  <div className="text-sm text-wb-wood-600">平均スコア</div>
                  <div
                    className={`text-xl font-bold ${getScoreColor(
                      averageScore
                    )}`}
                  >
                    {averageScore.toFixed(1)}点
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* メインテストエリア */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-wb-wood-200 p-6">
              <h2 className="text-lg font-semibold text-wb-wood-800 mb-4">
                📋 ユーザビリティテスト実行
              </h2>

              {/* シナリオ選択 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-wb-wood-700 mb-2">
                  テストシナリオを選択
                </label>
                <select
                  value={selectedScenario}
                  onChange={e => setSelectedScenario(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wb-tool-inspect-500 focus:border-transparent"
                >
                  <option value="">シナリオを選択してください</option>
                  <option value="password-generation-beginner">
                    🔰 初回ユーザーのパスワード生成
                  </option>
                  <option value="csv-generation-accessibility">
                    ♿ 視覚障害ユーザーのCSV生成
                  </option>
                  <option value="mobile-data-generation">
                    📱 モバイルでの大量データ生成
                  </option>
                </select>
              </div>

              {/* テストランナー */}
              {selectedScenario === 'csv-generation-accessibility' ? (
                <AccessibilityScenarioTest
                  onTestComplete={(result: AccessibilityTestResult) => {
                    const usabilityResult = {
                      scenarioId: result.scenarioId,
                      userType: 'accessibility',
                      startTime: result.startTime,
                      endTime: result.endTime,
                      totalTime: result.totalTime,
                      completedSteps: result.completedSteps,
                      totalSteps: result.totalSteps,
                      successRate:
                        (result.completedSteps / result.totalSteps) * 100,
                      difficulties: result.difficulties,
                      feedback: result.feedback,
                      score: result.score,
                    };
                    handleTestComplete(usabilityResult);
                  }}
                />
              ) : selectedScenario === 'mobile-data-generation' ? (
                <MobileScenarioTest
                  onTestComplete={(result: MobileTestResult) => {
                    const usabilityResult = {
                      scenarioId: result.scenarioId,
                      userType: 'intermediate',
                      startTime: result.startTime,
                      endTime: result.endTime,
                      totalTime: result.totalTime,
                      completedSteps: result.completedSteps,
                      totalSteps: result.totalSteps,
                      successRate:
                        (result.completedSteps / result.totalSteps) * 100,
                      difficulties: result.difficulties,
                      feedback: result.feedback,
                      score: result.score,
                    };
                    handleTestComplete(usabilityResult);
                  }}
                />
              ) : (
                <UsabilityTestRunner
                  scenarioId={selectedScenario}
                  onTestComplete={handleTestComplete}
                />
              )}
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* テスト概要 */}
            <div className="bg-white rounded-xl shadow-sm border border-wb-wood-200 p-6">
              <h3 className="text-lg font-semibold text-wb-wood-800 mb-4">
                📊 テスト概要
              </h3>

              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">
                    🔰 初心者シナリオ
                  </h4>
                  <p className="text-sm text-blue-700">
                    ITに詳しくないユーザーの基本操作を評価
                  </p>
                  <div className="text-xs text-blue-600 mt-1">
                    目標: 直感的な操作性
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-800 mb-2">
                    ♿ アクセシビリティ
                  </h4>
                  <p className="text-sm text-purple-700">
                    支援技術を使用するユーザーの操作性を評価
                  </p>
                  <div className="text-xs text-purple-600 mt-1">
                    目標: WCAG 2.1 AA準拠
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">
                    📱 モバイル対応
                  </h4>
                  <p className="text-sm text-green-700">
                    モバイルデバイスでの操作性を評価
                  </p>
                  <div className="text-xs text-green-600 mt-1">
                    目標: レスポンシブ設計
                  </div>
                </div>
              </div>
            </div>

            {/* 評価基準 */}
            <div className="bg-white rounded-xl shadow-sm border border-wb-wood-200 p-6">
              <h3 className="text-lg font-semibold text-wb-wood-800 mb-4">
                📏 評価基準
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-wb-wood-700">完了時間</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    30%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-wb-wood-700">成功率</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    40%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-wb-wood-700">困難度</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    20%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-wb-wood-700">ユーザー体験</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    10%
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-wb-wood-700 mb-2">スコア判定</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>80-100点: 優秀</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>60-79点: 良好</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>0-59点: 要改善</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 最新結果 */}
            {testResults.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-wb-wood-200 p-6">
                <h3 className="text-lg font-semibold text-wb-wood-800 mb-4">
                  📈 最新結果
                </h3>

                <div className="space-y-3">
                  {testResults
                    .slice(-3)
                    .reverse()
                    .map((result, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium text-wb-wood-700">
                            {result.scenarioId.includes('password')
                              ? '🔰 パスワード生成'
                              : result.scenarioId.includes('accessibility')
                              ? '♿ アクセシビリティ'
                              : '📱 モバイル対応'}
                          </div>
                          <div
                            className={`text-sm font-bold ${getScoreColor(
                              result.score
                            )}`}
                          >
                            {result.score}点
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>
                            完了: {result.completedSteps}/{result.totalSteps}
                            ステップ
                          </div>
                          <div>
                            時間:{' '}
                            {result.totalTime
                              ? formatTime(result.totalTime)
                              : '-'}
                          </div>
                          <div>困難: {result.difficulties.length}件</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* テスト結果履歴 */}
        {testResults.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-sm border border-wb-wood-200 p-6">
              <h2 className="text-lg font-semibold text-wb-wood-800 mb-6">
                📋 テスト結果履歴
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-wb-wood-700">
                        シナリオ
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-wb-wood-700">
                        ユーザータイプ
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-wb-wood-700">
                        スコア
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-wb-wood-700">
                        完了率
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-wb-wood-700">
                        時間
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-wb-wood-700">
                        困難
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-wb-wood-700">
                        実行日時
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {testResults.map((result, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span>
                              {result.scenarioId.includes('password')
                                ? '🔰'
                                : result.scenarioId.includes('accessibility')
                                ? '♿'
                                : '📱'}
                            </span>
                            <span className="text-wb-wood-700">
                              {result.scenarioId.includes('password')
                                ? 'パスワード生成'
                                : result.scenarioId.includes('accessibility')
                                ? 'CSV生成'
                                : 'モバイル対応'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-wb-wood-600">
                          {result.userType === 'beginner'
                            ? '初心者'
                            : result.userType === 'accessibility'
                            ? 'アクセシビリティ'
                            : result.userType === 'intermediate'
                            ? '中級者'
                            : result.userType}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`font-bold ${getScoreColor(
                                result.score
                              )}`}
                            >
                              {result.score}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                result.score >= 80
                                  ? 'bg-green-100 text-green-700'
                                  : result.score >= 60
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {getScoreLabel(result.score)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-wb-wood-600">
                          {result.successRate.toFixed(1)}%
                        </td>
                        <td className="py-3 px-4 font-mono text-wb-wood-600">
                          {result.totalTime
                            ? formatTime(result.totalTime)
                            : '-'}
                        </td>
                        <td className="py-3 px-4 text-wb-wood-600">
                          {result.difficulties.length}件
                        </td>
                        <td className="py-3 px-4 text-wb-wood-600">
                          {result.startTime.toLocaleString('ja-JP')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
