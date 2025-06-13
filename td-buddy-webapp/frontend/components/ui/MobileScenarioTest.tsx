'use client';

import { useEffect, useRef, useState } from 'react';

interface MobileTestStep {
  id: string;
  instruction: string;
  touchAction: string;
  expectedBehavior: string;
  mobileOptimization?: string;
  isCompleted?: boolean;
  timeSpent?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
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

const MOBILE_DATA_GENERATION_SCENARIO: MobileTestStep[] = [
  {
    id: 'step1',
    instruction: 'モバイルデバイスでデータ生成ツールにアクセスしてください',
    touchAction: 'タップナビゲーション',
    expectedBehavior: 'レスポンシブデザインでの表示確認',
    mobileOptimization: 'タッチターゲット44px以上、読みやすいフォントサイズ',
    difficulty: 'easy',
  },
  {
    id: 'step2',
    instruction:
      'データタイプを選択してください（ドロップダウンまたはセレクト）',
    touchAction: 'タップ → スクロール → タップ',
    expectedBehavior: 'モバイル最適化されたセレクトUI',
    mobileOptimization: 'ネイティブセレクトまたは大きなタッチエリア',
    difficulty: 'medium',
  },
  {
    id: 'step3',
    instruction: '1000件のデータ生成を設定してください',
    touchAction: '数値入力（仮想キーボード）',
    expectedBehavior: '数値キーボードの表示、入力しやすいフィールド',
    mobileOptimization: 'inputmode="numeric"、適切なフィールドサイズ',
    difficulty: 'easy',
  },
  {
    id: 'step4',
    instruction: 'バックグラウンド生成を開始してください',
    touchAction: 'タップ（生成ボタン）',
    expectedBehavior: '非同期処理開始、進捗表示',
    mobileOptimization: '大きなボタン、明確なフィードバック',
    difficulty: 'easy',
  },
  {
    id: 'step5',
    instruction: '生成進捗を監視してください（他のタスクも可能）',
    touchAction: '待機・監視',
    expectedBehavior: 'リアルタイム進捗更新、バックグラウンド処理',
    mobileOptimization: 'プッシュ通知、進捗バー、パーセンテージ表示',
    difficulty: 'medium',
  },
  {
    id: 'step6',
    instruction: '生成完了通知を確認してください',
    touchAction: '通知確認',
    expectedBehavior: '完了通知の表示、音声・振動フィードバック',
    mobileOptimization: 'モバイル通知API、視覚的フィードバック',
    difficulty: 'easy',
  },
  {
    id: 'step7',
    instruction: '生成されたデータをプレビューしてください',
    touchAction: 'タップ → スクロール',
    expectedBehavior: 'モバイル最適化されたデータ表示',
    mobileOptimization: '横スクロール、カード形式、仮想スクロール',
    difficulty: 'medium',
  },
  {
    id: 'step8',
    instruction: 'データをダウンロードまたは共有してください',
    touchAction: 'タップ → 共有メニュー',
    expectedBehavior: 'ネイティブ共有機能、ダウンロード',
    mobileOptimization: 'Web Share API、適切なファイル形式',
    difficulty: 'hard',
  },
];

interface MobileScenarioTestProps {
  onTestComplete?: (result: MobileTestResult) => void;
  autoStart?: boolean;
}

export function MobileScenarioTest({
  onTestComplete,
  autoStart = false,
}: MobileScenarioTestProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [testResult, setTestResult] = useState<MobileTestResult | null>(null);
  const [stepTimes, setStepTimes] = useState<number[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>(
    'mobile'
  );
  const [touchMode, setTouchMode] = useState(true);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    interactionTime: 0,
  });

  const startTimeRef = useRef<Date | null>(null);
  const stepStartTimeRef = useRef<Date | null>(null);

