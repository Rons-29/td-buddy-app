// Enhanced Export Routes - Step 12
// JSON/XML/YAML/SQL出力対応ルート

import { Router, Request, Response } from 'express';
import { ExportService, ExportOptions } from '../services/exportService';

// ValidationError クラス定義
class ValidationError extends Error {
  public code: string;
  
  constructor(message: string, code: string) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
  }
}

const router = Router();
const exportService = new ExportService();

/**
 * パスワードエクスポート - GET版 (フロントエンド対応)
 * GET /api/export/passwords
 */
router.get('/passwords', async (req: Request, res: Response) => {
  try {
    const {
      format = 'csv',
      count = '10',
      batchSize = '100',
      encoding = 'utf8',
      includeMetadata = 'true',
      streaming = 'false',
      tableName = 'passwords'
    } = req.query;

    const countNum = parseInt(count as string);
    const batchSizeNum = parseInt(batchSize as string);

    // バリデーション
    if (!['csv', 'json', 'xml', 'yaml', 'sql'].includes(format as string)) {
      throw new ValidationError('対応していない形式です', 'INVALID_FORMAT');
    }

    if (countNum < 1 || countNum > 1000000) {
      throw new ValidationError('生成件数は1〜1,000,000の範囲で指定してください', 'INVALID_COUNT');
    }

    // パスワード生成
    const passwords = [];
    for (let i = 0; i < countNum; i++) {
      // シンプルなパスワード生成
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      let password = '';
      for (let j = 0; j < 12; j++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      passwords.push(password);
    }

    // パスワード専用のフィールドマッピング
    const mappedData = passwords.map((password, index) => ({
      id: index + 1,
      password: password,
      length: password.length,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      strength: password.length >= 12 ? 'Strong' : password.length >= 8 ? 'Medium' : 'Weak',
      generatedAt: new Date().toISOString()
    }));

    const exportOptions: ExportOptions = {
      format: format as any,
      filename: `passwords_${new Date().toISOString().slice(0, 10)}`,
      includeHeaders: includeMetadata === 'true',
      pretty: true,
      encoding: encoding as any,
      tableName: tableName as string,
      batchSize: batchSizeNum
    };

    const result = await exportService.export(mappedData, exportOptions);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'PASSWORD_EXPORT_FAILED',
          message: result.error || 'パスワードエクスポートに失敗しました',
          timestamp: new Date().toISOString()
        }
      });
    }

    console.log(`📊 TD: パスワードエクスポート完了 - ${format?.toString().toUpperCase()} ${result.recordCount}件`);

    // フォーマット別のContent-Type設定
    const contentTypes: { [key: string]: string } = {
      csv: 'text/csv; charset=utf-8',
      json: 'application/json; charset=utf-8',
      xml: 'application/xml; charset=utf-8',
      yaml: 'text/yaml; charset=utf-8',
      sql: 'text/sql; charset=utf-8'
    };

    // 直接ダウンロードの場合（?download=true）
    if (req.query.download === 'true') {
      res.setHeader('Content-Type', contentTypes[format as string] || 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      return res.status(200).send(format === 'csv' ? '\uFEFF' + result.content : result.content);
    } else {
      // JSON応答
      return res.json({
        success: true,
        filename: result.filename,
        content: result.content,
        format: result.format,
        recordCount: result.recordCount,
        fileSize: result.size,
        downloadUrl: result.downloadUrl
      });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ パスワードエクスポートエラー:', error);
    
    if (error instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      return res.status(500).json({
        success: false,
        error: {
          code: 'PASSWORD_EXPORT_ERROR',
          message: 'パスワードエクスポートに失敗しました',
          timestamp: new Date().toISOString()
        }
      });
    }
  }
});

/**
 * 拡張エクスポート機能
 * POST /api/export/enhanced
 */
