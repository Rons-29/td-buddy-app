'use client';

import React from 'react';
import { PasswordGenerator } from '../../components/PasswordGenerator';

export default function PasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full px-4 py-6 lg:px-8">
        <PasswordGenerator />
      </div>
    </div>
  );
} 