# 🔗 TestData Buddy API仕様書

**🤖 TDからのメッセージ：**
*「APIの詳細仕様をまとめました！実装時にこのドキュメントを参考にして、一貫性のあるAPIを作りましょう♪」*

---

## 📋 概要

### ベースURL
```
http://localhost:3001/api
```

### 認証
現在は認証なし（ローカル開発用）

### レスポンス形式
全てのAPIレスポンスは以下の形式に従います：

```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
  tdMessage: string;
  timestamp: string;
  requestId: string;
}
```

---

## 🔐 パスワード生成API

### 基本パスワード生成

#### `POST /api/password/generate`

基本的なパスワード生成機能

**リクエスト**
```typescript
interface PasswordGenerateRequest {
  length: number;                    // パスワード長 (1-128)
  count: number;                     // 生成個数 (1-1000)
  includeUppercase: boolean;         // 大文字を含む
  includeLowercase: boolean;         // 小文字を含む
  includeNumbers: boolean;           // 数字を含む
  includeSymbols: boolean;           // 記号を含む
  excludeAmbiguous: boolean;         // 紛らわしい文字を除外
  customCharacters?: string;         // カスタム文字セット
}
```

**リクエスト例**
```json
{
  "length": 12,
  "count": 3,
  "includeUppercase": true,
  "includeLowercase": true,
  "includeNumbers": true,
  "includeSymbols": false,
  "excludeAmbiguous": true
}
```

**レスポンス**
```typescript
interface PasswordGenerateResponse {
  passwords: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  estimatedCrackTime: string;
  criteria: PasswordGenerateRequest;
  generatedAt: string;
}
```

**レスポンス例**
```json
{
  "success": true,
  "data": {
    "passwords": [
      "aB3dEf7hJk9m",
      "pQ5rSt8uVw2x",
      "yZ4bCd6fGh1j"
    ],
    "strength": "strong",
    "estimatedCrackTime": "約 3,000年",
    "criteria": {
      "length": 12,
      "count": 3,
      "includeUppercase": true,
      "includeLowercase": true,
      "includeNumbers": true,
      "includeSymbols": false,
      "excludeAmbiguous": true
    },
    "generatedAt": "2024-01-15T10:30:00.000Z"
  },
  "tdMessage": "安全で覚えやすいパスワードを3個生成しました！",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "pwd-1705314600000-abc123"
}
```

### 構成プリセット対応パスワード生成

#### `POST /api/password/generate-with-composition`

構成プリセット機能を使用したパスワード生成

**リクエスト**
```typescript
interface CompositionPasswordRequest {
  // 基本設定
  length: number;                    // パスワード長 (1-128)
  count: number;                     // 生成個数 (1-1000)
  
  // 構成プリセット
  composition: string;               // プリセット選択
  
  // カスタム設定（compositionに応じて使用）
  customSymbols?: string;            // カスタム記号
  customCharsets?: CustomCharsetRequirement[];  // カスタム文字種
  
  // 除外オプション
  excludeSimilar?: boolean;          // 似ている文字を除外
  excludeAmbiguous?: boolean;        // 紛らわしい文字を除外
  
  // 基本文字種（composition='none'時に使用）
  useNumbers?: boolean;
  useUppercase?: boolean;
  useLowercase?: boolean;
  useSymbols?: boolean;
}

interface CustomCharsetRequirement {
  id: string;
  name: string;
  charset: string;
  min: number;
  enabled: boolean;
}
```

**プリセット値**
- `none`: 指定なし
- `num-upper-lower`: 数字・大文字・小文字を必ず含む
- `num-upper-lower-symbol`: 数字・大文字・小文字・記号文字を必ず含む
- `custom-symbols`: 数字・大文字・小文字・カスタム記号を必ず含む
- `custom-charsets`: カスタム文字種を必ず含む

**リクエスト例1（基本プリセット）**
```json
{
  "length": 16,
  "count": 50,
  "composition": "num-upper-lower-symbol",
  "excludeSimilar": true
}
```

**リクエスト例2（カスタム記号）**
```json
{
  "length": 12,
  "count": 10,
  "composition": "custom-symbols",
  "customSymbols": "$@_#&?",
  "excludeSimilar": true
}
```

