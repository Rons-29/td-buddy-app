import express from 'express';
import { PasswordGenerateRequest } from '../types/api';

const router = express.Router();

// 仮のPasswordService（依存関係が解決されるまで）
class PasswordService {
  async generatePasswords(criteria: PasswordGenerateRequest): Promise<any> {
    const passwords: string[] = [];
    
    // 簡単なパスワード生成（後で改善）
    for (let i = 0; i < criteria.count; i++) {
      passwords.push(this.generateSimplePassword(criteria.length));
    }

    return {
      passwords,
      criteria,
      strength: 'medium',
      estimatedCrackTime: '数時間',
      generatedAt: new Date().toISOString()
    };
  }

  private generateSimplePassword(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

const passwordService = new PasswordService();

// パスワード生成エンドポイント
router.post('/generate', async (req, res) => {
  try {
    const criteria: PasswordGenerateRequest = req.body;

    // バリデーション
    if (!criteria.length || criteria.length < 4 || criteria.length > 128) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_LENGTH',
          message: 'パスワード長は4文字以上128文字以下で指定してください',
          statusCode: 400,
          tdMessage: 'パスワードの長さが適切ではありません。4文字から128文字の間で設定してくださいね！',
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
          method: req.method
        }
      });
    }

    if (!criteria.count || criteria.count < 1 || criteria.count > 100) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_COUNT',
          message: '生成数は1個以上100個以下で指定してください',
          statusCode: 400,
          tdMessage: '生成するパスワードの数が多すぎるか少なすぎます。1個から100個の間で指定してくださいね！',
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
          method: req.method
        }
      });
    }

    // パスワード生成
    const result = await passwordService.generatePasswords(criteria);

    return res.status(200).json({
      success: true,
      data: result,
      tdMessage: `${result.passwords.length}個のパスワードを生成しました！`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Password generation error:', error);
    
    return res.status(500).json({
      success: false,
      error: {
        code: 'PASSWORD_GENERATION_FAILED',
        message: 'パスワード生成に失敗しました',
        statusCode: 500,
        tdMessage: 'パスワード生成中にエラーが発生しました。もう一度お試しください。',
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        method: req.method
      }
    });
  }
});

module.exports = router; 