  // デバイス検出
  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setDeviceType('mobile');
      } else if (width <= 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  const startTest = () => {
    setIsRunning(true);
    setCurrentStepIndex(0);
    setStepTimes([]);
    setDifficulties([]);
    setFeedback('');
    startTimeRef.current = new Date();
    stepStartTimeRef.current = new Date();

    // パフォーマンス測定開始
    measurePerformance();
  };

  const measurePerformance = () => {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      setPerformanceMetrics({
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        renderTime:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
        interactionTime: Date.now() - navigation.loadEventEnd,
      });
    }
  };

  const completeStep = () => {
    if (!stepStartTimeRef.current) {
      return;
    }

    const stepTime = Date.now() - stepStartTimeRef.current.getTime();
    setStepTimes(prev => [...prev, stepTime]);

    if (currentStepIndex < MOBILE_DATA_GENERATION_SCENARIO.length - 1) {
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
      (completedSteps / MOBILE_DATA_GENERATION_SCENARIO.length) * 100;

    // モバイルスコア計算
    let score = 100;

    // 時間評価（6分以内が目標）
    if (totalTime > 360000) {
      // 6分
      score -= 20;
    }

    // 完了率
    score = score * (successRate / 100);

    // 困難報告ペナルティ
    score -= difficulties.length * 10;

    // デバイス最適化ボーナス
    if (deviceType === 'mobile' && touchMode) {
      score += 15;
    }

    // パフォーマンスボーナス
    const avgPerformance =
      (performanceMetrics.loadTime + performanceMetrics.renderTime) / 2;
    if (avgPerformance < 1000) {
      // 1秒以内
      score += 10;
    }

    score = Math.max(0, Math.round(score));

    // パフォーマンススコア計算
    const performanceScore = Math.max(0, 100 - avgPerformance / 100);

    const result: MobileTestResult = {
      scenarioId: 'mobile-data-generation',
      deviceType,
      startTime: startTimeRef.current,
      endTime,
      totalTime,
      completedSteps,
      totalSteps: MOBILE_DATA_GENERATION_SCENARIO.length,
      touchFriendly: touchMode && deviceType !== 'desktop',
      responsiveDesign: true, // 実際の測定が必要
      performanceScore: Math.round(performanceScore),
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

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile':
        return '📱';
      case 'tablet':
        return '📱';
      case 'desktop':
        return '💻';
      default:
        return '📱';
    }
  };

  const getDeviceLabel = (device: string) => {
    switch (device) {
      case 'mobile':
        return 'スマートフォン';
      case 'tablet':
        return 'タブレット';
      case 'desktop':
        return 'デスクトップ';
      default:
        return 'モバイル';
    }
  };

  useEffect(() => {
    if (autoStart) {
      startTest();
    }
  }, [autoStart]);

  return (
    <div className="wb-mobile-test bg-white border border-wb-wood-200 rounded-lg p-6 shadow-sm">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">📱</span>
          <div>
            <h3 className="text-lg font-semibold text-wb-wood-800">
              モバイルシナリオテスト
            </h3>
            <p className="text-sm text-wb-wood-600">
              大量データ生成のモバイル操作性評価
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

      {/* デバイス情報 */}
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-green-800">📊 デバイス情報</h4>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getDeviceIcon(deviceType)}</span>
            <span className="text-sm font-medium text-green-700">
              {getDeviceLabel(deviceType)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-green-700 font-medium">画面幅</div>
            <div className="text-green-600">{window.innerWidth}px</div>
          </div>
          <div>
            <div className="text-green-700 font-medium">画面高</div>
            <div className="text-green-600">{window.innerHeight}px</div>
          </div>
          <div>
            <div className="text-green-700 font-medium">タッチ対応</div>
            <div className="text-green-600">
              {'ontouchstart' in window ? '✅' : '❌'}
            </div>
          </div>
          <div>
            <div className="text-green-700 font-medium">向き</div>
            <div className="text-green-600">
              {window.innerWidth > window.innerHeight ? '横' : '縦'}
            </div>
          </div>
        </div>
      </div>

      {/* 設定パネル */}
      {!isRunning && !testResult && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3">🔧 テスト設定</h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={touchMode}
                onChange={e => setTouchMode(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-blue-700">
                タッチ操作モード（マウス使用制限）
              </span>
            </label>
          </div>

          <button
            onClick={startTest}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
              📱 モバイル大量データ生成シナリオ
            </h4>
            <div className="text-sm text-gray-600">
              ステップ {currentStepIndex + 1} /{' '}
              {MOBILE_DATA_GENERATION_SCENARIO.length}
            </div>
          </div>

          {/* 進捗バー */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>進捗</span>
              <span>
                {Math.round(
                  ((currentStepIndex + 1) /
                    MOBILE_DATA_GENERATION_SCENARIO.length) *
                    100
                )}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentStepIndex + 1) /
                      MOBILE_DATA_GENERATION_SCENARIO.length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {/* 現在のステップ */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-blue-800">
                📝 ステップ {currentStepIndex + 1}
              </h5>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  MOBILE_DATA_GENERATION_SCENARIO[currentStepIndex]
                    .difficulty === 'easy'
                    ? 'bg-green-100 text-green-700'
                    : MOBILE_DATA_GENERATION_SCENARIO[currentStepIndex]
                        .difficulty === 'medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {getDifficultyLabel(
                  MOBILE_DATA_GENERATION_SCENARIO[currentStepIndex]
                    .difficulty || 'easy'
                )}
              </span>
            </div>

            <p className="text-blue-700 mb-3">
              {MOBILE_DATA_GENERATION_SCENARIO[currentStepIndex].instruction}
            </p>

            {/* タッチ操作ガイド */}
            <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded">
              <div className="text-sm font-medium text-green-800 mb-1">
                👆 タッチ操作:
              </div>
              <code className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded">
                {MOBILE_DATA_GENERATION_SCENARIO[currentStepIndex].touchAction}
              </code>
            </div>

            {/* 期待される動作 */}
            <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <div className="text-sm font-medium text-yellow-800 mb-1">
                🎯 期待される動作:
              </div>
              <p className="text-sm text-yellow-700">
                {
                  MOBILE_DATA_GENERATION_SCENARIO[currentStepIndex]
                    .expectedBehavior
                }
              </p>
            </div>

            {/* モバイル最適化情報 */}
            {MOBILE_DATA_GENERATION_SCENARIO[currentStepIndex]
              .mobileOptimization && (
              <div className="mb-3 p-3 bg-purple-50 border border-purple-200 rounded">
                <div className="text-sm font-medium text-purple-800 mb-1">
                  📱 モバイル最適化:
                </div>
                <p className="text-sm text-purple-700">
                  {
                    MOBILE_DATA_GENERATION_SCENARIO[currentStepIndex]
                      .mobileOptimization
                  }
                </p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={completeStep}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                ✅ 完了
              </button>
              <button
                onClick={() =>
                  reportDifficulty(
                    `ステップ${currentStepIndex + 1}でモバイル操作困難`
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
                報告されたモバイル操作困難:
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
              <div className="text-lg font-bold text-blue-600">
                {getDeviceIcon(deviceType)}
              </div>
              <div className="text-xs text-gray-600">
                {getDeviceLabel(deviceType)}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-600">
                {touchMode ? '✅' : '❌'}
              </div>
              <div className="text-xs text-gray-600">タッチモード</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-600">
                {difficulties.length}
              </div>
              <div className="text-xs text-gray-600">困難報告</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-600">
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
            📊 モバイルテスト結果
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
            <div className="text-sm text-gray-600">
              モバイルユーザビリティスコア
            </div>
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
                  <span className="font-mono">6:00</span>
                </div>
                <div className="flex justify-between">
                  <span>完了ステップ</span>
                  <span>
                    {testResult.completedSteps} / {testResult.totalSteps}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>デバイスタイプ</span>
                  <span>
                    {getDeviceIcon(testResult.deviceType)}{' '}
                    {getDeviceLabel(testResult.deviceType)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>タッチフレンドリー</span>
                  <span>{testResult.touchFriendly ? '✅' : '❌'}</span>
                </div>
                <div className="flex justify-between">
                  <span>レスポンシブデザイン</span>
                  <span>{testResult.responsiveDesign ? '✅' : '❌'}</span>
                </div>
                <div className="flex justify-between">
                  <span>パフォーマンススコア</span>
                  <span
                    className={`font-bold ${
                      testResult.performanceScore >= 80
                        ? 'text-green-600'
                        : testResult.performanceScore >= 60
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {testResult.performanceScore}点
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
                placeholder="モバイルテスト体験についてのフィードバックをお聞かせください..."
                className="w-full h-24 p-3 border border-gray-300 rounded-lg text-sm resize-none"
              />
            </div>
          </div>

          {/* パフォーマンス詳細 */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h5 className="font-medium text-green-800 mb-2">
              ⚡ パフォーマンス詳細
            </h5>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-green-700 font-medium">読み込み時間</div>
                <div className="text-green-600">
                  {performanceMetrics.loadTime.toFixed(0)}ms
                </div>
              </div>
              <div>
                <div className="text-green-700 font-medium">
                  レンダリング時間
                </div>
                <div className="text-green-600">
                  {performanceMetrics.renderTime.toFixed(0)}ms
                </div>
              </div>
              <div>
                <div className="text-green-700 font-medium">
                  インタラクション時間
                </div>
                <div className="text-green-600">
                  {performanceMetrics.interactionTime.toFixed(0)}ms
                </div>
              </div>
            </div>
          </div>

          {/* 改善提案 */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-medium text-blue-800 mb-2">
              💡 モバイル最適化改善提案
            </h5>
            <ul className="text-sm text-blue-700 space-y-1">
              {!testResult.touchFriendly && (
                <li>• タッチ操作の最適化が必要です</li>
              )}
              {!testResult.responsiveDesign && (
                <li>• レスポンシブデザインの改善が必要です</li>
              )}
              {testResult.difficulties.length > 0 && (
                <li>
                  • モバイル操作困難が報告された箇所の見直しを検討してください
                </li>
              )}
              {testResult.performanceScore < 80 && (
                <li>• モバイルパフォーマンスの向上が必要です</li>
              )}
              {testResult.totalTime && testResult.totalTime > 360000 && (
                <li>• モバイル操作効率の改善を検討してください</li>
              )}
              {deviceType === 'mobile' && (
                <li>
                  • タッチターゲットサイズ（44px以上）の確認をしてください
                </li>
              )}
            </ul>
          </div>

          <div className="mt-4 flex space-x-3">
            <button
              onClick={resetTest}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 新しいテスト
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileScenarioTest;
