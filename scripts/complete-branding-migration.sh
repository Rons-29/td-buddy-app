#!/bin/bash

echo "🍺 ブランディング変更の残り部分を完了させます..."

cd /Users/shirokki22/project/td-buddy-app/td-buddy-webapp/frontend

# 1. EnhancedCSVGenerator.tsx の修正
echo "📝 EnhancedCSVGenerator.tsx のTD→Brew変換中..."
sed -i '' 's/setTdEmotion/setBrewEmotion/g' components/csv/EnhancedCSVGenerator.tsx
sed -i '' 's/tdEmotion/brewEmotion/g' components/csv/EnhancedCSVGenerator.tsx
sed -i '' 's/setTdCurrentMessage/setBrewCurrentMessage/g' components/csv/EnhancedCSVGenerator.tsx
sed -i '' 's/tdCurrentMessage/brewCurrentMessage/g' components/csv/EnhancedCSVGenerator.tsx

# 2. 残りのTDEmotion型参照を修正
echo "📝 型参照の修正中..."
find . -name "*.tsx" -o -name "*.ts" | xargs grep -l "TDEmotion" | while read file; do
    sed -i '' 's/TDEmotion/BrewEmotion/g' "$file"
done

# 3. 残りのTDMood型参照を修正
find . -name "*.tsx" -o -name "*.ts" | xargs grep -l "TDMood" | while read file; do
    sed -i '' 's/TDMood/BrewMood/g' "$file"
done

# 4. bg-td-primary などのCSSクラスをbg-brew-primaryに変更
echo "📝 CSSクラスの修正中..."
find . -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/bg-td-primary/bg-brew-primary/g'
find . -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/text-td-primary/text-brew-primary/g'
find . -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/border-td-primary/border-brew-primary/g'

echo "✅ ブランディング変更の残り部分完了！" 