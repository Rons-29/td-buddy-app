/**
 * CSV詳細機能のエラーハンドリング・バリデーション
 * TestData Buddy (TD) - Enhanced Error Handling
 */

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export class CSVValidationError extends Error {
  constructor(
    message: string,
    public code: string,
    public field?: string
  ) {
    super(message);
    this.name = 'CSVValidationError';
  }
}

export class CSVGenerationError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'CSVGenerationError';
  }
}

/**
 * CSV設定のバリデーション
 */
export class CSVValidator {
  private static readonly MAX_COLUMNS = 50;
  private static readonly MAX_ROWS = 100000;
  private static readonly MAX_COLUMN_NAME_LENGTH = 100;
  private static readonly MIN_COLUMN_NAME_LENGTH = 1;

  /**
   * 列設定の包括的バリデーション
   */
  static validateColumns(columns: any[]): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // 列数チェック
    if (columns.length === 0) {
      errors.push({
        field: 'columns',
        message: '少なくとも1つの列を設定してください',
        code: 'NO_COLUMNS',
        severity: 'error'
      });
    }

    if (columns.length > this.MAX_COLUMNS) {
      errors.push({
        field: 'columns',
        message: `列数は${this.MAX_COLUMNS}個まで設定可能です`,
        code: 'TOO_MANY_COLUMNS',
        severity: 'error'
      });
    }

    // 列名の重複チェック
    const columnNames = columns.map(col => col.name?.toLowerCase());
    const duplicateNames = columnNames.filter((name, index) => 
      name && columnNames.indexOf(name) !== index
    );

    if (duplicateNames.length > 0) {
      errors.push({
        field: 'columnNames',
        message: `列名が重複しています: ${[...new Set(duplicateNames)].join(', ')}`,
        code: 'DUPLICATE_COLUMN_NAMES',
        severity: 'error'
      });
    }

