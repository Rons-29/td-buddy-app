import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import Link from 'next/link';
import { TDDesignInspector } from '../components/TDDesignInspector';
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
  title: 'TestData Buddy - AI連携型テストデータ生成ツール',
  description: 'QAエンジニアのための最高のテストデータ生成相棒、TDくんと一緒に効率的なテスト環境を構築しましょう',
  keywords: ['テストデータ', 'QA', 'AI', 'データ生成', 'パスワード生成'],
  authors: [{ name: 'TD Team' }],
  icons: {
    icon: '/td-favicon.svg',
    shortcut: '/td-favicon.svg',
    apple: '/td-favicon.svg',
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
          font-td 
          antialiased 
          bg-gradient-to-br 
          from-td-primary-50 
          to-td-secondary-50 
          min-h-full
        `}
      >
        <div className="min-h-full flex flex-col">
          {/* ヘッダー */}
          <header className="bg-white shadow-sm border-b border-td-primary-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  <div className="text-2xl">🤖</div>
                  <h1 className="text-xl font-bold text-td-primary-800">
                    TestData Buddy
                  </h1>
                </Link>
                
                {/* ナビゲーションメニュー */}
                <nav className="hidden md:flex items-center space-x-6">
                  <Link 
                    href="/personal" 
                    className="text-td-primary-600 hover:text-td-primary-800 font-medium transition-colors"
                  >
                    個人情報生成
                  </Link>
                  <Link 
                    href="/uuid" 
                    className="text-td-primary-600 hover:text-td-primary-800 font-medium transition-colors flex items-center gap-2"
                  >
                    <span>🆔</span>
                    UUID生成
                  </Link>
                  <Link 
                    href="/ai-chat" 
                    className="text-td-primary-600 hover:text-td-primary-800 font-medium transition-colors flex items-center gap-2"
                  >
                    <span>🧠</span>
                    AI チャット
                  </Link>
                  <Link 
                    href="/password" 
                    className="text-td-primary-600 hover:text-td-primary-800 font-medium transition-colors"
                  >
                    パスワード生成
                  </Link>
                </nav>
                
                <div className="text-sm text-td-primary-600">
                  Version 1.0.0
                </div>
              </div>
            </div>
          </header>

          {/* メインコンテンツ */}
          <main className="flex-1">
            {children}
          </main>

          {/* フッター */}
          <footer className="bg-td-primary-800 text-white py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-sm">
                © 2024 TestData Buddy - QAエンジニアの最高の相棒 🤖
              </p>
            </div>
          </footer>
        </div>

        {/* TD Design Inspector - 開発環境でのみ表示 */}
        <TDDesignInspector />
      </body>
    </html>
  );
} 