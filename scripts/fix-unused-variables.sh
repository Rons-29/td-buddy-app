#!/bin/bash

# 🍺 QA Workbench + Brew: 未使用変数削除スクリプト

echo "🍺 Brewからのメッセージ: 未使用変数を削除します..."

cd td-buddy-webapp

echo "🔧 Phase 1: バックエンド未使用変数削除"

# PersonalInfoService.ts の未使用import削除
echo "📁 修正中: backend/src/services/PersonalInfoService.ts"
sed -i '' '/PersonalInfoField,/d' backend/src/services/PersonalInfoService.ts
sed -i '' '/STREET_PATTERNS,/d' backend/src/services/PersonalInfoService.ts
sed -i '' '/BUILDING_PATTERNS,/d' backend/src/services/PersonalInfoService.ts
sed -i '' '/COMPLETE_KANA_MAPPING,/d' backend/src/services/PersonalInfoService.ts
sed -i '' '/SINGLE_CHAR_MAPPING,/d' backend/src/services/PersonalInfoService.ts
sed -i '' '/const performanceMetric.*never used/,/^[[:space:]]*$/d' backend/src/services/PersonalInfoService.ts
sed -i '' 's/, settings: any//g' backend/src/services/PersonalInfoService.ts

# CompositionPasswordService.ts の未使用変数削除
echo "📁 修正中: backend/src/services/CompositionPasswordService.ts"
sed -i '' '/const entropy.*never used/,/^[[:space:]]*$/d' backend/src/services/CompositionPasswordService.ts

# DateTimeService.ts の未使用引数削除
echo "📁 修正中: backend/src/services/DateTimeService.ts"
sed -i '' 's/, options: any//g' backend/src/services/DateTimeService.ts
sed -i '' 's/options: any, //g' backend/src/services/DateTimeService.ts

# NumberBooleanService.ts の未使用引数削除
echo "📁 修正中: backend/src/services/NumberBooleanService.ts"
sed -i '' 's/value, //g' backend/src/services/NumberBooleanService.ts
sed -i '' 's/, value//g' backend/src/services/NumberBooleanService.ts

# WebSocketService.ts の未使用引数削除
echo "📁 修正中: backend/src/services/WebSocketService.ts"
sed -i '' 's/data: any, //g' backend/src/services/WebSocketService.ts
sed -i '' 's/, data: any//g' backend/src/services/WebSocketService.ts

# exportService.ts の未使用引数削除
echo "📁 修正中: backend/src/services/exportService.ts"
sed -i '' 's/options: any, //g' backend/src/services/exportService.ts
sed -i '' 's/, options: any//g' backend/src/services/exportService.ts

# passwordService.ts の未使用変数削除
echo "📁 修正中: backend/src/services/passwordService.ts"
sed -i '' '/const entropy.*never used/,/^[[:space:]]*$/d' backend/src/services/passwordService.ts

echo "🔧 Phase 2: フロントエンド未使用変数削除"

# 主要な未使用変数を削除
echo "📁 修正中: frontend/components/BrewCharacter.tsx"
sed -i '' '/const \[isVisible, setIsVisible\]/d' frontend/components/BrewCharacter.tsx

echo "📁 修正中: frontend/components/CSVTestDataGenerator.tsx"
sed -i '' '/const \[showPresetManager\]/d' frontend/components/CSVTestDataGenerator.tsx
sed -i '' '/const \[showGuide, setShowGuide\]/d' frontend/components/CSVTestDataGenerator.tsx
sed -i '' '/const \[showDataTable\]/d' frontend/components/CSVTestDataGenerator.tsx
sed -i '' '/const \[showFileImporter, setShowFileImporter\]/d' frontend/components/CSVTestDataGenerator.tsx

echo "📁 修正中: frontend/components/CSVTestDataGeneratorV2.tsx"
sed -i '' '/const \[error, setError\]/d' frontend/components/CSVTestDataGeneratorV2.tsx
sed -i '' '/const \[isCopied, setIsCopied\]/d' frontend/components/CSVTestDataGeneratorV2.tsx

echo "✅ 未使用変数削除完了！"
echo "📊 修正結果を確認中..."

# 修正結果の確認
cd backend && npm run lint 2>/dev/null | grep -c "error\|warning" | awk '{print "Backend残存問題数: " $1}'
cd ../frontend && npm run lint 2>/dev/null | grep -c "Warning:" | awk '{print "Frontend残存問題数: " $1}' 