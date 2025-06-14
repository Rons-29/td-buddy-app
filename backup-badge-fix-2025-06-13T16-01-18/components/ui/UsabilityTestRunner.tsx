'use client';

import { useEffect, useRef, useState } from 'react';

interface UsabilityTestScenario {
  id: string;
  title: string;
  description: string;
  userType: 'beginner' | 'intermediate' | 'advanced' | 'accessibility';
  steps: UsabilityTestStep[];
  expectedTime: number; // 秒
  successCriteria: string[];
}

interface UsabilityTestStep {
  id: string;
  instruction: string;
  expectedAction: string;
  hints?: string[];
  isCompleted?: boolean;
  timeSpent?: number;
}

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

const USABILITY_SCENARIOS: UsabilityTestScenario[] = [
  {
    id: 'password-generation-beginner',
    title: '初回ユーザーのパスワード生成',
    description: 'ITに詳しくない初回ユーザーが安全なパスワードを生成する',
    userType: 'beginner',
    expectedTime: 120, // 2分
    steps: [
      {
        id: 'step1',
        instruction:
          'Quality Workbenchのメインページからパスワード生成ツールを見つけてください',
        expectedAction: 'パスワードページへのナビゲーション',
        hints: [
          '🔐アイコンを探してみてください',
          'メニューから「パスワード」を選択',
        ],
      },
      {
        id: 'step2',
        instruction: '12文字以上の安全なパスワードを生成してください',
        expectedAction: '文字数設定と生成ボタンクリック',
        hints: ['文字数スライダーを調整', '「生成」ボタンをクリック'],
      },
      {
        id: 'step3',
        instruction: '生成されたパスワードをコピーしてください',
        expectedAction: 'コピーボタンのクリック',
        hints: ['📋コピーアイコンをクリック', 'パスワードの横にあるボタン'],
      },
      {
        id: 'step4',
        instruction: 'パスワードの強度を確認してください',
        expectedAction: '強度インジケーターの確認',
        hints: ['色付きのバーを確認', '強度メッセージを読む'],
      },
    ],
    successCriteria: [
      '2分以内に完了',
      '12文字以上のパスワード生成',
      'パスワードのコピー成功',
      '強度確認の理解',
    ],
  },
  {
    id: 'csv-generation-accessibility',
    title: '視覚障害ユーザーのCSV生成',
    description: 'スクリーンリーダーを使用するユーザーがCSVデータを生成する',
    userType: 'accessibility',
    expectedTime: 180, // 3分
    steps: [
      {
        id: 'step1',
        instruction:
          'キーボードナビゲーションでCSV生成ツールに移動してください',
        expectedAction: 'Tabキーでの移動とEnterキーでの選択',
        hints: ['Tabキーで要素間を移動', 'Enterキーで選択'],
      },
      {
        id: 'step2',
        instruction: 'データタイプを「個人情報」に設定してください',
        expectedAction: 'セレクトボックスの操作',
        hints: ['矢印キーで選択肢を移動', 'スクリーンリーダーの読み上げを確認'],
      },
      {
        id: 'step3',
        instruction: '100件のデータを生成してください',
        expectedAction: '件数入力と生成実行',
        hints: ['数値入力フィールドに100を入力', '生成ボタンをEnterで実行'],
      },
      {
        id: 'step4',
        instruction: '生成されたCSVデータをダウンロードしてください',
        expectedAction: 'ダウンロードボタンの実行',
        hints: ['ダウンロードボタンにフォーカス', 'Enterキーで実行'],
      },
    ],
    successCriteria: [
      '3分以内に完了',
      'キーボードのみで操作',
      'スクリーンリーダー対応確認',
      'CSVダウンロード成功',
    ],
  },
  {
    id: 'mobile-data-generation',
    title: 'モバイルでの大量データ生成',
    description: 'スマートフォンで1000件以上のデータを効率的に生成する',
    userType: 'intermediate',
    expectedTime: 240, // 4分
    steps: [
      {
        id: 'step1',
        instruction: 'モバイルデバイスでデータ生成ツールにアクセスしてください',
        expectedAction: 'モバイル最適化されたUIの確認',
        hints: ['レスポンシブデザインの確認', 'タッチ操作の確認'],
      },
      {
        id: 'step2',
        instruction: '1000件のテストデータ生成を設定してください',
        expectedAction: '大量データ設定の操作',
        hints: ['件数を1000に設定', 'データタイプを選択'],
      },
      {
        id: 'step3',
        instruction: 'バックグラウンド生成を開始してください',
        expectedAction: '非同期生成の開始',
        hints: ['生成開始ボタンをタップ', '進捗表示の確認'],
      },
      {
        id: 'step4',
        instruction: '生成完了まで進捗を監視してください',
        expectedAction: '進捗バーとステータスの確認',
        hints: ['進捗パーセンテージを確認', '完了通知を待つ'],
      },
      {
        id: 'step5',
        instruction: '生成されたデータをプレビューしてください',
        expectedAction: 'データプレビューの表示',
        hints: ['プレビューボタンをタップ', 'データ内容を確認'],
      },
    ],
    successCriteria: [
      '4分以内に完了',
      'モバイル操作の快適性',
      '大量データ生成成功',
      '進捗監視の理解',
      'プレビュー機能の活用',
    ],
  },
];

