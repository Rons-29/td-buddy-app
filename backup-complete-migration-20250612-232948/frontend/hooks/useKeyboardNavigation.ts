import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * タブナビゲーション用のキーボードハンドリング
 */
export const useTabNavigation = (tabIds: string[]) => {
  const [focusedTabIndex, setFocusedTabIndex] = useState(0);
  const tabRefs = useRef<(HTMLElement | null)[]>([]);

  /**
   * タブのキーボードイベントハンドラ
   */
  const handleTabKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          setFocusedTabIndex(prev => (prev + 1) % tabIds.length);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          setFocusedTabIndex(
            prev => (prev - 1 + tabIds.length) % tabIds.length
          );
          break;
        case 'Home':
          event.preventDefault();
          setFocusedTabIndex(0);
          break;
        case 'End':
          event.preventDefault();
          setFocusedTabIndex(tabIds.length - 1);
          break;
      }
    },
    [tabIds.length]
  );

  /**
   * タブ要素の参照を設定
   */
  const setTabRef = useCallback(
    (index: number, element: HTMLElement | null) => {
      tabRefs.current[index] = element;
    },
    []
  );

  /**
   * フォーカスされたタブに実際にフォーカスを移動
   */
  useEffect(() => {
    const focusedTab = tabRefs.current[focusedTabIndex];
    if (focusedTab) {
      focusedTab.focus();
    }
  }, [focusedTabIndex]);

  return {
    focusedTabIndex,
    setFocusedTabIndex,
    handleTabKeyDown,
    setTabRef,
  };
};

/**
 * リスト系コンポーネント用のキーボードナビゲーション
 */
export const useListNavigation = (
  items: string[],
  onSelect?: (index: number) => void
) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  /**
   * リストのキーボードイベントハンドラ
   */
  const handleListKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev => Math.min(prev + 1, items.length - 1));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Home':
          event.preventDefault();
          setFocusedIndex(0);
          break;
        case 'End':
          event.preventDefault();
          setFocusedIndex(items.length - 1);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (onSelect) {
            onSelect(focusedIndex);
          }
          break;
      }
    },
    [items.length, onSelect, focusedIndex]
  );

  /**
   * アイテム要素の参照を設定
   */
  const setItemRef = useCallback(
    (index: number, element: HTMLElement | null) => {
      itemRefs.current[index] = element;
    },
    []
  );

  /**
   * フォーカスされたアイテムに実際にフォーカスを移動
   */
  useEffect(() => {
    const focusedItem = itemRefs.current[focusedIndex];
    if (focusedItem) {
      focusedItem.focus();
    }
  }, [focusedIndex]);

  return {
    focusedIndex,
    setFocusedIndex,
    handleListKeyDown,
    setItemRef,
  };
};

/**
 * モーダル・ダイアログ用のフォーカストラップ
 */
export const useFocusTrap = (isOpen: boolean) => {
  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  /**
   * フォーカス可能な要素を取得
   */
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];

    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"]):not([disabled])',
    ].join(', ');

    return Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];
  }, []);

  /**
   * フォーカストラップのキーボードハンドラ
   */
  const handleTrapKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab (逆方向)
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab (順方向)
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    },
    [getFocusableElements]
  );

  /**
   * Escapeキーでモーダルを閉じる
   */
  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      // この関数は外部から提供される onClose を呼び出す必要がある
      // 実際の実装では onClose プロパティを受け取る
    }
  }, []);

  /**
   * モーダルが開いたときの処理
   */
  useEffect(() => {
    if (!isOpen) return;

    // 現在のフォーカス要素を保存
    previousActiveElement.current = document.activeElement as HTMLElement;

    // 最初のフォーカス可能要素にフォーカス
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // イベントリスナーを追加
    document.addEventListener('keydown', handleTrapKeyDown);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      // クリーンアップ
      document.removeEventListener('keydown', handleTrapKeyDown);
      document.removeEventListener('keydown', handleEscapeKey);

      // 前のフォーカス要素に戻す
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, getFocusableElements, handleTrapKeyDown, handleEscapeKey]);

  return {
    containerRef,
    getFocusableElements,
  };
};

/**
 * 汎用キーボードショートカット
 */
export const useKeyboardShortcuts = (shortcuts: Record<string, () => void>) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + キーの組み合わせを処理
      const isModifierPressed = event.ctrlKey || event.metaKey;

      Object.entries(shortcuts).forEach(([shortcut, handler]) => {
        const [modifier, key] = shortcut.split('+');

        if (
          modifier === 'ctrl' &&
          isModifierPressed &&
          event.key.toLowerCase() === key.toLowerCase()
        ) {
          event.preventDefault();
          handler();
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

export default {
  useTabNavigation,
  useListNavigation,
  useFocusTrap,
  useKeyboardShortcuts,
};
