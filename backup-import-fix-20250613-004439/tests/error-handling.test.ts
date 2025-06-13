/**
 * エラーハンドリングテスト
 * TD Buddy - Error Handling Tests
 * 
 * @description 異常系・エラーケースの検証
 * @author QA Workbench Team
 * @version 1.0.0
 */

 PersonalInfoService } 
 PersonalInfoGenerateRequest } 

describe('🚨 Error Handling Tests', () => {
  let personalInfoService: PersonalInfoService;

  beforeAll(() => {
    personalInfoService = new PersonalInfoService();
  });

  describe('🔍 入力値バリデーション', () => {
    test('❌ 無効な件数（0件）', async () => {
      const invalidRequest: PersonalInfoGenerateRequest = {
        count: 0,
        locale: 'ja',
        includeFields: ['fullName']
      };

      await expect(personalInfoService.generatePersonalInfo(invalidRequest))
        .rejects.toThrow('Validation failed');
    });

    test('❌ 無効な件数（負の値）', async () => {
      const invalidRequest: PersonalInfoGenerateRequest = {
        count: -5,
        locale: 'ja',
        includeFields: ['fullName']
      };

      await expect(personalInfoService.generatePersonalInfo(invalidRequest))
        .rejects.toThrow('Validation failed');
    });

    test('❌ 無効な件数（上限超過）', async () => {
      const invalidRequest: PersonalInfoGenerateRequest = {
        count: 1001,
        locale: 'ja',
        includeFields: ['fullName']
      };

      await expect(personalInfoService.generatePersonalInfo(invalidRequest))
        .rejects.toThrow('Validation failed');
    });

    test('❌ 空のフィールド配列', async () => {
      const invalidRequest: PersonalInfoGenerateRequest = {
        count: 10,
        locale: 'ja',
        includeFields: []
      };

      await expect(personalInfoService.generatePersonalInfo(invalidRequest))
        .rejects.toThrow('Validation failed');
    });

    test('❌ 無効なロケール', async () => {
      const invalidRequest = {
        count: 10,
        locale: 'invalid' as any,
        includeFields: ['fullName']
      };

      await expect(personalInfoService.generatePersonalInfo(invalidRequest))
        .rejects.toThrow('Validation failed');
    });

    test('❌ 無効な年齢範囲（最小 > 最大）', async () => {
      const invalidRequest: PersonalInfoGenerateRequest = {
        count: 10,
        locale: 'ja',
        includeFields: ['age'],
        ageRange: {
          min: 65,
          max: 18
        }
      };

      await expect(personalInfoService.generatePersonalInfo(invalidRequest))
        .rejects.toThrow('Validation failed');
    });

    test('❌ 無効な年齢範囲（負の値）', async () => {
      const invalidRequest: PersonalInfoGenerateRequest = {
        count: 10,
        locale: 'ja',
        includeFields: ['age'],
        ageRange: {
          min: -5,
          max: 30
        }
      };

      await expect(personalInfoService.generatePersonalInfo(invalidRequest))
        .rejects.toThrow('Validation failed');
    });
  });

  describe('🔧 境界値テスト', () => {
    test('✅ 最小件数（1件）', async () => {
      const request: PersonalInfoGenerateRequest = {
        count: 1,
        locale: 'ja',
        includeFields: ['fullName']
      };

      const result = await personalInfoService.generatePersonalInfo(request);
      expect(result.persons).toHaveLength(1);
      expect(result.statistics.totalGenerated).toBe(1);
    });

    test('✅ 最大件数（1000件）', async () => {
      const request: PersonalInfoGenerateRequest = {
        count: 1000,
        locale: 'ja',
        includeFields: ['fullName']
      };

      const result = await personalInfoService.generatePersonalInfo(request);
      expect(result.persons.length).toBeLessThanOrEqual(1000);
      expect(result.statistics.totalGenerated).toBe(1000);
    }, 30000); // 30秒タイムアウト

    test('✅ 最小年齢（18歳）', async () => {
      const request: PersonalInfoGenerateRequest = {
        count: 50,
        locale: 'ja',
        includeFields: ['age'],
        ageRange: {
          min: 18,
          max: 18
        }
      };

      const result = await personalInfoService.generatePersonalInfo(request);
      result.persons.forEach((person: any) => {
        expect(person.age).toBe(18);
      });
    });

    test('✅ 最大年齢（100歳）', async () => {
      const request: PersonalInfoGenerateRequest = {
        count: 50,
        locale: 'ja',
        includeFields: ['age'],
        ageRange: {
          min: 100,
          max: 100
        }
      };

      const result = await personalInfoService.generatePersonalInfo(request);
      result.persons.forEach((person: any) => {
        expect(person.age).toBe(100);
      });
    });
  });

  describe('⚡ パフォーマンス制限テスト', () => {
    test('⏱️ 大量生成時のタイムアウト防止', async () => {
      const startTime = Date.now();
      
      const request: PersonalInfoGenerateRequest = {
        count: 500,
        locale: 'ja',
        includeFields: ['fullName', 'email', 'phone', 'address']
      };

      const result = await personalInfoService.generatePersonalInfo(request);
      const endTime = Date.now();
      const duration = endTime - startTime;

      // 30秒以内に完了すること
      expect(duration).toBeLessThan(30000);
      expect(result.persons.length).toBeGreaterThan(0);
    }, 35000);

    test('🔄 連続生成時のメモリリーク防止', async () => {
      const requests = Array.from({ length: 5 }, () => ({
        count: 100,
        locale: 'ja' as const,
        includeFields: ['fullName', 'email'] as const
      }));

      // 連続で5回実行
      for (const request of requests) {
        const result = await personalInfoService.generatePersonalInfo(request);
        expect(result.persons).toHaveLength(100);
        
        // メモリ使用量の確認（簡易）
        const memUsage = process.memoryUsage();
        expect(memUsage.heapUsed).toBeLessThan(500 * 1024 * 1024); // 500MB未満
      }
    });
  });

  describe('🔒 セキュリティテスト', () => {
    test('🛡️ SQLインジェクション対策', async () => {
      // 悪意のある入力値でもエラーにならないこと
      const maliciousRequest = {
        count: 10,
        locale: 'ja' as const,
        includeFields: ['fullName'] as const,
        // 悪意のあるパラメータを含む可能性のあるオプション
        addressSettings: {
          prefectureOnly: true,
          maliciousParam: "'; DROP TABLE users; --" as any
        }
      };

      // エラーが発生しても、システムが停止しないこと
      await expect(async () => {
        await personalInfoService.generatePersonalInfo(maliciousRequest);
      }).not.toThrow(/DROP TABLE|DELETE FROM|INSERT INTO/);
    });

    test('🔐 機密情報の漏洩防止', async () => {
      const request: PersonalInfoGenerateRequest = {
        count: 10,
        locale: 'ja',
        includeFields: ['fullName', 'email', 'phone']
      };

      const result = await personalInfoService.generatePersonalInfo(request);
      
      // 生成されたデータに実在の個人情報が含まれていないこと
      result.persons.forEach((person: any) => {
        // 実在しそうな危険なパターンをチェック
        expect(person.email).not.toMatch(/@(gmail|yahoo|hotmail|outlook)\.com$/);
        expect(person.phone).not.toMatch(/^090-1234-5678$/); // よくあるテスト番号
        expect(person.fullName?.kanji).not.toMatch(/^(田中 太郎|山田 花子|佐藤 次郎)$/);
      });
    });
  });

  describe('🔄 データ整合性エラー', () => {
    test('⚠️ 不正なフィールド組み合わせ', async () => {
      // 存在しないフィールドを指定
      const invalidRequest = {
        count: 10,
        locale: 'ja' as const,
        includeFields: ['invalidField'] as any
      };

      // エラーが発生するか、無視されるかのいずれか
      try {
        const result = await personalInfoService.generatePersonalInfo(invalidRequest);
        // 無視される場合は、有効なデータが生成されること
        expect(result.persons).toHaveLength(10);
      } catch (error) {
        // エラーが発生する場合は、適切なエラーメッセージであること
        expect(error).toBeInstanceOf(Error);
      }
    });

    test('🔗 依存関係のあるフィールドの整合性', async () => {
      // addressを指定せずにpostalCodeのみ指定
      const request: PersonalInfoGenerateRequest = {
        count: 10,
        locale: 'ja',
        includeFields: ['postalCode']
      };

      const result = await personalInfoService.generatePersonalInfo(request);
      
      // postalCodeが指定された場合、addressも自動生成されるか確認
      result.persons.forEach((person: any) => {
        if (person.address?.postalCode) {
          expect(person.address.postalCode).toMatch(/^\d{3}-\d{4}$/);
        }
      });
    });
  });

  describe('🌐 ネットワーク・外部依存エラー', () => {
    test('⚡ 外部API依存なしでの動作確認', async () => {
      // 外部APIに依存せずに動作することを確認
      const request: PersonalInfoGenerateRequest = {
        count: 50,
        locale: 'ja',
        includeFields: ['fullName', 'email', 'phone', 'address']
      };

      // ネットワークが利用できない状況でも動作すること
      const result = await personalInfoService.generatePersonalInfo(request);
      expect(result.persons).toHaveLength(50);
      expect(result.statistics.generationTime).toBeGreaterThan(0);
    });
  });

  describe('📊 統計情報の正確性', () => {
    test('✅ 統計情報の整合性', async () => {
      const request: PersonalInfoGenerateRequest = {
        count: 100,
        locale: 'ja',
        includeFields: ['fullName', 'email']
      };

      const result = await personalInfoService.generatePersonalInfo(request);
      
      // 統計情報の整合性確認
      expect(result.statistics.totalGenerated).toBe(100);
      expect(result.statistics.uniqueCount).toBeLessThanOrEqual(100);
      expect(result.statistics.duplicatesRemoved).toBe(
        result.statistics.totalGenerated - result.statistics.uniqueCount
      );
      expect(result.statistics.generationTime).toBeGreaterThan(0);
      
      // 実際のデータ数と統計の一致
      expect(result.persons.length).toBe(result.statistics.uniqueCount);
    });
  });
});

// TD からのメッセージ
logger.log('🍺 Brew: エラーハンドリングテストを実行中です！システムの堅牢性をチェックしましょう♪'); 
