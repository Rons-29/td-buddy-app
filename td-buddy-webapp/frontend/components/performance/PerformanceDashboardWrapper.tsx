'use client';

import { useEffect, useState } from 'react';

const PerformanceDashboardWrapper = () => {
  const [isClient, setIsClient] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [PerformanceDashboard, setPerformanceDashboard] =
    useState<React.ComponentType | null>(null);

  useEffect(() => {
    setIsClient(true);
    setIsDevelopment(process.env.NODE_ENV === 'development');

    // 開発環境でのみコンポーネントを動的に読み込み
    if (process.env.NODE_ENV === 'development') {
      const loadComponent = async () => {
        try {
          const dynamicModule = await import('./PerformanceDashboard');
          setPerformanceDashboard(() => dynamicModule.default);
        } catch (error) {
          console.warn(
            'パフォーマンス監視コンポーネントの読み込みに失敗しました:',
            error
          );
        }
      };

      // 少し遅延させて、メインアプリケーションの読み込みが完了してから実行
      const timer = setTimeout(loadComponent, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // クライアントサイドでのみ表示
  if (!isClient || !isDevelopment || !PerformanceDashboard) {
    return null;
  }

  return <PerformanceDashboard />;
};

export default PerformanceDashboardWrapper;
