import { BrewsEmotion, BrewsRole, BrewsState } from '@/types/brews';
import { getDefaultMessage } from '@/utils/brewsHelpers';
import { useCallback, useEffect, useState } from 'react';

interface UseBrewsTeamResult {
  currentBrews: BrewsRole;
  emotion: BrewsEmotion;
  message: string;
  isActive: boolean;
  switchBrews: (role: BrewsRole, newEmotion?: BrewsEmotion) => void;
  updateEmotion: (newEmotion: BrewsEmotion, customMessage?: string) => void;
  setMessage: (message: string) => void;
  resetToDefault: () => void;
  brewsHistory: BrewsState[];
}

export const useBrewsTeam = (
  initialRole: BrewsRole = 'support',
  initialEmotion: BrewsEmotion = 'happy'
): UseBrewsTeamResult => {
  const [currentBrews, setCurrentBrews] = useState<BrewsRole>(initialRole);
  const [emotion, setEmotion] = useState<BrewsEmotion>(initialEmotion);
  const [message, setCurrentMessage] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [brewsHistory, setBrewsHistory] = useState<BrewsState[]>([]);

  // 初期化時にデフォルトメッセージを設定
  useEffect(() => {
    if (!message) {
      const defaultMessage = getDefaultMessage(currentBrews, emotion);
      setCurrentMessage(defaultMessage);
    }
  }, [currentBrews, emotion, message]);

  // Brewsの切り替え
  const switchBrews = useCallback(
    (role: BrewsRole, newEmotion?: BrewsEmotion) => {
      const targetEmotion = newEmotion || 'happy';

      // 現在の状態を履歴に追加
      setBrewsHistory(prev => [
        ...prev,
        {
          role: currentBrews,
          emotion,
          message,
          isActive,
          lastAction: new Date(),
        },
      ]);

      setCurrentBrews(role);
      setEmotion(targetEmotion);
      setIsActive(true);

      // 新しい役割のデフォルトメッセージを設定
      const newMessage = getDefaultMessage(role, targetEmotion);
      setCurrentMessage(newMessage);
    },
    [currentBrews, emotion, message, isActive]
  );

  // 感情の更新
  const updateEmotion = useCallback(
    (newEmotion: BrewsEmotion, customMessage?: string) => {
      setEmotion(newEmotion);

      if (customMessage) {
        setCurrentMessage(customMessage);
      } else {
        const defaultMessage = getDefaultMessage(currentBrews, newEmotion);
        setCurrentMessage(defaultMessage);
      }
    },
    [currentBrews]
  );

  // メッセージの設定
  const setMessage = useCallback((newMessage: string) => {
    setCurrentMessage(newMessage);
  }, []);

  // デフォルト状態にリセット
  const resetToDefault = useCallback(() => {
    setCurrentBrews('support');
    setEmotion('happy');
    setIsActive(true);
    const defaultMessage = getDefaultMessage('support', 'happy');
    setCurrentMessage(defaultMessage);
  }, []);

  return {
    currentBrews,
    emotion,
    message,
    isActive,
    switchBrews,
    updateEmotion,
    setMessage,
    resetToDefault,
    brewsHistory,
  };
};
