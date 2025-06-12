 Request, Response, Router } 
 database } 
 NumberBooleanOptions, NumberBooleanService } 

const router = Router();
const numberBooleanService = new NumberBooleanService();

// 数値・真偽値生成エンドポイント
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { 
      type = 'integer',
      count = 10,
      min,
      max,
      decimals,
      precision,
      currency = 'JPY',
      locale = 'ja-JP',
      booleanFormat = 'boolean',
      trueProbability = 0.5,
      useThousandsSeparator = false,
      customPrefix,
      customSuffix,
      allowNaN = false,
      allowInfinity = false,
      allowNegativeZero = false,
      distribution = 'uniform',
      mean,
      standardDeviation
    } = req.body;

    // パラメータ検証
    if (count > 10000) {
      return res.status(400).json({
        success: false,
        message: '生成件数は10,000件以下で指定してください',
        brewMessage: 'Brewからのお知らせ: 大量データ生成は別途ご相談ください♪'
      });
    }

    const validTypes = ['integer', 'float', 'percentage', 'currency', 'scientific', 'boolean', 'special'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: '無効な生成タイプです',
        brewMessage: 'Brewがサポートしているタイプを確認してくださいね♪'
      });
    }

    // オプション設定
    const options: NumberBooleanOptions = {
      type,
      ...(min !== undefined && { min }),
      ...(max !== undefined && { max }),
      ...(decimals !== undefined && { decimals }),
      ...(precision !== undefined && { precision }),
      currency,
      locale,
      booleanFormat,
      trueProbability,
      useThousandsSeparator,
      ...(customPrefix && { customPrefix }),
      ...(customSuffix && { customSuffix }),
      allowNaN,
      allowInfinity,
      allowNegativeZero,
      distribution,
      ...(mean !== undefined && { mean }),
      ...(standardDeviation !== undefined && { standardDeviation })
    };

    const result = await numberBooleanService.generateNumberBoolean(count, options);

    if (result.success) {
      // データベースに保存
      for (const item of result.data) {
        await database.run(`
          INSERT INTO generated_data (type, data, metadata, expires_at, created_at)
          VALUES (?, ?, ?, datetime('now', '+24 hours'), datetime('now'))
        `, [
          'numberboolean',
          JSON.stringify(item),
          JSON.stringify({
            type: options.type,
            count: result.count,
            generatedAt: result.generatedAt
          })
        ]);
      }
    }

    return res.json(result);

  } catch (error: any) {
    logger.error('数値・真偽値生成エラー:', error);
    return res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました',
      brewMessage: 'エラーが発生しましたが、Brewが一緒に解決します！',
      error: error.message
    });
  }
});

// 数値・真偽値検証エンドポイント
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { value, type = 'integer' } = req.body;

    if (value === undefined || value === null) {
      return res.status(400).json({
        success: false,
        message: '検証する値を指定してください',
        brewMessage: 'Brewが検証しますので、値を教えてください♪'
      });
    }

    const isValid = numberBooleanService.validateNumberBoolean(value, type);

    return res.json({
      success: true,
      valid: isValid,
      value,
      type,
      message: isValid ? '有効な数値・真偽値です' : '無効な数値・真偽値です',
      brewMessage: isValid 
        ? 'TDの検証結果: 有効な値です！✨' 
        : 'TDの検証結果: 形式に問題があるようです。ご確認ください',
      validatedAt: new Date().toISOString()
    });

  } catch (error: any) {
    logger.error('数値・真偽値検証エラー:', error);
    return res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました',
      brewMessage: 'Brewの検証機能にエラーが発生しました',
      error: error.message
    });
  }
});

