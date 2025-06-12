import crypto 
 database } 
import {
    UuidGenerateRequest,
    UuidGenerateResponse,
    UuidItem,
    UuidValidateRequest,
    UuidValidateResponse
} from '../types/api';
 InsertGeneratedUuid } 

export class UuidService {
  private readonly RETENTION_HOURS = 24; // 24時間でデータを削除

  async generateUuids(
    criteria: UuidGenerateRequest,
    userSession?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<UuidGenerateResponse> {
    const startTime = Date.now();
    
    try {
      const uuids: UuidItem[] = [];
      const versionDistribution: Record<string, number> = {};
      const formatDistribution: Record<string, number> = {};
      let totalEntropy = 0;
      
      // UUID生成
      for (let i = 0; i < criteria.count; i++) {
        const uuidItem = await this.generateSingleUuid(criteria, i);
        uuids.push(uuidItem);
        
        // 統計情報の更新
        versionDistribution[uuidItem.version] = (versionDistribution[uuidItem.version] || 0) + 1;
        formatDistribution[uuidItem.format] = (formatDistribution[uuidItem.format] || 0) + 1;
        totalEntropy += uuidItem.metadata.entropy;
      }

      const averageEntropy = totalEntropy / criteria.count;
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + this.RETENTION_HOURS);

      const response: UuidGenerateResponse = {
        uuids,
        criteria,
        statistics: {
          totalGenerated: criteria.count,
          versionDistribution,
          formatDistribution,
          averageEntropy
        },
        generatedAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString()
      };

      // データベースに保存
      await this.saveToDatabase(uuids, criteria, userSession, ipAddress, userAgent);

      const processingTime = Date.now() - startTime;
      logger.log(`✅ UUID生成完了: ${uuids.length}件 (${processingTime}ms)`);
      logger.log(`🍺 Brew: ${criteria.version}バージョンのUUIDを${criteria.format}形式で生成しました！`);

      return response;

    } catch (error) {
      logger.error('❌ UUID生成エラー:', error);
      throw new Error('UUID生成に失敗しました');
    }
  }

  private async generateSingleUuid(criteria: UuidGenerateRequest, index: number): Promise<UuidItem> {
    let version = criteria.version;
    
    // mixedモードの場合はランダムに選択
    if (version === 'mixed') {
      const versions = ['v1', 'v4', 'v6', 'v7'];
      version = versions[Math.floor(Math.random() * versions.length)] as any;
    }

    let uuid: string;
    let timestamp: string | undefined;
    let macAddress: string | undefined;

    switch (version) {
      case 'v1':
        uuid = this.generateV1();
        if (criteria.includeTimestamp) {
          timestamp = new Date().toISOString();
        }
        if (criteria.includeMacAddress) {
          macAddress = this.generateMacAddress();
        }
        break;
      case 'v4':
        uuid = this.generateV4();
        break;
      case 'v6':
        uuid = this.generateV6();
        if (criteria.includeTimestamp) {
          timestamp = new Date().toISOString();
        }
        break;
      case 'v7':
        uuid = this.generateV7();
        if (criteria.includeTimestamp) {
          timestamp = new Date().toISOString();
        }
        break;
      default:
        uuid = this.generateV4(); // デフォルトはv4
    }

    // フォーマット適用
    const formattedUuid = this.applyFormat(uuid, criteria.format, criteria.customPrefix);
    
    // メタデータ計算
    const metadata = {
      isValid: this.validateUuid(uuid),
      entropy: this.calculateEntropy(uuid),
      randomness: this.calculateRandomness(version) as 'low' | 'medium' | 'high' | 'cryptographic'
    };

    return {
      id: `uuid-${Date.now()}-${index}`,
      uuid: formattedUuid,
      version,
      format: criteria.format,
      timestamp,
      macAddress,
      namespace: criteria.namespace,
      generatedAt: new Date().toISOString(),
      metadata
    };
  }

