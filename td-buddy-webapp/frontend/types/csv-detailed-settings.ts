// CSVデータタイプの詳細設定型定義

export interface RandomNumberSettings {
  min: number;
  max: number;
  decimals?: number;
  isInteger: boolean;
}

export interface TextSettings {
  minWords: number;
  maxWords: number;
  language: 'ja' | 'en' | 'mixed';
  includeEmoji: boolean;
}

export interface PhoneNumberSettings {
  format: 'mobile' | 'landline' | 'both';
  prefix: string[];
  hyphenated: boolean;
}

export interface EmailSettings {
  domains: string[];
  includeNumbers: boolean;
  maxNameLength: number;
}

export interface DateTimeSettings {
  startDate: string;
  endDate: string;
  format: string;
  includeTime: boolean;
  timezone?: string;
}

export interface NameSettings {
  type: 'firstName' | 'lastName' | 'fullName';
  gender: 'male' | 'female' | 'mixed';
  locale: 'ja' | 'en' | 'mixed';
}

export interface AddressSettings {
  country: string[];
  includeBuilding: boolean;
  format: 'full' | 'simple';
  language: 'ja' | 'en';
}

export interface AutoIncrementSettings {
  start: number;
  step: number;
  prefix?: string;
  suffix?: string;
  padding: number;
}

export interface WordsSettings {
  count: number;
  category: 'general' | 'technical' | 'business' | 'random';
  language: 'ja' | 'en' | 'mixed';
}

export interface SentencesSettings {
  minSentences: number;
  maxSentences: number;
  wordsPerSentence: { min: number; max: number };
  punctuation: boolean;
  language: 'ja' | 'en' | 'mixed';
}

export interface ParagraphsSettings {
  minParagraphs: number;
  maxParagraphs: number;
  sentencesPerParagraph: { min: number; max: number };
  language: 'ja' | 'en' | 'mixed';
}

export interface IPAddressSettings {
  type: 'ipv4' | 'ipv6' | 'both';
  privateOnly: boolean;
  subnet?: string;
}

export interface MD5HashSettings {
  inputSource: 'random' | 'timestamp' | 'sequential';
  includePrefix: boolean;
  uppercase: boolean;
}

// データタイプ別設定のユニオン型
export type DataTypeSettings =
  | { type: 'randomNumber'; settings: RandomNumberSettings }
  | { type: 'text'; settings: TextSettings }
  | { type: 'phoneNumber'; settings: PhoneNumberSettings }
  | { type: 'email'; settings: EmailSettings }
  | { type: 'dateTime'; settings: DateTimeSettings }
  | { type: 'date'; settings: DateTimeSettings }
  | { type: 'time'; settings: DateTimeSettings }
  | { type: 'firstName'; settings: NameSettings }
  | { type: 'lastName'; settings: NameSettings }
  | { type: 'fullName'; settings: NameSettings }
  | { type: 'country'; settings: AddressSettings }
  | { type: 'state'; settings: AddressSettings }
  | { type: 'city'; settings: AddressSettings }
  | { type: 'street'; settings: AddressSettings }
  | { type: 'zipCode'; settings: AddressSettings }
  | { type: 'autoIncrement'; settings: AutoIncrementSettings }
  | { type: 'words'; settings: WordsSettings }
  | { type: 'sentences'; settings: SentencesSettings }
  | { type: 'paragraphs'; settings: ParagraphsSettings }
  | { type: 'username'; settings: EmailSettings }
  | { type: 'domainName'; settings: EmailSettings }
  | { type: 'ipAddress'; settings: IPAddressSettings }
  | { type: 'md5Hash'; settings: MD5HashSettings };

// デフォルト設定
export const DEFAULT_SETTINGS: Record<string, any> = {
  randomNumber: {
    min: 1,
    max: 1000,
    decimals: 0,
    isInteger: true,
  } as RandomNumberSettings,

  text: {
    minWords: 1,
    maxWords: 5,
    language: 'ja',
    includeEmoji: false,
  } as TextSettings,

  phoneNumber: {
    format: 'mobile',
    prefix: ['090', '080', '070'],
    hyphenated: true,
  } as PhoneNumberSettings,

  email: {
    domains: ['example.com', 'test.co.jp', 'demo.org'],
    includeNumbers: true,
    maxNameLength: 10,
  } as EmailSettings,

  dateTime: {
    startDate: '2020-01-01',
    endDate: '2025-12-31',
    format: 'YYYY-MM-DD HH:mm:ss',
    includeTime: true,
  } as DateTimeSettings,

  firstName: {
    type: 'firstName',
    gender: 'mixed',
    locale: 'ja',
  } as NameSettings,

  lastName: {
    type: 'lastName',
    gender: 'mixed',
    locale: 'ja',
  } as NameSettings,

  fullName: {
    type: 'fullName',
    gender: 'mixed',
    locale: 'ja',
  } as NameSettings,

  country: {
    country: ['日本', 'アメリカ', 'イギリス', 'フランス', 'ドイツ'],
    includeBuilding: false,
    format: 'simple',
    language: 'ja',
  } as AddressSettings,

  state: {
    country: ['東京都', '大阪府', '神奈川県', '愛知県', '福岡県'],
    includeBuilding: false,
    format: 'simple',
    language: 'ja',
  } as AddressSettings,

  city: {
    country: ['渋谷区', '新宿区', '港区', '中央区', '千代田区'],
    includeBuilding: false,
    format: 'simple',
    language: 'ja',
  } as AddressSettings,

  street: {
    country: ['1-1-1 サンプル'],
    includeBuilding: true,
    format: 'full',
    language: 'ja',
  } as AddressSettings,

  zipCode: {
    country: ['〒'],
    includeBuilding: false,
    format: 'simple',
    language: 'ja',
  } as AddressSettings,

  autoIncrement: {
    start: 1,
    step: 1,
    prefix: '',
    suffix: '',
    padding: 0,
  } as AutoIncrementSettings,

  words: {
    count: 3,
    category: 'general',
    language: 'ja',
  } as WordsSettings,

  sentences: {
    minSentences: 1,
    maxSentences: 3,
    wordsPerSentence: { min: 5, max: 15 },
    punctuation: true,
    language: 'ja',
  } as SentencesSettings,

  paragraphs: {
    minParagraphs: 1,
    maxParagraphs: 3,
    sentencesPerParagraph: { min: 3, max: 8 },
    language: 'ja',
  } as ParagraphsSettings,

  username: {
    domains: ['user', 'test', 'demo'],
    includeNumbers: true,
    maxNameLength: 8,
  } as EmailSettings,

  domainName: {
    domains: ['example.com', 'test.co.jp', 'demo.org'],
    includeNumbers: false,
    maxNameLength: 15,
  } as EmailSettings,

  ipAddress: {
    type: 'ipv4',
    privateOnly: false,
    subnet: '',
  } as IPAddressSettings,

  md5Hash: {
    inputSource: 'random',
    includePrefix: false,
    uppercase: false,
  } as MD5HashSettings,

  // Legacy
  number: {
    min: 1,
    max: 1000,
    decimals: 0,
    isInteger: true,
  } as RandomNumberSettings,

  phone: {
    format: 'mobile',
    prefix: ['090', '080', '070'],
    hyphenated: true,
  } as PhoneNumberSettings,

  date: {
    startDate: '2020-01-01',
    endDate: '2025-12-31',
    format: 'YYYY-MM-DD',
    includeTime: false,
  } as DateTimeSettings,

  time: {
    startDate: '00:00:00',
    endDate: '23:59:59',
    format: 'HH:mm:ss',
    includeTime: true,
  } as DateTimeSettings,
};
