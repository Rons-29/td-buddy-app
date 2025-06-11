import { NumberBooleanPreset } from '../types/numberboolean';

export const numberbooleanPresets: NumberBooleanPreset[] = [
  {
    id: 'basic_integer',
    name: '基本整数',
    description: '1〜100の整数を生成。カウンターやID用途に最適',
    type: 'integer',
    options: { 
      min: 1, 
      max: 100 
    },
    category: 'basic',
    difficulty: 'beginner',
    icon: '🔢',
    use_cases: ['ユーザーID', 'カウンター', 'インデックス番号']
  },
  {
    id: 'decimal_precision',
    name: '高精度小数',
    description: '0.0〜1.0の高精度小数。測定値やスコア用途',
    type: 'float',
    options: { 
      min: 0, 
      max: 1, 
      decimals: 5 
    },
    category: 'scientific',
    difficulty: 'intermediate',
    icon: '🎯',
    use_cases: ['測定値', 'スコア', '確率値']
  },
  {
    id: 'percentage_progress',
    name: '進捗パーセンテージ',
    description: '0%〜100%の進捗率。プログレスバーやレポート用',
    type: 'percentage',
    options: { 
      min: 0, 
      max: 100, 
      decimals: 1 
    },
    category: 'percentage',
    difficulty: 'beginner',
    icon: '📊',
    use_cases: ['プログレスバー', '完了率', '成功率']
  },
  {
    id: 'currency_jpy',
    name: '日本円価格',
    description: '¥1,000〜¥100,000の価格データ',
    type: 'currency',
    options: { 
      min: 1000, 
      max: 100000, 
      currency: 'JPY' 
    },
    category: 'currency',
    difficulty: 'intermediate',
    icon: '💰',
    use_cases: ['商品価格', '売上金額', '予算管理']
  },
  {
    id: 'currency_usd',
    name: 'US ドル価格',
    description: '$10.00〜$999.99のドル価格',
    type: 'currency',
    options: { 
      min: 10, 
      max: 999.99, 
      currency: 'USD' 
    },
    category: 'currency',
    difficulty: 'intermediate',
    icon: '💵',
    use_cases: ['国際価格', '為替レート', '海外取引']
  },
  {
    id: 'boolean_balanced',
    name: 'バランス真偽値',
    description: '50%の確率でtrue/false',
    type: 'boolean',
    options: { 
      trueProbability: 0.5,
      booleanFormat: 'boolean'
    },
    category: 'boolean',
    difficulty: 'beginner',
    icon: '⚖️',
    use_cases: ['フラグ管理', '条件分岐', 'A/Bテスト']
  },
  {
    id: 'boolean_success_rate',
    name: '成功率70%',
    description: '70%の確率でtrue（成功シミュレーション）',
    type: 'boolean',
    options: { 
      trueProbability: 0.7,
      booleanFormat: 'yesno'
    },
    category: 'boolean',
    difficulty: 'intermediate',
    icon: '✅',
    use_cases: ['成功シミュレーション', '確率テスト', '意思決定']
  },
  {
    id: 'scientific_notation',
    name: '科学記法',
    description: '1.0e-6〜1.0e+6の科学記法表記',
    type: 'scientific',
    options: { 
      min: -6, 
      max: 6, 
      precision: 3 
    },
    category: 'scientific',
    difficulty: 'advanced',
    icon: '🔬',
    use_cases: ['科学計算', '物理定数', '天文学データ']
  },
  {
    id: 'special_values',
    name: '特殊数値',
    description: 'NaN、Infinity等の特殊値を含む',
    type: 'special',
    options: { 
      allowNaN: true, 
      allowInfinity: true, 
      allowNegativeZero: true 
    },
    category: 'advanced',
    difficulty: 'advanced',
    icon: '🌟',
    use_cases: ['エラーテスト', 'エッジケース', 'バリデーション']
  },
  {
    id: 'custom_range',
    name: 'カスタム範囲',
    description: '-1000〜1000のカスタム整数範囲',
    type: 'integer',
    options: { 
      min: -1000, 
      max: 1000,
      useThousandsSeparator: true
    },
    category: 'advanced',
    difficulty: 'intermediate',
    icon: '🎛️',
    use_cases: ['座標データ', '差分値', 'オフセット']
  }
]; 