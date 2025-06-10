# ⚡ TD Buddy - Cursorローカルホスト表示 クイックスタート

## 🚀 5分で始めるローカルホスト表示

**TDからのメッセージ**: 「今すぐ使えるクイックガイドです！5分で快適な開発環境を整えましょう♪」

## 📋 Step 1: 必要な拡張機能をインストール

### 自動インストール（推奨）
1. **Cursor/VS Code**を開く
2. 左下の拡張機能ボタンクリック  
3. **「推奨」**タブを選択
4. **「すべてインストール」**をクリック

### 手動インストール
```bash
# 必須拡張機能
code --install-extension ms-vscode.live-server
code --install-extension ritwickdey.liveserver
code --install-extension ms-vscode.vscode-thunder-client
```

## 🎯 Step 2: サーバー起動

### 方法A: タスクランナー使用（最速）
1. `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows)
2. **「Tasks: Run Task」**を検索
3. **「🚀 TD: Start Full Stack」**を選択
4. ✅ 自動で両サーバー起動！

### 方法B: 手動起動
```bash
# ターミナル1: Backend
cd td-buddy-webapp/backend
npm run dev

# ターミナル2: Frontend  
cd td-buddy-webapp/frontend
npm run dev
```

## 🌐 Step 3: ローカルホスト表示

### 方法1: ポート転送（推奨）
1. **ポート**タブを確認（Cursorの下部）
2. `localhost:3000` の🌐ボタンをクリック
3. ✅ ブラウザで自動表示！

### 方法2: Simple Browser
1. `Cmd+Shift+P` → **「Simple Browser: Show」**
2. URL: `http://localhost:3000`
3. ✅ エディタ内でブラウザ表示！

### 方法3: 外部ブラウザ
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 🎨 Step 4: 開発効率アップ

### エディタ分割表示
1. **表示** → **エディタレイアウト** → **2つの列**
2. 左: コードエディタ
3. 右: Simple Browserでローカルホスト

### リアルタイム確認
- ファイル保存 → 自動リロード ✅
- CSS変更 → 即座反映 ✅  
- API変更 → 即座テスト ✅

## 🔧 よく使うコマンド

| 操作 | コマンド | 結果 |
|------|----------|------|
| フルスタック起動 | `🚀 TD: Start Full Stack` | Backend + Frontend 同時起動 |
| Frontend表示 | `🌐 TD: Open Frontend in Browser` | http://localhost:3000 を開く |
| API確認 | `🔌 TD: Open Backend API` | http://localhost:3001/api/health |
| デバッグ開始 | F5 → `🚀 TD Full Stack Debug` | 統合デバッグモード |

## 🚨 トラブルシューティング

### ❌ ポートが使用中
```bash
# ポート確認
lsof -i :3000
lsof -i :3001

# プロセス終了  
kill -9 <PID>
```

### ❌ 拡張機能が動かない
1. **拡張機能**タブで有効化確認
2. Cursor再起動
3. **開発者ツール** → **リロード**

### ❌ Simple Browserが表示されない
1. `Cmd+Shift+P` → **「Developer: Reload Window」**
2. 設定確認: `"simpleBrowser.focusLockIndicator.enabled": true`

## 🎯 実際の使用例

### 朝の開発開始ルーティン
1. **Cursorを開く** (1秒)
2. `Cmd+Shift+P` → **「TD: Start Full Stack」** (5秒)
3. **ポート**タブで🌐クリック (1秒)
4. ✅ **開発開始！** (合計7秒)

### UI調整作業
1. **表示** → **エディタレイアウト** → **2つの列**
2. 左: `components/Button.tsx`
3. 右: **Simple Browser** (localhost:3000)
4. ✅ **リアルタイムCSS調整**

### API開発・テスト
1. **Thunder Client**拡張機能起動
2. 新規リクエスト: `POST http://localhost:3001/api/generate/password`
3. ✅ **エディタ内でAPI テスト**

## 🌟 プロTips

### 💡 効率化テクニック
- **キーボードショートカット**: `Cmd+Shift+P` を覚える
- **分割画面**: コード + ブラウザの同時表示
- **ホットキー**: 頻繁な操作はキーボード設定

### 🎨 UI/UX開発向け
- **DevTools統合**: Chrome DevToolsとCursor連携
- **レスポンシブテスト**: 複数画面サイズ確認
- **CSS Grid/Flexbox**: リアルタイムデバッグ

### 🧪 API開発向け
- **Thunder Client**: 内蔵APIテストツール
- **デバッグモード**: Backend APIのブレークポイント
- **ログ監視**: コンソール出力のリアルタイム確認

## 🤖 TDからの応援メッセージ

**「クイックスタート、お疲れさまでした！」**

### 🎯 次のステップ
1. **詳細ガイド**: `docs/cursor-localhost-guide.md` を確認
2. **カスタマイズ**: `.vscode/settings.json` で個人設定
3. **チーム共有**: 設定をチームメンバーと共有

### ⚡ さらなる効率化
- **Git統合**: VS Code Git機能をフル活用
- **拡張機能探索**: 自分に合った拡張機能を発見
- **ワークフロー最適化**: 個人の作業スタイルに合わせてカスタマイズ

**困ったときは、いつでもTDに相談してください！一緒に最高の開発環境を作りましょう🚀✨**

---

## 📞 さらなるサポート

- 📖 **詳細ガイド**: `docs/cursor-localhost-guide.md`
- 🔧 **実装詳細**: `docs/implementation-guide.md`  
- 🌿 **Git操作**: `rules/git_rules.mdc`
- 🛡️ **セキュリティ**: `rules/security_rules.mdc`

**TDと一緒に、効率的で楽しい開発ライフを送りましょう！** 