router.post('/enhanced', async (req: Request, res: Response) => {
  try {
    const { data, format, options = {} } = req.body;
    
    // バリデーション
    if (!data || !Array.isArray(data)) {
      throw new ValidationError('エクスポートデータが必要です', 'MISSING_DATA');
    }
    
    if (!format || !['csv', 'json', 'xml', 'yaml', 'sql'].includes(format)) {
      throw new ValidationError('対応していない形式です', 'INVALID_FORMAT');
    }

    // エクスポートオプション設定
    const exportOptions: ExportOptions = {
      format,
      filename: options.filename,
      includeHeaders: options.includeHeaders !== false,
      pretty: options.pretty === true,
      encoding: options.encoding || 'utf8',
      tableName: options.tableName || 'test_data',
      batchSize: options.batchSize || 100,
      ...options
    };

    // エクスポート実行
    const result = await exportService.export(data, exportOptions);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'EXPORT_FAILED',
          message: result.error || 'エクスポートに失敗しました',
          timestamp: new Date().toISOString()
        }
      });
    }

    console.log(`📊 TD: 拡張エクスポート完了 - ${format.toUpperCase()} ${result.recordCount}件`);

    // 大量データの場合はダウンロードURLのみ返す
    if (result.size > 1024 * 1024) { // 1MB以上
      return res.json({
        success: true,
        filename: result.filename,
        format: result.format,
        recordCount: result.recordCount,
        fileSize: result.size,
        downloadUrl: result.downloadUrl,
        message: `大量データ(${Math.round(result.size / 1024)}KB)のため、ダウンロードしてください`
      });
    } else {
      // 小さなデータはレスポンスに含める
      return res.json({
        success: true,
        filename: result.filename,
        content: result.content,
        format: result.format,
        recordCount: result.recordCount,
        fileSize: result.size,
        downloadUrl: result.downloadUrl
      });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ 拡張エクスポートエラー:', error);
    
    if (error instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      return res.status(500).json({
        success: false,
        error: {
          code: 'EXPORT_ERROR',
          message: '拡張エクスポートに失敗しました',
          timestamp: new Date().toISOString()
        }
      });
    }
  }
});

/**
 * 個人情報の拡張エクスポート
 * POST /api/export/personal
 */
router.post('/personal', async (req: Request, res: Response) => {
  try {
    const { persons, format = 'csv', options = {} } = req.body;
    
    if (!persons || !Array.isArray(persons)) {
      throw new ValidationError('個人情報データが必要です', 'MISSING_PERSONAL_DATA');
    }

    // 個人情報専用のフィールドマッピング
    const mappedData = persons.map(person => ({
      fullName_kanji: person.fullName?.kanji || '',
      fullName_kana: person.kanaName || '',
      email: person.email || '',
      phone: person.phone || '',
      mobile: person.mobile || '',
      address: person.address?.full || '',
      postalCode: person.address?.postalCode || '',
      birthDate: person.birthDate || '',
      age: person.age || '',
      gender: person.gender === 'male' ? '男性' : person.gender === 'female' ? '女性' : '',
      company: person.company || '',
      jobTitle: person.jobTitle || '',
      website: person.website || '',
      socialId: person.socialId || ''
    }));

    const exportOptions: ExportOptions = {
      format,
      filename: options.filename || `personal_info_${new Date().toISOString().slice(0, 10)}`,
      includeHeaders: options.includeHeaders !== false,
      pretty: options.pretty === true,
      encoding: options.encoding || 'utf8',
      tableName: options.tableName || 'personal_info',
      batchSize: options.batchSize || 100
    };

    const result = await exportService.export(mappedData, exportOptions);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'PERSONAL_EXPORT_FAILED',
          message: result.error || '個人情報エクスポートに失敗しました',
          timestamp: new Date().toISOString()
        }
      });
    }

    console.log(`📊 TD: 個人情報エクスポート完了 - ${format.toUpperCase()} ${result.recordCount}件`);

    // フォーマット別のContent-Type設定
    const contentTypes: { [key: string]: string } = {
      csv: 'text/csv; charset=utf-8',
      json: 'application/json; charset=utf-8',
      xml: 'application/xml; charset=utf-8',
      yaml: 'text/yaml; charset=utf-8',
      sql: 'text/sql; charset=utf-8'
    };

    // 直接ダウンロードの場合
    if (req.query.download === 'true') {
      res.setHeader('Content-Type', contentTypes[format] || 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      return res.status(200).send(format === 'csv' ? '\uFEFF' + result.content : result.content);
    } else {
      // JSON応答
      return res.json({
        success: true,
        filename: result.filename,
        content: result.content,
        format: result.format,
        recordCount: result.recordCount,
        fileSize: result.size,
        downloadUrl: result.downloadUrl
      });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ 個人情報エクスポートエラー:', error);
    
    if (error instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      return res.status(500).json({
        success: false,
        error: {
          code: 'PERSONAL_EXPORT_ERROR',
          message: '個人情報エクスポートに失敗しました',
          timestamp: new Date().toISOString()
        }
      });
    }
  }
});

