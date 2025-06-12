#!/bin/bash

# 🍺 QA Workbench + Brew 移行実行スクリプト

echo "🍺 QA Workbench + Brew 移行スクリプトを実行します"
echo ""

# 現在のディレクトリを表示
echo "📁 現在のディレクトリ: $(pwd)"
echo ""

# 確認メッセージ
echo "⚠️  注意: この操作により、プロジェクト全体のファイルが変更されます"
echo "   自動バックアップが作成されますが、事前に手動でバックアップを取ることを推奨します"
echo ""

read -p "🤔 続行しますか？ (y/N): " confirm

if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
    echo ""
    echo "🚀 移行を開始します..."
    echo ""
    
    # スクリプトに実行権限を付与
    chmod +x scripts/complete-qa-workbench-migration.sh
    
    # メイン移行スクリプトを実行
    ./scripts/complete-qa-workbench-migration.sh
    
    echo ""
    echo "🎉 移行スクリプトの実行が完了しました！"
    echo ""
    echo "📋 次に実行することをお勧めします："
    echo "  1. cd td-buddy-webapp && npm run dev でアプリ起動テスト"
    echo "  2. Git で変更を確認"
    echo "  3. 必要に応じて微調整"
    echo ""
else
    echo ""
    echo "❌ 移行をキャンセルしました"
    echo "🍺 Brewからのメッセージ: いつでも準備ができたら声をかけてくださいね♪"
fi 