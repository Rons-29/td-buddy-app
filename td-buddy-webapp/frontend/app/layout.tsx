import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import Link from 'next/link';

import EnvironmentInfo from '@/components/EnvironmentInfo';
import {
  AccessibilityInfo,
  KeyboardShortcuts,
} from '../components/ui/accessibility-helper';
import { MobileLayoutWrapper } from '../components/ui/mobile-layout-wrapper';
import './globals.css';

// パフォーマンス監視（開発環境のみ）
import PerformanceDashboardWrapper from '../components/performance/PerformanceDashboardWrapper';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  title: '🍺 Brewのワークベンチ - Quality Workbench',
  description:
    'QAエンジニアのための高品質テストデータ生成ワークベンチ。Brewと一緒に最高の品質を作り上げましょう！',
  keywords: ['テストデータ', 'QA', 'AI', 'データ生成', 'パスワード生成'],
  authors: [{ name: 'Brew Team' }],
  openGraph: {
    title: 'QA Workbench - AI連携型テストデータ生成ツール',
    description:
      'QAエンジニアのための最高のテストデータ生成相棒、ブリューと一緒に効率的なテスト環境を構築しましょう',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'QA Workbench',
  },
  twitter: {
    card: 'summary',
    title: 'QA Workbench - AI連携型テストデータ生成ツール',
    description:
      'QAエンジニアのための最高のテストデータ生成相棒、ブリューと一緒に効率的なテスト環境を構築しましょう',
  },
  icons: {
    icon: '/brew-favicon.svg',
    shortcut: '/brew-favicon.svg',
    apple: '/brew-favicon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#8d6e63',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full">
      <body
        className={`
          ${inter.variable} 
          ${notoSansJP.variable} 
          font-brew 
          antialiased 
          bg-gradient-to-br 
          from-orange-50 
          to-amber-50 
          min-h-full
          wb-mobile-optimized
        `}
      >
        {/* アクセシビリティ情報 */}
        <AccessibilityInfo />

        {/* スキップリンク */}
        <a
          href="#main-content"
          className="wb-sr-only wb-focus-visible wb-touch-target"
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 1000,
            background: 'var(--wb-wood-100)',
            color: 'var(--wb-wood-800)',
            padding: '12px 16px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '16px',
            minHeight: '44px',
            minWidth: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          メインコンテンツにスキップ
        </a>

        <MobileLayoutWrapper>
          <div className="min-h-full flex flex-col">
            {/* ワークベンチヘッダー */}
            <header className="bg-wb-workshop-surface shadow-sm border-b-2 border-wb-metal-300 sticky top-0 z-30">
              <div className="td-container-wb">
                <div className="flex justify-between items-center h-14 md:h-16">
                  {/* ロゴ・タイトル */}
                  <Link
                    href="/"
                    className="flex items-center space-x-2 md:space-x-3 hover:opacity-80 transition-opacity wb-touch-target"
                  >
                    <div className="text-xl md:text-2xl td-heartbeat">🍺</div>
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-3">
                      <h1 className="wb-text-base md:wb-text-xl wb-font-display text-wb-wood-800 leading-tight">
                        Quality Workbench
                      </h1>
                      <div className="wb-tool-label text-wb-metal-600 text-xs md:text-sm">
                        ブリューの工房
                      </div>
                    </div>
                  </Link>

                  {/* デスクトップナビゲーション */}
                  <nav className="hidden md:flex items-center space-x-wb-6">
                    {/* 検査ツール */}
                    <div className="relative group">
                      <button className="flex items-center space-x-wb-1 text-wb-tool-inspect-600 hover:text-wb-tool-inspect-800 font-medium transition-colors wb-touch-target">
                        <span>🔍</span>
                        <span className="wb-text-sm">検査ツール</span>
                      </button>
                      <div className="absolute top-full left-0 mt-1 w-48 bg-wb-workshop-surface border-2 border-wb-tool-inspect-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <Link
                          href="/password"
                          className="block px-wb-3 py-wb-2 text-wb-tool-inspect-700 hover:bg-wb-tool-inspect-50 wb-text-sm wb-touch-target"
                        >
                          🔐 パスワード生成
                        </Link>
                        <Link
                          href="/uuid"
                          className="block px-wb-3 py-wb-2 text-wb-tool-inspect-700 hover:bg-wb-tool-inspect-50 wb-text-sm wb-touch-target"
                        >
                          🆔 UUID生成
                        </Link>
                      </div>
                    </div>

                    {/* 接合ツール */}
                    <div className="relative group">
                      <button className="flex items-center space-x-wb-1 text-wb-tool-join-600 hover:text-wb-tool-join-800 font-medium transition-colors wb-touch-target">
                        <span>🔧</span>
                        <span className="wb-text-sm">接合ツール</span>
                      </button>
                      <div className="absolute top-full left-0 mt-1 w-48 bg-wb-workshop-surface border-2 border-wb-tool-join-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <Link
                          href="/personal"
                          className="block px-wb-3 py-wb-2 text-wb-tool-join-700 hover:bg-wb-tool-join-50 wb-text-sm wb-touch-target"
                        >
                          👤 個人情報生成
                        </Link>
                        <Link
                          href="/practical-data"
                          className="block px-wb-3 py-wb-2 text-wb-tool-join-700 hover:bg-wb-tool-join-50 wb-text-sm wb-touch-target"
                        >
                          🏢 実用データ生成
                        </Link>
                      </div>
                    </div>

                    {/* 測定ツール */}
                    <div className="relative group">
                      <button className="flex items-center space-x-wb-1 text-wb-tool-measure-600 hover:text-wb-tool-measure-800 font-medium transition-colors wb-touch-target">
                        <span>📏</span>
                        <span className="wb-text-sm">測定ツール</span>
                      </button>
                      <div className="absolute top-full left-0 mt-1 w-48 bg-wb-workshop-surface border-2 border-wb-tool-measure-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <Link
                          href="/number-boolean"
                          className="block px-wb-3 py-wb-2 text-wb-tool-measure-700 hover:bg-wb-tool-measure-50 wb-text-sm wb-touch-target"
                        >
                          🔢 数値・真偽値生成
                        </Link>
                        <Link
                          href="/csv-detailed"
                          className="block px-wb-3 py-wb-2 text-wb-tool-measure-700 hover:bg-wb-tool-measure-50 wb-text-sm wb-touch-target"
                        >
                          📊 CSV詳細設定
                        </Link>
                        <Link
                          href="/datetime"
                          className="block px-wb-3 py-wb-2 text-wb-tool-measure-700 hover:bg-wb-tool-measure-50 wb-text-sm wb-touch-target"
                        >
                          📅 日時生成
                        </Link>
                      </div>
                    </div>

                    {/* 仕上げツール */}
                    <div className="relative group">
                      <button className="flex items-center space-x-wb-1 text-wb-tool-polish-600 hover:text-wb-tool-polish-800 font-medium transition-colors wb-touch-target">
                        <span>✨</span>
                        <span className="wb-text-sm">仕上げツール</span>
                      </button>
                      <div className="absolute top-full left-0 mt-1 w-48 bg-wb-workshop-surface border-2 border-wb-tool-polish-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <Link
                          href="/ai-chat"
                          className="block px-wb-3 py-wb-2 text-wb-tool-polish-700 hover:bg-wb-tool-polish-50 wb-text-sm wb-touch-target"
                        >
                          🤖 AI連携
                        </Link>
                        <Link
                          href="/text-tools"
                          className="block px-wb-3 py-wb-2 text-wb-tool-polish-700 hover:bg-wb-tool-polish-50 wb-text-sm wb-touch-target"
                        >
                          📝 文字・テキスト
                        </Link>
                        <Link
                          href="/colors"
                          className="block px-wb-3 py-wb-2 text-wb-tool-polish-700 hover:bg-wb-tool-polish-50 wb-text-sm wb-touch-target"
                        >
                          🎨 カラー生成
                        </Link>
                      </div>
                    </div>

                    {/* 切断ツール */}
                    <div className="relative group">
                      <button className="flex items-center space-x-wb-1 text-wb-tool-cut-600 hover:text-wb-tool-cut-800 font-medium transition-colors wb-touch-target">
                        <span>✂️</span>
                        <span className="wb-text-sm">切断ツール</span>
                      </button>
                      <div className="absolute top-full left-0 mt-1 w-48 bg-wb-workshop-surface border-2 border-wb-tool-cut-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <Link
                          href="/export"
                          className="block px-wb-3 py-wb-2 text-wb-tool-cut-700 hover:bg-wb-tool-cut-50 wb-text-sm wb-touch-target"
                        >
                          📤 データ出力
                        </Link>
                        <Link
                          href="/file-size-test"
                          className="block px-wb-3 py-wb-2 text-wb-tool-cut-700 hover:bg-wb-tool-cut-50 wb-text-sm wb-touch-target"
                        >
                          📏 ファイルサイズテスト
                        </Link>
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
            </header>

            {/* メインコンテンツ */}
            <main id="main-content" className="flex-1 wb-mobile-content">
              {children}
            </main>

            {/* フッター */}
            <footer className="bg-wb-wood-100 border-t border-wb-metal-200 mt-auto">
              <div className="td-container-wb py-6 md:py-8">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <span className="text-xl md:text-2xl">🍺</span>
                    <span className="font-semibold text-wb-wood-800">
                      Quality Workbench
                    </span>
                  </div>
                  <p className="text-sm text-wb-wood-600 mb-4">
                    Brewと一緒に、最高品質のテストデータを作り上げましょう
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-xs text-wb-wood-500">
                    <span>© 2024 Quality Workbench</span>
                    <span>•</span>
                    <span>Made with 🍺 by Brew Team</span>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </MobileLayoutWrapper>

        {/* 環境情報（開発時のみ） */}
        <EnvironmentInfo />

        {/* パフォーマンス監視（開発環境のみ） */}
        <PerformanceDashboardWrapper />

        {/* キーボードショートカット情報 */}
        <KeyboardShortcuts />
      </body>
    </html>
  );
}
