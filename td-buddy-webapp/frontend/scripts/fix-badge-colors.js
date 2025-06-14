#!/usr/bin/env node

/**
 * 🛠️ ワークベンチバッジ色修正スクリプト
 * Tailwindのデフォルト色をワークベンチデザインシステムに一括変換
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 置換ルール定義
const replacementRules = [
  // 文字数バッジ（ブルー系）
  {
    from: /bg-blue-100\s+text-blue-800/g,
    to: 'wb-badge wb-badge-count',
    description: '文字数バッジ（検査ツール系）',
  },
  {
    from: /bg-blue-100\s+text-blue-700/g,
    to: 'wb-badge wb-badge-count',
    description: '文字数バッジ（検査ツール系）',
  },

  // 個数バッジ（グリーン系）
  {
    from: /bg-green-100\s+text-green-800/g,
    to: 'wb-badge wb-badge-items',
    description: '個数バッジ（接合ツール系）',
  },
  {
    from: /bg-green-100\s+text-green-700/g,
    to: 'wb-badge wb-badge-items',
    description: '個数バッジ（接合ツール系）',
  },

  // 文字種バッジ（パープル系）
  {
    from: /bg-purple-100\s+text-purple-800/g,
    to: 'wb-badge wb-badge-type',
    description: '文字種バッジ（仕上げツール系）',
  },
  {
    from: /bg-purple-100\s+text-purple-700/g,
    to: 'wb-badge wb-badge-type',
    description: '文字種バッジ（仕上げツール系）',
  },

  // 警告バッジ（イエロー系）
  {
    from: /bg-yellow-100\s+text-yellow-800/g,
    to: 'wb-badge wb-badge-warning',
    description: '警告バッジ（測定ツール系）',
  },
  {
    from: /bg-yellow-100\s+text-yellow-700/g,
    to: 'wb-badge wb-badge-warning',
    description: '警告バッジ（測定ツール系）',
  },

  // 記号・その他バッジ（グレー系）
  {
    from: /bg-gray-100\s+text-gray-800/g,
    to: 'wb-badge wb-badge-symbol',
    description: '記号バッジ（木材系）',
  },
  {
    from: /bg-gray-100\s+text-gray-700/g,
    to: 'wb-badge wb-badge-symbol',
    description: '記号バッジ（木材系）',
  },
];

// 対象ファイルパターン
const targetPatterns = [
  'components/**/*.tsx',
  'app/**/*.tsx',
  'pages/**/*.tsx',
  'src/**/*.tsx',
];

// メイン処理
async function fixBadgeColors() {
  console.log('🛠️ ワークベンチバッジ色修正を開始します...\n');

  let totalFiles = 0;
  let modifiedFiles = 0;
  let totalReplacements = 0;

  for (const pattern of targetPatterns) {
    const files = glob.sync(pattern, { cwd: process.cwd() });

    for (const file of files) {
      const filePath = path.resolve(file);

      if (!fs.existsSync(filePath)) {
        continue;
      }

      totalFiles++;
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      let fileReplacements = 0;

      // 各置換ルールを適用
      for (const rule of replacementRules) {
        const matches = content.match(rule.from);
        if (matches) {
          content = content.replace(rule.from, rule.to);
          fileReplacements += matches.length;
          console.log(`  ✅ ${rule.description}: ${matches.length}箇所`);
        }
      }

      // ファイルが変更された場合のみ保存
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        modifiedFiles++;
        totalReplacements += fileReplacements;
        console.log(`📝 修正完了: ${file} (${fileReplacements}箇所)\n`);
      }
    }
  }

  // 結果サマリー
  console.log('🎯 修正完了サマリー:');
  console.log(`  📁 対象ファイル数: ${totalFiles}`);
  console.log(`  ✏️ 修正ファイル数: ${modifiedFiles}`);
  console.log(`  🔄 総置換数: ${totalReplacements}`);
  console.log('\n🌟 ワークベンチバッジシステムへの移行が完了しました！');
}

// スクリプト実行
if (require.main === module) {
  fixBadgeColors().catch(console.error);
}

module.exports = { fixBadgeColors, replacementRules };
