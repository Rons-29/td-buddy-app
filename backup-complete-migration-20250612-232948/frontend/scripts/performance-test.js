#!/usr/bin/env node

/**
 * TestData Buddy パフォーマンステストスクリプト
 * 大量データ生成時のパフォーマンス測定
 */

const chalk = require('chalk');

// テスト設定
const TEST_SCENARIOS = [
  { name: 'CSV生成テスト (小)', rows: 100 },
  { name: 'CSV生成テスト (中)', rows: 1000 },
  { name: 'CSV生成テスト (大)', rows: 5000 },
  { name: '日付生成テスト (小)', count: 100 },
  { name: '日付生成テスト (中)', count: 1000 },
  { name: 'カラー生成テスト (小)', count: 100 },
  { name: 'カラー生成テスト (中)', count: 500 }
];

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] 🤖 TD パフォーマンス:`;
  
  switch (type) {
    case 'success':
      console.log(chalk.green(`${prefix} ✅ ${message}`));
      break;
    case 'error':
      console.log(chalk.red(`${prefix} ❌ ${message}`));
      break;
    case 'warning':
      console.log(chalk.yellow(`${prefix} ⚠️  ${message}`));
      break;
    case 'perf':
      console.log(chalk.magenta(`${prefix} 📊 ${message}`));
      break;
    default:
      console.log(chalk.blue(`${prefix} ${message}`));
  }
}

// メモリ使用量測定
function getMemoryUsage() {
  const used = process.memoryUsage();
  return {
    rss: Math.round(used.rss / 1024 / 1024 * 100) / 100,
    heapTotal: Math.round(used.heapTotal / 1024 / 1024 * 100) / 100,
    heapUsed: Math.round(used.heapUsed / 1024 / 1024 * 100) / 100,
    external: Math.round(used.external / 1024 / 1024 * 100) / 100
  };
}

// CSV データ生成パフォーマンステスト
function testCSVGeneration(rowCount) {
  const startTime = performance.now();
  const startMemory = getMemoryUsage();
  
  // サンプルCSVデータ生成
  const columns = [
    { name: 'id', type: 'number' },
    { name: 'name', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'phone', type: 'phone' },
    { name: 'date', type: 'date' }
  ];
  
  const data = [];
  for (let i = 0; i < rowCount; i++) {
    const row = {
      id: i + 1,
      name: `テストユーザー${i + 1}`,
      email: `test${i + 1}@example.com`,
      phone: `090-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    data.push(row);
  }
  
  // CSV形式に変換
  const csvHeader = columns.map(col => col.name).join(',');
  const csvRows = data.map(row => Object.values(row).join(','));
  const csvContent = [csvHeader, ...csvRows].join('\n');
  
  const endTime = performance.now();
  const endMemory = getMemoryUsage();
  
  return {
    duration: Math.round((endTime - startTime) * 100) / 100,
    rowCount,
    dataSize: Math.round(csvContent.length / 1024 * 100) / 100, // KB
    memoryDelta: {
      rss: endMemory.rss - startMemory.rss,
      heapUsed: endMemory.heapUsed - startMemory.heapUsed
    }
  };
}

// 日付データ生成パフォーマンステスト
function testDateTimeGeneration(count) {
  const startTime = performance.now();
  const startMemory = getMemoryUsage();
  
  const dates = [];
  for (let i = 0; i < count; i++) {
    const randomTime = Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000;
    const date = new Date(randomTime);
    dates.push({
      iso: date.toISOString(),
      timestamp: date.getTime(),
      formatted: date.toLocaleDateString('ja-JP'),
      timeString: date.toLocaleTimeString('ja-JP')
    });
  }
  
  const endTime = performance.now();
  const endMemory = getMemoryUsage();
  
  return {
    duration: Math.round((endTime - startTime) * 100) / 100,
    count,
    dataSize: Math.round(JSON.stringify(dates).length / 1024 * 100) / 100, // KB
    memoryDelta: {
      rss: endMemory.rss - startMemory.rss,
      heapUsed: endMemory.heapUsed - startMemory.heapUsed
    }
  };
}

// カラーデータ生成パフォーマンステスト
function testColorGeneration(count) {
  const startTime = performance.now();
  const startMemory = getMemoryUsage();
  
  const colors = [];
  for (let i = 0; i < count; i++) {
    const h = Math.random() * 360;
    const s = Math.random() * 100;
    const l = Math.random() * 100;
    
    // HSLからHEXに変換
    const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l / 100 - c / 2;
    
    let r, g, b;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    
    const hexR = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    const hexG = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    const hexB = Math.round((b + m) * 255).toString(16).padStart(2, '0');
    const hex = `#${hexR}${hexG}${hexB}`;
    
    colors.push({
      hex: hex.toUpperCase(),
      rgb: `rgb(${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)})`,
      hsl: `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`
    });
  }
  
  const endTime = performance.now();
  const endMemory = getMemoryUsage();
  
  return {
    duration: Math.round((endTime - startTime) * 100) / 100,
    count,
    dataSize: Math.round(JSON.stringify(colors).length / 1024 * 100) / 100, // KB
    memoryDelta: {
      rss: endMemory.rss - startMemory.rss,
      heapUsed: endMemory.heapUsed - startMemory.heapUsed
    }
  };
}

