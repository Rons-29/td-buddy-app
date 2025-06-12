'use client';

import { useCallback, useState } from 'react';
import { numberbooleanPresets } from '../data/numberbooleanPresets';
import {
    GeneratedNumberBoolean,
    NumberBooleanOptions,
    NumberBooleanPreset,
    NumberBooleanUIState
} from '../types/numberboolean';

interface NumberBooleanGeneratorProps {
  onGenerate?: (data: GeneratedNumberBoolean[]) => void;
  onGenerationStart?: () => void;
  onGenerationEnd?: () => void;
  onTypeChange?: (type: string) => void;
}

export function NumberBooleanGenerator({ 
  onGenerate, 
  onGenerationStart, 
  onGenerationEnd, 
  onTypeChange 
}: NumberBooleanGeneratorProps) {
  const [state, setState] = useState<NumberBooleanUIState>({
    isGenerating: false,
    selectedPreset: null,
    selectedType: 'integer',
    generatedData: [],
    error: null,
    showAdvancedOptions: false,
    copyMessage: null,
  });

  const [count, setCount] = useState<number>(10);
  const [options, setOptions] = useState<NumberBooleanOptions>({
    type: 'integer',
    min: 1,
    max: 100,
  });

  /**
   * プリセット選択処理
   */
  const handlePresetSelect = useCallback((preset: NumberBooleanPreset) => {
    setState(prev => ({ ...prev, selectedPreset: preset, selectedType: preset.type }));
    setOptions({
      type: preset.type,
      ...preset.options
    });
  }, []);

  /**
   * 数値・真偽値生成処理
   */
  const handleGenerate = useCallback(async () => {
    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    onGenerationStart?.();

    try {
      const response = await fetch('/api/numberboolean/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...options,
          count,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          generatedData: result.data, 
          isGenerating: false 
        }));
        onGenerate?.(result.data);
        onGenerationEnd?.();
      } else {
        setState(prev => ({ 
          ...prev, 
          error: result.message || '生成エラーが発生しました', 
          isGenerating: false 
        }));
        onGenerationEnd?.();
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: '通信エラーが発生しました', 
        isGenerating: false 
      }));
      onGenerationEnd?.();
    }
  }, [options, count, onGenerate, onGenerationStart, onGenerationEnd]);

  /**
   * コピー処理
   */
  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setState(prev => ({ ...prev, copyMessage: 'コピーしました！' }));
      setTimeout(() => {
        setState(prev => ({ ...prev, copyMessage: null }));
      }, 2000);
    } catch (error) {
      setState(prev => ({ ...prev, copyMessage: 'コピーに失敗しました' }));
    }
  }, []);

  /**
   * 全データコピー処理
   */
  const handleCopyAll = useCallback(async () => {
    const allValues = state.generatedData.map(item => item.formattedValue).join('\n');
    await handleCopy(allValues);
  }, [state.generatedData, handleCopy]);

  /**
   * オプション更新処理
   */
  const updateOptions = useCallback((newOptions: Partial<NumberBooleanOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
    if (newOptions.type) {
      onTypeChange?.(newOptions.type);
    }
  }, [onTypeChange]);

  /**
   * 難易度別の色分け
   */
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  /**
   * カテゴリ別の色分け
   */
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'bg-blue-50 border-blue-200';
      case 'currency': return 'bg-green-50 border-green-200';
      case 'percentage': return 'bg-purple-50 border-purple-200';
      case 'scientific': return 'bg-orange-50 border-orange-200';
      case 'boolean': return 'bg-pink-50 border-pink-200';
      case 'advanced': return 'bg-gray-50 border-gray-200';
      default: return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
          🔢 数値・真偽値生成
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          整数、小数点数、パーセンテージ、通貨、科学記法、真偽値など多様な数値データを生成。
          テスト、開発、分析に活用できます。
        </p>
      </div>

      {/* エラーメッセージ */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">🚨 エラーが発生しました</p>
          <p className="text-sm">{state.error}</p>
        </div>
      )}

      {/* プリセット選択 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          🎯 プリセット選択
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {numberbooleanPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset)}
              className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                state.selectedPreset?.id === preset.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : `border-gray-200 hover:border-gray-300 ${getCategoryColor(preset.category)}`
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{preset.icon}</span>
                <span className={`px-2 py-1 text-xs rounded-full border ${getDifficultyColor(preset.difficulty)}`}>
                  {preset.difficulty}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{preset.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{preset.description}</p>
              {preset.use_cases && (
                <div className="flex flex-wrap gap-1">
                  {preset.use_cases.slice(0, 2).map((useCase, index) => (
                    <span key={index} className="text-xs bg-white px-2 py-1 rounded border">
                      {useCase}
                    </span>
                  ))}
                  {preset.use_cases.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{preset.use_cases.length - 2}
                    </span>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 醸造設定 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            ⚙️ 醸造設定
          </h2>
          <button
            onClick={() => setState(prev => ({ ...prev, showAdvancedOptions: !prev.showAdvancedOptions }))}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {state.showAdvancedOptions ? '設定を折りたたむ' : '詳細設定を表示'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 生成件数 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              生成件数
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 数値タイプ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              データタイプ
            </label>
            <select
              value={options.type}
              onChange={(e) => updateOptions({ type: e.target.value as NumberBooleanOptions['type'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="integer">整数</option>
              <option value="float">小数点数</option>
              <option value="percentage">パーセンテージ</option>
              <option value="currency">通貨</option>
              <option value="scientific">科学記法</option>
              <option value="boolean">真偽値</option>
              <option value="special">特殊数値</option>
            </select>
          </div>
        </div>

        {/* 詳細設定 */}
        {state.showAdvancedOptions && (
          <div className="border-t pt-4 space-y-4">
            {/* 数値範囲設定 */}
            {['integer', 'float', 'percentage', 'currency'].includes(options.type) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    最小値
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={options.min || ''}
                    onChange={(e) => updateOptions({ min: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    最大値
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={options.max || ''}
                    onChange={(e) => updateOptions({ max: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* 小数点設定 */}
            {['float', 'percentage'].includes(options.type) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  小数点以下桁数
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={options.decimals || 2}
                  onChange={(e) => updateOptions({ decimals: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* 通貨設定 */}
            {options.type === 'currency' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  通貨タイプ
                </label>
                <select
                  value={options.currency || 'JPY'}
                  onChange={(e) => updateOptions({ currency: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="JPY">日本円 (¥)</option>
                  <option value="USD">US ドル ($)</option>
                  <option value="EUR">ユーロ (€)</option>
                  <option value="GBP">英ポンド (£)</option>
                  <option value="CNY">中国元 (¥)</option>
                </select>
              </div>
            )}

            {/* 真偽値設定 */}
            {options.type === 'boolean' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    True確率 (0-1)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={options.trueProbability || 0.5}
                    onChange={(e) => updateOptions({ trueProbability: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    出力形式
                  </label>
                  <select
                    value={options.booleanFormat || 'boolean'}
                    onChange={(e) => updateOptions({ booleanFormat: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="boolean">boolean (true/false)</option>
                    <option value="string">string ("true"/"false")</option>
                    <option value="number">number (1/0)</option>
                    <option value="yesno">yes/no</option>
                    <option value="onoff">on/off</option>
                  </select>
                </div>
              </div>
            )}

            {/* 特殊値設定 */}
            {options.type === 'special' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  含める特殊値
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.allowNaN || false}
                      onChange={(e) => updateOptions({ allowNaN: e.target.checked })}
                      className="mr-2"
                    />
                    NaN (Not a Number)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.allowInfinity || false}
                      onChange={(e) => updateOptions({ allowInfinity: e.target.checked })}
                      className="mr-2"
                    />
                    Infinity / -Infinity
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.allowNegativeZero || false}
                      onChange={(e) => updateOptions({ allowNegativeZero: e.target.checked })}
                      className="mr-2"
                    />
                    -0 (Negative Zero)
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 生成ボタン */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleGenerate}
            disabled={state.isGenerating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {state.isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                醸造中...
              </>
            ) : (
              <>
                🚀 数値・真偽値を生成
              </>
            )}
          </button>
        </div>
      </div>

      {/* 醸造結果 */}
      {state.generatedData.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              📊 醸造結果 ({state.generatedData.length}件)
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleCopyAll}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                📋 全てコピー
              </button>
            </div>
          </div>

          {/* TDメッセージ */}
          {state.generatedData[0]?.brewMessage && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
              <p className="font-medium">🍺 ブリューからのメッセージ</p>
              <p className="text-sm">{state.generatedData[0].brewMessage}</p>
            </div>
          )}

          {/* データ表示 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {state.generatedData.map((item, index) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">#{index + 1}</span>
                  <button
                    onClick={() => handleCopy(item.formattedValue)}
                    className="text-gray-400 hover:text-gray-600 text-xs"
                  >
                    📋
                  </button>
                </div>
                <div className="text-lg font-mono text-gray-900 mb-1 break-all">
                  {item.formattedValue}
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>タイプ: {item.type}</div>
                  {item.metadata.isInteger !== undefined && (
                    <div>整数: {item.metadata.isInteger ? 'Yes' : 'No'}</div>
                  )}
                  {item.metadata.isNegative && (
                    <div className="text-red-600">負数</div>
                  )}
                  {item.metadata.isSpecial && (
                    <div className="text-purple-600">特殊値</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* コピーメッセージ */}
      {state.copyMessage && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
          {state.copyMessage}
        </div>
      )}
    </div>
  );
} 