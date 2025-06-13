import Link from 'next/link';
import {
  MobileQuickAccess,
  MobileToolCard,
} from '../components/ui/mobile-navigation';

export default function Home() {
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
                  Quality Workbench
                </h1>
                <p className="text-sm text-wb-wood-600">
                  🔧 統合工具 - ダッシュボード・統合管理専用
                </p>
              </div>
            </div>
            <div className="text-sm text-wb-wood-500">Brew's Workshop</div>
          </div>
        </div>
      </div>

      {/* ワークベンチメインエリア */}
      <div className="wb-workbench-surface max-w-7xl mx-auto px-4 py-6 lg:px-8">
        <div className="space-y-8">
          {/* ワークベンチヘッダー */}
          <div className="wb-workbench-header">
            <div className="flex items-center justify-center space-x-4">
              <div className="p-3 bg-wb-tool-join-500 rounded-full shadow-lg">
                <span className="text-2xl text-white">🍺</span>
              </div>
              <div className="text-center">
                <h1 className="wb-tool-title text-wb-wood-800">
                  🍺 Brewのワークベンチへようこそ
                </h1>
                <p className="wb-tool-description text-wb-wood-600">
                  高品質なテストデータを生成する5つの専門工具で、最高のQA体験を提供します
                </p>
              </div>
            </div>
          </div>

          {/* モバイル専用クイックアクセス */}
          <MobileQuickAccess />

          {/* 工具カテゴリ紹介 */}
          <div className="wb-tool-panel">
            <div className="wb-tool-panel-header">
              <h2 className="wb-tool-panel-title">🛠️ 5つの専門工具カテゴリ</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-wb-tool-inspect-50 rounded-lg border border-wb-tool-inspect-200">
                <div className="text-3xl mb-2">🔍</div>
                <div className="font-medium text-wb-tool-inspect-700 mb-1">
                  検査工具
                </div>
                <div className="text-sm text-wb-tool-inspect-600">
                  セキュリティ・認証
                </div>
              </div>
              <div className="text-center p-4 bg-wb-tool-join-50 rounded-lg border border-wb-tool-join-200">
                <div className="text-3xl mb-2">🔧</div>
                <div className="font-medium text-wb-tool-join-700 mb-1">
                  結合工具
                </div>
                <div className="text-sm text-wb-tool-join-600">
                  データ統合・組立
                </div>
              </div>
              <div className="text-center p-4 bg-wb-tool-measure-50 rounded-lg border border-wb-tool-measure-200">
                <div className="text-3xl mb-2">📏</div>
                <div className="font-medium text-wb-tool-measure-700 mb-1">
                  測定工具
                </div>
                <div className="text-sm text-wb-tool-measure-600">
                  数値・構造・計測
                </div>
              </div>
              <div className="text-center p-4 bg-wb-tool-polish-50 rounded-lg border border-wb-tool-polish-200">
                <div className="text-3xl mb-2">✨</div>
                <div className="font-medium text-wb-tool-polish-700 mb-1">
                  仕上げ工具
                </div>
                <div className="text-sm text-wb-tool-polish-600">
                  AI・品質向上
                </div>
              </div>
              <div className="text-center p-4 bg-wb-tool-cut-50 rounded-lg border border-wb-tool-cut-200">
                <div className="text-3xl mb-2">🎨</div>
                <div className="font-medium text-wb-tool-cut-700 mb-1">
                  研磨工具
                </div>
                <div className="text-sm text-wb-tool-cut-600">
                  エンターテイメント
                </div>
              </div>
            </div>
          </div>

          {/* メイン工具カード */}
          <div className="wb-tool-panel">
            <div className="wb-tool-panel-header">
              <h2 className="wb-tool-panel-title">🔧 利用可能な工具</h2>
            </div>

            {/* デスクトップ・タブレット用グリッド */}
            <div className="hidden md:block">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* 検査工具 */}
                <Link
                  href="/password"
                  className="wb-tool-card wb-tool-inspect group"
                >
                  <div className="wb-tool-card-icon">🔐</div>
                  <h3 className="wb-tool-card-title">パスワード生成</h3>
                  <p className="wb-tool-card-description">
                    セキュアで強力なパスワードを生成。文字種・長さ・複雑さを自由に設定できます。
                  </p>
                  <div className="wb-tool-card-category">🔍 検査工具</div>
                </Link>

                <Link
                  href="/uuid"
                  className="wb-tool-card wb-tool-inspect group"
                >
                  <div className="wb-tool-card-icon">🆔</div>
                  <h3 className="wb-tool-card-title">UUID生成</h3>
                  <p className="wb-tool-card-description">
                    一意識別子（UUID）を各バージョン形式で生成。システム間連携に最適です。
                  </p>
                  <div className="wb-tool-card-category">🔍 検査工具</div>
                </Link>

                {/* 結合工具 */}
                <Link
                  href="/personal"
                  className="wb-tool-card wb-tool-join group"
                >
                  <div className="wb-tool-card-icon">👤</div>
                  <h3 className="wb-tool-card-title">個人情報生成</h3>
                  <p className="wb-tool-card-description">
                    テスト用の個人情報データを生成。GDPR準拠で安全なダミーデータを提供します。
                  </p>
                  <div className="wb-tool-card-category">🔧 結合工具</div>
                </Link>

                <Link
                  href="/practical-data"
                  className="wb-tool-card wb-tool-join group"
                >
                  <div className="wb-tool-card-icon">📊</div>
                  <h3 className="wb-tool-card-title">実用データ生成</h3>
                  <p className="wb-tool-card-description">
                    実際のテストで使える実用的なデータセットを生成。業務シナリオに対応します。
                  </p>
                  <div className="wb-tool-card-category">🔧 結合工具</div>
                </Link>

                {/* 測定工具 */}
                <Link
                  href="/number-boolean"
                  className="wb-tool-card wb-tool-measure group"
                >
                  <div className="wb-tool-card-icon">🔢</div>
                  <h3 className="wb-tool-card-title">数値・真偽値</h3>
                  <p className="wb-tool-card-description">
                    数値データと真偽値を生成。統計的分布や範囲指定に対応しています。
                  </p>
                  <div className="wb-tool-card-category">📏 測定工具</div>
                </Link>

                <Link
                  href="/csv-detailed"
                  className="wb-tool-card wb-tool-measure group"
                >
                  <div className="wb-tool-card-icon">📋</div>
                  <h3 className="wb-tool-card-title">CSV生成</h3>
                  <p className="wb-tool-card-description">
                    構造化されたCSVデータを生成。カスタムスキーマとデータ型に対応します。
                  </p>
                  <div className="wb-tool-card-category">📏 測定工具</div>
                </Link>

                <Link
                  href="/datetime"
                  className="wb-tool-card wb-tool-measure group"
                >
                  <div className="wb-tool-card-icon">📅</div>
                  <h3 className="wb-tool-card-title">日時生成</h3>
                  <p className="wb-tool-card-description">
                    日付・時刻データを生成。タイムゾーン・フォーマット・範囲指定に対応します。
                  </p>
                  <div className="wb-tool-card-category">📏 測定工具</div>
                </Link>

                {/* 仕上げ工具 */}
                <Link
                  href="/ai-chat"
                  className="wb-tool-card wb-tool-polish group"
                >
                  <div className="wb-tool-card-icon">🤖</div>
                  <h3 className="wb-tool-card-title">AI連携</h3>
                  <p className="wb-tool-card-description">
                    自然言語でテストデータ生成を依頼。AI連携で効率的なデータ作成を実現します。
                  </p>
                  <div className="wb-tool-card-category">✨ 仕上げ工具</div>
                </Link>

                <Link
                  href="/text"
                  className="wb-tool-card wb-tool-polish group"
                >
                  <div className="wb-tool-card-icon">📝</div>
                  <h3 className="wb-tool-card-title">テキスト生成</h3>
                  <p className="wb-tool-card-description">
                    多様なテキストデータを生成。Lorem
                    ipsum、日本語文章、技術文書に対応します。
                  </p>
                  <div className="wb-tool-card-category">✨ 仕上げ工具</div>
                </Link>

                {/* 研磨工具 */}
                <Link href="/gaming" className="wb-tool-card wb-tool-cut group">
                  <div className="wb-tool-card-icon">🎮</div>
                  <h3 className="wb-tool-card-title">ゲーミング</h3>
                  <p className="wb-tool-card-description">
                    ゲーミング要素とエンターテイメント機能。楽しみながら品質向上を実現します。
                  </p>
                  <div className="wb-tool-card-category">🎨 研磨工具</div>
                </Link>

                <Link href="/export" className="wb-tool-card wb-tool-cut group">
                  <div className="wb-tool-card-icon">💾</div>
                  <h3 className="wb-tool-card-title">エクスポート</h3>
                  <p className="wb-tool-card-description">
                    生成データを多様な形式で出力。CSV、JSON、XML、SQLなど幅広く対応します。
                  </p>
                  <div className="wb-tool-card-category">🎨 研磨工具</div>
                </Link>
              </div>
            </div>

            {/* モバイル用カード */}
            <div className="md:hidden space-y-4">
              <MobileToolCard
                href="/password"
                icon="🔐"
                title="パスワード生成"
                category="🔍 検査工具"
                description="セキュアなパスワードを生成"
              />
              <MobileToolCard
                href="/personal"
                icon="👤"
                title="個人情報生成"
                category="🔧 結合工具"
                description="テスト用個人データを生成"
              />
              <MobileToolCard
                href="/csv-detailed"
                icon="📋"
                title="CSV生成"
                category="📏 測定工具"
                description="構造化CSVデータを生成"
              />
              <MobileToolCard
                href="/ai-chat"
                icon="🤖"
                title="AI連携"
                category="✨ 仕上げ工具"
                description="自然言語でデータ生成"
              />
              <MobileToolCard
                href="/gaming"
                icon="🎮"
                title="ゲーミング"
                category="🎨 研磨工具"
                description="楽しみながら品質向上"
              />
            </div>
          </div>

          {/* 統計情報 */}
          <div className="wb-tool-panel">
            <div className="wb-tool-panel-header">
              <h2 className="wb-tool-panel-title">📊 ワークベンチ統計</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-wb-wood-100 rounded-lg">
                <div className="text-2xl font-bold text-wb-wood-800 mb-1">
                  11
                </div>
                <div className="text-sm text-wb-wood-600">利用可能工具</div>
              </div>
              <div className="text-center p-4 bg-wb-wood-100 rounded-lg">
                <div className="text-2xl font-bold text-wb-wood-800 mb-1">
                  5
                </div>
                <div className="text-sm text-wb-wood-600">工具カテゴリ</div>
              </div>
              <div className="text-center p-4 bg-wb-wood-100 rounded-lg">
                <div className="text-2xl font-bold text-wb-wood-800 mb-1">
                  ∞
                </div>
                <div className="text-sm text-wb-wood-600">生成可能データ</div>
              </div>
              <div className="text-center p-4 bg-wb-wood-100 rounded-lg">
                <div className="text-2xl font-bold text-wb-wood-800 mb-1">
                  100%
                </div>
                <div className="text-sm text-wb-wood-600">品質保証</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 工具説明フッター */}
      <div className="bg-wb-wood-100 border-t border-wb-wood-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-xl font-medium text-wb-wood-800 mb-4">
            🔧 Quality Workbench について
          </h3>
          <p className="text-wb-wood-600 max-w-4xl mx-auto mb-6">
            Quality
            Workbenchは、高品質なテストデータ生成に特化した統合プラットフォームです。
            5つの専門工具カテゴリで、あらゆるテストシナリオに対応します。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl mb-2">🛠️</div>
              <h4 className="font-medium text-wb-wood-800 mb-2">専門工具</h4>
              <p className="text-sm text-wb-wood-600">
                用途別に最適化された5つの工具カテゴリで効率的なデータ生成
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🍺</div>
              <h4 className="font-medium text-wb-wood-800 mb-2">
                Brewサポート
              </h4>
              <p className="text-sm text-wb-wood-600">
                AIアシスタントBrewが最適な工具選択と使用方法をサポート
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-medium text-wb-wood-800 mb-2">高性能</h4>
              <p className="text-sm text-wb-wood-600">
                大量データ生成と高速処理で実用的なテスト環境を実現
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
