import crypto from 'crypto';
import {
  PersonalInfoGenerateRequest,
  PersonalInfoGenerateResponse,
  PersonalInfoItem,
  PersonalInfoField,
  ValidationResult
} from '../types/personalInfo';
import {
  JAPANESE_NAMES,
  KANA_MAPPING,
  PREFECTURES,
  CITIES,
  STREET_PATTERNS,
  BUILDING_PATTERNS,
  COMPANIES,
  JOB_TITLES,
  EMAIL_DOMAINS,
  PHONE_AREA_CODES
} from '../data/japaneseData';

export class PersonalInfoService {
  
  /**
   * 個人情報を生成
   */
  async generatePersonalInfo(request: PersonalInfoGenerateRequest): Promise<PersonalInfoGenerateResponse> {
    const startTime = Date.now();
    
    // リクエストバリデーション
    const validation = this.validateRequest(request);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    console.log(`🤖 TDが個人情報生成を開始: ${request.count}件, ${request.includeFields.join(', ')}`);

    const persons: PersonalInfoItem[] = [];
    const duplicateCheck = new Set<string>();
    let duplicatesRemoved = 0;

    for (let i = 0; i < request.count; i++) {
      const person = this.generateSinglePerson(request);
      
      // 重複チェック（氏名+メールで判定）
      const duplicateKey = `${person.fullName?.kanji || ''}:${person.email || ''}`;
      if (duplicateCheck.has(duplicateKey)) {
        duplicatesRemoved++;
        continue;
      }
      
      duplicateCheck.add(duplicateKey);
      persons.push(person);
    }

    const generationTime = Date.now() - startTime;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24時間後

    console.log(`✅ 個人情報生成完了: ${persons.length}件 (${generationTime}ms)`);

    return {
      persons,
      criteria: request,
      statistics: {
        totalGenerated: request.count,
        uniqueCount: persons.length,
        generationTime,
        duplicatesRemoved
      },
      generatedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    };
  }

  /**
   * 単体の個人情報を生成
   */
  private generateSinglePerson(request: PersonalInfoGenerateRequest): PersonalInfoItem {
    const id = crypto.randomUUID();
    const gender = this.generateGender(request.gender);
    const age = this.generateAge(request.ageRange);
    const person: PersonalInfoItem = {
      id,
      generatedAt: new Date().toISOString(),
      locale: request.locale || 'ja'
    };

    // 性別設定
    if (request.includeFields.includes('gender')) {
      person.gender = gender;
    }

    // 年齢設定
    if (request.includeFields.includes('age')) {
      person.age = age;
    }

    // 生年月日設定
    if (request.includeFields.includes('birthDate')) {
      person.birthDate = this.generateBirthDate(age);
    }

    // 氏名生成
    if (request.includeFields.includes('fullName') || request.includeFields.includes('kanaName')) {
      person.fullName = this.generateFullName(gender, request.locale);
    }

    // 連絡先生成
    if (request.includeFields.includes('email')) {
      person.email = this.generateEmail(person.fullName, request.contactSettings);
    }

    if (request.includeFields.includes('phone')) {
      person.phone = this.generatePhone('landline');
    }

    if (request.includeFields.includes('mobile')) {
      person.mobile = this.generatePhone('mobile');
    }

    // 住所生成
    if (request.includeFields.includes('address') || request.includeFields.includes('postalCode')) {
      person.address = this.generateAddress(request.addressSettings);
    }

    // 職業情報生成
    if (request.includeFields.includes('company') || request.includeFields.includes('jobTitle')) {
      const jobInfo = this.generateJobInfo(request.jobSettings);
      person.company = jobInfo.company;
      person.jobTitle = jobInfo.jobTitle;
      person.industry = jobInfo.industry;
    }

    // その他の情報
    if (request.includeFields.includes('website')) {
      person.website = this.generateWebsite(person.fullName);
    }

    if (request.includeFields.includes('socialId')) {
      person.socialId = this.generateSocialId(person.fullName);
    }

    return person;
  }

  /**
   * 性別生成
   */
  private generateGender(genderOption?: 'male' | 'female' | 'random'): 'male' | 'female' {
    if (genderOption === 'random' || !genderOption) {
      return Math.random() < 0.5 ? 'male' : 'female';
    }
    return genderOption;
  }

