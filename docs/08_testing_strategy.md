# TestData Buddy テスト戦略

## テスト構成

### 1. ユニットテスト（Jest）
```typescript
// src/modules/password/password.service.spec.ts
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(() => {
    service = new PasswordService();
  });

  describe('generate', () => {
    it('指定された長さのパスワードを生成する', () => {
      const config = {
        length: 12,
        includeUpper: true,
        includeLower: true,
        includeNumbers: true,
        includeSymbols: false
      };

      const password = service.generate(config);
      
      expect(password).toHaveLength(12);
      expect(password).toMatch(/^[A-Za-z0-9]+$/);
    });

    it('記号を含むパスワードを生成する', () => {
      const config = {
        length: 8,
        includeUpper: false,
        includeLower: true,
        includeNumbers: false,
        includeSymbols: true
      };

      const password = service.generate(config);
      
      expect(password).toHaveLength(8);
      expect(password).toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/);
    });

    it('無効な設定でエラーを投げる', () => {
      const config = {
        length: 0,
        includeUpper: false,
        includeLower: false,
        includeNumbers: false,
        includeSymbols: false
      };

      expect(() => service.generate(config)).toThrow('無効な設定です');
    });

    it('複数のパスワードが全て異なることを確認', () => {
      const config = {
        length: 16,
        includeUpper: true,
        includeLower: true,
        includeNumbers: true,
        includeSymbols: true
      };

      const passwords = Array.from({ length: 100 }, () => service.generate(config));
      const uniquePasswords = new Set(passwords);
      
      expect(uniquePasswords.size).toBe(100);
    });
  });

  describe('calculateStrength', () => {
    it('強いパスワードの強度を正しく計算する', () => {
      const password = 'Str0ng!P@ssw0rd';
      const strength = service.calculateStrength(password);
      
      expect(strength.score).toBeGreaterThan(3);
      expect(strength.feedback).toContain('強い');
    });

    it('弱いパスワードの強度を正しく計算する', () => {
      const password = '123456';
      const strength = service.calculateStrength(password);
      
      expect(strength.score).toBeLessThan(2);
      expect(strength.feedback).toContain('弱い');
    });

    it('パスワード強度の詳細情報を返す', () => {
      const password = 'ComplexPass123!';
      const strength = service.calculateStrength(password);
      
      expect(strength).toHaveProperty('score');
      expect(strength).toHaveProperty('feedback');
      expect(strength).toHaveProperty('suggestions');
      expect(typeof strength.score).toBe('number');
      expect(Array.isArray(strength.suggestions)).toBe(true);
    });
  });
});
```

```typescript
// src/modules/file/file.service.spec.ts
import { FileService } from './file.service';
import * as fs from 'fs';
import * as path from 'path';

describe('FileService', () => {
  let service: FileService;
  const testOutputDir = './test-output';

  beforeEach(() => {
    service = new FileService();
    if (!fs.existsSync(testOutputDir)) {
      fs.mkdirSync(testOutputDir, { recursive: true });
    }
  });

  afterEach(() => {
    // テスト後のクリーンアップ
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  describe('generateCSV', () => {
    it('指定されたスキーマでCSVファイルを生成する', async () => {
      const config = {
        format: 'csv',
        rowCount: 10,
        outputPath: testOutputDir,
        schema: [
          { name: 'id', type: 'uuid' },
          { name: 'name', type: 'personalInfo.fullName' },
          { name: 'email', type: 'personalInfo.email' }
        ]
      };

      const result = await service.generate(config);
      
      expect(result.filename).toMatch(/\.csv$/);
      expect(fs.existsSync(result.filePath)).toBe(true);
      
      const content = fs.readFileSync(result.filePath, 'utf-8');
      const lines = content.split('\n').filter(line => line.length > 0);
      
      expect(lines).toHaveLength(11); // ヘッダー + 10行
      expect(lines[0]).toBe('id,name,email');
    });

    it('大容量ファイルを正常に生成する', async () => {
      const config = {
        format: 'csv',
        rowCount: 10000,
        outputPath: testOutputDir,
        schema: [
          { name: 'id', type: 'number' },
          { name: 'value', type: 'string' }
        ]
      };

      const result = await service.generate(config);
      const stats = fs.statSync(result.filePath);
      
      expect(stats.size).toBeGreaterThan(100000); // 100KB以上
    }, 30000); // 30秒タイムアウト
  });

  describe('generateJSON', () => {
    it('有効なJSONファイルを生成する', async () => {
      const config = {
        format: 'json',
        rowCount: 5,
        outputPath: testOutputDir,
        schema: [
          { name: 'id', type: 'uuid' },
          { name: 'active', type: 'boolean' }
        ]
      };

      const result = await service.generate(config);
      const content = fs.readFileSync(result.filePath, 'utf-8');
      
      expect(() => JSON.parse(content)).not.toThrow();
      
      const data = JSON.parse(content);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(5);
    });
  });
});
```

