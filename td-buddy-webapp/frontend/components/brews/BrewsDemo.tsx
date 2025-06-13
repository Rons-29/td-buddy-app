'use client';

import { useBrewsTeam } from '@/hooks/useBrewsTeam';
import { BrewsAnimation, BrewsEmotion, BrewsSize } from '@/types/brews';
import React, { useState } from 'react';
import BrewsIcon from './BrewsIcon';
import BrewsTeamSelector from './BrewsTeamSelector';

const BrewsDemo: React.FC = () => {
  const {
    currentBrews,
    emotion,
    message,
    switchBrews,
    updateEmotion,
    setMessage,
    resetToDefault,
    brewsHistory,
  } = useBrewsTeam();

  const [selectedSize, setSelectedSize] = useState<BrewsSize>('medium');
  const [selectedAnimation, setSelectedAnimation] =
    useState<BrewsAnimation>('none');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [showBubble, setShowBubble] = useState<boolean>(true);

  const emotions: BrewsEmotion[] = [
    'happy',
    'excited',
    'working',
    'thinking',
    'success',
    'error',
    'warning',
    'sleepy',
    'brewing',
    'completed',
  ];

  const animations: BrewsAnimation[] = [
    'none',
    'bounce',
    'wiggle',
    'pulse',
    'spin',
    'heartbeat',
    'float',
  ];

  const sizes: BrewsSize[] = ['small', 'medium', 'large'];

  const handleEmotionChange = (newEmotion: BrewsEmotion) => {
    if (customMessage.trim()) {
      updateEmotion(newEmotion, customMessage);
    } else {
      updateEmotion(newEmotion);
    }
  };

  const handleCustomMessageSubmit = () => {
    if (customMessage.trim()) {
      setMessage(customMessage);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* ヘッダー */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🍺 Brews アイコンシステム デモ
        </h1>
        <p className="text-gray-600">
          新しい Brews アイコンシステムの機能をテストしてみましょう！
        </p>
      </div>

      {/* メインデモエリア */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* 左側: 現在のBrews表示 */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg border">
            <h2 className="text-xl font-semibold mb-4 text-center">
              現在の Brews
            </h2>

            <div className="flex justify-center mb-6">
              <BrewsIcon
                role={currentBrews}
                emotion={emotion}
                size={selectedSize}
                animation={selectedAnimation}
                message={message}
                showBubble={showBubble}
                onClick={() => {
                  console.log('Brews clicked!', { currentBrews, emotion });
                }}
              />
            </div>

            {/* 現在の状態表示 */}
            <div className="text-center space-y-2 text-sm">
              <div>
                <strong>役割:</strong> {currentBrews}
              </div>
              <div>
                <strong>感情:</strong> {emotion}
              </div>
              <div>
                <strong>サイズ:</strong> {selectedSize}
              </div>
              <div>
                <strong>アニメーション:</strong> {selectedAnimation}
              </div>
            </div>
          </div>

          {/* 操作履歴 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">
              操作履歴 ({brewsHistory.length})
            </h3>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {brewsHistory.slice(-5).map((state, index) => (
                <div
                  key={index}
                  className="text-xs text-gray-600 p-2 bg-white rounded"
                >
                  {state.role} - {state.emotion} (
                  {state.lastAction.toLocaleTimeString()})
                </div>
              ))}
            </div>
            <button
              onClick={resetToDefault}
              className="mt-2 text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
            >
              リセット
            </button>
          </div>
        </div>

        {/* 右側: コントロールパネル */}
        <div className="space-y-6">
          {/* サイズ選択 */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="font-semibold mb-3">サイズ</h3>
            <div className="flex gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 rounded text-sm ${
                    selectedSize === size
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* 感情選択 */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="font-semibold mb-3">感情</h3>
            <div className="grid grid-cols-3 gap-2">
              {emotions.map(emo => (
                <button
                  key={emo}
                  onClick={() => handleEmotionChange(emo)}
                  className={`px-2 py-1 rounded text-xs ${
                    emotion === emo
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {emo}
                </button>
              ))}
            </div>
          </div>

          {/* アニメーション選択 */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="font-semibold mb-3">アニメーション</h3>
            <div className="grid grid-cols-3 gap-2">
              {animations.map(anim => (
                <button
                  key={anim}
                  onClick={() => setSelectedAnimation(anim)}
                  className={`px-2 py-1 rounded text-xs ${
                    selectedAnimation === anim
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {anim}
                </button>
              ))}
            </div>
          </div>

          {/* カスタムメッセージ */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="font-semibold mb-3">カスタムメッセージ</h3>
            <div className="space-y-2">
              <textarea
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                placeholder="カスタムメッセージを入力..."
                className="w-full p-2 border rounded text-sm resize-none"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCustomMessageSubmit}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  適用
                </button>
                <button
                  onClick={() => setCustomMessage('')}
                  className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                >
                  クリア
                </button>
              </div>
            </div>
          </div>

          {/* 表示オプション */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="font-semibold mb-3">表示オプション</h3>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showBubble}
                onChange={e => setShowBubble(e.target.checked)}
              />
              <span className="text-sm">メッセージバブルを表示</span>
            </label>
          </div>
        </div>
      </div>

      {/* チーム選択エリア */}
      <div className="bg-white p-6 rounded-lg shadow-lg border">
        <h2 className="text-xl font-semibold mb-4 text-center">チーム選択</h2>
        <BrewsTeamSelector
          currentRole={currentBrews}
          onRoleSelect={role => switchBrews(role, 'excited')}
          showLabels={true}
          size="small"
          layout="grid"
        />
      </div>

      {/* 全役割プレビュー */}
      <div className="bg-white p-6 rounded-lg shadow-lg border">
        <h2 className="text-xl font-semibold mb-4 text-center">
          全役割プレビュー
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.keys({
            password: 'パスワード醸造',
            personal: '個人情報醸造',
            csv: 'CSV醸造',
            json: 'JSON醸造',
            text: 'テキスト醸造',
            number: '数値醸造',
            datetime: '日時醸造',
            uuid: 'UUID醸造',
            security: 'セキュリティ担当',
            quality: '品質管理担当',
            ai: 'AI連携担当',
            support: 'サポート担当',
          }).map(role => (
            <div key={role} className="text-center">
              <BrewsIcon
                role={role as any}
                emotion="happy"
                size="small"
                showBubble={false}
                onClick={() => switchBrews(role as any, 'excited')}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 説明 */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">使い方</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>
            •
            上部のコントロールパネルで感情、サイズ、アニメーションを変更できます
          </li>
          <li>• チーム選択エリアで異なる役割の Brews に切り替えできます</li>
          <li>• カスタムメッセージを入力して表示内容をカスタマイズできます</li>
          <li>• 各 Brews アイコンをクリックすると反応します</li>
        </ul>
      </div>
    </div>
  );
};

export default BrewsDemo;
