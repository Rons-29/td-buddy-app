import { useCallback, useEffect, useRef } from 'react';

/**
 * アクセシビリティ機能を提供するカスタムフック
 * スクリーンリーダー通知、フォーカス管理、キーボードナビゲーションをサポート
 */
export const useAccessibility = () => {
  const liveRegionRef = useRef<HTMLDivElement | null>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  /**
   * スクリーンリーダーにメッセージを通知
   * @param message 通知するメッセージ
   * @param priority 通知の優先度 ('polite' | 'assertive')
   */
  const announceToScreenReader = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      if (!liveRegionRef.current) {
        // Live regionが存在しない場合は動的に作成
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', priority);
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'td-live-region';
        document.body.appendChild(liveRegion);
        liveRegionRef.current = liveRegion;
      }

      // メッセージを設定
      if (liveRegionRef.current) {
        liveRegionRef.current.setAttribute('aria-live', priority);
        liveRegionRef.current.textContent = message;

        // メッセージをクリア（次の通知のため）
        setTimeout(() => {
          if (liveRegionRef.current) {
            liveRegionRef.current.textContent = '';
          }
        }, 1000);
      }
    },
    []
  );

  /**
   * 要素にフォーカスを移動
   * @param element フォーカス対象の要素
   * @param options フォーカスオプション
   */
  const manageFocus = useCallback(
    (
      element: HTMLElement | null,
      options: { preventScroll?: boolean; saveLastFocus?: boolean } = {}
    ) => {
      if (!element) return;

      const { preventScroll = false, saveLastFocus = true } = options;

      // 現在のフォーカス要素を保存
      if (saveLastFocus && document.activeElement instanceof HTMLElement) {
        lastFocusRef.current = document.activeElement;
      }

      // フォーカスを移動
      element.focus({ preventScroll });

      // フォーカスが移動したことを通知
      const elementLabel =
        element.getAttribute('aria-label') ||
        element.getAttribute('title') ||
        element.textContent?.trim() ||
        '要素';
      announceToScreenReader(`${elementLabel}にフォーカスが移動しました`);
    },
    [announceToScreenReader]
  );

  /**
   * 前回フォーカスしていた要素にフォーカスを戻す
   */
  const restoreLastFocus = useCallback(() => {
    if (lastFocusRef.current && document.body.contains(lastFocusRef.current)) {
      lastFocusRef.current.focus();
      lastFocusRef.current = null;
    }
  }, []);

  /**
   * データ醸造の進捗状況を通知
   * @param progress 進捗率 (0-100)
   * @param status 現在のステータス
   */
  const announceProgress = useCallback(
    (progress: number, status: string) => {
      const progressMessage = `データ醸造中：${Math.round(
        progress
      )}%完了。${status}`;
      announceToScreenReader(progressMessage, 'polite');
    },
    [announceToScreenReader]
  );

  /**
   * エラーメッセージを緊急度高で通知
   * @param error エラーメッセージ
   */
  const announceError = useCallback(
    (error: string) => {
      const errorMessage = `エラーが発生しました：${error}`;
      announceToScreenReader(errorMessage, 'assertive');
    },
    [announceToScreenReader]
  );

  /**
   * 成功メッセージを通知
   * @param message 成功メッセージ
   */
  const announceSuccess = useCallback(
    (message: string) => {
      const successMessage = `成功：${message}`;
      announceToScreenReader(successMessage, 'polite');
    },
    [announceToScreenReader]
  );

  /**
   * Brewキャラクターからのメッセージを通知
   * @param message ブリューからのメッセージ
   */
  const announceTDMessage = useCallback(
    (message: string) => {
      const brewMessage = `ブリューからのメッセージ：${message}`;
      announceToScreenReader(brewMessage, 'polite');
    },
    [announceToScreenReader]
  );

  // コンポーネントのクリーンアップ
  useEffect(() => {
    return () => {
      // Live regionを削除
      const existingLiveRegion = document.getElementById('td-live-region');
      if (existingLiveRegion) {
        document.body.removeChild(existingLiveRegion);
      }
    };
  }, []);

  return {
    announceToScreenReader,
    manageFocus,
    restoreLastFocus,
    announceProgress,
    announceError,
    announceSuccess,
    announceTDMessage,
  };
};

export default useAccessibility;
