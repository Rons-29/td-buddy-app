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
  // 新機能用
  mustIncludeCharTypes?: string[]; // 必ず含む文字種
  customSymbols?: string; // カスタム記号
  excludeSimilar?: boolean; // 似ている文字を除外
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
  tdMessage: string;
  timestamp: string;
  requestId: string;
}

// TDキャラクター状態の型（TDCharacterコンポーネントと整合性を保つ）
export interface TDState {
  emotion: 'happy' | 'excited' | 'thinking' | 'confused' | 'sad' | 'working' | 'success' | 'worried' | 'sleepy' | 'warning' | 'error' | 'curious' | 'friendly';
  animation: 'none' | 'bounce' | 'wiggle' | 'pulse' | 'spin' | 'heartbeat' | 'float';
  message: string;
  showSpeechBubble: boolean;
}

// プリセット設定の型
export interface PresetConfig {
  selectedPresetId?: string;
  customPresets: PasswordPreset[];
} 