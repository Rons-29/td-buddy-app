export interface CSVPreset {
  id: string;
  name: string;
  description: string;
  category: 'ecommerce' | 'user' | 'business' | 'system' | 'custom';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  columns: Array<{
    name: string;
    dataType: 'text' | 'number' | 'email' | 'phone' | 'date' | 'custom';
    customPattern?: string;
    required: boolean;
    description: string;
  }>;
  sampleData?: string[];
  usage: string;
  tdMessage: string;
}

export const csvPresets: CSVPreset[] = [
  // ECサイト関連
  {
    id: 'ecommerce-users',
    name: 'ECサイト ユーザーデータ',
    description: 'ECサイトの顧客情報管理用テストデータ',
    category: 'ecommerce',
    difficulty: 'beginner',
    usage: 'ユーザー管理システム、顧客分析、マーケティング施策テスト',
    tdMessage: 'ECサイトの運営には欠かせない顧客データです♪',
    columns: [
      { name: 'user_id', dataType: 'number', required: true, description: 'ユーザーID（連番）' },
      { name: 'name', dataType: 'text', required: true, description: '顧客名' },
      { name: 'email', dataType: 'email', required: true, description: 'メールアドレス' },
      { name: 'phone', dataType: 'phone', required: false, description: '電話番号' },
      { name: 'registration_date', dataType: 'date', required: true, description: '登録日' },
      { name: 'age', dataType: 'number', required: false, description: '年齢' },
      { name: 'gender', dataType: 'text', required: false, description: '性別' },
      { name: 'prefecture', dataType: 'text', required: false, description: '都道府県' },
      { name: 'purchase_count', dataType: 'number', required: false, description: '購入回数' },
      { name: 'total_amount', dataType: 'number', required: false, description: '累計購入金額' }
    ]
  },
  {
    id: 'ecommerce-products',
    name: 'ECサイト 商品データ',
    description: '商品管理・在庫管理用のテストデータ',
    category: 'ecommerce',
    difficulty: 'intermediate',
    usage: '商品管理システム、在庫管理、価格分析',
    tdMessage: '魅力的な商品データでECサイトを盛り上げましょう！',
    columns: [
      { name: 'product_id', dataType: 'text', required: true, description: '商品ID（SKU）' },
      { name: 'product_name', dataType: 'text', required: true, description: '商品名' },
      { name: 'category', dataType: 'text', required: true, description: 'カテゴリ' },
      { name: 'price', dataType: 'number', required: true, description: '価格' },
      { name: 'stock_quantity', dataType: 'number', required: true, description: '在庫数' },
      { name: 'brand', dataType: 'text', required: false, description: 'ブランド名' },
      { name: 'weight', dataType: 'number', required: false, description: '重量（g）' },
      { name: 'dimensions', dataType: 'text', required: false, description: 'サイズ（cm）' },
      { name: 'release_date', dataType: 'date', required: false, description: '発売日' },
      { name: 'rating', dataType: 'number', required: false, description: '平均評価' }
    ]
  },
  {
    id: 'ecommerce-orders',
    name: 'ECサイト 注文データ',
    description: '注文・売上管理用のテストデータ',
    category: 'ecommerce',
    difficulty: 'advanced',
    usage: '注文管理システム、売上分析、配送管理',
    tdMessage: '売上アップにつながる注文データを作成しました♪',
    columns: [
      { name: 'order_id', dataType: 'text', required: true, description: '注文ID' },
      { name: 'user_id', dataType: 'number', required: true, description: 'ユーザーID' },
      { name: 'product_id', dataType: 'text', required: true, description: '商品ID' },
      { name: 'quantity', dataType: 'number', required: true, description: '数量' },
      { name: 'unit_price', dataType: 'number', required: true, description: '単価' },
      { name: 'total_amount', dataType: 'number', required: true, description: '合計金額' },
      { name: 'order_date', dataType: 'date', required: true, description: '注文日' },
      { name: 'shipping_date', dataType: 'date', required: false, description: '発送日' },
      { name: 'delivery_date', dataType: 'date', required: false, description: '配送日' },
      { name: 'status', dataType: 'text', required: true, description: '注文ステータス' }
    ]
  },

  // ユーザー管理関連
  {
    id: 'user-employees',
    name: '従業員管理データ',
    description: '社内人事・従業員管理用のテストデータ',
    category: 'user',
    difficulty: 'intermediate',
    usage: '人事管理システム、勤怠管理、給与計算',
    tdMessage: '働きやすい職場のための従業員データです！',
    columns: [
      { name: 'employee_id', dataType: 'text', required: true, description: '従業員ID' },
      { name: 'name', dataType: 'text', required: true, description: '氏名' },
      { name: 'email', dataType: 'email', required: true, description: '社内メール' },
      { name: 'department', dataType: 'text', required: true, description: '部署' },
      { name: 'position', dataType: 'text', required: true, description: '役職' },
      { name: 'hire_date', dataType: 'date', required: true, description: '入社日' },
      { name: 'salary', dataType: 'number', required: false, description: '基本給' },
      { name: 'phone_extension', dataType: 'text', required: false, description: '内線番号' },
      { name: 'manager_id', dataType: 'text', required: false, description: '上司ID' },
      { name: 'employment_type', dataType: 'text', required: true, description: '雇用形態' }
    ]
  },
  {
    id: 'user-students',
    name: '学生管理データ',
    description: '学校・教育機関向けの学生情報テストデータ',
    category: 'user',
    difficulty: 'beginner',
    usage: '学校管理システム、成績管理、出席管理',
    tdMessage: '次世代を担う学生たちのデータです♪',
    columns: [
      { name: 'student_id', dataType: 'text', required: true, description: '学籍番号' },
      { name: 'name', dataType: 'text', required: true, description: '氏名' },
      { name: 'grade', dataType: 'number', required: true, description: '学年' },
      { name: 'class', dataType: 'text', required: true, description: 'クラス' },
      { name: 'birth_date', dataType: 'date', required: true, description: '生年月日' },
      { name: 'guardian_name', dataType: 'text', required: true, description: '保護者名' },
      { name: 'guardian_phone', dataType: 'phone', required: true, description: '保護者連絡先' },
      { name: 'address', dataType: 'text', required: false, description: '住所' },
      { name: 'enrollment_date', dataType: 'date', required: true, description: '入学日' },
      { name: 'club_activity', dataType: 'text', required: false, description: '部活動' }
    ]
  },

  // ビジネス関連
  {
    id: 'business-sales',
    name: '営業活動データ',
    description: '営業管理・売上分析用のテストデータ',
    category: 'business',
    difficulty: 'advanced',
    usage: 'CRM システム、営業分析、売上予測',
    tdMessage: '営業成績アップのためのデータ分析に活用してください！',
    columns: [
      { name: 'lead_id', dataType: 'text', required: true, description: '見込み客ID' },
      { name: 'company_name', dataType: 'text', required: true, description: '会社名' },
      { name: 'contact_person', dataType: 'text', required: true, description: '担当者名' },
      { name: 'email', dataType: 'email', required: true, description: 'メールアドレス' },
      { name: 'phone', dataType: 'phone', required: false, description: '電話番号' },
      { name: 'industry', dataType: 'text', required: false, description: '業界' },
      { name: 'company_size', dataType: 'text', required: false, description: '会社規模' },
      { name: 'budget', dataType: 'number', required: false, description: '予算' },
      { name: 'sales_stage', dataType: 'text', required: true, description: '営業ステージ' },
      { name: 'last_contact', dataType: 'date', required: false, description: '最終接触日' }
    ]
  },
  {
    id: 'business-inventory',
    name: '在庫管理データ',
    description: '倉庫・在庫管理システム用のテストデータ',
    category: 'business',
    difficulty: 'intermediate',
    usage: '在庫管理システム、物流管理、発注システム',
    tdMessage: '効率的な在庫管理でコスト削減を実現しましょう♪',
    columns: [
      { name: 'item_code', dataType: 'text', required: true, description: '商品コード' },
      { name: 'item_name', dataType: 'text', required: true, description: '商品名' },
      { name: 'warehouse_location', dataType: 'text', required: true, description: '倉庫位置' },
      { name: 'current_stock', dataType: 'number', required: true, description: '現在在庫' },
      { name: 'minimum_stock', dataType: 'number', required: true, description: '最小在庫' },
      { name: 'maximum_stock', dataType: 'number', required: true, description: '最大在庫' },
      { name: 'unit_cost', dataType: 'number', required: false, description: '単価' },
      { name: 'supplier', dataType: 'text', required: false, description: '仕入先' },
      { name: 'last_updated', dataType: 'date', required: true, description: '最終更新日' },
      { name: 'expiry_date', dataType: 'date', required: false, description: '有効期限' }
    ]
  },

  // システム関連
  {
    id: 'system-users',
    name: 'システムユーザーデータ',
    description: 'アプリケーション・システム用ユーザーデータ',
    category: 'system',
    difficulty: 'beginner',
    usage: 'アプリ開発、認証システム、ユーザー管理',
    tdMessage: 'セキュアなシステム構築のためのユーザーデータです！',
    columns: [
      { name: 'user_id', dataType: 'text', required: true, description: 'ユーザーID' },
      { name: 'username', dataType: 'text', required: true, description: 'ユーザー名' },
      { name: 'email', dataType: 'email', required: true, description: 'メールアドレス' },
      { name: 'role', dataType: 'text', required: true, description: '権限ロール' },
      { name: 'created_at', dataType: 'date', required: true, description: '作成日時' },
      { name: 'last_login', dataType: 'date', required: false, description: '最終ログイン' },
      { name: 'is_active', dataType: 'text', required: true, description: 'アクティブ状態' },
      { name: 'login_count', dataType: 'number', required: false, description: 'ログイン回数' },
      { name: 'profile_image', dataType: 'text', required: false, description: 'プロフィール画像URL' },
      { name: 'timezone', dataType: 'text', required: false, description: 'タイムゾーン' }
    ]
  },
  {
    id: 'system-logs',
    name: 'システムログデータ',
    description: 'アプリケーションログ・監査ログのテストデータ',
    category: 'system',
    difficulty: 'advanced',
    usage: 'ログ分析、システム監視、セキュリティ監査',
    tdMessage: 'システムの健康状態を把握するための重要なログデータです♪',
    columns: [
      { name: 'log_id', dataType: 'text', required: true, description: 'ログID' },
      { name: 'timestamp', dataType: 'date', required: true, description: 'タイムスタンプ' },
      { name: 'level', dataType: 'text', required: true, description: 'ログレベル' },
      { name: 'source', dataType: 'text', required: true, description: 'ログソース' },
      { name: 'user_id', dataType: 'text', required: false, description: 'ユーザーID' },
      { name: 'ip_address', dataType: 'text', required: false, description: 'IPアドレス' },
      { name: 'action', dataType: 'text', required: true, description: 'アクション' },
      { name: 'resource', dataType: 'text', required: false, description: 'リソース' },
      { name: 'status_code', dataType: 'number', required: false, description: 'ステータスコード' },
      { name: 'response_time', dataType: 'number', required: false, description: 'レスポンス時間（ms）' }
    ]
  },

  // カスタム・その他
  {
    id: 'custom-financial',
    name: '金融取引データ',
    description: '銀行・決済・金融系システム用のテストデータ',
    category: 'custom',
    difficulty: 'advanced',
    usage: '決済システム、会計システム、金融分析',
    tdMessage: '金融業界の厳格な要件にも対応したデータです！',
    columns: [
      { name: 'transaction_id', dataType: 'text', required: true, description: '取引ID' },
      { name: 'account_number', dataType: 'text', required: true, description: '口座番号' },
      { name: 'transaction_type', dataType: 'text', required: true, description: '取引種別' },
      { name: 'amount', dataType: 'number', required: true, description: '取引金額' },
      { name: 'currency', dataType: 'text', required: true, description: '通貨' },
      { name: 'transaction_date', dataType: 'date', required: true, description: '取引日時' },
      { name: 'merchant_name', dataType: 'text', required: false, description: '店舗名' },
      { name: 'category', dataType: 'text', required: false, description: '取引カテゴリ' },
      { name: 'status', dataType: 'text', required: true, description: '取引ステータス' },
      { name: 'reference_number', dataType: 'text', required: false, description: '参照番号' }
    ]
  },
  {
    id: 'custom-survey',
    name: 'アンケート回答データ',
    description: '顧客満足度調査・市場調査用のテストデータ',
    category: 'custom',
    difficulty: 'intermediate',
    usage: 'アンケートシステム、市場分析、顧客分析',
    tdMessage: 'お客様の声を大切にするアンケートデータです♪',
    columns: [
      { name: 'response_id', dataType: 'text', required: true, description: '回答ID' },
      { name: 'respondent_id', dataType: 'text', required: false, description: '回答者ID' },
      { name: 'survey_date', dataType: 'date', required: true, description: '回答日' },
      { name: 'age_group', dataType: 'text', required: false, description: '年齢層' },
      { name: 'gender', dataType: 'text', required: false, description: '性別' },
      { name: 'satisfaction_score', dataType: 'number', required: true, description: '満足度スコア' },
      { name: 'recommendation_score', dataType: 'number', required: false, description: '推奨度スコア' },
      { name: 'feedback_category', dataType: 'text', required: false, description: 'フィードバック分類' },
      { name: 'channel', dataType: 'text', required: false, description: '回答チャネル' },
      { name: 'completion_time', dataType: 'number', required: false, description: '回答時間（分）' }
    ]
  }
];

