/**
 * CSV バッチ処理機能
 * QA Workbench (TD) - Batch Processing System
 */

import { CsvConfig } from '../types/csvDataTypes';
import { generateData } from './csvDataGenerator';
import { PerformanceMonitor } from './csvErrorHandling';

export interface BatchJob {
  id: string;
  name: string;
  config: CsvConfig;
  count: number;
  priority: number;
  status: BatchJobStatus;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  progress: number;
  result?: BatchJobResult;
  error?: string;
}

export type BatchJobStatus = 
  | 'pending' 
  | 'running' 
  | 'completed' 
  | 'failed' 
  | 'cancelled';

export interface BatchJobResult {
  fileName: string;
  filePath: string;
  rowCount: number;
  fileSize: number;
  duration: number;
  downloadUrl?: string;
}

export interface BatchProcessingOptions {
  maxConcurrent: number;
  delayBetweenJobs: number;
  chunkSize: number;
  outputDirectory?: string;
}

export interface BatchProcessingStatus {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  runningJobs: number;
  pendingJobs: number;
  overallProgress: number;
  estimatedTimeRemaining: number;
}

/**
 * CSV バッチ処理管理クラス
 */
export class CSVBatchProcessor {
  private static instance: CSVBatchProcessor | null = null;
  private jobs: Map<string, BatchJob> = new Map();
  private isProcessing = false;
  private processingQueue: string[] = [];
  private options: BatchProcessingOptions;

  private constructor() {
    this.options = {
      maxConcurrent: 3,
      delayBetweenJobs: 1000,
      chunkSize: 10000
    };
  }

  /**
   * シングルトンインスタンスの取得
   */
  static getInstance(): CSVBatchProcessor {
    if (!this.instance) {
      this.instance = new CSVBatchProcessor();
    }
    return this.instance;
  }

  /**
   * バッチ処理オプションの設定
   */
  setOptions(options: Partial<BatchProcessingOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * 新しいバッチジョブを追加
   */
  addJob(
    name: string, 
    config: CsvConfig, 
    count: number, 
    priority: number = 0
  ): string {
    const jobId = this.generateJobId();
    const job: BatchJob = {
      id: jobId,
      name,
      config,
      count,
      priority,
      status: 'pending',
      createdAt: new Date().toISOString(),
      progress: 0
    };

    this.jobs.set(jobId, job);
    this.queueJob(jobId);

    console.log(`🍺 ブリューからのメッセージ: バッチジョブ「${name}」を追加しました`);

    // 自動実行が停止している場合は開始
    if (!this.isProcessing) {
      this.startProcessing();
    }

    return jobId;
  }

  /**
   * 複数のジョブを一括追加
   */
  addMultipleJobs(jobs: Array<{
    name: string;
    config: CsvConfig;
    count: number;
    priority?: number;
  }>): string[] {
    const jobIds: string[] = [];

    jobs.forEach(jobData => {
      const jobId = this.addJob(
        jobData.name,
        jobData.config,
        jobData.count,
        jobData.priority || 0
      );
      jobIds.push(jobId);
    });

    console.log(`🍺 ブリューからのメッセージ: ${jobs.length}個のバッチジョブを追加しました`);
    return jobIds;
  }

  /**
   * ジョブをキューに追加
   */
  private queueJob(jobId: string): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    // 優先度順で挿入位置を決定
    let insertIndex = this.processingQueue.length;
    for (let i = 0; i < this.processingQueue.length; i++) {
      const queuedJob = this.jobs.get(this.processingQueue[i]);
      if (queuedJob && job.priority > queuedJob.priority) {
        insertIndex = i;
        break;
      }
    }

    this.processingQueue.splice(insertIndex, 0, jobId);
  }

