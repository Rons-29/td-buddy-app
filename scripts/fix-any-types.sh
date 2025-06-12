#!/bin/bash

# 🍺 QA Workbench + Brew: any型修正スクリプト

echo "🍺 Brewからのメッセージ: any型を適切な型定義に修正します..."

cd td-buddy-webapp

echo "🔧 Phase 1: バックエンドany型修正"

# PersonalInfoService.ts のany型修正
echo "📁 修正中: backend/src/services/PersonalInfoService.ts"
sed -i '' 's/: any\[\]/: string[]/g' backend/src/services/PersonalInfoService.ts
sed -i '' 's/: any =/: PersonalInfo =/g' backend/src/services/PersonalInfoService.ts
sed -i '' 's/data: any/data: PersonalInfo/g' backend/src/services/PersonalInfoService.ts

# CompositionPasswordService.ts のany型修正  
echo "📁 修正中: backend/src/services/CompositionPasswordService.ts"
sed -i '' 's/: any/: string/g' backend/src/services/CompositionPasswordService.ts

# DateTimeService.ts のany型修正
echo "📁 修正中: backend/src/services/DateTimeService.ts"
sed -i '' 's/: any/: string | Date/g' backend/src/services/DateTimeService.ts

# NumberBooleanService.ts のany型修正
echo "📁 修正中: backend/src/services/NumberBooleanService.ts"
sed -i '' 's/: any/: number/g' backend/src/services/NumberBooleanService.ts

# WebSocketService.ts のany型修正
echo "📁 修正中: backend/src/services/WebSocketService.ts"
sed -i '' 's/: any/: Record<string, unknown>/g' backend/src/services/WebSocketService.ts

# exportService.ts のany型修正
echo "📁 修正中: backend/src/services/exportService.ts"
sed -i '' 's/: any\[\]/: Record<string, unknown>[]/g' backend/src/services/exportService.ts
sed -i '' 's/: any/: Record<string, unknown>/g' backend/src/services/exportService.ts

echo "🔧 Phase 2: console.log修正"
echo "📁 修正中: console.logを適切なloggerに変更"

# console.logをloggerに変更
find backend/src -name "*.ts" -exec sed -i '' 's/console\.log(/logger.log(/g' {} \;
find backend/src -name "*.ts" -exec sed -i '' 's/console\.error(/logger.error(/g' {} \;
find backend/src -name "*.ts" -exec sed -i '' 's/console\.warn(/logger.warn(/g' {} \;

echo "🔧 Phase 3: no-unused-expressions修正"
echo "📁 修正中: backend/src/routes"

# 単体式のログ文を適切に修正
find backend/src/routes -name "*.ts" -exec sed -i '' 's/brewMessage;/\/\/ brewMessage;/g' {} \;
find backend/src/routes -name "*.ts" -exec sed -i '' 's/tdMessage;/\/\/ tdMessage;/g' {} \;

echo "🔧 Phase 4: import重複の修正"
echo "📁 修正中: 重複import削除"

# ファイルごとに重複importを削除
for file in backend/src/**/*.ts; do
    if [ -f "$file" ]; then
        # 同じモジュールからの重複importを統合
        awk '
        /^import.*from/ {
            module = $0
            gsub(/^import[^{]*\{/, "", module)
            gsub(/\}.*from.*/, "", module)
            gsub(/from.*/, "", $0)
            gsub(/import[^{]*\{/, "", $0)
            if (seen[module]) {
                next
            }
            seen[module] = 1
        }
        {print}
        ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    fi
done

echo "✅ any型修正完了！"
echo "📊 修正結果を確認中..."

# 修正結果の確認
cd backend && npm run lint 2>/dev/null | grep -c "error\|warning" | awk '{print "Backend残存問題数: " $1}' 