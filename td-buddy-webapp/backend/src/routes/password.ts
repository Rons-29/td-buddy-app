import express from 'express';
import { PasswordService } from '../services/passwordService';
import { PasswordGenerateRequest } from '../types/api';
import { AppError } from '../middleware/errorHandler';

const router = express.Router();
const passwordService = new PasswordService();

/**
 * パスワード生成エンドポイント
 * POST /api/password/generate
 */
router.post('/generate', async (req, res, next) => {
  try {
    const criteria: PasswordGenerateRequest = req.body;
    const userSession = req.headers['x-session-id'] as string;
    const ipAddress = req.ip;
    const userAgent = req.get('User-Agent');

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

    // 成功レスポンス
    res.status(200).json({
      success: true,
      data: result,
      tdMessage: `${result.strength}強度のパスワードを${result.passwords.length}個生成しました！安全に使用してくださいね♪`,
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] || `pwd-${Date.now()}`
    });

  } catch (error) {
    next(error); // エラーハンドリングミドルウェアに委譲
  }
});

/**
 * パスワード強度分析エンドポイント
 * POST /api/password/analyze
 */
router.post('/analyze', async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password || typeof password !== 'string') {
      throw new AppError('分析するパスワードが必要です', 400, 'MISSING_PASSWORD');
    }

    if (password.length > 1000) {
      throw new AppError('パスワードが長すぎます', 400, 'PASSWORD_TOO_LONG');
    }

    const analysis = await passwordService.analyzePasswordStrength(password);

    res.status(200).json({
      success: true,
      data: analysis,
      tdMessage: `パスワード強度は${analysis.strength}です。${analysis.recommendations.length > 0 ? '改善提案もありますよ！' : '素晴らしい強度です！'}`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    next(error);
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