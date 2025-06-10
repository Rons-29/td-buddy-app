import {
  IAIAdapter,
  AIProvider,
  AIConfig,
  AIParseRequest,
  AIParseResponse,
  AIServiceConfig,
  AIAdapterError
} from '../types/aiAdapter';
import { OpenAIAdapter } from './adapters/OpenAIAdapter';
import { PromptTemplates } from './prompts/PromptTemplates';
import { PersonalInfoGenerateRequest } from '../types/personalInfo';

/**
 * AI Service Manager
 * 複数のAI Adapterを管理し、自然言語処理を提供
 */
export class AIService {
  private adapters: Map<AIProvider, IAIAdapter> = new Map();
  private defaultProvider: AIProvider;
  private initialized = false;

  constructor() {
    this.defaultProvider = (process.env.DEFAULT_AI_PROVIDER as AIProvider) || 'openai';
  }

  /**
   * AI Service初期化
   */
  async initialize(): Promise<void> {
    console.log('🤖 AI Service初期化開始...');

    try {
      // OpenAI Adapter初期化
      if (process.env.OPENAI_API_KEY) {
        const openaiAdapter = new OpenAIAdapter();
        await openaiAdapter.initialize({
          provider: 'openai',
          apiKey: process.env.OPENAI_API_KEY,
          model: process.env.OPENAI_MODEL || 'gpt-4',
          maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '2000'),
          temperature: 0.7
        });
        this.adapters.set('openai', openaiAdapter);
        console.log('✅ OpenAI Adapter初期化完了');
      }

      // 将来的にClaude, Geminiも追加予定
      // if (process.env.CLAUDE_API_KEY) { ... }
      // if (process.env.GEMINI_API_KEY) { ... }

      if (this.adapters.size === 0) {
        throw new Error('No AI adapters initialized. Please check your API keys.');
      }

      // デフォルトプロバイダーが利用可能かチェック
      if (!this.adapters.has(this.defaultProvider)) {
        const firstProvider = this.adapters.keys().next().value;
        if (firstProvider) {
          this.defaultProvider = firstProvider;
          console.log(`⚠️  デフォルトプロバイダーを${this.defaultProvider}に変更`);
        }
      }

      this.initialized = true;
      console.log(`🎉 AI Service初期化完了 - デフォルト: ${this.defaultProvider}`);

    } catch (error: any) {
      console.error('❌ AI Service初期化失敗:', error);
      throw new AIAdapterError('AI Service initialization failed', this.defaultProvider);
    }
  }

  /**
   * 自然言語からデータ生成パラメータを抽出
   */
  async parseNaturalLanguageRequest(
    userInput: string,
    provider?: AIProvider
  ): Promise<AIParseResponse> {
    if (!this.initialized) {
      throw new AIAdapterError('AI Service not initialized', this.defaultProvider);
    }

    const targetProvider = provider || this.defaultProvider;
    const adapter = this.adapters.get(targetProvider);

    if (!adapter) {
      throw new AIAdapterError(`Provider ${targetProvider} not available`, targetProvider);
    }

    console.log(`🔍 自然言語解析開始: "${userInput}" (${targetProvider})`);

    try {
      const parseRequest: AIParseRequest = {
        userInput,
        provider: targetProvider,
        context: {
          availableFields: [
            'fullName', 'kanaName', 'email', 'phone', 
            'address', 'age', 'gender', 'company', 'jobTitle'
          ]
        }
      };

      const result = await adapter.parseGenerationRequest(parseRequest);
      
      if (result.success) {
        console.log(`✅ 解析成功 - 信頼度: ${result.confidence?.toFixed(2)}`);
        console.log(`📊 パラメータ: ${JSON.stringify(result.params, null, 2)}`);
      } else {
        console.log(`⚠️  解析失敗: ${result.error}`);
      }

      return result;

    } catch (error: any) {
      console.error(`❌ 自然言語解析エラー (${targetProvider}):`, error);
      
      return {
        success: false,
        error: error.message,
        clarificationNeeded: true,
        clarificationQuestions: [
          '生成したいデータの件数を教えてください',
          'どのような情報を含めたいですか？（名前、メール、電話番号など）',
          '特定の条件はありますか？（年齢、性別、職業など）'
        ]
      };
    }
  }

  /**
   * 自然言語をPersonalInfoGenerateRequestに変換
   */
  async convertToPersonalInfoRequest(
    userInput: string,
    provider?: AIProvider
  ): Promise<PersonalInfoGenerateRequest | null> {
    const parseResult = await this.parseNaturalLanguageRequest(userInput, provider);
    
    if (!parseResult.success || !parseResult.params) {
      return null;
    }

    const params = parseResult.params;
    
    const request: PersonalInfoGenerateRequest = {
      count: params.count,
      locale: params.locale as 'ja' | 'en',
      includeFields: params.includeFields as any
    };

    // オプショナルフィールドを条件付きで追加
    if (params.filters?.ageRange) {
      request.ageRange = params.filters.ageRange;
    }
    
    if (params.filters?.gender && params.filters.gender !== 'both') {
      request.gender = params.filters.gender as 'male' | 'female' | 'random';
    } else if (params.filters?.gender === 'both') {
      request.gender = 'random';
    }

    return request;
  }

  /**
   * 利用可能なプロバイダー一覧取得
   */
  getAvailableProviders(): AIProvider[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * デフォルトプロバイダー取得
   */
  getDefaultProvider(): AIProvider {
    return this.defaultProvider;
  }

  /**
   * プロバイダー切り替え
   */
  setDefaultProvider(provider: AIProvider): boolean {
    if (this.adapters.has(provider)) {
      this.defaultProvider = provider;
      console.log(`🔄 デフォルトプロバイダーを${provider}に変更`);
      return true;
    }
    return false;
  }

  /**
   * ヘルスチェック
   */
  async healthCheck(): Promise<Record<AIProvider, boolean>> {
    const results: Record<AIProvider, boolean> = {} as any;
    
    for (const [provider, adapter] of this.adapters) {
      try {
        results[provider] = await adapter.healthCheck();
      } catch (error) {
        results[provider] = false;
      }
    }
    
    return results;
  }

  /**
   * レート制限情報取得
   */
  async getRateLimitInfo(provider?: AIProvider) {
    const targetProvider = provider || this.defaultProvider;
    const adapter = this.adapters.get(targetProvider);
    
    if (!adapter) {
      throw new AIAdapterError(`Provider ${targetProvider} not available`, targetProvider);
    }
    
    return await adapter.getRateLimitInfo();
  }

  /**
   * 統計情報取得
   */
  getStats() {
    return {
      initialized: this.initialized,
      availableProviders: this.getAvailableProviders(),
      defaultProvider: this.defaultProvider,
      totalAdapters: this.adapters.size
    };
  }
} 