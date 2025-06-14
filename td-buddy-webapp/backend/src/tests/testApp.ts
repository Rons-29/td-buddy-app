/**
 * テスト専用アプリケーション設定
 * TD Buddy - Test Application Setup
 */

import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { database } from '../database/database';
import { errorHandler } from '../middleware/errorHandler';
import { requestLogger } from '../middleware/requestLogger';

// ルートのインポート
import aiRoutes from '../routes/ai';
import datetimeRoutes from '../routes/datetime';
import exportRoutes from '../routes/export';
import healthRoutes from '../routes/health';
import numberbooleanRoutes from '../routes/numberboolean';
import passwordRoutes from '../routes/password';
import { personalRouter } from '../routes/personal';
import uuidRoutes from '../routes/uuid';

const app = express();

// セキュリティヘッダー設定（テスト用に簡略化）
app.use(
  helmet({
    contentSecurityPolicy: false, // テスト環境では無効化
  })
);

// CORS設定
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-Session-ID',
      'X-Request-ID',
    ],
  })
);

// レート制限設定（テスト用に緩和）
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 1000, // テスト用に大幅に緩和
  message: {
    error: 'レート制限に達しました',
    message: 'しばらく時間をおいてから再度お試しください',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// リクエストログ（テスト時は抑制）
if (process.env.TEST_VERBOSE === 'true') {
  app.use(requestLogger);
}

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
    message: '🤖 TestData Buddy Backend (Test Mode)',
    timestamp: new Date().toISOString(),
    version: '1.0.0-test',
    uptime: process.uptime(),
  });
});

// API ルート設定
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
    message: '🤖 TestData Buddy API Server (Test Mode)',
    version: '1.0.0-test',
    endpoints: {
      health: '/health',
      password: '/api/password',
      personal: '/api/personal',
      uuid: '/api/uuid',
      datetime: '/api/datetime',
      numberboolean: '/api/numberboolean',
      claude: '/api/claude',
      export: '/api/export',
    },
    tdMessage: 'テストモードで動作中です！',
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

// テスト用データベース初期化
let isInitialized = false;

export async function initializeTestApp() {
  if (!isInitialized) {
    try {
      await database.initialize();
      console.log('✅ テスト用データベース初期化完了');
      isInitialized = true;
    } catch (error) {
      console.error('❌ テスト用データベース初期化エラー:', error);
      throw error;
    }
  }
  return app;
}

export default app;
