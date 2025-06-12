'use client';

import { UuidGenerator } from '../../components/UuidGenerator';
import { UuidUseCases } from '../../components/uuid/UuidUseCases';

export default function UuidPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="w-full px-4 py-6 lg:px-8 space-y-8">
        <UuidGenerator />
        <UuidUseCases />
      </div>
    </div>
  );
} 