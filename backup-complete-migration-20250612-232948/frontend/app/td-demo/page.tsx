'use client';

import React, { useState } from 'react';
// 依存関係がインストール後にインポート可能になります
// import BrewCharacter';
// import { BrewEmotion, TDAnimation, TDSize } from '../../types/td-character';

// 仮のコンポーネント（依存関係インストール後に実際のコンポーネントと置き換え）
const TDCharacterDemo = () => {
  const [currentEmotion, setCurrentEmotion] = useState('friendly');
  const [currentAnimation, setCurrentAnimation] = useState('heartbeat');
  const [currentSize, setCurrentSize] = useState('medium');
  const [showBubble, setShowBubble] = useState(true);
  const [customMessage, setCustomMessage] = useState('');

  const emotions = [
    'happy', 'excited', 'thinking', 'working', 
    'success', 'warning', 'error', 'sleepy', 
    'curious', 'friendly'
  ];

  const animations = [
    'none', 'bounce', 'wiggle', 'pulse', 
    'spin', 'heartbeat', 'float'
  ];

  const sizes = ['small', 'medium', 'large', 'xlarge'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-brew-primary-800 mb-4">
          🍺 TDキャラクター デモページ
        </h1>
        <p className="text-brew-primary-600">
          TDキャラクターの様々な表情・アニメーション・サイズを確認できます
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* TDキャラクター表示エリア */}
        <div className="td-card p-8 text-center">
          <h2 className="text-xl font-semibold text-brew-primary-800 mb-6">
            TDキャラクター
          </h2>
          
          {/* 実際のTDCharacterコンポーネントがここに表示 */}
          <div className="flex justify-center mb-6">
            <div className="text-center">
              {/* 仮の表示（依存関係インストール後に実際のコンポーネントと置き換え） */}
              <div className="text-6xl td-heartbeat mb-4">🍺</div>
              <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-brew-primary-100 text-brew-primary-800">
                フレンドリー
              </div>
              {showBubble && (
                <div className="mt-4 bg-white border-2 border-brew-primary-200 rounded-lg p-3 shadow-lg max-w-xs mx-auto">
                  <p className="text-sm text-brew-primary-800">
                    {customMessage || 'こんにちは！TDです。よろしくお願いします♪'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 現在の設定表示 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-brew-primary-50 p-3 rounded-lg">
              <div className="font-medium text-brew-primary-800">感情</div>
              <div className="text-brew-primary-600">{currentEmotion}</div>
            </div>
            <div className="bg-brew-primary-50 p-3 rounded-lg">
              <div className="font-medium text-brew-primary-800">アニメーション</div>
              <div className="text-brew-primary-600">{currentAnimation}</div>
            </div>
            <div className="bg-brew-primary-50 p-3 rounded-lg">
              <div className="font-medium text-brew-primary-800">サイズ</div>
              <div className="text-brew-primary-600">{currentSize}</div>
            </div>
            <div className="bg-brew-primary-50 p-3 rounded-lg">
              <div className="font-medium text-brew-primary-800">吹き出し</div>
              <div className="text-brew-primary-600">{showBubble ? '表示' : '非表示'}</div>
            </div>
          </div>
        </div>

        {/* 設定パネル */}
        <div className="space-y-6">
          {/* 感情選択 */}
          <div className="td-card p-6">
            <h3 className="text-lg font-semibold text-brew-primary-800 mb-4">
              感情設定
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {emotions.map((emotion) => (
                <button
                  key={emotion}
                  onClick={() => setCurrentEmotion(emotion)}
                  className={`td-button px-3 py-2 rounded-md text-sm ${
                    currentEmotion === emotion
                      ? 'bg-brew-primary-500 text-white'
                      : 'bg-brew-primary-100 text-brew-primary-800 hover:bg-brew-primary-200'
                  }`}
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>

          {/* アニメーション選択 */}
          <div className="td-card p-6">
            <h3 className="text-lg font-semibold text-brew-primary-800 mb-4">
              アニメーション設定
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {animations.map((animation) => (
                <button
                  key={animation}
                  onClick={() => setCurrentAnimation(animation)}
                  className={`td-button px-3 py-2 rounded-md text-sm ${
                    currentAnimation === animation
                      ? 'bg-td-accent-500 text-white'
                      : 'bg-td-accent-100 text-td-accent-800 hover:bg-td-accent-200'
                  }`}
                >
                  {animation}
                </button>
              ))}
            </div>
          </div>

          {/* サイズ選択 */}
          <div className="td-card p-6">
            <h3 className="text-lg font-semibold text-brew-primary-800 mb-4">
              サイズ設定
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setCurrentSize(size)}
                  className={`td-button px-3 py-2 rounded-md text-sm ${
                    currentSize === size
                      ? 'bg-td-secondary-500 text-white'
                      : 'bg-td-secondary-100 text-td-secondary-800 hover:bg-td-secondary-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* メッセージ設定 */}
          <div className="td-card p-6">
            <h3 className="text-lg font-semibold text-brew-primary-800 mb-4">
              メッセージ設定
            </h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showBubble}
                    onChange={(e) => setShowBubble(e.target.checked)}
                    className="rounded border-brew-primary-300"
                  />
                  <span className="text-brew-primary-800">吹き出しを表示</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-brew-primary-800 mb-2">
                  カスタムメッセージ
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="カスタムメッセージを入力..."
                  className="td-input w-full"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 使用例 */}
      <div className="mt-12 td-card p-6">
        <h2 className="text-xl font-semibold text-brew-primary-800 mb-4">
          使用例
        </h2>
        <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <div className="text-gray-700">
            {`// TDキャラクターの基本的な使用方法
import BrewCharacter';

// 基本表示
<BrewCharacter 
  emotion="${currentEmotion}"
  animation="${currentAnimation}"
  size="${currentSize}"
  showSpeechBubble={${showBubble}}
  ${customMessage ? `message="${customMessage}"` : ''}
/>

// クリック可能
<BrewCharacter 
  emotion="excited"
  onClick={() => console.log('TDクリック!')}
/>

// 動的感情変更
const [emotion, setEmotion] = useState('thinking');
setEmotion('success'); // 成功時に感情変更`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TDCharacterDemo; 