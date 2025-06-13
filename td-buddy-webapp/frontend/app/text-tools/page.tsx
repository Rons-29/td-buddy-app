'use client';

import BrewCharacter from '../../components/BrewCharacter';
import { TextToolsContainer } from '../../components/TextToolsContainer';

export default function TextToolsPage() {
  return (
    <div className="min-h-screen bg-wb-wood-50">
      {/* ワークベンチヘッダー */}
      <div className="sticky top-0 z-10 bg-wb-wood-100 border-b-2 border-wb-wood-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">✨</span>
              <div>
                <h1 className="text-lg font-bold text-wb-wood-800">
                  Quality Workbench
                </h1>
                <p className="text-sm text-wb-wood-600">
                  ✨ 仕上げ工具 - テキスト生成・文字処理専用
                </p>
              </div>
            </div>
            <div className="text-sm text-wb-wood-500">Brew's Workshop</div>
          </div>
        </div>
      </div>

      {/* ワークベンチメインエリア */}
      <div className="wb-workbench-surface max-w-7xl mx-auto px-4 py-6 lg:px-8">
        <div className="space-y-6">
          {/* ワークベンチヘッダー */}
          <div className="wb-workbench-header">
            <div className="flex items-center justify-center space-x-4">
              <div className="p-3 bg-wb-tool-polish-500 rounded-full shadow-lg">
                <span className="text-2xl text-white">📝</span>
              </div>
              <div className="text-center">
                <h1 className="wb-tool-title text-wb-wood-800">
                  📝 テキスト生成工具
                </h1>
                <p className="wb-tool-description text-wb-wood-600">
                  高品質なテキストデータを生成・解析・変換する仕上げ工具
                </p>
              </div>
            </div>
          </div>

          {/* Brewキャラクターセクション */}
          <div className="wb-character-section">
            <BrewCharacter
              message="テキスト処理はBrewにお任せください！文字の魔法をかけましょう✨"
              emotion="excited"
            />
          </div>

          {/* メインツールエリア */}
          <div className="wb-tool-panel wb-tool-polish">
            <TextToolsContainer />
          </div>
        </div>
      </div>

      {/* 工具説明フッター */}
      <div className="bg-wb-wood-100 border-t border-wb-wood-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-lg font-medium text-wb-wood-800 mb-2">
            ✨ テキスト生成工具について
          </h3>
          <p className="text-wb-wood-600 max-w-2xl mx-auto">
            文字・テキスト関連の処理に特化した仕上げ工具です。
            生成、カウント、解析、変換の4つの機能で、あらゆるテキストデータのニーズに対応します。
          </p>
        </div>
      </div>
    </div>
  );
}
