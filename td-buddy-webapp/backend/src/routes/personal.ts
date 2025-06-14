import crypto from 'crypto';
import { Request, Response, Router } from 'express';
import { database } from '../database/database';
import { ValidationError } from '../middleware/errorHandler';
import { PersonalInfoService } from '../services/PersonalInfoService';
import { PersonalInfoGenerateRequest } from '../types/personalInfo';

const router = Router();
const personalInfoService = new PersonalInfoService();

/**
 * 個人情報生成エンドポイント
 * POST /api/personal/generate
 */
router.post('/generate', async (req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    const criteria: PersonalInfoGenerateRequest = req.body;

    // 基本バリデーション
    if (!criteria) {
      throw new ValidationError('リクエストボディが必要です', 'MISSING_BODY');
    }

    // 生成数のバリデーション - 制限を100件から1000件に緩和
    if (!criteria.count || criteria.count < 1 || criteria.count > 1000) {
      throw new ValidationError(
        '生成数は1個以上1000個以下で指定してください',
        'INVALID_COUNT'
      );
    }

    // フィールド指定のバリデーション
    if (!criteria.includeFields || criteria.includeFields.length === 0) {
      throw new ValidationError(
        '少なくとも1つのフィールドを指定してください',
        'MISSING_FIELDS'
      );
    }

    // 有効なフィールドのチェック
    const validFields = [
      'fullName',
      'kanaName',
      'email',
      'phone',
      'mobile',
      'address',
      'postalCode',
      'birthDate',
      'age',
      'gender',
      'company',
      'jobTitle',
      'website',
      'socialId',
    ];

    const invalidFields = criteria.includeFields.filter(
      field => !validFields.includes(field)
    );

    if (invalidFields.length > 0) {
      throw new ValidationError(
        `無効なフィールドが指定されています: ${invalidFields.join(', ')}`,
        'INVALID_FIELDS'
      );
    }

    console.log(
      `🤖 TD: 個人情報生成開始 - ${
        criteria.count
      }件, フィールド: [${criteria.includeFields.join(', ')}]`
    );

    // PersonalInfoServiceを使用して生成
    const result = await personalInfoService.generatePersonalInfo(criteria);

    // データベースに保存
    const dataHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(result.persons))
      .digest('hex');

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24時間後に期限切れ

    await database.run(
      `INSERT INTO generated_personal_info 
       (data_hash, criteria, expires_at, user_session_id, ip_address, user_agent) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        dataHash,
        JSON.stringify(criteria),
        expiresAt.toISOString(),
        (req.headers['x-session-id'] as string) || 'anonymous',
        req.ip,
        req.get('User-Agent') || 'unknown',
      ]
    );

    const responseTime = Date.now() - startTime;

    console.log(
      `✅ TD: 個人情報生成完了 - ${result.persons.length}件生成 (${responseTime}ms)`
    );

    // レスポンス
    res.status(200).json({
      success: true,
      data: result.persons,
      performance: {
        duration: responseTime,
        itemsPerSecond: (result.persons.length / responseTime) * 1000,
        totalGenerated: result.persons.length,
      },
      statistics: result.statistics,
      criteria: result.criteria,
      generatedAt: result.generatedAt,
      expiresAt: result.expiresAt,
    });
  } catch (error) {
    console.error('❌ 個人情報生成エラー:', error);

    if (error instanceof ValidationError) {
      res.status(400).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          timestamp: new Date().toISOString(),
        },
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: '内部サーバーエラーが発生しました',
          timestamp: new Date().toISOString(),
        },
      });
    }
  }
});

/**
 * 個人情報生成履歴取得
 * GET /api/personal/history
 */
router.get('/history', async (req: Request, res: Response) => {
  try {
    const sessionId = (req.headers['x-session-id'] as string) || 'anonymous';

    const history = await database.query(
      `SELECT id, criteria, created_at 
       FROM generated_personal_info 
       WHERE user_session_id = ? 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [sessionId]
    );

    res.status(200).json({
      success: true,
      data: {
        history: history.map((record: any) => ({
          id: record.id,
          criteria: JSON.parse(record.criteria),
          createdAt: record.created_at,
        })),
      },
    });
  } catch (error) {
    console.error('❌ 履歴取得エラー:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '履歴の取得に失敗しました',
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * 個人情報CSVエクスポート
 * POST /api/personal/export/csv
 */
router.post('/export/csv', async (req: Request, res: Response) => {
  try {
    const { persons } = req.body;

    if (!persons || !Array.isArray(persons)) {
      throw new ValidationError('エクスポートデータが必要です', 'MISSING_DATA');
    }

    // CSVヘッダー
    const headers = [
      '氏名（漢字）',
      '氏名（カナ）',
      'メールアドレス',
      '電話番号',
      '携帯電話',
      '住所',
      '郵便番号',
      '生年月日',
      '年齢',
      '性別',
      '会社名',
      '職種',
      'ウェブサイト',
      'SNS ID',
    ];

    // CSVデータ作成
    const csvRows = [headers.join(',')];

    persons.forEach((person: any) => {
      const row = [
        person.fullName?.kanji || '',
        person.kanaName || '', // 氏名（カナ）列にkanaNameを設定
        person.email || '',
        person.phone || '',
        person.mobile || '',
        person.address?.full || '',
        person.address?.postalCode || '',
        person.birthDate || '',
        person.age || '',
        person.gender === 'male'
          ? '男性'
          : person.gender === 'female'
          ? '女性'
          : '',
        person.company || '',
        person.jobTitle || '',
        person.website || '',
        person.socialId || '',
      ].map(field => `"${field.toString().replace(/"/g, '""')}"`);

      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const filename = `personal_info_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    console.log(`📊 TD: CSVエクスポート完了 - ${persons.length}件`);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send('\uFEFF' + csvContent); // BOM付きでUTF-8
  } catch (error) {
    console.error('❌ CSVエクスポートエラー:', error);

    if (error instanceof ValidationError) {
      res.status(400).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          timestamp: new Date().toISOString(),
        },
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          code: 'EXPORT_ERROR',
          message: 'CSVエクスポートに失敗しました',
          timestamp: new Date().toISOString(),
        },
      });
    }
  }
});

/**
 * 統計情報取得
 * GET /api/personal/stats
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await database.query(`
      SELECT 
        COUNT(*) as total_generated,
        COUNT(DISTINCT user_session_id) as unique_users,
        AVG(LENGTH(criteria)) as avg_criteria_size,
        MIN(created_at) as first_generation,
        MAX(created_at) as last_generation
      FROM generated_personal_info 
      WHERE created_at > datetime('now', '-7 days')
    `);

    const fieldUsage = await database.query(`
      SELECT 
        json_extract(criteria, '$.includeFields') as fields,
        COUNT(*) as usage_count
      FROM generated_personal_info 
      WHERE created_at > datetime('now', '-7 days')
      GROUP BY json_extract(criteria, '$.includeFields')
      ORDER BY usage_count DESC
      LIMIT 10
    `);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0],
        fieldUsage: fieldUsage.map((row: any) => ({
          fields: JSON.parse(row.fields || '[]'),
          count: row.usage_count,
        })),
      },
    });
  } catch (error) {
    console.error('❌ 統計情報取得エラー:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'STATS_ERROR',
        message: '統計情報の取得に失敗しました',
        timestamp: new Date().toISOString(),
      },
    });
  }
});

export { router as personalRouter };
