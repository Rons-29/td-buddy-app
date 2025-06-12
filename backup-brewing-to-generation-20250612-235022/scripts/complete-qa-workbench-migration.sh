#!/bin/bash

# 🍺 QA Workbench + Brew 完全移行スクリプト
# 残りのすべてのTestData Buddy/TD参照をQA Workbench/Brewに一括変換

set -e

echo "🍺 QA Workbench + Brew 完全移行を開始します..."

# 作業ディレクトリをプロジェクトルートに設定
cd "$(dirname "$0")/.."

# バックアップディレクトリ作成
BACKUP_DIR="./backup-complete-migration-$(date +%Y%m%d-%H%M%S)"
echo "📁 バックアップを作成中: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# 重要ファイルのバックアップ
echo "💾 重要ファイルをバックアップ中..."
cp -r td-buddy-webapp/frontend "$BACKUP_DIR/" 2>/dev/null || true
cp -r td-buddy-webapp/backend "$BACKUP_DIR/" 2>/dev/null || true
cp -r src "$BACKUP_DIR/" 2>/dev/null || true
cp -r data "$BACKUP_DIR/" 2>/dev/null || true

echo "✅ バックアップ完了"

# =============================================================================
# Phase 1: フロントエンド フォルダ全体の一括変換
# =============================================================================
echo ""
echo "🎨 Phase 1: フロントエンド一括変換開始..."

FRONTEND_DIR="td-buddy-webapp/frontend"

# 1. TestData Buddy → QA Workbench
echo "📝 TestData Buddy → QA Workbench 変換中..."
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" -o -name "*.json" -o -name "*.md" | \
  xargs sed -i '' 's/TestData Buddy/QA Workbench/g' 2>/dev/null || true

# 2. testdata-buddy → qa-workbench  
echo "📝 testdata-buddy → qa-workbench 変換中..."
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" -o -name "*.json" | \
  xargs sed -i '' 's/testdata-buddy/qa-workbench/g' 2>/dev/null || true

# 3. TD関連 → Brew関連 (慎重に文脈を考慮)
echo "📝 TD → Brew 変換中..."
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/TDからの/Brewからの/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/TDくん/Brew/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/TD Buddy/Brew Assistant/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/Powered by TD/Powered by Brew/g' 2>/dev/null || true

# 4. 🤖 → 🍺 絵文字変更
echo "🍺 絵文字変更中..."
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/🤖/🍺/g' 2>/dev/null || true

# 5. 生成 → 醸造 変更
echo "📝 生成→醸造変換中..."
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/パスワード生成/パスワード醸造/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/データ生成/データ醸造/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/個人情報生成/個人情報醸造/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/生成ツール/醸造ツール/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/生成設定/醸造設定/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/生成個数/醸造個数/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/生成数/醸造数/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/生成結果/醸造結果/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/生成完了/醸造完了/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/生成中/醸造中/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/大量生成/大量醸造/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/高速生成/高速醸造/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/標準生成/標準醸造/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/を生成し/を醸造し/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/を生成します/を醸造します/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/を生成でき/を醸造でき/g' 2>/dev/null || true

# 6. CSS クラス名変更
echo "🎨 CSS クラス名変更中..."
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/font-td/font-brew/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/from-td-primary/from-orange/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/to-td-secondary/to-amber/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/bg-td-primary/bg-orange/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/text-td-primary/text-orange/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/border-td-primary/border-orange/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/brew-primary/orange/g' 2>/dev/null || true

# 7. 変数名の統一
echo "🔧 変数名統一中..."
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/setTdMessage/setBrewMessage/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/setTdMood/setBrewMood/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/tdMessage/brewMessage/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/tdMood/brewMood/g' 2>/dev/null || true
find "$FRONTEND_DIR" -name "*.tsx" -o -name "*.ts" | \
  xargs sed -i '' 's/TDキャラクター/Brewキャラクター/g' 2>/dev/null || true

echo "✅ Phase 1 完了: フロントエンド一括変換"

# =============================================================================
# Phase 2: バックエンド フォルダ全体の一括変換
# =============================================================================
echo ""
echo "🔧 Phase 2: バックエンド一括変換開始..."

BACKEND_DIR="td-buddy-webapp/backend"

# 1. コメント・ログメッセージの変換
echo "📝 バックエンドコメント変換中..."
find "$BACKEND_DIR" -name "*.ts" -o -name "*.js" -o -name "*.sql" -o -name "*.yaml" -o -name "*.json" | \
  xargs sed -i '' 's/TestData Buddy/QA Workbench/g' 2>/dev/null || true
find "$BACKEND_DIR" -name "*.ts" -o -name "*.js" | \
  xargs sed -i '' 's/TDからの/Brewからの/g' 2>/dev/null || true
find "$BACKEND_DIR" -name "*.ts" -o -name "*.js" | \
  xargs sed -i '' 's/🤖 TD:/🍺 Brew:/g' 2>/dev/null || true

# 2. アップロードファイルのヘッダー変換
echo "📁 アップロードファイルヘッダー変換中..."
find "$BACKEND_DIR/uploads" -name "*.sql" -o -name "*.yaml" -o -name "*.json" -o -name "*.csv" | \
  xargs sed -i '' 's/TestData Buddy/QA Workbench/g' 2>/dev/null || true
find "$BACKEND_DIR/uploads" -name "*.sql" -o -name "*.yaml" -o -name "*.json" -o -name "*.csv" | \
  xargs sed -i '' 's/Generated by.*TestData Buddy/Generated by QA Workbench - Brew Assistant/g' 2>/dev/null || true

