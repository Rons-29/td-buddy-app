// CSV生成用データタイプの詳細設定定義

export type DataTypeCategory = 
  | 'text' 
  | 'number' 
  | 'email' 
  | 'phone' 
  | 'date' 
  | 'boolean' 
  | 'uuid' 
  | 'url' 
  | 'address' 
  | 'name' 
  | 'company'
  | 'color'
  | 'age'
  | 'custom';

// テキスト設定
export interface TextSettings {
  type: 'japanese' | 'english' | 'mixed' | 'custom';
  minLength: number;
  maxLength: number;
  includeNumbers: boolean;
  includeSymbols: boolean;
  customCharset?: string;
  format?: 'sentence' | 'word' | 'paragraph' | 'title';
}

// 数値設定  
export interface NumberSettings {
  type: 'integer' | 'decimal' | 'currency' | 'percentage';
  min: number;
  max: number;
  decimals?: number;
  allowNegative: boolean;
  prefix?: string;
  suffix?: string;
  thousandsSeparator: boolean;
}

// メールアドレス設定
export interface EmailSettings {
  domainType: 'common' | 'business' | 'custom' | 'mixed';
  customDomains?: string[];
  includeSubdomain: boolean;
  nameStyle: 'realistic' | 'random' | 'sequential';
}

// 電話番号設定
export interface PhoneSettings {
  type: 'mobile' | 'landline' | 'mixed' | 'international';
  country: 'japan' | 'usa' | 'global';
  format: 'hyphen' | 'parentheses' | 'space' | 'none';
  includeCountryCode: boolean;
}

// 日付設定
export interface DateSettings {
  format: 'iso' | 'japanese' | 'american' | 'european' | 'custom';
  customFormat?: string;
  includeTime: boolean;
  timeFormat?: '12h' | '24h';
  era?: 'modern' | 'historical' | 'future' | 'mixed';
  startYear?: number;
  endYear?: number;
}

// ブール値設定
export interface BooleanSettings {
  format: 'true/false' | 'yes/no' | '1/0' | 'on/off' | 'enabled/disabled' | 'active/inactive';
  trueRatio: number; // 0-100
}

// UUID設定
export interface UuidSettings {
  version: 'v1' | 'v4' | 'mixed';
  format: 'standard' | 'short' | 'no-hyphens';
}

// URL設定
export interface UrlSettings {
  protocol: 'https' | 'http' | 'mixed';
  domainType: 'common' | 'random' | 'tech' | 'business';
  includePath: boolean;
  includeQuery: boolean;
  includeFragment: boolean;
}

// 住所設定
export interface AddressSettings {
  country: 'japan' | 'usa' | 'global';
  format: 'full' | 'postal' | 'city-only' | 'prefecture-only';
  includePostalCode: boolean;
  realistic: boolean;
}

// 氏名設定
export interface NameSettings {
  type: 'japanese' | 'western' | 'mixed';
  format: 'full' | 'last-first' | 'first-last' | 'first-only' | 'last-only';
  includeHonorifics: boolean;
  gender: 'mixed' | 'male' | 'female';
}

// 会社名設定
export interface CompanySettings {
  type: 'japanese' | 'western' | 'mixed';
  size: 'startup' | 'sme' | 'enterprise' | 'mixed';
  industry: 'tech' | 'finance' | 'retail' | 'manufacturing' | 'service' | 'mixed';
  includeSuffix: boolean; // 株式会社、Inc.等
}

// カラー設定
export interface ColorSettings {
  format: 'hex' | 'rgb' | 'hsl' | 'css-name';
  caseType: 'upper' | 'lower';
  includeAlpha: boolean;
  colorScheme: 'random' | 'warm' | 'cool' | 'monochrome' | 'pastel' | 'vivid';
}

// 統合データタイプ設定
export interface DataTypeSettings {
  category: DataTypeCategory;
  text?: TextSettings;
  number?: NumberSettings;
  email?: EmailSettings;
  phone?: PhoneSettings;
  date?: DateSettings;
  boolean?: BooleanSettings;
  uuid?: UuidSettings;
  url?: UrlSettings;
  address?: AddressSettings;
  name?: NameSettings;
  company?: CompanySettings;
  color?: ColorSettings;
  customPattern?: string;
}

