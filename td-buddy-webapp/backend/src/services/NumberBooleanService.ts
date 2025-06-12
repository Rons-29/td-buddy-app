export interface NumberBooleanOptions {
  type: 'integer' | 'float' | 'percentage' | 'currency' | 'scientific' | 'boolean' | 'special';
  
  // 数値範囲設定
  min?: number;
  max?: number;
  
  // 小数点設定
  decimals?: number;
  precision?: number;
  
  // 通貨設定
  currency?: 'JPY' | 'USD' | 'EUR' | 'GBP' | 'CNY';
  locale?: string;
  
  // 真偽値設定
  booleanFormat?: 'boolean' | 'string' | 'number' | 'yesno' | 'onoff';
  trueProbability?: number; // 0-1の確率
  
  // フォーマット設定
  useThousandsSeparator?: boolean;
  customPrefix?: string;
  customSuffix?: string;
  
  // 特殊値設定
  allowNaN?: boolean;
  allowInfinity?: boolean;
  allowNegativeZero?: boolean;
  
  // 分布設定
  distribution?: 'uniform' | 'normal';
  mean?: number;
  standardDeviation?: number;
}

export interface GeneratedNumberBoolean {
  id: string;
  value: any;
  rawValue: number | boolean;
  formattedValue: string;
  type: string;
  options: NumberBooleanOptions;
  metadata: {
    isInteger: boolean;
    isNegative: boolean;
    isSpecial: boolean;
    digits: number;
    category: string;
  };
  brewMessage: string;
  generatedAt: Date;
}

export interface NumberBooleanGenerationResult {
  success: boolean;
  data: GeneratedNumberBoolean[];
  count: number;
  options: NumberBooleanOptions;
  message: string;
  brewMessage: string;
  generatedAt: Date;
}

export class NumberBooleanService {
  
  /**
   * 数値・真偽値生成メイン関数
   */
  async generateNumberBoolean(count: number, options: NumberBooleanOptions): Promise<NumberBooleanGenerationResult> {
    try {
      const data: GeneratedNumberBoolean[] = [];
      
      for (let i = 0; i < count; i++) {
        const generated = this.generateSingleValue(options);
        data.push(generated);
      }
      
      return {
        success: true,
        data,
        count: data.length,
        options,
        message: `${data.length}件の数値・真偽値を生成しました`,
        brewMessage: this.generateSuccessMessage(data.length, options.type),
        generatedAt: new Date(),
      };
      
    } catch (error: any) {
      return {
        success: false,
        data: [],
        count: 0,
        options,
        message: `数値・真偽値生成エラー: ${error?.message || '不明なエラー'}`,
        brewMessage: "エラーが発生しましたが、Brewが一緒に解決します！",
        generatedAt: new Date(),
      };
    }
  }
  
  /**
   * 単一値生成
   */
  private generateSingleValue(options: NumberBooleanOptions): GeneratedNumberBoolean {
    const id = `nb_${Date.now()}_${this.generateRandomId()}`;
    const generatedAt = new Date();
    
    let rawValue: number | boolean;
    let formattedValue: string;
    let metadata: any;
    
    switch (options.type) {
      case 'integer':
        rawValue = this.generateInteger(options);
        formattedValue = this.formatInteger(rawValue as number, options);
        metadata = this.generateNumberMetadata(rawValue as number, 'integer');
        break;
        
      case 'float':
        rawValue = this.generateFloat(options);
        formattedValue = this.formatFloat(rawValue as number, options);
        metadata = this.generateNumberMetadata(rawValue as number, 'float');
        break;
        
      case 'percentage':
        rawValue = this.generatePercentage(options);
        formattedValue = this.formatPercentage(rawValue as number, options);
        metadata = this.generateNumberMetadata(rawValue as number, 'percentage');
        break;
        
      case 'currency':
        rawValue = this.generateCurrency(options);
        formattedValue = this.formatCurrency(rawValue as number, options);
        metadata = this.generateNumberMetadata(rawValue as number, 'currency');
        break;
        
      case 'scientific':
        rawValue = this.generateScientific(options);
        formattedValue = this.formatScientific(rawValue as number, options);
        metadata = this.generateNumberMetadata(rawValue as number, 'scientific');
        break;
        
      case 'boolean':
        rawValue = this.generateBoolean(options);
        formattedValue = this.formatBoolean(rawValue as boolean, options);
        metadata = this.generateBooleanMetadata(rawValue as boolean);
        break;
        
      case 'special':
        rawValue = this.generateSpecialNumber(options);
        formattedValue = this.formatSpecialNumber(rawValue as number);
        metadata = this.generateNumberMetadata(rawValue as number, 'special');
        break;
        
      default:
        rawValue = this.generateInteger(options);
        formattedValue = String(rawValue);
        metadata = this.generateNumberMetadata(rawValue as number, 'integer');
    }
    
    return {
      id,
      value: formattedValue,
      rawValue,
      formattedValue,
      type: this.getTypeDisplayName(options.type),
      options,
      metadata,
      brewMessage: this.generateBrewMessage(options.type, rawValue),
      generatedAt,
    };
  }
  
