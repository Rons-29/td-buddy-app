'use client';

import {
  Brush,
  Copy,
  Download,
  HelpCircle,
  Image,
  Palette,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { ColorExtractionResult } from '../utils/colorExtractor';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';

// 型定義
export interface ColorSettings {
  format: 'hex' | 'rgb' | 'hsl' | 'css-name' | 'hsv';
  caseType: 'upper' | 'lower';
  includeAlpha: boolean;
  count: number;
  colorScheme: 'random' | 'warm' | 'cool' | 'pastel' | 'bright' | 'monochrome';
  saturationRange: [number, number];
  lightnessRange: [number, number];
}

const ColorDataGenerator: React.FC = () => {
  // State管理
  const [settings, setSettings] = useState<ColorSettings>({
    format: 'hex',
    caseType: 'upper',
    includeAlpha: false,
    count: 10,
    colorScheme: 'random',
    saturationRange: [0, 100],
    lightnessRange: [0, 100],
  });

  const [generatedColors, setGeneratedColors] = useState<
    Array<{ value: string; color: string }>
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // 画像抽出関連のstate
  const [extractedColors, setExtractedColors] =
    useState<ColorExtractionResult | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showImageExtractor, setShowImageExtractor] = useState(false);

  // Brewキャラクター状態
  const [brewMessage, setBrewMessage] = useState(
    '🎨 カラー仕上げ工具の準備完了！美しい色彩を仕上げましょう♪'
  );

  // カラースキーム設定
  const colorSchemes = {
    random: '完全ランダム',
    warm: 'ウォームトーン（赤・オレンジ・黄色系）',
    cool: 'クールトーン（青・緑・紫系）',
    pastel: 'パステルカラー（淡い色合い）',
    bright: 'ビビッドカラー（鮮やかな色）',
    monochrome: 'モノクローム（グレースケール）',
  };

  // CSSカラー名（一部）
  const cssColorNames = [
    'red',
    'green',
    'blue',
    'yellow',
    'orange',
    'purple',
    'pink',
    'brown',
    'black',
    'white',
    'gray',
    'silver',
    'gold',
    'navy',
    'teal',
    'lime',
    'magenta',
    'cyan',
    'maroon',
    'olive',
    'aqua',
    'fuchsia',
    'crimson',
    'coral',
    'salmon',
    'khaki',
    'plum',
    'orchid',
    'violet',
    'turquoise',
  ];

  // HSLからHEXに変換
  const hslToHex = useCallback((h: number, s: number, l: number): string => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }, []);

  // カラー生成
  const generateColors = useCallback(() => {
    if (settings.count < 1 || settings.count > 500) {
      setBrewMessage('生成件数は1〜500件の範囲で設定してください');
      return;
    }

    setIsGenerating(true);
    setBrewMessage(`${settings.count}件のカラーデータを仕上げ中...`);

    const results: Array<{ value: string; color: string }> = [];

    for (let i = 0; i < settings.count; i++) {
      let h: number = Math.random() * 360;
      let s = 50;
      let l = 50;

      // カラースキームに応じたHSL値生成
      switch (settings.colorScheme) {
        case 'warm':
          h =
            Math.random() < 0.5
              ? Math.random() * 60 // 赤〜黄色 (0-60)
              : 300 + Math.random() * 60; // マゼンタ系 (300-360)
          s =
            settings.saturationRange[0] +
            Math.random() *
              (settings.saturationRange[1] - settings.saturationRange[0]);
          l =
            settings.lightnessRange[0] +
            Math.random() *
              (settings.lightnessRange[1] - settings.lightnessRange[0]);
          break;
        case 'cool':
          h = 120 + Math.random() * 180; // 緑〜青〜紫 (120-300)
          s =
            settings.saturationRange[0] +
            Math.random() *
              (settings.saturationRange[1] - settings.saturationRange[0]);
          l =
            settings.lightnessRange[0] +
            Math.random() *
              (settings.lightnessRange[1] - settings.lightnessRange[0]);
          break;
        case 'monochrome':
          h = 0;
          s = 0;
          l =
            settings.lightnessRange[0] +
            Math.random() *
              (settings.lightnessRange[1] - settings.lightnessRange[0]);
          break;
        case 'pastel':
          h = Math.random() * 360;
          s = 20 + Math.random() * 30; // 低彩度
          l = 70 + Math.random() * 20; // 高明度
          break;
        case 'bright':
          h = Math.random() * 360;
          s = 70 + Math.random() * 30; // 高彩度
          l = 40 + Math.random() * 30; // 中明度
          break;
        default: // random
          h = Math.random() * 360;
          s =
            settings.saturationRange[0] +
            Math.random() *
              (settings.saturationRange[1] - settings.saturationRange[0]);
          l =
            settings.lightnessRange[0] +
            Math.random() *
              (settings.lightnessRange[1] - settings.lightnessRange[0]);
          break;
      }

      const hexColor = hslToHex(h, s, l);
      let formattedValue = '';

      // フォーマット変換
      switch (settings.format) {
        case 'hex':
          formattedValue =
            settings.caseType === 'upper'
              ? hexColor.toUpperCase()
              : hexColor.toLowerCase();
          if (settings.includeAlpha) {
            const alpha = Math.floor(Math.random() * 256)
              .toString(16)
              .padStart(2, '0');
            formattedValue +=
              settings.caseType === 'upper'
                ? alpha.toUpperCase()
                : alpha.toLowerCase();
          }
          break;
        case 'rgb':
          const r = Math.round(
            255 *
              (l +
                ((s * Math.min(l, 1 - l)) / 100) *
                  Math.max(
                    Math.min(((h / 30) % 12) - 3, 9 - ((h / 30) % 12), 1),
                    -1
                  ))
          );
          const g = Math.round(
            255 *
              (l +
                ((s * Math.min(l, 1 - l)) / 100) *
                  Math.max(
                    Math.min(
                      ((h / 30 + 8) % 12) - 3,
                      9 - ((h / 30 + 8) % 12),
                      1
                    ),
                    -1
                  ))
          );
          const b = Math.round(
            255 *
              (l +
                ((s * Math.min(l, 1 - l)) / 100) *
                  Math.max(
                    Math.min(
                      ((h / 30 + 4) % 12) - 3,
                      9 - ((h / 30 + 4) % 12),
                      1
                    ),
                    -1
                  ))
          );

          if (settings.includeAlpha) {
            const alpha = Math.random().toFixed(2);
            formattedValue = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          } else {
            formattedValue = `rgb(${r}, ${g}, ${b})`;
          }
          break;
        case 'hsl':
          if (settings.includeAlpha) {
            const alpha = Math.random().toFixed(2);
            formattedValue = `hsla(${Math.round(h)}, ${Math.round(
              s
            )}%, ${Math.round(l)}%, ${alpha})`;
          } else {
            formattedValue = `hsl(${Math.round(h)}, ${Math.round(
              s
            )}%, ${Math.round(l)}%)`;
          }
          break;
        case 'hsv':
          const v = l + (s * Math.min(l, 1 - l)) / 100;
          const sNew = v === 0 ? 0 : 2 * (1 - l / v) * 100;
          formattedValue = `hsv(${Math.round(h)}, ${Math.round(
            sNew
          )}%, ${Math.round(v * 100)}%)`;
          break;
        case 'css-name':
          formattedValue =
            cssColorNames[Math.floor(Math.random() * cssColorNames.length)];
          break;
        default:
          formattedValue = hexColor;
      }

      results.push({
        value: formattedValue,
        color: hexColor,
      });
    }

    setGeneratedColors(results);
    setBrewMessage(
      `✅ ${settings.count}件のカラーデータを美しく仕上げました！`
    );
    setIsGenerating(false);
  }, [settings, hslToHex]);

  // 全データをコピー
  const copyAllData = useCallback(() => {
    const text = generatedColors.map(color => color.value).join('\n');
    navigator.clipboard.writeText(text);
    setBrewMessage('全カラーデータをクリップボードにコピーしました');
  }, [generatedColors]);

  // データをダウンロード
  const downloadData = useCallback(() => {
    const content = generatedColors.map(color => color.value).join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `color_polish_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setBrewMessage('カラーデータを美しく仕上げてダウンロードしました！');
  }, [generatedColors]);

  // 個別コピー
  const copyIndividualColor = useCallback((color: string) => {
    navigator.clipboard.writeText(color);
    setBrewMessage(`カラー「${color}」をコピーしました`);
  }, []);

  // 画像からカラー抽出
  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      setIsExtracting(true);
      setBrewMessage('画像からカラーを抽出中...');

      try {
        // const result = await ColorExtractor.extractFromImage(file);
        const result: ColorExtractionResult = {
          success: true,
          colors: [],
          dominantColor: '#000000',
          palette: [],
          message: '一時的に無効化',
          sourceType: 'image',
          extractedAt: new Date(),
        }; // 一時的な修正
        setExtractedColors(result);
        setBrewMessage(`✅ 画像から${result.colors.length}色を抽出しました！`);
      } catch (error) {
        setBrewMessage('画像の処理中にエラーが発生しました');
      } finally {
        setIsExtracting(false);
      }
    },
    []
  );

  return (
    <div className="min-h-screen wb-workbench-bg">
      {/* ワークベンチヘッダー */}
      <Card workbench className="mb-6 bg-purple-50 border-purple-200">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Palette className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-purple-800">
                🎨 カラー仕上げ工具
              </h1>
              <p className="text-purple-600 mt-1">
                美しい色彩の生成・抽出・仕上げ
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-purple-100 text-purple-700 border-purple-300"
            >
              仕上げ工具
            </Badge>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              workbench
              onClick={() => setShowImageExtractor(!showImageExtractor)}
              className={`${
                showImageExtractor
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-700'
              }`}
            >
              <Image className="h-4 w-4 mr-2" />
              {showImageExtractor ? '画像抽出を閉じる' : '画像カラー抽出'}
            </Button>

            <Button
              workbench
              onClick={() => setShowGuide(!showGuide)}
              className={`${
                showGuide
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-700'
              }`}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              {showGuide ? 'ガイドを閉じる' : '仕上げガイド'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Brewメッセージ */}
      <Card workbench className="mb-6 bg-purple-50 border-purple-200">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🍺</div>
            <div>
              <div className="font-medium text-purple-800">
                Brew からのメッセージ
              </div>
              <div className="text-purple-700 mt-1">{brewMessage}</div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* カラー仕上げ設定パネル */}
        <Card workbench className="bg-purple-50 border-purple-200">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Brush className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-purple-800">
                カラー仕上げ設定
              </h2>
            </div>

            {/* 基本設定 */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">
                    フォーマット
                  </label>
                  <select
                    value={settings.format}
                    onChange={e =>
                      setSettings(prev => ({
                        ...prev,
                        format: e.target.value as any,
                      }))
                    }
                    className="w-full p-2 border border-purple-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="hex">HEX (#FF0000)</option>
                    <option value="rgb">RGB (255, 0, 0)</option>
                    <option value="hsl">HSL (0, 100%, 50%)</option>
                    <option value="hsv">HSV (0, 100%, 100%)</option>
                    <option value="css-name">CSS名 (red)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">
                    生成件数
                  </label>
                  <Input
                    workbench
                    type="number"
                    min="1"
                    max="500"
                    value={settings.count}
                    onChange={e =>
                      setSettings(prev => ({
                        ...prev,
                        count: parseInt(e.target.value) || 10,
                      }))
                    }
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">
                  カラースキーム
                </label>
                <select
                  value={settings.colorScheme}
                  onChange={e =>
                    setSettings(prev => ({
                      ...prev,
                      colorScheme: e.target.value as any,
                    }))
                  }
                  className="w-full p-2 border border-purple-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {Object.entries(colorSchemes).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 詳細設定 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">
                    彩度範囲 ({settings.saturationRange[0]}% -{' '}
                    {settings.saturationRange[1]}%)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.saturationRange[0]}
                      onChange={e =>
                        setSettings(prev => ({
                          ...prev,
                          saturationRange: [
                            parseInt(e.target.value),
                            prev.saturationRange[1],
                          ],
                        }))
                      }
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.saturationRange[1]}
                      onChange={e =>
                        setSettings(prev => ({
                          ...prev,
                          saturationRange: [
                            prev.saturationRange[0],
                            parseInt(e.target.value),
                          ],
                        }))
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">
                    明度範囲 ({settings.lightnessRange[0]}% -{' '}
                    {settings.lightnessRange[1]}%)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.lightnessRange[0]}
                      onChange={e =>
                        setSettings(prev => ({
                          ...prev,
                          lightnessRange: [
                            parseInt(e.target.value),
                            prev.lightnessRange[1],
                          ],
                        }))
                      }
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.lightnessRange[1]}
                      onChange={e =>
                        setSettings(prev => ({
                          ...prev,
                          lightnessRange: [
                            prev.lightnessRange[0],
                            parseInt(e.target.value),
                          ],
                        }))
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* オプション設定 */}
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.includeAlpha}
                    onChange={e =>
                      setSettings(prev => ({
                        ...prev,
                        includeAlpha: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-purple-700">透明度を含む</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="caseType"
                    checked={settings.caseType === 'upper'}
                    onChange={() =>
                      setSettings(prev => ({ ...prev, caseType: 'upper' }))
                    }
                    className="mr-1"
                  />
                  <span className="text-sm text-purple-700 mr-3">大文字</span>
                  <input
                    type="radio"
                    name="caseType"
                    checked={settings.caseType === 'lower'}
                    onChange={() =>
                      setSettings(prev => ({ ...prev, caseType: 'lower' }))
                    }
                    className="mr-1"
                  />
                  <span className="text-sm text-purple-700">小文字</span>
                </label>
              </div>
            </div>

            {/* 生成ボタン */}
            <div className="flex space-x-3">
              <Button
                workbench
                onClick={generateColors}
                disabled={isGenerating}
                className="flex-1 bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isGenerating ? '仕上げ中...' : 'カラーを仕上げる'}
              </Button>

              {generatedColors.length > 0 && (
                <>
                  <Button
                    workbench
                    onClick={copyAllData}
                    className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    全てコピー
                  </Button>
                  <Button
                    workbench
                    onClick={downloadData}
                    className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    ダウンロード
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* カラーパレット表示 */}
        <Card workbench className="bg-purple-50 border-purple-200">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Palette className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-purple-800">
                仕上げカラーパレット
              </h2>
            </div>

            {generatedColors.length > 0 ? (
              <div className="space-y-4">
                {/* 統計情報 */}
                <div className="p-4 bg-purple-100 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-purple-800">
                        {generatedColors.length}
                      </div>
                      <div className="text-sm text-purple-600">仕上げ色数</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-800">
                        {settings.format.toUpperCase()}
                      </div>
                      <div className="text-sm text-purple-600">
                        フォーマット
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-800">
                        {colorSchemes[settings.colorScheme].split('（')[0]}
                      </div>
                      <div className="text-sm text-purple-600">スキーム</div>
                    </div>
                  </div>
                </div>

                {/* カラーグリッド */}
                <div className="grid grid-cols-4 gap-2">
                  {generatedColors.map((colorData, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg border-2 border-purple-300 cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundColor: colorData.color }}
                      onClick={() => copyIndividualColor(colorData.value)}
                      title={`${colorData.value} - クリックでコピー`}
                    />
                  ))}
                </div>

                {/* カラーリスト */}
                <div className="max-h-64 overflow-y-auto border border-purple-300 rounded-lg bg-white">
                  <div className="p-4">
                    <h3 className="font-medium text-purple-800 mb-3">
                      仕上げカラーリスト
                    </h3>
                    <div className="space-y-2">
                      {generatedColors.map((colorData, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-purple-50 rounded border border-purple-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-6 h-6 rounded border border-purple-300"
                              style={{ backgroundColor: colorData.color }}
                            />
                            <span className="font-mono text-sm text-purple-800">
                              {colorData.value}
                            </span>
                          </div>
                          <Button
                            workbench
                            onClick={() => copyIndividualColor(colorData.value)}
                            className="px-2 py-1 text-xs bg-purple-100 text-purple-700 hover:bg-purple-200"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Palette className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <p className="text-purple-600">
                  カラーを仕上げるとここに表示されます
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* 画像カラー抽出パネル */}
      {showImageExtractor && (
        <Card workbench className="mt-6 bg-purple-50 border-purple-200">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Image className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-purple-800">
                画像カラー抽出
              </h2>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-purple-700 mb-2">
                画像ファイルを選択
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isExtracting}
                className="w-full p-2 border border-purple-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {isExtracting && (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 text-purple-600 mx-auto mb-4 animate-spin" />
                <p className="text-purple-600">画像からカラーを抽出中...</p>
              </div>
            )}

            {extractedColors && (
              <div className="space-y-4">
                <h3 className="font-medium text-purple-800">
                  抽出されたカラー
                </h3>
                <div className="grid grid-cols-6 gap-2">
                  {extractedColors.colors.map((colorData, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg border-2 border-purple-300 cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundColor: colorData.color }}
                      onClick={() => copyIndividualColor(colorData.color)}
                      title={`${colorData.color} - クリックでコピー`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* 仕上げガイド */}
      {showGuide && (
        <Card workbench className="mt-6 bg-purple-50 border-purple-200">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <HelpCircle className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-purple-800">
                カラー仕上げ工具ガイド
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-purple-800 mb-3">
                  🎨 カラー仕上げ機能
                </h3>
                <ul className="space-y-2 text-sm text-purple-700">
                  <li>• 複数フォーマットでのカラー生成</li>
                  <li>• カラースキーム別の美しい配色</li>
                  <li>• 彩度・明度の細かい調整</li>
                  <li>• 透明度対応の高品質出力</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-purple-800 mb-3">
                  🖼️ 画像カラー抽出
                </h3>
                <ul className="space-y-2 text-sm text-purple-700">
                  <li>• 画像から主要カラーを自動抽出</li>
                  <li>• ドミナントカラーの精密分析</li>
                  <li>• 抽出カラーの即座コピー</li>
                  <li>• デザイン作業の効率化</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ColorDataGenerator;
