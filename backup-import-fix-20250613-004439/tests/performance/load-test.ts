import { performance } from 'perf_hooks';
import { DatabaseService } from '../../database/database';
import { PasswordService } from '../../services/passwordService';

interface PerformanceResults {
  testName: string;
  iterations: number;
  totalTime: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  requestsPerSecond: number;
  memoryUsage: {
    before: NodeJS.MemoryUsage;
    after: NodeJS.MemoryUsage;
    delta: number;
  };
}

export class PerformanceTestRunner {
  private db: DatabaseService;
  private passwordService: PasswordService;

  constructor() {
    this.db = new DatabaseService();
    this.passwordService = new PasswordService();
  }

  async initialize(): Promise<void> {
    await this.db.connect();
    await this.db.initialize();
    logger.log('🚀 パフォーマンステスト環境初期化完了');
  }

  async cleanup(): Promise<void> {
    await this.db.disconnect();
    logger.log('🧹 パフォーマンステスト環境クリーンアップ完了');
  }

  async runPasswordGenerationTest(
    testName: string,
    iterations: number,
    passwordLength: number,
    count: number
  ): Promise<PerformanceResults> {
    logger.log(`📊 ${testName} 開始 (${iterations}回の反復)`);
    
    const times: number[] = [];
    const memoryBefore = process.memoryUsage();
    
    const startTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      const iterationStart = performance.now();
      
      await this.passwordService.generatePasswords({
        length: passwordLength,
        count: count,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
        excludeAmbiguous: false
      });
      
      const iterationEnd = performance.now();
      times.push(iterationEnd - iterationStart);
      
      // 進捗表示
      if ((i + 1) % Math.max(1, Math.floor(iterations / 10)) === 0) {
        logger.log(`  ⚡ 進捗: ${i + 1}/${iterations} (${Math.round((i + 1) / iterations * 100)}%)`);
      }
    }
    
    const endTime = performance.now();
    const memoryAfter = process.memoryUsage();
    
    const totalTime = endTime - startTime;
    const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const requestsPerSecond = (iterations * 1000) / totalTime;
    
    const results: PerformanceResults = {
      testName,
      iterations,
      totalTime,
      averageTime,
      minTime,
      maxTime,
      requestsPerSecond,
      memoryUsage: {
        before: memoryBefore,
        after: memoryAfter,
        delta: memoryAfter.heapUsed - memoryBefore.heapUsed
      }
    };
    