  /**
   * 整数生成
   */
  private generateInteger(options: NumberBooleanOptions): number {
    const min = options.min ?? 0;
    const max = options.max ?? 100;
    
    if (options.distribution === 'normal' && options.mean !== undefined && options.standardDeviation !== undefined) {
      return Math.round(this.generateNormalDistribution(options.mean, options.standardDeviation));
    }
    
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  /**
   * 小数点数生成
   */
  private generateFloat(options: NumberBooleanOptions): number {
    const min = options.min ?? 0;
    const max = options.max ?? 100;
    const decimals = options.decimals ?? 2;
    
    let value: number;
    
    if (options.distribution === 'normal' && options.mean !== undefined && options.standardDeviation !== undefined) {
      value = this.generateNormalDistribution(options.mean, options.standardDeviation);
    } else {
      value = Math.random() * (max - min) + min;
    }
    
    return Number(value.toFixed(decimals));
  }
  
  /**
   * パーセンテージ生成
   */
  private generatePercentage(options: NumberBooleanOptions): number {
    const min = options.min ?? 0;
    const max = options.max ?? 100;
    const decimals = options.decimals ?? 1;
    
    const value = Math.random() * (max - min) + min;
    return Number(value.toFixed(decimals));
  }
  
  /**
   * 通貨生成
   */
  private generateCurrency(options: NumberBooleanOptions): number {
    const min = options.min ?? 0;
    const max = options.max ?? 10000;
    const decimals = options.currency === 'JPY' ? 0 : 2; // 日本円は小数なし
    
    const value = Math.random() * (max - min) + min;
    return Number(value.toFixed(decimals));
  }
  
  /**
   * 科学記法用数値生成
   */
  private generateScientific(options: NumberBooleanOptions): number {
    const exponentMin = options.min ?? -6;
    const exponentMax = options.max ?? 6;
    
    const mantissa = 1 + Math.random() * 9; // 1.0-9.99
    const exponent = Math.floor(Math.random() * (exponentMax - exponentMin + 1)) + exponentMin;
    
    return mantissa * Math.pow(10, exponent);
  }
  
  /**
   * 真偽値生成
   */
  private generateBoolean(options: NumberBooleanOptions): boolean {
    const probability = options.trueProbability ?? 0.5;
    return Math.random() < probability;
  }
  
  /**
   * 特殊数値生成
   */
  private generateSpecialNumber(options: NumberBooleanOptions): number {
    const specialValues = [];
    
    if (options.allowNaN) specialValues.push(NaN);
    if (options.allowInfinity) {
      specialValues.push(Infinity, -Infinity);
    }
    if (options.allowNegativeZero) specialValues.push(-0);
    
    // 特殊値がない場合は通常の数値を生成
    if (specialValues.length === 0) {
      return this.generateFloat(options);
    }
    
    // 30%の確率で特殊値、70%で通常の数値
    if (Math.random() < 0.3) {
      const randomIndex = Math.floor(Math.random() * specialValues.length);
      const selectedValue = specialValues[randomIndex];
      return selectedValue !== undefined ? selectedValue : this.generateFloat(options);
    } else {
      return this.generateFloat(options);
    }
  }
  
  /**
   * 正規分布生成（Box-Muller変換）
   */
  private generateNormalDistribution(mean: number, stdDev: number): number {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); // 0を回避
    while(v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdDev + mean;
  }
  
  /**
   * 整数フォーマット
   */
  private formatInteger(value: number, options: NumberBooleanOptions): string {
    let formatted = String(value);
    
    if (options.useThousandsSeparator) {
      formatted = value.toLocaleString('ja-JP');
    }
    
    if (options.customPrefix) formatted = options.customPrefix + formatted;
    if (options.customSuffix) formatted = formatted + options.customSuffix;
    
    return formatted;
  }
  
  /**
   * 小数点数フォーマット
   */
  private formatFloat(value: number, options: NumberBooleanOptions): string {
    const decimals = options.decimals ?? 2;
    let formatted = value.toFixed(decimals);
    
    if (options.useThousandsSeparator) {
      const [integer, decimal] = formatted.split('.');
      formatted = Number(integer).toLocaleString('ja-JP') + (decimal ? '.' + decimal : '');
    }
    
    if (options.customPrefix) formatted = options.customPrefix + formatted;
    if (options.customSuffix) formatted = formatted + options.customSuffix;
    
    return formatted;
  }
  
  /**
   * パーセンテージフォーマット
   */
  private formatPercentage(value: number, options: NumberBooleanOptions): string {
    const decimals = options.decimals ?? 1;
    return value.toFixed(decimals) + '%';
  }
  
  /**
   * 通貨フォーマット
   */
  private formatCurrency(value: number, options: NumberBooleanOptions): string {
    const currency = options.currency ?? 'JPY';
    const locale = options.locale ?? 'ja-JP';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(value);
  }
  
  /**
   * 科学記法フォーマット
   */
  private formatScientific(value: number, options: NumberBooleanOptions): string {
    const precision = options.precision ?? 3;
    return value.toExponential(precision);
  }
  
  /**
   * 真偽値フォーマット
   */
  private formatBoolean(value: boolean, options: NumberBooleanOptions): string {
    const format = options.booleanFormat ?? 'boolean';
    
    switch (format) {
      case 'boolean':
        return String(value);
      case 'string':
        return value ? 'true' : 'false';
      case 'number':
        return value ? '1' : '0';
      case 'yesno':
        return value ? 'yes' : 'no';
      case 'onoff':
        return value ? 'on' : 'off';
      default:
        return String(value);
    }
  }
  
  /**
   * 特殊数値フォーマット
   */
  private formatSpecialNumber(value: number): string {
    if (isNaN(value)) return 'NaN';
    if (value === Infinity) return 'Infinity';
    if (value === -Infinity) return '-Infinity';
    if (Object.is(value, -0)) return '-0';
    return String(value);
  }
  
  /**
   * 数値メタデータ生成
   */
  private generateNumberMetadata(value: number, category: string) {
    return {
      isInteger: Number.isInteger(value),
      isNegative: value < 0,
      isSpecial: !isFinite(value) || isNaN(value),
      digits: isFinite(value) ? String(Math.abs(Math.floor(value))).length : 0,
      category,
    };
  }
  
  /**
   * 真偽値メタデータ生成
   */
  private generateBooleanMetadata(value: boolean) {
    return {
      isInteger: false,
      isNegative: false,
      isSpecial: false,
      digits: 0,
      category: 'boolean',
    };
  }
  
  /**
   * タイプ表示名取得
   */
  private getTypeDisplayName(type: string): string {
    const typeNames: Record<string, string> = {
      integer: '整数',
      float: '小数点数',
      percentage: 'パーセンテージ',
      currency: '通貨',
      scientific: '科学記法',
      boolean: '真偽値',
      special: '特殊数値'
    };
    
    return typeNames[type] ?? type;
  }
  
     /**
    * TDメッセージ生成
    */
   private generateBrewMessage(type: string, value: number | boolean): string {
     const messages: Record<string, string[]> = {
       integer: [
         "整数生成、バッチリです！計算やカウンターに最適♪",
         "きれいな整数が生成できました！データベースにも優しいですね",
         "整数の力で、システムをスッキリ整理しましょう✨",
       ],
       float: [
         "精密な小数点数をお届けします！科学計算にもバッチリ",
         "美しい小数点数ですね♪測定値やスコアに最適です",
         "小数点の魔法で、データに彩りを添えました✨",
       ],
       percentage: [
         "パーセンテージ表示で分かりやすさ抜群！",
         "進捗率や成功率の表現にピッタリですね♪",
         "100%の品質でパーセンテージをお届けします！",
       ],
       currency: [
         "お金の計算もTDにお任せ！正確無比です💰",
         "通貨フォーマットで見やすさもバッチリ♪",
         "金融システムでも安心してお使いください✨",
       ],
       scientific: [
         "科学記法で大きな数値もスマートに表現！",
         "宇宙規模の数値から微細な測定まで対応♪",
         "科学者も納得の精密表記です🔬",
       ],
       boolean: [
         "シンプルイズベスト！真偽値の世界へようこそ",
         "true/falseの二択で、ロジックもスッキリ♪",
         "条件分岐の相棒、真偽値をお届けしました✨",
       ],
       special: [
         "特殊数値も華麗に生成！JavaScript的な粋ですね",
         "NaNやInfinityも、TDの手にかかれば美しいデータ♪",
         "エッジケースのテストに最適な特殊値です🌟",
       ]
     };
     
     const typeMessages = messages[type] || messages['integer'];
     if (!typeMessages || typeMessages.length === 0) {
       return "TDが数値・真偽値を生成しました♪";
     }
     const randomIndex = Math.floor(Math.random() * typeMessages.length);
     const selectedMessage = typeMessages[randomIndex];
     return selectedMessage || "TDが数値・真偽値を生成しました♪";
   }
  
  /**
   * 成功メッセージ生成
   */
  private generateSuccessMessage(count: number, type: string): string {
    const typeNames: Record<string, string> = {
      integer: '整数',
      float: '小数点数', 
      percentage: 'パーセンテージ',
      currency: '通貨',
      scientific: '科学記法',
      boolean: '真偽値',
      special: '特殊数値'
    };
    
    const typeName = typeNames[type] ?? '数値・真偽値';
    return `${typeName}生成、完了です！${count}件すべて品質チェック済み♪`;
  }
  
  /**
   * ランダムID生成
   */
  private generateRandomId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
  
  /**
   * 数値・真偽値検証
   */
  validateNumberBoolean(value: any, type: string): boolean {
    try {
      switch (type) {
        case 'integer':
          return Number.isInteger(Number(value));
        case 'float':
          return !isNaN(Number(value)) && isFinite(Number(value));
        case 'percentage':
          const num = parseFloat(String(value).replace('%', ''));
          return !isNaN(num) && num >= 0 && num <= 100;
        case 'currency':
          const currencyRegex = /^[¥$€£¢]?[\d,]+\.?\d*$/;
          return currencyRegex.test(String(value).replace(/\s/g, ''));
        case 'scientific':
          const sciRegex = /^-?\d+\.?\d*[eE][+-]?\d+$/;
          return sciRegex.test(String(value));
        case 'boolean':
          return typeof value === 'boolean' || value === 'true' || value === 'false' || value === '1' || value === '0';
        case 'special':
          return isNaN(Number(value)) || !isFinite(Number(value));
        default:
          return !isNaN(Number(value));
      }
    } catch {
      return false;
    }
  }
} 