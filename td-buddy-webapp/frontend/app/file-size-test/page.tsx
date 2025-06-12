'use client';

import React, { useRef, useState } from 'react';
import TDCharacter from '../../components/TDCharacter';
import { Button } from '../../components/ui/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { AOZORA_BUNKO_SAMPLES } from '../../data/aozora-bunko-samples';

// 型定義
interface FileProgress {
  current: number;
  total: number;
  percentage: number;
  speed: number;
  estimatedTimeLeft: number;
  phase: 'preparing' | 'generating' | 'finalizing' | 'complete';
}

interface FileFormatOption {
  value: string;
  label: string;
  description: string;
  icon: string;
  maxRecommendedSize: number;
  category: 'text' | 'binary';
}

interface FileSettings {
  size: string;
  unit: 'B' | 'KB' | 'MB' | 'GB';
  filename: string;
  extension: string;
  contentType: 'aozora' | 'random' | 'zero';
  selectedWorks: string[];
}

// ファイル形式設定（アイコン付き）
const FILE_FORMATS: FileFormatOption[] = [
  {
    value: 'txt',
    label: 'テキスト',
    description: '青空文庫ベーステキスト',
    icon: '📄',
    maxRecommendedSize: 2 * 1024 * 1024 * 1024, // 2GB
    category: 'text',
  },
  {
    value: 'json',
    label: 'JSON',
    description: '構造化JSONデータ',
    icon: '📋',
    maxRecommendedSize: 1024 * 1024 * 1024, // 1GB
    category: 'text',
  },
  {
    value: 'xml',
    label: 'XML',
    description: 'XMLドキュメント',
    icon: '📰',
    maxRecommendedSize: 1024 * 1024 * 1024, // 1GB
    category: 'text',
  },
  {
    value: 'csv',
    label: 'CSV',
    description: 'CSVテーブルデータ',
    icon: '📊',
    maxRecommendedSize: 1024 * 1024 * 1024, // 1GB
    category: 'text',
  },
  {
    value: 'pdf',
    label: 'PDF',
    description: '実際に開けるPDFファイル',
    icon: '📕',
    maxRecommendedSize: 500 * 1024 * 1024, // 500MB
    category: 'binary',
  },
  {
    value: 'png',
    label: 'PNG画像',
    description: 'TDロゴ入り高品質PNG',
    icon: '🖼️',
    maxRecommendedSize: 200 * 1024 * 1024, // 200MB
    category: 'binary',
  },
  {
    value: 'jpg',
    label: 'JPEG画像',
    description: 'カラフルなJPEG画像',
    icon: '🎨',
    maxRecommendedSize: 100 * 1024 * 1024, // 100MB
    category: 'binary',
  },
];

// クイックサイズプリセット
const QUICK_SIZE_PRESETS = [
  {
    label: '1KB',
    size: '1',
    unit: 'KB' as const,
    useCase: '小さなテスト',
    icon: '🔸',
  },
  {
    label: '100KB',
    size: '100',
    unit: 'KB' as const,
    useCase: '中サイズファイル',
    icon: '🔹',
  },
  {
    label: '1MB',
    size: '1',
    unit: 'MB' as const,
    useCase: '画像・音声テスト',
    icon: '🔶',
  },
  {
    label: '10MB',
    size: '10',
    unit: 'MB' as const,
    useCase: '大きなファイル',
    icon: '🔷',
  },
  {
    label: '100MB',
    size: '100',
    unit: 'MB' as const,
    useCase: '動画・高解像度',
    icon: '🟦',
  },
  {
    label: '1GB',
    size: '1',
    unit: 'GB' as const,
    useCase: '大容量テスト',
    icon: '🟪',
  },
];

// ファイルサイズバリデーション関数
const validateFileSize = (bytes: number) => {
  if (bytes > 2 * 1024 * 1024 * 1024) {
    // 2GB
    return {
      isValid: false,
      warning: 'ファイルサイズが大きすぎます',
      recommendation: '2GB以下にしてください',
    };
  }

  if (bytes > 1024 * 1024 * 1024) {
    // 1GB
    return {
      isValid: true,
      warning: '大容量ファイルです',
      recommendation: '生成に時間がかかる場合があります',
    };
  }

  return {
    isValid: true,
    warning: null,
    recommendation: null,
  };
};

