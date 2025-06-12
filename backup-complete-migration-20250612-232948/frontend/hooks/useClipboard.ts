import { useCallback } from 'react';

export function useClipboard() {
  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('コピーエラー:', error);
      return false;
    }
  }, []);

  const pasteFromClipboard = useCallback(async (): Promise<string | null> => {
    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch (error) {
      console.error('貼り付けエラー:', error);
      return null;
    }
  }, []);

  return {
    copyToClipboard,
    pasteFromClipboard,
  };
} 