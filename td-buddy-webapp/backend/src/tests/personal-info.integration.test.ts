/**
 * 個人情報生成機能 統合テスト
 * TD Buddy - Personal Info Generation Integration Tests
 * 
 * @description 個人情報生成APIの包括的テスト
 * @author TestData Buddy Team
 * @version 1.0.0
 */

import request from 'supertest';
import { Express } from 'express';
import { PersonalInfoService } from '../services/PersonalInfoService';
import { PerformanceService } from '../services/PerformanceService';

describe('🧑‍💼 Personal Info Generation Integration Tests', () => {
  let app: Express;
  let personalInfoService: PersonalInfoService;
  let performanceService: PerformanceService;

  beforeAll(async () => {
    // テスト用アプリケーション初期化
    const { default: createApp } = await import('../index');
    app = createApp;
    personalInfoService = new PersonalInfoService();
    performanceService = PerformanceService.getInstance();
  });

  describe('🔧 API Endpoint Tests', () => {
    test('✅ POST /api/personal/generate - 基本生成テスト', async () => {
      const response = await request(app)
        .post('/api/personal/generate')
        .send({
          count: 5,
          locale: 'ja',
          includeFields: ['fullName', 'email', 'phone']
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(5);
      expect(response.body.performance).toBeDefined();
      
      // データ構造検証
      response.body.data.forEach((person: any) => {
        expect(person.id).toBeDefined();
        expect(person.generatedAt).toBeDefined();
        expect(person.fullName).toBeDefined();
        expect(person.email).toBeDefined();
        expect(person.phone).toBeDefined();
      });
    });

    test('✅ POST /api/personal/generate - 全フィールド生成テスト', async () => {
      const response = await request(app)
        .post('/api/personal/generate')
        .send({
          count: 3,
          locale: 'ja',
          includeFields: ['fullName', 'kanaName', 'email', 'phone', 'address', 'age', 'gender', 'company', 'jobTitle']
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(3);
      
      response.body.data.forEach((person: any) => {
        expect(person.fullName).toBeDefined();
        expect(person.kanaName).toBeDefined();
        expect(person.email).toBeDefined();
        expect(person.phone).toBeDefined();
        expect(person.address).toBeDefined();
        expect(person.age).toBeDefined();
        expect(person.gender).toBeDefined();
        expect(person.company).toBeDefined();
        expect(person.jobTitle).toBeDefined();
      });
    });

    test('✅ POST /api/personal/export/csv - CSVエクスポートテスト', async () => {
      // まず生成
      const generateResponse = await request(app)
        .post('/api/personal/generate')
        .send({
          count: 2,
          locale: 'ja',
          includeFields: ['fullName', 'email', 'phone']
        });

      expect(generateResponse.status).toBe(200);

      // CSVエクスポート
      const exportResponse = await request(app)
        .post('/api/personal/export/csv')
        .send({
          data: generateResponse.body.data
        });

      expect(exportResponse.status).toBe(200);
      expect(exportResponse.headers['content-type']).toContain('text/csv');
      expect(exportResponse.text).toContain('fullName');
      expect(exportResponse.text).toContain('email');
      expect(exportResponse.text).toContain('phone');
    });
  });

  describe('🔄 重複データ除去テスト', () => {
    test('✅ 大量生成時の重複検証', async () => {
      const response = await request(app)
        .post('/api/personal/generate')
        .send({
          count: 100,
          locale: 'ja',
          includeFields: ['fullName', 'email', 'phone']
        });

      expect(response.status).toBe(200);
      const data = response.body.data;

      // ID重複チェック
      const ids = data.map((person: any) => person.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);

      // メール重複チェック
      const emails = data.map((person: any) => person.email);
      const uniqueEmails = new Set(emails);
      expect(uniqueEmails.size).toBe(emails.length);

      // 電話番号重複チェック
      const phones = data.map((person: any) => person.phone);
      const uniquePhones = new Set(phones);
      expect(uniquePhones.size).toBe(phones.length);
    });

    test('✅ 氏名の多様性検証', async () => {
      const response = await request(app)
        .post('/api/personal/generate')
        .send({
          count: 50,
          locale: 'ja',
          includeFields: ['fullName']
        });

      expect(response.status).toBe(200);
      const data = response.body.data;

      // 姓の多様性チェック
      const lastNames = data.map((person: any) => person.fullName.lastName);
      const uniqueLastNames = new Set(lastNames);
      expect(uniqueLastNames.size).toBeGreaterThan(10); // 最低10種類の姓

      // 名の多様性チェック
      const firstNames = data.map((person: any) => person.fullName.firstName);
      const uniqueFirstNames = new Set(firstNames);
      expect(uniqueFirstNames.size).toBeGreaterThan(15); // 最低15種類の名
    });
  });

  describe('⚡ パフォーマンステスト', () => {
    test('✅ 小規模生成パフォーマンス（5件）', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .post('/api/personal/generate')
        .send({
          count: 5,
          locale: 'ja',
          includeFields: ['fullName', 'email', 'phone']
        });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(100); // 100ms以内
      expect(response.body.performance.duration).toBeLessThan(10); // 10ms以内
    });

    test('✅ 中規模生成パフォーマンス（100件）', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .post('/api/personal/generate')
        .send({
          count: 100,
          locale: 'ja',
          includeFields: ['fullName', 'kanaName', 'email', 'phone', 'address']
        });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(500); // 500ms以内
      expect(response.body.performance.duration).toBeLessThan(50); // 50ms以内
      expect(response.body.performance.itemsPerSecond).toBeGreaterThan(2000); // 2000件/秒以上
    });

    test('✅ 大規模生成パフォーマンス（500件）', async () => {
      const response = await request(app)
        .post('/api/personal/generate')
        .send({
          count: 500,
          locale: 'ja',
          includeFields: ['fullName', 'email', 'phone']
        });

      expect(response.status).toBe(200);
      expect(response.body.performance.duration).toBeLessThan(100); // 100ms以内
      expect(response.body.performance.itemsPerSecond).toBeGreaterThan(5000); // 5000件/秒以上
    });
  });

  describe('❌ エラーハンドリングテスト', () => {
    test('❌ 不正な生成数（0件）', async () => {
      const response = await request(app)
        .post('/api/personal/generate')
        .send({
          count: 0,
          locale: 'ja',
          includeFields: ['fullName']
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    test('❌ 不正な生成数（1001件）', async () => {
      const response = await request(app)
        .post('/api/personal/generate')
        .send({
          count: 1001,
          locale: 'ja',
          includeFields: ['fullName']
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    test('❌ 不正なロケール', async () => {
      const response = await request(app)
        .post('/api/personal/generate')
        .send({
          count: 5,
          locale: 'invalid',
          includeFields: ['fullName']
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('❌ 空のフィールド配列', async () => {
      const response = await request(app)
        .post('/api/personal/generate')
        .send({
          count: 5,
          locale: 'ja',
          includeFields: []
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('❌ 不正なフィールド名', async () => {
      const response = await request(app)
        .post('/api/personal/generate')
        .send({
          count: 5,
          locale: 'ja',
          includeFields: ['invalidField']
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('🎯 データ品質テスト', () => {
    test('✅ 氏名の妥当性検証', async () => {
      const response = await request(app)
        .post('/api/personal/generate')
        .send({
          count: 10,
          locale: 'ja',
          includeFields: ['fullName', 'kanaName']
        });

      expect(response.status).toBe(200);
      
      response.body.data.forEach((person: any) => {
        // 漢字氏名の検証
        expect(person.fullName.kanji).toMatch(/^.+ .+$/); // 姓名スペース区切り
        expect(person.fullName.lastName).toBeTruthy();
        expect(person.fullName.firstName).toBeTruthy();
        
        // カナ名の検証
        expect(person.kanaName).toMatch(/^[ァ-ヶー\s]+$/); // カタカナのみ
      });
    });

    test('✅ メールアドレスの妥当性検証', async () => {
      const response = await request(app)
        .post('/api/personal/generate')
        .send({
          count: 10,
          locale: 'ja',
          includeFields: ['email']
        });

      expect(response.status).toBe(200);
      
      response.body.data.forEach((person: any) => {
        expect(person.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        // テストドメインの確認
        expect(person.email).toMatch(/@(example\.com|test\.com|sample\.net|prototype\.test|qa-test\.invalid|beta-test\.dev|temp-mail\.demo|virtual-user\.test|unit-test\.example|system-test\.mock|integration\.test|test-mail\.jp)$/);
      });
    });

    test('✅ 電話番号の妥当性検証', async () => {
      const response = await request(app)
        .post('/api/personal/generate')
        .send({
          count: 10,
          locale: 'ja',
          includeFields: ['phone']
        });

      expect(response.status).toBe(200);
      
      response.body.data.forEach((person: any) => {
        expect(person.phone).toMatch(/^0\d{2,3}-\d{4}-\d{3,4}$/); // 日本の電話番号形式
      });
    });

    test('✅ 住所の妥当性検証', async () => {
      const response = await request(app)
        .post('/api/personal/generate')
        .send({
          count: 10,
          locale: 'ja',
          includeFields: ['address']
        });

      expect(response.status).toBe(200);
      
      response.body.data.forEach((person: any) => {
        expect(person.address.full).toBeTruthy();
        expect(person.address.postalCode).toMatch(/^\d{3}-\d{4}$/); // 郵便番号形式
        expect(person.address.prefecture).toBeTruthy();
        expect(person.address.city).toBeTruthy();
        expect(person.address.street).toBeTruthy();
      });
    });

    test('✅ 年齢・性別の妥当性検証', async () => {
      const response = await request(app)
        .post('/api/personal/generate')
        .send({
          count: 10,
          locale: 'ja',
          includeFields: ['age', 'gender']
        });

      expect(response.status).toBe(200);
      
      response.body.data.forEach((person: any) => {
        expect(person.age).toBeGreaterThanOrEqual(18);
        expect(person.age).toBeLessThanOrEqual(80);
        expect(['male', 'female']).toContain(person.gender);
      });
    });

    test('✅ 会社・職業の妥当性検証', async () => {
      const response = await request(app)
        .post('/api/personal/generate')
        .send({
          count: 10,
          locale: 'ja',
          includeFields: ['company', 'jobTitle']
        });

      expect(response.status).toBe(200);
      
      response.body.data.forEach((person: any) => {
        expect(person.company).toBeTruthy();
        expect(person.jobTitle).toBeTruthy();
        expect(person.industry).toBeTruthy();
      });
    });
  });

  describe('📊 ストレステスト', () => {
    test('✅ 最大生成数ストレステスト（1000件）', async () => {
      const response = await request(app)
        .post('/api/personal/generate')
        .send({
          count: 1000,
          locale: 'ja',
          includeFields: ['fullName', 'email', 'phone']
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1000);
      expect(response.body.performance.duration).toBeLessThan(500); // 500ms以内
      expect(response.body.performance.itemsPerSecond).toBeGreaterThan(2000); // 2000件/秒以上
    }, 10000); // 10秒タイムアウト

    test('✅ 全フィールド大量生成ストレステスト（500件）', async () => {
      const response = await request(app)
        .post('/api/personal/generate')
        .send({
          count: 500,
          locale: 'ja',
          includeFields: ['fullName', 'kanaName', 'email', 'phone', 'address', 'age', 'gender', 'company', 'jobTitle']
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(500);
      expect(response.body.performance.duration).toBeLessThan(1000); // 1秒以内
    }, 15000); // 15秒タイムアウト
  });
});

// TD からのメッセージ
console.log('🤖 TD: 個人情報生成機能の統合テストを実行中です！品質を徹底的にチェックしましょう♪'); 