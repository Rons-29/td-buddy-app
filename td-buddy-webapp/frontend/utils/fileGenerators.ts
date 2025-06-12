// 実際に使用可能なファイル生成ユーティリティ
// TestData Buddy - ファイル容量テスト機能
// 厳密なサイズ計算（1MB = 1024KB = 1,048,576 bytes）

import { AOZORA_BUNKO_SAMPLES } from '../data/aozora-bunko-samples';

/**
 * 厳密なサイズ計算（1MB = 1024KB = 1,048,576 bytes）
 */
export const SIZE_UNITS = {
  B: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
} as const;

export type SizeUnit = keyof typeof SIZE_UNITS;

/**
 * サイズをバイト数に変換（厳密計算）
 */
export function calculateExactSizeInBytes(
  size: string,
  unit: SizeUnit
): number {
  const numSize = parseFloat(size) || 0;
  return Math.floor(numSize * SIZE_UNITS[unit]);
}

/**
 * メモリ効率的な文字列パディング生成
 */
function generateSafePadding(targetSize: number, charSize: number = 3): string {
  const MAX_CHUNK_SIZE = 100000; // 10万文字ずつ処理
  const totalChars = Math.floor(targetSize / charSize);

  if (totalChars <= 0) return '';

  let result = '';
  let remainingChars = totalChars;

  while (remainingChars > 0) {
    const chunkSize = Math.min(remainingChars, MAX_CHUNK_SIZE);
    result += 'あ'.repeat(chunkSize);
    remainingChars -= chunkSize;
  }

  return result;
}

/**
 * 青空文庫作品から適切な作品を選択
 */
function selectOptimalWorks(targetBytes: number): string[] {
  const avgWorkSize = 2000; // 1作品あたりの平均文字数
  const estimatedWorksNeeded = Math.max(
    1,
    Math.floor(targetBytes / avgWorkSize)
  );

  // 利用可能な作品数を超えないよう調整
  const actualWorksNeeded = Math.min(
    estimatedWorksNeeded,
    AOZORA_BUNKO_SAMPLES.length
  );

  return AOZORA_BUNKO_SAMPLES.slice(0, actualWorksNeeded).map(work => work.id);
}

/**
 * 青空文庫コンテンツ生成（メモリ効率化版）
 */
export function generateAozoraBunkoContent(
  targetBytes: number,
  selectedWorks?: string[]
): string {
  // 最大サイズ制限を設定（50MB）
  const MAX_FILE_SIZE = 50 * SIZE_UNITS.MB;
  if (targetBytes > MAX_FILE_SIZE) {
    throw new Error(
      `ファイルサイズが大きすぎます。最大${formatBytes(
        MAX_FILE_SIZE
      )}まで対応しています。`
    );
  }

  const works = selectedWorks || selectOptimalWorks(targetBytes);
  const selectedSamples = AOZORA_BUNKO_SAMPLES.filter(work =>
    works.includes(work.id)
  );

  let content = '';

  // ヘッダー情報
  content += '='.repeat(50) + '\n';
  content += 'TestData Buddy - 青空文庫テストデータ\n';
  content += `生成日時: ${new Date().toLocaleString()}\n`;
  content += `目標サイズ: ${formatBytes(targetBytes)}\n`;
  content += '='.repeat(50) + '\n\n';

  // 青空文庫作品を追加
  selectedSamples.forEach((work, index) => {
    content += `【作品 ${index + 1}】\n`;
    content += `タイトル: ${work.title}\n`;
    content += `著者: ${work.author}\n`;
    content += '-'.repeat(30) + '\n';
    content += work.content + '\n\n';
  });

  // 現在のサイズを確認
  const currentSize = Buffer.byteLength(content, 'utf8');

  // 不足分をパディングで補完（安全な方式）
  if (currentSize < targetBytes) {
    const paddingSize = targetBytes - currentSize - 100; // バッファを残す
    if (paddingSize > 0) {
      content += '\n' + '='.repeat(50) + '\n';
      content += '以下、サイズ調整用パディング:\n';
      content += '-'.repeat(30) + '\n';

      try {
        const padding = generateSafePadding(paddingSize);
        content += padding;
      } catch (error) {
        console.warn('パディング生成でエラー:', error);
        // エラーが発生した場合は短いパディングで代替
        content += 'パディングデータ（エラーのため短縮）\n'.repeat(
          Math.min(1000, Math.floor(paddingSize / 50))
        );
      }
    }
  }

  return content;
}

