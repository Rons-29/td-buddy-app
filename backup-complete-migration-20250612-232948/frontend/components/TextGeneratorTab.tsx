'use client';

import React, { useState, useEffect } from 'react';
import { generateRandomText, WEB_TEXT_LENGTH_PRESETS, getTextLengthPreset } from '../utils/textUtils';
import { QRCodePreview } from './QRCodePreview';
import { useButtonState } from '../hooks/useButtonState';
import { useClipboard } from '../hooks/useClipboard';
import { ActionButton } from './ui/ActionButton';

type GenerationMode = 'single' | 'multi';

interface CharacterTypes {
  hiragana: boolean;
  katakana: boolean;
  alphabet: boolean;
  numbers: boolean;
  symbols: boolean;
  kanji: boolean;
}

export function TextGeneratorTab() {
  const [mode, setMode] = useState<GenerationMode>('single');
  const [charTypes, setCharTypes] = useState<CharacterTypes>({
    hiragana: true,
    katakana: false,
    alphabet: false,
    numbers: false,
    symbols: false,
    kanji: false
  });
  const [length, setLength] = useState(20);
  const [lines, setLines] = useState(5);
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  // カスタムフック使用
  const { buttonStates, setButtonActive } = useButtonState();
  const { copyToClipboard: clipboardCopy } = useClipboard();

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasSelectedCharTypes = Object.values(charTypes).some(Boolean);

  // プリセット選択時の長さ更新
  const handlePresetChange = (presetName: string) => {
    setSelectedPreset(presetName);
    const preset = getTextLengthPreset(presetName);
    if (preset && preset.name !== 'カスタム') {
      setLength(preset.length);
    }
  };

  const generateText = async () => {
    if (!hasSelectedCharTypes) return;

    setIsGenerating(true);
    
    // 少し遅延を追加してローディング状態を見せる
    setTimeout(() => {
      try {
        const selectedTypes = Object.entries(charTypes)
          .filter(([_, selected]) => selected)
          .map(([type, _]) => type);

        if (mode === 'single') {
          const text = generateRandomText({
            length,
            includeHiragana: charTypes.hiragana,
            includeKatakana: charTypes.katakana,
            includeKanji: charTypes.kanji,
            includeAlphabet: charTypes.alphabet,
            includeNumber: charTypes.numbers,
            includeSymbol: charTypes.symbols
          });
          setGeneratedText(text);
        } else {
          const textLines = Array.from({ length: lines }, () => 
            generateRandomText({
              length,
              includeHiragana: charTypes.hiragana,
              includeKatakana: charTypes.katakana,
              includeKanji: charTypes.kanji,
              includeAlphabet: charTypes.alphabet,
              includeNumber: charTypes.numbers,
              includeSymbol: charTypes.symbols
            })
          );
          setGeneratedText(textLines.join('\n'));
        }
        setButtonActive('generate');
      } catch (error) {
        console.error('テキスト生成エラー:', error);
        setGeneratedText('エラーが発生しました。設定を確認してください。');
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };

  // 共通化されたアクション関数
  const handleCopyToClipboard = async () => {
    const success = await clipboardCopy(generatedText);
    if (success) {
      setButtonActive('copy');
    }
  };

  const handleClearResult = () => {
    setGeneratedText('');
    setButtonActive('clear');
  };

  if (!mounted) {
    return <div className="text-center">読み込み中...</div>;
  }

  return (
    <div>
      {/* TDのヒント - 上部に移動 */}
      <div className="bg-td-accent-50 border border-td-accent-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-td-accent-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            TD
          </div>
          <div>
            <p className="text-sm text-td-accent-800">
              <strong>TDのヒント:</strong> Web系の制限に合わせたプリセット長さを用意しました！
              生成されたテキストはQRコードにも変換できるので、テストデータの共有が簡単になります。
              文字種の組み合わせを変えて、様々なパターンを試してみてくださいね！
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 設定パネル */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-td-accent-50 rounded-lg p-6 border border-td-accent-200">
            <h3 className="text-lg font-semibold text-td-accent-800 mb-4 flex items-center">
              ⚙️ 醸造設定
            </h3>
            
            {/* プリセット長さ選択 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-td-gray-700 mb-2">
                📐 長さプリセット
              </label>
              <select
                value={selectedPreset}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="w-full px-3 py-2 border border-td-gray-300 rounded-md focus:ring-2 focus:ring-td-accent-500 focus:border-td-accent-500 text-sm"
              >
                <option value="">プリセットを選択...</option>
                {WEB_TEXT_LENGTH_PRESETS.map((preset) => (
                  <option key={preset.name} value={preset.name}>
                    {preset.name} ({preset.length}文字) - {preset.description}
                  </option>
                ))}
              </select>
            </div>
            
            {/* モード選択 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-td-gray-700 mb-2">
                生成モード
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setMode('single')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    mode === 'single'
                      ? 'bg-brew-primary-500 text-white'
                      : 'bg-td-gray-200 text-td-gray-700 hover:bg-td-gray-300'
                  }`}
                >
                  単一行
                </button>
                <button
                  onClick={() => setMode('multi')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    mode === 'multi'
                      ? 'bg-brew-primary-500 text-white'
                      : 'bg-td-gray-200 text-td-gray-700 hover:bg-td-gray-300'
                  }`}
                >
                  複数行
                </button>
              </div>
            </div>

            {/* 文字種選択 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-td-gray-700 mb-3">
                使用文字種
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'hiragana', label: 'ひらがな', value: 'あいうえお' },
                  { key: 'katakana', label: 'カタカナ', value: 'アイウエオ' },
                  { key: 'alphabet', label: '英字', value: 'ABC' },
                  { key: 'numbers', label: '数字', value: '123' },
                  { key: 'symbols', label: '記号', value: '!@#' },
                  { key: 'kanji', label: '漢字', value: '漢字' }
                ].map((type) => (
                  <label key={type.key} className="flex items-center space-x-2 p-2 rounded hover:bg-td-gray-50">
                    <input
                      type="checkbox"
                      checked={charTypes[type.key as keyof typeof charTypes]}
                      onChange={(e) => setCharTypes(prev => ({
                        ...prev,
                        [type.key]: e.target.checked
                      }))}
                      className="rounded border-td-gray-300 text-brew-primary-600 focus:ring-td-primary-500"
                    />
                    <span className="text-sm text-td-gray-700">{type.label}</span>
                    <span className="text-xs text-td-gray-500 font-mono">{type.value}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 長さ設定 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-td-gray-700 mb-2">
                文字列長さ: {length}文字
                {selectedPreset && (
                  <span className="ml-2 text-xs text-td-accent-600">
                    ({selectedPreset})
                  </span>
                )}
              </label>
              <input
                type="range"
                min="1"
                max="5000"
                value={length}
                onChange={(e) => {
                  setLength(Number(e.target.value));
                  setSelectedPreset(''); // カスタム値に変更時はプリセット選択をクリア
                }}
                className="w-full h-2 bg-td-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-td-gray-500 mt-1">
                <span>1</span>
                <span>2500</span>
                <span>5000</span>
              </div>
            </div>

            {/* 複数行設定 */}
            {mode === 'multi' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-td-gray-700 mb-2">
                  行数: {lines}行
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={lines}
                  onChange={(e) => setLines(Number(e.target.value))}
                  className="w-full h-2 bg-td-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-td-gray-500 mt-1">
                  <span>1</span>
                  <span>25</span>
                  <span>50</span>
                </div>
              </div>
            )}

            {/* 生成ボタン */}
            <button
              onClick={generateText}
              disabled={isGenerating || !hasSelectedCharTypes}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                isGenerating || !hasSelectedCharTypes
                  ? 'bg-td-gray-300 text-td-gray-500 cursor-not-allowed'
                  : 'bg-td-secondary-500 text-white hover:bg-td-secondary-600 transform hover:scale-105'
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  醸造中...
                </span>
              ) : (
                '🎯 テキスト生成'
              )}
            </button>
          </div>
        </div>

        {/* 結果表示パネル + QRコード */}
        <div className="space-y-6">
          {/* 結果表示 */}
          <div className="bg-white rounded-lg border border-brew-primary-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-brew-primary-800 flex items-center">
                📄 醸造結果
              </h3>
              {generatedText && (
                <div className="flex space-x-2">
                  <ActionButton
                    type="copy"
                    onClick={handleCopyToClipboard}
                    isActive={buttonStates.copy}
                  />
                  <ActionButton
                    type="clear"
                    onClick={handleClearResult}
                    isActive={buttonStates.clear}
                  />
                </div>
              )}
            </div>
            
            <div className="border border-td-gray-300 rounded-lg p-4 min-h-[200px] bg-td-gray-50">
              {generatedText ? (
                <pre className="whitespace-pre-wrap font-mono text-sm text-td-gray-800 break-all">
                  {generatedText}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-[180px] text-td-gray-500">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📝</div>
                    <p>生成されたテキストがここに表示されます</p>
                  </div>
                </div>
              )}
            </div>

            {/* 統計情報 */}
            {generatedText && (
              <div className="mt-4 p-3 bg-td-accent-50 rounded border border-td-accent-200">
                <h4 className="text-sm font-medium text-td-accent-800 mb-2">📊 統計情報</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-td-gray-600">文字数:</span>
                    <span className="ml-2 font-mono text-td-accent-700">{generatedText.length}</span>
                  </div>
                  <div>
                    <span className="text-td-gray-600">バイト数:</span>
                    <span className="ml-2 font-mono text-td-accent-700">{new Blob([generatedText]).size}</span>
                  </div>
                  {mode === 'multi' && (
                    <>
                      <div>
                        <span className="text-td-gray-600">行数:</span>
                        <span className="ml-2 font-mono text-td-accent-700">{generatedText.split('\n').length}</span>
                      </div>
                      <div>
                        <span className="text-td-gray-600">空行除く:</span>
                        <span className="ml-2 font-mono text-td-accent-700">{generatedText.split('\n').filter(line => line.trim() !== '').length}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* QRコードプレビュー */}
          <QRCodePreview text={generatedText} />
        </div>
      </div>
    </div>
  );
} 