// 🌐 環境情報表示コンポーネント
'use client';

import { APP_CONFIG, BREW_MESSAGES } from '@/lib/config';
import React from 'react';
import { Card, CardContent, CardHeader } from './ui/Card';

interface EnvironmentInfoProps {
  className?: string;
}

const EnvironmentInfo: React.FC<EnvironmentInfoProps> = ({
  className = '',
}) => {
  const environmentInfo = {
    environment: process.env.NODE_ENV || 'development',
    appName: APP_CONFIG.APP_NAME,
    version: APP_CONFIG.APP_VERSION,
    brewCharacter: APP_CONFIG.BREW_CHARACTER,
    features: APP_CONFIG.FEATURES,
  };

  const isDevelopment = environmentInfo.environment === 'development';

  return (
    <Card className={`border-orange-200 bg-orange-50 ${className}`}>
      <CardHeader className="pb-3">
        <h3 className="text-lg font-bold text-orange-600">🍺 Brew環境情報</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-medium text-orange-700">アプリ名:</span>
            <span className="ml-2 text-orange-600">
              {environmentInfo.appName}
            </span>
          </div>
          <div>
            <span className="font-medium text-orange-700">バージョン:</span>
            <span className="ml-2 text-orange-600">
              {environmentInfo.version}
            </span>
          </div>
          <div>
            <span className="font-medium text-orange-700">環境:</span>
            <span
              className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                isDevelopment
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {environmentInfo.environment}
            </span>
          </div>
          <div>
            <span className="font-medium text-orange-700">助手:</span>
            <span className="ml-2 text-orange-600">
              {environmentInfo.brewCharacter}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-orange-200">
          <h4 className="font-medium text-orange-700 mb-2">🚀 利用可能機能</h4>
          <div className="flex flex-wrap gap-1">
            {Object.entries(environmentInfo.features).map(([key, enabled]) => (
              <span
                key={key}
                className={`px-2 py-1 rounded-full text-xs ${
                  enabled
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {enabled ? '✅' : '❌'} {key.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Brewメッセージ */}
        <div className="pt-3 border-t border-orange-200">
          <div className="bg-orange-100 rounded-lg p-3">
            <p className="text-sm text-orange-800">
              🍺 <strong>Brewからのメッセージ:</strong>{' '}
              {isDevelopment
                ? BREW_MESSAGES.DEVELOPMENT_MODE
                : BREW_MESSAGES.PRODUCTION_NOTICE}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnvironmentInfo;
