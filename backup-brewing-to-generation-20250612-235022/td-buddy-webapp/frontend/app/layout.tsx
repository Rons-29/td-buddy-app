import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import Link from 'next/link';

import EnvironmentInfo from '@/components/EnvironmentInfo';
import './globals.css';

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
  title: 'QA Workbench - AI連携型テストデータ醸造ツール',
  description:
    'QAエンジニアのための最高のテストデータ醸造相棒、ブリューと一緒に効率的なテスト環境を構築しましょう',
  keywords: ['テストデータ', 'QA', 'AI', 'データ醸造', 'パスワード生成'],
  authors: [{ name: 'Brew Team' }],
  openGraph: {
    title: 'QA Workbench - AI連携型テストデータ醸造ツール',
    description:
      'QAエンジニアのための最高のテストデータ醸造相棒、ブリューと一緒に効率的なテスト環境を構築しましょう',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'QA Workbench',
  },
  twitter: {
    card: 'summary',
    title: 'QA Workbench - AI連携型テストデータ醸造ツール',
    description:
      'QAエンジニアのための最高のテストデータ醸造相棒、ブリューと一緒に効率的なテスト環境を構築しましょう',
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
  themeColor: '#0ea5e9',
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
        `}
      >
        <div className="min-h-full flex flex-col">
          {/* ヘッダー */}
          <header className="bg-white shadow-sm border-b border-orange-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <Link
                  href="/"
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                  <div className="text-2xl">🍺</div>
                  <h1 className="text-xl font-bold text-orange-800">
                    QA Workbench
                  </h1>
                </Link>

                {/* ナビゲーションメニュー */}
                <nav className="hidden md:flex items-center space-x-6">
                  <Link
                    href="/personal"
                    className="text-orange-600 hover:text-orange-800 font-medium transition-colors"
                  >
                    個人情報醸造
                  </Link>
                  <Link
                    href="/uuid"
                    className="text-orange-600 hover:text-orange-800 font-medium transition-colors flex items-center gap-2"
                  >
                    <span>🆔</span>
                    UUID生成
                  </Link>
                  <Link
                    href="/data-selector"
                    className="text-orange-600 hover:text-orange-800 font-medium transition-colors flex items-center gap-2"
                  >
                    <span>🎯</span>
                    データ選択
                  </Link>
                  <Link
                    href="/practical-data"
                    className="text-orange-600 hover:text-orange-800 font-medium transition-colors flex items-center gap-2"
                  >
                    <span>📋</span>
                    実用データ
                  </Link>
                  <Link
                    href="/ai-chat"
                    className="text-orange-600 hover:text-orange-800 font-medium transition-colors flex items-center gap-2"
                  >
                    <span>🧠</span>
                    AI チャット
                  </Link>
                  <Link
                    href="/password"
                    className="text-orange-600 hover:text-orange-800 font-medium transition-colors"
                  >
                    パスワード生成
                  </Link>
                </nav>

                <div className="text-sm text-orange-600">Version 1.0.0</div>
              </div>
            </div>
          </header>

          {/* メインコンテンツ */}
          <main className="flex-1">{children}</main>

          {/* フッター */}
          <footer className="bg-orange-800 text-white py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-sm">
                © 2024 QA Workbench - QAエンジニアの最高の相棒 🍺
              </p>
            </div>
          </footer>
        </div>

        {/* 環境情報デバッグコンポーネント */}
        <EnvironmentInfo />
      </body>
    </html>
  );
}
