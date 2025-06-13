'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift

  // その他の重要指標
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte

  // カスタム指標
  pageLoadTime: number | null;
  domContentLoaded: number | null;
  resourceLoadTime: number | null;
}

interface PerformanceGrade {
  metric: string;
  value: number | null;
  grade: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  threshold: { excellent: number; good: number; poor: number };
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    pageLoadTime: null,
    domContentLoaded: null,
    resourceLoadTime: null,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 開発環境でのみ表示
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }

    const measurePerformance = () => {
      // Navigation Timing API
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;

      if (navigation) {
        setMetrics(prev => ({
          ...prev,
          pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
          domContentLoaded:
            navigation.domContentLoadedEventEnd - navigation.fetchStart,
          resourceLoadTime:
            navigation.loadEventEnd - navigation.domContentLoadedEventEnd,
          ttfb: navigation.responseStart - navigation.fetchStart,
        }));
      }

      // Core Web Vitals
      if ('web-vital' in window) {
        // LCP (Largest Contentful Paint)
        new PerformanceObserver(entryList => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // FID (First Input Delay)
        new PerformanceObserver(entryList => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            setMetrics(prev => ({
              ...prev,
              fid: entry.processingStart - entry.startTime,
            }));
          });
        }).observe({ entryTypes: ['first-input'] });

        // CLS (Cumulative Layout Shift)
        let clsValue = 0;
        new PerformanceObserver(entryList => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              setMetrics(prev => ({ ...prev, cls: clsValue }));
            }
          });
        }).observe({ entryTypes: ['layout-shift'] });

        // FCP (First Contentful Paint)
        new PerformanceObserver(entryList => {
          const entries = entryList.getEntries();
          entries.forEach(entry => {
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
            }
          });
        }).observe({ entryTypes: ['paint'] });
      }
    };

    // ページ読み込み完了後に測定
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    return () => {
      window.removeEventListener('load', measurePerformance);
    };
  }, []);

  const getGrade = (metric: string, value: number | null): PerformanceGrade => {
    if (value === null) {
      return {
        metric,
        value,
        grade: 'poor',
        threshold: { excellent: 0, good: 0, poor: 0 },
      };
    }

    const thresholds = {
      lcp: { excellent: 2500, good: 4000, poor: Infinity },
      fid: { excellent: 100, good: 300, poor: Infinity },
      cls: { excellent: 0.1, good: 0.25, poor: Infinity },
      fcp: { excellent: 1800, good: 3000, poor: Infinity },
      ttfb: { excellent: 800, good: 1800, poor: Infinity },
      pageLoadTime: { excellent: 3000, good: 5000, poor: Infinity },
      domContentLoaded: { excellent: 1500, good: 3000, poor: Infinity },
      resourceLoadTime: { excellent: 1000, good: 2000, poor: Infinity },
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    let grade: 'excellent' | 'good' | 'needs-improvement' | 'poor';

    if (value <= threshold.excellent) {
      grade = 'excellent';
    } else if (value <= threshold.good) {
      grade = 'good';
    } else {
      grade = 'needs-improvement';
    }

    return { metric, value, grade, threshold };
  };

  const formatValue = (metric: string, value: number | null): string => {
    if (value === null) {
      return 'N/A';
    }

    if (metric === 'cls') {
      return value.toFixed(3);
    }

    return `${Math.round(value)}ms`;
  };

  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case 'excellent':
        return 'text-green-600 bg-green-50';
      case 'good':
        return 'text-blue-600 bg-blue-50';
      case 'needs-improvement':
        return 'text-yellow-600 bg-yellow-50';
      case 'poor':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getGradeIcon = (grade: string): string => {
    switch (grade) {
      case 'excellent':
        return '🚀';
      case 'good':
        return '✅';
      case 'needs-improvement':
        return '⚠️';
      case 'poor':
        return '🐌';
      default:
        return '❓';
    }
  };

  if (!isVisible) {
    return null;
  }

  const performanceGrades = [
    getGrade('lcp', metrics.lcp),
    getGrade('fid', metrics.fid),
    getGrade('cls', metrics.cls),
    getGrade('fcp', metrics.fcp),
    getGrade('ttfb', metrics.ttfb),
    getGrade('pageLoadTime', metrics.pageLoadTime),
    getGrade('domContentLoaded', metrics.domContentLoaded),
    getGrade('resourceLoadTime', metrics.resourceLoadTime),
  ];

  const overallScore =
    performanceGrades.reduce((acc, grade) => {
      if (grade.value === null) {
        return acc;
      }
      switch (grade.grade) {
        case 'excellent':
          return acc + 100;
        case 'good':
          return acc + 75;
        case 'needs-improvement':
          return acc + 50;
        case 'poor':
          return acc + 25;
        default:
          return acc;
      }
    }, 0) / performanceGrades.filter(g => g.value !== null).length;

  return (
    <div className="fixed z-[9998] max-w-md perf-monitor-container perf-monitor-position perf-monitor-fade-in">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            ⚡ パフォーマンス監視
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                overallScore >= 90
                  ? 'bg-green-100 text-green-800'
                  : overallScore >= 75
                  ? 'bg-blue-100 text-blue-800'
                  : overallScore >= 50
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {Math.round(overallScore)}点
            </span>
          </h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2">
          {performanceGrades.map(grade => (
            <div
              key={grade.metric}
              className={`flex items-center justify-between p-2 rounded text-xs ${getGradeColor(
                grade.grade
              )}`}
            >
              <span className="flex items-center gap-1">
                {getGradeIcon(grade.grade)}
                {grade.metric.toUpperCase()}
              </span>
              <span className="font-mono font-medium">
                {formatValue(grade.metric, grade.value)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-600">
            <div className="flex justify-between">
              <span>🚀 優秀</span>
              <span>✅ 良好</span>
              <span>⚠️ 要改善</span>
              <span>🐌 改善必要</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
