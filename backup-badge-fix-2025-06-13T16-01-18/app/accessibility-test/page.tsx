'use client';

import { useState } from 'react';
import AccessibilityTestRunner from '../../components/ui/AccessibilityTestRunner';

export default function AccessibilityTestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);

  const handleTestComplete = (results: any) => {
    setTestResults(prev => [results, ...prev]);
  };

  return (
    <div className="min-h-screen bg-wb-wood-50">
      {/* ワークベンチヘッダー */}
      <div className="sticky top-0 z-10 bg-wb-wood-100 border-b-2 border-wb-wood-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔍</span>
              <div>
                <h1 className="text-lg font-bold text-wb-wood-800">
                  アクセシビリティテスト工具
                </h1>
                <p className="text-sm text-wb-wood-600">
                  🔍 検査工具 - WCAG 2.1 AA準拠チェック専用
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* テストランナー */}
        <AccessibilityTestRunner
          autoRun={false}
          showResults={true}
          onTestComplete={handleTestComplete}
        />

        {/* テスト履歴 */}
        {testResults.length > 0 && (
          <div className="bg-white border border-wb-wood-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-wb-wood-800 mb-4">
              📊 テスト履歴
            </h2>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {result.timestamp.toLocaleString()}
                    </div>
                    <div className="flex space-x-4 text-sm">
                      <span className="text-red-600">
                        違反: {result.violations.length}
                      </span>
                      <span className="text-green-600">
                        合格: {result.passes.length}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* アクセシビリティガイド */}
        <div className="bg-white border border-wb-wood-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-wb-wood-800 mb-4">
            📚 アクセシビリティガイド
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-wb-wood-700 mb-2">
                🎯 チェック項目
              </h3>
              <ul className="text-sm text-wb-wood-600 space-y-1">
                <li>• 色のコントラスト比 (4.5:1以上)</li>
                <li>• キーボードナビゲーション</li>
                <li>• スクリーンリーダー対応</li>
                <li>• ARIA属性の適切な使用</li>
                <li>• 見出し構造の論理性</li>
                <li>• 画像のalt属性</li>
                <li>• フォーカス管理</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-wb-wood-700 mb-2">
                🛠️ 修正のヒント
              </h3>
              <ul className="text-sm text-wb-wood-600 space-y-1">
                <li>• ボタンには適切なaria-labelを追加</li>
                <li>• 画像には説明的なaltテキストを設定</li>
                <li>• フォームには明確なラベルを関連付け</li>
                <li>• 見出しは階層順序を守る</li>
                <li>• リンクには目的が分かるテキストを</li>
                <li>• エラーメッセージは明確に表示</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
