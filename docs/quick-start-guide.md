# 🚀 パスワード構成プリセット機能 - クイックスタートガイド

**🤖 TDからのメッセージ：**
*「今すぐ実装を始められるように、最短手順をまとめました！このガイドで効率よく進められますよ♪」*

---

## ⚡ 今すぐ始める5ステップ

### Step 1: 環境確認 (2分)
```bash
# 現在のプロジェクトディレクトリへ移動
cd td-buddy-webapp

# バックエンド・フロントエンドが起動できるか確認
cd backend && npm run dev
cd ../frontend && npm run dev
```

### Step 2: バックエンド実装 (15分)
```bash
# 1. 新しいサービスファイルを作成
touch backend/src/services/CompositionPasswordService.ts

# 2. 設計ドキュメントからコードをコピー
# docs/password-composition-feature.md の CompositionPasswordService をコピー

# 3. 既存のパスワードルートに新しいエンドポイント追加
# backend/src/routes/password.ts を編集
```

### Step 3: フロントエンド実装 (20分)
```bash
# 1. 新しいコンポーネントファイルを作成
touch frontend/components/CompositionSelector.tsx
touch frontend/components/CustomSymbolsInput.tsx
touch frontend/components/CustomCharsetsEditor.tsx

# 2. 設計ドキュメントからコードをコピー
# docs/password-composition-feature.md の各コンポーネントをコピー

# 3. PasswordGenerator.tsx を拡張
# 新しいコンポーネントをインポート・使用
```

### Step 4: 基本動作確認 (10分)
```bash
# 1. サーバー再起動
cd backend && npm run dev
cd frontend && npm run dev

# 2. ブラウザで動作確認
# http://localhost:3000/password

# 3. 各プリセットの動作をテスト
```

### Step 5: 完成・調整 (5分)
- 個数設定を50に変更確認
- TDキャラクターのメッセージ確認
- エラーハンドリング確認

---

## 📁 作業対象ファイル一覧

### 新規作成ファイル
```
backend/src/services/CompositionPasswordService.ts
frontend/components/CompositionSelector.tsx
frontend/components/CustomSymbolsInput.tsx
frontend/components/CustomCharsetsEditor.tsx
```

### 編集対象ファイル
```
backend/src/routes/password.ts
frontend/components/PasswordGenerator.tsx
```

---

## 💡 最小限実装版（30分で完成）

時間がない場合は、以下の順番で実装：

1. **CompositionPasswordService.ts** - バックエンドのコア機能
2. **CompositionSelector.tsx** - 基本的な構成選択
3. **password.ts** - 新しいAPIエンドポイント追加
4. **PasswordGenerator.tsx** - 構成選択を追加

この4ファイルだけで基本機能は動作します！

---

## 🛠️ コピペ用コード片

### 1. バックエンド新規APIエンドポイント（password.tsに追加）
```typescript
// 新しいエンドポイントを追加
router.post('/generate-with-composition', async (req, res) => {
  try {
    const criteria = req.body;
    const compositionService = new CompositionPasswordService();
    const passwords = compositionService.generatePasswords(criteria);
    
    res.json({
      success: true,
      data: {
        passwords,
        strength: 'strong', // 簡易版
        estimatedCrackTime: '1000年以上',
        criteria,
        generatedAt: new Date().toISOString()
      },
      tdMessage: `${criteria.composition}構成で${passwords.length}個のパスワードを生成しました！`,
      timestamp: new Date().toISOString(),
      requestId: `pwd-comp-${Date.now()}`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: error.message, code: 'COMPOSITION_ERROR' },
      tdMessage: 'パスワード生成でエラーが発生しました。'
    });
  }
});
```

### 2. フロントエンド基本構成選択（PasswordGenerator.tsxに追加）
```typescript
// stateを追加
const [composition, setComposition] = useState('none');

// JSXに追加（設定フォームの最上部）
<div className="mb-4">
  <label className="block text-sm font-medium mb-2">構成プリセット</label>
  <select 
    value={composition} 
    onChange={(e) => setComposition(e.target.value)}
    className="w-full p-2 border rounded"
  >
    <option value="none">指定なし</option>
    <option value="num-upper-lower">数字・大文字・小文字を必ず含む</option>
    <option value="num-upper-lower-symbol">数字・大文字・小文字・記号文字を必ず含む</option>
  </select>
</div>
```

### 3. API呼び出し変更（PasswordGenerator.tsx内）
```typescript
// 既存のAPI呼び出し部分を変更
const endpoint = composition !== 'none' 
  ? 'http://localhost:3001/api/password/generate-with-composition'
  : 'http://localhost:3001/api/password/generate';

const requestBody = composition !== 'none' 
  ? { 
      length: criteria.length, 
      count: 50, // 50個に変更
      composition,
      useNumbers: criteria.includeNumbers,
      useUppercase: criteria.includeUppercase,
      useLowercase: criteria.includeLowercase,
      useSymbols: criteria.includeSymbols
    }
  : { ...criteria, count: 50 }; // 50個に変更
```

---

## ✅ チェックポイント

各ステップ完了時に確認：

### Step 1完了時
- [ ] 両サーバーが正常に起動する

### Step 2完了時  
- [ ] CompositionPasswordService.tsが作成されている
- [ ] コンパイルエラーがない

### Step 3完了時
- [ ] 構成選択プルダウンが表示される
- [ ] プルダウン変更が動作する

### Step 4完了時
- [ ] 「数字・大文字・小文字を必ず含む」で各文字種が含まれる
- [ ] 生成個数が50個になっている

### Step 5完了時
- [ ] TDキャラクターがメッセージを表示する
- [ ] エラー時に適切なメッセージが出る

---

## 🚨 よくあるエラーと解決

### 「CompositionPasswordService が見つからない」
**解決**: インポート文を追加
```typescript
import { CompositionPasswordService } from '../services/CompositionPasswordService';
```

### 「構成選択が動作しない」
**解決**: composition stateの初期化を確認
```typescript
const [composition, setComposition] = useState<string>('none');
```

### 「APIが404エラー」
**解決**: ルートが正しく追加されているか確認、サーバー再起動

---

## 🎉 完成後の確認事項

以下がすべて動作すれば完成です：

- [ ] 構成プリセット選択が表示される
- [ ] 「数字・大文字・小文字を必ず含む」を選択すると各文字種が含まれる
- [ ] 「数字・大文字・小文字・記号文字を必ず含む」を選択すると記号も含まれる
- [ ] 生成個数が50個になっている
- [ ] TDキャラクターが適切に反応する
- [ ] エラー時にわかりやすいメッセージが表示される

---

**🤖 TDからの応援：**
*「この手順で進めれば必ず完成します！困ったときは設計ドキュメントを参照して、一歩ずつ確実に進めていきましょう。頑張って！♪」* 