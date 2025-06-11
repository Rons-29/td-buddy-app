# 🔐 パスワード構成プリセット機能 設計ドキュメント

**🤖 TDからのメッセージ：**
*「パスワード生成機能の心臓部です！『必ず含む』機能で、より実用的なパスワードを作れるようになります♪」*

---

## 📋 機能概要

### 🎯 目的
- 様々なパスワードポリシーに対応した構成プリセット機能
- 「必ず含む」文字種指定による確実な要件充足
- カスタム記号・文字種設定による柔軟性

### ✨ 主要機能
1. **構成プリセット選択**：よく使用される構成パターンの提供
2. **必須文字種機能**：指定文字種から最低1文字を保証
3. **カスタム記号入力**：任意の記号セットを指定可能
4. **カスタム文字種設定**：完全自由な文字種定義
5. **プリセット保存**：カスタム設定のローカル保存

---

## 🏗️ 構成プリセット定義

### 基本プリセット
```typescript
const PasswordCompositions = {
  'none': {
    label: '指定なし',
    description: '選択された文字種からランダム生成',
    requirements: null
  },
  
  'num-upper-lower': {
    label: '数字・大文字・小文字を必ず含む',
    description: '0-9、A-Z、a-z から各1文字以上',
    requirements: {
      numbers: { min: 1, charset: '0123456789' },
      uppercase: { min: 1, charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
      lowercase: { min: 1, charset: 'abcdefghijklmnopqrstuvwxyz' }
    }
  },
  
  'num-upper-lower-symbol': {
    label: '数字・大文字・小文字・記号文字を必ず含む',
    description: '0-9、A-Z、a-z、記号 から各1文字以上',
    requirements: {
      numbers: { min: 1, charset: '0123456789' },
      uppercase: { min: 1, charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
      lowercase: { min: 1, charset: 'abcdefghijklmnopqrstuvwxyz' },
      symbols: { min: 1, charset: '!@#$%^&*()' }
    }
  }
};
```

### カスタムプリセット
```typescript
const CustomCompositions = {
  'custom-symbols': {
    label: '数字・大文字・小文字・カスタム記号を必ず含む',
    description: '記号を自由に指定',
    type: 'custom-symbols',
    requirements: {
      numbers: { min: 1, charset: '0123456789' },
      uppercase: { min: 1, charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
      lowercase: { min: 1, charset: 'abcdefghijklmnopqrstuvwxyz' },
      customSymbols: { min: 1, charset: '' } // ユーザー入力
    }
  },
  
  'custom-charsets': {
    label: 'カスタム文字種を必ず含む',
    description: '文字種を自由に指定',
    type: 'custom-charsets',
    requirements: {} // 完全にユーザー定義
  }
};
```

---

## 🎨 UI設計

### フロントエンド型定義
```typescript
interface PasswordCriteriaExtended {
  // 基本設定
  length: number;
  count: number;
  
  // 構成プリセット
  composition: string; // プリセット選択
  
  // 基本文字種
  useNumbers: boolean;
  useUppercase: boolean;
  useLowercase: boolean;
  useSymbols: boolean;
  
  // カスタム設定
  customSymbols?: string;
  customCharsets?: CustomCharsetRequirement[];
  
  // 除外オプション
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

interface CustomCharsetRequirement {
  id: string;
  name: string;
  charset: string;
  min: number;
  enabled: boolean;
}
```

### UI コンポーネント構成
```typescript
// 構成選択セクション
<CompositionSelector 
  value={composition}
  onChange={handleCompositionChange}
  compositions={availableCompositions}
/>

// カスタム記号入力（custom-symbols選択時）
<CustomSymbolsInput 
  value={customSymbols}
  onChange={setCustomSymbols}
  visible={composition === 'custom-symbols'}
/>

// カスタム文字種設定（custom-charsets選択時）
<CustomCharsetsEditor 
  charsets={customCharsets}
  onChange={setCustomCharsets}
  visible={composition === 'custom-charsets'}
/>
```

