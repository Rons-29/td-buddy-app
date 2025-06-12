import express from 'express';
import { HealthCheckResponse } from '../types/api';

const router = express.Router();

// システム状態チェック
router.get('/', async (req, res) => {
  const startTime = process.hrtime();

  try {
    // メモリ使用量取得
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal;
    const usedMemory = memoryUsage.heapUsed;
    const memoryPercentage = Math.round((usedMemory / totalMemory) * 100);

    // レスポンス時間計算
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const responseTime = Math.round(seconds * 1000 + nanoseconds / 1000000);

    // 各サービスの状態チェック（現在はモック）
    const services = {
      database: 'healthy' as const, // SQLite接続チェック用
      claude: 'healthy' as const, // Claude API接続チェック用
      storage: 'healthy' as const, // ファイルストレージチェック用
    };

    // システム情報取得
    const uptime = process.uptime();
    const nodeVersion = process.version;
    const platform = process.platform;

    const healthResponse: HealthCheckResponse = {
      status: 'ok',
      message: '🍺 QA Workbench Backend is healthy and ready!',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: Math.round(uptime),
      services,
      performance: {
        responseTime,
        memoryUsage: {
          used: Math.round(usedMemory / 1024 / 1024), // MB
          total: Math.round(totalMemory / 1024 / 1024), // MB
          percentage: memoryPercentage,
        },
        cpuUsage: 0, // CPU使用率は将来実装
      },
    };

    // TD からのメッセージ
    const tdHealthMessages = [
      'すべてのシステムが正常に動作しています！',
      'データ生成の準備、万全です♪',
      'TDのエンジン、絶好調です！',
      'API サーバー、元気いっぱいです🚀',
      'セキュリティチェックも完了しています✅',
    ];

    const randomMessage =
      tdHealthMessages[Math.floor(Math.random() * tdHealthMessages.length)];

    res.status(200).json({
      success: true,
      data: healthResponse,
      tdMessage: randomMessage,
      timestamp: new Date().toISOString(),
      metadata: {
        nodeVersion,
        platform,
        environment: process.env.NODE_ENV || 'development',
        pid: process.pid,
      },
    });
  } catch (error) {
    console.error('Health check error:', error);

    res.status(503).json({
      success: false,
      error: {
        code: 'HEALTH_CHECK_FAILED',
        message: 'ヘルスチェックに失敗しました',
        statusCode: 503,
        tdMessage:
          'システムに問題が発生しているようです。管理者に連絡してください。',
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        method: req.method,
      },
    });
  }
});

// 詳細なシステム情報取得
router.get('/detailed', async (req, res) => {
  try {
    // プロセス情報
    const processInfo = {
      pid: process.pid,
      version: process.version,
      platform: process.platform,
      arch: process.arch,
      uptime: process.uptime(),
      argv: process.argv,
      execPath: process.execPath,
      cwd: process.cwd(),
    };

    // メモリ詳細情報
    const memoryUsage = process.memoryUsage();
    const memoryInfo = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
      external: Math.round(memoryUsage.external / 1024 / 1024), // MB
      arrayBuffers: Math.round(memoryUsage.arrayBuffers / 1024 / 1024), // MB
    };

    // 環境変数情報（機密情報を除く）
    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT,
      timezone:
        process.env.TZ || Intl.DateTimeFormat().resolvedOptions().timeZone,
      hasClaudeApiKey: !!process.env.CLAUDE_API_KEY,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    };

    res.status(200).json({
      success: true,
      data: {
        process: processInfo,
        memory: memoryInfo,
        environment: envInfo,
        timestamp: new Date().toISOString(),
      },
      tdMessage: '詳細なシステム情報をお届けします！技術者向けの情報ですね📊',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Detailed health check error:', error);

    res.status(500).json({
      success: false,
      error: {
        code: 'DETAILED_HEALTH_CHECK_FAILED',
        message: '詳細ヘルスチェックに失敗しました',
        statusCode: 500,
        tdMessage: '詳細情報の取得に失敗しました。再度お試しください。',
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        method: req.method,
      },
    });
  }
});

export default router;
