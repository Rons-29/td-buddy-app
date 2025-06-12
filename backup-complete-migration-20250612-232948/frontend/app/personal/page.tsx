'use client';

import React from 'react';
import { PersonalInfoGenerator } from '../../components/PersonalInfoGenerator';

export default function PersonalInfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="w-full px-4 py-6 lg:px-8">
        <PersonalInfoGenerator />
      </div>
    </div>
  );
} 