export default function FileSizeTestGenerator() {
  // State management
  const [settings, setSettings] = useState<FileSettings>({
    size: '1',
    unit: 'MB',
    filename: 'aozora-test-file',
    extension: 'txt',
    contentType: 'aozora',
    selectedWorks: ['wagahai-neko', 'kokoro', 'sanshiro'],
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<FileProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [tdMessage, setTdMessage] = useState<string>(
    '青空文庫の名作でファイル生成の準備完了です！実際に使えるファイルを超高速で作りますよ♪'
  );

  // Abort controller for cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  // Calculate target bytes
  const getTargetBytes = (): number => {
    const size = parseFloat(settings.size) || 0;
    const multipliers = {
      B: 1,
      KB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024,
    };
    return Math.floor(size * multipliers[settings.unit]);
  };

  // Format bytes for display
  const formatBytes = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  // Format speed for display
  const formatSpeed = (bytesPerSecond: number): string => {
    return `${formatBytes(bytesPerSecond)}/秒`;
  };

  // Format time for display
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}秒`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}分`;
    return `${Math.round(seconds / 3600)}時間`;
  };

  // Apply quick preset
  const applyPreset = (preset: (typeof QUICK_SIZE_PRESETS)[0]) => {
    setSettings(prev => ({
      ...prev,
      size: preset.size,
      unit: preset.unit,
    }));
    setTdMessage(
      `${preset.label}の設定を適用しました！${preset.useCase}に最適ですね♪`
    );
  };

  // Toggle work selection
  const toggleWorkSelection = (workId: string) => {
    setSettings(prev => ({
      ...prev,
      selectedWorks: prev.selectedWorks.includes(workId)
        ? prev.selectedWorks.filter(id => id !== workId)
        : [...prev.selectedWorks, workId],
    }));
  };

  // Validate inputs
  const validateInputs = (): string | null => {
    const targetBytes = getTargetBytes();

    // サイズ制限チェック
    if (targetBytes > 2 * 1024 * 1024 * 1024) {
      return 'ファイルサイズが大きすぎます（最大2GB）';
    }

    if (targetBytes < 1) {
      return 'ファイルサイズは1バイト以上である必要があります';
    }

    // ファイル名チェック
    if (!settings.filename.trim()) {
      return 'ファイル名を入力してください';
    }

    // 青空文庫作品選択チェック
    if (
      settings.contentType === 'aozora' &&
      settings.selectedWorks.length === 0
    ) {
      return '青空文庫作品を少なくとも1つ選択してください';
    }

    return null;
  };

  // Generate file
  const handleGenerate = async () => {
    // Clear previous states
    setError(null);
    setSuccess(null);
    setWarning(null);

    // Validate inputs
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    const targetBytes = getTargetBytes();
    const validation = validateFileSize(targetBytes);

    // Show warning for large files
    if (validation.warning) {
      setWarning(`${validation.warning}: ${validation.recommendation}`);
    }

    setIsGenerating(true);
    setProgress(null);
    setTdMessage('青空文庫の名作を使って、実用的なファイルを超高速生成中です♪');

    // Create abort controller
    abortControllerRef.current = new AbortController();

    try {
      let blob: Blob;

      // PDFと画像は実際のファイル生成、その他は青空文庫ベース超高速生成
      if (['pdf', 'png', 'jpg', 'jpeg'].includes(settings.extension)) {
        const { generateRealFile } = await import(
          '../../utils/real-file-generator'
        );
        blob = await generateRealFile(
          targetBytes,
          settings.extension,
          progressInfo => {
            setProgress(progressInfo);
          },
          abortControllerRef.current.signal
        );
      } else {
        // 青空文庫ベース超高速生成器を使用
        const { generateAozoraUltraFast } = await import(
          '../../utils/aozora-ultra-fast-generator'
        );
        blob = await generateAozoraUltraFast(
          targetBytes,
          settings.extension,
          settings.contentType,
          settings.selectedWorks,
          (progressInfo: any) => {
            setProgress(progressInfo);
          },
          abortControllerRef.current.signal
        );
      }

      // Download file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${settings.filename}.${settings.extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess(
        `ファイル「${settings.filename}.${settings.extension}」（${formatBytes(
          targetBytes
        )}）の生成が完了しました！`
      );
      setTdMessage(
        '完璧！青空文庫の名作を活用した実用的なファイルができました♪'
      );
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('キャンセル')) {
          setWarning('ファイル生成がキャンセルされました');
          setTdMessage('生成をキャンセルしました。また挑戦してくださいね♪');
        } else {
          setError(`生成エラー: ${err.message}`);
          setTdMessage('申し訳ございません。もう一度お試しください🙏');
        }
      } else {
        setError('予期しないエラーが発生しました');
        setTdMessage('予期しないエラーが発生しました。再試行をお願いします🙏');
      }
    } finally {
      setIsGenerating(false);
      setProgress(null);
      abortControllerRef.current = null;
    }
  };

  // Cancel generation
  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // Auto-dismiss messages
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  React.useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => setWarning(null), 15000);
      return () => clearTimeout(timer);
    }
  }, [warning]);

  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="min-h-screen td-gradient-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            📚 青空文庫ベース超高速ファイル生成
          </h1>
          <p className="text-white/80 text-lg">
            名作文学を活用した実用的なテストファイルを超高速生成
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Main Configuration Panel */}
          <Card className="td-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚙️ ファイル設定
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Size Presets */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  🚀 クイック設定
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {QUICK_SIZE_PRESETS.map(preset => (
                    <Button
                      key={preset.label}
                      onClick={() => applyPreset(preset)}
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-1 text-xs"
                      title={preset.useCase}
                    >
                      <span>{preset.icon}</span>
                      <span>{preset.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* File Size Input */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    📏 ファイルサイズ
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={settings.size}
                      onChange={e =>
                        setSettings(prev => ({ ...prev, size: e.target.value }))
                      }
                      placeholder="1"
                      min="0.001"
                      step="0.001"
                      className="flex-1"
                    />
                    <select
                      value={settings.unit}
                      onChange={e =>
                        setSettings(prev => ({
                          ...prev,
                          unit: e.target.value as any,
                        }))
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="B">B</option>
                      <option value="KB">KB</option>
                      <option value="MB">MB</option>
                      <option value="GB">GB</option>
                    </select>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    計算サイズ: {formatBytes(getTargetBytes())}
                  </p>
                </div>

                {/* File Name Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    📝 ファイル名
                  </label>
                  <Input
                    type="text"
                    value={settings.filename}
                    onChange={e =>
                      setSettings(prev => ({
                        ...prev,
                        filename: e.target.value,
                      }))
                    }
                    placeholder="aozora-test-file"
                  />
                </div>
              </div>

              {/* File Format Selection with Icons */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  📄 ファイル形式
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {FILE_FORMATS.map(format => (
                    <label
                      key={format.value}
                      className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                        settings.extension === format.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="extension"
                        value={format.value}
                        checked={settings.extension === format.value}
                        onChange={e =>
                          setSettings(prev => ({
                            ...prev,
                            extension: e.target.value,
                          }))
                        }
                        className="sr-only"
                      />
                      <span className="text-lg">{format.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">
                          {format.label}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {format.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Content Type Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  📚 コンテンツタイプ
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="contentType"
                      value="aozora"
                      checked={settings.contentType === 'aozora'}
                      onChange={e =>
                        setSettings(prev => ({
                          ...prev,
                          contentType: e.target.value as any,
                        }))
                      }
                      className="text-blue-600"
                    />
                    <span className="font-medium">
                      📖 青空文庫テキスト（推奨）
                    </span>
                    <span className="text-sm text-gray-500">
                      - 実際の日本語名作文学でファイルを埋めます
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="contentType"
                      value="random"
                      checked={settings.contentType === 'random'}
                      onChange={e =>
                        setSettings(prev => ({
                          ...prev,
                          contentType: e.target.value as any,
                        }))
                      }
                      className="text-blue-600"
                    />
                    <span className="font-medium">🎲 ランダムデータ</span>
                    <span className="text-sm text-gray-500">
                      - 英数字のランダムな組み合わせ
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="contentType"
                      value="zero"
                      checked={settings.contentType === 'zero'}
                      onChange={e =>
                        setSettings(prev => ({
                          ...prev,
                          contentType: e.target.value as any,
                        }))
                      }
                      className="text-blue-600"
                    />
                    <span className="font-medium">0️⃣ ゼロ埋め</span>
                    <span className="text-sm text-gray-500">
                      - すべて「0」で埋めたファイル
                    </span>
                  </label>
                </div>
              </div>

              {/* Aozora Works Selection */}
              {settings.contentType === 'aozora' && (
                <div>
                  <label className="block text-sm font-medium mb-3">
                    📚 使用する青空文庫作品
                  </label>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {AOZORA_BUNKO_SAMPLES.map(work => (
                      <label
                        key={work.id}
                        className="flex items-start gap-2 cursor-pointer p-2 rounded hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={settings.selectedWorks.includes(work.id)}
                          onChange={() => toggleWorkSelection(work.id)}
                          className="mt-1 text-blue-600"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">
                            {work.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {work.author}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            {work.content.substring(0, 50)}...
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    選択済み: {settings.selectedWorks.length}作品
                    {settings.selectedWorks.length === 0 && '（全作品を使用）'}
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <div className="flex gap-2">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="td-button td-button-primary flex-1"
                >
                  {isGenerating ? '生成中...' : '🚀 超高速ファイル生成開始'}
                </Button>
                {isGenerating && (
                  <Button
                    onClick={handleCancel}
                    variant="ghost"
                    className="td-button"
                  >
                    ❌ キャンセル
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Progress and Status Panel */}
          <div className="space-y-6">
            {/* TD Character */}
            <TDCharacter
              emotion={
                error
                  ? 'error'
                  : isGenerating
                  ? 'working'
                  : success
                  ? 'success'
                  : 'friendly'
              }
              message={tdMessage}
              animation={isGenerating ? 'heartbeat' : 'none'}
            />

            {/* Progress Display */}
            {progress && (
              <Card className="td-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    ⚡ 生成進捗
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>
                        {progress.phase === 'preparing'
                          ? '準備中'
                          : progress.phase === 'generating'
                          ? '生成中'
                          : progress.phase === 'finalizing'
                          ? '最終化中'
                          : '完了'}
                      </span>
                      <span>{progress.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">処理済み:</span>
                        <br />
                        {formatBytes(progress.current)}
                      </div>
                      <div>
                        <span className="font-medium">速度:</span>
                        <br />
                        {formatSpeed(progress.speed)}
                      </div>
                      <div>
                        <span className="font-medium">残り時間:</span>
                        <br />
                        {formatTime(progress.estimatedTimeLeft)}
                      </div>
                      <div>
                        <span className="font-medium">合計:</span>
                        <br />
                        {formatBytes(progress.total)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status Messages */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 text-xl">❌</span>
                    <div>
                      <div className="font-medium text-red-800">エラー</div>
                      <div className="text-red-700 text-sm">{error}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {warning && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-500 text-xl">⚠️</span>
                    <div>
                      <div className="font-medium text-yellow-800">警告</div>
                      <div className="text-yellow-700 text-sm">{warning}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {success && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 text-xl">✅</span>
                    <div>
                      <div className="font-medium text-green-800">成功</div>
                      <div className="text-green-700 text-sm">{success}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Aozora Info Card */}
            <Card className="td-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📚 青空文庫について
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p>
                    青空文庫は著作権が切れた名作文学を電子化したプロジェクトです。
                    夏目漱石、芥川龍之介、樋口一葉などの名作を活用して、
                    実際に読める内容のテストファイルを生成します。
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-medium">利用可能作品:</span>{' '}
                      {AOZORA_BUNKO_SAMPLES.length}作品
                    </div>
                    <div>
                      <span className="font-medium">文字エンコーディング:</span>{' '}
                      UTF-8
                    </div>
                    <div>
                      <span className="font-medium">ファイル品質:</span>{' '}
                      実用レベル
                    </div>
                    <div>
                      <span className="font-medium">生成速度:</span> 超高速
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
