import crypto from 'crypto';
import { database } from '../database/database';
import { 
  CompositionPasswordRequest, 
  CompositionPasswordResponse, 
  CustomCharsetRequirement,
  RequirementSummary,
  APIResponse
} from '../types/api';

interface CompositionRequirement {
  name: string;
  charset: string;
  min: number;
}

interface CompositionDefinition {
  id: string;
  label: string;
  description: string;
  requirements: CompositionRequirement[];
}

export class CompositionPasswordService {
  private readonly DEFAULT_CHARACTERS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    ambiguous: 'il1Lo0O',
    similar: 'il1Lo0O'
  };

  private readonly COMPOSITION_PRESETS: Record<string, CompositionDefinition> = {
    'web-standard': {
      id: 'web-standard',
      label: 'Web標準',
      description: 'Webサービスでよく使われる標準的なパスワード',
      requirements: [
        { name: '数字', charset: '0123456789', min: 1 },
        { name: '大文字', charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', min: 1 },
        { name: '小文字', charset: 'abcdefghijklmnopqrstuvwxyz', min: 1 }
      ]
    },
    'num-upper-lower': {
      id: 'num-upper-lower',
      label: '数字・大文字・小文字',
      description: '数字、大文字、小文字をそれぞれ最低1文字含む',
      requirements: [
        { name: '数字', charset: '0123456789', min: 1 },
        { name: '大文字', charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', min: 1 },
        { name: '小文字', charset: 'abcdefghijklmnopqrstuvwxyz', min: 1 }
      ]
    },
    'high-security': {
      id: 'high-security',
      label: '高セキュリティ',
      description: '銀行・金融機関レベルの高セキュリティパスワード',
      requirements: [
        { name: '数字', charset: '0123456789', min: 1 },
        { name: '大文字', charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', min: 1 },
        { name: '小文字', charset: 'abcdefghijklmnopqrstuvwxyz', min: 1 },
        { name: '記号', charset: '!@#$%^&*()_+-=[]{}|;:,.<>?', min: 1 }
      ]
    },
    'enterprise-policy': {
      id: 'enterprise-policy',
      label: 'エンタープライズポリシー',
      description: '企業のパスワードポリシーに準拠',
      requirements: [
        { name: '数字', charset: '0123456789', min: 1 },
        { name: '大文字', charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', min: 1 },
        { name: '小文字', charset: 'abcdefghijklmnopqrstuvwxyz', min: 1 },
        { name: '記号', charset: '!@#$%^&*', min: 1 }
      ]
    },
    'num-upper-lower-symbol': {
      id: 'num-upper-lower-symbol',
      label: '数字・大文字・小文字・記号',
      description: '数字、大文字、小文字、記号をそれぞれ最低1文字含む',
      requirements: [
        { name: '数字', charset: '0123456789', min: 1 },
        { name: '大文字', charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', min: 1 },
        { name: '小文字', charset: 'abcdefghijklmnopqrstuvwxyz', min: 1 },
        { name: '記号', charset: '!@#$%^&*', min: 1 }
      ]
    }
  };

  private readonly RETENTION_HOURS = 24;

  async generateWithComposition(
    criteria: CompositionPasswordRequest,
    userSession?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<CompositionPasswordResponse> {
    const startTime = Date.now();
    
    try {
      // バリデーション
      this.validateCriteria(criteria);

      const passwords: string[] = [];
      const requirements = this.getRequirements(criteria);
      
      // パスワード生成
      for (let i = 0; i < criteria.count; i++) {
        const password = this.generateSinglePassword(criteria, requirements);
        passwords.push(password);
      }

      const strength = this.calculateStrength(criteria, requirements);
      const estimatedCrackTime = this.estimateCrackTime(criteria, requirements);
      
      // 要件チェック
      const appliedRequirements = passwords.length > 0 && passwords[0] ? 
        this.checkRequirements(passwords[0], requirements) : [];

      const response: CompositionPasswordResponse = {
        passwords,
        criteria,
        strength,
        estimatedCrackTime,
        generatedAt: new Date().toISOString(),
        composition: {
          usedPreset: criteria.composition,
          appliedRequirements
        }
      };

      // データベースに保存
      await this.saveToDatabase(passwords, criteria, strength, estimatedCrackTime, userSession, ipAddress, userAgent);

      const processingTime = Date.now() - startTime;
      console.log(`✅ 構成プリセット付きパスワード生成完了: ${passwords.length}件 (${processingTime}ms)`);
      console.log(`🤖 TD: ${criteria.composition}プリセットで${strength}レベルのパスワードを生成しました！`);

      return response;

    } catch (error) {
      console.error('❌ 構成プリセット付きパスワード生成エラー:', error);
      throw error;
    }
  }

  private validateCriteria(criteria: CompositionPasswordRequest): void {
    if (!criteria.length || criteria.length < 4 || criteria.length > 128) {
      throw new Error('パスワード長は4文字以上128文字以下で指定してください');
    }
    
    if (!criteria.count || criteria.count < 1 || criteria.count > 100) {
      throw new Error('生成数は1個以上100個以下で指定してください');
    }
  }

  private getRequirements(criteria: CompositionPasswordRequest): CompositionRequirement[] {
    const requirements: CompositionRequirement[] = [];

    switch (criteria.composition) {
      case 'none':
      case 'other':
        // 基本的な文字種選択
        if (criteria.useUppercase) {
          requirements.push({ name: '大文字', charset: this.DEFAULT_CHARACTERS.uppercase, min: 0 });
        }
        if (criteria.useLowercase) {
          requirements.push({ name: '小文字', charset: this.DEFAULT_CHARACTERS.lowercase, min: 0 });
        }
        if (criteria.useNumbers) {
          requirements.push({ name: '数字', charset: this.DEFAULT_CHARACTERS.numbers, min: 0 });
        }
        if (criteria.useSymbols) {
          requirements.push({ name: '記号', charset: this.DEFAULT_CHARACTERS.symbols, min: 0 });
        }
        break;

      case 'num-upper-lower':
      case 'web-standard':
      case 'high-security':
      case 'enterprise-policy':
      case 'num-upper-lower-symbol':
        const preset = this.COMPOSITION_PRESETS[criteria.composition];
        if (preset?.requirements) {
          requirements.push(...preset.requirements);
        }
        break;

      case 'custom-symbols':
        const symbols = criteria.customSymbols || '$@_#&?';
        requirements.push(
          { name: '数字', charset: this.DEFAULT_CHARACTERS.numbers, min: 1 },
          { name: '大文字', charset: this.DEFAULT_CHARACTERS.uppercase, min: 1 },
          { name: '小文字', charset: this.DEFAULT_CHARACTERS.lowercase, min: 1 },
          { name: 'カスタム記号', charset: symbols, min: 1 }
        );
        break;

      case 'custom-charsets':
        if (criteria.customCharsets) {
          for (const customCharset of criteria.customCharsets) {
            if (customCharset.enabled && customCharset.charset) {
              requirements.push({
                name: customCharset.name,
                charset: customCharset.charset,
                min: customCharset.min
              });
            }
          }
        }
        break;
    }

    // 除外オプションの適用
    return requirements.map(req => ({
      ...req,
      charset: this.applyExclusions(req.charset, criteria)
    }));
  }

  private applyExclusions(charset: string, criteria: CompositionPasswordRequest): string {
    let result = charset;

    if (criteria.excludeAmbiguous) {
      const ambiguousChars = this.DEFAULT_CHARACTERS.ambiguous.split('');
      result = result.split('').filter(char => !ambiguousChars.includes(char)).join('');
    }

    if (criteria.excludeSimilar) {
      const similarChars = this.DEFAULT_CHARACTERS.similar.split('');
      result = result.split('').filter(char => !similarChars.includes(char)).join('');
    }

    return result;
  }

  private generateSinglePassword(criteria: CompositionPasswordRequest, requirements: CompositionRequirement[]): string {
    let password = '';
    let remainingLength = criteria.length;

    // Step 1: 必須文字種から文字を配置
    for (const req of requirements) {
      if (req.min > 0 && req.charset.length > 0) {
        for (let j = 0; j < req.min; j++) {
          if (remainingLength > 0) {
            const char = this.getRandomChar(req.charset);
            password += char;
            remainingLength--;
          }
        }
      }
    }

    // Step 2: 残りの文字数をランダム生成
    const allChars = this.buildAllowedCharset(requirements);
    for (let j = 0; j < remainingLength; j++) {
      const char = this.getRandomChar(allChars);
      password += char;
    }

    // Step 3: シャッフル
    return this.shuffleString(password);
  }

  private getRandomChar(charset: string): string {
    if (charset.length === 0) {
      throw new Error('文字セットが空です');
    }
    
    const randomBytes = crypto.randomBytes(4);
    const randomIndex = randomBytes.readUInt32BE(0) % charset.length;
    const char = charset.charAt(randomIndex); // charAtを使用して安全に取得
    return char;
  }

  private buildAllowedCharset(requirements: CompositionRequirement[]): string {
    let charset = '';
    for (const req of requirements) {
      charset += req.charset;
    }
    
    // 重複文字を除去
    return [...new Set(charset.split(''))].join('');
  }

  private shuffleString(password: string): string {
    const array = password.split('');
    for (let i = array.length - 1; i > 0; i--) {
      const randomBytes = crypto.randomBytes(4);
      const j = randomBytes.readUInt32BE(0) % (i + 1);
      // 安全な配列操作
      const temp = array[i] || '';
      array[i] = array[j] || '';
      array[j] = temp;
    }
    return array.join('');
  }

  private checkRequirements(password: string, requirements: CompositionRequirement[]): RequirementSummary[] {
    return requirements.map(req => {
      const actualCount = password.split('').filter(char => req.charset.includes(char)).length;
      return {
        name: req.name,
        charset: req.charset,
        requiredCount: req.min,
        actualCount,
        satisfied: actualCount >= req.min
      };
    });
  }

  private calculateStrength(criteria: CompositionPasswordRequest, requirements: CompositionRequirement[]): 'weak' | 'medium' | 'strong' | 'very-strong' {
    let score = 0;
    
    // 長さによるスコア
    if (criteria.length >= 16) score += 3;
    else if (criteria.length >= 12) score += 2;
    else if (criteria.length >= 8) score += 1;
    
    // 要件数による加点
    score += requirements.filter(req => req.min > 0).length;
    
    // カスタム設定による加点
    if (criteria.composition === 'custom-symbols' || criteria.composition === 'custom-charsets') {
      score += 1;
    }
    
    // 除外オプションによる加点
    if (criteria.excludeAmbiguous || criteria.excludeSimilar) {
      score += 1;
    }
    
    // スコアによる評価
    if (score >= 8) return 'very-strong';
    if (score >= 6) return 'strong';
    if (score >= 4) return 'medium';
    return 'weak';
  }

  private estimateCrackTime(criteria: CompositionPasswordRequest, requirements: CompositionRequirement[]): string {
    const charset = this.buildAllowedCharset(requirements);
    const characterPoolSize = charset.length;
    
    if (characterPoolSize === 0) {
      return '計算不可';
    }

    // エントロピー計算
    const entropy = Math.log2(characterPoolSize) * criteria.length;
    
    // 1秒間に10億回試行と仮定して総当たり時間を計算
    const totalCombinations = Math.pow(characterPoolSize, criteria.length);
    const secondsTocrack = totalCombinations / (2 * 1e9);

    if (secondsTocrack < 1) return '1秒未満';
    if (secondsTocrack < 60) return `${Math.round(secondsTocrack)}秒`;
    if (secondsTocrack < 3600) return `${Math.round(secondsTocrack / 60)}分`;
    if (secondsTocrack < 86400) return `${Math.round(secondsTocrack / 3600)}時間`;
    if (secondsTocrack < 31536000) return `${Math.round(secondsTocrack / 86400)}日`;
    if (secondsTocrack < 31536000000) return `${Math.round(secondsTocrack / 31536000)}年`;
    return '数十億年以上';
  }

  private async saveToDatabase(
    passwords: string[],
    criteria: CompositionPasswordRequest,
    strength: 'weak' | 'medium' | 'strong' | 'very-strong',
    estimatedCrackTime: string,
    userSession?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      // 有効期限設定（24時間後）
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + this.RETENTION_HOURS);

      // 各パスワードをハッシュ化して保存
      for (const password of passwords) {
        const passwordHash = this.hashPassword(password);
        
        await database.run(`
          INSERT INTO generated_passwords (
            password_hash, criteria, strength, estimated_crack_time,
            expires_at, user_session_id, ip_address, user_agent
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          passwordHash,
          JSON.stringify(criteria),
          strength,
          estimatedCrackTime,
          expiresAt.toISOString(),
          userSession || null,
          ipAddress || null,
          userAgent || null
        ]);
      }
    } catch (error) {
      console.error('❌ データベース保存エラー:', error);
      // データベース保存エラーでもパスワード生成は継続
    }
  }

  private hashPassword(password: string): string {
    return crypto.createHash('sha256')
      .update(password + process.env.PASSWORD_SALT || 'td-buddy-salt')
      .digest('hex');
  }

  // プリセット一覧取得
  getAvailablePresets(): CompositionDefinition[] {
    return Object.values(this.COMPOSITION_PRESETS);
  }
} 