#!/bin/bash

# 🤖 TD開発サーバー起動スクリプト（プロジェクトルート用）
echo "🤖 TDです！プロジェクトルートから開発サーバーを起動します！"
echo ""

# 現在のディレクトリを表示
echo "📍 現在の場所: $(pwd)"

# td-buddy-webappディレクトリの存在確認
if [ ! -d "td-buddy-webapp" ]; then
    echo "❌ td-buddy-webappディレクトリが見つかりません"
    echo "   プロジェクトルートで実行してください"
    exit 1
fi

echo "✅ td-buddy-webappディレクトリを確認しました"
echo ""
echo "🚀 Webアプリケーション用の開発サーバーを起動します..."
echo "📂 td-buddy-webappディレクトリに移動中..."
echo ""

# td-buddy-webappディレクトリに移動してstart-dev.shを実行
cd td-buddy-webapp

# start-dev.shの実行権限確認
if [ ! -x "./start-dev.sh" ]; then
    echo "🔧 start-dev.shに実行権限を付与しています..."
    chmod +x ./start-dev.sh
fi

# start-dev.shを実行
echo "🎯 Webアプリ用のstart-dev.shを実行します..."
./start-dev.sh 