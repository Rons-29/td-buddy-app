#!/bin/bash

echo "🔧 残りのインポートエラーを修正します..."

cd /Users/shirokki22/project/td-buddy-app/td-buddy-webapp/frontend

# 1. PasswordGenerator.tsx の修正
echo "📝 PasswordGenerator.tsx を修正中..."
sed -i '' "s/import BrewCharacter';/import BrewCharacter from '.\/BrewCharacter';/" components/PasswordGenerator.tsx

# 2. PersonalInfoGenerator.tsx の修正
echo "📝 PersonalInfoGenerator.tsx を修正中..."
sed -i '' "s/import BrewCharacter';/import BrewCharacter from '.\/BrewCharacter';/" components/PersonalInfoGenerator.tsx

# 3. UuidGenerator.tsx の修正
echo "📝 UuidGenerator.tsx を修正中..."
sed -i '' "s/import BrewCharacter';/import BrewCharacter from '.\/BrewCharacter';/" components/UuidGenerator.tsx

# 4. file-size-test/page.tsx の修正
echo "📝 file-size-test/page.tsx を修正中..."
sed -i '' "s/import BrewCharacter';/import BrewCharacter from '..\/..\/components\/BrewCharacter';/" app/file-size-test/page.tsx

# 5. ai-chat/page.tsx の修正（dynamic import）
echo "📝 ai-chat/page.tsx を修正中..."
sed -i '' "s/import BrewCharacter')/import('..\/..\/components\/BrewCharacter'))/" app/ai-chat/page.tsx

echo "✅ インポートエラー修正完了！" 