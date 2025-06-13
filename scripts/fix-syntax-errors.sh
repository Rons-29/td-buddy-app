#!/bin/bash

# 🍺 構文エラー一括修復スクリプト
# 自動化スクリプトによって破損したimport文とswitch文を修復

echo "🍺 Brew: 構文エラーの修復を開始します..."

cd td-buddy-webapp/backend

# 1. import文の修復
echo "📝 import文を修復中..."

# express import修復
find src -name "*.ts" -exec sed -i '' 's/import express$/import express from '\''express'\'';/g' {} \;

# crypto import修復
find src -name "*.ts" -exec sed -i '' 's/const logger = console;import crypto$/import crypto from '\''crypto'\'';/g' {} \;
find src -name "*.ts" -exec sed -i '' 's/import crypto$/import crypto from '\''crypto'\'';/g' {} \;

# database import修復
find src -name "*.ts" -exec sed -i '' 's/ database }$/import { database } from '\''..\/database\/database'\'';/g' {} \;

# 2. switch文の修復
echo "🔧 switch文を修復中..."

# 重複したcase文を修復
find src -name "*.ts" -exec sed -i '' '/case '\''none'\'':/{
N
s/case '\''none'\'':\n{/case '\''none'\'':
case '\''other'\'':/
}' {} \;

# 3. module.exports修復
echo "🔄 module.exports を export default に変換中..."
find src -name "*.ts" -exec sed -i '' 's/module\.exports = router;/export default router;/g' {} \;

# 4. 不完全なimport文を修復
echo "🔍 不完全なimport文を検索・修復中..."

# PersonalInfoService.tsの特殊ケース
if [ -f "src/services/PersonalInfoService.ts" ]; then
    sed -i '' 's/import { PerformanceService } from '\''\.\/PerformanceService'\'';import crypto$/import crypto from '\''crypto'\'';\'$'\nimport { PerformanceService } from '\''\.\/PerformanceService'\'';/g' src/services/PersonalInfoService.ts
fi

echo "✅ 構文エラー修復完了！"
echo "🍺 Brew: TypeScriptコンパイルを確認してください" 