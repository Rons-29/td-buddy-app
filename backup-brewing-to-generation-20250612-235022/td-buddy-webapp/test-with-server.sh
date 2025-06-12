#!/bin/bash

# 🤖 TD Buddy - テスト実行スクリプト（サーバー自動起動付き）
# テスト実行前にフロントエンドサーバーを自動起動するスクリプト

set -e

echo "🤖 TDがテスト環境をセットアップします..."

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 既存のプロセスを確認・終了
echo -e "${BLUE}📊 既存プロセスの確認...${NC}"
if lsof -ti :3000 >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  ポート3000が使用中です。プロセスを終了します...${NC}"
    lsof -ti :3000 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

if lsof -ti :3001 >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  ポート3001が使用中です。プロセスを終了します...${NC}"
    lsof -ti :3001 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

echo -e "${GREEN}✅ ポートクリア完了${NC}"

# パッケージマネージャーの検出
if command -v pnpm >/dev/null 2>&1; then
    PM="pnpm"
elif command -v npm >/dev/null 2>&1; then
    PM="npm"
else
    echo -e "${RED}❌ npm または pnpm が見つかりません${NC}"
    exit 1
fi

echo -e "${BLUE}📦 検出されたパッケージマネージャー: ${PM}${NC}"

# サーバー起動関数
start_servers() {
    echo -e "${BLUE}🚀 サーバーを起動中...${NC}"
    
    # バックエンドサーバー起動（非同期）
    echo -e "${BLUE}🔧 バックエンドサーバー起動 (ポート3001)...${NC}"
    cd backend
    $PM run dev > ../backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    
    # フロントエンドサーバー起動（非同期）
    echo -e "${BLUE}🌐 フロントエンドサーバー起動 (ポート3000)...${NC}"
    cd frontend
    $PM run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    cd ..
    
    # サーバー起動待機
    echo -e "${YELLOW}⏳ サーバー起動を待機中...${NC}"
    sleep 10
    
    # サーバー起動確認
    if curl -s http://localhost:3001/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ バックエンドサーバー起動完了 (http://localhost:3001)${NC}"
    else
        echo -e "${YELLOW}⚠️  バックエンドサーバーの起動確認ができませんでした${NC}"
    fi
    
    if curl -s http://localhost:3000 >/dev/null 2>&1; then
        echo -e "${GREEN}✅ フロントエンドサーバー起動完了 (http://localhost:3000)${NC}"
    else
        echo -e "${YELLOW}⚠️  フロントエンドサーバーの起動確認ができませんでした${NC}"
    fi
}

# テスト実行関数
run_tests() {
    echo -e "${BLUE}🧪 テストを実行中...${NC}"
    
    # テストタイプの選択
    if [ "$1" = "unit" ]; then
        echo -e "${BLUE}🔍 ユニットテスト実行${NC}"
        cd frontend && $PM run test:unit
    elif [ "$1" = "integration" ]; then
        echo -e "${BLUE}🔗 統合テスト実行${NC}"
        cd frontend && $PM run test:integration
    elif [ "$1" = "e2e" ]; then
        echo -e "${BLUE}🌐 E2Eテスト実行${NC}"
        cd frontend && $PM run test:e2e
    elif [ "$1" = "all" ]; then
        echo -e "${BLUE}🎯 全テスト実行${NC}"
        cd frontend && $PM run test
    else
        echo -e "${BLUE}🎯 デフォルトテスト実行${NC}"
        cd frontend && $PM run test
    fi
}

# クリーンアップ関数
cleanup() {
    echo -e "${YELLOW}🧹 クリーンアップ中...${NC}"
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    # 残ったプロセスを強制終了
    lsof -ti :3000 | xargs kill -9 2>/dev/null || true
    lsof -ti :3001 | xargs kill -9 2>/dev/null || true
    
    echo -e "${GREEN}✅ クリーンアップ完了${NC}"
}

# Ctrl+C時のクリーンアップ設定
trap cleanup EXIT

# メイン処理
main() {
    echo -e "${GREEN}🤖 TD Buddy テスト実行スクリプト${NC}"
    echo -e "${BLUE}📋 実行モード: ${1:-デフォルト}${NC}"
    echo ""
    
    # サーバー起動
    start_servers
    
    echo ""
    echo -e "${GREEN}🎉 環境準備完了！テストを開始します${NC}"
    echo ""
    
    # テスト実行
    run_tests "$1"
    
    # 結果表示
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ テスト完了！すべて成功しました${NC}"
        echo -e "${BLUE}🌐 フロントエンド: http://localhost:3000${NC}"
        echo -e "${BLUE}🔧 バックエンド: http://localhost:3001${NC}"
        echo ""
        echo -e "${YELLOW}💡 サーバーは起動したままです。テストが終わったらCtrl+Cで終了してください${NC}"
        
        # サーバーを起動したままにする
        echo -e "${BLUE}⏳ サーバー待機中... (Ctrl+Cで終了)${NC}"
        wait
    else
        echo ""
        echo -e "${RED}❌ テストが失敗しました${NC}"
        exit 1
    fi
}

# 使用方法の表示
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "🤖 TD Buddy テスト実行スクリプト"
    echo ""
    echo "使用方法:"
    echo "  $0 [テストタイプ]"
    echo ""
    echo "テストタイプ:"
    echo "  unit        ユニットテストのみ実行"
    echo "  integration 統合テストのみ実行"
    echo "  e2e         E2Eテストのみ実行"
    echo "  all         すべてのテスト実行"
    echo "  (なし)      デフォルトテスト実行"
    echo ""
    echo "例:"
    echo "  $0 unit"
    echo "  $0 integration"
    echo "  $0 e2e"
    echo "  $0 all"
    echo ""
    echo "🤖 TDからのメッセージ: どのテストでも、安全で確実に実行します♪"
    exit 0
fi

# メイン処理実行
main "$1" 