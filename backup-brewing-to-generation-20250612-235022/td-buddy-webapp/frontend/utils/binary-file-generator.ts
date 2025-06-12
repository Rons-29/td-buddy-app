// バイナリファイル生成（PDF、画像、動画など）
// 大容量対応のバイナリファイル生成器

export interface BinaryFileProgress {
  current: number;
  total: number;
  percentage: number;
  speed: number;
  estimatedTimeLeft: number;
  phase: 'preparing' | 'generating' | 'finalizing' | 'complete';
}

export interface BinaryFileOptions {
  chunkSize?: number;
  progressCallback?: (progress: BinaryFileProgress) => void;
  abortSignal?: AbortSignal;
}

/**
 * バイナリファイル生成器
 */
export class BinaryFileGenerator {
  private readonly CHUNK_SIZE = 1024 * 1024; // 1MB chunks

  /**
   * PDF風ファイル生成（実際のPDFではなく、PDFっぽいバイナリデータ）
   */
  async generatePDF(
    targetBytes: number,
    options: BinaryFileOptions = {}
  ): Promise<Blob> {
    const { progressCallback, abortSignal } = options;
    const chunks: Uint8Array[] = [];
    let generatedBytes = 0;

    // PDF header
    const header = new TextEncoder().encode('%PDF-1.4\n');
    chunks.push(header);
    generatedBytes += header.length;

    // PDF objects with random content
    while (generatedBytes < targetBytes) {
      if (abortSignal?.aborted) {
        throw new Error('PDF生成がキャンセルされました');
      }

      const remainingBytes = targetBytes - generatedBytes;
      const chunkSize = Math.min(this.CHUNK_SIZE, remainingBytes);

      const chunk = this.generatePDFChunk(chunkSize, chunks.length);
      chunks.push(chunk);
      generatedBytes += chunk.length;

      // Progress update
      if (progressCallback) {
        progressCallback({
          current: generatedBytes,
          total: targetBytes,
          percentage: (generatedBytes / targetBytes) * 100,
          speed: 0, // Simplified for now
          estimatedTimeLeft: 0,
          phase: generatedBytes >= targetBytes ? 'complete' : 'generating',
        });
      }

      // Small delay to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 1));
    }

    return new Blob(chunks, { type: 'application/pdf' });
  }

  /**
   * 画像風ファイル生成（PNG形式）
   */
  async generatePNG(
    targetBytes: number,
    options: BinaryFileOptions = {}
  ): Promise<Blob> {
    const { progressCallback, abortSignal } = options;
    const chunks: Uint8Array[] = [];
    let generatedBytes = 0;

    // PNG signature
    const signature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
    chunks.push(signature);
    generatedBytes += signature.length;

    // IHDR chunk (image header)
    const ihdr = this.createPNGIHDR();
    chunks.push(ihdr);
    generatedBytes += ihdr.length;

    // Generate image data chunks
    while (generatedBytes < targetBytes - 100) {
      // Leave space for IEND
      if (abortSignal?.aborted) {
        throw new Error('PNG生成がキャンセルされました');
      }

      const remainingBytes = targetBytes - generatedBytes - 100;
      const chunkSize = Math.min(this.CHUNK_SIZE, remainingBytes);

      const chunk = this.generatePNGDataChunk(chunkSize);
      chunks.push(chunk);
      generatedBytes += chunk.length;

      // Progress update
      if (progressCallback) {
        progressCallback({
          current: generatedBytes,
          total: targetBytes,
          percentage: (generatedBytes / targetBytes) * 100,
          speed: 0,
          estimatedTimeLeft: 0,
          phase: 'generating',
        });
      }

      await new Promise(resolve => setTimeout(resolve, 1));
    }

    // IEND chunk
    const iend = this.createPNGIEND();
    chunks.push(iend);

    if (progressCallback) {
      progressCallback({
        current: targetBytes,
        total: targetBytes,
        percentage: 100,
        speed: 0,
        estimatedTimeLeft: 0,
        phase: 'complete',
      });
    }

    return new Blob(chunks, { type: 'image/png' });
  }

