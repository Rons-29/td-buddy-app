// 超精密ファイル生成器
// プラスマイナス1バイトの誤差も許さない厳密実装

import { AOZORA_BUNKO_SAMPLES } from '../data/aozora-bunko-samples';

export interface UltraPreciseProgress {
  current: number;
  total: number;
  percentage: number;
  speed: number;
  estimatedTimeLeft: number;
  phase: 'preparing' | 'generating' | 'finalizing' | 'complete';
  actualBytes: number; // 実際のバイト数を追跡
}

/**
 * 超精密ファイル生成器
 * - プラスマイナス1バイトの誤差も許さない
 * - バイト単位での厳密制御
 * - 1MB = 1024KB の正確な計算
 */
export class UltraPreciseGenerator {
  private static readonly CHUNK_SIZE = 1024 * 1024; // 1MBチャンク（精密制御）
  private static readonly PROGRESS_UPDATE_INTERVAL = 10 * 1024 * 1024; // 10MBごと

  /**
   * 超精密生成（誤差0バイト保証）
   */
  async generate(
    targetBytes: number,
    fileType: string,
    contentType: 'aozora' | 'random' | 'zero',
    selectedWorks: string[],
    progressCallback?: (progress: UltraPreciseProgress) => void,
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
      actualBytes: 0,
    });

    try {
      // 基本パターンを生成（ASCII安全）
      const basePattern = this.generateBasePattern(
        fileType,
        contentType,
        selectedWorks
      );
      const patternBytes = this.getExactByteLength(basePattern);

      console.log(`🎯 基本パターン: ${patternBytes}バイト`);
      console.log(`🎯 目標サイズ: ${targetBytes}バイト`);

      // 厳密なバイト配列を構築
      const result = new Uint8Array(targetBytes);
      let currentOffset = 0;

      // パターンを厳密に配置
      while (currentOffset < targetBytes) {
        if (abortSignal?.aborted) {
          throw new Error('生成がキャンセルされました');
        }

        const remainingBytes = targetBytes - currentOffset;
        const chunkSize = Math.min(
          UltraPreciseGenerator.CHUNK_SIZE,
          remainingBytes
        );

        // 厳密チャンク生成
        const chunkData = this.generateExactChunk(
          basePattern,
          patternBytes,
          chunkSize
        );

        // バイト配列に厳密にコピー
        const copyLength = Math.min(chunkData.length, remainingBytes);
        result.set(chunkData.subarray(0, copyLength), currentOffset);
        currentOffset += copyLength;

        // プログレス更新
        if (
          currentOffset % UltraPreciseGenerator.PROGRESS_UPDATE_INTERVAL <
            chunkSize ||
          currentOffset >= targetBytes
        ) {
          const elapsed = (Date.now() - startTime) / 1000;
          const speed = currentOffset / elapsed;

          progressCallback?.({
            current: currentOffset,
            total: targetBytes,
            percentage: (currentOffset / targetBytes) * 100,
            speed,
            estimatedTimeLeft: (targetBytes - currentOffset) / speed,
            phase: 'generating',
            actualBytes: currentOffset,
          });
        }

        // 非同期処理（最小限）
        if (currentOffset % (10 * UltraPreciseGenerator.CHUNK_SIZE) === 0) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }

      // 最終化フェーズ
      progressCallback?.({
        current: targetBytes,
        total: targetBytes,
        percentage: 100,
        speed: targetBytes / ((Date.now() - startTime) / 1000),
        estimatedTimeLeft: 0,
        phase: 'finalizing',
        actualBytes: targetBytes,
      });

      // 形式別の最終調整（厳密）
      const finalData = this.applyFormatSpecificAdjustments(
        result,
        fileType,
        targetBytes
      );

      // Blob作成
      const blob = new Blob([finalData], { type: this.getMimeType(fileType) });

      // 厳密サイズ検証
      const actualSize = blob.size;
      console.log(
        `🎯 厳密検証: 目標=${targetBytes}, 実際=${actualSize}, 差異=${
          actualSize - targetBytes
        }`
      );

      if (actualSize !== targetBytes) {
        throw new Error(
          `サイズ誤差検出: 目標=${targetBytes}バイト, 実際=${actualSize}バイト, 差異=${
            actualSize - targetBytes
          }バイト`
        );
      }

      // 完了
      const totalTime = (Date.now() - startTime) / 1000;
      progressCallback?.({
        current: actualSize,
        total: targetBytes,
        percentage: 100,
        speed: actualSize / totalTime,
        estimatedTimeLeft: 0,
        phase: 'complete',
        actualBytes: actualSize,
      });

      console.log(
        `✅ 超精密生成完了: ${this.formatBytes(
          targetBytes
        )} (誤差0バイト) in ${totalTime.toFixed(2)}秒`
      );

      return blob;
    } catch (error) {
      throw new Error(
        `超精密生成エラー: ${
          error instanceof Error ? error.message : '不明なエラー'
        }`
      );
    }
  }

  /**
   * 基本パターン生成（ASCII安全、厳密制御）
   */
  private generateBasePattern(
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
   * 青空文庫パターン（ASCII変換、厳密制御）
   */
  private getAozoraPattern(fileType: string, selectedWorks: string[]): string {
    const works =
      selectedWorks.length > 0
        ? AOZORA_BUNKO_SAMPLES.filter(work => selectedWorks.includes(work.id))
        : AOZORA_BUNKO_SAMPLES;

    const work = works[Math.floor(Math.random() * works.length)];

    // 日本語をASCII文字に厳密変換
    const safeTitle = this.toStrictAscii(work.title);
    const safeContent = this.toStrictAscii(work.content.substring(0, 50));

    switch (fileType) {
      case 'txt':
        return `Title: ${safeTitle}\nContent: ${safeContent}\n---\n`;
      case 'json':
        return `{"title":"${safeTitle}","content":"${safeContent}"},\n`;
      case 'xml':
        return `<work><title>${safeTitle}</title><content>${safeContent}</content></work>\n`;
      case 'csv':
        return `"${safeTitle}","${safeContent}"\n`;
      default:
        return `Title: ${safeTitle}\nContent: ${safeContent}\n---\n`;
    }
  }

  /**
   * ランダムパターン（厳密制御）
   */
  private getRandomPattern(fileType: string): string {
    const randomStr = 'TestData' + Math.random().toString(36).substring(2, 8);

    switch (fileType) {
      case 'txt':
        return `${randomStr}\n`;
      case 'json':
        return `{"data":"${randomStr}"},\n`;
      case 'xml':
        return `<data>${randomStr}</data>\n`;
      case 'csv':
        return `"${randomStr}"\n`;
      default:
        return `${randomStr}\n`;
    }
  }

  /**
   * ゼロパターン（厳密制御）
   */
  private getZeroPattern(fileType: string): string {
    switch (fileType) {
      case 'txt':
        return 'TestData000000000000000000000000\n';
      case 'json':
        return '{"data":"000000000000000000000000"},\n';
      case 'xml':
        return '<data>000000000000000000000000</data>\n';
      case 'csv':
        return '"000000000000000000000000"\n';
      default:
        return 'TestData000000000000000000000000\n';
    }
  }

  /**
   * 厳密ASCII変換
   */
  private toStrictAscii(text: string): string {
    return text
      .replace(/[あ-ん]/g, 'a') // ひらがな → a
      .replace(/[ア-ン]/g, 'A') // カタカナ → A
      .replace(/[一-龯]/g, 'K') // 漢字 → K
      .replace(/[^\x00-\x7F]/g, 'X') // その他非ASCII → X
      .replace(/\s+/g, ' ') // 連続空白を単一空白に
      .trim()
      .substring(0, 20); // 長さ制限
  }

  /**
   * 厳密チャンク生成（バイト単位制御）
   */
  private generateExactChunk(
    pattern: string,
    patternBytes: number,
    targetSize: number
  ): Uint8Array {
    if (targetSize <= 0) {
      return new Uint8Array(0);
    }

    // 結果配列を事前に確保
    const result = new Uint8Array(targetSize);
    const encoder = new TextEncoder();
    const patternArray = encoder.encode(pattern);

    let offset = 0;

    // パターンを厳密に繰り返し配置
    while (offset < targetSize) {
      const remainingBytes = targetSize - offset;
      const copyLength = Math.min(patternArray.length, remainingBytes);

      // バイト単位でコピー
      result.set(patternArray.subarray(0, copyLength), offset);
      offset += copyLength;
    }

    return result;
  }

  /**
   * 形式別最終調整（厳密サイズ保証）
   */
  private applyFormatSpecificAdjustments(
    data: Uint8Array,
    fileType: string,
    targetBytes: number
  ): Uint8Array {
    // データが既に正確なサイズの場合はそのまま返す
    if (data.length === targetBytes) {
      return data;
    }

    // サイズが異なる場合は厳密に調整
    const result = new Uint8Array(targetBytes);

    if (data.length > targetBytes) {
      // 超過分をカット
      result.set(data.subarray(0, targetBytes));
    } else {
      // 不足分を埋める
      result.set(data);
      // 残りをASCII文字で埋める
      result.fill(65, data.length); // ASCII 'A'
    }

    return result;
  }

  /**
   * 厳密バイト長取得
   */
  private getExactByteLength(str: string): number {
    return new TextEncoder().encode(str).length;
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

  /**
   * バイト数フォーマット（1024ベース）
   */
  private formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
}

/**
 * 超精密生成エントリーポイント
 */
export async function generateUltraPrecise(
  targetBytes: number,
  fileType: string,
  contentType: 'aozora' | 'random' | 'zero',
  selectedWorks: string[],
  progressCallback?: (progress: UltraPreciseProgress) => void,
  abortSignal?: AbortSignal
): Promise<Blob> {
  // サイズ制限チェック
  if (targetBytes > 2 * 1024 * 1024 * 1024) {
    throw new Error('ファイルサイズが大きすぎます（最大2GB）');
  }

  if (targetBytes < 1) {
    throw new Error('ファイルサイズは1バイト以上である必要があります');
  }

  const generator = new UltraPreciseGenerator();
  return generator.generate(
    targetBytes,
    fileType,
    contentType,
    selectedWorks,
    progressCallback,
    abortSignal
  );
}