export const getPresetsByCategory = (category: CSVPreset['category']): CSVPreset[] => {
  return csvPresets.filter(preset => preset.category === category);
};

export const getPresetById = (id: string): CSVPreset | undefined => {
  return csvPresets.find(preset => preset.id === id);
};

export const getAllCategories = (): CSVPreset['category'][] => {
  return ['ecommerce', 'user', 'business', 'system', 'custom'];
};

export const getCategoryDisplayName = (category: CSVPreset['category']): string => {
  const names: Record<CSVPreset['category'], string> = {
    'ecommerce': 'ECサイト',
    'user': 'ユーザー管理',
    'business': 'ビジネス',
    'system': 'システム',
    'custom': 'カスタム・その他'
  };
  return names[category] || category;
};

export const getDifficultyDisplayName = (difficulty: CSVPreset['difficulty']): string => {
  const names: Record<CSVPreset['difficulty'], string> = {
    'beginner': '初級',
    'intermediate': '中級',
    'advanced': '上級'
  };
  return names[difficulty] || difficulty;
};

export const getDifficultyColor = (difficulty: CSVPreset['difficulty']): string => {
  const colors: Record<CSVPreset['difficulty'], string> = {
    'beginner': 'bg-green-100 text-green-800 border-green-200',
    'intermediate': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'advanced': 'bg-red-100 text-red-800 border-red-200'
  };
  return colors[difficulty] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getCategoryColor = (category: CSVPreset['category']): string => {
  const colors: Record<CSVPreset['category'], string> = {
    'ecommerce': 'bg-orange-50 border-orange-200',
    'user': 'bg-blue-50 border-blue-200',
    'business': 'bg-purple-50 border-purple-200',
    'system': 'bg-gray-50 border-gray-200',
    'custom': 'bg-green-50 border-green-200'
  };
  return colors[category] || 'bg-white border-gray-200';
}; 