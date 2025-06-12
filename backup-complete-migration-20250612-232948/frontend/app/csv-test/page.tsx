'use client';

import CSVTestDataGeneratorV2 from '../../components/CSVTestDataGeneratorV2';

export default function CSVTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full px-4 py-6 lg:px-8">
        <CSVTestDataGeneratorV2 />
      </div>
    </div>
  );
}
