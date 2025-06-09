# TestData Buddy VSCode/Cursor拡張機能 パッケージ化・配布計画

VSCode/Cursor拡張機能として配布するTestData Buddyのパッケージ化と配布戦略です。

## 配布形態

### 1. VSCode Marketplace（推奨）
- **対象**: 一般ユーザー（開発者・QAエンジニア）
- **利点**: 自動インストール、自動更新、信頼性
- **配布**: Microsoft VSCode Marketplace

### 2. Open VSX Registry
- **対象**: VSCode互換エディタユーザー（Cursor、Code-OSS等）
- **利点**: オープンソースエディタ対応
- **配布**: Open VSX Registry

### 3. VSIX ファイル
- **対象**: 企業内配布、プライベート環境
- **利点**: 直接インストール可能、ネットワーク分離環境対応
- **配布**: GitHub Releases、内部サーバー

### 4. ソースコード
- **対象**: 開発者・カスタマイズ希望者
- **利点**: 完全なカスタマイズ可能
- **配布**: GitHub Repository

## VSCode拡張機能パッケージング

### プロジェクト構成
```
td-buddy-app/
├── src/                        # TypeScript ソースコード
├── out/                        # コンパイル済みJavaScript
├── resources/                  # アイコン・リソース
├── package.json               # 拡張機能マニフェスト
├── README.md                  # Marketplace表示用
├── CHANGELOG.md               # 変更履歴
├── LICENSE                    # ライセンス
├── .vscodeignore             # パッケージ除外ファイル
├── webpack.config.js         # Webpackビルド設定
└── tsconfig.json             # TypeScript設定
```

### package.json（拡張機能マニフェスト）
```json
{
  "name": "testdata-buddy",
  "displayName": "TestData Buddy",
  "description": "AI連携型テストデータ生成ツール - 開発・QA効率化",
  "version": "1.0.0",
  "publisher": "testdata-buddy",
  "author": {
    "name": "TestData Buddy Team"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/testdata-buddy/vscode-extension"
  },
  "bugs": {
    "url": "https://github.com/testdata-buddy/vscode-extension/issues"
  },
  "homepage": "https://github.com/testdata-buddy/vscode-extension#readme",
  "engines": {
    "vscode": "^1.74.0"
  },
  "categories": [
    "Testing",
    "Data Science", 
    "Other"
  ],
  "keywords": [
    "test data",
    "generator",
    "password",
    "mock data",
    "ai",
    "claude",
    "qa",
    "testing"
  ],
  "main": "./out/extension.js",
  "scripts": {
    "vscode:prepublish": "npm run esbuild-base -- --minify",
    "esbuild-base": "esbuild ./src/extension.ts --bundle --outfile=out/extension.js --external:vscode --format=cjs --platform=node",
    "esbuild": "npm run esbuild-base -- --sourcemap",
    "esbuild-watch": "npm run esbuild-base -- --sourcemap --watch",
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./",
    "package": "vsce package",
    "publish": "vsce publish"
  },
  "devDependencies": {
    "@types/vscode": "^1.74.0",
    "@typescript-eslint/eslint-plugin": "^6.7.0",
    "@typescript-eslint/parser": "^6.7.0",
    "eslint": "^8.26.0",
    "typescript": "^5.4.2",
    "esbuild": "^0.19.5",
    "@vscode/vsce": "^2.21.0"
  },
  "dependencies": {
    "better-sqlite3": "^8.7.0"
  },
  "bundledDependencies": [
    "better-sqlite3"
  ]
}
```

### .vscodeignore
```
.vscode/**
.vscode-test/**
src/**
node_modules/**
!node_modules/better-sqlite3/**
*.map
*.ts
.gitignore
.eslintrc.json
tsconfig.json
webpack.config.js
.env
.env.*
tests/**
docs/**
scripts/**
**/*.test.js
**/*.spec.js
```

## ビルドとパッケージング

### Webpack設定（Native依存関係対応）
```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  target: 'node',
  mode: 'none',
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    vscode: 'commonjs vscode',
    'better-sqlite3': 'commonjs better-sqlite3'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  devtool: 'nosources-source-map',
  infrastructureLogging: {
    level: "log"
  }
};
```

