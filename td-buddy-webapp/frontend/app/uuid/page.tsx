'use client';

import { UuidGenerator } from '../../components/UuidGenerator';
import { UuidUseCases } from '../../components/uuid/UuidUseCases';

export default function UuidPage() {
  return (
    <div className="min-h-screen wb-workbench-bg">
      <div className="w-full px-4 py-6 lg:px-8 space-y-8">
        <UuidGenerator />
        <UuidUseCases />
      </div>
    </div>
  );
}
