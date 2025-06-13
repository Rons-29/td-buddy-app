'use client';

import React, { useEffect, useState } from 'react';

// ブレークポイント定義
export const BREAKPOINTS = {
  xs: 320,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

// 現在のブレークポイントを検出するフック
export function useBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] =
    useState<BreakpointKey>('xs');
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

      if (width >= BREAKPOINTS['2xl']) {
        setCurrentBreakpoint('2xl');
      } else if (width >= BREAKPOINTS.xl) {
        setCurrentBreakpoint('xl');
      } else if (width >= BREAKPOINTS.lg) {
        setCurrentBreakpoint('lg');
      } else if (width >= BREAKPOINTS.md) {
        setCurrentBreakpoint('md');
      } else if (width >= BREAKPOINTS.sm) {
        setCurrentBreakpoint('sm');
      } else {
        setCurrentBreakpoint('xs');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return { currentBreakpoint, windowWidth };
}

// デバイスタイプ検出フック
export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>(
    'mobile'
  );
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const { currentBreakpoint } = useBreakpoint();

  useEffect(() => {
    // タッチデバイス検出
    const checkTouchDevice = () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    };

    setIsTouchDevice(checkTouchDevice());

    // デバイスタイプ判定
    if (currentBreakpoint === 'xs' || currentBreakpoint === 'sm') {
      setDeviceType('mobile');
    } else if (currentBreakpoint === 'md') {
      setDeviceType('tablet');
    } else {
      setDeviceType('desktop');
    }
  }, [currentBreakpoint]);

  return { deviceType, isTouchDevice };
}

// レスポンシブ表示制御コンポーネント
interface ResponsiveShowProps {
  breakpoint: BreakpointKey;
  direction?: 'up' | 'down' | 'only';
  children: React.ReactNode;
}

export function ResponsiveShow({
  breakpoint,
  direction = 'up',
  children,
}: ResponsiveShowProps) {
  const { currentBreakpoint, windowWidth } = useBreakpoint();
  const targetWidth = BREAKPOINTS[breakpoint];

  const shouldShow = () => {
    switch (direction) {
      case 'up':
        return windowWidth >= targetWidth;
      case 'down':
        return windowWidth < targetWidth;
      case 'only':
        return currentBreakpoint === breakpoint;
      default:
        return false;
    }
  };

  if (!shouldShow()) {
    return null;
  }

  return <>{children}</>;
}

// レスポンシブ非表示制御コンポーネント
interface ResponsiveHideProps {
  breakpoint: BreakpointKey;
  direction?: 'up' | 'down' | 'only';
  children: React.ReactNode;
}

export function ResponsiveHide({
  breakpoint,
  direction = 'up',
  children,
}: ResponsiveHideProps) {
  const { currentBreakpoint, windowWidth } = useBreakpoint();
  const targetWidth = BREAKPOINTS[breakpoint];

  const shouldHide = () => {
    switch (direction) {
      case 'up':
        return windowWidth >= targetWidth;
      case 'down':
        return windowWidth < targetWidth;
      case 'only':
        return currentBreakpoint === breakpoint;
      default:
        return false;
    }
  };

  if (shouldHide()) {
    return null;
  }

  return <>{children}</>;
}

// レスポンシブグリッドコンポーネント
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: number;
  className?: string;
}

export function ResponsiveGrid({
  children,
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 4,
  className = '',
}: ResponsiveGridProps) {
  const { currentBreakpoint } = useBreakpoint();

  const getCurrentCols = () => {
    const breakpoints: BreakpointKey[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];

    for (const bp of breakpoints) {
      if (BREAKPOINTS[currentBreakpoint] >= BREAKPOINTS[bp] && cols[bp]) {
        return cols[bp];
      }
    }
    return cols.xs || 1;
  };

  const currentCols = getCurrentCols();

  return (
    <div
      className={`wb-grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${currentCols}, 1fr)`,
        gap: `var(--wb-space-${gap})`,
      }}
    >
      {children}
    </div>
  );
}

// レスポンシブテキストサイズコンポーネント
interface ResponsiveTextProps {
  children: React.ReactNode;
  sizes?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
  className?: string;
}

export function ResponsiveText({
  children,
  sizes = {
    xs: 'wb-text-sm',
    sm: 'wb-text-base',
    md: 'wb-text-lg',
    lg: 'wb-text-xl',
  },
  className = '',
}: ResponsiveTextProps) {
  const { currentBreakpoint } = useBreakpoint();

  const getCurrentSize = () => {
    const breakpoints: BreakpointKey[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];

    for (const bp of breakpoints) {
      if (BREAKPOINTS[currentBreakpoint] >= BREAKPOINTS[bp] && sizes[bp]) {
        return sizes[bp];
      }
    }
    return sizes.xs || 'wb-text-base';
  };

  const currentSize = getCurrentSize();

  return <span className={`${currentSize} ${className}`}>{children}</span>;
}

// レスポンシブスペーシングコンポーネント
interface ResponsiveSpacingProps {
  children: React.ReactNode;
  padding?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  margin?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  className?: string;
}

