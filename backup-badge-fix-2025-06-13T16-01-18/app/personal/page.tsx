'use client';

import { PersonalInfoGenerator } from '../../components/PersonalInfoGenerator';

export default function PersonalInfoPage() {
  return (
    <div className="min-h-screen bg-wb-wood-50">
      {/* ワークベンチヘッダー */}
      <div className="sticky top-0 z-10 bg-wb-wood-100 border-b-2 border-wb-wood-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔧</span>
              <div>
                <h1 className="text-lg font-bold text-wb-wood-800">
                  個人情報生成工具
                </h1>
                <p className="text-sm text-wb-wood-600">
                  🔍 接合工具 - データ組み立て専用
                </p>
              </div>
            </div>
            <div className="text-sm text-wb-wood-500">Quality Workbench</div>
          </div>
        </div>
      </div>

      {/* ワークベンチメインエリア */}
      <div className="wb-workbench-surface max-w-7xl mx-auto px-4 py-6 lg:px-8">
        <PersonalInfoGenerator />
      </div>

      {/* 工具説明フッター */}
      <div className="bg-wb-wood-100 border-t border-wb-wood-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-lg font-medium text-wb-wood-800 mb-2">
            🔧 個人情報生成工具について
          </h3>
          <p className="text-wb-wood-600 max-w-3xl mx-auto">
            この工具は、テスト用の個人情報データを安全に生成します。接合工具として、
            複数のデータ要素を組み合わせて実用的なテストデータを作成します。
          </p>
        </div>
      </div>
    </div>
  );
}
