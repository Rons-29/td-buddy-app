// 数値・真偽値生成オプション
export interface NumberBooleanOptions {
  type: 'integer' | 'float' | 'percentage' | 'currency' | 'scientific' | 'boolean' | 'special';
  
  // 数値範囲設定
  min?: number;
  max?: number;
  
  // 小数点設定
  decimals?: number;
  precision?: number;
  
  // 通貨設定
  currency?: 'JPY' | 'USD' | 'EUR' | 'GBP' | 'CNY';
  locale?: string;
  
  // 真偽値設定
  booleanFormat?: 'boolean' | 'string' | 'number' | 'yesno' | 'onoff';
  trueProbability?: number; // 0-1の確率
  
  // フォーマット設定
  useThousandsSeparator?: boolean;
  customPrefix?: string;
  customSuffix?: string;
  
  // 特殊値設定
  allowNaN?: boolean;
  allowInfinity?: boolean;
  allowNegativeZero?: boolean;
  
  // 分布設定
  distribution?: 'uniform' | 'normal';
  mean?: number;
  standardDeviation?: number;
}

// 生成された数値・真偽値
export interface GeneratedNumberBoolean {
  id: string;
  value: any;
  rawValue: number | boolean;
  formattedValue: string;
  type: string;
  options: NumberBooleanOptions;
  metadata: {
    isInteger: boolean;
    isNegative: boolean;
    isSpecial: boolean;
    digits: number;
    category: string;
  };
  tdMessage: string;
  generatedAt: Date;
}

// API応答型
export interface NumberBooleanGenerationResult {
  success: boolean;
  data: GeneratedNumberBoolean[];
  count: number;
  options: NumberBooleanOptions;
  message: string;
  tdMessage: string;
  generatedAt: Date;
}

// プリセット
export interface NumberBooleanPreset {
  id: string;
  name: string;
  description: string;
  type: NumberBooleanOptions['type'];
  options: Partial<NumberBooleanOptions>;
  category: 'basic' | 'currency' | 'percentage' | 'scientific' | 'boolean' | 'advanced';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon?: string;
  use_cases?: string[];
}

// UI状態管理型
export interface NumberBooleanUIState {
  isGenerating: boolean;
  selectedPreset: NumberBooleanPreset | null;
  selectedType: NumberBooleanOptions['type'];
  generatedData: GeneratedNumberBoolean[];
  error: string | null;
  showAdvancedOptions: boolean;
  copyMessage: string | null;
}

// ユースケース
export interface NumberBooleanUseCase {
  id: string;
  title: string;
  description: string;
  category: 'testing' | 'development' | 'database' | 'analysis' | 'performance' | 'business';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  
  scenario: {
    description: string;
    problem: string;
    solution: string;
  };
  
  examples: {
    title: string;
    before: string;
    after: string;
    preset: string;
    code?: string;
  }[];
  
  benefits: string[];
  relatedTypes: NumberBooleanOptions['type'][];
}

// 統計情報
export interface NumberBooleanStatistics {
  today: number;
  thisWeek: number;
  typeBreakdown: Array<{
    type: string;
    count: number;
  }>;
  recentActivity: Array<{
    date: string;
    count: number;
  }>;
} 