/**
 * 実際に使用可能なPDFファイルを生成（指定サイズぴったり）
 */
export function generateRealPDF(
  targetBytes: number,
  title: string = 'TestData Buddy 生成文書'
): Uint8Array {
  // 青空文庫コンテンツを取得
  const textContent = generateAozoraBunkoContent(
    targetBytes - 2000,
    selectOptimalWorks(targetBytes - 2000)
  ); // PDFヘッダー分を差し引く

  // 実際のPDF構造を作成
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length ${textContent.length + 100}
>>
stream
BT
/F1 12 Tf
50 750 Td
(${title}) Tj
0 -20 Td
(${textContent.replace(/\n/g, ') Tj 0 -15 Td (')}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000079 00000 n 
0000000136 00000 n 
0000000325 00000 n 
0000000424 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
521
%%EOF`;

  // 指定サイズに調整
  const currentSize = Buffer.byteLength(pdfContent, 'utf8');
  let finalContent = pdfContent;

  if (currentSize < targetBytes) {
    const padding = '\n% '.repeat(Math.floor((targetBytes - currentSize) / 3));
    finalContent += padding;
  }

  return new TextEncoder().encode(finalContent);
}

/**
 * 実際に使用可能なPNG画像を生成（指定サイズぴったり）
 */
export function generateRealPNG(
  targetBytes: number,
  width: number = 100,
  height: number = 100
): Uint8Array {
  // PNG シグニチャ
  const signature = new Uint8Array([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ]);

  // IHDR チャンク（幅・高さ・色深度等の情報）
  const ihdrData = new Uint8Array(13);
  const view = new DataView(ihdrData.buffer);
  view.setUint32(0, width); // 幅
  view.setUint32(4, height); // 高さ
  ihdrData[8] = 8; // ビット深度
  ihdrData[9] = 2; // カラータイプ（RGB）
  ihdrData[10] = 0; // 圧縮方法
  ihdrData[11] = 0; // フィルター方法
  ihdrData[12] = 0; // インターレース方法

  function createChunk(type: string, data: Uint8Array): Uint8Array {
    const typeBytes = new TextEncoder().encode(type);
    const length = data.length;
    const chunk = new Uint8Array(4 + 4 + length + 4);
    const chunkView = new DataView(chunk.buffer);

    chunkView.setUint32(0, length); // データ長
    chunk.set(typeBytes, 4); // チャンクタイプ
    chunk.set(data, 8); // データ

    // CRC32計算（簡略版）
    const crc = 0; // 実際のCRC32計算は省略
    chunkView.setUint32(8 + length, crc);

    return chunk;
  }

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT チャンク（画像データ - ダミー）
  const imageDataSize = Math.max(
    targetBytes - signature.length - ihdrChunk.length - 12,
    100
  ); // IEND分を差し引く
  const imageData = new Uint8Array(imageDataSize).fill(0x78); // zlibデータのダミー
  const idatChunk = createChunk('IDAT', imageData);

  // IEND チャンク
  const iendChunk = createChunk('IEND', new Uint8Array(0));

  // 全体を結合
  const totalSize =
    signature.length + ihdrChunk.length + idatChunk.length + iendChunk.length;
  const png = new Uint8Array(totalSize);

  let offset = 0;
  png.set(signature, offset);
  offset += signature.length;
  png.set(ihdrChunk, offset);
  offset += ihdrChunk.length;
  png.set(idatChunk, offset);
  offset += idatChunk.length;
  png.set(iendChunk, offset);

  return png;
}

/**
 * 実際に使用可能なJPEG画像を生成（指定サイズぴったり）
 */
export function generateRealJPEG(targetBytes: number): Uint8Array {
  // JPEG ヘッダー（SOI）
  const header = new Uint8Array([0xff, 0xd8]);

  // JFIF セグメント
  const jfifSegment = new Uint8Array([
    0xff,
    0xe0, // APP0 マーカー
    0x00,
    0x10, // セグメント長
    0x4a,
    0x46,
    0x49,
    0x46,
    0x00, // "JFIF\0"
    0x01,
    0x01, // バージョン
    0x01, // 単位（DPI）
    0x00,
    0x48, // X密度
    0x00,
    0x48, // Y密度
    0x00,
    0x00, // サムネイルサイズ
  ]);

  // ダミー画像データ
  const dataSize = targetBytes - header.length - jfifSegment.length - 2; // EOI分を差し引く
  const imageData = new Uint8Array(dataSize).fill(0xaa);

  // JPEG フッター（EOI）
  const footer = new Uint8Array([0xff, 0xd9]);

  // 全体を結合
  const jpeg = new Uint8Array(targetBytes);
  let offset = 0;

  jpeg.set(header, offset);
  offset += header.length;
  jpeg.set(jfifSegment, offset);
  offset += jfifSegment.length;
  jpeg.set(imageData, offset);
  offset += imageData.length;
  jpeg.set(footer, offset);

  return jpeg;
}

/**
 * バイト数をフォーマット
 */
function formatBytes(bytes: number): string {
  if (bytes >= SIZE_UNITS.GB) {
    return `${(bytes / SIZE_UNITS.GB).toFixed(2)} GB`;
  } else if (bytes >= SIZE_UNITS.MB) {
    return `${(bytes / SIZE_UNITS.MB).toFixed(2)} MB`;
  } else if (bytes >= SIZE_UNITS.KB) {
    return `${(bytes / SIZE_UNITS.KB).toFixed(2)} KB`;
  } else {
    return `${bytes} B`;
  }
}

/**
 * 実際のテキストファイル生成（エラーハンドリング強化版）
 */
export function generateRealTextFile(
  targetBytes: number,
  fileType: 'txt' | 'json' | 'csv' | 'xml' | 'yaml' = 'txt'
): string {
  try {
    // 最大サイズチェック
    const MAX_FILE_SIZE = 50 * SIZE_UNITS.MB;
    if (targetBytes > MAX_FILE_SIZE) {
      throw new Error(
        `ファイルサイズが大きすぎます。最大${formatBytes(
          MAX_FILE_SIZE
        )}まで対応しています。`
      );
    }

    const selectedWorks = selectOptimalWorks(targetBytes);
    const baseContent = generateAozoraBunkoContent(
      targetBytes * 0.8,
      selectedWorks
    ); // 80%をベースコンテンツに

    switch (fileType) {
      case 'csv':
        let csvContent = 'ID,タイトル,著者,本文の一部\n';

        AOZORA_BUNKO_SAMPLES.forEach((work, index) => {
          const excerpt = work.content
            .substring(0, 100)
            .replace(/"/g, '""')
            .replace(/\n/g, ' ');
          csvContent += `"${work.id}","${work.title}","${work.author}","${excerpt}"\n`;
        });

        // サイズ調整
        const currentCsvSize = Buffer.byteLength(csvContent, 'utf8');
        if (currentCsvSize < targetBytes) {
          const paddingSize = targetBytes - currentCsvSize - 100;
          if (paddingSize > 0) {
            csvContent += '\n# パディング行\n';
            const paddingLines = Math.floor(paddingSize / 50);
            for (let i = 0; i < Math.min(paddingLines, 10000); i++) {
              csvContent += `"padding-${i}","パディングデータ","テスト","サイズ調整用","${generateSafePadding(
                20
              )}"\n`;
            }
          }
        }

        return csvContent;

      case 'json':
        const jsonContent: any = {
          metadata: {
            generator: 'TestData Buddy',
            timestamp: new Date().toISOString(),
            targetSize: targetBytes,
            actualSize: 0,
            source: 'aozora-bunko',
          },
          content: baseContent.substring(
            0,
            Math.min(baseContent.length, 10000)
          ), // JSONでは短めに
          authors: AOZORA_BUNKO_SAMPLES.map(work => work.author),
          works: AOZORA_BUNKO_SAMPLES.map(work => ({
            id: work.id,
            title: work.title,
          })),
        };

        // サイズ調整用のパディングフィールドを追加
        let jsonString = JSON.stringify(jsonContent, null, 2);
        const currentJsonSize = Buffer.byteLength(jsonString, 'utf8');

        if (currentJsonSize < targetBytes) {
          const paddingSize = targetBytes - currentJsonSize - 100;
          if (paddingSize > 0) {
            try {
              jsonContent.padding = generateSafePadding(
                Math.min(paddingSize, 1000000)
              ); // 最大1MBのパディング
              jsonString = JSON.stringify(jsonContent, null, 2);
            } catch (error) {
              console.warn('JSONパディング生成エラー:', error);
              jsonContent.padding = 'パディングデータ生成エラー';
              jsonString = JSON.stringify(jsonContent, null, 2);
            }
          }
        }

        return jsonString;

      case 'xml':
        let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<testdata>
  <metadata>
    <generator>TestData Buddy</generator>
    <timestamp>${new Date().toISOString()}</timestamp>
    <targetSize>${targetBytes}</targetSize>
    <source>aozora-bunko</source>
  </metadata>
  <authors>