// カラム設定
export interface ColumnConfig {
  id: string;
  name: string;
  dataType: DataTypeCategory;
  settings?: any;
  nullable: boolean;
  nullRatio: number; // 0-100
  unique: boolean;
}

// CSV設定全体
export interface CsvConfig {
  rowCount: number;
  outputFormat: 'csv' | 'tsv' | 'json' | 'xlsx';
  includeHeader: boolean;
  encoding: 'utf-8' | 'utf-8-bom' | 'shift-jis' | 'euc-jp';
  columns: ColumnConfig[];
}

// プリセット定義
export interface DataTypePreset {
  id: string;
  name: string;
  description: string;
  category: DataTypeCategory;
  settings: DataTypeSettings;
  examples: string[];
}

// よく使うプリセット
export const DEFAULT_PRESETS: DataTypePreset[] = [
  // テキストプリセット
  {
    id: 'text-japanese-name',
    name: '日本人の氏名',
    description: '日本人らしい氏名（姓名）',
    category: 'name',
    settings: {
      category: 'name',
      name: {
        type: 'japanese',
        format: 'full',
        includeHonorifics: false,
        gender: 'mixed'
      }
    },
    examples: ['田中 太郎', '佐藤 花子', '山田 一郎']
  },
  {
    id: 'text-product-name',
    name: '商品名',
    description: 'ECサイト向けの商品名',
    category: 'text',
    settings: {
      category: 'text',
      text: {
        type: 'mixed',
        minLength: 5,
        maxLength: 30,
        includeNumbers: true,
        includeSymbols: false,
        format: 'title'
      }
    },
    examples: ['iPhone 15 Pro', 'ワイヤレスマウス M705', 'コーヒーメーカー CM-101']
  },
  
  // 数値プリセット
  {
    id: 'number-price',
    name: '価格（円）',
    description: '日本円での商品価格',
    category: 'number',
    settings: {
      category: 'number',
      number: {
        type: 'currency',
        min: 100,
        max: 100000,
        decimals: 0,
        allowNegative: false,
        suffix: '円',
        thousandsSeparator: true
      }
    },
    examples: ['1,200円', '15,800円', '99,800円']
  },
  {
    id: 'number-age',
    name: '年齢',
    description: '人の年齢（整数）',
    category: 'number',
    settings: {
      category: 'number',
      number: {
        type: 'integer',
        min: 18,
        max: 100,
        allowNegative: false,
        thousandsSeparator: false
      }
    },
    examples: ['25', '34', '67']
  },

  // メールアドレスプリセット
  {
    id: 'email-business',
    name: 'ビジネスメール',
    description: '企業ドメインのメールアドレス',
    category: 'email',
    settings: {
      category: 'email',
      email: {
        domainType: 'business',
        includeSubdomain: false,
        nameStyle: 'realistic'
      }
    },
    examples: ['tanaka@company.co.jp', 'sales@business.com', 'info@startup.jp']
  },

  // 電話番号プリセット
  {
    id: 'phone-mobile-jp',
    name: '携帯電話（日本）',
    description: '日本の携帯電話番号',
    category: 'phone',
    settings: {
      category: 'phone',
      phone: {
        type: 'mobile',
        country: 'japan',
        format: 'hyphen',
        includeCountryCode: false
      }
    },
    examples: ['090-1234-5678', '080-9876-5432', '070-1111-2222']
  },

  // 日付プリセット
  {
    id: 'date-japanese',
    name: '日本形式の日付',
    description: 'YYYY/MM/DD形式の日付',
    category: 'date',
    settings: {
      category: 'date',
      date: {
        format: 'japanese',
        includeTime: false,
        era: 'modern',
        startYear: 2020,
        endYear: 2030
      }
    },
    examples: ['2024/01/15', '2025/03/22', '2023/12/08']
  }
]; 