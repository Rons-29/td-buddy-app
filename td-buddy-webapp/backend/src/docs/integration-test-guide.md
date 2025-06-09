# 🧪 TestData Buddy 統合テストガイド

## 📋 目次
1. [テスト概要](#テスト概要)
2. [実行方法](#実行方法)
3. [テスト種別](#テスト種別)
4. [パフォーマンステスト](#パフォーマンステスト)
5. [トラブルシューティング](#トラブルシューティング)

## 🎯 テスト概要

TestData Buddy (TD) の統合テストは以下の品質を保証します：

### ✅ 保証品質
- **機能性**: 全APIエンドポイントが期待通りに動作
- **パフォーマンス**: レスポンス時間が許容範囲内
- **安全性**: セキュリティ要件を満たす
- **信頼性**: エラーハンドリングが適切

### 📊 品質基準
| 項目 | 基準値 | 備考 |
|------|--------|------|
| API応答時間 | < 3秒 | 基本機能 |
| 大量生成 | < 30秒 | 1000件生成 |
| 成功率 | > 95% | 負荷テスト時 |
| メモリ使用量 | < 512MB | ピーク時 |

## 🚀 実行方法

### 前提条件
```bash
# 依存関係インストール
pnpm install

# 環境変数設定
cp .env.example .env
# .envファイルを編集してテスト用設定を追加
```

### 基本実行コマンド
```bash
# 全統合テスト実行
pnpm run test:integration

# 個別テスト実行
pnpm run test:integration -- --testNamePattern="パスワード生成"

# パフォーマンステスト実行
pnpm run test:performance

# テストカバレッジ付き実行
pnpm run test:integration:coverage
```

### CI/CD環境での実行
```bash
# GitHub Actions用（メモリ制限考慮）
NODE_OPTIONS="--max-old-space-size=4096" pnpm run test:integration

# Docker環境用
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## 🧩 テスト種別

### 1. APIエンドポイントテスト

#### パスワード生成API
```typescript
describe('POST /api/password/generate', () => {
  // 基本生成テスト
  it('基本パスワード生成が成功する', async () => {
    const response = await request(app)
      .post('/api/password/generate')
      .send({
        length: 12,
        count: 3,
        useUppercase: true,
        useLowercase: true,
        useNumbers: true,
        useSymbols: false
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.passwords).toHaveLength(3);
  });
});
```

#### エラーハンドリングテスト
```typescript
describe('エラーハンドリング', () => {
  it('無効なパラメータでエラーになる', async () => {
    const response = await request(app)
      .post('/api/password/generate')
      .send({ length: -1 }); // 無効な値
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
```

### 2. データベーステスト

#### データ整合性確認
```typescript
describe('データベース統合テスト', () => {
  it('生成データが正しく保存される', async () => {
    // パスワード生成
    await request(app)
      .post('/api/password/generate')
      .send(validRequest);
    
    // データベース確認
    const savedData = await db.query('SELECT * FROM generated_passwords');
    expect(savedData).toHaveLength(1);
    expect(savedData[0].metadata).toBeDefined();
  });
});
```

### 3. セキュリティテスト

#### 機密情報保護
```typescript
describe('セキュリティテスト', () => {
  it('生成データに機密情報が含まれない', async () => {
    const response = await request(app)
      .post('/api/password/generate')
      .send(request);
    
    // レスポンスに機密情報が含まれていないか確認
    const responseText = JSON.stringify(response.body);
    expect(responseText).not.toMatch(/password|secret|key/i);
  });
});
```

## ⚡ パフォーマンステスト

### 基本パフォーマンステスト
```bash
# パフォーマンステスト実行
cd td-buddy-webapp/backend
npx ts-node src/tests/performance/load-test.ts

# 結果例:
# 📈 基本パスワード生成 (12文字 × 1個) - 結果
#    反復回数: 1000
#    総実行時間: 842.34ms
#    平均時間: 8.42ms
#    最小時間: 3.21ms
#    最大時間: 45.67ms
#    RPS: 1186.02 req/sec
#    メモリ使用量変化: 2.45MB
```

### ストレステスト
```bash
# 30秒間のストレステスト
NODE_ENV=test npx ts-node -e "
import { PerformanceTestRunner } from './src/tests/performance/load-test';
const runner = new PerformanceTestRunner();
runner.initialize().then(() => runner.runStressTest(30000));
"
```

### パフォーマンス評価基準

#### 🎯 A評価（優秀）
- 基本生成: < 10ms
- 大量生成: > 5 RPS
- メモリ効率: < 100MB

#### 🟡 B評価（良好）
- 基本生成: < 50ms
- 大量生成: > 2 RPS
- メモリ効率: < 200MB

#### 🔴 C評価（要改善）
- 基本生成: > 50ms
- 大量生成: < 2 RPS
- メモリ効率: > 200MB

## 🔍 品質チェックリスト

### ✅ テスト実行前
- [ ] データベースが初期化されている
- [ ] 環境変数が適切に設定されている
- [ ] 必要なポートが空いている（3001, 3000）
- [ ] 依存関係が最新状態

### ✅ テスト実行中の確認項目
- [ ] すべてのテストケースが実行される
- [ ] エラーログが適切に出力される
- [ ] メモリリークが発生していない
- [ ] CPU使用率が異常値でない

### ✅ テスト完了後の確認
- [ ] カバレッジが80%以上
- [ ] パフォーマンス基準を満たしている
- [ ] エラーケースが適切にテストされている
- [ ] ドキュメントが更新されている

## 🚨 トラブルシューティング

### よくある問題と解決方法

#### 1. テストが失敗する
```bash
# データベースのリセット
rm -f data/test.db
pnpm run db:migrate

# 依存関係の再インストール
rm -rf node_modules
pnpm install
```

#### 2. パフォーマンステストでタイムアウト
```bash
# Node.jsのメモリ制限を拡張
NODE_OPTIONS="--max-old-space-size=4096" pnpm run test:performance

# タイムアウト値を調整
jest --testTimeout=30000
```

#### 3. ポート競合エラー
```bash
# 使用中のポートを確認
lsof -i :3001
lsof -i :3000

# プロセスを終了
pkill -f "node.*3001"
pkill -f "node.*3000"
```

#### 4. メモリ不足エラー
```bash
# ガベージコレクションを強制実行
node --expose-gc your-test-script.js

# テストを分割実行
pnpm run test:integration -- --maxWorkers=1
```

### TDからのデバッグメッセージ例
```bash
🤖 TD: テストでエラーが発生しました。以下を確認してください：
  1. データベース接続状況
  2. 環境変数の設定
  3. メモリ使用量
  4. ログファイルの内容

🤖 TD: パフォーマンスが基準を下回っています。
  原因の可能性：
  - データベースクエリの最適化不足
  - メモリリークの発生
  - 不要な処理の実行
```

## 📈 継続的品質改善

### 品質メトリクス監視
```bash
# 毎日実行する品質チェック
#!/bin/bash
echo "🤖 TD: 日次品質チェックを開始します"

# テスト実行
pnpm run test:integration

# パフォーマンステスト実行
pnpm run test:performance

# カバレッジ確認
pnpm run test:coverage

# 結果をSlackに通知（例）
# curl -X POST -H 'Content-type: application/json' \
#   --data '{"text":"TD品質チェック完了！結果をご確認ください。"}' \
#   $SLACK_WEBHOOK_URL

echo "🤖 TD: 品質チェック完了しました！"
```

### 品質向上のためのアクション
1. **テストカバレッジ向上**
   - 未カバー部分の特定
   - エッジケースの追加

2. **パフォーマンス最適化**
   - ボトルネックの特定
   - アルゴリズム改善

3. **エラーハンドリング強化**
   - 新しいエラーパターンの追加
   - ユーザビリティ向上

4. **ドキュメント更新**
   - テスト結果の反映
   - 新機能の説明追加

---

## 🎉 最後に

**TDからのメッセージ**: 
「統合テストは品質保証の要です！継続的に実行して、安全で高品質なサービスを提供しましょう。困ったときはTDがサポートします♪」

### 参考リンク
- [Jest公式ドキュメント](https://jestjs.io/docs/getting-started)
- [SuperTest使い方](https://github.com/visionmedia/supertest)
- [Node.jsパフォーマンステスト](https://nodejs.org/en/docs/guides/simple-profiling/)

---
**最終更新**: 2024年12月現在  
**担当**: TestData Buddy チーム 