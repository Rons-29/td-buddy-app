# 🛠️ パスワード構成プリセット機能 実装ガイド

**🤖 TDからのメッセージ：**
*「実装の手順を詳しくまとめました！このガイドに従って進めれば、迷わずに機能を完成させられますよ♪」*

---

## 🎯 実装概要

### 実装範囲
現在の基本パスワード生成機能を拡張し、以下の機能を追加します：

1. **構成プリセット選択機能**
2. **「必ず含む」文字種指定機能**
3. **カスタム記号入力機能**
4. **カスタム文字種設定機能**
5. **個数設定（50個対応）**

### 推定作業時間
**合計：約3時間**
- フロントエンド改修：1時間30分
- バックエンド改修：1時間
- テスト・動作確認：30分

---

## 📋 実装チェックリスト

### Phase 1: 型定義・設計準備（15分）
- [ ] 新しい型定義ファイルの作成
- [ ] 既存型定義の拡張
- [ ] インターフェース設計の確認

### Phase 2: バックエンド実装（1時間）
- [ ] 構成プリセット定義の実装
- [ ] 新しいパスワード生成サービスの作成
- [ ] API エンドポイントの追加
- [ ] バリデーション機能の実装
- [ ] エラーハンドリングの追加

### Phase 3: フロントエンド実装（1時間30分）
- [ ] 構成選択コンポーネントの作成
- [ ] カスタム記号入力コンポーネントの作成
- [ ] カスタム文字種設定コンポーネントの作成
- [ ] 既存PasswordGeneratorコンポーネントの拡張
- [ ] 個数設定のデフォルト値変更

### Phase 4: 統合・テスト（30分）
- [ ] フロントエンド・バックエンド統合
- [ ] 各プリセットの動作確認
- [ ] エラーケースの確認
- [ ] TDキャラクターの反応確認

---

## 🔧 詳細実装手順

### Phase 1: 型定義・設計準備

#### 1.1 共通型定義の作成
```bash
# 新しい型定義ファイルを作成
touch td-buddy-webapp/frontend/types/password-composition.ts
```

**`types/password-composition.ts`**
```typescript
// 構成プリセット定義
export interface CompositionDefinition {
  id: string;
  label: string;
  description: string;
  type?: 'preset' | 'custom-symbols' | 'custom-charsets';
  requirements?: CompositionRequirement[];
}

// 構成要件定義
export interface CompositionRequirement {
  name: string;
  charset: string;
  min: number;
}

// カスタム文字種要件
export interface CustomCharsetRequirement {
  id: string;
  name: string;
  charset: string;
  min: number;
  enabled: boolean;
}

// 拡張されたパスワード条件
export interface PasswordCriteriaExtended {
  // 基本設定
  length: number;
  count: number;
  
  // 構成プリセット
  composition: string;
  
  // 基本文字種（composition='none'時）
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

// 生成結果
export interface CompositionPasswordResult {
  passwords: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  estimatedCrackTime: string;
  criteria: PasswordCriteriaExtended;
  generatedAt: string;
  composition: {
    usedPreset: string;
    appliedRequirements: RequirementSummary[];
  };
}

// 要件サマリー
export interface RequirementSummary {
  name: string;
  charset: string;
  requiredCount: number;
  actualCount: number;
  satisfied: boolean;
}
```

---

### Phase 2: バックエンド実装

#### 2.1 構成プリセット定義サービスの作成
```bash
# 新しいサービスファイルを作成
touch td-buddy-webapp/backend/src/services/CompositionPasswordService.ts
```

