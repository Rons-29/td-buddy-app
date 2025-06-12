// 🌐 TestData Buddy 設定管理

export const APP_CONFIG = {
  // 本番環境判定
  isProduction: process.env.NODE_ENV === 'production',

  // API設定
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',

  // 機能フラグ
  API_ENABLED: process.env.NEXT_PUBLIC_API_ENABLED !== 'false',
  OFFLINE_MODE: process.env.NEXT_PUBLIC_OFFLINE_MODE === 'true',

  // 本番環境では自動的にオフラインモード
  get isOfflineMode() {
    return this.isProduction || this.OFFLINE_MODE || !this.API_ENABLED;
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
};

// TDからのメッセージ
export const TD_MESSAGES = {
  OFFLINE_MODE:
    '🤖 TDからのお知らせ: 現在オフラインモードで動作中です。一部機能は制限されますが、基本的なデータ生成は可能です♪',
  API_DISABLED:
    '🤖 TDからのお知らせ: API機能は現在利用できません。ローカル生成機能をお使いください',
  PRODUCTION_NOTICE:
    '🤖 TDからのお知らせ: 本番環境にアクセスいただき、ありがとうございます！バックエンド設定完了まで一部機能は制限されます',
};
