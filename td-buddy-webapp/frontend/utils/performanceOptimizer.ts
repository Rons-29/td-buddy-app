/**
 * パフォーマンス最適化システム
 * TestData Buddy (TD) - Performance Optimization & Memory Management
 */

export interface PerformanceMetrics {
  memoryUsage: number;
  cpuUsage: number;
  renderTime: number;
  generationTime: number;
  networkLatency: number;
  cacheHitRate: number;
}

export interface OptimizationSuggestion {
  type: 'memory' | 'cpu' | 'network' | 'cache' | 'ui';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  solution: string;
  estimatedImprovement: string;
}

export interface PerformanceConfig {
  enableMemoryOptimization: boolean;
  enableCaching: boolean;
  enableLazyLoading: boolean;
  maxConcurrentOperations: number;
  chunkSize: number;
  cacheSize: number;
  garbageCollectionInterval: number;
}

/**
 * パフォーマンス監視・最適化クラス
 */
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer | null = null;
  private metrics: PerformanceMetrics;
  private config: PerformanceConfig;
  private cacheStorage: Map<string, any> = new Map();
  private performanceEntries: PerformanceEntry[] = [];
  private memoryWatcher: number | null = null;
  private optimizationHistory: OptimizationSuggestion[] = [];

  private constructor() {
    this.metrics = {
      memoryUsage: 0,
      cpuUsage: 0,
      renderTime: 0,
      generationTime: 0,
      networkLatency: 0,
      cacheHitRate: 0,
    };

    this.config = {
      enableMemoryOptimization: true,
      enableCaching: true,
      enableLazyLoading: true,
      maxConcurrentOperations: 3,
      chunkSize: 1000,
      cacheSize: 100,
      garbageCollectionInterval: 60000, // 1分
    };

    this.startMonitoring();
  }

  /**
   * シングルトンインスタンスの取得
   */
  static getInstance(): PerformanceOptimizer {
    if (!this.instance) {
      this.instance = new PerformanceOptimizer();
    }
    return this.instance;
  }

  /**
   * パフォーマンス監視開始
   */
  private startMonitoring(): void {
    // ブラウザ環境でのみ実行
    if (typeof window === 'undefined') {
      console.log(
        '🚀 TDからのメッセージ: サーバー環境のため、パフォーマンス監視をスキップします'
      );
      return;
    }

    // メモリ使用量の定期監視
    this.memoryWatcher = window.setInterval(() => {
      this.updateMemoryMetrics();
      this.performAutoOptimization();
    }, this.config.garbageCollectionInterval);

    // Performance Observer の設定
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        this.performanceEntries.push(...list.getEntries());
        this.updatePerformanceMetrics();
      });

      observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
    }

    console.log('🚀 TDからのメッセージ: パフォーマンス監視を開始しました');
  }

  /**
   * メモリメトリクスの更新
   */
  private updateMemoryMetrics(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    }
  }

  /**
   * パフォーマンスメトリクスの更新
   */
  private updatePerformanceMetrics(): void {
    // レンダリング時間の計算
    const paintEntries = this.performanceEntries.filter(
      entry => entry.entryType === 'paint'
    );

    if (paintEntries.length > 0) {
      this.metrics.renderTime = paintEntries[paintEntries.length - 1].startTime;
    }

    // キャッシュヒット率の計算
    this.updateCacheHitRate();
  }

  /**
   * キャッシュヒット率の更新
   */
  private updateCacheHitRate(): void {
    // 簡易的なキャッシュヒット率計算
    // 実際の実装では、キャッシュアクセス統計を記録する必要があります
  }

  /**
   * 自動最適化の実行
   */
  private performAutoOptimization(): void {
    const suggestions = this.analyzPerformance();

    suggestions.forEach(suggestion => {
      if (suggestion.severity === 'critical') {
        this.applyCriticalOptimization(suggestion);
      }
    });
  }

  /**
   * 重要な最適化の自動適用
   */
  private applyCriticalOptimization(suggestion: OptimizationSuggestion): void {
    switch (suggestion.type) {
      case 'memory':
        this.performMemoryCleanup();
        break;
      case 'cache':
        this.cleanupCache();
        break;
      default:
        console.warn(
          `🤖 TDからの警告: 自動最適化できません - ${suggestion.message}`
        );
    }
  }

  /**
   * メモリクリーンアップ
   */
  performMemoryCleanup(): void {
    // 古いパフォーマンスエントリを削除
    if (this.performanceEntries.length > 1000) {
      this.performanceEntries = this.performanceEntries.slice(-500);
    }

    // 未使用のオブジェクトの削除
    if (typeof window.gc === 'function') {
      window.gc();
    }

    console.log('🧹 TDからのメッセージ: メモリクリーンアップを実行しました');
  }

  /**
   * キャッシュクリーンアップ
   */
  cleanupCache(): void {
    const cacheSize = this.cacheStorage.size;

    if (cacheSize > this.config.cacheSize) {
      // LRU (Least Recently Used) アルゴリズムを簡易実装
      const entries = Array.from(this.cacheStorage.entries());
      const toDelete = entries.slice(0, cacheSize - this.config.cacheSize);

      toDelete.forEach(([key]) => {
        this.cacheStorage.delete(key);
      });

      console.log(
        `🧹 TDからのメッセージ: ${toDelete.length}個のキャッシュエントリを削除しました`
      );
    }
  }

  /**
   * パフォーマンス分析と最適化提案
   */
  analyzPerformance(): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    // メモリ使用量チェック
    if (this.metrics.memoryUsage > 0.8) {
      suggestions.push({
        type: 'memory',
        severity: 'critical',
        message: 'メモリ使用量が80%を超えています',
        solution:
          'メモリクリーンアップを実行し、チャンクサイズを小さくしてください',
        estimatedImprovement: 'メモリ使用量を20-30%削減',
      });
    } else if (this.metrics.memoryUsage > 0.6) {
      suggestions.push({
        type: 'memory',
        severity: 'medium',
        message: 'メモリ使用量が60%を超えています',
        solution: 'データ生成の同時実行数を減らすことを推奨します',
        estimatedImprovement: 'メモリ使用量を10-15%削減',
      });
    }

    // レンダリング時間チェック
    if (this.metrics.renderTime > 16) {
      // 60fps を下回る
      suggestions.push({
        type: 'ui',
        severity: 'high',
        message: 'レンダリング時間が16ms(60fps)を超えています',
        solution:
          '仮想スクロールやレイジーローディングの導入を検討してください',
        estimatedImprovement: 'レンダリング速度を50-70%向上',
      });
    }

    // キャッシュ効率チェック
    if (this.metrics.cacheHitRate < 0.7) {
      suggestions.push({
        type: 'cache',
        severity: 'medium',
        message: 'キャッシュヒット率が70%を下回っています',
        solution:
          'キャッシュサイズの増加やキャッシュ戦略の見直しを検討してください',
        estimatedImprovement: 'データアクセス速度を20-40%向上',
      });
    }

    // CPU使用率チェック（概算）
    const estimatedCpuUsage = this.estimateCpuUsage();
    if (estimatedCpuUsage > 0.8) {
      suggestions.push({
        type: 'cpu',
        severity: 'high',
        message: 'CPU使用率が高すぎます',
        solution: 'バッチ処理の同時実行数を減らし、処理間隔を増やしてください',
        estimatedImprovement: 'CPU負荷を30-50%削減',
      });
    }

    this.optimizationHistory.push(...suggestions);
    return suggestions;
  }

  /**
   * CPU使用率の概算
   */
  private estimateCpuUsage(): number {
    // 簡易的なCPU使用率推定
    // 実際の実装では、処理時間やフレーム率から推定
    const recentEntries = this.performanceEntries.slice(-10);
    const totalTime = recentEntries.reduce(
      (sum, entry) => sum + entry.duration,
      0
    );

    return Math.min(totalTime / 1000, 1); // 最大1.0
  }

  /**
   * データ生成の最適化
   */
  optimizeDataGeneration(
    rowCount: number,
    columnCount: number
  ): {
    chunkSize: number;
    maxConcurrent: number;
    useWorker: boolean;
    recommendation: string;
  } {
    const dataSize = rowCount * columnCount;
    const memoryUsage = this.metrics.memoryUsage;

    let chunkSize = this.config.chunkSize;
    let maxConcurrent = this.config.maxConcurrentOperations;
    let useWorker = false;
    let recommendation = '';

    // メモリ使用量に基づく調整
    if (memoryUsage > 0.7) {
      chunkSize = Math.max(100, chunkSize / 2);
      maxConcurrent = Math.max(1, maxConcurrent - 1);
      recommendation =
        'TDからの提案: メモリ不足のため、処理サイズを縮小しました';
    }

    // データサイズに基づく調整
    if (dataSize > 100000) {
      useWorker = true;
      chunkSize = Math.min(chunkSize, 500);
      recommendation =
        'TDからの提案: 大量データのため、Web Workerでの処理を推奨します';
    }

    // CPU負荷に基づく調整
    const cpuUsage = this.estimateCpuUsage();
    if (cpuUsage > 0.6) {
      maxConcurrent = Math.max(1, maxConcurrent - 1);
      recommendation += ' CPU負荷を考慮して同時実行数を調整しました';
    }

    return {
      chunkSize,
      maxConcurrent,
      useWorker,
      recommendation,
    };
  }

  /**
   * キャッシュ管理
   */
  cache<T>(key: string, value: T, ttl?: number): void {
    this.cacheStorage.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttl || 300000, // デフォルト5分
    });
  }

  getFromCache<T>(key: string): T | null {
    const cached = this.cacheStorage.get(key);

    if (!cached) return null;

    // TTL チェック
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cacheStorage.delete(key);
      return null;
    }

    return cached.value;
  }

  /**
   * 遅延ローディング支援
   */
  createLazyLoader<T>(loadFunction: () => Promise<T>): () => Promise<T> {
    let promise: Promise<T> | null = null;
    let loaded = false;

    return () => {
      if (loaded && promise) {
        return promise;
      }

      if (!promise) {
        promise = loadFunction().then(result => {
          loaded = true;
          return result;
        });
      }

      return promise;
    };
  }

  /**
   * Web Worker での処理支援
   */
  createWorkerTask<T, R>(workerScript: string, data: T): Promise<R> {
    return new Promise((resolve, reject) => {
      if (!window.Worker) {
        reject(new Error('Web Worker がサポートされていません'));
        return;
      }

      const worker = new Worker(workerScript);

      worker.postMessage(data);

      worker.onmessage = event => {
        resolve(event.data);
        worker.terminate();
      };

      worker.onerror = error => {
        reject(error);
        worker.terminate();
      };

      // タイムアウト設定（30秒）
      setTimeout(() => {
        worker.terminate();
        reject(new Error('Worker処理がタイムアウトしました'));
      }, 30000);
    });
  }

  /**
   * メモリ使用量の監視
   */
  getMemoryInfo(): {
    used: number;
    total: number;
    percentage: number;
    formatted: string;
  } {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const used = memory.usedJSHeapSize;
      const total = memory.jsHeapSizeLimit;
      const percentage = (used / total) * 100;

      return {
        used,
        total,
        percentage,
        formatted: `${(used / 1024 / 1024).toFixed(1)}MB / ${(
          total /
          1024 /
          1024
        ).toFixed(1)}MB (${percentage.toFixed(1)}%)`,
      };
    }

    return {
      used: 0,
      total: 0,
      percentage: 0,
      formatted: 'メモリ情報取得不可',
    };
  }

  /**
   * パフォーマンススコアの計算
   */
  calculatePerformanceScore(): {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    breakdown: Record<string, number>;
  } {
    const memoryScore = Math.max(0, (1 - this.metrics.memoryUsage) * 100);
    const renderScore = Math.max(
      0,
      Math.min(100, (16 / Math.max(this.metrics.renderTime, 1)) * 100)
    );
    const cacheScore = this.metrics.cacheHitRate * 100;
    const cpuScore = Math.max(0, (1 - this.estimateCpuUsage()) * 100);

    const breakdown = {
      memory: memoryScore,
      rendering: renderScore,
      cache: cacheScore,
      cpu: cpuScore,
    };

    const score = (memoryScore + renderScore + cacheScore + cpuScore) / 4;

    let grade: 'A' | 'B' | 'C' | 'D' | 'F';
    if (score >= 90) grade = 'A';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    else if (score >= 60) grade = 'D';
    else grade = 'F';

    return { score, grade, breakdown };
  }

  /**
   * 設定の更新
   */
  updateConfig(newConfig: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ TDからのメッセージ: パフォーマンス設定を更新しました');
  }

  /**
   * メトリクスの取得
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * 最適化履歴の取得
   */
  getOptimizationHistory(): OptimizationSuggestion[] {
    return [...this.optimizationHistory];
  }

  /**
   * パフォーマンスレポートの生成
   */
  generateReport(): {
    metrics: PerformanceMetrics;
    score: ReturnType<PerformanceOptimizer['calculatePerformanceScore']>;
    suggestions: OptimizationSuggestion[];
    memoryInfo: ReturnType<PerformanceOptimizer['getMemoryInfo']>;
    timestamp: string;
  } {
    return {
      metrics: this.getMetrics(),
      score: this.calculatePerformanceScore(),
      suggestions: this.analyzPerformance(),
      memoryInfo: this.getMemoryInfo(),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 監視停止
   */
  stopMonitoring(): void {
    if (this.memoryWatcher) {
      clearInterval(this.memoryWatcher);
      this.memoryWatcher = null;
    }
    console.log('⏹️ TDからのメッセージ: パフォーマンス監視を停止しました');
  }

  /**
   * リソースのクリーンアップ
   */
  cleanup(): void {
    this.stopMonitoring();
    this.cacheStorage.clear();
    this.performanceEntries = [];
    this.optimizationHistory = [];
  }
}

/**
 * TDスタイルのパフォーマンス支援
 */
export class TDPerformanceHelper {
  /**
   * パフォーマンススコアの説明
   */
  static explainScore(score: number, grade: string): string {
    const explanations = {
      A: '🌟 TDからのメッセージ: 素晴らしいパフォーマンスです！最適化が効いています',
      B: '👍 TDからのメッセージ: 良好なパフォーマンスです。さらなる改善の余地があります',
      C: '⚠️ TDからのメッセージ: パフォーマンスに改善の余地があります',
      D: '🔧 TDからのメッセージ: パフォーマンス改善が必要です',
      F: '🚨 TDからの警告: 深刻なパフォーマンス問題があります',
    };

    return (
      explanations[grade as keyof typeof explanations] ||
      'TDからのメッセージ: パフォーマンスを確認中です'
    );
  }

  /**
   * 最適化提案の優先順位付け
   */
  static prioritizeSuggestions(
    suggestions: OptimizationSuggestion[]
  ): OptimizationSuggestion[] {
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };

    return suggestions.sort((a, b) => {
      const severityDiff =
        severityOrder[b.severity] - severityOrder[a.severity];
      if (severityDiff !== 0) return severityDiff;

      // 同じ重要度の場合は、推定改善効果で並び替え
      return b.estimatedImprovement.localeCompare(a.estimatedImprovement);
    });
  }

  /**
   * メモリ使用量の健康状態判定
   */
  static assessMemoryHealth(percentage: number): {
    status: 'excellent' | 'good' | 'warning' | 'critical';
    message: string;
    recommendation?: string;
  } {
    if (percentage < 50) {
      return {
        status: 'excellent',
        message: '🟢 TDからのメッセージ: メモリ使用量は最適です',
      };
    } else if (percentage < 70) {
      return {
        status: 'good',
        message: '🟡 TDからのメッセージ: メモリ使用量は正常範囲内です',
      };
    } else if (percentage < 85) {
      return {
        status: 'warning',
        message: '🟠 TDからの注意: メモリ使用量が高めです',
        recommendation:
          'データ生成のチャンクサイズを小さくすることを推奨します',
      };
    } else {
      return {
        status: 'critical',
        message: '🔴 TDからの警告: メモリ使用量が危険レベルです',
        recommendation:
          '直ちにメモリクリーンアップを実行し、処理を一時停止してください',
      };
    }
  }
}

// グローバルインスタンス（オプション）
export const performanceOptimizer = PerformanceOptimizer.getInstance();
