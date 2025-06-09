# 一人開発向けワークフロー

## 日次開発ルーチン

### 朝の準備（5分）
1. `git status` - 前日の作業状況確認
2. `pnpm run dev` - 開発サーバー起動
3. `pnpm run test:watch` - テスト監視モード起動
4. 今日のタスクを GitHub Issues で確認

### 開発中（継続的）
1. **小さなコミット**: 機能単位で頻繁にコミット
2. **自動テスト**: 保存時に自動実行
3. **コード品質**: ESLint/Prettier の自動修正
4. **進捗記録**: コミットメッセージで進捗を記録

### 夕方の整理（10分）
1. `pnpm run test` - 全テスト実行
2. `pnpm run build` - ビルド確認
3. `git push` - 1日の成果をプッシュ
4. 明日のタスクを GitHub Issues に記録

## 品質管理戦略

### 自動化ツール設定
```json
// package.json scripts
{
  "scripts": {
    "dev": "concurrently \"pnpm run dev:api\" \"pnpm run dev:web\"",
    "dev:api": "cd packages/api-server && pnpm run start:dev",
    "dev:web": "cd packages/web-ui && pnpm run dev",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint . --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "quality-check": "pnpm run lint && pnpm run type-check && pnpm run test",
    "clean": "rimraf dist coverage node_modules/.cache",
    "build": "pnpm run build:api && pnpm run build:web",
    "build:api": "cd packages/api-server && pnpm run build",
    "build:web": "cd packages/web-ui && pnpm run build"
  }
}
```

### Git Hooks設定
```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 コード品質チェック中..."
pnpm run lint
pnpm run type-check
pnpm run test --passWithNoTests --silent

echo "✅ 品質チェック完了"
```

```bash
# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# コミットメッセージの形式チェック
npx --no -- commitlint --edit $1
```

### ESLint設定
```json
// .eslintrc.json
{
  "extends": [
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
    "no-var": "error"
  },
  "ignorePatterns": ["dist/", "node_modules/", "coverage/"]
}
```

### Prettier設定
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### TypeScript設定
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  },
  "include": ["packages/*/src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### コードレビューの代替手段
1. **静的解析**: SonarQube Community Edition
2. **依存関係チェック**: `npm audit`
3. **セキュリティスキャン**: Snyk
4. **パフォーマンス監視**: Lighthouse CI

```yaml
# .github/workflows/quality.yml
name: Code Quality

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g pnpm
      - run: pnpm install
      - run: pnpm run quality-check
      - run: pnpm run build
```

## 進捗管理

### GitHub Issues テンプレート
```markdown
<!-- .github/ISSUE_TEMPLATE/feature.md -->
---
name: 機能開発
about: 新機能の開発タスク
title: '[FEAT] '
labels: 'feature'
---

## 機能概要
<!-- 機能の説明 -->

## 受け入れ条件
- [ ] 要件定義完了
- [ ] 設計完了
- [ ] 実装完了
- [ ] ユニットテスト完了
- [ ] 統合テスト完了
- [ ] ドキュメント更新完了

## 技術的考慮事項
<!-- 技術的な制約や考慮点 -->

## 見積もり時間
- 予定: X時間
- 実績: Y時間

## 関連リンク
<!-- 関連するIssue、PR、ドキュメントなど -->
```

### プロジェクトボード設定
```
Backlog -> In Progress -> Review -> Testing -> Done
```

### マイルストーン設定
- **フェーズ1**: 基盤構築（4週間）
  - 環境構築
  - 基本機能実装
  - データベース設計
- **フェーズ2**: 高度機能（3週間）
  - ファイル生成
  - 高度なテキスト生成
  - UI/UX改善
- **フェーズ3**: AI連携（4週間）
  - Claude API統合
  - 自然言語処理
  - プロンプトエンジニアリング
- **フェーズ4**: IDE統合（3週間）
  - Cursor統合
  - VS Code拡張
  - 最終調整

### 日報テンプレート
```markdown
# 開発日報 YYYY-MM-DD

## 今日完了したこと
- [ ] タスク1
- [ ] タスク2

## 今日の学び・発見
-

## 明日の予定
- [ ] タスク1
- [ ] タスク2

## 課題・困ったこと
-

## 進捗率
- 全体: XX%
- 今週: XX%
```

## 効率化ツール

### VS Code設定
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "jest.autoRun": "watch",
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/coverage": true
  }
}
```

### VS Code拡張機能推奨
```json
// .vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-jest",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### 開発タスク自動化
```bash
# scripts/dev-setup.sh
#!/bin/bash

echo "🚀 TestData Buddy 開発環境セットアップ"

# 依存関係インストール
echo "📦 依存関係をインストール中..."
pnpm install

# データベース初期化
echo "🗄️ データベースを初期化中..."
mkdir -p data
pnpm run db:migrate

# Git hooks セットアップ
echo "🪝 Git hooks をセットアップ中..."
npx husky install

# 開発サーバー起動
echo "🔥 開発サーバーを起動中..."
pnpm run dev
```

