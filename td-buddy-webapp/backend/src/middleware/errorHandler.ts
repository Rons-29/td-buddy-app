import { Request, Response, NextFunction } from 'express';

// ロガー設定
const logger = console;

/**
 * グローバルエラーハンドリングミドルウェア
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('🚨 Unhandled Error:', err);
  
  // エラーレスポンス
  res.status(500).json({
    error: 'Internal Server Error',
    message: '予期しないエラーが発生しました',
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] || 'unknown'
  });
};

export default errorHandler;
