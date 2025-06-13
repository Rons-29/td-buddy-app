'use client';

import DateTimeGenerator from '../../components/DateTimeGenerator';

export default function DateTimePage() {
  return (
    <div className="min-h-screen wb-workbench-bg">
      <div className="w-full px-4 py-6 lg:px-8">
        <DateTimeGenerator />
      </div>
    </div>
  );
}
