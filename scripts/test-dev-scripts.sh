#!/bin/bash

# 🍺 QA Workbench + Brew 開発スクリプトテスト

echo "🍺 Brew: 開発スクリプトの動作確認を開始します..."

# 色付きメッセージ用の関数
print_status() {
    echo -e "\033[1;32m✅ $1\033[0m"
}

print_info() {
    echo -e "\033[1;34mℹ️  $1\033[0m"
}

print_error() {
    echo -e "\033[1;31m❌ $1\033[0m"
}

# 1. package.jsonの存在確認
print_info "package.jsonの確認中..."
if [ -f "package.json" ]; then
    print_status "package.json 存在確認"
else
    print_error "package.json が見つかりません"
    exit 1
fi

# 2. スクリプトの存在確認
print_info "npmスクリプトの確認中..."
if npm run | grep -q "dev"; then
    print_status "dev スクリプト 存在確認"
else
    print_error "dev スクリプトが見つかりません"
    exit 1
fi

# 3. ディレクトリ構造確認
print_info "プロジェクト構造の確認中..."
if [ -d "td-buddy-webapp/backend" ] && [ -d "td-buddy-webapp/frontend" ]; then
    print_status "プロジェクト構造 確認完了"
else
    print_error "必要なディレクトリが見つかりません"
    exit 1
fi

# 4. 依存関係確認
print_info "依存関係の確認中..."
if [ -f "td-buddy-webapp/backend/package.json" ] && [ -f "td-buddy-webapp/frontend/package.json" ]; then
    print_status "依存関係設定 確認完了"
else
    print_error "package.jsonファイルが不足しています"
    exit 1
fi

# 5. 実行権限確認
print_info "スクリプト実行権限の確認中..."
if [ -x "start-dev.sh" ] && [ -x "stop-dev.sh" ]; then
    print_status "スクリプト実行権限 確認完了"
else
    print_error "スクリプトに実行権限がありません"
    exit 1
fi

print_status "すべてのテストが完了しました！"
echo ""
echo "🍺 Brew: 開発環境の準備が整いました！"
echo ""
echo "📝 利用可能なコマンド:"
echo "   npm run dev                 # フロントエンド + バックエンド同時起動"
echo "   npm run dev:backend-only    # バックエンドのみ起動"
echo "   npm run dev:frontend-only   # フロントエンドのみ起動"
echo "   ./start-dev.sh              # 詳細チェック付きで起動"
echo "   ./stop-dev.sh               # 開発サーバー停止"
echo ""
echo "🚀 開発を開始するには: npm run dev" 