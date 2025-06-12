/**
 * CSV ファイルインポート機能
 * TestData Buddy (TD) - CSV Import & Configuration Detection
 */

import {
  ColumnConfig,
  CsvConfig,
  DataTypeCategory,
} from '../types/csvDataTypes';

export interface ImportResult {
  success: boolean;
  config?: CsvConfig;
  error?: string;
  warnings?: string[];
  previewData?: string[][];
}

export interface DetectionStats {
  totalRows: number;
  sampleSize: number;
  confidence: number;
}

/**
 * CSV ファイルインポート＆設定自動推測クラス
 */
export class CSVImporter {
  private static readonly MAX_PREVIEW_ROWS = 10;
  private static readonly SAMPLE_SIZE_FOR_DETECTION = 100;

  /**
   * CSVファイルをインポートして設定を自動推測
   */
  static async importCSV(file: File): Promise<ImportResult> {
    try {
      // ファイルサイズチェック
      if (file.size > 100 * 1024 * 1024) {
        // 100MB制限
        return {
          success: false,
          error: 'ファイルサイズが大きすぎます（100MB以下にしてください）',
        };
      }

      // ファイル内容読み込み
      const content = await this.readFileContent(file);

      // CSV解析
      const { rows, warnings } = this.parseCSV(content);

      if (rows.length === 0) {
        return {
          success: false,
          error: 'CSVファイルにデータが含まれていません',
        };
      }

      // ヘッダー行の検出
      const hasHeader = this.detectHeader(rows);
      const headers = hasHeader
        ? rows[0]
        : this.generateDefaultHeaders(rows[0].length);
      const dataRows = hasHeader ? rows.slice(1) : rows;

      // 列設定の自動推測
      const columns = this.detectColumnTypes(headers, dataRows);

      // プレビューデータの準備
      const previewData = [
        headers,
        ...dataRows.slice(0, this.MAX_PREVIEW_ROWS),
      ];

      const config: CsvConfig = {
        columns,
        rowCount: Math.min(1000, dataRows.length), // デフォルト生成件数
        outputFormat: 'csv', // デフォルト出力形式
        includeHeader: true, // ヘッダー含める
        encoding: 'utf-8', // デフォルトエンコーディング
      };

      return {
        success: true,
        config,
        warnings,
        previewData,
      };
    } catch (error) {
      return {
        success: false,
        error: `ファイル読み込みエラー: ${
          error instanceof Error ? error.message : '不明なエラー'
        }`,
      };
    }
  }

