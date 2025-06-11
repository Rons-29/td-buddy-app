import express from 'express';
import { UuidService } from '../services/UuidService';
import { ApiResponse, UuidGenerateRequest, UuidValidateRequest } from '../types/api';

const router = express.Router();
const uuidService = new UuidService();

// 簡単なバリデーション関数
function validateUuidRequest(req: express.Request): string | null {
  const { count, version, format } = req.body;
  
  if (!count || count < 1 || count > 10000) {
    return '生成個数は1から10000の間で指定してください';
  }
  
  if (!['v1', 'v4', 'v6', 'v7', 'mixed'].includes(version)) {
    return 'サポートされているバージョンを指定してください: v1, v4, v6, v7, mixed';
  }
  
  if (!['standard', 'compact', 'uppercase', 'with-prefix', 'sql-friendly'].includes(format)) {
    return 'サポートされているフォーマットを指定してください';
  }
  
  return null;
}

function validateUuidValidateRequest(req: express.Request): string | null {
  const { uuids } = req.body;
  
  if (!Array.isArray(uuids) || uuids.length < 1 || uuids.length > 1000) {
    return 'uuidsは1から1000個のUUID配列である必要があります';
  }
  
  return null;
}

// 🆔 UUID生成エンドポイント
router.post('/generate', async (req: express.Request, res: express.Response) => {
  const startTime = Date.now();
  
  try {
    const validationError = validateUuidRequest(req);
    if (validationError) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validationError,
          statusCode: 400,
          tdMessage: '🤖 TD: 入力内容を確認してください。正しい形式で入力し直してくださいね',
          timestamp: new Date().toISOString(),
          path: req.path,
          method: req.method
        },
        timestamp: new Date().toISOString()
      };
      return res.status(400).json(response);
    }

    const criteria: UuidGenerateRequest = req.body;
    const userSession = req.headers['x-session-id'] as string;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    console.log(`🤖 TD: ${criteria.version}バージョンのUUIDを${criteria.count}個生成を開始します`);

    const result = await uuidService.generateUuids(
      criteria,
      userSession,
      ipAddress,
      userAgent
    );

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'UUID生成が完了しました',
      tdMessage: `🤖 TD: ${criteria.count}個の${criteria.version}バージョンUUIDを${criteria.format}形式で生成しました！品質も完璧です♪`,
      timestamp: new Date().toISOString(),
      metadata: {
        duration: Date.now() - startTime
      }
    };

<<<<<<< HEAD
    res.json(response);
=======
    return res.json(response);
>>>>>>> d360437c6ca0c005be955fae6ad01b33c9dd0472

  } catch (error: any) {
    console.error('❌ UUID生成API エラー:', error);
    
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'UUID_GENERATION_ERROR',
        message: error.message || 'UUID生成に失敗しました',
        statusCode: 500,
        tdMessage: '🤖 TD: UUID生成でエラーが発生しました。しばらく時間をおいて再試行してください',
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method
      },
      timestamp: new Date().toISOString()
    };

<<<<<<< HEAD
    res.status(500).json(response);
=======
    return res.status(500).json(response);
>>>>>>> d360437c6ca0c005be955fae6ad01b33c9dd0472
  }
});

// 🔍 UUID検証エンドポイント
router.post('/validate', async (req: express.Request, res: express.Response) => {
  const startTime = Date.now();
  
  try {
    const validationError = validateUuidValidateRequest(req);
    if (validationError) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validationError,
          statusCode: 400,
          tdMessage: '🤖 TD: UUID検証のリクエスト形式を確認してください',
          timestamp: new Date().toISOString(),
          path: req.path,
          method: req.method
        },
        timestamp: new Date().toISOString()
      };
      return res.status(400).json(response);
    }

    const request: UuidValidateRequest = req.body;
    
    console.log(`🤖 TD: ${request.uuids.length}個のUUIDの検証を開始します`);

    const result = await uuidService.validateUuids(request);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'UUID検証が完了しました',
      tdMessage: `🤖 TD: ${result.summary.totalChecked}個のUUIDを検証しました。有効: ${result.summary.validCount}個、無効: ${result.summary.invalidCount}個です`,
      timestamp: new Date().toISOString(),
      metadata: {
        duration: Date.now() - startTime
      }
    };