  /**
   * バッチ処理を開始
   */
  async startProcessing(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;
    console.log('🚀 ブリューからのメッセージ: バッチ処理を開始します');

    while (this.processingQueue.length > 0) {
      const runningJobs: string[] = [];

      // 同時実行数まで並行処理
      while (
        runningJobs.length < this.options.maxConcurrent && 
        this.processingQueue.length > 0
      ) {
        const jobId = this.processingQueue.shift()!;
        runningJobs.push(jobId);
        this.processJob(jobId);
      }

      // すべてのジョブが完了するまで待機
      if (runningJobs.length > 0) {
        await this.waitForJobs(runningJobs);
        
        // ジョブ間の遅延
        if (this.processingQueue.length > 0) {
          await this.delay(this.options.delayBetweenJobs);
        }
      }
    }

    this.isProcessing = false;
    console.log('✅ ブリューからのメッセージ: すべてのバッチ処理が完了しました');
  }

  /**
   * 単一ジョブの処理
   */
  private async processJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    try {
      // ジョブ開始
      job.status = 'running';
      job.startedAt = new Date().toISOString();
      job.progress = 0;

      console.log(`🔄 ブリューからのメッセージ: 「${job.name}」の処理を開始します`);

      // パフォーマンス監視開始
      PerformanceMonitor.startGeneration();

      // CSV データ生成
      const csvData = await this.generateCSVData(job);

      // ファイル保存
      const result = await this.saveCSVFile(job, csvData);

      // パフォーマンス監視終了
      const performance = PerformanceMonitor.endGeneration(
        job.count, 
        job.config.columns.length
      );

      // ジョブ完了
      job.status = 'completed';
      job.completedAt = new Date().toISOString();
      job.progress = 100;
      job.result = {
        ...result,
        duration: performance.duration
      };

      console.log(`✅ ブリューからのメッセージ: 「${job.name}」が完了しました (${performance.duration}ms)`);

    } catch (error) {
      // ジョブ失敗
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : '不明なエラー';
      job.progress = 0;

      console.error(`❌ ブリューからのエラー: 「${job.name}」が失敗しました:`, job.error);
    }
  }

  /**
   * CSV データ生成（チャンク処理対応）
   */
  private async generateCSVData(job: BatchJob): Promise<string> {
    const { config, count } = job;
    const headers = config.columns.map(col => col.name);
    const rows: string[] = [this.formatCSVRow(headers)];

    const chunkSize = Math.min(this.options.chunkSize, count);
    const totalChunks = Math.ceil(count / chunkSize);

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const chunkStart = chunkIndex * chunkSize;
      const chunkEnd = Math.min(chunkStart + chunkSize, count);
      const chunkRowCount = chunkEnd - chunkStart;

      // チャンク内のデータ生成
      for (let i = 0; i < chunkRowCount; i++) {
        const row = config.columns.map(col => 
          String(generateData(col.dataType, col.settings || {}))
        );
        rows.push(this.formatCSVRow(row));
      }

      // 進捗更新
      job.progress = Math.round(((chunkIndex + 1) / totalChunks) * 100);

      // UI更新のための少し待機
      if (chunkIndex < totalChunks - 1) {
        await this.delay(10);
      }
    }

    return rows.join('\n');
  }

  /**
   * CSV行のフォーマット（エスケープ処理）
   */
  private formatCSVRow(row: string[]): string {
    return row.map(cell => {
      const escaped = String(cell).replace(/"/g, '""');
      return escaped.includes(',') || escaped.includes('"') || escaped.includes('\n')
        ? `"${escaped}"`
        : escaped;
    }).join(',');
  }

  /**
   * CSV ファイル保存
   */
  private async saveCSVFile(job: BatchJob, csvData: string): Promise<BatchJobResult> {
    const fileName = `${job.name}_${new Date().toISOString().split('T')[0]}.csv`;
    
    // UTF-8 BOM付きでエンコード
    const bom = '\uFEFF';
    const content = bom + csvData;
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
    
    // ダウンロードURL生成
    const downloadUrl = URL.createObjectURL(blob);

    return {
      fileName,
      filePath: downloadUrl,
      rowCount: job.count,
      fileSize: blob.size,
      duration: 0, // 後で設定される
      downloadUrl
    };
  }

  /**
   * ジョブの完了を待機
   */
  private async waitForJobs(jobIds: string[]): Promise<void> {
    return new Promise(resolve => {
      const checkInterval = setInterval(() => {
        const allCompleted = jobIds.every(jobId => {
          const job = this.jobs.get(jobId);
          return job && (job.status === 'completed' || job.status === 'failed');
        });

        if (allCompleted) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }

  /**
   * 遅延処理
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * ジョブの取得
   */
  getJob(jobId: string): BatchJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * すべてのジョブを取得
   */
  getAllJobs(): BatchJob[] {
    return Array.from(this.jobs.values());
  }

  /**
   * ジョブのキャンセル
   */
  cancelJob(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job || job.status === 'completed' || job.status === 'failed') {
      return false;
    }

    job.status = 'cancelled';
    job.progress = 0;

    // キューから削除
    const queueIndex = this.processingQueue.indexOf(jobId);
    if (queueIndex !== -1) {
      this.processingQueue.splice(queueIndex, 1);
    }

    console.log(`⏹️ ブリューからのメッセージ: 「${job.name}」をキャンセルしました`);
    return true;
  }

  /**
   * すべてのジョブをキャンセル
   */
  cancelAllJobs(): number {
    const cancelledCount = this.getAllJobs().filter(job => 
      this.cancelJob(job.id)
    ).length;

    this.processingQueue = [];
    this.isProcessing = false;

    console.log(`⏹️ ブリューからのメッセージ: ${cancelledCount}個のジョブをキャンセルしました`);
    return cancelledCount;
  }

  /**
   * 完了したジョブをクリア
   */
  clearCompletedJobs(): number {
    const completedJobs = this.getAllJobs().filter(job => 
      job.status === 'completed' || job.status === 'failed'
    );

    completedJobs.forEach(job => {
      // ダウンロードURLを削除
      if (job.result?.downloadUrl) {
        URL.revokeObjectURL(job.result.downloadUrl);
      }
      this.jobs.delete(job.id);
    });

    console.log(`🧹 ブリューからのメッセージ: ${completedJobs.length}個の完了ジョブをクリアしました`);
    return completedJobs.length;
  }

  /**
   * バッチ処理状況の取得
   */
  getProcessingStatus(): BatchProcessingStatus {
    const allJobs = this.getAllJobs();
    const totalJobs = allJobs.length;
    const completedJobs = allJobs.filter(j => j.status === 'completed').length;
    const failedJobs = allJobs.filter(j => j.status === 'failed').length;
    const runningJobs = allJobs.filter(j => j.status === 'running').length;
    const pendingJobs = allJobs.filter(j => j.status === 'pending').length;

    const overallProgress = totalJobs > 0 
      ? Math.round((completedJobs / totalJobs) * 100)
      : 0;

    // 残り時間の概算計算
    const estimatedTimeRemaining = this.calculateEstimatedTime(allJobs);

    return {
      totalJobs,
      completedJobs,
      failedJobs,
      runningJobs,
      pendingJobs,
      overallProgress,
      estimatedTimeRemaining
    };
  }

  /**
   * 残り時間の概算計算
   */
  private calculateEstimatedTime(jobs: BatchJob[]): number {
    const completedJobs = jobs.filter(j => 
      j.status === 'completed' && j.startedAt && j.completedAt
    );

    if (completedJobs.length === 0) return 0;

    // 平均処理時間を計算
    const avgDuration = completedJobs.reduce((sum, job) => {
      const start = new Date(job.startedAt!).getTime();
      const end = new Date(job.completedAt!).getTime();
      return sum + (end - start);
    }, 0) / completedJobs.length;

    const remainingJobs = jobs.filter(j => 
      j.status === 'pending' || j.status === 'running'
    ).length;

    return Math.round((remainingJobs * avgDuration) / this.options.maxConcurrent);
  }

  /**
   * ジョブIDの生成
   */
  private generateJobId(): string {
    return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 一括ダウンロード用のZIPファイル作成
   */
  async createBatchDownload(jobIds: string[]): Promise<Blob> {
    // 注意: 実際のZIP作成にはJSZipライブラリが必要
    // ここでは概念的な実装を示します
    
    const completedJobs = jobIds
      .map(id => this.jobs.get(id))
      .filter(job => job && job.status === 'completed' && job.result) as BatchJob[];

    if (completedJobs.length === 0) {
      throw new Error('ダウンロード可能なジョブがありません');
    }

    // 簡易実装: 複数ファイルの内容を結合
    let combinedContent = '';
    completedJobs.forEach((job, index) => {
      combinedContent += `=== ${job.name} ===\n`;
      // 実際にはjob.result.filePathからファイル内容を読み込む
      combinedContent += `# Generated ${job.count} rows\n\n`;
    });

    const blob = new Blob([combinedContent], { type: 'text/plain' });
    console.log(`📦 ブリューからのメッセージ: ${completedJobs.length}個のファイルを結合しました`);
    
    return blob;
  }
}

/**
 * TDスタイルのバッチ処理支援
 */
export class TDBatchHelper {
  /**
   * バッチ処理状況の要約メッセージ
   */
  static summarizeStatus(status: BatchProcessingStatus): string {
    let message = `📊 ブリューからのバッチ処理状況:\n\n`;
    message += `- 総ジョブ数: ${status.totalJobs}個\n`;
    message += `- 完了: ${status.completedJobs}個\n`;
    message += `- 実行中: ${status.runningJobs}個\n`;
    message += `- 待機中: ${status.pendingJobs}個\n`;
    
    if (status.failedJobs > 0) {
      message += `- 失敗: ${status.failedJobs}個\n`;
    }

    message += `\n進捗: ${status.overallProgress}%`;

    if (status.estimatedTimeRemaining > 0) {
      const minutes = Math.ceil(status.estimatedTimeRemaining / 60000);
      message += `\n⏱️ 残り時間: 約${minutes}分`;
    }

    if (status.overallProgress === 100) {
      message += `\n\n🎉 ブリューからのメッセージ: すべてのバッチ処理が完了しました！`;
    } else if (status.runningJobs > 0) {
      message += `\n\n🍺 ブリューからのメッセージ: 現在処理中です。しばらくお待ちください♪`;
    }

    return message;
  }

  /**
   * バッチジョブの推奨設定提案
   */
  static suggestOptimalSettings(totalRows: number, columnCount: number): {
    chunkSize: number;
    maxConcurrent: number;
    delayBetweenJobs: number;
    recommendation: string;
  } {
    let chunkSize = 1000;
    let maxConcurrent = 2;
    let delayBetweenJobs = 500;
    let recommendation = '';

    // データサイズに基づく最適化
    const estimatedRowSize = columnCount * 20; // 平均文字数
    const totalDataSize = totalRows * estimatedRowSize;

    if (totalDataSize < 1024 * 1024) { // 1MB未満
      chunkSize = 5000;
      maxConcurrent = 4;
      delayBetweenJobs = 100;
      recommendation = 'ブリューからの提案: 小規模データです。高速処理設定を推奨します';
    } else if (totalDataSize < 10 * 1024 * 1024) { // 10MB未満
      chunkSize = 2000;
      maxConcurrent = 3;
      delayBetweenJobs = 300;
      recommendation = 'ブリューからの提案: 中規模データです。バランス重視の設定を推奨します';
    } else { // 10MB以上
      chunkSize = 1000;
      maxConcurrent = 2;
      delayBetweenJobs = 1000;
      recommendation = 'ブリューからの提案: 大規模データです。安定性重視の設定を推奨します';
    }

    return {
      chunkSize,
      maxConcurrent,
      delayBetweenJobs,
      recommendation
    };
  }

  /**
   * エラー発生時の対処法提案
   */
  static suggestErrorSolution(error: string): string {
    const solutions = {
      'メモリ不足': 'チャンクサイズを小さくして、同時実行数を減らしてください',
      'ファイルサイズ': '生成件数を分割して、複数のバッチジョブに分けてください',
      'ネットワークエラー': 'ジョブ間の遅延を増やして、再試行してください',
      'ブラウザ制限': 'ブラウザを再起動して、他のタブを閉じてください'
    };

    for (const [keyword, solution] of Object.entries(solutions)) {
      if (error.includes(keyword)) {
        return `💡 ブリューからの解決策: ${solution}`;
      }
    }

    return '💡 ブリューからの提案: サポートチームにお問い合わせください';
  }
} 