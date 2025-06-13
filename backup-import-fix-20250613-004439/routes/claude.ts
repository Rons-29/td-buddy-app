import express 

const router = express.Router();

// Claude AI データ生成（プレースホルダー）
router.post('/generate', async (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Claude AI連携機能は現在開発中です',
      statusCode: 501,
      brewMessage: 'AI機能はPhase 3で実装予定です。もう少しお待ちくださいね！',
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method
    }
  });
});

module.exports = router; 