**リクエスト例3（カスタム文字種）**
```json
{
  "length": 20,
  "count": 5,
  "composition": "custom-charsets",
  "customCharsets": [
    {
      "id": "charset-1",
      "name": "数字",
      "charset": "0123456789",
      "min": 2,
      "enabled": true
    },
    {
      "id": "charset-2", 
      "name": "母音",
      "charset": "aeiou",
      "min": 1,
      "enabled": true
    },
    {
      "id": "charset-3",
      "name": "特殊記号",
      "charset": "@#$",
      "min": 1,
      "enabled": true
    }
  ]
}
```

**レスポンス**
```typescript
interface CompositionPasswordResponse {
  passwords: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  estimatedCrackTime: string;
  criteria: CompositionPasswordRequest;
  generatedAt: string;
  composition: {
    usedPreset: string;
    appliedRequirements: RequirementSummary[];
  };
}

interface RequirementSummary {
  name: string;
  charset: string;
  requiredCount: number;
  actualCount: number;
  satisfied: boolean;
}
```

**レスポンス例**
```json
{
  "success": true,
  "data": {
    "passwords": [
      "A7b$c9@dE2fG",
      "H4j&k8#mN6pQ",
      "R3s%t1!uV5wX",
      // ... 47個のパスワード
    ],
    "strength": "very-strong",
    "estimatedCrackTime": "約 10万年以上",
    "criteria": {
      "length": 12,
      "count": 50,
      "composition": "custom-symbols",
      "customSymbols": "$@_#&?",
      "excludeSimilar": true
    },
    "generatedAt": "2024-01-15T10:35:00.000Z",
    "composition": {
      "usedPreset": "custom-symbols",
      "appliedRequirements": [
        {
          "name": "numbers",
          "charset": "0123456789",
          "requiredCount": 1,
          "actualCount": 2,
          "satisfied": true
        },
        {
          "name": "uppercase",
          "charset": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
          "requiredCount": 1,
          "actualCount": 3,
          "satisfied": true
        },
        {
          "name": "lowercase", 
          "charset": "abcdefghijklmnopqrstuvwxyz",
          "requiredCount": 1,
          "actualCount": 4,
          "satisfied": true
        },
        {
          "name": "customSymbols",
          "charset": "$@_#&?",
          "requiredCount": 1,
          "actualCount": 2,
          "satisfied": true
        }
      ]
    }
  },
  "tdMessage": "カスタム記号を使った高セキュリティパスワードを50個生成しました！",
  "timestamp": "2024-01-15T10:35:00.000Z",
  "requestId": "pwd-comp-1705314900000-xyz789"
}
```

---

## ❌ エラーレスポンス

### エラーコード一覧

| エラーコード | 説明 | HTTPステータス |
|-------------|------|----------------|
| `VALIDATION_ERROR` | リクエストパラメータが不正 | 400 |
| `LENGTH_OUT_OF_RANGE` | パスワード長が範囲外 | 400 |
| `COUNT_OUT_OF_RANGE` | 生成個数が範囲外 | 400 |
| `INVALID_COMPOSITION` | 無効な構成プリセット | 400 |
| `EMPTY_CHARSET` | 文字セットが空 | 400 |
| `INSUFFICIENT_LENGTH` | パスワード長が必要文字数より短い | 400 |
| `CUSTOM_CHARSET_ERROR` | カスタム文字種設定エラー | 400 |
| `GENERATION_TIMEOUT` | 生成処理タイムアウト | 408 |
| `RATE_LIMIT_EXCEEDED` | レート制限超過 | 429 |
| `INTERNAL_ERROR` | 内部サーバーエラー | 500 |

### エラーレスポンス例

**バリデーションエラー**
```json
{
  "success": false,
  "error": {
    "message": "パスワード長は1-128文字の範囲で設定してください",
    "code": "LENGTH_OUT_OF_RANGE",
    "details": {
      "field": "length",
      "value": 200,
      "min": 1,
      "max": 128
    }
  },
  "tdMessage": "設定に問題があります。パスワード長を確認してくださいね",
  "timestamp": "2024-01-15T10:40:00.000Z",
  "requestId": "pwd-err-1705315200000-def456"
}
```

**カスタム文字種エラー**
```json
{
  "success": false,
  "error": {
    "message": "文字種「母音」の文字セットが空です",
    "code": "EMPTY_CHARSET",
    "details": {
      "charsetId": "charset-2",
      "charsetName": "母音"
    }
  },
  "tdMessage": "文字種の設定を確認してください。空の文字セットがあります",
  "timestamp": "2024-01-15T10:42:00.000Z", 
  "requestId": "pwd-err-1705315320000-ghi789"
}
```

