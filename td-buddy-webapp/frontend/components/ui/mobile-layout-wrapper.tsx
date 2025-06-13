'use client';

import { useState } from 'react';
import { MobileNavigation, useTouchOptimization } from './mobile-navigation';

interface MobileLayoutWrapperProps {
  children: React.ReactNode;
}

export function MobileLayoutWrapper({ children }: MobileLayoutWrapperProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // タッチ操作最適化を適用
  useTouchOptimization();

  const handleMobileNavToggle = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const handleMobileNavClose = () => {
    setIsMobileNavOpen(false);
  };

  return (
    <>
      {/* モバイルナビゲーション */}
      <div className="md:hidden fixed top-4 right-4 z-40">
        <MobileNavigation
          isOpen={isMobileNavOpen}
          onToggle={handleMobileNavToggle}
          onClose={handleMobileNavClose}
        />
      </div>

      {/* メインコンテンツ */}
      {children}
    </>
  );
}