  /**
   * ファイル内容をテキストとして読み込み
   */
  private static readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = event => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('ファイル読み込みに失敗しました'));
        }
      };

      reader.onerror = () => {
        reject(new Error('ファイル読み込み中にエラーが発生しました'));
      };

      // UTF-8で読み込み（日本語対応）
      reader.readAsText(file, 'UTF-8');
    });
  }

  /**
   * CSV文字列を行配列に解析
   */
  private static parseCSV(content: string): {
    rows: string[][];
    warnings: string[];
  } {
    const warnings: string[] = [];
    const rows: string[][] = [];

    // 改行コードの統一
    const normalizedContent = content
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n');
    const lines = normalizedContent.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // 空行スキップ
      if (!line) continue;

      try {
        const row = this.parseCSVRow(line);
        if (row.length > 0) {
          rows.push(row);
        }
      } catch (error) {
        warnings.push(
          `行 ${i + 1}: CSV解析エラー - ${
            error instanceof Error ? error.message : '不明なエラー'
          }`
        );
      }
    }

    // 列数の一貫性チェック
    if (rows.length > 1) {
      const expectedColumns = rows[0].length;
      const inconsistentRows = rows.filter(
        (row, index) => row.length !== expectedColumns
      ).length;

      if (inconsistentRows > 0) {
        warnings.push(
          `${inconsistentRows}行で列数が一致しません。期待値: ${expectedColumns}列`
        );
      }
    }

    return { rows, warnings };
  }

  /**
   * CSV行の解析（クォート・エスケープ対応）
   */
  private static parseCSVRow(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // エスケープされたクォート
          current += '"';
          i += 2;
        } else {
          // クォートの開始/終了
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === ',' && !inQuotes) {
        // 列の区切り
        result.push(current.trim());
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }

    // 最後の列を追加
    result.push(current.trim());

    return result;
  }

  /**
   * ヘッダー行の存在を推測
   */
  private static detectHeader(rows: string[][]): boolean {
    if (rows.length < 2) return true;

    const firstRow = rows[0];
    const secondRow = rows[1];

    // 第1行が数値のみの場合、ヘッダーでない可能性が高い
    const firstRowAllNumbers = firstRow.every(
      cell => !isNaN(Number(cell)) && cell.trim() !== ''
    );

    // 第2行も考慮
    const secondRowAllNumbers = secondRow.every(
      cell => !isNaN(Number(cell)) && cell.trim() !== ''
    );

    // 第1行が数値で第2行も数値なら、ヘッダーなしと判断
    if (firstRowAllNumbers && secondRowAllNumbers) {
      return false;
    }

    // 第1行に日本語が含まれていればヘッダーの可能性が高い
    const hasJapanese = firstRow.some(cell =>
      /[ひらがなカタカナ漢字]/.test(cell)
    );

    return hasJapanese || !firstRowAllNumbers;
  }

  /**
   * デフォルトヘッダーの生成
   */
  private static generateDefaultHeaders(columnCount: number): string[] {
    return Array.from({ length: columnCount }, (_, i) => `列${i + 1}`);
  }

  /**
   * 列のデータ型を自動推測
   */
  private static detectColumnTypes(
    headers: string[],
    dataRows: string[][]
  ): ColumnConfig[] {
    const columns: ColumnConfig[] = [];

    for (let colIndex = 0; colIndex < headers.length; colIndex++) {
      const columnName = headers[colIndex] || `列${colIndex + 1}`;
      const sampleData = dataRows
        .slice(0, this.SAMPLE_SIZE_FOR_DETECTION)
        .map(row => row[colIndex] || '')
        .filter(cell => cell.trim() !== '');

      const detectedType = this.detectDataType(columnName, sampleData);
      const settings = this.generateTypeSettings(detectedType, sampleData);

      columns.push({
        name: columnName,
        dataType: detectedType,
        settings,
      });
    }

    return columns;
  }

  /**
   * 単一列のデータ型推測
   */
  private static detectDataType(
    columnName: string,
    sampleData: string[]
  ): DataTypeCategory {
    if (sampleData.length === 0) return 'text';

    // 列名による推測
    const nameBasedType = this.detectTypeByName(columnName);
    if (nameBasedType) return nameBasedType;

    // データ内容による推測
    return this.detectTypeByContent(sampleData);
  }

  /**
   * 列名による型推測
   */
  private static detectTypeByName(columnName: string): DataTypeCategory | null {
    const name = columnName.toLowerCase().replace(/\s/g, '');

    // 日本語列名パターン
    const patterns: Record<string, DataTypeCategory> = {
      // 名前系
      名前: 'name',
      氏名: 'name',
      社員名: 'name',
      顧客名: 'name',
      name: 'name',
      fullname: 'name',
      username: 'name',

      // メール系
      メール: 'email',
      メールアドレス: 'email',
      email: 'email',
      mail: 'email',
      emailaddress: 'email',

      // 電話系
      電話: 'phone',
      電話番号: 'phone',
      tel: 'phone',
      phone: 'phone',
      telephone: 'phone',

      // 年齢系
      年齢: 'age',
      age: 'age',
      歳: 'age',

      // 日付系
      日付: 'date',
      年月日: 'date',
      登録日: 'date',
      作成日: 'date',
      date: 'date',
      created: 'date',
      updated: 'date',

      // 数値系（価格・金額）
      価格: 'number',
      金額: 'number',
      料金: 'number',
      price: 'number',
      amount: 'number',
      cost: 'number',
    };

    for (const [pattern, type] of Object.entries(patterns)) {
      if (name.includes(pattern)) {
        return type;
      }
    }

    return null;
  }

  /**
   * データ内容による型推測
   */
  private static detectTypeByContent(sampleData: string[]): DataTypeCategory {
    const totalSamples = sampleData.length;
    let numberCount = 0;
    let dateCount = 0;
    let emailCount = 0;
    let phoneCount = 0;
    let japaneseNameCount = 0;

    for (const cell of sampleData) {
      const trimmed = cell.trim();

      // 数値チェック
      if (/^\d+(\.\d+)?$/.test(trimmed)) {
        numberCount++;
      }

      // 日付チェック
      if (this.isDateLike(trimmed)) {
        dateCount++;
      }

      // メールチェック
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        emailCount++;
      }

      // 電話番号チェック
      if (/^(\d{2,4}-\d{2,4}-\d{4}|\d{10,11})$/.test(trimmed)) {
        phoneCount++;
      }

      // 日本語名前チェック
      if (this.isJapaneseName(trimmed)) {
        japaneseNameCount++;
      }
    }

    // 信頼度（80%以上で判定）
    const threshold = Math.max(1, Math.floor(totalSamples * 0.8));

    if (emailCount >= threshold) return 'email';
    if (phoneCount >= threshold) return 'phone';
    if (dateCount >= threshold) return 'date';
    if (japaneseNameCount >= threshold) return 'name';
    if (numberCount >= threshold) return 'number';

    return 'text';
  }

  /**
   * 日付らしい文字列かチェック
   */
  private static isDateLike(value: string): boolean {
    const datePatterns = [
      /^\d{4}-\d{1,2}-\d{1,2}$/, // YYYY-MM-DD
      /^\d{4}\/\d{1,2}\/\d{1,2}$/, // YYYY/MM/DD
      /^\d{1,2}\/\d{1,2}\/\d{4}$/, // MM/DD/YYYY
      /^\d{4}年\d{1,2}月\d{1,2}日$/, // YYYY年MM月DD日
    ];

    return (
      datePatterns.some(pattern => pattern.test(value)) &&
      !isNaN(Date.parse(value))
    );
  }

  /**
   * 日本語名前らしい文字列かチェック
   */
  private static isJapaneseName(value: string): boolean {
    // 日本語文字を含み、スペースで区切られている
    return (
      /^[ぁ-んァ-ン一-龯\s]+$/.test(value) &&
      value.includes(' ') &&
      value.length >= 3 &&
      value.length <= 20
    );
  }

  /**
   * 検出された型に基づいて設定を生成
   */
  private static generateTypeSettings(
    type: DataTypeCategory,
    sampleData: string[]
  ): any {
    switch (type) {
      case 'number':
        return this.generateNumberSettings(sampleData);
      case 'text':
        return this.generateTextSettings(sampleData);
      case 'date':
        return this.generateDateSettings(sampleData);
      default:
        return {};
    }
  }

  /**
   * 数値型の設定生成
   */
  private static generateNumberSettings(sampleData: string[]): any {
    const numbers = sampleData
      .map(cell => Number(cell))
      .filter(num => !isNaN(num));

    if (numbers.length === 0) {
      return { min: 1, max: 100 };
    }

    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const hasDecimals = numbers.some(num => num % 1 !== 0);

    return {
      min: Math.floor(min),
      max: Math.ceil(max),
      decimals: hasDecimals ? 2 : 0,
    };
  }

  /**
   * テキスト型の設定生成
   */
  private static generateTextSettings(sampleData: string[]): any {
    const lengths = sampleData.map(cell => cell.length);
    const hasJapanese = sampleData.some(cell =>
      /[ひらがなカタカナ漢字]/.test(cell)
    );

    return {
      language: hasJapanese ? 'ja' : 'en',
      minLength: Math.min(...lengths, 5),
      maxLength: Math.max(...lengths, 50),
    };
  }

  /**
   * 日付型の設定生成
   */
  private static generateDateSettings(sampleData: string[]): any {
    const dates = sampleData
      .map(cell => new Date(cell))
      .filter(date => !isNaN(date.getTime()));

    if (dates.length === 0) {
      return {
        startDate: '2020-01-01',
        endDate: '2025-12-31',
      };
    }

    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

    return {
      startDate: minDate.toISOString().split('T')[0],
      endDate: maxDate.toISOString().split('T')[0],
    };
  }
}

