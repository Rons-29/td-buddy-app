@echo off
chcp 65001 >nul

REM ==================================================
REM TD Buddy 開発サーバー一発起動スクリプト (Windows) 🚀
REM ==================================================

echo 🤖 TDです！開発サーバーを起動します！
echo.

REM カレントディレクトリの確認
if not exist "package.json" (
    echo ❌ package.jsonが見つかりません
    echo 💡 td-buddy-webapp ディレクトリで実行してください
    echo.
    echo 📁 正しい場所に移動しましょう：
    echo    cd td-buddy-webapp
    echo    start-dev.bat
    pause
    exit /b 1
)

echo 📍 現在の場所: %CD%
echo 📦 package.json を確認しました ✅
echo.

REM Node.jsのバージョン確認
echo 🔍 Node.js バージョン確認...
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.jsがインストールされていません
    echo 💡 https://nodejs.org からインストールしてください
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%a in ('node --version') do set NODE_VERSION=%%a
    echo    Node.js: %NODE_VERSION% ✅
)

REM npmのバージョン確認
where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ npmが見つかりません
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%a in ('npm --version') do set NPM_VERSION=%%a
    echo    npm: v%NPM_VERSION% ✅
)

echo.

REM ポート使用状況をチェック
echo 🌐 ポート使用状況をチェック...

REM ポート3000をチェック
netstat -an | findstr ":3000 " | findstr "LISTENING" >nul
if %ERRORLEVEL% equ 0 (
    echo ⚠️  ポート3000が既に使用されています
    echo 💡 フロントエンドが既に起動中の可能性があります
) else (
    echo    ポート3000: 利用可能 ✅
)

REM ポート3001をチェック
netstat -an | findstr ":3001 " | findstr "LISTENING" >nul
if %ERRORLEVEL% equ 0 (
    echo ⚠️  ポート3001が既に使用されています
    echo 💡 バックエンドが既に起動中の可能性があります
) else (
    echo    ポート3001: 利用可能 ✅
)

echo.

REM 依存関係のインストール確認
echo 📦 依存関係を確認...
if not exist "node_modules" (
    echo 📥 依存関係をインストール中...
    npm install
    if %ERRORLEVEL% neq 0 (
        echo ❌ 依存関係のインストールに失敗しました
        pause
        exit /b 1
    )
    echo    依存関係インストール完了 ✅
) else (
    echo    node_modules 確認済み ✅
)

echo.

REM サブプロジェクトの依存関係確認
echo 🔍 サブプロジェクトの依存関係確認...

REM バックエンド
if not exist "backend\node_modules" (
    echo 📥 バックエンドの依存関係をインストール中...
    cd backend
    npm install
    if %ERRORLEVEL% neq 0 (
        echo ❌ バックエンドの依存関係インストールに失敗
        cd ..
        pause
        exit /b 1
    )
    cd ..
)

REM フロントエンド
if not exist "frontend\node_modules" (
    echo 📥 フロントエンドの依存関係をインストール中...
    cd frontend
    npm install
    if %ERRORLEVEL% neq 0 (
        echo ❌ フロントエンドの依存関係インストールに失敗
        cd ..
        pause
        exit /b 1
    )
    cd ..
)

echo    サブプロジェクト依存関係 確認済み ✅
echo.

REM 開発サーバー起動
echo 🚀 開発サーバーを起動します...
echo.
echo 📱 フロントエンド: http://localhost:3000
echo 🔧 バックエンド: http://localhost:3001
echo.
echo 💡 停止するには Ctrl+C を押してください
echo.
echo 🤖 TDからのメッセージ: 素晴らしい開発をお楽しみください！
echo ==========================================
echo.

REM concurrentlyで両方起動
npm run dev 