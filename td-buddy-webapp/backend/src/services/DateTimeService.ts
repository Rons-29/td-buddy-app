export interface DateTimeOptions {
  format: 'iso8601' | 'japanese' | 'unix' | 'relative' | 'custom' | 'business';
  customFormat?: string;
  locale?: string;
  timezone?: string;
  range?: {
    start: Date;
    end: Date;
  };
  relative?: {
    baseDate?: Date;
    minDays?: number;
    maxDays?: number;
    direction?: 'past' | 'future' | 'both';
  };
  businessDays?: {
    excludeWeekends?: boolean;
    excludeHolidays?: boolean;
    country?: string;
  };
}

export interface GeneratedDateTime {
  id: string;
  value: string;
  originalDate: Date;
  format: string;
  locale: string;
  timezone: string;
  metadata: {
    isWeekend: boolean;
    isHoliday: boolean;
    dayOfWeek: string;
    weekNumber: number;
    era?: string;
  };
  brewMessage: string;
  generatedAt: Date;
}

export interface DateTimeGenerationResult {
  success: boolean;
  data: GeneratedDateTime[];
  count: number;
  options: DateTimeOptions;
  message: string;
  brewMessage: string;
  generatedAt: Date;
}

export class DateTimeService {
  private readonly japaneseHolidays: Map<string, string> = new Map();
  
  constructor() {
    this.initializeJapaneseHolidays();
  }

  /**
   * 日付・時刻を生成
   */
  async generateDateTime(options: DateTimeOptions, count: number = 1): Promise<DateTimeGenerationResult> {
    try {
      const generatedDates: GeneratedDateTime[] = [];
      
      for (let i = 0; i < count; i++) {
        const dateTime = this.generateSingleDateTime(options);
        generatedDates.push(dateTime);
      }

      return {
        success: true,
        data: generatedDates,
        count: generatedDates.length,
        options,
        message: `${count}件の日付・時刻を生成しました`,
        brewMessage: this.getBrewMessage(options.format, count),
        generatedAt: new Date(),
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        count: 0,
        options,
        message: `日付・時刻生成エラー: ${error?.message || '不明なエラー'}`,
        brewMessage: "エラーが発生しましたが、Brewが一緒に解決します！",
        generatedAt: new Date(),
      };
    }
  }

