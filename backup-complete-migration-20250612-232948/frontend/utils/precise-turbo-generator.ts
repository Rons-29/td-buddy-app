// 精密超高速ファイル生成器
// 容量を正確に守り、最高パフォーマンスを実現

import { AOZORA_BUNKO_SAMPLES } from '../data/aozora-bunko-samples';

export interface PreciseProgress {
  current: number;
  total: number;
  percentage: number;
  speed: number;
  estimatedTimeLeft: number;
  phase: 'preparing' | 'generating' | 'finalizing' | 'complete';
}

/**
 * 精密超高速ファイル生成器
 * - 容量を1バイト単位で正確に守る
 * - 最高パフォーマンス（50MBチャンク）
 * - 1MB = 1024KB の正確な計算
 */
export class PreciseTurboGenerator {
  private static readonly MEGA_CHUNK_SIZE = 50 * 1024 * 1024; // 50MB chunks (最高速度)
  private static readonly PROGRESS_UPDATE_INTERVAL = 500 * 1024 * 1024; // 500MBごとに更新（最小限）

  /**
   * 精密超高速醸造
   */
  async generate(
    targetBytes: number,
    fileType: string,
    contentType: 'aozora' | 'random' | 'zero',
    selectedWorks: string[],
    progressCallback?: (progress: PreciseProgress) => void,
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
      // 最適化されたパターン生成
      const basePattern = this.generateOptimizedPattern(
        fileType,
        contentType,
        selectedWorks
      );
      const patternBytes = this.getByteLength(basePattern);

      const chunks: Uint8Array[] = [];

      // 超高速醸造ループ
      while (processedBytes < targetBytes) {
        if (abortSignal?.aborted) {
          throw new Error('生成がキャンセルされました');
        }

        const remainingBytes = targetBytes - processedBytes;
        const chunkSize = Math.min(
          PreciseTurboGenerator.MEGA_CHUNK_SIZE,
          remainingBytes
        );

        // 精密チャンク生成
        const chunkData = this.generatePreciseChunk(
          basePattern,
          patternBytes,
          chunkSize
        );
        chunks.push(chunkData);

        processedBytes += chunkData.length;

        // 最小限のプログレス更新
        if (
          processedBytes % PreciseTurboGenerator.PROGRESS_UPDATE_INTERVAL <
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

        // 非同期処理を最小限に
        if (chunks.length % 20 === 0) {
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

      // 精密Blob作成
      const finalData = this.combinePreciseChunks(
        chunks,
        targetBytes,
        fileType
      );
      const blob = new Blob([finalData], { type: this.getMimeType(fileType) });

      // 完了
      const totalTime = (Date.now() - startTime) / 1000;
      const actualSize = blob.size;

      progressCallback?.({
        current: actualSize,
        total: targetBytes,
        percentage: 100,
        speed: actualSize / totalTime,
        estimatedTimeLeft: 0,
        phase: 'complete',
      });

      console.log(
        `🎯 精密醸造完了: 目標=${this.formatBytes(
          targetBytes
        )}, 実際=${this.formatBytes(actualSize)}, 時間=${totalTime.toFixed(
          2
        )}秒`
      );

      // サイズ検証
      if (Math.abs(actualSize - targetBytes) > 10) {
        console.warn(`⚠️ サイズ差異: ${actualSize - targetBytes}バイト`);
      }

      return blob;
    } catch (error) {
      throw new Error(
        `精密生成エラー: ${
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
   * 青空文庫パターン（ASCII安全版）
   */
  private getAozoraPattern(fileType: string, selectedWorks: string[]): string {
    const works =
      selectedWorks.length > 0
        ? AOZORA_BUNKO_SAMPLES.filter(work => selectedWorks.includes(work.id))
        : AOZORA_BUNKO_SAMPLES;

    const work = works[Math.floor(Math.random() * works.length)];

    // 日本語をASCII文字に変換（ファイルが確実に開ける）
    const safeTitle = this.toSafeAscii(work.title);
    const safeContent = this.toSafeAscii(work.content.substring(0, 100));

    switch (fileType) {
      case 'txt':
        return `Title: ${safeTitle}\nContent: ${safeContent}\n---\n`;
      case 'json':
        return `{"title":"${safeTitle}","content":"${safeContent.substring(
          0,
          50
        )}"},\n`;
      case 'xml':
        return `<work><title>${safeTitle}</title><content>${safeContent.substring(
          0,
          50
        )}</content></work>\n`;
      case 'csv':
        return `"${safeTitle}","${safeContent.substring(0, 30)}"\n`;
      default:
        return `Title: ${safeTitle}\nContent: ${safeContent}\n---\n`;
    }
  }

  /**
   * 日本語をASCII文字に安全変換
   */
  private toSafeAscii(text: string): string {
    return text
      .replace(/[あ-ん]/g, 'a') // ひらがな → a
      .replace(/[ア-ン]/g, 'A') // カタカナ → A
      .replace(/[一-龯]/g, 'K') // 漢字 → K
      .replace(/[^\x00-\x7F]/g, 'X') // その他非ASCII → X
      .replace(/\s+/g, ' ') // 連続空白を単一空白に
      .trim();
  }

  /**
   * ランダムパターン（最適化済み）
   */
  private getRandomPattern(fileType: string): string {
    const randomStr = Math.random().toString(36).substring(2, 8);

    switch (fileType) {
      case 'txt':
        return `${randomStr}\n`;
      case 'json':
        return `{"data":"${randomStr}"},`;
      case 'xml':
        return `<data>${randomStr}</data>`;
      case 'csv':
        return `"${randomStr}"\n`;
      default:
        return `${randomStr}\n`;
    }
  }

  /**
   * ゼロパターン（最適化済み）
   */
  private getZeroPattern(fileType: string): string {
    switch (fileType) {
      case 'txt':
        return '0'.repeat(32) + '\n';
      case 'json':
        return '{"data":"0000000000"},';
      case 'xml':
        return '<data>0000000000</data>';
      case 'csv':
        return '"0000000000"\n';
      default:
        return '0'.repeat(32) + '\n';
    }
  }

  /**
   * 精密チャンク生成（バイト単位で正確、圧縮なし）
   */
  private generatePreciseChunk(
    pattern: string,
    patternBytes: number,
    targetSize: number
  ): Uint8Array {
    if (targetSize <= 0) {
      return new Uint8Array(0);
    }

    // 安全なASCII文字のみを使用（圧縮回避）
    const safePattern = this.ensureSafePattern(pattern);
    const safePatternBytes = this.getByteLength(safePattern);

    // パターンの繰り返し回数を計算
    const fullRepetitions = Math.floor(targetSize / safePatternBytes);
    const remainderBytes = targetSize % safePatternBytes;

    // 効率的な文字列生成（圧縮されない形式）
    let content = '';

    // フルパターンの繰り返し
    if (fullRepetitions > 0) {
      if (fullRepetitions <= 1000) {
        content = safePattern.repeat(fullRepetitions);
      } else {
        // 大量繰り返しの最適化
        const baseChunk = safePattern.repeat(1000);
        const baseRepetitions = Math.floor(fullRepetitions / 1000);
        const remainder = fullRepetitions % 1000;

        content = baseChunk.repeat(baseRepetitions);
        if (remainder > 0) {
          content += safePattern.repeat(remainder);
        }
      }
    }

    // 残りバイトの処理（安全な文字で埋める）
    if (remainderBytes > 0) {
      const paddingChar = 'A'; // 安全なASCII文字
      content += paddingChar.repeat(remainderBytes);
    }

    // UTF-8エンコードして正確なバイト数を確保
    const encoder = new TextEncoder();
    const encoded = encoder.encode(content);

    // 正確なサイズに調整
    if (encoded.length > targetSize) {
      return encoded.slice(0, targetSize);
    } else if (encoded.length < targetSize) {
      // 不足分をASCII文字で埋める（圧縮されない）
      const result = new Uint8Array(targetSize);
      result.set(encoded);
      // ASCII 'A' (65) で埋める
      result.fill(65, encoded.length);
      return result;
    }

    return encoded;
  }

  /**
   * 安全なパターンに変換（圧縮回避、UTF-8安全）
   */
  private ensureSafePattern(pattern: string): string {
    // 日本語文字をASCII文字に変換（圧縮回避）
    let safePattern = pattern
      .replace(/[^\x00-\x7F]/g, 'A') // 非ASCII文字をAに変換
      .replace(/\s+/g, ' '); // 連続空白を単一空白に

    // 最低限の長さを確保
    if (safePattern.length < 10) {
      safePattern = 'TestData-' + safePattern + '-End\n';
    }

    return safePattern;
  }

  /**
   * 精密チャンク結合
   */
  private combinePreciseChunks(
    chunks: Uint8Array[],
    targetBytes: number,
    fileType: string
  ): Uint8Array {
    // 全チャンクを結合
    let totalLength = 0;
    for (const chunk of chunks) {
      totalLength += chunk.length;
    }

    const combined = new Uint8Array(Math.min(totalLength, targetBytes));
    let offset = 0;

    for (const chunk of chunks) {
      const copyLength = Math.min(chunk.length, targetBytes - offset);
      if (copyLength <= 0) break;

      combined.set(chunk.slice(0, copyLength), offset);
      offset += copyLength;
    }

    // 形式別の後処理
    return this.formatFinalContent(combined, targetBytes, fileType);
  }

  /**
   * 最終コンテンツフォーマット（圧縮なし、確実に開ける）
   */
  private formatFinalContent(
    data: Uint8Array,
    targetBytes: number,
    fileType: string
  ): Uint8Array {
    // ASCII文字のみで構成されているかチェック
    const isAsciiSafe = this.isAsciiSafe(data);

    if (!isAsciiSafe) {
      // 非ASCII文字が含まれている場合は安全な文字に変換
      return this.createSafeContent(targetBytes, fileType);
    }

    const decoder = new TextDecoder('utf-8', { fatal: false });
    const encoder = new TextEncoder();

    try {
      let content = decoder.decode(data);

      switch (fileType) {
        case 'json':
          // JSONとして有効にする（圧縮されない形式）
          content = content.replace(/,$/, ''); // 最後のカンマを削除
          if (!content.startsWith('[')) {
            content = '[\n' + content;
          }
          if (!content.endsWith(']')) {
            content = content + '\n]';
          }
          break;
        case 'xml':
          // XMLとして有効にする（圧縮されない形式）
          if (!content.includes('<?xml')) {
            content =
              '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n' +
              content +
              '\n</root>';
          }
          break;
        case 'csv':
          // CSVヘッダーを追加（圧縮されない形式）
          if (!content.startsWith('title,content')) {
            content = 'title,content\n' + content;
          }
          break;
      }

      const encoded = encoder.encode(content);

      // 正確なサイズに調整
      if (encoded.length > targetBytes) {
        return encoded.slice(0, targetBytes);
      } else if (encoded.length < targetBytes) {
        const result = new Uint8Array(targetBytes);
        result.set(encoded);
        // ASCII改行文字で埋める（圧縮されない）
        result.fill(10, encoded.length); // ASCII LF
        return result;
      }

      return encoded;
    } catch (error) {
      // デコードエラーの場合は安全なコンテンツを作成
      return this.createSafeContent(targetBytes, fileType);
    }
  }

  /**
   * ASCII文字のみかチェック
   */
  private isAsciiSafe(data: Uint8Array): boolean {
    for (let i = 0; i < Math.min(data.length, 1000); i++) {
      if (data[i] > 127) {
        return false;
      }
    }
    return true;
  }

  /**
   * 安全なコンテンツを作成（確実に開ける）
   */
  private createSafeContent(targetBytes: number, fileType: string): Uint8Array {
    const encoder = new TextEncoder();
    let content = '';

    switch (fileType) {
      case 'txt':
        content = 'TestData File\n'.repeat(Math.ceil(targetBytes / 14));
        break;
      case 'json':
        content =
          '[\n' +
          '{"data":"test"},\n'.repeat(Math.ceil(targetBytes / 16)) +
          ']';
        break;
      case 'xml':
        content =
          '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n' +
          '<data>test</data>\n'.repeat(Math.ceil(targetBytes / 18)) +
          '</root>';
        break;
      case 'csv':
        content =
          'title,content\n' + 'test,data\n'.repeat(Math.ceil(targetBytes / 11));
        break;
      default:
        content = 'TestData\n'.repeat(Math.ceil(targetBytes / 9));
    }

    const encoded = encoder.encode(content);

    if (encoded.length > targetBytes) {
      return encoded.slice(0, targetBytes);
    } else if (encoded.length < targetBytes) {
      const result = new Uint8Array(targetBytes);
      result.set(encoded);
      result.fill(65, encoded.length); // ASCII 'A'
      return result;
    }

    return encoded;
  }

  /**
   * バイト長を正確に取得
   */
  private getByteLength(str: string): number {
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
 * 精密超高速醸造エントリーポイント
 */
export async function generatePreciseTurbo(
  targetBytes: number,
  fileType: string,
  contentType: 'aozora' | 'random' | 'zero',
  selectedWorks: string[],
  progressCallback?: (progress: PreciseProgress) => void,
  abortSignal?: AbortSignal
): Promise<Blob> {
  // サイズ制限チェック
  if (targetBytes > 2 * 1024 * 1024 * 1024) {
    throw new Error('ファイルサイズが大きすぎます（最大2GB）');
  }

  if (targetBytes < 1) {
    throw new Error('ファイルサイズは1バイト以上である必要があります');
  }

  const generator = new PreciseTurboGenerator();
  return generator.generate(
    targetBytes,
    fileType,
    contentType,
    selectedWorks,
    progressCallback,
    abortSignal
  );
}
