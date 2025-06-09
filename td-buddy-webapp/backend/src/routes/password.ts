import express from 'express';
import { PasswordService } from '../services/passwordService';
import { PasswordGenerateRequest } from '../types/api';
import { AppError } from '../middleware/errorHandler';
import { Router, Request, Response } from 'express';
import { CompositionPasswordService } from '../services/CompositionPasswordService';
import { 
  PasswordGenerateResponse, 
  CompositionPasswordRequest,
  CompositionPasswordResponse,
  APIResponse 
} from '../types/api';

const router = express.Router();
const passwordService = new PasswordService();
const compositionPasswordService = new CompositionPasswordService();

/**
 * パスワード生成エンドポイント
 * POST /api/password/generate
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const criteria: PasswordGenerateRequest = req.body;
    const userSession = req.headers['x-session-id'] as string;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    // 基本バリデーション
    if (!criteria) {
      throw new AppError('リクエストボディが必要です', 400, 'MISSING_BODY');
    }

    // パスワード長のバリデーション
    if (!criteria.length || criteria.length < 4 || criteria.length > 128) {
      throw new AppError(
        'パスワード長は4文字以上128文字以下で指定してください',
        400,
        'INVALID_LENGTH'
      );
    }

    // 生成数のバリデーション
    if (!criteria.count || criteria.count < 1 || criteria.count > 100) {
      throw new AppError(
        '生成数は1個以上100個以下で指定してください',
        400,
        'INVALID_COUNT'
      );
    }

    // 文字種の最低条件チェック
    const hasCharacterTypes = criteria.includeUppercase || 
                             criteria.includeLowercase || 
                             criteria.includeNumbers || 
                             criteria.includeSymbols ||
                             (criteria.customCharacters && criteria.customCharacters.length > 0);

    if (!hasCharacterTypes) {
      throw new AppError(
        '少なくとも一つの文字種を選択してください',
        400,
        'NO_CHARACTER_TYPES'
      );
    }

    // パスワード生成実行
    const result = await passwordService.generatePasswords(
      criteria,
      userSession,
      ipAddress,
      userAgent
    );

    const response: APIResponse<PasswordGenerateResponse> = {
      success: true,
      data: result,
      tdMessage: `${result.strength}強度のパスワードを${result.passwords.length}個生成しました！安全に使用してくださいね♪`,
      timestamp: new Date().toISOString(),
      requestId: `pwd-${Date.now()}-${Math.random().toString(36).substring(7)}`
    };

    res.json(response);
  } catch (error) {
    console.error('パスワード生成エラー:', error);
    
    const response: APIResponse<null> = {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'パスワード生成に失敗しました',
        code: 'PASSWORD_GENERATION_ERROR',
        details: error instanceof Error ? error.stack : undefined
      },
      tdMessage: 'エラーが発生しました... 設定を確認して再度お試しください',
      timestamp: new Date().toISOString(),
      requestId: `pwd-err-${Date.now()}`
    };

    res.status(500).json(response);
  }
});

/**
 * 構成プリセット対応パスワード生成エンドポイント
 * POST /api/password/generate-with-composition
 */
router.post('/generate-with-composition', async (req: Request, res: Response) => {
  try {
    const criteria: CompositionPasswordRequest = req.body;
    const userSession = req.headers['x-session-id'] as string;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    // リクエスト詳細をログ出力
    console.log('🔍 リクエスト詳細:', JSON.stringify({
      composition: criteria.composition,
      useUppercase: criteria.useUppercase,
      useLowercase: criteria.useLowercase,
      useNumbers: criteria.useNumbers,
      useSymbols: criteria.useSymbols,
      length: criteria.length,
      count: criteria.count
    }, null, 2));

    const result = await compositionPasswordService.generateWithComposition(
      criteria, 
      userSession, 
      ipAddress, 
      userAgent
    );

    // TDメッセージの生成
    let tdMessage = '';
    if (criteria.composition === 'none') {
      tdMessage = `${result.strength}強度のパスワードを${result.passwords.length}個生成しました！`;
    } else {
      const satisfiedCount = result.composition.appliedRequirements.filter(req => req.satisfied).length;
      const totalCount = result.composition.appliedRequirements.length;
      tdMessage = `${criteria.composition}プリセットで${result.strength}強度のパスワードを${result.passwords.length}個生成しました！要件満足度: ${satisfiedCount}/${totalCount} ♪`;
    }

    const response: APIResponse<CompositionPasswordResponse> = {
      success: true,
      data: result,
      tdMessage,
      timestamp: new Date().toISOString(),
      requestId: `pwd-comp-${Date.now()}-${Math.random().toString(36).substring(7)}`
    };

    res.json(response);
  } catch (error) {
    console.error('構成プリセット付きパスワード生成エラー:', error);
    
    const response: APIResponse<null> = {
      success: false,
      error: {
        message: error instanceof Error ? error.message : '構成プリセット付きパスワード生成に失敗しました',
        code: 'COMPOSITION_PASSWORD_GENERATION_ERROR',
        details: error instanceof Error ? error.stack : undefined
      },
      tdMessage: 'エラーが発生しました... 構成設定を確認して再度お試しください',
      timestamp: new Date().toISOString(),
      requestId: `pwd-comp-err-${Date.now()}`
    };

    res.status(500).json(response);
  }
});