---

## ⚙️ バックエンド設計

### API エンドポイント
```typescript
// パスワード生成API（拡張版）
POST /api/password/generate
Content-Type: application/json

{
  "length": 12,
  "count": 50,
  "composition": "custom-symbols",
  "customSymbols": "$@_#&?",
  "excludeSimilar": true,
  "customCharsets": [
    {
      "name": "vowels",
      "charset": "aeiou",
      "min": 1
    }
  ]
}
```

### レスポンス形式
```typescript
interface PasswordGenerationResponse {
  success: boolean;
  data: {
    passwords: string[];
    strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    estimatedCrackTime: string;
    criteria: PasswordCriteriaExtended;
    generatedAt: string;
    composition: {
      usedPreset: string;
      appliedRequirements: RequirementSummary[];
    };
  };
  tdMessage: string;
  timestamp: string;
  requestId: string;
}

interface RequirementSummary {
  name: string;
  charset: string;
  requiredCount: number;
  actualCount: number;
  satisfied: boolean;
}
```

### 生成アルゴリズム
```typescript
class CompositionPasswordGenerator {
  generateWithComposition(criteria: PasswordCriteriaExtended): string[] {
    const passwords: string[] = [];
    
    for (let i = 0; i < criteria.count; i++) {
      const password = this.generateSinglePassword(criteria);
      passwords.push(password);
    }
    
    return passwords;
  }
  
  private generateSinglePassword(criteria: PasswordCriteriaExtended): string {
    let password = '';
    let remainingLength = criteria.length;
    
    // Step 1: 必須文字種から文字を配置
    const requirements = this.getRequirements(criteria);
    for (const req of requirements) {
      for (let j = 0; j < req.min; j++) {
        const char = this.getRandomChar(req.charset);
        password += char;
        remainingLength--;
      }
    }
    
    // Step 2: 残りの文字数をランダム生成
    const allChars = this.buildAllowedCharset(criteria);
    for (let j = 0; j < remainingLength; j++) {
      const char = this.getRandomChar(allChars);
      password += char;
    }
    
    // Step 3: シャッフル
    return this.shuffleString(password);
  }
  
  private getRequirements(criteria: PasswordCriteriaExtended): Requirement[] {
    // 構成プリセットに基づく要件取得
    // カスタム設定の処理
    // 除外オプションの適用
  }
}
```

---

## 🔧 実装詳細

### フロントエンド実装ファイル

#### 1. components/CompositionSelector.tsx
```typescript
interface CompositionSelectorProps {
  value: string;
  onChange: (composition: string) => void;
  compositions: CompositionDefinition[];
}

export const CompositionSelector: React.FC<CompositionSelectorProps> = ({
  value,
  onChange,
  compositions
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">
        構成プリセット
      </label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        {compositions.map(comp => (
          <option key={comp.id} value={comp.id}>
            {comp.label}
          </option>
        ))}
      </select>
      
      {value !== 'none' && (
        <p className="text-sm text-gray-600 mt-2">
          {compositions.find(c => c.id === value)?.description}
        </p>
      )}
    </div>
  );
};
```

#### 2. components/CustomSymbolsInput.tsx
```typescript
interface CustomSymbolsInputProps {
  value: string;
  onChange: (symbols: string) => void;
  visible: boolean;
}

export const CustomSymbolsInput: React.FC<CustomSymbolsInputProps> = ({
  value,
  onChange,
  visible
}) => {
  if (!visible) return null;
  
  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <label className="block text-sm font-medium mb-2">
        使用する記号を入力してください
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="例: $@_#&?"
        className="w-full p-2 border border-gray-300 rounded"
      />
      <div className="mt-2 space-y-1">
        <p className="text-xs text-gray-600">
          • 入力された記号から最低1文字は必ず含まれます
        </p>
        <p className="text-xs text-gray-600">
          • 推奨記号: $@_#&? (入力しやすい記号)
        </p>
      </div>
    </div>
  );
};
```

