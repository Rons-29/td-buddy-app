'use client';

import CSVTestDataGenerator from '../../components/CSVTestDataGenerator';

export default function CSVTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      <div className="w-full px-4 py-6 lg:px-8">
        <CSVTestDataGenerator />
      </div>
    </div>
  );
} 