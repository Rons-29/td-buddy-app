import { PromptTemplate } from '../../types/aiAdapter';

/**
 * AI用プロンプトテンプレート管理クラス
 * 自然言語からデータ生成パラメータを正確に抽出するための最適化されたプロンプト
 */
export class PromptTemplates {
  
  /**
   * データ生成パラメータ抽出用プロンプト（強化版）
   */
  static getParameterExtractionPrompt(): PromptTemplate {
    return {
      system: `あなたはテストデータ生成の専門家です。ユーザーの自然言語での要求を、正確にJSON形式のパラメータに変換してください。

## 対応可能なフィールド一覧:
- fullName: 氏名（漢字）
- kanaName: 氏名（カタカナ）
- email: メールアドレス
- phone: 電話番号
- mobile: 携帯電話番号
- address: 住所
- postalCode: 郵便番号
- birthDate: 生年月日
- age: 年齢
- gender: 性別
- company: 会社名
- jobTitle: 職種・役職
- website: ウェブサイト
- socialId: SNS ID

## JSON出力形式:
{
  "count": 生成件数（数値、1-1000）,
  "locale": "ja",
  "includeFields": ["フィールド名の配列"],
  "filters": {
    "ageRange": {"min": 最小年齢, "max": 最大年齢},
    "gender": "male" | "female" | "both",
    "jobCategory": "職業カテゴリ",
    "location": "地域名"
  }
}

## 自然言語の解釈ルール:

### 数量表現:
- "10人" → count: 10
- "100件" → count: 100
- "少し" → count: 5
- "たくさん" → count: 50
- "大量に" → count: 200

### 年齢表現:
- "20代" → ageRange: {"min": 20, "max": 29}
- "30歳" → ageRange: {"min": 30, "max": 30}
- "若い" → ageRange: {"min": 18, "max": 35}
- "中年" → ageRange: {"min": 35, "max": 55}
- "シニア" → ageRange: {"min": 55, "max": 80}

### 性別表現:
- "男性" → gender: "male"
- "女性" → gender: "female"
- "両方" → gender: "both"
- "ランダム" → gender: "both"

### 職業表現:
- "エンジニア", "開発者", "プログラマー" → jobCategory: "エンジニア"
- "営業", "セールス" → jobCategory: "営業"
- "デザイナー" → jobCategory: "デザイナー"
- "マネージャー", "管理職" → jobCategory: "管理職"

### 連絡先表現:
- "連絡先", "連絡先付き" → ["email", "phone"]
- "メールアドレス", "メール" → ["email"]
- "電話番号", "電話" → ["phone"]
- "携帯", "携帯電話" → ["mobile"]

### 住所表現:
- "住所", "住所付き" → ["address"]
- "郵便番号" → ["postalCode"]
- "完全な住所" → ["address", "postalCode"]

### 個人情報表現:
- "基本情報" → ["fullName", "age", "gender"]
- "詳細情報" → ["fullName", "kanaName", "email", "phone", "address", "age", "gender"]
- "ビジネス情報" → ["fullName", "email", "company", "jobTitle"]

## 注意事項:
1. 曖昧な表現は合理的に解釈してください
2. 明示されていない情報は推測で補完してください
3. 必ずJSONのみを出力し、説明は含めないでください
4. count は必ず 1-1000 の範囲で設定してください`,

      user: `ユーザーの要求: {userInput}

上記の要求をJSON形式に変換してください。`,

      examples: [
        {
          input: "30代の男性エンジニア10人、連絡先付きで生成して",
          output: `{
  "count": 10,
  "locale": "ja",
  "includeFields": ["fullName", "email", "phone", "age", "gender", "company", "jobTitle"],
  "filters": {
    "ageRange": {"min": 30, "max": 39},
    "gender": "male",
    "jobCategory": "エンジニア"
  }
}`
        },
        {
          input: "20代女性のデザイナー5名、フルネームとメールだけ",
          output: `{
  "count": 5,
  "locale": "ja",
  "includeFields": ["fullName", "email"],
  "filters": {
    "ageRange": {"min": 20, "max": 29},
    "gender": "female",
    "jobCategory": "デザイナー"
  }
}`
        },
        {
          input: "営業部の管理職、詳細情報で15人ください",
          output: `{
  "count": 15,
  "locale": "ja",
  "includeFields": ["fullName", "kanaName", "email", "phone", "address", "age", "gender", "company", "jobTitle"],
  "filters": {
    "jobCategory": "営業"
  }
}`
        },
        {
          input: "若いプログラマー、基本情報だけで大量に",
          output: `{
  "count": 200,
  "locale": "ja",
  "includeFields": ["fullName", "age", "gender", "company", "jobTitle"],
  "filters": {
    "ageRange": {"min": 18, "max": 35},
    "jobCategory": "エンジニア"
  }
}`
        }
      ]
    };
  }

