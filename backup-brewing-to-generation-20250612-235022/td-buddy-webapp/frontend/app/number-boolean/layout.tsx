import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '数値・真偽値生成 | QA Workbench',
  description: '整数、小数点数、パーセンテージ、通貨、科学記法、真偽値など多様な数値データを生成。テスト、開発、分析に活用できるAI連携型テストデータ生成ツール。',
  keywords: ['数値生成', '真偽値', 'テストデータ', 'QA', '開発ツール', 'QA Workbench', 'TD'],
  authors: [{ name: 'QA Workbench Team' }],
  openGraph: {
    title: '数値・真偽値生成 | QA Workbench',
    description: '整数、小数点数、パーセンテージ、通貨、科学記法、真偽値など多様な数値データを生成',
    type: 'website',
    locale: 'ja_JP',
    images: [
      {
        url: '/images/number-boolean-og.jpg',
        width: 1200,
        height: 630,
        alt: 'QA Workbench 数値・真偽値生成',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '数値・真偽値生成 | QA Workbench',
    description: '整数、小数点数、パーセンテージ、通貨、科学記法、真偽値など多様な数値データを生成',
    images: ['/images/number-boolean-twitter.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: 'width=device-width, initial-scale=1',
};

export default function NumberBooleanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 