# 🌐 フロントエンド開発者向けAPI使用ガイド
TestData Buddy (TD) - API統合ガイド

## 🎯 このガイドの目的
フロントエンド開発者がTD BuddyのAPIを正しく使用するための完全ガイドです。

---

## 🔧 API接続の基本設定

### ベースURL
```typescript
const API_BASE_URL = 'http://localhost:3001/api';
```

### 共通ヘッダー
```typescript
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};
```

---

## 🔐 パスワード生成API

### 📡 エンドポイント
```typescript
POST /api/password/generate-with-composition
```

### 📝 TypeScript インターフェース
```typescript
interface PasswordGenerateRequest {
  count: number;                    // 生成数 (1-100)
  length: number;                   // パスワード長 (4-128)
  composition: CompositionType;     // プリセット名
  includeNumbers?: boolean;         // 数字を含む
  includeSymbols?: boolean;         // 記号を含む
  useUppercase?: boolean;          // 大文字を使用
  useLowercase?: boolean;          // 小文字を使用
}

type CompositionType = 
  | 'basic'                        // ✨ 基本（新規追加）
  | 'web-standard'                 // Web標準
  | 'num-upper-lower'              // 数字・大文字・小文字
  | 'high-security'                // 高セキュリティ
  | 'enterprise-policy'            // エンタープライズポリシー
  | 'num-upper-lower-symbol'       // 数字・大文字・小文字・記号
  | 'custom-symbols'               // カスタム記号
  | 'custom-charsets'              // カスタム文字セット
  | 'none' | 'other';              // 基本文字種選択

interface PasswordGenerateResponse {
  success: boolean;
  data: {
    passwords: string[];
    criteria: PasswordGenerateRequest;
    strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    estimatedCrackTime: string;
    composition: {
      usedPreset: string;
      appliedRequirements: RequirementSummary[];
    };
  };
  tdMessage: string;
  timestamp: string;
}
```

### 🚀 実装例
```typescript
async function generatePasswords(params: PasswordGenerateRequest): Promise<PasswordGenerateResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/password/generate-with-composition`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('パスワード生成エラー:', error);
    throw error;
  }
}

// 使用例
const passwordResult = await generatePasswords({
  count: 5,
  length: 12,
  composition: 'basic',  // ✅ 修正済み
  includeNumbers: true,
  includeSymbols: false
});

console.log('生成されたパスワード:', passwordResult.data.passwords);
```

### ❌ よくある間違い
```typescript
// ❌ 間違った例
const badRequest = {
  length: 8,
  composition: 'basic'
  // count が不足 → エラー
};

// ❌ 未定義のプリセット
const badPreset = {
  count: 3,
  length: 8,
  composition: 'undefined-preset'  // → エラー
};
```

### ✅ 正しい例
```typescript
// ✅ 正しい例
const goodRequest = {
  count: 3,
  length: 8,
  composition: 'basic'  // 定義済みプリセット
};
```

---

## 👤 個人情報生成API

### 📡 エンドポイント
```typescript
POST /api/personal/generate
```

### 📝 TypeScript インターフェース
```typescript
interface PersonalInfoRequest {
  count: number;                    // 生成数 (1-1000)
  includeFields: PersonalField[];   // ✅ 必須：フィールド配列
}

type PersonalField = 
  | 'fullName'      // 氏名（漢字）
  | 'kanaName'      // 氏名（カナ）
  | 'email'         // メールアドレス
  | 'phone'         // 電話番号
  | 'mobile'        // 携帯電話
  | 'address'       // 住所
  | 'postalCode'    // 郵便番号
  | 'birthDate'     // 生年月日
  | 'age'           // 年齢
  | 'gender'        // 性別
  | 'company'       // 会社名
  | 'jobTitle'      // 職種
  | 'website'       // ウェブサイト
  | 'socialId';     // SNS ID

