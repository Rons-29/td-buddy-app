'use client';

import React from 'react';
import { TextToolsContainer } from '../../components/TextToolsContainer';

export default function TextToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="w-full px-4 py-6 lg:px-8">
        <TextToolsContainer />
      </div>
    </div>
  );
} 