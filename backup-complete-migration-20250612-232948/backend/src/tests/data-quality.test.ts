/**
 * データ品質テスト
 * TD Buddy - Data Quality Tests
 *
 * @description 生成データの品質・妥当性を検証
 * @author TestData Buddy Team
 * @version 1.0.0
 */

import { PersonalInfoService } from '../services/PersonalInfoService';

describe('🎯 Data Quality Tests', () => {
  let personalInfoService: PersonalInfoService;

  beforeAll(() => {
    personalInfoService = new PersonalInfoService();
  });

  describe('📊 重複データ検証', () => {
    test('✅ 大量生成時のID重複なし', async () => {
      const result = await personalInfoService.generatePersonalInfo({
        count: 500,
        locale: 'ja',
        includeFields: ['fullName', 'email', 'phone'],
      });

      const ids = result.persons.map(person => person.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
      expect(result.persons).toHaveLength(500);
    });

    test('✅ メールアドレス重複なし', async () => {
      const result = await personalInfoService.generatePersonalInfo({
        count: 200,
        locale: 'ja',
        includeFields: ['email'],
      });

      const emails = result.persons.map(person => person.email);
      const uniqueEmails = new Set(emails);

      expect(uniqueEmails.size).toBe(emails.length);
    });

    test('✅ 電話番号重複なし', async () => {
      const result = await personalInfoService.generatePersonalInfo({
        count: 200,
        locale: 'ja',
        includeFields: ['phone'],
      });

      const phones = result.data.map(person => person.phone);
      const uniquePhones = new Set(phones);

      expect(uniquePhones.size).toBe(phones.length);
    });
  });

  describe('🔤 氏名品質検証', () => {
    test('✅ 漢字氏名の形式検証', async () => {
      const result = await personalInfoService.generatePersonalInfo({
        count: 50,
        locale: 'ja',
        includeFields: ['fullName'],
      });

      result.data.forEach(person => {
        // 姓名がスペース区切りで構成されている
        expect(person.fullName.kanji).toMatch(/^.+ .+$/);

        // 姓と名が個別に存在
        expect(person.fullName.lastName).toBeTruthy();
        expect(person.fullName.firstName).toBeTruthy();
        expect(person.fullName.lastName.length).toBeGreaterThan(0);
        expect(person.fullName.firstName.length).toBeGreaterThan(0);

        // 姓名の組み合わせが正しい
        expect(person.fullName.kanji).toBe(
          `${person.fullName.lastName} ${person.fullName.firstName}`
        );
      });
    });

    test('✅ カナ名の形式検証', async () => {
      const result = await personalInfoService.generatePersonalInfo({
        count: 30,
        locale: 'ja',
        includeFields: ['kanaName'],
      });

      result.data.forEach(person => {
        // カタカナのみで構成されている
        expect(person.kanaName).toMatch(/^[ァ-ヶー\s]+$/);

        // 空でない
        expect(person.kanaName.trim().length).toBeGreaterThan(0);
      });
    });

    test('✅ 氏名の多様性検証', async () => {
      const result = await personalInfoService.generatePersonalInfo({
        count: 100,
        locale: 'ja',
        includeFields: ['fullName'],
      });

      const lastNames = result.data.map(person => person.fullName.lastName);
      const firstNames = result.data.map(person => person.fullName.firstName);

      const uniqueLastNames = new Set(lastNames);
      const uniqueFirstNames = new Set(firstNames);

      // 十分な多様性があること
      expect(uniqueLastNames.size).toBeGreaterThan(20); // 最低20種類の姓
      expect(uniqueFirstNames.size).toBeGreaterThan(30); // 最低30種類の名

      // 重複率が適切であること（完全にユニークである必要はない）
      const lastNameDuplicationRate =
        (lastNames.length - uniqueLastNames.size) / lastNames.length;
      const firstNameDuplicationRate =
        (firstNames.length - uniqueFirstNames.size) / firstNames.length;

      expect(lastNameDuplicationRate).toBeLessThan(0.8); // 重複率80%未満
      expect(firstNameDuplicationRate).toBeLessThan(0.7); // 重複率70%未満
    });
  });

  describe('📧 メールアドレス品質検証', () => {
    test('✅ メールアドレス形式の妥当性', async () => {
      const result = await personalInfoService.generatePersonalInfo({
        count: 100,
        locale: 'ja',
        includeFields: ['email'],
      });

      result.data.forEach(person => {
        // 基本的なメール形式
        expect(person.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

        // @マークが1つだけ
        expect((person.email.match(/@/g) || []).length).toBe(1);

        // ドメイン部分の検証
        const domain = person.email.split('@')[1];
        expect(domain).toMatch(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
      });
    });

    test('✅ テストドメインの使用確認', async () => {
      const result = await personalInfoService.generatePersonalInfo({
        count: 50,
        locale: 'ja',
        includeFields: ['email'],
      });

      const testDomains = [
        'example.com',
        'test.com',
        'sample.net',
        'prototype.test',
        'qa-test.invalid',
        'beta-test.dev',
        'temp-mail.demo',
        'virtual-user.test',
        'unit-test.example',
        'system-test.mock',
        'integration.test',
        'test-mail.jp',
      ];

      result.data.forEach(person => {
        const domain = person.email.split('@')[1];
        expect(testDomains).toContain(domain);
      });
    });

    test('✅ メールアドレスの多様性', async () => {
      const result = await personalInfoService.generatePersonalInfo({
        count: 100,
        locale: 'ja',
        includeFields: ['email'],
      });

      const domains = result.data.map(person => person.email.split('@')[1]);
      const uniqueDomains = new Set(domains);

      // 複数のドメインが使用されている
      expect(uniqueDomains.size).toBeGreaterThan(3);
    });
  });

  describe('📞 電話番号品質検証', () => {
    test('✅ 電話番号形式の妥当性', async () => {
      const result = await personalInfoService.generatePersonalInfo({
        count: 100,
        locale: 'ja',
        includeFields: ['phone'],
      });

      result.data.forEach(person => {
        // 日本の電話番号形式
        expect(person.phone).toMatch(/^0\d{2,3}-\d{4}-\d{3,4}$/);

        // 0で始まる
        expect(person.phone.charAt(0)).toBe('0');

        // ハイフンが2つ
        expect((person.phone.match(/-/g) || []).length).toBe(2);
      });
    });

    test('✅ 電話番号の多様性', async () => {
      const result = await personalInfoService.generatePersonalInfo({
        count: 200,
        locale: 'ja',
        includeFields: ['phone'],
      });

      const areaCodes = result.data.map(person => person.phone.split('-')[0]);
      const uniqueAreaCodes = new Set(areaCodes);

      // 複数の市外局番が使用されている
      expect(uniqueAreaCodes.size).toBeGreaterThan(5);
    });
  });

  describe('🏠 住所品質検証', () => {
    test('✅ 住所構造の妥当性', async () => {
      const result = await personalInfoService.generatePersonalInfo({
        count: 50,
        locale: 'ja',
        includeFields: ['address'],
      });

      result.data.forEach(person => {
        const address = person.address;

        // 必須フィールドの存在確認
        expect(address.full).toBeTruthy();
        expect(address.prefecture).toBeTruthy();
        expect(address.city).toBeTruthy();
        expect(address.street).toBeTruthy();
        expect(address.postalCode).toBeTruthy();

        // 郵便番号形式
        expect(address.postalCode).toMatch(/^\d{3}-\d{4}$/);

        // 完全住所の構成確認
        expect(address.full).toContain(address.prefecture);
        expect(address.full).toContain(address.city);
        expect(address.full).toContain(address.street);
      });
    });

    test('✅ 住所の多様性', async () => {
      const result = await personalInfoService.generatePersonalInfo({
        count: 100,
        locale: 'ja',
        includeFields: ['address'],
      });

      const prefectures = result.data.map(person => person.address.prefecture);
      const cities = result.data.map(person => person.address.city);

      const uniquePrefectures = new Set(prefectures);
      const uniqueCities = new Set(cities);

      // 複数の都道府県・市区町村が使用されている
      expect(uniquePrefectures.size).toBeGreaterThan(3);
      expect(uniqueCities.size).toBeGreaterThan(5);
    });
  });

  describe('👤 個人属性品質検証', () => {
    test('✅ 年齢の妥当性', async () => {
      const result = await personalInfoService.generatePersonalInfo({
        count: 100,
        locale: 'ja',
        includeFields: ['age'],
      });

      result.data.forEach(person => {
        expect(person.age).toBeGreaterThanOrEqual(18);
        expect(person.age).toBeLessThanOrEqual(80);
        expect(Number.isInteger(person.age)).toBe(true);
      });
    });

    test('✅ 性別の妥当性', async () => {
      const result = await personalInfoService.generatePersonalInfo({
        count: 100,
        locale: 'ja',
        includeFields: ['gender'],
      });

      const validGenders = ['male', 'female'];

      result.data.forEach(person => {
        expect(validGenders).toContain(person.gender);
      });

      // 性別の分布確認（極端に偏っていないか）
      const genderCounts = result.data.reduce((acc, person) => {
        acc[person.gender] = (acc[person.gender] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const maleRatio = genderCounts.male / result.data.length;
      const femaleRatio = genderCounts.female / result.data.length;

      // 20%-80%の範囲内であること（極端な偏りなし）
      expect(maleRatio).toBeGreaterThan(0.2);
      expect(maleRatio).toBeLessThan(0.8);
      expect(femaleRatio).toBeGreaterThan(0.2);
      expect(femaleRatio).toBeLessThan(0.8);
    });
  });

  describe('🏢 職業情報品質検証', () => {
    test('✅ 会社名・職業の妥当性', async () => {
      const result = await personalInfoService.generatePersonalInfo({
        count: 50,
        locale: 'ja',
        includeFields: ['company', 'jobTitle'],
      });

      result.data.forEach(person => {
        expect(person.company).toBeTruthy();
        expect(person.jobTitle).toBeTruthy();
        expect(person.industry).toBeTruthy();

        expect(person.company.length).toBeGreaterThan(0);
        expect(person.jobTitle.length).toBeGreaterThan(0);
        expect(person.industry.length).toBeGreaterThan(0);
      });
    });

    test('✅ 職業情報の多様性', async () => {
      const result = await personalInfoService.generatePersonalInfo({
        count: 100,
        locale: 'ja',
        includeFields: ['company', 'jobTitle'],
      });

      const companies = result.data.map(person => person.company);
      const jobTitles = result.data.map(person => person.jobTitle);
      const industries = result.data.map(person => person.industry);

      const uniqueCompanies = new Set(companies);
      const uniqueJobTitles = new Set(jobTitles);
      const uniqueIndustries = new Set(industries);

      // 十分な多様性があること
      expect(uniqueCompanies.size).toBeGreaterThan(10);
      expect(uniqueJobTitles.size).toBeGreaterThan(5);
      expect(uniqueIndustries.size).toBeGreaterThan(3);
    });
  });

  describe('🔗 データ整合性検証', () => {
    test('✅ 全フィールド生成時の整合性', async () => {
      const result = await personalInfoService.generatePersonalInfo({
        count: 20,
        locale: 'ja',
        includeFields: [
          'fullName',
          'kanaName',
          'email',
          'phone',
          'address',
          'age',
          'gender',
          'company',
          'jobTitle',
        ],
      });

      result.data.forEach(person => {
        // 全フィールドが存在すること
        expect(person.fullName).toBeDefined();
        expect(person.kanaName).toBeDefined();
        expect(person.email).toBeDefined();
        expect(person.phone).toBeDefined();
        expect(person.address).toBeDefined();
        expect(person.age).toBeDefined();
        expect(person.gender).toBeDefined();
        expect(person.company).toBeDefined();
        expect(person.jobTitle).toBeDefined();

        // 基本メタデータの存在
        expect(person.id).toBeDefined();
        expect(person.generatedAt).toBeDefined();
        expect(person.locale).toBe('ja');
      });
    });

    test('✅ 部分フィールド生成時の整合性', async () => {
      const result = await personalInfoService.generatePersonalInfo({
        count: 10,
        locale: 'ja',
        includeFields: ['fullName', 'email'],
      });

      result.data.forEach(person => {
        // 指定フィールドのみ存在
        expect(person.fullName).toBeDefined();
        expect(person.email).toBeDefined();

        // 未指定フィールドは存在しない
        expect(person.phone).toBeUndefined();
        expect(person.address).toBeUndefined();
        expect(person.age).toBeUndefined();
        expect(person.gender).toBeUndefined();
        expect(person.company).toBeUndefined();
        expect(person.jobTitle).toBeUndefined();
        expect(person.kanaName).toBeUndefined();
      });
    });
  });
});

// Brew からのメッセージ
console.log(
  '🍺 Brew: データ品質テストを実行中です！醸造データの品質を徹底的にチェックしましょう♪'
);