```typescript
// src/modules/personal/personal-info.service.spec.ts
import { PersonalInfoService } from './personal-info.service';

describe('PersonalInfoService', () => {
  let service: PersonalInfoService;

  beforeEach(() => {
    service = new PersonalInfoService();
  });

  describe('generateJapanese', () => {
    it('日本語の個人情報を生成する', async () => {
      const config = {
        count: 10,
        fields: ['fullName', 'email', 'phoneNumber', 'address'],
        locale: 'ja'
      };

      const result = await service.generate(config);
      
      expect(result).toHaveLength(10);
      
      result.forEach(person => {
        expect(person.fullName).toMatch(/^[ぁ-んァ-ヶ一-龯\s]+$/);
        expect(person.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        expect(person.phoneNumber).toMatch(/^0\d{1,4}-\d{1,4}-\d{4}$/);
        expect(person.address).toContain('都');
      });
    });

    it('指定したフィールドのみ生成する', async () => {
      const config = {
        count: 5,
        fields: ['fullName', 'email'],
        locale: 'ja'
      };

      const result = await service.generate(config);
      
      result.forEach(person => {
        expect(person).toHaveProperty('fullName');
        expect(person).toHaveProperty('email');
        expect(person).not.toHaveProperty('phoneNumber');
        expect(person).not.toHaveProperty('address');
      });
    });

    it('年齢範囲を指定して生成する', async () => {
      const config = {
        count: 20,
        fields: ['fullName', 'age'],
        locale: 'ja',
        ageRange: { min: 20, max: 30 }
      };

      const result = await service.generate(config);
      
      result.forEach(person => {
        expect(person.age).toBeGreaterThanOrEqual(20);
        expect(person.age).toBeLessThanOrEqual(30);
      });
    });
  });
});
```

### 2. 統合テスト（Supertest）
```typescript
// src/modules/password/password.controller.spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PasswordModule } from './password.module';

describe('PasswordController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PasswordModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/generate/password (POST)', () => {
    it('有効なリクエストでパスワードを生成する', () => {
      return request(app.getHttpServer())
        .post('/api/generate/password')
        .send({
          length: 12,
          includeUpper: true,
          includeLower: true,
          includeNumbers: true,
          includeSymbols: false,
          count: 1
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.passwords).toHaveLength(1);
          expect(res.body.passwords[0]).toHaveLength(12);
          expect(res.body.executionTime).toBeDefined();
        });
    });

    it('複数パスワード生成リクエスト', () => {
      return request(app.getHttpServer())
        .post('/api/generate/password')
        .send({
          length: 8,
          includeUpper: true,
          includeLower: true,
          includeNumbers: true,
          includeSymbols: true,
          count: 5
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.passwords).toHaveLength(5);
          res.body.passwords.forEach(password => {
            expect(password).toHaveLength(8);
          });
        });
    });

    it('無効なリクエストでエラーを返す', () => {
      return request(app.getHttpServer())
        .post('/api/generate/password')
        .send({
          length: 0 // 無効な長さ
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.statusCode).toBe(400);
          expect(res.body.message).toContain('長さは1以上である必要があります');
        });
    });

    it('長すぎるパスワード要求でエラーを返す', () => {
      return request(app.getHttpServer())
        .post('/api/generate/password')
        .send({
          length: 1000
        })
        .expect(400);
    });

    it('レート制限をテストする', async () => {
      const requests = Array.from({ length: 10 }, () =>
        request(app.getHttpServer())
          .post('/api/generate/password')
          .send({ length: 12 })
      );

      const responses = await Promise.all(requests);
      
      // 全てのリクエストが成功することを確認
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('/api/generate/password/strength (POST)', () => {
    it('パスワード強度を計算する', () => {
      return request(app.getHttpServer())
        .post('/api/generate/password/strength')
        .send({
          password: 'StrongP@ssw0rd123!'
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.score).toBeGreaterThan(3);
          expect(res.body.feedback).toBeDefined();
          expect(res.body.suggestions).toBeInstanceOf(Array);
        });
    });
  });
});
```

