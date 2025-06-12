// 超高速ファイル生成器 - 5秒以内目標
// 最大速度を追求した青空文庫ベース生成器

import { AOZORA_BUNKO_SAMPLES } from '../data/aozora-bunko-samples';

export interface TurboProgress {
  current: number;
  total: number;
  percentage: number;
  speed: number;
  estimatedTimeLeft: number;
  phase: 'preparing' | 'generating' | 'finalizing' | 'complete';
}

/**
 * 超高速ファイル生成器
 * - 5秒以内を目標
 * - 25MBチャンク処理
 * - 最小限のプログレス更新
 * - Web Worker対応準備
 */
export class TurboFastGenerator {
  private static readonly TURBO_CHUNK_SIZE = 25 * 1024 * 1024; // 25MB chunks (最大速度)
  private static readonly PROGRESS_UPDATE_INTERVAL = 200 * 1024 * 1024; // 200MBごとに更新（最小限）
  private static readonly BATCH_SIZE = 50; // バッチ処理サイズ

  /**
   * 超高速醸造メイン処理
   */
  async generate(
    targetBytes: number,
    fileType: string,
    contentType: 'aozora' | 'random' | 'zero',
    selectedWorks: string[],
    progressCallback?: (progress: TurboProgress) => void,
    abortSignal?: AbortSignal
  ): Promise<Blob> {
    const startTime = Date.now();
    let processedBytes = 0;

    // 初期プログレス（最小限）
    progressCallback?.({
      current: 0,
      total: targetBytes,
      percentage: 0,
      speed: 0,
      estimatedTimeLeft: 0,
      phase: 'preparing',
    });

    try {
      // 超高速パターン生成
      const basePattern = this.generateOptimizedPattern(
        fileType,
        contentType,
        selectedWorks
      );
      const patternBytes = new TextEncoder().encode(basePattern).length;

      // バッチ処理用配列
      const chunks: string[] = [];
      let batchCount = 0;

      // 超高速醸造ループ
      while (processedBytes < targetBytes) {
        if (abortSignal?.aborted) {
          throw new Error('生成がキャンセルされました');
        }

        const remainingBytes = targetBytes - processedBytes;
        const chunkSize = Math.min(
          TurboFastGenerator.TURBO_CHUNK_SIZE,
          remainingBytes
        );

        // 超高速文字列生成（最適化済み）
        const repetitions = Math.ceil(chunkSize / patternBytes);
        const chunkContent = this.generateTurboChunk(
          basePattern,
          repetitions,
          chunkSize
        );

        chunks.push(chunkContent);
        processedBytes += chunkContent.length;
        batchCount++;

        // 最小限のプログレス更新
        if (
          processedBytes % TurboFastGenerator.PROGRESS_UPDATE_INTERVAL <
            chunkSize ||
          processedBytes >= targetBytes
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

        // 超高速バッチ処理（非同期処理を最小限に）
        if (batchCount >= TurboFastGenerator.BATCH_SIZE) {
          await new Promise(resolve => setTimeout(resolve, 0));
          batchCount = 0;
        }
      }

      // 最終化フェーズ（最小限）
      progressCallback?.({
        current: processedBytes,
        total: targetBytes,
        percentage: 100,
        speed: processedBytes / ((Date.now() - startTime) / 1000),
        estimatedTimeLeft: 0,
        phase: 'finalizing',
      });

      // 超高速Blob作成
      const finalContent = this.formatContentTurbo(chunks, fileType);
      const blob = new Blob([finalContent], {
        type: this.getMimeType(fileType),
      });

      // 完了
      const totalTime = (Date.now() - startTime) / 1000;
      progressCallback?.({
        current: targetBytes,
        total: targetBytes,
        percentage: 100,
        speed: processedBytes / totalTime,
        estimatedTimeLeft: 0,
        phase: 'complete',
      });

      console.log(
        `🚀 超高速醸造完了: ${formatBytes(targetBytes)} in ${totalTime.toFixed(
          2
        )}秒`
      );
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
   * 最適化されたパターン生成
   */
  private generateOptimizedPattern(
    fileType: string,
    contentType: 'aozora' | 'random' | 'zero',
    selectedWorks: string[]
  ): string {
    switch (contentType) {
      case 'aozora':
        return this.getOptimizedAozoraPattern(fileType, selectedWorks);
      case 'random':
        return this.getOptimizedRandomPattern(fileType);
      case 'zero':
        return this.getOptimizedZeroPattern(fileType);
      default:
        return this.getOptimizedAozoraPattern(fileType, selectedWorks);
    }
  }

  /**
   * 最適化された青空文庫パターン
   */
  private getOptimizedAozoraPattern(
    fileType: string,
    selectedWorks: string[]
  ): string {
    // 事前計算済みの高速パターン
    const works =
      selectedWorks.length > 0
        ? AOZORA_BUNKO_SAMPLES.filter(work => selectedWorks.includes(work.id))
        : AOZORA_BUNKO_SAMPLES;

    const work = works[Math.floor(Math.random() * works.length)];
    const content = work.content.substring(0, 200); // 200文字に制限（高速化）

    // 形式別最適化パターン
    const patterns = {
      txt: `${work.title}\n${content}\n\n`,
      json: `{"id":${Math.floor(Math.random() * 1000)},"title":"${
        work.title
      }","content":"${content.substring(0, 100)}"},\n`,
      xml: `<work><title>${work.title}</title><content>${content.substring(
        0,
        100
      )}</content></work>\n`,
      csv: `${Math.floor(Math.random() * 1000)},"${work.title}","${content
        .substring(0, 50)
        .replace(/"/g, '')}"\n`,
    };

    return patterns[fileType as keyof typeof patterns] || patterns.txt;
  }

  /**
   * 最適化されたランダムパターン
   */
  private getOptimizedRandomPattern(fileType: string): string {
    const randomStr = Math.random().toString(36).substring(2, 12);

    const patterns = {
      txt: `${randomStr}\n`,
      json: `{"id":${Math.floor(
        Math.random() * 1000
      )},"data":"${randomStr}"},\n`,
      xml: `<record><data>${randomStr}</data></record>\n`,
      csv: `${Math.floor(Math.random() * 1000)},"${randomStr}"\n`,
    };

    return patterns[fileType as keyof typeof patterns] || patterns.txt;
  }

  /**
   * 最適化されたゼロパターン
   */
  private getOptimizedZeroPattern(fileType: string): string {
    const patterns = {
      txt: '0'.repeat(64) + '\n',
      json: '{"id":0,"data":"0000000000"},\n',
      xml: '<record><data>0000000000</data></record>\n',
      csv: '0,"0000000000"\n',
    };

    return patterns[fileType as keyof typeof patterns] || patterns.txt;
  }

  /**
   * 超高速チャンク生成
   */
  private generateTurboChunk(
    pattern: string,
    repetitions: number,
    targetSize: number
  ): string {
    // 最適化された文字列生成
    if (repetitions <= 1000) {
      // 小さい場合は直接生成
      return Array(repetitions).fill(pattern).join('').substring(0, targetSize);
    } else {
      // 大きい場合は段階的生成
      const baseChunk = Array(1000).fill(pattern).join('');
      const baseRepetitions = Math.floor(repetitions / 1000);
      const remainder = repetitions % 1000;

      let result = Array(baseRepetitions).fill(baseChunk).join('');
      if (remainder > 0) {
        result += Array(remainder).fill(pattern).join('');
      }

      return result.substring(0, targetSize);
    }
  }

  /**
   * 超高速コンテンツフォーマット
   */
  private formatContentTurbo(chunks: string[], fileType: string): string {
    const content = chunks.join('');

    switch (fileType) {
      case 'json':
        return `[${content.replace(/,\n$/, '')}]`;
      case 'xml':
        return `<?xml version="1.0" encoding="UTF-8"?><root>${content}</root>`;
      case 'csv':
        return `id,title,content\n${content}`;
      default:
        return content;
    }
  }

  /**
   * MIMEタイプ取得
   */
  private getMimeType(fileType: string): string {
    const types: Record<string, string> = {
      txt: 'text/plain; charset=utf-8',
      json: 'application/json; charset=utf-8',
      xml: 'application/xml; charset=utf-8',
      csv: 'text/csv; charset=utf-8',
    };
    return types[fileType] || 'text/plain; charset=utf-8';
  }
}

/**
 * 超高速醸造エントリーポイント
 */
export async function generateTurboFast(
  targetBytes: number,
  fileType: string,
  contentType: 'aozora' | 'random' | 'zero',
  selectedWorks: string[],
  progressCallback?: (progress: TurboProgress) => void,
  abortSignal?: AbortSignal
): Promise<Blob> {
  // サイズ制限チェック
  if (targetBytes > 2 * 1024 * 1024 * 1024) {
    throw new Error('ファイルサイズが大きすぎます（最大2GB）');
  }

  const generator = new TurboFastGenerator();
  return generator.generate(
    targetBytes,
    fileType,
    contentType,
    selectedWorks,
    progressCallback,
    abortSignal
  );
}

/**
 * バイト数フォーマット関数
 */
function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}
