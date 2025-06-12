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
 * - 全ファイル形式対応（TXT, JSON, XML, CSV, PDF, PNG, JPEG）
 */
export class UltraPreciseGenerator {
  private static readonly CHUNK_SIZE = 1024 * 1024; // 1MBチャンク（精密制御）
  private static readonly PROGRESS_UPDATE_INTERVAL = 10 * 1024 * 1024; // 10MBごと

  /**
   * 超精密生成（誤差0バイト保証）- 全ファイル形式対応
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
      let result: Uint8Array;

      // ファイル形式別の処理
      switch (fileType) {
        case 'pdf':
          result = await this.generatePrecisePDF(
            targetBytes,
            contentType,
            selectedWorks,
            progressCallback,
            abortSignal
          );
          break;
        case 'png':
          result = await this.generatePrecisePNG(
            targetBytes,
            progressCallback,
            abortSignal
          );
          break;
        case 'jpg':
        case 'jpeg':
          result = await this.generatePreciseJPEG(
            targetBytes,
            progressCallback,
            abortSignal
          );
          break;
        default:
          result = await this.generatePreciseText(
            targetBytes,
            fileType,
            contentType,
            selectedWorks,
            progressCallback,
            abortSignal
          );
          break;
      }

      // 厳密サイズ検証
      if (result.length !== targetBytes) {
        console.warn(`サイズ調整: ${result.length} → ${targetBytes}`);
        result = this.adjustToExactSize(result, targetBytes);
      }

      // Blob作成
      const blob = new Blob([result], { type: this.getMimeType(fileType) });

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
   * 超精密テキストファイル生成（既存実装）
   */
  private async generatePreciseText(
    targetBytes: number,
    fileType: string,
    contentType: 'aozora' | 'random' | 'zero',
    selectedWorks: string[],
    progressCallback?: (progress: UltraPreciseProgress) => void,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
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
        const elapsed = (Date.now() - Date.now()) / 1000 + 0.001;
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

    // 形式別の最終調整（厳密）
    return this.applyFormatSpecificAdjustments(result, fileType, targetBytes);
  }

  /**
   * 超精密PDF生成（実際に使えるPDF）
   */
  private async generatePrecisePDF(
    targetBytes: number,
    contentType: 'aozora' | 'random' | 'zero',
    selectedWorks: string[],
    progressCallback?: (progress: UltraPreciseProgress) => void,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    // 動的インポート
    const { jsPDF } = await import('jspdf');

    // コンテンツ生成
    const content = this.getContentText(
      contentType,
      selectedWorks,
      targetBytes
    );

    // PDF作成
    const pdf = new jsPDF();

    // ページサイズ計算（目標サイズに近づける）
    const estimatedPagesNeeded = Math.max(1, Math.floor(targetBytes / 5000));

    for (let page = 0; page < estimatedPagesNeeded; page++) {
      if (abortSignal?.aborted) {
        throw new Error('生成がキャンセルされました');
      }

      if (page > 0) {
        pdf.addPage();
      }

      // ページコンテンツ
      const pageContent = `Page ${page + 1}\n\n${content.substring(
        (page * content.length) / estimatedPagesNeeded,
        ((page + 1) * content.length) / estimatedPagesNeeded
      )}`;

      // テキスト追加（日本語対応）
      pdf.text(pageContent, 10, 10, { maxWidth: 180 });

      // プログレス更新
      progressCallback?.({
        current: (page + 1) * (targetBytes / estimatedPagesNeeded),
        total: targetBytes,
        percentage: ((page + 1) / estimatedPagesNeeded) * 100,
        speed: 0,
        estimatedTimeLeft: 0,
        phase: 'generating',
        actualBytes: 0,
      });
    }

    // PDF出力
    const pdfOutput = pdf.output('arraybuffer');
    let result = new Uint8Array(pdfOutput);

    // サイズ調整
    result = this.adjustToExactSize(result, targetBytes);

    return result;
  }

  /**
   * 超精密PNG生成（実際に使える画像）
   */
  private async generatePrecisePNG(
    targetBytes: number,
    progressCallback?: (progress: UltraPreciseProgress) => void,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    // Canvas作成
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // サイズ計算（目標ファイルサイズに近づける）
    const estimatedPixels = Math.max(100, Math.floor(targetBytes / 4));
    const size = Math.floor(Math.sqrt(estimatedPixels));

    canvas.width = size;
    canvas.height = size;

    // 背景色
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, size, size);

    // パターン描画
    const patternSize = Math.max(10, size / 20);
    for (let x = 0; x < size; x += patternSize) {
      for (let y = 0; y < size; y += patternSize) {
        if (abortSignal?.aborted) {
          throw new Error('生成がキャンセルされました');
        }

        const hue = ((x + y) / (size * 2)) * 360;
        ctx.fillStyle = `hsl(${hue}, 50%, 70%)`;
        ctx.fillRect(x, y, patternSize, patternSize);
      }

      // プログレス更新
      progressCallback?.({
        current: (x / size) * targetBytes,
        total: targetBytes,
        percentage: (x / size) * 100,
        speed: 0,
        estimatedTimeLeft: 0,
        phase: 'generating',
        actualBytes: 0,
      });
    }

