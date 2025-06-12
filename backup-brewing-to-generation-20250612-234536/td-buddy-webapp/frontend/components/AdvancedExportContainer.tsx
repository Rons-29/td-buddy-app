'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { FileDown, AlertCircle, CheckCircle, Loader } from 'lucide-react';

export type ExportFormat = 'csv' | 'json' | 'xml' | 'yaml' | 'sql';
export type DataType = 'passwords' | 'personal' | 'custom';

interface ExportSettings {
  format: ExportFormat;
  dataType: DataType;
  count: number;
  batchSize: number;
  encoding: string;
  tableName?: string;
  includeMetadata: boolean;
  streaming: boolean;
}

interface ExportProgress {
  processed: number;
  total: number;
  percentage: number;
  status: 'idle' | 'processing' | 'completed' | 'error';
  message?: string;
}

export function AdvancedExportContainer() {
  const [settings, setSettings] = useState<ExportSettings>({
    format: 'json',
    dataType: 'passwords',
    count: 1000,
    batchSize: 100,
    encoding: 'utf8',
    tableName: 'test_data',
    includeMetadata: true,
    streaming: false,
  });

  const [progress, setProgress] = useState<ExportProgress>({
    processed: 0,
    total: 0,
    percentage: 0,
    status: 'idle',
  });

  // 🆕 活用例からの設定適用機能
  useEffect(() => {
    const handleApplyConfig = (event: CustomEvent) => {
      const config = event.detail;
      setSettings(prev => ({
        ...prev,
        format: config.format,
        count: config.count,
        encoding: config.options?.encoding || prev.encoding,
        tableName: config.options?.tableName || prev.tableName,
        includeMetadata: config.options?.includeHeaders !== false,
        batchSize: config.options?.batchSize || prev.batchSize,
        streaming: config.count > 10000
      }));
      
      // 成功メッセージ表示
      setProgress(prev => ({
        ...prev,
        status: 'idle',
        message: `設定を適用しました: ${config.format.toUpperCase()}形式、${config.count.toLocaleString()}件`
      }));
    };

    window.addEventListener('applyUseCaseConfig', handleApplyConfig as EventListener);
    return () => {
      window.removeEventListener('applyUseCaseConfig', handleApplyConfig as EventListener);
    };
  }, []);

  const handleExport = useCallback(async () => {
    setProgress({
      processed: 0,
      total: settings.count,
      percentage: 0,
      status: 'processing',
      message: 'エクスポートを開始しています...',
    });

    try {
      const exportParams = new URLSearchParams({
        format: settings.format,
        count: settings.count.toString(),
        batchSize: settings.batchSize.toString(),
        encoding: settings.encoding,
        includeMetadata: settings.includeMetadata.toString(),
        streaming: settings.streaming.toString(),
        ...(settings.tableName && { tableName: settings.tableName }),
      });

      const endpoint = settings.dataType === 'passwords' 
        ? '/api/export/passwords'
        : settings.dataType === 'personal'
        ? '/api/export/personal'
        : '/api/export/enhanced';

      // ストリーミング対応の場合
      if (settings.streaming && settings.count > 10000) {
        await handleStreamingExport(endpoint, exportParams);
      } else {
        await handleRegularExport(endpoint, exportParams);
      }

    } catch (error) {
      console.error('Export error:', error);
      setProgress(prev => ({
        ...prev,
        status: 'error',
        message: error instanceof Error ? error.message : 'エクスポートに失敗しました',
      }));
    }
  }, [settings]);

  const handleStreamingExport = async (endpoint: string, params: URLSearchParams) => {
    const response = await fetch(`${endpoint}?${params}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('ストリーミングレスポンスを取得できませんでした');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // プログレス情報を解析（JSONライン形式を想定）
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const progressData = JSON.parse(line);
              if (progressData.processed !== undefined) {
                setProgress(prev => ({
                  ...prev,
                  processed: progressData.processed,
                  percentage: Math.round((progressData.processed / settings.count) * 100),
                  message: `${progressData.processed}/${settings.count} 件処理済み`,
                }));
              }
            } catch (e) {
              // プログレス以外のデータは無視
            }
          }
        }
      }

      setProgress(prev => ({
        ...prev,
        status: 'completed',
        percentage: 100,
        message: 'エクスポートが完了しました！',
      }));

    } finally {
      reader.releaseLock();
    }
  };

  const handleRegularExport = async (endpoint: string, params: URLSearchParams) => {
    const response = await fetch(`${endpoint}?${params}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error?.message || 'エクスポートに失敗しました');
    }

    // ファイルサイズが大きい場合はURLを返す
    const isLargeFile = result.fileSize && result.fileSize > 1024 * 1024; // 1MB

    if (isLargeFile && result.downloadUrl) {
      window.open(result.downloadUrl, '_blank');
    } else if (result.content) {
      // 小さなファイルは直接ダウンロード
      const mimeTypes: { [key: string]: string } = {
        csv: 'text/csv',
        json: 'application/json',
        xml: 'application/xml',
        yaml: 'text/yaml',
        sql: 'text/sql'
      };

      const blob = new Blob([result.content], { 
        type: mimeTypes[settings.format] || 'text/plain'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename || `td-export-${settings.dataType}-${Date.now()}.${settings.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }

    setProgress(prev => ({
      ...prev,
      status: 'completed',
      percentage: 100,
      message: `エクスポートが完了しました！(${result.recordCount}件)`,
    }));
  };

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case 'json': return '📋';
      case 'xml': return '🏷️';
      case 'yaml': return '📄';
      case 'sql': return '🗄️';
      case 'csv': return '📊';
      default: return '📄';
    }
  };

  const ProgressBar = () => {
    if (progress.status === 'idle') return null;

    return (
      <div className="bg-white rounded-lg border border-td-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-td-gray-800">エクスポート進捗</h3>
          <div className="flex items-center space-x-2">
            {progress.status === 'processing' && <Loader className="w-5 h-5 animate-spin text-orange-500" />}
            {progress.status === 'completed' && <CheckCircle className="w-5 h-5 text-td-success-500" />}
            {progress.status === 'error' && <AlertCircle className="w-5 h-5 text-td-error-500" />}
            <span className="font-medium">{progress.percentage}%</span>
          </div>
        </div>
        
        <div className="w-full bg-td-gray-200 rounded-full h-3 mb-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              progress.status === 'error' ? 'bg-td-error-500' : 
              progress.status === 'completed' ? 'bg-td-success-500' : 'bg-orange-500'
            }`}
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        
        {progress.message && (
          <p className={`text-sm ${
            progress.status === 'error' ? 'text-td-error-600' : 
            progress.status === 'completed' ? 'text-td-success-600' : 'text-td-gray-600'
          }`}>
            {progress.message}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 進捗表示 */}
      <ProgressBar />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 設定パネル */}
        <div className="lg:col-span-2 space-y-6">
          {/* フォーマット選択 */}
          <div className="bg-white rounded-lg shadow-md border border-td-gray-200 p-6">
            <h3 className="text-lg font-semibold text-td-gray-800 mb-4">
              📋 出力フォーマット
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {(['csv', 'json', 'xml', 'yaml', 'sql'] as ExportFormat[]).map((format) => (
                <button
                  key={format}
                  onClick={() => setSettings(prev => ({ ...prev, format }))}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    settings.format === format
                      ? 'border-orange-500 bg-orange-100 text-orange-800'
                      : 'border-td-gray-300 bg-white text-td-gray-700 hover:border-orange-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{getFormatIcon(format)}</div>
                  <div className="font-medium">{format.toUpperCase()}</div>
                </button>
              ))}
            </div>
          </div>

          {/* データタイプ選択 */}
          <div className="bg-white rounded-lg shadow-md border border-td-gray-200 p-6">
            <h3 className="text-lg font-semibold text-td-gray-800 mb-4">
              🎯 データタイプ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {([
                { value: 'passwords', label: 'パスワード', icon: '🔐' },
                { value: 'personal', label: '個人情報', icon: '👤' },
                { value: 'custom', label: 'カスタム', icon: '⚙️' },
              ] as Array<{ value: DataType; label: string; icon: string }>).map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSettings(prev => ({ ...prev, dataType: type.value }))}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    settings.dataType === type.value
                      ? 'border-td-secondary-500 bg-td-secondary-100 text-td-secondary-800'
                      : 'border-td-gray-300 bg-white text-td-gray-700 hover:border-td-secondary-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="font-medium">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 詳細設定 */}
          <div className="bg-white rounded-lg shadow-md border border-td-gray-200 p-6">
            <h3 className="text-lg font-semibold text-td-gray-800 mb-4">
              ⚙️ 詳細設定
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-td-gray-700 mb-2">
                  生成件数
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000000"
                  value={settings.count}
                  onChange={(e) => setSettings(prev => ({ ...prev, count: parseInt(e.target.value) || 1 }))}
                  className="w-full p-3 border border-td-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-td-primary-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-td-gray-700 mb-2">
                  バッチサイズ
                </label>
                <select
                  value={settings.batchSize}
                  onChange={(e) => setSettings(prev => ({ ...prev, batchSize: parseInt(e.target.value) }))}
                  className="w-full p-3 border border-td-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-td-primary-200"
                >
                  <option value={50}>50件</option>
                  <option value={100}>100件</option>
                  <option value={500}>500件</option>
                  <option value={1000}>1,000件</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-td-gray-700 mb-2">
                  文字エンコーディング
                </label>
                <select
                  value={settings.encoding}
                  onChange={(e) => setSettings(prev => ({ ...prev, encoding: e.target.value }))}
                  className="w-full p-3 border border-td-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-td-primary-200"
                >
                  <option value="utf8">UTF-8</option>
                  <option value="utf16le">UTF-16LE</option>
                  <option value="latin1">Latin1</option>
                </select>
              </div>

              {settings.format === 'sql' && (
                <div>
                  <label className="block text-sm font-medium text-td-gray-700 mb-2">
                    テーブル名
                  </label>
                  <input
                    type="text"
                    value={settings.tableName || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, tableName: e.target.value }))}
                    className="w-full p-3 border border-td-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-td-primary-200"
                    placeholder="test_data"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.includeMetadata}
                  onChange={(e) => setSettings(prev => ({ ...prev, includeMetadata: e.target.checked }))}
                  className="w-4 h-4 text-orange-600 border-td-gray-300 rounded focus:ring-td-primary-500"
                />
                <span className="text-sm text-td-gray-700">メタデータを含める</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.streaming}
                  onChange={(e) => setSettings(prev => ({ ...prev, streaming: e.target.checked }))}
                  className="w-4 h-4 text-orange-600 border-td-gray-300 rounded focus:ring-td-primary-500"
                />
                <span className="text-sm text-td-gray-700">
                  ストリーミング出力（10,000件以上推奨）
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* アクションパネル */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md border border-td-gray-200 p-6">
            <h3 className="text-lg font-semibold text-td-gray-800 mb-4">
              🚀 エクスポート実行
            </h3>
            
            <button
              onClick={handleExport}
              disabled={progress.status === 'processing'}
              className={`w-full mb-4 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                progress.status === 'processing'
                  ? 'bg-td-gray-400 text-white cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              {progress.status === 'processing' ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>処理中...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-5 h-5" />
                  <span>エクスポート開始</span>
                </>
              )}
            </button>

            <div className="space-y-3 text-sm text-td-gray-600">
              <div className="flex justify-between">
                <span>フォーマット:</span>
                <span className="font-medium">{settings.format.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>データタイプ:</span>
                <span className="font-medium">
                  {settings.dataType === 'passwords' ? 'パスワード' : 
                   settings.dataType === 'personal' ? '個人情報' : 'カスタム'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>生成件数:</span>
                <span className="font-medium">{settings.count.toLocaleString()}件</span>
              </div>
              <div className="flex justify-between">
                <span>推定サイズ:</span>
                <span className="font-medium">
                  {Math.round(settings.count * 0.1)}KB ~ {Math.round(settings.count * 0.5)}KB
                </span>
              </div>
            </div>
          </div>

          {/* ブリューからのヒント */}
          <div className="bg-td-accent-50 border border-td-accent-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-td-accent-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                TD
              </div>
              <div>
                <p className="text-sm text-td-accent-800">
                  <strong>💡 TDのヒント:</strong><br />
                  • 大量データ（10,000件以上）はストリーミング出力がおすすめ<br />
                  • SQLフォーマットでは自動的にCREATE TABLE文も生成<br />
                  • 文字化け防止のため、エンコーディング設定をご確認ください
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 