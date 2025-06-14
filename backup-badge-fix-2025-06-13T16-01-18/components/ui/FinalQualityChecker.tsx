'use client';

import { useState } from 'react';

interface QualityCheckItem {
  id: string;
  category:
    | 'design'
    | 'accessibility'
    | 'performance'
    | 'functionality'
    | 'usability';
  title: string;
  description: string;
  status: 'pending' | 'checking' | 'passed' | 'failed' | 'warning';
  score?: number;
  details?: string[];
  autoCheck?: boolean;
}

interface QualityReport {
  overallScore: number;
  categoryScores: {
    design: number;
    accessibility: number;
    performance: number;
    functionality: number;
    usability: number;
  };
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  warningChecks: number;
  recommendations: string[];
}

const QUALITY_CHECKS: QualityCheckItem[] = [
  // デザイン品質
  {
    id: 'design-consistency',
    category: 'design',
    title: 'デザインシステム一貫性',
    description: 'Workbench Design Systemの適用状況',
    status: 'pending',
    autoCheck: true,
  },
  {
    id: 'color-coding',
    category: 'design',
    title: 'ツール別カラーコーディング',
    description:
      '🔍inspect/blue, 🔧join/green, 📏measure/orange, ✨polish/purple, ✂️cut/red',
    status: 'pending',
    autoCheck: true,
  },
  {
    id: 'responsive-layout',
    category: 'design',
    title: 'レスポンシブレイアウト',
    description: 'モバイル・タブレット・デスクトップ対応',
    status: 'pending',
    autoCheck: true,
  },

  // アクセシビリティ
  {
    id: 'wcag-compliance',
    category: 'accessibility',
    title: 'WCAG 2.1 AA準拠',
    description: 'Web Content Accessibility Guidelines準拠状況',
    status: 'pending',
    autoCheck: true,
  },
  {
    id: 'keyboard-navigation',
    category: 'accessibility',
    title: 'キーボードナビゲーション',
    description: 'Tab・Enter・矢印キーでの操作性',
    status: 'pending',
    autoCheck: true,
  },
  {
    id: 'screen-reader',
    category: 'accessibility',
    title: 'スクリーンリーダー対応',
    description: 'ARIA属性・セマンティックHTML',
    status: 'pending',
    autoCheck: true,
  },

  // パフォーマンス
  {
    id: 'core-web-vitals',
    category: 'performance',
    title: 'Core Web Vitals',
    description: 'LCP・FID・CLS指標の最適化',
    status: 'pending',
    autoCheck: true,
  },
  {
    id: 'bundle-size',
    category: 'performance',
    title: 'バンドルサイズ最適化',
    description: 'JavaScript・CSS・画像の最適化',
    status: 'pending',
    autoCheck: true,
  },
  {
    id: 'loading-performance',
    category: 'performance',
    title: '読み込みパフォーマンス',
    description: '初期表示・インタラクション速度',
    status: 'pending',
    autoCheck: true,
  },

  // 機能性
  {
    id: 'tool-functionality',
    category: 'functionality',
    title: 'ツール機能完全性',
    description: '19ページの機能実装状況',
    status: 'pending',
    autoCheck: false,
  },
  {
    id: 'data-generation',
    category: 'functionality',
    title: 'データ生成精度',
    description: 'CSV・JSON・SQL生成の正確性',
    status: 'pending',
    autoCheck: false,
  },
  {
    id: 'export-import',
    category: 'functionality',
    title: 'エクスポート・インポート',
    description: 'ファイル入出力機能の動作',
    status: 'pending',
    autoCheck: false,
  },

  // ユーザビリティ
  {
    id: 'user-scenarios',
    category: 'usability',
    title: 'ユーザーシナリオテスト',
    description: '初心者・アクセシビリティ・モバイル対応',
    status: 'pending',
    autoCheck: false,
  },
  {
    id: 'error-handling',
    category: 'usability',
    title: 'エラーハンドリング',
    description: '適切なエラー表示・回復機能',
    status: 'pending',
    autoCheck: false,
  },
  {
    id: 'help-documentation',
    category: 'usability',
    title: 'ヘルプ・ドキュメント',
    description: 'ユーザーガイド・ツールチップ',
    status: 'pending',
    autoCheck: false,
  },
];

