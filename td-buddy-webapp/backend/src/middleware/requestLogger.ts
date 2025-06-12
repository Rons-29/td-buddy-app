 Request, Response, NextFunction } 

/**
 * リクエストログミドルウェア
 * すべてのAPIリクエストの詳細をログに記録
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const userAgent = req.get('User-Agent') || 'Unknown';
  const ip = req.ip || req.connection.remoteAddress || 'Unknown';

  // リクエスト開始ログ
  logger.log(`📝 [${timestamp}] ${method} ${url} - IP: ${ip}`);

  // レスポンス完了時のログ
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const statusEmoji = statusCode >= 400 ? '❌' : statusCode >= 300 ? '⚠️' : '✅';
    
    logger.log(`${statusEmoji} [${timestamp}] ${method} ${url} - ${statusCode} - ${duration}ms - IP: ${ip}`);
    
    // エラー時の詳細ログ
    if (statusCode >= 400) {
      logger.log(`🔍 Error Details - UA: ${userAgent}, Body: ${JSON.stringify(req.body)}`);
    }
  });

  next();
};

/**
 * TDキャラクター付きログ出力
 */
export const tdLog = (message: string, level: 'info' | 'warn' | 'error' = 'info'): void => {
  const timestamp = new Date().toISOString();
  const emoji = level === 'error' ? '🚨' : level === 'warn' ? '⚠️' : '🍺';
  
  logger.log(`${emoji} TD [${timestamp}]: ${message}`);
};

// 機密情報をサニタイズする関数

// Brewからのログメッセージ生成

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
