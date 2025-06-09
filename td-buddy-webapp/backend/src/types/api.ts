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

// 基本的なAPI レスポンス型
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
  tdMessage: string;
  timestamp: string;
  requestId: string;
}

// パスワード生成リクエスト（基本版）
export interface PasswordGenerateRequest {
  length: number;                    // パスワード長 (1-128)
  count: number;                     // 生成個数 (1-1000) 
  includeUppercase: boolean;         // 大文字を含む
  includeLowercase: boolean;         // 小文字を含む
  includeNumbers: boolean;           // 数字を含む
  includeSymbols: boolean;           // 記号を含む
  excludeAmbiguous: boolean;         // 紛らわしい文字を除外
  customCharacters?: string;         // カスタム文字セット
}

// 構成プリセット対応パスワード生成リクエスト
export interface CompositionPasswordRequest {
  // 基本設定
  length: number;                    // パスワード長 (1-128)
  count: number;                     // 生成個数 (1-1000)
  
  // 構成プリセット
  composition: 'none' | 'web-standard' | 'num-upper-lower' | 'high-security' | 'enterprise-policy' | 'num-upper-lower-symbol' | 'custom-symbols' | 'custom-charsets' | 'other';
  
  // カスタム設定（compositionに応じて使用）
  customSymbols?: string;            // カスタム記号
  customCharsets?: CustomCharsetRequirement[];  // カスタム文字種
  
  // 除外オプション
  excludeSimilar?: boolean;          // 似ている文字を除外
  excludeAmbiguous?: boolean;        // 紛らわしい文字を除外
  
  // 基本文字種（composition='none'時に使用）
  useNumbers?: boolean;
  useUppercase?: boolean;
  useLowercase?: boolean;
  useSymbols?: boolean;
}

export interface CustomCharsetRequirement {
  id: string;
  name: string;
  charset: string;
  min: number;
  enabled: boolean;
}

// パスワード生成レスポンス（基本版）
export interface PasswordGenerateResponse {
  passwords: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  estimatedCrackTime: string;
  criteria: PasswordGenerateRequest;
  generatedAt: string;
}

// 構成プリセット対応パスワード生成レスポンス
export interface CompositionPasswordResponse {
  passwords: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  estimatedCrackTime: string;
  criteria: CompositionPasswordRequest;
  generatedAt: string;
  composition: {
    usedPreset: string;
    appliedRequirements: RequirementSummary[];
  };
}

export interface RequirementSummary {
  name: string;
  charset: string;
  requiredCount: number;
  actualCount: number;
  satisfied: boolean;
}

// ヘルスチェック


// 個人情報生成リクエスト（将来用）
export interface PersonalInfoRequest {
  count: number;
  includeFirstName: boolean;
  includeLastName: boolean;
  includeEmail: boolean;
  includePhone: boolean;
  includeAddress: boolean;
  locale: 'ja' | 'en';
}

// Claude AI リクエスト（将来用）
export interface ClaudeRequest {
  prompt: string;
  context?: string;
  dataType: 'password' | 'personal' | 'text';
  parameters?: Record<string, any>;
} 