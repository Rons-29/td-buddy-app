import { NumberBooleanUseCase } from '../types/numberboolean';

export const numberbooleanUseCases: NumberBooleanUseCase[] = [
  {
    id: 'unit_testing_scenarios',
    title: '単体テストでの境界値テスト',
    description: '整数や小数の境界値を醸造してテストケースを充実',
    category: 'testing',
    difficulty: 'beginner',
    icon: '🧪',
    
    scenario: {
      description: '関数やAPIの数値パラメータテストにおいて、様々な境界値でのテストが必要',
      problem: '手動で境界値を設定するのは時間がかかり、テストケースが不十分になりがち',
      solution: 'TDで自動生成した境界値データを使用してテストケースを網羅的に作成'
    },
    
    examples: [
      {
        title: '整数境界値テスト',
        before: 'const testCases = [0, 1, 99, 100]; // 手動設定',
        after: '// TDで生成: [1, 47, 83, 100] など様々なパターン',
        preset: 'basic_integer',
        code: `
// テスト関数
function validateAge(age: number): boolean {
  return age >= 0 && age <= 120;
}

// TDで生成したテストデータ
const testData = [1, 47, 83, 100]; // TDで生成
testData.forEach(age => {
  test(\`年齢\${age}の検証テスト\`, () => {
    expect(validateAge(age)).toBe(true);
  });
});`
      },
      {
        title: '小数点精度テスト',
        before: 'const scores = [0.0, 0.5, 1.0]; // 固定値',
        after: '// TDで生成: [0.34521, 0.67832, 0.91445] など',
        preset: 'decimal_precision',
        code: `
// スコア計算関数のテスト
function calculateGrade(score: number): string {
  if (score >= 0.9) return 'A';
  if (score >= 0.7) return 'B';
  return 'C';
}

// TDで生成した高精度テストデータ
const testScores = [0.34521, 0.67832, 0.91445];`
      }
    ],
    
    benefits: [
      'テストケースの網羅性向上',
      '境界値テストの自動化',
      'バグ発見率の向上',
      'テスト作成時間の短縮'
    ],
    
    relatedTypes: ['integer', 'float', 'percentage']
  },
  
  {
    id: 'api_development_debugging',
    title: 'API開発でのデバッグとテスト',
    description: 'REST APIの開発時に様々な数値パラメータでテスト',
    category: 'development',
    difficulty: 'intermediate',
    icon: '🔧',
    
    scenario: {
      description: 'API開発時に価格、数量、パーセンテージなど様々な数値データでテストが必要',
      problem: '実際のデータを待つか、固定値では十分なテストができない',
      solution: 'TDで実際のデータに近い多様な数値を醸造してAPIの動作確認'
    },
    
    examples: [
      {
        title: '価格APIのテスト',
        before: 'const prices = [100, 1000, 10000]; // 固定価格',
        after: '// TDで生成: [¥3,247, ¥18,932, ¥67,845] など',
        preset: 'currency_jpy',
        code: `
// 価格APIのテストデータ醸造
const testPrices = [3247, 18932, 67845]; // TDで生成

testPrices.forEach(price => {
  fetch('/api/products', {
    method: 'POST',
    body: JSON.stringify({ price })
  }).then(response => {
    console.log(\`価格¥\${price}のテスト結果:\`, response.status);
  });
});`
      },
      {
        title: 'パーセンテージAPIテスト',
        before: 'const rates = [10.0, 50.0, 90.0]; // 固定割引率',
        after: '// TDで生成: [23.4%, 67.8%, 91.2%] など',
        preset: 'percentage_progress',
        code: `
// 割引率計算APIのテスト
const discountRates = [23.4, 67.8, 91.2]; // TDで生成

discountRates.forEach(rate => {
  const result = calculateDiscount(1000, rate);
  console.log(\`\${rate}%割引: ¥\${result}\`);
});`
      }
    ],
    
    benefits: [
      'APIの堅牢性向上',
      'リアルなテストデータでの検証',
      'エッジケースの発見',
      '開発効率の向上'
    ],
    
    relatedTypes: ['currency', 'percentage', 'float']
  },

  {
    id: 'database_seeding',
    title: 'データベースのシードデータ醸造',
    description: '開発用データベースに投入するテストデータの生成',
    category: 'database',
    difficulty: 'intermediate',
    icon: '🗄️',
    
    scenario: {
      description: 'データベース開発時に、実際の運用に近い数値データでテストしたい',
      problem: '手動でテストデータを作成するのは非効率で、パターンが偏りがち',
      solution: 'TDで統計的に分散した数値データを大量醸造してデータベースに投入'
    },
    
    examples: [
      {
        title: 'ユーザーテーブルのシード',
        before: 'INSERT INTO users (age) VALUES (25), (30), (35);',
        after: '// TDで生成した多様な年齢データを使用',
        preset: 'basic_integer',
        code: `
-- TDで生成したユーザーデータ
INSERT INTO users (age, score, active) VALUES 
(23, 0.87432, true),
(45, 0.23891, false),
(67, 0.94521, true),
(34, 0.56789, true);

-- より現実的なデータ分布を実現`
      },
      {
        title: '商品テーブルのシード',
        before: 'INSERT INTO products (price) VALUES (1000), (2000);',
        after: '// TDで生成した価格データで多様性を確保',
        preset: 'currency_jpy',
        code: `
-- 商品価格データ（TDで生成）
INSERT INTO products (name, price, discount_rate) VALUES 
('商品A', 3247, 15.2),
('商品B', 18932, 23.7),
('商品C', 67845, 8.9);`
      }
    ],
    
    benefits: [
      'リアルなテストデータ環境',
      '統計的に正しい分散',
      'パフォーマンステストの精度向上',
      'データマイグレーション検証'
    ],
    
    relatedTypes: ['integer', 'currency', 'percentage', 'boolean']
  },

  {
    id: 'business_analytics',
    title: 'ビジネス分析のダミーデータ',
    description: '売上分析やKPI計算用のシミュレーションデータ',
    category: 'business',
    difficulty: 'advanced',
    icon: '📈',
    
    scenario: {
      description: 'ビジネス分析システムの開発で、売上やKPIの計算ロジックをテストしたい',
      problem: '実際の機密データは使えず、現実的なビジネス数値が必要',
      solution: 'TDで実際のビジネス数値に近い分布のデータを醸造してシミュレーション'
    },
    
    examples: [
      {
        title: '売上データ分析',
        before: 'const sales = [100000, 200000, 300000]; // 単調増加',
        after: '// TDで生成した現実的な売上変動データ',
        preset: 'currency_jpy',
        code: `
// 月次売上データ（TDで生成）
const monthlySales = [
  { month: '2024-01', sales: 234567 },
  { month: '2024-02', sales: 187432 },
  { month: '2024-03', sales: 298765 },
]; // より現実的な変動パターン

// 売上成長率の計算
const growthRate = calculateGrowthRate(monthlySales);`
      },
      {
        title: 'KPI成功率シミュレーション',
        before: 'const successRate = 80.0; // 固定値',
        after: '// TDで生成した現実的な成功率分布',
        preset: 'boolean_success_rate',
        code: `
// A/Bテスト結果のシミュレーション
const testResults = [
  { test: 'A', success: true },  // 70%確率
  { test: 'B', success: false },
  { test: 'A', success: true },
]; // TDで確率的に生成`
      }
    ],
    
    benefits: [
      '現実的なビジネスシミュレーション',
      'KPI計算ロジックの検証',
      '分析システムの事前検証',
      'リスク評価の精度向上'
    ],
    
    relatedTypes: ['currency', 'percentage', 'boolean']
  },

  {
    id: 'performance_testing',
    title: 'パフォーマンステストデータ',
    description: '大量データ処理のパフォーマンス測定用データ醸造',
    category: 'performance',
    difficulty: 'advanced',
    icon: '⚡',
    
    scenario: {
      description: 'システムのパフォーマンステストで大量の数値データが必要',
      problem: '大量データの生成に時間がかかり、テストパターンが限定的',
      solution: 'TDで高速に大量の多様な数値データを醸造してストレステスト実行'
    },
    
    examples: [
      {
        title: '計算処理のベンチマーク',
        before: 'const data = Array(10000).fill(1); // 同じ値の配列',
        after: '// TDで生成した多様な数値配列でより現実的なテスト',
        preset: 'decimal_precision',
        code: `
// パフォーマンステスト用データ
const testData = generateTestData(100000); // TDで生成

console.time('calculation');
const result = testData.map(x => Math.sqrt(x * x + 1));
console.timeEnd('calculation');

// より現実的な計算負荷でベンチマーク`
      },
      {
        title: 'ソート処理のストレステスト',
        before: 'const numbers = [1,2,3,4,5]; // 順序データ',
        after: '// TDで生成したランダムな数値配列',
        preset: 'custom_range',
        code: `
// 大量ランダムデータのソートテスト
const randomNumbers = generateRandomIntegers(1000000);

console.time('sorting');
const sorted = randomNumbers.sort((a, b) => a - b);
console.timeEnd('sorting');`
      }
    ],
    
    benefits: [
      'より現実的な負荷テスト',
      'アルゴリズムの性能検証',
      'システム限界の把握',
      'ボトルネック箇所の特定'
    ],
    
    relatedTypes: ['integer', 'float', 'scientific']
  },

  {
    id: 'scientific_computing',
    title: '科学計算・シミュレーション',
    description: '物理計算や統計解析用の科学的数値データ',
    category: 'analysis',
    difficulty: 'advanced',
    icon: '🔬',
    
    scenario: {
      description: '科学計算や統計解析で、特定の分布や範囲の数値データが必要',
      problem: '実験データの収集に時間がかかり、シミュレーションが困難',
      solution: 'TDで科学記法や正規分布に従った数値を醸造して計算・解析を実行'
    },
    
    examples: [
      {
        title: '物理定数のシミュレーション',
        before: 'const constants = [9.8, 3.0e8]; // 固定物理定数',
        after: '// TDで生成した科学記法データで誤差シミュレーション',
        preset: 'scientific_notation',
        code: `
// 物理計算のモンテカルロシミュレーション
const measurements = [
  2.34e-6,  // TDで生成
  1.78e+3,
  9.45e-2
];

const results = measurements.map(value => 
  calculatePhysicsFormula(value)
);`
      },
      {
        title: '統計分析用データ',
        before: 'const samples = [0.5, 0.6, 0.7]; // 少ないサンプル',
        after: '// TDで大量醸造した統計的に有効なサンプル',
        preset: 'decimal_precision',
        code: `
// 統計解析用の大量サンプルデータ
const samples = generateNormalDistribution(10000);

const mean = calculateMean(samples);
const stdDev = calculateStandardDeviation(samples);
console.log(\`平均: \${mean}, 標準偏差: \${stdDev}\`);`
      }
    ],
    
    benefits: [
      '統計的に有意なデータセット',
      '科学計算の精度向上',
      'シミュレーション結果の信頼性',
      '研究開発の効率化'
    ],
    
    relatedTypes: ['scientific', 'float', 'special']
  }
]; 