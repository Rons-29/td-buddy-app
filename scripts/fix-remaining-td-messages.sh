#!/bin/bash

# 🍺 QA Workbench + Brew: 残存するTDメッセージの最終修正スクリプト
# 実行日: $(date)

echo "🍺 Brewからのメッセージ: 残存するTDメッセージを修正します..."

# バックアップディレクトリ作成
BACKUP_DIR="backup-final-message-fix-$(date +%Y%m%d-%H%M%S)"
echo "📁 バックアップ作成中: $BACKUP_DIR"
cp -r td-buddy-webapp "$BACKUP_DIR"

cd td-buddy-webapp

echo "🔄 Phase 1: バックエンドのtdMessage → brewMessage変換"

# バックエンドファイルでtdMessageをbrewMessageに変換
find backend/src -name "*.ts" -type f -exec sed -i '' 's/tdMessage:/brewMessage:/g' {} \;
find backend/src -name "*.ts" -type f -exec sed -i '' 's/tdMessage =/brewMessage =/g' {} \;
find backend/src -name "*.ts" -type f -exec sed -i '' 's/tdMessage=/brewMessage=/g' {} \;
find backend/src -name "*.ts" -type f -exec sed -i '' 's/let tdMessage/let brewMessage/g' {} \;
find backend/src -name "*.ts" -type f -exec sed -i '' 's/const tdMessage/const brewMessage/g' {} \;

echo "🔄 Phase 2: メソッド名・変数名の変換"

# メソッド名の変換
find backend/src -name "*.ts" -type f -exec sed -i '' 's/generateTDMessage/generateBrewMessage/g' {} \;
find backend/src -name "*.ts" -type f -exec sed -i '' 's/getTDMessage/getBrewMessage/g' {} \;

echo "🔄 Phase 3: TDからのメッセージ内容をBrewに変換"

# メッセージ内容の変換
find backend/src -name "*.ts" -type f -exec sed -i '' 's/TDからのお知らせ:/Brewからのお知らせ:/g' {} \;
find backend/src -name "*.ts" -type f -exec sed -i '' 's/TDがサポート/Brewがサポート/g' {} \;
find backend/src -name "*.ts" -type f -exec sed -i '' 's/TDが一緒に解決/Brewが一緒に解決/g' {} \;
find backend/src -name "*.ts" -type f -exec sed -i '' 's/TDが検証/Brewが検証/g' {} \;
find backend/src -name "*.ts" -type f -exec sed -i '' 's/TDの検証機能/Brewの検証機能/g' {} \;
find backend/src -name "*.ts" -type f -exec sed -i '' 's/TDが生成履歴/Brewが生成履歴/g' {} \;
find backend/src -name "*.ts" -type f -exec sed -i '' 's/TDの履歴管理機能/Brewの履歴管理機能/g' {} \;
find backend/src -name "*.ts" -type f -exec sed -i '' 's/TDの統計機能/Brewの統計機能/g' {} \;
find backend/src -name "*.ts" -type f -exec sed -i '' 's/TDおすすめ/Brewおすすめ/g' {} \;
find backend/src -name "*.ts" -type f -exec sed -i '' 's/TDお勧め/Brewお勧め/g' {} \;
find backend/src -name "*.ts" -type f -exec sed -i '' 's/TDのプリセット機能/Brewのプリセット機能/g' {} \;

echo "🔄 Phase 4: UUID関連の古い絵文字とメッセージ修正"

# UUIDルートの古い絵文字を修正
find backend/src -name "*.ts" -type f -exec sed -i '' 's/🤖 TD:/🍺 Brew:/g' {} \;

echo "🔄 Phase 5: フロントエンドの関連ファイル修正"

# フロントエンドのTDMessage関連
find frontend -name "*.ts" -type f -exec sed -i '' 's/TDMessage/BrewMessage/g' {} \;
find frontend -name "*.tsx" -type f -exec sed -i '' 's/TDMessage/BrewMessage/g' {} \;
find frontend -name "*.ts" -type f -exec sed -i '' 's/announceTDMessage/announceBrewMessage/g' {} \;

echo "🔄 Phase 6: 型定義ファイルの修正"

# 型定義ファイルを修正
find backend/src/types -name "*.ts" -type f -exec sed -i '' 's/tdMessage:/brewMessage:/g' {} \;

echo "🔄 Phase 7: サービスファイルのメソッド名統一"

# サービスファイルのprivateメソッド名も統一
find backend/src/services -name "*.ts" -type f -exec sed -i '' 's/private generateTDMessage/private generateBrewMessage/g' {} \;
find backend/src/services -name "*.ts" -type f -exec sed -i '' 's/private getTDMessage/private getBrewMessage/g' {} \;

echo "✅ 修正完了！"

echo "📊 変更結果の確認:"
echo "🔍 brewMessage使用箇所:"
find backend/src -name "*.ts" -type f -exec grep -l "brewMessage" {} \; | wc -l
echo "🔍 残存するtdMessage箇所:"
find backend/src -name "*.ts" -type f -exec grep -l "tdMessage" {} \; | wc -l

echo ""
echo "🍺 Brewからのメッセージ: TDメッセージの修正が完了しました！"
echo "📁 バックアップ: $BACKUP_DIR"
echo "🎯 次は動作確認を行いましょう♪"

cd .. 