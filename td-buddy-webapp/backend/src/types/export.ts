export interface ExportData {
  [key: string]: Record<string, unknown>;
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'xml' | 'yaml' | 'sql';
  filename?: string;
  includeHeaders?: boolean;
  pretty?: boolean;
  encoding?: 'utf8' | 'utf16le' | 'latin1';
  tableName?: string;
  batchSize?: number;
}

export interface ExportResult {
  success: boolean;
  filename: string;
  content: string;
  size: number;
  recordCount: number;
  format: string;
  downloadUrl?: string;
  error?: string;
}

export interface StreamingExportOptions extends ExportOptions {
  onProgress?: ((processed: number, total: number) => void) | undefined;
  chunkSize?: number;
}
