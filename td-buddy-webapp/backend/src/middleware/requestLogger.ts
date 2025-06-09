import { Request, Response, NextFunction } from 'express';

// リクエストログ用の型定義
interface LogRequest extends Request {
  startTime?: number;
}

// リクエストログミドルウェア
export const requestLogger = (req: LogRequest, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  req.startTime = startTime;

  // リクエスト開始ログ
  console.log(`
🚀 Request Started:
- Method: ${req.method}
- URL: ${req.originalUrl}
- IP: ${req.ip}
- User-Agent: ${req.get('User-Agent') || 'Unknown'}
- Content-Type: ${req.get('Content-Type') || 'None'}
- Content-Length: ${req.get('Content-Length') || 'None'}
- Timestamp: ${new Date().toISOString()}
  `);

  // リクエストボディのログ（機密情報を除く）
  if (req.body && Object.keys(req.body).length > 0) {
    const sanitizedBody = sanitizeRequestBody(req.body);
    console.log(`📝 Request Body:`, sanitizedBody);
  }

  // レスポンス完了時のログ
  const originalSend = res.send;
  res.send = function(body) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`
✅ Request Completed:
- Method: ${req.method}
- URL: ${req.originalUrl}
- Status: ${res.statusCode}
- Duration: ${duration}ms
- Response Size: ${Buffer.byteLength(body || '', 'utf8')} bytes
- Timestamp: ${new Date().toISOString()}
${getTDLogMessage(res.statusCode, duration)}
    `);

    return originalSend.call(this, body);
  };

  next();
};

// 機密情報をサニタイズする関数
const sanitizeRequestBody = (body: any): any => {
  const sensitiveFields = [
    'password', 'token', 'apiKey', 'secret', 'key',
    'authorization', 'auth', 'credential', 'private'
  ];

  if (typeof body !== 'object' || body === null) {
    return body;
  }

  const sanitized = { ...body };

  Object.keys(sanitized).forEach(key => {
    const lowerKey = key.toLowerCase();
    if (sensitiveFields.some(field => lowerKey.includes(field))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeRequestBody(sanitized[key]);
    }
  });

  return sanitized;
};

// TDからのログメッセージ生成
const getTDLogMessage = (statusCode: number, duration: number): string => {
  let performanceMessage = '';
  if (duration < 100) {
    performanceMessage = '⚡ 高速レスポンス！';
  } else if (duration < 500) {
    performanceMessage = '👍 良好なレスポンス速度';
  } else if (duration < 1000) {
    performanceMessage = '⏰ 少し時間がかかりました';
  } else {
    performanceMessage = '🐌 レスポンスが遅めです';
  }

  let statusMessage = '';
  if (statusCode >= 200 && statusCode < 300) {
    statusMessage = '🤖 TD: リクエストが正常に処理されました！';
  } else if (statusCode >= 400 && statusCode < 500) {
    statusMessage = '🤖 TD: クライアントエラーが発生しました';
  } else if (statusCode >= 500) {
    statusMessage = '🤖 TD: サーバーエラーが発生しました';
  }

  return `- Performance: ${performanceMessage}\n- TD Message: ${statusMessage}`;
};

// APIアクセス統計用（将来の拡張用）
export const apiStats = {
  totalRequests: 0,
  successfulRequests: 0,
  errorRequests: 0,
  averageResponseTime: 0,
  startTime: Date.now(),

  // 統計更新
  updateStats(statusCode: number, duration: number) {
    this.totalRequests++;
    
    if (statusCode >= 200 && statusCode < 400) {
      this.successfulRequests++;
    } else {
      this.errorRequests++;
    }

    // 移動平均でレスポンス時間を計算
    this.averageResponseTime = (this.averageResponseTime * (this.totalRequests - 1) + duration) / this.totalRequests;
  },

  // 統計取得
  getStats() {
    const uptime = Date.now() - this.startTime;
    return {
      totalRequests: this.totalRequests,
      successfulRequests: this.successfulRequests,
      errorRequests: this.errorRequests,
      successRate: this.totalRequests > 0 ? (this.successfulRequests / this.totalRequests * 100).toFixed(2) + '%' : '0%',
      averageResponseTime: Math.round(this.averageResponseTime),
      uptime: Math.round(uptime / 1000) + 's',
      requestsPerMinute: this.totalRequests > 0 ? (this.totalRequests / (uptime / 60000)).toFixed(2) : '0'
    };
  }
}; 