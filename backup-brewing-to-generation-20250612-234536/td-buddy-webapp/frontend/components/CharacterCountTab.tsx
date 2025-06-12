'use client';

import React, { useState, useEffect } from 'react';
import { analyzeText } from '../utils/textUtils';
import { QRCodePreview } from './QRCodePreview';
import { useButtonState } from '../hooks/useButtonState';
import { ActionButton } from './ui/ActionButton';

export function CharacterCountTab() {
  const [inputText, setInputText] = useState('');
  const [mounted, setMounted] = useState(false);
  
  // カスタムフック使用
  const { buttonStates, setButtonActive } = useButtonState();

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = analyzeText(inputText);
  const lines = inputText.split('\n');
  const emptyLines = lines.filter(line => line.trim() === '').length;
  const nonEmptyLines = lines.length - emptyLines;
  const maxLineLength = lines.reduce((max, line) => Math.max(max, line.length), 0);
  const estimatedWords = inputText.split(/\s+/).filter(word => word.trim() !== '').length;
  const estimatedSentences = inputText.split(/[。！？\.\!\?]/).filter(s => s.trim() !== '').length;

  const characterTypeLabels = {
    hiragana: 'ひらがな',
    katakana: 'カタカナ', 
    kanji: '漢字',
    alphabet: '英字',
    number: '数字',
    symbol: '記号',
    space: 'スペース',
    other: 'その他'
  };

  const getCharTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      hiragana: 'bg-td-accent-500',
      katakana: 'bg-orange-500',
      kanji: 'bg-td-secondary-500',
      alphabet: 'bg-blue-500',
      number: 'bg-green-500',
      symbol: 'bg-yellow-500',
      space: 'bg-gray-500',
      other: 'bg-purple-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const handleClearText = () => {
    setInputText('');
    setButtonActive('clear');
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (error) {
      console.error('貼り付けエラー:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* TDのヒント - 上部に移動 */}
      <div className="bg-td-accent-50 border border-td-accent-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-td-accent-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            TD
          </div>
          <div>
            <p className="text-sm text-td-accent-800">
              <strong>TDのヒント:</strong> リアルタイムで文字数がカウントされます。
              文字数制限を設定すると、超過時に警告が表示されます。
              各エンコーディングのバイト数も同時に確認できるので、
              システムの制限に合わせて調整してくださいね！
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 入力エリア */}
        <div className="space-y-6">
          <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
            <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
              ✍️ テキスト入力
            </h3>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="ここにテキストを入力してください..."
              className="w-full h-64 p-3 border border-td-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-td-primary-500 focus:border-orange-500 text-sm font-mono"
            />
            <div className="mt-3 flex justify-between items-center">
              <ActionButton
                type="clear"
                onClick={handleClearText}
                isActive={buttonStates.clear}
                size="sm"
              />
              <div className="text-xs text-td-gray-500">
                文字数制限: 10,000文字
              </div>
            </div>
          </div>
        </div>

        {/* 結果表示エリア */}
        <div className="space-y-6">
          {/* 基本統計 */}
          <div className="bg-white rounded-lg border border-td-secondary-200 p-6">
            <h3 className="text-lg font-semibold text-td-secondary-800 mb-4 flex items-center">
              📊 文字数統計
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-td-secondary-50 rounded border border-td-secondary-200">
                <div className="text-2xl font-bold text-td-secondary-700">{stats.totalCharacters}</div>
                <div className="text-sm text-td-gray-600">文字数</div>
              </div>
              <div className="text-center p-3 bg-td-accent-50 rounded border border-td-accent-200">
                <div className="text-2xl font-bold text-td-accent-700">{stats.totalBytes}</div>
                <div className="text-sm text-td-gray-600">バイト数</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded border border-orange-200">
                <div className="text-2xl font-bold text-orange-700">{stats.totalLines}</div>
                <div className="text-sm text-td-gray-600">行数</div>
              </div>
              <div className="text-center p-3 bg-td-gray-50 rounded border border-td-gray-200">
                <div className="text-2xl font-bold text-td-gray-700">{nonEmptyLines}</div>
                <div className="text-sm text-td-gray-600">空行除く</div>
              </div>
            </div>
          </div>

          {/* 文字種別統計 */}
          <div className="bg-white rounded-lg border border-td-accent-200 p-6">
            <h3 className="text-lg font-semibold text-td-accent-800 mb-4 flex items-center">
              🔤 文字種別
            </h3>
            <div className="space-y-3">
              {Object.entries(characterTypeLabels).map(([type, label]) => {
                const count = stats.characterTypes[type as keyof typeof stats.characterTypes];
                const percentage = stats.totalCharacters > 0 ? (count / stats.totalCharacters * 100) : 0;
                
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-td-gray-700">{label}</span>
                      <span className="text-xs text-td-gray-500">({count})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-td-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getCharTypeColor(type)} transition-all duration-300`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-td-gray-600 w-12 text-right">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* エンコーディング情報 */}
          <div className="bg-white rounded-lg border border-orange-200 p-6">
            <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
              💾 エンコーディング
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center p-2 bg-orange-50 rounded border border-orange-200">
                <span className="text-sm font-medium text-td-gray-700">UTF-8</span>
                <span className="text-sm text-orange-700 font-mono">{stats.encoding.utf8} bytes</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-td-gray-50 rounded border border-td-gray-200">
                <span className="text-sm font-medium text-td-gray-700">Shift_JIS (概算)</span>
                <span className="text-sm text-td-gray-700 font-mono">{stats.encoding.shiftJis} bytes</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-td-gray-50 rounded border border-td-gray-200">
                <span className="text-sm font-medium text-td-gray-700">EUC-JP (概算)</span>
                <span className="text-sm text-td-gray-700 font-mono">{stats.encoding.eucJp} bytes</span>
              </div>
            </div>
          </div>

          {/* 追加統計情報 */}
          {inputText && (
            <div className="bg-white rounded-lg border border-td-secondary-200 p-6">
              <h3 className="text-lg font-semibold text-td-secondary-800 mb-4 flex items-center">
                📈 詳細情報
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-td-gray-600">単語数(概算):</span>
                  <span className="font-mono text-td-secondary-700">{estimatedWords}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-td-gray-600">文数(概算):</span>
                  <span className="font-mono text-td-secondary-700">{estimatedSentences}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-td-gray-600">空行数:</span>
                  <span className="font-mono text-td-secondary-700">{emptyLines}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-td-gray-600">最長行:</span>
                  <span className="font-mono text-td-secondary-700">{maxLineLength}文字</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QRコードプレビュー */}
      <QRCodePreview text={inputText} />
    </div>
  );
} 