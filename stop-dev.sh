#!/bin/bash

# 🍺 QA Workbench + Brew 開発サーバー停止スクリプト

echo "🍺 Brew: 開発サーバーを停止します..."

# 色付きメッセージ用の関数
print_status() {
    echo -e "\033[1;32m✅ $1\033[0m"
}

print_info() {
    echo -e "\033[1;34mℹ️  $1\033[0m"
}

print_warning() {
    echo -e "\033[1;33m⚠️  $1\033[0m"
}

# PIDファイルから停止
if [ -f .backend.pid ]; then
    BACKEND_PID=$(cat .backend.pid)
    print_info "バックエンドサーバー (PID: $BACKEND_PID) を停止中..."
    kill $BACKEND_PID 2>/dev/null
    rm .backend.pid
    print_status "バックエンドサーバーを停止しました"
else
    print_warning "バックエンドのPIDファイルが見つかりません"
fi

if [ -f .frontend.pid ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    print_info "フロントエンドサーバー (PID: $FRONTEND_PID) を停止中..."
    kill $FRONTEND_PID 2>/dev/null
    rm .frontend.pid
    print_status "フロントエンドサーバーを停止しました"
else
    print_warning "フロントエンドのPIDファイルが見つかりません"
fi

# 関連プロセスを強制終了
print_info "関連プロセスをクリーンアップ中..."

# Node.jsプロセスを検索して終了
pkill -f "npm run dev" 2>/dev/null
pkill -f "next dev" 2>/dev/null
pkill -f "nodemon" 2>/dev/null
pkill -f "td-buddy" 2>/dev/null

# ポート使用状況を確認
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    print_warning "ポート3000がまだ使用中です"
    PORT_3000_PID=$(lsof -Pi :3000 -sTCP:LISTEN -t)
    print_info "PID $PORT_3000_PID を終了します"
    kill -9 $PORT_3000_PID 2>/dev/null
fi

if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    print_warning "ポート3001がまだ使用中です"
    PORT_3001_PID=$(lsof -Pi :3001 -sTCP:LISTEN -t)
    print_info "PID $PORT_3001_PID を終了します"
    kill -9 $PORT_3001_PID 2>/dev/null
fi

print_status "すべての開発サーバーを停止しました"
echo "🍺 Brew: クリーンアップが完了しました！お疲れさまでした♪" 