## トラブルシューティング

### よくある問題と解決法
```bash
# ポート競合の解決
echo "🔍 ポート使用状況確認"
lsof -ti:3000,3001 | xargs kill -9

# 依存関係の問題解決
echo "🧹 依存関係をクリーンアップ"
rm -rf node_modules pnpm-lock.yaml
pnpm install

# データベースリセット
echo "🗄️ データベースをリセット"
rm -f data/td-buddy.sqlite
pnpm run db:migrate

# キャッシュクリア
echo "🧽 キャッシュをクリア"
pnpm store prune
rm -rf packages/*/dist
rm -rf packages/*/node_modules/.cache
```

### デバッグ戦略
1. **ログレベル設定**: 開発時は DEBUG レベル
2. **エラー追跡**: Sentry（無料プラン）
3. **パフォーマンス**: Chrome DevTools
4. **API テスト**: Thunder Client / Postman

```typescript
// src/common/logger/logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class AppLogger implements LoggerService {
  log(message: string, context?: string) {
    console.log(`[${new Date().toISOString()}] [${context}] ${message}`);
  }

  error(message: string, trace?: string, context?: string) {
    console.error(`[${new Date().toISOString()}] [ERROR] [${context}] ${message}`);
    if (trace) console.error(trace);
  }

  warn(message: string, context?: string) {
    console.warn(`[${new Date().toISOString()}] [WARN] [${context}] ${message}`);
  }

  debug(message: string, context?: string) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${new Date().toISOString()}] [DEBUG] [${context}] ${message}`);
    }
  }
}
```

### パフォーマンス監視
```typescript
// src/common/interceptors/performance.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        const request = context.switchToHttp().getRequest();
        console.log(`${request.method} ${request.url} - ${duration}ms`);
        
        if (duration > 1000) {
          console.warn(`⚠️ 遅いリクエスト: ${request.url} - ${duration}ms`);
        }
      })
    );
  }
}
```

## 生産性向上のコツ

### 時間管理
- **ポモドーロテクニック**: 25分集中 + 5分休憩
- **時間ボックス**: 各タスクに制限時間を設定
- **定期的な振り返り**: 週次で進捗と改善点を確認

### モチベーション維持
- **小さな達成**: 機能単位での達成感
- **進捗の可視化**: GitHub Actionsのバッジ表示
- **定期的なリファクタリング**: コード品質の向上

### コード品質向上
- **DRY原則**: 重複コードの排除
- **SOLID原則**: 設計原則の遵守
- **テスト駆動開発**: テストファーストのアプローチ

```typescript
// 良い例: 再利用可能なサービス
@Injectable()
export class BaseGeneratorService<T> {
  protected async logGeneration(type: string, params: any, result: T): Promise<void> {
    await this.historyService.record({
      type,
      inputParams: params,
      outputSummary: this.summarizeResult(result),
      executionTime: Date.now() - this.startTime
    });
  }

  protected abstract summarizeResult(result: T): string;
}
```

このワークフローに従うことで、一人開発でも品質を保ちながら効率的に開発を進めることができます。 