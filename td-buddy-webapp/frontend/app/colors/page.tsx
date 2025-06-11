'use client';

import ColorDataGenerator from '../../components/ColorDataGenerator';

export default function ColorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      <div className="w-full px-4 py-6 lg:px-8">
        <ColorDataGenerator />
      </div>
    </div>
  );
} 