**`services/CompositionPasswordService.ts`**
```typescript
import crypto from 'crypto';

interface Requirement {
  name: string;
  charset: string;
  min: number;
}

interface PasswordCriteriaExtended {
  length: number;
  count: number;
  composition: string;
  customSymbols?: string;
  customCharsets?: Array<{
    id: string;
    name: string;
    charset: string;
    min: number;
    enabled: boolean;
  }>;
  excludeSimilar?: boolean;
  excludeAmbiguous?: boolean;
}

export class CompositionPasswordService {
  // プリセット定義
  private readonly defaultCompositions: Record<string, Requirement[] | null> = {
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

  // メイン生成メソッド
  generatePasswords(criteria: PasswordCriteriaExtended): string[] {
    this.validateCriteria(criteria);
    
    const passwords: string[] = [];
    
    for (let i = 0; i < criteria.count; i++) {
      const password = this.generateSinglePassword(criteria);
      passwords.push(password);
    }
    
    return passwords;
  }

  // 単一パスワード生成
  private generateSinglePassword(criteria: PasswordCriteriaExtended): string {
    const requirements = this.getRequirements(criteria);
    
    if (!requirements || requirements.length === 0) {
      return this.generateRandomPassword(criteria);
    }
    
    return this.generateWithRequirements(criteria, requirements);
  }

  // 要件取得
  private getRequirements(criteria: PasswordCriteriaExtended): Requirement[] | null {
    // プリセット構成
    if (this.defaultCompositions[criteria.composition]) {
      return this.defaultCompositions[criteria.composition];
    }
    
    // カスタム記号
    if (criteria.composition === 'custom-symbols' && criteria.customSymbols) {
      return [
        { name: 'numbers', charset: '0123456789', min: 1 },
        { name: 'uppercase', charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', min: 1 },
        { name: 'lowercase', charset: 'abcdefghijklmnopqrstuvwxyz', min: 1 },
        { name: 'customSymbols', charset: criteria.customSymbols, min: 1 }
      ];
    }
    
    // カスタム文字種
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

  // 要件を満たすパスワード生成
  private generateWithRequirements(
    criteria: PasswordCriteriaExtended, 
    requirements: Requirement[]
  ): string {
    let password = '';
    let remainingLength = criteria.length;
    
    // 必要文字数チェック
    const totalRequired = requirements.reduce((sum, req) => sum + req.min, 0);
    if (totalRequired > criteria.length) {
      throw new Error('パスワード長が必要文字数より短すぎます');
    }
    
    // Step 1: 必須文字種から配置
    for (const req of requirements) {
      for (let i = 0; i < req.min; i++) {
        const char = this.getSecureRandomChar(req.charset);
        password += char;
        remainingLength--;
      }
    }
    
    // Step 2: 残りをランダム生成
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

  // 通常のランダム生成（フォールバック）
  private generateRandomPassword(criteria: PasswordCriteriaExtended): string {
    // 既存のロジックを使用
    let charset = '';
    if (criteria.useNumbers) charset += '0123456789';
    if (criteria.useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (criteria.useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (criteria.useSymbols) charset += '!@#$%^&*()';
    
    if (!charset) {
      throw new Error('文字種が選択されていません');
    }
    
    let password = '';
    for (let i = 0; i < criteria.length; i++) {
      password += this.getSecureRandomChar(charset);
    }
    
    return password;
  }

  // セキュアな文字選択
  private getSecureRandomChar(charset: string): string {
    const randomIndex = crypto.randomInt(0, charset.length);
    return charset[randomIndex];
  }

  // 文字列シャッフル
  private shuffleString(str: string): string {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = crypto.randomInt(0, i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  }

  // 許可文字セット構築
  private buildAllowedCharset(
    criteria: PasswordCriteriaExtended,
    requirements: Requirement[]
  ): string {
    let charset = '';
    
    // 要件から文字セット構築
    for (const req of requirements) {
      charset += req.charset;
    }
    
    // 除外オプション適用
    if (criteria.excludeSimilar) {
      const similarChars = '0O1lI2Z5S6G8B';
      charset = charset.split('').filter(c => !similarChars.includes(c)).join('');
    }
    
    // 重複除去
    return [...new Set(charset.split(''))].join('');
  }

  // バリデーション
  private validateCriteria(criteria: PasswordCriteriaExtended): void {
    if (criteria.length < 1 || criteria.length > 128) {
      throw new Error('パスワード長は1-128文字の範囲で設定してください');
    }
    
    if (criteria.count < 1 || criteria.count > 1000) {
      throw new Error('生成個数は1-1000個の範囲で設定してください');
    }
    
    // カスタム設定バリデーション
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

#### 2.2 新しいAPIエンドポイントの追加
```bash
# 既存のパスワードルートを拡張
# td-buddy-webapp/backend/src/routes/password.ts を編集
```

**`routes/password.ts` への追加**
```typescript
import { CompositionPasswordService } from '../services/CompositionPasswordService';

