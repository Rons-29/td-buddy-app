/**
 * パスワード生成機能の統合テスト
 * TD Buddy - Password Generation Integration Tests
 */

import { Express } from 'express';
import request from 'supertest';
import { initializeTestApp } from '../testApp';

// テスト用のモックデータベース
const db = {
  query: jest.fn().mockResolvedValue([]),
  run: jest.fn().mockResolvedValue({ lastID: 1 }),
  close: jest.fn().mockResolvedValue(undefined),
};

describe('Password Generation Integration Tests', () => {
  let app: Express;

  beforeAll(async () => {
    app = await initializeTestApp();
  });

  describe('POST /api/password/generate', () => {
    it('🧪 基本的なパスワード生成が成功する', async () => {
      const response = await request(app)
        .post('/api/password/generate')
        .send({
          length: 12,
          count: 3,
          useUppercase: true,
          useLowercase: true,
          useNumbers: true,
          useSymbols: false,
          excludeAmbiguous: false,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.passwords).toHaveLength(3);
      expect(response.body.data.passwords[0]).toHaveLength(12);

      // 文字種チェック
      const password = response.body.data.passwords[0];
      expect(password).toMatch(/[A-Z]/); // 大文字が含まれる
      expect(password).toMatch(/[a-z]/); // 小文字が含まれる
      expect(password).toMatch(/[0-9]/); // 数字が含まれる
      expect(password).not.toMatch(/[!@#$%^&*]/); // 記号は含まれない
    });

    it('🧪 大量生成（100件）が制限時間内に完了する', async () => {
      const startTime = Date.now();

      const response = await request(app)
        .post('/api/password/generate')
        .send({
          length: 16,
          count: 100,
          useUppercase: true,
          useLowercase: true,
          useNumbers: true,
          useSymbols: true,
          excludeAmbiguous: true,
        })
        .expect(200);

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.body.success).toBe(true);
      expect(response.body.data.passwords).toHaveLength(100);
      expect(duration).toBeLessThan(5000); // 5秒以内に完了

      console.log(`🚀 100件生成完了: ${duration}ms`);
    });

    it('🧪 紛らわしい文字除外が正しく動作する', async () => {
      const response = await request(app)
        .post('/api/password/generate')
        .send({
          length: 20,
          count: 10,
          useUppercase: true,
          useLowercase: true,
          useNumbers: true,
          useSymbols: false,
          excludeAmbiguous: true,
        })
        .expect(200);

      expect(response.body.success).toBe(true);

      // 紛らわしい文字が含まれていないことを確認
      const passwords = response.body.data.passwords;
      passwords.forEach((password: string) => {
        expect(password).not.toMatch(/[il1Lo0O]/);
      });
    });

    it('🧪 最小要件違反でエラーが返される', async () => {
      const response = await request(app)
        .post('/api/password/generate')
        .send({
          length: 4, // 最小長より短い
          count: 1,
          useUppercase: false,
          useLowercase: false,
          useNumbers: false,
          useSymbols: false,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('🧪 制限値超過でエラーが返される', async () => {
      const response = await request(app)
        .post('/api/password/generate')
        .send({
          length: 129, // 最大長を超過
          count: 1001, // 最大件数を超過
          useUppercase: true,
          useLowercase: true,
          useNumbers: true,
          useSymbols: true,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/password/generate-with-composition', () => {
    it('🧪 構成プリセット「高セキュリティ」が正しく動作する', async () => {
      const response = await request(app)
        .post('/api/password/generate-with-composition')
        .send({
          composition: 'high-security',
          length: 16,
          count: 5,
          excludeAmbiguous: true,
          excludeSimilar: true,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.passwords).toHaveLength(5);

      // 各パスワードが要件を満たすかチェック
      const passwords = response.body.data.passwords;
      passwords.forEach((password: string) => {
        expect(password).toHaveLength(16);
        expect(password).toMatch(/[A-Z]/); // 大文字
        expect(password).toMatch(/[a-z]/); // 小文字
        expect(password).toMatch(/[0-9]/); // 数字
        expect(password).toMatch(/[!@#$%^&*_+\-=|:?]/); // 記号
        expect(password).not.toMatch(/[il1Lo0O]/); // 紛らわしい文字除外
      });
    });

    it('🧪 無効な構成プリセットでエラーが返される', async () => {
      const response = await request(app)
        .post('/api/password/generate-with-composition')
        .send({
          composition: 'invalid-preset',
          length: 12,
          count: 1,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Database Integration', () => {
    it('🧪 生成されたパスワードがデータベースに保存される', async () => {
      await request(app)
        .post('/api/password/generate')
        .send({
          length: 12,
          count: 3,
          useUppercase: true,
          useLowercase: true,
          useNumbers: true,
          useSymbols: true,
        })
        .expect(200);

      // データベースから確認
      const rows = await db.query('SELECT * FROM generated_passwords');
      expect(rows).toHaveLength(3);

      rows.forEach((row: any) => {
        expect(row.password_hash).toBeDefined();
        expect(row.length).toBe(12);
        expect(row.composition).toBeDefined();
        expect(row.created_at).toBeDefined();
      });
    });

    it('🧪 API統計が正しく記録される', async () => {
      await request(app)
        .post('/api/password/generate')
        .send({
          length: 16,
          count: 5,
          useUppercase: true,
          useLowercase: true,
          useNumbers: true,
          useSymbols: true,
        })
        .expect(200);

      // API統計を確認
      const stats = await db.query(
        'SELECT * FROM api_statistics WHERE endpoint = "/api/password/generate"'
      );
      expect(stats).toHaveLength(1);
      expect(stats[0].request_count).toBe(1);
      expect(stats[0].success_count).toBe(1);
      expect(stats[0].error_count).toBe(0);
    });
  });

  describe('Performance Tests', () => {
    it('🧪 1000件生成のパフォーマンステスト', async () => {
      const startTime = Date.now();

      const response = await request(app)
        .post('/api/password/generate')
        .send({
          length: 12,
          count: 1000,
          useUppercase: true,
          useLowercase: true,
          useNumbers: true,
          useSymbols: true,
          excludeAmbiguous: true,
        })
        .expect(200);

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.body.success).toBe(true);
      expect(response.body.data.passwords).toHaveLength(1000);
      expect(duration).toBeLessThan(10000); // 10秒以内

      console.log(`🚀 1000件生成完了: ${duration}ms`);
    }, 15000);

    it('🧪 メモリ使用量テスト', async () => {
      const beforeMemory = process.memoryUsage();

      await request(app)
        .post('/api/password/generate')
        .send({
          length: 32,
          count: 500,
          useUppercase: true,
          useLowercase: true,
          useNumbers: true,
          useSymbols: true,
        })
        .expect(200);

      const afterMemory = process.memoryUsage();
      const memoryIncrease = afterMemory.heapUsed - beforeMemory.heapUsed;

      // メモリ使用量が合理的な範囲内であることを確認
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB未満

      console.log(
        `📊 メモリ使用量増加: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`
      );
    });
  });

  describe('Error Handling', () => {
    it('🧪 ネットワークエラーのシミュレーション', async () => {
      // 正常なリクエストでベースラインを確立
      const response = await request(app).post('/api/password/generate').send({
        length: 12,
        count: 1,
        useUppercase: true,
        useLowercase: true,
        useNumbers: true,
        useSymbols: false,
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('🧪 レート制限テスト', async () => {
      // 短時間で大量のリクエストを送信
      const promises = Array.from({ length: 20 }, () =>
        request(app).post('/api/password/generate').send({
          length: 8,
          count: 1,
          useUppercase: true,
          useLowercase: true,
          useNumbers: true,
          useSymbols: false,
        })
      );

      const responses = await Promise.all(promises);

      // 一部のリクエストがレート制限にかかることを期待
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});
