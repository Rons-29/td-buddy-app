/**
 * QRコード生成ユーティリティ
 * QR Server APIを使用してQRコードを生成します
 */

export interface QRCodeOptions {
  size?: number;
  format?: 'png' | 'svg';
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
  color?: string;
  backgroundColor?: string;
}

/**
 * QRコード生成の実用的制限
 */
const QR_LIMITS = {
  // 実用的な制限（APIとブラウザの制限を考慮）
  MAX_LENGTH_BYTES: 2000,  // バイト数制限
  MAX_LENGTH_CHARS: 800,   // 文字数制限
  MAX_URL_LENGTH: 8000,    // URL全体の制限
  TRUNCATE_SUFFIX: '...',  // 切り詰め時の接尾辞
};

/**
 * テキストを安全な長さに切り詰め
 */
function truncateForQR(text: string): { text: string; wasTruncated: boolean } {
  if (!text) return { text: '', wasTruncated: false };

  // バイト数チェック
  const encoder = new TextEncoder();
  const originalBytes = encoder.encode(text).length;
  
  if (originalBytes <= QR_LIMITS.MAX_LENGTH_BYTES && text.length <= QR_LIMITS.MAX_LENGTH_CHARS) {
    return { text, wasTruncated: false };
  }

  // 安全な長さまで切り詰め
  let truncated = text;
  const suffix = QR_LIMITS.TRUNCATE_SUFFIX;
  
  // 文字数での切り詰め
  if (text.length > QR_LIMITS.MAX_LENGTH_CHARS) {
    truncated = text.substring(0, QR_LIMITS.MAX_LENGTH_CHARS - suffix.length) + suffix;
  }
  
  // バイト数での再チェック
  while (encoder.encode(truncated).length > QR_LIMITS.MAX_LENGTH_BYTES && truncated.length > suffix.length) {
    const targetLength = Math.max(0, truncated.length - suffix.length - 10);
    truncated = truncated.substring(0, targetLength) + suffix;
  }

  return { text: truncated, wasTruncated: true };
}

/**
 * テキストからQRコードのデータURLを生成
 */
export function generateQRCodeDataURL(
  text: string, 
  options: QRCodeOptions = {}
): string {
  const {
    size = 200,
    format = 'png',
    errorCorrection = 'M',
    margin = 1,
    color = '000000',
    backgroundColor = 'FFFFFF'
  } = options;

  // テキストを安全な長さに切り詰め
  const { text: safeText } = truncateForQR(text);

  // QR Server API (公開API) を使用
  const baseURL = 'https://api.qrserver.com/v1/create-qr-code/';
  const params = new URLSearchParams({
    data: safeText,
    size: `${size}x${size}`,
    format,
    ecc: errorCorrection,
    margin: margin.toString(),
    color,
    bgcolor: backgroundColor
  });

  const fullURL = `${baseURL}?${params.toString()}`;
  
  // URL長制限チェック
  if (fullURL.length > QR_LIMITS.MAX_URL_LENGTH) {
    console.warn('QRコードURL長制限に達しました:', fullURL.length);
    // さらに短いテキストで再試行
    const { text: shorterText } = truncateForQR(safeText.substring(0, 200));
    const shortParams = new URLSearchParams({
      data: shorterText,
      size: `${size}x${size}`,
      format,
      ecc: 'L', // エラー訂正レベルを下げる
      margin: '0',
      color,
      bgcolor: backgroundColor
    });
    return `${baseURL}?${shortParams.toString()}`;
  }

  return fullURL;
}

/**
 * QRコード画像をダウンロード
 */
export async function downloadQRCode(
  text: string, 
  filename: string = 'qrcode.png',
  options: QRCodeOptions = {}
): Promise<void> {
  try {
    const qrUrl = generateQRCodeDataURL(text, options);
    
    const response = await fetch(qrUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('QRコードダウンロードエラー:', error);
    throw new Error('QRコードのダウンロードに失敗しました');
  }
}

/**
 * テキストの長さに応じてQRコードサイズを推奨
 */
export function getRecommendedQRSize(text: string): number {
  const { text: safeText } = truncateForQR(text);
  const length = safeText.length;
  
  if (length <= 50) return 150;
  if (length <= 150) return 200;
  if (length <= 300) return 250;
  if (length <= 500) return 300;
  return 350;
}

/**
 * QRコード生成の制限チェック
 */
export function validateQRCodeText(text: string): {
  isValid: boolean;
  error?: string;
  maxLength: number;
  warnings?: string[];
} {
  const warnings: string[] = [];
  
  if (!text.trim()) {
    return {
      isValid: false,
      error: 'テキストが入力されていません',
      maxLength: QR_LIMITS.MAX_LENGTH_CHARS
    };
  }
  
  const { text: safeText, wasTruncated } = truncateForQR(text);
  
  if (wasTruncated) {
    warnings.push(`テキストが長すぎるため、${safeText.length}文字に切り詰められます`);
  }
  
  // 絶対的な制限チェック
  if (safeText.length === 0) {
    return {
      isValid: false,
      error: 'テキストが長すぎてQRコードを生成できません',
      maxLength: QR_LIMITS.MAX_LENGTH_CHARS
    };
  }
  
  return {
    isValid: true,
    maxLength: QR_LIMITS.MAX_LENGTH_CHARS,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * テキスト切り詰め情報を取得
 */
export function getTextTruncationInfo(text: string): {
  originalLength: number;
  safeLength: number;
  wasTruncated: boolean;
  truncatedText: string;
} {
  const { text: truncatedText, wasTruncated } = truncateForQR(text);
  
  return {
    originalLength: text.length,
    safeLength: truncatedText.length,
    wasTruncated,
    truncatedText
  };
}

/**
 * QRコードプレビュー用のコンポーネントプロパティ
 */
export interface QRCodePreviewProps {
  text: string;
  size?: number;
  showDownload?: boolean;
  className?: string;
} 