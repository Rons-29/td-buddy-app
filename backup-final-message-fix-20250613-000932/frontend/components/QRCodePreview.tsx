'use client';

import React, { useState, useEffect } from 'react';
import { 
  generateQRCodeDataURL, 
  downloadQRCode, 
  validateQRCodeText, 
  getRecommendedQRSize,
  getTextTruncationInfo 
} from '../utils/qrCodeUtils';
import { useButtonState } from '../hooks/useButtonState';
import { useClipboard } from '../hooks/useClipboard';
import { ActionButton } from './ui/ActionButton';

interface QRCodePreviewProps {
  text: string;
  className?: string;
}

export function QRCodePreview({ text, className = '' }: QRCodePreviewProps) {
  const [qrSize, setQrSize] = useState(200);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);

  // カスタムフック使用
  const { buttonStates, setButtonActive } = useButtonState();
  const { copyToClipboard } = useClipboard();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (text) {
      const recommendedSize = getRecommendedQRSize(text);
      setQrSize(recommendedSize);
      setError(null);
      setImageError(false);
    }
  }, [text]);

  if (!mounted) {
    return <div className="text-center">読み込み中...</div>;
  }

  const validation = validateQRCodeText(text);
  const truncationInfo = getTextTruncationInfo(text);

  const handleDownload = async () => {
    if (!validation.isValid) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      await downloadQRCode(text, `qrcode-${timestamp}.png`, { size: qrSize });
      setButtonActive('download');
    } catch (error) {
      setError('ダウンロードに失敗しました');
      console.error('QRコードダウンロードエラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyURL = async () => {
    try {
      const qrUrl = generateQRCodeDataURL(text, { size: qrSize });
      await copyToClipboard(qrUrl);
      setButtonActive('copy');
      setError(null);
    } catch (error) {
      setError('URLのコピーに失敗しました');
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setError('QRコード画像の読み込みに失敗しました');
  };

  if (!text.trim()) {
    return (
      <div className={`bg-td-gray-50 rounded-lg p-6 text-center ${className}`}>
        <div className="text-4xl mb-2">📱</div>
        <p className="text-td-gray-500">テキストを入力するとQRコードが表示されます</p>
      </div>
    );
  }

  if (!validation.isValid) {
    return (
      <div className={`bg-td-error/10 border border-td-error/20 rounded-lg p-6 text-center ${className}`}>
        <div className="text-4xl mb-2">⚠️</div>
        <p className="text-td-error font-medium">{validation.error}</p>
        <p className="text-sm text-td-gray-600 mt-1">
          最大{validation.maxLength.toLocaleString()}文字まで
        </p>
      </div>
    );
  }

  const qrUrl = generateQRCodeDataURL(text, { size: qrSize });

  return (
    <div className={`bg-white rounded-lg border border-orange-200 p-6 ${className}`}>
      <div className="text-center">
        <h4 className="text-lg font-semibold text-orange-800 mb-4 flex items-center justify-center">
          📱 QRコード
        </h4>

        {/* 警告表示 */}
        {(validation.warnings || truncationInfo.wasTruncated) && (
          <div className="mb-4 p-3 bg-td-accent-50 border border-td-accent-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <span className="text-td-accent-600 text-lg">⚠️</span>
              <div className="text-left">
                {truncationInfo.wasTruncated && (
                  <p className="text-sm text-td-accent-800 mb-1">
                    <strong>テキストが切り詰められました</strong>
                  </p>
                )}
                {validation.warnings?.map((warning, index) => (
                  <p key={index} className="text-xs text-td-accent-700">
                    {warning}
                  </p>
                ))}
                {truncationInfo.wasTruncated && (
                  <p className="text-xs text-td-accent-600 mt-1">
                    元の長さ: {truncationInfo.originalLength.toLocaleString()}文字 → 
                    切り詰め後: {truncationInfo.safeLength.toLocaleString()}文字
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* QRコード画像 */}
        <div className="mb-4 flex justify-center">
          <div className="p-4 bg-white border border-td-gray-200 rounded-lg shadow-sm">
            {!imageError ? (
              <img 
                src={qrUrl}
                alt="生成されたQRコード"
                width={qrSize}
                height={qrSize}
                className="block"
                onError={handleImageError}
                onLoad={() => setImageError(false)}
              />
            ) : (
              <div 
                className="flex items-center justify-center bg-td-gray-100 border border-td-gray-300 rounded"
                style={{ width: qrSize, height: qrSize }}
              >
                <div className="text-center p-4">
                  <div className="text-2xl mb-2">❌</div>
                  <p className="text-xs text-td-gray-600">
                    QRコード生成<br />エラー
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* サイズ調整 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-td-gray-700 mb-2">
            サイズ: {qrSize}px
          </label>
          <input
            type="range"
            min="100"
            max="400"
            step="50"
            value={qrSize}
            onChange={(e) => {
              setQrSize(Number(e.target.value));
              setImageError(false); // サイズ変更時にエラー状態をリセット
            }}
            className="w-full h-2 bg-td-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-td-gray-500 mt-1">
            <span>100px</span>
            <span>250px</span>
            <span>400px</span>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <ActionButton
            type="download"
            onClick={handleDownload}
            isActive={buttonStates.download}
            disabled={isLoading || imageError}
            size="md"
          >
            {isLoading ? (
              <span className="flex items-center space-x-1">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>ダウンロード中...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1">
                <span>{buttonStates.download ? '✅' : '📥'}</span>
                <span>{buttonStates.download ? 'ダウンロード済み' : 'ダウンロード'}</span>
              </span>
            )}
          </ActionButton>
          
          <ActionButton
            type="copy"
            onClick={handleCopyURL}
            isActive={buttonStates.copy}
            disabled={imageError}
            size="md"
            variant="secondary"
          >
            <span className="flex items-center space-x-1">
              <span>{buttonStates.copy ? '✅' : '🔗'}</span>
              <span>{buttonStates.copy ? 'URL コピー済み' : 'URL をコピー'}</span>
            </span>
          </ActionButton>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="mt-3 p-2 bg-td-error/10 border border-td-error/20 rounded text-sm text-td-error">
            {error}
          </div>
        )}

        {/* 統計情報 */}
        <div className="mt-4 p-3 bg-td-gray-50 rounded border border-td-gray-200 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-td-gray-600">元の長さ:</span>
              <span className="ml-1 font-mono text-orange-700">{truncationInfo.originalLength}</span>
            </div>
            <div>
              <span className="text-td-gray-600">QR用長さ:</span>
              <span className="ml-1 font-mono text-orange-700">{truncationInfo.safeLength}</span>
            </div>
            <div>
              <span className="text-td-gray-600">推奨サイズ:</span>
              <span className="ml-1 font-mono text-orange-700">{getRecommendedQRSize(text)}px</span>
            </div>
            <div>
              <span className="text-td-gray-600">バイト数:</span>
              <span className="ml-1 font-mono text-orange-700">{new TextEncoder().encode(truncationInfo.truncatedText).length}</span>
            </div>
          </div>
        </div>

        {/* 切り詰められたテキストのプレビュー */}
        {truncationInfo.wasTruncated && (
          <div className="mt-3 p-3 bg-td-accent-50 rounded border border-td-accent-200">
            <h5 className="text-xs font-medium text-td-accent-800 mb-2">QRコード化されるテキスト:</h5>
            <div className="text-left bg-white p-2 rounded border text-xs font-mono text-td-gray-700 max-h-20 overflow-y-auto">
              {truncationInfo.truncatedText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 