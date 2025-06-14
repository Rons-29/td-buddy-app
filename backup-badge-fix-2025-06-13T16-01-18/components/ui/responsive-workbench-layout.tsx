'use client';

import React, { useEffect, useState } from 'react';
import { DesktopWorkbenchLayout } from './desktop-workbench-layout';
import { MobileWorkbenchLayout } from './mobile-workbench-layout';
import { TabletWorkbenchLayout } from './tablet-workbench-layout';

interface Tool {
  id: string;
  name: string;
  icon: string;
  type: 'measure' | 'cut' | 'join' | 'inspect' | 'polish';
  description: string;
  href: string;
  isNew?: boolean;
  isPopular?: boolean;
  category?: string;
}

interface ResponsiveWorkbenchLayoutProps {
  children: React.ReactNode;
  currentTool?: string;
  tools?: Tool[];
}

type ScreenSize = 'mobile' | 'tablet' | 'desktop';

const useScreenSize = (): ScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>('desktop');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return screenSize;
};

export const ResponsiveWorkbenchLayout: React.FC<
  ResponsiveWorkbenchLayoutProps
> = ({ children, currentTool, tools }) => {
  const screenSize = useScreenSize();

  // Add responsive classes to body for global styling
  useEffect(() => {
    const body = document.body;
    body.classList.remove('wb-mobile', 'wb-tablet', 'wb-desktop');
    body.classList.add(`wb-${screenSize}`);

    return () => {
      body.classList.remove('wb-mobile', 'wb-tablet', 'wb-desktop');
    };
  }, [screenSize]);

  const commonProps = {
    children,
    currentTool,
    tools,
  };

  switch (screenSize) {
    case 'mobile':
      return <MobileWorkbenchLayout {...commonProps} />;
    case 'tablet':
      return <TabletWorkbenchLayout {...commonProps} />;
    case 'desktop':
    default:
      return <DesktopWorkbenchLayout {...commonProps} />;
  }
};

// Export individual layouts for specific use cases
export { DesktopWorkbenchLayout, MobileWorkbenchLayout, TabletWorkbenchLayout };