#### 3. components/CustomCharsetsEditor.tsx
```typescript
interface CustomCharsetsEditorProps {
  charsets: CustomCharsetRequirement[];
  onChange: (charsets: CustomCharsetRequirement[]) => void;
  visible: boolean;
}

export const CustomCharsetsEditor: React.FC<CustomCharsetsEditorProps> = ({
  charsets,
  onChange,
  visible
}) => {
  if (!visible) return null;
  
  const addCharset = () => {
    onChange([
      ...charsets,
      {
        id: `charset-${Date.now()}`,
        name: '',
        charset: '',
        min: 1,
        enabled: true
      }
    ]);
  };
  
  const removeCharset = (id: string) => {
    onChange(charsets.filter(cs => cs.id !== id));
  };
  
  const updateCharset = (id: string, field: keyof CustomCharsetRequirement, value: any) => {
    onChange(charsets.map(cs => 
      cs.id === id ? { ...cs, [field]: value } : cs
    ));
  };
  
  return (
    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
      <h4 className="font-medium mb-3">カスタム文字種設定</h4>
      
      {charsets.map(charset => (
        <div key={charset.id} className="flex gap-2 mb-3 p-3 bg-white rounded border">
          <input
            type="text"
            placeholder="文字種名（例: 母音）"
            value={charset.name}
            onChange={(e) => updateCharset(charset.id, 'name', e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="文字セット（例: aeiou）"
            value={charset.charset}
            onChange={(e) => updateCharset(charset.id, 'charset', e.target.value)}
            className="flex-2 p-2 border rounded"
          />
          <input
            type="number"
            min="1"
            value={charset.min}
            onChange={(e) => updateCharset(charset.id, 'min', parseInt(e.target.value))}
            className="w-16 p-2 border rounded"
          />
          <button
            onClick={() => removeCharset(charset.id)}
            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            削除
          </button>
        </div>
      ))}
      
      <button
        onClick={addCharset}
        className="w-full mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        文字種を追加
      </button>
    </div>
  );
};
```

### バックエンド実装ファイル

