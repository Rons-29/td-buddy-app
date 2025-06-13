/**
 * Jest テストセットアップファイル
 * TD Buddy - Test Setup
 * 
 * @description テスト実行前の環境設定
 */

 config } 
import path 

// テスト環境用の環境変数読み込み
config({ path: path.join(__dirname, '../../.env.test') });

// テスト用デフォルト環境変数設定
process.env.NODE_ENV = 'test';
process.env.PORT = '3002';

// ログを抑制（テスト実行時の見やすさのため）
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

beforeAll(() => {
  // 必要な場合のみログを表示
  console.log = (message: any, ...optionalParams: any[]) => {
    if (process.env.TEST_VERBOSE === 'true') {
      originalConsoleLog(message, ...optionalParams);
    }
  };
  
  console.warn = (message: any, ...optionalParams: any[]) => {
    if (process.env.TEST_VERBOSE === 'true') {
      originalConsoleWarn(message, ...optionalParams);
    }
  };
  
  console.error = (message: any, ...optionalParams: any[]) => {
    // エラーは常に表示
    originalConsoleError(message, ...optionalParams);
  };
});

afterAll(() => {
  // ログ復元
  console.log = originalConsoleLog;
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
});

// Brewからの応援メッセージ
logger.log('🍺 Brew: テスト環境のセットアップが完了しました！品質をしっかりチェックしましょう♪'); 
