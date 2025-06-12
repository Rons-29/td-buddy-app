import { Request, Response, Router } from 'express';
import { database } from '../database/database';
import { PersonalInfoGenerateRequest, PersonalInfoGenerateResponse } from '../types/personalInfo';

// Logger setup
const logger = console;

import { PerformanceService } from './PerformanceService';import crypto 
const logger = console;import {
  PersonalInfoGenerateRequest,
  PersonalInfoGenerateResponse,
  PersonalInfoItem,
  ValidationResult
} from '../types/personalInfo';
import {
  JAPANESE_NAMES,
  KANA_MAPPING,
  PREFECTURES,
  CITIES,
  COMPANIES,
  JOB_TITLES,
  EMAIL_DOMAINS,
  PHONE_AREA_CODES
} from '../data/japaneseData';

/**
 * バリデーションエラークラス
 */
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class PersonalInfoService {
  private performanceService = PerformanceService.getInstance();
  
  /**
   * 個人情報を生成
   */
  async generatePersonalInfo(request: PersonalInfoGenerateRequest): Promise<PersonalInfoGenerateResponse> {
    const startTime = Date.now();
    
    try {
      // リクエストバリデーション
      const validation = this.validateRequest(request);
      if (!validation.isValid) {
        throw new ValidationError(validation.errors.join(', '));
      }

      // 生成開始ログ
      logger.log(`🍺 TDが個人情報生成を開始: ${request.count}件, ${request.includeFields.join(', ')}`);

      // 重複除去のためのトラッキングセット
      const usedEmails = new Set<string>();
      const usedPhones = new Set<string>();
      const persons: PersonalInfoItem[] = [];
      const maxAttempts = request.count * 3; // 最大試行回数
      let attempts = 0;

      // 指定された数まで生成（重複除去付き）
      while (persons.length < request.count && attempts < maxAttempts) {
        attempts++;
        const person = this.generateSinglePerson(request);
        
        // 重複チェック
        let isDuplicate = false;
        
        // メールアドレスの重複チェック
        if (person.email && usedEmails.has(person.email)) {
          isDuplicate = true;
        }
        
        // 電話番号の重複チェック
        if (person.phone && usedPhones.has(person.phone)) {
          isDuplicate = true;
        }
        
        // 重複がない場合は追加
        if (!isDuplicate) {
          if (person.email) usedEmails.add(person.email);
          if (person.phone) usedPhones.add(person.phone);
          persons.push(person);
        }
      }

      const endTime = Date.now();
      const duration = endTime - startTime;
      const itemsPerSecond = (persons.length / duration) * 1000;

      // パフォーマンス記録
      const timerId = this.performanceService.startTimer('personal_info_generation');
      const performanceMetric = this.performanceService.endTimer(timerId, persons.length);

      // 生成完了ログ
      logger.log(`✅ 個人情報生成完了: ${persons.length}件 (${duration.toFixed(2)}ms, ${itemsPerSecond.toFixed(2)} items/sec)`);
      if (attempts - persons.length > 0) {
        logger.log(`🔄 重複除去: ${attempts - persons.length}件の重複を除去`);
      }

      const now = new Date();
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24時間後

      return {
        persons,
        criteria: request,
        statistics: {
          totalGenerated: persons.length,
          uniqueCount: persons.length,
          generationTime: duration,
          duplicatesRemoved: attempts - persons.length
        },
        generatedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString()
      };
    } catch (error) {
      logger.error('❌ 個人情報生成エラー:', error);
      throw error;
    }
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
    if (request.includeFields.includes('fullName')) {
      const fullName = this.generateFullName(gender, request.locale);
      person.fullName = {
        kanji: fullName.kanji,
        firstName: fullName.firstName,
        lastName: fullName.lastName,
      };
    }

    // カナ専用フィールド（別カラム表示用）
    if (request.includeFields.includes('kanaName')) {
      if (person.fullName) {
        person.kanaName = this.convertToKatakana(person.fullName.kanji);
      } else {
        // fullNameが生成されていない場合は単独でkanaNameを生成
        const fullName = this.generateFullName(gender, request.locale);
        person.kanaName = this.convertToKatakana(fullName.kanji);
      }
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
      const lastNames = JAPANESE_NAMES.lastNames;
      const firstNames = gender === 'male' ? JAPANESE_NAMES.maleFirstNames : JAPANESE_NAMES.femaleFirstNames;
      
      const lastName = this.randomChoice(lastNames);
      const firstName = this.randomChoice(firstNames);
      const kanjiName = `${lastName} ${firstName}`;

      return {
        kanji: kanjiName,
        firstName: firstName,
        lastName: lastName
      };
    } else {
      // 英語名生成（簡略版）
      const firstNames = ['John', 'Jane', 'Test', 'Sample', 'Demo', 'Mock'];
      const lastNames = ['Doe', 'Smith', 'Test', 'Sample', 'Demo', 'User'];
      const firstName = this.randomChoice(firstNames);
      const lastName = this.randomChoice(lastNames);
      
      return {
        kanji: `${lastName} ${firstName}`,
        firstName: firstName,
        lastName: lastName
      };
    }
  }

  /**
   * メールアドレス生成
   */
  private generateEmail(fullName?: any, settings?: any): string {
    const domains = EMAIL_DOMAINS;
    const domain = this.randomChoice(domains);
    
    if (fullName && fullName.firstName && fullName.lastName) {
      // 日本語名前を英語に変換
      const englishName = this.convertJapaneseToEnglish(fullName.firstName, fullName.lastName);
      
      // 英語名前からメールアドレスを生成
      const localPart = `${englishName.firstName}.${englishName.lastName}`.toLowerCase()
        .replace(/\s+/g, '.')
        .replace(/[^a-z0-9.]/g, '')
        .replace(/\.+/g, '.') // 連続ドットを単一に
        .replace(/^\.+|\.+$/g, ''); // 先頭・末尾のドットを削除
      
      // 空の場合はフォールバック
      if (!localPart) {
        return `test.user${Math.floor(Math.random() * 9999)}@${domain}`;
      }
      
      return `${localPart}@${domain}`;
    }
    
    return `test.user${Math.floor(Math.random() * 9999)}@${domain}`;
  }

  /**
   * 日本語名前を英語に変換
   */
  private convertJapaneseToEnglish(firstName: string, lastName: string): { firstName: string; lastName: string } {
    // 日本語名前の英語変換マッピング
    const nameMapping: { [key: string]: string } = {
      // 姓の変換
      'テスト': 'Test',
      'ダミー': 'Dummy', 
      'サンプル': 'Sample',
      'モック': 'Mock',
      'トライアル': 'Trial',
      'デモ': 'Demo',
      'テンプレート': 'Template',
      'プロトタイプ': 'Prototype',
      'ベータ版': 'Beta',
      'アルファ版': 'Alpha',
      'ユニット': 'Unit',
      'インテグレ': 'Integration',
      'システム': 'System',
      'QAテスト': 'QA',
      'DevTest': 'DevTest',
      'SampleData': 'SampleData',
      'MockUp': 'MockUp',
      'DemoUser': 'DemoUser',
      'TempUser': 'TempUser',
      'テストケース': 'TestCase',
      'データ生成': 'DataGen',
      '仮想ユーザー': 'VirtualUser',
      '検証用': 'Verification',
      'サンプルA': 'SampleA',
      'サンプルB': 'SampleB',
      
      // 名の変換
      'テスト太郎': 'TestTaro',
      'ダミー次郎': 'DummyJiro',
      'サンプル三郎': 'SampleSaburo',
      'モック四郎': 'MockShiro',
      'トライアル五郎': 'TrialGoro',
      'デモ六郎': 'DemoRokuro',
      'テンプレ七郎': 'TempShichiro',
      'プロト八郎': 'ProtoHachiro',
      'ベータ九郎': 'BetaKuro',
      'アルファ十郎': 'AlphaJuro',
      'テスト一': 'TestIchi',
      'サンプル二': 'SampleNi',
      'ダミー三': 'DummySan',
      'モック四': 'MockShi',
      'デモ五': 'DemoGo',
      'トライアル六': 'TrialRoku',
      'プロト七': 'ProtoNana',
      'ベータ八': 'BetaHachi',
      'アルファ九': 'AlphaKyu',
      'テンプレ十': 'TempJu',
      'QA太郎': 'QATaro',
      'Dev次郎': 'DevJiro',
      'Test三郎': 'TestSaburo',
      'Sample四郎': 'SampleShiro',
      'Demo五郎': 'DemoGoro',
      
      // 女性名の変換
      'テスト花子': 'TestHanako',
      'ダミー恵子': 'DummyKeiko',
      'サンプル美子': 'SampleYoshiko',
      'モック良子': 'MockRyoko',
      'トライアル和子': 'TrialKazuko',
      'デモ智子': 'DemoTomoko',
      'テンプレ雅子': 'TempMasako',
      'プロト幸子': 'ProtoSachiko',
      'ベータ京子': 'BetaKyoko',
      'アルファ直子': 'AlphaNaoko',
      'テスト子': 'TestKo',
      'サンプル美': 'SampleMi',
      'ダミー恵': 'DummyMegumi',
      'モック子': 'MockKo',
      'デモ花': 'DemoHana',
      'トライアル雅': 'TrialMiyabi',
      'プロト智': 'ProtoSatoshi',
      'ベータ幸': 'BetaSachi',
      'アルファ良': 'AlphaRyo',
      'テンプレ和': 'TempKazu',
      'QA花子': 'QAHanako',
      'Dev美子': 'DevYoshiko',
      'Test恵子': 'TestKeiko',
      'Sample良子': 'SampleRyoko',
      'Demo智子': 'DemoTomoko'
    };
    
    // 変換を試行
    const englishFirstName = nameMapping[firstName] || this.generateFallbackEnglishName(firstName, true);
    const englishLastName = nameMapping[lastName] || this.generateFallbackEnglishName(lastName, false);
    
    return {
      firstName: englishFirstName,
      lastName: englishLastName
    };
  }

  /**
   * フォールバック英語名生成
   */
  private generateFallbackEnglishName(japaneseString: string, isFirstName: boolean): string {
    // 英文字が含まれていればそのまま使用
    if (/[a-zA-Z]/.test(japaneseString)) {
      return japaneseString.replace(/[^a-zA-Z]/g, '');
    }
    
    // 完全に日本語の場合は一般的な英語名を使用
    if (isFirstName) {
      const commonFirstNames = ['Taro', 'Jiro', 'Hanako', 'Yuki', 'Aki', 'Sato', 'Ken', 'Mai', 'Rin', 'Jun'];
      return this.randomChoice(commonFirstNames);
    } else {
      const commonLastNames = ['Tanaka', 'Sato', 'Suzuki', 'Takahashi', 'Ito', 'Watanabe', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Saito'];
      return this.randomChoice(commonLastNames);
    }
  }

  /**
   * 電話番号生成
   */
  private generatePhone(type: 'landline' | 'mobile'): string {
    const areaCodes = PHONE_AREA_CODES.filter(code => code.type === type);
    const areaCode = this.randomChoice(areaCodes);
    const number = this.generatePhoneNumber(7);
    return `${areaCode.code}-${number.slice(0, 4)}-${number.slice(4)}`;
  }

  /**
   * 住所生成
   */
  private generateAddress(settings?: any) {
    const prefecture = this.randomChoice(PREFECTURES);
    const city = this.randomChoice(CITIES);
    const street = `${Math.floor(Math.random() * 10) + 1}-${Math.floor(Math.random() * 10) + 1}-${Math.floor(Math.random() * 20) + 1}`;
    const building = Math.random() < 0.3 ? this.generateBuildingName() : '';
    
    const postalCode = `${prefecture.prefix}-${this.generatePhoneNumber(4)}`;
    const full = `${prefecture.name}${city}${street}${building ? ` ${building}` : ''}`;

    return {
      full,
      postalCode,
      prefecture: prefecture.name,
      city: city,
      street: street,
      ...(building && { building: building })
    };
  }

  /**
   * 職業情報生成
   */
  private generateJobInfo(settings?: any) {
    const company = this.randomChoice(COMPANIES);
    const jobTitle = this.randomChoice(JOB_TITLES);
    
    // テスト用の業界分類
    const industries = ['IT', 'テスト', '品質保証', 'システム開発', 'データ生成'];
    const industry = this.randomChoice(industries);

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
    
    if (fullName?.firstName && fullName?.lastName) {
      const name = `${fullName.firstName}${fullName.lastName}`.toLowerCase().replace(/\s+/g, '');
      return `https://www.${name}.${domain}`;
    }
    
    return `https://www.user${Math.floor(Math.random() * 9999)}.${domain}`;
  }

  /**
   * SNS ID生成
   */
  private generateSocialId(fullName?: any): string {
    if (fullName?.firstName && fullName?.lastName) {
      const name = `${fullName.firstName}${fullName.lastName}`.toLowerCase().replace(/\s+/g, '');
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

    // 基本バリデーション - 制限を1000件に更新
    if (!request.count || request.count < 1 || request.count > 1000) {
      errors.push('生成数は1-1000の範囲で指定してください');
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
    if (request.count > 500) {
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
    // 拡張されたローマ字変換マッピング
    const romajiMap: Record<string, string> = {
      // 男性の名前
      '太郎': 'Taro', '次郎': 'Jiro', '三郎': 'Saburo', '健': 'Ken', '誠': 'Makoto',
      '博': 'Hiroshi', '明': 'Akira', '隆': 'Takashi', '勇': 'Isamu', '進': 'Susumu',
      '大輔': 'Daisuke', '翔': 'Sho', '拓海': 'Takumi', '航': 'Wataru', '蓮': 'Ren',
      '悠人': 'Yuto', '陸斗': 'Rikuto', '颯': 'Hayate', '樹': 'Itsuki', '陽翔': 'Haruto',
      '大和': 'Yamato', '瑛太': 'Eita', '颯太': 'Sota', '湊': 'Minato', '悠斗': 'Haruto',
      
      // 女性の名前
      '花子': 'Hanako', '美咲': 'Misaki', '愛': 'Ai', '結愛': 'Yua', '陽菜': 'Hina',
      '咲良': 'Sakura', '美羽': 'Miu', '莉子': 'Riko', '心春': 'Koharu', '美桜': 'Mio',
      '葵': 'Aoi', '凛': 'Rin', 'さくら': 'Sakura', 'ひまり': 'Himari', 'あかり': 'Akari',
      '結': 'Yui', '心': 'Kokoro', '愛莉': 'Airi', '美月': 'Mitsuki', '優花': 'Yuka',
      
      // 姓（苗字）
      '佐藤': 'Sato', '鈴木': 'Suzuki', '高橋': 'Takahashi', '田中': 'Tanaka', '渡辺': 'Watanabe',
      '伊藤': 'Ito', '山本': 'Yamamoto', '中村': 'Nakamura', '小林': 'Kobayashi', '加藤': 'Kato',
      '吉田': 'Yoshida', '山田': 'Yamada', '佐々木': 'Sasaki', '山口': 'Yamaguchi', '松本': 'Matsumoto',
      '井上': 'Inoue', '木村': 'Kimura', '林': 'Hayashi', '斎藤': 'Saito', '清水': 'Shimizu',
      '山崎': 'Yamazaki', '森': 'Mori', '池田': 'Ikeda', '橋本': 'Hashimoto', '阿部': 'Abe',
      '石川': 'Ishikawa', '石井': 'Ishii', '小川': 'Ogawa', '前田': 'Maeda', '岡田': 'Okada'
    };

    const firstRomaji = romajiMap[firstName] || this.generateFallbackRomaji(firstName, true);
    const lastRomaji = romajiMap[lastName] || this.generateFallbackRomaji(lastName, false);
    
    return `${firstRomaji} ${lastRomaji}`;
  }

  private generateFallbackRomaji(name: string, isFirstName: boolean): string {
    // カナマッピングからローマ字への簡易変換
    const kana = KANA_MAPPING[name];
    if (kana) {
      // カタカナをローマ字に変換（簡易版）
      const kanaToRomaji: Record<string, string> = {
        'ア': 'A', 'イ': 'I', 'ウ': 'U', 'エ': 'E', 'オ': 'O',
        'カ': 'Ka', 'キ': 'Ki', 'ク': 'Ku', 'ケ': 'Ke', 'コ': 'Ko',
        'サ': 'Sa', 'シ': 'Shi', 'ス': 'Su', 'セ': 'Se', 'ソ': 'So',
        'タ': 'Ta', 'チ': 'Chi', 'ツ': 'Tsu', 'テ': 'Te', 'ト': 'To',
        'ナ': 'Na', 'ニ': 'Ni', 'ヌ': 'Nu', 'ネ': 'Ne', 'ノ': 'No',
        'ハ': 'Ha', 'ヒ': 'Hi', 'フ': 'Fu', 'ヘ': 'He', 'ホ': 'Ho',
        'マ': 'Ma', 'ミ': 'Mi', 'ム': 'Mu', 'メ': 'Me', 'モ': 'Mo',
        'ヤ': 'Ya', 'ユ': 'Yu', 'ヨ': 'Yo',
        'ラ': 'Ra', 'リ': 'Ri', 'ル': 'Ru', 'レ': 'Re', 'ロ': 'Ro',
        'ワ': 'Wa', 'ヲ': 'Wo', 'ン': 'N'
      };
      
      let romaji = '';
      for (const char of kana) {
        romaji += kanaToRomaji[char] || char;
      }
      return romaji;
    }
    
    // フォールバック
    return isFirstName ? 'Taro' : 'Yamada';
  }

  private convertToKatakana(name: string): string {
    // フルネームを姓と名に分けて個別に変換
    const parts = name.split(' ');
    if (parts.length === 2 && parts[0] && parts[1]) {
      const lastName = parts[0];
      const firstName = parts[1];
      const lastNameKana = KANA_MAPPING[lastName] || lastName;
      const firstNameKana = KANA_MAPPING[firstName] || firstName;
      return `${lastNameKana} ${firstNameKana}`;
    }
    
    // 単一の名前の場合、直接変換
    return KANA_MAPPING[name] || name;
  }
} 
