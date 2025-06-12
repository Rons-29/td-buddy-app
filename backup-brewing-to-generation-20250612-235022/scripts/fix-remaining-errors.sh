#!/bin/bash

echo "🔧 残りのブランディングエラーを完全修正します..."

cd /Users/shirokki22/project/td-buddy-app/td-buddy-webapp/frontend

# 1. CSVTestDataGenerator.tsx の修正
echo "📝 CSVTestDataGenerator.tsx を修正中..."
sed -i '' 's/BrewMood/string/g' components/CSVTestDataGenerator.tsx
sed -i '' 's/EnhancedTDCharacter/BrewCharacter/g' components/CSVTestDataGenerator.tsx
sed -i '' 's/mood={brewMood}/message={brewMessage}/g' components/CSVTestDataGenerator.tsx
sed -i '' 's/setTdMessage/setBrewMessage/g' components/CSVTestDataGenerator.tsx
sed -i '' 's/setTdMood/setBrewMood/g' components/CSVTestDataGenerator.tsx
sed -i '' 's/import BrewCharacter from/import BrewCharacter from/g' components/CSVTestDataGenerator.tsx

# 2. PersonalInfoGenerator.tsx の修正
echo "📝 PersonalInfoGenerator.tsx を修正中..."
sed -i '' 's/EnhancedTDCharacter/BrewCharacter/g' components/PersonalInfoGenerator.tsx

# 3. BrewMood型の完全な修正
echo "📝 BrewMood型参照を修正中..."
find . -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/<BrewMood>/<string>/g'

# 4. 残りのTD関連の変数名を修正
echo "📝 残りのTD変数名を修正中..."
find . -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/setTdMessage/setBrewMessage/g'
find . -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/setTdMood/setBrewMood/g'
find . -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/tdMessage/brewMessage/g'
find . -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/tdMood/brewMood/g'

echo "✅ 残りのエラー修正完了！" 