  /**
   * データ生成品質向上用プロンプト
   */
  static getQualityEnhancementPrompt(): PromptTemplate {
    return {
      system: `あなたはテストデータの品質評価専門家です。生成されたテストデータの品質を評価し、改善提案を行ってください。

## 評価観点:
1. **リアリティ** (0-100点): データが実際に存在しそうか
2. **多様性** (0-100点): データのバリエーションは豊富か
3. **一貫性** (0-100点): データ間の整合性は取れているか
4. **実用性** (0-100点): テスト用途として適切か

## 出力形式:
{
  "quality": {
    "realism": 点数,
    "diversity": 点数,
    "consistency": 点数,
    "usability": 点数,
    "overall": 総合点数
  },
  "issues": ["問題点1", "問題点2"],
  "suggestions": ["改善提案1", "改善提案2"]
}`,

      user: `生成されたデータを評価してください:
{generatedData}

品質評価をお願いします。`
    };
  }

  /**
   * エラー修正・clarification用プロンプト
   */
  static getClarificationPrompt(): PromptTemplate {
    return {
      system: `あなたは親切なアシスタントです。ユーザーの要求が不明確な場合、適切な質問をして要求を明確化してください。

## 質問のガイドライン:
1. 具体的で答えやすい質問をする
2. 選択肢を提供する
3. 日本語で自然な表現を使う
4. 3個以内の質問に留める

## 出力形式:
{
  "needsClarification": true,
  "questions": [
    "質問1: 選択肢A / 選択肢B",
    "質問2: 具体的な数値をお聞かせください"
  ],
  "context": "現在理解できている内容"
}`,

      user: `ユーザーの要求: {userInput}
エラー内容: {error}

適切な質問を生成してください。`
    };
  }

  /**
   * プロンプトの動的生成
   * ユーザーの過去の要求履歴を考慮したパーソナライズド・プロンプト
   */
  static getPersonalizedPrompt(userHistory: string[]): PromptTemplate {
    const historyContext = userHistory.length > 0 
      ? `## ユーザーの過去の要求履歴:
${userHistory.slice(-5).map((req, i) => `${i + 1}. ${req}`).join('\n')}

過去の傾向を参考にして、今回の要求も適切に解釈してください。`
      : '';

    return {
      system: `${this.getParameterExtractionPrompt().system}

${historyContext}`,
      user: this.getParameterExtractionPrompt().user
    };
  }

  /**
   * 業界特化型プロンプト
   */
  static getIndustrySpecificPrompt(industry: string): PromptTemplate {
    const industryMappings: Record<string, any> = {
      'IT': {
        jobTitles: ['エンジニア', 'プログラマー', 'デザイナー', 'プロダクトマネージャー', 'データサイエンティスト'],
        companies: ['テック株式会社', 'AI開発', 'ソフトウェア'],
        emailDomains: ['tech.com', 'dev.co.jp', 'software.jp']
      },
      '営業': {
        jobTitles: ['営業', 'セールス', 'アカウントマネージャー', '営業部長'],
        companies: ['商事', 'トレーディング', 'セールス'],
        emailDomains: ['sales.com', 'business.co.jp']
      },
      '医療': {
        jobTitles: ['医師', '看護師', '薬剤師', '医療事務'],
        companies: ['病院', 'クリニック', '医療センター'],
        emailDomains: ['medical.jp', 'hospital.com']
      }
    };

    const industryData = industryMappings[industry] || industryMappings['IT'];

    return {
      system: `${this.getParameterExtractionPrompt().system}

## ${industry}業界特化設定:
- 推奨職種: ${industryData.jobTitles.join(', ')}
- 典型的企業: ${industryData.companies.join(', ')}
- メールドメイン: ${industryData.emailDomains.join(', ')}

${industry}業界の特性を考慮してデータ生成パラメータを設定してください。`,
      user: this.getParameterExtractionPrompt().user
    };
  }
} 