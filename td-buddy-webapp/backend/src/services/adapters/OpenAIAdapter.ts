import {
  IAIAdapter,
  AIConfig,
  AIRequest,
  AIResponse,
  AIParseRequest,
  AIParseResponse,
  ParsedGenerationParams,
  AIAdapterError,
  RateLimitError,
  AuthenticationError,
  AIProvider
} from '../../types/aiAdapter';

/**
 * OpenAI API Adapter
 * GPT-4, GPT-3.5-turbo等に対応
 */
export class OpenAIAdapter implements IAIAdapter {
  public readonly provider: AIProvider = 'openai';
  private config?: AIConfig;
  private rateLimitInfo = {
    remaining: 1000,
    resetTime: new Date(),
    limit: 1000
  };

  /**
   * OpenAI API初期化
   */
  async initialize(config: AIConfig): Promise<void> {
    this.config = {
      ...config,
      baseUrl: config.baseUrl || 'https://api.openai.com/v1',
      model: config.model || 'gpt-4',
      maxTokens: config.maxTokens || 2000,
      temperature: config.temperature || 0.7
    };

    // 初期化時にヘルスチェック実行
    const isHealthy = await this.healthCheck();
    if (!isHealthy) {
      throw new AIAdapterError('OpenAI API initialization failed', this.provider);
    }

    logger.log(`✅ OpenAI Adapter initialized: ${this.config.model}`);
  }

  /**
   * 基本的なAI API呼び出し
   */
  async generateResponse(request: AIRequest): Promise<AIResponse> {
    if (!this.config) {
      throw new AIAdapterError('OpenAI Adapter not initialized', this.provider);
    }

    try {
      const messages = [];
      
      // システムプロンプトがある場合は追加
      if (request.systemPrompt) {
        messages.push({
          role: 'system',
          content: request.systemPrompt
        });
      }

      // ユーザープロンプト追加
      messages.push({
        role: 'user',
        content: request.prompt
      });

      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          max_tokens: request.maxTokens || this.config.maxTokens,
          temperature: request.temperature || this.config.temperature
        })
      });

      // レート制限情報を更新
      this.updateRateLimitInfo(response.headers);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = await response.json() as any;
      
      return {
        content: data.choices[0]?.message?.content || '',
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0
        },
        model: data.model,
        finishReason: data.choices[0]?.finish_reason
      };

    } catch (error: any) {
      if (error instanceof AIAdapterError) {
        throw error;
      }
      throw new AIAdapterError(
        `OpenAI API call failed: ${error.message}`,
        this.provider
      );
    }
  }

  /**
   * 自然言語をデータ生成パラメータに変換
   */
  async parseGenerationRequest(request: AIParseRequest): Promise<AIParseResponse> {
    const systemPrompt = this.buildParameterExtractionPrompt();
    
    try {
      const aiResponse = await this.generateResponse({
        prompt: request.userInput,
        systemPrompt,
        maxTokens: 1000,
        temperature: 0.3 // 構造化データ抽出なので低めの温度
      });

      // JSON形式のレスポンスをパース
      const parsedParams = this.parseAIResponse(aiResponse.content);
      
      return {
        success: true,
        params: parsedParams,
        confidence: this.calculateConfidence(aiResponse.content),
        clarificationNeeded: false
      };

    } catch (error: any) {
      logger.error('🔍 Parameter extraction failed:', error);
      
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
   * ヘルスチェック
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.generateResponse({
        prompt: 'Hello',
        maxTokens: 10
      });
      return response.content.length > 0;
    } catch (error) {
      logger.error('🔍 OpenAI health check failed:', error);
      return false;
    }
  }

  /**
   * レート制限情報取得
   */
  async getRateLimitInfo() {
    return this.rateLimitInfo;
  }

  /**
   * パラメータ抽出用のシステムプロンプト構築
   */
  private buildParameterExtractionPrompt(): string {
    return `あなたはテストデータ生成の専門家です。ユーザーの自然言語での要求を、以下のJSON形式に変換してください。

利用可能なフィールド:
- fullName: 氏名
- kanaName: フリガナ  
- email: メールアドレス
- phone: 電話番号
- address: 住所
- age: 年齢
- gender: 性別
- company: 会社名
- jobTitle: 職種

レスポンス形式:
{
  "count": 生成件数（数値）,
  "locale": "ja",
  "includeFields": ["フィールド名の配列"],
  "filters": {
    "ageRange": {"min": 最小年齢, "max": 最大年齢},
    "gender": "male" | "female" | "both",
    "jobCategory": "職業カテゴリ",
    "location": "地域"
  }
}

例:
入力: "30代の男性エンジニア10人、連絡先付きで"
出力: {
  "count": 10,
  "locale": "ja", 
  "includeFields": ["fullName", "email", "phone", "age", "gender", "company", "jobTitle"],
  "filters": {
    "ageRange": {"min": 30, "max": 39},
    "gender": "male",
    "jobCategory": "エンジニア"
  }
}

必ずJSON形式のみで回答してください。説明は不要です。`;
  }

  /**
   * AI レスポンスをパース
   */
  private parseAIResponse(content: string): ParsedGenerationParams {
    try {
      // JSON部分を抽出（```json ``` で囲まれている場合も対応）
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                       content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('JSON format not found in AI response');
      }

      const jsonStr = jsonMatch[1] || jsonMatch[0];
      const parsed = JSON.parse(jsonStr);

      // 必須フィールドの検証
      if (!parsed.count || !parsed.includeFields) {
        throw new Error('Required fields missing in parsed response');
      }

      return {
        count: Math.min(parsed.count, 1000), // 最大1000件に制限
        locale: parsed.locale || 'ja',
        includeFields: parsed.includeFields,
        filters: parsed.filters,
        customRequirements: parsed.customRequirements
      };

    } catch (error: any) {
      throw new AIAdapterError(
        `Failed to parse AI response: ${error.message}`,
        this.provider
      );
    }
  }

  /**
   * 信頼度計算
   */
  private calculateConfidence(content: string): number {
    // JSON形式が正しく含まれているかチェック
    const hasValidJson = /\{[\s\S]*\}/.test(content);
    const hasRequiredFields = content.includes('count') && content.includes('includeFields');
    
    if (hasValidJson && hasRequiredFields) {
      return 0.9;
    } else if (hasValidJson) {
      return 0.6;
    } else {
      return 0.3;
    }
  }

  /**
   * レート制限情報更新
   */
  private updateRateLimitInfo(headers: Headers): void {
    const remaining = headers.get('x-ratelimit-remaining-requests');
    const resetTime = headers.get('x-ratelimit-reset-requests');
    const limit = headers.get('x-ratelimit-limit-requests');

    if (remaining) this.rateLimitInfo.remaining = parseInt(remaining);
    if (limit) this.rateLimitInfo.limit = parseInt(limit);
    if (resetTime) {
      this.rateLimitInfo.resetTime = new Date(resetTime);
    }
  }

  /**
   * エラーレスポンス処理
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    const errorData = await response.json().catch(() => ({})) as any;
    
    switch (response.status) {
      case 401:
        throw new AuthenticationError(this.provider);
      case 429:
        const resetTime = new Date(Date.now() + 60000); // 1分後にリセット（仮）
        throw new RateLimitError(this.provider, resetTime, this.rateLimitInfo.limit);
      default:
        throw new AIAdapterError(
          errorData.error?.message || `HTTP ${response.status}`,
          this.provider,
          errorData.error?.code,
          response.status
        );
    }
  }
} 