echo "✅ Phase 2 完了: バックエンド一括変換"

# =============================================================================
# Phase 3: プロジェクトルート・設定ファイルの変換
# =============================================================================
echo ""
echo "⚙️ Phase 3: 設定ファイル一括変換開始..."

# 1. Netlify設定
echo "🌐 Netlify設定変更中..."
if [ -f "td-buddy-webapp/netlify.toml" ]; then
  sed -i '' 's/TD Buddy/QA Workbench/g' "td-buddy-webapp/netlify.toml" 2>/dev/null || true
fi

# 2. READMEファイル (プロジェクトルート以外)
echo "📚 README更新中..."
find . -name "README.md" -not -path "./README.md" | \
  xargs sed -i '' 's/TestData Buddy/QA Workbench/g' 2>/dev/null || true

# 3. package.jsonファイル (各種)
echo "📦 package.json更新中..."
find td-buddy-webapp -name "package.json" | \
  xargs sed -i '' 's/testdata-buddy/qa-workbench/g' 2>/dev/null || true
find td-buddy-webapp -name "package.json" | \
  xargs sed -i '' 's/TestData Buddy/QA Workbench/g' 2>/dev/null || true

echo "✅ Phase 3 完了: 設定ファイル一括変換"

# =============================================================================
# Phase 4: データ・スクリプトファイルの変換
# =============================================================================
echo ""
echo "🗂️ Phase 4: データ・スクリプトファイル一括変換開始..."

# 1. src フォルダ全体
echo "🔧 srcフォルダ変換中..."
find src -name "*.ts" -o -name "*.js" | \
  xargs sed -i '' 's/TestData Buddy/QA Workbench/g' 2>/dev/null || true
find src -name "*.ts" -o -name "*.js" | \
  xargs sed -i '' 's/🤖 TD:/🍺 Brew:/g' 2>/dev/null || true

# 2. dataフォルダ
echo "📊 dataフォルダ変換中..."
find data -name "*.ts" -o -name "*.js" -o -name "*.json" | \
  xargs sed -i '' 's/TestData Buddy/QA Workbench/g' 2>/dev/null || true

# 3. testsフォルダ
echo "🧪 testsフォルダ変換中..."
find tests -name "*.ts" -o -name "*.js" | \
  xargs sed -i '' 's/TestData Buddy/QA Workbench/g' 2>/dev/null || true
find tests -name "*.ts" -o -name "*.js" | \
  xargs sed -i '' 's/🤖 TD:/🍺 Brew:/g' 2>/dev/null || true

echo "✅ Phase 4 完了: データ・スクリプトファイル一括変換"

# =============================================================================
# Phase 5: 特殊ファイル・残り修正
# =============================================================================
echo ""
echo "🎯 Phase 5: 特殊ファイル・残り修正開始..."

# 1. ファイル名変更 (td-favicon → brew-favicon など)
echo "📄 ファイル名変更中..."
if [ -d "td-buddy-webapp/frontend/public" ]; then
  cd "td-buddy-webapp/frontend/public"
  
  # faviconファイル名変更
  for file in td-*.svg td-*.png td-*.ico; do
    if [ -f "$file" ]; then
      new_name=$(echo "$file" | sed 's/td-/brew-/g')
      mv "$file" "$new_name" 2>/dev/null || true
      echo "  📄 $file → $new_name"
    fi
  done
  
  cd - > /dev/null
fi

# 2. layout.tsxの favicon 参照修正
echo "🖼️ favicon参照修正中..."
if [ -f "td-buddy-webapp/frontend/app/layout.tsx" ]; then
  sed -i '' 's/td-favicon/brew-favicon/g' "td-buddy-webapp/frontend/app/layout.tsx" 2>/dev/null || true
fi

echo "✅ Phase 5 完了: 特殊ファイル・残り修正"

# =============================================================================
# 最終チェック・レポート生成
# =============================================================================
echo ""
echo "📊 最終チェック・レポート生成中..."

# 残存チェック
echo "🔍 残存TD参照チェック中..."
REMAINING_TD=$(find . -name "*.tsx" -o -name "*.ts" -o -name "*.js" | xargs grep -l "TestData Buddy\|TD\s" 2>/dev/null | wc -l)
REMAINING_EMOJI=$(find . -name "*.tsx" -o -name "*.ts" | xargs grep -l "🤖" 2>/dev/null | wc -l)

echo ""
echo "🎉 QA Workbench + Brew 完全移行完了！"
echo ""
echo "📋 移行サマリー:"
echo "  ✅ TestData Buddy → QA Workbench"
echo "  ✅ TD → Brew"  
echo "  ✅ 🤖 → 🍺"
echo "  ✅ 生成 → 醸造"
echo "  ✅ CSS クラス名統一"
echo "  ✅ 変数名統一"
echo "  ✅ ファイル名変更"
echo ""
echo "📊 残存参照:"
echo "  📄 TD参照: ${REMAINING_TD}件"
echo "  🤖 旧絵文字: ${REMAINING_EMOJI}件"
echo ""
echo "📁 バックアップ: $BACKUP_DIR"
echo ""
echo "🍺 Brewからのメッセージ: 一括移行が完了しました！"
echo "   新しいQA Workbenchとして生まれ変わりました♪"
echo "   何かエラーがあれば、Brewがサポートします！"
echo ""
echo "📋 次のステップ:"
echo "  1. npm run dev でアプリケーション起動テスト"
echo "  2. npm run lint でコード品質チェック"
echo "  3. npm run test でテスト実行"
echo ""

# 実行権限設定
chmod +x "$0"

echo "🎯 移行スクリプト実行完了！" 