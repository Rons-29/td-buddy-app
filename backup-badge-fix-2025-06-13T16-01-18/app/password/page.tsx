'use client';

import { PasswordGenerator } from '../../components/PasswordGenerator';

export default function PasswordPage() {
  return (
    <div className="min-h-screen bg-wb-wood-50">
      {/* ワークベンチヘッダー */}
      <div className="bg-white border-b border-wb-wood-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🔐</div>
            <div>
              <h1 className="text-xl font-bold text-wb-wood-800">
                パスワード生成工具
              </h1>
              <p className="text-sm text-wb-tool-inspect-600">
                🔍 検査工具 | セキュアで強力なパスワードを丁寧に生成
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ワークベンチメインエリア */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="wb-workbench-surface">
          <PasswordGenerator />
        </div>
      </div>

      {/* 工具説明フッター */}
      <div className="bg-wb-tool-inspect-50 border-t border-wb-tool-inspect-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h3 className="font-semibold text-wb-tool-inspect-800 mb-2">
              🔍 検査工具について
            </h3>
            <p className="text-sm text-wb-tool-inspect-600 max-w-2xl mx-auto">
              この工具は、セキュリティテストに必要な高品質なパスワードを生成します。
              構成プリセット機能により、様々なセキュリティ要件に対応した
              実用的なパスワードを効率的に作成できます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