#### 1. services/CompositionPasswordService.ts
```typescript
import crypto from 'crypto';

interface Requirement {
  name: string;
  charset: string;
  min: number;
}

export class CompositionPasswordService {
  private readonly defaultCompositions = {
    'none': null,
    'num-upper-lower': [
      { name: 'numbers', charset: '0123456789', min: 1 },
      { name: 'uppercase', charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', min: 1 },
      { name: 'lowercase', charset: 'abcdefghijklmnopqrstuvwxyz', min: 1 }
    ],
    'num-upper-lower-symbol': [
      { name: 'numbers', charset: '0123456789', min: 1 },
      { name: 'uppercase', charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', min: 1 },
      { name: 'lowercase', charset: 'abcdefghijklmnopqrstuvwxyz', min: 1 },
      { name: 'symbols', charset: '!@#$%^&*()', min: 1 }
    ]
  };
  
  generatePasswords(criteria: PasswordCriteriaExtended): string[] {
    this.validateCriteria(criteria);
    
    const passwords: string[] = [];
    
    for (let i = 0; i < criteria.count; i++) {
      const password = this.generateSinglePassword(criteria);
      passwords.push(password);
    }
    
    return passwords;
  }
  
  private generateSinglePassword(criteria: PasswordCriteriaExtended): string {
    const requirements = this.getRequirements(criteria);
    
    if (!requirements) {
      // 通常のランダム生成
      return this.generateRandomPassword(criteria);
    }
    
    // 必須文字種を含むパスワード生成
    return this.generateWithRequirements(criteria, requirements);
  }
  
  private getRequirements(criteria: PasswordCriteriaExtended): Requirement[] | null {
    // プリセット構成の処理
    if (this.defaultCompositions[criteria.composition]) {
      return this.defaultCompositions[criteria.composition];
    }
    
    // カスタム記号の処理
    if (criteria.composition === 'custom-symbols' && criteria.customSymbols) {
      return [
        { name: 'numbers', charset: '0123456789', min: 1 },
        { name: 'uppercase', charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', min: 1 },
        { name: 'lowercase', charset: 'abcdefghijklmnopqrstuvwxyz', min: 1 },
        { name: 'customSymbols', charset: criteria.customSymbols, min: 1 }
      ];
    }
    
    // カスタム文字種の処理
    if (criteria.composition === 'custom-charsets' && criteria.customCharsets) {
      return criteria.customCharsets
        .filter(cs => cs.enabled && cs.charset)
        .map(cs => ({
          name: cs.name,
          charset: cs.charset,
          min: cs.min
        }));
    }
    
    return null;
  }
  
  private generateWithRequirements(
    criteria: PasswordCriteriaExtended, 
    requirements: Requirement[]
  ): string {
    let password = '';
    let remainingLength = criteria.length;
    
    // 必要な文字数の検証
    const totalRequired = requirements.reduce((sum, req) => sum + req.min, 0);
    if (totalRequired > criteria.length) {
      throw new Error('パスワード長が必要文字数より短すぎます');
    }
    
    // Step 1: 必須文字種から文字を配置
    for (const req of requirements) {
      for (let i = 0; i < req.min; i++) {
        const char = this.getSecureRandomChar(req.charset);
        password += char;
        remainingLength--;
      }
    }
    
    // Step 2: 残りの文字数をランダム生成
    if (remainingLength > 0) {
      const allChars = this.buildAllowedCharset(criteria, requirements);
      for (let i = 0; i < remainingLength; i++) {
        const char = this.getSecureRandomChar(allChars);
        password += char;
      }
    }
    
    // Step 3: シャッフル
    return this.shuffleString(password);
  }
  
  private getSecureRandomChar(charset: string): string {
    const randomIndex = crypto.randomInt(0, charset.length);
    return charset[randomIndex];
  }
  
  private shuffleString(str: string): string {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = crypto.randomInt(0, i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  }
  
  private buildAllowedCharset(
    criteria: PasswordCriteriaExtended,
    requirements: Requirement[]
  ): string {
    let charset = '';
    
    // 要件から文字セットを構築
    for (const req of requirements) {
      charset += req.charset;
    }
    
    // 除外オプションの適用
    if (criteria.excludeSimilar) {
      const similarChars = '0O1lI2Z5S6G8B';
      charset = charset.split('').filter(c => !similarChars.includes(c)).join('');
    }
    
    // 重複除去
    return [...new Set(charset.split(''))].join('');
  }
  
  private validateCriteria(criteria: PasswordCriteriaExtended): void {
    if (criteria.length < 1 || criteria.length > 128) {
      throw new Error('パスワード長は1-128文字の範囲で設定してください');
    }
    
    if (criteria.count < 1 || criteria.count > 1000) {
      throw new Error('生成個数は1-1000個の範囲で設定してください');
    }
    
    // カスタム設定のバリデーション
    if (criteria.composition === 'custom-charsets' && criteria.customCharsets) {
      for (const cs of criteria.customCharsets) {
        if (cs.enabled && !cs.charset) {
          throw new Error(`文字種「${cs.name}」の文字セットが空です`);
        }
      }
    }
  }
}
```