  /**
   * 年齢生成
   */
  private generateAge(ageRange?: { min: number; max: number }): number {
    const min = ageRange?.min || 18;
    const max = ageRange?.max || 65;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * 生年月日生成
   */
  private generateBirthDate(age: number): string {
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1; // 簡略化のため28日まで
    
    return `${birthYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  /**
   * 氏名生成
   */
  private generateFullName(gender: 'male' | 'female', locale: 'ja' | 'en') {
    if (locale === 'ja') {
      const firstName = gender === 'male' 
        ? this.randomChoice(JAPANESE_NAMES.maleFirstNames)
        : this.randomChoice(JAPANESE_NAMES.femaleFirstNames);
      const lastName = this.randomChoice(JAPANESE_NAMES.lastNames);
      
      const kanji = `${lastName} ${firstName}`;
      const katakana = `${KANA_MAPPING[lastName] || lastName} ${KANA_MAPPING[firstName] || firstName}`;
      
      return {
        kanji,
        hiragana: this.katakanaToHiragana(katakana),
        katakana,
        romaji: this.toRomaji(firstName, lastName),
        firstName,
        lastName
      };
    } else {
      // 英語名は将来の拡張用
      return {
        kanji: 'John Smith',
        hiragana: 'John Smith',
        katakana: 'John Smith',
        romaji: 'John Smith',
        firstName: 'John',
        lastName: 'Smith'
      };
    }
  }

  /**
   * メールアドレス生成
   */
  private generateEmail(fullName?: any, settings?: any): string {
    const baseNames = ['user', 'test', 'sample', 'demo'];
    let localPart: string;

    if (fullName?.romaji) {
      // ローマ字から生成
      const parts = fullName.romaji.toLowerCase().split(' ');
      localPart = `${parts[1] || 'user'}.${parts[0] || 'test'}`;
    } else {
      localPart = this.randomChoice(baseNames) + Math.floor(Math.random() * 9999);
    }

    // ドメイン選択
    let domains: string[];
    if (settings?.businessEmail) {
      domains = EMAIL_DOMAINS.business;
    } else if (settings?.freeEmail) {
      domains = EMAIL_DOMAINS.free;
    } else {
      domains = [...EMAIL_DOMAINS.free, ...EMAIL_DOMAINS.business];
    }

    const domain = this.randomChoice(domains);
    return `${localPart}@${domain}`;
  }

  /**
   * 電話番号生成
   */
  private generatePhone(type: 'landline' | 'mobile'): string {
    if (type === 'mobile') {
      const prefix = this.randomChoice(PHONE_AREA_CODES.mobile);
      const number = this.generatePhoneNumber(4) + '-' + this.generatePhoneNumber(4);
      return `${prefix}-${number}`;
    } else {
      const areaCode = this.randomChoice([...PHONE_AREA_CODES.tokyo, ...PHONE_AREA_CODES.osaka]);
      const number = this.generatePhoneNumber(4) + '-' + this.generatePhoneNumber(4);
      return `${areaCode}-${number}`;
    }
  }

  /**
   * 住所生成
   */
  private generateAddress(settings?: any) {
    const prefecture = this.randomChoice(PREFECTURES);
    const prefectureName = prefecture.name as keyof typeof CITIES;
    const cities = CITIES[prefectureName] || [{ name: '中央市', postalCodes: ['000-0000'], type: 'city' as const }];
    const city = this.randomChoice(cities);
    const street = this.randomChoice(STREET_PATTERNS);
    
    let building: string | undefined = undefined;
    if (settings?.includeBuilding && Math.random() < 0.6) {
      const pattern = this.randomChoice(BUILDING_PATTERNS);
      const buildingName = this.generateBuildingName();
      building = pattern.replace('%s', buildingName);
    }

    const postalCode = settings?.realPostalCode 
      ? this.randomChoice(city.postalCodes)
      : this.generatePostalCode(prefecture.postalCodePrefix);

    const processedPostalCode = typeof postalCode === 'string' 
      ? postalCode.replace(/-0000$/, '-' + this.generatePhoneNumber(4))
      : this.generatePostalCode(prefecture.postalCodePrefix);

    const full = `${prefecture.name}${city.name}${street}${building ? ` ${building}` : ''}`;

    return {
      full,
      postalCode: processedPostalCode,
      prefecture: prefecture.name,
      city: city.name,
      street,
      ...(building && { building })
    };
  }

  /**
   * 職業情報生成
   */
  private generateJobInfo(settings?: any) {
    const companySize = settings?.companySize === 'random' 
      ? this.randomChoice(['small', 'medium', 'large'] as const)
      : settings?.companySize || 'medium';

    const companySizeKey = companySize as keyof typeof COMPANIES;
    const companyData = this.randomChoice(COMPANIES[companySizeKey]);
    const industry = companyData.industry;
    const suffix = this.randomChoice(companyData.suffixes);
    const company = `${companyData.name}${suffix}`;

    const industryKey = industry as keyof typeof JOB_TITLES;
    const availableJobs = JOB_TITLES[industryKey] || JOB_TITLES['その他'];
    const jobTitle = this.randomChoice(availableJobs);

    return {
      company,
      jobTitle,
      industry
    };
  }

  /**
   * ウェブサイト生成
   */
  private generateWebsite(fullName?: any): string {
    const domains = ['example.com', 'test.jp', 'sample.net', 'demo.org'];
    const domain = this.randomChoice(domains);
    
    if (fullName?.romaji) {
      const name = fullName.romaji.toLowerCase().replace(/\s+/g, '');
      return `https://www.${name}.${domain}`;
    }
    
    return `https://www.user${Math.floor(Math.random() * 9999)}.${domain}`;
  }

