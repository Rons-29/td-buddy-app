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
                醸造ツールに戻る
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
            <div className="text-6xl">🍺</div>
            <div>
              <h2 className="text-2xl font-bold text-green-900 mb-3">
                ブリューの数値・真偽値生成ガイド
              </h2>
              <p className="text-green-800 mb-4">
                こんにちは！TDです♪
                数値・真偽値生成機能の使い方を詳しく説明します。
                実際のユースケースとベストプラクティスを学んで、効率的なテストデータ醸造をマスターしましょう！
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
                フラグ、状態、条件判定など
              </p>
            </div>
          </div>
        </div>

        {/* カテゴリフィルター */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            🗂️ ユースケースを探す
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                  selectedCategory === category.id
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <span className="text-2xl mb-1">{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ユースケース一覧 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredUseCases.map(useCase => (
            <div
              key={useCase.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{useCase.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {useCase.title}
                    </h3>
                    <p className="text-sm text-gray-600">{useCase.category}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(
                    useCase.difficulty
                  )}`}
                >
                  {useCase.difficulty === 'beginner' && '初級'}
                  {useCase.difficulty === 'intermediate' && '中級'}
                  {useCase.difficulty === 'advanced' && '上級'}
                </span>
              </div>

              <p className="text-gray-700 mb-4">{useCase.description}</p>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    ✅ メリット
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {useCase.benefits.map((benefit, index) => (
                      <li key={index}>• {benefit}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    🔗 対応データタイプ
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {useCase.relatedTypes.map((type, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() =>
                    setSelectedUseCase(
                      selectedUseCase === useCase.id ? null : useCase.id
                    )
                  }
                  className="w-full text-green-600 hover:text-green-700 text-sm font-medium mt-2"
                >
                  {selectedUseCase === useCase.id ? '詳細を隠す' : '詳細を表示'}{' '}
                  ▼
                </button>

                {selectedUseCase === useCase.id && (
                  <div className="border-t pt-4 space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        📝 実装例
                      </h4>
                      <div className="space-y-4">
                        {useCase.examples.map((example, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 rounded-lg p-4"
                          >
                            <h5 className="font-medium text-gray-900 mb-2">
                              {example.title}
                            </h5>
                            <div className="space-y-3">
                              <div className="bg-green-50 border border-green-200 p-3 rounded text-sm">
                                <span className="text-green-600 font-medium">
                                  AFTER (TDで生成)
                                </span>
                                <div className="text-green-800 font-mono">
                                  {example.after}
                                </div>
                              </div>
                              <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                                <span className="text-blue-600 font-medium text-sm">
                                  実装例
                                </span>
                                <pre className="text-xs text-blue-800 mt-2 overflow-x-auto">
                                  <code>{example.code}</code>
                                </pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ベストプラクティス */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-8 mt-8">
          <h2 className="text-xl font-semibold text-yellow-900 mb-4 flex items-center gap-2">
            ⭐ ブリューからのベストプラクティス
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-yellow-900 mb-3">
                🎯 効率的な設定のコツ
              </h3>
              <ul className="text-sm text-yellow-800 space-y-2">
                <li>• 境界値（最小・最大）を含めたテストデータ設計</li>
                <li>• 用途に応じた適切な分布の選択</li>
                <li>• 特殊値（0、負数、極端な値）の考慮</li>
                <li>• リアルなデータ分布の模倣</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-900 mb-3">
                ⚠️ よくある注意点
              </h3>
              <ul className="text-sm text-yellow-800 space-y-2">
                <li>• 小数点精度の設定ミス</li>
                <li>• 範囲設定での論理エラー</li>
                <li>• 型変換時の精度落ち</li>
                <li>• パフォーマンスを考慮しない大量醸造</li>
              </ul>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="text-center mt-8 py-8 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <span className="text-2xl">🍺</span>
            <span>
              ブリューと一緒に、効率的なテストデータ醸造をマスターしましょう！
            </span>
          </div>
          <div className="mt-4">
            <a
              href="/number-boolean"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              数値・真偽値醸造ツールを使う
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
