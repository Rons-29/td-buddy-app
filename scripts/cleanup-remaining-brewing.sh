#!/bin/bash

# 🧹 残存生成表現クリーンアップスクリプト
set -e

echo "🤖 TDからのメッセージ: 残りの生成表現をクリーンアップします！"
echo ""

# 対象ファイル（マイグレーションスクリプトは除外）
CLEANUP_FILES=(
  "data/aozora-bunko-samples.ts"
  "td-buddy-webapp/frontend/lib/config.ts"
  "td-buddy-webapp/frontend/components/BrewCharacter.tsx"
  "td-buddy-webapp/frontend/app/ai-chat/page.tsx"
)

# クリーンアップパターン
declare -a CLEANUP_PATTERNS=(
  "s/生成した高品質テストデータ/生成した高品質テストデータ/g"
  "s/データ生成ログ/データ生成ログ/g"
  "s/生成者:/生成者:/g"
  "s/生成完了時刻:/生成完了時刻:/g"
  "s/生成中です/生成中です/g"
  "s/生成を開始/生成を開始/g"
  "s/生成のお手伝い/生成のお手伝い/g"
  "s/一緒にデータを生成/一緒にデータを生成/g"
  "s/生成設備/生成設備/g"
  "s/AI生成システム/AI生成システム/g"
  "s/生成エンジン/生成エンジン/g"
  "s/データ生成アシスタント/データ生成アシスタント/g"
  "s/生成アシスタント/生成アシスタント/g"
)

echo "🧹 残存生成表現をクリーンアップ中..."

for file in "${CLEANUP_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  🔄 処理中: $file"
    
    for pattern in "${CLEANUP_PATTERNS[@]}"; do
      sed -i.tmp "$pattern" "$file" 2>/dev/null || true
    done
    
    rm -f "$file.tmp"
    echo "    ✅ 完了"
  else
    echo "    ⚠️  ファイルが見つかりません: $file"
  fi
done

echo ""
echo "🧹 追加でtd-buddy-webappディレクトリ内の生成表現をチェック..."

# td-buddy-webappディレクトリ内の残存生成表現を一括変換
find td-buddy-webapp -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
  ! -path "*/node_modules/*" \
  ! -path "*/backup-*/*" \
  -exec grep -l "生成" {} \; 2>/dev/null | while read file; do
  
  echo "  🔄 追加処理: $file"
  
  for pattern in "${CLEANUP_PATTERNS[@]}"; do
    sed -i.tmp "$pattern" "$file" 2>/dev/null || true
  done
  
  rm -f "$file.tmp"
done

echo ""
echo "🎉 生成表現クリーンアップ完了！"
echo ""
echo "🔍 確認コマンド:"
echo "  grep -r '生成' . --exclude-dir=backup-* --exclude-dir=node_modules | grep -v scripts/"
echo ""
echo "🤖 TDからのメッセージ: 残存生成の掃除が完了しました！きれいになりましたね♪" 