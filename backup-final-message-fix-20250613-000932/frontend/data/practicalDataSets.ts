export interface PracticalDataSet {
  id: string;
  name: string;
  category: string;
  description: string;
  items: string[];
  useCase: string;
  brewMessage: string;
}

// 🎮 ゲーム関連データセット
export const gameDataSets: PracticalDataSet[] = [
  {
    id: 'game-regions',
    name: '🌍 ゲームリージョン一覧',
    category: 'game',
    description: 'スマホゲームで使用される世界のリージョン設定',
    items: [
      'JP - 日本',
      'US - アメリカ',
      'KR - 韓国',
      'TW - 台湾',
      'CN - 中国',
      'TH - タイ',
      'VN - ベトナム',
      'ID - インドネシア',
      'PH - フィリピン',
      'MY - マレーシア',
      'SG - シンガポール',
      'AU - オーストラリア',
      'UK - イギリス',
      'DE - ドイツ',
      'FR - フランス',
      'BR - ブラジル',
      'MX - メキシコ',
      'CA - カナダ'
    ],
    useCase: '多地域展開ゲームのリージョン設定テスト',
    brewMessage: 'ゲームの多地域展開に必要なリージョンデータです！施策の同時リリースにお役立てください♪'
  },
  {
    id: 'game-events',
    name: '🎊 ゲーム内イベント種別',
    category: 'game',
    description: 'スマホゲームでよく使用されるイベント・施策種別',
    items: [
      'ログインボーナス',
      'ガチャイベント',
      '期間限定クエスト',
      'レイドバトル',
      'PvPトーナメント',
      'コラボイベント',
      'ストーリー更新',
      'アップデート記念',
      'シーズンイベント',
      'ランキングイベント',
      'ミッション報酬',
      'パック販売',
      'スペシャルセール',
      'メンテナンス補償',
      'サーバー移転',
      'バランス調整'
    ],
    useCase: 'ゲーム内施策・イベントの管理・テスト',
    brewMessage: 'ゲーム施策の同時リリースに最適なイベントリストです！どの施策を選択しますか？♪'
  },
  {
    id: 'game-currencies',
    name: '💎 ゲーム内通貨・アイテム',
    category: 'game',
    description: 'ゲーム内で使用される通貨・アイテムの種類',
    items: [
      'ゴールド（基本通貨）',
      'ダイヤモンド（プレミアム通貨）',
      'スタミナ（行動力）',
      'ガチャチケット',
      '強化素材',
      '進化素材',
      '経験値ポーション',
      'レアアイテム',
      '限定アイテム',
      'イベントコイン',
      'フレンドポイント',
      'アリーナメダル',
      'ギルドポイント',
      'VIPポイント'
    ],
    useCase: 'ゲーム内経済システムのテスト',
    brewMessage: 'ゲーム内通貨の管理にお使いください！バランス調整のテストに最適です♪'
  }
];

// 🛒 ECサイト関連データセット
export const ecommerceDataSets: PracticalDataSet[] = [
  {
    id: 'product-categories',
    name: '📦 商品カテゴリ',
    category: 'ecommerce',
    description: 'ECサイトで使用される商品カテゴリ一覧',
    items: [
      'ファッション・アパレル',
      '家電・デジタル機器',
      '本・雑誌・コミック',
      '食品・飲料',
      '健康・美容',
      'スポーツ・アウトドア',
      'ホーム・キッチン',
      'おもちゃ・ゲーム',
      'ペット用品',
      '車・バイク用品',
      'インテリア・家具',
      '楽器・音響機器',
      '文房具・オフィス用品',
      'ベビー・キッズ',
      'ジュエリー・アクセサリー'
    ],
    useCase: 'ECサイトの商品分類・検索機能テスト',
    brewMessage: 'ECサイトのカテゴリ管理にお役立てください！どの商品カテゴリをテストしますか？♪'
  },
  {
    id: 'shipping-methods',
    name: '🚚 配送方法',
    category: 'ecommerce',
    description: 'ECサイトで提供される配送オプション',
    items: [
      '通常配送（3-5営業日）',
      '速達配送（1-2営業日）',
      '当日配送',
      '時間指定配送',
      '店舗受取',
      'コンビニ受取',
      '置き配',
      '宅配ボックス',
      '冷蔵配送',
      '冷凍配送',
      '大型商品配送',
      '組立設置配送',
      '海外配送',
      'メール便',
      'ネコポス'
    ],
    useCase: '配送システム・物流機能のテスト',
    brewMessage: '配送オプションのテストにお使いください！物流システムの検証に最適です♪'
  }
];

