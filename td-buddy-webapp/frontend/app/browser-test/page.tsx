import {
  BrowserCompatibilityInfo,
  BrowserCompatibilityTest,
} from '@/components/ui/browser-compatibility-test';

export default function BrowserTestPage() {
  return (
    <div className="min-h-screen bg-wb-wood-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-wb-wood-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🧪</div>
            <div>
              <h1 className="text-xl font-bold text-wb-wood-800">
                ブラウザ互換性テスト
              </h1>
              <p className="text-sm text-wb-wood-600">
                Quality Workbenchの動作環境を確認
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* 説明セクション */}
          <div className="wb-card-mobile">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-xl">🎯</span>
              <h2 className="font-semibold text-wb-wood-800">テストについて</h2>
            </div>
            <div className="space-y-2 text-sm text-wb-wood-600">
              <p>
                このページでは、お使いのブラウザがQuality
                Workbenchの機能を正常に実行できるかを確認します。
              </p>
              <p>
                テストは自動的に実行され、重要な機能の対応状況と推奨事項を表示します。
              </p>
            </div>
          </div>

          {/* 互換性テスト */}
          <BrowserCompatibilityTest />

          {/* 開発者向け情報 */}
          <BrowserCompatibilityInfo />

          {/* 追加情報 */}
          <div className="wb-card-mobile">
            <h3 className="font-semibold text-wb-wood-800 mb-3 flex items-center">
              <span className="text-xl mr-2">📋</span>
              トラブルシューティング
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium text-wb-wood-700 mb-1">
                  互換性スコアが低い場合
                </h4>
                <ul className="space-y-1 text-wb-wood-600 ml-4">
                  <li>• ブラウザを最新版に更新してください</li>
                  <li>
                    • 推奨ブラウザ（Chrome、Firefox、Edge）をご利用ください
                  </li>
                  <li>• JavaScriptが有効になっていることを確認してください</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-wb-wood-700 mb-1">
                  重要な機能で問題が発生した場合
                </h4>
                <ul className="space-y-1 text-wb-wood-600 ml-4">
                  <li>• ページを再読み込みしてください</li>
                  <li>• ブラウザのキャッシュをクリアしてください</li>
                  <li>• 拡張機能を無効にして再度テストしてください</li>
                  <li>• プライベートブラウジングモードで試してください</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-wb-wood-700 mb-1">
                  モバイルデバイスでの問題
                </h4>
                <ul className="space-y-1 text-wb-wood-600 ml-4">
                  <li>• 画面の向きを変更してみてください</li>
                  <li>• ブラウザアプリを最新版に更新してください</li>
                  <li>• デバイスの空き容量を確認してください</li>
                </ul>
              </div>
            </div>
          </div>

          {/* フィードバック */}
          <div className="wb-card-mobile bg-wb-wood-100">
            <h3 className="font-semibold text-wb-wood-800 mb-3 flex items-center">
              <span className="text-xl mr-2">💬</span>
              フィードバック
            </h3>
            <div className="text-sm text-wb-wood-600">
              <p className="mb-2">
                互換性テストで問題が発生した場合や、改善のご提案がございましたら、
                開発チームまでお知らせください。
              </p>
              <p>
                皆様のフィードバックにより、Quality
                Workbenchをより良いツールに改善していきます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