interface PersonalInfoResponse {
  success: boolean;
  data: {
    persons: PersonalInfo[];
    criteria: PersonalInfoRequest;
    statistics: {
      totalGenerated: number;
      uniqueCount: number;
      generationTime: number;
    };
  };
  responseTime: number;
}
```

### 🚀 実装例
```typescript
async function generatePersonalInfo(params: PersonalInfoRequest): Promise<PersonalInfoResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/personal/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error('個人情報生成エラー:', error);
    throw error;
  }
}

// 使用例
const personalResult = await generatePersonalInfo({
  count: 10,
  includeFields: ['fullName', 'email', 'phone', 'address']  // ✅ 正しい形式
});

console.log('生成された個人情報:', personalResult.data.persons);
```

### ❌ よくある間違い
```typescript
// ❌ 間違った例（古い形式）
const badRequest = {
  count: 5,
  includeFullName: true,    // ❌ この形式は使用不可
  includeEmail: true,       // ❌ この形式は使用不可
  includePhone: true        // ❌ この形式は使用不可
};

// ❌ 空のフィールド配列
const emptyFields = {
  count: 5,
  includeFields: []         // ❌ 最低1つ必要
};
```

### ✅ 正しい例
```typescript
// ✅ 正しい例
const goodRequest = {
  count: 5,
  includeFields: ['fullName', 'email', 'phone']  // ✅ 配列形式
};
```

---

## 🛡️ エラーハンドリング

### 共通エラーハンドリング関数
```typescript
interface APIError {
  success: false;
  error: {
    code: string;
    message: string;
    timestamp: string;
  };
}

function handleAPIError(error: any): string {
  if (error.response) {
    // API からのエラーレスポンス
    const apiError = error.response.data as APIError;
    return apiError.error.message;
  } else if (error.request) {
    // ネットワークエラー
    return 'サーバーに接続できません。ネットワーク接続を確認してください。';
  } else {
    // その他のエラー
    return '予期しないエラーが発生しました。';
  }
}

// 使用例
try {
  const result = await generatePasswords(params);
  console.log('成功:', result);
} catch (error) {
  const errorMessage = handleAPIError(error);
  console.error('エラー:', errorMessage);
  // UI にエラーメッセージを表示
}
```

### 具体的なエラーパターン
```typescript
// パスワード生成エラー
if (response.error?.code === 'VALIDATION_ERROR') {
  switch (response.error.message) {
    case 'パスワード要件が設定されていません':
      return '有効なプリセットを選択してください';
    case '生成数は1個以上100個以下で指定してください':
      return '生成数を1-100の範囲で指定してください';
    default:
      return response.error.message;
  }
}

// 個人情報生成エラー
if (response.error?.code === 'MISSING_FIELDS') {
  return '最低1つのフィールドを選択してください';
}
```

---

## ⚡ パフォーマンス最適化

### ローディング状態管理
```typescript
interface APIState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useAPIState<T>(): [APIState<T>, (promise: Promise<T>) => Promise<void>] {
  const [state, setState] = useState<APIState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = async (promise: Promise<T>) => {
    setState({ data: null, loading: true, error: null });
    
    try {
      const result = await promise;
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: handleAPIError(error) });
    }
  };

  return [state, execute];
}

// 使用例
const [passwordState, executePasswordGeneration] = useAPIState<PasswordGenerateResponse>();

const handleGeneratePasswords = () => {
  executePasswordGeneration(generatePasswords({
    count: 5,
    length: 12,
    composition: 'basic'
  }));
};
```

### キャッシュ機能
```typescript
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5分

function getCacheKey(endpoint: string, params: any): string {
  return `${endpoint}:${JSON.stringify(params)}`;
}

async function cachedAPICall<T>(endpoint: string, params: any, apiCall: () => Promise<T>): Promise<T> {
  const key = getCacheKey(endpoint, params);
  const cached = apiCache.get(key);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const result = await apiCall();
  apiCache.set(key, { data: result, timestamp: Date.now() });
  
  return result;
}
```

---

## 🧪 テスト例

### Jest テストケース
```typescript
import { generatePasswords, generatePersonalInfo } from './api';

