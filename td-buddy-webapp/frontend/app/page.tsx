import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ヒーローセクション */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4 td-heartbeat">🤖</div>
        <h1 className="text-4xl font-bold text-td-primary-800 mb-4">
          TestData Buddy
        </h1>
        <p className="text-xl text-td-primary-600 mb-6">
          QAエンジニアのための最高の相棒、TDくんと一緒に<br />
          効率的なテストデータを生成しましょう！
        </p>
        <div className="inline-block bg-td-secondary-100 border border-td-secondary-300 rounded-lg p-4">
          <p className="text-td-secondary-800 font-medium">
            🎯 「こんにちは！私がTDです。一緒に素晴らしいテストデータを作りましょう♪」
          </p>
        </div>
      </div>

      {/* 機能カード */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* パスワード生成 */}
        <div className="td-card p-6">
          <div className="text-3xl mb-3">🔐</div>
          <h3 className="text-lg font-semibold text-td-primary-800 mb-2">
            パスワード生成
          </h3>
          <p className="text-td-primary-600 mb-4">
            セキュアで強力なパスワードを瞬時に生成します
          </p>
          <Link href="/password">
            <button className="td-button bg-td-primary-500 text-white px-4 py-2 rounded-md hover:bg-td-primary-600 transition-colors">
              生成開始
            </button>
          </Link>
        </div>

        {/* 個人情報生成 */}
        <div className="td-card p-6">
          <div className="text-3xl mb-3">👤</div>
          <h3 className="text-lg font-semibold text-td-primary-800 mb-2">
            個人情報生成
          </h3>
          <p className="text-td-primary-600 mb-4">
            テスト用の架空の個人データを安全に生成します
          </p>
          <Link href="/personal">
            <button className="td-button bg-td-accent-500 text-white px-4 py-2 rounded-md hover:bg-td-accent-600 transition-colors">
              生成開始
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
            ファイル出力機能強化
          </h3>
          <p className="text-blue-600 mb-4">
            JSON/XML/YAML/SQL形式での高度なデータエクスポート
          </p>
          <Link href="/export">
            <button className="td-button bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all">
              エクスポート開始
            </button>
          </Link>
        </div>

        {/* 数値・真偽値生成 */}
        <div className="td-card p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="text-3xl mb-3">🔢</div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            数値・真偽値生成
          </h3>
          <p className="text-green-600 mb-4">
            整数、小数点、通貨、科学記法、真偽値など多様な数値データ
          </p>
          <Link href="/number-boolean">
            <button className="td-button bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all">
              生成開始
            </button>
          </Link>
        </div>

        {/* CSV テストデータ生成 */}
        <div className="td-card p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="text-lg font-semibold text-orange-800 mb-2">
            CSV テストデータ生成
          </h3>
          <p className="text-orange-600 mb-4">
            ドラッグ&ドロップ対応のCSVデータ生成・プレビュー
          </p>
          <Link href="/csv-test">
            <button className="td-button bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all">
              生成開始
            </button>
          </Link>
        </div>

        {/* 日付・時刻データ生成 */}
        <div className="td-card p-6 bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200">
          <div className="text-3xl mb-3">📅</div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            日付・時刻データ生成
          </h3>
          <p className="text-green-600 mb-4">
            世界標準時間対応・複数フォーマット出力
          </p>
          <Link href="/datetime">
            <button className="td-button bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all">
              生成開始
            </button>
          </Link>
        </div>

        {/* カラーデータ生成 */}
        <div className="td-card p-6 bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200">
          <div className="text-3xl mb-3">🎨</div>
          <h3 className="text-lg font-semibold text-pink-800 mb-2">
            カラーデータ生成
          </h3>
          <p className="text-pink-600 mb-4">
            HEX・RGB・HSL・CSS名対応、カラースキーム設定
          </p>
          <Link href="/colors">
            <button className="td-button bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all">
              生成開始
            </button>
          </Link>
        </div>

        {/* 実用データ選択 */}
        <div className="td-card p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
          <div className="text-3xl mb-3">📋</div>
          <h3 className="text-lg font-semibold text-indigo-800 mb-2">
            実用データ選択
          </h3>
          <p className="text-indigo-600 mb-4">
            ゲーム・Web系・ECサイトなど実際のビジネスで使用されるデータリスト
          </p>
          <Link href="/practical-data">
            <button className="td-button bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all">
              データ選択
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
      </div>

      {/* ステータス表示 */}
      <div className="bg-white rounded-lg shadow-sm border border-td-primary-100 p-6">
        <h2 className="text-lg font-semibold text-td-primary-800 mb-4">
          TDの状態
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-td-accent-500 rounded-full animate-pulse"></div>
            <span className="text-td-primary-600">接続良好</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-td-secondary-500 rounded-full"></div>
            <span className="text-td-primary-600">準備完了</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-td-primary-500 rounded-full"></div>
            <span className="text-td-primary-600">Version 1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
} 