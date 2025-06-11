/**
 * CSV詳細データ生成機能のテストスイート
 * TestData Buddy (TD) - Comprehensive Testing
 */

import { describe, expect, test } from 'vitest';
import { CsvConfig, DataTypeCategory } from '../types/csvDataTypes';
import { generateData } from '../utils/csvDataGenerator';
import {
    CSVValidator,
    PerformanceMonitor,
    TDErrorHandler,
    ValidationError,
    ValidationResult
} from '../utils/csvErrorHandling';

describe('CSV詳細データ生成機能', () => {
  describe('データ生成テスト', () => {
    test('日本語名前の生成', () => {
      const result = generateData('name', {});
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result.includes(' ')).toBe(true); // 姓と名の間のスペース
    });

    test('英語テキストの生成', () => {
      const result = generateData('text', { language: 'en' });
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(/^[a-zA-Z\s]+$/.test(result)).toBe(true);
    });

    test('日本語テキストの生成', () => {
      const result = generateData('text', { language: 'ja' });
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(/[ひらがなカタカナ漢字]/.test(result)).toBe(true);
    });

    test('数値の範囲指定生成', () => {
      const result = generateData('number', { min: 10, max: 20 });
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(10);
      expect(result).toBeLessThanOrEqual(20);
    });

    test('電話番号の形式', () => {
      const result = generateData('phone', {});
      expect(typeof result).toBe('string');
      expect(/^(090|080|070)-\d{4}-\d{4}$/.test(result)).toBe(true);
    });

    test('メールアドレスの形式', () => {
      const result = generateData('email', {});
      expect(typeof result).toBe('string');
      expect(result.includes('@')).toBe(true);
      expect(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)).toBe(true);
    });

    test('日付の範囲指定', () => {
      const startDate = '2020-01-01';
      const endDate = '2025-12-31';
      const result = generateData('date', { startDate, endDate });
      
      expect(typeof result).toBe('string');
      expect(/^\d{4}-\d{2}-\d{2}$/.test(result)).toBe(true);
      
      const generatedDate = new Date(result);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      expect(generatedDate).toBeInstanceOf(Date);
      expect(generatedDate.getTime()).toBeGreaterThanOrEqual(start.getTime());
      expect(generatedDate.getTime()).toBeLessThanOrEqual(end.getTime());
    });

    test('年齢の範囲', () => {
      const result = generateData('age', {});
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(120);
      expect(Number.isInteger(result)).toBe(true);
    });
  });

  describe('バリデーション機能テスト', () => {
    test('正常な列設定のバリデーション', () => {
      const columns = [
        { name: '名前', type: 'name' as DataTypeCategory },
        { name: '年齢', type: 'age' as DataTypeCategory },
        { name: 'メール', type: 'email' as DataTypeCategory }
      ];

      const result = CSVValidator.validateColumns(columns);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('重複列名のエラー検出', () => {
      const columns = [
        { name: '名前', type: 'name' as DataTypeCategory },
        { name: '名前', type: 'text' as DataTypeCategory }
      ];

      const result = CSVValidator.validateColumns(columns);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'DUPLICATE_COLUMN_NAMES')).toBe(true);
    });

    test('空の列名エラー', () => {
      const columns = [
        { name: '', type: 'text' as DataTypeCategory }
      ];

      const result = CSVValidator.validateColumns(columns);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'MISSING_COLUMN_NAME')).toBe(true);
    });

    test('データ型未選択エラー', () => {
      const columns = [
        { name: '列1', type: undefined }
      ];

      const result = CSVValidator.validateColumns(columns);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'MISSING_DATA_TYPE')).toBe(true);
    });

    test('数値範囲の不正設定エラー', () => {
      const columns = [
        { 
          name: '価格', 
          type: 'number' as DataTypeCategory,
          settings: { min: 100, max: 50 } 
        }
      ];

      const result = CSVValidator.validateColumns(columns);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_NUMBER_RANGE')).toBe(true);
    });

    test('生成件数のバリデーション', () => {
      const columns = [{ name: '列1', type: 'text' as DataTypeCategory }];
      
      // 正常範囲
      const validResult = CSVValidator.validateGenerationSettings(1000, columns);
      expect(validResult.isValid).toBe(true);
      
      // 上限超過
      const invalidResult = CSVValidator.validateGenerationSettings(200000, columns);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors.some(e => e.code === 'TOO_MANY_ROWS')).toBe(true);
      
      // 0以下
      const zeroResult = CSVValidator.validateGenerationSettings(0, columns);
      expect(zeroResult.isValid).toBe(false);
      expect(zeroResult.errors.some(e => e.code === 'INVALID_ROW_COUNT')).toBe(true);
    });

    test('列数制限チェック', () => {
      const tooManyColumns = Array.from({ length: 60 }, (_, i) => ({
        name: `列${i + 1}`,
        type: 'text' as DataTypeCategory
      }));

      const result = CSVValidator.validateColumns(tooManyColumns);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'TOO_MANY_COLUMNS')).toBe(true);
    });

    test('日付範囲の不正設定', () => {
      const columns = [
        {
          name: '日付',
          type: 'date' as DataTypeCategory,
          settings: { startDate: '2025-01-01', endDate: '2020-01-01' }
        }
      ];

      const result = CSVValidator.validateColumns(columns);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_DATE_RANGE')).toBe(true);
    });
  });

  describe('TDエラーハンドリング', () => {
    test('TDスタイルエラーメッセージのフォーマット', () => {
      const error: ValidationError = {
        field: 'test',
        message: 'テストエラー',
        code: 'TEST_ERROR',
        severity: 'error'
      };

      const formattedMessage = TDErrorHandler.formatTDError(error);
      expect(formattedMessage).toContain('🚨 TDからの重要な警告');
      expect(formattedMessage).toContain('テストエラー');
    });

    test('警告メッセージのフォーマット', () => {
      const warning: ValidationError = {
        field: 'test',
        message: 'テスト警告',
        code: 'TEST_WARNING',
        severity: 'warning'
      };

      const formattedMessage = TDErrorHandler.formatTDError(warning);
      expect(formattedMessage).toContain('⚠️ TDからの注意事項');
    });

    test('成功メッセージのフォーマット', () => {
      const message = TDErrorHandler.formatSuccessMessage('完了しました');
      expect(message).toContain('✅ TDからのメッセージ');
      expect(message).toContain('完了しました');
    });

    test('エラー要約の生成', () => {
      const result: ValidationResult = {
        isValid: false,
        errors: [
          { field: 'test1', message: 'エラー1', code: 'ERROR1', severity: 'error' }
        ],
        warnings: [
          { field: 'test2', message: '警告1', code: 'WARNING1', severity: 'warning' }
        ]
      };

      const summary = TDErrorHandler.summarizeErrors(result);
      expect(summary).toContain('1件のエラー');
      expect(summary).toContain('1件の警告');
    });

    test('解決策の提案', () => {
      const error: ValidationError = {
        field: 'columns',
        message: '列が設定されていません',
        code: 'NO_COLUMNS',
        severity: 'error'
      };

      const solution = TDErrorHandler.suggestSolution(error);
      expect(solution).toContain('💡 TDからの解決策');
      expect(solution.length).toBeGreaterThan(0);
    });
  });

  describe('パフォーマンス監視', () => {
    test('生成時間の測定', () => {
      PerformanceMonitor.startGeneration();
      
      // 少し待機をシミュレート
      const start = performance.now();
      while (performance.now() - start < 10) {
        // 10ms待機
      }
      
      const result = PerformanceMonitor.endGeneration(1000, 5);
      
      expect(result.duration).toBeGreaterThan(0);
      expect(result.rowsPerSecond).toBeGreaterThan(0);
      expect(typeof result.recommendation).toBe('string');
      expect(result.recommendation.length).toBeGreaterThan(0);
    });

    test('高速処理時の推奨メッセージ', () => {
      PerformanceMonitor.startGeneration();
      const result = PerformanceMonitor.endGeneration(100, 3);
      
      expect(result.recommendation).toContain('TDからのメッセージ');
      expect(result.recommendation).toContain('高速生成完了');
    });
  });

  describe('大量データ生成テスト', () => {
    test('1000件のデータ生成', () => {
      const config: CsvConfig = {
        columns: [
          { name: '名前', type: 'name' },
          { name: '年齢', type: 'age' },
          { name: 'メール', type: 'email' }
        ],
        rowCount: 1000
      };

      PerformanceMonitor.startGeneration();
      
      const rows: string[][] = [];
      for (let i = 0; i < config.rowCount; i++) {
        const row = config.columns.map(col => 
          String(generateData(col.type, col.settings || {}))
        );
        rows.push(row);
      }

      const result = PerformanceMonitor.endGeneration(config.rowCount, config.columns.length);
      
      expect(rows).toHaveLength(1000);
      expect(rows[0]).toHaveLength(3);
      expect(result.duration).toBeLessThan(10000); // 10秒以内
    });

    test('メモリ効率性の確認', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // 中規模データ生成
      const rows: string[][] = [];
      for (let i = 0; i < 5000; i++) {
        const row = [
          generateData('name', {}),
          generateData('email', {}),
          generateData('phone', {})
        ].map(String);
        rows.push(row);
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // メモリ増加が極端でないことを確認（50MB以下）
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
      expect(rows).toHaveLength(5000);
    });
  });

  describe('エッジケーステスト', () => {
    test('空文字列の処理', () => {
      // 空の設定でも正常に動作すること
      expect(() => generateData('text', {})).not.toThrow();
      expect(() => generateData('number', {})).not.toThrow();
      expect(() => generateData('date', {})).not.toThrow();
    });

    test('不正な設定値の処理', () => {
      // 不正な値が渡されても例外を投げないこと
      expect(() => generateData('number', { min: 'invalid' })).not.toThrow();
      expect(() => generateData('date', { startDate: 'invalid-date' })).not.toThrow();
    });

    test('極端な数値範囲', () => {
      const result = generateData('number', { min: -1000000, max: 1000000 });
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(-1000000);
      expect(result).toBeLessThanOrEqual(1000000);
    });

    test('未来の日付範囲', () => {
      const result = generateData('date', { 
        startDate: '2030-01-01', 
        endDate: '2035-12-31' 
      });
      expect(typeof result).toBe('string');
      expect(/^\d{4}-\d{2}-\d{2}$/.test(result)).toBe(true);
    });
  });

  describe('国際化・文字エンコーディング', () => {
    test('日本語文字の正しい処理', () => {
      const result = generateData('text', { language: 'ja' });
      expect(typeof result).toBe('string');
      
      // UTF-8でエンコードしてもサイズが正常範囲内
      const encoded = new TextEncoder().encode(result);
      expect(encoded.length).toBeGreaterThan(0);
      expect(encoded.length).toBeLessThan(1000);
    });

    test('特殊文字を含む名前の生成', () => {
      const result = generateData('name', {});
      expect(typeof result).toBe('string');
      
      // 日本語文字が含まれているか
      expect(/[ひらがなカタカナ漢字]/.test(result)).toBe(true);
    });

    test('CSVエスケープの必要な文字', () => {
      // カンマ、クォート、改行を含む可能性のあるテキスト
      for (let i = 0; i < 100; i++) {
        const result = generateData('text', { language: 'ja' });
        
        // 基本的な文字列として有効であること
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      }
    });
  });
});

