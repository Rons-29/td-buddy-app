/**
 * CSV設定テンプレート管理機能
 * TestData Buddy (TD) - Template Management System
 */

import { ColumnConfig, CsvConfig } from '../types/csvDataTypes';

export interface CsvTemplate {
  id: string;
  name: string;
  description: string;
  columns: ColumnConfig[];
  defaultRowCount: number;
  createdAt: string;
  updatedAt: string;
  category: TemplateCategory;
  tags: string[];
  isBuiltIn: boolean;
  usage: number;
}

export type TemplateCategory =
  | 'business'
  | 'personal'
  | 'testing'
  | 'sample'
  | 'custom';

export interface TemplateSearchOptions {
  category?: TemplateCategory;
  tags?: string[];
  keyword?: string;
  includeBuiltIn?: boolean;
}

export interface TemplateOperationResult {
  success: boolean;
  message: string;
  template?: CsvTemplate;
}

/**
 * CSV テンプレート管理クラス
 */
export class CSVTemplateManager {
  private static readonly STORAGE_KEY = 'td_csv_templates';
  private static readonly MAX_CUSTOM_TEMPLATES = 50;

  /**
   * 内蔵テンプレートの定義
   */
  private static readonly BUILT_IN_TEMPLATES: CsvTemplate[] = [
    {
      id: 'employee_basic',
      name: '社員名簿（基本）',
      description: '基本的な社員情報のテンプレート',
      columns: [
        {
          id: 'emp_01',
          name: '社員番号',
          dataType: 'number',
          settings: { min: 1000, max: 9999 },
          nullable: false,
          nullRatio: 0,
          unique: true,
        },
        {
          id: 'emp_02',
          name: '氏名',
          dataType: 'name',
          settings: {},
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
        {
          id: 'emp_03',
          name: 'メールアドレス',
          dataType: 'email',
          settings: {},
          nullable: false,
          nullRatio: 0,
          unique: true,
        },
        {
          id: 'emp_04',
          name: '電話番号',
          dataType: 'phone',
          settings: {},
          nullable: true,
          nullRatio: 5,
          unique: false,
        },
        {
          id: 'emp_05',
          name: '年齢',
          dataType: 'age',
          settings: {},
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
      ],
      defaultRowCount: 100,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'business',
      tags: ['社員', '人事', 'HR'],
      isBuiltIn: true,
      usage: 0,
    },
    {
      id: 'employee_detailed',
      name: '社員名簿（詳細）',
      description: '詳細な社員情報を含むテンプレート',
      columns: [
        {
          id: 'empd_01',
          name: '社員番号',
          dataType: 'number',
          settings: { min: 1000, max: 9999 },
          nullable: false,
          nullRatio: 0,
          unique: true,
        },
        {
          id: 'empd_02',
          name: '氏名',
          dataType: 'name',
          settings: {},
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
        {
          id: 'empd_03',
          name: 'フリガナ',
          dataType: 'text',
          settings: { language: 'ja' },
          nullable: true,
          nullRatio: 5,
          unique: false,
        },
        {
          id: 'empd_04',
          name: 'メールアドレス',
          dataType: 'email',
          settings: {},
          nullable: false,
          nullRatio: 0,
          unique: true,
        },
        {
          id: 'empd_05',
          name: '電話番号',
          dataType: 'phone',
          settings: {},
          nullable: true,
          nullRatio: 5,
          unique: false,
        },
        {
          id: 'empd_06',
          name: '年齢',
          dataType: 'age',
          settings: {},
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
        {
          id: 'empd_07',
          name: '部署',
          dataType: 'text',
          settings: { language: 'ja' },
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
        {
          id: 'empd_08',
          name: '役職',
          dataType: 'text',
          settings: { language: 'ja' },
          nullable: true,
          nullRatio: 10,
          unique: false,
        },
        {
          id: 'empd_09',
          name: '入社日',
          dataType: 'date',
          settings: { startDate: '2020-01-01', endDate: '2024-12-31' },
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
        {
          id: 'empd_10',
          name: '給与',
          dataType: 'number',
          settings: { min: 200000, max: 1000000 },
          nullable: true,
          nullRatio: 15,
          unique: false,
        },
      ],
      defaultRowCount: 100,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'business',
      tags: ['社員', '人事', 'HR', '詳細'],
      isBuiltIn: true,
      usage: 0,
    },
    {
      id: 'customer_basic',
      name: '顧客情報（基本）',
      description: '基本的な顧客情報のテンプレート',
      columns: [
        {
          id: 'cust_01',
          name: '顧客ID',
          dataType: 'number',
          settings: { min: 10000, max: 99999 },
          nullable: false,
          nullRatio: 0,
          unique: true,
        },
        {
          id: 'cust_02',
          name: '顧客名',
          dataType: 'name',
          settings: {},
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
        {
          id: 'cust_03',
          name: 'メールアドレス',
          dataType: 'email',
          settings: {},
          nullable: false,
          nullRatio: 0,
          unique: true,
        },
        {
          id: 'cust_04',
          name: '電話番号',
          dataType: 'phone',
          settings: {},
          nullable: true,
          nullRatio: 10,
          unique: false,
        },
        {
          id: 'cust_05',
          name: '年齢',
          dataType: 'age',
          settings: {},
          nullable: true,
          nullRatio: 5,
          unique: false,
        },
        {
          id: 'cust_06',
          name: '登録日',
          dataType: 'date',
          settings: { startDate: '2023-01-01', endDate: '2024-12-31' },
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
      ],
      defaultRowCount: 500,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'business',
      tags: ['顧客', 'CRM', '営業'],
      isBuiltIn: true,
      usage: 0,
    },
    {
      id: 'product_catalog',
      name: '商品カタログ',
      description: '商品情報のテンプレート',
      columns: [
        {
          id: 'prod_01',
          name: '商品ID',
          dataType: 'number',
          settings: { min: 1, max: 10000 },
          nullable: false,
          nullRatio: 0,
          unique: true,
        },
        {
          id: 'prod_02',
          name: '商品名',
          dataType: 'text',
          settings: { language: 'ja' },
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
        {
          id: 'prod_03',
          name: 'カテゴリ',
          dataType: 'text',
          settings: { language: 'ja' },
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
        {
          id: 'prod_04',
          name: '価格',
          dataType: 'number',
          settings: { min: 100, max: 100000 },
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
        {
          id: 'prod_05',
          name: '在庫数',
          dataType: 'number',
          settings: { min: 0, max: 1000 },
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
        {
          id: 'prod_06',
          name: '説明',
          dataType: 'text',
          settings: { language: 'ja' },
          nullable: true,
          nullRatio: 20,
          unique: false,
        },
        {
          id: 'prod_07',
          name: '登録日',
          dataType: 'date',
          settings: { startDate: '2024-01-01', endDate: '2024-12-31' },
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
      ],
      defaultRowCount: 200,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'business',
      tags: ['商品', 'ECサイト', '在庫'],
      isBuiltIn: true,
      usage: 0,
    },
    {
      id: 'sales_data',
      name: '売上データ',
      description: '売上情報のテンプレート',
      columns: [
        {
          id: 'sale_01',
          name: '売上ID',
          dataType: 'number',
          settings: { min: 100000, max: 999999 },
          nullable: false,
          nullRatio: 0,
          unique: true,
        },
        {
          id: 'sale_02',
          name: '顧客ID',
          dataType: 'number',
          settings: { min: 10000, max: 99999 },
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
        {
          id: 'sale_03',
          name: '商品ID',
          dataType: 'number',
          settings: { min: 1, max: 10000 },
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
        {
          id: 'sale_04',
          name: '数量',
          dataType: 'number',
          settings: { min: 1, max: 10 },
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
        {
          id: 'sale_05',
          name: '単価',
          dataType: 'number',
          settings: { min: 100, max: 100000 },
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
        {
          id: 'sale_06',
          name: '合計金額',
          dataType: 'number',
          settings: { min: 100, max: 1000000 },
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
        {
          id: 'sale_07',
          name: '売上日',
          dataType: 'date',
          settings: { startDate: '2024-01-01', endDate: '2024-12-31' },
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
      ],
      defaultRowCount: 1000,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'business',
      tags: ['売上', '営業', '分析'],
      isBuiltIn: true,
      usage: 0,
    },
    {
      id: 'test_users',
      name: 'テストユーザー',
      description: 'アプリケーションテスト用のユーザーデータ',
      columns: [
        {
          id: 'user_01',
          name: 'ユーザーID',
          dataType: 'number',
          settings: { min: 1, max: 10000 },
          nullable: false,
          nullRatio: 0,
          unique: true,
        },
        {
          id: 'user_02',
          name: 'ユーザー名',
          dataType: 'name',
          settings: {},
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
        {
          id: 'user_03',
          name: 'メールアドレス',
          dataType: 'email',
          settings: {},
          nullable: false,
          nullRatio: 0,
          unique: true,
        },
        {
          id: 'user_04',
          name: 'パスワード',
          dataType: 'text',
          settings: { language: 'en' },
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
        {
          id: 'user_05',
          name: '登録日',
          dataType: 'date',
          settings: { startDate: '2023-01-01', endDate: '2024-12-31' },
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
        {
          id: 'user_06',
          name: 'ステータス',
          dataType: 'text',
          settings: { language: 'en' },
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
      ],
      defaultRowCount: 50,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: 'testing',
      tags: ['テスト', 'ユーザー', 'QA'],
      isBuiltIn: true,
      usage: 0,
    },
  ];

  /**
   * すべてのテンプレートを取得
   */
  static getAllTemplates(options?: TemplateSearchOptions): CsvTemplate[] {
    const customTemplates = this.getCustomTemplates();
    const builtInTemplates =
      options?.includeBuiltIn !== false ? this.BUILT_IN_TEMPLATES : [];

    let allTemplates = [...builtInTemplates, ...customTemplates];

    // フィルタリング
    if (options?.category) {
      allTemplates = allTemplates.filter(t => t.category === options.category);
    }

    if (options?.tags && options.tags.length > 0) {
      allTemplates = allTemplates.filter(t =>
        options.tags!.some(tag => t.tags.includes(tag))
      );
    }

    if (options?.keyword) {
      const keyword = options.keyword.toLowerCase();
      allTemplates = allTemplates.filter(
        t =>
          t.name.toLowerCase().includes(keyword) ||
          t.description.toLowerCase().includes(keyword) ||
          t.tags.some(tag => tag.toLowerCase().includes(keyword))
      );
    }

    // 使用回数の多い順にソート
    return allTemplates.sort((a, b) => b.usage - a.usage);
  }

  /**
   * カスタムテンプレートを取得
   */
  private static getCustomTemplates(): CsvTemplate[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('TDからの警告: テンプレート読み込みエラー', error);
      return [];
    }
  }

  /**
   * カスタムテンプレートを保存
   */
  private static saveCustomTemplates(templates: CsvTemplate[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error('TDからのエラー: テンプレート保存エラー', error);
      throw new Error('テンプレートの保存に失敗しました');
    }
  }

  /**
   * 新しいテンプレートを保存
   */
  static saveTemplate(
    name: string,
    description: string,
    config: CsvConfig,
    category: TemplateCategory = 'custom',
    tags: string[] = []
  ): TemplateOperationResult {
    try {
      const customTemplates = this.getCustomTemplates();

      // 制限チェック
      if (customTemplates.length >= this.MAX_CUSTOM_TEMPLATES) {
        return {
          success: false,
          message: `カスタムテンプレートは${this.MAX_CUSTOM_TEMPLATES}個まで保存できます`,
        };
      }

      // 名前の重複チェック
      const existingTemplate = customTemplates.find(t => t.name === name);
      if (existingTemplate) {
        return {
          success: false,
          message: 'この名前のテンプレートは既に存在します',
        };
      }

      // 新しいテンプレート作成
      const newTemplate: CsvTemplate = {
        id: this.generateTemplateId(),
        name,
        description,
        columns: config.columns,
        defaultRowCount: config.rowCount || 100,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category,
        tags,
        isBuiltIn: false,
        usage: 0,
      };

      // 保存
      customTemplates.push(newTemplate);
      this.saveCustomTemplates(customTemplates);

      return {
        success: true,
        message: 'テンプレートを保存しました',
        template: newTemplate,
      };
    } catch (error) {
      return {
        success: false,
        message: `保存エラー: ${
          error instanceof Error ? error.message : '不明なエラー'
        }`,
      };
    }
  }

  /**
   * テンプレートを更新
   */
  static updateTemplate(
    id: string,
    updates: Partial<CsvTemplate>
  ): TemplateOperationResult {
    try {
      const customTemplates = this.getCustomTemplates();
      const templateIndex = customTemplates.findIndex(t => t.id === id);

      if (templateIndex === -1) {
        return {
          success: false,
          message: 'テンプレートが見つかりません',
        };
      }

      // 内蔵テンプレートは編集不可
      if (customTemplates[templateIndex].isBuiltIn) {
        return {
          success: false,
          message: '内蔵テンプレートは編集できません',
        };
      }

      // 更新
      customTemplates[templateIndex] = {
        ...customTemplates[templateIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      this.saveCustomTemplates(customTemplates);

      return {
        success: true,
        message: 'テンプレートを更新しました',
        template: customTemplates[templateIndex],
      };
    } catch (error) {
      return {
        success: false,
        message: `更新エラー: ${
          error instanceof Error ? error.message : '不明なエラー'
        }`,
      };
    }
  }

  /**
   * テンプレートを削除
   */
  static deleteTemplate(id: string): TemplateOperationResult {
    try {
      const customTemplates = this.getCustomTemplates();
      const templateIndex = customTemplates.findIndex(t => t.id === id);

      if (templateIndex === -1) {
        return {
          success: false,
          message: 'テンプレートが見つかりません',
        };
      }

      // 内蔵テンプレートは削除不可
      if (customTemplates[templateIndex].isBuiltIn) {
        return {
          success: false,
          message: '内蔵テンプレートは削除できません',
        };
      }

      // 削除
      const deletedTemplate = customTemplates.splice(templateIndex, 1)[0];
      this.saveCustomTemplates(customTemplates);

      return {
        success: true,
        message: 'テンプレートを削除しました',
        template: deletedTemplate,
      };
    } catch (error) {
      return {
        success: false,
        message: `削除エラー: ${
          error instanceof Error ? error.message : '不明なエラー'
        }`,
      };
    }
  }

  /**
   * テンプレートを取得
   */
  static getTemplate(id: string): CsvTemplate | null {
    // 内蔵テンプレートから検索
    const builtInTemplate = this.BUILT_IN_TEMPLATES.find(t => t.id === id);
    if (builtInTemplate) {
      return builtInTemplate;
    }

    // カスタムテンプレートから検索
    const customTemplates = this.getCustomTemplates();
    return customTemplates.find(t => t.id === id) || null;
  }

  /**
   * テンプレートの使用回数を増やす
   */
  static incrementUsage(id: string): void {
    // 内蔵テンプレートの場合は何もしない（統計情報のみ）
    const builtInTemplate = this.BUILT_IN_TEMPLATES.find(t => t.id === id);
    if (builtInTemplate) {
      builtInTemplate.usage++;
      return;
    }

    // カスタムテンプレートの場合
    const customTemplates = this.getCustomTemplates();
    const template = customTemplates.find(t => t.id === id);

    if (template) {
      template.usage++;
      this.saveCustomTemplates(customTemplates);
    }
  }

  /**
   * テンプレートからCSV設定を生成
   */
  static templateToConfig(template: CsvTemplate): CsvConfig {
    return {
      columns: template.columns,
      rowCount: template.defaultRowCount,
      outputFormat: 'csv',
      includeHeader: true,
      encoding: 'utf-8-bom',
    };
  }

  /**
   * CSV設定からテンプレート用データを抽出
   */
  static configToTemplateData(
    config: CsvConfig
  ): Pick<CsvTemplate, 'columns' | 'defaultRowCount'> {
    return {
      columns: config.columns,
      defaultRowCount: config.rowCount || 100,
    };
  }

  /**
   * テンプレートのエクスポート
   */
  static exportTemplate(id: string): string | null {
    const template = this.getTemplate(id);
    if (!template) return null;

    return JSON.stringify(template, null, 2);
  }

  /**
   * テンプレートのインポート
   */
  static importTemplate(jsonString: string): TemplateOperationResult {
    try {
      const templateData = JSON.parse(jsonString);

      // 基本的なバリデーション
      if (!templateData.name || !templateData.columns) {
        return {
          success: false,
          message: 'テンプレートの形式が正しくありません',
        };
      }

      // 新しいIDを生成（重複防止）
      const newTemplate: CsvTemplate = {
        ...templateData,
        id: this.generateTemplateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isBuiltIn: false,
        usage: 0,
      };

      const customTemplates = this.getCustomTemplates();
      customTemplates.push(newTemplate);
      this.saveCustomTemplates(customTemplates);

      return {
        success: true,
        message: 'テンプレートをインポートしました',
        template: newTemplate,
      };
    } catch (error) {
      return {
        success: false,
        message: `インポートエラー: ${
          error instanceof Error ? error.message : '不明なエラー'
        }`,
      };
    }
  }

  /**
   * すべてのカスタムテンプレートを削除
   */
  static clearAllCustomTemplates(): TemplateOperationResult {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return {
        success: true,
        message: 'すべてのカスタムテンプレートを削除しました',
      };
    } catch (error) {
      return {
        success: false,
        message: `削除エラー: ${
          error instanceof Error ? error.message : '不明なエラー'
        }`,
      };
    }
  }

  /**
   * テンプレートIDの生成
   */
  private static generateTemplateId(): string {
    return `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * テンプレート統計情報の取得
   */
  static getTemplateStats(): {
    totalBuiltIn: number;
    totalCustom: number;
    mostUsed: CsvTemplate[];
    recentlyCreated: CsvTemplate[];
  } {
    const customTemplates = this.getCustomTemplates();
    const allTemplates = [...this.BUILT_IN_TEMPLATES, ...customTemplates];

    return {
      totalBuiltIn: this.BUILT_IN_TEMPLATES.length,
      totalCustom: customTemplates.length,
      mostUsed: allTemplates.sort((a, b) => b.usage - a.usage).slice(0, 5),
      recentlyCreated: customTemplates
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5),
    };
  }
}

/**
 * TDスタイルのテンプレート管理支援
 */
export class TDTemplateHelper {
  /**
   * テンプレート操作結果のTDメッセージ
   */
  static formatOperationResult(result: TemplateOperationResult): string {
    const prefix = result.success ? '✅ TDからのメッセージ' : '🚨 TDからの警告';
    return `${prefix}: ${result.message}`;
  }

  /**
   * テンプレート推奨の提案
   */
  static suggestTemplates(keyword: string): CsvTemplate[] {
    const suggestions: { template: CsvTemplate; score: number }[] = [];
    const allTemplates = CSVTemplateManager.getAllTemplates({
      includeBuiltIn: true,
    });

    allTemplates.forEach(template => {
      let score = 0;

      // 名前の一致
      if (template.name.toLowerCase().includes(keyword.toLowerCase())) {
        score += 10;
      }

      // 説明の一致
      if (template.description.toLowerCase().includes(keyword.toLowerCase())) {
        score += 5;
      }

      // タグの一致
      template.tags.forEach(tag => {
        if (tag.toLowerCase().includes(keyword.toLowerCase())) {
          score += 3;
        }
      });

      // 使用回数ボーナス
      score += Math.min(template.usage * 0.1, 5);

      if (score > 0) {
        suggestions.push({ template, score });
      }
    });

    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(s => s.template);
  }

  /**
   * テンプレート使用の説明
   */
  static explainTemplate(template: CsvTemplate): string {
    let explanation = `📋 ${template.name}\n\n`;
    explanation += `${template.description}\n\n`;
    explanation += `📊 詳細情報:\n`;
    explanation += `- 列数: ${template.columns.length}列\n`;
    explanation += `- デフォルト生成件数: ${template.defaultRowCount.toLocaleString()}件\n`;
    explanation += `- カテゴリ: ${this.getCategoryName(template.category)}\n`;

    if (template.tags.length > 0) {
      explanation += `- タグ: ${template.tags.join(', ')}\n`;
    }

    explanation += `- 使用回数: ${template.usage}回\n\n`;

    explanation += `📝 含まれる列:\n`;
    template.columns.forEach((col, index) => {
      explanation += `${index + 1}. ${col.name} (${this.getDataTypeName(
        col.dataType
      )})\n`;
    });

    explanation += `\n💡 TDからのアドバイス: このテンプレートは${template.category}カテゴリでよく使われています♪`;

    return explanation;
  }

  /**
   * カテゴリ名の日本語変換
   */
  private static getCategoryName(category: TemplateCategory): string {
    const categoryNames: Record<TemplateCategory, string> = {
      business: 'ビジネス',
      personal: '個人',
      testing: 'テスト',
      sample: 'サンプル',
      custom: 'カスタム',
    };

    return categoryNames[category] || category;
  }

  /**
   * データ型名の日本語変換
   */
  private static getDataTypeName(dataType: string): string {
    const typeNames: Record<string, string> = {
      text: 'テキスト',
      number: '数値',
      name: '名前',
      email: 'メールアドレス',
      phone: '電話番号',
      date: '日付',
      age: '年齢',
    };

    return typeNames[dataType] || dataType;
  }
}