/**
 * 個人情報エクスポート - GET版 (フロントエンド対応)
 * GET /api/export/personal
 */
router.get('/personal', async (req: Request, res: Response) => {
  try {
    const {
      format = 'csv',
      count = '10',
      batchSize = '100',
      encoding = 'utf8',
      includeMetadata = 'true',
      streaming = 'false',
      tableName = 'personal_info'
    } = req.query;

    const countNum = parseInt(count as string);
    const batchSizeNum = parseInt(batchSize as string);

    // バリデーション
    if (!['csv', 'json', 'xml', 'yaml', 'sql'].includes(format as string)) {
      throw new ValidationError('対応していない形式です', 'INVALID_FORMAT');
    }

    if (countNum < 1 || countNum > 1000000) {
      throw new ValidationError('生成件数は1〜1,000,000の範囲で指定してください', 'INVALID_COUNT');
    }

    // 個人情報生成
    const persons = [];
    for (let i = 0; i < countNum; i++) {
      const firstNames = ['太郎', '花子', '一郎', '美穂', '健一', '愛子', '博', '恵'];
      const lastNames = ['田中', '山田', '佐藤', '鈴木', '高橋', '伊藤', '渡辺', '中村'];
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]!;
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]!;
      const age = 20 + Math.floor(Math.random() * 50);
      
      persons.push({
        id: i + 1,
        fullName_kanji: `${lastName} ${firstName}`,
        fullName_kana: `${lastName}タナカ ${firstName}タロウ`,
        email: `${lastName.toLowerCase()}${firstName.toLowerCase()}${i + 1}@example.com`,
        phone: `03-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
        mobile: `090-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
        address: `東京都渋谷区${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 20) + 1}-${Math.floor(Math.random() * 10) + 1}`,
        postalCode: `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        birthDate: `19${70 + Math.floor(Math.random() * 30)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        age: age,
        gender: Math.random() > 0.5 ? '男性' : '女性',
        company: ['株式会社テスト', '有限会社サンプル', 'テクノ株式会社'][Math.floor(Math.random() * 3)]!,
        jobTitle: ['エンジニア', 'マネージャー', 'アナリスト', 'デザイナー'][Math.floor(Math.random() * 4)]!,
        website: `https://${lastName.toLowerCase()}.example.com`,
        socialId: `${Math.floor(Math.random() * 90000000) + 10000000}`,
        generatedAt: new Date().toISOString()
      });
    }

    const exportOptions: ExportOptions = {
      format: format as any,
      filename: `personal_info_${new Date().toISOString().slice(0, 10)}`,
      includeHeaders: includeMetadata === 'true',
      pretty: true,
      encoding: encoding as any,
      tableName: tableName as string,
      batchSize: batchSizeNum
    };

    const result = await exportService.export(persons, exportOptions);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'PERSONAL_EXPORT_FAILED',
          message: result.error || '個人情報エクスポートに失敗しました',
          timestamp: new Date().toISOString()
        }
      });
    }

    console.log(`📊 TD: 個人情報エクスポート完了 - ${format?.toString().toUpperCase()} ${result.recordCount}件`);

    // JSON応答
    return res.json({
      success: true,
      filename: result.filename,
      content: result.content,
      format: result.format,
      recordCount: result.recordCount,
      fileSize: result.size,
      downloadUrl: result.downloadUrl
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ 個人情報エクスポートエラー:', error);
    
    if (error instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      return res.status(500).json({
        success: false,
        error: {
          code: 'PERSONAL_EXPORT_ERROR',
          message: '個人情報エクスポートに失敗しました',
          timestamp: new Date().toISOString()
        }
      });
    }
  }
});