  private generateV1(): string {
    // UUIDv1: タイムスタンプベース + MACアドレス
    const timestamp = Date.now();
    const timeHigh = (timestamp & 0xffffffff00000000) >> 32;
    const timeMid = (timestamp & 0x00000000ffff0000) >> 16;
    const timeLow = timestamp & 0x000000000000ffff;
    
    const clockSeq = Math.floor(Math.random() * 0x3fff);
    const node = crypto.randomBytes(6);
    
    return `${timeHigh.toString(16).padStart(8, '0')}-${timeMid.toString(16).padStart(4, '0')}-1${timeLow.toString(16).padStart(3, '0')}-${clockSeq.toString(16).padStart(4, '0')}-${node.toString('hex')}`;
  }

  private generateV4(): string {
    // UUIDv4: 完全にランダム
    const bytes = crypto.randomBytes(16);
    bytes[6] = (bytes[6]! & 0x0f) | 0x40; // バージョン4
    bytes[8] = (bytes[8]! & 0x3f) | 0x80; // バリアント10
    
    const hex = bytes.toString('hex');
    return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20, 32)}`;
  }

  private generateV6(): string {
    // UUIDv6: 改良版タイムスタンプベース
    const timestamp = Date.now();
    const timeHigh = (timestamp & 0xffffffffffff0000) >> 16;
    const timeLow = timestamp & 0x000000000000ffff;
    
    const clockSeq = Math.floor(Math.random() * 0x3fff);
    const node = crypto.randomBytes(6);
    
    return `${timeHigh.toString(16).padStart(12, '0').substring(0, 8)}-${timeHigh.toString(16).padStart(12, '0').substring(8, 12)}-6${timeLow.toString(16).padStart(3, '0')}-${clockSeq.toString(16).padStart(4, '0')}-${node.toString('hex')}`;
  }

  private generateV7(): string {
    // UUIDv7: Unix Timestampベース
    const timestamp = Math.floor(Date.now() / 1000);
    const timestampBytes = Buffer.alloc(6);
    timestampBytes.writeUIntBE(timestamp, 0, 6);
    
    const randomBytes = crypto.randomBytes(10);
    randomBytes[0] = (randomBytes[0]! & 0x0f) | 0x70; // バージョン7
    randomBytes[2] = (randomBytes[2]! & 0x3f) | 0x80; // バリアント10
    
    const combined = Buffer.concat([timestampBytes, randomBytes]);
    const hex = combined.toString('hex');
    
    return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20, 32)}`;
  }

  private generateMacAddress(): string {
    const bytes = crypto.randomBytes(6);
    return bytes.toString('hex').match(/.{2}/g)!.join(':').toUpperCase();
  }

  private applyFormat(uuid: string, format: string, customPrefix?: string): string {
    switch (format) {
      case 'compact':
        return uuid.replace(/-/g, '');
      case 'uppercase':
        return uuid.toUpperCase();
      case 'with-prefix':
        const prefix = customPrefix || 'uuid:';
        return `${prefix}${uuid}`;
      case 'sql-friendly':
        return `'${uuid}'`;
      default:
        return uuid; // standard形式
    }
  }

  private calculateEntropy(uuid: string): number {
    const cleanUuid = uuid.replace(/-/g, '');
    const uniqueChars = new Set(cleanUuid);
    return Math.log2(Math.pow(16, cleanUuid.length)) * (uniqueChars.size / 16);
  }

  private calculateRandomness(version: string): string {
    switch (version) {
      case 'v1':
      case 'v6':
        return 'medium'; // タイムスタンプベースなので中程度
      case 'v4':
        return 'cryptographic'; // 完全にランダム
      case 'v7':
        return 'high'; // Unix timestampベースだが高ランダム性
      default:
        return 'medium';
    }
  }

  private validateUuid(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  async validateUuids(request: UuidValidateRequest): Promise<UuidValidateResponse> {
    const results = [];
    const duplicates = new Set<string>();
    const seen = new Set<string>();
    
    for (const uuid of request.uuids) {
      if (seen.has(uuid)) {
        duplicates.add(uuid);
      }
      seen.add(uuid);
      
      const isValid = this.validateUuid(uuid);
      const version = isValid ? this.extractVersion(uuid) : undefined;
      const errors: string[] = [];
      const warnings: string[] = [];
      
      if (!isValid) {
        errors.push('無効なUUID形式です');
      }
      
      if (request.strictMode && isValid) {
        // 厳密モードでの追加チェック
        if (uuid.toLowerCase() !== uuid && uuid.toUpperCase() !== uuid) {
          warnings.push('大文字・小文字が混在しています');
        }
      }
      
      if (request.checkDuplicates && duplicates.has(uuid)) {
        warnings.push('重複したUUIDです');
      }
      
      results.push({
        uuid,
        isValid,
        version,
        errors: errors.length > 0 ? errors : undefined,
        warnings: warnings.length > 0 ? warnings : undefined
      });
    }
    
    return {
      results,
      summary: {
        totalChecked: request.uuids.length,
        validCount: results.filter(r => r.isValid).length,
        invalidCount: results.filter(r => !r.isValid).length,
        duplicateCount: duplicates.size
      }
    };
  }

  private extractVersion(uuid: string): string | undefined {
    const versionChar = uuid.charAt(14);
    switch (versionChar) {
      case '1': return 'v1';
      case '4': return 'v4';
      case '6': return 'v6';
      case '7': return 'v7';
      default: return undefined;
    }
  }

  private async saveToDatabase(
    uuids: UuidItem[],
    criteria: UuidGenerateRequest,
    userSession?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + this.RETENTION_HOURS);

      for (const uuidItem of uuids) {
        const uuidRecord: InsertGeneratedUuid = {
          uuid_value: uuidItem.uuid,
          version: uuidItem.version,
          format: uuidItem.format,
          criteria: JSON.stringify(criteria),
          metadata: JSON.stringify(uuidItem.metadata),
          expires_at: expiresAt.toISOString(),
          ...(userSession && { user_session_id: userSession }),
          ...(ipAddress && { ip_address: ipAddress }),
          ...(userAgent && { user_agent: userAgent })
        };

        await database.run(`
          INSERT INTO generated_uuids (
            uuid_value, version, format, criteria, metadata,
            expires_at, user_session_id, ip_address, user_agent
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          uuidRecord.uuid_value,
          uuidRecord.version,
          uuidRecord.format,
          uuidRecord.criteria,
          uuidRecord.metadata,
          uuidRecord.expires_at,
          uuidRecord.user_session_id,
          uuidRecord.ip_address,
          uuidRecord.user_agent
        ]);
      }

    } catch (error) {
      logger.error('❌ UUID データベース保存エラー:', error);
      // データベース保存に失敗してもUUID生成は継続
    }
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
        SELECT id, uuid_value, version, format, created_at, criteria
        FROM generated_uuids
      `;
      let countQuery = 'SELECT COUNT(*) as total FROM generated_uuids';
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
      logger.error('❌ UUID履歴取得エラー:', error);
      throw new Error('UUID生成履歴の取得に失敗しました');
    }
  }

  // 統計情報取得
  async getStatistics(): Promise<{
    totalGenerated: number;
    versionDistribution: Record<string, number>;
    formatDistribution: Record<string, number>;
    recentActivity: any[];
  }> {
    try {
      const [totalResult, versionStats, formatStats, recentActivity] = await Promise.all([
        database.get('SELECT COUNT(*) as total FROM generated_uuids'),
        database.query(`
          SELECT version, COUNT(*) as count 
          FROM generated_uuids 
          GROUP BY version 
          ORDER BY count DESC
        `),
        database.query(`
          SELECT format, COUNT(*) as count 
          FROM generated_uuids 
          GROUP BY format 
          ORDER BY count DESC
        `),
        database.query(`
          SELECT version, format, created_at, COUNT(*) as count
          FROM generated_uuids 
          WHERE created_at >= datetime('now', '-7 days')
          GROUP BY DATE(created_at), version, format
          ORDER BY created_at DESC
          LIMIT 10
        `)
      ]);

      const versionDistribution: Record<string, number> = {};
      versionStats.forEach((stat: any) => {
        versionDistribution[stat.version] = stat.count;
      });

      const formatDistribution: Record<string, number> = {};
      formatStats.forEach((stat: any) => {
        formatDistribution[stat.format] = stat.count;
      });

      return {
        totalGenerated: totalResult.total,
        versionDistribution,
        formatDistribution,
        recentActivity
      };

    } catch (error) {
      logger.error('❌ UUID統計取得エラー:', error);
      throw new Error('UUID統計情報の取得に失敗しました');
    }
  }
} 
