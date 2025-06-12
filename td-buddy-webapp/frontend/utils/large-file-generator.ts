// 大容量ファイル生成器 - 高速化版
// メモリ効率とパフォーマンスを両立した1GB対応ファイル生成

import { getRandomSample } from '../data/aozora-bunko-samples';

export interface FileProgress {
  current: number;
  total: number;
  percentage: number;
  speed: number; // bytes per second
  estimatedTimeLeft: number; // seconds
  phase: 'preparing' | 'generating' | 'finalizing' | 'complete';
}

export interface FileGeneratorOptions {
  progressCallback?: (progress: FileProgress) => void;
  abortSignal?: AbortSignal;
}

/**
 * 高速大容量ファイル生成器
 */
export class LargeFileGenerator {
  private static readonly CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks (高速化)
  private static readonly MEMORY_LIMIT = 50 * 1024 * 1024; // 50MB memory limit
  private static readonly BATCH_SIZE = 10; // バッチ処理サイズ

  /**
   * 大容量ファイル生成（高速版）
   */
  async generateFile(
    targetBytes: number,
    fileType: string,
    options: FileGeneratorOptions = {}
  ): Promise<Blob> {
    const { progressCallback, abortSignal } = options;
    const startTime = Date.now();
    let processedBytes = 0;

    if (progressCallback) {
      progressCallback({
        current: 0,
        total: targetBytes,
        percentage: 0,
        speed: 0,
        estimatedTimeLeft: 0,
        phase: 'preparing',
      });
    }

    try {
      // ファイル形式に応じた生成戦略を選択
      const generator = this.getGenerator(fileType);
      const chunks: Blob[] = [];

      // 高速チャンク生成
      while (processedBytes < targetBytes) {
        if (abortSignal?.aborted) {
          throw new Error('ファイル生成がキャンセルされました');
        }

        const remainingBytes = targetBytes - processedBytes;
        const chunkSize = Math.min(
          LargeFileGenerator.CHUNK_SIZE,
          remainingBytes
        );

        // バッチ処理で複数チャンクを並行生成
        const batchPromises: Promise<string>[] = [];
        const batchChunkSize = Math.floor(
          chunkSize / LargeFileGenerator.BATCH_SIZE
        );

        for (
          let i = 0;
          i < LargeFileGenerator.BATCH_SIZE && processedBytes < targetBytes;
          i++
        ) {
          const actualChunkSize = Math.min(
            batchChunkSize,
            targetBytes - processedBytes
          );
          if (actualChunkSize > 0) {
            batchPromises.push(generator.generateChunk(actualChunkSize));
            processedBytes += actualChunkSize;
          }
        }

        // 並行処理でチャンク生成
        const batchResults = await Promise.all(batchPromises);
        const combinedChunk = batchResults.join('');

        chunks.push(
          new Blob([combinedChunk], { type: this.getMimeType(fileType) })
        );

        // プログレス更新（高速化のため頻度を下げる）
        if (progressCallback && chunks.length % 2 === 0) {
          const elapsed = (Date.now() - startTime) / 1000;
          const speed = processedBytes / elapsed;
          const estimatedTimeLeft = (targetBytes - processedBytes) / speed;

          progressCallback({
            current: processedBytes,
            total: targetBytes,
            percentage: (processedBytes / targetBytes) * 100,
            speed,
            estimatedTimeLeft,
            phase: 'generating',
          });
        }

        // メモリ管理：チャンクが多すぎる場合は結合
        if (chunks.length > 20) {
          const combinedBlob = new Blob(chunks, {
            type: this.getMimeType(fileType),
          });
          chunks.length = 0;
          chunks.push(combinedBlob);
        }

        // 非ブロッキング処理（頻度を下げて高速化）
        if (chunks.length % 5 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1));
        }
      }

      if (progressCallback) {
        progressCallback({
          current: processedBytes,
          total: targetBytes,
          percentage: 100,
          speed: processedBytes / ((Date.now() - startTime) / 1000),
          estimatedTimeLeft: 0,
          phase: 'finalizing',
        });
      }

      // 最終結合
      const finalBlob = new Blob(chunks, { type: this.getMimeType(fileType) });

      if (progressCallback) {
        progressCallback({
          current: targetBytes,
          total: targetBytes,
          percentage: 100,
          speed: processedBytes / ((Date.now() - startTime) / 1000),
          estimatedTimeLeft: 0,
          phase: 'complete',
        });
      }

