#!/usr/bin/env ts-node

import * as path from 'path';
import * as fs from 'fs';
import { database } from '../database/database';

// コマンドライン引数の処理
const args = process.argv.slice(2);
const command = args[0] || 'help';

// データベース初期化スクリプト
class DatabaseInitializer {
  async init(): Promise<void> {
    console.log(`
🤖 QA Workbench データベース初期化スクリプト

🏗️  データベースの初期化を開始します...
    `);

    try {
      // データベース接続
      await database.connect();
      console.log('✅ データベース接続成功');

      // テーブル初期化
      await database.initialize();
      console.log('✅ テーブル初期化完了');

      // データベース統計表示
      await this.showStats();

      console.log(`
🎉 データベース初期化が完了しました！

🤖 TDからのメッセージ:
「データベースの準備ができました！これでテストデータを安全に保存できますね♪」

次のステップ:
- npm run dev でサーバーを起動
- /health エンドポイントでヘルスチェック
- API経由でデータ生成をテスト
      `);

    } catch (error) {
      console.error('❌ データベース初期化エラー:', error);
      process.exit(1);
    } finally {
      await database.disconnect();
    }
  }

  async reset(): Promise<void> {
    console.log(`
⚠️  データベースリセット
    
すべてのデータが削除されます。
この操作は取り消せません。
    `);

    // 開発環境のみ許可
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ 本番環境でのデータベースリセットは禁止されています');
      process.exit(1);
    }

    // 確認プロンプト（非対話的環境では強制実行）
    if (process.stdin.isTTY && !args.includes('--force')) {
      console.log('本当にリセットしますか？ (yes/no)');
      // 簡略化のため --force フラグで実行
      console.log('--force フラグを使用して強制実行してください');
      process.exit(0);
    }

    try {
      await database.connect();

      // データベースファイルを削除
      const dbPath = process.env.DATABASE_URL?.replace('file:', '') || './data/td-buddy.db';
      
      await database.disconnect();
      
      if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
        console.log(`🗑️  データベースファイルを削除しました: ${dbPath}`);
      }

      // 再初期化
      await this.init();

    } catch (error) {
      console.error('❌ データベースリセットエラー:', error);
      process.exit(1);
    }
  }

  async cleanup(): Promise<void> {
    console.log(`
🧹 期限切れデータのクリーンアップ
    `);

    try {
      await database.connect();
      await database.cleanupExpiredData();
      await this.showStats();

      console.log(`
✅ クリーンアップ完了

🤖 TDからのメッセージ:
「古いデータをお掃除しました！データベースがスッキリしましたね♪」
      `);

    } catch (error) {
      console.error('❌ クリーンアップエラー:', error);
      process.exit(1);
    } finally {
      await database.disconnect();
    }
  }

  async showStats(): Promise<void> {
    try {
      const stats = await database.getStats();
      
      console.log(`
📊 データベース統計:
┌─────────────────┬────────┐
│ テーブル        │ 件数   │
├─────────────────┼────────┤
│ パスワード      │ ${stats.passwords.count.toString().padStart(6)} │
│ 個人情報        │ ${stats.personalInfo.count.toString().padStart(6)} │
│ Claude データ   │ ${stats.claudeData.count.toString().padStart(6)} │
│ API 統計        │ ${stats.apiCalls.count.toString().padStart(6)} │
│ エラーログ      │ ${stats.errors.count.toString().padStart(6)} │
└─────────────────┴────────┘

💾 データベースサイズ: ${this.formatFileSize(stats.dbSize)}
      `);

    } catch (error) {
      console.error('❌ 統計取得エラー:', error);
    }
  }

  async backup(): Promise<void> {
    console.log(`
💾 データベースバックアップ
    `);

    try {
      const dbPath = process.env.DATABASE_URL?.replace('file:', '') || './data/td-buddy.db';
      
      if (!fs.existsSync(dbPath)) {
        console.error('❌ データベースファイルが存在しません');
        process.exit(1);
      }

      // バックアップディレクトリ作成
      const backupDir = './backups';
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      // バックアップファイル名生成
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(backupDir, `td-buddy-backup-${timestamp}.db`);

      // ファイルコピー
      fs.copyFileSync(dbPath, backupPath);

      const stats = fs.statSync(backupPath);
      console.log(`✅ バックアップ完了:
📁 パス: ${backupPath}
💾 サイズ: ${this.formatFileSize(stats.size)}
⏰ 作成日時: ${new Date().toLocaleString('ja-JP')}

🤖 TDからのメッセージ:
「データベースのバックアップが完了しました！安心ですね♪」`);

    } catch (error) {
      console.error('❌ バックアップエラー:', error);
      process.exit(1);
    }
  }

  async migrate(): Promise<void> {
    console.log(`
🔄 データベースマイグレーション
    `);

    // 将来のマイグレーション機能用のプレースホルダー
    console.log('📋 マイグレーション機能は Phase 2 で実装予定です');
    console.log('🍺 Brew: 現在のところ、必要なマイグレーションはありません！');
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  showHelp(): void {
    console.log(`
🤖 QA Workbench データベース管理ツール

使用方法:
  npm run db:init          データベースを初期化
  npm run db:reset         データベースをリセット（開発用）
  npm run db:cleanup       期限切れデータを削除
  npm run db:stats         データベース統計を表示
  npm run db:backup        データベースをバックアップ
  npm run db:migrate       マイグレーションを実行
  npm run db:help          このヘルプを表示

フラグ:
  --force                  確認プロンプトをスキップ

例:
  npm run db:init
  npm run db:reset -- --force
  npm run db:cleanup

🤖 TDからのメッセージ:
「データベース管理もTDにお任せください！安全で効率的に管理します♪」
    `);
  }
}

// メイン実行部分
async function main() {
  const initializer = new DatabaseInitializer();

  switch (command) {
    case 'init':
      await initializer.init();
      break;
    case 'reset':
      await initializer.reset();
      break;
    case 'cleanup':
      await initializer.cleanup();
      break;
    case 'stats':
      await initializer.showStats();
      await database.disconnect();
      break;
    case 'backup':
      await initializer.backup();
      break;
    case 'migrate':
      await initializer.migrate();
      break;
    case 'help':
    default:
      initializer.showHelp();
      break;
  }
}

// エラーハンドリング
process.on('uncaughtException', (error) => {
  console.error('💥 予期せぬエラー:', error);
  console.log('🍺 Brew: 申し訳ありません。データベース操作中にエラーが発生しました。');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 未処理のPromise拒否:', reason);
  console.log('🍺 Brew: Promise関連のエラーが発生しました。');
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🍺 Brew: データベース操作を中断します...');
  await database.disconnect();
  process.exit(0);
});

// スクリプト実行
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ スクリプト実行エラー:', error);
    process.exit(1);
  });
} 