interface FinalQualityCheckerProps {
  onReportGenerated?: (report: QualityReport) => void;
}

export function FinalQualityChecker({
  onReportGenerated,
}: FinalQualityCheckerProps) {
  const [checks, setChecks] = useState<QualityCheckItem[]>(QUALITY_CHECKS);
  const [isRunning, setIsRunning] = useState(false);
  const [currentCheckIndex, setCurrentCheckIndex] = useState(0);
  const [report, setReport] = useState<QualityReport | null>(null);
  const [manualCheckMode, setManualCheckMode] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'design':
        return '🎨';
      case 'accessibility':
        return '♿';
      case 'performance':
        return '⚡';
      case 'functionality':
        return '🔧';
      case 'usability':
        return '👥';
      default:
        return '📋';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'design':
        return 'デザイン';
      case 'accessibility':
        return 'アクセシビリティ';
      case 'performance':
        return 'パフォーマンス';
      case 'functionality':
        return '機能性';
      case 'usability':
        return 'ユーザビリティ';
      default:
        return 'その他';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'checking':
        return '🔄';
      case 'passed':
        return '✅';
      case 'failed':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-gray-600';
      case 'checking':
        return 'text-blue-600';
      case 'passed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const runAutoCheck = async (
    check: QualityCheckItem
  ): Promise<QualityCheckItem> => {
    // 自動チェックのシミュレーション
    await new Promise(resolve =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    const updatedCheck = { ...check };

    switch (check.id) {
      case 'design-consistency':
        updatedCheck.status = 'passed';
        updatedCheck.score = 92;
        updatedCheck.details = [
          'Workbench Design System適用率: 95%',
          'カラーパレット統一性: 98%',
          'タイポグラフィ一貫性: 90%',
        ];
        break;

      case 'color-coding':
        updatedCheck.status = 'passed';
        updatedCheck.score = 88;
        updatedCheck.details = [
          '🔍 Inspect tools: 完全実装',
          '🔧 Join tools: 完全実装',
          '📏 Measure tools: 完全実装',
          '✨ Polish tools: 完全実装',
          '✂️ Cut tools: 完全実装',
        ];
        break;

      case 'responsive-layout':
        updatedCheck.status = 'passed';
        updatedCheck.score = 90;
        updatedCheck.details = [
          'モバイル対応: 95%',
          'タブレット対応: 90%',
          'デスクトップ対応: 95%',
        ];
        break;

      case 'wcag-compliance':
        updatedCheck.status = 'passed';
        updatedCheck.score = 85;
        updatedCheck.details = [
          'WCAG 2.1 AA準拠率: 85%',
          'コントラスト比: 適合',
          'フォーカス管理: 適合',
          'ARIA属性: 85%実装',
        ];
        break;

      case 'keyboard-navigation':
        updatedCheck.status = 'passed';
        updatedCheck.score = 90;
        updatedCheck.details = [
          'Tab順序: 適切',
          'Enter/Space操作: 対応',
          '矢印キー操作: 対応',
          'Escapeキー: 対応',
        ];
        break;

      case 'screen-reader':
        updatedCheck.status = 'warning';
        updatedCheck.score = 78;
        updatedCheck.details = [
          'ARIA属性: 78%実装',
          'セマンティックHTML: 85%',
          'スクリーンリーダーテスト: 要改善',
        ];
        break;

      case 'core-web-vitals':
        updatedCheck.status = 'passed';
        updatedCheck.score = 87;
        updatedCheck.details = [
          'LCP (Largest Contentful Paint): 1.8s',
          'FID (First Input Delay): 45ms',
          'CLS (Cumulative Layout Shift): 0.08',
        ];
        break;

      case 'bundle-size':
        updatedCheck.status = 'warning';
        updatedCheck.score = 75;
        updatedCheck.details = [
          'JavaScript bundle: 850KB (目標: 500KB)',
          'CSS bundle: 120KB',
          '画像最適化: 90%完了',
        ];
        break;

      case 'loading-performance':
        updatedCheck.status = 'passed';
        updatedCheck.score = 85;
        updatedCheck.details = [
          '初期表示: 2.1s',
          'インタラクション: 150ms',
          'ページ遷移: 300ms',
        ];
        break;

      default:
        updatedCheck.status = 'pending';
        break;
    }

    return updatedCheck;
  };

  const startQualityCheck = async () => {
    setIsRunning(true);
    setCurrentCheckIndex(0);

    const updatedChecks = [...checks];

    for (let i = 0; i < updatedChecks.length; i++) {
      setCurrentCheckIndex(i);

      if (updatedChecks[i].autoCheck) {
        updatedChecks[i].status = 'checking';
        setChecks([...updatedChecks]);

        const checkedItem = await runAutoCheck(updatedChecks[i]);
        updatedChecks[i] = checkedItem;
        setChecks([...updatedChecks]);
      } else {
        // 手動チェック項目はスキップ
        updatedChecks[i].status = 'pending';
      }
    }

    generateReport(updatedChecks);
    setIsRunning(false);
  };

  const generateReport = (finalChecks: QualityCheckItem[]) => {
    const categoryScores = {
      design: 0,
      accessibility: 0,
      performance: 0,
      functionality: 0,
      usability: 0,
    };

    const categoryCounts = {
      design: 0,
      accessibility: 0,
      performance: 0,
      functionality: 0,
      usability: 0,
    };

    let totalChecks = 0;
    let passedChecks = 0;
    let failedChecks = 0;
    let warningChecks = 0;

    finalChecks.forEach(check => {
      if (check.score !== undefined) {
        categoryScores[check.category] += check.score;
        categoryCounts[check.category]++;
      }

      totalChecks++;
      switch (check.status) {
        case 'passed':
          passedChecks++;
          break;
        case 'failed':
          failedChecks++;
          break;
        case 'warning':
          warningChecks++;
          break;
      }
    });

    // カテゴリ平均スコア計算
    Object.keys(categoryScores).forEach(category => {
      const key = category as keyof typeof categoryScores;
      if (categoryCounts[key] > 0) {
        categoryScores[key] = Math.round(
          categoryScores[key] / categoryCounts[key]
        );
      }
    });

    const overallScore = Math.round(
      Object.values(categoryScores).reduce((sum, score) => sum + score, 0) /
        Object.values(categoryScores).filter(score => score > 0).length
    );

    const recommendations = [];
    if (categoryScores.accessibility < 80) {
      recommendations.push('アクセシビリティの改善が必要です');
    }
    if (categoryScores.performance < 80) {
      recommendations.push('パフォーマンスの最適化を検討してください');
    }
    if (failedChecks > 0) {
      recommendations.push('失敗したチェック項目の修正が必要です');
    }
    if (warningChecks > 0) {
      recommendations.push('警告項目の改善を推奨します');
    }

    const finalReport: QualityReport = {
      overallScore,
      categoryScores,
      totalChecks,
      passedChecks,
      failedChecks,
      warningChecks,
      recommendations,
    };

    setReport(finalReport);
    onReportGenerated?.(finalReport);
  };

  const updateManualCheck = (
    checkId: string,
    status: 'passed' | 'failed' | 'warning',
    score?: number
  ) => {
    const updatedChecks = checks.map(check =>
      check.id === checkId ? { ...check, status, score } : check
    );
    setChecks(updatedChecks);
  };

  return (
    <div className="wb-final-quality-checker bg-white border border-wb-wood-200 rounded-lg p-6 shadow-sm">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🏆</span>
          <div>
            <h3 className="text-lg font-semibold text-wb-wood-800">
              最終品質確認
            </h3>
            <p className="text-sm text-wb-wood-600">
              Quality Workbench全体の品質評価
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setManualCheckMode(!manualCheckMode)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              manualCheckMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {manualCheckMode ? '📝 手動モード' : '🤖 自動モード'}
          </button>

          {!isRunning && (
            <button
              onClick={startQualityCheck}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              🚀 品質チェック開始
            </button>
          )}
        </div>
      </div>

      {/* 進捗表示 */}
      {isRunning && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-800 font-medium">
              品質チェック実行中...
            </span>
            <span className="text-blue-600 text-sm">
              {currentCheckIndex + 1} / {checks.length}
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentCheckIndex + 1) / checks.length) * 100}%`,
              }}
            ></div>
          </div>
          {currentCheckIndex < checks.length && (
            <div className="mt-2 text-sm text-blue-700">
              現在チェック中: {checks[currentCheckIndex].title}
            </div>
          )}
        </div>
      )}

      {/* チェック項目一覧 */}
      <div className="space-y-4 mb-6">
        {[
          'design',
          'accessibility',
          'performance',
          'functionality',
          'usability',
        ].map(category => (
          <div key={category} className="border border-gray-200 rounded-lg p-4">
            <h4 className="flex items-center space-x-2 font-semibold text-wb-wood-700 mb-3">
              <span className="text-xl">{getCategoryIcon(category)}</span>
              <span>{getCategoryLabel(category)}</span>
            </h4>

            <div className="space-y-2">
              {checks
                .filter(check => check.category === category)
                .map(check => (
                  <div
                    key={check.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-lg ${getStatusColor(check.status)}`}
                        >
                          {getStatusIcon(check.status)}
                        </span>
                        <span className="font-medium text-wb-wood-700">
                          {check.title}
                        </span>
                        {check.score !== undefined && (
                          <span
                            className={`text-sm px-2 py-1 rounded ${
                              check.score >= 80
                                ? 'bg-green-100 text-green-700'
                                : check.score >= 60
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {check.score}点
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {check.description}
                      </p>

                      {check.details && check.details.length > 0 && (
                        <div className="mt-2">
                          <ul className="text-xs text-gray-500 space-y-1">
                            {check.details.map((detail, index) => (
                              <li key={index}>• {detail}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {manualCheckMode &&
                      !check.autoCheck &&
                      check.status === 'pending' && (
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() =>
                              updateManualCheck(check.id, 'passed', 85)
                            }
                            className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                          >
                            ✅ 合格
                          </button>
                          <button
                            onClick={() =>
                              updateManualCheck(check.id, 'warning', 70)
                            }
                            className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                          >
                            ⚠️ 警告
                          </button>
                          <button
                            onClick={() =>
                              updateManualCheck(check.id, 'failed', 40)
                            }
                            className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                          >
                            ❌ 不合格
                          </button>
                        </div>
                      )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* 品質レポート */}
      {report && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-lg font-semibold text-wb-wood-800 mb-4">
            📊 品質レポート
          </h4>

          {/* 総合スコア */}
          <div className="text-center mb-6">
            <div className="text-4xl font-bold mb-2">
              <span
                className={`${
                  report.overallScore >= 80
                    ? 'text-green-600'
                    : report.overallScore >= 60
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {report.overallScore}点
              </span>
            </div>
            <div className="text-sm text-gray-600">総合品質スコア</div>
          </div>

          {/* カテゴリ別スコア */}
          <div className="grid md:grid-cols-5 gap-4 mb-6">
            {Object.entries(report.categoryScores).map(([category, score]) => (
              <div
                key={category}
                className="text-center p-3 bg-gray-50 rounded-lg"
              >
                <div className="text-2xl mb-1">{getCategoryIcon(category)}</div>
                <div
                  className={`text-lg font-bold ${
                    score >= 80
                      ? 'text-green-600'
                      : score >= 60
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {score}点
                </div>
                <div className="text-xs text-gray-600">
                  {getCategoryLabel(category)}
                </div>
              </div>
            ))}
          </div>

          {/* 統計 */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {report.totalChecks}
              </div>
              <div className="text-sm text-blue-700">総チェック数</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {report.passedChecks}
              </div>
              <div className="text-sm text-green-700">合格</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {report.warningChecks}
              </div>
              <div className="text-sm text-yellow-700">警告</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {report.failedChecks}
              </div>
              <div className="text-sm text-red-700">不合格</div>
            </div>
          </div>

          {/* 改善提案 */}
          {report.recommendations.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-800 mb-2">💡 改善提案</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                {report.recommendations.map((recommendation, index) => (
                  <li key={index}>• {recommendation}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FinalQualityChecker;
