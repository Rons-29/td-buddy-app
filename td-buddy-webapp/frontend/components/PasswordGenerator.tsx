'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Copy, RefreshCw, Shield, Eye, EyeOff, Settings2, CheckCircle, Zap } from 'lucide-react';
import TDCharacter, { TDEmotion, TDAnimation } from './TDCharacter';
import { CompositionSelector } from './CompositionSelector';
import { CustomSymbolsInput } from './CustomSymbolsInput';
import { PasswordCriteria, PasswordResult, APIResponse, TDState, PasswordPreset } from '../types/password';
import { DEFAULT_PASSWORD_PRESETS } from '../data/passwordPresets';

export const PasswordGenerator: React.FC = () => {
  // 構成プリセット状態
  const [selectedPresetId, setSelectedPresetId] = useState<string>('other');
  const [customSymbols, setCustomSymbols] = useState<string>('$@_#&?');
  const [customCharsets, setCustomCharsets] = useState<any[]>([]);

  // 設定状態（既存）
  const [criteria, setCriteria] = useState<PasswordCriteria>({
    length: 12,
    count: 3,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false,
    excludeAmbiguous: true,
    customCharacters: ''
  });

  // UI状態（既存）
  const [result, setResult] = useState<PasswordResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPasswords, setShowPasswords] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // TDキャラクター状態（既存）
  const [tdState, setTdState] = useState<TDState>({
    emotion: 'happy',
    animation: 'float',
    message: 'パスワード生成の準備ができました！構成プリセットをお選びください♪',
    showSpeechBubble: true
  });

  // フォーム参照
  const customCharsRef = useRef<HTMLInputElement>(null);

  // プリセット変更時の処理
  const handlePresetChange = (presetId: string, preset: PasswordPreset) => {
    setSelectedPresetId(presetId);
    
    // プリセットの設定を適用
    if (preset.criteria) {
      setCriteria(prev => ({
        ...prev,
        ...preset.criteria
      }));
    }

         // TDキャラクターの反応
     setTdState(prev => ({
       ...prev,
       emotion: 'excited',
       animation: 'bounce',
       message: `${preset.icon} ${preset.name}プリセットを選択しました！`,
       showSpeechBubble: true
     }));

    setTimeout(() => {
      setTdState(prev => ({ ...prev, showSpeechBubble: false }));
    }, 2000);
  };

  // 強度に応じた色とアイコン
  const getStrengthInfo = (strength: string) => {
    switch (strength) {
      case 'very-strong':
        return { color: 'text-green-600', bg: 'bg-green-100', icon: '🛡️', label: '非常に強い' };
      case 'strong':
        return { color: 'text-blue-600', bg: 'bg-blue-100', icon: '🔒', label: '強い' };
      case 'medium':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '⚠️', label: '普通' };
      case 'weak':
        return { color: 'text-red-600', bg: 'bg-red-100', icon: '⚡', label: '弱い' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', icon: '❓', label: '不明' };
    }
  };

  // パスワード生成API呼び出し（構成プリセット対応）
  const generatePasswords = async () => {
    setIsGenerating(true);
    setApiError(null);
    setTdState(prev => ({
      ...prev,
      emotion: 'thinking',
      animation: 'wiggle',
      message: 'パスワードを生成中です... しばらくお待ちください♪',
      showSpeechBubble: true
    }));

    try {
      let endpoint = 'http://localhost:3001/api/password/generate';
      let requestBody: any = criteria;

      // 構成プリセットが選択されている場合は新しいAPIを使用
      if (selectedPresetId !== 'none' && selectedPresetId !== 'other') {
        endpoint = 'http://localhost:3001/api/password/generate-with-composition';
        requestBody = {
          length: criteria.length,
          count: criteria.count,
          composition: selectedPresetId,
          excludeAmbiguous: criteria.excludeAmbiguous,
          excludeSimilar: true,
          ...(selectedPresetId === 'custom-symbols' && { customSymbols }),
          ...(selectedPresetId === 'custom-charsets' && { customCharsets })
        };
      } else {
        // none または other プリセットの場合は、基本API を使用
        endpoint = 'http://localhost:3001/api/password/generate-with-composition';
        requestBody = {
          length: criteria.length,
          count: criteria.count,
          composition: selectedPresetId,
          excludeAmbiguous: criteria.excludeAmbiguous,
          excludeSimilar: true,
          useNumbers: criteria.includeNumbers,
          useUppercase: criteria.includeUppercase,
          useLowercase: criteria.includeLowercase,
          useSymbols: criteria.includeSymbols
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': `td-session-${Date.now()}`,
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data: APIResponse = await response.json();
      setResult(data.data);

      // TDキャラクターの成功反応
      setTdState(prev => ({
        ...prev,
        emotion: 'excited',
        animation: 'heartbeat',
        message: data.tdMessage || `${data.data.strength}強度のパスワードを${data.data.passwords.length}個生成しました！`,
        showSpeechBubble: true
      }));

      setTimeout(() => {
        setTdState(prev => ({ ...prev, showSpeechBubble: false }));
      }, 3000);

    } catch (error) {
      console.error('パスワード生成エラー:', error);
      setApiError(error instanceof Error ? error.message : '不明なエラーが発生しました');
      
      setTdState(prev => ({
        ...prev,
        emotion: 'sad',
        animation: 'wiggle',
        message: 'エラーが発生しました... 設定を確認して再度お試しください',
        showSpeechBubble: true
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  // クリップボードコピー
  const copyToClipboard = async (password: string, index: number) => {
    try {
      await navigator.clipboard.writeText(password);
      setCopiedIndex(index);
      
      setTdState(prev => ({
        ...prev,
        emotion: 'happy',
        animation: 'bounce',
        message: 'クリップボードにコピーしました！安全に使用してくださいね♪',
        showSpeechBubble: true
      }));

      setTimeout(() => {
        setCopiedIndex(null);
        setTdState(prev => ({ ...prev, showSpeechBubble: false }));
      }, 2000);
    } catch (error) {
      console.error('コピーエラー:', error);
      setTdState(prev => ({
        ...prev,
        emotion: 'confused',
        message: 'コピーに失敗しました... 手動でコピーしてください',
        showSpeechBubble: true
      }));
    }
  };

  // 全パスワードをコピー
  const copyAllPasswords = async () => {
    if (!result?.passwords) return;
    
    const allPasswords = result.passwords.join('\n');
    try {
      await navigator.clipboard.writeText(allPasswords);
      setTdState(prev => ({
        ...prev,
        emotion: 'excited',
        animation: 'heartbeat',
        message: `${result.passwords.length}個すべてのパスワードをコピーしました！`,
        showSpeechBubble: true
      }));

      setTimeout(() => {
        setTdState(prev => ({ ...prev, showSpeechBubble: false }));
      }, 2000);
    } catch (error) {
      console.error('全コピーエラー:', error);
    }
  };

  // 設定変更処理
  const handleCriteriaChange = (key: keyof PasswordCriteria, value: any) => {
    setCriteria(prev => ({ ...prev, [key]: value }));
    
    // カスタム文字が変更された場合のTD反応
    if (key === 'customCharacters' && value) {
      setTdState(prev => ({
        ...prev,
        emotion: 'thinking',
        message: 'カスタム文字を設定しました♪ より個性的なパスワードになりますね！',
        showSpeechBubble: true
      }));
      
      setTimeout(() => {
        setTdState(prev => ({ ...prev, showSpeechBubble: false }));
      }, 2000);
    }
  };

  return (
    <div className="w-full mx-auto p-4 lg:p-6 space-y-6">
      {/* ヘッダー */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🔐 TestData Buddy パスワード生成
        </h1>
        <p className="text-gray-600">
          構成プリセット機能で、より実用的なパスワードを生成します
        </p>
      </div>

      {/* TDキャラクター */}
      <div className="flex justify-center">
        <TDCharacter
          emotion={tdState.emotion}
          animation={tdState.animation}
          message={tdState.message}
          showSpeechBubble={tdState.showSpeechBubble}
          size="medium"
        />
      </div>

      {/* 設定エリア（フル幅） */}
      <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
        <h2 className="text-xl font-semibold mb-4">🎯 生成設定</h2>
        
        {/* 構成プリセット選択（フル幅） */}
        <CompositionSelector
          selectedPresetId={selectedPresetId}
          onPresetChange={handlePresetChange}
          className="mb-8"
        />

        {/* 基本設定（水平レイアウト） */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* パスワード長 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              パスワード長
            </label>
            <input
              type="range"
              min="4"
              max="50"
              value={criteria.length}
              onChange={(e) => handleCriteriaChange('length', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-500 mt-1">
              {criteria.length}文字
            </div>
          </div>

          {/* 生成個数 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              生成個数
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={criteria.count}
              onChange={(e) => handleCriteriaChange('count', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-500 mt-1">
              {criteria.count}個
            </div>
          </div>

          {/* 除外オプション */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              除外オプション
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={criteria.excludeAmbiguous}
                  onChange={(e) => handleCriteriaChange('excludeAmbiguous', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">紛らわしい文字を除外</span>
              </label>
            </div>
          </div>

          {/* 生成ボタン */}
          <div className="flex items-end">
            <button
              onClick={generatePasswords}
              disabled={isGenerating}
              className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition-all ${
                isGenerating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  生成中...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Zap className="w-4 h-4 mr-2" />
                  パスワード生成
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 詳細設定（必要時のみ表示） */}
        {(selectedPresetId === 'none' || selectedPresetId === 'other') && (
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              使用する文字種（デフォルト/その他プリセット時）
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={criteria.includeUppercase}
                  onChange={(e) => handleCriteriaChange('includeUppercase', e.target.checked)}
                  className="mr-2"
                />
                大文字 (A-Z)
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={criteria.includeLowercase}
                  onChange={(e) => handleCriteriaChange('includeLowercase', e.target.checked)}
                  className="mr-2"
                />
                小文字 (a-z)
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={criteria.includeNumbers}
                  onChange={(e) => handleCriteriaChange('includeNumbers', e.target.checked)}
                  className="mr-2"
                />
                数字 (0-9)
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={criteria.includeSymbols}
                  onChange={(e) => handleCriteriaChange('includeSymbols', e.target.checked)}
                  className="mr-2"
                />
                記号 (!@#$)
              </label>
            </div>
          </div>
        )}

        {/* カスタム記号入力（custom-symbolsプリセット時のみ表示） */}
        {selectedPresetId === 'custom-symbols' && (
          <div className="border-t border-gray-200 pt-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                🎨 カスタム記号を設定
              </label>
              <CustomSymbolsInput
                value={customSymbols}
                onChange={setCustomSymbols}
                showSuggestions={true}
              />
            </div>
          </div>
        )}
      </div>

      {/* エラー表示 */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600 mr-2">❌</div>
            <div>
              <h3 className="font-medium text-red-800">エラー</h3>
              <p className="text-red-700 text-sm">{apiError}</p>
            </div>
          </div>
        </div>
      )}

      {/* 生成結果（下部にフル幅表示） */}
      {result && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">🔐 生成結果</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPasswords(!showPasswords)}
                className="p-2 text-gray-500 hover:text-gray-700"
                title={showPasswords ? 'パスワードを隠す' : 'パスワードを表示'}
              >
                {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={copyAllPasswords}
                className="p-2 text-gray-500 hover:text-gray-700"
                title="すべてコピー"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 強度表示 */}
          <div className="mb-4">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStrengthInfo(result.strength).bg} ${getStrengthInfo(result.strength).color}`}>
              <span className="mr-1">{getStrengthInfo(result.strength).icon}</span>
              強度: {getStrengthInfo(result.strength).label}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              推定解読時間: {result.estimatedCrackTime}
            </p>
          </div>

          {/* パスワードリスト（グリッドレイアウト） */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-4">
            {result.passwords.map((password, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <code className="font-mono text-sm flex-1 truncate">
                  {showPasswords ? password : '●'.repeat(password.length)}
                </code>
                <button
                  onClick={() => copyToClipboard(password, index)}
                  className={`ml-3 p-2 rounded transition-all ${
                    copiedIndex === index
                      ? 'text-green-600 bg-green-100'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                  }`}
                  title="コピー"
                >
                  {copiedIndex === index ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>

          {/* 構成プリセット情報表示 */}
          {(result as any).composition && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <h4 className="font-medium text-blue-900 mb-2">✅ 構成要件チェック</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {(result as any).composition.appliedRequirements.map((req: any, index: number) => (
                  <div key={index} className="flex items-center justify-between text-sm bg-white p-2 rounded">
                    <span className="text-blue-800">{req.name}</span>
                    <span className={`px-2 py-1 rounded text-xs ${req.satisfied ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {req.satisfied ? '✓ 満足' : '✗ 不足'} ({req.actualCount}/{req.requiredCount})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500">
            生成日時: {new Date(result.generatedAt).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}; 