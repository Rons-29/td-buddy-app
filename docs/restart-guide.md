# 🔄 TD Buddy - プロセス再起動機能ガイド

## 🚀 新機能のご紹介

**TDからのメッセージ**: 「プロセス再起動機能を追加しました！既存プロセスがあっても安心して再起動できます♪」

## ✅ 質問への回答

### 1️⃣ **フルスタック起動でAPIサーバーも起動する？**
**はい、正解です！** 
- `🚀 TD: Start Full Stack` = `🤖 Backend(API:3001)` + `🌐 Frontend(Web:3000)`
- **両方が並列で同時起動**されます

### 2️⃣ **プロセスがある場合の再起動**
**できます！** 以下の機能を追加しました：

## 🛠️ 追加された再起動機能

### 🔄 基本の再起動タスク

| タスク名 | 動作 | 用途 |
|----------|------|------|
| `🔄 TD: Restart Backend` | Backend のみ再起動 | API修正時 |
| `🔄 TD: Restart Frontend` | Frontend のみ再起動 | UI修正時 |
| `🔄 TD: Restart Full Stack` | 両方を完全再起動 | 全体リセット |
| `🔄 TD: Smart Restart` | インテリジェント再起動 | 自動判断 |

### 🔍 状況確認タスク

| タスク名 | 動作 | 結果 |
|----------|------|------|
| `📊 TD: Status Check` | 現在の状況確認 | プロセス・接続状況表示 |
| `🔄 TD: Kill Existing Processes` | プロセス強制終了 | クリーンアップ |

## 🎯 使用方法

### **方法1: コマンドパレット**
1. `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows)
2. **「Tasks: Run Task」**を検索
3. 以下から選択：
   - `🔄 TD: Restart Full Stack` ← **推奨**
   - `🔄 TD: Smart Restart`
   - `📊 TD: Status Check`

### **方法2: VS Codeタスクバー**
1. **ターミナル** → **タスクの実行**
2. 再起動タスクを選択

## 🔧 各機能の詳細

### 🚀 フルスタック再起動
```bash
🔄 TD: Restart Full Stack
```
**動作フロー:**
1. 既存プロセス検出・終了 (ポート3000, 3001)
2. 3秒待機（完全終了確保）
3. Backend + Frontend 並列起動
4. ✅ 完全リフレッシュ完了

### 🤖 スマート再起動
```bash
🔄 TD: Smart Restart
```
**動作フロー:**
1. プロセス状況の詳細分析
2. 既存プロセスの安全終了
3. 待機時間の最適化
4. 次のアクション提案

### 📊 状況確認
```bash
📊 TD: Status Check
```
**表示内容:**
- ポート使用状況 (3000, 3001)
- プロセス一覧 (next, nodemon, ts-node)
- 接続確認 (Backend API, Frontend)
- 健康状態チェック

## 🎯 実際の使用例

### **朝の開発開始**
```
📊 TD: Status Check → 状況確認
🔄 TD: Restart Full Stack → 完全リフレッシュ
🌐 TD: Open Frontend in Browser → ブラウザで確認
```

### **コード修正後の確認**
```
🔄 TD: Restart Backend → API修正時
🔄 TD: Restart Frontend → UI修正時
📊 TD: Status Check → 状況確認
```

### **トラブル発生時**
```
🔄 TD: Smart Restart → インテリジェント対応
📊 TD: Status Check → 詳細診断
🔄 TD: Kill Existing Processes → 強制リセット
```

## 🚨 トラブルシューティング

### ❌ プロセスが終了しない
```bash
🔄 TD: Kill Existing Processes
```
**手動確認:**
```bash
lsof -i :3000 -i :3001
kill -9 <PID>
```

### ❌ 一部のサーバーが起動しない
```bash
📊 TD: Status Check  # 状況確認
🔄 TD: Restart Backend  # 個別再起動
🔄 TD: Restart Frontend
```

### ❌ ポートエラーが続く
```bash
🔄 TD: Smart Restart  # 詳細診断
```

## 🌟 プロTips

### 💡 効率的な使い方
- **開発開始時**: `🔄 TD: Restart Full Stack`
- **小さな修正後**: `🔄 TD: Restart Backend` or `Frontend`
- **トラブル時**: `📊 TD: Status Check` → `🔄 TD: Smart Restart`

### 🎨 キーボードショートカット
VS Codeの設定で、よく使うタスクにショートカットを割り当て可能：
```json
{
  "key": "cmd+shift+r",
  "command": "workbench.action.tasks.runTask",
  "args": "🔄 TD: Restart Full Stack"
}
```

### 🔄 再起動が必要なタイミング
- **環境変数変更後**
- **package.json修正後**
- **TypeScript設定変更後**
- **データベーススキーマ更新後**
- **長時間開発後のリフレッシュ**

## 🤖 TDからのアドバイス

**「再起動機能で開発効率がアップします！」**

### 📈 期待できる効果
- ⚡ **起動時間短縮**: プロセス検出・終了の自動化
- 🎯 **エラー削減**: 既存プロセスとの競合回避
- 🛡️ **安定性向上**: クリーンな環境での再起動
- 📊 **可視化**: 現在の状況が一目で分かる

### 🎯 おすすめワークフロー
1. **朝**: `📊 Status Check` → `🔄 Restart Full Stack`
2. **開発中**: 必要に応じて個別再起動
3. **昼休み後**: `🔄 Smart Restart` でリフレッシュ
4. **終業前**: `📊 Status Check` で状況確認

**困ったときは、TDの再起動機能にお任せください！安全で確実な再起動をサポートします♪**

---

## 📞 サポート

- **詳細ガイド**: `docs/cursor-localhost-guide.md`
- **クイックスタート**: `docs/quick-start.md`
- **トラブルシューティング**: このドキュメントのトラブルシューティング節

**TDと一緒に、ストレスフリーな開発を続けましょう！🚀✨** 