'use client';

import React, { useState, useEffect } from 'react';
import { analyzeText, getCharacterType } from '../utils/textUtils';

interface CharacterDetail {
  char: string;
  type: string;
  code: number;
  unicode: string;
  position: number;
}

export function CharacterAnalysisTab() {
  const [inputText, setInputText] = useState('');
  const [analysisMode, setAnalysisMode] = useState<'overview' | 'detailed'>('overview');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  const stats = analyzeText(inputText);
  
  // 文字の詳細情報を取得
  const getCharacterDetails = (): CharacterDetail[] => {
    return inputText.split('').map((char, index) => ({
      char,
      type: getCharacterType(char),
      code: char.charCodeAt(0),
      unicode: `U+${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`,
      position: index
    }));
  };

  const characterDetails = getCharacterDetails();
  
  // フィルタリング
  const filteredDetails = selectedType === 'all' 
    ? characterDetails 
    : characterDetails.filter(detail => detail.type === selectedType);

  const clearText = () => {
    setInputText('');
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (error) {
      console.error('貼り付けエラー:', error);
    }
  };

  const typeLabels = {
    hiragana: 'ひらがな',
    katakana: 'カタカナ',
    kanji: '漢字',
    alphabet: '英字',
    number: '数字',
    symbol: '記号',
    space: 'スペース',
    other: 'その他'
  };

  const typeColors = {
    hiragana: 'bg-pink-100 text-pink-800 border-pink-300',
    katakana: 'bg-blue-100 text-blue-800 border-blue-300',
    kanji: 'bg-red-100 text-red-800 border-red-300',
    alphabet: 'bg-green-100 text-green-800 border-green-300',
    number: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    symbol: 'bg-purple-100 text-purple-800 border-purple-300',
    space: 'bg-gray-100 text-gray-800 border-gray-300',
    other: 'bg-orange-100 text-orange-800 border-orange-300'
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
              <strong>TDのヒント:</strong> 
              {analysisMode === 'overview' 
                ? 'ハイライト表示で文字種が一目で分かります。改行は⏎、スペースは·で表示されます。'
                : '詳細表示では各文字のUnicodeコードポイントも確認できます。フィルター機能で特定の文字種のみを表示できます。'
              }
            </p>
          </div>
        </div>
      </div>

      {/* 入力エリア */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">テキスト入力</h3>
          <div className="flex space-x-2">
            <button
              onClick={pasteFromClipboard}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <span>📋</span>
              <span>貼り付け</span>
            </button>
            <button
              onClick={clearText}
              className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 flex items-center space-x-2"
            >
              <span>🗑️</span>
              <span>クリア</span>
            </button>
          </div>
        </div>
        
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="文字種を解析したいテキストを入力してください..."
        />
      </div>

      {/* 解析モード選択 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">解析モード</h3>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="analysisMode"
              value="overview"
              checked={analysisMode === 'overview'}
              onChange={(e) => setAnalysisMode(e.target.value as 'overview' | 'detailed')}
              className="mr-2"
            />
            概要表示
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="analysisMode"
              value="detailed"
              checked={analysisMode === 'detailed'}
              onChange={(e) => setAnalysisMode(e.target.value as 'overview' | 'detailed')}
              className="mr-2"
            />
            詳細表示
          </label>
        </div>
      </div>

      {inputText && (
        <>
          {analysisMode === 'overview' ? (
            /* 概要表示 */
            <div className="space-y-6">
              {/* 文字種別統計（視覚的表示） */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">📊</span>
                  文字種別分布
                </h3>
                
                {/* 円グラフ風の棒グラフ */}
                <div className="space-y-3">
                  {Object.entries(stats.characterTypes)
                    .filter(([, count]) => count > 0)
                    .sort(([, a], [, b]) => b - a)
                    .map(([type, count]) => {
                      const percentage = (count / stats.totalCharacters) * 100;
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded border ${
                                typeColors[type as keyof typeof typeColors]
                              }`}>
                                {typeLabels[type as keyof typeof typeLabels]}
                              </span>
                              <span className="text-sm text-gray-600">
                                {count}文字 ({percentage.toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full ${
                                typeColors[type as keyof typeof typeColors].split(' ')[0].replace('bg-', 'bg-').replace('-100', '-400')
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* テキストのハイライト表示 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">🎨</span>
                  文字種別ハイライト
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="text-lg leading-relaxed font-mono">
                    {inputText.split('').map((char, index) => {
                      const type = getCharacterType(char);
                      return (
                        <span
                          key={index}
                          className={`${typeColors[type as keyof typeof typeColors]} px-0.5 mx-0.5 rounded`}
                          title={`${char} (${typeLabels[type as keyof typeof typeLabels]})`}
                        >
                          {char === '\n' ? '⏎' : char === ' ' ? '·' : char}
                        </span>
                      );
                    })}
                  </div>
                </div>
                
                {/* 凡例 */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.entries(typeLabels).map(([type, label]) => (
                    <span
                      key={type}
                      className={`px-2 py-1 text-xs rounded border ${
                        typeColors[type as keyof typeof typeColors]
                      }`}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* 詳細表示 */
            <div className="space-y-6">
              {/* フィルター */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">フィルター:</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">すべて表示</option>
                    {Object.entries(typeLabels).map(([type, label]) => (
                      <option key={type} value={type}>{label}</option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-600">
                    表示中: {filteredDetails.length} / {characterDetails.length} 文字
                  </span>
                </div>
              </div>

              {/* 詳細テーブル */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-96">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          位置
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          文字
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          種別
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unicode
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          コード
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDetails.map((detail, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-mono">
                            {detail.position}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className="text-lg font-mono bg-gray-100 px-2 py-1 rounded">
                              {detail.char === '\n' ? '⏎' : detail.char === ' ' ? '·' : detail.char}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded border ${
                              typeColors[detail.type as keyof typeof typeColors]
                            }`}>
                              {typeLabels[detail.type as keyof typeof typeLabels]}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-mono">
                            {detail.unicode}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-mono">
                            {detail.code}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 