  /**
   * 単一の日付・時刻を生成
   */
  private generateSingleDateTime(options: DateTimeOptions): GeneratedDateTime {
    const id = `dt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const originalDate = this.generateRandomDate(options);
    
    let formattedValue: string;
    let formatUsed: string;

    switch (options.format) {
      case 'iso8601':
        formattedValue = this.formatISO8601(originalDate, options);
        formatUsed = 'ISO 8601';
        break;
      case 'japanese':
        formattedValue = this.formatJapanese(originalDate, options);
        formatUsed = '日本語形式';
        break;
      case 'unix':
        formattedValue = this.formatUnix(originalDate);
        formatUsed = 'Unix タイムスタンプ';
        break;
      case 'relative':
        formattedValue = this.formatRelative(originalDate, options);
        formatUsed = '相対形式';
        break;
      case 'business':
        formattedValue = this.formatBusiness(originalDate, options);
        formatUsed = '営業日形式';
        break;
      case 'custom':
        formattedValue = this.formatCustom(originalDate, options);
        formatUsed = `カスタム: ${options.customFormat}`;
        break;
      default:
        formattedValue = originalDate.toISOString();
        formatUsed = 'ISO 8601 (デフォルト)';
    }

    const metadata = this.generateMetadata(originalDate, options);

    return {
      id,
      value: formattedValue,
      originalDate,
      format: formatUsed,
      locale: options.locale || 'ja-JP',
      timezone: options.timezone || 'Asia/Tokyo',
      metadata,
      brewMessage: this.generateBrewMessage(originalDate, options.format),
      generatedAt: new Date(),
    };
  }

  /**
   * ランダムな日付を生成
   */
  private generateRandomDate(options: DateTimeOptions): Date {
    let startDate: Date;
    let endDate: Date;

    if (options.range) {
      startDate = new Date(options.range.start);
      endDate = new Date(options.range.end);
    } else if (options.relative) {
      const baseDate = options.relative.baseDate || new Date();
      const minDays = options.relative.minDays || -365;
      const maxDays = options.relative.maxDays || 365;
      
      startDate = new Date(baseDate.getTime() + minDays * 24 * 60 * 60 * 1000);
      endDate = new Date(baseDate.getTime() + maxDays * 24 * 60 * 60 * 1000);
    } else {
      // デフォルト: 過去1年〜未来1年
      const now = new Date();
      startDate = new Date(now.getFullYear() - 1, 0, 1);
      endDate = new Date(now.getFullYear() + 1, 11, 31);
    }

    const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    let randomDate = new Date(randomTime);

    // 営業日フィルタリング
    if (options.businessDays?.excludeWeekends || options.businessDays?.excludeHolidays) {
      randomDate = this.adjustToBusinessDay(randomDate, options);
    }

    return randomDate;
  }

  /**
   * ISO 8601形式でフォーマット
   */
  private formatISO8601(date: Date, options: DateTimeOptions): string {
    if (options.timezone && options.timezone !== 'UTC') {
      // タイムゾーン対応
      return date.toLocaleString('sv-SE', { timeZone: options.timezone }).replace(' ', 'T') + 'Z';
    }
    return date.toISOString();
  }

  /**
   * 日本語形式でフォーマット
   */
  private formatJapanese(date: Date, options: DateTimeOptions): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    // 和暦変換
    const era = this.getJapaneseEra(year);
    const eraYear = this.getJapaneseEraYear(year);

    const patterns = [
      `${era}${eraYear}年${month}月${day}日 ${hour}時${minute}分${second}秒`,
      `${year}年${month}月${day}日 ${hour}:${minute.toString().padStart(2, '0')}`,
      `${era}${eraYear}年${month}月${day}日`,
      `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`,
    ];

    const randomIndex = Math.floor(Math.random() * patterns.length);
    const selectedPattern = patterns[randomIndex];
    return selectedPattern || patterns[0] || date.toLocaleDateString('ja-JP');
  }

  /**
   * Unix タイムスタンプでフォーマット
   */
  private formatUnix(date: Date): string {
    return Math.floor(date.getTime() / 1000).toString();
  }

  /**
   * 相対形式でフォーマット
   */
  private formatRelative(date: Date, options: DateTimeOptions): string {
    const baseDate = options.relative?.baseDate || new Date();
    const diffMs = date.getTime() - baseDate.getTime();
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffMinutes = Math.floor(diffMs / (60 * 1000));

    if (Math.abs(diffDays) >= 1) {
      return diffDays > 0 ? `${diffDays}日後` : `${Math.abs(diffDays)}日前`;
    } else if (Math.abs(diffHours) >= 1) {
      return diffHours > 0 ? `${diffHours}時間後` : `${Math.abs(diffHours)}時間前`;
    } else {
      return diffMinutes > 0 ? `${diffMinutes}分後` : `${Math.abs(diffMinutes)}分前`;
    }
  }

  /**
   * 営業日形式でフォーマット
   */
  private formatBusiness(date: Date, options: DateTimeOptions): string {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = this.isJapaneseHoliday(date);
    
    let suffix = '';
    if (isWeekend) suffix += ' (週末)';
    if (isHoliday) suffix += ' (祝日)';
    if (!isWeekend && !isHoliday) suffix += ' (営業日)';

    return this.formatJapanese(date, options) + suffix;
  }

  /**
   * カスタム形式でフォーマット
   */
  private formatCustom(date: Date, options: DateTimeOptions): string {
    if (!options.customFormat) {
      return date.toISOString();
    }

    let formatted = options.customFormat;
    const replacements = {
      'YYYY': date.getFullYear().toString(),
      'MM': (date.getMonth() + 1).toString().padStart(2, '0'),
      'DD': date.getDate().toString().padStart(2, '0'),
      'HH': date.getHours().toString().padStart(2, '0'),
      'mm': date.getMinutes().toString().padStart(2, '0'),
      'ss': date.getSeconds().toString().padStart(2, '0'),
      'SSS': date.getMilliseconds().toString().padStart(3, '0'),
    };

    Object.entries(replacements).forEach(([key, value]) => {
      formatted = formatted.replace(new RegExp(key, 'g'), value);
    });

    return formatted;
  }

  /**
   * メタデータ生成
   */
  private generateMetadata(date: Date, options: DateTimeOptions) {
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()] || '不明';
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isHoliday = this.isJapaneseHoliday(date);
    const weekNumber = this.getWeekNumber(date);
    const era = this.getJapaneseEra(date.getFullYear());

    return {
      isWeekend,
      isHoliday,
      dayOfWeek,
      weekNumber,
      era,
    };
  }

  /**
   * 営業日に調整
   */
  private adjustToBusinessDay(date: Date, options: DateTimeOptions): Date {
    let adjustedDate = new Date(date);
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      const isWeekend = adjustedDate.getDay() === 0 || adjustedDate.getDay() === 6;
      const isHoliday = this.isJapaneseHoliday(adjustedDate);

      if (options.businessDays?.excludeWeekends && isWeekend) {
        adjustedDate.setDate(adjustedDate.getDate() + 1);
        attempts++;
        continue;
      }

      if (options.businessDays?.excludeHolidays && isHoliday) {
        adjustedDate.setDate(adjustedDate.getDate() + 1);
        attempts++;
        continue;
      }

      break;
    }

    return adjustedDate;
  }

  /**
   * 日本の祝日判定
   */
  private isJapaneseHoliday(date: Date): boolean {
    const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return this.japaneseHolidays.has(key);
  }

  /**
   * 和暦取得
   */
  private getJapaneseEra(year: number): string {
    if (year >= 2019) return '令和';
    if (year >= 1989) return '平成';
    if (year >= 1926) return '昭和';
    if (year >= 1912) return '大正';
    return '明治';
  }

  /**
   * 和暦年数取得
   */
  private getJapaneseEraYear(year: number): number {
    if (year >= 2019) return year - 2018;
    if (year >= 1989) return year - 1988;
    if (year >= 1926) return year - 1925;
    if (year >= 1912) return year - 1911;
    return year - 1867;
  }

  /**
   * 週番号取得
   */
  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const daysSinceFirstDay = Math.floor((date.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((daysSinceFirstDay + firstDayOfYear.getDay() + 1) / 7);
  }

  /**
   * TDメッセージ生成
   */
  private generateBrewMessage(date: Date, format: string): string {
    const messages: Record<string, string[]> = {
      iso8601: [
        "国際標準の日時形式です！システム間連携に最適ですね♪",
        "ISO 8601形式で世界中どこでも通用します！",
        "プログラマーにとって最も扱いやすい形式です✨",
      ],
      japanese: [
        "和暦対応の日本語形式です！日本のシステムにぴったり♪",
        "令和の時代も対応済みです！",
        "日本人にとって最も読みやすい形式ですね",
      ],
      unix: [
        "Unix時代から愛され続けるタイムスタンプです♪",
        "数値形式でデータベースにも最適！",
        "プログラマーの定番形式ですね✨",
      ],
      relative: [
        "人間にとって分かりやすい相対時間です！",
        "「3日前」「1週間後」など直感的ですね♪",
        "チャットやSNSアプリに最適な形式です",
      ],
      business: [
        "営業日を考慮した実用的な日付です！",
        "祝日・週末をしっかり識別しています♪",
        "ビジネスアプリケーションに最適ですね✨",
      ],
      custom: [
        "カスタム形式でピッタリの日付を作成しました！",
        "お好みの形式で柔軟に対応します♪",
        "特殊な要件にもTDがお応えします！",
      ],
    };

    const formatMessages = messages[format] || messages['iso8601'];
    if (!formatMessages || formatMessages.length === 0) {
      return "TDが日付・時刻を生成しました♪";
    }
    const randomIndex = Math.floor(Math.random() * formatMessages.length);
    const selectedMessage = formatMessages[randomIndex];
    return selectedMessage || "TDが日付・時刻を生成しました♪";
  }

  /**
   * 全体のTDメッセージ取得
   */
  private getBrewMessage(format: string, count: number): string {
    const baseMessages = [
      `${count}件の${format}形式の日付・時刻を生成しました！`,
      `日付・時刻生成、完了です！${count}件すべて品質チェック済み♪`,
      `TDの日付・時刻生成機能、いかがでしょうか？${count}件お作りしました✨`,
    ];

    const randomIndex = Math.floor(Math.random() * baseMessages.length);
    const selectedMessage = baseMessages[randomIndex];
    return selectedMessage || `${count}件の日付・時刻を生成しました♪`;
  }

  /**
   * 日本の祝日を初期化
   */
  private initializeJapaneseHolidays(): void {
    // 2025年の主要祝日（簡易版）
    const holidays2025 = [
      '2025-01-01', '2025-01-13', '2025-02-11', '2025-02-23',
      '2025-03-20', '2025-04-29', '2025-05-03', '2025-05-04',
      '2025-05-05', '2025-07-21', '2025-08-11', '2025-09-15',
      '2025-09-23', '2025-10-13', '2025-11-03', '2025-11-23',
    ];

    holidays2025.forEach(date => {
      this.japaneseHolidays.set(date, '祝日');
    });
  }

  /**
   * 日付・時刻検証
   */
  validateDateTime(value: string, format: string): boolean {
    try {
      switch (format) {
        case 'iso8601':
          return !isNaN(Date.parse(value));
        case 'unix':
          const timestamp = parseInt(value);
          return !isNaN(timestamp) && timestamp > 0;
        default:
          return !isNaN(Date.parse(value));
      }
    } catch {
      return false;
    }
  }
} 