// 数値・真偽値生成履歴取得エンドポイント
router.get('/history', async (req: Request, res: Response) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const rows = await database.query(`
      SELECT * FROM generated_data 
      WHERE type = 'numberboolean' 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `, [Number(limit), Number(offset)]);

    const totalCount = await database.get(`
      SELECT COUNT(*) as count FROM generated_data WHERE type = 'numberboolean'
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
      brewMessage: 'Brewが生成履歴をお持ちしました！数値・真偽値の記録もバッチリです♪'
    });

  } catch (error: any) {
    logger.error('履歴取得エラー:', error);
    res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました',
      brewMessage: 'Brewの履歴管理機能にエラーが発生しました',
      error: error.message
    });
  }
});

// 数値・真偽値生成統計取得エンドポイント
router.get('/statistics', async (req: Request, res: Response) => {
  try {
    // 今日の生成数
    const todayCount = await database.get(`
      SELECT COUNT(*) as count 
      FROM generated_data 
      WHERE type = 'numberboolean' 
      AND date(created_at) = date('now')
    `);

    // 今週の生成数
    const weekCount = await database.get(`
      SELECT COUNT(*) as count 
      FROM generated_data 
      WHERE type = 'numberboolean' 
      AND created_at >= date('now', 'weekday 0', '-7 days')
    `);

    // タイプ別統計
    const typeStats = await database.query(`
      SELECT 
        JSON_EXTRACT(metadata, '$.type') as type,
        COUNT(*) as count
      FROM generated_data 
      WHERE type = 'numberboolean'
      GROUP BY JSON_EXTRACT(metadata, '$.type')
      ORDER BY count DESC
    `);

    // 最近の生成活動
    const recentActivity = await database.query(`
      SELECT 
        date(created_at) as date,
        COUNT(*) as count
      FROM generated_data 
      WHERE type = 'numberboolean'
      AND created_at >= date('now', '-30 days')
      GROUP BY date(created_at)
      ORDER BY date DESC
    `);

    res.json({
      success: true,
      statistics: {
        today: todayCount?.count || 0,
        thisWeek: weekCount?.count || 0,
        typeBreakdown: typeStats || [],
        recentActivity: recentActivity || []
      },
      message: '数値・真偽値生成統計を取得しました',
      brewMessage: 'Brewの統計機能で、数値データの傾向をお見せします！📊',
      generatedAt: new Date().toISOString()
    });

  } catch (error: any) {
    logger.error('統計取得エラー:', error);
    res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました',
      brewMessage: 'Brewの統計機能にエラーが発生しました',
      error: error.message
    });
  }
});

// 数値・真偽値プリセット取得エンドポイント
router.get('/presets', async (req: Request, res: Response) => {
  try {
    const presets = [
      {
        id: 'basic_integer',
        name: '基本整数',
        description: '1-100の整数を生成',
        type: 'integer',
        options: { min: 1, max: 100 },
        category: 'basic',
        difficulty: 'beginner'
      },
      {
        id: 'currency_jpy',
        name: '日本円',
        description: '¥1,000-¥100,000の通貨',
        type: 'currency',
        options: { min: 1000, max: 100000, currency: 'JPY' },
        category: 'currency',
        difficulty: 'intermediate'
      },
      {
        id: 'percentage',
        name: 'パーセンテージ',
        description: '0%-100%の割合',
        type: 'percentage',
        options: { min: 0, max: 100, decimals: 1 },
        category: 'percentage',
        difficulty: 'beginner'
      },
      {
        id: 'float_precision',
        name: '高精度小数',
        description: '0.0-1.0の高精度小数',
        type: 'float',
        options: { min: 0, max: 1, decimals: 5 },
        category: 'scientific',
        difficulty: 'intermediate'
      },
      {
        id: 'boolean_70_30',
        name: '70%真値',
        description: '70%の確率でtrue',
        type: 'boolean',
        options: { trueProbability: 0.7 },
        category: 'boolean',
        difficulty: 'intermediate'
      },
      {
        id: 'scientific_notation',
        name: '科学記法',
        description: '科学記法による表記',
        type: 'scientific',
        options: { min: -6, max: 6, precision: 3 },
        category: 'scientific',
        difficulty: 'advanced'
      }
    ];

    res.json({
      success: true,
      data: presets,
      count: presets.length,
      message: `${presets.length}件のプリセットを取得しました`,
      brewMessage: 'Brewおすすめのプリセットをご用意しました！用途に合わせてお選びください♪'
    });

  } catch (error: any) {
    logger.error('プリセット取得エラー:', error);
    res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました',
      brewMessage: 'Brewのプリセット機能にエラーが発生しました',
      error: error.message
    });
  }
});

export default router; 