### ビルドスクリプト
```bash
#!/bin/bash
# scripts/build.sh

echo "🔨 TestData Buddy 拡張機能ビルド開始"

# 依存関係インストール
echo "📦 依存関係をインストール中..."
npm install

# TypeScriptコンパイル
echo "🔄 TypeScriptをコンパイル中..."
npm run compile

# ESBuildでバンドル
echo "📦 ESBuildでバンドル中..."
npm run esbuild

# テスト実行
echo "🧪 テストを実行中..."
npm test

# リンティング
echo "🔍 ESLintでコード品質チェック中..."
npm run lint

echo "✅ ビルド完了"
```

### パッケージングスクリプト
```bash
#!/bin/bash
# scripts/package.sh

echo "📦 TestData Buddy 拡張機能パッケージング開始"

# ビルド実行
./scripts/build.sh

# VSIXファイル生成
echo "📋 VSIXファイルを生成中..."
npx vsce package

# パッケージ情報表示
echo "📄 パッケージ情報:"
ls -la *.vsix

echo "✅ パッケージング完了"
```

## CI/CD パイプライン

### GitHub Actions設定
```yaml
# .github/workflows/release.yml
name: Release Extension

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Compile extension
        run: npm run vscode:prepublish
      
      - name: Package extension
        run: npx vsce package
      
      - name: Upload VSIX to release
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ github.event.release.upload_url }}
          asset_path: ./testdata-buddy-*.vsix
          asset_name: testdata-buddy-${{ github.ref_name }}.vsix
          asset_content_type: application/zip
      
      - name: Publish to VSCode Marketplace
        run: npx vsce publish
        env:
          VSCE_PAT: ${{ secrets.VSCE_PAT }}
      
      - name: Publish to Open VSX
        run: npx ovsx publish
        env:
          OVSX_PAT: ${{ secrets.OVSX_PAT }}
```

### 自動テストワークフロー
```yaml
# .github/workflows/test.yml
name: Test Extension

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [18, 20]

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run lint
        run: npm run lint
      
      - name: Compile extension
        run: npm run compile
      
      - name: Run unit tests
        run: npm test
```

## VSCode Marketplace公開

### 公開準備
1. **Microsoft アカウント作成**
2. **Azure DevOps組織作成**
3. **Personal Access Token生成**
4. **Publisher登録**

### vsce CLI使用
```bash
# VSCEインストール
npm install -g vsce

# Publisher作成（初回のみ）
vsce create-publisher testdata-buddy

# パッケージ作成
vsce package

# 公開
vsce publish
```

### Open VSX Registry公開
```bash
# ovsx CLI インストール
npm install -g ovsx

# Open VSX Registry に公開
ovsx publish testdata-buddy-1.0.0.vsix -p $OVSX_PAT
```

## 配布戦略

### バージョニング
- **Major (X.0.0)**: 破壊的変更、大幅な機能追加
- **Minor (0.X.0)**: 新機能追加、後方互換性あり
- **Patch (0.0.X)**: バグ修正、小さな改善

### リリースチャンネル
1. **Stable**: メインリリース（v1.0.0）
2. **Pre-release**: ベータ版（v1.1.0-beta.1）
3. **Development**: 開発版（GitHub Actions）

### プロモーション戦略
1. **技術ブログでの紹介記事**
2. **GitHub READMEでの詳細説明**
3. **DevOpsコミュニティでの共有**
4. **QAエンジニア向けフォーラムでの宣伝**

## ライセンスと法的考慮事項

### ライセンス選択
- **MIT License**: オープンソース、商用利用可能
- **依存関係のライセンス確認**: sqlite3、better-sqlite3等

### プライバシー
- **ローカル実行**: ユーザーデータは外部送信なし
- **Claude API**: オプション機能、ユーザー同意必要
- **テレメトリ**: VSCode標準のみ使用

## サポートとメンテナンス

### ユーザーサポート
- **GitHub Issues**: バグレポート・機能要求
- **Wiki**: 詳細ドキュメント
- **FAQ**: よくある質問

### 継続的メンテナンス
- **VSCode APIアップデート対応**
- **セキュリティアップデート**
- **ユーザーフィードバックへの対応**
- **新機能開発**

この配布戦略により、TestData Buddy VSCode/Cursor拡張機能を効率的にパッケージ化し、幅広いユーザーに提供できます。VSCode Marketplaceでの公開により、開発者・QAエンジニアが簡単にインストールして使用できるようになります。 