```typescript
// src/modules/ai/ai.controller.spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AiModule } from './ai.module';

describe('AiController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AiModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/ai/generate (POST)', () => {
    it('自然言語でパスワード生成を指示', () => {
      return request(app.getHttpServer())
        .post('/api/ai/generate')
        .send({
          prompt: '強力なパスワードを3つ生成して'
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.result).toBeDefined();
          expect(res.body.aiResponse).toBeDefined();
          expect(res.body.executionTime).toBeGreaterThan(0);
        });
    });

    it('複雑な指示を正しく解釈する', () => {
      return request(app.getHttpServer())
        .post('/api/ai/generate')
        .send({
          prompt: '日本人の名前とメールアドレスを5件生成して、CSVファイルで出力'
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.result).toBeDefined();
        });
    });

    it('不明確な指示でエラーハンドリング', () => {
      return request(app.getHttpServer())
        .post('/api/ai/generate')
        .send({
          prompt: 'あれを作って'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('より具体的に指示してください');
        });
    });
  });
});
```

### 3. E2Eテスト（Playwright）
```typescript
// tests/e2e/password-generation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('パスワード生成機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('パスワード生成フォームが正常に動作する', async ({ page }) => {
    // パスワード生成ページに移動
    await page.click('text=パスワード生成');
    
    // ページタイトルが正しいことを確認
    await expect(page).toHaveTitle(/パスワード生成/);
    
    // 設定を入力
    await page.fill('[data-testid=password-length]', '16');
    await page.check('[data-testid=include-symbols]');
    await page.check('[data-testid=include-numbers]');
    
    // 生成ボタンをクリック
    await page.click('[data-testid=generate-button]');
    
    // 結果を確認
    await expect(page.locator('[data-testid=generated-password]')).toBeVisible();
    const password = await page.textContent('[data-testid=generated-password]');
    expect(password).toHaveLength(16);
    
    // 強度メーターが表示されることを確認
    await expect(page.locator('[data-testid=strength-meter]')).toBeVisible();
    
    // コピーボタンが機能することを確認
    await page.click('[data-testid=copy-button]');
    await expect(page.locator('[data-testid=copy-success]')).toBeVisible();
  });

  test('複数パスワード生成', async ({ page }) => {
    await page.click('text=パスワード生成');
    
    await page.fill('[data-testid=password-count]', '5');
    await page.click('[data-testid=generate-button]');
    
    const passwords = await page.locator('[data-testid=password-list] li').count();
    expect(passwords).toBe(5);
    
    // 全てのパスワードが異なることを確認
    const passwordTexts = await page.locator('[data-testid=password-list] li').allTextContents();
    const uniquePasswords = new Set(passwordTexts);
    expect(uniquePasswords.size).toBe(5);
  });

  test('パスワード設定の保存と読み込み', async ({ page }) => {
    await page.click('text=パスワード生成');
    
    // 設定を変更
    await page.fill('[data-testid=password-length]', '20');
    await page.check('[data-testid=include-symbols]');
    
    // 設定を保存
    await page.click('[data-testid=save-template]');
    await page.fill('[data-testid=template-name]', 'マイテンプレート');
    await page.click('[data-testid=save-confirm]');
    
    // ページをリロード
    await page.reload();
    
    // 保存したテンプレートを読み込み
    await page.selectOption('[data-testid=template-select]', 'マイテンプレート');
    
    // 設定が復元されることを確認
    expect(await page.inputValue('[data-testid=password-length]')).toBe('20');
    expect(await page.isChecked('[data-testid=include-symbols]')).toBe(true);
  });

  test('エラーハンドリングの確認', async ({ page }) => {
    await page.click('text=パスワード生成');
    
    // 無効な長さを入力
    await page.fill('[data-testid=password-length]', '0');
    await page.click('[data-testid=generate-button]');
    
    // エラーメッセージが表示されることを確認
    await expect(page.locator('[data-testid=error-message]')).toBeVisible();
    await expect(page.locator('[data-testid=error-message]')).toContainText('1以上の値を入力してください');
  });

  test('レスポンシブデザインの確認', async ({ page }) => {
    // モバイルサイズに変更
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.click('text=パスワード生成');
    
    // モバイルレイアウトが正常に表示されることを確認
    await expect(page.locator('[data-testid=mobile-menu]')).toBeVisible();
    await expect(page.locator('[data-testid=password-form]')).toBeVisible();
  });
});
```

