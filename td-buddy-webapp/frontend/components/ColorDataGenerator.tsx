'use client';

import { Copy, Download, HelpCircle, Image, Palette, RefreshCw, Settings, Upload } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { ColorExtractionResult, ColorExtractor } from '../utils/colorExtractor';
import { Button } from './ui/Button';

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
    lightnessRange: [0, 100]
  });
  
  const [generatedColors, setGeneratedColors] = useState<Array<{value: string, color: string}>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  
  // 画像抽出関連のstate
  const [extractedColors, setExtractedColors] = useState<ColorExtractionResult | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showImageExtractor, setShowImageExtractor] = useState(false);
  
  // Brewキャラクター状態
  const [brewMessage, setBrewMessage] = useState('カラーデータ生成の準備完了です！設定を調整してください♪');

  // カラースキーム設定
  const colorSchemes = {
    random: '完全ランダム',
    warm: 'ウォームトーン（赤・オレンジ・黄色系）',
    cool: 'クールトーン（青・緑・紫系）',
    pastel: 'パステルカラー（淡い色合い）',
    bright: 'ビビッドカラー（鮮やかな色）',
    monochrome: 'モノクローム（グレースケール）'
  };

  // CSSカラー名（一部）
  const cssColorNames = [
    'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'brown',
    'black', 'white', 'gray', 'silver', 'gold', 'navy', 'teal', 'lime',
    'magenta', 'cyan', 'maroon', 'olive', 'aqua', 'fuchsia', 'crimson',
    'coral', 'salmon', 'khaki', 'plum', 'orchid', 'violet', 'turquoise'
  ];

  // HSLからHEXに変換
  const hslToHex = useCallback((h: number, s: number, l: number): string => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
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
    setBrewMessage(`${settings.count}件のカラーデータを生成中...`);

    const results: Array<{value: string, color: string}> = [];
    
    for (let i = 0; i < settings.count; i++) {
      let h: number = Math.random() * 360;
      let s: number = 50;
      let l: number = 50;
      
      // カラースキームに応じたHSL値生成
      switch (settings.colorScheme) {
        case 'warm':
          h = Math.random() < 0.5 
            ? Math.random() * 60  // 赤〜黄色 (0-60)
            : 300 + Math.random() * 60;  // マゼンタ系 (300-360)
          s = settings.saturationRange[0] + Math.random() * (settings.saturationRange[1] - settings.saturationRange[0]);
          l = settings.lightnessRange[0] + Math.random() * (settings.lightnessRange[1] - settings.lightnessRange[0]);
          break;
        case 'cool':
          h = 120 + Math.random() * 180;  // 緑〜青〜紫 (120-300)
          s = settings.saturationRange[0] + Math.random() * (settings.saturationRange[1] - settings.saturationRange[0]);
          l = settings.lightnessRange[0] + Math.random() * (settings.lightnessRange[1] - settings.lightnessRange[0]);
          break;
        case 'monochrome':
          h = 0;
          s = 0;
          l = settings.lightnessRange[0] + Math.random() * (settings.lightnessRange[1] - settings.lightnessRange[0]);
          break;
        case 'pastel':
          h = Math.random() * 360;
          s = 20 + Math.random() * 30;  // 低彩度
          l = 70 + Math.random() * 20;  // 高明度
          break;
        case 'bright':
          h = Math.random() * 360;
          s = 70 + Math.random() * 30;  // 高彩度
          l = 40 + Math.random() * 30;  // 中明度
          break;
        default: // random
          h = Math.random() * 360;
          s = settings.saturationRange[0] + Math.random() * (settings.saturationRange[1] - settings.saturationRange[0]);
          l = settings.lightnessRange[0] + Math.random() * (settings.lightnessRange[1] - settings.lightnessRange[0]);
          break;
      }

      const hexColor = hslToHex(h, s, l);
      let formattedValue = '';

      // フォーマット変換
      switch (settings.format) {
        case 'hex':
          formattedValue = settings.caseType === 'upper' ? hexColor.toUpperCase() : hexColor.toLowerCase();
          if (settings.includeAlpha) {
            const alpha = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
            formattedValue += settings.caseType === 'upper' ? alpha.toUpperCase() : alpha.toLowerCase();
          }
          break;
        case 'rgb':
          const r = Math.round(255 * (l + (s * Math.min(l, 1 - l) / 100) * Math.max(Math.min((h / 30) % 12 - 3, 9 - (h / 30) % 12, 1), -1)));
          const g = Math.round(255 * (l + (s * Math.min(l, 1 - l) / 100) * Math.max(Math.min(((h / 30) + 8) % 12 - 3, 9 - ((h / 30) + 8) % 12, 1), -1)));
          const b = Math.round(255 * (l + (s * Math.min(l, 1 - l) / 100) * Math.max(Math.min(((h / 30) + 4) % 12 - 3, 9 - ((h / 30) + 4) % 12, 1), -1)));
          
          if (settings.includeAlpha) {
            const alpha = (Math.random()).toFixed(2);
            formattedValue = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          } else {
            formattedValue = `rgb(${r}, ${g}, ${b})`;
          }
          break;
        case 'hsl':
          if (settings.includeAlpha) {
            const alpha = (Math.random()).toFixed(2);
            formattedValue = `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${alpha})`;
          } else {
            formattedValue = `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
          }
          break;
        case 'hsv':
          const v = l + s * Math.min(l, 1 - l) / 100;
          const sNew = v === 0 ? 0 : 2 * (1 - l / v) * 100;
          formattedValue = `hsv(${Math.round(h)}, ${Math.round(sNew)}%, ${Math.round(v * 100)}%)`;
          break;
        case 'css-name':
          formattedValue = cssColorNames[Math.floor(Math.random() * cssColorNames.length)];
          break;
        default:
          formattedValue = hexColor;
      }

      results.push({
        value: formattedValue,
        color: hexColor
      });
    }

    setGeneratedColors(results);
    setBrewMessage(`✅ ${settings.count}件のカラーデータを生成しました！`);
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
    a.download = `color_data_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setBrewMessage('カラーデータをダウンロードしました！');
  }, [generatedColors]);

  // 画像からカラー抽出
  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ファイル形式チェック
    if (!file.type.startsWith('image/')) {
      setBrewMessage('画像ファイルを選択してください（JPG、PNG、GIF、WebPなど）');
      return;
    }

    setIsExtracting(true);
    setBrewMessage('画像からカラーパレットを抽出中です...');

    try {
      let result: ColorExtractionResult;
      
      if (file.type.startsWith('image/')) {
        result = await ColorExtractor.extractFromImage(file);
      } else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
        result = await ColorExtractor.extractFromHTML(file);
      } else if (file.name.endsWith('.css')) {
        result = await ColorExtractor.extractFromCSS(file);
      } else {
        // デフォルトで画像として処理
        result = await ColorExtractor.extractFromImage(file);
      }

      setExtractedColors(result);
      
      if (result.success) {
        setBrewMessage(`✅ ${result.message} ドミナントカラー: ${result.dominantColor}`);
        
        // 抽出したカラーを生成データに追加オプション
        const extractedData = result.colors.map(colorInfo => ({
          value: colorInfo.color,
          color: colorInfo.color
        }));
        
        // 既存の生成データと結合するか確認
        if (generatedColors.length > 0) {
          const combined = [...generatedColors, ...extractedData];
          setGeneratedColors(combined);
          setBrewMessage(`✅ 抽出した${result.colors.length}色を既存データに追加しました！`);
        } else {
          setGeneratedColors(extractedData);
          setBrewMessage(`✅ 抽出した${result.colors.length}色をデータとして設定しました！`);
        }
      } else {
        setBrewMessage(`❌ ${result.message}`);
      }
    } catch (error) {
      setBrewMessage(`❌ ファイル処理中にエラーが発生しました: ${error}`);
    } finally {
      setIsExtracting(false);
      // ファイル入力をリセット
      if (event.target) {
        event.target.value = '';
      }
    }
  }, [generatedColors]);

  // 抽出したパレットからカラーを選択
  const addExtractedColor = useCallback((color: string) => {
    const newColor = { value: color, color: color };
    setGeneratedColors(prev => [...prev, newColor]);
    setBrewMessage(`✅ カラー「${color}」を追加しました！`);
  }, []);

  return (
    <div className="min-h-screen bg-td-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-td-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Palette className="h-8 w-8 text-pink-600" />
              <h1 className="text-2xl font-bold text-td-gray-900">カラーデータ生成</h1>
              <span className="px-3 py-1 bg-pink-100 text-pink-800 text-sm rounded-full">
                画像抽出対応
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowImageExtractor(!showImageExtractor)}
                icon={<Image className="h-4 w-4" />}
                variant={showImageExtractor ? "primary" : "secondary"}
                size="sm"
              >
                {showImageExtractor ? '画像抽出表示中' : '画像からカラー抽出'}
              </Button>
              
              <Button
                onClick={() => setShowGuide(!showGuide)}
                icon={<HelpCircle className="h-4 w-4" />}
                variant={showGuide ? "primary" : "secondary"}
                size="sm"
              >
                {showGuide ? 'ガイドを閉じる' : '活用ガイド'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Brewキャラクターメッセージ */}
        <div className="mb-6 p-4 bg-pink-50 border border-pink-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🍺</div>
            <p className="text-pink-800 font-medium">{brewMessage}</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* メインコンテンツ */}
          <div className={`${showGuide ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6`}>
            
            {/* 画像抽出パネル */}
            {showImageExtractor && (
              <div className="bg-white rounded-xl p-6 border border-td-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-td-gray-900 flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    画像からカラー抽出
                  </h2>
                </div>

                {/* ファイルアップロード */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-td-gray-700 mb-3">
                    画像ファイルを選択（JPG、PNG、GIF、WebP対応）
                  </label>
                  <div className="border-2 border-dashed border-td-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors">
                    <div className="flex flex-col items-center">
                      <Upload className="h-8 w-8 text-td-gray-400 mb-2" />
                      <p className="text-td-gray-600 mb-4">クリックして画像を選択するか、ドラッグ&ドロップ</p>
                      <input
                        type="file"
                        accept="image/*,.html,.htm,.css"
                        onChange={handleImageUpload}
                        disabled={isExtracting}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                          isExtracting 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-pink-600 hover:bg-pink-700'
                        } transition-colors`}
                      >
                        {isExtracting ? '抽出中...' : 'ファイルを選択'}
                      </label>
                    </div>
                  </div>
                </div>

                {/* 抽出結果表示 */}
                {extractedColors && extractedColors.success && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-td-gray-800">抽出されたカラーパレット</h3>
                    
                    {/* ドミナントカラー */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-td-gray-700 mb-2">ドミナントカラー</h4>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-16 h-16 rounded-lg border-2 border-white shadow-sm"
                          style={{ backgroundColor: extractedColors.dominantColor }}
                        />
                        <div>
                          <div className="font-mono text-lg font-bold">{extractedColors.dominantColor}</div>
                          <div className="text-sm text-td-gray-600">最も多く使用されている色</div>
                        </div>
                        <Button
                          onClick={() => addExtractedColor(extractedColors.dominantColor)}
                          variant="primary"
                          size="sm"
                        >
                          追加
                        </Button>
                      </div>
                    </div>

                    {/* カラーパレット */}
                    <div>
                      <h4 className="font-medium text-td-gray-700 mb-3">カラーパレット（使用頻度順）</h4>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {extractedColors.colors.slice(0, 9).map((colorInfo, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div 
                              className="w-10 h-10 rounded border-2 border-white shadow-sm"
                              style={{ backgroundColor: colorInfo.color }}
                            />
                            <div className="flex-1">
                              <div className="font-mono text-sm font-medium">{colorInfo.color}</div>
                              <div className="text-xs text-td-gray-500">{colorInfo.percentage}%</div>
                            </div>
                            <Button
                              onClick={() => addExtractedColor(colorInfo.color)}
                              variant="secondary"
                              size="sm"
                            >
                              追加
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                                         {/* 全体統計 */}
                     <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                       <div className="text-sm text-blue-800">
                         <strong>抽出情報:</strong> {extractedColors.colors.length}色を検出 • 
                         ソース: {extractedColors.sourceType === 'image' ? '画像ファイル' : 'HTMLファイル'} • 
                         抽出日時: {extractedColors.extractedAt.toLocaleString('ja-JP')}
                       </div>
                     </div>

                     {/* パレット出力オプション */}
                     <div className="space-y-4">
                       <h4 className="font-semibold text-td-gray-800 flex items-center gap-2">
                         <Download className="h-4 w-4" />
                         パレット形式でコピー・ダウンロード
                       </h4>
                       
                       <div className="grid gap-3 sm:grid-cols-2">
                         <Button
                           onClick={() => {
                             const cssCode = ColorExtractor.generateCSSVariables(extractedColors.colors);
                             navigator.clipboard.writeText(cssCode);
                             setBrewMessage('✅ CSS変数形式でクリップボードにコピーしました！');
                           }}
                           variant="secondary"
                           size="sm"
                           className="justify-start"
                         >
                           📋 CSS変数形式をコピー
                         </Button>
                         
                         <Button
                           onClick={() => {
                             const scssCode = ColorExtractor.generateSCSSMixins(extractedColors.colors);
                             navigator.clipboard.writeText(scssCode);
                             setBrewMessage('✅ SCSS形式でクリップボードにコピーしました！');
                           }}
                           variant="secondary"
                           size="sm"
                           className="justify-start"
                         >
                           🎨 SCSS形式をコピー
                         </Button>
                         
                         <Button
                           onClick={() => {
                             const jsCode = ColorExtractor.generateJSArray(extractedColors.colors);
                             navigator.clipboard.writeText(jsCode);
                             setBrewMessage('✅ JavaScript配列形式でクリップボードにコピーしました！');
                           }}
                           variant="secondary"
                           size="sm"
                           className="justify-start"
                         >
                           ⚡ JS配列をコピー
                         </Button>
                         
                         <Button
                           onClick={() => {
                             const tailwindCode = ColorExtractor.generateTailwindConfig(extractedColors.colors);
                             navigator.clipboard.writeText(tailwindCode);
                             setBrewMessage('✅ Tailwind CSS設定でクリップボードにコピーしました！');
                           }}
                           variant="secondary"
                           size="sm"
                           className="justify-start"
                         >
                           🌊 Tailwind設定をコピー
                         </Button>
                       </div>

                       {/* 一括ダウンロード */}
                       <div className="pt-3 border-t border-td-gray-200">
                         <Button
                           onClick={() => {
                             const timestamp = new Date().toISOString().split('T')[0];
                             const cssCode = ColorExtractor.generateCSSVariables(extractedColors.colors);
                             const scssCode = ColorExtractor.generateSCSSMixins(extractedColors.colors);
                             const jsCode = ColorExtractor.generateJSArray(extractedColors.colors);
                             const tailwindCode = ColorExtractor.generateTailwindConfig(extractedColors.colors);
                             
                             const content = [
                               '/* ========================================',
                               ' * 抽出されたカラーパレット',
                               ` * 抽出日時: ${extractedColors.extractedAt.toLocaleString('ja-JP')}`,
                               ` * 抽出元: ${extractedColors.sourceType}`,
                               ` * カラー数: ${extractedColors.colors.length}色`,
                               ' * ======================================== */',
                               '',
                               '/* CSS変数 */',
                               cssCode,
                               '',
                               '/* SCSS */',
                               scssCode,
                               '',
                               '/* JavaScript */',
                               jsCode,
                               '',
                               '/* Tailwind CSS */',
                               tailwindCode
                             ].join('\n');
                             
                             const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
                             const url = URL.createObjectURL(blob);
                             const a = document.createElement('a');
                             a.href = url;
                             a.download = `color_palette_${timestamp}.txt`;
                             document.body.appendChild(a);
                             a.click();
                             document.body.removeChild(a);
                             URL.revokeObjectURL(url);
                             setBrewMessage('🎨 カラーパレット（全形式）をダウンロードしました！');
                           }}
                           variant="primary"
                           icon={<Download className="h-4 w-4" />}
                           className="w-full"
                         >
                           📁 全形式まとめてダウンロード
                         </Button>
                       </div>
                     </div>
                  </div>
                )}
              </div>
            )}

            {/* 設定パネル */}
            <div className="bg-white rounded-xl p-6 border border-td-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-td-gray-900 mb-6 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                生成設定
              </h2>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* 出力フォーマット */}
                <div>
                  <label className="block text-sm font-medium text-td-gray-700 mb-2">
                    出力フォーマット
                  </label>
                  <select
                    value={settings.format}
                    onChange={(e) => setSettings({...settings, format: e.target.value as ColorSettings['format']})}
                    className="w-full px-4 py-2 border border-td-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="hex">HEX (#FF5733)</option>
                    <option value="rgb">RGB (rgb(255, 87, 51))</option>
                    <option value="hsl">HSL (hsl(9, 100%, 60%))</option>
                    <option value="hsv">HSV (hsv(9, 80%, 100%))</option>
                    <option value="css-name">CSS Color Name (red)</option>
                  </select>
                </div>

                {/* カラースキーム */}
                <div>
                  <label className="block text-sm font-medium text-td-gray-700 mb-2">
                    カラースキーム
                  </label>
                  <select
                    value={settings.colorScheme}
                    onChange={(e) => setSettings({...settings, colorScheme: e.target.value as ColorSettings['colorScheme']})}
                    className="w-full px-4 py-2 border border-td-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    {Object.entries(colorSchemes).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* 生成件数 */}
                <div>
                  <label className="block text-sm font-medium text-td-gray-700 mb-2">
                    生成件数
                  </label>
                  <input
                    type="number"
                    value={settings.count}
                    onChange={(e) => setSettings({...settings, count: Math.max(1, Math.min(500, parseInt(e.target.value) || 1))})}
                    className="w-full px-4 py-2 border border-td-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    min="1"
                    max="500"
                  />
                </div>

                {/* 大文字・小文字 */}
                {['hex'].includes(settings.format) && (
                  <div>
                    <label className="block text-sm font-medium text-td-gray-700 mb-2">
                      文字種
                    </label>
                    <select
                      value={settings.caseType}
                      onChange={(e) => setSettings({...settings, caseType: e.target.value as 'upper' | 'lower'})}
                      className="w-full px-4 py-2 border border-td-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="upper">大文字 (#FF5733)</option>
                      <option value="lower">小文字 (#ff5733)</option>
                    </select>
                  </div>
                )}

                {/* アルファ値 */}
                {['hex', 'rgb', 'hsl'].includes(settings.format) && (
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.includeAlpha}
                        onChange={(e) => setSettings({...settings, includeAlpha: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-td-gray-700">アルファ値を含む</span>
                    </label>
                  </div>
                )}
              </div>

              {/* 操作ボタン */}
              <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-td-gray-200">
                <Button
                  onClick={generateColors}
                  icon={<RefreshCw className="h-4 w-4" />}
                  variant="primary"
                  disabled={isGenerating}
                >
                  {isGenerating ? '生成中...' : 'カラーを生成'}
                </Button>
              </div>
            </div>

            {/* 生成結果 */}
            {generatedColors.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-td-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-td-gray-800">
                    生成結果 ({generatedColors.length}件)
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={copyAllData}
                      icon={<Copy className="h-4 w-4" />}
                      variant="secondary"
                      size="sm"
                    >
                      全コピー
                    </Button>
                    <Button
                      onClick={downloadData}
                      icon={<Download className="h-4 w-4" />}
                      variant="primary"
                      size="sm"
                    >
                      ダウンロード
                    </Button>
                  </div>
                </div>
                
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {generatedColors.map((colorData, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-td-gray-50 rounded-lg border hover:bg-td-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded border border-td-gray-300 flex-shrink-0"
                          style={{ backgroundColor: colorData.color }}
                        />
                        <span className="font-mono text-sm text-td-gray-800">{colorData.value}</span>
                      </div>
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(colorData.value);
                          setBrewMessage(`${index + 1}番目のカラーをコピーしました`);
                        }}
                        icon={<Copy className="h-3 w-3" />}
                        variant="secondary"
                        size="sm"
                      >
                        コピー
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* サイドパネル（ガイド） */}
          {showGuide && (
            <div className="lg:col-span-4">
              <div className="sticky top-24 bg-white rounded-xl p-6 border border-td-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-td-gray-800 mb-4">🚀 活用ガイド</h3>
                
                <div className="space-y-4 text-sm text-td-gray-600">
                  <div>
                    <h4 className="font-medium text-td-gray-800 mb-2">🎨 基本的な使い方</h4>
                    <ul className="space-y-1">
                      <li>• 出力フォーマットを選択</li>
                      <li>• カラースキームを設定</li>
                      <li>• 生成件数を指定</li>
                      <li>• カラーを生成・コピー</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-td-gray-800 mb-2">🎯 フォーマット例</h4>
                    <ul className="space-y-1">
                      <li>• HEX: #FF5733</li>
                      <li>• RGB: rgb(255, 87, 51)</li>
                      <li>• HSL: hsl(9, 100%, 60%)</li>
                      <li>• HSV: hsv(9, 80%, 100%)</li>
                      <li>• CSS名: red, blue, green</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-td-gray-800 mb-2">🌈 カラースキーム</h4>
                    <ul className="space-y-1">
                      <li>• ウォームトーン: 暖色系</li>
                      <li>• クールトーン: 寒色系</li>
                      <li>• パステル: 淡い色合い</li>
                      <li>• ビビッド: 鮮やかな色</li>
                      <li>• モノクローム: グレー系</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-td-gray-800 mb-2">💡 効率化Tips</h4>
                    <ul className="space-y-1">
                      <li>• カラープレビュー付き</li>
                      <li>• 個別・全データコピー</li>
                      <li>• アルファ値対応</li>
                      <li>• 最大500件まで生成</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorDataGenerator; 