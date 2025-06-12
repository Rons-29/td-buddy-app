import { useState, useCallback } from 'react';

export type ButtonType = 'copy' | 'clear' | 'replace' | 'paste' | 'generate' | 'download';

interface ButtonStates {
  copy: boolean;
  clear: boolean;
  replace: boolean;
  paste: boolean;
  generate: boolean;
  download: boolean;
}

export function useButtonState(resetDelay: number = 2000) {
  const [buttonStates, setButtonStates] = useState<ButtonStates>({
    copy: false,
    clear: false,
    replace: false,
    paste: false,
    generate: false,
    download: false,
  });

  const setButtonActive = useCallback((buttonType: ButtonType) => {
    setButtonStates(prev => ({ ...prev, [buttonType]: true }));
    
    // 指定時間後に自動リセット
    setTimeout(() => {
      setButtonStates(prev => ({ ...prev, [buttonType]: false }));
    }, resetDelay);
  }, [resetDelay]);

  const resetAllButtons = useCallback(() => {
    setButtonStates({
      copy: false,
      clear: false,
      replace: false,
      paste: false,
      generate: false,
      download: false,
    });
  }, []);

  return {
    buttonStates,
    setButtonActive,
    resetAllButtons,
  };
} 