import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { createServer } from 'http';
import { database } from './database/database';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

// Logger setup
const logger = console;

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// セキュリティヘッダー設定
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.anthropic.com'],
        fontSrc: ["'self'", 'https:', 'data:'],
      },
    },
  })
);

// CORS設定
app.use(
  cors({
    origin: [
      'http://localhost:3000', // Next.js開発サーバー
      'http://127.0.0.1:3000',
      process.env.FRONTEND_URL || 'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-Session-ID', // セッションID用ヘッダー
      'X-Request-ID', // リクエストID用ヘッダー（将来用）
    ],
  })
);

// レート制限設定
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15分
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 最大100リクエスト
  message: {
    error: 'レート制限に達しました',
    message: 'しばらく時間をおいてから再度お試しください',
    retryAfter: Math.ceil(
      (Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000
    ),
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// リクエストログ
app.use(requestLogger);

// JSON parser設定
app.use(
  express.json({
    limit: '10mb',
    type: 'application/json',
  })
);

// URL encoded parser設定
app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: '🍺 QA Workbench Backend is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
  });
});

// API ルート設定
import aiRoutes from './routes/ai';
import datetimeRoutes from './routes/datetime';
import exportRoutes from './routes/export';
import healthRoutes from './routes/health';
import numberbooleanRoutes from './routes/numberboolean';
import passwordRoutes from './routes/password';
import { personalRouter } from './routes/personal';
import uuidRoutes from './routes/uuid';

app.use('/api/password', passwordRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/personal', personalRouter);
app.use('/api/ai', aiRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/uuid', uuidRoutes);
app.use('/api/datetime', datetimeRoutes);
app.use('/api/numberboolean', numberbooleanRoutes);

// ルートエンドポイント
app.get('/', (req, res) => {
  res.json({
    message: '🍺 QA Workbench API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      password: '/api/password',
      personal: '/api/personal',
      uuid: '/api/uuid',
      datetime: '/api/datetime',
      numberboolean: '/api/numberboolean',
      claude: '/api/claude',
      export: '/api/export',
      docs: '/api/docs',
    },
    brewMessage:
      'こんにちは！TDのバックエンドサーバーです。API経由でデータ生成をお手伝いします♪',
  });
});

// 存在しないルートの処理
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `エンドポイント ${req.originalUrl} は存在しません`,
    availableEndpoints: [
      '/health',
      '/api/password',
      '/api/personal',
      '/api/uuid',
      '/api/datetime',
      '/api/numberboolean',
      '/api/claude',
      '/api/export',
    ],
  });
});

// エラーハンドリングミドルウェア（最後に設定）
app.use(errorHandler);

// データベース初期化とサーバー起動
async function startServer() {
  try {
    await database.initialize();
    logger.log('✅ データベース初期化完了');

    // HTTPサーバーを作成
    const httpServer = createServer(app);

    // WebSocketサービスを初期化
    logger.log('🔌 WebSocketサービス初期化完了');

    const server = httpServer.listen(PORT, () => {
      logger.log(`
🍺 QA Workbench Backend Server Started!
🚀 Server running on port ${PORT}
🌐 Environment: ${process.env.NODE_ENV || 'development'}
📡 Health check: http://localhost:${PORT}/health
🔌 WebSocket server: enabled
🎯 Ready to generate test data!

Brewからのメッセージ: サーバーが正常に起動しました！リアルタイム通信とAPI経由でデータ生成のお手伝いをします♪
      `);
    });

    return server;
  } catch (error) {
    logger.error('❌ サーバー起動エラー:', error);
    process.exit(1);
  }
}

// サーバー起動
let serverInstance: any;
startServer().then(server => {
  serverInstance = server;
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.log('🍺 Brew: サーバーを安全にシャットダウンします...');
  if (serverInstance) {
    serverInstance.close(() => {
      logger.log('✅ サーバーが正常に終了しました');
      process.exit(0);
    });
  }
});

process.on('SIGINT', () => {
  logger.log('🍺 Brew: サーバーを安全にシャットダウンします...');
  if (serverInstance) {
    serverInstance.close(() => {
      logger.log('✅ サーバーが正常に終了しました');
      process.exit(0);
    });
  }
});

export default app;
