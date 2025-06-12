// 個人情報醸造関連の型定義

export interface PersonalInfoGenerateRequest {
  count: number;
  locale: 'ja' | 'en';
  includeFields: PersonalInfoField[];
  ageRange?: AgeRange;
  gender?: Gender;
  addressSettings?: AddressSettings;
  contactSettings?: ContactSettings;
  jobSettings?: JobSettings;
}

export interface PersonalInfoItem {
  id: string;
  generatedAt: string;
  locale: 'ja' | 'en';
  fullName?: NameData;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: AddressData;
  birthDate?: string;
  age?: number;
  gender?: Gender;
  company?: string;
  jobTitle?: string;
  industry?: string;
  website?: string;
  socialId?: string;
}

export interface NameData {
  kanji: string;
  hiragana: string;
  katakana: string;
  romaji: string;
  firstName: string;
  lastName: string;
}

export interface AddressData {
  full: string;
  postalCode: string;
  prefecture: string;
  city: string;
  street: string;
  building?: string;
}

export interface AgeRange {
  min: number;
  max: number;
}

export interface AddressSettings {
  includePrefectures?: string[];
  includeBuilding?: boolean;
}

export interface ContactSettings {
  emailDomains?: string[];
  phoneAreaCodes?: string[];
  includeMobile?: boolean;
}

export interface JobSettings {
  industries?: string[];
  includeCompany?: boolean;
}

export type Gender = 'male' | 'female' | 'other' | 'random';

export type PersonalInfoField = 
  | 'fullName'
  | 'email' 
  | 'phone'
  | 'mobile'
  | 'address'
  | 'birthDate'
  | 'age'
  | 'gender'
  | 'company'
  | 'jobTitle'
  | 'industry'
  | 'website'
  | 'socialId';

export interface PersonalInfoResult {
  persons: PersonalInfoItem[];
  criteria: PersonalInfoGenerateRequest;
  statistics: {
    totalGenerated: number;
    uniqueCount: number;
    generationTime: number;
    duplicatesRemoved: number;
  };
  generatedAt: string;
  expiresAt: string;
}

export interface PersonalInfoAPIResponse {
  success: boolean;
  data: PersonalInfoResult;
  responseTime: number;
  generatedAt: string;
}

export interface PersonalInfoErrorResponse {
  success: false;
  error: string;
  details?: string;
  code?: string;
}

// UI状態管理用の型
export interface PersonalInfoFormState {
  count: number;
  locale: 'ja' | 'en';
  selectedFields: Set<PersonalInfoField>;
  ageRange: AgeRange;
  gender: Gender;
  showAdvanced: boolean;
  includeBuilding: boolean;
  includeMobile: boolean;
  includeCompany: boolean;
}

export interface PersonalInfoUIState {
  isGenerating: boolean;
  result: PersonalInfoResult | null;
  error: string | null;
  copyMessage: string | null;
  copiedIndex: number | null;
  showExportOptions: boolean;
  displayLimit: number;
  showAllResults: boolean;
}

// フィールド設定プリセット
export interface PersonalInfoPreset {
  id: string;
  name: string;
  description: string;
  fields: PersonalInfoField[];
  defaultCount: number;
  icon: string;
}

// CSV エクスポート用の型
export interface CSVExportOptions {
  filename?: string;
  includeBOM?: boolean;
  encoding?: 'utf-8' | 'shift_jis';
  delimiter?: ',' | ';' | '\t';
} 