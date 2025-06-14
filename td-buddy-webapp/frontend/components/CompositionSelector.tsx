'use client';

import { Check, Edit2, Info, Plus } from 'lucide-react';
import React, { useState } from 'react';
import {
  DEFAULT_PASSWORD_PRESETS,
  PRESET_CATEGORIES,
} from '../data/passwordPresets';
import { PasswordPreset } from '../types/password';

interface CompositionSelectorProps {
  selectedPresetId: string;
  onPresetChange: (presetId: string, preset: PasswordPreset) => void;
  className?: string;
}

export const CompositionSelector: React.FC<CompositionSelectorProps> = ({
  selectedPresetId,
  onPresetChange,
  className = '',
}) => {
  const [customPresetName, setCustomPresetName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const selectedPreset = DEFAULT_PASSWORD_PRESETS.find(
    p => p.id === selectedPresetId
  );

  const handlePresetClick = (preset: PasswordPreset) => {
    onPresetChange(preset.id, preset);
  };

  const handleCustomPresetCreate = () => {
    if (customPresetName.trim()) {
      const customPreset: PasswordPreset = {
        id: `custom-${Date.now()}`,
        name: customPresetName.trim(),
        description: '自由入力で作成されたカスタムプリセット',
        icon: '📝',
        category: 'other',
        isCustom: true,
        criteria: {
          length: 12,
          count: 1,
        },
      };
      onPresetChange(customPreset.id, customPreset);
      setCustomPresetName('');
      setShowCustomInput(false);
    }
  };

  // カテゴリ別にプリセットを分類
  const presetsByCategory = DEFAULT_PASSWORD_PRESETS.reduce((acc, preset) => {
    if (!acc[preset.category]) {
      acc[preset.category] = [];
    }
    acc[preset.category].push(preset);
    return acc;
  }, {} as Record<string, PasswordPreset[]>);

  // カテゴリーの順序を指定
  const categoryOrder: (keyof typeof PRESET_CATEGORIES)[] = [
    'security',
    'vulnerability',
    'custom',
    'web',
    'enterprise',
    'other',
  ];

  return (
    <div className={`w-full ${className}`}>
      {/* セクションヘッダー */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
          🎯 どこで使いますか？
          <Info className="w-4 h-4 text-gray-400" />
        </h3>
        <p className="text-sm text-gray-600">
          用途に合わせて最適なパスワードを作成します
        </p>
      </div>

      {/* カテゴリー水平レイアウト */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8 mb-8">
        {categoryOrder.map(categoryKey => {
          const category = PRESET_CATEGORIES[categoryKey];
          const presets = presetsByCategory[categoryKey] || [];

          return (
            <div key={categoryKey} className="space-y-3">
              {/* カテゴリヘッダー */}
              <div className="text-center border-b border-gray-200 pb-2">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-lg">{category.icon}</span>
                  <h4 className="font-medium text-gray-800 text-xs">
                    {category.label}
                  </h4>
                </div>
                <p className="text-xs text-gray-500 leading-tight">
                  {category.description}
                </p>
              </div>

              {/* プリセットカード */}
              <div className="space-y-2">
                {presets.map(preset => (
                  <div
                    key={preset.id}
                    onClick={() => handlePresetClick(preset)}
                    className={`
                      relative p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 min-h-[120px]
                      ${
                        preset.category === 'vulnerability'
                          ? selectedPresetId === preset.id
                            ? 'wb-vulnerability-preset-card selected border-orange-500 bg-orange-50 shadow-md'
                            : 'wb-vulnerability-preset-card border-orange-300 bg-orange-25 hover:border-orange-400 hover:shadow-sm'
                          : selectedPresetId === preset.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }
                    `}
                  >
                    {/* 脆弱性警告バッジ */}
                    {preset.category === 'vulnerability' && (
                      <div className="absolute top-1 left-1">
                        <span className="wb-vulnerability-badge text-xs">
                          ⚠️ テスト用
                        </span>
                      </div>
                    )}

                    {/* 選択インジケーター */}
                    {selectedPresetId === preset.id && (
                      <div className="absolute top-2 right-2">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            preset.category === 'vulnerability'
                              ? 'bg-orange-500'
                              : 'bg-blue-500'
                          }`}
                        >
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                    )}

                    {/* プリセット内容 */}
                    <div className="space-y-2">
                      {/* アイコンとタイトル */}
                      <div className="text-center">
                        <span className="text-base block mb-1">
                          {preset.icon}
                        </span>
                        <h5
                          className={`font-medium text-xs leading-tight ${
                            preset.category === 'vulnerability'
                              ? 'text-orange-900'
                              : 'text-gray-900'
                          }`}
                        >
                          {preset.name}
                        </h5>
                      </div>

                      {/* プリセット設定の簡潔表示 */}
                      <div className="space-y-2">
                        {/* 基本設定 */}
                        <div className="flex justify-center gap-2 text-xs">
                          {preset.criteria.length && (
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-xs ${
                                preset.category === 'vulnerability'
                                  ? 'bg-orange-200 text-orange-800'
                                  : 'wb-badge-count'
                              }`}
                            >
                              {preset.criteria.length}文字
                            </span>
                          )}
                          {preset.criteria.count && (
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-xs ${
                                preset.category === 'vulnerability'
                                  ? 'bg-orange-200 text-orange-800'
                                  : 'wb-badge-items'
                              }`}
                            >
                              {preset.criteria.count}個
                            </span>
                          )}
                        </div>

                        {/* 必須文字種（アイコンのみ） */}
                        {preset.criteria.mustIncludeCharTypes && (
                          <div className="flex justify-center gap-2">
                            {preset.criteria.mustIncludeCharTypes.map(
                              charType => (
                                <span
                                  key={charType}
                                  className="text-xs"
                                  title={getCharTypeLabel(charType)}
                                >
                                  {getCharTypeIcon(charType)}
                                </span>
                              )
                            )}
                          </div>
                        )}

                        {/* 脆弱性タイプ表示 */}
                        {preset.category === 'vulnerability' &&
                          preset.criteria.vulnerabilityType && (
                            <div className="text-center">
                              <span className="text-xs text-orange-700 font-medium">
                                {getVulnerabilityTypeLabel(
                                  preset.criteria.vulnerabilityType
                                )}
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* その他カテゴリーの自由入力 */}
                {categoryKey === 'other' && (
                  <div className="space-y-3">
                    {!showCustomInput ? (
                      <button
                        onClick={() => setShowCustomInput(true)}
                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg 
                                 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200
                                 flex items-center justify-center gap-2 text-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">自由入力</span>
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="relative">
                          <Edit2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={customPresetName}
                            onChange={e => setCustomPresetName(e.target.value)}
                            placeholder="プリセット名を入力..."
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md 
                                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                     text-sm"
                            onKeyPress={e => {
                              if (e.key === 'Enter') {
                                handleCustomPresetCreate();
                              }
                            }}
                            autoFocus
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleCustomPresetCreate}
                            disabled={!customPresetName.trim()}
                            className="flex-1 py-1.5 px-3 bg-blue-600 text-white rounded-md 
                                     hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                                     text-sm font-medium transition-colors duration-200"
                          >
                            作成
                          </button>
                          <button
                            onClick={() => {
                              setShowCustomInput(false);
                              setCustomPresetName('');
                            }}
                            className="flex-1 py-1.5 px-3 bg-gray-200 text-gray-700 rounded-md 
                                     hover:bg-gray-300 text-sm font-medium transition-colors duration-200"
                          >
                            キャンセル
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 選択されたプリセットの詳細表示（コンパクト版） */}
      {selectedPreset && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedPreset.icon}</span>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-1">
                選択中: {selectedPreset.name}
              </h4>
              <p className="text-sm text-blue-700 mb-2">
                {selectedPreset.description}
              </p>

              {/* 設定サマリー（横並び） */}
              <div className="flex flex-wrap gap-2 text-sm">
                {selectedPreset.criteria.length && (
                  <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded font-medium">
                    {selectedPreset.criteria.length}文字
                  </span>
                )}
                {selectedPreset.criteria.count && (
                  <span className="bg-green-200 text-green-800 px-2 py-1 rounded font-medium">
                    {selectedPreset.criteria.count}個
                  </span>
                )}
                {selectedPreset.criteria.mustIncludeCharTypes &&
                  selectedPreset.criteria.mustIncludeCharTypes.map(charType => (
                    <span
                      key={charType}
                      className="bg-purple-200 text-purple-800 px-2 py-1 rounded font-medium"
                    >
                      {getCharTypeIcon(charType)} {getCharTypeLabel(charType)}
                    </span>
                  ))}
                {selectedPreset.criteria.customSymbols && (
                  <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded font-mono text-sm">
                    記号: {selectedPreset.criteria.customSymbols}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ヘルパー関数
function getCharTypeLabel(charType: string): string {
  const labels: Record<string, string> = {
    numbers: '数字',
    uppercase: '大文字',
    lowercase: '小文字',
    symbols: '記号',
  };
  return labels[charType] || charType;
}

function getCharTypeIcon(charType: string): string {
  const icons: Record<string, string> = {
    numbers: '🔢',
    uppercase: '🅰️',
    lowercase: '🔤',
    symbols: '🔣',
  };
  return icons[charType] || '❓';
}

function getVulnerabilityTypeLabel(vulnerabilityType: string): string {
  const labels: Record<string, string> = {
    common: '一般的脆弱性',
    dictionary: '辞書攻撃脆弱',
    sequential: '連続パターン',
    keyboard: 'キーボード配列',
    personal: '個人情報ベース',
    repetitive: '反復パターン',
  };
  return labels[vulnerabilityType] || vulnerabilityType;
}
