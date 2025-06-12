// 超高速ファイル生成器
// 最大限の処理速度とメモリ効率を実現

export interface UltraFastProgress {
  current: number;
  total: number;
  percentage: number;
  speed: number;
  estimatedTimeLeft: number;
  phase: 'preparing' | 'generating' | 'finalizing' | 'complete';
}

/**
 * 超高速ファイル生成器
 * - 大きなチャンクサイズ（10MB）
 * - 最小限のオーバーヘッド
 * - 効率的な文字列操作
 */
export class UltraFastGenerator {
  private static readonly MEGA_CHUNK_SIZE = 10 * 1024 * 1024; // 10MB chunks
  private static readonly PROGRESS_UPDATE_INTERVAL = 50 * 1024 * 1024; // 50MBごとに更新

  /**
   * 超高速ファイル生成
   */
  async generate(
    targetBytes: number,
    fileType: string,
    progressCallback?: (progress: UltraFastProgress) => void,
    abortSignal?: AbortSignal
  ): Promise<Blob> {
    const startTime = Date.now();
    let processedBytes = 0;

    // 初期プログレス
    progressCallback?.({
      current: 0,
      total: targetBytes,
      percentage: 0,
      speed: 0,
      estimatedTimeLeft: 0,
      phase: 'preparing',
    });

    try {
      const chunks: string[] = [];
      const basePattern = this.getBasePattern(fileType);
      const patternSize = new Blob([basePattern]).size;

      // 超高速醸造ループ
      while (processedBytes < targetBytes) {
        if (abortSignal?.aborted) {
          throw new Error('生成がキャンセルされました');
        }

        const remainingBytes = targetBytes - processedBytes;
        const chunkSize = Math.min(
          UltraFastGenerator.MEGA_CHUNK_SIZE,
          remainingBytes
        );

        // パターン繰り返し回数を計算
        const repetitions = Math.ceil(chunkSize / patternSize);

        // 高速文字列生成（Array.join使用）
        const chunkContent = Array(repetitions)
          .fill(basePattern)
          .join('')
          .substring(0, chunkSize);
        chunks.push(chunkContent);

        processedBytes += chunkContent.length;

        // プログレス更新（頻度を大幅に削減）
        if (
          processedBytes % UltraFastGenerator.PROGRESS_UPDATE_INTERVAL <
          chunkSize
        ) {
          const elapsed = (Date.now() - startTime) / 1000;
          const speed = processedBytes / elapsed;

          progressCallback?.({
            current: processedBytes,
            total: targetBytes,
            percentage: (processedBytes / targetBytes) * 100,
            speed,
            estimatedTimeLeft: (targetBytes - processedBytes) / speed,
            phase: 'generating',
          });
        }

        // 非同期処理を最小限に（大幅な高速化）
        if (chunks.length % 50 === 0) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }

      // 最終化フェーズ
      progressCallback?.({
        current: processedBytes,
        total: targetBytes,
        percentage: 100,
        speed: processedBytes / ((Date.now() - startTime) / 1000),
        estimatedTimeLeft: 0,
        phase: 'finalizing',
      });

      // 最終Blob作成
      const finalContent = chunks.join('');
      const blob = new Blob([finalContent], {
        type: this.getMimeType(fileType),
      });

      // 完了
      progressCallback?.({
        current: targetBytes,
        total: targetBytes,
        percentage: 100,
        speed: processedBytes / ((Date.now() - startTime) / 1000),
        estimatedTimeLeft: 0,
        phase: 'complete',
      });

      return blob;
    } catch (error) {
      throw new Error(
        `超高速醸造エラー: ${
          error instanceof Error ? error.message : '不明なエラー'
        }`
      );
    }
  }

  /**
   * ファイル形式別の基本パターンを取得
   */
  private getBasePattern(fileType: string): string {
    switch (fileType) {
      case 'txt':
        return 'QA Workbench (TD) は QA エンジニアの最高の相棒です。効率的なテストデータ醸造で品質向上をサポートします。\n';

      case 'json':
        return '{"id":1,"name":"TestData","content":"Brew Assistant generated data","timestamp":"2024-01-01T00:00:00Z","active":true},\n';

      case 'xml':
        return '<record><id>1</id><name>TestData</name><content>Brew Assistant generated data</content><timestamp>2024-01-01T00:00:00Z</timestamp></record>\n';

      case 'csv':
        return '1,"TestData","Brew Assistant generated data","2024-01-01T00:00:00Z",true\n';

      default:
        return 'Brew Assistant - 超高速テストデータ醸造中...\n';
    }
  }

  /**
   * MIMEタイプを取得
   */
  private getMimeType(fileType: string): string {
    const mimeTypes: Record<string, string> = {
      txt: 'text/plain',
      json: 'application/json',
      xml: 'application/xml',
      csv: 'text/csv',
    };
    return mimeTypes[fileType] || 'text/plain';
  }
}

/**
 * 超高速醸造のエントリーポイント
 */
export async function generateUltraFast(
  targetBytes: number,
  fileType: string,
  progressCallback?: (progress: UltraFastProgress) => void,
  abortSignal?: AbortSignal
): Promise<Blob> {
  // サイズ制限チェック
  if (targetBytes > 2 * 1024 * 1024 * 1024) {
    throw new Error('ファイルサイズが大きすぎます（最大2GB）');
  }

  const generator = new UltraFastGenerator();
  return generator.generate(
    targetBytes,
    fileType,
    progressCallback,
    abortSignal
  );
}