**レート制限エラー**
```json
{
  "success": false,
  "error": {
    "message": "1分間の生成制限に達しました。しばらくお待ちください",
    "code": "RATE_LIMIT_EXCEEDED",
    "details": {
      "retryAfter": 45,
      "currentLimit": "10回/分"
    }
  },
  "tdMessage": "ちょっと急ぎすぎですね。45秒後に再試行してください",
  "timestamp": "2024-01-15T10:45:00.000Z",
  "requestId": "pwd-err-1705315500000-jkl012"
}
```

---

## 🔍 ヘルスチェックAPI

#### `GET /api/health`

システムの稼働状況確認

**レスポンス**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "uptime": 3600,
    "database": "connected",
    "memoryUsage": {
      "used": "45MB",
      "free": "195MB",
      "total": "240MB"
    }
  },
  "tdMessage": "システムは正常に動作しています♪",
  "timestamp": "2024-01-15T10:50:00.000Z",
  "requestId": "health-1705315800000-mno345"
}
```

---

## 📊 統計情報API

#### `GET /api/password/stats`

パスワード生成統計の取得

**レスポンス**
```json
{
  "success": true,
  "data": {
    "totalGenerated": 12500,
    "todayGenerated": 250,
    "popularCompositions": [
      {
        "composition": "num-upper-lower",
        "count": 5000,
        "percentage": 40
      },
      {
        "composition": "num-upper-lower-symbol",
        "count": 3750,
        "percentage": 30
      }
    ],
    "averageLength": 12.8,
    "strongPasswordRate": 0.85
  },
  "tdMessage": "今日も多くの安全なパスワードが生成されています！",
  "timestamp": "2024-01-15T10:55:00.000Z",
  "requestId": "stats-1705316100000-pqr678"
}
```

---

## 🚀 その他の機能API（将来実装予定）

### 個人情報生成API
#### `POST /api/personal/generate`
擬似個人情報の生成

### ファイル生成API  
#### `POST /api/file/generate`
テストファイルの生成

### Claude AI連携API
#### `POST /api/ai/natural-language`
自然言語によるデータ生成指示

---

## 📝 開発者向け情報

### レート制限
- **パスワード生成**: 10回/分
- **統計情報**: 60回/分
- **ヘルスチェック**: 制限なし

### リクエストヘッダー
```http
Content-Type: application/json
X-Session-ID: optional-session-identifier
User-Agent: TD-Buddy-Client/1.0.0
```

### CORS設定
- **Origin**: `http://localhost:3000` (開発環境)
- **Methods**: `GET, POST, OPTIONS`
- **Headers**: `Content-Type, X-Session-ID`

### キャッシュ
- **統計情報**: 5分間キャッシュ
- **ヘルスチェック**: キャッシュなし
- **パスワード生成**: キャッシュなし（セキュリティ上の理由）

---

## 🧪 テスト用cURL例

### 基本パスワード生成
```bash
curl -X POST http://localhost:3001/api/password/generate \
  -H "Content-Type: application/json" \
  -d '{
    "length": 12,
    "count": 5,
    "includeUppercase": true,
    "includeLowercase": true,
    "includeNumbers": true,
    "includeSymbols": false,
    "excludeAmbiguous": true
  }'
```

### 構成プリセット対応生成
```bash
curl -X POST http://localhost:3001/api/password/generate-with-composition \
  -H "Content-Type: application/json" \
  -d '{
    "length": 16,
    "count": 10,
    "composition": "num-upper-lower-symbol",
    "excludeSimilar": true
  }'
```

### カスタム記号生成
```bash
curl -X POST http://localhost:3001/api/password/generate-with-composition \
  -H "Content-Type: application/json" \
  -d '{
    "length": 14,
    "count": 3,
    "composition": "custom-symbols",
    "customSymbols": "$@_#&?!",
    "excludeSimilar": true
  }'
```

---

**🤖 TDからの総括：**
*「API仕様書の準備完了です！この仕様に従って実装すれば、一貫性があって使いやすいAPIができあがりますね。困ったときはいつでもこのドキュメントを参照してください♪」* 