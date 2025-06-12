// 🌐 TestData Buddy 設定管理

export const APP_CONFIG = {
  // 環境判定
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',

  // API設定
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',

  // 機能フラグ
  API_ENABLED: process.env.NEXT_PUBLIC_API_ENABLED !== 'false',
  OFFLINE_MODE: process.env.NEXT_PUBLIC_OFFLINE_MODE === 'true',

  // オフラインモード判定ロジック
  get isOfflineMode() {
    // 明示的にオフラインモードが指定されている場合
    if (this.OFFLINE_MODE) return true;

    // 明示的にAPIが無効化されている場合
    if (!this.API_ENABLED) return true;

    // 本番環境では現在オフラインモード（バックエンド未設定のため）
    if (this.isProduction) return true;

    // ローカル開発環境ではAPI接続を試行
    return false;
  },

  // API URL構築
  getApiUrl(endpoint: string) {
    if (this.isOfflineMode) {
      console.warn(
        '🤖 TDからのお知らせ: オフラインモードです。API機能は無効化されています'
      );
      return null;
    }
    return `${this.API_BASE_URL}${endpoint}`;
  },

  // 環境情報取得
  get environmentInfo() {
    return {
      environment: this.isProduction ? 'production' : 'development',
      apiMode: this.isOfflineMode ? 'offline' : 'online',
      apiBaseUrl: this.API_BASE_URL,
      features: {
        localGeneration: true,
        apiGeneration: !this.isOfflineMode,
        backendIntegration: !this.isOfflineMode,
      },
    };
  },
};

// TDからのメッセージ
export const TD_MESSAGES = {
  OFFLINE_MODE:
    '🤖 TDからのお知らせ: 現在オフラインモードで動作中です。一部機能は制限されますが、基本的なデータ生成は可能です♪',
  API_DISABLED:
    '🤖 TDからのお知らせ: API機能は現在利用できません。ローカル生成機能をお使いください',
  PRODUCTION_NOTICE:
    '🤖 TDからのお知らせ: 本番環境にアクセスいただき、ありがとうございます！バックエンド設定完了まで一部機能は制限されます',
  DEVELOPMENT_MODE:
    '🤖 TDからのお知らせ: 開発モードで動作中です。APIサーバーが起動していれば、全機能をお使いいただけます♪',
  API_CONNECTION_ERROR:
    '🤖 TDからのお知らせ: APIサーバーに接続できませんでした。ローカル生成機能に切り替えます',
};
