# 🤖 TestData Buddy VSCode拡張機能 開発環境セットアップガイド

**🤖 TDからのご案内：**
*「VSCode拡張機能として生まれ変わったTDの開発環境を準備しましょう！」*

## 必要なツール・バージョン

### 必須ツール
- **Node.js**: v18.17.0 以上 (推奨: v20.x LTS)
- **npm**: v9.0.0 以上 (Node.js付属、pnpmではなくnpm使用)
- **Git**: v2.30.0 以上
- **VSCode**: v1.80.0 以上
- **VSCode Extension CLI**: `npm install -g @vscode/vsce`

### 推奨ツール
- **SQLite Browser**: データベース確認用
- **Extension Development Host**: VSCodeのF5でテスト環境起動

## セットアップ手順

### 1. Node.js インストール
```bash
# nvm使用の場合
nvm install 20
nvm use 20

# 直接インストールの場合
# https://nodejs.org/ からダウンロード

# バージョン確認
node --version  # v20.x.x
npm --version   # 9.x.x
```

### 2. VSCode拡張機能開発ツールのインストール
```bash
# VSCE (VSCode Extension Manager)
npm install -g @vscode/vsce

# Yeoman Generator（拡張機能テンプレート用）
npm install -g yo generator-code
```

### 3. プロジェクト初期化
```bash
# プロジェクトディレクトリ作成
mkdir td-buddy-app
cd td-buddy-app

# Git初期化
git init

# VSCode拡張機能のpackage.json作成
# （または既存のpackage.jsonを拡張機能用に修正）
```

### 4. 依存関係インストール
```bash
# 拡張機能の依存関係をインストール
npm install

# 開発依存関係
npm install --save-dev @types/vscode typescript webpack webpack-cli

# 実行時依存関係
npm install better-sqlite3 @anthropic-ai/sdk
```

### 5. 環境変数設定
```bash
# VSCode拡張機能では環境変数ではなく設定を使用
# settings.jsonに設定を追加

# .env.exampleをコピー（開発時のみ使用）
cp .env.example .env

# Claude APIキーを設定
# CLAUDE_API_KEY=your_claude_api_key_here
```

### 6. TypeScript設定
```bash
# tsconfig.json作成
npx tsc --init

# 拡張機能用の設定に変更
# （エディタで手動編集が必要）
```

### 7. 開発環境起動
```bash
# TypeScriptコンパイル
npm run compile

# またはウォッチモード
npm run watch

# F5キーでExtension Development Hostを起動してテスト
```

## VSCode拡張機能開発フロー

### 日常的な開発手順
1. `git pull origin main` - 最新コード取得
2. `npm install` - 依存関係更新
3. `npm run watch` - TypeScriptウォッチモード起動
4. 開発作業（src/配下のファイルを編集）
5. **F5キー** - Extension Development Hostでテスト
6. `npm run test` - テスト実行
7. `npm run lint` - コード品質チェック
8. `git add . && git commit -m "feat: 機能説明"`
9. `git push origin feature/branch-name`

### VSCode拡張機能のテスト手順
```bash
# 1. ウォッチモードでコンパイル開始
npm run watch

# 2. VSCodeで F5 キーを押す
# → Extension Development Host が起動

# 3. 新しいVSCodeウィンドウで拡張機能をテスト
# Ctrl+Shift+P → "TestData Buddy" と入力して機能確認

# 4. デバッグコンソールでログ確認
# 元のVSCodeウィンドウの「デバッグコンソール」タブ
```

### package.json スクリプト例
```json
{
  "scripts": {
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./",
    "package": "vsce package",
    "publish": "vsce publish",
    "test": "npm run compile && node ./out/test/runTest.js",
    "lint": "eslint src --ext ts"
  }
}
```

### TDのデバッグ表示
```typescript
// src/extension.ts でのデバッグ例
console.log('🤖 TDが起動しました！');

// ユーザーへの通知
vscode.window.showInformationMessage(
  '🤖 TestData Buddy (TD) が準備できました！'
);
```

### トラブルシューティング

#### 拡張機能が起動しない
```bash
# 1. コンパイルエラーの確認
npm run compile

# 2. out/ディレクトリが生成されているか確認
ls -la out/

# 3. package.jsonのmainパスを確認
"main": "./out/extension.js"
```

#### ネイティブモジュール（better-sqlite3）の問題
```bash
# ネイティブモジュールの再構築
npm rebuild better-sqlite3

# VSCode用にプリビルドされたバイナリ使用
npm install better-sqlite3 --build-from-source=false
```

#### Claude API接続エラー
```bash
# APIキーの確認
echo $CLAUDE_API_KEY

# 設定ファイルの確認
# VSCode: Ctrl+, → "testdata buddy" で検索
```

**🤖 TDからのアドバイス：**
*「困ったときは、まず`npm run compile`でエラーがないか確認してくださいね！」* 