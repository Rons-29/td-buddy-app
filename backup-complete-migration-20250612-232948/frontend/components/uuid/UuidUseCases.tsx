import { useState } from 'react';
import { getCategorizedUseCases, uuidUseCases, type UuidUseCase } from '../../data/uuidUseCases';

interface UuidUseCasesProps {
  className?: string;
}

export function UuidUseCases({ className = '' }: UuidUseCasesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUseCase, setSelectedUseCase] = useState<UuidUseCase | null>(null);
  const { categories, categorized } = getCategorizedUseCases();

  const filteredUseCases = selectedCategory === 'all' 
    ? uuidUseCases 
    : categorized[selectedCategory] || [];

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border border-td-gray-200 ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-td-gray-800 mb-2">
          🎯 UUID活用事例
        </h3>
        <p className="text-td-gray-600">
          UUIDがどのような場面で使われるのか、具体的な事例とサンプルコードをご紹介します。
        </p>
      </div>

      {/* カテゴリーフィルター */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-brew-primary-100 text-brew-primary-800 border-2 border-brew-primary-300 shadow-sm'
                : 'bg-td-gray-100 text-td-gray-700 hover:bg-td-gray-200 hover:shadow-sm'
            }`}
          >
            すべて ({uuidUseCases.length})
          </button>
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === key
                  ? 'bg-brew-primary-100 text-brew-primary-800 border-2 border-brew-primary-300 shadow-sm'
                  : 'bg-td-gray-100 text-td-gray-700 hover:bg-td-gray-200 hover:shadow-sm'
              }`}
            >
              {category.icon} {category.name} ({categorized[key]?.length || 0})
            </button>
          ))}
        </div>
      </div>

      {/* 活用事例一覧 */}
      <div className="space-y-4">
        {filteredUseCases.map((useCase) => (
          <div
            key={useCase.id}
            className="border border-td-gray-200 rounded-xl p-6 hover:border-brew-primary-300 hover:shadow-md transition-all duration-200 bg-white"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-td-gray-800 mb-2">
                  {categories[useCase.category]?.icon} {useCase.title}
                </h4>
                <p className="text-td-gray-600 text-sm mb-3">
                  {useCase.description}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="bg-td-secondary-100 text-td-secondary-800 px-3 py-1 rounded-full font-medium">
                    推奨: UUID {useCase.recommendedVersion}
                  </span>
                  <span className="bg-td-gray-100 text-td-gray-700 px-3 py-1 rounded-full">
                    {categories[useCase.category]?.name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedUseCase(selectedUseCase?.id === useCase.id ? null : useCase)}
                className="ml-6 px-4 py-2 text-sm bg-brew-primary-500 text-white rounded-lg hover:bg-brew-primary-600 focus:ring-2 focus:ring-td-primary-200 transition-all duration-200 font-medium shadow-sm hover:shadow"
              >
                {selectedUseCase?.id === useCase.id ? '閉じる' : '詳細'}
              </button>
            </div>

            {/* 詳細表示 */}
            {selectedUseCase?.id === useCase.id && (
              <div className="mt-6 border-t border-td-gray-200 pt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* シナリオと効果 */}
                  <div>
                    <h5 className="font-semibold text-td-gray-800 mb-3">📋 利用シナリオ</h5>
                    <p className="text-sm text-td-gray-600 mb-6 leading-relaxed">
                      {useCase.scenario}
                    </p>

                    <h5 className="font-semibold text-td-gray-800 mb-3">✨ 導入効果</h5>
                    <ul className="text-sm text-td-gray-600 space-y-2">
                      {useCase.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-td-secondary-500 mr-3 mt-0.5">✓</span>
                          <span className="leading-relaxed">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Before/After */}
                  <div>
                    <h5 className="font-semibold text-td-gray-800 mb-3">🔄 Before/After</h5>
                    <div className="space-y-4">
                      {useCase.beforeExample && (
                        <div className="bg-td-error-50 border border-td-error-200 rounded-lg p-4">
                          <p className="text-sm font-medium text-td-error-800 mb-2">❌ 従来の方法</p>
                          <code className="text-sm text-td-error-700 font-mono">{useCase.beforeExample}</code>
                        </div>
                      )}
                      
                      <div className="bg-brew-primary-50 border border-brew-primary-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-brew-primary-800 mb-2">🔑 UUID使用例</p>
                        <code className="text-sm text-brew-primary-700 break-all font-mono">{useCase.uuidExample}</code>
                      </div>
                      
                      {useCase.afterExample && (
                        <div className="bg-td-secondary-50 border border-td-secondary-200 rounded-lg p-4">
                          <p className="text-sm font-medium text-td-secondary-800 mb-2">✅ 改善後</p>
                          <code className="text-sm text-td-secondary-700 font-mono">{useCase.afterExample}</code>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* コードサンプル */}
                <div className="mt-8 col-span-full">
                  <h5 className="font-semibold text-td-gray-800 mb-3">
                    💻 サンプルコード ({useCase.codeExample?.language || 'Code'})
                  </h5>
                  <div className="bg-td-gray-900 rounded-xl p-6 overflow-x-auto border border-td-gray-700">
                    <pre className="text-sm text-td-gray-100">
                      <code className="font-mono">{useCase.codeExample?.code}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredUseCases.length === 0 && (
        <div className="text-center py-12 text-td-gray-500">
          <div className="text-4xl mb-4">🔍</div>
          <p>選択されたカテゴリーには活用事例がありません。</p>
        </div>
      )}

      {/* ブリューからのメッセージ */}
      <div className="mt-8 bg-brew-primary-50 border border-brew-primary-200 rounded-xl p-6">
        <div className="flex items-start">
          <div className="text-3xl mr-4">🍺</div>
          <div>
            <p className="text-sm text-brew-primary-800 font-semibold mb-2">ブリューからのアドバイス</p>
            <p className="text-sm text-brew-primary-700 leading-relaxed">
              UUIDは一意性が保証された便利な識別子です！用途に応じて適切なバージョンを選択し、
              セキュリティを向上させましょう。どの活用事例も実際のプロジェクトで活用できます♪
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 