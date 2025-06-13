'use client';

import {
  BarChart3,
  Calculator,
  Copy,
  Download,
  HelpCircle,
  Settings,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { numberbooleanPresets } from '../data/numberbooleanPresets';
import {
  GeneratedNumberBoolean,
  NumberBooleanOptions,
  NumberBooleanPreset,
  NumberBooleanUIState,
} from '../types/numberboolean';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';

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
  onTypeChange,
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

  const [showGuide, setShowGuide] = useState(false);
  const [brewMessage, setBrewMessage] = useState(
    '🔢 数値測定工具の準備完了！精密な数値データを測定生成できます♪'
  );

  /**
   * プリセット選択処理
   */
  const handlePresetSelect = useCallback((preset: NumberBooleanPreset) => {
    setState(prev => ({
      ...prev,
      selectedPreset: preset,
      selectedType: preset.type,
    }));
    setOptions({
      type: preset.type,
      ...preset.options,
    });
    setBrewMessage(
      `📊 「${preset.name}」プリセットを選択しました - ${preset.description}`
    );
  }, []);

  /**
   * 数値・真偽値生成処理
   */
  const handleGenerate = useCallback(async () => {
    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    onGenerationStart?.();
    setBrewMessage(`${count}件の数値データを測定生成中...`);

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
          isGenerating: false,
        }));
        onGenerate?.(result.data);
        onGenerationEnd?.();
        setBrewMessage(`✅ ${count}件の数値データを精密測定しました！`);
      } else {
        setState(prev => ({
          ...prev,
          error: result.message || '測定エラーが発生しました',
          isGenerating: false,
        }));
        onGenerationEnd?.();
        setBrewMessage('❌ 数値測定でエラーが発生しました');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: '通信エラーが発生しました',
        isGenerating: false,
      }));
      onGenerationEnd?.();
      setBrewMessage('❌ 通信エラーが発生しました');
    }
  }, [options, count, onGenerate, onGenerationStart, onGenerationEnd]);

  /**
   * コピー処理
   */
  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setState(prev => ({ ...prev, copyMessage: 'コピーしました！' }));
      setBrewMessage('📋 測定データをクリップボードにコピーしました');
      setTimeout(() => {
        setState(prev => ({ ...prev, copyMessage: null }));
      }, 2000);
    } catch (error) {
      setState(prev => ({ ...prev, copyMessage: 'コピーに失敗しました' }));
      setBrewMessage('❌ コピーに失敗しました');
    }
  }, []);

  /**
   * 全データコピー処理
   */
  const handleCopyAll = useCallback(async () => {
    const allValues = state.generatedData
      .map(item => item.formattedValue)
      .join('\n');
    await handleCopy(allValues);
    setBrewMessage(
      `📋 全測定データ(${state.generatedData.length}件)をコピーしました`
    );
  }, [state.generatedData, handleCopy]);

  /**
   * データダウンロード処理
   */
  const handleDownload = useCallback(() => {
    const content = state.generatedData
      .map(item => item.formattedValue)
      .join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `number_measurement_${
      new Date().toISOString().split('T')[0]
    }.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setBrewMessage(
      `💾 数値測定データ(${state.generatedData.length}件)をダウンロードしました！`
    );
  }, [state.generatedData]);

  /**
   * オプション更新処理
   */
  const updateOptions = useCallback(
    (newOptions: Partial<NumberBooleanOptions>) => {
      setOptions(prev => ({ ...prev, ...newOptions }));
      if (newOptions.type) {
        onTypeChange?.(newOptions.type);
      }
    },
    [onTypeChange]
  );

  /**
   * 難易度別の色分け
   */
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  /**
   * カテゴリ別の色分け
   */
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic':
        return 'bg-orange-50 border-orange-200';
      case 'currency':
        return 'bg-orange-100 border-orange-300';
      case 'percentage':
        return 'bg-orange-50 border-orange-200';
      case 'scientific':
        return 'bg-orange-100 border-orange-300';
      case 'boolean':
        return 'bg-orange-50 border-orange-200';
      case 'advanced':
        return 'bg-orange-100 border-orange-300';
      default:
        return 'bg-orange-50 border-orange-200';
    }
  };

  return (
    <div className="min-h-screen wb-workbench-bg">
      {/* ワークベンチヘッダー */}
      <Card workbench className="mb-6 bg-orange-50 border-orange-200">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calculator className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-orange-800">
                🔢 数値測定工具
              </h1>
              <p className="text-orange-600 mt-1">
                精密な数値・真偽値の測定生成
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-orange-100 text-orange-700 border-orange-300"
            >
              測定工具
            </Badge>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              workbench
              onClick={() => setShowGuide(!showGuide)}
              className={`${
                showGuide
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-100 text-orange-700'
              }`}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              {showGuide ? 'ガイドを閉じる' : '測定ガイド'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Brewメッセージ */}
      <Card workbench className="mb-6 bg-orange-50 border-orange-200">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🍺</div>
            <div>
              <div className="font-medium text-orange-800">
                Brew からのメッセージ
              </div>
              <div className="text-orange-700 mt-1">{brewMessage}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* エラーメッセージ */}
      {state.error && (
        <Card workbench className="mb-6 bg-red-50 border-red-200">
          <div className="p-4">
            <p className="font-medium text-red-800">
              🚨 測定エラーが発生しました
            </p>
            <p className="text-sm text-red-700 mt-1">{state.error}</p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* プリセット選択パネル */}
        <Card workbench className="bg-orange-50 border-orange-200">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-orange-800">
                測定プリセット選択
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
              {numberbooleanPresets.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                    state.selectedPreset?.id === preset.id
                      ? 'border-orange-500 bg-orange-100'
                      : `border-orange-200 hover:border-orange-300 ${getCategoryColor(
                          preset.category
                        )}`
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{preset.icon}</span>
                    <Badge
                      variant="outline"
                      className={getDifficultyColor(preset.difficulty)}
                    >
                      {preset.difficulty}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-orange-800 mb-1">
                    {preset.name}
                  </h3>
                  <p className="text-sm text-orange-600 mb-2">
                    {preset.description}
                  </p>
                  <div className="text-xs text-orange-500">
                    カテゴリ: {preset.category} | タイプ: {preset.type}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* 測定設定・実行パネル */}
        <Card workbench className="bg-orange-50 border-orange-200">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-orange-800">
                測定設定・実行
              </h2>
            </div>

            {/* 選択されたプリセット表示 */}
            {state.selectedPreset && (
              <div className="mb-6 p-4 bg-orange-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{state.selectedPreset.icon}</span>
                  <div>
                    <div className="font-medium text-orange-800">
                      {state.selectedPreset.name}
                    </div>
                    <div className="text-sm text-orange-600">
                      {state.selectedPreset.description}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 測定設定 */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  測定件数
                </label>
                <Input
                  workbench
                  type="number"
                  min="1"
                  max="1000"
                  value={count}
                  onChange={e => setCount(parseInt(e.target.value) || 10)}
                  className="w-full"
                />
              </div>

              {/* 数値範囲設定 */}
              {(options.type === 'integer' || options.type === 'decimal') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-2">
                      最小値
                    </label>
                    <Input
                      workbench
                      type="number"
                      value={options.min || 0}
                      onChange={e =>
                        updateOptions({ min: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-2">
                      最大値
                    </label>
                    <Input
                      workbench
                      type="number"
                      value={options.max || 100}
                      onChange={e =>
                        updateOptions({
                          max: parseFloat(e.target.value) || 100,
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* 小数点桁数設定 */}
              {options.type === 'decimal' && (
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">
                    小数点桁数
                  </label>
                  <Input
                    workbench
                    type="number"
                    min="1"
                    max="10"
                    value={options.decimals || 2}
                    onChange={e =>
                      updateOptions({ decimals: parseInt(e.target.value) || 2 })
                    }
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* 測定実行ボタン */}
            <div className="flex space-x-3 mb-6">
              <Button
                workbench
                onClick={handleGenerate}
                disabled={state.isGenerating || !state.selectedPreset}
                className="flex-1 bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50"
              >
                <Calculator className="h-4 w-4 mr-2" />
                {state.isGenerating ? '測定中...' : '数値を測定生成'}
              </Button>

              {state.generatedData.length > 0 && (
                <>
                  <Button
                    workbench
                    onClick={handleCopyAll}
                    className="bg-orange-100 text-orange-700 hover:bg-orange-200"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    全てコピー
                  </Button>
                  <Button
                    workbench
                    onClick={handleDownload}
                    className="bg-orange-100 text-orange-700 hover:bg-orange-200"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    ダウンロード
                  </Button>
                </>
              )}
            </div>

            {/* 測定統計 */}
            {state.generatedData.length > 0 && (
              <div className="mb-6 p-4 bg-orange-100 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-orange-800">
                      {state.generatedData.length}
                    </div>
                    <div className="text-sm text-orange-600">測定データ数</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-800">
                      {state.selectedType?.toUpperCase()}
                    </div>
                    <div className="text-sm text-orange-600">データタイプ</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-800">
                      {state.selectedPreset?.difficulty === 'beginner'
                        ? '初級'
                        : state.selectedPreset?.difficulty === 'intermediate'
                        ? '中級'
                        : '上級'}
                    </div>
                    <div className="text-sm text-orange-600">測定難易度</div>
                  </div>
                </div>
              </div>
            )}

            {/* コピーメッセージ */}
            {state.copyMessage && (
              <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-lg text-center">
                {state.copyMessage}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* 測定結果表示 */}
      {state.generatedData.length > 0 && (
        <Card workbench className="mt-6 bg-orange-50 border-orange-200">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-orange-800">
                測定結果 ({state.generatedData.length}件)
              </h2>
            </div>

            <div className="max-h-96 overflow-y-auto border border-orange-300 rounded-lg bg-white">
              <div className="p-4">
                <div className="space-y-2">
                  {state.generatedData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-orange-50 rounded border border-orange-200"
                    >
                      <div className="font-mono text-sm text-orange-800 flex-1">
                        {item.formattedValue}
                      </div>
                      <Button
                        workbench
                        onClick={() => handleCopy(item.formattedValue)}
                        className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-700 hover:bg-orange-200"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 測定ガイド */}
      {showGuide && (
        <Card workbench className="mt-6 bg-orange-50 border-orange-200">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <HelpCircle className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-orange-800">
                数値測定工具ガイド
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-orange-800 mb-3">
                  🔢 数値測定機能
                </h3>
                <ul className="space-y-2 text-sm text-orange-700">
                  <li>• 整数・小数点数の精密測定</li>
                  <li>• 通貨・パーセンテージ形式</li>
                  <li>• 科学記法・真偽値対応</li>
                  <li>• カスタム範囲設定</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-orange-800 mb-3">
                  📊 プリセット活用
                </h3>
                <ul className="space-y-2 text-sm text-orange-700">
                  <li>• 用途別プリセット選択</li>
                  <li>• 難易度別設定</li>
                  <li>• カテゴリ別分類</li>
                  <li>• 即座に測定開始</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
