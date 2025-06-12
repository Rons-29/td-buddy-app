#!/bin/bash

# 🚀 完全版: 生成 → 生成 一括変換スクリプト
# 全プロジェクトファイルを対象とした完全変換

set -e

echo "🤖 TDからのメッセージ: 完全一括変換で生成→生成を実行します！"
echo ""

# 変換パターン定義
declare -a CONVERSION_PATTERNS=(
  # 基本的な生成関連用語
  "s/生成/生成/g"
  "s/パスワード生成/パスワード生成/g"
  "s/データ生成/データ生成/g"
  "s/個人情報生成/個人情報生成/g"
  "s/テストデータ生成/テストデータ生成/g"
  "s/CSV生成/CSV生成/g"
  "s/ファイル生成/ファイル生成/g"
  "s/テキスト生成/テキスト生成/g"
  "s/UUID生成/UUID生成/g"
  
  # 生成関連動詞・形容詞
  "s/生成中/生成中/g"
  "s/生成完了/生成完了/g"
  "s/生成開始/生成開始/g"
  "s/生成準備/生成準備/g"
  "s/生成設定/生成設定/g"
  "s/生成結果/生成結果/g"
  "s/生成ツール/生成ツール/g"
  "s/生成機能/生成機能/g"
  "s/生成能力/生成能力/g"
  "s/生成工房/生成工房/g"
  "s/生成マスター/生成マスター/g"
  "s/生成アシスタント/生成アシスタント/g"
  "s/生成エンジン/生成エンジン/g"
  "s/生成システム/生成システム/g"
  
  # 数値・個数関連
  "s/生成個数/生成個数/g"
  "s/生成数/生成数/g"
  "s/大量生成/大量生成/g"
  "s/高速生成/高速生成/g"
  "s/標準生成/標準生成/g"
  "s/中規模生成/中規模生成/g"
  "s/大規模生成/大規模生成/g"
  
  # 特殊な表現
  "s/生成した高品質テストデータ/生成した高品質テストデータ/g"
  "s/データ生成ログ/データ生成ログ/g"
  "s/生成者:/生成者:/g"
  "s/生成完了時刻:/生成完了時刻:/g"
  "s/一緒にデータを生成/一緒にデータを生成/g"
  "s/生成のお手伝い/生成のお手伝い/g"
  "s/AI生成/AI生成/g"
  "s/ローカル生成/ローカル生成/g"
  "s/API生成/API生成/g"
  "s/チャンク生成/チャンク生成/g"
  
  # 説明文・メッセージ内の表現
  "s/を生成/を生成/g"
  "s/が生成/が生成/g"
  "s/に生成/に生成/g"
  "s/生成して/生成して/g"
  "s/生成しま/生成しま/g"
  "s/生成でき/生成でき/g"
  "s/生成いた/生成いた/g"
)

# 対象ファイルを検索（バックアップディレクトリを除外）
echo "🔍 変換対象ファイルを検索中..."
TARGET_FILES=$(find . -type f \
  \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.sh" \) \
  ! -path "./backup-*/*" \
  ! -path "./node_modules/*" \
  ! -path "./.git/*" \
  ! -path "./.next/*" \
  ! -path "./coverage/*" \
  ! -path "./dist/*" \
  ! -path "./build/*")

echo "📊 対象ファイル数: $(echo "$TARGET_FILES" | wc -l | xargs)"
echo ""

# 変換実行
echo "🔄 一括変換実行中..."
converted_count=0

for file in $TARGET_FILES; do
  if [ -f "$file" ]; then
    # ファイル内に生成が含まれているかチェック
    if grep -q "生成" "$file" 2>/dev/null; then
      echo "  🔧 変換中: $file"
      
      # 一時ファイルを作成
      temp_file=$(mktemp)
      
      # 全ての変換パターンを適用
      cp "$file" "$temp_file"
      for pattern in "${CONVERSION_PATTERNS[@]}"; do
        sed "$pattern" "$temp_file" > "${temp_file}.tmp"
        mv "${temp_file}.tmp" "$temp_file"
      done
      
      # 元ファイルに上書き
      mv "$temp_file" "$file"
      converted_count=$((converted_count + 1))
    fi
  fi
done

echo ""
echo "✅ 変換完了！"
echo "📊 変換統計:"
echo "  - 変換対象ファイル: $(echo "$TARGET_FILES" | wc -l | xargs)件"
echo "  - 実際に変換されたファイル: ${converted_count}件"
echo ""

# 残存チェック
echo "🔍 残存生成表現をチェック中..."
remaining_count=$(grep -r "生成" . --exclude-dir=backup-* --exclude-dir=node_modules --exclude-dir=.git 2>/dev/null | wc -l | xargs)

if [ "$remaining_count" -eq 0 ]; then
  echo "🎉 完全成功！生成→生成変換が100%完了しました！"
else
  echo "⚠️  まだ $remaining_count 箇所に生成が残っています"
  echo "残存箇所（上位10件）:"
  grep -r "生成" . --exclude-dir=backup-* --exclude-dir=node_modules --exclude-dir=.git 2>/dev/null | head -10
fi

echo ""
echo "🤖 TDからのメッセージ: 完全一括変換が完了しました！テストデータ生成ツールとして統一されましたね♪" 