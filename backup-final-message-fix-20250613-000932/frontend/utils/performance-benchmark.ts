// パフォーマンス比較ベンチマークツール
// 従来版 vs 超高速版の性能比較

import { generateLargeFile } from './large-file-generator';
import { generateUltraFast } from './ultra-fast-generator';

export interface BenchmarkResult {
  fileSize: number;
  fileType: string;
  originalTime: number;
  ultraFastTime: number;
  speedImprovement: number;
  originalSpeed: number; // bytes/sec
  ultraFastSpeed: number; // bytes/sec
}

export class PerformanceBenchmark {
  /**
   * パフォーマンス比較テスト実行
   */
  async runBenchmark(
    fileSizes: number[],
    fileTypes: string[] = ['txt', 'json', 'csv']
  ): Promise<BenchmarkResult[]> {
    const results: BenchmarkResult[] = [];

    console.log('🚀 パフォーマンスベンチマーク開始');

    for (const fileSize of fileSizes) {
      for (const fileType of fileTypes) {
        console.log(
          `📊 テスト中: ${this.formatBytes(fileSize)} ${fileType.toUpperCase()}`
        );

        try {
          // 従来版テスト
          const originalStart = Date.now();
          await generateLargeFile(fileSize, fileType);
          const originalTime = (Date.now() - originalStart) / 1000;

          // 少し待機
          await new Promise(resolve => setTimeout(resolve, 1000));

          // 超高速版テスト
          const ultraFastStart = Date.now();
          await generateUltraFast(fileSize, fileType);
          const ultraFastTime = (Date.now() - ultraFastStart) / 1000;

          // 結果計算
          const speedImprovement = originalTime / ultraFastTime;
          const originalSpeed = fileSize / originalTime;
          const ultraFastSpeed = fileSize / ultraFastTime;

          const result: BenchmarkResult = {
            fileSize,
            fileType,
            originalTime,
            ultraFastTime,
            speedImprovement,
            originalSpeed,
            ultraFastSpeed,
          };

          results.push(result);

          console.log(`✅ 完了: ${speedImprovement.toFixed(2)}x 高速化`);
        } catch (error) {
          console.error(`❌ エラー: ${error}`);
        }
      }
    }

    return results;
  }

  /**
   * ベンチマーク結果をコンソールに表示
   */
  displayResults(results: BenchmarkResult[]): void {
    console.log('\n📊 パフォーマンスベンチマーク結果');
    console.log('='.repeat(80));

    results.forEach(result => {
      console.log(
        `\n📁 ${this.formatBytes(
          result.fileSize
        )} ${result.fileType.toUpperCase()}`
      );
      console.log(
        `⏱️  従来版: ${result.originalTime.toFixed(2)}秒 (${this.formatSpeed(
          result.originalSpeed
        )})`
      );
      console.log(
        `⚡ 超高速版: ${result.ultraFastTime.toFixed(2)}秒 (${this.formatSpeed(
          result.ultraFastSpeed
        )})`
      );
      console.log(`🚀 改善率: ${result.speedImprovement.toFixed(2)}x 高速化`);
    });

    // 平均改善率
    const avgImprovement =
      results.reduce((sum, r) => sum + r.speedImprovement, 0) / results.length;
    console.log(`\n🎯 平均改善率: ${avgImprovement.toFixed(2)}x 高速化`);
  }

  /**
   * ベンチマーク結果をMarkdownテーブルで出力
   */
  generateMarkdownReport(results: BenchmarkResult[]): string {
    let markdown = '# パフォーマンスベンチマーク結果\n\n';
    markdown +=
      '| ファイルサイズ | 形式 | 従来版 | 超高速版 | 改善率 | 従来版速度 | 超高速版速度 |\n';
    markdown += '|---|---|---|---|---|---|---|\n';

    results.forEach(result => {
      markdown += `| ${this.formatBytes(
        result.fileSize
      )} | ${result.fileType.toUpperCase()} | ${result.originalTime.toFixed(
        2
      )}s | ${result.ultraFastTime.toFixed(
        2
      )}s | ${result.speedImprovement.toFixed(2)}x | ${this.formatSpeed(
        result.originalSpeed
      )} | ${this.formatSpeed(result.ultraFastSpeed)} |\n`;
    });

    const avgImprovement =
      results.reduce((sum, r) => sum + r.speedImprovement, 0) / results.length;
    markdown += `\n**平均改善率: ${avgImprovement.toFixed(2)}x 高速化**\n`;

    return markdown;
  }

  /**
   * クイックベンチマーク（小さなサイズで高速テスト）
   */
  async quickBenchmark(): Promise<BenchmarkResult[]> {
    const testSizes = [
      1 * 1024 * 1024, // 1MB
      10 * 1024 * 1024, // 10MB
      50 * 1024 * 1024, // 50MB
    ];

    return this.runBenchmark(testSizes, ['txt', 'json']);
  }

  /**
   * フルベンチマーク（大容量テスト）
   */
  async fullBenchmark(): Promise<BenchmarkResult[]> {
    const testSizes = [
      1 * 1024 * 1024, // 1MB
      10 * 1024 * 1024, // 10MB
      50 * 1024 * 1024, // 50MB
      100 * 1024 * 1024, // 100MB
      500 * 1024 * 1024, // 500MB
    ];

    return this.runBenchmark(testSizes, ['txt', 'json', 'csv', 'xml']);
  }

  private formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)}${units[unitIndex]}`;
  }

  private formatSpeed(bytesPerSecond: number): string {
    return `${this.formatBytes(bytesPerSecond)}/s`;
  }
}

/**
 * ベンチマーク実行のヘルパー関数
 */
export async function runQuickBenchmark(): Promise<void> {
  const benchmark = new PerformanceBenchmark();
  const results = await benchmark.quickBenchmark();
  benchmark.displayResults(results);

  // Markdownレポートも生成
  const markdown = benchmark.generateMarkdownReport(results);
  console.log('\n📝 Markdownレポート:');
  console.log(markdown);
}

export async function runFullBenchmark(): Promise<void> {
  const benchmark = new PerformanceBenchmark();
  const results = await benchmark.fullBenchmark();
  benchmark.displayResults(results);

  // Markdownレポートも生成
  const markdown = benchmark.generateMarkdownReport(results);
  console.log('\n📝 Markdownレポート:');
  console.log(markdown);
}
