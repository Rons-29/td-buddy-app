// ファイルサイズテスト専用レイアウト
// フォント最適化とパフォーマンス向上

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '⚡ 超高速ファイル生成（5秒以内目標） | TD Buddy',
  description: '青空文庫の名作を活用した実用的なテストファイルを5秒以内で生成',
};

export default function FileSizeTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="td-fast-render font-optimized">{children}</div>;
}
