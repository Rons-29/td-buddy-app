#!/bin/bash

# 🚀 TD Buddy Netlify商用クイックセットアップスクリプト
# 使用方法: ./scripts/netlify-quick-setup.sh

set -e

echo "🤖 TDがNetlify商用セットアップを開始します..."

# 色付きメッセージ用の関数
print_success() {
    echo -e "\033[32m✅ $1\033[0m"
}

print_info() {
    echo -e "\033[34m📋 $1\033[0m"
}

print_warning() {
    echo -e "\033[33m⚠️  $1\033[0m"
}

print_error() {
    echo -e "\033[31m❌ $1\033[0m"
}

# 前提条件チェック
print_info "前提条件をチェック中..."

# Node.js バージョンチェック
if ! command -v node &> /dev/null; then
    print_error "Node.jsがインストールされていません"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js v18以上が必要です（現在: $(node --version)）"
    exit 1
fi
print_success "Node.js $(node --version) - OK"

# Git確認
if ! command -v git &> /dev/null; then
    print_error "Gitがインストールされていません"
    exit 1
fi
print_success "Git $(git --version | cut -d' ' -f3) - OK"

# プロジェクトディレクトリ確認
if [ ! -f "package.json" ]; then
    print_error "package.jsonが見つかりません。プロジェクトルートで実行してください"
    exit 1
fi
print_success "プロジェクトディレクトリ確認完了"

# Netlify CLI インストール・確認
print_info "Netlify CLIを確認中..."
if ! command -v netlify &> /dev/null; then
    print_info "Netlify CLIをインストール中..."
    npm install -g netlify-cli
    print_success "Netlify CLIインストール完了"
else
    print_success "Netlify CLI $(netlify --version) - 既にインストール済み"
fi

# ユーザー確認
echo ""
print_info "セットアップを開始します"
echo "このスクリプトは以下を実行します："
echo "  1. 商用ブランチの作成"
echo "  2. 必要ファイルの確認"
echo "  3. 環境変数の生成"
echo "  4. Netlifyプロジェクトの初期化（対話式）"
echo ""

read -p "続行しますか？ (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "セットアップをキャンセルしました"
    exit 0
fi

# 1. Git ブランチ作成
print_info "Step 1: 商用デプロイ用ブランチを作成中..."

if git rev-parse --verify feature/commercial-deployment &> /dev/null; then
    print_warning "ブランチ feature/commercial-deployment は既に存在します"
    git checkout feature/commercial-deployment
else
    git checkout -b feature/commercial-deployment
    print_success "ブランチ feature/commercial-deployment を作成しました"
fi

# 2. 必要ファイルの確認
print_info "Step 2: 商用設定ファイルを確認中..."

# netlify.toml が存在するか確認
if [ ! -f "netlify.toml" ]; then
    print_error "netlify.toml が見つかりません"
    print_info "commercial-cost-optimization-plan.mdの手順に従ってファイルを作成してください"
    exit 1
fi
print_success "netlify.toml - 存在確認"

# package.json のビルドスクリプト確認
if ! grep -q '"build"' package.json; then
    print_warning "package.jsonにbuildスクリプトが見つかりません"
    print_info "buildコマンドを手動で設定する必要があります"
else
    print_success "package.json build script - 確認"
fi

# 3. セキュリティキー生成
print_info "Step 3: セキュリティキーを生成中..."

JWT_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)

# セキュリティキーをファイルに保存（.gitignoreされる）
cat > .env.commercial.keys << EOF
# 🔐 商用環境用セキュリティキー
# このファイルは安全に保管してください（Gitには含まれません）

JWT_SECRET=${JWT_SECRET}
ENCRYPTION_KEY=${ENCRYPTION_KEY}

# 生成日時: $(date)
# TDからのメッセージ: 安全に保管してくださいね！
EOF

print_success "セキュリティキーを生成しました (.env.commercial.keys)"

# .gitignore に追加
if ! grep -q ".env.commercial.keys" .gitignore 2>/dev/null; then
    echo "" >> .gitignore
    echo "# TD Buddy 商用キー" >> .gitignore
    echo ".env.commercial.keys" >> .gitignore
    print_success ".gitignoreにセキュリティキーファイルを追加しました"
fi

# 4. Netlify ログイン確認
print_info "Step 4: Netlifyログイン状況を確認中..."