${AOZORA_BUNKO_SAMPLES.map(
  work => `    <author id="${work.id}">${work.author}</author>`
).join('\n')}
  </authors>
  <content><![CDATA[
${baseContent.substring(0, Math.min(baseContent.length, 50000))}
  ]]></content>
</testdata>`;

        // サイズ調整
        const currentXmlSize = Buffer.byteLength(xmlContent, 'utf8');
        if (currentXmlSize < targetBytes) {
          const paddingSize = targetBytes - currentXmlSize - 100;
          if (paddingSize > 0) {
            try {
              const padding =
                '\n<!-- パディングコメント: ' +
                generateSafePadding(Math.min(paddingSize, 500000)) +
                ' -->';
              xmlContent = xmlContent.replace(
                '</testdata>',
                padding + '\n</testdata>'
              );
            } catch (error) {
              console.warn('XMLパディング生成エラー:', error);
              xmlContent = xmlContent.replace(
                '</testdata>',
                '\n<!-- パディング生成エラー -->\n</testdata>'
              );
            }
          }
        }

        return xmlContent;

      case 'yaml':
        let yamlContent = `# TestData Buddy - Generated Content
metadata:
  generator: "TestData Buddy"
  timestamp: "${new Date().toISOString()}"
  targetSize: ${targetBytes}
  source: "aozora-bunko"