export function ResponsiveSpacing({
  children,
  padding,
  margin,
  className = '',
}: ResponsiveSpacingProps) {
  const { currentBreakpoint } = useBreakpoint();

  const getCurrentSpacing = (
    spacingConfig?: ResponsiveSpacingProps['padding']
  ) => {
    if (!spacingConfig) return null;

    const breakpoints: BreakpointKey[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];

    for (const bp of breakpoints) {
      if (
        BREAKPOINTS[currentBreakpoint] >= BREAKPOINTS[bp] &&
        spacingConfig[bp]
      ) {
        return spacingConfig[bp];
      }
    }
    return spacingConfig.xs || 4;
  };

  const currentPadding = getCurrentSpacing(padding);
  const currentMargin = getCurrentSpacing(margin);

  const style: React.CSSProperties = {};
  if (currentPadding) {
    style.padding = `var(--wb-space-${currentPadding})`;
  }
  if (currentMargin) {
    style.margin = `var(--wb-space-${currentMargin})`;
  }

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

// 工具カードレスポンシブコンポーネント
interface ResponsiveToolCardProps {
  title: string;
  description: string;
  icon: string;
  toolType: 'inspect' | 'join' | 'measure' | 'polish' | 'cut';
  href: string;
  className?: string;
}

export function ResponsiveToolCard({
  title,
  description,
  icon,
  toolType,
  href,
  className = '',
}: ResponsiveToolCardProps) {
  const { deviceType } = useDeviceType();

  return (
    <a
      href={href}
      className={`td-card-wb wb-tool-${toolType} wb-smooth-transition wb-hover-lift ${className}`}
    >
      <ResponsiveText
        sizes={{ xs: 'text-2xl', md: 'text-3xl', lg: 'text-4xl' }}
        className="wb-tool-icon block mb-4"
      >
        {icon}
      </ResponsiveText>

      <ResponsiveText
        sizes={{
          xs: 'wb-text-base',
          sm: 'wb-text-lg',
          md: 'wb-text-xl',
          lg: 'wb-text-2xl',
        }}
        className={`wb-tool-title text-wb-tool-${toolType}-700 font-semibold mb-3`}
      >
        {title}
      </ResponsiveText>

      <ResponsiveText
        sizes={{ xs: 'wb-text-sm', md: 'wb-text-base', lg: 'wb-text-lg' }}
        className={`wb-tool-description text-wb-tool-${toolType}-600`}
      >
        {description}
      </ResponsiveText>

      <ResponsiveShow breakpoint="md">
        <div className="mt-4">
          <span
            className={`wb-tool-label text-sm text-wb-tool-${toolType}-500`}
          >
            {toolType === 'inspect' && '🔍 検査工具'}
            {toolType === 'join' && '🔧 結合工具'}
            {toolType === 'measure' && '📏 測定工具'}
            {toolType === 'polish' && '✨ 研磨工具'}
            {toolType === 'cut' && '✂️ 切断工具'}
          </span>
        </div>
      </ResponsiveShow>
    </a>
  );
}

// デバイス情報表示コンポーネント（開発用）
export function DeviceInfo() {
  const { currentBreakpoint, windowWidth } = useBreakpoint();
  const { deviceType, isTouchDevice } = useDeviceType();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-wb-wood-100 border border-wb-wood-300 rounded-lg p-3 text-xs z-50">
      <div className="font-semibold text-wb-wood-800 mb-1">
        🍺 Brew Debug Info
      </div>
      <div className="text-wb-wood-600">
        <div>Breakpoint: {currentBreakpoint}</div>
        <div>Width: {windowWidth}px</div>
        <div>Device: {deviceType}</div>
        <div>Touch: {isTouchDevice ? 'Yes' : 'No'}</div>
      </div>
    </div>
  );
}

// レスポンシブナビゲーションコンポーネント
interface ResponsiveNavProps {
  children: React.ReactNode;
  mobileMenuOpen?: boolean;
  onMobileMenuToggle?: () => void;
}

export function ResponsiveNav({
  children,
  mobileMenuOpen = false,
  onMobileMenuToggle,
}: ResponsiveNavProps) {
  const { deviceType } = useDeviceType();

  if (deviceType === 'mobile') {
    return (
      <div className="wb-nav-mobile">
        <button
          onClick={onMobileMenuToggle}
          className="wb-nav-mobile-toggle"
          aria-label="メニューを開く"
        >
          ☰
        </button>
        {mobileMenuOpen && <div className="wb-nav-mobile-menu">{children}</div>}
      </div>
    );
  }

  return <div className="wb-nav-desktop">{children}</div>;
}

// パフォーマンス最適化：画像の遅延読み込み
interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}

export function ResponsiveImage({
  src,
  alt,
  className = '',
  sizes = '100vw',
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`img-${src}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <div id={`img-${src}`} className={`wb-image-container ${className}`}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`wb-image-responsive ${isLoaded ? 'loaded' : 'loading'}`}
          sizes={sizes}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />
      )}
      {!isLoaded && isInView && (
        <div className="wb-image-placeholder">
          <div className="wb-loading-spinner">🍺</div>
        </div>
      )}
    </div>
  );
}
