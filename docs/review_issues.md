# TestData Buddy ドキュメントレビュー懸念点

## 📋 レビュー概要
- **レビュー日**: 2024年12月
- **対象**: VSCode/Cursor拡張機能開発ドキュメント
- **レビュー範囲**: プロジェクト構造、統合実装、パッケージング、その他ドキュメント

## ⚠️ 重大な懸念点

### 1. **プロジェクト構造の問題**

#### 問題点
- `activationEvents` が古い形式（現在は空配列推奨）
- `views` の構造が不適切（explorerではなく独自コンテナが必要）
- メニュー統合が不十分
- コマンドアイコンの未設定

#### 修正済み
```json
// 修正前
"activationEvents": ["onCommand:testdata-buddy.generate"]

// 修正後  
"activationEvents": []
```

### 2. **Native依存関係の課題**

#### 問題点
- `sqlite3` と `better-sqlite3` の両方が記載されていた
- VSCode拡張機能でのネイティブモジュール配布方法が不明確
- Webpackのexternals設定が不適切

#### 修正済み
```json
// 修正前
"dependencies": {
  "sqlite3": "^5.1.6",
  "better-sqlite3": "^8.7.0"
}

// 修正後
"dependencies": {
  "better-sqlite3": "^8.7.0"
},
"bundledDependencies": ["better-sqlite3"]
```

### 3. **セキュリティ対策の不足**

#### 問題点
- Claude API呼び出しにレート制限なし
- プロンプトインジェクション対策なし
- タイムアウト設定なし
- エラーハンドリングが基本的

#### 修正済み
- レート制限（1分間10回）追加
- プロンプトサニタイゼーション追加
- 30秒タイムアウト設定
- 詳細なエラーハンドリング

## 🔄 要修正のドキュメント

### 1. **開発セットアップガイド（01_development_setup.md）**

#### 問題点
- pnpm workspace構成（不要）
- Webアプリ向けの設定
- 環境変数設定が拡張機能に不適切

#### 修正が必要
```bash
# 現在（不適切）
pnpm run dev:api
pnpm run dev:web

# 修正後（必要）
npm run compile
npm run watch
# F5でExtension Development Host起動
```

### 2. **データベーススキーマ（03_database_schema.sql）**

#### 問題点
- 設計自体は適切
- VSCode拡張機能のglobalStateとの整合性確認が必要
- ファイルパス管理の見直しが必要

#### 検討事項
- 拡張機能内でのSQLiteファイル配置場所
- extensionContext.storageUriとの連携
- クロスプラットフォーム対応

### 3. **ソロ開発ワークフロー（07_solo_development_workflow.md）**

#### 問題点
- monorepo向けの設定（不要）
- Web開発向けのツール設定
- VSCode拡張機能開発に特化していない

#### 修正が必要
```json
// 現在（不適切）
"dev": "concurrently \"pnpm run dev:api\" \"pnpm run dev:web\""

// 修正後（必要）
"compile": "tsc -p ./",
"watch": "tsc -watch -p ./",
"package": "vsce package",
"test": "npm run compile && node ./out/test/runTest.js"
```

### 4. **テスト戦略（08_testing_strategy.md）**

#### 問題点
- Web APIテスト中心の構成
- VSCode拡張機能テストの記載なし
- モックオブジェクトの設定不足

#### 修正が必要
```typescript
// 追加が必要
import * as vscode from 'vscode';

// VSCode Extension テスト例
describe('Extension Commands', () => {
  test('パスワード生成コマンドが正常動作', async () => {
    await vscode.commands.executeCommand('testdata-buddy.generate.password');
    // アサーション
  });
});
```

### 5. **ユーザーガイド（10_user_guide.md）**

#### 問題点
- Electronアプリ前提の説明
- Docker説明が不要
- VSCode拡張機能としての使用方法が記載されていない

#### 修正が必要
```markdown
## インストール

### VSCode Marketplace（推奨）
1. VSCodeを開く
2. 拡張機能タブ（Ctrl+Shift+X）を開く
3. "TestData Buddy"を検索
4. "インストール"をクリック

### 使い方
1. Ctrl+Shift+P でコマンドパレットを開く
2. "TestData Buddy" と入力
3. 使用したい機能を選択
```

## 🔧 技術的懸念点

### 1. **パフォーマンス**
- 大量データ生成時のUI凍結リスク
- SQLiteファイルサイズの増大
- メモリ使用量の最適化

### 2. **配布**
- Native moduleの配布問題
- VSIXファイルサイズ制限
- クロスプラットフォーム対応

### 3. **互換性**
- VSCode APIバージョン対応
- Node.jsバージョン依存
- Cursor固有機能の活用方法

## 📊 優先度評価

### 🔴 **最優先（実装前に解決必要）**
1. プロジェクト構造の修正 ✅ 完了
2. Native依存関係の解決 ✅ 完了
3. セキュリティ対策の実装 ✅ 完了

### 🟡 **高優先（MVP後に対応）**
1. 開発セットアップガイドの修正
2. テスト戦略の見直し
3. ユーザーガイドの更新

### 🟢 **中優先（機能拡張時に対応）**
1. パフォーマンス最適化
2. 国際化対応
3. 高度なAI連携機能

## 🎯 次のアクション

### 即座に対応すべき項目
1. **コア機能のプロトタイプ作成**
   - 基本的なパスワード生成
   - VSCodeコマンド登録
   - エディタへの挿入

2. **技術検証**
   - better-sqlite3の動作確認
   - VSCode拡張機能としてのビルド
   - 基本的なUI統合

3. **最小限のテスト**
   - 基本機能の動作確認
   - パッケージング可能性
   - インストール可能性

この懸念点リストを基に、コア機能の実装に集中しつつ、技術的な問題を段階的に解決していくことを推奨します。 