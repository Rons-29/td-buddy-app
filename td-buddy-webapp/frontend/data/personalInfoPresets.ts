import { PersonalInfoPreset } from '../types/personalInfo';

export const PERSONAL_INFO_PRESETS: Record<string, PersonalInfoPreset> = {
  basic: {
    id: 'basic',
    name: '基本情報',
    description: '氏名・メール・電話番号の基本セット',
    fields: ['fullName', 'email', 'phone'],
    defaultCount: 5,
    icon: '👤'
  },
  
  contact: {
    id: 'contact',
    name: '連絡先完全版',
    description: '氏名・全連絡先情報・住所',
    fields: ['fullName', 'email', 'phone', 'mobile', 'address'],
    defaultCount: 3,
    icon: '📞'
  },
  
  profile: {
    id: 'profile',
    name: 'プロフィール',
    description: '個人プロフィール情報（年齢・性別含む）',
    fields: ['fullName', 'email', 'age', 'gender', 'birthDate'],
    defaultCount: 10,
    icon: '📋'
  },
  
  business: {
    id: 'business',
    name: 'ビジネス情報',
    description: '会社・職業情報を含む業務用データ',
    fields: ['fullName', 'email', 'phone', 'company', 'jobTitle', 'industry'],
    defaultCount: 8,
    icon: '💼'
  },
  
  complete: {
    id: 'complete',
    name: '完全版',
    description: 'すべての項目を含む完全なプロフィール',
    fields: [
      'fullName', 'email', 'phone', 'mobile', 'address', 
      'age', 'gender', 'birthDate', 'company', 'jobTitle', 
      'industry', 'website', 'socialId'
    ],
    defaultCount: 2,
    icon: '🎯'
  },
  
  ecommerce: {
    id: 'ecommerce',
    name: 'EC サイト用',
    description: 'オンラインショップの顧客データ',
    fields: ['fullName', 'email', 'phone', 'address', 'age', 'gender'],
    defaultCount: 15,
    icon: '🛒'
  },
  
  healthcare: {
    id: 'healthcare',
    name: '医療・ヘルスケア',
    description: '医療機関で使用する基本的な患者情報',
    fields: ['fullName', 'phone', 'address', 'age', 'gender', 'birthDate'],
    defaultCount: 5,
    icon: '🏥'
  },
  
  education: {
    id: 'education',
    name: '教育機関',
    description: '学校・教育機関での学生・保護者情報',
    fields: ['fullName', 'email', 'phone', 'address', 'age'],
    defaultCount: 20,
    icon: '🎓'
  },
  
  minimal: {
    id: 'minimal',
    name: '最小限',
    description: 'テスト用の最小限データ（氏名のみ）',
    fields: ['fullName'],
    defaultCount: 50,
    icon: '📝'
  },
  
  sample: {
    id: 'sample',
    name: 'サンプル生成',
    description: 'デモ・プレゼン用のサンプルデータ',
    fields: ['fullName', 'email', 'company', 'jobTitle'],
    defaultCount: 10,
    icon: '🎨'
  }
};

// プリセットの配列版（UIでの表示順序用）
export const PRESET_ORDER = [
  'basic', 'contact', 'profile', 'business', 'complete',
  'ecommerce', 'healthcare', 'education', 'minimal', 'sample'
];

// フィールドのラベルと説明
export const FIELD_LABELS: Record<string, { label: string; description: string; icon: string }> = {
  fullName: {
    label: '氏名',
    description: '漢字・ひらがな・カタカナ・ローマ字',
    icon: '👤'
  },
  email: {
    label: 'メールアドレス',
    description: 'フリー・企業ドメイン対応',
    icon: '📧'
  },
  phone: {
    label: '電話番号',
    description: '固定電話（地域番号対応）',
    icon: '☎️'
  },
  mobile: {
    label: '携帯電話',
    description: '携帯電話番号',
    icon: '📱'
  },
  address: {
    label: '住所',
    description: '郵便番号・都道府県・市・番地',
    icon: '🏠'
  },
  birthDate: {
    label: '生年月日',
    description: 'YYYY-MM-DD形式',
    icon: '🎂'
  },
  age: {
    label: '年齢',
    description: '数値（歳）',
    icon: '🔢'
  },
  gender: {
    label: '性別',
    description: '男性・女性・その他',
    icon: '⚧️'
  },
  company: {
    label: '会社名',
    description: '企業名・組織名',
    icon: '🏢'
  },
  jobTitle: {
    label: '職種',
    description: '職業・役職名',
    icon: '💼'
  },
  industry: {
    label: '業界',
    description: '業界・分野',
    icon: '🏭'
  },
  website: {
    label: 'ウェブサイト',
    description: 'URL形式',
    icon: '🌐'
  },
  socialId: {
    label: 'SNS ID',
    description: 'ソーシャルメディアID',
    icon: '📱'
  }
}; 