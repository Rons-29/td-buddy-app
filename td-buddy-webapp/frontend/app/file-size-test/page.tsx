'use client';

import { useCallback, useRef, useState } from 'react';
import TDCharacter from '../../components/TDCharacter';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { AOZORA_BUNKO_SAMPLES } from '../../data/aozora-bunko-samples';
import {
  generateUnified,
  UnifiedProgress,
} from '../../utils/unified-generator';

// ファイル形式定義（アイコン付き）
const FILE_FORMATS = [
  { type: 'txt', label: 'TXT', icon: '📄', maxSize: 2 * 1024 * 1024 * 1024 },
  { type: 'json', label: 'JSON', icon: '📋', maxSize: 2 * 1024 * 1024 * 1024 },
  { type: 'xml', label: 'XML', icon: '📰', maxSize: 2 * 1024 * 1024 * 1024 },
  { type: 'csv', label: 'CSV', icon: '📊', maxSize: 2 * 1024 * 1024 * 1024 },
  { type: 'pdf', label: 'PDF', icon: '📕', maxSize: 500 * 1024 * 1024 },
  { type: 'png', label: 'PNG', icon: '🖼️', maxSize: 200 * 1024 * 1024 },
  { type: 'jpg', label: 'JPEG', icon: '📸', maxSize: 100 * 1024 * 1024 },
];

