import { Request, Response, Router } from 'express';
import { database } from '../database/database';
import { DateTimeOptions, DateTimeService } from '../services/DateTimeService';

const router = Router();
const dateTimeService = new DateTimeService();

// 日付・時刻生成エンドポイント
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { 
      format = 'iso8601',
      count = 10,
      customFormat,
      locale = 'ja-JP',
      timezone = 'Asia/Tokyo',
      range,
      relative,
      businessDays 
    } = req.body;

    // パラメータ検証
    if (count > 10000) {
      return res.status(400).json({
        success: false,
        message: '生成件数は10,000件以下で指定してください',
        brewMessage: 'Brewからのお知らせ: 大量データ生成は別途ご相談ください♪'
      });
    }

    const validFormats = ['iso8601', 'japanese', 'unix', 'relative', 'custom', 'business'];
    if (!validFormats.includes(format)) {
      return res.status(400).json({
        success: false,
        message: `無効な形式です。対応形式: ${validFormats.join(', ')}`,
        brewMessage: 'Brewがサポートしている形式をご確認ください！'
      });
    }

    // オプション設定
    const options: DateTimeOptions = {
      format,
      customFormat,
      locale,
      timezone,
      ...(range && {
        range: {
          start: new Date(range.start),
          end: new Date(range.end)
        }
      }),
      relative,
      businessDays
    };

    // 日付・時刻生成
    const result = await dateTimeService.generateDateTime(options, count);

    // データベースに保存
    for (const dateTime of result.data) {
      await database.run(`
        INSERT INTO generated_data (
          id, type, data, metadata, created_at, expires_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [
        dateTime.id,
        'datetime',
        JSON.stringify({
          value: dateTime.value,
          originalDate: dateTime.originalDate,
          format: dateTime.format,
          locale: dateTime.locale,
          timezone: dateTime.timezone
        }),
        JSON.stringify(dateTime.metadata),
        new Date().toISOString(),
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24時間後
      ]);
    }

    return res.json(result);

  } catch (error: any) {
    console.error('日付・時刻生成エラー:', error);
    return res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました',
      brewMessage: 'エラーが発生しましたが、Brewが一緒に解決します！',
      error: error.message
    });
  }
});

// 日付・時刻検証エンドポイント
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { value, format = 'iso8601' } = req.body;

    if (!value) {
      return res.status(400).json({
        success: false,
        message: '検証する値を指定してください',
        brewMessage: 'Brewが検証しますので、値を教えてください♪'
      });
    }

    const isValid = dateTimeService.validateDateTime(value, format);

    return res.json({
      success: true,
      valid: isValid,
      value,
      format,
      message: isValid ? '有効な日付・時刻です' : '無効な日付・時刻です',
      brewMessage: isValid 
        ? 'TDの検証結果: 有効な日付・時刻です！✨' 
        : 'TDの検証結果: 形式に問題があるようです。ご確認ください',
      validatedAt: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('日付・時刻検証エラー:', error);
    return res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました',
      brewMessage: 'Brewの検証機能にエラーが発生しました',
      error: error.message
    });
  }
});

// 日付・時刻生成履歴取得エンドポイント
router.get('/history', async (req: Request, res: Response) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const rows = await database.query(`
      SELECT * FROM generated_data 
      WHERE type = 'datetime' 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `, [Number(limit), Number(offset)]);

    const totalCount = await database.get(`
      SELECT COUNT(*) as count FROM generated_data WHERE type = 'datetime'
    `);

    const historyItems = rows.map((row: any) => ({
      id: row.id,
      data: JSON.parse(row.data),
      metadata: JSON.parse(row.metadata),
      createdAt: row.created_at,
      expiresAt: row.expires_at
    }));

    res.json({
      success: true,
      data: historyItems,
      count: historyItems.length,
      total: totalCount?.count || 0,
      limit: Number(limit),
      offset: Number(offset),
      message: `${historyItems.length}件の履歴を取得しました`,
      brewMessage: 'Brewが生成履歴をお持ちしました！過去のデータもしっかり管理されています♪'
    });

  } catch (error: any) {
    console.error('履歴取得エラー:', error);
    res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました',
      brewMessage: 'Brewの履歴管理機能にエラーが発生しました',
      error: error.message
    });
  }
});

// 日付・時刻生成統計取得エンドポイント
router.get('/statistics', async (req: Request, res: Response) => {
  try {
    // 今日の生成数
    const todayCount = await database.get(`
      SELECT COUNT(*) as count 
      FROM generated_data 
      WHERE type = 'datetime' 
      AND date(created_at) = date('now')
    `);

    // 今週の生成数
    const weekCount = await database.get(`
      SELECT COUNT(*) as count 
      FROM generated_data 
      WHERE type = 'datetime' 
      AND created_at >= date('now', 'weekday 0', '-7 days')
    `);

    // 形式別統計
    const formatStats = await database.query(`
      SELECT 
        JSON_EXTRACT(data, '$.format') as format,
        COUNT(*) as count
      FROM generated_data 
      WHERE type = 'datetime'
      GROUP BY JSON_EXTRACT(data, '$.format')
      ORDER BY count DESC
    `);

    // 最近の生成活動
    const recentActivity = await database.query(`
      SELECT 
        date(created_at) as date,
        COUNT(*) as count
      FROM generated_data 
      WHERE type = 'datetime'
      AND created_at >= date('now', '-30 days')
      GROUP BY date(created_at)
      ORDER BY date DESC
    `);

    res.json({
      success: true,
      statistics: {
        today: todayCount?.count || 0,
        thisWeek: weekCount?.count || 0,
        formatBreakdown: formatStats || [],
        recentActivity: recentActivity || []
      },
      message: '日付・時刻生成統計を取得しました',
      brewMessage: 'Brewの統計機能で、データ生成の傾向をお見せします！📊',
      generatedAt: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('統計取得エラー:', error);
    res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました',
      brewMessage: 'Brewの統計機能にエラーが発生しました',
      error: error.message
    });
  }
});

// 日付・時刻プリセット取得エンドポイント
router.get('/presets', async (req: Request, res: Response) => {
  try {
    const presets = [
      {
        id: 'now',
        name: '現在時刻',
        description: 'リアルタイムの現在時刻を生成',
        format: 'iso8601',
        options: {},
        category: 'basic',
        difficulty: 'beginner'
      },
      {
        id: 'past_week',
        name: '過去1週間',
        description: '過去1週間のランダムな日時',
        format: 'japanese',
        options: {
          relative: {
            minDays: -7,
            maxDays: 0,
            direction: 'past'
          }
        },
        category: 'relative',
        difficulty: 'beginner'
      },
      {
        id: 'business_days',
        name: '営業日のみ',
        description: '平日・祝日除外の営業日',
        format: 'business',
        options: {
          businessDays: {
            excludeWeekends: true,
            excludeHolidays: true
          }
        },
        category: 'business',
        difficulty: 'intermediate'
      },
      {
        id: 'unix_timestamp',
        name: 'Unix タイムスタンプ',
        description: 'システム連携に最適な数値形式',
        format: 'unix',
        options: {},
        category: 'technical',
        difficulty: 'intermediate'
      },
      {
        id: 'custom_format',
        name: 'カスタム形式',
        description: 'YYYY-MM-DD HH:mm:ss 形式',
        format: 'custom',
        options: {
          customFormat: 'YYYY-MM-DD HH:mm:ss'
        },
        category: 'custom',
        difficulty: 'advanced'
      },
      {
        id: 'japanese_era',
        name: '和暦形式',
        description: '令和・平成対応の日本語日付',
        format: 'japanese',
        options: {
          locale: 'ja-JP'
        },
        category: 'localization',
        difficulty: 'intermediate'
      }
    ];

    res.json({
      success: true,
      presets,
      count: presets.length,
      message: '日付・時刻プリセットを取得しました',
      brewMessage: 'Brewお勧めの日付・時刻プリセットです！用途に合わせてお選びください♪'
    });

  } catch (error: any) {
    console.error('プリセット取得エラー:', error);
    res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました',
      brewMessage: 'Brewのプリセット機能にエラーが発生しました',
      error: error.message
    });
  }
});

export default router; 