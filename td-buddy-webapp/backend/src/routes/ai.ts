import express from 'express';
import { AIService } from '../services/AIService';
import { RequestValidator } from '../services/validation/RequestValidator';
import { PersonalInfoService } from '../services/PersonalInfoService';

const router = express.Router();
const aiService = new AIService();
const personalInfoService = new PersonalInfoService();

// AI Service初期化（サーバー起動時に実行）
let aiInitialized = false;

/**
 * AI Service初期化
 */
async function initializeAI() {
  if (!aiInitialized) {
    try {
      await aiService.initialize();
      aiInitialized = true;
      console.log('🤖 AI Service初期化完了');
    } catch (error: any) {
      console.error('❌ AI Service初期化失敗:', error);
      // 初期化失敗でもサーバーは起動継続
    }
  }
}

// サーバー起動時に初期化実行
initializeAI();

/**
 * POST /api/ai/parse
 * 自然言語をデータ生成パラメータに変換
 */
router.post('/parse', async (req, res) => {
  try {
    if (!aiInitialized) {
      return res.status(503).json({
        success: false,
        error: 'AI Service not available',
        message: 'AI機能が利用できません。管理者にお問い合わせください。'
      });
    }

    const { userInput, provider } = req.body;

    if (!userInput || typeof userInput !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'userInputは必須です',
        code: 'VALIDATION_ERROR'
      });
    }

    // 強化されたバリデーション実行
    const validation = RequestValidator.validateComplete(userInput);
    
    if (!validation.isValid || !validation.isSafe) {
      console.log('❌ バリデーションエラー:', {
        errors: validation.errors,
        securityIssues: validation.securityIssues.filter(issue => issue.severity === 'HIGH')
      });
      
      return res.status(400).json({
        success: false,
        error: '入力が無効か安全でない内容が含まれています',
        code: 'VALIDATION_ERROR',
        details: {
          errors: validation.errors,
          warnings: validation.warnings,
          securityIssues: validation.securityIssues
        },
        timestamp: new Date().toISOString()
      });
    }

    // 警告がある場合はログに記録
    if (validation.warnings.length > 0) {
      console.log('⚠️  入力警告:', validation.warnings);
    }

    console.log(`🔍 AI解析リクエスト: "${userInput}" (${provider || 'default'})`);

    const result = await aiService.parseNaturalLanguageRequest(userInput, provider);

    return res.json({
      success: true,
      result,
      provider: provider || aiService.getDefaultProvider(),
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ AI解析エラー:', error);
    
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      code: error.code || 'AI_PARSE_ERROR',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/ai/status
 * AI Service状態確認
 */
router.get('/status', async (req, res) => {
  try {
    const stats = aiService.getStats();
    let healthCheck = {};
    
    if (aiInitialized) {
      healthCheck = await aiService.healthCheck();
    }

    res.json({
      success: true,
      initialized: aiInitialized,
      stats,
      healthCheck,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ AI状態確認エラー:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router; 