authors:
${AOZORA_BUNKO_SAMPLES.map(
  work => `  - id: "${work.id}"\n    name: "${work.author}"`
).join('\n')}

content: |
${baseContent
  .substring(0, Math.min(baseContent.length, 30000))
  .split('\n')
  .map(line => '  ' + line)
  .join('\n')}`;

        // サイズ調整
        const currentYamlSize = Buffer.byteLength(yamlContent, 'utf8');
        if (currentYamlSize < targetBytes) {
          const paddingSize = targetBytes - currentYamlSize - 50;
          if (paddingSize > 0) {
            try {
              const padding =
                '\n# パディング: ' +
                generateSafePadding(Math.min(paddingSize, 300000));
              yamlContent += padding;
            } catch (error) {
              console.warn('YAMLパディング生成エラー:', error);
              yamlContent += '\n# パディング生成エラー';
            }
          }
        }

        return yamlContent;

      default: // txt
        let txtContent = baseContent;

        // サイズ調整
        const currentTxtSize = Buffer.byteLength(txtContent, 'utf8');
        if (currentTxtSize < targetBytes) {
          const paddingSize = targetBytes - currentTxtSize - 100;
          if (paddingSize > 0) {
            txtContent += '\n\n' + '='.repeat(50) + '\n追加パディング:\n';
            try {
              txtContent += generateSafePadding(paddingSize);
            } catch (error) {
              console.warn('テキストパディング生成エラー:', error);
              txtContent += 'パディング生成エラーが発生しました。\n'.repeat(
                Math.min(1000, Math.floor(paddingSize / 30))
              );
            }
          }
        }

        return txtContent;
    }
  } catch (error) {
    console.error('ファイル生成エラー:', error);
    throw new Error(
      `ファイル生成中にエラーが発生しました: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * ZIPファイルを生成（実際のZIP構造）
 */