export default function FileSizeTestPage() {
  // 状態管理
  const [targetSize, setTargetSize] = useState<string>('1');
  const [unit, setUnit] = useState<'MB' | 'GB'>('MB');
  const [selectedFormat, setSelectedFormat] = useState<string>('txt');
  const [contentType, setContentType] = useState<'aozora' | 'random' | 'zero'>(
    'aozora'
  );
  const [selectedWorks, setSelectedWorks] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<UnifiedProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tdMessage, setTdMessage] = useState<string>(
    'ファイルサイズテスト機能です！どんなサイズでも生成できます♪'
  );

  const abortControllerRef = useRef<AbortController | null>(null);

  // バイト数計算（1MB = 1024KB）
  const calculateBytes = useCallback(
    (size: string, unit: 'MB' | 'GB'): number => {
      const numSize = parseFloat(size);
      if (isNaN(numSize) || numSize <= 0) return 0;

      if (unit === 'GB') {
        return Math.floor(numSize * 1024 * 1024 * 1024);
      } else {
        return Math.floor(numSize * 1024 * 1024);
      }
    },
    []
  );

  // バイト数フォーマット
  const formatBytes = useCallback((bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }, []);

  // プログレス更新
  const handleProgress = useCallback((progressData: UnifiedProgress) => {
    setProgress(progressData);

    // TDメッセージ更新
    switch (progressData.phase) {
      case 'preparing':
        setTdMessage('準備中です...少々お待ちください♪');
        break;
      case 'generating':
        const percentage = progressData.percentage.toFixed(1);
        setTdMessage(`生成中... ${percentage}% 完了！頑張ってます♪`);
        break;
      case 'finalizing':
        setTdMessage('最終調整中...もうすぐ完了です！');
        break;
      case 'complete':
        setTdMessage('生成完了！完璧なファイルができました✨');
        break;
    }
  }, []);

  // ファイル生成
  const handleGenerate = async () => {
    const targetBytes = calculateBytes(targetSize, unit);

    if (targetBytes === 0) {
      setError('有効なファイルサイズを入力してください');
      setTdMessage('サイズの入力に問題があります。確認してください！');
      return;
    }

    const selectedFormatData = FILE_FORMATS.find(
      f => f.type === selectedFormat
    );
    if (selectedFormatData && targetBytes > selectedFormatData.maxSize) {
      setError(
        `${selectedFormatData.label}の最大サイズは${formatBytes(
          selectedFormatData.maxSize
        )}です`
      );
      setTdMessage('サイズが大きすぎます。制限内で設定してください！');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProgress(null);
    setTdMessage('統一生成器でファイルを作成します！');

    // AbortController作成
    abortControllerRef.current = new AbortController();

    try {
      console.log(
        `🚀 統一生成開始: ${formatBytes(
          targetBytes
        )} ${selectedFormat.toUpperCase()}ファイル`
      );

      const blob = await generateUnified(
        targetBytes,
        selectedFormat,
        contentType,
        selectedWorks,
        handleProgress,
        abortControllerRef.current.signal
      );

      // ダウンロード
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aozora-test-file.${selectedFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log(
        `✅ ダウンロード完了: ${formatBytes(blob.size)} (誤差0バイト)`
      );
      setTdMessage(
        `ダウンロード完了！${formatBytes(blob.size)}のファイルを作成しました♪`
      );
    } catch (error) {
      if (error instanceof Error && error.message.includes('キャンセル')) {
        setTdMessage('生成をキャンセルしました');
      } else {
        const errorMessage =
          error instanceof Error ? error.message : '不明なエラー';
        setError(`生成エラー: ${errorMessage}`);
        setTdMessage('エラーが発生しました。もう一度お試しください');
        console.error('統一生成エラー:', error);
      }
    } finally {
      setIsGenerating(false);
      setProgress(null);
      abortControllerRef.current = null;
    }
  };

  // 生成キャンセル
  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setTdMessage('生成をキャンセルしています...');
    }
  };

  // 青空文庫作品選択
  const handleWorkToggle = (workId: string) => {
    setSelectedWorks(prev =>
      prev.includes(workId)
        ? prev.filter(id => id !== workId)
        : [...prev, workId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📁 ファイルサイズテスト
          </h1>
          <p className="text-gray-600">
            統一生成器で任意サイズのファイルを生成（誤差0バイト保証）
          </p>
        </div>

        {/* TDキャラクター */}
        <div className="mb-6">
          <TDCharacter
            message={tdMessage}
            emotion={isGenerating ? 'working' : error ? 'error' : 'happy'}
            showSpeechBubble={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 設定パネル */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              🎛️ 生成設定
            </h2>

            {/* ファイルサイズ設定 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ファイルサイズ
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={targetSize}
                  onChange={e => setTargetSize(e.target.value)}
                  placeholder="1"
                  min="0.001"
                  step="0.001"
                  className="flex-1"
                  disabled={isGenerating}
                />
                <select
                  value={unit}
                  onChange={e => setUnit(e.target.value as 'MB' | 'GB')}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isGenerating}
                >
                  <option value="MB">MB</option>
                  <option value="GB">GB</option>
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                目標: {formatBytes(calculateBytes(targetSize, unit))} (1MB =
                1024KB)
              </p>
            </div>

            {/* ファイル形式選択 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ファイル形式
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FILE_FORMATS.map(format => (
                  <button
                    key={format.type}
                    onClick={() => setSelectedFormat(format.type)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedFormat === format.type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={isGenerating}
                  >
                    <div className="text-2xl mb-1">{format.icon}</div>
                    <div className="font-medium">{format.label}</div>
                    <div className="text-xs text-gray-500">
                      最大 {formatBytes(format.maxSize)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* コンテンツタイプ */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                コンテンツタイプ
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setContentType('aozora')}
                  className={`p-2 rounded-lg border ${
                    contentType === 'aozora'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={isGenerating}
                >
                  📚 青空文庫
                </button>
                <button
                  onClick={() => setContentType('random')}
                  className={`p-2 rounded-lg border ${
                    contentType === 'random'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={isGenerating}
                >
                  🎲 ランダム
                </button>
                <button
                  onClick={() => setContentType('zero')}
                  className={`p-2 rounded-lg border ${
                    contentType === 'zero'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={isGenerating}
                >
                  0️⃣ ゼロ埋め
                </button>
              </div>
            </div>

            {/* 青空文庫作品選択 */}
            {contentType === 'aozora' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  青空文庫作品選択（任意）
                </label>
                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                  {AOZORA_BUNKO_SAMPLES.map(work => (
                    <label key={work.id} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        checked={selectedWorks.includes(work.id)}
                        onChange={() => handleWorkToggle(work.id)}
                        className="mr-2"
                        disabled={isGenerating}
                      />
                      <span className="text-sm">
                        {work.title} - {work.author}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  選択なしの場合、全作品からランダム選択
                </p>
              </div>
            )}

            {/* 生成ボタン */}
            <div className="flex gap-2">
              <Button
                onClick={handleGenerate}
                disabled={
                  isGenerating || calculateBytes(targetSize, unit) === 0
                }
                className="flex-1"
              >
                {isGenerating ? '🔄 生成中...' : '🚀 統一生成開始'}
              </Button>
              {isGenerating && (
                <Button
                  onClick={handleCancel}
                  variant="secondary"
                  className="px-4"
                >
                  ❌
                </Button>
              )}
            </div>
          </Card>

          {/* 進捗・結果パネル */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              📊 進捗状況
            </h2>

            {/* エラー表示 */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* プログレス表示 */}
            {progress && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>進捗: {progress.percentage.toFixed(1)}%</span>
                  <span>
                    {formatBytes(progress.current)} /{' '}
                    {formatBytes(progress.total)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>フェーズ: {progress.phase}</span>
                  <span>
                    実際のバイト数: {progress.actualBytes.toLocaleString()}
                  </span>
                </div>
                {progress.speed > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    速度: {formatBytes(progress.speed)}/秒
                  </div>
                )}
              </div>
            )}

            {/* 統一生成器の特徴 */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="font-medium text-blue-800 mb-2">
                ✨ 統一生成器の特徴
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 全ファイル形式を一つの関数で処理</li>
                <li>• 誤差0バイト保証（厳密サイズ制御）</li>
                <li>• 1MB = 1024KB の正確な計算</li>
                <li>• 実際に開けるPDF・画像ファイル生成</li>
                <li>• 青空文庫コンテンツ対応</li>
                <li>• ASCII安全変換でエンコード問題回避</li>
                <li>• リアルタイム進捗表示</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
