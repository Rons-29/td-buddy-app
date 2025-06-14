'use client';

import CSVTestDataGeneratorV2 from '../../components/CSVTestDataGeneratorV2';

export default function CSVTestPage() {
  return (
    <div className="min-h-screen wb-workbench-bg">
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8"
        style={{ background: 'var(--wb-workshop-bg)' }}
      >
        <CSVTestDataGeneratorV2 />
      </div>
    </div>
  );
}