/**
 * プリセット一覧取得エンドポイント
 * GET /api/password/presets
 */
router.get('/presets', async (req: Request, res: Response) => {
  try {
    const presets = compositionPasswordService.getAvailablePresets();

    const response: APIResponse<any> = {
      success: true,
      data: {
        presets,
        categories: {
          'none': { label: '基本設定', description: '文字種を自由に選択' },
          'standard': { label: '標準プリセット', description: 'よく使用される構成' },
          'custom': { label: 'カスタム設定', description: '高度なカスタマイズ' }
        }
      },
      tdMessage: '利用可能な構成プリセット一覧です♪ お好みの設定を選択してください！',
      timestamp: new Date().toISOString(),
      requestId: `presets-${Date.now()}`
    };

    res.json(response);
  } catch (error) {
    console.error('プリセット取得エラー:', error);
    
    const response: APIResponse<null> = {
      success: false,
      error: {
        message: 'プリセット情報の取得に失敗しました',
        code: 'PRESETS_FETCH_ERROR',
        details: error instanceof Error ? error.stack : undefined
      },
      tdMessage: 'プリセット情報の取得に失敗しました... 再度お試しください',
      timestamp: new Date().toISOString(),
      requestId: `presets-err-${Date.now()}`
    };

    res.status(500).json(response);
  }
});

/**
 * パスワード強度分析エンドポイント
 * POST /api/password/analyze
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { password } = req.body;

    if (!password || typeof password !== 'string') {
      throw new Error('パスワードが指定されていません');
    }

    const analysis = await passwordService.analyzePasswordStrength(password);

    const response: APIResponse<any> = {
      success: true,
      data: analysis,
      tdMessage: `パスワード強度: ${analysis.strength} (${analysis.score}/${analysis.maxScore}点)。${analysis.recommendations.length > 0 ? '改善提案があります！' : '良好な強度です♪'}`,
      timestamp: new Date().toISOString(),
      requestId: `analyze-${Date.now()}`
    };

    res.json(response);
  } catch (error) {
    console.error('パスワード分析エラー:', error);
    
    const response: APIResponse<null> = {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'パスワード分析に失敗しました',
        code: 'PASSWORD_ANALYSIS_ERROR',
        details: error instanceof Error ? error.stack : undefined
      },
      tdMessage: 'パスワード分析に失敗しました... 再度お試しください',
      timestamp: new Date().toISOString(),
      requestId: `analyze-err-${Date.now()}`
    };

    res.status(500).json(response);
  }
});

/**
 * 生成履歴取得エンドポイント
 * GET /api/password/history
 */
router.get('/history', async (req, res, next) => {
  try {
    const userSession = req.headers['x-session-id'] as string;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = Math.max(parseInt(req.query.offset as string) || 0, 0);

    const history = await passwordService.getGenerationHistory(userSession, limit, offset);

    res.status(200).json({
      success: true,
      data: history,
      tdMessage: `${history.total}件の履歴からお探しの情報を見つけました！`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    next(error);
  }
});

/**
 * 統計情報取得エンドポイント
 * GET /api/password/stats
 */
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await passwordService.getStatistics();

    res.status(200).json({
      success: true,
      data: stats,
      tdMessage: 'パスワード生成の統計情報をお持ちしました！',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    next(error);
  }
});

/**
 * ヘルスチェックエンドポイント
 * GET /api/password/health
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'password-generation',
    timestamp: new Date().toISOString(),
    tdMessage: 'パスワード生成サービスは正常に動作しています♪'
  });
});

export default router; 