<<<<<<< HEAD
    res.json(response);
=======
    return res.json(response);
>>>>>>> d360437c6ca0c005be955fae6ad01b33c9dd0472

  } catch (error: any) {
    console.error('❌ UUID検証API エラー:', error);
    
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'UUID_VALIDATION_ERROR',
        message: error.message || 'UUID検証に失敗しました',
        statusCode: 500,
        tdMessage: '🤖 TD: UUID検証でエラーが発生しました。入力形式を確認してください',
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method
      },
      timestamp: new Date().toISOString()
    };

<<<<<<< HEAD
    res.status(500).json(response);
=======
    return res.status(500).json(response);
>>>>>>> d360437c6ca0c005be955fae6ad01b33c9dd0472
  }
});

// 📊 UUID生成履歴取得エンドポイント
router.get('/history', async (req: express.Request, res: express.Response) => {
  const startTime = Date.now();
  
  try {
    const userSession = req.headers['x-session-id'] as string;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    if (limit > 200) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'INVALID_LIMIT',
          message: 'limitは200以下である必要があります',
          statusCode: 400,
          tdMessage: '🤖 TD: 一度に取得できる履歴は200件までです',
          timestamp: new Date().toISOString(),
          path: req.path,
          method: req.method
        },
        timestamp: new Date().toISOString()
      };
      return res.status(400).json(response);
    }

    const result = await uuidService.getGenerationHistory(userSession, limit, offset);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'UUID生成履歴を取得しました',
      tdMessage: `🤖 TD: ${result.history.length}件の履歴を取得しました（全${result.total}件中）`,
      timestamp: new Date().toISOString(),
      metadata: {
        page: Math.floor(offset / limit) + 1,
        limit,
        total: result.total,
        duration: Date.now() - startTime
      }
    };

<<<<<<< HEAD
    res.json(response);
=======
    return res.json(response);
>>>>>>> d360437c6ca0c005be955fae6ad01b33c9dd0472

  } catch (error: any) {
    console.error('❌ UUID履歴取得API エラー:', error);
    
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'HISTORY_FETCH_ERROR',
        message: error.message || 'UUID履歴の取得に失敗しました',
        statusCode: 500,
        tdMessage: '🤖 TD: 履歴の取得でエラーが発生しました',
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method
      },
      timestamp: new Date().toISOString()
    };

<<<<<<< HEAD
    res.status(500).json(response);
=======
    return res.status(500).json(response);
>>>>>>> d360437c6ca0c005be955fae6ad01b33c9dd0472
  }
});

// 📈 UUID統計情報取得エンドポイント
router.get('/statistics', async (req: express.Request, res: express.Response) => {
  const startTime = Date.now();
  
  try {
    console.log('🤖 TD: UUID統計情報を取得中...');

    const result = await uuidService.getStatistics();

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'UUID統計情報を取得しました',
      tdMessage: `🤖 TD: 累計${result.totalGenerated}個のUUIDが生成されています！`,
      timestamp: new Date().toISOString(),
      metadata: {
        duration: Date.now() - startTime
      }
    };

<<<<<<< HEAD
    res.json(response);
=======
    return res.json(response);
>>>>>>> d360437c6ca0c005be955fae6ad01b33c9dd0472

  } catch (error: any) {
    console.error('❌ UUID統計取得API エラー:', error);
    
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'STATISTICS_FETCH_ERROR',
        message: error.message || 'UUID統計情報の取得に失敗しました',
        statusCode: 500,
        tdMessage: '🤖 TD: 統計情報の取得でエラーが発生しました',
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method
      },
      timestamp: new Date().toISOString()
    };

<<<<<<< HEAD
    res.status(500).json(response);
=======
    return res.status(500).json(response);
>>>>>>> d360437c6ca0c005be955fae6ad01b33c9dd0472
  }
});

export default router; 