const compositionService = new CompositionPasswordService();

// 新しいエンドポイントを追加
router.post('/generate-with-composition', async (req, res) => {
  try {
    const criteria = req.body;
    
    // パスワード生成
    const passwords = compositionService.generatePasswords(criteria);
    
    // 強度分析（既存のロジックを使用）
    const samplePassword = passwords[0];
    const strength = analyzePasswordStrength(samplePassword);
    
    // TDメッセージ生成
    const tdMessage = generateCompositionTDMessage(criteria, passwords.length, strength);
    
    const response = {
      success: true,
      data: {
        passwords,
        strength: strength.level,
        estimatedCrackTime: strength.crackTime,
        criteria,
        generatedAt: new Date().toISOString(),
        composition: {
          usedPreset: criteria.composition,
          appliedRequirements: [] // TODO: 実装
        }
      },
      tdMessage,
      timestamp: new Date().toISOString(),
      requestId: `pwd-comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
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

// TDメッセージ生成関数
function generateCompositionTDMessage(criteria: any, count: number, strength: any): string {
  const messages = [
    `${criteria.composition}構成で${count}個のパスワードを生成しました！`,
    `強度${strength.level}のパスワードができあがりました♪`,
    `必要な文字種がすべて含まれているので安心ですね！`,
    `実用的なパスワードが完成です。お疲れさまでした✨`
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}
```

---

### Phase 3: フロントエンド実装

#### 3.1 構成選択コンポーネントの作成
```bash
# 新しいコンポーネントファイルを作成
touch td-buddy-webapp/frontend/components/CompositionSelector.tsx
```

**`components/CompositionSelector.tsx`**
```typescript
'use client';

import React from 'react';

interface CompositionDefinition {
  id: string;
  label: string;
  description: string;
}

interface CompositionSelectorProps {
  value: string;
  onChange: (composition: string) => void;
}

export const CompositionSelector: React.FC<CompositionSelectorProps> = ({
  value,
  onChange
}) => {
  const compositions: CompositionDefinition[] = [
    {
      id: 'none',
      label: '指定なし',
      description: '選択された文字種からランダム生成'
    },
    {
      id: 'num-upper-lower',
      label: '数字・大文字・小文字を必ず含む',
      description: '0-9、A-Z、a-z から各1文字以上'
    },
    {
      id: 'num-upper-lower-symbol',
      label: '数字・大文字・小文字・記号文字を必ず含む',
      description: '0-9、A-Z、a-z、記号 から各1文字以上'
    },
    {
      id: 'custom-symbols',
      label: '数字・大文字・小文字・カスタム記号を必ず含む',
      description: '記号を自由に指定'
    },
    {
      id: 'custom-charsets',
      label: 'カスタム文字種を必ず含む',
      description: '文字種を自由に指定'
    }
  ];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        構成プリセット
      </label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

#### 3.2 カスタム記号入力コンポーネントの作成
```bash
touch td-buddy-webapp/frontend/components/CustomSymbolsInput.tsx
```

**`components/CustomSymbolsInput.tsx`**
```typescript
'use client';

import React from 'react';

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
      <label className="block text-sm font-medium text-gray-700 mb-2">
        使用する記号を入力してください
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="例: $@_#&?"
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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

#### 3.3 カスタム文字種設定コンポーネントの作成
```bash
touch td-buddy-webapp/frontend/components/CustomCharsetsEditor.tsx
```

**`components/CustomCharsetsEditor.tsx`**
```typescript
'use client';

import React from 'react';

interface CustomCharsetRequirement {
  id: string;
  name: string;
  charset: string;
  min: number;
  enabled: boolean;
}

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
      <h4 className="font-medium text-gray-700 mb-3">カスタム文字種設定</h4>
      
      {charsets.map(charset => (
        <div key={charset.id} className="flex gap-2 mb-3 p-3 bg-white rounded border">
          <input
            type="text"
            placeholder="文字種名（例: 母音）"
            value={charset.name}
            onChange={(e) => updateCharset(charset.id, 'name', e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="文字セット（例: aeiou）"
            value={charset.charset}
            onChange={(e) => updateCharset(charset.id, 'charset', e.target.value)}
            className="flex-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            min="1"
            value={charset.min}
            onChange={(e) => updateCharset(charset.id, 'min', parseInt(e.target.value))}
            className="w-16 p-2 border border-gray-300 rounded"
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

#### 3.4 PasswordGeneratorコンポーネントの拡張
```bash
# 既存のPasswordGeneratorコンポーネントを編集
# td-buddy-webapp/frontend/components/PasswordGenerator.tsx
```

**PasswordGenerator.tsxへの追加・修正箇所**

```typescript
// インポートを追加
import { CompositionSelector } from './CompositionSelector';
import { CustomSymbolsInput } from './CustomSymbolsInput';
import { CustomCharsetsEditor } from './CustomCharsetsEditor';

// 型定義を追加
interface CustomCharsetRequirement {
  id: string;
  name: string;
  charset: string;
  min: number;
  enabled: boolean;
}

// stateの追加・修正
const [criteria, setCriteria] = useState<PasswordCriteria>({
  length: 12,
  count: 50, // 3から50に変更
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: false,
  excludeAmbiguous: true,
  customCharacters: ''
});

// 新しいstateを追加
const [composition, setComposition] = useState<string>('none');
const [customSymbols, setCustomSymbols] = useState<string>('');
const [customCharsets, setCustomCharsets] = useState<CustomCharsetRequirement[]>([]);

// API呼び出し関数を修正
const generatePasswords = async () => {
  setIsGenerating(true);
  setApiError(null);
  
  // TDの反応
  setTdState(prev => ({
    ...prev,
    emotion: 'thinking',
    animation: 'wiggle',
    message: 'パスワードを生成中です... しばらくお待ちください♪',
    showSpeechBubble: true
  }));

  try {
    // 構成プリセット対応のAPIエンドポイントを使用
    const endpoint = composition !== 'none' 
      ? 'http://localhost:3001/api/password/generate-with-composition'
      : 'http://localhost:3001/api/password/generate';
    
    const requestBody = composition !== 'none' 
      ? {
          length: criteria.length,
          count: criteria.count,
          composition,
          customSymbols: composition === 'custom-symbols' ? customSymbols : undefined,
          customCharsets: composition === 'custom-charsets' ? customCharsets : undefined,
          excludeSimilar: criteria.excludeAmbiguous,
          useNumbers: criteria.includeNumbers,
          useUppercase: criteria.includeUppercase,
          useLowercase: criteria.includeLowercase,
          useSymbols: criteria.includeSymbols
        }
      : criteria;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': `td-session-${Date.now()}`,
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    setResult(data.data);

    // TDキャラクターの成功反応
    setTdState(prev => ({
      ...prev,
      emotion: 'excited',
      animation: 'heartbeat',
      message: data.tdMessage || `${data.data.strength}強度のパスワードを${data.data.passwords.length}個生成しました！`,
      showSpeechBubble: true
    }));

    setTimeout(() => {
      setTdState(prev => ({ ...prev, showSpeechBubble: false }));
    }, 3000);

  } catch (error) {
    console.error('パスワード生成エラー:', error);
    setApiError(error instanceof Error ? error.message : '不明なエラーが発生しました');
    
    setTdState(prev => ({
      ...prev,
      emotion: 'sad',
      animation: 'wiggle',
      message: 'エラーが発生しました... 設定を確認して再度お試しください',
      showSpeechBubble: true
    }));
  } finally {
    setIsGenerating(false);
  }
};

// JSXの構成選択部分を追加（設定フォームの最上部に）
<CompositionSelector 
  value={composition}
  onChange={setComposition}
/>

<CustomSymbolsInput 
  value={customSymbols}
  onChange={setCustomSymbols}
  visible={composition === 'custom-symbols'}
/>

<CustomCharsetsEditor 
  charsets={customCharsets}
  onChange={setCustomCharsets}
  visible={composition === 'custom-charsets'}
/>
```

---

### Phase 4: 統合・テスト

#### 4.1 動作確認手順

1. **開発サーバー起動**
```bash
# バックエンド
cd td-buddy-webapp/backend
npm run dev

# フロントエンド（別ターミナル）
cd td-buddy-webapp/frontend
npm run dev
```

2. **基本動作確認**
- [ ] http://localhost:3000/password にアクセス
- [ ] 構成プリセット選択欄が表示される
- [ ] 各プリセットを選択して動作確認
- [ ] 生成個数が50個に変更されている

3. **プリセット別テスト**
- [ ] 「指定なし」: 従来通りの動作
- [ ] 「数字・大文字・小文字を必ず含む」: 各文字種が含まれる
- [ ] 「数字・大文字・小文字・記号文字を必ず含む」: 記号も含まれる
- [ ] 「カスタム記号」: 入力欄が表示され、指定記号が含まれる
- [ ] 「カスタム文字種」: 文字種設定エリアが表示される

4. **エラーケース確認**
- [ ] 文字数 < 必要文字種数の場合のエラー
- [ ] 空の文字セット指定時のエラー
- [ ] 不正な文字数・個数指定時のエラー

5. **TDキャラクター確認**
- [ ] 生成開始時の反応
- [ ] 成功時のメッセージ
- [ ] エラー時のサポートメッセージ

#### 4.2 テストケース例

```typescript
// テスト例：必須文字種が含まれているか確認
const testCompositionRequirements = (passwords: string[], composition: string) => {
  switch (composition) {
    case 'num-upper-lower':
      passwords.forEach(password => {
        expect(password).toMatch(/[0-9]/); // 数字
        expect(password).toMatch(/[A-Z]/); // 大文字
        expect(password).toMatch(/[a-z]/); // 小文字
      });
      break;
    
    case 'num-upper-lower-symbol':
      passwords.forEach(password => {
        expect(password).toMatch(/[0-9]/);
        expect(password).toMatch(/[A-Z]/);
        expect(password).toMatch(/[a-z]/);
        expect(password).toMatch(/[!@#$%^&*()]/); // 記号
      });
      break;
  }
};
```

---

## 🐛 トラブルシューティング

### よくある問題と解決方法

#### 1. APIエンドポイントが見つからない
**症状**: 404 Not Found エラー
**解決**: 
- バックエンドサーバーが起動しているか確認
- ルートが正しく追加されているか確認
- CORSの設定を確認

#### 2. 構成プリセットが動作しない
**症状**: 必須文字種が含まれていない
**解決**:
- CompositionPasswordServiceの実装を確認
- 要件定義が正しいか確認
- シャッフル処理が正しく動作しているか確認

#### 3. カスタム文字種が保存されない
**症状**: 設定した文字種が無視される
**解決**:
- カスタム文字種のenabled状態を確認
- 空の文字セットが含まれていないか確認
- バリデーション処理を確認

#### 4. TDキャラクターが反応しない
**症状**: メッセージが表示されない
**解決**:
- tdStateの更新処理を確認
- showSpeechBubbleの値を確認
- タイムアウト処理を確認

---

## 📈 実装後の拡張案

### 短期拡張（1週間以内）
- [ ] プリセット保存機能（LocalStorage）
- [ ] よく使う設定の履歴機能
- [ ] パスワード強度の詳細表示

### 中期拡張（1ヶ月以内）
- [ ] 生成パフォーマンスの最適化
- [ ] エクスポート機能（CSV、JSON）
- [ ] 統計情報の表示

### 長期拡張（将来）
- [ ] Claude AI連携による自然言語設定
- [ ] 複雑なパスワードポリシー対応
- [ ] 組織向けプリセット管理

---

**🤖 TDからの激励：**
*「実装ガイドの準備完了です！段階的に進めれば必ず完成できます。困ったときはこのガイドを見返して、一歩ずつ確実に進めていきましょう。TDも一緒に応援しています♪」* 