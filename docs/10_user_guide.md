# 🤖 TestData Buddy VSCode拡張機能 ユーザーガイド

**🤖 TDからのご挨拶：**
*「こんにちは！TDです。VSCode拡張機能として生まれ変わった私の使い方をご案内しますね♪」*

## 目次
1. [はじめに](#はじめに)
2. [インストール](#インストール)
3. [初期設定](#初期設定)
4. [基本的な使い方](#基本的な使い方)
5. [高度な機能](#高度な機能)
6. [AI連携機能](#AI連携機能)
7. [Cursor統合](#cursor統合)
8. [トラブルシューティング](#トラブルシューティング)
9. [FAQ](#faq)

## はじめに

TestData Buddy（TD）は、VSCode/Cursor拡張機能として動作するAI連携型のテストデータ生成ツールです。開発者やQAエンジニアがIDEから離れることなく、テストに必要なダミーデータを素早く生成できます。

**🤖 TDの特徴：**
- **IDE統合**: 開発フローを止めずにデータ生成
- **パスワード生成**: セキュアなパスワードの瞬時生成
- **個人情報生成**: 日本語対応の擬似個人情報
- **ファイル生成**: CSV、JSON、XML等の各種フォーマット
- **AI連携**: 自然言語での指示によるデータ生成
- **Cursor統合**: MCPプロトコルでの深い連携

## インストール

### VSCode Marketplace（推奨）

#### 手順
1. **VSCodeを起動**
2. **拡張機能タブを開く**: `Ctrl+Shift+X` (Windows/Linux) / `Cmd+Shift+X` (macOS)
3. **検索**: "TestData Buddy" または "TD" で検索
4. **インストール**: 「インストール」ボタンをクリック
5. **再読み込み**: 必要に応じてVSCodeを再起動

```
検索結果で表示される拡張機能:
┌─────────────────────────────────────┐
│ 🤖 TestData Buddy                   │
│ AI-powered test data generation     │
│ ⭐⭐⭐⭐⭐ 1,234 downloads        │
│ by testdata-buddy                   │
│ [インストール]                      │
└─────────────────────────────────────┘
```

#### インストール確認
```bash
# VSCodeコマンドパレット (Ctrl+Shift+P) で確認
> TestData Buddy

表示されるコマンド例:
- TestData Buddy: Generate Password
- TestData Buddy: Generate Personal Info  
- TestData Buddy: Open AI Chat
```

### 手動インストール（開発者向け）

#### VSIX ファイルからのインストール
```bash
# 1. VSIXファイルをダウンロード
wget https://releases.github.com/testdata-buddy/releases/testdata-buddy-1.0.0.vsix

# 2. VSCodeでインストール
code --install-extension testdata-buddy-1.0.0.vsix

# 3. または GUI から
# Ctrl+Shift+P → "Install from VSIX" → ファイル選択
```

#### ソースからビルド
```bash
# リポジトリをクローン
git clone https://github.com/testdata-buddy/td-buddy-app.git
cd td-buddy-app

# 依存関係をインストール
npm install

# VSIXパッケージを生成
npm run package

# 生成されたVSIXをインストール
code --install-extension testdata-buddy-1.0.0.vsix
```

### Cursorでの使用

TestData BuddyはCursor IDEでも動作します：

1. **Cursor拡張機能**: VSCode互換なので同様にインストール
2. **MCP統合**: 追加設定でより深い連携が可能

```json
// Cursor設定例 (settings.json)
{
  "testdataBuddy.enableMCP": true,
  "testdataBuddy.claudeApiKey": "your-api-key"
}
```

## 初期設定

### Claude API設定

TestData BuddyのAI機能を使用するには、Claude APIキーが必要です。

1. [Anthropic Console](https://console.anthropic.com/)でアカウントを作成
2. APIキーを生成
3. TestData Buddyの設定画面で以下を入力：
   - **APIキー**: 生成したAPIキー
   - **モデル**: `claude-3-sonnet-20240229`（推奨）

### 基本設定

#### エクスポート設定
- **出力フォルダ**: 生成ファイルの保存先
- **ファイル形式**: デフォルトの出力形式
- **自動削除**: 古いファイルの自動削除設定

#### セキュリティ設定
- **データ暗号化**: 機密データの暗号化
- **履歴保存**: 生成履歴の保存期間

## 基本的な使い方

### 1. パスワード生成

#### 手順
1. 左メニューから「パスワード生成」を選択
2. パスワードの設定を調整：
   - **長さ**: 4〜128文字
   - **文字種**: 大文字、小文字、数字、記号
   - **除外文字**: 混同しやすい文字の除外
3. 「生成」ボタンをクリック
4. 結果をコピーまたはファイルに保存

#### 設定例
```
長さ: 16文字
✓ 大文字を含む
✓ 小文字を含む
✓ 数字を含む
✓ 記号を含む
✓ 混同しやすい文字を除外 (0, O, l, I)
```

**生成例**: `K9#mN$2pX@4zR!8v`

#### テンプレート機能
よく使う設定をテンプレートとして保存できます：

1. パスワード設定を調整
2. 「テンプレートとして保存」をクリック
3. テンプレート名を入力（例：「強力パスワード」）
4. 次回使用時はテンプレートを選択

### 2. 個人情報生成

#### 手順
1. 左メニューから「個人情報生成」を選択
2. 生成する情報を選択：
   - ✓ 氏名（漢字・ひらがな・ローマ字）
   - ✓ メールアドレス
   - ✓ 電話番号
   - ✓ 住所
   - ✓ 年齢・生年月日
3. 生成件数を指定（1〜1000件）
4. 「生成」ボタンをクリック

#### 出力例
```
氏名: 田中 太郎 (たなか たろう)
フリガナ: タナカ タロウ
ローマ字: Tanaka Taro
メール: tanaka.taro@example.com
電話: 090-1234-5678
住所: 東京都新宿区西新宿1-1-1
年齢: 32歳
生年月日: 1991年8月15日
```

#### 地域設定
- **日本**: 日本の住所・電話番号形式
- **アメリカ**: 米国の住所・電話番号形式
- **その他**: 各国対応

### 3. ファイル生成

#### サポート形式
- **CSV**: カンマ区切りデータ
- **JSON**: JSON形式データ
- **XML**: XML形式データ
- **Excel**: .xlsx形式
- **SQL**: INSERT文生成

#### 手順
1. 左メニューから「ファイル生成」を選択
2. ファイル形式を選択
3. データスキーマを定義：
   ```
   列名: id, 型: UUID
   列名: name, 型: 個人情報.氏名
   列名: email, 型: 個人情報.メール
   列名: created_at, 型: 日時
   ```
4. 行数を指定（1〜100,000行）
5. 「生成」ボタンをクリック

#### CSV出力例
```csv
id,name,email,created_at
550e8400-e29b-41d4-a716-446655440000,田中太郎,tanaka@example.com,2024-01-15 10:30:25
6ba7b810-9dad-11d1-80b4-00c04fd430c8,佐藤花子,sato@example.com,2024-01-15 10:30:26
```

#### JSON出力例
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "田中太郎",
    "email": "tanaka@example.com",
    "created_at": "2024-01-15T10:30:25Z"
  }
]
```

## 高度な機能

### 1. カスタムデータ型

独自のデータ型を定義できます：

#### 手順
1. 「設定」→「カスタムデータ型」
2. 「新規作成」をクリック
3. データ型情報を入力：
   ```
   名前: 商品コード
   形式: PRD-{数字5桁}
   例: PRD-12345
   ```

#### 利用可能なパターン
- `{数字N桁}`: 指定桁数の数字
- `{文字N桁}`: 指定桁数の文字
- `{日付:YYYY-MM-DD}`: 日付形式
- `{ランダム:選択肢1,選択肢2}`: 選択肢からランダム

### 2. バッチ処理

大量データを効率的に生成：

#### 手順
1. 「ツール」→「バッチ処理」
2. 処理設定ファイル（YAML）を作成：
   ```yaml
   tasks:
     - name: "ユーザーデータ"
       type: "personal_info"
       count: 10000
       output: "users.csv"
       fields: ["name", "email", "phone"]
     
     - name: "パスワードリスト"
       type: "password"
       count: 1000
       length: 16
       output: "passwords.txt"
   ```
3. 「実行」ボタンでバッチ処理開始

### 3. データ関連性

関連性のあるデータを生成：

#### 例：ユーザーと注文データ
```yaml
schema:
  users:
    - id: uuid
    - name: personal_info.name
    - email: personal_info.email
  
  orders:
    - id: uuid
    - user_id: reference(users.id)  # usersテーブルのidを参照
    - amount: number(1000-50000)
    - date: date(2024-01-01, 2024-12-31)
```

### 4. 旧字体変換

現代漢字を旧字体に変換：

#### 使用例
```
現代: 国家 → 旧字体: 國家
現代: 学校 → 旧字体: 學校
現代: 経済 → 旧字体: 經濟
```

## AI連携機能

### 自然言語での指示

Claude AIを使用して、自然言語でデータ生成を指示できます。

#### 基本的な使い方

1. 左メニューから「AI生成」を選択
2. テキストボックスに指示を入力
3. 「生成」ボタンをクリック

#### 指示例と結果

**例1: 基本的なパスワード生成**
```
指示: 「強力なパスワードを5つ生成して」

結果:
K9#mN$2pX@4zR!8v
P#4tG&8jK!2xL$7b
M@6nC*1dF$9sH*5v
R!8vB&3qY#7wP#4t
L$7bH*5vN@3qK9#m
```

**例2: 複雑なデータ生成**
```
指示: 「日本のECサイトの顧客データを100件生成して。名前、メールアドレス、電話番号、住所、購入履歴を含めてCSVファイルで出力」

結果: customers_20240115.csv ファイルが生成される
```

**例3: 特定条件での生成**
```
指示: 「東京都在住の20代女性の個人情報を50件生成。職業は IT関係で、趣味も含めて」

結果:
名前: 田中 美咲, 年齢: 26, 職業: Webデザイナー, 趣味: プログラミング、読書
名前: 佐藤 ゆい, 年齢: 24, 職業: システムエンジニア, 趣味: ゲーム、料理
...
```

#### AI指示のコツ

**良い指示の例**:
- 「16文字の英数字記号混合パスワードを10個生成」
- 「日本の住所データ100件、CSV形式で出力」
- 「アメリカ式の個人情報50件、JSON形式で生成」

**避けるべき指示**:
- 「何かデータを作って」（不明確）
- 「前回と同じやつ」（文脈がない）
- 「すごいデータ」（主観的）

### プロンプトテンプレート

よく使う指示をテンプレートとして保存：

#### テンプレート作成
1. 「AI生成」画面で「テンプレート管理」をクリック
2. 「新規作成」を選択
3. テンプレート情報を入力：
   ```
   名前: 強力パスワード生成
   指示: {数}個の16文字強力パスワードを生成。大文字小文字数字記号を含み、混同しやすい文字は除外
   ```

#### 変数使用
テンプレートで変数を使用可能：
- `{数}`: 数値入力
- `{形式}`: 選択肢（CSV/JSON/XML）
- `{地域}`: 地域選択（日本/アメリカ/ヨーロッパ）

## Cursor統合

### 設定方法

#### 1. MCP設定
```json
// .cursor/mcp_servers.json
{
  "testdata-buddy": {
    "command": "node",
    "args": ["path/to/td-buddy/dist/main.js", "--mcp"],
    "env": {
      "NODE_ENV": "production"
    }
  }
}
```

#### 2. VS Code拡張機能
1. VS Code Extensions で「TestData Buddy」を検索
2. インストール
3. 設定でAPI URLを設定: `http://localhost:3001/api`

### 使用方法

#### コマンドパレット経由
1. `Ctrl+Shift+P` でコマンドパレットを開く
2. 「TestData Buddy」と入力
3. 使用したい機能を選択：
   - パスワード生成
   - テストデータ生成
   - パネルを開く

#### AI Chat統合
```
@testdata-buddy 強力なパスワードを3つ生成して

// 結果がエディタに自動挿入される
const passwords = [
  'K9#mN$2pX@4z',
  'R!8vB&3qY#7w',
  'M@6nC*1dF$9s'
];
```

#### 右クリックメニュー
1. コード内で右クリック
2. 「TestData Buddy」メニューを選択
3. 生成したいデータ種類を選択

### 実用例

#### テストコード作成
```typescript
// ユーザー作成テスト用のダミーデータが必要
describe('User Creation', () => {
  it('should create user with valid data', () => {
    // @testdata-buddy 日本人ユーザーの個人情報を5件生成
    const testUsers = [
      { name: '田中太郎', email: 'tanaka@test.com', phone: '090-1234-5678' },
      { name: '佐藤花子', email: 'sato@test.com', phone: '090-2345-6789' },
      // ...
    ];
    
    testUsers.forEach(user => {
      expect(createUser(user)).toBeTruthy();
    });
  });
});
```

## トラブルシューティング

### よくある問題

#### 1. アプリが起動しない

**Windows**
- Windows Defenderに除外登録
- 管理者権限で実行
- .NET Framework 4.8以上をインストール

**macOS**
- システム環境設定 → セキュリティとプライバシー → 「開発元未確認」を許可
- Gatekeeperを無効化: `sudo spctl --master-disable`

**Linux**
- AppImageに実行権限を付与: `chmod +x TestDataBuddy.AppImage`
- FUSE をインストール: `sudo apt install fuse`

#### 2. AI機能が動作しない

**Claude APIキーの確認**
1. 設定画面でAPIキーが正しく入力されているか確認
2. [Anthropic Console](https://console.anthropic.com/)でAPIキーが有効か確認
3. 利用制限に達していないか確認

**ネットワーク接続**
- インターネット接続を確認
- プロキシ設定がある場合は設定画面で指定
- ファイアウォールでAPIアクセスが許可されているか確認

#### 3. ファイル生成が失敗する

**権限エラー**
- 出力フォルダの書き込み権限を確認
- 十分なディスク容量があるか確認

**大容量ファイル**
- メモリ不足の場合は生成件数を減らす
- バッチ処理で分割生成

#### 4. Cursor統合が動作しない

**API サーバー接続**
```bash
# API サーバーが起動しているか確認
curl http://localhost:3001/health

# 正常レスポンス例
{"status": "ok", "timestamp": "2024-01-15T10:30:25Z"}
```

**設定確認**
- VS Code設定で正しいAPI URLが設定されているか
- MCP設定ファイルが正しい場所にあるか

### ログファイル確認

#### ログの場所
- **Windows**: `%APPDATA%/TestDataBuddy/logs/`
- **macOS**: `~/Library/Logs/TestDataBuddy/`
- **Linux**: `~/.local/share/TestDataBuddy/logs/`

#### ログレベル
- **ERROR**: エラー情報
- **WARN**: 警告情報
- **INFO**: 一般情報
- **DEBUG**: 詳細情報（開発時のみ）

## FAQ

### Q1: TestData Buddyは無料ですか？
A: TestData Buddy本体は完全無料です。ただし、AI機能を使用する場合は別途Claude APIの利用料金が発生します。

### Q2: 生成されたデータは本物ですか？
A: いいえ、すべて架空のダミーデータです。実在の人物や組織とは一切関係ありません。

### Q3: 機密データを扱っても安全ですか？
A: 設定でデータ暗号化を有効にしている限り、ローカルストレージは暗号化されます。ただし、AI機能使用時はClaude APIにデータが送信されるため、機密データの使用は推奨しません。

### Q4: 大量データの生成にどの程度時間がかかりますか？
A: 目安として：
- 1,000件の個人情報: 約5秒
- 10,000件のCSVファイル: 約30秒
- 100,000件の大容量ファイル: 約5分

### Q5: 旧字体変換の精度はどの程度ですか？
A: 常用漢字について90%以上の精度で変換できます。ただし、すべての漢字に対応しているわけではありません。

### Q6: Cursor以外のIDEでも使用できますか？
A: 現在はCursorとVS Codeのみ対応しています。他のIDEは将来的な対応を検討中です。

### Q7: エクスポートしたファイルの自動削除設定は？
A: デフォルトで7日後に自動削除されます。設定画面で変更可能です。

### Q8: API制限はありますか？
A: ローカル機能に制限はありません。Claude API使用時は、Anthropicの利用制限に従います。

### Q9: データの形式をカスタマイズできますか？
A: はい、カスタムデータ型機能やスキーマ定義により、独自の形式でデータ生成が可能です。

### Q10: 商用利用は可能ですか？
A: はい、TestData Buddy本体はMITライセンスで商用利用可能です。ただし、Claude APIの利用規約も確認してください。

---

## サポート

### ドキュメント
- 公式ドキュメント: https://testdata-buddy.github.io/docs
- API リファレンス: https://testdata-buddy.github.io/api

### コミュニティ
- GitHub Discussions: https://github.com/testdata-buddy/td-buddy-app/discussions
- Discord: https://discord.gg/testdata-buddy

### 問題報告
- バグ報告: https://github.com/testdata-buddy/td-buddy-app/issues
- 機能要望: https://github.com/testdata-buddy/td-buddy-app/discussions/categories/ideas

### バージョン情報
- 現在のバージョン: v1.0.0
- 最終更新: 2024年1月15日
- 対応OS: Windows 10+, macOS 11+, Ubuntu 20.04+ 