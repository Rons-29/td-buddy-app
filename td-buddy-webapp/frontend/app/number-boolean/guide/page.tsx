'use client';

import { useState } from 'react';
import { numberbooleanUseCases } from '../../../data/numberbooleanUseCases';

export default function NumberBooleanGuidePage() {
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'すべて', icon: '🌟' },
    { id: 'testing', name: 'テスト', icon: '🧪' },
    { id: 'development', name: '開発', icon: '🔧' },
    { id: 'database', name: 'DB', icon: '🗄️' },
    { id: 'business', name: 'ビジネス', icon: '📈' },
    { id: 'performance', name: 'パフォーマンス', icon: '⚡' },
    { id: 'analysis', name: '分析', icon: '🔬' },
  ];

  const filteredUseCases =
    selectedCategory === 'all'
      ? numberbooleanUseCases
      : numberbooleanUseCases.filter(
          useCase => useCase.category === selectedCategory
        );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                📚 数値・真偽値生成ガイド
              </h1>
            </div>
            <nav className="flex space-x-4">
              <a
                href="/number-boolean"
                className="text-green-600 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                生成ツールに戻る
              </a>
              <a
                href="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                ホーム
              </a>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* イントロダクション */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-6xl">🤖</div>
            <div>
              <h2 className="text-2xl font-bold text-green-900 mb-3">
                TDくんの数値・真偽値生成ガイド
              </h2>
              <p className="text-green-800 mb-4">
                こんにちは！TDです♪
                数値・真偽値生成機能の使い方を詳しく説明します。
                実際のユースケースとベストプラクティスを学んで、効率的なテストデータ生成をマスターしましょう！
              </p>
              <div className="bg-white border border-green-300 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">
                  🎯 このガイドで学べること
                </h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• 各データタイプの特徴と使い分け</li>
                  <li>• 実践的なユースケースと活用例</li>
                  <li>• 効率的な設定方法とコツ</li>
                  <li>• トラブルシューティングと注意点</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* データタイプ説明 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            🔢 対応データタイプ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                integer (整数)
              </h3>
              <p className="text-sm text-gray-600">カウンター、ID、年齢など</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl mb-2">🌊</div>
              <h3 className="font-semibold text-gray-900 mb-2">float (小数)</h3>
              <p className="text-sm text-gray-600">測定値、スコア、座標など</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                percentage (パーセンテージ)
              </h3>
              <p className="text-sm text-gray-600">
                進捗率、成功率、割引率など
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl mb-2">💰</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                currency (通貨)
              </h3>
              <p className="text-sm text-gray-600">価格、売上、予算など</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl mb-2">🔬</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                scientific (科学記法)
              </h3>
              <p className="text-sm text-gray-600">
                物理定数、大数、極小数など
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl mb-2">⚖️</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                boolean (真偽値)
              </h3>
              <p className="text-sm text-gray-600">
                フラグ、状態、有効/無効など
              </p>
            </div>
          </div>
        </div>

        {/* カテゴリフィルター */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            🎯 ユースケース別ガイド
          </h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* ユースケース一覧 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredUseCases.map(useCase => (
              <div
                key={useCase.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{useCase.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {useCase.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full border ${getDifficultyColor(
                      useCase.difficulty
                    )}`}
                  >
                    {useCase.difficulty}
                  </span>
                </div>

                {/* シナリオ情報 */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    📋 シナリオ
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">課題:</span>
                      <span className="text-gray-600 ml-1">
                        {useCase.scenario.problem}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">解決:</span>
                      <span className="text-gray-600 ml-1">
                        {useCase.scenario.solution}
                      </span>
                    </div>
                  </div>
                </div>

                {/* メリット */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    ✅ メリット
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {useCase.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 詳細表示ボタン */}
                <button
                  onClick={() =>
                    setSelectedUseCase(
                      selectedUseCase === useCase.id ? null : useCase.id
                    )
                  }
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {selectedUseCase === useCase.id
                    ? '詳細を隠す'
                    : '実装例を見る'}
                </button>

                {/* 詳細内容 */}
                {selectedUseCase === useCase.id && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    {useCase.examples.map((example, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">
                          {example.title}
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <span className="text-xs text-red-600 font-medium">
                              BEFORE
                            </span>
                            <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-800 font-mono">
                              {example.before}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-green-600 font-medium">
                              AFTER
                            </span>
                            <div className="bg-green-50 border border-green-200 rounded p-2 text-xs text-green-800 font-mono">
                              {example.after}
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-blue-600 font-medium">
                            実装例
                          </span>
                          <pre className="bg-gray-800 text-gray-200 rounded p-3 text-xs overflow-x-auto">
                            <code>{example.code}</code>
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ベストプラクティス */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center gap-2">
            ⭐ TDのベストプラクティス
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-900 mb-3">
                🎯 効果的な使い方
              </h3>
              <ul className="text-sm text-green-800 space-y-2">
                <li>• プリセットから始めて、必要に応じてカスタマイズ</li>
                <li>• 大量データが必要な場合は段階的に生成</li>
                <li>• 統計的な分散を考慮した範囲設定</li>
                <li>• 用途に応じた適切な精度設定</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-900 mb-3">⚠️ 注意点</h3>
              <ul className="text-sm text-green-800 space-y-2">
                <li>• 本番データと混在させない</li>
                <li>• 大量生成時はブラウザの負荷に注意</li>
                <li>• 特殊値使用時のエラーハンドリング</li>
                <li>• セキュリティ要件の確認</li>
              </ul>
            </div>
          </div>
        </div>

        {/* TDからのメッセージ */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🤖</div>
            <div>
              <h3 className="font-semibold text-purple-900 mb-2">
                TDからの最終メッセージ
              </h3>
              <p className="text-purple-800 mb-4">
                数値・真偽値生成は、テストデータ作成の基本中の基本です！
                このガイドを参考に、効率的で品質の高いテストデータを作成してくださいね。
              </p>
              <div className="bg-white border border-purple-300 rounded-lg p-4">
                <p className="text-sm text-purple-800">
                  <strong>🚀 次のステップ:</strong>
                  <br />
                  実際にツールを使って、様々なパターンのデータを生成してみましょう！
                  困ったときは、いつでもTDに相談してくださいね♪
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
