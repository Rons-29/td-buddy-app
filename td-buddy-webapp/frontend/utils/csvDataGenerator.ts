/**
 * CSV用簡易データ生成器
 */
export class CsvDataGenerator {
  
  // 日本人の姓名データ
  private static readonly JAPANESE_LAST_NAMES = [
    '田中', '佐藤', '鈴木', '高橋', '渡辺', '山田', '中村', '小林', '加藤', '吉田',
    '山本', '松本', '井上', '木村', '林', '清水', '山崎', '森', '阿部', '石川'
  ];

  private static readonly JAPANESE_FIRST_NAMES_MALE = [
    '太郎', '次郎', '三郎', '一郎', '健太', '大輔', '裕太', '翔太', '拓海', '直樹'
  ];

  private static readonly JAPANESE_FIRST_NAMES_FEMALE = [
    '花子', '恵子', '美咲', '愛', '美穂', '真由美', '智子', '由美', '美香', '優子'
  ];

  private static readonly WESTERN_FIRST_NAMES = [
    'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Chris', 'Lisa', 'Mark', 'Anna',
    'James', 'Mary', 'Robert', 'Jennifer', 'William', 'Linda', 'Richard', 'Elizabeth', 'Joseph', 'Susan'
  ];

  private static readonly WESTERN_LAST_NAMES = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'
  ];

  private static readonly COMPANY_PREFIXES_JP = [
    'グローバル', 'ユニバーサル', 'プレミアム', 'エクセレント', 'フューチャー',
    'ネクスト', 'アドバンス', 'プロフェッショナル', 'クリエイティブ', 'イノベーション',
    'テクノロジー', 'ソリューション', 'システム', 'デジタル', 'スマート'
  ];

  private static readonly COMPANY_SUFFIXES_JP = [
    '株式会社', '有限会社', '合同会社', '合資会社', '合名会社'
  ];

  private static readonly BUSINESS_DOMAINS = [
    'company.co.jp', 'business.com', 'corp.jp', 'enterprise.net', 'group.co.jp',
    'inc.com', 'ltd.jp', 'solutions.com', 'tech.jp', 'systems.co.jp'
  ];

  private static readonly COMMON_DOMAINS = [
    'gmail.com', 'yahoo.co.jp', 'hotmail.com', 'outlook.com', 'icloud.com',
    'yahoo.com', 'live.com', 'aol.com', 'nifty.com', 'docomo.ne.jp'
  ];

  private static readonly JP_PREFECTURES = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ];

  /**
   * 日本語テキスト生成
   */
  static generateJapaneseText(length: number = 10): string {
    const chars = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * 英語テキスト生成
   */
  static generateEnglishText(length: number = 10): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * 数値生成
   */
  static generateNumber(min: number = 1, max: number = 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * メールアドレス生成
   */
  static generateEmail(index: number = 0): string {
    const domains = ['gmail.com', 'yahoo.co.jp', 'hotmail.com', 'outlook.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `user${index + 1}@${domain}`;
  }

  /**
   * 電話番号生成（日本）
   */
  static generateJapanesePhone(): string {
    const prefix = ['090', '080', '070'];
    const selectedPrefix = prefix[Math.floor(Math.random() * prefix.length)];
    const middle = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const last = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${selectedPrefix}-${middle}-${last}`;
  }

  /**
   * 日付生成
   */
  static generateDate(): string {
    const year = 2020 + Math.floor(Math.random() * 5);
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
  }

  /**
   * 日本人の氏名生成
   */
  static generateJapaneseName(): string {
    const lastName = this.JAPANESE_LAST_NAMES[Math.floor(Math.random() * this.JAPANESE_LAST_NAMES.length)];
    const allFirstNames = [...this.JAPANESE_FIRST_NAMES_MALE, ...this.JAPANESE_FIRST_NAMES_FEMALE];
    const firstName = allFirstNames[Math.floor(Math.random() * allFirstNames.length)];
    return `${lastName} ${firstName}`;
  }

  /**
   * 統合データ生成メソッド（互換性のため）
   */
  static generateData(settings: any): string {
    // 簡易実装
    if (typeof settings === 'string') {
      switch (settings) {
        case 'text':
          return this.generateJapaneseText();
        case 'number':
          return this.generateNumber().toString();
        case 'email':
          return this.generateEmail();
        case 'phone':
          return this.generateJapanesePhone();
        case 'date':
          return this.generateDate();
        case 'name':
          return this.generateJapaneseName();
        case 'age':
          return this.generateNumber(18, 80).toString();
        default:
          return 'データ';
      }
    }

    // オブジェクト形式の設定の場合
    if (settings && typeof settings === 'object') {
      const category = settings.category || settings.type;
      
      switch (category) {
        case 'text':
          return this.generateJapaneseText();
        case 'number':
          const min = settings.min || 1;
          const max = settings.max || 100;
          return this.generateNumber(min, max).toString();
        case 'email':
          return this.generateEmail();
        case 'phone':
          return this.generateJapanesePhone();
        case 'date':
          return this.generateDate();
        case 'name':
          return this.generateJapaneseName();
        case 'age':
          return this.generateNumber(18, 80).toString();
        default:
          return 'データ';
      }
    }

    return 'データ';
  }
}

// 関数単体のエクスポート（互換性のため）
export function generateData(dataType: string | any, settings?: any): string {
  return CsvDataGenerator.generateData(dataType);
} 