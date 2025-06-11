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