// 🌐 環境情報表示コンポーネント
'use client';

import { APP_CONFIG, TD_MESSAGES } from '@/lib/config';
import { useState } from 'react';

export const EnvironmentInfo: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const envInfo = APP_CONFIG.environmentInfo;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* トグルボタン */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="環境情報を表示"
      >
        🍺
      </button>

      {/* 環境情報パネル */}
      {isVisible && (
        <div className="absolute bottom-12 left-0 bg-white border-2 border-blue-200 rounded-lg shadow-xl p-4 min-w-80">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-blue-600">🍺 TD環境情報</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* 環境情報 */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium text-gray-700">環境:</div>
              <div
                className={`px-2 py-1 rounded text-xs font-medium ${
                  envInfo.environment === 'production'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {envInfo.environment}
              </div>

              <div className="font-medium text-gray-700">動作モード:</div>
              <div
                className={`px-2 py-1 rounded text-xs font-medium ${
                  envInfo.apiMode === 'offline'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {envInfo.apiMode}
              </div>

              <div className="font-medium text-gray-700">API URL:</div>
              <div className="text-xs text-gray-600 break-all">
                {envInfo.apiBaseUrl}
              </div>
            </div>

            {/* 機能状況 */}
            <div className="border-t pt-3">
              <div className="text-sm font-medium text-gray-700 mb-2">
                利用可能機能:
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-xs">
                  <span className="w-4 h-4 mr-2">
                    {envInfo.features.localGeneration ? '✅' : '❌'}
                  </span>
                  ローカル醸造
                </div>
                <div className="flex items-center text-xs">
                  <span className="w-4 h-4 mr-2">
                    {envInfo.features.apiGeneration ? '✅' : '❌'}
                  </span>
                  API醸造
                </div>
                <div className="flex items-center text-xs">
                  <span className="w-4 h-4 mr-2">
                    {envInfo.features.backendIntegration ? '✅' : '❌'}
                  </span>
                  バックエンド連携
                </div>
              </div>
            </div>

            {/* TDメッセージ */}
            <div className="border-t pt-3">
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                {envInfo.environment === 'development'
                  ? TD_MESSAGES.DEVELOPMENT_MODE
                  : TD_MESSAGES.PRODUCTION_NOTICE}
              </div>
            </div>
          </div>

          {/* 環境変数確認（開発環境のみ） */}
          {envInfo.environment === 'development' && (
            <div className="border-t pt-3 mt-3">
              <details className="text-xs">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                  環境変数詳細 (開発用)
                </summary>
                <div className="mt-2 bg-gray-50 p-2 rounded space-y-1">
                  <div>NODE_ENV: {process.env.NODE_ENV}</div>
                  <div>
                    NEXT_PUBLIC_API_ENABLED:{' '}
                    {process.env.NEXT_PUBLIC_API_ENABLED || 'undefined'}
                  </div>
                  <div>
                    NEXT_PUBLIC_OFFLINE_MODE:{' '}
                    {process.env.NEXT_PUBLIC_OFFLINE_MODE || 'undefined'}
                  </div>
                  <div>
                    NEXT_PUBLIC_API_BASE_URL:{' '}
                    {process.env.NEXT_PUBLIC_API_BASE_URL || 'undefined'}
                  </div>
                </div>
              </details>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
