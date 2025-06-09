import { Request, Response, NextFunction } from 'express';

// カスタムエラークラス
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code: string | undefined;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

// エラーハンドリングミドルウェア
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'サーバー内部エラーが発生しました';
  let code = 'INTERNAL_SERVER_ERROR';

  // AppError の場合
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code || 'APP_ERROR';
  }
  // バリデーションエラー
  else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'バリデーションエラーが発生しました';
    code = 'VALIDATION_ERROR';
  }
  // MongoDB/SQLエラー
  else if (error.name === 'CastError') {
    statusCode = 400;
    message = '無効なIDが指定されました';
    code = 'INVALID_ID';
  }
  // JWT エラー
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = '無効なトークンです';
    code = 'INVALID_TOKEN';
  }
  // その他のエラー
  else {
    // 開発環境では詳細なエラーメッセージを表示
    if (process.env.NODE_ENV === 'development') {
      message = error.message;
    }
  }

  // エラーログ出力
  console.error(`
🚨 Error Details:
- Message: ${error.message}
- Stack: ${error.stack}
- Status: ${statusCode}
- Method: ${req.method}
- URL: ${req.originalUrl}
- IP: ${req.ip}
- User-Agent: ${req.get('User-Agent')}
- Timestamp: ${new Date().toISOString()}
  `);

  // TDからのエラーメッセージ生成
  const getTDErrorMessage = (statusCode: number): string => {
    switch (statusCode) {
      case 400:
        return '申し訳ありません！入力内容に問題があるようです。確認していただけますか？';
      case 401:
        return 'おや？認証が必要なようです。ログインしていただけますか？';
      case 403:
        return 'すみません、この操作の権限がないようです。';
      case 404:
        return 'あれ？お探しのものが見つからないようです。URLを確認していただけますか？';
      case 429:
        return 'ちょっと忙しくなってしまいました！少し時間をおいてから再度お試しください。';
      case 500:
      default:
        return 'ごめんなさい！何かエラーが発生してしまいました。もう一度試していただけますか？';
    }
  };

  // レスポンス送信
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      statusCode,
      tdMessage: getTDErrorMessage(statusCode),
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method,
      // 開発環境でのみスタックトレースを含める
      ...(process.env.NODE_ENV === 'development' && { 
        stack: error.stack,
        details: error 
      })
    }
  });
};

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