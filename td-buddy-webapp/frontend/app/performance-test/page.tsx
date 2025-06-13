'use client';

import { useState } from 'react';
import PerformanceTestRunner from '../../components/ui/PerformanceTestRunner';

export default function PerformanceTestPage() {
  const [testHistory, setTestHistory] = useState<any[]>([]);

  const handleTestComplete = (result: any) => {
    setTestHistory(prev => [result, ...prev]);
  };

  return (
    <div className="min-h-screen bg-wb-wood-50">
      {/* ワークベンチヘッダー */}
      <div className="sticky top-0 z-10 bg-wb-wood-100 border-b-2 border-wb-wood-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h1 className="text-lg font-bold text-wb-wood-800">
                  パフォーマンステスト工具
                </h1>
                <p className="text-sm text-wb-wood-600">
                  📏 測定工具 - Core Web Vitals & 最適化チェック専用
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* テストランナー */}
        <PerformanceTestRunner
          autoRun={false}
          showDetails={true}
          onTestComplete={handleTestComplete}
        />

        {/* パフォーマンスガイド */}
        <div className="bg-white border border-wb-wood-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-wb-wood-800 mb-4">
            📚 パフォーマンス最適化ガイド
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-wb-wood-700 mb-3 flex items-center space-x-2">
                <span>🎯</span>
                <span>Core Web Vitals</span>
              </h3>
              <div className="space-y-3 text-sm">
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <div className="font-medium text-green-800">
                    LCP (Largest Contentful Paint)
                  </div>
                  <div className="text-green-700">目標: 2.5秒以下</div>
                  <div className="text-green-600 text-xs mt-1">
                    最大のコンテンツ要素が表示されるまでの時間
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <div className="font-medium text-blue-800">
                    FID (First Input Delay)
                  </div>
                  <div className="text-blue-700">目標: 100ms以下</div>
                  <div className="text-blue-600 text-xs mt-1">
                    最初のユーザー操作に対する応答時間
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded p-3">
                  <div className="font-medium text-purple-800">
                    CLS (Cumulative Layout Shift)
                  </div>
                  <div className="text-purple-700">目標: 0.1以下</div>
                  <div className="text-purple-600 text-xs mt-1">
                    予期しないレイアウトシフトの累積
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-wb-wood-700 mb-3 flex items-center space-x-2">
                <span>🚀</span>
                <span>最適化のヒント</span>
              </h3>
              <ul className="text-sm text-wb-wood-600 space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>画像をWebP形式に変換し、適切なサイズに最適化</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>未使用のJavaScript・CSSを削除</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>重要なリソースをプリロード</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>CDNを使用してリソース配信を高速化</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>レイアウトシフトを避けるため画像サイズを指定</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-500 mt-1">•</span>
                  <span>遅延読み込み（Lazy Loading）を実装</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* パフォーマンス指標説明 */}
        <div className="bg-white border border-wb-wood-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-wb-wood-800 mb-4">
            📊 測定指標の詳細
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-wb-wood-700 mb-3">
                ⏱️ 読み込み時間
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <div className="font-medium">TTFB</div>
                  <div className="text-gray-600">
                    Time to First Byte - サーバーからの最初の応答時間
                  </div>
                </div>
                <div>
                  <div className="font-medium">FCP</div>
                  <div className="text-gray-600">
                    First Contentful Paint - 最初のコンテンツ表示時間
                  </div>
                </div>
                <div>
                  <div className="font-medium">DOM Content Loaded</div>
                  <div className="text-gray-600">HTMLの解析完了時間</div>
                </div>
                <div>
                  <div className="font-medium">Load Complete</div>
                  <div className="text-gray-600">
                    全リソースの読み込み完了時間
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-wb-wood-700 mb-3">
                📦 リソース情報
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <div className="font-medium">総リソース数</div>
                  <div className="text-gray-600">
                    読み込まれたファイルの総数
                  </div>
                </div>
                <div>
                  <div className="font-medium">総サイズ</div>
                  <div className="text-gray-600">全リソースの合計サイズ</div>
                </div>
                <div>
                  <div className="font-medium">JavaScript</div>
                  <div className="text-gray-600">JSファイルの合計サイズ</div>
                </div>
                <div>
                  <div className="font-medium">CSS</div>
                  <div className="text-gray-600">CSSファイルの合計サイズ</div>
                </div>
                <div>
                  <div className="font-medium">画像</div>
                  <div className="text-gray-600">画像ファイルの合計サイズ</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-wb-wood-700 mb-3">
                🧠 メモリ使用量
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <div className="font-medium">使用中ヒープ</div>
                  <div className="text-gray-600">
                    現在使用中のJavaScriptメモリ
                  </div>
                </div>
                <div>
                  <div className="font-medium">総ヒープ</div>
                  <div className="text-gray-600">
                    確保されたJavaScriptメモリ
                  </div>
                </div>
                <div>
                  <div className="font-medium">ヒープ制限</div>
                  <div className="text-gray-600">JavaScriptメモリの上限</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* テスト履歴 */}
        {testHistory.length > 0 && (
          <div className="bg-white border border-wb-wood-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-wb-wood-800 mb-4">
              📈 テスト履歴
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {testHistory.map((result, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {result.timestamp.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded font-medium ${
                          result.score >= 90
                            ? 'bg-green-100 text-green-700'
                            : result.score >= 70
                            ? 'bg-yellow-100 text-yellow-700'
                            : result.score >= 50
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {result.score}点
                      </span>
                      {result.metrics.lcp && (
                        <span className="text-gray-600">
                          LCP: {(result.metrics.lcp / 1000).toFixed(2)}s
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* パフォーマンス改善チェックリスト */}
        <div className="bg-white border border-wb-wood-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-wb-wood-800 mb-4">
            ✅ パフォーマンス改善チェックリスト
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-wb-wood-700 mb-3">
                🎯 基本最適化
              </h3>
              <ul className="text-sm text-wb-wood-600 space-y-2">
                <li className="flex items-start space-x-2">
                  <span>☐</span>
                  <span>画像を適切な形式・サイズに最適化</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>☐</span>
                  <span>未使用のCSS・JavaScriptを削除</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>☐</span>
                  <span>ファイルの圧縮（Gzip/Brotli）を有効化</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>☐</span>
                  <span>ブラウザキャッシュを適切に設定</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>☐</span>
                  <span>CDNを使用してリソース配信を高速化</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-wb-wood-700 mb-3">
                🚀 高度な最適化
              </h3>
              <ul className="text-sm text-wb-wood-600 space-y-2">
                <li className="flex items-start space-x-2">
                  <span>☐</span>
                  <span>重要なリソースをプリロード</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>☐</span>
                  <span>遅延読み込み（Lazy Loading）を実装</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>☐</span>
                  <span>コード分割でバンドルサイズを削減</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>☐</span>
                  <span>Service Workerでキャッシュ戦略を実装</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>☐</span>
                  <span>レイアウトシフトを防ぐため要素サイズを指定</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
