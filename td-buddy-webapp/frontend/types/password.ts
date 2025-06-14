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

  // 脆弱性テスト用
  isVulnerable?: boolean; // 脆弱性パスワードフラグ
  vulnerabilityType?:
    | 'common'
    | 'dictionary'
    | 'sequential'
    | 'keyboard'
    | 'personal'
    | 'repetitive'; // 脆弱性の種類
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
  category:
    | 'security'
    | 'vulnerability'
    | 'custom'
    | 'web'
    | 'enterprise'
    | 'other';
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

// 脆弱性分析結果の型
export interface VulnerabilityAnalysis {
  vulnerabilityScore: number; // 0-100 (100が最も脆弱)
  vulnerabilities: VulnerabilityIssue[];
  recommendations: string[];
  educationalContent: EducationalContent;
  comparisonExample?: {
    weakPassword: string;
    strongPassword: string;
    explanation: string;
  };
}

export interface VulnerabilityIssue {
  type:
    | 'length'
    | 'dictionary'
    | 'pattern'
    | 'character-set'
    | 'predictability'
    | 'common';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  examples?: string[];
}

export interface EducationalContent {
  title: string;
  explanation: string;
  whyVulnerable: string[];
  attackMethods: AttackMethod[];
  realWorldExamples: string[];
}

export interface AttackMethod {
  name: string;
  description: string;
  timeToBreak: string;
  difficulty: 'trivial' | 'easy' | 'medium' | 'hard';
}

// エクスポート機能の型
export interface ExportOptions {
  format: 'csv' | 'json' | 'txt' | 'xlsx';
  includeAnalysis: boolean;
  includeMetadata: boolean;
  groupByVulnerability: boolean;
}

export interface ExportData {
  passwords: string[];
  metadata: {
    generatedAt: string;
    preset: string;
    criteria: PasswordCriteria;
    totalCount: number;
  };
  analysis?: VulnerabilityAnalysis[];
}