if netlify status &> /dev/null; then
    CURRENT_USER=$(netlify status | grep "Current user" | cut -d':' -f2 | xargs)
    print_success "Netlifyにログイン済み - ユーザー: $CURRENT_USER"
else
    print_info "Netlifyにログインしてください..."
    netlify login
    
    if netlify status &> /dev/null; then
        print_success "Netlifyログイン完了"
    else
        print_error "Netlifyログインに失敗しました"
        exit 1
    fi
fi

# 5. Netlify プロジェクト初期化
print_info "Step 5: Netlifyプロジェクトを初期化します..."

echo ""
print_warning "次の対話式設定で以下を選択してください："
echo "  - Site name: td-buddy-commercial (または任意の名前)"
echo "  - Build command: npm run build"
echo "  - Publish directory: out (Next.jsの場合)"
echo ""

read -p "Netlifyプロジェクト初期化を開始しますか？ (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    netlify init
    
    if [ $? -eq 0 ]; then
        print_success "Netlifyプロジェクト初期化完了"
    else
        print_error "Netlifyプロジェクト初期化に失敗しました"
        exit 1
    fi
else
    print_info "Netlifyプロジェクト初期化をスキップしました"
    print_warning "後で手動で 'netlify init' を実行してください"
fi

# 6. 基本環境変数設定
print_info "Step 6: 基本環境変数を設定中..."

if netlify status &> /dev/null && netlify env:list &> /dev/null; then
    print_info "基本的な環境変数を設定します..."
    
    # 基本設定
    netlify env:set NODE_ENV "production" --silent || true
    netlify env:set COMMERCIAL_MODE "true" --silent || true
    
    # セキュリティキー設定
    netlify env:set JWT_SECRET "$JWT_SECRET" --silent || true
    netlify env:set ENCRYPTION_KEY "$ENCRYPTION_KEY" --silent || true
    
    # プレースホルダー設定
    netlify env:set NEXT_PUBLIC_SUPABASE_URL "placeholder_supabase_url" --silent || true
    netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "placeholder_anon_key" --silent || true
    netlify env:set SUPABASE_SERVICE_ROLE_KEY "placeholder_service_key" --silent || true
    netlify env:set CLAUDE_API_KEY "placeholder_claude_key" --silent || true
    
    print_success "基本環境変数設定完了"
    
    # 設定済み環境変数一覧表示
    print_info "設定済み環境変数:"
    netlify env:list | grep -E "(NODE_ENV|COMMERCIAL_MODE|JWT_SECRET|ENCRYPTION_KEY)" || true
else
    print_warning "Netlifyプロジェクトが設定されていないため、環境変数設定をスキップしました"
    print_info "後で手動で環境変数を設定してください"
fi

# 7. 変更をコミット
print_info "Step 7: 変更をコミット中..."

git add .
git commit -m "feat: Netlify商用セットアップ完了

- 商用デプロイ用ブランチ作成
- セキュリティキー生成
- 基本環境変数設定
- .gitignore更新

TDからのメッセージ: 商用セットアップの基盤完成！"

print_success "変更をコミットしました"

# 8. 次のステップ案内
echo ""
print_success "🎉 Netlify商用セットアップ（基礎）が完了しました！"
echo ""
print_info "次のステップ:"
echo "  1. Supabaseアカウント作成・設定"
echo "  2. Claude APIキー取得"
echo "  3. 実際の環境変数値に更新"
echo "  4. テストデプロイ実行"
echo ""

# 生成されたファイル一覧
print_info "生成されたファイル:"
echo "  📄 .env.commercial.keys - セキュリティキー（安全に保管）"
echo "  📄 .gitignore - 更新済み"
echo ""

# 次週の準備
print_info "今週中に実行する追加作業:"
echo "  📋 docs/netlify-commercial-setup-guide.md を参照"
echo "  🌐 https://app.netlify.com でダッシュボード確認"
echo "  🔧 environment variables の設定完了"
echo ""

print_info "詳細ガイド: docs/netlify-commercial-setup-guide.md"
print_info "トラブルシューティング: docs/commercial-deployment-guide.md"

echo ""
print_success "🤖 TDからのメッセージ: セットアップお疲れさまでした！"
print_success "   次はSupabaseの設定に進みましょう。一緒に頑張りますよ♪"

# セキュリティリマインダー
echo ""
print_warning "🔐 セキュリティリマインダー:"
echo "   .env.commercial.keys ファイルを安全に保管してください"
echo "   このファイルには重要なセキュリティキーが含まれています"

exit 0 