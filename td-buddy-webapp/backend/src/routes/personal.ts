import express from 'express';

const router = express.Router();

// 個人情報生成（プレースホルダー）
router.post('/generate', async (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: '個人情報生成機能は現在開発中です',
      statusCode: 501,
      tdMessage: 'この機能はPhase 2で実装予定です。お楽しみに！',
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method
    }
  });
});

module.exports = router; 