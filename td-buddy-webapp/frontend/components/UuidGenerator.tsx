'use client';

import {
  CheckCircle,
  Copy,
  Database,
  Eye,
  EyeOff,
  Fingerprint,
  Hash,
  RefreshCw,
  Settings2,
} from 'lucide-react';
import React, { useState } from 'react';
import { DEFAULT_UUID_PRESETS, PRESET_ORDER } from '../data/uuidPresets';
import { APP_CONFIG, TD_MESSAGES } from '../lib/config';
import { generateUuidsLocal } from '../lib/uuidUtils';
import {
  ApiResponse,
  TDState,
  UuidGenerateRequest,
  UuidGenerateResponse,
} from '../types/uuid';
import BrewCharacter';

export const UuidGenerator: React.FC = () => {
  // 基本設定状態
  const [selectedPresetId, setSelectedPresetId] =
    useState<string>('database-id');
  const [criteria, setCriteria] = useState<UuidGenerateRequest>({
    count: 5,
    version: 'v4',
    format: 'standard',
  });

  // UI状態
  const [result, setResult] = useState<UuidGenerateResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUuids, setShowUuids] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  // TDキャラクター状態
  const [brewState, setBrewState] = useState<TDState>({
    emotion: 'happy',
    animation: 'float',
    message: APP_CONFIG.isOfflineMode
      ? TD_MESSAGES.OFFLINE_MODE
      : 'UUID生成の準備ができました！用途に合わせてプリセットをお選びください♪',
    showSpeechBubble: true,
  });

  // プリセット変更時の処理
  const handlePresetChange = (presetId: string) => {
    const preset = DEFAULT_UUID_PRESETS[presetId];
    if (!preset) {
      return;
    }

    setSelectedPresetId(presetId);

    // プリセットの設定をcriteriaに反映
    setCriteria(prev => ({
      ...prev,
      ...preset.criteria,
    }));

    // TDキャラクターの反応
    setBrewState(prev => ({
      ...prev,
      emotion: 'happy',
      animation: 'bounce',
      message: `${preset.name}に変更しました♪ ${preset.description}`,
      showSpeechBubble: true,
    }));

    setTimeout(() => {
      setBrewState(prev => ({ ...prev, showSpeechBubble: false }));
    }, 3000);
  };

  // UUID生成API呼び出し
  const generateUuids = async () => {
    if (criteria.count < 1 || criteria.count > 10000) {
      setApiError('醸造個数は1〜10000の範囲で指定してください');
      return;
    }

    setIsGenerating(true);
    setApiError(null);
    setResult(null);

    try {
      // TDキャラクターの状態更新
      setBrewState(prev => ({
        ...prev,
        emotion: 'thinking',
        animation: 'bounce',
        message: `${
          criteria.count
        }個のUUID生成を開始します！${criteria.version.toUpperCase()}形式で作成中♪`,
        showSpeechBubble: true,
      }));

      // オフラインモード時はローカル醸造
      if (APP_CONFIG.isOfflineMode) {
        const localResult = generateUuidsLocal({
          count: criteria.count,
          version: criteria.version,
          format: criteria.format,
        });

        const convertedResult: UuidGenerateResponse = {
          uuids: localResult.uuids,
          criteria: criteria,
          statistics: {
            totalGenerated: localResult.uuids.length,
            versionDistribution: {
              [criteria.version]: localResult.uuids.length,
            },
            formatDistribution: { [criteria.format]: localResult.uuids.length },
            averageEntropy: localResult.metadata?.entropy || 0,
          },
          metadata: localResult.metadata,
          generatedAt: localResult.generatedAt,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        };

        setResult(convertedResult);

        // 成功時のTDキャラクター反応
        setBrewState(prev => ({
          ...prev,
          emotion: 'excited',
          animation: 'bounce',
          message: `🍺 ローカル醸造完了！${criteria.count}個のUUID醸造完了！品質も完璧です♪`,
          showSpeechBubble: true,
        }));

        setTimeout(() => {
          setBrewState(prev => ({ ...prev, showSpeechBubble: false }));
        }, 4000);

        return;
      }

      // API醸造（レガシー - バックエンド設定完了後に有効）
      const apiUrl = APP_CONFIG.getApiUrl('/api/uuid/generate');
      if (!apiUrl) {
        throw new Error('API接続が利用できません');
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': `session-${Date.now()}`,
        },
        body: JSON.stringify(criteria),
      });

      const data: ApiResponse<UuidGenerateResponse> = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'UUID生成に失敗しました');
      }

      setResult(data.data!);

      // 成功時のTDキャラクター反応
      setBrewState(prev => ({
        ...prev,
        emotion: 'excited',
        animation: 'bounce',
        message:
          data.brewMessage ||
          `${criteria.count}個のUUID醸造完了！品質も完璧です♪`,
        showSpeechBubble: true,
      }));

      setTimeout(() => {
        setBrewState(prev => ({ ...prev, showSpeechBubble: false }));
      }, 4000);
    } catch (error: any) {
      console.error('❌ UUID生成エラー:', error);
      setApiError(error.message);

      // エラー時のTDキャラクター反応
      setBrewState(prev => ({
        ...prev,
        emotion: 'error',
        animation: 'wiggle',
        message: 'UUID生成でエラーが発生しました。設定を確認してください',
        showSpeechBubble: true,
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  // UUIDコピー機能
  const copyToClipboard = async (uuid: string, index: number) => {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopiedIndex(index);
      setCopyMessage(`UUID ${index + 1} をコピーしました！`);

      // TDキャラクターの反応
      setBrewState(prev => ({
        ...prev,
        emotion: 'happy',
        animation: 'bounce',
        message: 'UUIDをクリップボードにコピーしました♪',
        showSpeechBubble: true,
      }));

      setTimeout(() => {
        setCopiedIndex(null);
        setCopyMessage(null);
        setBrewState(prev => ({ ...prev, showSpeechBubble: false }));
      }, 2000);
    } catch (error) {
      console.error('❌ コピーエラー:', error);
    }
  };

  // 全UUIDコピー機能
  const copyAllUuids = async () => {
    if (!result?.uuids.length) {
      return;
    }

    try {
      const allUuids = result.uuids.map(item => item.uuid).join('\n');
      await navigator.clipboard.writeText(allUuids);
      setCopyMessage(`全${result.uuids.length}個のUUIDをコピーしました！`);

      // TDキャラクターの反応
      setBrewState(prev => ({
        ...prev,
        emotion: 'excited',
        animation: 'pulse',
        message: `${result.uuids.length}個のUUIDを一括コピーしました！`,
        showSpeechBubble: true,
      }));

      setTimeout(() => {
        setCopyMessage(null);
        setBrewState(prev => ({ ...prev, showSpeechBubble: false }));
      }, 3000);
    } catch (error) {
      console.error('❌ 一括コピーエラー:', error);
    }
  };

  // 条件変更ハンドラ
  const handleCriteriaChange = (key: keyof UuidGenerateRequest, value: any) => {
    setCriteria(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // ランダム性レベルの色分け
  const getRandomnessInfo = (randomness: string) => {
    switch (randomness) {
      case 'cryptographic':
        return {
          color: 'text-green-600',
          bg: 'bg-green-100',
          icon: '🔒',
          label: '暗号学的',
        };
      case 'high':
        return {
          color: 'text-blue-600',
          bg: 'bg-blue-100',
          icon: '⚡',
          label: '高い',
        };
      case 'medium':
        return {
          color: 'text-yellow-600',
          bg: 'bg-yellow-100',
          icon: '⚠️',
          label: '中程度',
        };
      case 'low':
        return {
          color: 'text-red-600',
          bg: 'bg-red-100',
          icon: '📉',
          label: '低い',
        };
      default:
        return {
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          icon: '❓',
          label: '不明',
        };
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ヘッダー */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Fingerprint className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            UUID/GUID醸造ツール
          </h1>
          <Hash className="w-8 h-8 text-blue-600" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          各種バージョン・フォーマット対応のUUID醸造ツール。データベースID、セッション管理、テストデータ作成に最適です。
        </p>
      </div>

      {/* TDキャラクター */}
      <div className="flex justify-center">
        <BrewCharacter
          emotion={brewState.emotion}
          animation={brewState.animation}
          message={brewState.message}
          showSpeechBubble={brewState.showSpeechBubble}
        />
      </div>

      {/* メイン設定パネル */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Settings2 className="w-5 h-5 mr-2 text-purple-600" />
          UUID醸造設定
        </h3>

        {/* プリセット選択 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              プリセット選択
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRESET_ORDER.map(presetId => {
                const preset = DEFAULT_UUID_PRESETS[presetId];
                return (
                  <button
                    key={presetId}
                    onClick={() => handlePresetChange(presetId)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedPresetId === presetId
                        ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">{preset.icon}</span>
                      <span className="font-medium text-sm">{preset.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 基本設定 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                醸造個数
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={criteria.count}
                onChange={e =>
                  handleCriteriaChange('count', parseInt(e.target.value) || 1)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UUIDバージョン
              </label>
              <select
                value={criteria.version}
                onChange={e => handleCriteriaChange('version', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="v1">v1 (タイムスタンプ)</option>
                <option value="v4">v4 (ランダム)</option>
                <option value="v6">v6 (改良タイムスタンプ)</option>
                <option value="v7">v7 (モダン)</option>
                <option value="mixed">Mixed (混合)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                出力フォーマット
              </label>
              <select
                value={criteria.format}
                onChange={e => handleCriteriaChange('format', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="standard">標準 (ハイフン付き)</option>
                <option value="compact">コンパクト (ハイフンなし)</option>
                <option value="uppercase">大文字</option>
                <option value="with-prefix">プレフィックス付き</option>
                <option value="sql-friendly">SQL対応</option>
              </select>
            </div>
          </div>

          {/* 高度な設定 */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-sm text-purple-600 hover:text-purple-700"
            >
              <Settings2 className="w-4 h-4 mr-1" />
              高度な設定 {showAdvanced ? '▼' : '▶'}
            </button>
          </div>

          {showAdvanced && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              {/* タイムスタンプ設定 */}
              {['v1', 'v6', 'v7'].includes(criteria.version) && (
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={criteria.includeTimestamp || false}
                      onChange={e =>
                        handleCriteriaChange(
                          'includeTimestamp',
                          e.target.checked
                        )
                      }
                      className="mr-2"
                    />
                    タイムスタンプ情報を含める
                  </label>
                </div>
              )}

              {/* MACアドレス設定 */}
              {criteria.version === 'v1' && (
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={criteria.includeMacAddress || false}
                      onChange={e =>
                        handleCriteriaChange(
                          'includeMacAddress',
                          e.target.checked
                        )
                      }
                      className="mr-2"
                    />
                    MACアドレス情報を含める
                  </label>
                </div>
              )}

              {/* カスタムプレフィックス */}
              {criteria.format === 'with-prefix' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    カスタムプレフィックス
                  </label>
                  <input
                    type="text"
                    value={criteria.customPrefix || ''}
                    onChange={e =>
                      handleCriteriaChange('customPrefix', e.target.value)
                    }
                    placeholder="例: user_, order_, session_"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* 生成ボタン */}
        <div className="mt-6">
          <button
            onClick={generateUuids}
            disabled={isGenerating}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>UUID醸造中...</span>
              </>
            ) : (
              <>
                <Fingerprint className="w-4 h-4" />
                <span>UUID生成実行</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* エラー表示 */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="text-red-600">❌</div>
            <div>
              <h4 className="font-medium text-red-800">エラーが発生しました</h4>
              <p className="text-red-600 text-sm mt-1">{apiError}</p>
            </div>
          </div>
        </div>
      )}

      {/* コピー完了メッセージ */}
      {copyMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">{copyMessage}</span>
          </div>
        </div>
      )}

      {/* 醸造結果 */}
      {result && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <Database className="w-5 h-5 mr-2 text-purple-600" />
              醸造結果 ({result.uuids.length}個)
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowUuids(!showUuids)}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                {showUuids ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                <span>{showUuids ? '非表示' : '表示'}</span>
              </button>
              <button
                onClick={copyAllUuids}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>全てコピー</span>
              </button>
            </div>
          </div>

          {/* 統計情報 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">醸造個数</div>
              <div className="text-lg font-bold text-blue-800">
                {result.statistics.totalGenerated}
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-600 font-medium">
                平均エントロピー
              </div>
              <div className="text-lg font-bold text-green-800">
                {result.statistics.averageEntropy.toFixed(1)}
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">
                バージョン分布
              </div>
              <div className="text-lg font-bold text-purple-800">
                {Object.keys(result.statistics.versionDistribution).join(', ')}
              </div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-sm text-orange-600 font-medium">
                フォーマット
              </div>
              <div className="text-lg font-bold text-orange-800">
                {result.criteria.format}
              </div>
            </div>
          </div>

          {/* UUID一覧 */}
          {showUuids && (
            <div className="space-y-2">
              {result.uuids.map((uuidItem, index) => {
                const randomnessInfo = getRandomnessInfo(
                  uuidItem.metadata.randomness
                );
                return (
                  <div
                    key={uuidItem.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-lg text-gray-800 break-all">
                          {uuidItem.uuid}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {uuidItem.version}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${randomnessInfo.bg} ${randomnessInfo.color}`}
                          >
                            {randomnessInfo.icon} {randomnessInfo.label}
                          </span>
                        </div>
                      </div>
                      {uuidItem.timestamp && (
                        <div className="text-xs text-gray-500 mt-1">
                          生成時刻:{' '}
                          {new Date(uuidItem.timestamp).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => copyToClipboard(uuidItem.uuid, index)}
                      className={`ml-4 flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${
                        copiedIndex === index
                          ? 'bg-green-100 text-green-700'
                          : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                      }`}
                    >
                      {copiedIndex === index ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">コピー済み</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-sm">コピー</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