// パフォーマンス基準評価
function evaluatePerformance(result, type) {
  const { duration, count, rowCount, dataSize } = result;
  const itemCount = count || rowCount;
  const itemsPerSecond = Math.round(itemCount / (duration / 1000));
  
  let rating = 'good';
  let thresholdMs = 1000; // デフォルト閾値
  
  switch (type) {
    case 'csv':
      thresholdMs = itemCount > 1000 ? 3000 : 1000;
      break;
    case 'datetime':
      thresholdMs = itemCount > 500 ? 2000 : 800;
      break;
    case 'color':
      thresholdMs = itemCount > 300 ? 1500 : 500;
      break;
  }
  
  if (duration > thresholdMs * 2) rating = 'poor';
  else if (duration > thresholdMs) rating = 'fair';
  
  return { rating, itemsPerSecond, threshold: thresholdMs };
}

function runPerformanceTests() {
  log('🚀 TestData Buddy パフォーマンステスト開始');
  log('='.repeat(60));
  
  const results = [];
  
  // CSV生成テスト
  log('📊 CSV生成パフォーマンステスト');
  [100, 1000, 5000].forEach(rowCount => {
    const result = testCSVGeneration(rowCount);
    const evaluation = evaluatePerformance(result, 'csv');
    
    log(`${rowCount}行: ${result.duration}ms (${evaluation.itemsPerSecond} 行/秒) [${evaluation.rating.toUpperCase()}]`, 'perf');
    log(`  データサイズ: ${result.dataSize}KB, メモリ使用: +${result.memoryDelta.heapUsed}MB`);
    
    results.push({ type: 'CSV', ...result, ...evaluation });
  });
  
  log('-'.repeat(40));
  
  // 日付生成テスト
  log('📅 日付・時刻生成パフォーマンステスト');
  [100, 1000].forEach(count => {
    const result = testDateTimeGeneration(count);
    const evaluation = evaluatePerformance(result, 'datetime');
    
    log(`${count}件: ${result.duration}ms (${evaluation.itemsPerSecond} 件/秒) [${evaluation.rating.toUpperCase()}]`, 'perf');
    log(`  データサイズ: ${result.dataSize}KB, メモリ使用: +${result.memoryDelta.heapUsed}MB`);
    
    results.push({ type: 'DateTime', ...result, ...evaluation });
  });
  
  log('-'.repeat(40));
  
  // カラー生成テスト
  log('🎨 カラー生成パフォーマンステスト');
  [100, 500].forEach(count => {
    const result = testColorGeneration(count);
    const evaluation = evaluatePerformance(result, 'color');
    
    log(`${count}件: ${result.duration}ms (${evaluation.itemsPerSecond} 件/秒) [${evaluation.rating.toUpperCase()}]`, 'perf');
    log(`  データサイズ: ${result.dataSize}KB, メモリ使用: +${result.memoryDelta.heapUsed}MB`);
    
    results.push({ type: 'Color', ...result, ...evaluation });
  });
  
  // 総合評価
  log('='.repeat(60));
  log('📈 パフォーマンス総合評価');
  
  const goodResults = results.filter(r => r.rating === 'good').length;
  const fairResults = results.filter(r => r.rating === 'fair').length;
  const poorResults = results.filter(r => r.rating === 'poor').length;
  
  log(`優秀: ${goodResults}件`, goodResults > 0 ? 'success' : 'info');
  log(`良好: ${fairResults}件`, fairResults > 0 ? 'warning' : 'info');
  log(`要改善: ${poorResults}件`, poorResults > 0 ? 'error' : 'success');
  
  const overallRating = poorResults > 0 ? 'poor' : fairResults > goodResults ? 'fair' : 'good';
  
  switch (overallRating) {
    case 'good':
      log('🎉 全体的なパフォーマンスは優秀です！', 'success');
      break;
    case 'fair':
      log('⚠️  パフォーマンスは良好ですが、改善の余地があります', 'warning');
      break;
    case 'poor':
      log('❌ パフォーマンスの改善が必要です', 'error');
      break;
  }
  
  // 推奨事項
  log('💡 TDからの推奨事項:');
  if (poorResults > 0) {
    log('  - 大量データ生成時の最適化を検討してください');
    log('  - バッチ処理やWorkerスレッドの活用を検討してください');
  }
  if (fairResults > 0) {
    log('  - メモリ使用量の最適化を検討してください');
    log('  - アルゴリズムの効率化を検討してください');
  }
  log('  - 定期的なパフォーマンスモニタリングを実施してください');
  
  return results;
}

// テスト実行
if (require.main === module) {
  runPerformanceTests();
}

module.exports = { runPerformanceTests }; 