#### 2. routes/password-composition.ts
```typescript
import { Router } from 'express';
import { CompositionPasswordService } from '../services/CompositionPasswordService';
import { PasswordStrengthAnalyzer } from '../services/PasswordStrengthAnalyzer';

const router = Router();
const compositionService = new CompositionPasswordService();
const strengthAnalyzer = new PasswordStrengthAnalyzer();

router.post('/generate-with-composition', async (req, res) => {
  try {
    const criteria: PasswordCriteriaExtended = req.body;
    
    // パスワード生成
    const passwords = compositionService.generatePasswords(criteria);
    
    // 強度分析（サンプル）
    const samplePassword = passwords[0];
    const strength = strengthAnalyzer.analyze(samplePassword);
    
    // TDメッセージ生成
    const tdMessage = generateTDMessage(criteria, passwords.length, strength);
    
    const response: PasswordGenerationResponse = {
      success: true,
      data: {
        passwords,
        strength: strength.level,
        estimatedCrackTime: strength.crackTime,
        criteria,
        generatedAt: new Date().toISOString(),
        composition: {
          usedPreset: criteria.composition,
          appliedRequirements: getAppliedRequirements(criteria)
        }
      },
      tdMessage,
      timestamp: new Date().toISOString(),
      requestId: `pwd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    res.json(response);
    
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        message: error.message,
        code: 'COMPOSITION_GENERATION_ERROR'
      },
      tdMessage: 'パスワード生成でエラーが発生しました。設定を確認してください。'
    });
  }
});

function generateTDMessage(
  criteria: PasswordCriteriaExtended, 
  count: number, 
  strength: any
): string {
  const messages = [
    `${criteria.composition}構成で${count}個のパスワードを生成しました！`,
    `強度${strength.level}のパスワードができあがりました♪`,
    `必要な文字種がすべて含まれているので安心ですね！`,
    `実用的なパスワードが完成です。お疲れさまでした✨`
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

function getAppliedRequirements(criteria: PasswordCriteriaExtended): RequirementSummary[] {
  // 実際に適用された要件の詳細を返す
  return [];
}

export default router;
```

---

## 🧪 テスト仕様

### フロントエンドテスト
```typescript
// components/__tests__/CompositionSelector.test.tsx
describe('CompositionSelector', () => {
  it('プリセット選択が正しく動作する', () => {
    // テスト実装
  });
  
  it('カスタム設定時に適切な入力欄が表示される', () => {
    // テスト実装
  });
});

// components/__tests__/CustomSymbolsInput.test.tsx
describe('CustomSymbolsInput', () => {
  it('記号入力時にバリデーションが動作する', () => {
    // テスト実装
  });
});
```

### バックエンドテスト
```typescript
// services/__tests__/CompositionPasswordService.test.ts
describe('CompositionPasswordService', () => {
  it('必須文字種が確実に含まれる', () => {
    const criteria = {
      length: 12,
      count: 100,
      composition: 'num-upper-lower'
    };
    
    const passwords = service.generatePasswords(criteria);
    
    passwords.forEach(password => {
      expect(password).toMatch(/[0-9]/); // 数字
      expect(password).toMatch(/[A-Z]/); // 大文字
      expect(password).toMatch(/[a-z]/); // 小文字
    });
  });
  
  it('カスタム記号が正しく含まれる', () => {
    // テスト実装
  });
  
  it('文字数制限が正しく機能する', () => {
    // テスト実装
  });
});
```

---

## 📊 パフォーマンス要件

### 目標値
- **50個生成**: < 500ms
- **1000個生成**: < 3秒
- **メモリ使用量**: < 100MB
- **同時リクエスト**: 10req/sec

### 最適化戦略
1. **アルゴリズム最適化**: 効率的な文字選択と配置
2. **メモリ管理**: 大量生成時のメモリ効率化
3. **並列処理**: Worker thread活用（必要に応じて）
4. **キャッシュ**: 文字セット構築結果のキャッシュ

---

## 🚀 デプロイメント

### 環境設定
```bash
# 環境変数
PASSWORD_MAX_LENGTH=128
PASSWORD_MAX_COUNT=1000
PASSWORD_TIMEOUT_MS=30000
CUSTOM_CHARSET_MAX=10
```

### 運用監視
```typescript
// メトリクス収集
interface PasswordGenerationMetrics {
  totalRequests: number;
  successRate: number;
  averageResponseTime: number;
  popularCompositions: string[];
  errorCounts: Record<string, number>;
}
```

---

**🤖 TDからの総括：**
*「これで本当に実用的なパスワード生成ツールになります！どんなパスワードポリシーにも対応できて、QAエンジニアの皆様の強い味方になりそうですね♪」* 