```typescript
// tests/e2e/ai-integration.spec.ts
import { test, expect } from '@playwright/test';

test.describe('AI連携機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/ai');
  });

  test('自然言語でのテストデータ生成', async ({ page }) => {
    // プロンプト入力
    await page.fill('[data-testid=ai-prompt]', '強力なパスワードを3つ生成して');
    await page.click('[data-testid=ai-generate]');
    
    // 結果の表示を待機
    await expect(page.locator('[data-testid=ai-result]')).toBeVisible({ timeout: 10000 });
    
    // 結果の検証
    const result = await page.textContent('[data-testid=ai-result]');
    expect(result).toContain('パスワード');
    
    // 生成されたパスワードの数を確認
    const passwords = result.split('\n').filter(line => line.length >= 8);
    expect(passwords.length).toBeGreaterThanOrEqual(3);
  });

  test('複雑な指示の処理', async ({ page }) => {
    const prompt = '日本人の個人情報（名前、メール、電話番号）を10件生成して、CSVファイルでダウンロードできるようにして';
    
    await page.fill('[data-testid=ai-prompt]', prompt);
    await page.click('[data-testid=ai-generate]');
    
    // 処理完了を待機
    await expect(page.locator('[data-testid=ai-result]')).toBeVisible({ timeout: 15000 });
    
    // ダウンロードリンクが表示されることを確認
    await expect(page.locator('[data-testid=download-link]')).toBeVisible();
  });

  test('エラー処理の確認', async ({ page }) => {
    // 空のプロンプト
    await page.click('[data-testid=ai-generate]');
    await expect(page.locator('[data-testid=error-message]')).toContainText('プロンプトを入力してください');
    
    // 不明確なプロンプト
    await page.fill('[data-testid=ai-prompt]', 'あれ');
    await page.click('[data-testid=ai-generate]');
    await expect(page.locator('[data-testid=error-message]')).toContainText('より具体的に');
  });
});
```

## テスト設定ファイル

### Jest設定
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/main.ts',
    '!src/**/*.module.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testTimeout: 10000,
};
```

### Playwright設定
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

### テストセットアップ
```typescript
// src/test/setup.ts
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

// テスト用データベース設定
export const testDbConfig = {
  type: 'sqlite' as const,
  database: ':memory:',
  entities: ['src/**/*.entity.ts'],
  synchronize: true,
  logging: false,
};

// テスト用のモジュール作成ヘルパー
export async function createTestingModule(imports: any[] = []) {
  return await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot(testDbConfig),
      ...imports,
    ],
  }).compile();
}

// テストデータクリーンアップ
export async function cleanupTestData() {
  // テスト用ファイルの削除
  const fs = require('fs');
  const path = require('path');
  
  const testOutputDir = './test-output';
  if (fs.existsSync(testOutputDir)) {
    fs.rmSync(testOutputDir, { recursive: true, force: true });
  }
}

// グローバル設定
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(async () => {
  await cleanupTestData();
});
```

## テスト実行スクリプト

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:all": "pnpm run test && pnpm run test:e2e",
    "test:ci": "jest --coverage --ci && playwright test --reporter=junit"
  }
}
```

## CI/CD統合

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g pnpm
      - run: pnpm install
      - run: pnpm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g pnpm
      - run: pnpm install
      - run: npx playwright install --with-deps
      - run: pnpm run test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

このテスト戦略により、TestData Buddyの品質と信頼性を確保できます。各層でのテストを通じて、バグの早期発見と回帰防止を実現します。 