import { Request, Response, NextFunction } from 'express';
import { tdLog } from './requestLogger';

export interface ErrorWithStatus extends Error {
  status?: number;
  code?: string;
  details?: any;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    requestId?: string;
  };
}

// エラー種別の定義
export enum ErrorCodes {
  // バリデーションエラー
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_REQUEST = 'INVALID_REQUEST',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // 認証・認可エラー
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  
  // リソースエラー
  NOT_FOUND = 'NOT_FOUND',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  
  // レート制限エラー
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  
  // サーバーエラー
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  
  // パスワード生成固有のエラー
  PASSWORD_GENERATION_FAILED = 'PASSWORD_GENERATION_FAILED',
  INVALID_PASSWORD_CRITERIA = 'INVALID_PASSWORD_CRITERIA',
  CHARACTER_SET_EMPTY = 'CHARACTER_SET_EMPTY',
  PASSWORD_TOO_WEAK = 'PASSWORD_TOO_WEAK',
  
  // AI連携エラー
  AI_SERVICE_UNAVAILABLE = 'AI_SERVICE_UNAVAILABLE',
  AI_QUOTA_EXCEEDED = 'AI_QUOTA_EXCEEDED',
  AI_RESPONSE_INVALID = 'AI_RESPONSE_INVALID'
}

// カスタムエラークラス
export class TDError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: any;
  public readonly timestamp: string;

  constructor(
    message: string,
    status: number = 500,
    code: string = ErrorCodes.INTERNAL_SERVER_ERROR,
    details?: any
  ) {
    super(message);
    this.name = 'TDError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

// 具体的なエラークラス群
export class ValidationError extends TDError {
  constructor(message: string, details?: any) {
    super(message, 400, ErrorCodes.VALIDATION_ERROR, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends TDError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with ID '${id}' not found` : `${resource} not found`;
    super(message, 404, ErrorCodes.NOT_FOUND);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends TDError {
  constructor(limit: number, window: string) {
    super(
      `Rate limit exceeded: ${limit} requests per ${window}`,
      429,
      ErrorCodes.RATE_LIMIT_EXCEEDED,
      { limit, window }
    );
    this.name = 'RateLimitError';
  }
}

export class PasswordGenerationError extends TDError {
  constructor(message: string, details?: any) {
    super(message, 400, ErrorCodes.PASSWORD_GENERATION_FAILED, details);
    this.name = 'PasswordGenerationError';
  }
}

export class AIServiceError extends TDError {
  constructor(message: string, details?: any) {
    super(message, 503, ErrorCodes.AI_SERVICE_UNAVAILABLE, details);
    this.name = 'AIServiceError';
  }
}

// エラーレスポンス作成
export function createErrorResponse(
  error: Error | TDError,
  requestId?: string
): ApiError {
  const isKnownError = error instanceof TDError;
  
  const errorObj: ApiError['error'] = {
    code: isKnownError ? error.code : ErrorCodes.INTERNAL_SERVER_ERROR,
    message: isKnownError ? error.message : 'Internal server error',
    details: isKnownError ? error.details : undefined,
    timestamp: isKnownError ? error.timestamp : new Date().toISOString()
  };

  if (requestId) {
    errorObj.requestId = requestId;
  }

  return {
    success: false,
    error: errorObj
  };
}

// メインエラーハンドラーミドルウェア
export function errorHandler(
  err: Error | TDError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId = (req.headers['x-request-id'] as string) || 
                  (req.headers['x-correlation-id'] as string) ||
                  Math.random().toString(36).substring(7);

  // ログ出力
  logError(err, requestId, req);

  // レスポンス作成
  const errorResponse = createErrorResponse(err, requestId);
  const statusCode = (err as any).status || 500;

  // セキュリティヘッダー追加
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block'
  });

  res.status(statusCode).json(errorResponse);
}

// エラーログ出力
function logError(err: Error | TDError, requestId: string, req: Request): void {
  const logData = {
    timestamp: new Date().toISOString(),
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
      ...(err instanceof TDError && {
        code: err.code,
        status: err.status,
        details: err.details
      })
    }
  };

  // エラーレベルに応じたログ出力
  if (err instanceof TDError && err.status < 500) {
    console.warn('🟡 Client Error:', JSON.stringify(logData, null, 2));
  } else {
    console.error('🔴 Server Error:', JSON.stringify(logData, null, 2));
  }

  // TDからのメッセージ
  if (err instanceof PasswordGenerationError) {
    console.log('🤖 TD: パスワード生成でエラーが発生しました。設定を確認してください。');
  } else if (err instanceof AIServiceError) {
    console.log('🤖 TD: AI連携サービスに問題があります。しばらく待ってから再試行してください。');
  } else if (err instanceof RateLimitError) {
    console.log('🤖 TD: リクエスト制限に達しました。少し間隔を空けてからお試しください。');
  }
}

// 404エラーハンドラー
export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const error = new NotFoundError('Endpoint', req.originalUrl);
  next(error);
}

// 非同期エラーキャッチ用ラッパー
export function asyncHandler<T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// バリデーションエラーヘルパー
export function validateRequest(validations: Array<() => boolean | string>): void {
  const errors: string[] = [];
  
  for (const validation of validations) {
    const result = validation();
    if (typeof result === 'string') {
      errors.push(result);
    } else if (result === false) {
      errors.push('Validation failed');
    }
  }
  
  if (errors.length > 0) {
    throw new ValidationError('Request validation failed', { errors });
  }
}

// 特定エラーのためのヘルパー関数
export function throwIfEmpty(value: any, fieldName: string): void {
  if (!value || (Array.isArray(value) && value.length === 0) || 
      (typeof value === 'string' && value.trim() === '')) {
    throw new ValidationError(`${fieldName} is required and cannot be empty`);
  }
}

export function throwIfInvalidRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): void {
  if (value < min || value > max) {
    throw new ValidationError(
      `${fieldName} must be between ${min} and ${max}`,
      { value, min, max }
    );
  }
}

export function throwIfNotPositive(value: number, fieldName: string): void {
  if (value <= 0) {
    throw new ValidationError(`${fieldName} must be a positive number`);
  }
}

// プロセス終了時のエラーハンドリング
export function setupGlobalErrorHandlers(): void {
  // 未処理の Promise rejection をキャッチ
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    console.error('🚨 Unhandled Promise Rejection at:', promise, 'reason:', reason);
    console.log('🤖 TD: 予期しないエラーが発生しました。システムを安全にシャットダウンします。');
    
    // ログに記録後、プロセスを終了
    setTimeout(() => {
      process.exit(1);
    }, 5000);
  });

  // 未処理の例外をキャッチ
  process.on('uncaughtException', (error: Error) => {
    console.error('🚨 Uncaught Exception:', error);
    console.log('🤖 TD: 重大なエラーが発生しました。即座にシャットダウンします。');
    
    // 即座にプロセスを終了
    process.exit(1);
  });

  // SIGTERM シグナルの処理
  process.on('SIGTERM', () => {
    console.log('🤖 TD: SIGTERMを受信しました。安全にシャットダウンします...');
    process.exit(0);
  });

  // SIGINT シグナルの処理 (Ctrl+C)
  process.on('SIGINT', () => {
    console.log('\n🤖 TD: SIGINTを受信しました。安全にシャットダウンします...');
    process.exit(0);
  });
} 