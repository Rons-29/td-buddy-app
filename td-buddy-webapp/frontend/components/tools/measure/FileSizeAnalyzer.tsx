'use client';

import React, { useCallback, useState } from 'react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';

interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

interface FileSizeResult {
  totalFiles: number;
  totalSize: number;
  averageSize: number;
  largestFile: FileInfo | null;
  smallestFile: FileInfo | null;
  fileTypes: { [key: string]: number };
}

export const FileSizeAnalyzer: React.FC = () => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [result, setResult] = useState<FileSizeResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files;
      if (!selectedFiles) {
        return;
      }

      const fileInfos: FileInfo[] = Array.from(selectedFiles).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type || 'unknown',
        lastModified: file.lastModified,
      }));

      setFiles(fileInfos);
    },
    []
  );

  const analyzeFiles = useCallback(() => {
    if (files.length === 0) {
      return;
    }

    setIsAnalyzing(true);

    // Simulate analysis delay
    setTimeout(() => {
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      const averageSize = totalSize / files.length;

      const sortedBySize = [...files].sort((a, b) => b.size - a.size);
      const largestFile = sortedBySize[0];
      const smallestFile = sortedBySize[sortedBySize.length - 1];

      const fileTypes = files.reduce((types, file) => {
        const extension =
          file.name.split('.').pop()?.toLowerCase() || 'unknown';
        types[extension] = (types[extension] || 0) + 1;
        return types;
      }, {} as { [key: string]: number });

      setResult({
        totalFiles: files.length,
        totalSize,
        averageSize,
        largestFile,
        smallestFile,
        fileTypes,
      });

      setIsAnalyzing(false);
    }, 1000);
  }, [files]);

  return (
    <div className="wb-workbench-bg min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📏 ファイルサイズ測定工具
          </h1>
          <p className="text-gray-600">
            ファイルサイズを正確に測定・分析する職人の工具
          </p>
        </div>

        {/* File Upload Tool */}
        <Card workbench className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-orange-700">
              🔧 ファイル選択工具
            </h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex flex-col items-center"
                >
                  <div className="text-6xl mb-4 text-orange-400">📁</div>
                  <span className="text-lg font-semibold text-orange-700 mb-2">
                    ファイルを選択してください
                  </span>
                  <span className="text-gray-600">
                    複数ファイルの同時測定が可能です
                  </span>
                </label>
              </div>

              {files.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2 text-orange-700">
                    選択されたファイル ({files.length}件)
                  </h3>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-orange-50 rounded"
                      >
                        <span className="text-sm font-medium truncate">
                          {file.name}
                        </span>
                        <Badge variant="outline" className="ml-2">
                          {formatFileSize(file.size)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                workbench
                onClick={analyzeFiles}
                disabled={files.length === 0 || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? '📏 測定中...' : '📏 サイズ測定を開始'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Analysis Results */}
        {result && (
          <Card workbench className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-orange-700">
                📊 測定結果
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Summary Stats */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-orange-700">📈 統計情報</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>総ファイル数:</span>
                      <Badge variant="measure">{result.totalFiles}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>総サイズ:</span>
                      <Badge variant="measure">
                        {formatFileSize(result.totalSize)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>平均サイズ:</span>
                      <Badge variant="measure">
                        {formatFileSize(result.averageSize)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Largest & Smallest */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-orange-700">
                    🔍 サイズ比較
                  </h3>
                  {result.largestFile && (
                    <div className="p-3 bg-orange-50 rounded">
                      <div className="text-sm font-medium text-orange-700">
                        最大ファイル
                      </div>
                      <div className="text-sm truncate">
                        {result.largestFile.name}
                      </div>
                      <Badge variant="measure" className="mt-1">
                        {formatFileSize(result.largestFile.size)}
                      </Badge>
                    </div>
                  )}
                  {result.smallestFile && (
                    <div className="p-3 bg-orange-50 rounded">
                      <div className="text-sm font-medium text-orange-700">
                        最小ファイル
                      </div>
                      <div className="text-sm truncate">
                        {result.smallestFile.name}
                      </div>
                      <Badge variant="measure" className="mt-1">
                        {formatFileSize(result.smallestFile.size)}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* File Types */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-orange-700">
                    📋 ファイル種別
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(result.fileTypes).map(([type, count]) => (
                      <div key={type} className="flex justify-between">
                        <span className="text-sm">.{type}</span>
                        <Badge variant="outline">{count}件</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Tool Footer */}
        <div className="text-center text-gray-600 mt-8">
          <p className="mb-2">
            🍺 <strong>Brew</strong>からのメッセージ:
          </p>
          <p className="text-sm italic">
            「ファイルサイズ測定工具だ！正確な計測でデータの実態を把握しよう。
            測定は工房作業の基本だからな！📏✨」
          </p>
        </div>
      </div>
    </div>
  );
};
