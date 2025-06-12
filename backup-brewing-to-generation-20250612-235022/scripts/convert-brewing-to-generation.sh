#!/bin/bash

# 🔄 醸造 → 生成 一括変換スクリプト
# TestData Buddy プロジェクト用

set -e  # エラーで停止

echo "🤖 TDからのメッセージ: 醸造→生成の一括変換を開始します！"
echo ""

# 変換開始時刻を記録
START_TIME=$(date +%s)
BACKUP_DIR="backup-brewing-to-generation-$(date +%Y%m%d-%H%M%S)"

echo "📊 変換情報:"
echo "  開始時刻: $(date)"
echo "  バックアップ先: $BACKUP_DIR"
echo ""

# 1. バックアップ作成
echo "💾 バックアップ作成中..."
mkdir -p "$BACKUP_DIR"

# 主要ディレクトリをバックアップ（backup-*ディレクトリは除外）
rsync -av --exclude='backup-*/' --exclude='node_modules/' --exclude='.git/' . "$BACKUP_DIR/" > /dev/null
echo "  ✅ バックアップ完了: $BACKUP_DIR"
echo ""

# 2. 変換対象ファイルを特定
echo "🔍 変換対象ファイルを特定中..."
TARGET_FILES=$(find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.sh" \) \
  ! -path "./backup-*/*" \
  ! -path "./node_modules/*" \
  ! -path "./.git/*" \
  ! -path "./data/*" \
  ! -name "convert-brewing-to-generation.sh")

FILE_COUNT=$(echo "$TARGET_FILES" | wc -l | tr -d ' ')
echo "  📁 対象ファイル数: $FILE_COUNT"
echo ""

# 3. 変換パターンを定義
echo "🔄 変換パターンを適用中..."

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
  "s/高速醸造/高速生成/g"
  "s/標準醸造/標準生成/g"
  "s/中規模醸造/中規模生成/g"
  "s/大規模醸造/大規模生成/g"
  "s/ローカル醸造/ローカル生成/g"
  "s/醸造フィールド/生成フィールド/g"
  "s/醸造エンジン/生成エンジン/g"
  "s/醸造システム/生成システム/g"
  "s/醸造準備/生成準備/g"
  "s/醸造機能/生成機能/g"
  "s/醸造処理/生成処理/g"
  "s/醸造時間/生成時間/g"
  "s/醸造速度/生成速度/g"
  "s/醸造品質/生成品質/g"
  "s/醸造実行/生成実行/g"
  "s/醸造開始/生成開始/g"
  "s/を醸造し/を生成し/g"
  "s/を醸造します/を生成します/g"
  "s/を醸造でき/を生成でき/g"
  "s/を醸造する/を生成する/g"
  "s/が醸造され/が生成され/g"
  "s/醸造された/生成された/g"
  "s/醸造できる/生成できる/g"
  "s/醸造可能/生成可能/g"
  "s/CSV.*醸造/CSV生成/g"
  "s/UUID.*醸造/UUID生成/g"
  "s/AI連携型テストデータ醸造ツール/AI連携型テストデータ生成ツール/g"
  "s/テスト用.*醸造/テストデータ生成/g"
)

# 特別なパターン（文脈を考慮）
declare -a SPECIAL_PATTERNS=(
  "s/data brewing/data generation/g"
  "s/Data Brewing/Data Generation/g"
  "s/データ醸造の/データ生成の/g"
  "s/醸造アシスタント/生成アシスタント/g"
  "s/醸造ログ/生成ログ/g"
)

# 4. パターン別変換実行
CHANGED_FILES=0
TOTAL_CHANGES=0

for pattern in "${PATTERNS[@]}"; do
  echo "  🔄 適用中: $pattern"
  
  for file in $TARGET_FILES; do
    if [ -f "$file" ]; then
      # macOS対応のsed（GNU sedとBSD sedの両方に対応）
      if sed -i.tmp "$pattern" "$file" 2>/dev/null; then
        # 変更があったかチェック
        if ! cmp -s "$file" "$file.tmp"; then
          CHANGED_FILES=$((CHANGED_FILES + 1))
          TOTAL_CHANGES=$((TOTAL_CHANGES + 1))
        fi
        rm -f "$file.tmp"
      fi
    fi
  done
done

# 5. 特別パターンの適用
echo ""
echo "🎯 特別パターンを適用中..."
for pattern in "${SPECIAL_PATTERNS[@]}"; do
  echo "  🔄 適用中: $pattern"
  
  for file in $TARGET_FILES; do
    if [ -f "$file" ]; then
      if sed -i.tmp "$pattern" "$file" 2>/dev/null; then
        if ! cmp -s "$file" "$file.tmp"; then
          CHANGED_FILES=$((CHANGED_FILES + 1))
          TOTAL_CHANGES=$((TOTAL_CHANGES + 1))
        fi
        rm -f "$file.tmp"
      fi
    fi
  done
done

# 6. package.jsonの特別処理
echo ""
echo "📦 package.json特別処理中..."
if [ -f "package.json" ]; then
  sed -i.tmp 's/データ醸造から品質管理まで/データ生成から品質管理まで/g' package.json
  sed -i.tmp 's/data brewing/data generation/g' package.json
  rm -f package.json.tmp
  echo "  ✅ package.json更新完了"
fi

# 7. package-root.jsonの処理
if [ -f "package-root.json" ]; then
  sed -i.tmp 's/データ醸造から品質管理まで/データ生成から品質管理まで/g' package-root.json
  rm -f package-root.json.tmp
  echo "  ✅ package-root.json更新完了"
fi

# 8. スクリプトファイルの処理
echo ""
echo "📝 スクリプトファイル処理中..."
for script_file in scripts/*.sh; do
  if [ -f "$script_file" ] && [ "$script_file" != "scripts/convert-brewing-to-generation.sh" ]; then
    sed -i.tmp 's/生成 → 醸造/醸造 → 生成/g' "$script_file"
    sed -i.tmp 's/生成→醸造/醸造→生成/g' "$script_file"
    rm -f "$script_file.tmp"
  fi
done

# 9. 結果レポート生成
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo "🎉 変換完了レポート"
echo "=================================="
echo "📊 処理統計:"
echo "  対象ファイル数: $FILE_COUNT"
echo "  変更ファイル数: $CHANGED_FILES"
echo "  総変更箇所数: $TOTAL_CHANGES"
echo "  処理時間: ${DURATION}秒"
echo ""
echo "💾 バックアップ情報:"
echo "  バックアップ場所: $BACKUP_DIR"
echo "  復元コマンド: rsync -av $BACKUP_DIR/ ./"
echo ""
echo "🔍 変更確認コマンド:"
echo "  git diff --stat"
echo "  git status"
echo ""
echo "🤖 TDからのメッセージ: 醸造→生成変換が完了しました！"
echo "   品質チェックとして、いくつかのファイルを確認することをお勧めします♪"
echo ""

# 10. 主要ファイルの変更サマリー表示
echo "📋 主要ファイルの変更サマリー:"
echo "--------------------------------"

# package.jsonの変更確認
if [ -f "package.json" ]; then
  echo "✅ package.json - 説明文とコマンドタイトルを更新"
fi

# 主要コンポーネントの確認
if [ -f "td-buddy-webapp/frontend/components/PasswordGenerator.tsx" ]; then
  echo "✅ PasswordGenerator.tsx - パスワード生成UIを更新"
fi

if [ -f "td-buddy-webapp/frontend/app/layout.tsx" ]; then
  echo "✅ layout.tsx - メタデータとナビゲーションを更新"
fi

if [ -f "td-buddy-webapp/frontend/lib/config.ts" ]; then
  echo "✅ config.ts - 設定メッセージを更新"
fi

echo ""
echo "🚀 次のステップ:"
echo "  1. git status で変更ファイルを確認"
echo "  2. 主要ページの動作確認"
echo "  3. 問題があれば '$BACKUP_DIR' から復元"
echo "  4. 問題なければ git commit で変更をコミット"
echo ""
echo "🎯 変換処理完了！お疲れさまでした♪" 