describe('統合テスト', () => {
  test('完全なCSV生成フロー', () => {
    const config: CsvConfig = {
      columns: [
        { name: 'ID', type: 'number', settings: { min: 1, max: 1000 } },
        { name: '社員名', type: 'name' },
        { name: 'メールアドレス', type: 'email' },
        { name: '電話番号', type: 'phone' },
        { name: '年齢', type: 'age' },
        { name: '入社日', type: 'date', settings: { startDate: '2020-01-01', endDate: '2024-12-31' } }
      ],
      rowCount: 100
    };

    // バリデーション
    const validation = CSVValidator.validateColumns(config.columns);
    expect(validation.isValid).toBe(true);

    const generationValidation = CSVValidator.validateGenerationSettings(
      config.rowCount, 
      config.columns
    );
    expect(generationValidation.isValid).toBe(true);

    // データ生成
    PerformanceMonitor.startGeneration();
    
    const headers = config.columns.map(col => col.name);
    const rows: string[][] = [headers];

    for (let i = 0; i < config.rowCount; i++) {
      const row = config.columns.map(col => 
        String(generateData(col.type, col.settings || {}))
      );
      rows.push(row);
    }

    const performance = PerformanceMonitor.endGeneration(config.rowCount, config.columns.length);

    // 結果の検証
    expect(rows).toHaveLength(config.rowCount + 1); // ヘッダー + データ行
    expect(rows[0]).toEqual(headers);
    expect(performance.duration).toBeGreaterThan(0);
    expect(performance.rowsPerSecond).toBeGreaterThan(0);

    // 各行のデータ形式確認
    for (let i = 1; i <= Math.min(10, config.rowCount); i++) {
      const row = rows[i];
      expect(row).toHaveLength(config.columns.length);
      
      // ID (数値)
      expect(Number(row[0])).toBeGreaterThanOrEqual(1);
      expect(Number(row[0])).toBeLessThanOrEqual(1000);
      
      // 社員名 (日本語名)
      expect(row[1].length).toBeGreaterThan(0);
      expect(row[1].includes(' ')).toBe(true);
      
      // メールアドレス
      expect(row[2]).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      
      // 電話番号
      expect(row[3]).toMatch(/^(090|080|070)-\d{4}-\d{4}$/);
      
      // 年齢
      const age = Number(row[4]);
      expect(age).toBeGreaterThanOrEqual(0);
      expect(age).toBeLessThanOrEqual(120);
      
      // 入社日
      expect(row[5]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  test('TDスタイルメッセージの統合', () => {
    const errors: ValidationError[] = [
      { field: 'test', message: 'エラー', code: 'TEST_ERROR', severity: 'error' }
    ];
    
    const warnings: ValidationError[] = [
      { field: 'test', message: '警告', code: 'TEST_WARNING', severity: 'warning' }
    ];

    const result: ValidationResult = {
      isValid: false,
      errors,
      warnings
    };

    const summary = TDErrorHandler.summarizeErrors(result);
    expect(summary).toContain('TDからの');
    
    const successMessage = TDErrorHandler.formatSuccessMessage('テスト完了');
    expect(successMessage).toContain('✅ TDからのメッセージ');
  });
}); 