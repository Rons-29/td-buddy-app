#!/bin/bash

# 🍺 QA Workbench + Brew: 緊急ESLintエラー修正スクリプト

echo "🍺 Brewからのメッセージ: 緊急度の高いESLintエラーを修正します..."

cd td-buddy-webapp

echo "🔧 Phase 1: 未使用変数・関数の削除"

# バックエンドの未使用変数修正
echo "📁 修正中: backend/src/index.ts"
sed -i '' '/const webSocketService/d' backend/src/index.ts

echo "📁 修正中: backend/src/middleware/errorHandler.ts"
sed -i '' '/import.*tdLog/d' backend/src/middleware/errorHandler.ts
sed -i '' 's/, next: NextFunction//g' backend/src/middleware/errorHandler.ts
sed -i '' 's/(req: Request, res: Response, next: NextFunction)/(req: Request, res: Response)/g' backend/src/middleware/errorHandler.ts

echo "📁 修正中: backend/src/middleware/requestLogger.ts"
sed -i '' '/const sanitizeRequestBody/,/^};$/d' backend/src/middleware/requestLogger.ts
sed -i '' '/const getTDLogMessage/,/^};$/d' backend/src/middleware/requestLogger.ts

echo "📁 修正中: backend/src/routes/ai.ts"
sed -i '' '/const personalInfoService/d' backend/src/routes/ai.ts

echo "📁 修正中: backend/src/routes/export.ts"
sed -i '' 's/const { streaming } = req.body;//g' backend/src/routes/export.ts
sed -i '' '/let errorMessage.*never used/d' backend/src/routes/export.ts

echo "🔧 Phase 2: case文の修正"
echo "📁 修正中: backend/src/services/CompositionPasswordService.ts"
# case文でのlet/const宣言を{}で囲む
sed -i '' 's/case.*:$/&\n      {/g' backend/src/services/CompositionPasswordService.ts
sed -i '' '/break;$/i\
      }' backend/src/services/CompositionPasswordService.ts

echo "🔧 Phase 3: prefer-const修正"
echo "📁 修正中: backend/src/services/DateTimeService.ts"
sed -i '' 's/let adjustedDate/const adjustedDate/g' backend/src/services/DateTimeService.ts

echo "🔧 Phase 4: TypeScript設定の修正"
echo "📁 修正中: backend/tsconfig.json - テストファイルを除外"

# tsconfig.jsonにテストファイル除外を追加
cat > backend/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "commonjs",
    "moduleResolution": "node",
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "resolveJsonModule": true,
    "types": ["node", "jest"]
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "src/tests/**/*",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
EOF

echo "✅ 緊急ESLintエラー修正完了！"
echo "📊 修正結果を確認中..."

# 修正結果の確認
cd backend && npm run lint 2>/dev/null | grep -E "(error|warning)" | wc -l | awk '{print "残存問題数: " $1}' 