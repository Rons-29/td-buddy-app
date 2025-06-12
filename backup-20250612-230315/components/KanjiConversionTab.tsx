'use client';

import React, { useState, useEffect } from 'react';
import { 
  convertToKyuKanji, 
  convertToShinKanji, 
  detectConvertibleKanji,
  generateRandomNameSample,
  generateRandomFilenameSample
} from '../data/kanjiConversionData';
import { QRCodePreview } from './QRCodePreview';
import { useButtonState } from '../hooks/useButtonState';
import { useClipboard } from '../hooks/useClipboard';
import { ActionButton } from './ui/ActionButton';

type ConversionMode = 'newToOld' | 'oldToNew' | 'detect';

export function KanjiConversionTab() {
  const [mode, setMode] = useState<ConversionMode>('newToOld');
  const [inputText, setInputText] = useState('');
  const [convertedText, setConvertedText] = useState('');
  const [mounted, setMounted] = useState(false);
  
  // カスタムフック使用
  const { buttonStates, setButtonActive } = useButtonState();
  const { copyToClipboard: clipboardCopy, pasteFromClipboard } = useClipboard();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    performConversion();
  }, [inputText, mode]);

  const performConversion = () => {
    if (!inputText.trim()) {
      setConvertedText('');
      return;
    }

    try {
      switch (mode) {
        case 'newToOld':
          const newToOldResult = convertToKyuKanji(inputText);
          setConvertedText(newToOldResult.converted);
          break;
        case 'oldToNew':
          const oldToNewResult = convertToShinKanji(inputText);
          setConvertedText(oldToNewResult.converted);
          break;
        case 'detect':
          const detection = detectConvertibleKanji(inputText);
          setConvertedText(`変換可能な新字体: ${detection.shinToKyu.map(item => item.char).join('')}\n変換可能な旧字体: ${detection.kyuToShin.map(item => item.char).join('')}`);
          break;
      }
    } catch (error) {
      console.error('変換エラー:', error);
      setConvertedText('変換中にエラーが発生しました');
    }
  };

  // 共通化されたアクション関数
  const handleCopyToClipboard = async (text: string) => {
    const success = await clipboardCopy(text);
    if (success) {
      setButtonActive('copy');
    }
  };

  const handleReplaceInputText = () => {
    setInputText(convertedText);
    setButtonActive('replace');
  };

  const handleClearText = () => {
    setInputText('');
    setConvertedText('');
    setButtonActive('clear');
  };

  // サンプルテキスト生成
  const insertNameSample = () => {
    const sample = generateRandomNameSample();
    setInputText(sample);
  };

  const insertFilenameSample = () => {
    const sample = generateRandomFilenameSample();
    setInputText(sample);
  };

  if (!mounted) {
    return <div className="text-center py-8">読み込み中...</div>;
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
              <strong>TDのヒント:</strong> 人名やファイル名によく使われる漢字のサンプルを用意しました！
              変換結果はQRコードにも変換できるので、テストデータとして便利に使えます。
              新字体⇔旧字体の変換で、レガシーシステムのテストにお役立てください📜
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 設定・入力パネル */}
        <div className="lg:col-span-2 space-y-6">
          {/* 変換モード選択 */}
          <div className="bg-td-primary-50 rounded-lg p-6 border border-td-primary-200">
            <h3 className="text-lg font-semibold text-td-primary-800 mb-4">
              📜 変換モード
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => setMode('newToOld')}
                className={`p-4 rounded-lg border-2 transition-all text-center ${
                  mode === 'newToOld'
                    ? 'border-td-primary-500 bg-td-primary-100 text-td-primary-800'
                    : 'border-td-gray-300 bg-white text-td-gray-700 hover:border-td-primary-300'
                }`}
              >
                <div className="text-2xl mb-2">📜➡️📋</div>
                <div className="font-medium">新字体 → 旧字体</div>
                <div className="text-sm opacity-75">学 → 學</div>
              </button>
              
              <button
                onClick={() => setMode('oldToNew')}
                className={`p-4 rounded-lg border-2 transition-all text-center ${
                  mode === 'oldToNew'
                    ? 'border-td-primary-500 bg-td-primary-100 text-td-primary-800'
                    : 'border-td-gray-300 bg-white text-td-gray-700 hover:border-td-primary-300'
                }`}
              >
                <div className="text-2xl mb-2">📋➡️📜</div>
                <div className="font-medium">旧字体 → 新字体</div>
                <div className="text-sm opacity-75">學 → 学</div>
              </button>
              
              <button
                onClick={() => setMode('detect')}
                className={`p-4 rounded-lg border-2 transition-all text-center ${
                  mode === 'detect'
                    ? 'border-td-primary-500 bg-td-primary-100 text-td-primary-800'
                    : 'border-td-gray-300 bg-white text-td-gray-700 hover:border-td-primary-300'
                }`}
              >
                <div className="text-2xl mb-2">🔍</div>
                <div className="font-medium">変換可能字検出</div>
                <div className="text-sm opacity-75">分析のみ</div>
              </button>
            </div>
          </div>

          {/* サンプルテキスト */}
          <div className="bg-td-secondary-50 rounded-lg p-6 border border-td-secondary-200">
            <h3 className="text-lg font-semibold text-td-secondary-800 mb-4">
              🎲 サンプルテキスト
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={insertNameSample}
                className="px-4 py-2 bg-td-secondary-500 text-white rounded-lg hover:bg-td-secondary-600 transition-colors"
              >
                👤 人名サンプル
              </button>
              <button
                onClick={insertFilenameSample}
                className="px-4 py-2 bg-td-accent-500 text-white rounded-lg hover:bg-td-accent-600 transition-colors"
              >
                📁 ファイル名サンプル
              </button>
              <button
                onClick={() => setInputText('学校で勉強する')}
                className="px-3 py-2 bg-td-gray-500 text-white rounded-lg hover:bg-td-gray-600 transition-colors text-sm"
              >
                学校で勉強する
              </button>
              <button
                onClick={() => setInputText('会社で働く')}
                className="px-3 py-2 bg-td-gray-500 text-white rounded-lg hover:bg-td-gray-600 transition-colors text-sm"
              >
                会社で働く
              </button>
              <button
                onClick={() => setInputText('医者が診察する')}
                className="px-3 py-2 bg-td-gray-500 text-white rounded-lg hover:bg-td-gray-600 transition-colors text-sm"
              >
                医者が診察する
              </button>
              <button
                onClick={() => setInputText('国際的な報道')}
                className="px-3 py-2 bg-td-gray-500 text-white rounded-lg hover:bg-td-gray-600 transition-colors text-sm"
              >
                国際的な報道
              </button>
              <button
                onClick={() => setInputText('経済発展')}
                className="px-3 py-2 bg-td-gray-500 text-white rounded-lg hover:bg-td-gray-600 transition-colors text-sm"
              >
                経済発展
              </button>
            </div>
          </div>

          {/* テキスト入力エリア */}
          <div className="bg-white rounded-lg border border-td-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-td-gray-800">
                📝 テキスト入力
              </h3>
              <ActionButton
                type="clear"
                onClick={handleClearText}
                isActive={buttonStates.clear}
              />
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="旧字体の変換を行うテキストを入力してください..."
              className="w-full h-32 p-3 border border-td-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-td-primary-500 focus:border-td-primary-500 text-sm"
            />
          </div>

          {/* 変換結果 */}
          <div className="bg-white rounded-lg border border-td-primary-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-td-primary-800">
                ✨ 変換結果
              </h3>
              {convertedText && (
                <div className="flex space-x-2">
                  <ActionButton
                    type="copy"
                    onClick={() => handleCopyToClipboard(convertedText)}
                    isActive={buttonStates.copy}
                  />
                  {mode !== 'detect' && (
                    <ActionButton
                      type="replace"
                      onClick={handleReplaceInputText}
                      isActive={buttonStates.replace}
                    />
                  )}
                </div>
              )}
            </div>
            
            <div className="border border-td-gray-300 rounded-lg p-4 min-h-[120px] bg-td-gray-50">
              {convertedText ? (
                <pre className="whitespace-pre-wrap font-mono text-sm text-td-gray-800 break-all">
                  {convertedText}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-[100px] text-td-gray-500">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📜</div>
                    <p>変換結果がここに表示されます</p>
                  </div>
                </div>
              )}
            </div>

            {/* 変換統計 */}
            {convertedText && mode !== 'detect' && (
              <div className="mt-4 p-3 bg-td-accent-50 rounded border border-td-accent-200">
                <h4 className="text-sm font-medium text-td-accent-800 mb-2">📊 変換統計</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-td-gray-600">変換前文字数:</span>
                    <span className="ml-2 font-mono text-td-accent-700">{inputText.length}</span>
                  </div>
                  <div>
                    <span className="text-td-gray-600">変換後文字数:</span>
                    <span className="ml-2 font-mono text-td-accent-700">{convertedText.length}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* QRコードプレビュー */}
        <div className="space-y-6">
          <QRCodePreview text={convertedText || inputText} />
        </div>
      </div>
    </div>
  );
} 