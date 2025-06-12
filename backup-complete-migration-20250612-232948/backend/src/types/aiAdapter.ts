/**
 * 汎用AI API連携のための型定義
 * OpenAI, Claude, Gemini等の複数AIサービスに対応
 */

// AI プロバイダーの種類
export type AIProvider = 'openai' | 'claude' | 'gemini' | 'local';

// AI API設定
export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  baseUrl?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

// AI リクエスト
export interface AIRequest {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
  context?: any;
}

// AI レスポンス
export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model?: string;
  finishReason?: string;
}

// データ生成パラメータ（AI解析結果）
export interface ParsedGenerationParams {
  count: number;
  locale: string;
  includeFields: string[];
  filters?: {
    ageRange?: { min: number; max: number };
    gender?: 'male' | 'female' | 'both';
    jobCategory?: string;
    location?: string;
  };
  customRequirements?: string[];
}

// AI解析リクエスト
export interface AIParseRequest {
  userInput: string;
  provider: AIProvider;
  context?: {
    previousRequests?: string[];
    availableFields?: string[];
  };
}

// AI解析レスポンス
export interface AIParseResponse {
  success: boolean;
  params?: ParsedGenerationParams;
  clarificationNeeded?: boolean;
  clarificationQuestions?: string[];
  error?: string;
  confidence?: number; // 0-1の信頼度
}

// AI Adapter共通インターフェース
export interface IAIAdapter {
  readonly provider: AIProvider;
  
  /**
   * AI APIの初期化・設定
   */
  initialize(config: AIConfig): Promise<void>;
  
  /**
   * 基本的なAI API呼び出し
   */
  generateResponse(request: AIRequest): Promise<AIResponse>;
  
  /**
   * 自然言語をデータ生成パラメータに変換
   */
  parseGenerationRequest(request: AIParseRequest): Promise<AIParseResponse>;
  
  /**
   * ヘルスチェック
   */
  healthCheck(): Promise<boolean>;
  
  /**
   * レート制限情報取得
   */
  getRateLimitInfo(): Promise<{
    remaining: number;
    resetTime: Date;
    limit: number;
  }>;
}

// エラー型定義
export class AIAdapterError extends Error {
  constructor(
    message: string,
    public provider: AIProvider,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AIAdapterError';
  }
}

export class RateLimitError extends AIAdapterError {
  constructor(
    provider: AIProvider,
    public resetTime: Date,
    public limit: number
  ) {
    super(`Rate limit exceeded for ${provider}. Reset at ${resetTime}`, provider, 'RATE_LIMIT', 429);
    this.name = 'RateLimitError';
  }
}

export class AuthenticationError extends AIAdapterError {
  constructor(provider: AIProvider) {
    super(`Authentication failed for ${provider}`, provider, 'AUTH_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

// プロンプトテンプレート
export interface PromptTemplate {
  system: string;
  user: string;
  examples?: Array<{
    input: string;
    output: string;
  }>;
}

// AI サービス設定
export interface AIServiceConfig {
  defaultProvider: AIProvider;
  providers: Record<AIProvider, AIConfig>;
  prompts: {
    dataGeneration: PromptTemplate;
    parameterExtraction: PromptTemplate;
  };
  rateLimits: Record<AIProvider, {
    requestsPerMinute: number;
    requestsPerHour: number;
    tokensPerMinute: number;
  }>;
} 