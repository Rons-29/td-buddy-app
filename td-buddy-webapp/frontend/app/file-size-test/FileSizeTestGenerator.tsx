'use client';

import { useCallback, useMemo, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card';
import { AOZORA_BUNKO_SAMPLES } from '../../data/aozora-bunko-samples';
import {
  calculateExactSizeInBytes,
  generateRealFile,
  SIZE_UNITS,
  type SizeUnit,
} from '../../utils/fileGenerators';

// TD キャラクター メッセージ
const TDMessages = {
  welcome: '🤖 TDです！実際に使用可能なファイルを厳密なサイズで生成します！',
  generating: '📝 青空文庫テキストを使って実用的なファイルを作成中...',
  success: '✅ 完璧！実際に開けるファイルが生成できました♪',
  error: '😅 申し訳ございません。再試行をお願いします。',
  bigFileWarning: '⚠️ 大きなファイルです。生成に時間がかかる場合があります。',
  binaryInfo: '🔧 このファイルは実際に対応アプリで開くことができます！',
  aozoraInfo: '📚 青空文庫の名作を活用したリアルなテストデータです。',
  strictSize: '📏 1MB = 1024KB として厳密に計算しています。',
};

// ファイル形式設定（実際に使用可能なもの）
const FILE_FORMATS = [
  {
    id: 'txt',
    name: 'テキストファイル (.txt)',
    description: '青空文庫作品ベースのテキスト',
    category: 'text',
  },
  {
    id: 'json',
    name: 'JSONファイル (.json)',
    description: '構造化された青空文庫データ',
    category: 'text',
  },
  {
    id: 'csv',
    name: 'CSVファイル (.csv)',
    description: '行別データとして整理',
    category: 'text',
  },
  {
    id: 'xml',
    name: 'XMLファイル (.xml)',
    description: 'XML形式の文学データ',
    category: 'text',
  },
  {
    id: 'yaml',
    name: 'YAMLファイル (.yaml)',
    description: 'YAML形式の設定ファイル',
    category: 'text',
  },
  {
    id: 'pdf',
    name: 'PDFファイル (.pdf)',
    description: '実際に開けるPDF文書',
    category: 'binary',
  },
  {
    id: 'png',
    name: 'PNG画像 (.png)',
    description: '実際に表示できるPNG画像',
    category: 'binary',
  },
  {
    id: 'jpeg',
    name: 'JPEG画像 (.jpg)',
    description: '実際に表示できるJPEG画像',
    category: 'binary',
  },
  {
    id: 'zip',
    name: 'ZIPファイル (.zip)',
    description: '実際に展開できるZIPアーカイブ',
    category: 'binary',
  },
];

interface GeneratedFile {
  id: string;
  name: string;
  size: number;
  targetSize: number;
  accuracy: number;
  type: string;
  createdAt: Date;
  blob: Blob;
  content?: string;
}

export default function FileSizeTestGenerator() {
  // State管理
  const [fileName, setFileName] = useState('test-file');
  const [fileSize, setFileSize] = useState('1');
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>('MB');
  const [fileFormat, setFileFormat] = useState('txt');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [currentMessage, setCurrentMessage] = useState(TDMessages.welcome);
  const [showContent, setShowContent] = useState<string | null>(null);

  // 計算値
  const targetBytes = useMemo(() => {
    return calculateExactSizeInBytes(fileSize, sizeUnit);
  }, [fileSize, sizeUnit]);

  const selectedFormat = useMemo(() => {
    return FILE_FORMATS.find(f => f.id === fileFormat);
  }, [fileFormat]);

  const isLargeFile = useMemo(() => {
    return targetBytes > 10 * SIZE_UNITS.MB; // 10MB以上
  }, [targetBytes]);

  // ファイル生成処理
  const generateFile = useCallback(async () => {
    if (!fileName.trim()) {
      setCurrentMessage('📝 ファイル名を入力してください。');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setCurrentMessage(
      isLargeFile ? TDMessages.bigFileWarning : TDMessages.generating
    );

    try {
      // プログレス更新
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // ファイル名に拡張子を追加
      const fullFileName = fileName.includes('.')
        ? fileName
        : `${fileName}.${fileFormat}`;

      // 実際のファイル生成
      const result = generateRealFile(fullFileName, fileSize, sizeUnit);

      // 精度計算
      const accuracy =
        (1 - Math.abs(result.actualSize - targetBytes) / targetBytes) * 100;

      const newFile: GeneratedFile = {
        id: Date.now().toString(),
        name: fullFileName,
        size: result.actualSize,
        targetSize: targetBytes,
        accuracy: Math.max(accuracy, 0),
        type: selectedFormat?.name || fileFormat,
        createdAt: new Date(),
        blob: result.blob,
        content: result.content,
      };

      clearInterval(progressInterval);
      setProgress(100);

      setGeneratedFiles(prev => [newFile, ...prev.slice(0, 9)]); // 最新10件まで保持
      setCurrentMessage(TDMessages.success);

      // 青空文庫関連のメッセージ
      if (selectedFormat?.category === 'text') {
        setTimeout(() => setCurrentMessage(TDMessages.aozoraInfo), 2000);
      } else {
        setTimeout(() => setCurrentMessage(TDMessages.binaryInfo), 2000);
      }
    } catch (error) {
      console.error('File generation error:', error);
      setCurrentMessage(TDMessages.error);
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [
    fileName,
    fileSize,
    sizeUnit,
    fileFormat,
    targetBytes,
    selectedFormat,
    isLargeFile,
  ]);

  // ファイルダウンロード
  const downloadFile = useCallback((file: GeneratedFile) => {
    const url = URL.createObjectURL(file.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setCurrentMessage(`📄 ${file.name} をダウンロードしました！`);
  }, []);

  // ファイル内容表示（テキストファイルのみ）
  const toggleContent = useCallback((fileId: string) => {
    setShowContent(prev => (prev === fileId ? null : fileId));
  }, []);

  // サイズフォーマット
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes >= SIZE_UNITS.GB) {
      return `${(bytes / SIZE_UNITS.GB).toFixed(2)} GB`;
    } else if (bytes >= SIZE_UNITS.MB) {
      return `${(bytes / SIZE_UNITS.MB).toFixed(2)} MB`;
    } else if (bytes >= SIZE_UNITS.KB) {
      return `${(bytes / SIZE_UNITS.KB).toFixed(2)} KB`;
    } else {
      return `${bytes} B`;
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          📁 実用ファイル容量テスト
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          実際に使用可能なファイルを厳密なサイズで生成
        </p>
        <div className="flex justify-center items-center gap-4 mb-4">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            1MB = 1024KB 厳密計算
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            青空文庫作品使用
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            実用ファイル生成
          </span>
        </div>
        <div className="max-w-2xl mx-auto p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-center text-blue-800">{currentMessage}</p>
        </div>
      </div>

      {/* 生成設定 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⚙️ ファイル生成設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* ファイル名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ファイル名
              </label>
              <input
                type="text"
                value={fileName}
                onChange={e => setFileName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="test-file"
              />
            </div>

            {/* ファイルサイズ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ファイルサイズ
              </label>
              <input
                type="number"
                value={fileSize}
                onChange={e => setFileSize(e.target.value)}
                min="0.001"
                step="0.001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* サイズ単位 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                単位
              </label>
              <select
                value={sizeUnit}
                onChange={e => setSizeUnit(e.target.value as SizeUnit)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="B">B (バイト)</option>
                <option value="KB">KB (1024B)</option>
                <option value="MB">MB (1024KB)</option>
                <option value="GB">GB (1024MB)</option>
              </select>
            </div>

            {/* ファイル形式 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ファイル形式
              </label>
              <select
                value={fileFormat}
                onChange={e => setFileFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <optgroup label="テキスト形式">
                  {FILE_FORMATS.filter(f => f.category === 'text').map(
                    format => (
                      <option key={format.id} value={format.id}>
                        {format.name}
                      </option>
                    )
                  )}
                </optgroup>
                <optgroup label="バイナリ形式">
                  {FILE_FORMATS.filter(f => f.category === 'binary').map(
                    format => (
                      <option key={format.id} value={format.id}>
                        {format.name}
                      </option>
                    )
                  )}
                </optgroup>
              </select>
            </div>
          </div>

          {/* 詳細情報 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">目標サイズ:</span>{' '}
                {formatFileSize(targetBytes)}
              </div>
              <div>
                <span className="font-medium">形式:</span>{' '}
                {selectedFormat?.description}
              </div>
              <div>
                <span className="font-medium">青空文庫作品数:</span>{' '}
                {AOZORA_BUNKO_SAMPLES.length}作品
              </div>
            </div>
          </div>

          {/* 生成ボタン */}
          <div className="flex justify-center">
            <Button
              onClick={generateFile}
              disabled={isGenerating || !fileName.trim()}
              className="px-8 py-3 text-lg"
            >
              {isGenerating ? '生成中...' : '🚀 ファイル生成'}
            </Button>
          </div>

          {/* プログレスバー */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-600">
                進行状況: {progress}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 生成履歴 */}
      {generatedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>📋 生成ファイル履歴</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                {generatedFiles.length}件
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedFiles.map(file => (
                <div
                  key={file.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{file.name}</h3>
                      <Badge
                        variant={file.accuracy > 99 ? 'secondary' : 'outline'}
                      >
                        精度 {file.accuracy.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {file.content && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleContent(file.id)}
                        >
                          {showContent === file.id ? '隠す' : '内容表示'}
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => downloadFile(file)}
                      >
                        📄 ダウンロード
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">目標:</span>{' '}
                      {formatFileSize(file.targetSize)}
                    </div>
                    <div>
                      <span className="font-medium">実際:</span>{' '}
                      {formatFileSize(file.size)}
                    </div>
                    <div>
                      <span className="font-medium">形式:</span> {file.type}
                    </div>
                    <div>
                      <span className="font-medium">作成:</span>{' '}
                      {file.createdAt.toLocaleString()}
                    </div>
                  </div>

                  {/* ファイル内容表示 */}
                  {showContent === file.id && file.content && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">
                        📄 ファイル内容プレビュー
                      </h4>
                      <pre className="text-sm text-gray-700 max-h-60 overflow-y-auto whitespace-pre-wrap">
                        {file.content.length > 1000
                          ? file.content.substring(0, 1000) +
                            '\n\n... (続きはダウンロードファイルで確認)'
                          : file.content}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 青空文庫情報 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>📚 使用している青空文庫作品</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AOZORA_BUNKO_SAMPLES.map(work => (
              <div
                key={work.id}
                className="border border-gray-200 rounded-lg p-3"
              >
                <h4 className="font-medium text-sm">{work.title}</h4>
                <p className="text-xs text-gray-600 mb-1">{work.author}</p>
                <p className="text-xs text-gray-500">{work.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {TDMessages.strictSize} 📏
              青空文庫の名作をベースに、実際に使用可能なファイルを生成します。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
