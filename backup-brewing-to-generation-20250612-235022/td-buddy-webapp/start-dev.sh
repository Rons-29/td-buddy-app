#!/bin/bash

# ==================================================
# TD Buddy 開発サーバー一発起動スクリプト 🚀
# ==================================================

echo "🤖 TDです！開発サーバーを起動します！"
echo ""

# カレントディレクトリの確認
if [ ! -f "package.json" ]; then
    echo "❌ package.jsonが見つかりません"
    echo "💡 td-buddy-webapp ディレクトリで実行してください"
    echo ""
    echo "📁 正しい場所に移動しましょう："
    echo "   cd td-buddy-webapp"
    echo "   ./start-dev.sh"
    exit 1
fi

echo "📍 現在の場所: $(pwd)"
echo "📦 package.json を確認しました ✅"
echo ""

# Node.jsのバージョン確認
echo "🔍 Node.js バージョン確認..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "   Node.js: $NODE_VERSION ✅"
else
    echo "❌ Node.jsがインストールされていません"
    echo "💡 https://nodejs.org からインストールしてください"
    exit 1
fi

# npmのバージョン確認
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "   npm: v$NPM_VERSION ✅"
else
    echo "❌ npmが見つかりません"
    exit 1
fi

echo ""

# ポート使用状況をチェック
echo "🌐 ポート使用状況をチェック..."

# ポート3000をチェック
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  ポート3000が既に使用されています"
    echo "💡 フロントエンドが既に起動中の可能性があります"
else
    echo "   ポート3000: 利用可能 ✅"
fi

# ポート3001をチェック
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  ポート3001が既に使用されています" 
    echo "💡 バックエンドが既に起動中の可能性があります"
else
    echo "   ポート3001: 利用可能 ✅"
fi

echo ""

# 依存関係のインストール確認
echo "📦 依存関係を確認..."
if [ ! -d "node_modules" ]; then
    echo "📥 依存関係をインストール中..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依存関係のインストールに失敗しました"
        exit 1
    fi
    echo "   依存関係インストール完了 ✅"
else
    echo "   node_modules 確認済み ✅"
fi

echo ""

# フロントエンドとバックエンドの依存関係も確認
echo "🔍 サブプロジェクトの依存関係確認..."

# バックエンド
if [ ! -d "backend/node_modules" ]; then
    echo "📥 バックエンドの依存関係をインストール中..."
    cd backend && npm install && cd ..
    if [ $? -ne 0 ]; then
        echo "❌ バックエンドの依存関係インストールに失敗"
        exit 1
    fi
fi

# フロントエンド  
if [ ! -d "frontend/node_modules" ]; then
    echo "📥 フロントエンドの依存関係をインストール中..."
    cd frontend && npm install && cd ..
    if [ $? -ne 0 ]; then
        echo "❌ フロントエンドの依存関係インストールに失敗"
        exit 1
    fi
fi

echo "   サブプロジェクト依存関係 確認済み ✅"
echo ""

# 開発サーバー起動
echo "🚀 開発サーバーを起動します..."
echo ""
echo "📱 フロントエンド: http://localhost:3000"
echo "🔧 バックエンド: http://localhost:3001" 
echo ""
echo "💡 停止するには Ctrl+C を押してください"
echo ""
echo "🤖 TDからのメッセージ: 素晴らしい開発をお楽しみください！"
echo "=========================================="
echo ""

# 使用可能なパッケージマネージャーを検出
if command -v pnpm &> /dev/null; then
    echo "🎯 pnpm を使用して起動します"
    pnpm run dev
elif command -v npm &> /dev/null; then
    echo "🎯 npm を使用して起動します"
    npm run dev
else
    echo "❌ パッケージマネージャーが見つかりません"
    echo "💡 npm または pnpm をインストールしてください"
    exit 1
fi 