'use client';

import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { APP_CONFIG } from '@/lib/config';
import { CheckCircle, Eye, EyeOff, Key, Trash2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AISettings {
  openaiApiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export default function AISettingsPage() {
  const [settings, setSettings] = useState<AISettings>({
    openaiApiKey: '',
    model: 'gpt-4',
    maxTokens: 2000,
    temperature: 0.7,
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(
    null
  );
  const [message, setMessage] = useState('');

  // ページ離脱時にAPIキーをクリア
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (settings.openaiApiKey) {
        // セッションストレージからAPIキーを削除
        sessionStorage.removeItem('temp_openai_key');
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // ページが非表示になったらAPIキーをクリア
        clearApiKey();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [settings.openaiApiKey]);

  const clearApiKey = () => {
    setSettings(prev => ({ ...prev, openaiApiKey: '' }));
    sessionStorage.removeItem('temp_openai_key');
    setTestResult(null);
    setMessage('');
  };

  const handleApiKeyChange = (value: string) => {
    setSettings(prev => ({ ...prev, openaiApiKey: value }));
    // 一時的にセッションストレージに保存（ページリロード対応）
    if (value) {
      sessionStorage.setItem('temp_openai_key', value);
    } else {
      sessionStorage.removeItem('temp_openai_key');
    }
    setTestResult(null);
  };

  const testConnection = async () => {
    if (!settings.openaiApiKey.trim()) {
      setMessage('API Keyを入力してください');
      return;
    }

    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch(
        APP_CONFIG.getApiUrl('/api/ai/test-connection'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            provider: 'openai',
            apiKey: settings.openaiApiKey,
            model: settings.model,
            maxTokens: settings.maxTokens,
            temperature: settings.temperature,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setTestResult('success');
        setMessage('✅ OpenAI API接続成功！AIチャット機能が利用可能です。');
      } else {
        setTestResult('error');
        setMessage(`❌ 接続失敗: ${result.error || '不明なエラー'}`);
      }
    } catch (error) {
      setTestResult('error');
      setMessage(
        `❌ 接続エラー: ${
          error instanceof Error ? error.message : '不明なエラー'
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    if (testResult !== 'success') {
      setMessage('⚠️ 先に接続テストを実行してください');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(APP_CONFIG.getApiUrl('/api/ai/configure'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('✅ AI設定を保存しました！');
        // 設定保存後はAPIキーをクリア（セキュリティ）
        setTimeout(() => {
          clearApiKey();
        }, 2000);
      } else {
        setMessage(`❌ 保存失敗: ${result.error || '不明なエラー'}`);
      }
    } catch (error) {
      setMessage(
        `❌ 保存エラー: ${
          error instanceof Error ? error.message : '不明なエラー'
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ページ読み込み時にセッションストレージから復元
  useEffect(() => {
    const savedKey = sessionStorage.getItem('temp_openai_key');
    if (savedKey) {
      setSettings(prev => ({ ...prev, openaiApiKey: savedKey }));
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-wb-tool-polish-800 mb-2">
          🤖 AI設定
        </h1>
        <p className="text-wb-tool-polish-600">
          OpenAI APIキーを設定してAIチャット機能を有効化します
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            OpenAI API設定
          </CardTitle>
          <CardDescription>
            APIキーは一時的にのみ保存され、ページを離れると自動的にクリアされます
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* API Key入力 */}
          <div className="space-y-2">
            <label
              htmlFor="apiKey"
              className="text-sm font-medium text-gray-700"
            >
              OpenAI API Key
            </label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                value={settings.openaiApiKey}
                onChange={e => handleApiKeyChange(e.target.value)}
                placeholder="sk-..."
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="h-8 w-8 p-0"
                >
                  {showApiKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                {settings.openaiApiKey && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearApiKey}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* モデル設定 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="model"
                className="text-sm font-medium text-gray-700"
              >
                モデル
              </label>
              <select
                id="model"
                value={settings.model}
                onChange={e =>
                  setSettings(prev => ({ ...prev, model: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wb-tool-polish-500"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="maxTokens"
                className="text-sm font-medium text-gray-700"
              >
                最大トークン数
              </label>
              <Input
                id="maxTokens"
                type="number"
                value={settings.maxTokens}
                onChange={e =>
                  setSettings(prev => ({
                    ...prev,
                    maxTokens: parseInt(e.target.value),
                  }))
                }
                min="100"
                max="4000"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="temperature"
                className="text-sm font-medium text-gray-700"
              >
                Temperature
              </label>
              <Input
                id="temperature"
                type="number"
                value={settings.temperature}
                onChange={e =>
                  setSettings(prev => ({
                    ...prev,
                    temperature: parseFloat(e.target.value),
                  }))
                }
                min="0"
                max="2"
                step="0.1"
              />
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-3">
            <Button
              onClick={testConnection}
              disabled={isLoading || !settings.openaiApiKey.trim()}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : testResult === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : testResult === 'error' ? (
                <XCircle className="w-4 h-4" />
              ) : (
                <Key className="w-4 h-4" />
              )}
              接続テスト
            </Button>

            <Button
              onClick={saveSettings}
              disabled={isLoading || testResult !== 'success'}
              variant="secondary"
            >
              設定を保存
            </Button>

            <Button
              onClick={clearApiKey}
              disabled={!settings.openaiApiKey}
              variant="danger"
              className="ml-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              クリア
            </Button>
          </div>

          {/* メッセージ表示 */}
          {message && (
            <div
              className={`p-4 rounded-md border ${
                testResult === 'success'
                  ? 'border-green-200 bg-green-50 text-green-800'
                  : testResult === 'error'
                  ? 'border-red-200 bg-red-50 text-red-800'
                  : 'border-gray-200 bg-gray-50 text-gray-800'
              }`}
            >
              {message}
            </div>
          )}
        </CardContent>
      </Card>

      {/* セキュリティ注意事項 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-amber-600">
            🔒 セキュリティについて
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• APIキーは一時的にのみメモリに保存されます</li>
            <li>
              • ページを離れる、またはブラウザを閉じると自動的にクリアされます
            </li>
            <li>• APIキーはサーバーに永続保存されません</li>
            <li>• 本番環境では環境変数での設定を推奨します</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
