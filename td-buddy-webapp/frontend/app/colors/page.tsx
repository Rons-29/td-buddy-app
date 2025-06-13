'use client';

import ColorDataGenerator from '../../components/ColorDataGenerator';

export default function ColorsPage() {
  return (
    <div className="min-h-screen wb-workbench-bg">
      <div className="w-full px-4 py-6 lg:px-8">
        <ColorDataGenerator />
      </div>
    </div>
  );
}
