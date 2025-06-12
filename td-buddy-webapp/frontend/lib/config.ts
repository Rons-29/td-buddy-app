// 🌐 QA Workbench 設定管理

export const APP_CONFIG = {
  // アプリケーション基本情報
  APP_NAME: 'QA Workbench',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'QAエンジニアの専用作業台',
  BREW_CHARACTER: 'Brew Assistant',

  // API設定
  API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  DEFAULT_REQUEST_TIMEOUT: 30000,
  MAX_RETRY_ATTEMPTS: 3,

  // データ生成設定
  DEFAULT_BATCH_SIZE: 100,
  MAX_BATCH_SIZE: 10000,
  PAGINATION_SIZE: 20,

  // ファイル設定
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  SUPPORTED_FORMATS: ['csv', 'json', 'xml', 'sql', 'yaml'] as const,

  // セキュリティ設定
  ENABLE_RATE_LIMITING: true,
  DATA_CLEANUP_INTERVAL: 24 * 60 * 60 * 1000, // 24時間

  // ログ設定
  LOG_LEVEL: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  ENABLE_ANALYTICS: false,

  // UI設定
  THEME: {
    PRIMARY_COLOR: '#ea580c', // オレンジ
    SECONDARY_COLOR: '#fb923c',
    SUCCESS_COLOR: '#22c55e',
    WARNING_COLOR: '#f59e0b',
    ERROR_COLOR: '#ef4444',
  },

  // 機能フラグ
  FEATURES: {
    AI_INTEGRATION: true,
    BULK_OPERATIONS: true,
    EXPORT_FORMATS: true,
    REAL_TIME_PREVIEW: true,
    ADVANCED_FILTERING: true,
  },
} as const;

// ブリューからのメッセージ
export const TD_MESSAGES = {
  OFFLINE_MODE:
    '🍺 ブリューからのお知らせ: 現在オフラインモードで生成中です。一部機能は制限されますが、基本的なデータ生成は可能です♪',
  API_DISABLED:
    '🍺 ブリューからのお知らせ: API機能は現在利用できません。ローカル生成機能をお使いください',
  PRODUCTION_NOTICE:
    '🍺 ブリューからのお知らせ: 本番環境にアクセスいただき、ありがとうございます！バックエンド設定完了まで一部機能は制限されます',
  DEVELOPMENT_MODE:
    '🍺 ブリューからのお知らせ: 開発モードで生成中です。APIサーバーが起動していれば、全機能をお使いいただけます♪',
  API_CONNECTION_ERROR:
    '🍺 ブリューからのお知らせ: APIサーバーに接続できませんでした。ローカル生成機能に切り替えます',
};

// Brewメッセージ定数
export const BREW_MESSAGES = {
  // 一般的なメッセージ
  WELCOME: 'こんにちは！Brewです。データ生成のお手伝いをします♪',
  GOODBYE: 'お疲れさまでした！また一緒にデータを生成しましょう',

  // 作業状態メッセージ
  BREWING_START: 'データ生成を開始します！',
  BREWING_PROGRESS: 'データを生成中です...しばらくお待ちください',
  BREWING_COMPLETE: '生成完了！高品質なデータができあがりました✨',

  // 成功メッセージ
  EXPORT_SUCCESS: 'データのエクスポートが完了しました！',
  IMPORT_SUCCESS: 'データのインポートが完了しました！',
  SAVE_SUCCESS: '設定が保存されました！',

  // エラーメッセージ
  GENERIC_ERROR: '問題が発生しました。Brewがサポートします！',
  NETWORK_ERROR:
    'ネットワークに問題があるようです。しばらく待ってから再試行してください',
  FILE_ERROR: 'ファイルの処理中にエラーが発生しました',

  // 警告メッセージ
  LARGE_DATA_WARNING: '大量のデータです。生成に時間がかかる場合があります',
  QUOTA_WARNING: 'データ使用量が上限に近づいています',

  // 情報メッセージ
  DEVELOPMENT_MODE: '開発モードで動作しています',
  PRODUCTION_NOTICE: '本番環境で動作しています',
  MAINTENANCE_MODE: 'メンテナンス中です。しばらくお待ちください',

  // 励ましメッセージ
  ENCOURAGEMENT: [
    '一緒に頑張りましょう！',
    '素晴らしい作業ですね！',
    'いい感じです♪',
    'お疲れさまです！',
    'ナイスワークです！',
  ],

  // 休憩提案
  BREAK_SUGGESTIONS: [
    '少し休憩しませんか？',
    'コーヒーブレイクの時間ですね',
    'ストレッチして体をほぐしましょう',
    '目を休める時間です',
    '深呼吸してリフレッシュしましょう',
  ],
} as const;

// 環境別設定
export const ENV_CONFIG = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  // 開発環境専用
  ...(process.env.NODE_ENV === 'development' && {
    ENABLE_DEBUGGING: true,
    SHOW_PERFORMANCE_METRICS: true,
    MOCK_API_RESPONSES: false,
  }),

  // 本番環境専用
  ...(process.env.NODE_ENV === 'production' && {
    ENABLE_DEBUGGING: false,
    SHOW_PERFORMANCE_METRICS: false,
    ENABLE_ERROR_REPORTING: true,
  }),
} as const;

// 型定義のエクスポート
export type AppConfig = typeof APP_CONFIG;
export type BrewMessages = typeof BREW_MESSAGES;
export type EnvConfig = typeof ENV_CONFIG;
