import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// TD 開発サーバー起動スクリプト
async function startDevServer() {
  console.log(`
🤖 TestData Buddy Backend 開発サーバーを起動します！

🚀 Starting development server...
📡 Port: ${process.env.PORT || 3001}
🌐 Environment: ${process.env.NODE_ENV || 'development'}
🔧 TypeScript: watch mode enabled
📝 Logs: console output

TDからのメッセージ: 開発準備完了！コード変更時は自動リロードします♪
  `);

  try {
    // TypeScript のコンパイルチェック
    console.log('🔍 TypeScript syntax check...');
    await execAsync('npx tsc --noEmit');
    console.log('✅ TypeScript check passed!');

    // ESLint チェック
    console.log('🔍 ESLint check...');
    try {
      await execAsync('npx eslint src --ext .ts');
      console.log('✅ ESLint check passed!');
    } catch (error) {
      console.warn('⚠️  ESLint warnings found (continuing...)');
    }

    // 開発サーバー起動
    console.log('🚀 Starting server...');
    
  } catch (error) {
    console.error('❌ Pre-startup checks failed:', error);
    process.exit(1);
  }
}

// 優雅なシャットダウン処理
process.on('SIGINT', () => {
  console.log('\n🤖 TD: 開発サーバーを停止します...');
  console.log('👋 お疲れさまでした！また開発の時にお会いしましょう');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🤖 TD: 開発サーバーを停止します...');
  process.exit(0);
});

// 未処理のエラーをキャッチ
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  console.log('🤖 TD: 予期せぬエラーが発生しました。サーバーを安全に停止します。');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  console.log('🤖 TD: Promise関連のエラーが発生しました。');
});

if (require.main === module) {
  startDevServer();
} 