// 共通レスポンス型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  tdMessage?: string;
  timestamp: string;
  metadata?: {
    page?: number;
    limit?: number;
    total?: number;
    duration?: number;
  };
}

// エラー型
export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  tdMessage: string;
  timestamp: string;
  path: string;
  method: string;
  stack?: string;
  details?: any;
}

// パスワード生成関連の型
export interface PasswordGenerateRequest {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
  customCharacters?: string;
  count: number;
}

export interface PasswordGenerateResponse {
  passwords: string[];
  criteria: PasswordGenerateRequest;
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  estimatedCrackTime: string;
  generatedAt: string;
}

// 個人情報生成関連の型
export interface PersonalInfoGenerateRequest {
  locale: 'ja' | 'en' | 'ko' | 'zh';
  count: number;
  includeFields: PersonalInfoField[];
  ageRange?: {
    min: number;
    max: number;
  };
  gender?: 'male' | 'female' | 'random';
  addressFormat?: 'full' | 'city-only' | 'prefecture-only';
}

export type PersonalInfoField = 
  | 'name'
  | 'email'
  | 'phone'
  | 'address'
  | 'birthdate'
  | 'company'
  | 'jobTitle'
  | 'website'
  | 'socialId';

export interface PersonalInfoItem {
  id: string;
  name?: {
    full: string;
    first: string;
    last: string;
    kana?: {
      full: string;
      first: string;
      last: string;
    };
  };
  email?: string;
  phone?: string;
  address?: {
    full: string;
    prefecture: string;
    city: string;
    street: string;
    postalCode: string;
  };
  birthdate?: string;
  age?: number;
  gender?: 'male' | 'female';
  company?: string;
  jobTitle?: string;
  website?: string;
  socialId?: string;
}

export interface PersonalInfoGenerateResponse {
  persons: PersonalInfoItem[];
  criteria: PersonalInfoGenerateRequest;
  generatedAt: string;
  expiresAt: string;
}

// Claude AI関連の型
export interface ClaudeGenerateRequest {
  prompt: string;
  dataType: 'text' | 'json' | 'csv' | 'sql' | 'xml';
  count?: number;
  language?: string;
  context?: string;
  constraints?: {
    maxLength?: number;
    format?: string;
    schema?: any;
  };
}

export interface ClaudeGenerateResponse {
  generatedData: any;
  prompt: string;
  dataType: string;
  processingTime: number;
  tokenUsage?: {
    input: number;
    output: number;
    total: number;
  };
  generatedAt: string;
}

// ファイル生成関連の型
export interface FileGenerateRequest {
  format: 'csv' | 'json' | 'xml' | 'sql' | 'txt';
  data: any[];
  fileName?: string;
  options?: {
    delimiter?: string;
    encoding?: string;
    headers?: boolean;
    pretty?: boolean;
  };
}

export interface FileGenerateResponse {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  format: string;
  recordCount: number;
  expiresAt: string;
  downloadToken: string;
}

// ヘルスチェック関連の型
export interface HealthCheckResponse {
  status: 'ok' | 'error' | 'maintenance';
  message: string;
  timestamp: string;
  version: string;
  uptime: number;
  services: {
    database: 'healthy' | 'unhealthy' | 'unknown';
    claude: 'healthy' | 'unhealthy' | 'unknown';
    storage: 'healthy' | 'unhealthy' | 'unknown';
  };
  performance: {
    responseTime: number;
    memoryUsage: {
      used: number;
      total: number;
      percentage: number;
    };
    cpuUsage: number;
  };
}

// バリデーション関連の型
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
  constraint?: string;
}

// レート制限関連の型
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

// ページネーション関連の型
export interface PaginationRequest {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: Record<string, any>;
}

export interface PaginationResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// TD システム情報の型
export interface TDSystemInfo {
  version: string;
  environment: string;
  buildDate: string;
  features: string[];
  limits: {
    maxPasswordLength: number;
    maxPersonalInfoCount: number;
    maxFileSize: number;
    rateLimitPerMinute: number;
  };
  tdMessage: string;
} 