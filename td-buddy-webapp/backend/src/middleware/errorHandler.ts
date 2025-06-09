import { Request, Response, NextFunction } from 'express';
import { tdLog } from './requestLogger';

/**
 * アプリケーション固有のエラー型
 */
export class AppError extends Error {
  public statusCode: number;
  public code: string | undefined;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * グローバルエラーハンドリングミドルウェア
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // エラー情報の収集
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || 'Unknown';
  const userAgent = req.get('User-Agent') || 'Unknown';

  // AppErrorかどうかの判定
  const isAppError = error instanceof AppError;
  const statusCode = isAppError ? error.statusCode : 500;
  const errorCode = isAppError ? error.code : 'INTERNAL_SERVER_ERROR';

  // エラーログの出力
  console.error(`
🚨 Error occurred:
- Message: ${error.message}
- Status: ${statusCode}
- Code: ${errorCode}
- Method: ${method}
- URL: ${url}
- IP: ${ip}
- User-Agent: ${userAgent}
- Timestamp: ${timestamp}
- Stack: ${error.stack}
  `);

  // TDキャラクターからのエラーメッセージ
  tdLog(`エラーが発生しました: ${error.message}`, 'error');

  // 本番環境では詳細なエラー情報を隠す
  const isDevelopment = process.env.NODE_ENV === 'development';

  // TDからの励ましメッセージ
  const tdMessages = [
    'エラーから学んで、より強くなりましょう！',
    '大丈夫です。TDがサポートします♪',
    '一緒に問題を解決しましょう！',
    'エラーも成長の機会ですね',
    '次は上手くいきますよ！'
  ];
  
  const randomTdMessage = tdMessages[Math.floor(Math.random() * tdMessages.length)];

  // レスポンス用のエラー情報
  const errorResponse = {
    error: true,
    message: error.message,
    statusCode,
    code: errorCode,
    timestamp,
    path: url,
    tdMessage: randomTdMessage,
    ...(isDevelopment && {
      stack: error.stack,
      details: {
        method,
        ip,
        userAgent
      }
    })
  };

  res.status(statusCode).json(errorResponse);
};

/**
 * 未処理の例外をキャッチ
 */
process.on('uncaughtException', (error: Error) => {
  console.error('🚨 Uncaught Exception:', error);
  tdLog('予期しないエラーが発生しました。サーバーを安全に終了します。', 'error');
  process.exit(1);
});

/**
 * 未処理のPromise拒否をキャッチ
 */
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error('🚨 Unhandled Promise Rejection:', reason);
  tdLog('未処理のPromise拒否を検出しました。', 'error');
  console.error('Promise:', promise);
});

// 404エラーハンドラー
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(
    `エンドポイント ${req.originalUrl} は存在しません`,
    404,
    'NOT_FOUND'
  );
  next(error);
};

// 非同期エラーキャッチャー
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 