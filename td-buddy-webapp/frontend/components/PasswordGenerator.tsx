'use client';

import React, { useState, useRef } from 'react';
import { Copy, RefreshCw, Shield, Eye, EyeOff, Settings2, CheckCircle } from 'lucide-react';
import TDCharacter, { TDEmotion, TDAnimation } from './TDCharacter';

// TDキャラクター状態の型
interface TDState {
  emotion: TDEmotion;
  animation: TDAnimation;
  message: string;
  showSpeechBubble: boolean;
}

// パスワード生成設定の型
interface PasswordCriteria {
  length: number;
  count: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
  customCharacters?: string;
}

// パスワード生成結果の型
interface PasswordResult {
  passwords: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  estimatedCrackTime: string;
  criteria: PasswordCriteria;
  generatedAt: string;
}

// API レスポンスの型
interface APIResponse {
  success: boolean;
  data: PasswordResult;
  tdMessage: string;
  timestamp: string;
  requestId: string;
}

export const PasswordGenerator: React.FC = () => {
  // 設定状態
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

  // UI状態
  const [result, setResult] = useState<PasswordResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPasswords, setShowPasswords] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // TDキャラクター状態
  const [tdState, setTdState] = useState<TDState>({
    emotion: 'happy' as TDEmotion,
    animation: 'float' as TDAnimation,
    message: 'パスワード生成の準備ができました！設定をお選びください♪',
    showSpeechBubble: true
  });

  // フォーム参照
  const customCharsRef = useRef<HTMLInputElement>(null);

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

  // パスワード生成API呼び出し
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
      const response = await fetch('http://localhost:3001/api/password/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': `td-session-${Date.now()}`, // 簡易セッションID
        },
        body: JSON.stringify(criteria)
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

      // 3秒後にメッセージを非表示
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

  // 設定変更ハンドラー
  const handleCriteriaChange = (key: keyof PasswordCriteria, value: any) => {
    setCriteria(prev => ({ ...prev, [key]: value }));
    
    // 設定変更時のTDリアクション
    if (key === 'length') {
      if (value >= 16) {
        setTdState(prev => ({
          ...prev,
          emotion: 'happy',
          message: '長いパスワードは安全性が高いです！素晴らしい選択ですね♪'
        }));
      } else if (value < 8) {
        setTdState(prev => ({
          ...prev,
          emotion: 'worried',
          message: '8文字以上をお勧めします。セキュリティを考慮してくださいね'
        }));
      }
    }
    
    if (key === 'includeSymbols' && value) {
      setTdState(prev => ({
        ...prev,
        emotion: 'excited',
        message: '記号を含めると強度がアップします！いい判断です♪'
      }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <Shield className="h-8 w-8 text-blue-600" />
          パスワード生成器
        </h1>
        <p className="text-gray-600">暗号学的に安全なパスワードを生成します</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* TDキャラクター */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <TDCharacter {...tdState} />
          </div>
        </div>

        {/* 設定フォーム */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              パスワード設定
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {/* 長さ設定 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  パスワード長: {criteria.length}文字
                </label>
                <input
                  type="range"
                  min="4"
                  max="128"
                  value={criteria.length}
                  onChange={(e) => handleCriteriaChange('length', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>4</span>
                  <span>128</span>
                </div>
              </div>

              {/* 生成数設定 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  生成数
                </label>
                <select
                  value={criteria.count}
                  onChange={(e) => handleCriteriaChange('count', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1, 2, 3, 5, 10, 20, 50].map(num => (
                    <option key={num} value={num}>{num}個</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 文字種選択 */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                使用する文字種
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { key: 'includeUppercase', label: '大文字 (A-Z)', example: 'ABC' },
                  { key: 'includeLowercase', label: '小文字 (a-z)', example: 'abc' },
                  { key: 'includeNumbers', label: '数字 (0-9)', example: '123' },
                  { key: 'includeSymbols', label: '記号 (!@#$)', example: '!@#' },
                ].map(({ key, label, example }) => (
                  <label key={key} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={criteria[key as keyof PasswordCriteria] as boolean}
                      onChange={(e) => handleCriteriaChange(key as keyof PasswordCriteria, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="flex-1 text-sm text-gray-700">{label}</span>
                    <span className="text-xs text-gray-500 font-mono">{example}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 詳細設定 */}
            <div className="mt-6">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              >
                詳細設定 {showAdvanced ? '▲' : '▼'}
              </button>
              
              {showAdvanced && (
                <div className="mt-3 space-y-3 p-4 bg-gray-50 rounded-lg">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={criteria.excludeAmbiguous}
                      onChange={(e) => handleCriteriaChange('excludeAmbiguous', e.target.checked)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">
                      紛らわしい文字を除外 (0, O, l, I など)
                    </span>
                  </label>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      カスタム文字
                    </label>
                    <input
                      ref={customCharsRef}
                      type="text"
                      value={criteria.customCharacters || ''}
                      onChange={(e) => handleCriteriaChange('customCharacters', e.target.value)}
                      placeholder="追加したい文字を入力"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 生成ボタン */}
            <div className="mt-6">
              <button
                onClick={generatePasswords}
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    パスワード生成
                  </>
                )}
              </button>
            </div>

            {/* エラー表示 */}
            {apiError && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-800 text-sm">{apiError}</p>
              </div>
            )}
          </div>

          {/* 生成結果 */}
          {result && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">生成結果</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
                    title={showPasswords ? 'パスワードを非表示' : 'パスワードを表示'}
                  >
                    {showPasswords ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={copyAllPasswords}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm flex items-center gap-1"
                  >
                    <Copy className="h-4 w-4" />
                    全てコピー
                  </button>
                </div>
              </div>

              {/* 強度表示 */}
              {(() => {
                const strengthInfo = getStrengthInfo(result.strength);
                return (
                  <div className={`${strengthInfo.bg} ${strengthInfo.color} p-3 rounded-lg mb-4`}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{strengthInfo.icon}</span>
                      <span className="font-medium">強度: {strengthInfo.label}</span>
                      <span className="text-sm">({result.estimatedCrackTime})</span>
                    </div>
                  </div>
                );
              })()}

              {/* パスワード一覧 */}
              <div className="space-y-2">
                {result.passwords.map((password, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500 w-6">{index + 1}</span>
                    <code className="flex-1 font-mono text-sm">
                      {showPasswords ? password : '•'.repeat(password.length)}
                    </code>
                    <button
                      onClick={() => copyToClipboard(password, index)}
                      className="p-2 text-gray-600 hover:text-gray-800 rounded hover:bg-gray-200 transition-colors"
                      title="クリップボードにコピー"
                    >
                      {copiedIndex === index ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* 生成情報 */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  生成日時: {new Date(result.generatedAt).toLocaleString('ja-JP')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 