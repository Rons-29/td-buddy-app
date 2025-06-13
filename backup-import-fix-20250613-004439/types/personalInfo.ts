// 個人情報生成機能の型定義

export interface PersonalInfoGenerateRequest {
  count: number;                     // 生成個数 (1-100)
  locale: 'ja' | 'en';              // ロケール（日本語・英語）
  includeFields: PersonalInfoField[]; // 含める項目
  
  // 年齢・性別フィルター
  ageRange?: {
    min: number;                     // 最小年齢 (18-100)
    max: number;                     // 最大年齢 (18-100)
  };
  gender?: 'male' | 'female' | 'random'; // 性別指定
  
  // 住所設定
  addressSettings?: {
    prefectureOnly?: boolean;        // 都道府県のみ
    includeBuilding?: boolean;       // 建物名を含む
    realPostalCode?: boolean;        // 実在郵便番号を使用
  };
  
  // 連絡先設定
  contactSettings?: {
    mobileOnly?: boolean;            // 携帯電話のみ
    businessEmail?: boolean;         // ビジネスメール形式
    freeEmail?: boolean;             // フリーメール使用
  };
  
  // 職業・会社設定
  jobSettings?: {
    includeTitle?: boolean;          // 役職を含む
    companySize?: 'small' | 'medium' | 'large' | 'random'; // 会社規模
    industryType?: string[];         // 業界指定
  };
}

export type PersonalInfoField = 
  | 'fullName'       // 氏名（漢字）
  | 'kanaName'       // 氏名（カナ）
  | 'email'          // メールアドレス
  | 'phone'          // 電話番号
  | 'mobile'         // 携帯電話
  | 'address'        // 住所
  | 'postalCode'     // 郵便番号
  | 'birthDate'      // 生年月日
  | 'age'            // 年齢
  | 'gender'         // 性別
  | 'company'        // 会社名
  | 'jobTitle'       // 職種・役職
  | 'website'        // ウェブサイト
  | 'socialId';      // SNS ID

export interface PersonalInfoItem {
  id: string;                        // 一意ID
  
  // 氏名情報
  fullName?: {
    kanji: string;                   // 漢字氏名
    firstName: string;              // 名前
    lastName: string;               // 苗字
  };
  
  // カナ専用フィールド（別カラム表示用）
  kanaName?: string;                 // カタカナ氏名（独立フィールド）
  
  // 連絡先情報
  email?: string;                    // メールアドレス
  phone?: string;                    // 固定電話
  mobile?: string;                   // 携帯電話
  
  // 住所情報
  address?: {
    full: string;                    // 完全住所
    postalCode: string;             // 郵便番号
    prefecture: string;             // 都道府県
    city: string;                   // 市区町村
    street: string;                 // 番地
    building?: string;              // 建物名
  };
  
  // 個人情報
  birthDate?: string;               // 生年月日 (YYYY-MM-DD)
  age?: number;                     // 年齢
  gender?: 'male' | 'female';       // 性別
  
  // 職業情報
  company?: string;                 // 会社名
  jobTitle?: string;                // 職種・役職
  industry?: string;                // 業界
  
  // その他
  website?: string;                 // ウェブサイト
  socialId?: string;                // SNS ID
  
  // メタデータ
  generatedAt: string;              // 生成日時
  locale: 'ja' | 'en';             // ロケール
}

export interface PersonalInfoGenerateResponse {
  persons: PersonalInfoItem[];      // 生成された個人情報一覧
  criteria: PersonalInfoGenerateRequest; // 生成条件
  statistics: {
    totalGenerated: number;         // 生成件数
    uniqueCount: number;            // 重複除去後件数
    generationTime: number;         // 生成時間(ms)
    duplicatesRemoved: number;      // 除去された重複数
  };
  generatedAt: string;              // 生成日時
  expiresAt: string;                // 有効期限
}

// 名前生成用のデータ型
export interface NameData {
  firstNames: {
    male: string[];
    female: string[];
  };
  lastNames: string[];
  kanaMapping: Record<string, string>; // 漢字→カナ対応表
}

// 住所生成用のデータ型
export interface AddressData {
  prefectures: Prefecture[];
  cities: Record<string, City[]>;    // 都道府県ごとの市区町村
  streetPatterns: string[];          // 番地パターン
  buildingPatterns: string[];        // 建物名パターン
}

export interface Prefecture {
  name: string;                      // 都道府県名
  code: string;                      // 都道府県コード
  region: string;                    // 地方
  postalCodePrefix: string[];        // 郵便番号プレフィックス
}

export interface City {
  name: string;                      // 市区町村名
  postalCodes: string[];             // 郵便番号一覧
  type: 'city' | 'ward' | 'town' | 'village'; // 種別
}

// 会社・職業生成用のデータ型
export interface CompanyData {
  companies: Company[];
  jobTitles: Record<string, string[]>; // 業界ごとの職種
  industries: string[];               // 業界一覧
}

export interface Company {
  name: string;                      // 会社名
  industry: string;                  // 業界
  size: 'small' | 'medium' | 'large'; // 規模
  suffixes: string[];                // 会社名接尾辞（株式会社、有限会社等）
}

// 検証・品質チェック用
export interface ValidationResult {
  isValid: boolean;                  // 有効性
  errors: string[];                  // エラーメッセージ
  warnings: string[];                // 警告メッセージ
  quality: {
    realism: number;                 // リアリティスコア (0-100)
    diversity: number;               // 多様性スコア (0-100)
    consistency: number;             // 一貫性スコア (0-100)
  };
}

// データベース保存用の型
export interface PersonalInfoRecord {
  id?: number;
  data_hash: string;                 // データのハッシュ値
  criteria: string;                  // 生成条件（JSON）
  created_at?: string;               // 作成日時
  expires_at: string;                // 有効期限
  user_session_id?: string;          // ユーザーセッションID
  ip_address?: string;               // IPアドレス
  user_agent?: string;               // ユーザーエージェント
}

// エクスポート関連の型
export interface ExportFormat {
  format: 'csv' | 'json' | 'xlsx' | 'xml';
  options?: {
    includeHeaders?: boolean;        // ヘッダー行を含む
    encoding?: 'utf8' | 'sjis';     // 文字エンコーディング
    delimiter?: string;              // CSVデリミター
    pretty?: boolean;                // JSON整形
  };
}

export interface ExportResult {
  success: boolean;
  filename: string;                  // ファイル名
  downloadUrl: string;               // ダウンロードURL
  fileSize: number;                  // ファイルサイズ（バイト）
  recordCount: number;               // レコード数
  expiresAt: string;                 // ダウンロード期限
  error?: string;                    // エラーメッセージ
} 
