#!/usr/bin/env node

/**
 * 🤖 TD Buddy - 自動日付挿入スクリプト
 * ドキュメント作成時に正確な現在日時を自動挿入
 */

const fs = require('fs');
const path = require('path');

class AutoDateDocumentation {
  constructor() {
    this.today = new Date();
    this.todayString = this.formatDate(this.today);
    this.todayISO = this.today.toISOString().split('T')[0];
  }

  /**
   * 日付を日本語形式でフォーマット
   */
  formatDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  }

  /**
   * 現在時刻を含む詳細フォーマット
   */
  formatDateTime(date) {
    const dateStr = this.formatDate(date);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${dateStr} ${hours}:${minutes}`;
  }

  /**
   * ドキュメントテンプレートに日付を挿入
   */
  createDocumentWithDate(templatePath, outputPath, variables = {}) {
    try {
      let template = fs.readFileSync(templatePath, 'utf8');
      
      // 基本的な日付変数を置換
      const dateVariables = {
        '{{TODAY}}': this.todayString,
        '{{TODAY_ISO}}': this.todayISO,
        '{{DATETIME}}': this.formatDateTime(this.today),
        '{{YEAR}}': this.today.getFullYear().toString(),
        '{{MONTH}}': (this.today.getMonth() + 1).toString(),
        '{{DAY}}': this.today.getDate().toString(),
        ...variables
      };

      // 変数を順次置換
      Object.entries(dateVariables).forEach(([key, value]) => {
        template = template.replace(new RegExp(key, 'g'), value);
      });

      // ディレクトリが存在しない場合は作成
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // ファイルを出力
      fs.writeFileSync(outputPath, template, 'utf8');
      
      console.log(`✅ ドキュメント作成完了: ${outputPath}`);
      console.log(`📅 挿入された日付: ${this.todayString}`);
      
      return true;
    } catch (error) {
      console.error(`❌ エラー: ${error.message}`);
      return false;
    }
  }

  /**
   * 既存ドキュメントの日付を更新
   */
  updateDocumentDates(filePath, patterns = {}) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      const defaultPatterns = {
        // 一般的な日付パターン
        /\*\*実行日時\*\*:\s*\d{4}年\d{1,2}月\d{1,2}日/g: `**実行日時**: ${this.todayString}`,
        /\*\*記録作成\*\*:\s*\d{4}年\d{1,2}月\d{1,2}日/g: `**記録作成**: ${this.todayString}`,
        /\*\*作成日\*\*:\s*\d{4}年\d{1,2}月\d{1,2}日/g: `**作成日**: ${this.todayString}`,
        /\*\*更新日\*\*:\s*\d{4}年\d{1,2}月\d{1,2}日/g: `**更新日**: ${this.todayString}`,
        ...patterns
      };

      let updated = false;
      Object.entries(defaultPatterns).forEach(([pattern, replacement]) => {
        if (content.match(pattern)) {
          content = content.replace(pattern, replacement);
          updated = true;
        }
      });

      if (updated) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ 日付更新完了: ${filePath}`);
        console.log(`📅 更新された日付: ${this.todayString}`);
      } else {
        console.log(`ℹ️  更新対象の日付パターンが見つかりませんでした: ${filePath}`);
      }

      return updated;
    } catch (error) {
      console.error(`❌ エラー: ${error.message}`);
      return false;
    }
  }

  /**
   * ドキュメントテンプレートを作成
   */
  createTemplate(templatePath) {
    const template = `# {{TITLE}}

## 📅 ドキュメント情報
- **作成日時**: {{DATETIME}}
- **作成者**: {{AUTHOR}}
- **プロジェクト**: TD Buddy (TestData Buddy)
- **ファイル**: {{FILENAME}}

## 🎯 目的・概要
{{PURPOSE}}

## 📝 内容
{{CONTENT}}

## 📋 参考資料
{{REFERENCES}}

---

**記録作成**: {{TODAY}}  
**記録者**: TD (TestData Buddy Assistant)  
**ステータス**: {{STATUS}}
`;

    try {
      fs.writeFileSync(templatePath, template, 'utf8');
      console.log(`✅ テンプレート作成完了: ${templatePath}`);
      return true;
    } catch (error) {
      console.error(`❌ テンプレート作成エラー: ${error.message}`);
      return false;
    }
  }
}

// CLI使用時の処理
if (require.main === module) {
  const args = process.argv.slice(2);
  const autoDate = new AutoDateDocumentation();
  
  if (args.length === 0) {
    console.log(`
🤖 TD Buddy - 自動日付挿入スクリプト

使用方法:
  node auto-date-documentation.js update <file>     # 既存ファイルの日付を更新
  node auto-date-documentation.js create <template> <output>  # テンプレートから新規作成
  node auto-date-documentation.js template <file>   # テンプレートファイルを作成

例:
  node auto-date-documentation.js update docs/setup-record.md
  node auto-date-documentation.js create template.md output.md
  node auto-date-documentation.js template docs/template.md

📅 今日の日付: ${autoDate.todayString}
`);
    process.exit(0);
  }

  const command = args[0];
  
  switch (command) {
    case 'update':
      if (args[1]) {
        autoDate.updateDocumentDates(args[1]);
      } else {
        console.error('❌ ファイルパスを指定してください');
        process.exit(1);
      }
      break;
      
    case 'create':
      if (args[1] && args[2]) {
        autoDate.createDocumentWithDate(args[1], args[2]);
      } else {
        console.error('❌ テンプレートファイルと出力ファイルを指定してください');
        process.exit(1);
      }
      break;
      
    case 'template':
      if (args[1]) {
        autoDate.createTemplate(args[1]);
      } else {
        console.error('❌ テンプレートファイルパスを指定してください');
        process.exit(1);
      }
      break;
      
    default:
      console.error(`❌ 不明なコマンド: ${command}`);
      process.exit(1);
  }
}

module.exports = AutoDateDocumentation; 