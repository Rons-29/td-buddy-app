// File Generator Types
// ファイル容量テスト用のファイル生成機能の型定義

export interface FileGeneratorRequest {
  filename: string;
  extension: string;
  sizeInBytes: number;
  sizeUnit: 'B' | 'KB' | 'MB' | 'GB';
  contentType: FileContentType;
  options?: FileGeneratorOptions;
}

export interface FileGeneratorOptions {
  // テキストファイル用オプション
  textOptions?: {
    encoding: 'utf8' | 'ascii' | 'latin1';
    lineEnding: 'LF' | 'CRLF';
    language: 'japanese' | 'english' | 'random';
  };
  
  // 画像ファイル用オプション
  imageOptions?: {
    width: number;
    height: number;
    backgroundColor: string;
    pattern: 'solid' | 'gradient' | 'noise' | 'checkerboard';
  };
  
  // 構造化データ用オプション
  structuredOptions?: {
    recordCount: number;
    fieldCount: number;
    dataTypes: ('string' | 'number' | 'boolean' | 'date')[];
  };
  
  // 圧縮ファイル用オプション
  compressionOptions?: {
    level: number; // 0-9
    method: 'deflate' | 'gzip' | 'brotli';
  };
}

export type FileContentType = 
  | 'text'           // テキストファイル
  | 'structured'     // JSON, CSV, XML, YAML
  | 'binary'         // バイナリファイル
  | 'image'          // ダミー画像
  | 'audio'          // ダミー音声
  | 'video'          // ダミー動画
  | 'document'       // ダミー文書
  | 'compressed'     // 圧縮ファイル
  | 'code'           // プログラムコード
  | 'database';      // データベースファイル

export interface FileGeneratorResponse {
  success: boolean;
  filename: string;
  filePath: string;
  actualSize: number;
  expectedSize: number;
  sizeMatch: boolean;
  downloadUrl: string;
  metadata: FileMetadata;
  message: string;
}

export interface FileMetadata {
  extension: string;
  mimeType: string;
  contentType: FileContentType;
  createdAt: string;
  expiresAt: string;
  checksum: string;
  sizeInBytes: number;
  humanReadableSize: string;
}

export interface FileSizeConfig {
  value: number;
  unit: 'B' | 'KB' | 'MB' | 'GB';
  bytes: number;
  humanReadable: string;
}

export interface SupportedFileType {
  extension: string;
  mimeType: string;
  contentType: FileContentType;
  description: string;
  maxSize: number; // bytes
  defaultOptions?: Partial<FileGeneratorOptions>;
}

// クイック選択用のプリセット
export interface FileSizePreset {
  name: string;
  size: FileSizeConfig;
  description: string;
  useCase: string;
}

// 生成統計
export interface FileGenerationStats {
  totalFilesGenerated: number;
  totalSizeGenerated: number;
  averageGenerationTime: number;
  popularExtensions: { extension: string; count: number }[];
  popularSizes: { size: string; count: number }[];
}

// エラー型
export interface FileGeneratorError {
  code: string;
  message: string;
  details?: any;
}

// バリデーション結果
export interface FileGeneratorValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// 定数
export const FILE_SIZE_LIMITS = {
  MIN_SIZE: 1, // 1 byte
  MAX_SIZE: 1024 * 1024 * 1024, // 1GB
  DEFAULT_SIZE: 1024 * 1024, // 1MB
} as const;

export const SIZE_UNITS = {
  B: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
} as const;

export const SUPPORTED_EXTENSIONS = [
  // テキスト系
  'txt', 'log', 'md', 'rtf',
  // 構造化データ
  'json', 'csv', 'xml', 'yaml', 'yml',
  // 画像系
  'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg',
  // 音声系
  'mp3', 'wav', 'flac', 'ogg',
  // 動画系
  'mp4', 'avi', 'mov', 'wmv', 'flv',
  // 文書系
  'pdf', 'docx', 'xlsx', 'pptx',
  // 圧縮系
  'zip', 'tar', 'gz', 'rar',
  // プログラム系
  'js', 'ts', 'py', 'java', 'cpp', 'c', 'php', 'rb', 'go',
  // データベース系
  'sql', 'db', 'sqlite',
] as const;

export type SupportedExtension = typeof SUPPORTED_EXTENSIONS[number]; 