  /**
   * JPEG風ファイル生成
   */
  async generateJPEG(
    targetBytes: number,
    options: BinaryFileOptions = {}
  ): Promise<Blob> {
    const { progressCallback, abortSignal } = options;
    const chunks: Uint8Array[] = [];
    let generatedBytes = 0;

    // JPEG header (SOI marker)
    const header = new Uint8Array([0xff, 0xd8]);
    chunks.push(header);
    generatedBytes += header.length;

    // JPEG APP0 segment
    const app0 = this.createJPEGAPP0();
    chunks.push(app0);
    generatedBytes += app0.length;

    // Generate image data
    while (generatedBytes < targetBytes - 10) {
      // Leave space for EOI
      if (abortSignal?.aborted) {
        throw new Error('JPEG生成がキャンセルされました');
      }

      const remainingBytes = targetBytes - generatedBytes - 10;
      const chunkSize = Math.min(this.CHUNK_SIZE, remainingBytes);

      const chunk = this.generateJPEGDataChunk(chunkSize);
      chunks.push(chunk);
      generatedBytes += chunk.length;

      // Progress update
      if (progressCallback) {
        progressCallback({
          current: generatedBytes,
          total: targetBytes,
          percentage: (generatedBytes / targetBytes) * 100,
          speed: 0,
          estimatedTimeLeft: 0,
          phase: 'generating',
        });
      }

      await new Promise(resolve => setTimeout(resolve, 1));
    }

    // JPEG footer (EOI marker)
    const footer = new Uint8Array([0xff, 0xd9]);
    chunks.push(footer);

    if (progressCallback) {
      progressCallback({
        current: targetBytes,
        total: targetBytes,
        percentage: 100,
        speed: 0,
        estimatedTimeLeft: 0,
        phase: 'complete',
      });
    }

    return new Blob(chunks, { type: 'image/jpeg' });
  }

  /**
   * 動画風ファイル生成（MP4形式）
   */
  async generateMP4(
    targetBytes: number,
    options: BinaryFileOptions = {}
  ): Promise<Blob> {
    const { progressCallback, abortSignal } = options;
    const chunks: Uint8Array[] = [];
    let generatedBytes = 0;

    // MP4 ftyp box
    const ftyp = this.createMP4FtypBox();
    chunks.push(ftyp);
    generatedBytes += ftyp.length;

    // Generate mdat box with video data
    while (generatedBytes < targetBytes) {
      if (abortSignal?.aborted) {
        throw new Error('MP4生成がキャンセルされました');
      }

      const remainingBytes = targetBytes - generatedBytes;
      const chunkSize = Math.min(this.CHUNK_SIZE, remainingBytes);

      const chunk = this.generateMP4DataChunk(chunkSize);
      chunks.push(chunk);
      generatedBytes += chunk.length;

      // Progress update
      if (progressCallback) {
        progressCallback({
          current: generatedBytes,
          total: targetBytes,
          percentage: (generatedBytes / targetBytes) * 100,
          speed: 0,
          estimatedTimeLeft: 0,
          phase: generatedBytes >= targetBytes ? 'complete' : 'generating',
        });
      }

      await new Promise(resolve => setTimeout(resolve, 1));
    }

    return new Blob(chunks, { type: 'video/mp4' });
  }

  /**
   * ZIP風ファイル生成
   */
  async generateZIP(
    targetBytes: number,
    options: BinaryFileOptions = {}
  ): Promise<Blob> {
    const { progressCallback, abortSignal } = options;
    const chunks: Uint8Array[] = [];
    let generatedBytes = 0;

    // ZIP local file header
    const header = this.createZIPHeader();
    chunks.push(header);
    generatedBytes += header.length;

    // Generate compressed data
    while (generatedBytes < targetBytes - 100) {
      // Leave space for central directory
      if (abortSignal?.aborted) {
        throw new Error('ZIP生成がキャンセルされました');
      }

      const remainingBytes = targetBytes - generatedBytes - 100;
      const chunkSize = Math.min(this.CHUNK_SIZE, remainingBytes);

      const chunk = this.generateZIPDataChunk(chunkSize);
      chunks.push(chunk);
      generatedBytes += chunk.length;

      // Progress update
      if (progressCallback) {
        progressCallback({
          current: generatedBytes,
          total: targetBytes,
          percentage: (generatedBytes / targetBytes) * 100,
          speed: 0,
          estimatedTimeLeft: 0,
          phase: 'generating',
        });
      }

      await new Promise(resolve => setTimeout(resolve, 1));
    }

    // ZIP central directory and end record
    const footer = this.createZIPFooter();
    chunks.push(footer);

    if (progressCallback) {
      progressCallback({
        current: targetBytes,
        total: targetBytes,
        percentage: 100,
        speed: 0,
        estimatedTimeLeft: 0,
        phase: 'complete',
      });
    }

    return new Blob(chunks, { type: 'application/zip' });
  }

  // Helper methods for generating file format specific chunks

  private generatePDFChunk(size: number, objectNumber: number): Uint8Array {
    const content = `${objectNumber} 0 obj\n<<\n/Type /Page\n/Contents ${
      objectNumber + 1
    } 0 R\n>>\nendobj\n`;
    const padding = 'A'.repeat(Math.max(0, size - content.length));
    return new TextEncoder().encode(content + padding);
  }

