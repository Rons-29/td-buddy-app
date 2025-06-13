'use client';

import FinalQualityChecker from '@/components/ui/FinalQualityChecker';
import { useState } from 'react';

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

export default function FinalQualityCheckPage() {
  const [reports, setReports] = useState<QualityReport[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleReportGenerated = (report: QualityReport) => {
    setReports(prev => [report, ...prev]);
  };

  const exportReport = (report: QualityReport) => {
    const reportData = {
      timestamp: new Date().toISOString(),
      ...report,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quality-report-${
      new Date().toISOString().split('T')[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90)
      return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 80)
      return { grade: 'A', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 70)
      return { grade: 'B', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (score >= 60)
      return { grade: 'C', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { grade: 'D', color: 'text-red-600', bg: 'bg-red-50' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wb-wood-50 to-wb-wood-100">
      {/* ヘッダー */}
      <div className="bg-white border-b border-wb-wood-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🏆</span>
                <div>
                  <h1 className="text-2xl font-bold text-wb-wood-800">
                    最終品質確認
                  </h1>
                  <p className="text-wb-wood-600">
                    Quality Workbench Week 4 Section 4.3
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  showHistory
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                �� 履歴表示
              </button>

              <div className="text-sm text-wb-wood-600">
                <div className="font-medium">Week 4 Progress</div>
                <div className="text-xs">Section 4.3 / 4.3</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* メインコンテンツ */}
          <div
            className={`${showHistory ? 'lg:col-span-8' : 'lg:col-span-12'}`}
          >
            {/* 概要カード */}
            <div className="bg-white border border-wb-wood-200 rounded-lg p-6 mb-8 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <span className="text-4xl">🎯</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-wb-wood-800 mb-2">
                    Quality Workbench 最終品質確認
                  </h2>
                  <p className="text-wb-wood-600 mb-4">
                    Week 4の最終段階として、Quality
                    Workbench全体の品質を総合的に評価します。
                    デザイン、アクセシビリティ、パフォーマンス、機能性、ユーザビリティの5つの観点から
                    自動・手動チェックを実施し、最終的な品質スコアを算出します。
                  </p>

                  <div className="grid md:grid-cols-5 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl mb-1">🎨</div>
                      <div className="text-sm font-medium text-blue-700">
                        デザイン
                      </div>
                      <div className="text-xs text-blue-600">
                        一貫性・カラー
                      </div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl mb-1">♿</div>
                      <div className="text-sm font-medium text-green-700">
                        アクセシビリティ
                      </div>
                      <div className="text-xs text-green-600">WCAG 2.1 AA</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl mb-1">⚡</div>
                      <div className="text-sm font-medium text-yellow-700">
                        パフォーマンス
                      </div>
                      <div className="text-xs text-yellow-600">
                        Core Web Vitals
                      </div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl mb-1">🔧</div>
                      <div className="text-sm font-medium text-purple-700">
                        機能性
                      </div>
                      <div className="text-xs text-purple-600">
                        19ページ実装
                      </div>
                    </div>
                    <div className="text-center p-3 bg-pink-50 rounded-lg">
                      <div className="text-2xl mb-1">👥</div>
                      <div className="text-sm font-medium text-pink-700">
                        ユーザビリティ
                      </div>
                      <div className="text-xs text-pink-600">UXテスト</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 品質チェッカー */}
            <FinalQualityChecker onReportGenerated={handleReportGenerated} />
          </div>

          {/* サイドバー - 履歴 */}
          {showHistory && (
            <div className="lg:col-span-4">
              <div className="bg-white border border-wb-wood-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-wb-wood-800 mb-4">
                  📈 品質チェック履歴
                </h3>

                {reports.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <span className="text-4xl block mb-2">📋</span>
                    <p className="text-sm">まだレポートがありません</p>
                    <p className="text-xs">品質チェックを実行してください</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report, index) => {
                      const grade = getScoreGrade(report.overallScore);
                      return (
                        <div
                          key={index}
                          className={`border rounded-lg p-4 ${grade.bg}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`text-lg font-bold ${grade.color}`}
                              >
                                {grade.grade}
                              </span>
                              <span
                                className={`text-xl font-bold ${grade.color}`}
                              >
                                {report.overallScore}点
                              </span>
                            </div>
                            <button
                              onClick={() => exportReport(report)}
                              className="text-xs px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                            >
                              📥 Export
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between">
                              <span>合格:</span>
                              <span className="text-green-600 font-medium">
                                {report.passedChecks}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>警告:</span>
                              <span className="text-yellow-600 font-medium">
                                {report.warningChecks}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>不合格:</span>
                              <span className="text-red-600 font-medium">
                                {report.failedChecks}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>総数:</span>
                              <span className="text-gray-600 font-medium">
                                {report.totalChecks}
                              </span>
                            </div>
                          </div>

                          {report.recommendations.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <div className="text-xs text-gray-600">
                                💡 {report.recommendations.length}件の改善提案
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 品質基準 */}
              <div className="bg-white border border-wb-wood-200 rounded-lg p-6 shadow-sm mt-6">
                <h3 className="text-lg font-semibold text-wb-wood-800 mb-4">
                  📏 品質基準
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 font-bold">A+</span>
                      <span className="text-sm text-green-700">優秀</span>
                    </div>
                    <span className="text-sm text-green-600">90-100点</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 font-bold">A</span>
                      <span className="text-sm text-green-700">良好</span>
                    </div>
                    <span className="text-sm text-green-600">80-89点</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-600 font-bold">B</span>
                      <span className="text-sm text-yellow-700">普通</span>
                    </div>
                    <span className="text-sm text-yellow-600">70-79点</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-orange-600 font-bold">C</span>
                      <span className="text-sm text-orange-700">要改善</span>
                    </div>
                    <span className="text-sm text-orange-600">60-69点</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-red-600 font-bold">D</span>
                      <span className="text-sm text-red-700">不合格</span>
                    </div>
                    <span className="text-sm text-red-600">0-59点</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="text-sm text-blue-800 font-medium mb-1">
                    🎯 目標スコア
                  </div>
                  <div className="text-xs text-blue-700">
                    • 総合スコア: 80点以上
                    <br />
                    • 各カテゴリ: 75点以上
                    <br />• 不合格項目: 0件
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