/**
 * 拡張エクスポート機能 - GET版 (フロントエンド対応)
 * GET /api/export/enhanced
 */
router.get('/enhanced', async (req: Request, res: Response) => {
  try {
    const {
      format = 'csv',
      count = '10',
      batchSize = '100',
      encoding = 'utf8',
      includeMetadata = 'true',
      streaming = 'false',
      tableName = 'test_data'
    } = req.query;

    const countNum = parseInt(count as string);
    const batchSizeNum = parseInt(batchSize as string);

    // バリデーション
    if (!['csv', 'json', 'xml', 'yaml', 'sql'].includes(format as string)) {
      throw new ValidationError('対応していない形式です', 'INVALID_FORMAT');
    }

    if (countNum < 1 || countNum > 1000000) {
      throw new ValidationError('生成件数は1〜1,000,000の範囲で指定してください', 'INVALID_COUNT');
    }

    // カスタムテストデータ生成
    const customData = [];
    for (let i = 0; i < countNum; i++) {
      customData.push({
        id: i + 1,
        testField1: `テストデータ${i + 1}`,
        testField2: Math.floor(Math.random() * 1000),
        testField3: Math.random() > 0.5,
        testField4: new Date().toISOString(),
        randomValue: Math.random(),
        category: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
        status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)],
        generatedAt: new Date().toISOString()
      });
    }

    const exportOptions: ExportOptions = {
      format: format as any,
      filename: `enhanced_export_${new Date().toISOString().slice(0, 10)}`,
      includeHeaders: includeMetadata === 'true',
      pretty: true,
      encoding: encoding as any,
      tableName: tableName as string,
      batchSize: batchSizeNum
    };

    const result = await exportService.export(customData, exportOptions);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'ENHANCED_EXPORT_FAILED',
          message: result.error || '拡張エクスポートに失敗しました',
          timestamp: new Date().toISOString()
        }
      });
    }

    console.log(`📊 TD: 拡張エクスポート完了 - ${format?.toString().toUpperCase()} ${result.recordCount}件`);

    // JSON応答
    return res.json({
      success: true,
      filename: result.filename,
      content: result.content,
      format: result.format,
      recordCount: result.recordCount,
      fileSize: result.size,
      downloadUrl: result.downloadUrl
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ 拡張エクスポートエラー:', error);
    
    if (error instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      return res.status(500).json({
        success: false,
        error: {
          code: 'ENHANCED_EXPORT_ERROR',
          message: '拡張エクスポートに失敗しました',
          timestamp: new Date().toISOString()
        }
      });
    }
  }
});

/**
 * エクスポート履歴
 * GET /api/export/history
 */
router.get('/history', async (req: Request, res: Response) => {
  try {
    // TODO: 実装（データベースからエクスポート履歴を取得）
    return res.json({
      success: true,
      exports: [],
      message: 'エクスポート履歴機能は開発中です'
    });
  } catch (error) {
    console.error('❌ エクスポート履歴取得エラー:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'HISTORY_ERROR',
        message: 'エクスポート履歴の取得に失敗しました',
        timestamp: new Date().toISOString()
      }
    });
  }
});

export default router; 