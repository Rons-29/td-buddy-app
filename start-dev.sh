#!/bin/bash

# 🍺 QA Workbench + Brew 開発サーバー起動スクリプト
# フロントエンド（Next.js）とバックエンド（Express）を同時起動

echo "🍺 Brew: QA Workbench開発環境を起動します..."
echo ""

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

print_error() {
    echo -e "\033[1;31m❌ $1\033[0m"
}

# 依存関係チェック
print_info "依存関係をチェック中..."

if ! command -v node &> /dev/null; then
    print_error "Node.jsがインストールされていません"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npmがインストールされていません"
    exit 1
fi

print_status "Node.js $(node --version) 検出"
print_status "npm $(npm --version) 検出"

# ディレクトリ存在チェック
if [ ! -d "td-buddy-webapp/backend" ]; then
    print_error "バックエンドディレクトリが見つかりません: td-buddy-webapp/backend"
    exit 1
fi

if [ ! -d "td-buddy-webapp/frontend" ]; then
    print_error "フロントエンドディレクトリが見つかりません: td-buddy-webapp/frontend"
    exit 1
fi

# ポート使用状況チェック
print_info "ポート使用状況をチェック中..."

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    print_warning "ポート3000が使用中です（フロントエンド用）"
    read -p "続行しますか？ (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    print_warning "ポート3001が使用中です（バックエンド用）"
    read -p "続行しますか？ (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 環境変数チェック
print_info "環境変数をチェック中..."

if [ ! -f "td-buddy-webapp/backend/.env" ]; then
    print_warning ".envファイルが見つかりません"
    if [ -f "td-buddy-webapp/backend/.env.example" ]; then
        print_info ".env.exampleから.envを作成します"
        cp td-buddy-webapp/backend/.env.example td-buddy-webapp/backend/.env
        print_status ".envファイルを作成しました"
    fi
fi

# データベース初期化チェック
print_info "データベースをチェック中..."

if [ ! -f "td-buddy-webapp/backend/data/td-buddy.db" ]; then
    print_info "データベースを初期化します..."
    cd td-buddy-webapp/backend
    npm run db:setup
    cd ../..
    print_status "データベース初期化完了"
fi

# 開発サーバー起動
print_info "開発サーバーを起動中..."
echo ""
echo "🍺 Brew: 以下のサーバーが起動します："
echo "  📱 フロントエンド: http://localhost:3000"
echo "  🔧 バックエンド:   http://localhost:3001"
echo "  📊 ヘルスチェック: http://localhost:3001/health"
echo ""

# バックエンドを背景で起動
print_status "バックエンドサーバーを起動中..."
cd td-buddy-webapp/backend
npm run dev &
BACKEND_PID=$!
cd ../..

# 少し待ってからフロントエンドを起動
sleep 3

print_status "フロントエンドサーバーを起動中..."
cd td-buddy-webapp/frontend
npm run dev &
FRONTEND_PID=$!
cd ../..

# プロセスIDを保存
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

print_status "開発サーバーが起動しました！"
echo ""
echo "🍺 Brew: 開発環境の準備が完了しました！"
echo "   ブラウザで http://localhost:3000 にアクセスしてください"
echo ""
echo "📝 便利なコマンド:"
echo "   npm run dev:backend-only  - バックエンドのみ起動"
echo "   npm run dev:frontend-only - フロントエンドのみ起動"
echo "   npm run db:reset          - データベースリセット"
echo "   npm run lint              - コード品質チェック"
echo ""
echo "🛑 停止するには Ctrl+C を押してください"

# シグナルハンドリング
cleanup() {
    echo ""
    print_info "開発サーバーを停止中..."
    
    if [ -f .backend.pid ]; then
        BACKEND_PID=$(cat .backend.pid)
        kill $BACKEND_PID 2>/dev/null
        rm .backend.pid
    fi
    
    if [ -f .frontend.pid ]; then
        FRONTEND_PID=$(cat .frontend.pid)
        kill $FRONTEND_PID 2>/dev/null
        rm .frontend.pid
    fi
    
    # 関連プロセスも終了
    pkill -f "npm run dev" 2>/dev/null
    pkill -f "next dev" 2>/dev/null
    pkill -f "nodemon" 2>/dev/null
    
    print_status "開発サーバーを停止しました"
    echo "🍺 Brew: お疲れさまでした！また一緒に開発しましょう♪"
    exit 0
}

trap cleanup SIGINT SIGTERM

# プロセスが終了するまで待機
wait 