describe('TD Buddy API', () => {
  test('パスワード生成 - basic プリセット', async () => {
    const result = await generatePasswords({
      count: 3,
      length: 8,
      composition: 'basic',
      includeNumbers: true
    });

    expect(result.success).toBe(true);
    expect(result.data.passwords).toHaveLength(3);
    expect(result.data.passwords[0]).toHaveLength(8);
    expect(result.data.composition.usedPreset).toBe('basic');
  });

  test('個人情報生成 - 正しいフィールド形式', async () => {
    const result = await generatePersonalInfo({
      count: 2,
      includeFields: ['fullName', 'email']
    });

    expect(result.success).toBe(true);
    expect(result.data.persons).toHaveLength(2);
    expect(result.data.persons[0]).toHaveProperty('fullName');
    expect(result.data.persons[0]).toHaveProperty('email');
  });

  test('エラーハンドリング - 無効なパラメータ', async () => {
    await expect(generatePasswords({
      count: 0,  // 無効な値
      length: 8,
      composition: 'basic'
    })).rejects.toThrow();
  });
});
```

---

## 📚 便利なユーティリティ関数

### パスワード強度表示
```typescript
function getStrengthColor(strength: string): string {
  switch (strength) {
    case 'weak': return '#ff4444';
    case 'medium': return '#ffaa00';
    case 'strong': return '#44aa44';
    case 'very-strong': return '#0066cc';
    default: return '#888888';
  }
}

function getStrengthLabel(strength: string): string {
  switch (strength) {
    case 'weak': return '弱い';
    case 'medium': return '普通';
    case 'strong': return '強い';
    case 'very-strong': return '非常に強い';
    default: return '不明';
  }
}
```

### フィールド名の日本語変換
```typescript
const fieldLabels: Record<PersonalField, string> = {
  fullName: '氏名',
  kanaName: '氏名（カナ）',
  email: 'メールアドレス',
  phone: '電話番号',
  mobile: '携帯電話',
  address: '住所',
  postalCode: '郵便番号',
  birthDate: '生年月日',
  age: '年齢',
  gender: '性別',
  company: '会社名',
  jobTitle: '職種',
  website: 'ウェブサイト',
  socialId: 'SNS ID'
};

function getFieldLabel(field: PersonalField): string {
  return fieldLabels[field] || field;
}
```

---

## 🔍 デバッグ・開発支援

### API レスポンス確認
```typescript
// 開発環境でのみ詳細ログ出力
if (process.env.NODE_ENV === 'development') {
  console.group('🤖 TD API Response');
  console.log('Request:', params);
  console.log('Response:', result);
  console.log('TD Message:', result.tdMessage);
  console.groupEnd();
}
```

### 接続状態確認
```typescript
async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

// アプリ起動時にヘルスチェック
useEffect(() => {
  checkAPIHealth().then(isHealthy => {
    if (!isHealthy) {
      console.warn('⚠️ TD Buddy APIサーバーに接続できません');
    }
  });
}, []);
```

---

## 📞 サポート情報

**TDからのメッセージ**: 
「フロントエンド統合ガイドを参考に、安全で効率的なAPI連携を実現してください。

正しいパラメータ形式を使用すれば、すべてのAPIが正常に動作します。困ったときは、このガイドを参照してください！🚀」

### 重要なポイント
1. **パスワード生成**: `basic`プリセットが新しく利用可能
2. **個人情報生成**: `includeFields`配列形式が必須
3. **エラーハンドリング**: 適切なエラーメッセージ表示
4. **パフォーマンス**: ローディング状態とキャッシュの活用

### よくある質問
**Q**: `net::ERR_CONNECTION_REFUSED` エラーが出る
**A**: バックエンドサーバー（port 3001）が起動しているか確認

**Q**: パスワード生成で「要件が設定されていません」エラー
**A**: `composition`に有効なプリセット名を指定

**Q**: 個人情報生成で「フィールドを指定してください」エラー  
**A**: `includeFields`配列に最低1つのフィールドを指定

---

*Frontend Guide generated by TD (TestData Buddy) - 2025-06-11* 