interface UsabilityTestRunnerProps {
  scenarioId?: string;
  autoStart?: boolean;
  onTestComplete?: (result: UsabilityTestResult) => void;
}

export function UsabilityTestRunner({
  scenarioId,
  autoStart = false,
  onTestComplete,
}: UsabilityTestRunnerProps) {
  const [selectedScenario, setSelectedScenario] =
    useState<UsabilityTestScenario | null>(
      scenarioId
        ? USABILITY_SCENARIOS.find(s => s.id === scenarioId) || null
        : null
    );
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [testResult, setTestResult] = useState<UsabilityTestResult | null>(
    null
  );
  const [stepTimes, setStepTimes] = useState<number[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');

  const startTimeRef = useRef<Date | null>(null);
  const stepStartTimeRef = useRef<Date | null>(null);

  const startTest = (scenario: UsabilityTestScenario) => {
    setSelectedScenario(scenario);
    setIsRunning(true);
    setCurrentStepIndex(0);
    setStepTimes([]);
    setDifficulties([]);
    setFeedback('');
    startTimeRef.current = new Date();
    stepStartTimeRef.current = new Date();
  };

  const completeStep = () => {
    if (!stepStartTimeRef.current || !selectedScenario) {
      return;
    }

    const stepTime = Date.now() - stepStartTimeRef.current.getTime();
    setStepTimes(prev => [...prev, stepTime]);

    if (currentStepIndex < selectedScenario.steps.length - 1) {
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
    if (!selectedScenario || !startTimeRef.current) {
      return;
    }

    const endTime = new Date();
    const totalTime = endTime.getTime() - startTimeRef.current.getTime();
    const completedSteps = currentStepIndex + 1;
    const successRate = (completedSteps / selectedScenario.steps.length) * 100;

    // スコア計算
    let score = 100;

    // 時間超過ペナルティ
    if (totalTime > selectedScenario.expectedTime * 1000) {
      score -= 20;
    }

    // 完了率
    score = score * (successRate / 100);

    // 困難報告ペナルティ
    score -= difficulties.length * 5;

    score = Math.max(0, Math.round(score));

    const result: UsabilityTestResult = {
      scenarioId: selectedScenario.id,
      userType: selectedScenario.userType,
      startTime: startTimeRef.current,
      endTime,
      totalTime,
      completedSteps,
      totalSteps: selectedScenario.steps.length,
      successRate,
      difficulties,
      feedback,
      score,
    };

    setTestResult(result);
    setIsRunning(false);
    onTestComplete?.(result);
  };

  const resetTest = () => {
    setSelectedScenario(null);
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

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'beginner':
        return '🔰';
      case 'intermediate':
        return '👤';
      case 'advanced':
        return '🎯';
      case 'accessibility':
        return '♿';
      default:
        return '👤';
    }
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'beginner':
        return '初心者';
      case 'intermediate':
        return '中級者';
      case 'advanced':
        return '上級者';
      case 'accessibility':
        return 'アクセシビリティ';
      default:
        return 'ユーザー';
    }
  };

  useEffect(() => {
    if (autoStart && selectedScenario) {
      startTest(selectedScenario);
    }
  }, [autoStart, selectedScenario]);

  return (
    <div className="wb-usability-test bg-white border border-wb-wood-200 rounded-lg p-6 shadow-sm">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">👥</span>
          <div>
            <h3 className="text-lg font-semibold text-wb-wood-800">
              ユーザビリティテスト
            </h3>
            <p className="text-sm text-wb-wood-600">
              実際の使用シナリオでの操作性評価
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

      {/* シナリオ選択 */}
      {!selectedScenario && !testResult && (
        <div>
          <h4 className="font-semibold text-wb-wood-700 mb-4">
            📋 テストシナリオを選択
          </h4>
          <div className="grid gap-4">
            {USABILITY_SCENARIOS.map(scenario => (
              <div
                key={scenario.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-wb-tool-inspect-300 cursor-pointer transition-colors"
                onClick={() => startTest(scenario)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {getUserTypeIcon(scenario.userType)}
                    </span>
                    <div>
                      <h5 className="font-medium text-wb-wood-800">
                        {scenario.title}
                      </h5>
                      <p className="text-sm text-wb-wood-600">
                        {scenario.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-wb-tool-inspect-600">
                      {getUserTypeLabel(scenario.userType)}
                    </div>
                    <div className="text-xs text-gray-500">
                      目標時間: {formatTime(scenario.expectedTime * 1000)}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  ステップ数: {scenario.steps.length} | 成功基準:{' '}
                  {scenario.successCriteria.length}項目
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* テスト実行中 */}
      {isRunning && selectedScenario && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-wb-wood-700">
              {getUserTypeIcon(selectedScenario.userType)}{' '}
              {selectedScenario.title}
            </h4>
            <div className="text-sm text-gray-600">
              ステップ {currentStepIndex + 1} / {selectedScenario.steps.length}
            </div>
          </div>

          {/* 進捗バー */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>進捗</span>
              <span>
                {Math.round(
                  ((currentStepIndex + 1) / selectedScenario.steps.length) * 100
                )}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-wb-tool-inspect-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentStepIndex + 1) / selectedScenario.steps.length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {/* 現在のステップ */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h5 className="font-medium text-blue-800 mb-2">
              📝 ステップ {currentStepIndex + 1}
            </h5>
            <p className="text-blue-700 mb-3">
              {selectedScenario.steps[currentStepIndex].instruction}
            </p>

            {/* ヒント */}
            {selectedScenario.steps[currentStepIndex].hints && (
              <div className="mb-3">
                <div className="text-sm font-medium text-blue-700 mb-1">
                  💡 ヒント:
                </div>
                <ul className="text-sm text-blue-600 space-y-1">
                  {selectedScenario.steps[currentStepIndex].hints!.map(
                    (hint, index) => (
                      <li key={index} className="flex items-start space-x-1">
                        <span>•</span>
                        <span>{hint}</span>
                      </li>
                    )
                  )}
                </ul>
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
                  reportDifficulty(`ステップ${currentStepIndex + 1}で困難`)
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
                報告された困難:
              </div>
              <ul className="text-sm text-yellow-700 space-y-1">
                {difficulties.map((difficulty, index) => (
                  <li key={index}>• {difficulty}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* テスト結果 */}
      {testResult && (
        <div>
          <h4 className="font-semibold text-wb-wood-700 mb-4">📊 テスト結果</h4>

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
            <div className="text-sm text-gray-600">ユーザビリティスコア</div>
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
                  <span className="font-mono">
                    {formatTime(
                      (USABILITY_SCENARIOS.find(
                        s => s.id === testResult.scenarioId
                      )?.expectedTime || 0) * 1000
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>完了ステップ</span>
                  <span>
                    {testResult.completedSteps} / {testResult.totalSteps}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>成功率</span>
                  <span>{testResult.successRate.toFixed(1)}%</span>
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
                placeholder="テスト体験についてのフィードバックをお聞かせください..."
                className="w-full h-24 p-3 border border-gray-300 rounded-lg text-sm resize-none"
              />
            </div>
          </div>

          {/* 改善提案 */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-medium text-blue-800 mb-2">💡 改善提案</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              {testResult.score < 80 && (
                <li>• ユーザビリティの向上が必要です</li>
              )}
              {testResult.difficulties.length > 0 && (
                <li>• 困難が報告されたステップの見直しを検討してください</li>
              )}
              {testResult.totalTime &&
                testResult.totalTime >
                  (USABILITY_SCENARIOS.find(s => s.id === testResult.scenarioId)
                    ?.expectedTime || 0) *
                    1000 && <li>• 操作時間の短縮を検討してください</li>}
              {testResult.successRate < 100 && (
                <li>• 未完了ステップの原因を調査してください</li>
              )}
            </ul>
          </div>

          <div className="mt-4 flex space-x-3">
            <button
              onClick={resetTest}
              className="px-4 py-2 bg-wb-tool-inspect-500 text-white rounded-lg hover:bg-wb-tool-inspect-600 transition-colors"
            >
              🔄 新しいテスト
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsabilityTestRunner;
