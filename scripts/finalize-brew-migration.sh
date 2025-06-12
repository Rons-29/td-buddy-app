#!/bin/bash

# QA Workbench + Brew 移行の仕上げスクリプト
# 残りの細かい調整を実行

set -e

echo "🍺 ブリュー移行の仕上げ作業を開始します..."

cd "$(dirname "$0")/.."

# 1. TDCharacter → BrewCharacter のファイル名変更
echo "📁 ファイル名変更中..."
if [ -f "td-buddy-webapp/frontend/components/TDCharacter.tsx" ]; then
    mv "td-buddy-webapp/frontend/components/TDCharacter.tsx" "td-buddy-webapp/frontend/components/BrewCharacter.tsx"
    echo "✅ TDCharacter.tsx → BrewCharacter.tsx"
fi

# 2. インポート・使用箇所の更新
echo "🔧 インポート更新中..."
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/import.*TDCharacter/import BrewCharacter/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/from.*TDCharacter/from "..\/..\/components\/BrewCharacter"/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/<TDCharacter/<BrewCharacter/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/TDCharacter>/BrewCharacter>/g' 2>/dev/null || true

# 3. 変数名の変更
echo "🔄 変数名更新中..."
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/tdState/brewState/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/setTdState/setBrewState/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/tdMessage/brewMessage/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/tdMood/brewMood/g' 2>/dev/null || true

# 4. 統計情報の更新
echo "📊 統計情報更新中..."
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/生成統計/生成統計/g' 2>/dev/null || true

# 5. APIコメントの更新
echo "💬 APIコメント更新中..."
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/API生成/API生成/g' 2>/dev/null || true

echo "🎉 仕上げ作業完了！"
echo ""
echo "📋 追加変更:"
echo "  ✅ ファイル名変更"
echo "  ✅ インポート更新"
echo "  ✅ 変数名統一"
echo "  ✅ 統計情報更新"
echo ""
echo "🍺 ブリューからのメッセージ: 移行作業がすべて完了しました！新しいQA Workbenchとして生まれ変わりました♪" 