    // PNG出力
    const dataUrl = canvas.toDataURL('image/png');
    const base64Data = dataUrl.split(',')[1];
    let result = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // サイズ調整
    result = this.adjustToExactSize(result, targetBytes);

    return result;
  }

  /**
   * 超精密JPEG生成（実際に使える画像）
   */
  private async generatePreciseJPEG(
    targetBytes: number,
    progressCallback?: (progress: UltraPreciseProgress) => void,
    abortSignal?: AbortSignal
  ): Promise<Uint8Array> {
    // Canvas作成
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // サイズ計算
    const estimatedPixels = Math.max(100, Math.floor(targetBytes / 3));
    const size = Math.floor(Math.sqrt(estimatedPixels));

    canvas.width = size;
    canvas.height = size;

    // グラデーション背景
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(0.5, '#4ecdc4');
    gradient.addColorStop(1, '#45b7d1');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // テキスト描画
    ctx.fillStyle = 'white';
    ctx.font = `${Math.max(12, size / 20)}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('TestData Buddy', size / 2, size / 2);
    ctx.fillText(`${this.formatBytes(targetBytes)}`, size / 2, size / 2 + 30);

    // プログレス更新
    progressCallback?.({
      current: targetBytes * 0.8,
      total: targetBytes,
      percentage: 80,
      speed: 0,
      estimatedTimeLeft: 0,
      phase: 'generating',
      actualBytes: 0,
    });

    // JPEG出力（品質調整でサイズ制御）
    let quality = 0.8;
    let result: Uint8Array;

    do {
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      const base64Data = dataUrl.split(',')[1];
      result = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

      if (result.length > targetBytes) {
        quality -= 0.1;
      } else if (result.length < targetBytes * 0.9) {
        quality += 0.05;
      } else {
        break;
      }
    } while (quality > 0.1 && quality < 1.0);

    // サイズ調整
    result = this.adjustToExactSize(result, targetBytes);

    return result;
  }

  /**
   * コンテンツテキスト生成
   */
  private getContentText(
    contentType: 'aozora' | 'random' | 'zero',
    selectedWorks: string[],
    maxLength: number
  ): string {
    let content = '';

    switch (contentType) {
      case 'aozora':
        const works =
          selectedWorks.length > 0
            ? AOZORA_BUNKO_SAMPLES.filter(work =>
                selectedWorks.includes(work.id)
              )
            : AOZORA_BUNKO_SAMPLES;

        for (const work of works) {
          content += `作品名: ${work.title}\n\n${work.content}\n\n---\n\n`;
          if (content.length > maxLength) break;
        }
        break;

      case 'random':
        while (content.length < maxLength) {
          content += `TestData ${Math.random().toString(36).substring(2)} `;
        }
        break;

      case 'zero':
        content = '0'.repeat(Math.min(maxLength, 1000));
        break;
    }

    return content.substring(0, maxLength);
  }

  /**
   * 厳密サイズ調整
   */
  private adjustToExactSize(data: Uint8Array, targetSize: number): Uint8Array {
    if (data.length === targetSize) {
      return data;
    }

    const result = new Uint8Array(targetSize);

    if (data.length > targetSize) {
      // 超過分をカット
      result.set(data.subarray(0, targetSize));
    } else {
      // 不足分を埋める
      result.set(data);
      // 残りを適切な値で埋める
      const fillValue = data.length > 0 ? data[data.length - 1] : 0;
      result.fill(fillValue, data.length);
    }

    return result;
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
   * 青空文庫パターン（日本語そのまま使用）
   */
  private getAozoraPattern(fileType: string, selectedWorks: string[]): string {
    const works =
      selectedWorks.length > 0
        ? AOZORA_BUNKO_SAMPLES.filter(work => selectedWorks.includes(work.id))
        : AOZORA_BUNKO_SAMPLES;

    const work = works[Math.floor(Math.random() * works.length)];

    // 日本語をそのまま使用（エンコーディング問題は解決済み）
    const title = work.title;
    const content = work.content.substring(0, 200); // より長いコンテンツを使用

    switch (fileType) {
      case 'txt':
        return `作品名: ${title}\n\n${content}\n\n---\n\n`;
      case 'json':
        return `{"title":"${title.replace(/"/g, '\\"')}","content":"${content
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n')}"},\n`;
      case 'xml':
        return `<work><title>${title}</title><content>${content}</content></work>\n`;
      case 'csv':
        return `"${title.replace(/"/g, '""')}","${content
          .replace(/"/g, '""')
          .replace(/\n/g, ' ')}"\n`;
      default:
        return `作品名: ${title}\n\n${content}\n\n---\n\n`;
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
      pdf: 'application/pdf',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
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