      return finalBlob;
    } catch (error) {
      throw new Error(
        `ファイル生成エラー: ${
          error instanceof Error ? error.message : '不明なエラー'
        }`
      );
    }
  }

  /**
   * ファイル形式別生成器を取得
   */
  private getGenerator(fileType: string): ChunkGenerator {
    switch (fileType) {
      case 'txt':
        return new TextChunkGenerator();
      case 'json':
        return new JsonChunkGenerator();
      case 'xml':
        return new XmlChunkGenerator();
      case 'csv':
        return new CsvChunkGenerator();
      default:
        return new TextChunkGenerator();
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
 * チャンク生成器の基底クラス
 */
abstract class ChunkGenerator {
  abstract generateChunk(targetBytes: number): Promise<string>;

  protected generateFastContent(targetBytes: number): string {
    // 高速コンテンツ生成（繰り返しパターン使用）
    const baseWork = getRandomSample();
    const baseContent = `【${baseWork.title}】（${baseWork.author}著）\n${baseWork.content}`;
    const baseSize = new Blob([baseContent]).size;
    const repetitions = Math.ceil(targetBytes / baseSize);

    // 効率的な文字列結合
    const chunks: string[] = [];
    for (let i = 0; i < repetitions; i++) {
      chunks.push(baseContent);
      if (chunks.join('').length >= targetBytes) break;
    }

    return chunks.join('').substring(0, targetBytes);
  }
}

/**
 * テキストチャンク生成器（高速版）
 */
class TextChunkGenerator extends ChunkGenerator {
  async generateChunk(targetBytes: number): Promise<string> {
    const content = this.generateFastContent(targetBytes);
    return `${content}\n`;
  }
}

/**
 * JSONチャンク生成器（高速版）
 */
class JsonChunkGenerator extends ChunkGenerator {
  private itemCount = 0;

  async generateChunk(targetBytes: number): Promise<string> {
    const items: any[] = [];
    let currentSize = 0;

    // 高速JSON生成
    while (currentSize < targetBytes) {
      const item = {
        id: ++this.itemCount,
        content: getRandomSample().content.substring(0, 100), // 短縮して高速化
        timestamp: new Date().toISOString(),
        size: Math.floor(Math.random() * 1000),
      };

      const itemJson = JSON.stringify(item);
      if (currentSize + itemJson.length > targetBytes) break;

      items.push(item);
      currentSize += itemJson.length + 1; // +1 for comma
    }

    return items.map(item => JSON.stringify(item)).join(',\n') + ',\n';
  }
}

/**
 * XMLチャンク生成器（高速版）
 */
class XmlChunkGenerator extends ChunkGenerator {
  private recordCount = 0;

  async generateChunk(targetBytes: number): Promise<string> {
    const records: string[] = [];
    let currentSize = 0;

    while (currentSize < targetBytes) {
      const record = `  <record id="${++this.recordCount}">
    <content>${getRandomSample().content.substring(0, 80)}</content>
    <timestamp>${new Date().toISOString()}</timestamp>
  </record>\n`;

      if (currentSize + record.length > targetBytes) break;

      records.push(record);
      currentSize += record.length;
    }

    return records.join('');
  }
}

/**
 * CSVチャンク生成器（高速版）
 */
class CsvChunkGenerator extends ChunkGenerator {
  private rowCount = 0;

  async generateChunk(targetBytes: number): Promise<string> {
    const rows: string[] = [];
    let currentSize = 0;

    while (currentSize < targetBytes) {
      const row = `${++this.rowCount},"${getRandomSample().content.substring(
        0,
        50
      )}","${new Date().toISOString()}",${Math.floor(Math.random() * 1000)}\n`;

      if (currentSize + row.length > targetBytes) break;

      rows.push(row);
      currentSize += row.length;
    }

    return rows.join('');
  }
}

/**
 * 高速ファイル生成のエントリーポイント
 */
export async function generateLargeFile(
  targetBytes: number,
  fileType: string,
  progressCallback?: (progress: FileProgress) => void,
  abortSignal?: AbortSignal
): Promise<Blob> {
  // ブラウザ安全性チェック
  if (targetBytes > 2 * 1024 * 1024 * 1024) {
    // 2GB limit
    throw new Error('ファイルサイズが大きすぎます（最大2GB）');
  }

  const generator = new LargeFileGenerator();
  return generator.generateFile(targetBytes, fileType, {
    progressCallback,
    abortSignal,
  });
}
