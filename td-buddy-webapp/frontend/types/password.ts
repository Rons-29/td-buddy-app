// パスワード生成設定の型
export interface PasswordCriteria {
  length: number;
  count: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
  customCharacters?: string;

  // 拡張文字種オプション
  includeExtendedSymbols?: boolean; // 拡張記号 (※◆★)
  includeBrackets?: boolean; // 括弧類 (()[]{})
  includeMathSymbols?: boolean; // 数学記号 (+-×÷)
  includeUnicode?: boolean; // Unicode文字

  // 特殊オプション
  includeReadable?: boolean; // 読みやすい文字のみ
  includePronounceable?: boolean; // 発音可能パターン
  excludeCharacters?: string; // 除外文字

  // 新機能用
  mustIncludeCharTypes?: string[]; // 必ず含む文字種
  customSymbols?: string; // カスタム記号
  excludeSimilar?: boolean; // 似ている文字を除外
  excludeSequential?: boolean; // 連続文字を避ける
  // 高度な設定
  minEntropy?: number; // 最小エントロピー（ビット）
  avoidDictionary?: boolean; // 辞書攻撃対策
  noDuplicates?: boolean; // 重複パスワード除去
  maxRetries?: number; // 生成再試行回数
}

// カスタム文字種定義（CustomCharsetsEditor用）
export interface CustomCharset {
  id: string;
  name: string;
  charset: string;
  min: number;
  enabled: boolean;
  color: string;
}

// 構成プリセットの型
export interface PasswordPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: Partial<PasswordCriteria>;
  isDefault?: boolean;
  isCustom?: boolean;
  category: 'security' | 'custom' | 'web' | 'enterprise' | 'other';
}

// パスワード生成結果の型
export interface PasswordResult {
  passwords: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  estimatedCrackTime: string;
  criteria: PasswordCriteria;
  generatedAt: string;
}

// API レスポンスの型
export interface APIResponse {
  success: boolean;
  data: PasswordResult;
  brewMessage: string;
  timestamp: string;
  requestId: string;
}

// Brewキャラクター状態の型（TDCharacterコンポーネントと整合性を保つ）
export interface TDState {
  emotion:
    | 'happy'
    | 'excited'
    | 'thinking'
    | 'confused'
    | 'sad'
    | 'working'
    | 'success'
    | 'worried'
    | 'sleepy'
    | 'warning'
    | 'error'
    | 'curious'
    | 'friendly';
  animation:
    | 'none'
    | 'bounce'
    | 'wiggle'
    | 'pulse'
    | 'spin'
    | 'heartbeat'
    | 'float';
  message: string;
  showSpeechBubble: boolean;
}

// プリセット設定の型
export interface PresetConfig {
  selectedPresetId?: string;
  customPresets: PasswordPreset[];
}
