const logger = console; performance } 

export interface PerformanceMetrics {
  operation: string;
  duration: number;
  timestamp: string;
  memoryUsage: NodeJS.MemoryUsage;
  itemCount?: number | undefined;
  throughput?: number | undefined; // items per second
}

export class PerformanceService {
  private static instance: PerformanceService;
  private metrics: PerformanceMetrics[] = [];
  private readonly maxMetrics = 1000; // 最大保持メトリクス数

  private constructor() {}

  static getInstance(): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService();
    }
    return PerformanceService.instance;
  }

  /**
   * パフォーマンス測定開始
   */
  startTimer(operation: string): string {
    const id = `${operation}_${Date.now()}_${Math.random()}`;
    performance.mark(`${id}_start`);
    return id;
  }

  /**
   * パフォーマンス測定終了
   */
  endTimer(id: string, itemCount?: number): PerformanceMetrics {
    performance.mark(`${id}_end`);
    performance.measure(id, `${id}_start`, `${id}_end`);
    
    const measure = performance.getEntriesByName(id)[0];
    if (!measure) {
      throw new Error(`Performance measure not found for id: ${id}`);
    }
    
    const duration = measure.duration;
    const memoryUsage = process.memoryUsage();
    
    const operation = id.split('_')[0];
    if (!operation) {
      throw new Error(`Invalid operation id format: ${id}`);
    }
    
    const throughput = itemCount ? (itemCount / (duration / 1000)) : undefined;
    
    const metric: PerformanceMetrics = {
      operation,
      duration,
      timestamp: new Date().toISOString(),
      memoryUsage,
      itemCount,
      throughput
    };

    // メトリクス保存
    this.addMetric(metric);
    
    // クリーンアップ
    performance.clearMarks(`${id}_start`);
    performance.clearMarks(`${id}_end`);
    performance.clearMeasures(id);
    
    return metric;
  }

  /**
   * メトリクス追加
   */
  private addMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    
    // 古いメトリクスを削除
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  /**
   * 統計情報取得
   */
  getStatistics(operation?: string): {
    count: number;
    averageDuration: number;
    minDuration: number;
    maxDuration: number;
    averageThroughput?: number | undefined;
    totalMemoryUsed: number;
  } {
    const filteredMetrics = operation 
      ? this.metrics.filter(m => m.operation === operation)
      : this.metrics;

    if (filteredMetrics.length === 0) {
      return {
        count: 0,
        averageDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        averageThroughput: undefined,
        totalMemoryUsed: 0
      };
    }

    const durations = filteredMetrics.map(m => m.duration);
    const throughputs = filteredMetrics
      .filter(m => m.throughput !== undefined)
      .map(m => m.throughput!);

    return {
      count: filteredMetrics.length,
      averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      averageThroughput: throughputs.length > 0 
        ? throughputs.reduce((a, b) => a + b, 0) / throughputs.length 
        : undefined,
      totalMemoryUsed: filteredMetrics[filteredMetrics.length - 1]?.memoryUsage.heapUsed || 0
    };
  }

  /**
   * 最新のメトリクス取得
   */
  getRecentMetrics(limit: number = 10): PerformanceMetrics[] {
    return this.metrics.slice(-limit);
  }

  /**
   * メトリクスクリア
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * パフォーマンスレポート生成
   */
  generateReport(): string {
    const operations = [...new Set(this.metrics.map(m => m.operation))];
    let report = '🚀 QA Workbench パフォーマンスレポート\n\n';
    
    operations.forEach(operation => {
      const stats = this.getStatistics(operation);
      report += `📊 ${operation}:\n`;
      report += `  - 実行回数: ${stats.count}回\n`;
      report += `  - 平均実行時間: ${stats.averageDuration.toFixed(2)}ms\n`;
      report += `  - 最短実行時間: ${stats.minDuration.toFixed(2)}ms\n`;
      report += `  - 最長実行時間: ${stats.maxDuration.toFixed(2)}ms\n`;
      if (stats.averageThroughput) {
        report += `  - 平均スループット: ${stats.averageThroughput.toFixed(2)} items/sec\n`;
      }
      report += `  - メモリ使用量: ${(stats.totalMemoryUsed / 1024 / 1024).toFixed(2)}MB\n\n`;
    });

    return report;
  }
} 