// 💼 ビジネス関連データセット
export const businessDataSets: PracticalDataSet[] = [
  {
    id: 'company-departments',
    name: '🏢 会社部署',
    category: 'business',
    description: '企業でよく使用される部署・組織名',
    items: [
      '人事部',
      '総務部',
      '経理部',
      '営業部',
      'マーケティング部',
      '開発部',
      'エンジニアリング部',
      'デザイン部',
      '品質保証部',
      'カスタマーサポート部',
      '法務部',
      '企画部',
      '広報部',
      '情報システム部',
      '研究開発部',
      '製造部',
      '物流部',
      '購買部'
    ],
    useCase: '企業内システム・組織管理のテスト',
    brewMessage: '企業システムの部署管理機能テストにお役立てください♪'
  },
  {
    id: 'meeting-types',
    name: '📅 会議種別',
    category: 'business',
    description: 'ビジネスでよく行われる会議・打ち合わせの種類',
    items: [
      '定例会議',
      '企画会議',
      'プロジェクト会議',
      '進捗報告会',
      '営業会議',
      'マーケティング会議',
      '技術検討会',
      'レビュー会議',
      '決裁会議',
      '全社会議',
      '部署会議',
      'チームミーティング',
      '1on1面談',
      '採用面接',
      '顧客打ち合わせ',
      'ベンダー会議',
      'キックオフ会議',
      '振り返り会議'
    ],
    useCase: '会議・スケジュール管理システムのテスト',
    brewMessage: '会議管理システムのテストデータとしてお使いください！効率的な会議運営をサポートします♪'
  }
];

// 🎨 デザイン・UI関連データセット
export const designDataSets: PracticalDataSet[] = [
  {
    id: 'ui-components',
    name: '🎨 UIコンポーネント',
    category: 'design',
    description: 'Webデザインでよく使用されるUIコンポーネント',
    items: [
      'ヘッダー',
      'ナビゲーション',
      'フッター',
      'サイドバー',
      'カード',
      'ボタン',
      'フォーム',
      'モーダル',
      'タブ',
      'アコーディオン',
      'ドロップダウン',
      'プログレスバー',
      'パンくずリスト',
      'ページネーション',
      'カルーセル',
      'スライダー',
      'ツールチップ',
      'アラート'
    ],
    useCase: 'UI/UXデザインのコンポーネントテスト',
    brewMessage: 'UIコンポーネントのテストにお役立てください！使いやすいデザイン作りをサポートします♪'
  }
];

// 🌐 地域・言語関連データセット
export const regionDataSets: PracticalDataSet[] = [
  {
    id: 'asian-countries',
    name: '🌏 アジア諸国',
    category: 'region',
    description: 'アジア地域の国・地域一覧',
    items: [
      '日本',
      '韓国',
      '中国',
      '台湾',
      '香港',
      'タイ',
      'ベトナム',
      'インドネシア',
      'フィリピン',
      'マレーシア',
      'シンガポール',
      'ブルネイ',
      'ミャンマー',
      'カンボジア',
      'ラオス',
      'インド',
      'バングラデシュ',
      'スリランカ'
    ],
    useCase: 'アジア地域向けサービスの地域設定テスト',
    brewMessage: 'アジア地域展開のテストにお使いください！多地域サービスの検証に最適です♪'
  }
];

