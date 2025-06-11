# 🌐 Cursorでローカルホストを表示する方法
# TD Buddy開発者向けガイド

## 🎯 なぜこの設定が必要なのか

### 開発効率の向上
- **リアルタイムプレビュー**: コード変更を即座に確認
- **デバッグ効率化**: エディタ内でブラウザとコードを同時表示
- **マルチポート対応**: Frontend(3000) + Backend(3001)の同時表示
- **ワークフロー最適化**: ブラウザ切り替え不要

### TD Buddyプロジェクトでの利点
- Next.js開発サーバー(3000)の即座確認
- Express API(3001)のテスト実行
- WebSocket通信のリアルタイム監視
- レスポンシブデザインのテスト

## 🚀 実装方法

### 方法1: ポート転送機能（最も簡単・推奨）

#### 手順
1. **ターミナルでサーバー起動**
```bash
# Backend起動 (Port 3001)
cd td-buddy-webapp/backend
npm run dev

# Frontend起動 (Port 3000) - 別ターミナル
cd td-buddy-webapp/frontend  
npm run dev
```

2. **自動ポート検出**
   - VS Code/Cursorが自動でポートを検出
   - **ポート**タブに表示される
   - 🌐ボタンでブラウザ起動

3. **利点**
   - ✅ 設定不要
   - ✅ 自動検出
   - ✅ 複数ポート対応
   - ✅ 外部からのアクセス可能

#### なぜ推奨するのか
- **Zero Configuration**: 追加設定が不要
- **自動化**: ポート検出・管理が自動
- **安全性**: 適切なCORS設定で外部アクセス制御

### 方法2: Simple Browser（内蔵ブラウザ）

#### 手順
1. **コマンドパレット起動**: `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows)
2. **コマンド実行**: `Simple Browser: Show`
3. **URL入力**: `http://localhost:3000`

#### 利点
- ✅ エディタ内表示
- ✅ 分割画面対応
- ✅ 開発ツール利用可能

#### なぜ使うのか
- **集中力維持**: ウィンドウ切り替え不要
- **画面効率**: 狭いディスプレイでも効率的
- **デバッグ統合**: コードとブラウザを同時確認

### 方法3: Live Preview拡張機能

#### インストール
```bash
code --install-extension ms-vscode.live-server
```

#### 使用方法
1. HTMLファイルを右クリック
2. "Show Preview"を選択
3. 自動リロード機能でリアルタイム更新

#### なぜ有効なのか
- **ホットリロード**: ファイル保存で即座更新
- **開発速度**: コード→確認サイクルの高速化

### 方法4: Live Server拡張機能

#### インストール
```bash
code --install-extension ritwickdey.liveserver
```

#### 使用方法
1. HTMLファイルを右クリック
2. "Open with Live Server"選択
3. ブラウザで自動起動

## ⚙️ VS Code設定ファイル

### settings.json - 基本設定
```json
{
  // Simple Browser設定
  "simpleBrowser.focusLockIndicator.enabled": true,
  
  // Live Server設定
  "liveServer.settings.port": 3000,
  "liveServer.settings.CustomBrowser": "chrome",
  "liveServer.settings.donotShowInfoMsg": true,
  
  // TD専用設定
  "livePreview.defaultPreviewPath": "/td-demo"
}
```

### tasks.json - タスク自動化
サーバー起動を自動化し、開発効率を向上

### launch.json - デバッグ設定
Frontend/Backendの同時デバッグ環境を構築

## 🔧 推奨拡張機能

### 必須拡張機能
- **Live Server**: `ritwickdey.liveserver`
- **Live Preview**: `ms-vscode.live-server`

### 開発効率化拡張機能
- **Thunder Client**: API テスト
- **Path Intellisense**: パス補完

## 🎯 使い分けガイド

### シーン別推奨方法

#### 🚀 通常開発時
**ポート転送機能**を使用
- サーバー起動 → 自動検出 → ブラウザ表示

#### 🎨 UI/UX調整時
**Simple Browser**を使用
- エディタ内で分割画面表示

#### 🧪 API開発時
**Thunder Client** + **ポート転送**
- API テスト環境をエディタ内に構築

#### 📱 レスポンシブテスト時
**Live Preview**を使用
- 複数デバイスサイズを同時確認

## 🚨 トラブルシューティング

### よくある問題

#### ポートが使用中
```bash
# ポート使用状況確認
lsof -i :3000
lsof -i :3001

# プロセス終了
kill -9 <PID>
```

#### CORS エラー
Backend側で適切なCORS設定を確認

#### 自動リロードが動かない
ファイルウォッチャーの設定確認

## 📊 パフォーマンス最適化

### 設定のポイント
- **ファイルウォッチャー**: 必要なファイルのみ監視
- **メモリ使用量**: ブラウザプロセス数の制限
- **ネットワーク**: localhost使用でレイテンシ最小化

## 🤖 TDからのアドバイス

**「ローカルホスト表示は開発効率の要です！」**

- 🎯 **目的別選択**: シーンに応じて最適な方法を選択
- ⚡ **高速開発**: ホットリロードで即座フィードバック
- 🛡️ **安全確認**: セキュリティ設定も忘れずに
- 📈 **継続改善**: 効率的な設定を随時アップデート

**困ったときはTDがサポートします！一緒に最高の開発環境を作りましょう♪** 