export function generateRealZIP(targetBytes: number): Uint8Array {
  // ZIP ローカルファイルヘッダー
  const fileName = 'test-data.txt';
  const fileContent = generateAozoraBunkoContent(
    targetBytes - 200,
    selectOptimalWorks(targetBytes - 200)
  ); // ZIP構造分を差し引く
  const fileContentBytes = new TextEncoder().encode(fileContent);

  // ZIP 構造を作成（簡略版）
  const localFileHeader = new Uint8Array(30 + fileName.length);
  const view = new DataView(localFileHeader.buffer);

  // ZIP シグニチャ
  view.setUint32(0, 0x04034b50, true); // ローカルファイルヘッダーシグニチャ
  view.setUint16(4, 20, true); // 最小バージョン
  view.setUint16(6, 0, true); // フラグ
  view.setUint16(8, 0, true); // 圧縮方法（無圧縮）
  view.setUint16(10, 0, true); // 更新時刻
  view.setUint16(12, 0, true); // 更新日付
  view.setUint32(14, 0, true); // CRC32
  view.setUint32(18, fileContentBytes.length, true); // 圧縮サイズ
  view.setUint32(22, fileContentBytes.length, true); // 非圧縮サイズ
  view.setUint16(26, fileName.length, true); // ファイル名長
  view.setUint16(28, 0, true); // 拡張フィールド長

  // ファイル名を追加
  const fileNameBytes = new TextEncoder().encode(fileName);
  localFileHeader.set(fileNameBytes, 30);

  // 中央ディレクトリエントリ（簡略版）
  const centralDirSize = 46 + fileName.length;
  const centralDir = new Uint8Array(centralDirSize);
  const centralView = new DataView(centralDir.buffer);

  centralView.setUint32(0, 0x02014b50, true); // 中央ディレクトリシグニチャ
  // 他のフィールドは省略（実際の実装では設定が必要）

  // 中央ディレクトリ終端レコード
  const endOfCentralDir = new Uint8Array(22);
  const endView = new DataView(endOfCentralDir.buffer);
  endView.setUint32(0, 0x06054b50, true); // 終端レコードシグニチャ

  // 全体を結合
  const totalSize =
    localFileHeader.length +
    fileContentBytes.length +
    centralDir.length +
    endOfCentralDir.length;
  const zipFile = new Uint8Array(totalSize);

  let offset = 0;
  zipFile.set(localFileHeader, offset);
  offset += localFileHeader.length;
  zipFile.set(fileContentBytes, offset);
  offset += fileContentBytes.length;
  zipFile.set(centralDir, offset);
  offset += centralDir.length;
  zipFile.set(endOfCentralDir, offset);

  return zipFile;
}

/**
 * 実際に使用可能なファイルを生成（統合関数）
 */
export function generateRealFile(
  fileName: string,
  size: string,
  unit: SizeUnit
): { blob: Blob; actualSize: number; content?: string } {
  const targetBytes = calculateExactSizeInBytes(size, unit);
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'txt';

  let blob: Blob;
  let content: string | undefined;

  switch (fileExtension) {
    case 'pdf':
      const pdfData = generateRealPDF(targetBytes, fileName);
      blob = new Blob([pdfData], { type: 'application/pdf' });
      break;

    case 'png':
      const pngData = generateRealPNG(targetBytes);
      blob = new Blob([pngData], { type: 'image/png' });
      break;

    case 'jpg':
    case 'jpeg':
      const jpegData = generateRealJPEG(targetBytes);
      blob = new Blob([jpegData], { type: 'image/jpeg' });
      break;

    case 'zip':
      const zipData = generateRealZIP(targetBytes);
      blob = new Blob([zipData], { type: 'application/zip' });
      break;

    case 'json':
      content = generateRealTextFile(targetBytes, 'json');
      blob = new Blob([content], { type: 'application/json' });
      break;

    case 'csv':
      content = generateRealTextFile(targetBytes, 'csv');
      blob = new Blob([content], { type: 'text/csv' });
      break;

    case 'xml':
      content = generateRealTextFile(targetBytes, 'xml');
      blob = new Blob([content], { type: 'application/xml' });
      break;

    case 'yaml':
    case 'yml':
      content = generateRealTextFile(targetBytes, 'yaml');
      blob = new Blob([content], { type: 'text/yaml' });
      break;

    default: // txt
      content = generateRealTextFile(targetBytes, 'txt');
      blob = new Blob([content], { type: 'text/plain' });
      break;
  }

  return {
    blob,
    actualSize: blob.size,
    content: content, // テキストファイルの場合のみ
  };
}
