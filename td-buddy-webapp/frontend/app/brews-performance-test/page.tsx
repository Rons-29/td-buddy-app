'use client';

import dynamic from 'next/dynamic';

const BrewsPerformanceTest = dynamic(
  () => import('../../components/brews/BrewsPerformanceTest'),
  { ssr: false }
);

/**
 * 🧪 Brews Performance Test Page
 *
 * Phase 4B: パフォーマンステスト & ブラウザ互換性確認
 */

export default function BrewsPerformanceTestPage() {
  return <BrewsPerformanceTest />;
}