  private createPNGIHDR(): Uint8Array {
    // Simplified IHDR chunk for 1x1 pixel image
    const data = new Uint8Array([
      0,
      0,
      0,
      13, // Length
      73,
      72,
      68,
      82, // IHDR
      0,
      0,
      0,
      1, // Width
      0,
      0,
      0,
      1, // Height
      8,
      2,
      0,
      0,
      0, // Bit depth, color type, compression, filter, interlace
      0x90,
      0x77,
      0x53,
      0xde, // CRC
    ]);
    return data;
  }

  private generatePNGDataChunk(size: number): Uint8Array {
    const chunk = new Uint8Array(size);
    // Fill with random-ish data
    for (let i = 0; i < size; i++) {
      chunk[i] = (i * 137 + 42) % 256;
    }
    return chunk;
  }

  private createPNGIEND(): Uint8Array {
    return new Uint8Array([
      0,
      0,
      0,
      0, // Length
      73,
      69,
      78,
      68, // IEND
      0xae,
      0x42,
      0x60,
      0x82, // CRC
    ]);
  }

  private createJPEGAPP0(): Uint8Array {
    const app0 = new TextEncoder().encode(
      '\xFF\xE0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00'
    );
    return new Uint8Array(app0);
  }

  private generateJPEGDataChunk(size: number): Uint8Array {
    const chunk = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
      chunk[i] = (i * 123 + 78) % 256;
    }
    return chunk;
  }

  private createMP4FtypBox(): Uint8Array {
    const ftyp = new TextEncoder().encode(
      '\x00\x00\x00\x20ftypmp42\x00\x00\x00\x00mp42isom'
    );
    return new Uint8Array(ftyp);
  }

  private generateMP4DataChunk(size: number): Uint8Array {
    const chunk = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
      chunk[i] = (i * 89 + 156) % 256;
    }
    return chunk;
  }

  private createZIPHeader(): Uint8Array {
    // Simplified ZIP local file header
    return new Uint8Array([
      0x50,
      0x4b,
      0x03,
      0x04, // Local file header signature
      0x14,
      0x00, // Version needed to extract
      0x00,
      0x00, // General purpose bit flag
      0x00,
      0x00, // Compression method
      0x00,
      0x00,
      0x00,
      0x00, // Last mod file time/date
      0x00,
      0x00,
      0x00,
      0x00, // CRC-32
      0x00,
      0x00,
      0x00,
      0x00, // Compressed size
      0x00,
      0x00,
      0x00,
      0x00, // Uncompressed size
      0x08,
      0x00, // File name length
      0x00,
      0x00, // Extra field length
      // File name: "test.txt"
      0x74,
      0x65,
      0x73,
      0x74,
      0x2e,
      0x74,
      0x78,
      0x74,
    ]);
  }

  private generateZIPDataChunk(size: number): Uint8Array {
    const chunk = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
      chunk[i] = (i * 67 + 234) % 256;
    }
    return chunk;
  }

  private createZIPFooter(): Uint8Array {
    // Simplified ZIP end of central directory record
    return new Uint8Array([
      0x50,
      0x4b,
      0x05,
      0x06, // End of central dir signature
      0x00,
      0x00, // Number of this disk
      0x00,
      0x00, // Number of the disk with start of central directory
      0x01,
      0x00, // Total number of entries in central directory on this disk
      0x01,
      0x00, // Total number of entries in central directory
      0x2e,
      0x00,
      0x00,
      0x00, // Size of central directory
      0x00,
      0x00,
      0x00,
      0x00, // Offset of start of central directory
      0x00,
      0x00, // ZIP file comment length
    ]);
  }
}

/**
 * バイナリファイル生成のエントリーポイント
 */
export async function generateBinaryFile(
  targetBytes: number,
  fileType: string,
  progressCallback?: (progress: BinaryFileProgress) => void,
  abortSignal?: AbortSignal
): Promise<Blob> {
  const generator = new BinaryFileGenerator();

  switch (fileType) {
    case 'pdf':
      return generator.generatePDF(targetBytes, {
        progressCallback,
        abortSignal,
      });
    case 'png':
      return generator.generatePNG(targetBytes, {
        progressCallback,
        abortSignal,
      });
    case 'jpg':
    case 'jpeg':
      return generator.generateJPEG(targetBytes, {
        progressCallback,
        abortSignal,
      });
    case 'mp4':
      return generator.generateMP4(targetBytes, {
        progressCallback,
        abortSignal,
      });
    case 'zip':
      return generator.generateZIP(targetBytes, {
        progressCallback,
        abortSignal,
      });
    default:
      throw new Error(`サポートされていないファイル形式: ${fileType}`);
  }
}