// 💻 Web系開発関連データセット
export const webDevDataSets: PracticalDataSet[] = [
  {
    id: 'release-types',
    name: '🚀 リリース種別',
    category: 'web-dev',
    description: 'Web系でよく行われるリリース・デプロイの種類',
    items: [
      'ホットフィックス（緊急修正）',
      '定期リリース',
      'メジャーバージョンアップ',
      'マイナーアップデート',
      'セキュリティパッチ',
      'データベース更新',
      'API仕様変更',
      'フロントエンド更新',
      'インフラ変更',
      'パフォーマンス改善',
      'A/Bテスト開始',
      'フィーチャーフラグ有効化',
      'サードパーティ連携',
      'CDN設定変更',
      'ドメイン移行'
    ],
    useCase: 'Web系リリース管理・デプロイ時間の調整',
    brewMessage: 'グローバルWebサービスのリリース時間調整にお役立てください！各地域の影響を最小化しましょう♪'
  },
  {
    id: 'maintenance-types',
    name: '🔧 メンテナンス種別',
    category: 'web-dev',
    description: 'Webサービスで実施されるメンテナンスの種類',
    items: [
      '定期メンテナンス',
      '緊急メンテナンス',
      'データベースメンテナンス',
      'サーバーメンテナンス',
      'ネットワークメンテナンス',
      'セキュリティメンテナンス',
      'パフォーマンス向上',
      'バックアップ作業',
      'ログローテーション',
      'SSL証明書更新',
      'ミドルウェア更新',
      'OS更新',
      'ハードウェア交換',
      'データ移行',
      '監視システム調整'
    ],
    useCase: 'Webサービスメンテナンス時間の最適化',
    brewMessage: '各地域のピークタイムを避けた最適なメンテナンス時間を見つけましょう！サービス影響を最小化します♪'
  },
  {
    id: 'campaign-types',
    name: '📢 キャンペーン・イベント種別',
    category: 'web-dev',
    description: 'Webサービスで開催されるキャンペーン・イベントの種類',
    items: [
      'セール・割引キャンペーン',
      '新機能リリース記念',
      'ユーザー登録キャンペーン',
      '友達招待キャンペーン',
      'ポイント○倍キャンペーン',
      '限定商品販売',
      'タイムセール',
      'フラッシュセール',
      'ブラックフライデー',
      'サイバーマンデー',
      '年末年始セール',
      'バレンタインセール',
      'ゴールデンウィークセール',
      'ウェビナー開催',
      'オンライン説明会'
    ],
    useCase: 'グローバルキャンペーンの同時開催時間調整',
    brewMessage: '世界同時キャンペーンの開始時間調整にお使いください！最大の効果を狙いましょう♪'
  },
  {
    id: 'support-categories',
    name: '🎧 サポート・問い合わせ種別',
    category: 'web-dev',
    description: 'Webサービスでよくある問い合わせ・サポートの分類',
    items: [
      '技術的な問題',
      'アカウント関連',
      '支払い・課金問題',
      '機能の使い方',
      'バグ報告',
      'パスワードリセット',
      '退会・解約手続き',
      'データエクスポート',
      'プライバシー設定',
      'セキュリティ相談',
      '機能改善要望',
      'パートナー連携',
      'API利用相談',
      '大量データ処理',
      'カスタマイズ相談'
    ],
    useCase: '24時間サポート体制の時間管理・引き継ぎ調整',
    brewMessage: 'グローバルサポート体制の時間調整にお役立てください！24時間切れ目ないサポートを実現しましょう♪'
  }
];

// 📊 マーケティング・分析関連データセット
export const marketingDataSets: PracticalDataSet[] = [
  {
    id: 'ad-platforms',
    name: '📱 広告プラットフォーム',
    category: 'marketing',
    description: 'デジタルマーケティングで使用される広告プラットフォーム',
    items: [
      'Google Ads',
      'Facebook Ads',
      'Instagram Ads',
      'Twitter Ads',
      'LinkedIn Ads',
      'TikTok Ads',
      'YouTube Ads',
      'Amazon Advertising',
      'Yahoo! 広告',
      'LINE Ads',
      'SmartNews Ads',
      'Gunosy Ads',
      'Pinterest Ads',
      'Snapchat Ads',
      'Reddit Ads'
    ],
    useCase: 'グローバル広告キャンペーンの配信時間調整',
    brewMessage: '世界各地での広告配信タイミングの最適化にお使いください！ROI最大化を目指しましょう♪'
  },
  {
    id: 'analytics-metrics',
    name: '📈 分析指標',
    category: 'marketing',
    description: 'Webサービスで重要な分析・KPI指標',
    items: [
      'PV（ページビュー）',
      'UU（ユニークユーザー）',
      'セッション数',
      '直帰率',
      '滞在時間',
      'コンバージョン率',
      'CPA（顧客獲得コスト）',
      'LTV（顧客生涯価値）',
      'DAU（日次アクティブユーザー）',
      'MAU（月次アクティブユーザー）',
      'リテンション率',
      'チャーン率',
      'ROAS（広告費用対効果）',
      'CTR（クリック率）',
      'CPC（クリック単価）'
    ],
    useCase: 'グローバル分析レポートの時間軸調整',
    brewMessage: '各地域の分析レポート集計時間を調整して、正確なデータ分析を実現しましょう♪'
  }
];

// 全データセットをまとめてエクスポート
export const allDataSets: PracticalDataSet[] = [
  ...gameDataSets,
  ...ecommerceDataSets,
  ...businessDataSets,
  ...designDataSets,
  ...regionDataSets,
  ...webDevDataSets,
  ...marketingDataSets
];

// カテゴリ別のデータセット取得
export const getDataSetsByCategory = (category: string): PracticalDataSet[] => {
  return allDataSets.filter(dataSet => dataSet.category === category);
};

// データセット検索機能
export const searchDataSets = (query: string): PracticalDataSet[] => {
  const lowerQuery = query.toLowerCase();
  return allDataSets.filter(dataSet => 
    dataSet.name.toLowerCase().includes(lowerQuery) ||
    dataSet.description.toLowerCase().includes(lowerQuery) ||
    dataSet.items.some(item => item.toLowerCase().includes(lowerQuery))
  );
}; 