"use client";

import React, { useState } from "react";
import {
  AOZORA_BUNKO_SAMPLES,
  generateContentByType,
} from "../data/aozora-bunko-samples";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

interface FileSizeTestGeneratorProps {
  className?: string;
}

interface FileSettings {
  size: string;
  unit: "B" | "KB" | "MB" | "GB";
  filename: string;
  extension: "txt" | "json" | "csv" | "xml" | "yaml" | "dat";
  contentType: "aozora" | "random" | "zero";
  selectedWorks: string[];
}

interface ProgressState {
  isGenerating: boolean;
  progress: number;
  message: string;
}

const SIZE_UNITS = {
  B: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
} as const;

const FILE_EXTENSIONS = [
  { value: "txt", label: "テキストファイル (.txt)", icon: "📄" },
  { value: "json", label: "JSONファイル (.json)", icon: "📋" },
  { value: "csv", label: "CSVファイル (.csv)", icon: "📊" },
  { value: "xml", label: "XMLファイル (.xml)", icon: "📰" },
  { value: "yaml", label: "YAMLファイル (.yaml)", icon: "⚙️" },
  { value: "dat", label: "データファイル (.dat)", icon: "💾" },
] as const;

const QUICK_SIZE_PRESETS = [
  { label: "1KB", size: "1", unit: "KB" as const, useCase: "小さなテスト" },
  {
    label: "100KB",
    size: "100",
    unit: "KB" as const,
    useCase: "中サイズファイル",
  },
  { label: "1MB", size: "1", unit: "MB" as const, useCase: "画像・音声テスト" },
  { label: "10MB", size: "10", unit: "MB" as const, useCase: "大きなファイル" },
  {
    label: "100MB",
    size: "100",
    unit: "MB" as const,
    useCase: "動画・高解像度",
  },
  { label: "1GB", size: "1", unit: "GB" as const, useCase: "大容量テスト" },
];

