#!/bin/bash

# QA Workbench + Brew ブランディング移行スクリプト
# 使用方法: ./scripts/migrate-to-qa-workbench.sh

set -e

echo "🍺 QA Workbench + ブリュー ブランディング移行を開始します..."

# 作業ディレクトリをプロジェクトルートに設定
cd "$(dirname "$0")/.."

# バックアップディレクトリ作成
BACKUP_DIR="./backup-$(date +%Y%m%d-%H%M%S)"
echo "📁 バックアップを作成中: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# 重要ファイルのバックアップ
cp -r td-buddy-webapp/frontend/app "$BACKUP_DIR/" 2>/dev/null || true
cp -r td-buddy-webapp/frontend/components "$BACKUP_DIR/" 2>/dev/null || true
cp -r td-buddy-webapp/frontend/lib "$BACKUP_DIR/" 2>/dev/null || true
cp package.json "$BACKUP_DIR/" 2>/dev/null || true
cp README.md "$BACKUP_DIR/" 2>/dev/null || true

echo "✅ バックアップ完了"

# 1. 基本的なブランディング変更
echo "🔄 基本ブランディング変更中..."

# TestData Buddy → QA Workbench  
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" -o -name "*.json" | xargs sed -i '' 's/TestData Buddy/QA Workbench/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/testdata-buddy/qa-workbench/g' 2>/dev/null || true

# TD → ブリュー (文脈を考慮)
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/TDからの/ブリューからの/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/TDくん/ブリュー/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/TD Buddy/Brew Assistant/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/Powered by TD/Powered by Brew/g' 2>/dev/null || true

# 2. 絵文字の変更
echo "🍺 絵文字変更中..."
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/🤖/🍺/g' 2>/dev/null || true

# 3. 生成 → 醸造 変更
echo "🔄 生成→醸造変更中..."
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/パスワード生成/パスワード生成/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/データ生成/データ醸造/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/個人情報生成/個人情報醸造/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/生成ツール/醸造ツール/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/生成設定/醸造設定/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/生成個数/醸造個数/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/生成数/醸造数/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/生成結果/醸造結果/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/生成完了/醸造完了/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/生成中/醸造中/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/大量生成/大量醸造/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/高速生成/高速醸造/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/標準生成/標準醸造/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/中規模生成/中規模醸造/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/大規模生成/大規模醸造/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/ローカル生成/ローカル醸造/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/生成フィールド/醸造フィールド/g' 2>/dev/null || true

# 4. その他の調整
echo "🔧 最終調整中..."
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/を生成し/を醸造し/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/を生成します/を醸造します/g' 2>/dev/null || true
find td-buddy-webapp/frontend -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/を生成でき/を醸造でき/g' 2>/dev/null || true

echo "🎉 ブランディング移行完了！"
echo ""
echo "📋 変更サマリー:"
echo "  ✅ TestData Buddy → QA Workbench"
echo "  ✅ TD → ブリュー"  
echo "  ✅ 🤖 → 🍺"
echo "  ✅ 生成 → 醸造"
echo ""
echo "📁 バックアップ: $BACKUP_DIR"
echo "🍺 ブリューからのメッセージ: 一括移行が完了しました！お疲れさまでした♪" 