#!/bin/bash

# 🍺 QA Workbench + Brew: TypeScriptエラー緊急修正スクリプト

echo "🍺 Brewからのメッセージ: TypeScriptエラーを緊急修正します..."

cd td-buddy-webapp/backend

echo "🔧 Phase 1: 削除されたimport文の復元"

# errorHandler.tsの修正
echo "📁 修正中: src/middleware/errorHandler.ts"
cat > src/middleware/errorHandler.ts << 'EOF'
import { Request, Response, NextFunction } from 'express';

// ロガー設定
const logger = console;

/**
 * グローバルエラーハンドリングミドルウェア
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('🚨 Unhandled Error:', err);
  
  // エラーレスポンス
  res.status(500).json({
    error: 'Internal Server Error',
    message: '予期しないエラーが発生しました',
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] || 'unknown'
  });
};

export default errorHandler;
EOF

echo "🔧 Phase 2: PersonalInfoService.tsの修正"
echo "📁 修正中: src/services/PersonalInfoService.ts"

# PersonalInfoService.tsの先頭にimport追加
sed -i '' '1i\
import { PerformanceService } from '\''./PerformanceService'\'';' src/services/PersonalInfoService.ts

# logger import追加
sed -i '' '2i\
const logger = console;' src/services/PersonalInfoService.ts

echo "🔧 Phase 3: その他のサービスファイル修正"

# 各サービスファイルにlogger追加
for file in src/services/*.ts; do
    if [ -f "$file" ] && ! grep -q "const logger" "$file"; then
        echo "📁 Logger追加: $file"
        sed -i '' '1i\
const logger = console;' "$file"
    fi
done

echo "🔧 Phase 4: データベース接続の修正"
echo "📁 修正中: src/index.ts"

# index.tsのimport修正
sed -i '' '/import.*database/d' src/index.ts
sed -i '' '1i\
import { database } from '\''./database/sqlite'\'';' src/index.ts

# logger追加
if ! grep -q "const logger" src/index.ts; then
    sed -i '' '2i\
const logger = console;' src/index.ts
fi

echo "✅ TypeScriptエラー修正完了！"
echo "📊 修正結果を確認中..."

# TypeScriptコンパイルチェック
npm run build 2>&1 | head -10 