    // 各列の個別バリデーション
    columns.forEach((column, index) => {
      const columnErrors = this.validateSingleColumn(column, index);
      errors.push(...columnErrors.errors);
      warnings.push(...columnErrors.warnings);
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 単一列の詳細バリデーション
   */
  private static validateSingleColumn(column: any, index: number): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    const fieldPrefix = `column[${index}]`;

    // 列名バリデーション
    if (!column.name || typeof column.name !== 'string') {
      errors.push({
        field: `${fieldPrefix}.name`,
        message: `列${index + 1}: 列名は必須です`,
        code: 'MISSING_COLUMN_NAME',
        severity: 'error'
      });
    } else {
      if (column.name.length < this.MIN_COLUMN_NAME_LENGTH) {
        errors.push({
          field: `${fieldPrefix}.name`,
          message: `列${index + 1}: 列名は${this.MIN_COLUMN_NAME_LENGTH}文字以上で入力してください`,
          code: 'COLUMN_NAME_TOO_SHORT',
          severity: 'error'
        });
      }

      if (column.name.length > this.MAX_COLUMN_NAME_LENGTH) {
        errors.push({
          field: `${fieldPrefix}.name`,
          message: `列${index + 1}: 列名は${this.MAX_COLUMN_NAME_LENGTH}文字以下で入力してください`,
          code: 'COLUMN_NAME_TOO_LONG',
          severity: 'error'
        });
      }

      // 特殊文字チェック
      if (!/^[a-zA-Z0-9ぁ-んァ-ン一-龯\s\-_()（）]+$/.test(column.name)) {
        warnings.push({
          field: `${fieldPrefix}.name`,
          message: `列${index + 1}: 列名に特殊文字が含まれています`,
          code: 'SPECIAL_CHARS_IN_NAME',
          severity: 'warning'
        });
      }
    }

    // データ型バリデーション
    if (!column.type) {
      errors.push({
        field: `${fieldPrefix}.type`,
        message: `列${index + 1}: データ型を選択してください`,
        code: 'MISSING_DATA_TYPE',
        severity: 'error'
      });
    }

    // 型別詳細バリデーション
    switch (column.type) {
      case 'number':
        this.validateNumberColumn(column, fieldPrefix, errors, warnings);
        break;
      case 'text':
        this.validateTextColumn(column, fieldPrefix, errors, warnings);
        break;
      case 'date':
        this.validateDateColumn(column, fieldPrefix, errors, warnings);
        break;
      case 'email':
        this.validateEmailColumn(column, fieldPrefix, errors, warnings);
        break;
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * 数値型列のバリデーション
   */
  private static validateNumberColumn(
    column: any, 
    fieldPrefix: string, 
    errors: ValidationError[], 
    warnings: ValidationError[]
  ) {
    const settings = column.settings || {};

    if (settings.min !== undefined && settings.max !== undefined) {
      if (settings.min > settings.max) {
        errors.push({
          field: `${fieldPrefix}.settings`,
          message: '最小値は最大値より小さい値を入力してください',
          code: 'INVALID_NUMBER_RANGE',
          severity: 'error'
        });
      }

      if (settings.max - settings.min > 1000000) {
        warnings.push({
          field: `${fieldPrefix}.settings`,
          message: '数値範囲が大きすぎます。パフォーマンスに影響する可能性があります',
          code: 'LARGE_NUMBER_RANGE',
          severity: 'warning'
        });
      }
    }

    if (settings.decimals !== undefined && settings.decimals > 10) {
      warnings.push({
        field: `${fieldPrefix}.settings`,
        message: '小数点桁数が多すぎます。表示に影響する可能性があります',
        code: 'TOO_MANY_DECIMALS',
        severity: 'warning'
      });
    }
  }

  /**
   * テキスト型列のバリデーション
   */
  private static validateTextColumn(
    column: any, 
    fieldPrefix: string, 
    errors: ValidationError[], 
    warnings: ValidationError[]
  ) {
    const settings = column.settings || {};

    if (settings.minLength !== undefined && settings.maxLength !== undefined) {
      if (settings.minLength > settings.maxLength) {
        errors.push({
          field: `${fieldPrefix}.settings`,
          message: '最小文字数は最大文字数より小さい値を入力してください',
          code: 'INVALID_TEXT_LENGTH_RANGE',
          severity: 'error'
        });
      }

      if (settings.maxLength > 1000) {
        warnings.push({
          field: `${fieldPrefix}.settings`,
          message: 'テキスト長が長すぎます。生成に時間がかかる可能性があります',
          code: 'TEXT_TOO_LONG',
          severity: 'warning'
        });
      }
    }
  }

  /**
   * 日付型列のバリデーション
   */
  private static validateDateColumn(
    column: any, 
    fieldPrefix: string, 
    errors: ValidationError[], 
    warnings: ValidationError[]
  ) {
    const settings = column.settings || {};

    if (settings.startDate && settings.endDate) {
      const start = new Date(settings.startDate);
      const end = new Date(settings.endDate);

      if (start > end) {
        errors.push({
          field: `${fieldPrefix}.settings`,
          message: '開始日は終了日より前の日付を入力してください',
          code: 'INVALID_DATE_RANGE',
          severity: 'error'
        });
      }

      // 100年以上の範囲は警告
      const yearDiff = end.getFullYear() - start.getFullYear();
      if (yearDiff > 100) {
        warnings.push({
          field: `${fieldPrefix}.settings`,
          message: '日付範囲が広すぎます。現実的でないデータが生成される可能性があります',
          code: 'LARGE_DATE_RANGE',
          severity: 'warning'
        });
      }
    }
  }

  /**
   * メール型列のバリデーション
   */
  private static validateEmailColumn(
    column: any, 
    fieldPrefix: string, 
    errors: ValidationError[], 
    warnings: ValidationError[]
  ) {
    const settings = column.settings || {};

    if (settings.domain && !this.isValidDomain(settings.domain)) {
      errors.push({
        field: `${fieldPrefix}.settings`,
        message: '有効なドメイン名を入力してください',
        code: 'INVALID_EMAIL_DOMAIN',
        severity: 'error'
      });
    }
  }

  /**
   * 生成設定のバリデーション
   */
  static validateGenerationSettings(rowCount: number, columns: any[]): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // 行数チェック
    if (rowCount <= 0) {
      errors.push({
        field: 'rowCount',
        message: '生成件数は1以上の値を入力してください',
        code: 'INVALID_ROW_COUNT',
        severity: 'error'
      });
    }

    if (rowCount > this.MAX_ROWS) {
      errors.push({
        field: 'rowCount',
        message: `生成件数は${this.MAX_ROWS.toLocaleString()}件まで設定可能です`,
        code: 'TOO_MANY_ROWS',
        severity: 'error'
      });
    }

    // パフォーマンス警告
    const estimatedSize = rowCount * columns.length * 50; // 概算バイト数
    if (estimatedSize > 50 * 1024 * 1024) { // 50MB
      warnings.push({
        field: 'performance',
        message: 'データサイズが大きくなります。生成に時間がかかる可能性があります',
        code: 'LARGE_DATA_SIZE',
        severity: 'warning'
      });
    }

    if (rowCount > 10000) {
      warnings.push({
        field: 'rowCount',
        message: '大量データの生成です。ブラウザのメモリ使用量にご注意ください',
        code: 'LARGE_ROW_COUNT',
        severity: 'warning'
      });
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * ドメイン名の妥当性チェック
   */
  private static isValidDomain(domain: string): boolean {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  }
}

/**
 * エラーメッセージのローカライゼーション
 */
export class ErrorMessageLocalizer {
  private static readonly messages = {
    // 一般的なエラー
    VALIDATION_FAILED: 'バリデーションに失敗しました',
    GENERATION_FAILED: 'データ生成に失敗しました',
    
    // 列関連
    NO_COLUMNS: '列が設定されていません',
    TOO_MANY_COLUMNS: '列数が制限を超えています',
    DUPLICATE_COLUMN_NAMES: '列名が重複しています',
    MISSING_COLUMN_NAME: '列名が入力されていません',
    COLUMN_NAME_TOO_SHORT: '列名が短すぎます',
    COLUMN_NAME_TOO_LONG: '列名が長すぎます',
    SPECIAL_CHARS_IN_NAME: '列名に特殊文字が含まれています',
    MISSING_DATA_TYPE: 'データ型が選択されていません',
    
    // 数値関連
    INVALID_NUMBER_RANGE: '数値範囲の設定が無効です',
    LARGE_NUMBER_RANGE: '数値範囲が大きすぎます',
    TOO_MANY_DECIMALS: '小数点桁数が多すぎます',
    
    // テキスト関連
    INVALID_TEXT_LENGTH_RANGE: 'テキスト長の設定が無効です',
    TEXT_TOO_LONG: 'テキスト長が長すぎます',
    
    // 日付関連
    INVALID_DATE_RANGE: '日付範囲の設定が無効です',
    LARGE_DATE_RANGE: '日付範囲が広すぎます',
    
    // メール関連
    INVALID_EMAIL_DOMAIN: 'メールドメインが無効です',
    
    // 生成関連
    INVALID_ROW_COUNT: '生成件数が無効です',
    TOO_MANY_ROWS: '生成件数が制限を超えています',
    LARGE_DATA_SIZE: 'データサイズが大きすぎます',
    LARGE_ROW_COUNT: '生成件数が多すぎます',
    
    // パフォーマンス関連
    MEMORY_WARNING: 'メモリ使用量が増加する可能性があります',
    PERFORMANCE_WARNING: 'パフォーマンスに影響する可能性があります'
  };

  static getMessage(code: string, fallback?: string): string {
    return this.messages[code as keyof typeof this.messages] || fallback || `不明なエラー: ${code}`;
  }

  static getLocalizedErrors(errors: ValidationError[]): ValidationError[] {
    return errors.map(error => ({
      ...error,
      message: this.getMessage(error.code, error.message)
    }));
  }
}

/**
 * TDスタイルのエラーハンドリング
 */
export class TDErrorHandler {
  /**
   * TDキャラクター付きエラーメッセージ
   */
  static formatTDError(error: ValidationError): string {
    const messages = {
      error: '🚨 TDからの重要な警告',
      warning: '⚠️ TDからの注意事項',
      info: '💡 TDからのアドバイス'
    };

    const prefix = messages[error.severity];
    return `${prefix}: ${error.message}`;
  }

  /**
   * TDキャラクター付き成功メッセージ
   */
  static formatSuccessMessage(message: string): string {
    return `✅ TDからのメッセージ: ${message}`;
  }

  /**
   * 複数エラーの整理表示
   */
  static summarizeErrors(result: ValidationResult): string {
    if (result.isValid) {
      return this.formatSuccessMessage('すべての設定が正常です！');
    }

    const errorCount = result.errors.length;
    const warningCount = result.warnings.length;

    let summary = '';
    if (errorCount > 0) {
      summary += `🚨 ${errorCount}件のエラーがあります\n`;
    }
    if (warningCount > 0) {
      summary += `⚠️ ${warningCount}件の警告があります\n`;
    }

    summary += '\n詳細を確認して設定を修正してください。';
    return summary;
  }

  /**
   * ユーザーフレンドリーなエラー解決提案
   */
  static suggestSolution(error: ValidationError): string {
    const solutions = {
      NO_COLUMNS: '「列を追加」ボタンをクリックして、最初の列を追加してください。',
      DUPLICATE_COLUMN_NAMES: '重複している列名を変更してください。例：「名前」→「名前1」「名前2」',
      INVALID_NUMBER_RANGE: '最小値と最大値を確認してください。最小値 < 最大値となるように設定してください。',
      TOO_MANY_COLUMNS: `列数を${CSVValidator['MAX_COLUMNS']}個以下に減らしてください。`,
      TOO_MANY_ROWS: `生成件数を${CSVValidator['MAX_ROWS'].toLocaleString()}件以下に減らしてください。`,
      LARGE_DATA_SIZE: '生成件数または列数を減らすことをお勧めします。',
      INVALID_DATE_RANGE: '開始日が終了日より前になるように設定してください。'
    };

    const solution = solutions[error.code as keyof typeof solutions];
    return solution ? `💡 TDからの解決策: ${solution}` : '';
  }
}

/**
 * パフォーマンス監視
 */
export class PerformanceMonitor {
  private static startTime: number;

  static startGeneration(): void {
    this.startTime = performance.now();
  }

  static endGeneration(rowCount: number, columnCount: number): {
    duration: number;
    rowsPerSecond: number;
    recommendation: string;
  } {
    const endTime = performance.now();
    const duration = endTime - this.startTime;
    const rowsPerSecond = Math.round((rowCount * 1000) / duration);

    let recommendation = '';
    if (duration > 30000) { // 30秒以上
      recommendation = 'TDからの提案: 生成に時間がかかっています。件数を減らすことをお勧めします。';
    } else if (duration > 10000) { // 10秒以上
      recommendation = 'TDからの提案: 少し時間がかかりました。大量データの場合は分割生成をお勧めします。';
    } else {
      recommendation = 'TDからのメッセージ: 高速生成完了！素晴らしいパフォーマンスです♪';
    }

    return {
      duration: Math.round(duration),
      rowsPerSecond,
      recommendation
    };
  }
} 