const FileSizeTestGenerator: React.FC<FileSizeTestGeneratorProps> = ({
  className,
}) => {
  const [settings, setSettings] = useState<FileSettings>({
    size: "1",
    unit: "MB",
    filename: "testfile",
    extension: "txt",
    contentType: "aozora",
    selectedWorks: ["wagahai-neko", "kokoro"],
  });

  const [progress, setProgress] = useState<ProgressState>({
    isGenerating: false,
    progress: 0,
    message: "",
  });

  const [generatedFiles, setGeneratedFiles] = useState<
    Array<{
      filename: string;
      size: string;
      downloadUrl: string;
      timestamp: string;
    }>
  >([]);

  // TDキャラクターメッセージ
  const [tdMessage, setTdMessage] = useState<string>(
    "ファイル容量テストの準備完了です！どんなサイズのファイルでも作れますよ♪"
  );

  // ファイルサイズの計算
  const calculateSizeInBytes = (
    size: string,
    unit: keyof typeof SIZE_UNITS
  ): number => {
    const numSize = parseFloat(size) || 0;
    return Math.floor(numSize * SIZE_UNITS[unit]);
  };

  // クイックプリセットの適用
  const applyPreset = (preset: (typeof QUICK_SIZE_PRESETS)[0]) => {
    setSettings((prev) => ({
      ...prev,
      size: preset.size,
      unit: preset.unit,
    }));
    setTdMessage(
      `${preset.label}のファイル設定を適用しました！${preset.useCase}に最適ですね♪`
    );
  };

  // 青空文庫作品の選択
  const toggleWorkSelection = (workId: string) => {
    setSettings((prev) => ({
      ...prev,
      selectedWorks: prev.selectedWorks.includes(workId)
        ? prev.selectedWorks.filter((id) => id !== workId)
        : [...prev.selectedWorks, workId],
    }));
  };

  // ファイル生成とダウンロード
  const generateAndDownloadFile = async () => {
    const targetSizeBytes = calculateSizeInBytes(settings.size, settings.unit);

    if (targetSizeBytes <= 0) {
      setTdMessage("ファイルサイズが無効です。1以上の値を入力してください⚠️");
      return;
    }

    if (targetSizeBytes > 1024 * 1024 * 1024) {
      // 1GB制限
      setTdMessage(
        "1GB以下のサイズを指定してください。大きすぎるファイルはブラウザに負荷をかけます⚠️"
      );
      return;
    }

    setProgress({
      isGenerating: true,
      progress: 0,
      message: "ファイル生成を開始します...",
    });

    setTdMessage("データ生成中です。少々お待ちください♪");

    try {
      // プログレス更新をシミュレート
      const updateProgress = (percent: number, message: string) => {
        setProgress((prev) => ({
          ...prev,
          progress: percent,
          message,
        }));
      };

      updateProgress(10, "コンテンツ準備中...");

      let content: string;

      switch (settings.contentType) {
        case "aozora":
          content = generateContentByType(
            targetSizeBytes,
            settings.extension === "dat" ? "txt" : settings.extension,
            settings.selectedWorks
          );
          break;
        case "random":
          content = generateRandomContent(targetSizeBytes);
          break;
        case "zero":
          content = generateZeroContent(targetSizeBytes);
          break;
        default:
          content = generateContentByType(
            targetSizeBytes,
            "txt",
            settings.selectedWorks
          );
      }

      updateProgress(50, "データサイズ調整中...");

      // サイズ調整
      content = adjustContentToTargetSize(content, targetSizeBytes);

      updateProgress(80, "ファイル準備中...");

      // ファイル名の生成
      const fullFilename = settings.filename.includes(".")
        ? settings.filename
        : `${settings.filename}.${settings.extension}`;

      // Blobの作成
      const blob = new Blob([content], {
        type: getContentType(settings.extension),
      });
      const actualSize = blob.size;

      updateProgress(90, "ダウンロード準備中...");

      // ダウンロード実行
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fullFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 生成履歴に追加
      const newFile = {
        filename: fullFilename,
        size: formatFileSize(actualSize),
        downloadUrl: url,
        timestamp: new Date().toLocaleString("ja-JP"),
      };

      setGeneratedFiles((prev) => [newFile, ...prev.slice(0, 4)]); // 最新5件まで保持

      updateProgress(100, "ダウンロード完了！");

      setTdMessage(
        `✅ ファイル生成完了！${fullFilename} (${formatFileSize(
          actualSize
        )}) をダウンロードしました♪`
      );

      // URLを少し後にクリーンアップ
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("ファイル生成エラー:", error);
      setTdMessage(
        "❌ ファイル生成中にエラーが発生しました。もう一度お試しください。"
      );
    } finally {
      setTimeout(() => {
        setProgress({
          isGenerating: false,
          progress: 0,
          message: "",
        });
      }, 1500);
    }
  };

  // コンテンツタイプの取得
  const getContentType = (extension: string): string => {
    const contentTypes: Record<string, string> = {
      txt: "text/plain",
      json: "application/json",
      csv: "text/csv",
      xml: "application/xml",
      yaml: "application/x-yaml",
      dat: "application/octet-stream",
    };
    return contentTypes[extension] || "text/plain";
  };

  // ファイルサイズのフォーマット
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  // コンテンツサイズの調整
  const adjustContentToTargetSize = (
    content: string,
    targetSize: number
  ): string => {
    const currentSize = Buffer.byteLength(content, "utf8");

    if (currentSize === targetSize) return content;

    if (currentSize > targetSize) {
      // 切り詰め
      return content.substring(0, targetSize);
    } else {
      // パディング
      const padding = " ".repeat(targetSize - currentSize);
      return content + padding;
    }
  };

  // ランダムコンテンツ生成
  const generateRandomContent = (targetSize: number): string => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\n ";
    let result = "";
    for (let i = 0; i < targetSize; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // ゼロ埋めコンテンツ生成
  const generateZeroContent = (targetSize: number): string => {
    return "0".repeat(targetSize);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* TDメッセージ */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🤖</div>
            <div className="flex-1">
              <div className="font-medium text-blue-800 mb-1">
                TDからのメッセージ
              </div>
              <div className="text-blue-700">{tdMessage}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* メイン設定 */}
      <Card>
        <CardHeader>
          <CardTitle>📁 ファイル容量テスト - データ生成</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* クイックプリセット */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🚀 クイック設定
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {QUICK_SIZE_PRESETS.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset)}
                  className="text-xs"
                  title={preset.useCase}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* ファイルサイズ設定 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📏 ファイルサイズ
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={settings.size}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, size: e.target.value }))
                  }
                  min="0.001"
                  step="0.001"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1"
                />
                <select
                  value={settings.unit}
                  onChange={(e) =>
                    setSettings((prev) => ({
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
              <div className="text-xs text-gray-500 mt-1">
                実際のサイズ:{" "}
                {formatFileSize(
                  calculateSizeInBytes(settings.size, settings.unit)
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📝 ファイル名
              </label>
              <input
                type="text"
                value={settings.filename}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, filename: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="testfile"
              />
            </div>
          </div>

          {/* ファイル形式 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📄 ファイル形式
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {FILE_EXTENSIONS.map((ext) => (
                <label
                  key={ext.value}
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                    settings.extension === ext.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="extension"
                    value={ext.value}
                    checked={settings.extension === ext.value}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        extension: e.target.value as any,
                      }))
                    }
                    className="sr-only"
                  />
                  <span className="text-lg">{ext.icon}</span>
                  <span className="text-sm font-medium">{ext.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* コンテンツタイプ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📚 コンテンツタイプ
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="contentType"
                  value="aozora"
                  checked={settings.contentType === "aozora"}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      contentType: e.target.value as any,
                    }))
                  }
                  className="text-blue-600"
                />
                <span className="font-medium">📖 青空文庫テキスト（推奨）</span>
                <span className="text-sm text-gray-500">
                  - 実際の日本語テキストでファイルを埋めます
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="contentType"
                  value="random"
                  checked={settings.contentType === "random"}
                  onChange={(e) =>
                    setSettings((prev) => ({
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
                  checked={settings.contentType === "zero"}
                  onChange={(e) =>
                    setSettings((prev) => ({
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

          {/* 青空文庫作品選択 */}
          {settings.contentType === "aozora" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📚 使用する青空文庫作品
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {AOZORA_BUNKO_SAMPLES.map((work) => (
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
                      <div className="font-medium text-sm">{work.title}</div>
                      <div className="text-xs text-gray-500">{work.author}</div>
                      <div className="text-xs text-gray-400 truncate">
                        {work.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                選択済み: {settings.selectedWorks.length}作品
                {settings.selectedWorks.length === 0 && "（全作品を使用）"}
              </div>
            </div>
          )}

          {/* 生成・ダウンロードボタン */}
          <div className="flex gap-3">
            <Button
              onClick={generateAndDownloadFile}
              disabled={progress.isGenerating}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              {progress.isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>生成中... {progress.progress}%</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>🚀</span>
                  <span>ファイルを生成してダウンロード</span>
                </div>
              )}
            </Button>
          </div>

          {/* プログレスバー */}
          {progress.isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{progress.message}</span>
                <span>{progress.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 生成履歴 */}
      {generatedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📋 生成履歴</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {generatedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📁</span>
                    <div>
                      <div className="font-medium">{file.filename}</div>
                      <div className="text-sm text-gray-500">
                        {file.size} • {file.timestamp}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = file.downloadUrl;
                      link.download = file.filename;
                      link.click();
                    }}
                  >
                    再ダウンロード
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileSizeTestGenerator;
