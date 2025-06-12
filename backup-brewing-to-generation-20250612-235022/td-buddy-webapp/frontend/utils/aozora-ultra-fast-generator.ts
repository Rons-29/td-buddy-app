// 青空文庫ベース超高速ファイル生成器
// 名作文学を活用した実用的なファイルを超高速醸造

import { AOZORA_BUNKO_SAMPLES } from '../data/aozora-bunko-samples';

export interface AozoraProgress {
  current: number;
  total: number;
  percentage: number;
  speed: number;
  estimatedTimeLeft: number;
  phase: 'preparing' | 'generating' | 'finalizing' | 'complete';
}

/**
 * 青空文庫ベース超高速ファイル生成器
 * - 実際に読める日本語コンテンツ
 * - 超高速処理（15MB chunks）
 * - 形式別最適化
 */
export class AozoraUltraFastGenerator {
  private static readonly MEGA_CHUNK_SIZE = 15 * 1024 * 1024; // 15MB chunks (さらに高速化)
  private static readonly PROGRESS_UPDATE_INTERVAL = 75 * 1024 * 1024; // 75MBごとに更新

  /**
   * 青空文庫ベース超高速ファイル生成
   */
  async generate(
    targetBytes: number,
    fileType: string,
    contentType: 'aozora' | 'random' | 'zero',
    selectedWorks: string[],
    progressCallback?: (progress: AozoraProgress) => void,
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
      const basePattern = this.getContentPattern(
        fileType,
        contentType,
        selectedWorks
      );
      const patternSize = new Blob([basePattern]).size;

      // 超高速醸造ループ
      while (processedBytes < targetBytes) {
        if (abortSignal?.aborted) {
          throw new Error('生成がキャンセルされました');
        }

        const remainingBytes = targetBytes - processedBytes;
        const chunkSize = Math.min(
          AozoraUltraFastGenerator.MEGA_CHUNK_SIZE,
          remainingBytes
        );

        // パターン繰り返し回数を計算
        const repetitions = Math.ceil(chunkSize / patternSize);

        // 超高速文字列生成（Array.join使用）
        const chunkContent = Array(repetitions)
          .fill(basePattern)
          .join('')
          .substring(0, chunkSize);
        chunks.push(chunkContent);

        processedBytes += chunkContent.length;

        // プログレス更新（頻度を大幅に削減）
        if (
          processedBytes % AozoraUltraFastGenerator.PROGRESS_UPDATE_INTERVAL <
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
        if (chunks.length % 100 === 0) {
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

      // 最終Blob作成（形式別処理）
      const finalContent = this.formatContent(chunks.join(''), fileType);
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
        `青空文庫ベース生成エラー: ${
          error instanceof Error ? error.message : '不明なエラー'
        }`
      );
    }
  }

  /**
   * コンテンツパターンを取得
   */
  private getContentPattern(
    fileType: string,
    contentType: 'aozora' | 'random' | 'zero',
    selectedWorks: string[]
  ): string {
    switch (contentType) {
      case 'aozora':
        return this.getAozoraPattern(fileType, selectedWorks);
      case 'random':
        return this.getRandomPattern(fileType);
      case 'zero':
        return this.getZeroPattern(fileType);
      default:
        return this.getAozoraPattern(fileType, selectedWorks);
    }
  }

  /**
   * 青空文庫パターンを取得
   */
  private getAozoraPattern(fileType: string, selectedWorks: string[]): string {
    // 選択された作品を取得
    const works =
      selectedWorks.length > 0
        ? AOZORA_BUNKO_SAMPLES.filter(work => selectedWorks.includes(work.id))
        : AOZORA_BUNKO_SAMPLES;

    const randomWork = works[Math.floor(Math.random() * works.length)];
    const content = randomWork.content.substring(0, 300); // 300文字程度に制限

    switch (fileType) {
      case 'txt':
        return `${randomWork.title} - ${randomWork.author}\n\n${content}\n\n`;

      case 'json':
        return (
          JSON.stringify({
            id: Math.floor(Math.random() * 10000),
            title: randomWork.title,
            author: randomWork.author,
            content: content.substring(0, 200),
            timestamp: new Date().toISOString(),
            source: '青空文庫',
            encoding: 'UTF-8',
          }) + ',\n'
        );

      case 'xml':
        return `<work>
  <id>${Math.floor(Math.random() * 10000)}</id>
  <title>${randomWork.title}</title>
  <author>${randomWork.author}</author>
  <content>${content.substring(0, 150)}</content>
  <timestamp>${new Date().toISOString()}</timestamp>
  <source>青空文庫</source>
</work>\n`;

      case 'csv':
        return `${Math.floor(Math.random() * 10000)},"${randomWork.title}","${
          randomWork.author
        }","${content
          .substring(0, 100)
          .replace(/"/g, '""')}","${new Date().toISOString()}","青空文庫"\n`;

      default:
        return `${randomWork.title} - ${randomWork.author}\n${content}\n\n`;
    }
  }

  /**
   * ランダムパターンを取得
   */
  private getRandomPattern(fileType: string): string {
    const randomString =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    switch (fileType) {
      case 'txt':
        return `Random data: ${randomString}\n`;
      case 'json':
        return `{"id":${Math.floor(
          Math.random() * 10000
        )},"data":"${randomString}","timestamp":"${new Date().toISOString()}"},\n`;
      case 'xml':
        return `<record><id>${Math.floor(
          Math.random() * 10000
        )}</id><data>${randomString}</data><timestamp>${new Date().toISOString()}</timestamp></record>\n`;
      case 'csv':
        return `${Math.floor(
          Math.random() * 10000
        )},"${randomString}","${new Date().toISOString()}"\n`;
      default:
        return `${randomString}\n`;
    }
  }

  /**
   * ゼロパターンを取得
   */
  private getZeroPattern(fileType: string): string {
    switch (fileType) {
      case 'txt':
        return '0000000000000000000000000000000000000000000000000000000000000000\n';
      case 'json':
        return '{"id":0,"data":"0000000000","timestamp":"2024-01-01T00:00:00Z"},\n';
      case 'xml':
        return '<record><id>0</id><data>0000000000</data><timestamp>2024-01-01T00:00:00Z</timestamp></record>\n';
      case 'csv':
        return '0,"0000000000","2024-01-01T00:00:00Z"\n';
      default:
        return '0000000000000000000000000000000000000000000000000000000000000000\n';
    }
  }

  /**
   * コンテンツを形式別にフォーマット
   */
  private formatContent(content: string, fileType: string): string {
    switch (fileType) {
      case 'json':
        // JSONの場合、最後のカンマを削除してJSONとして有効にする
        const jsonContent = content.replace(/,\n$/, '');
        return `[\n${jsonContent}\n]`;

      case 'xml':
        // XMLの場合、ルート要素で囲む
        return `<?xml version="1.0" encoding="UTF-8"?>\n<aozora_collection>\n${content}</aozora_collection>`;

      case 'csv':
        // CSVの場合、ヘッダーを追加
        return `id,title,author,content,timestamp,source\n${content}`;

      default:
        return content;
    }
  }

  /**
   * MIMEタイプを取得
   */
  private getMimeType(fileType: string): string {
    const mimeTypes: Record<string, string> = {
      txt: 'text/plain; charset=utf-8',
      json: 'application/json; charset=utf-8',
      xml: 'application/xml; charset=utf-8',
      csv: 'text/csv; charset=utf-8',
    };
    return mimeTypes[fileType] || 'text/plain; charset=utf-8';
  }
}

/**
 * 青空文庫ベース超高速醸造のエントリーポイント
 */
export async function generateAozoraUltraFast(
  targetBytes: number,
  fileType: string,
  contentType: 'aozora' | 'random' | 'zero',
  selectedWorks: string[],
  progressCallback?: (progress: AozoraProgress) => void,
  abortSignal?: AbortSignal
): Promise<Blob> {
  // サイズ制限チェック
  if (targetBytes > 2 * 1024 * 1024 * 1024) {
    throw new Error('ファイルサイズが大きすぎます（最大2GB）');
  }

  const generator = new AozoraUltraFastGenerator();
  return generator.generate(
    targetBytes,
    fileType,
    contentType,
    selectedWorks,
    progressCallback,
    abortSignal
  );
}
