#!/bin/bash

echo "🔧 CSVTestDataGeneratorV2.tsx の TDからBrewへの移行を完了します..."

# ファイルパス
CSV_FILE="td-buddy-webapp/frontend/components/CSVTestDataGeneratorV2.tsx"

# setTdMood を setBrewMood に変更
echo "📝 setTdMood → setBrewMood に変更中..."
sed -i '' 's/setTdMood/setBrewMood/g' "$CSV_FILE"

# setTdMessage を setBrewMessage に変更
echo "📝 setTdMessage → setBrewMessage に変更中..."
sed -i '' 's/setTdMessage/setBrewMessage/g' "$CSV_FILE"

# EnhancedTDCharacter を BrewCharacter に変更
echo "📝 EnhancedTDCharacter → BrewCharacter に変更中..."
sed -i '' 's/EnhancedTDCharacter/BrewCharacter/g' "$CSV_FILE"

# TDキャラクター のコメントを Brewキャラクター に変更
echo "📝 コメント内のTDキャラクターをBrewキャラクターに変更中..."
sed -i '' 's/TDキャラクター/Brewキャラクター/g' "$CSV_FILE"

echo "✅ CSVTestDataGeneratorV2.tsx の移行完了！" 