import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヒーローセクション */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4 brew-heartbeat">🍺</div>
          <h1 className="text-4xl font-bold text-amber-800 mb-4">
            QA Workbench
          </h1>
          <p className="text-xl text-amber-600 mb-6">
            QAエンジニアの専用作業台、助手のブリューと一緒に
            <br />
            品質の高いデータを醸造しましょう！
          </p>
          <div className="inline-block bg-amber-100 border border-amber-300 rounded-lg p-4">
            <p className="text-amber-800 font-medium">
              🍺 「こんにちは！ブリューです。醸造のお手伝いをします♪」
            </p>
          </div>
        </div>

        {/* 機能カード */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* パスワード生成 */}
          <div className="td-card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
            <div className="text-3xl mb-3">🔐</div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              パスワード醸造
            </h3>
            <p className="text-blue-600 mb-4">
              セキュアで強力なパスワードを丁寧に醸造します
            </p>
            <Link href="/password">
              <button className="td-button bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                醸造開始
              </button>
            </Link>
          </div>

          {/* 個人情報生成 */}
          <div className="td-card p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="text-3xl mb-3">👤</div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              個人情報醸造
            </h3>
            <p className="text-green-600 mb-4">
              テスト用の架空の個人データを安全に醸造します
            </p>
            <Link href="/personal">
              <button className="td-button bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
                醸造開始
              </button>
            </Link>
          </div>

          {/* 文字・テキスト系ツール */}
          <div className="td-card p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-lg font-semibold text-purple-800 mb-2">
              文字・テキスト系ツール
            </h3>
            <p className="text-purple-600 mb-4">
              文字数カウント・旧字体変換・テキスト生成など
            </p>
            <Link href="/text-tools">
              <button className="td-button bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all">
                ツール開始
              </button>
            </Link>
          </div>

          {/* ファイル出力機能強化 */}
          <div className="td-card p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
            <div className="text-3xl mb-3">📤</div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              データ醸造出力
            </h3>
            <p className="text-blue-600 mb-4">
              JSON/XML/YAML/SQL形式での高度なデータ醸造エクスポート
            </p>
            <Link href="/export">
              <button className="td-button bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all">
                醸造エクスポート開始
              </button>
            </Link>
          </div>

          {/* 数値・真偽値生成 */}
          <div className="td-card p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="text-3xl mb-3">🔢</div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              数値・真偽値醸造
            </h3>
            <p className="text-green-600 mb-4">
              整数、小数点、通貨、科学記法、真偽値など多様な数値データ醸造
            </p>
            <Link href="/number-boolean">
              <button className="td-button bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all">
                醸造開始
              </button>
            </Link>
          </div>

          {/* AI連携 */}
          <div className="td-card p-6">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="text-lg font-semibold text-td-primary-800 mb-2">
              AI チャット
            </h3>
            <p className="text-td-primary-600 mb-4">
              自然言語でデータ生成条件を指定できます
            </p>
            <Link href="/ai-chat">
              <button className="td-button bg-td-primary-500 text-white px-4 py-2 rounded-md hover:bg-td-primary-600 transition-colors">
                チャット開始
              </button>
            </Link>
          </div>

          {/* CSV詳細設定 */}
          <div className="td-card p-6 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              CSV詳細設定
            </h3>
            <p className="text-orange-600 mb-4">
              高度なCSVデータ生成・カスタマイズ機能
            </p>
            <Link href="/csv-detailed">
              <button className="td-button bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all">
                詳細設定
              </button>
            </Link>
          </div>

          {/* 日時生成 */}
          <div className="td-card p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
            <div className="text-3xl mb-3">📅</div>
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">
              日時生成
            </h3>
            <p className="text-indigo-600 mb-4">
              様々な形式の日付・時刻データを生成
            </p>
            <Link href="/datetime">
              <button className="td-button bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all">
                生成開始
              </button>
            </Link>
          </div>

          {/* UUID生成 */}
          <div className="td-card p-6 bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200">
            <div className="text-3xl mb-3">🆔</div>
            <h3 className="text-lg font-semibold text-teal-800 mb-2">
              UUID生成
            </h3>
            <p className="text-teal-600 mb-4">ユニークなID・識別子を大量生成</p>
            <Link href="/uuid">
              <button className="td-button bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all">
                生成開始
              </button>
            </Link>
          </div>

          {/* カラー生成 */}
          <div className="td-card p-6 bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-lg font-semibold text-pink-800 mb-2">
              カラー生成
            </h3>
            <p className="text-pink-600 mb-4">
              HEX・RGB・HSL形式のカラーコードを生成
            </p>
            <Link href="/colors">
              <button className="td-button bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all">
                生成開始
              </button>
            </Link>
          </div>

          {/* ファイルサイズテスト */}
          <div className="td-card p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200">
            <div className="text-3xl mb-3">📁</div>
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              ファイルサイズテスト
            </h3>
            <p className="text-yellow-600 mb-4">
              指定サイズのテストファイルを生成（1GB対応・青空文庫データ対応）
            </p>
            <Link href="/file-size-test">
              <button className="td-button bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all">
                生成開始
              </button>
            </Link>
          </div>

          {/* 実用データ生成 */}
          <div className="td-card p-6 bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200">
            <div className="text-3xl mb-3">🏢</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              実用データ生成
            </h3>
            <p className="text-gray-600 mb-4">
              企業・住所・電話番号など実用的なテストデータ
            </p>
            <Link href="/practical-data">
              <button className="td-button bg-gradient-to-r from-gray-500 to-slate-500 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all">
                生成開始
              </button>
            </Link>
          </div>
        </div>

        {/* ステータス表示 */}
        <div className="bg-white rounded-lg shadow-sm border border-amber-100 p-6">
          <h2 className="text-lg font-semibold text-amber-800 mb-4">
            ブリューの状態
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-amber-600">醸造設備良好</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-amber-600">AI醸造システム準備完了</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-amber-600">データ醸造エンジン稼働中</span>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="text-center mt-12 text-amber-500">
          <p>🍺 QA Workbench - ブリューがあなたの品質作業をサポート</p>
          <p className="text-sm mt-2">
            「一緒に素晴らしいデータを醸造しましょう！」
          </p>
        </div>
      </div>
    </div>
  );
}
