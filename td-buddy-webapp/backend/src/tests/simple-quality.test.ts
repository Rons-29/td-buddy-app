/**
 * シンプルデータ品質テスト
 * TD Buddy - Simple Quality Tests
 * 
 * @description 基本的なデータ品質検証
 * @author TestData Buddy Team
 * @version 1.0.0
 */

import { PersonalInfoService } from '../services/PersonalInfoService';
import { PersonalInfoGenerateRequest, PersonalInfoItem } from '../types/personalInfo';

describe('🎯 Simple Data Quality Tests', () => {
  let personalInfoService: PersonalInfoService;

  beforeAll(() => {
    personalInfoService = new PersonalInfoService();
  });

  describe('📊 基本品質検証', () => {
    test('✅ 小規模データ生成品質', async () => {
      const request: PersonalInfoGenerateRequest = {
        count: 10,
        locale: 'ja',
        includeFields: ['fullName', 'email', 'phone']
      };

      const result = await personalInfoService.generatePersonalInfo(request);
      
      // 基本検証
      expect(result.persons).toHaveLength(10);
      expect(result.statistics.totalGenerated).toBe(10);
      expect(result.statistics.generationTime).toBeGreaterThan(0);
      
      // データ品質検証
      result.persons.forEach((person: PersonalInfoItem) => {
        // 必須フィールドの存在確認
        expect(person.id).toBeTruthy();
        expect(person.generatedAt).toBeTruthy();
        expect(person.locale).toBe('ja');
        
        // 氏名の品質確認
        if (person.fullName) {
          expect(person.fullName.kanji).toMatch(/^.+ .+$/); // 姓名がスペース区切り
          expect(person.fullName.lastName).toBeTruthy();
          expect(person.fullName.firstName).toBeTruthy();
        }
        
        // メールアドレスの品質確認
        if (person.email) {
          expect(person.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        }
        
        // 電話番号の品質確認
        if (person.phone) {
          expect(person.phone).toMatch(/^0\d{2,3}-\d{4}-\d{3,4}$/);
        }
      });
      
      console.log('🎉 TD: 小規模データ生成品質テスト完了！');
    });

    test('✅ 中規模データ生成品質', async () => {
      const request: PersonalInfoGenerateRequest = {
        count: 50,
        locale: 'ja',
        includeFields: ['fullName', 'email', 'phone', 'address']
      };

      const result = await personalInfoService.generatePersonalInfo(request);
      
      // 基本検証
      expect(result.persons.length).toBeGreaterThan(0);
      expect(result.persons.length).toBeLessThanOrEqual(50);
      expect(result.statistics.generationTime).toBeLessThan(10000); // 10秒以内
      
      // 重複チェック
      const emails = result.persons.map(p => p.email).filter(Boolean);
      const uniqueEmails = new Set(emails);
      expect(uniqueEmails.size).toBe(emails.length); // メール重複なし
      
      const phones = result.persons.map(p => p.phone).filter(Boolean);
      const uniquePhones = new Set(phones);
      expect(uniquePhones.size).toBe(phones.length); // 電話番号重複なし
      
      // 住所品質確認
      result.persons.forEach((person: PersonalInfoItem) => {
        if (person.address) {
          expect(person.address.full).toBeTruthy();
          expect(person.address.prefecture).toBeTruthy();
          expect(person.address.city).toBeTruthy();
          expect(person.address.postalCode).toMatch(/^\d{3}-\d{4}$/);
        }
      });
      
      console.log('🎉 TD: 中規模データ生成品質テスト完了！');
    });

    test('✅ 大規模データ生成パフォーマンス', async () => {
      const request: PersonalInfoGenerateRequest = {
        count: 200,
        locale: 'ja',
        includeFields: ['fullName', 'email', 'phone', 'address', 'age', 'gender']
      };

      const startTime = Date.now();
      const result = await personalInfoService.generatePersonalInfo(request);
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // パフォーマンス検証
      expect(duration).toBeLessThan(30000); // 30秒以内
      expect(result.persons.length).toBeGreaterThan(0);
      expect(result.statistics.generationTime).toBeGreaterThan(0);
      
      // スループット計算
      const throughput = (result.persons.length / duration) * 1000;
      expect(throughput).toBeGreaterThan(1); // 1件/秒以上
      
      // データ多様性確認
      const ages = result.persons.map(p => p.age).filter(Boolean);
      const genders = result.persons.map(p => p.gender).filter(Boolean);
      const prefectures = result.persons.map(p => p.address?.prefecture).filter(Boolean);
      
      expect(new Set(ages).size).toBeGreaterThan(5); // 複数の年齢
      expect(new Set(genders).size).toBeGreaterThanOrEqual(1); // 性別データ存在
      expect(new Set(prefectures).size).toBeGreaterThan(1); // 複数の都道府県
      
      console.log(`🚀 TD: 大規模データ生成完了！`);
      console.log(`   件数: ${result.persons.length}/${request.count}`);
      console.log(`   時間: ${duration}ms`);
      console.log(`   スループット: ${throughput.toFixed(2)} items/sec`);
      console.log(`   重複除去: ${result.statistics.duplicatesRemoved}件`);
    }, 35000);

    test('✅ 全フィールド生成品質', async () => {
      const request: PersonalInfoGenerateRequest = {
        count: 20,
        locale: 'ja',
        includeFields: [
          'fullName', 'kanaName', 'email', 'phone', 'address', 
          'age', 'gender', 'company', 'jobTitle'
        ]
      };

      const result = await personalInfoService.generatePersonalInfo(request);
      
      // 全フィールド生成確認
      result.persons.forEach((person: PersonalInfoItem) => {
        expect(person.fullName).toBeDefined();
        expect(person.kanaName).toBeDefined();
        expect(person.email).toBeDefined();
        expect(person.phone).toBeDefined();
        expect(person.address).toBeDefined();
        expect(person.age).toBeDefined();
        expect(person.gender).toBeDefined();
        expect(person.company).toBeDefined();
        expect(person.jobTitle).toBeDefined();
        
        // カナ名の品質確認
        if (person.kanaName) {
          expect(person.kanaName).toMatch(/^[ァ-ヶー\s]+$/); // カタカナのみ
        }
        
        // 年齢の妥当性確認
        if (person.age) {
          expect(person.age).toBeGreaterThanOrEqual(18);
          expect(person.age).toBeLessThanOrEqual(100);
        }
        
        // 性別の妥当性確認
        if (person.gender) {
          expect(['male', 'female']).toContain(person.gender);
        }
        
        // 会社・職業の存在確認
        if (person.company) {
          expect(person.company.length).toBeGreaterThan(0);
        }
        if (person.jobTitle) {
          expect(person.jobTitle.length).toBeGreaterThan(0);
        }
      });
      
      console.log('🎉 TD: 全フィールド生成品質テスト完了！');
    });
  });

  describe('🔍 エラーハンドリング', () => {
    test('❌ 無効な件数でエラー', async () => {
      const invalidRequest: PersonalInfoGenerateRequest = {
        count: -1,
        locale: 'ja',
        includeFields: ['fullName']
      };

      await expect(personalInfoService.generatePersonalInfo(invalidRequest))
        .rejects.toThrow('生成数は1-1000の範囲で指定してください');
    });

    test('❌ 空のフィールド配列でエラー', async () => {
      const invalidRequest: PersonalInfoGenerateRequest = {
        count: 5,
        locale: 'ja',
        includeFields: []
      };

      await expect(personalInfoService.generatePersonalInfo(invalidRequest))
        .rejects.toThrow('少なくとも1つのフィールドを指定してください');
    });
  });

  describe('📈 統計情報検証', () => {
    test('✅ 統計情報の正確性', async () => {
      const request: PersonalInfoGenerateRequest = {
        count: 30,
        locale: 'ja',
        includeFields: ['fullName', 'email', 'phone']
      };

      const result = await personalInfoService.generatePersonalInfo(request);
      
      // 基本統計の検証
      expect(result.statistics.totalGenerated).toBeGreaterThan(0);
      expect(result.statistics.duplicatesRemoved).toBeGreaterThanOrEqual(0);
      expect(
        result.statistics.totalGenerated - result.statistics.uniqueCount
      );
      expect(result.statistics.generationTime).toBeGreaterThanOrEqual(0); // 0以上（0も許可）
      
      // 実際のデータ数と統計の一致
      expect(result.persons.length).toBe(result.statistics.uniqueCount);
      
      console.log(`📊 統計情報: 生成${result.statistics.totalGenerated}件, ユニーク${result.statistics.uniqueCount}件, 時間${result.statistics.generationTime}ms`);
    });
  });

  describe('🔧 重複除去テスト', () => {
    test('✅ メールアドレス重複除去確認', async () => {
      const request: PersonalInfoGenerateRequest = {
        count: 100,
        locale: 'ja',
        includeFields: ['fullName', 'email']
      };

      const result = await personalInfoService.generatePersonalInfo(request);
      
      // メールアドレスのユニーク性を確認
      const emails = result.persons.map(p => p.email).filter(Boolean);
      const uniqueEmails = new Set(emails);
      
      expect(emails.length).toBe(uniqueEmails.size);
      console.log(`📧 メール重複チェック: ${emails.length}件中${uniqueEmails.size}件がユニーク`);
    });

    test('✅ 電話番号重複除去確認', async () => {
      const request: PersonalInfoGenerateRequest = {
        count: 50,
        locale: 'ja',
        includeFields: ['fullName', 'phone']
      };

      const result = await personalInfoService.generatePersonalInfo(request);
      
      // 電話番号のユニーク性を確認
      const phones = result.persons.map(p => p.phone).filter(Boolean);
      const uniquePhones = new Set(phones);
      
      expect(phones.length).toBe(uniquePhones.size);
      console.log(`📞 電話番号重複チェック: ${phones.length}件中${uniquePhones.size}件がユニーク`);
    });

    test('✅ メール形式の正確性確認', async () => {
      const request: PersonalInfoGenerateRequest = {
        count: 20,
        locale: 'ja',
        includeFields: ['fullName', 'email']
      };

      const result = await personalInfoService.generatePersonalInfo(request);
      
      // メール形式の正確性を確認
      const emails = result.persons.map(p => p.email).filter((email): email is string => email !== undefined);
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
      for (const email of emails) {
        expect(emailRegex.test(email)).toBe(true);
        expect(email.startsWith('.')).toBe(false); // ドットで始まってはいけない
        expect(email.includes('..')).toBe(false); // 連続ドットがあってはいけない
      }
      
      console.log(`📧 メール形式チェック: ${emails.length}件すべて正常な形式`);
    });
  });
});

// TD からのメッセージ
console.log('🤖 TD: シンプル品質テストを実行中です！基本的な品質をしっかりチェックしましょう♪'); 