/**
 * TDスタイルのインポート支援メッセージ
 */
export class TDImportHelper {
  /**
   * インポート結果の要約メッセージ
   */
  static summarizeImport(result: ImportResult): string {
    if (!result.success) {
      return `🚨 TDからの警告: インポートに失敗しました\n${result.error}`;
    }

    const config = result.config!;
    const columnCount = config.columns.length;
    const detectedTypes = config.columns.reduce((acc, col) => {
      acc[col.dataType] = (acc[col.dataType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let message = `✅ TDからのメッセージ: CSVインポート完了！\n\n`;
    message += `📊 検出結果:\n`;
    message += `- 列数: ${columnCount}列\n`;

    Object.entries(detectedTypes).forEach(([type, count]) => {
      const typeName = this.getTypeName(type as DataTypeCategory);
      message += `- ${typeName}: ${count}列\n`;
    });

    if (result.warnings && result.warnings.length > 0) {
      message += `\n⚠️ 注意事項:\n`;
      result.warnings.forEach(warning => {
        message += `- ${warning}\n`;
      });
    }

    message += `\n💡 TDからのアドバイス: 設定を確認して、必要に応じて調整してください♪`;
    return message;
  }

  /**
   * データ型の日本語名取得
   */
  private static getTypeName(type: DataTypeCategory): string {
    const typeNames: Record<DataTypeCategory, string> = {
      text: 'テキスト',
      number: '数値',
      name: '名前',
      email: 'メールアドレス',
      phone: '電話番号',
      date: '日付',
      age: '年齢',
    };

    return typeNames[type] || type;
  }

  /**
   * 推奨設定の提案
   */
  static suggestOptimizations(config: CsvConfig): string[] {
    const suggestions: string[] = [];

    // 列数チェック
    if (config.columns.length > 20) {
      suggestions.push('📋 列数が多いため、生成に時間がかかる可能性があります');
    }

    // 数値列の範囲チェック
    config.columns.forEach((col, index) => {
      if (col.dataType === 'number' && col.settings) {
        const range = col.settings.max - col.settings.min;
        if (range > 1000000) {
          suggestions.push(`🔢 "${col.name}"列の数値範囲が大きすぎます`);
        }
      }
    });

    // テキスト列の長さチェック
    const longTextColumns = config.columns.filter(
      col => col.dataType === 'text' && col.settings?.maxLength > 100
    );

    if (longTextColumns.length > 0) {
      suggestions.push('📝 一部のテキスト列の最大長が長く設定されています');
    }

    if (suggestions.length === 0) {
      suggestions.push('✨ TDからのメッセージ: 設定は最適化されています！');
    }

    return suggestions;
  }
}
