#!/bin/bash

# 🍺 残存する🤖絵文字の最終修正スクリプト

echo "🍺 Brewからのメッセージ: 残存する🤖を🍺に修正します..."

cd td-buddy-webapp

# 対象ファイルを個別修正
echo "🔧 修正中: requestLogger.ts"
sed -i '' 's/🤖/🍺/g' backend/src/middleware/requestLogger.ts

echo "🔧 修正中: init-db-simple.ts"
sed -i '' 's/🤖/🍺/g' backend/src/scripts/init-db-simple.ts

echo "🔧 修正中: init-db.ts"
sed -i '' 's/🤖/🍺/g' backend/src/scripts/init-db.ts

echo "🔧 修正中: index.ts"
sed -i '' 's/🤖/🍺/g' backend/src/index.ts

echo "🔧 修正中: PersonalInfoService.ts"
sed -i '' 's/🤖/🍺/g' backend/src/services/PersonalInfoService.ts

echo "🔧 修正中: WebSocketService.ts"
sed -i '' 's/🤖/🍺/g' backend/src/services/WebSocketService.ts

echo "✅ 🤖 → 🍺 修正完了！"

# 修正結果の確認
echo "📊 修正結果確認:"
find backend/src -name "*.ts" -exec grep -l "🤖" {} \; | wc -l | awk '{print $1 " files still contain 🤖"}' 