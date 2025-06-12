// Enhanced Export Service - ファイル出力機能強化
// Step 12: JSON/XML/YAML/SQL出力対応

import * as fs 
import * as path 

export interface ExportData {
  [key: string]: Record<string, unknown>;
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'xml' | 'yaml' | 'sql';
  filename?: string;
  includeHeaders?: boolean;
  pretty?: boolean;
  encoding?: 'utf8' | 'utf16le' | 'latin1';
  tableName?: string; // SQL用
  batchSize?: number; // 大量データ処理用
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

export class ExportService {
  private readonly outputDir = './uploads'; // 出力ディレクトリ

  constructor() {
    this.ensureOutputDirectory();
  }

  private async ensureOutputDirectory(): Promise<void> {
    try {
      await fs.access(this.outputDir);
    } catch {
      await fs.mkdir(this.outputDir, { recursive: true });
    }
  }

  /**
   * メインエクスポート関数
   */
  async export(data: ExportData[], options: ExportOptions): Promise<ExportResult> {
    const startTime = Date.now();
    
    try {
      let content: string;
      const recordCount = data.length;

      // データサイズに応じてストリーミング処理を選択
      if (recordCount > 10000 && options.format !== 'json') {
        const streamingOptions: StreamingExportOptions = { ...options, onProgress: undefined };
        return this.streamingExport(data, streamingOptions);
      }

      switch (options.format) {
        case 'csv':
          content = this.generateCSV(data, options);
          break;
        case 'json':
          content = this.generateJSON(data, options);
          break;
        case 'xml':
          content = this.generateXML(data, options);
          break;
        case 'yaml':
          content = this.generateYAML(data, options);
          break;
        case 'sql':
          content = this.generateSQL(data, options);
          break;
        default:
          throw new Error(`Unsupported format: ${options.format}`);
      }

      const filename = this.generateFilename(options);
      const filePath = path.join(this.outputDir, filename);
      
      await fs.writeFile(filePath, content, { encoding: options.encoding || 'utf8' });
      
      const stats = await fs.stat(filePath);
      const processingTime = Date.now() - startTime;

      logger.log(`📊 TD: ${options.format.toUpperCase()}エクスポート完了 - ${recordCount}件 (${processingTime}ms)`);

      return {
        success: true,
        filename,
        content: recordCount > 1000 ? `[${recordCount}件のデータ - ファイルをダウンロードしてください]` : content,
        size: stats.size,
        recordCount,
        format: options.format,
        downloadUrl: `/api/files/download/${filename}`
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown export error';
      logger.error('❌ エクスポートエラー:', error);
      return {
        success: false,
        filename: '',
        content: '',
        size: 0,
        recordCount: 0,
        format: options.format,
        error: errorMessage
      };
    }
  }

  /**
   * 大量データ用ストリーミングエクスポート
   */
  async streamingExport(data: ExportData[], options: StreamingExportOptions): Promise<ExportResult> {
    const filename = this.generateFilename(options);
    const filePath = path.join(this.outputDir, filename);
    const chunkSize = options.chunkSize || 1000;
    
    let fileHandle: fs.FileHandle | undefined;
    
    try {
      fileHandle = await fs.open(filePath, 'w');
      
      // ヘッダー書き込み
      if (options.includeHeaders !== false && data.length > 0 && data[0]) {
        const header = this.generateHeader(data[0], options);
        if (header) {
          await fileHandle.write(header + '\n', undefined, options.encoding || 'utf8');
        }
      }

      // チャンク単位で処理
      for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        const chunkContent = this.generateChunkContent(chunk, options);
        
        await fileHandle.write(chunkContent, undefined, options.encoding || 'utf8');
        
        // プログレス通知
        if (options.onProgress) {
          options.onProgress(Math.min(i + chunkSize, data.length), data.length);
        }
      }

      // フッター書き込み
      const footer = this.generateFooter(options);
      if (footer) {
        await fileHandle.write(footer, undefined, options.encoding || 'utf8');
      }

      await fileHandle.close();
      const stats = await fs.stat(filePath);

      logger.log(`📊 TD: ストリーミング${options.format.toUpperCase()}エクスポート完了 - ${data.length}件`);

      return {
        success: true,
        filename,
        content: `[大量データ: ${data.length}件 - ファイルをダウンロードしてください]`,
        size: stats.size,
        recordCount: data.length,
        format: options.format,
        downloadUrl: `/api/files/download/${filename}`
      };

    } catch (error) {
      if (fileHandle) {
        await fileHandle.close();
      }
      throw error;
    }
  }

