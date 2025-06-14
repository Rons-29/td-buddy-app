'use client';

import { useState } from 'react';
import ResponsiveTestRunner from '../../components/ui/ResponsiveTestRunner';

export default function ResponsiveTestPage() {
  const [testHistory, setTestHistory] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-wb-wood-50">
      {/* ワークベンチヘッダー */}
      <div className="sticky top-0 z-10 bg-wb-wood-100 border-b-2 border-wb-wood-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📱</span>
              <div>
                <h1 className="text-lg font-bold text-wb-wood-800">
                  レスポンシブデザインテスト工具
                </h1>
                <p className="text-sm text-wb-wood-600">
                  📏 測定工具 - デバイス別表示・操作性チェック専用
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* テストランナー */}
        <ResponsiveTestRunner autoTest={false} showPreview={true} />

        {/* レスポンシブデザインガイド */}
        <div className="bg-white border border-wb-wood-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-wb-wood-800 mb-4">
            📚 レスポンシブデザインガイド
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-wb-wood-700 mb-3 flex items-center space-x-2">
                <span>📱</span>
                <span>モバイル (〜768px)</span>
              </h3>
              <ul className="text-sm text-wb-wood-600 space-y-2">
                <li>• タッチターゲット: 44px以上</li>
                <li>• フォントサイズ: 14px以上</li>
                <li>• 単一カラムレイアウト</li>
                <li>• ハンバーガーメニュー</li>
                <li>• スワイプジェスチャー対応</li>
                <li>• 縦向き最適化</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-wb-wood-700 mb-3 flex items-center space-x-2">
                <span>📱</span>
                <span>タブレット (768px〜1024px)</span>
              </h3>
              <ul className="text-sm text-wb-wood-600 space-y-2">
                <li>• 2カラムレイアウト</li>
                <li>• タッチ・マウス両対応</li>
                <li>• 中間サイズの画像</li>
                <li>• サイドバー表示</li>
                <li>• 横向き対応</li>
                <li>• ドラッグ&ドロップ</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-wb-wood-700 mb-3 flex items-center space-x-2">
                <span>🖥️</span>
                <span>デスクトップ (1024px〜)</span>
              </h3>
              <ul className="text-sm text-wb-wood-600 space-y-2">
                <li>• マルチカラムレイアウト</li>
                <li>• ホバーエフェクト</li>
                <li>• 大きな画像表示</li>
                <li>• キーボードショートカット</li>
                <li>• 詳細情報表示</li>
                <li>• 高解像度対応</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ブレークポイント情報 */}
        <div className="bg-white border border-wb-wood-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-wb-wood-800 mb-4">
            📐 Quality Workbench ブレークポイント
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-wb-wood-700 mb-3">
                🎯 標準ブレークポイント
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>xs (Extra Small)</span>
                  <span className="font-mono">0px - 575px</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>sm (Small)</span>
                  <span className="font-mono">576px - 767px</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>md (Medium)</span>
                  <span className="font-mono">768px - 991px</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>lg (Large)</span>
                  <span className="font-mono">992px - 1199px</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>xl (Extra Large)</span>
                  <span className="font-mono">1200px+</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-wb-wood-700 mb-3">
                🛠️ Tailwind CSS クラス
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-blue-50 rounded">
                  <span>デフォルト</span>
                  <span className="font-mono">class="..."</span>
                </div>
                <div className="flex justify-between p-2 bg-blue-50 rounded">
                  <span>Small以上</span>
                  <span className="font-mono">sm:class="..."</span>
                </div>
                <div className="flex justify-between p-2 bg-blue-50 rounded">
                  <span>Medium以上</span>
                  <span className="font-mono">md:class="..."</span>
                </div>
                <div className="flex justify-between p-2 bg-blue-50 rounded">
                  <span>Large以上</span>
                  <span className="font-mono">lg:class="..."</span>
                </div>
                <div className="flex justify-between p-2 bg-blue-50 rounded">
                  <span>Extra Large以上</span>
                  <span className="font-mono">xl:class="..."</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* テストチェックリスト */}
        <div className="bg-white border border-wb-wood-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-wb-wood-800 mb-4">
            ✅ レスポンシブテストチェックリスト
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-wb-wood-700 mb-3">
                📱 モバイル確認項目
              </h3>
              <ul className="text-sm text-wb-wood-600 space-y-2">
                <li className="flex items-start space-x-2">
                  <span>☐</span>
                  <span>横スクロールが発生しない</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>☐</span>
                  <span>タッチターゲットが44px以上</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>☐</span>
                  <span>フォントが読みやすいサイズ</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>☐</span>
                  <span>ナビゲーションが使いやすい</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>☐</span>
                  <span>フォームが入力しやすい</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>☐</span>
                  <span>画像が適切にリサイズ</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-wb-wood-700 mb-3">
                🖥️ デスクトップ確認項目
              </h3>
              <ul className="text-sm text-wb-wood-600 space-y-2">
                <li className="flex items-start space-x-2">
                  <span>☐</span>
                  <span>レイアウトが適切に配置</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>☐</span>
                  <span>ホバーエフェクトが動作</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>☐</span>
                  <span>キーボード操作が可能</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>☐</span>
                  <span>大画面で見やすい</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>☐</span>
                  <span>高解像度で鮮明</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>☐</span>
                  <span>コンテンツが中央配置</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
