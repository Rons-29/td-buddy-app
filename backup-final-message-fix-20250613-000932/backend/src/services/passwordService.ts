import crypto from 'crypto';
import { database } from '../database/database';
import { InsertGeneratedPassword } from '../types/database';
import { PasswordGenerateRequest, PasswordGenerateResponse } from '../types/api';

export class PasswordService {
  private readonly DEFAULT_CHARACTERS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    ambiguous: 'il1Lo0O'
  };

  private readonly RETENTION_HOURS = 24; // 24時間でデータを削除

  async generatePasswords(
    criteria: PasswordGenerateRequest,
    userSession?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<PasswordGenerateResponse> {
    const startTime = Date.now();
    
    try {
      const passwords: string[] = [];
      
      // パスワード生成
      for (let i = 0; i < criteria.count; i++) {
        const password = this.generateSinglePassword(criteria);
        passwords.push(password);
      }

      const strength = this.calculateStrength(criteria);
      const estimatedCrackTime = this.estimateCrackTime(criteria);

      const response: PasswordGenerateResponse = {
        passwords,
        criteria,
        strength,
        estimatedCrackTime,
        generatedAt: new Date().toISOString()
      };

      // データベースに保存（パスワードはハッシュ化）
      await this.saveToDatabase(passwords, criteria, strength, estimatedCrackTime, userSession, ipAddress, userAgent);

      const processingTime = Date.now() - startTime;
      console.log(`✅ パスワード生成完了: ${passwords.length}件 (${processingTime}ms)`);
      console.log(`🍺 Brew: ${strength}レベルのパスワードを生成しました！`);

      return response;

    } catch (error) {
      console.error('❌ パスワード生成エラー:', error);
      throw new Error('パスワード生成に失敗しました');
    }
  }

  private generateSinglePassword(criteria: PasswordGenerateRequest): string {
    let characterSet = '';

    // 文字種の組み合わせ
    if (criteria.includeUppercase) {
      characterSet += this.DEFAULT_CHARACTERS.uppercase;
    }
    if (criteria.includeLowercase) {
      characterSet += this.DEFAULT_CHARACTERS.lowercase;
    }
    if (criteria.includeNumbers) {
      characterSet += this.DEFAULT_CHARACTERS.numbers;
    }
    if (criteria.includeSymbols) {
      characterSet += this.DEFAULT_CHARACTERS.symbols;
    }
    if (criteria.customCharacters) {
      characterSet += criteria.customCharacters;
    }

    // 曖昧な文字を除外
    if (criteria.excludeAmbiguous) {
      const ambiguousChars = this.DEFAULT_CHARACTERS.ambiguous.split('');
      characterSet = characterSet.split('').filter(char => 
        !ambiguousChars.includes(char)
      ).join('');
    }

    if (characterSet.length === 0) {
      throw new Error('使用可能な文字が選択されていません');
    }

    // 暗号学的に安全な乱数でパスワード生成
    let password = '';
    for (let i = 0; i < criteria.length; i++) {
      const randomBytes = crypto.randomBytes(4);
      const randomIndex = randomBytes.readUInt32BE(0) % characterSet.length;
      password += characterSet[randomIndex];
    }

    return password;
  }

  private calculateStrength(criteria: PasswordGenerateRequest): 'weak' | 'medium' | 'strong' | 'very-strong' {
    let score = 0;
    
    // 長さによるスコア
    if (criteria.length >= 16) score += 3;
    else if (criteria.length >= 12) score += 2;
    else if (criteria.length >= 8) score += 1;
    
    // 文字種による加点
    if (criteria.includeUppercase) score += 1;
    if (criteria.includeLowercase) score += 1;
    if (criteria.includeNumbers) score += 1;
    if (criteria.includeSymbols) score += 2;
    
    // カスタム文字による加点
    if (criteria.customCharacters && criteria.customCharacters.length > 0) {
      score += 1;
    }
    
    // スコアによる評価
    if (score >= 8) return 'very-strong';
    if (score >= 6) return 'strong';
    if (score >= 4) return 'medium';
    return 'weak';
  }

  private estimateCrackTime(criteria: PasswordGenerateRequest): string {
    let characterPoolSize = 0;
    
    if (criteria.includeUppercase) characterPoolSize += 26;
    if (criteria.includeLowercase) characterPoolSize += 26;
    if (criteria.includeNumbers) characterPoolSize += 10;
    if (criteria.includeSymbols) characterPoolSize += 32;
    if (criteria.customCharacters) characterPoolSize += criteria.customCharacters.length;
    
    // 曖昧な文字を除外している場合
    if (criteria.excludeAmbiguous) {
      characterPoolSize = Math.max(0, characterPoolSize - 8);
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
    criteria: PasswordGenerateRequest,
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
        
        const passwordRecord: InsertGeneratedPassword = {
          password_hash: passwordHash,
          criteria: JSON.stringify(criteria),
          strength,
          estimated_crack_time: estimatedCrackTime,
          expires_at: expiresAt.toISOString(),
          ...(userSession && { user_session_id: userSession }),
          ...(ipAddress && { ip_address: ipAddress }),
          ...(userAgent && { user_agent: userAgent })
        };

        await database.run(`
          INSERT INTO generated_passwords (
            password_hash, criteria, strength, estimated_crack_time,
            expires_at, user_session_id, ip_address, user_agent
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          passwordRecord.password_hash,
          passwordRecord.criteria,
          passwordRecord.strength,
          passwordRecord.estimated_crack_time,
          passwordRecord.expires_at,
          passwordRecord.user_session_id,
          passwordRecord.ip_address,
          passwordRecord.user_agent
        ]);
      }

      console.log(`💾 パスワード${passwords.length}件をデータベースに保存しました`);
      console.log(`⏰ 有効期限: ${expiresAt.toLocaleString('ja-JP')}`);

    } catch (error) {
      console.error('❌ データベース保存エラー:', error);
      // データベース保存に失敗してもパスワード生成は継続
    }
  }

  private hashPassword(password: string): string {
    // パスワードの一方向ハッシュ化（SHA-256 + salt）
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHash('sha256');
    hash.update(password + salt);
    return salt + ':' + hash.digest('hex');
  }

  // パスワード強度チェック機能
  async analyzePasswordStrength(password: string): Promise<{
    strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    score: number;
    maxScore: number;
    analysis: {
      length: number;
      hasUppercase: boolean;
      hasLowercase: boolean;
      hasNumbers: boolean;
      hasSymbols: boolean;
      hasRepeating: boolean;
      hasSequential: boolean;
      entropy: number;
    };
    recommendations: string[];
  }> {
    const analysis = {
      length: password.length,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSymbols: /[^a-zA-Z0-9]/.test(password),
      hasRepeating: /(.)\1{2,}/.test(password),
      hasSequential: this.checkSequential(password),
      entropy: this.calculateEntropy(password)
    };

    let score = 0;
    const maxScore = 10;

    // スコア計算
    if (analysis.length >= 8) score += 1;
    if (analysis.length >= 12) score += 1;
    if (analysis.length >= 16) score += 1;
    if (analysis.hasUppercase) score += 1;
    if (analysis.hasLowercase) score += 1;
    if (analysis.hasNumbers) score += 1;
    if (analysis.hasSymbols) score += 2;
    if (!analysis.hasRepeating) score += 1;
    if (!analysis.hasSequential) score += 1;

    // 強度判定
    let strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    if (score >= 8) strength = 'very-strong';
    else if (score >= 6) strength = 'strong';
    else if (score >= 4) strength = 'medium';
    else strength = 'weak';

    // 推奨事項生成
    const recommendations = this.generateRecommendations(analysis);

    return {
      strength,
      score,
      maxScore,
      analysis,
      recommendations
    };
  }

  private checkSequential(password: string): boolean {
    // 連続文字チェック（abc, 123, qwerty など）
    const sequences = [
      'abcdefghijklmnopqrstuvwxyz',
      '0123456789',
      'qwertyuiop',
      'asdfghjkl',
      'zxcvbnm'
    ];

    for (const seq of sequences) {
      for (let i = 0; i <= seq.length - 3; i++) {
        const subseq = seq.substring(i, i + 3);
        if (password.toLowerCase().includes(subseq) || 
            password.toLowerCase().includes(subseq.split('').reverse().join(''))) {
          return true;
        }
      }
    }

    return false;
  }

  private calculateEntropy(password: string): number {
    const charSets = [
      { chars: 'abcdefghijklmnopqrstuvwxyz', name: 'lowercase' },
      { chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', name: 'uppercase' },
      { chars: '0123456789', name: 'numbers' },
      { chars: '!@#$%^&*()_+-=[]{}|;:,.<>?', name: 'symbols' }
    ];

    let charsetSize = 0;
    for (const charset of charSets) {
      if (password.split('').some(char => charset.chars.includes(char))) {
        charsetSize += charset.chars.length;
      }
    }

    return Math.log2(charsetSize) * password.length;
  }

  private generateRecommendations(analysis: any): string[] {
    const recommendations: string[] = [];

    if (analysis.length < 12) {
      recommendations.push('パスワードを12文字以上にすることをお勧めします');
    }
    if (!analysis.hasUppercase) {
      recommendations.push('大文字を含めると強度が向上します');
    }
    if (!analysis.hasLowercase) {
      recommendations.push('小文字を含めると強度が向上します');
    }
    if (!analysis.hasNumbers) {
      recommendations.push('数字を含めると強度が向上します');
    }
    if (!analysis.hasSymbols) {
      recommendations.push('記号を含めると大幅に強度が向上します');
    }
    if (analysis.hasRepeating) {
      recommendations.push('同じ文字の繰り返しは避けることをお勧めします');
    }
    if (analysis.hasSequential) {
      recommendations.push('連続した文字（abc、123など）は避けることをお勧めします');
    }
    if (analysis.entropy < 50) {
      recommendations.push('より多様な文字種を使用することをお勧めします');
    }

    if (recommendations.length === 0) {
      recommendations.push('素晴らしいパスワードです！セキュリティレベルは十分です。');
    }

    return recommendations;
  }

  // 生成履歴取得
  async getGenerationHistory(
    userSession?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{
    history: any[];
    total: number;
  }> {
    try {
      let query = `
        SELECT id, strength, estimated_crack_time, created_at, criteria
        FROM generated_passwords
      `;
      let countQuery = 'SELECT COUNT(*) as total FROM generated_passwords';
      const params: any[] = [];

      if (userSession) {
        query += ' WHERE user_session_id = ?';
        countQuery += ' WHERE user_session_id = ?';
        params.push(userSession);
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [history, totalResult] = await Promise.all([
        database.query(query, params),
        database.get(countQuery, userSession ? [userSession] : [])
      ]);

      return {
        history: history.map(record => ({
          ...record,
          criteria: JSON.parse(record.criteria)
        })),
        total: totalResult.total
      };

    } catch (error) {
      console.error('❌ 履歴取得エラー:', error);
      throw new Error('生成履歴の取得に失敗しました');
    }
  }

  // 統計情報取得
  async getStatistics(): Promise<{
    totalGenerated: number;
    strengthDistribution: Record<string, number>;
    popularLengths: Array<{ length: number; count: number }>;
    recentActivity: any[];
  }> {
    try {
      const [total, strengthDist, lengths, recent] = await Promise.all([
        // 総生成数
        database.get('SELECT COUNT(*) as total FROM generated_passwords'),
        
        // 強度別分布
        database.query(`
          SELECT strength, COUNT(*) as count 
          FROM generated_passwords 
          GROUP BY strength
        `),
        
        // 人気の長さ
        database.query(`
          SELECT 
            JSON_EXTRACT(criteria, '$.length') as length,
            COUNT(*) as count
          FROM generated_passwords 
          GROUP BY JSON_EXTRACT(criteria, '$.length')
          ORDER BY count DESC
          LIMIT 10
        `),
        
        // 最近のアクティビティ
        database.query(`
          SELECT strength, created_at, estimated_crack_time
          FROM generated_passwords
          ORDER BY created_at DESC
          LIMIT 20
        `)
      ]);

      const strengthDistribution: Record<string, number> = {};
      strengthDist.forEach(item => {
        strengthDistribution[item.strength] = item.count;
      });

      return {
        totalGenerated: total.total,
        strengthDistribution,
        popularLengths: lengths,
        recentActivity: recent
      };

    } catch (error) {
      console.error('❌ 統計取得エラー:', error);
      throw new Error('統計情報の取得に失敗しました');
    }
  }
} 