  /**
   * CSV生成
   */
  private generateCSV(data: ExportData[], options: ExportOptions): string {
    if (data.length === 0 || !data[0]) return '';

    const headers = Object.keys(data[0]);
    const rows: string[] = [];

    // ヘッダー行
    if (options.includeHeaders !== false) {
      rows.push(headers.map(h => this.escapeCsvField(h)).join(','));
    }

    // データ行
    data.forEach(item => {
      const row = headers.map(header => {
        const value = item[header];
        return this.escapeCsvField(this.formatCsvValue(value));
      }).join(',');
      rows.push(row);
    });

    return rows.join('\n');
  }

  /**
   * JSON生成
   */
  private generateJSON(data: ExportData[], options: ExportOptions): string {
    const jsonData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        recordCount: data.length,
        generatedBy: 'QA Workbench',
        version: '1.0.0'
      },
      data: data
    };

    return options.pretty 
      ? JSON.stringify(jsonData, null, 2)
      : JSON.stringify(jsonData);
  }

  /**
   * XML生成
   */
  private generateXML(data: ExportData[], options: ExportOptions): string {
    const indent = options.pretty ? '  ' : '';
    const newline = options.pretty ? '\n' : '';
    
    // XMLエンコーディングを正しく設定
    const encoding = options.encoding === 'utf8' ? 'UTF-8' : options.encoding?.toUpperCase() || 'UTF-8';
    
    let xml = `<?xml version="1.0" encoding="${encoding}"?>${newline}`;
    xml += `<export>${newline}`;
    xml += `${indent}<metadata>${newline}`;
    xml += `${indent}${indent}<exportedAt>${new Date().toISOString()}</exportedAt>${newline}`;
    xml += `${indent}${indent}<recordCount>${data.length}</recordCount>${newline}`;
    xml += `${indent}${indent}<generatedBy>QA Workbench</generatedBy>${newline}`;
    xml += `${indent}</metadata>${newline}`;
    xml += `${indent}<data>${newline}`;

    data.forEach(item => {
      xml += `${indent}${indent}<record>${newline}`;
      Object.entries(item).forEach(([key, value]) => {
        const safeKey = this.sanitizeXmlTag(key);
        const safeValue = this.escapeXmlValue(value);
        xml += `${indent}${indent}${indent}<${safeKey}>${safeValue}</${safeKey}>${newline}`;
      });
      xml += `${indent}${indent}</record>${newline}`;
    });

    xml += `${indent}</data>${newline}`;
    xml += `</export>`;

    return xml;
  }

  /**
   * YAML生成
   */
  private generateYAML(data: ExportData[], options: ExportOptions): string {
    const indent = '  ';
    
    let yaml = `# QA Workbench Export\n`;
    yaml += `# Generated at: ${new Date().toISOString()}\n\n`;
    yaml += `metadata:\n`;
    yaml += `${indent}exportedAt: "${new Date().toISOString()}"\n`;
    yaml += `${indent}recordCount: ${data.length}\n`;
    yaml += `${indent}generatedBy: "QA Workbench"\n`;
    yaml += `${indent}version: "1.0.0"\n\n`;
    yaml += `data:\n`;

    data.forEach((item, index) => {
      yaml += `${indent}- # Record ${index + 1}\n`;
      Object.entries(item).forEach(([key, value]) => {
        const yamlValue = this.formatYamlValue(value);
        yaml += `${indent}${indent}${key}: ${yamlValue}\n`;
      });
    });

    return yaml;
  }

  /**
   * SQL INSERT文生成
   */
  private generateSQL(data: ExportData[], options: ExportOptions): string {
    if (data.length === 0 || !data[0]) return '';

    const tableName = options.tableName || 'test_data';
    const headers = Object.keys(data[0]);
    
    let sql = `-- QA Workbench SQL Export\n`;
    sql += `-- Generated at: ${new Date().toISOString()}\n`;
    sql += `-- Records: ${data.length}\n\n`;

    // テーブル作成文（オプション）
    if (options.includeHeaders !== false) {
      sql += `-- Table structure for ${tableName}\n`;
      sql += `CREATE TABLE IF NOT EXISTS \`${tableName}\` (\n`;
      headers.forEach((header, index) => {
        const sqlType = this.inferSqlType(data, header);
        sql += `  \`${header}\` ${sqlType}`;
        if (index < headers.length - 1) sql += ',';
        sql += '\n';
      });
      sql += `);\n\n`;
    }

    // INSERT文生成
    const batchSize = options.batchSize || 100;
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      
      sql += `-- Batch ${Math.floor(i / batchSize) + 1}\n`;
      sql += `INSERT INTO \`${tableName}\` (\`${headers.join('`, `')}\`) VALUES\n`;
      
      batch.forEach((item, batchIndex) => {
        const values = headers.map(header => this.formatSqlValue(item[header]));
        sql += `  (${values.join(', ')})`;
        
        if (batchIndex < batch.length - 1) {
          sql += ',';
        } else if (i + batch.length < data.length) {
          sql += ';';
        } else {
          sql += ';';
        }
        sql += '\n';
      });
      
      sql += '\n';
    }

    return sql;
  }

  // ヘルパーメソッド
  private generateFilename(options: ExportOptions): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const baseName = options.filename || `export_${timestamp}`;
    return `${baseName}.${options.format}`;
  }

  private generateHeader(sample: ExportData, options: ExportOptions): string | null {
    switch (options.format) {
      case 'csv':
        return options.includeHeaders !== false 
          ? Object.keys(sample).map(h => this.escapeCsvField(h)).join(',')
          : null;
      case 'xml':
        return `<?xml version="1.0" encoding="${options.encoding || 'UTF-8'}"?>\n<export>\n<data>`;
      case 'yaml':
        return `# QA Workbench Export\ndata:`;
      default:
        return null;
    }
  }

  private generateChunkContent(chunk: ExportData[], options: ExportOptions): string {
    switch (options.format) {
      case 'csv':
        return chunk.map(item => 
          Object.values(item).map(v => this.escapeCsvField(this.formatCsvValue(v))).join(',')
        ).join('\n') + '\n';
      case 'xml':
        return chunk.map(item => {
          let xml = '  <record>\n';
          Object.entries(item).forEach(([key, value]) => {
            xml += `    <${this.sanitizeXmlTag(key)}>${this.escapeXmlValue(value)}</${this.sanitizeXmlTag(key)}>\n`;
          });
          xml += '  </record>\n';
          return xml;
        }).join('');
      default:
        return '';
    }
  }

  private generateFooter(options: ExportOptions): string | null {
    switch (options.format) {
      case 'xml':
        return '</data>\n</export>';
      default:
        return null;
    }
  }

  // フォーマット用ヘルパー
  private escapeCsvField(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  private formatCsvValue(value: Record<string, unknown>): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  private sanitizeXmlTag(tag: string): string {
    return tag.replace(/[^a-zA-Z0-9_-]/g, '_');
  }

  private escapeXmlValue(value: Record<string, unknown>): string {
    if (value === null || value === undefined) return '';
    const str = typeof value === 'object' ? JSON.stringify(value) : String(value);
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private formatYamlValue(value: Record<string, unknown>): string {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'string') {
      // 特殊文字を含む場合はクォート
      if (value.includes('\n') || value.includes('"') || value.includes(':')) {
        return `"${value.replace(/"/g, '\\"')}"`;
      }
      return value;
    }
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  private formatSqlValue(value: Record<string, unknown>): string {
    if (value === null || value === undefined) return 'NULL';
    if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
    if (typeof value === 'object') return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
    return String(value);
  }

  private inferSqlType(data: ExportData[], field: string): string {
    const sample = data.slice(0, 100); // 最初の100件で型推定
    const values = sample.map(item => item[field]).filter(v => v !== null && v !== undefined);
    
    if (values.length === 0) return 'TEXT';
    
    const types = values.map(v => typeof v);
    
    if (types.every(t => t === 'number')) {
      const hasFloat = values.some(v => !Number.isInteger(v));
      return hasFloat ? 'DECIMAL(10,2)' : 'INTEGER';
    }
    
    if (types.every(t => t === 'boolean')) return 'BOOLEAN';
    
    // 文字列の場合、最大長を調べる
    const maxLength = Math.max(...values.map(v => String(v).length));
    if (maxLength <= 255) return `VARCHAR(${Math.max(maxLength, 50)})`;
    
    return 'TEXT';
  }
} 
