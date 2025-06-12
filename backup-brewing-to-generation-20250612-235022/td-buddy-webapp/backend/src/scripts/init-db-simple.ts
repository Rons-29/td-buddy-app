#!/usr/bin/env ts-node

import * as path from 'path';
import * as fs from 'fs';

// 簡単なデータベース初期化スクリプト
class SimpleDBInitializer {
  private dbPath: string;

  constructor() {
    this.dbPath = process.env.DATABASE_URL?.replace('file:', '') || './data/td-buddy.db';
  }

  async init(): Promise<void> {
    console.log(`
🤖 QA Workbench データベース初期化スクリプト

🏗️  データベースの初期化を開始します...
    `);

    try {
      // データベースディレクトリが存在しない場合は作成
      const dbDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
        console.log(`📁 データベースディレクトリを作成しました: ${dbDir}`);
      }

      // 空のデータベースファイルを作成（better-sqlite3インストール後に初期化）
      if (!fs.existsSync(this.dbPath)) {
        fs.writeFileSync(this.dbPath, '');
        console.log(`💾 データベースファイルを作成しました: ${this.dbPath}`);
      }

      // 関連ディレクトリの作成
      const dirs = ['./logs', './uploads', './backups'];
      dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
          console.log(`📁 ディレクトリを作成しました: ${dir}`);
        }
      });

      console.log(`
🎉 データベース基盤の初期化が完了しました！

📝 次のステップ:
1. better-sqlite3をインストール: npm install better-sqlite3
2. @types/better-sqlite3をインストール: npm install -D @types/better-sqlite3
3. 完全なデータベース初期化を実行: npm run db:init

🤖 Brewからのメッセージ:
「データベースの基盤ができました！依存関係をインストールしてから本格的な初期化を行いましょう♪」
      `);

    } catch (error) {
      console.error('❌ データベース初期化エラー:', error);
      process.exit(1);
    }
  }

  showHelp(): void {
    console.log(`
🤖 QA Workbench 簡易データベース初期化ツール

使用方法:
  npm run db:setup    基本的なディレクトリ構造を作成
  npm run db:help     このヘルプを表示

説明:
  このスクリプトは依存関係をインストールする前の
  基本的なセットアップを行います。

🤖 Brewからのメッセージ:
「まずは基盤を整えましょう！準備ができたら本格的な初期化をします♪」
    `);
  }
}

// メイン実行部分
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'init';
  
  const initializer = new SimpleDBInitializer();

  switch (command) {
    case 'init':
    case 'setup':
      await initializer.init();
      break;
    case 'help':
    default:
      initializer.showHelp();
      break;
  }
}

// スクリプト実行
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ スクリプト実行エラー:', error);
    process.exit(1);
  });
} 