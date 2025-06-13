#!/usr/bin/env node

/**
 * 🛡️ 安全なバッジカラー修正スクリプト
 * 段階的アプローチで既存システムを壊さずに修正
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// 設定
const CONFIG = {
  // 対象ディレクトリ
  targetDirs: [
    "app",
    "components",
    "pages",
    "src",
    "td-buddy-webapp/frontend/app",
    "td-buddy-webapp/frontend/components",
    "td-buddy-webapp/frontend/pages",
    "td-buddy-webapp/frontend/src",
  ],
  // バックアップディレクトリ
  backupDir: `backup-badge-fix-${new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/:/g, "-")}`,
  // テストモード（実際の変更は行わない）
  dryRun: true,
  // 一度に処理するファイル数の制限
  batchSize: 5,
};

// 問題のあるパターンと修正案
const BADGE_PATTERNS = [
  {
    id: "blue-badge",
    pattern: /className="([^"]*?)bg-blue-100([^"]*?)text-blue-800([^"]*?)"/g,
    replacement: 'className="$1wb-badge-count$3"',
    description: "Blue badges → Workbench count badges",
    risk: "low",
  },
  {
    id: "green-badge",
    pattern: /className="([^"]*?)bg-green-100([^"]*?)text-green-800([^"]*?)"/g,
    replacement: 'className="$1wb-badge-items$3"',
    description: "Green badges → Workbench items badges",
    risk: "low",
  },
  {
    id: "purple-badge",
    pattern:
      /className="([^"]*?)bg-purple-100([^"]*?)text-purple-800([^"]*?)"/g,
    replacement: 'className="$1wb-badge-type$3"',
    description: "Purple badges → Workbench type badges",
    risk: "medium",
  },
  {
    id: "gray-badge",
    pattern: /className="([^"]*?)bg-gray-100([^"]*?)text-gray-800([^"]*?)"/g,
    replacement: 'className="$1wb-badge-symbol$3"',
    description: "Gray badges → Workbench symbol badges",
    risk: "low",
  },
];

class SafeBadgeMigration {
  constructor() {
    this.stats = {
      filesScanned: 0,
      filesWithIssues: 0,
      totalIssues: 0,
      issuesByType: {},
      riskAssessment: { low: 0, medium: 0, high: 0 },
    };
    this.issues = [];
  }

  // 🔍 分析フェーズ
  async analyze() {
    console.log("🔍 バッジカラー問題の分析を開始...\n");

    for (const dir of CONFIG.targetDirs) {
      if (fs.existsSync(dir)) {
        await this.scanDirectory(dir);
      }
    }

    this.generateAnalysisReport();
  }

  // 📁 ディレクトリスキャン
  async scanDirectory(dirPath) {
    const files = this.getReactFiles(dirPath);

    for (const file of files) {
      await this.scanFile(file);
    }
  }

  // 📄 ファイルスキャン
  async scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      this.stats.filesScanned++;

      let fileHasIssues = false;
      const fileIssues = [];

      for (const pattern of BADGE_PATTERNS) {
        const matches = [...content.matchAll(pattern.pattern)];

        if (matches.length > 0) {
          fileHasIssues = true;
          this.stats.totalIssues += matches.length;
          this.stats.issuesByType[pattern.id] =
            (this.stats.issuesByType[pattern.id] || 0) + matches.length;
          this.stats.riskAssessment[pattern.risk] += matches.length;

          for (const match of matches) {
            fileIssues.push({
              type: pattern.id,
              description: pattern.description,
              risk: pattern.risk,
              line: this.getLineNumber(content, match.index),
              original: match[0],
              suggested: match[0].replace(pattern.pattern, pattern.replacement),
            });
          }
        }
      }

      if (fileHasIssues) {
        this.stats.filesWithIssues++;
        this.issues.push({
          file: filePath,
          issues: fileIssues,
        });
      }
    } catch (error) {
      console.error(`❌ ファイル読み込みエラー: ${filePath}`, error.message);
    }
  }

  // 📊 分析レポート生成
  generateAnalysisReport() {
    console.log("📊 分析結果レポート");
    console.log("=".repeat(50));
    console.log(`📁 スキャンしたファイル数: ${this.stats.filesScanned}`);
    console.log(`⚠️  問題のあるファイル数: ${this.stats.filesWithIssues}`);
    console.log(`🔍 発見された問題の総数: ${this.stats.totalIssues}`);
    console.log("");

    console.log("📈 問題の種類別統計:");
    for (const [type, count] of Object.entries(this.stats.issuesByType)) {
      const pattern = BADGE_PATTERNS.find((p) => p.id === type);
      console.log(`  ${pattern.description}: ${count}件`);
    }
    console.log("");

    console.log("⚠️  リスク評価:");
    console.log(`  🟢 低リスク: ${this.stats.riskAssessment.low}件`);
    console.log(`  🟡 中リスク: ${this.stats.riskAssessment.medium}件`);
    console.log(`  🔴 高リスク: ${this.stats.riskAssessment.high}件`);
    console.log("");

    if (this.stats.filesWithIssues > 0) {
      console.log("📋 詳細な問題リスト:");
      console.log("-".repeat(50));

      for (const fileIssue of this.issues.slice(0, 10)) {
        // 最初の10ファイルのみ表示
        console.log(`📄 ${fileIssue.file}`);
        for (const issue of fileIssue.issues.slice(0, 3)) {
          // ファイルごとに最初の3つの問題のみ
          console.log(
            `  ${this.getRiskIcon(issue.risk)} Line ${issue.line}: ${
              issue.description
            }`
          );
          console.log(`    現在: ${issue.original.substring(0, 80)}...`);
          console.log(`    提案: ${issue.suggested.substring(0, 80)}...`);
        }
        console.log("");
      }

      if (this.issues.length > 10) {
        console.log(`... および他 ${this.issues.length - 10} ファイル`);
      }
    }

    this.generateRecommendations();
  }

  // 💡 推奨事項の生成
  generateRecommendations() {
    console.log("💡 推奨される対応策");
    console.log("=".repeat(50));

    if (this.stats.totalIssues === 0) {
      console.log("✅ 問題は見つかりませんでした。現在のシステムは良好です！");
      return;
    }

    console.log("🎯 段階的修正アプローチ:");
    console.log("");

    console.log("📋 Phase 1: 準備と検証");
    console.log("  1. バックアップの作成");
    console.log("  2. テスト環境での動作確認");
    console.log("  3. 低リスク項目の修正テスト");
    console.log("");

    console.log("🔧 Phase 2: 段階的修正");
    console.log("  1. 低リスク項目から開始");
    console.log("  2. 1-2ファイルずつ修正");
    console.log("  3. 各修正後の動作確認");
    console.log("");

    console.log("✅ Phase 3: 検証と完了");
    console.log("  1. 全体的な動作テスト");
    console.log("  2. デザインシステムの統一確認");
    console.log("  3. ドキュメントの更新");
    console.log("");

    if (this.stats.riskAssessment.high > 0) {
      console.log(
        "⚠️  高リスク項目が検出されました。手動での慎重な確認が必要です。"
      );
    }

    console.log("🚀 次のステップ:");
    console.log("  npm run badge-fix:backup  # バックアップ作成");
    console.log("  npm run badge-fix:test    # テスト実行");
    console.log("  npm run badge-fix:apply   # 段階的適用");
  }

  // 🛠️ ユーティリティメソッド
  getReactFiles(dir) {
    const files = [];

    function traverse(currentDir) {
      const items = fs.readdirSync(currentDir);

      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (
          stat.isDirectory() &&
          !item.startsWith(".") &&
          item !== "node_modules"
        ) {
          traverse(fullPath);
        } else if (item.endsWith(".tsx") || item.endsWith(".jsx")) {
          files.push(fullPath);
        }
      }
    }

    traverse(dir);
    return files;
  }

  getLineNumber(content, index) {
    return content.substring(0, index).split("\n").length;
  }

  getRiskIcon(risk) {
    const icons = { low: "🟢", medium: "🟡", high: "🔴" };
    return icons[risk] || "⚪";
  }

  // 💾 バックアップ作成
  async createBackup() {
    console.log("💾 バックアップを作成中...");

    if (!fs.existsSync(CONFIG.backupDir)) {
      fs.mkdirSync(CONFIG.backupDir, { recursive: true });
    }

    for (const dir of CONFIG.targetDirs) {
      if (fs.existsSync(dir)) {
        execSync(`cp -r ${dir} ${CONFIG.backupDir}/`, { stdio: "inherit" });
      }
    }

    console.log(`✅ バックアップが作成されました: ${CONFIG.backupDir}`);
  }

  // 🧪 テスト実行
  async runTests() {
    console.log("🧪 テストを実行中...");

    try {
      // Next.js のビルドテスト
      execSync("npm run build", { stdio: "inherit" });
      console.log("✅ ビルドテスト成功");

      // 型チェック
      execSync("npm run type-check", { stdio: "inherit" });
      console.log("✅ 型チェック成功");
    } catch (error) {
      console.error("❌ テスト失敗:", error.message);
      throw error;
    }
  }
}

// メイン実行
async function main() {
  const migration = new SafeBadgeMigration();

  const command = process.argv[2];

  switch (command) {
    case "analyze":
      await migration.analyze();
      break;
    case "backup":
      await migration.createBackup();
      break;
    case "test":
      await migration.runTests();
      break;
    default:
      console.log("🛡️ 安全なバッジカラー修正ツール");
      console.log("");
      console.log("使用方法:");
      console.log(
        "  node scripts/safe-badge-migration.js analyze  # 問題の分析"
      );
      console.log(
        "  node scripts/safe-badge-migration.js backup   # バックアップ作成"
      );
      console.log(
        "  node scripts/safe-badge-migration.js test     # テスト実行"
      );
      console.log("");
      console.log("推奨手順:");
      console.log("  1. analyze  - まず現状を把握");
      console.log("  2. backup   - 安全のためバックアップ");
      console.log("  3. test     - 現在の状態でテスト");
      console.log("  4. 手動で1-2ファイルずつ修正");
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = SafeBadgeMigration;
