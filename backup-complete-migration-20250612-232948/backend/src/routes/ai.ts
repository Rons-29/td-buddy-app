import express from 'express';
import { AIService } from '../services/AIService';
import { RequestValidator } from '../services/validation/RequestValidator';
import { PersonalInfoService } from '../services/PersonalInfoService';

const router = express.Router();
let aiService: AIService | null = null;
const personalInfoService = new PersonalInfoService();

// AI Service初期化関数
async function initializeAI() {
  try {
    console.log('🤖 AI Service初期化開始...');
    aiService = new AIService();
    await aiService.initialize();
    console.log('✅ AI Service初期化完了');
  } catch (error) {
    console.warn('⚠️ AI Service初期化失敗（デモモードで継続）:', error);
    // AIサービスが使用できない場合でも、アプリケーションは継続動作
    aiService = null;
  }
}

// AI Service初期化実行
initializeAI().catch(error => {
  console.warn('⚠️ AI初期化で予期しないエラー:', error);
});

/**
 * 自然言語解析エンドポイント
 */
router.post('/parse', async (req, res) => {
  try {
    const { message } = req.body;

    // 基本バリデーション
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'messageパラメータが必要です',
        code: 'VALIDATION_ERROR'
      });
    }

    // 入力検証
    const validation = RequestValidator.validateNaturalLanguageInput(message);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: '入力が無効です',
        code: 'VALIDATION_ERROR',
        details: validation.errors
      });
    }

    // AIサービスが利用できない場合のフォールバック
    if (!aiService) {
      console.log('🔄 AIサービス未初期化 - フォールバック処理実行');
      
      // シンプルなパターンマッチングによる解析
      const fallbackResult = parseFallback(message);
      
      return res.json({
        success: true,
        result: {
          params: fallbackResult.params,
          clarificationNeeded: fallbackResult.clarificationNeeded,
          clarificationQuestions: fallbackResult.clarificationQuestions
        },
        source: 'fallback'
      });
    }

    // AIサービスを使用した解析
    console.log('🧠 AI自然言語解析開始:', message);
    const result = await aiService.parseNaturalLanguageRequest(message);
    console.log('✅ AI解析完了:', result);

    return res.json({
      success: true,
      result,
      source: 'ai'
    });

  } catch (error) {
    console.error('❌ AI解析エラー:', error);
    
    // エラー時のフォールバック
    const fallbackMessage = req.body?.message || 'デフォルト要求';
    const fallbackResult = parseFallback(fallbackMessage);
    
    return res.json({
      success: true,
      result: {
        params: fallbackResult.params,
        clarificationNeeded: fallbackResult.clarificationNeeded,
        clarificationQuestions: fallbackResult.clarificationQuestions
      },
      source: 'fallback_error',
      warning: 'AI解析でエラーが発生したため、パターンマッチングで処理しました'
    });
  }
});

/**
 * フォールバック解析関数（AIサービスが利用できない場合）
 */
function parseFallback(message: string) {
  const result = {
    params: {
      count: 5,
      locale: 'ja',
      includeFields: ['fullName', 'email', 'phone'] as string[],
      filters: {}
    },
    clarificationNeeded: false,
    clarificationQuestions: [] as string[]
  };

  try {
    // 数字の抽出
    const countMatch = message.match(/(\d+)([人件個]|人)/);
    if (countMatch && countMatch[1]) {
      result.params.count = Math.min(100, Math.max(1, parseInt(countMatch[1])));
    }

    // 年齢の抽出
    const ageMatch = message.match(/(\d+)代/);
    if (ageMatch && ageMatch[1]) {
      const ageBase = parseInt(ageMatch[1]);
      result.params.filters = {
        ...result.params.filters,
        ageRange: { min: ageBase, max: ageBase + 9 }
      };
    }

    // 性別の抽出
    if (message.includes('男性') && !message.includes('女性')) {
      result.params.filters = { ...result.params.filters, gender: 'male' };
    } else if (message.includes('女性') && !message.includes('男性')) {
      result.params.filters = { ...result.params.filters, gender: 'female' };
    }

    // フィールドの抽出
    const fields = new Set(['fullName']);
    
    if (message.includes('連絡先') || message.includes('メール') || message.includes('電話')) {
      fields.add('email');
      fields.add('phone');
    }
    
    if (message.includes('詳細') || message.includes('住所') || message.includes('会社')) {
      fields.add('kanaName');
      fields.add('address');
      fields.add('age');
      fields.add('gender');
      fields.add('company');
      fields.add('jobTitle');
    }

    if (message.includes('エンジニア') || message.includes('営業') || message.includes('職業')) {
      fields.add('company');
      fields.add('jobTitle');
    }

    result.params.includeFields = Array.from(fields);

    console.log('🔄 フォールバック解析結果:', result);
    return result;

  } catch (error) {
    console.error('❌ フォールバック解析エラー:', error);
    return result; // デフォルト値を返す
  }
}

/**
 * GET /api/ai/status
 * AI Service状態確認
 */
router.get('/status', async (req, res) => {
  try {
    const stats = aiService?.getStats() || {};
    let healthCheck = {};
    
    if (aiService) {
      healthCheck = await aiService.healthCheck();
    }

    return res.json({
      success: true,
      initialized: aiService !== null,
      stats,
      healthCheck,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ AI状態確認エラー:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router; 