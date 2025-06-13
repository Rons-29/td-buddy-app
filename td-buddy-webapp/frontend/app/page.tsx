import Link from 'next/link';
import {
  MobileQuickAccess,
  MobileToolCard,
} from '../components/ui/mobile-navigation';

export default function Home() {
  return (
    <div className="wb-container wb-spacing-responsive">
      {/* ワークベンチヘッダー */}
      <div className="text-center mb-6 md:mb-8 lg:mb-12">
        <h1 className="wb-text-responsive font-bold text-wb-wood-800 mb-3 md:mb-4">
          🍺 Brewのワークベンチへようこそ
        </h1>
        <p className="wb-text-responsive text-wb-wood-600 max-w-2xl mx-auto px-4">
          高品質なテストデータを生成する5つの専門工具で、最高のQA体験を提供します。
          Brewと一緒に、完璧な品質を作り上げましょう！
        </p>
      </div>

      {/* モバイル専用クイックアクセス */}
      <MobileQuickAccess />

      {/* 工具カテゴリ紹介 */}
      <div className="mb-6 md:mb-8 lg:mb-12">
        <h2 className="wb-text-responsive font-semibold text-wb-wood-700 mb-4 md:mb-6 text-center">
          🛠️ 5つの専門工具カテゴリ
        </h2>
        <div className="wb-grid wb-grid-2 md:wb-grid-3 lg:wb-grid-5 gap-3 md:gap-4 lg:gap-6">
          <div className="text-center p-3 md:p-4 bg-wb-tool-inspect-50 rounded-lg">
            <div className="text-xl md:text-2xl lg:text-3xl mb-1 md:mb-2">
              🔍
            </div>
            <div className="font-medium text-wb-tool-inspect-700 text-sm md:text-base">
              検査工具
            </div>
            <div className="text-xs md:text-sm text-wb-tool-inspect-600 wb-hide-xs">
              セキュリティ
            </div>
          </div>
          <div className="text-center p-3 md:p-4 bg-wb-tool-join-50 rounded-lg">
            <div className="text-xl md:text-2xl lg:text-3xl mb-1 md:mb-2">
              🔧
            </div>
            <div className="font-medium text-wb-tool-join-700 text-sm md:text-base">
              結合工具
            </div>
            <div className="text-xs md:text-sm text-wb-tool-join-600 wb-hide-xs">
              データ統合
            </div>
          </div>
          <div className="text-center p-3 md:p-4 bg-wb-tool-measure-50 rounded-lg">
            <div className="text-xl md:text-2xl lg:text-3xl mb-1 md:mb-2">
              📏
            </div>
            <div className="font-medium text-wb-tool-measure-700 text-sm md:text-base">
              測定工具
            </div>
            <div className="text-xs md:text-sm text-wb-tool-measure-600 wb-hide-xs">
              数値・構造
            </div>
          </div>
          <div className="text-center p-3 md:p-4 bg-wb-tool-polish-50 rounded-lg">
            <div className="text-xl md:text-2xl lg:text-3xl mb-1 md:mb-2">
              ✨
            </div>
            <div className="font-medium text-wb-tool-polish-700 text-sm md:text-base">
              研磨工具
            </div>
            <div className="text-xs md:text-sm text-wb-tool-polish-600 wb-hide-xs">
              AI・テキスト
            </div>
          </div>
          <div className="text-center p-3 md:p-4 bg-wb-tool-cut-50 rounded-lg">
            <div className="text-xl md:text-2xl lg:text-3xl mb-1 md:mb-2">
              ✂️
            </div>
            <div className="font-medium text-wb-tool-cut-700 text-sm md:text-base">
              切断工具
            </div>
            <div className="text-xs md:text-sm text-wb-tool-cut-600 wb-hide-xs">
              出力・加工
            </div>
          </div>
        </div>
      </div>

      {/* メイン工具カード */}
      <div className="mb-6 md:mb-8 lg:mb-12">
        <h2 className="wb-text-responsive font-semibold text-wb-wood-700 mb-4 md:mb-6 text-center">
          🔧 利用可能な工具
        </h2>

        {/* デスクトップ・タブレット用グリッド */}
        <div className="hidden md:block">
          <div className="wb-grid wb-grid-2 lg:wb-grid-3 xl:wb-grid-4">
            {/* 検査工具 */}
            <Link
              href="/password"
              className="td-card-wb wb-tool-inspect wb-smooth-transition wb-hover-lift wb-touch-target"
            >
              <div className="wb-tool-icon text-wb-tool-inspect-600">🔐</div>
              <h3 className="wb-tool-title text-wb-tool-inspect-700">
                パスワード生成
              </h3>
              <p className="wb-tool-description text-wb-tool-inspect-600">
                セキュアで強力なパスワードを生成。文字種・長さ・複雑さを自由に設定できます。
              </p>
              <div className="mt-4 text-sm text-wb-tool-inspect-500">
                <span className="wb-tool-label">🔍 検査工具</span>
              </div>
            </Link>

            <Link
              href="/uuid"
              className="td-card-wb wb-tool-inspect wb-smooth-transition wb-hover-lift wb-touch-target"
            >
              <div className="wb-tool-icon text-wb-tool-inspect-600">🆔</div>
              <h3 className="wb-tool-title text-wb-tool-inspect-700">
                UUID生成
              </h3>
              <p className="wb-tool-description text-wb-tool-inspect-600">
                一意識別子（UUID）を各バージョン形式で生成。システム間連携に最適です。
              </p>
              <div className="mt-4 text-sm text-wb-tool-inspect-500">
                <span className="wb-tool-label">🔍 検査工具</span>
              </div>
            </Link>

            {/* 結合工具 */}
            <Link
              href="/personal"
              className="td-card-wb wb-tool-join wb-smooth-transition wb-hover-lift wb-touch-target"
            >
              <div className="wb-tool-icon text-wb-tool-join-600">👤</div>
              <h3 className="wb-tool-title text-wb-tool-join-700">
                個人情報生成
              </h3>
              <p className="wb-tool-description text-wb-tool-join-600">
                テスト用の個人情報データを生成。GDPR準拠で安全なダミーデータを提供します。
              </p>
              <div className="mt-4 text-sm text-wb-tool-join-500">
                <span className="wb-tool-label">🔧 結合工具</span>
              </div>
            </Link>

            <Link
              href="/practical-data"
              className="td-card-wb wb-tool-join wb-smooth-transition wb-hover-lift wb-touch-target"
            >
              <div className="wb-tool-icon text-wb-tool-join-600">📊</div>
              <h3 className="wb-tool-title text-wb-tool-join-700">
                実用データ生成
              </h3>
              <p className="wb-tool-description text-wb-tool-join-600">
                実際のテストで使える実用的なデータセットを生成。業務シナリオに対応します。
              </p>
              <div className="mt-4 text-sm text-wb-tool-join-500">
                <span className="wb-tool-label">🔧 結合工具</span>
              </div>
            </Link>

            {/* 測定工具 */}
            <Link
              href="/number-boolean"
              className="td-card-wb wb-tool-measure wb-smooth-transition wb-hover-lift wb-touch-target"
            >
              <div className="wb-tool-icon text-wb-tool-measure-600">🔢</div>
              <h3 className="wb-tool-title text-wb-tool-measure-700">
                数値・真偽値
              </h3>
              <p className="wb-tool-description text-wb-tool-measure-600">
                数値データと真偽値を生成。統計的分布や範囲指定に対応しています。
              </p>
              <div className="mt-4 text-sm text-wb-tool-measure-500">
                <span className="wb-tool-label">📏 測定工具</span>
              </div>
            </Link>

            <Link
              href="/csv-detailed"
              className="td-card-wb wb-tool-measure wb-smooth-transition wb-hover-lift wb-touch-target"
            >
              <div className="wb-tool-icon text-wb-tool-measure-600">📋</div>
              <h3 className="wb-tool-title text-wb-tool-measure-700">
                CSV生成
              </h3>
              <p className="wb-tool-description text-wb-tool-measure-600">
                構造化されたCSVデータを生成。カスタムスキーマとデータ型に対応します。
              </p>
              <div className="mt-4 text-sm text-wb-tool-measure-500">
                <span className="wb-tool-label">📏 測定工具</span>
              </div>
            </Link>

            <Link
              href="/datetime"
              className="td-card-wb wb-tool-measure wb-smooth-transition wb-hover-lift wb-touch-target"
            >
              <div className="wb-tool-icon text-wb-tool-measure-600">📅</div>
              <h3 className="wb-tool-title text-wb-tool-measure-700">
                日時生成
              </h3>
              <p className="wb-tool-description text-wb-tool-measure-600">
                日付と時刻データを生成。タイムゾーン・フォーマット・期間指定が可能です。
              </p>
              <div className="mt-4 text-sm text-wb-tool-measure-500">
                <span className="wb-tool-label">📏 測定工具</span>
              </div>
            </Link>

            {/* 研磨工具 */}
            <Link
              href="/ai-chat"
              className="td-card-wb wb-tool-polish wb-smooth-transition wb-hover-lift wb-touch-target"
            >
              <div className="wb-tool-icon text-wb-tool-polish-600">🤖</div>
              <h3 className="wb-tool-title text-wb-tool-polish-700">AI連携</h3>
              <p className="wb-tool-description text-wb-tool-polish-600">
                AIを活用したインテリジェントなデータ生成。自然言語での指示に対応します。
              </p>
              <div className="mt-4 text-sm text-wb-tool-polish-500">
                <span className="wb-tool-label">✨ 研磨工具</span>
              </div>
            </Link>

            <Link
              href="/text-tools"
              className="td-card-wb wb-tool-polish wb-smooth-transition wb-hover-lift wb-touch-target"
            >
              <div className="wb-tool-icon text-wb-tool-polish-600">📝</div>
              <h3 className="wb-tool-title text-wb-tool-polish-700">
                テキスト工具
              </h3>
              <p className="wb-tool-description text-wb-tool-polish-600">
                テキストデータの生成と加工。多言語・文字種・形式変換に対応しています。
              </p>
              <div className="mt-4 text-sm text-wb-tool-polish-500">
                <span className="wb-tool-label">✨ 研磨工具</span>
              </div>
            </Link>

            <Link
              href="/colors"
              className="td-card-wb wb-tool-polish wb-smooth-transition wb-hover-lift wb-touch-target"
            >
              <div className="wb-tool-icon text-wb-tool-polish-600">🎨</div>
              <h3 className="wb-tool-title text-wb-tool-polish-700">
                カラー生成
              </h3>
              <p className="wb-tool-description text-wb-tool-polish-600">
                カラーパレットとカラーコードを生成。デザインとテストに最適です。
              </p>
              <div className="mt-4 text-sm text-wb-tool-polish-500">
                <span className="wb-tool-label">✨ 研磨工具</span>
              </div>
            </Link>

            {/* 切断工具 */}
            <Link
              href="/export"
              className="td-card-wb wb-tool-cut wb-smooth-transition wb-hover-lift wb-touch-target"
            >
              <div className="wb-tool-icon text-wb-tool-cut-600">📤</div>
              <h3 className="wb-tool-title text-wb-tool-cut-700">データ出力</h3>
              <p className="wb-tool-description text-wb-tool-cut-600">
                生成したデータを様々な形式で出力・エクスポート。ファイル変換にも対応します。
              </p>
              <div className="mt-4 text-sm text-wb-tool-cut-500">
                <span className="wb-tool-label">✂️ 切断工具</span>
              </div>
            </Link>

            <Link
              href="/file-size-test"
              className="td-card-wb wb-tool-cut wb-smooth-transition wb-hover-lift wb-touch-target"
            >
              <div className="wb-tool-icon text-wb-tool-cut-600">📏</div>
              <h3 className="wb-tool-title text-wb-tool-cut-700">
                ファイルサイズテスト
              </h3>
              <p className="wb-tool-description text-wb-tool-cut-600">
                指定サイズのテストファイルを生成。パフォーマンステストに最適です。
              </p>
              <div className="mt-4 text-sm text-wb-tool-cut-500">
                <span className="wb-tool-label">✂️ 切断工具</span>
              </div>
            </Link>
          </div>
        </div>

        {/* モバイル専用リスト */}
        <div className="md:hidden space-y-3">
          <MobileToolCard
            href="/password"
            icon="🔐"
            title="パスワード生成"
            description="セキュアで強力なパスワードを生成"
            category="🔍 検査工具"
            categoryColor="wb-tool-inspect"
          />
          <MobileToolCard
            href="/uuid"
            icon="🆔"
            title="UUID生成"
            description="一意識別子を各バージョン形式で生成"
            category="🔍 検査工具"
            categoryColor="wb-tool-inspect"
          />
          <MobileToolCard
            href="/personal"
            icon="👤"
            title="個人情報生成"
            description="テスト用の個人情報データを生成"
            category="🔧 結合工具"
            categoryColor="wb-tool-join"
          />
          <MobileToolCard
            href="/practical-data"
            icon="📊"
            title="実用データ生成"
            description="実際のテストで使える実用的なデータセット"
            category="🔧 結合工具"
            categoryColor="wb-tool-join"
          />
          <MobileToolCard
            href="/number-boolean"
            icon="🔢"
            title="数値・真偽値"
            description="数値データと真偽値を生成"
            category="📏 測定工具"
            categoryColor="wb-tool-measure"
          />
          <MobileToolCard
            href="/csv-detailed"
            icon="📋"
            title="CSV生成"
            description="構造化されたCSVデータを生成"
            category="📏 測定工具"
            categoryColor="wb-tool-measure"
          />
          <MobileToolCard
            href="/datetime"
            icon="📅"
            title="日時生成"
            description="日付と時刻データを生成"
            category="📏 測定工具"
            categoryColor="wb-tool-measure"
          />
          <MobileToolCard
            href="/ai-chat"
            icon="🤖"
            title="AI連携"
            description="AIを活用したインテリジェントなデータ生成"
            category="✨ 研磨工具"
            categoryColor="wb-tool-polish"
          />
          <MobileToolCard
            href="/text-tools"
            icon="📝"
            title="テキスト工具"
            description="テキストデータの生成と加工"
            category="✨ 研磨工具"
            categoryColor="wb-tool-polish"
          />
          <MobileToolCard
            href="/colors"
            icon="🎨"
            title="カラー生成"
            description="カラーパレットとカラーコードを生成"
            category="✨ 研磨工具"
            categoryColor="wb-tool-polish"
          />
          <MobileToolCard
            href="/export"
            icon="📤"
            title="データ出力"
            description="生成したデータを様々な形式で出力"
            category="✂️ 切断工具"
            categoryColor="wb-tool-cut"
          />
          <MobileToolCard
            href="/file-size-test"
            icon="📏"
            title="ファイルサイズテスト"
            description="指定サイズのテストファイルを生成"
            category="✂️ 切断工具"
            categoryColor="wb-tool-cut"
          />
        </div>
      </div>

      {/* 開発者向けツール */}
      <div className="mb-6 md:mb-8">
        <h2 className="wb-text-responsive font-semibold text-wb-wood-700 mb-4 md:mb-6 text-center">
          🛠️ 開発者向けツール
        </h2>
        <div className="wb-grid wb-grid-2 md:wb-grid-3 lg:wb-grid-4">
          <Link
            href="/td-demo"
            className="td-card-wb wb-tool-polish wb-smooth-transition wb-hover-lift wb-touch-target"
          >
            <div className="wb-tool-icon text-wb-tool-polish-600">🤖</div>
            <h3 className="wb-tool-title text-wb-tool-polish-700">TDデモ</h3>
            <p className="wb-tool-description text-wb-tool-polish-600">
              旧TestData
              Buddyシステムのデモンストレーション。移行前の機能を確認できます。
            </p>
            <div className="mt-4 text-sm text-wb-tool-polish-500">
              <span className="wb-tool-label">✨ 研磨工具</span>
            </div>
          </Link>

          <Link
            href="/browser-test"
            className="td-card-wb wb-tool-inspect wb-smooth-transition wb-hover-lift wb-touch-target"
          >
            <div className="wb-tool-icon text-wb-tool-inspect-600">🧪</div>
            <h3 className="wb-tool-title text-wb-tool-inspect-700">
              ブラウザテスト
            </h3>
            <p className="wb-tool-description text-wb-tool-inspect-600">
              お使いのブラウザの互換性を確認。Quality
              Workbenchの動作環境をテストします。
            </p>
            <div className="mt-4 text-sm text-wb-tool-inspect-500">
              <span className="wb-tool-label">🔍 検査工具</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Brewからのメッセージ */}
      <div className="text-center bg-wb-wood-50 rounded-lg p-4 md:p-6 border-2 border-wb-wood-200">
        <div className="text-2xl md:text-3xl mb-3">🍺</div>
        <h3 className="font-semibold text-wb-wood-800 mb-2 text-base md:text-lg">
          Brewからのメッセージ
        </h3>
        <p className="text-sm md:text-base text-wb-wood-600 max-w-xl mx-auto">
          「工房にようこそ！どの工具も丁寧に作り上げました。
          品質の高いテストデータで、素晴らしいソフトウェアを一緒に作り上げましょう！」
        </p>
      </div>
    </div>
  );
}
