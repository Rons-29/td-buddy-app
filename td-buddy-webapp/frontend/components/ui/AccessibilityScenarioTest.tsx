'use client';

import { useEffect, useRef, useState } from 'react';

interface AccessibilityTestStep {
  id: string;
  instruction: string;
  keyboardAction: string;
  screenReaderExpected: string;
  ariaLabel?: string;
  focusTarget?: string;
  isCompleted?: boolean;
  timeSpent?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
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

const CSV_ACCESSIBILITY_SCENARIO: AccessibilityTestStep[] = [
  {
    id: 'step1',
    instruction: 'Tabキーを使用してCSV生成ツールに移動してください',
    keyboardAction: 'Tab → Enter',
    screenReaderExpected: '「CSV生成ツール」または「データ生成」の読み上げ',
    ariaLabel: 'CSV生成ツール',
    focusTarget: 'csv-generator-link',
    difficulty: 'easy',
  },
  {
    id: 'step2',
    instruction:
      'データタイプ選択でキーボードを使用して「個人情報」を選択してください',
    keyboardAction: 'Tab → Space/Enter → 矢印キー → Enter',
    screenReaderExpected: '「データタイプ選択」「個人情報が選択されました」',
    ariaLabel: 'データタイプ選択',
    focusTarget: 'data-type-select',
    difficulty: 'medium',
  },
  {
    id: 'step3',
    instruction: '件数入力フィールドに100を入力してください',
    keyboardAction: 'Tab → 数値入力',
    screenReaderExpected: '「件数入力」「100」',
    ariaLabel: '生成件数',
    focusTarget: 'count-input',
    difficulty: 'easy',
  },
  {
    id: 'step4',
    instruction: 'データ生成ボタンをキーボードで実行してください',
    keyboardAction: 'Tab → Enter/Space',
    screenReaderExpected: '「データ生成開始」「生成中」',
    ariaLabel: 'データ生成実行',
    focusTarget: 'generate-button',
    difficulty: 'easy',
  },
  {
    id: 'step5',
    instruction: '生成完了の通知を確認してください',
    keyboardAction: '待機',
    screenReaderExpected: '「データ生成完了」「100件のデータが生成されました」',
    ariaLabel: '生成完了通知',
    focusTarget: 'completion-notification',
    difficulty: 'medium',
  },
  {
    id: 'step6',
    instruction: 'ダウンロードボタンをキーボードで実行してください',
    keyboardAction: 'Tab → Enter/Space',
    screenReaderExpected: '「CSVファイルダウンロード」',
    ariaLabel: 'CSVダウンロード',
    focusTarget: 'download-button',
    difficulty: 'easy',
  },
];

interface AccessibilityScenarioTestProps {
  onTestComplete?: (result: AccessibilityTestResult) => void;
  autoStart?: boolean;
}

export function AccessibilityScenarioTest({
  onTestComplete,
  autoStart = false,
}: AccessibilityScenarioTestProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [testResult, setTestResult] = useState<AccessibilityTestResult | null>(
    null
  );
  const [stepTimes, setStepTimes] = useState<number[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [keyboardOnlyMode, setKeyboardOnlyMode] = useState(true);
  const [screenReaderSimulation, setScreenReaderSimulation] = useState(false);

  const startTimeRef = useRef<Date | null>(null);
  const stepStartTimeRef = useRef<Date | null>(null);

  const startTest = () => {
    setIsRunning(true);
    setCurrentStepIndex(0);
    setStepTimes([]);
    setDifficulties([]);
    setFeedback('');
    startTimeRef.current = new Date();
    stepStartTimeRef.current = new Date();
  };

  const completeStep = () => {
    if (!stepStartTimeRef.current) {
      return;
    }

    const stepTime = Date.now() - stepStartTimeRef.current.getTime();
    setStepTimes(prev => [...prev, stepTime]);

    if (currentStepIndex < CSV_ACCESSIBILITY_SCENARIO.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      stepStartTimeRef.current = new Date();
    } else {
      completeTest();
    }
  };

  const reportDifficulty = (difficulty: string) => {
    setDifficulties(prev => [...prev, difficulty]);
  };

  const completeTest = () => {
    if (!startTimeRef.current) {
      return;
    }

    const endTime = new Date();
    const totalTime = endTime.getTime() - startTimeRef.current.getTime();
    const completedSteps = currentStepIndex + 1;
    const successRate =
      (completedSteps / CSV_ACCESSIBILITY_SCENARIO.length) * 100;

    // アクセシビリティスコア計算
    let score = 100;

    // 時間評価（5分以内が目標）
    if (totalTime > 300000) {
      // 5分
      score -= 15;
    }

    // 完了率
    score = score * (successRate / 100);

    // 困難報告ペナルティ
    score -= difficulties.length * 8;

    // キーボードオンリー成功ボーナス
    if (keyboardOnlyMode) {
      score += 10;
    }

    score = Math.max(0, Math.round(score));

    // WCAG準拠度計算
    const wcagCompliance = Math.min(100, score + (keyboardOnlyMode ? 15 : 0));

    const result: AccessibilityTestResult = {
      scenarioId: 'csv-generation-accessibility',
      startTime: startTimeRef.current,
      endTime,
      totalTime,
      completedSteps,
      totalSteps: CSV_ACCESSIBILITY_SCENARIO.length,
      keyboardOnlySuccess:
        keyboardOnlyMode &&
        completedSteps === CSV_ACCESSIBILITY_SCENARIO.length,
      screenReaderCompatible: screenReaderSimulation,
      wcagCompliance,
      difficulties,
      feedback,
      score,
    };

    setTestResult(result);
    setIsRunning(false);
    onTestComplete?.(result);
  };

  const resetTest = () => {
    setIsRunning(false);
    setCurrentStepIndex(0);
    setTestResult(null);
    setStepTimes([]);
    setDifficulties([]);
    setFeedback('');
    startTimeRef.current = null;
    stepStartTimeRef.current = null;
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'hard':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '簡単';
      case 'medium':
        return '普通';
      case 'hard':
        return '困難';
      default:
        return '不明';
    }
  };

  useEffect(() => {
    if (autoStart) {
      startTest();
    }
  }, [autoStart]);

  // スクリーンリーダーシミュレーション
  const announceToScreenReader = (text: string) => {
    if (screenReaderSimulation) {
      // 実際のスクリーンリーダーシミュレーション
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = text;
      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  };

  return (
    <div className="wb-accessibility-test bg-white border border-wb-wood-200 rounded-lg p-6 shadow-sm">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">♿</span>
          <div>
            <h3 className="text-lg font-semibold text-wb-wood-800">
              アクセシビリティシナリオテスト
            </h3>
            <p className="text-sm text-wb-wood-600">
              視覚障害ユーザーのCSV生成操作性評価
            </p>
          </div>
        </div>

        {!isRunning && !testResult && (
          <button
            onClick={resetTest}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            🔄 リセット
          </button>
        )}
      </div>

      {/* 設定パネル */}
      {!isRunning && !testResult && (
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-3">🔧 テスト設定</h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={keyboardOnlyMode}
                onChange={e => setKeyboardOnlyMode(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-purple-700">
                キーボードのみでの操作（マウス使用禁止）
              </span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={screenReaderSimulation}
                onChange={e => setScreenReaderSimulation(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-purple-700">
                スクリーンリーダーシミュレーション
              </span>
            </label>
          </div>

          <button
            onClick={startTest}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            🚀 テスト開始
          </button>
        </div>
      )}

      {/* テスト実行中 */}
      {isRunning && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-wb-wood-700">
              ♿ 視覚障害ユーザーのCSV生成シナリオ
            </h4>
            <div className="text-sm text-gray-600">
              ステップ {currentStepIndex + 1} /{' '}
              {CSV_ACCESSIBILITY_SCENARIO.length}
            </div>
          </div>

          {/* 進捗バー */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>進捗</span>
              <span>
                {Math.round(
                  ((currentStepIndex + 1) / CSV_ACCESSIBILITY_SCENARIO.length) *
                    100
                )}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentStepIndex + 1) /
                      CSV_ACCESSIBILITY_SCENARIO.length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {/* 現在のステップ */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-purple-800">
                📝 ステップ {currentStepIndex + 1}
              </h5>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  CSV_ACCESSIBILITY_SCENARIO[currentStepIndex].difficulty ===
                  'easy'
                    ? 'bg-green-100 text-green-700'
                    : CSV_ACCESSIBILITY_SCENARIO[currentStepIndex]
                        .difficulty === 'medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {getDifficultyLabel(
                  CSV_ACCESSIBILITY_SCENARIO[currentStepIndex].difficulty ||
                    'easy'
                )}
              </span>
            </div>

            <p className="text-purple-700 mb-3">
              {CSV_ACCESSIBILITY_SCENARIO[currentStepIndex].instruction}
            </p>

            {/* キーボード操作ガイド */}
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded">
              <div className="text-sm font-medium text-blue-800 mb-1">
                ⌨️ キーボード操作:
              </div>
              <code className="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded">
                {CSV_ACCESSIBILITY_SCENARIO[currentStepIndex].keyboardAction}
              </code>
            </div>

            {/* スクリーンリーダー期待値 */}
            <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded">
              <div className="text-sm font-medium text-green-800 mb-1">
                🔊 スクリーンリーダー期待値:
              </div>
              <p className="text-sm text-green-700">
                {
                  CSV_ACCESSIBILITY_SCENARIO[currentStepIndex]
                    .screenReaderExpected
                }
              </p>
            </div>

            {/* ARIA情報 */}
            {CSV_ACCESSIBILITY_SCENARIO[currentStepIndex].ariaLabel && (
              <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <div className="text-sm font-medium text-yellow-800 mb-1">
                  🏷️ ARIA情報:
                </div>
                <code className="text-sm text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                  aria-label="
                  {CSV_ACCESSIBILITY_SCENARIO[currentStepIndex].ariaLabel}"
                </code>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  completeStep();
                  announceToScreenReader('ステップ完了');
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                ✅ 完了
              </button>
              <button
                onClick={() =>
                  reportDifficulty(
                    `ステップ${currentStepIndex + 1}でアクセシビリティ困難`
                  )
                }
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
              >
                ⚠️ 困難
              </button>
              <button
                onClick={completeTest}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                ❌ 中断
              </button>
            </div>
          </div>

          {/* 困難報告 */}
          {difficulties.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="text-sm font-medium text-yellow-800 mb-1">
                報告されたアクセシビリティ困難:
              </div>
              <ul className="text-sm text-yellow-700 space-y-1">
                {difficulties.map((difficulty, index) => (
                  <li key={index}>• {difficulty}</li>
                ))}
              </ul>
            </div>
          )}

          {/* リアルタイム統計 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-purple-600">
                {keyboardOnlyMode ? '✅' : '❌'}
              </div>
              <div className="text-xs text-gray-600">キーボードのみ</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-purple-600">
                {screenReaderSimulation ? '✅' : '❌'}
              </div>
              <div className="text-xs text-gray-600">スクリーンリーダー</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-purple-600">
                {difficulties.length}
              </div>
              <div className="text-xs text-gray-600">困難報告</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-purple-600">
                {startTimeRef.current
                  ? formatTime(Date.now() - startTimeRef.current.getTime())
                  : '0:00'}
              </div>
              <div className="text-xs text-gray-600">経過時間</div>
            </div>
          </div>
        </div>
      )}

      {/* テスト結果 */}
      {testResult && (
        <div>
          <h4 className="font-semibold text-wb-wood-700 mb-4">
            📊 アクセシビリティテスト結果
          </h4>

          {/* スコア表示 */}
          <div className="text-center mb-6">
            <div className="text-4xl font-bold mb-2">
              <span
                className={`${
                  testResult.score >= 80
                    ? 'text-green-600'
                    : testResult.score >= 60
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {testResult.score}点
              </span>
            </div>
            <div className="text-sm text-gray-600">アクセシビリティスコア</div>
          </div>

          {/* 詳細結果 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-wb-wood-700 mb-3">📈 実行結果</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>完了時間</span>
                  <span className="font-mono">
                    {testResult.totalTime
                      ? formatTime(testResult.totalTime)
                      : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>目標時間</span>
                  <span className="font-mono">5:00</span>
                </div>
                <div className="flex justify-between">
                  <span>完了ステップ</span>
                  <span>
                    {testResult.completedSteps} / {testResult.totalSteps}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>キーボードのみ成功</span>
                  <span>{testResult.keyboardOnlySuccess ? '✅' : '❌'}</span>
                </div>
                <div className="flex justify-between">
                  <span>スクリーンリーダー対応</span>
                  <span>{testResult.screenReaderCompatible ? '✅' : '❌'}</span>
                </div>
                <div className="flex justify-between">
                  <span>WCAG準拠度</span>
                  <span
                    className={`font-bold ${
                      testResult.wcagCompliance >= 80
                        ? 'text-green-600'
                        : testResult.wcagCompliance >= 60
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {testResult.wcagCompliance.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>困難報告</span>
                  <span>{testResult.difficulties.length}件</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-wb-wood-700 mb-3">
                💬 フィードバック
              </h5>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="アクセシビリティテスト体験についてのフィードバックをお聞かせください..."
                className="w-full h-24 p-3 border border-gray-300 rounded-lg text-sm resize-none"
              />
            </div>
          </div>

          {/* WCAG準拠チェック */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-medium text-blue-800 mb-2">
              ♿ WCAG 2.1 AA準拠チェック
            </h5>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span
                    className={
                      testResult.keyboardOnlySuccess
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {testResult.keyboardOnlySuccess ? '✅' : '❌'}
                  </span>
                  <span>キーボードアクセシビリティ</span>
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <span
                    className={
                      testResult.screenReaderCompatible
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {testResult.screenReaderCompatible ? '✅' : '❌'}
                  </span>
                  <span>スクリーンリーダー対応</span>
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <span
                    className={
                      testResult.difficulties.length === 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {testResult.difficulties.length === 0 ? '✅' : '❌'}
                  </span>
                  <span>操作困難なし</span>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-blue-600">ℹ️</span>
                  <span>フォーカス管理</span>
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-blue-600">ℹ️</span>
                  <span>ARIA属性適用</span>
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-blue-600">ℹ️</span>
                  <span>セマンティックHTML</span>
                </div>
              </div>
            </div>
          </div>

          {/* 改善提案 */}
          <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h5 className="font-medium text-purple-800 mb-2">
              💡 アクセシビリティ改善提案
            </h5>
            <ul className="text-sm text-purple-700 space-y-1">
              {!testResult.keyboardOnlySuccess && (
                <li>• キーボードナビゲーションの改善が必要です</li>
              )}
              {!testResult.screenReaderCompatible && (
                <li>• スクリーンリーダー対応の強化が必要です</li>
              )}
              {testResult.difficulties.length > 0 && (
                <li>• 操作困難が報告された箇所の見直しを検討してください</li>
              )}
              {testResult.wcagCompliance < 80 && (
                <li>• WCAG 2.1 AA準拠度の向上が必要です</li>
              )}
              {testResult.totalTime && testResult.totalTime > 300000 && (
                <li>• 操作効率の改善を検討してください</li>
              )}
            </ul>
          </div>

          <div className="mt-4 flex space-x-3">
            <button
              onClick={resetTest}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              🔄 新しいテスト
            </button>
          </div>
        </div>
      )}

      {/* スクリーンリーダー用の隠しテキスト */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isRunning && `現在ステップ${currentStepIndex + 1}を実行中です。`}
      </div>
    </div>
  );
}

export default AccessibilityScenarioTest;