  /**
   * SNS ID生成
   */
  private generateSocialId(fullName?: any): string {
    if (fullName?.romaji) {
      const name = fullName.romaji.toLowerCase().replace(/\s+/g, '');
      return `@${name}${Math.floor(Math.random() * 999)}`;
    }
    
    return `@user${Math.floor(Math.random() * 99999)}`;
  }

  /**
   * リクエストバリデーション
   */
  private validateRequest(request: PersonalInfoGenerateRequest): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 基本バリデーション
    if (!request.count || request.count < 1 || request.count > 100) {
      errors.push('生成数は1-100の範囲で指定してください');
    }

    if (!request.includeFields || request.includeFields.length === 0) {
      errors.push('少なくとも1つのフィールドを指定してください');
    }

    // 年齢範囲チェック
    if (request.ageRange) {
      if (request.ageRange.min < 18 || request.ageRange.max > 100) {
        errors.push('年齢範囲は18-100歳の範囲で指定してください');
      }
      if (request.ageRange.min > request.ageRange.max) {
        errors.push('最小年齢は最大年齢以下である必要があります');
      }
    }

    // パフォーマンス警告
    if (request.count > 50) {
      warnings.push('大量生成によりレスポンス時間が長くなる可能性があります');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      quality: {
        realism: 85,
        diversity: 90,
        consistency: 95
      }
    };
  }

  // ユーティリティメソッド
  private randomChoice<T>(array: T[]): T {
    if (array.length === 0) {
      throw new Error('Array cannot be empty');
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    const selectedItem = array[randomIndex];
    return selectedItem!; // 非null assertion - 配列に要素があることを確認済み
  }

  private generatePhoneNumber(length: number): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
  }

  private generatePostalCode(prefixes: string[]): string {
    const prefix = this.randomChoice(prefixes);
    const suffix = this.generatePhoneNumber(4);
    return `${prefix}-${suffix}`;
  }

  private generateBuildingName(): string {
    const names = ['サクラ', 'ミドリ', 'アオイ', 'ヒカリ', 'カゼ', 'ソラ', 'ウミ', 'ヤマ', 'カワ', 'ハナ'];
    return this.randomChoice(names);
  }

  private katakanaToHiragana(katakana: string): string {
    return katakana.replace(/[\u30A1-\u30F6]/g, function(match) {
      const chr = match.charCodeAt(0) - 0x60;
      return String.fromCharCode(chr);
    });
  }

  private toRomaji(firstName: string, lastName: string): string {
    // 簡略化されたローマ字変換（実際はもっと複雑なマッピングが必要）
    const romajiMap: Record<string, string> = {
      '太郎': 'Taro', '花子': 'Hanako', '健': 'Ken', '愛': 'Ai',
      '佐藤': 'Sato', '鈴木': 'Suzuki', '高橋': 'Takahashi', '田中': 'Tanaka',
      '山田': 'Yamada', '渡辺': 'Watanabe', '伊藤': 'Ito', '中村': 'Nakamura'
    };

    const firstRomaji = romajiMap[firstName] || 'Taro';
    const lastRomaji = romajiMap[lastName] || 'Yamada';
    
    return `${firstRomaji} ${lastRomaji}`;
  }
} 