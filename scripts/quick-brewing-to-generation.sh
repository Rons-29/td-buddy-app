#!/bin/bash

# 🚀 軽量版: 醸造 → 生成 変換スクリプト
# 重要なファイルのみを対象

set -e

echo "🤖 TDからのメッセージ: 重要ファイルの醸造→生成変換を開始します！"
echo ""

# 重要ファイルのみを対象
IMPORTANT_FILES=(
  "package.json"
  "package-root.json"
  "README.md"
  "td-buddy-webapp/frontend/app/layout.tsx"
  "td-buddy-webapp/frontend/app/page.tsx"
  "td-buddy-webapp/frontend/components/PasswordGenerator.tsx"
  "td-buddy-webapp/frontend/lib/config.ts"
  "td-buddy-webapp/frontend/components/BrewCharacter.tsx"
  "td-buddy-webapp/frontend/components/CSVTestDataGeneratorV2.tsx"
  "td-buddy-webapp/frontend/app/ai-chat/page.tsx"
)

# 変換パターン
declare -a PATTERNS=(
  "s/パスワード醸造/パスワード生成/g"
  "s/データ醸造/データ生成/g" 
  "s/個人情報醸造/個人情報生成/g"
  "s/テストデータ醸造/テストデータ生成/g"
  "s/醸造ツール/生成ツール/g"
  "s/醸造設定/生成設定/g"
  "s/醸造個数/生成個数/g"
  "s/醸造数/生成数/g"
  "s/醸造結果/生成結果/g"
  "s/醸造完了/生成完了/g"
  "s/醸造中/生成中/g"
  "s/大量醸造/大量生成/g"
  "s/醸造実行/生成実行/g"
  "s/醸造開始/生成開始/g"
  "s/AI連携型テストデータ醸造ツール/AI連携型テストデータ生成ツール/g"
  "s/を醸造し/を生成し/g"
  "s/を醸造します/を生成します/g"
  "s/データ醸造から品質管理まで/データ生成から品質管理まで/g"
  "s/data brewing/data generation/g"
)

echo "📋 対象ファイル: ${#IMPORTANT_FILES[@]}個"
echo ""

for file in "${IMPORTANT_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "🔄 変換中: $file"
    
    for pattern in "${PATTERNS[@]}"; do
      sed -i.tmp "$pattern" "$file" 2>/dev/null || true
    done
    
    rm -f "$file.tmp"
    echo "  ✅ 完了"
  else
    echo "  ⚠️  見つかりません: $file"
  fi
done

echo ""
echo "🎉 重要ファイルの変換完了！"
echo ""
echo "🔍 変更確認:"
echo "  git diff package.json"
echo "  git status"
echo ""
echo "🤖 TDからのメッセージ: 主要ファイルの醸造→生成変換が完了しました♪" 