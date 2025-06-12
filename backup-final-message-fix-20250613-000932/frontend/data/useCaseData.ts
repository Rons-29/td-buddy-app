/**
 * 活用例データ定義
 * Brew Assistant - UseCase Data
 * 
 * @description 実用的な活用例のデータセット
 * @version 1.0.0
 * @created 2024-12-19
 */

import { UseCaseExample } from '../types/useCase';

export const USE_CASES: UseCaseExample[] = [
  {
    id: 'excel-verification',
    title: 'Excel でテストデータ確認',
    description: '生成したパスワードをExcelで開いて、強度や文字種を手動確認',
    category: 'debug',
    format: 'csv',
    scenario: 'パスワード生成機能の動作確認時',
    config: {
      format: 'csv',
      count: 100,
      options: { includeHeaders: true, encoding: 'utf8' }
    },
    codeExample: `// ブラウザから直接ダウンロード
https://your-domain/api/export/passwords?format=csv&count=100&strength=high&download=true

// 結果: passwords_2024-12-19.csv
// → Excelで開いて強度分布を確認

// JavaScript での取得例
const response = await fetch('/api/export/passwords?format=csv&count=100&download=true');
const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'test-passwords.csv';
a.click();`,
    benefits: [
      '非技術者でも簡単に確認可能',
      'Excelの分析機能が使える',
      '文字化けなしで日本語表示',
      '手動編集・加工も可能'
    ],
    difficulty: 'beginner'
  },
  {
    id: 'api-testing',
    title: 'REST API テストデータ',
    description: 'Postman/Insomniaで使用する実用的なJSONテストデータ生成',
    category: 'automation',
    format: 'json',
    scenario: 'ユーザー登録APIの動作テスト時',
    config: {
      format: 'json',
      count: 50,
      options: { pretty: true, includeMetadata: true }
    },
    codeExample: `// API テスト用データ生成
const response = await fetch('/api/export/personal?format=json&count=50&pretty=true');
const testData = await response.json();

// Postman Pre-request Script
pm.globals.set("testUsers", JSON.stringify(testData.data));

// Test Script での利用
const users = JSON.parse(pm.globals.get("testUsers"));
pm.test("User creation test", () => {
    users.forEach(user => {
        pm.sendRequest({
            url: pm.environment.get("baseUrl") + "/api/users",
            method: 'POST',
            header: { 'Content-Type': 'application/json' },
            body: { mode: 'raw', raw: JSON.stringify(user) }
        }, (err, response) => {
            pm.expect(response.code).to.equal(201);
        });
    });
});`,
    benefits: [
      'API仕様書への添付可能',
      'Postman/Insomniaで即利用',
      'メタデータで生成情報も確認',
      '整形済みで可読性が高い'
    ],
    difficulty: 'intermediate'
  },
  {
    id: 'database-performance',
    title: 'データベース性能テスト',
    description: '100万件の大量データでDBパフォーマンス検証',
    category: 'performance',
    format: 'sql',
    scenario: 'システムの負荷テスト実行時',
    config: {
      format: 'sql',
      count: 1000000,
      options: { tableName: 'performance_test_users', batchSize: 1000, includeHeaders: true }
    },
    codeExample: `-- 大量テストデータ生成（100万件）
/api/export/personal?format=sql&count=1000000&tableName=load_test_users

-- 生成されたSQL実行例
CREATE TABLE IF NOT EXISTS \`load_test_users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`fullName\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(255) UNIQUE NOT NULL,
  \`phone\` VARCHAR(20),
  \`createdAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1000件ずつバッチINSERT（自動生成）
INSERT INTO \`load_test_users\` (\`fullName\`, \`email\`, \`phone\`) VALUES
  ('田中 太郎', 'tanaka@example.com', '090-1234-5678'),
  ('佐藤 花子', 'sato@test.com', '080-9876-5432'),
  -- ... 1000件まで
  ;

-- 性能測定クエリ例
SELECT COUNT(*) FROM load_test_users; -- 1,000,000件
SELECT * FROM load_test_users WHERE email LIKE '%@example.com%' LIMIT 100;
EXPLAIN SELECT * FROM load_test_users WHERE fullName LIKE '田中%';`,
    benefits: [
      '本番相当の大量データ',
      'バッチ処理で効率的投入',
      'SQL最適化の検証可能',
      'インデックス効果も測定'
    ],
    difficulty: 'advanced'
  },
  {
    id: 'security-testing',
    title: 'セキュリティテスト',
    description: '脆弱性検証用の危険パターンデータ生成',
    category: 'security',
    format: 'json',
    scenario: 'XSS・SQLインジェクション検証時',
    config: {
      format: 'json',
      count: 200,
      options: { includeSpecialChars: true, pretty: true }
    },
    codeExample: `// セキュリティテスト用データ
const securityData = await fetch('/api/export/personal?format=json&count=200&includeSpecialChars=true');
const testData = await securityData.json();

// 危険パターンのテストケース
const maliciousInputs = [
  "<script>alert('XSS')</script>",
  "'; DROP TABLE users; --",
  "../../etc/passwd",
  "%3Cscript%3Ealert('XSS')%3C/script%3E",
  "{{7*7}}",
  "$\\{system('cat /etc/passwd')\\}"
];

// 自動セキュリティテスト
describe('Security Tests', () => {
  maliciousInputs.forEach(input => {
    test(\`XSS Prevention: \${input}\`, async () => {
      const response = await api.post('/users', { 
        name: input,
        email: 'test@example.com' 
      });
      
      // レスポンスに危険なスクリプトが含まれていないことを確認
      expect(response.data.name).not.toContain('<script>');
      expect(response.data.name).not.toContain('javascript:');
    });
  });
});`,
    benefits: [
      '脆弱性の網羅的検証',
      '自動テストに組み込み可能',
      'セキュリティ基準準拠',
      'ペネトレーションテスト対応'
    ],
    difficulty: 'advanced'
  },
  {
    id: 'international-testing',
    title: '国際化・多言語テスト',
    description: '日本語・英語・韓国語のマルチロケールテストデータ',
    category: 'integration',
    format: 'yaml',
    scenario: '多言語サイトの表示確認時',
    config: {
      format: 'yaml',
      count: 30,
      options: { locale: 'multi', includeUnicode: true }
    },
    codeExample: `# 多言語テストデータ (YAML)
# Generated at: 2024-12-19T10:30:00Z

metadata:
  exportedAt: "2024-12-19T10:30:00Z"
  recordCount: 30
  locales: ["ja", "en", "ko", "zh", "ar"]

data:
  - # Japanese User
    id: 1
    name: "田中 太郎"
    email: "tanaka@example.com"
    locale: "ja"
    address: "東京都渋谷区1-1-1"
    
  - # English User  
    id: 2
    name: "John Smith"
    email: "john.smith@test.com"
    locale: "en"
    address: "123 Main St, New York, NY"
    
  - # Korean User
    id: 3
    name: "김철수"
    email: "kim@sample.kr"
    locale: "ko"
    address: "서울특별시 강남구"

  - # Chinese User
    id: 4
    name: "张三"
    email: "zhang@example.cn"
    locale: "zh"
    address: "北京市朝阳区"

  - # Arabic User
    id: 5
    name: "أحمد محمد"
    email: "ahmed@test.ae"
    locale: "ar"
    address: "دبي، الإمارات العربية المتحدة"`,
    benefits: [
      '文字エンコーディング検証',
      'フォント表示確認',
      'ソート順序テスト',
      '多言語UI動作確認'
    ],
    difficulty: 'intermediate'
  },
  {
    id: 'config-file-generation',
    title: '設定ファイル生成',
    description: 'Docker Compose・Kubernetesの設定ファイル生成',
    category: 'integration',
    format: 'yaml',
    scenario: 'コンテナ環境のテスト時',
    config: {
      format: 'yaml',
      count: 10,
      options: { template: 'docker-compose' }
    },
    codeExample: `# Docker Compose用テスト環境設定
version: '3.8'
services:
  # 生成されたユーザーサービス
  user-service-1:
    image: test-app:latest
    environment:
      - USER_NAME=田中 太郎
      - USER_EMAIL=tanaka@example.com
      - USER_ID=1
      - DATABASE_URL=postgres://test:test@db:5432/testdb
    ports:
      - "3001:3000"
    depends_on:
      - db
      
  user-service-2:
    image: test-app:latest
    environment:
      - USER_NAME=佐藤 花子  
      - USER_EMAIL=sato@test.com
      - USER_ID=2
      - DATABASE_URL=postgres://test:test@db:5432/testdb
    ports:
      - "3002:3000"
    depends_on:
      - db

  # データベース
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: testdb
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:

# Kubernetes用マニフェスト生成例
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: test-user-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: test-user
  template:
    metadata:
      labels:
        app: test-user
    spec:
      containers:
      - name: test-user
        image: test-app:latest
        env:
        - name: USER_NAME
          value: "田中 太郎"
        - name: USER_EMAIL
          value: "tanaka@example.com"`,
    benefits: [
      'インフラテスト自動化',
      'マイクロサービス検証',
      'CI/CDパイプライン組込',
      '環境差分テスト対応'
    ],
    difficulty: 'advanced'
  }
];

export default USE_CASES; 