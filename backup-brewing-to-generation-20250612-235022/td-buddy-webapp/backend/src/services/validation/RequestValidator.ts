import { ParsedGenerationParams } from '../../types/aiAdapter';
import { PersonalInfoGenerateRequest } from '../../types/personalInfo';

/**
 * AI統合用リクエストバリデーター
 * 自然言語要求とデータ生成パラメータの妥当性を検証
 */
export class RequestValidator {

  /**
   * 自然言語入力の基本検証
   */
  static validateNaturalLanguageInput(input: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. 空文字・null チェック
    if (!input || input.trim().length === 0) {
      errors.push('入力が空です。データ生成の要求を入力してください。');
      return { isValid: false, errors, warnings };
    }

    // 2. 長さチェック
    if (input.length > 1000) {
      errors.push('入力が長すぎます。1000文字以内で入力してください。');
    }

    if (input.length < 3) {
      errors.push('入力が短すぎます。具体的な要求を入力してください。');
    }

    // 3. 危険なパターンチェック
    const dangerousPatterns = [
      /script\s*>/i,     // XSS攻撃パターン
      /<\s*iframe/i,     // iframe インジェクション
      /javascript:/i,    // JavaScript URL
      /data:\s*text/i,   // Data URL
      /eval\s*\(/i,      // eval関数
      /exec\s*\(/i,      // exec関数
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(input)) {
        errors.push('不正な文字列が含まれています。安全な要求を入力してください。');
        break;
      }
    }

    // 4. 日本語または英語の妥当性チェック
    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(input);
    const hasEnglish = /[a-zA-Z]/.test(input);
    const hasNumbers = /[0-9]/.test(input);

    if (!hasJapanese && !hasEnglish && !hasNumbers) {
      warnings.push('日本語、英語、または数字を含む要求を推奨します。');
    }

    // 5. 一般的でない文字のチェック
    const unusualChars = /[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u0020-\u007Ea-zA-Z0-9\s\-_.,!?()[\]{}]/.test(input);
    if (unusualChars) {
      warnings.push('一般的でない文字が含まれています。解析に影響する可能性があります。');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 解析済みパラメータの検証
   */
  static validateParsedParams(params: ParsedGenerationParams): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. 必須フィールドチェック
    if (!params.count || typeof params.count !== 'number') {
      errors.push('生成件数が指定されていません。');
    } else {
      // 件数範囲チェック
      if (params.count < 1) {
        errors.push('生成件数は1以上で指定してください。');
      } else if (params.count > 1000) {
        errors.push('生成件数は1000以下で指定してください。');
      } else if (params.count > 100) {
        warnings.push('100件を超える大量生成です。処理に時間がかかる可能性があります。');
      }
    }

    // 2. ロケールチェック
    if (!params.locale) {
      warnings.push('ロケールが指定されていません。日本語(ja)を使用します。');
    } else if (!['ja', 'en'].includes(params.locale)) {
      errors.push('サポートされていないロケールです。"ja"または"en"を指定してください。');
    }

    // 3. includeFieldsチェック
    if (!params.includeFields || !Array.isArray(params.includeFields)) {
      errors.push('含めるフィールドが指定されていません。');
    } else {
      const validFields = [
        'fullName', 'kanaName', 'email', 'phone', 'mobile',
        'address', 'postalCode', 'birthDate', 'age', 'gender',
        'company', 'jobTitle', 'website', 'socialId'
      ];

      const invalidFields = params.includeFields.filter(field => !validFields.includes(field));
      if (invalidFields.length > 0) {
        errors.push(`無効なフィールドが含まれています: ${invalidFields.join(', ')}`);
      }

      if (params.includeFields.length === 0) {
        errors.push('少なくとも1つのフィールドを指定してください。');
      }

      if (params.includeFields.length > 10) {
        warnings.push('多数のフィールドが指定されています。生成に時間がかかる可能性があります。');
      }
    }

    // 4. フィルタチェック
    if (params.filters) {
      // 年齢範囲チェック
      if (params.filters.ageRange) {
        const { min, max } = params.filters.ageRange;
        if (min < 0 || max < 0) {
          errors.push('年齢は0以上で指定してください。');
        }
        if (min > max) {
          errors.push('最小年齢が最大年齢を上回っています。');
        }
        if (max > 120) {
          warnings.push('120歳を超える年齢が指定されています。');
        }
      }

      // 性別チェック
      if (params.filters.gender && !['male', 'female', 'both'].includes(params.filters.gender)) {
        errors.push('性別は"male", "female", "both"のいずれかを指定してください。');
      }

      // 職業カテゴリチェック
      if (params.filters.jobCategory) {
        const validJobCategories = [
          'エンジニア', '営業', 'デザイナー', '管理職', 'マーケティング',
          '経理', '人事', '法務', '医療', '教育', 'サービス', 'その他'
        ];
        if (!validJobCategories.includes(params.filters.jobCategory)) {
          warnings.push(`職業カテゴリ "${params.filters.jobCategory}" は標準カテゴリではありません。`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * PersonalInfoGenerateRequest の検証
   */
  static validatePersonalInfoRequest(request: PersonalInfoGenerateRequest): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 基本パラメータをParsedGenerationParamsに変換して検証
    const params: ParsedGenerationParams = {
      count: request.count,
      locale: request.locale,
      includeFields: request.includeFields as string[]
    };

    // フィルタがあれば追加
    if (request.ageRange || request.gender) {
      params.filters = {};
      if (request.ageRange) {
        params.filters.ageRange = request.ageRange;
      }
      if (request.gender && request.gender !== 'random') {
        params.filters.gender = request.gender as 'male' | 'female';
      }
    }

    const baseValidation = this.validateParsedParams(params);
    errors.push(...baseValidation.errors);
    warnings.push(...baseValidation.warnings);

    // PersonalInfoGenerateRequest 固有の検証
    const validPersonalFields = [
      'fullName', 'kanaName', 'email', 'phone', 'address', 
      'age', 'gender', 'company', 'jobTitle'
    ];

    const invalidPersonalFields = request.includeFields.filter(
      field => !validPersonalFields.includes(field)
    );

    if (invalidPersonalFields.length > 0) {
      errors.push(`個人情報生成でサポートされていないフィールド: ${invalidPersonalFields.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * セキュリティ検証
   */
  static validateSecurity(input: string, params?: ParsedGenerationParams): SecurityValidationResult {
    const issues: SecurityIssue[] = [];

    // 1. インジェクション攻撃パターン検出
    const injectionPatterns = [
      { pattern: /union\s+select/i, type: 'SQL_INJECTION', severity: 'HIGH' },
      { pattern: /<script/i, type: 'XSS', severity: 'HIGH' },
      { pattern: /javascript:/i, type: 'XSS', severity: 'HIGH' },
      { pattern: /vbscript:/i, type: 'XSS', severity: 'HIGH' },
      { pattern: /onload\s*=/i, type: 'XSS', severity: 'MEDIUM' },
      { pattern: /onerror\s*=/i, type: 'XSS', severity: 'MEDIUM' },
      { pattern: /\.\.\/\.\.\//g, type: 'PATH_TRAVERSAL', severity: 'MEDIUM' },
      { pattern: /eval\s*\(/i, type: 'CODE_INJECTION', severity: 'HIGH' },
    ];

    for (const { pattern, type, severity } of injectionPatterns) {
      if (pattern.test(input)) {
        issues.push({
          type,
          severity: severity as 'LOW' | 'MEDIUM' | 'HIGH',
          message: `Potential ${type} detected in input`,
          field: 'userInput'
        });
      }
    }

    // 2. 大量生成の監視
    if (params?.count && params.count > 500) {
      issues.push({
        type: 'RESOURCE_ABUSE',
        severity: 'MEDIUM',
        message: `Large generation request: ${params.count} items`,
        field: 'count'
      });
    }

    // 3. 個人情報流出リスク
    const personalInfoPatterns = [
      /\d{4}-\d{4}-\d{4}-\d{4}/, // クレジットカード番号パターン
      /\d{3}-\d{2}-\d{4}/,      // SSN パターン
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // 実際のメールアドレス
    ];

    for (const pattern of personalInfoPatterns) {
      if (pattern.test(input)) {
        issues.push({
          type: 'PERSONAL_INFO_LEAK',
          severity: 'HIGH',
          message: 'Potential real personal information detected',
          field: 'userInput'
        });
        break;
      }
    }

    return {
      isSafe: issues.filter(issue => issue.severity === 'HIGH').length === 0,
      issues
    };
  }

  /**
   * 統合検証（すべての検証を実行）
   */
  static validateComplete(
    userInput: string, 
    parsedParams?: ParsedGenerationParams
  ): CompleteValidationResult {
    const inputValidation = this.validateNaturalLanguageInput(userInput);
    const securityValidation = this.validateSecurity(userInput, parsedParams);
    
    let paramValidation: ValidationResult | null = null;
    if (parsedParams) {
      paramValidation = this.validateParsedParams(parsedParams);
    }

    const allErrors = [
      ...inputValidation.errors,
      ...(paramValidation?.errors || [])
    ];

    const allWarnings = [
      ...inputValidation.warnings,
      ...(paramValidation?.warnings || [])
    ];

    const highSecurityIssues = securityValidation.issues.filter(
      issue => issue.severity === 'HIGH'
    );

    return {
      isValid: allErrors.length === 0 && highSecurityIssues.length === 0,
      isSafe: securityValidation.isSafe,
      errors: allErrors,
      warnings: allWarnings,
      securityIssues: securityValidation.issues,
      inputValidation,
      paramValidation,
      securityValidation
    };
  }
}

// 型定義
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SecurityIssue {
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  message: string;
  field: string;
}

export interface SecurityValidationResult {
  isSafe: boolean;
  issues: SecurityIssue[];
}

export interface CompleteValidationResult {
  isValid: boolean;
  isSafe: boolean;
  errors: string[];
  warnings: string[];
  securityIssues: SecurityIssue[];
  inputValidation: ValidationResult;
  paramValidation: ValidationResult | null;
  securityValidation: SecurityValidationResult;
} 