    this.printResults(results);
    return results;
  }

  private printResults(results: PerformanceResults): void {
    logger.log(`\n📈 ${results.testName} - 結果`);
    logger.log(`   反復回数: ${results.iterations}`);
    logger.log(`   総実行時間: ${results.totalTime.toFixed(2)}ms`);
    logger.log(`   平均時間: ${results.averageTime.toFixed(2)}ms`);
    logger.log(`   最小時間: ${results.minTime.toFixed(2)}ms`);
    logger.log(`   最大時間: ${results.maxTime.toFixed(2)}ms`);
    logger.log(`   RPS: ${results.requestsPerSecond.toFixed(2)} req/sec`);
    logger.log(`   メモリ使用量変化: ${(results.memoryUsage.delta / 1024 / 1024).toFixed(2)}MB`);
    logger.log('');
  }

  async runAllTests(): Promise<PerformanceResults[]> {
    const results: PerformanceResults[] = [];
    
    logger.log('🎯 パフォーマンステスト開始\n');
    
    // テスト1: 基本パフォーマンス
    results.push(await this.runPasswordGenerationTest(
      '基本パスワード生成 (12文字 × 1個)',
      1000,
      12,
      1
    ));
    
    // テスト2: 大量生成
    results.push(await this.runPasswordGenerationTest(
      '大量パスワード生成 (16文字 × 100個)',
      100,
      16,
      100
    ));
    
    // テスト3: 長いパスワード
    results.push(await this.runPasswordGenerationTest(
      '長いパスワード生成 (64文字 × 10個)',
      200,
      64,
      10
    ));
    
    // テスト4: 極限テスト
    results.push(await this.runPasswordGenerationTest(
      '極限パスワード生成 (32文字 × 1000個)',
      10,
      32,
      1000
    ));
    
    // 総合結果出力
    this.printSummary(results);
    
    return results;
  }

  private printSummary(results: PerformanceResults[]): void {
    logger.log('📊 パフォーマンステスト総合結果');
    logger.log('='.repeat(60));
    
    const totalMemoryUsage = results.reduce((sum, r) => sum + r.memoryUsage.delta, 0);
    const averageRPS = results.reduce((sum, r) => sum + r.requestsPerSecond, 0) / results.length;
    
    logger.log(`総メモリ使用量変化: ${(totalMemoryUsage / 1024 / 1024).toFixed(2)}MB`);
    logger.log(`平均RPS: ${averageRPS.toFixed(2)} req/sec`);
    
    // パフォーマンス評価
    const evaluation = this.evaluatePerformance(results);
    logger.log(`\n🎯 パフォーマンス評価: ${evaluation.grade}`);
    logger.log(`評価コメント: ${evaluation.comment}`);
    
    // 改善提案
    if (evaluation.suggestions.length > 0) {
      logger.log('\n💡 改善提案:');
      evaluation.suggestions.forEach((suggestion, index) => {
        logger.log(`   ${index + 1}. ${suggestion}`);
      });
    }
  }

  private evaluatePerformance(results: PerformanceResults[]): {
    grade: string;
    comment: string;
    suggestions: string[];
  } {
    const suggestions: string[] = [];
    
    // 基本生成の平均時間をチェック
    const basicTest = results.find(r => r.testName.includes('基本'));
    const isBasicFast = basicTest && basicTest.averageTime < 10; // 10ms以下
    
    // 大量生成のRPSをチェック
    const bulkTest = results.find(r => r.testName.includes('大量'));
    const isBulkEfficient = bulkTest && bulkTest.requestsPerSecond > 5; // 5 RPS以上
    
    // メモリ使用量をチェック
    const totalMemoryUsage = results.reduce((sum, r) => sum + r.memoryUsage.delta, 0);
    const isMemoryEfficient = totalMemoryUsage < 100 * 1024 * 1024; // 100MB以下
    
    let grade = 'A';
    let comment = '優秀なパフォーマンスです！';
    
    if (!isBasicFast) {
      grade = 'B';
      comment = '基本生成の速度改善が必要です';
      suggestions.push('基本パスワード生成アルゴリズムの最適化');
    }
    
    if (!isBulkEfficient) {
      grade = grade === 'A' ? 'B' : 'C';
      comment = '大量生成の効率改善が必要です';
      suggestions.push('バッチ処理の実装');
      suggestions.push('並列処理の導入');
    }
    
    if (!isMemoryEfficient) {
      grade = grade === 'A' ? 'B' : 'C';
      comment = 'メモリ使用量の最適化が必要です';
      suggestions.push('メモリリークの調査');
      suggestions.push('オブジェクトの再利用');
    }
    
    if (grade === 'C') {
      comment = '複数の改善が必要です';
    }
    
    return { grade, comment, suggestions };
  }

  // 特定の条件でのストレステスト
  async runStressTest(duration: number = 30000): Promise<void> {
    logger.log(`🔥 ${duration / 1000}秒間のストレステスト開始`);
    
    const startTime = Date.now();
    let requestCount = 0;
    let errorCount = 0;
    const responseTimes: number[] = [];
    
    while (Date.now() - startTime < duration) {
      try {
        const requestStart = Date.now();
        
        await this.passwordService.generatePasswords({
          length: 16,
          count: 10,
          includeUppercase: true,
          includeLowercase: true,
          includeNumbers: true,
          includeSymbols: true,
          excludeAmbiguous: true
        });
        
        const requestEnd = Date.now();
        responseTimes.push(requestEnd - requestStart);
        requestCount++;
        
        // 少し間隔を空ける
        await new Promise(resolve => setTimeout(resolve, 10));
        
      } catch (error) {
        errorCount++;
        logger.error(`❌ エラー発生: ${error}`);
      }
    }
    
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const maxResponseTime = Math.max(...responseTimes);
    const minResponseTime = Math.min(...responseTimes);
    
    logger.log('\n🔥 ストレステスト結果:');
    logger.log(`   総リクエスト数: ${requestCount}`);
    logger.log(`   エラー数: ${errorCount}`);
    logger.log(`   エラー率: ${(errorCount / (requestCount + errorCount) * 100).toFixed(2)}%`);
    logger.log(`   平均レスポンス時間: ${avgResponseTime.toFixed(2)}ms`);
    logger.log(`   最大レスポンス時間: ${maxResponseTime.toFixed(2)}ms`);
    logger.log(`   最小レスポンス時間: ${minResponseTime.toFixed(2)}ms`);
    logger.log(`   スループット: ${(requestCount / (duration / 1000)).toFixed(2)} req/sec`);
  }
}

// メイン実行関数
export async function runPerformanceTests(): Promise<void> {
  const runner = new PerformanceTestRunner();
  
  try {
    await runner.initialize();
    
    // 基本パフォーマンステスト
    await runner.runAllTests();
    
    // ストレステスト
    await runner.runStressTest(30000); // 30秒
    
    logger.log('✅ 全パフォーマンステスト完了');
    
  } catch (error) {
    logger.error('❌ パフォーマンステストでエラーが発生:', error);
  } finally {
    await runner.cleanup();
  }
}

// スクリプトとして直接実行された場合
if (require.main === module) {
  runPerformanceTests().catch(console.error);
} 