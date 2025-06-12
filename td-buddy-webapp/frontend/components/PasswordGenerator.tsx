'use client';

import { Eye, EyeOff, Settings2 } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { APP_CONFIG, TD_MESSAGES } from '../lib/config';
import { generatePasswordsLocal } from '../lib/passwordUtils';
import {
  APIResponse,
  CustomCharset,
  PasswordCriteria,
  PasswordPreset,
  PasswordResult,
  TDState,
} from '../types/password';
import { CompositionSelector } from './CompositionSelector';
import { CustomCharsetsEditor } from './CustomCharsetsEditor';
import { CustomSymbolsInput } from './CustomSymbolsInput';
import BrewCharacter from './BrewCharacter';
import { ActionButton } from './ui/ActionButton';

export const PasswordGenerator: React.FC = () => {
  // 構成プリセット状態
  const [selectedPresetId, setSelectedPresetId] = useState<string>('other');
  const [customSymbols, setCustomSymbols] = useState<string>('$@_#&?');
  const [customCharsets, setCustomCharsets] = useState<CustomCharset[]>([]);

  // 設定状態（既存）
  const [criteria, setCriteria] = useState<PasswordCriteria>({
    length: 12,
    count: 3,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false,
    excludeAmbiguous: true,
    customCharacters: '',
  });

  // UI状態（既存）
  const [result, setResult] = useState<PasswordResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPasswords, setShowPasswords] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // コピー完了メッセージ用の状態を追加
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  // 大量生成用プログレス状態
  const [generationProgress, setGenerationProgress] = useState<{
    current: number;
    total: number;
    estimatedTimeLeft: number;
    speed: number;
  } | null>(null);

  // 大量データ表示用の状態
  const [displayLimit, setDisplayLimit] = useState(100); // 初期表示数
  const [showAllResults, setShowAllResults] = useState(false);

  // Brewキャラクター状態（既存）
  const [brewState, setBrewState] = useState<TDState>({
    emotion: 'happy',
    animation: 'float',
    message: APP_CONFIG.isOfflineMode
      ? TD_MESSAGES.OFFLINE_MODE
      : 'パスワード生成の準備ができました！構成プリセットをお選びください♪',
    showSpeechBubble: true,
  });

  // フォーム参照
  const customCharsRef = useRef<HTMLInputElement>(null);

  // プリセット変更時の処理
  const handlePresetChange = (presetId: string, preset: PasswordPreset) => {
    setSelectedPresetId(presetId);

    // プリセットの設定をcriteriaに反映
    if (preset.criteria) {
      setCriteria(prev => ({
        ...prev,
        ...preset.criteria,
        // プリセットに基づいて文字種を自動設定
        includeUppercase: shouldIncludeCharType(
          presetId,
          'uppercase',
          preset.criteria
        ),
        includeLowercase: shouldIncludeCharType(
          presetId,
          'lowercase',
          preset.criteria
        ),
        includeNumbers: shouldIncludeCharType(
          presetId,
          'numbers',
          preset.criteria
        ),
        includeSymbols: shouldIncludeCharType(
          presetId,
          'symbols',
          preset.criteria
        ),
      }));
    }

    // Brewキャラクターの反応
    setBrewState(prev => ({
      ...prev,
      emotion: 'happy',
      animation: 'bounce',
      message: `${preset.name}プリセットに変更しました♪ ${preset.description}`,
      showSpeechBubble: true,
    }));

    setTimeout(() => {
      setBrewState(prev => ({ ...prev, showSpeechBubble: false }));
    }, 3000);
  };

  // プリセットに基づいて文字種を自動判定する関数
  const shouldIncludeCharType = (
    presetId: string,
    charType: string,
    presetCriteria: any
  ): boolean => {
    // セキュリティ重視のプリセットでは全文字種を有効に
    if (
      ['high-security', 'enterprise-policy', 'num-upper-lower-symbol'].includes(
        presetId
      )
    ) {
      return true;
    }

    // Web標準系では記号以外を有効に
    if (['web-standard', 'num-upper-lower'].includes(presetId)) {
      return charType !== 'symbols';
    }

    // mustIncludeCharTypesが定義されている場合はそれに基づく
    if (presetCriteria?.mustIncludeCharTypes) {
      const typeMap: Record<string, string> = {
        uppercase: 'uppercase',
        lowercase: 'lowercase',
        numbers: 'numbers',
        symbols: 'symbols',
      };
      return presetCriteria.mustIncludeCharTypes.includes(typeMap[charType]);
    }

    // カスタム系では現在の設定を維持
    if (['custom-symbols', 'custom-charsets'].includes(presetId)) {
      return criteria[
        `include${
          charType.charAt(0).toUpperCase() + charType.slice(1)
        }` as keyof PasswordCriteria
      ] as boolean;
    }

    // デフォルトでは数字・大文字・小文字を有効に
    return charType !== 'symbols';
  };

  // 強度に応じた色とアイコン
  const getStrengthInfo = (strength: string) => {
    switch (strength) {
      case 'very-strong':
        return {
          color: 'text-green-600',
          bg: 'bg-green-100',
          icon: '🛡️',
          label: '非常に強い',
        };
      case 'strong':
        return {
          color: 'text-blue-600',
          bg: 'bg-blue-100',
          icon: '🔒',
          label: '強い',
        };
      case 'medium':
        return {
          color: 'text-yellow-600',
          bg: 'bg-yellow-100',
          icon: '⚠️',
          label: '普通',
        };
      case 'weak':
        return {
          color: 'text-red-600',
          bg: 'bg-red-100',
          icon: '⚡',
          label: '弱い',
        };
      default:
        return {
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          icon: '❓',
          label: '不明',
        };
    }
  };

  // パスワード生成API呼び出し（構成プリセット対応）
  const generatePasswords = async () => {
    setIsGenerating(true);
    setApiError(null);
    setResult(null);
    setGenerationProgress(null);

    const totalCount = criteria.count;
    const isLargeGeneration = totalCount > 50;

    // 文字セット検証とフォールバック処理
    const validateAndPrepareRequest = () => {
      // custom-charsets プリセットの場合の特別な検証
      if (selectedPresetId === 'custom-charsets') {
        // customCharsets が空またはすべて無効な場合
        const validCharsets = customCharsets.filter(
          cs => cs.enabled && cs.charset.length > 0
        );

        if (validCharsets.length === 0) {
          // デフォルトの安全な文字セットを提供
          console.warn(
            '🔧 ブリューが空の文字セットを検出し、デフォルト設定に変更します'
          );
          setBrewState(prev => ({
            ...prev,
            emotion: 'thinking',
            animation: 'wiggle',
            message: '文字セットが空のため、安全なデフォルト設定を適用します♪',
            showSpeechBubble: true,
          }));

          // 高セキュリティのデフォルト文字セット
          return {
            composition: 'enterprise-policy', // 安全なプリセットに変更
            useUppercase: true,
            useLowercase: true,
            useNumbers: true,
            useSymbols: true,
          };
        }

        // 有効な文字セットがある場合は通常通り
        return {
          composition: selectedPresetId,
          customCharsets: validCharsets,
          useUppercase: criteria.includeUppercase,
          useLowercase: criteria.includeLowercase,
          useNumbers: criteria.includeNumbers,
          useSymbols: criteria.includeSymbols,
        };
      }

      // custom-symbols プリセットの場合の検証
      if (selectedPresetId === 'custom-symbols') {
        if (!customSymbols || customSymbols.trim().length === 0) {
          console.warn(
            '🔧 TDがカスタム記号が空のため、デフォルト記号を適用します'
          );
          setBrewState(prev => ({
            ...prev,
            emotion: 'thinking',
            message: 'カスタム記号が空のため、標準記号を適用します♪',
            showSpeechBubble: true,
          }));

          return {
            composition: 'web-standard', // 安全なプリセットに変更
            useUppercase: true,
            useLowercase: true,
            useNumbers: true,
            useSymbols: true,
          };
        }

        return {
          composition: selectedPresetId,
          useUppercase: criteria.includeUppercase,
          useLowercase: criteria.includeLowercase,
          useNumbers: criteria.includeNumbers,
          useSymbols: criteria.includeSymbols,
        };
      }

      // 基本的な文字種チェック
      const hasAnyCharType =
        criteria.includeUppercase ||
        criteria.includeLowercase ||
        criteria.includeNumbers ||
        criteria.includeSymbols;

      if (!hasAnyCharType) {
        console.warn(
          '🔧 TDが文字種が選択されていないため、安全なデフォルトを適用します'
        );
        setBrewState(prev => ({
          ...prev,
          emotion: 'thinking',
          message: '文字種が選択されていないため、英数字を有効にします♪',
          showSpeechBubble: true,
        }));

        return {
          composition: selectedPresetId,
          useUppercase: true,
          useLowercase: true,
          useNumbers: true,
          useSymbols: false,
        };
      }

      // 通常の場合 - すべてのプリセット（high-security等）
      return {
        composition: selectedPresetId,
        useUppercase: criteria.includeUppercase,
        useLowercase: criteria.includeLowercase,
        useNumbers: criteria.includeNumbers,
        useSymbols: criteria.includeSymbols,
      };
    };

    const safeConfig = validateAndPrepareRequest();

    setBrewState(prev => ({
      ...prev,
      emotion: 'thinking',
      animation: 'wiggle',
      message: isLargeGeneration
        ? `${totalCount}個の大量生成を開始します！TDが頑張ります♪`
        : 'パスワードを生成中です... しばらくお待ちください♪',
      showSpeechBubble: true,
    }));

    try {
      // 大量生成の場合はチャンク処理
      if (isLargeGeneration) {
        await generatePasswordsInChunks(totalCount, safeConfig);
      } else {
        await generatePasswordsSingle(totalCount, safeConfig);
      }
    } catch (error) {
      console.error('パスワード生成エラー:', error);
      setApiError(
        error instanceof Error ? error.message : '不明なエラーが発生しました'
      );

      setBrewState(prev => ({
        ...prev,
        emotion: 'sad',
        animation: 'wiggle',
        message: 'エラーが発生しました... 設定を確認して再度お試しください',
        showSpeechBubble: true,
      }));
    } finally {
      setIsGenerating(false);
      setGenerationProgress(null);
    }
  };

  // 単発生成（50個以下）
  const generatePasswordsSingle = async (
    totalCount: number,
    safeConfig: any
  ) => {
    // オフラインモード時はローカル醸造
    if (APP_CONFIG.isOfflineMode) {
      const localResult = generatePasswordsLocal({
        length: criteria.length,
        count: totalCount,
        includeUppercase: safeConfig.useUppercase ?? criteria.includeUppercase,
        includeLowercase: safeConfig.useLowercase ?? criteria.includeLowercase,
        includeNumbers: safeConfig.useNumbers ?? criteria.includeNumbers,
        includeSymbols: safeConfig.useSymbols ?? criteria.includeSymbols,
        excludeAmbiguous: criteria.excludeAmbiguous,
        customSymbols:
          safeConfig.composition === 'custom-symbols'
            ? customSymbols
            : undefined,
      });

      setResult(localResult);

      // ブリューの成功反応
      setBrewState(prev => ({
        ...prev,
        emotion: 'excited',
        animation: 'heartbeat',
        message: `🍺 ローカル生成完了！${localResult.strength}強度のパスワードを${localResult.passwords.length}個醸造しました♪`,
        showSpeechBubble: true,
      }));

      setTimeout(() => {
        setBrewState(prev => ({ ...prev, showSpeechBubble: false }));
      }, 3000);
      return;
    }

    // API醸造（レガシー - バックエンド設定完了後に有効）
    const apiUrl = APP_CONFIG.getApiUrl(
      '/api/password/generate-with-composition'
    );
    if (!apiUrl) {
      throw new Error('API接続が利用できません');
    }

    const requestBody: any = {
      length: criteria.length,
      count: totalCount,
      composition: safeConfig.composition,
      excludeAmbiguous: criteria.excludeAmbiguous,
      excludeSimilar: true,
      useNumbers: safeConfig.useNumbers ?? criteria.includeNumbers,
      useUppercase: safeConfig.useUppercase ?? criteria.includeUppercase,
      useLowercase: safeConfig.useLowercase ?? criteria.includeLowercase,
      useSymbols: safeConfig.useSymbols ?? criteria.includeSymbols,
      ...(safeConfig.composition === 'custom-symbols' && { customSymbols }),
      ...(safeConfig.composition === 'custom-charsets' && {
        customCharsets: safeConfig.customCharsets,
      }),
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': `td-session-${Date.now()}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }

    const data: APIResponse = await response.json();
    setResult(data.data);

    // ブリューの成功反応
    setBrewState(prev => ({
      ...prev,
      emotion: 'excited',
      animation: 'heartbeat',
      message:
        data.brewMessage ||
        `${data.data.strength}強度のパスワードを${data.data.passwords.length}個醸造しました！`,
      showSpeechBubble: true,
    }));

    setTimeout(() => {
      setBrewState(prev => ({ ...prev, showSpeechBubble: false }));
    }, 3000);
  };

  // チャンク生成（大量生成用）
  const generatePasswordsInChunks = async (
    totalCount: number,
    safeConfig: any
  ) => {
    const chunkSize = 100; // 100個ずつ生成
    const chunks = Math.ceil(totalCount / chunkSize);
    const allPasswords: string[] = [];
    let combinedResult: PasswordResult | null = null;

    const startTime = Date.now();

    for (let i = 0; i < chunks; i++) {
      const currentChunkSize = Math.min(
        chunkSize,
        totalCount - allPasswords.length
      );
      const progress = {
        current: allPasswords.length,
        total: totalCount,
        estimatedTimeLeft: 0,
        speed: 0,
      };

      // 進捗とスピード計算
      if (i > 0) {
        const elapsed = (Date.now() - startTime) / 1000;
        progress.speed = Math.round(allPasswords.length / elapsed);
        progress.estimatedTimeLeft = Math.round(
          (totalCount - allPasswords.length) / progress.speed
        );
      }

      setGenerationProgress(progress);

      // ブリューの進捗メッセージ
      setBrewState(prev => ({
        ...prev,
        emotion: 'thinking',
        animation: i % 2 === 0 ? 'bounce' : 'wiggle',
        message: `生成中... ${allPasswords.length}/${totalCount} (${Math.round(
          (allPasswords.length / totalCount) * 100
        )}%) - 速度: ${progress.speed}個/秒`,
        showSpeechBubble: true,
      }));

      let chunkResult: PasswordResult;

      // オフラインモード時はローカル醸造
      if (APP_CONFIG.isOfflineMode) {
        const localResult = generatePasswordsLocal({
          length: criteria.length,
          count: currentChunkSize,
          includeUppercase:
            safeConfig.useUppercase ?? criteria.includeUppercase,
          includeLowercase:
            safeConfig.useLowercase ?? criteria.includeLowercase,
          includeNumbers: safeConfig.useNumbers ?? criteria.includeNumbers,
          includeSymbols: safeConfig.useSymbols ?? criteria.includeSymbols,
          excludeAmbiguous: criteria.excludeAmbiguous,
          customSymbols:
            safeConfig.composition === 'custom-symbols'
              ? customSymbols
              : undefined,
        });
        chunkResult = localResult;
      } else {
        // API醸造（レガシー - バックエンド設定完了後に有効）
        const apiUrl = APP_CONFIG.getApiUrl(
          '/api/password/generate-with-composition'
        );
        if (!apiUrl) {
          throw new Error('API接続が利用できません');
        }

        const requestBody: any = {
          length: criteria.length,
          count: currentChunkSize,
          composition: safeConfig.composition,
          excludeAmbiguous: criteria.excludeAmbiguous,
          excludeSimilar: true,
          useNumbers: safeConfig.useNumbers ?? criteria.includeNumbers,
          useUppercase: safeConfig.useUppercase ?? criteria.includeUppercase,
          useLowercase: safeConfig.useLowercase ?? criteria.includeLowercase,
          useSymbols: safeConfig.useSymbols ?? criteria.includeSymbols,
          ...(safeConfig.composition === 'custom-symbols' && { customSymbols }),
          ...(safeConfig.composition === 'custom-charsets' && {
            customCharsets: safeConfig.customCharsets,
          }),
        };

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Session-ID': `td-session-${Date.now()}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error?.message || `HTTP ${response.status}`
          );
        }

        const data: APIResponse = await response.json();
        chunkResult = data.data;
      }

      // 結果をマージ
      if (chunkResult) {
        allPasswords.push(...chunkResult.passwords);
        const firstGeneratedAt: string =
          combinedResult?.generatedAt || chunkResult.generatedAt;
        combinedResult = {
          passwords: allPasswords,
          strength: chunkResult.strength,
          estimatedCrackTime: chunkResult.estimatedCrackTime,
          criteria: chunkResult.criteria,
          generatedAt: firstGeneratedAt,
        };
        setResult(combinedResult);
      }

      // 少し待機（UIの更新時間を確保）
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // 最終完了メッセージ
    const totalTime = (Date.now() - startTime) / 1000;
    const avgSpeed = Math.round(totalCount / totalTime);

    setBrewState(prev => ({
      ...prev,
      emotion: 'excited',
      animation: 'heartbeat',
      message: APP_CONFIG.isOfflineMode
        ? `🎉 ${totalCount}個のローカル大量生成完了！平均速度: ${avgSpeed}個/秒 - お疲れさまでした♪`
        : `🎉 ${totalCount}個の大量生成完了！平均速度: ${avgSpeed}個/秒 - お疲れさまでした♪`,
      showSpeechBubble: true,
    }));

    setTimeout(() => {
      setBrewState(prev => ({ ...prev, showSpeechBubble: false }));
    }, 5000);
  };

  // クリップボードコピー
  const copyToClipboard = async (password: string, index: number) => {
    try {
      await navigator.clipboard.writeText(password);
      setCopiedIndex(index);

      // 結果エリア下部にメッセージ表示
      setCopyMessage(`✅ パスワード ${index + 1} をコピーしました！`);

      // Brewキャラクターにも軽く反応させる（オプション）
      setBrewState(prev => ({
        ...prev,
        emotion: 'happy',
        animation: 'bounce',
      }));

      setTimeout(() => {
        setCopiedIndex(null);
        setCopyMessage(null);
      }, 2000);
    } catch (error) {
      console.error('コピーエラー:', error);
      setCopyMessage('❌ コピーに失敗しました。手動でコピーしてください。');

      setTimeout(() => {
        setCopyMessage(null);
      }, 3000);
    }
  };

  // 全パスワードをコピー
  const copyAllPasswords = async () => {
    if (!result?.passwords) {
      return;
    }

    const allPasswords = result.passwords.join('\n');
    try {
      await navigator.clipboard.writeText(allPasswords);

      // 結果エリア下部にメッセージ表示
      setCopyMessage(
        `✅ ${result.passwords.length}個すべてのパスワードをコピーしました！`
      );

      // Brewキャラクターにも軽く反応させる（オプション）
      setBrewState(prev => ({
        ...prev,
        emotion: 'excited',
        animation: 'bounce',
      }));

      setTimeout(() => {
        setCopyMessage(null);
      }, 3000);
    } catch (error) {
      console.error('全コピーエラー:', error);
      setCopyMessage('❌ コピーに失敗しました。手動でコピーしてください。');

      setTimeout(() => {
        setCopyMessage(null);
      }, 4000);
    }
  };

  // 設定変更処理
  const handleCriteriaChange = (key: keyof PasswordCriteria, value: any) => {
    setCriteria(prev => ({ ...prev, [key]: value }));

    // カスタム文字が変更された場合のブリュー反応
    if (key === 'customCharacters' && value) {
      setBrewState(prev => ({
        ...prev,
        emotion: 'thinking',
        message:
          'カスタム文字を設定しました♪ より個性的なパスワードが醸造できますね！',
        showSpeechBubble: true,
      }));

      setTimeout(() => {
        setBrewState(prev => ({ ...prev, showSpeechBubble: false }));
      }, 2000);
    }
  };

  // プログレスバーコンポーネント
  const ProgressBar = () => {
    if (!generationProgress) {
      return null;
    }

    const percentage = Math.round(
      (generationProgress.current / generationProgress.total) * 100
    );
    const estimatedMinutes = Math.floor(
      generationProgress.estimatedTimeLeft / 60
    );
    const estimatedSeconds = generationProgress.estimatedTimeLeft % 60;

    return (
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium text-blue-800">
            大量生成中... ({generationProgress.current}/
            {generationProgress.total})
          </div>
          <div className="text-sm text-blue-600">{percentage}%</div>
        </div>

        {/* プログレスバー */}
        <div className="w-full bg-blue-200 rounded-full h-3 mb-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300 relative overflow-hidden"
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-2 gap-4 text-xs text-blue-700">
          <div>
            <div className="font-medium">生成速度</div>
            <div>{generationProgress.speed} 個/秒</div>
          </div>
          <div>
            <div className="font-medium">予想残り時間</div>
            <div>
              {estimatedMinutes > 0 ? `${estimatedMinutes}分` : ''}
              {estimatedSeconds}秒
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 大量データ表示最適化コンポーネント
  const OptimizedPasswordDisplay = ({ passwords }: { passwords: string[] }) => {
    const totalCount = passwords.length;
    const displayedPasswords = showAllResults
      ? passwords
      : passwords.slice(0, displayLimit);
    const hiddenCount = totalCount - displayedPasswords.length;

    return (
      <div>
        {/* 表示統計 */}
        {totalCount > displayLimit && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm text-yellow-800">
                <span className="font-medium">{displayedPasswords.length}</span>
                個表示中
                {hiddenCount > 0 && (
                  <span className="ml-2">（{hiddenCount}個非表示）</span>
                )}
              </div>
              <button
                onClick={() => setShowAllResults(!showAllResults)}
                className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-md text-sm hover:bg-yellow-300 transition-colors"
              >
                {showAllResults ? '一部のみ表示' : 'すべて表示'}
              </button>
            </div>
            {!showAllResults && (
              <div className="text-xs text-yellow-700 mt-1">
                ※大量データのため、パフォーマンス向上のため一部のみ表示しています
              </div>
            )}
          </div>
        )}

        {/* パスワードグリッド（最適化済み） */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {displayedPasswords.map((password, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <code className="font-mono text-sm truncate block">
                  {showPasswords ? password : '●'.repeat(password.length)}
                </code>
                <div className="text-xs text-gray-500 mt-1">
                  長さ: {password.length}文字
                </div>
              </div>
              <ActionButton
                type="copy"
                onClick={() => copyToClipboard(password, index)}
                isActive={copiedIndex === index}
                variant="secondary"
                size="sm"
                className="ml-3"
              />
            </div>
          ))}
        </div>

        {/* 大量データ用の表示制御 */}
        {totalCount > 100 && (
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-600 mb-2">
              表示制限: {displayLimit}個
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setDisplayLimit(50)}
                className={`px-3 py-1 rounded text-sm ${
                  displayLimit === 50
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                50個
              </button>
              <button
                onClick={() => setDisplayLimit(100)}
                className={`px-3 py-1 rounded text-sm ${
                  displayLimit === 100
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                100個
              </button>
              <button
                onClick={() => setDisplayLimit(500)}
                className={`px-3 py-1 rounded text-sm ${
                  displayLimit === 500
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                500個
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full mx-auto p-4 lg:p-6 space-y-6">
      {/* ヘッダー */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-amber-900 mb-2">
          🔐 QA Workbench パスワード生成
        </h1>
        <p className="text-amber-600">
          構成プリセット機能で、より実用的なパスワードを丁寧に醸造します
        </p>
      </div>

      {/* ブリューキャラクター */}
      <div className="flex justify-center">
        <BrewCharacter
          emotion={brewState.emotion}
          animation={brewState.animation}
          message={brewState.message}
          showSpeechBubble={brewState.showSpeechBubble}
          size="medium"
        />
      </div>

      {/* 設定エリア（フル幅） */}
      <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
        <h2 className="text-xl font-semibold mb-4">🎯 生成設定</h2>

        {/* 構成プリセット選択（フル幅） */}
        <CompositionSelector
          selectedPresetId={selectedPresetId}
          onPresetChange={handlePresetChange}
          className="mb-8"
        />

        {/* 基本設定（水平レイアウト） */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-6">
          {/* パスワード長 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              パスワード長
            </label>
            <input
              type="range"
              min="4"
              max="50"
              value={criteria.length}
              onChange={e =>
                handleCriteriaChange('length', parseInt(e.target.value))
              }
              className="w-full"
            />
            <div className="text-center text-sm text-gray-500 mt-1">
              {criteria.length}文字
            </div>
          </div>

          {/* 生成個数 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              生成個数
              {criteria.count > 100 && (
                <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">
                  大量生成
                </span>
              )}
            </label>
            <div className="space-y-2">
              {/* スライダー */}
              <input
                type="range"
                min="1"
                max="1000"
                value={criteria.count}
                onChange={e =>
                  handleCriteriaChange('count', parseInt(e.target.value))
                }
                className="w-full"
              />

              {/* 数値入力とクイック選択 */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={criteria.count}
                  onChange={e =>
                    handleCriteriaChange(
                      'count',
                      Math.min(Math.max(parseInt(e.target.value) || 1, 1), 1000)
                    )
                  }
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                />
                <span className="text-xs text-gray-500">個</span>

                {/* クイック選択ボタン */}
                <div className="flex gap-1">
                  {[10, 50, 100, 500].map(num => (
                    <button
                      key={num}
                      onClick={() => handleCriteriaChange('count', num)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        criteria.count === num
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* 醸造時間の目安表示 */}
              <div className="text-xs text-gray-500">
                {criteria.count <= 10 && '⚡ 高速醸造'}
                {criteria.count > 10 && criteria.count <= 50 && '🚀 標準醸造'}
                {criteria.count > 50 &&
                  criteria.count <= 200 &&
                  '⏳ 中規模醸造（数秒）'}
                {criteria.count > 200 && '🔄 大規模醸造（プログレス表示）'}
              </div>
            </div>
          </div>

          {/* 文字種選択 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              使用文字種
            </label>
            <div className="space-y-1">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={criteria.includeUppercase}
                  onChange={e =>
                    handleCriteriaChange('includeUppercase', e.target.checked)
                  }
                  className="mr-1.5"
                />
                大文字 (A-Z)
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={criteria.includeLowercase}
                  onChange={e =>
                    handleCriteriaChange('includeLowercase', e.target.checked)
                  }
                  className="mr-1.5"
                />
                小文字 (a-z)
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={criteria.includeNumbers}
                  onChange={e =>
                    handleCriteriaChange('includeNumbers', e.target.checked)
                  }
                  className="mr-1.5"
                />
                数字 (0-9)
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={criteria.includeSymbols}
                  onChange={e =>
                    handleCriteriaChange('includeSymbols', e.target.checked)
                  }
                  className="mr-1.5"
                />
                記号 (!@#$)
              </label>
            </div>
          </div>

          {/* 除外オプション */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              除外オプション
            </label>
            <div className="space-y-2">
              {/* 紛らわしい文字除外 */}
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={criteria.excludeAmbiguous}
                  onChange={e =>
                    handleCriteriaChange('excludeAmbiguous', e.target.checked)
                  }
                  className="mr-2 mt-0.5"
                />
                <div>
                  <span className="text-sm font-medium">
                    紛らわしい文字を除外
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    除外: i, l, 1, L, o, 0, O
                  </div>
                </div>
              </label>

              {/* 似ている文字除外 */}
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={criteria.excludeSimilar || false}
                  onChange={e =>
                    handleCriteriaChange('excludeSimilar', e.target.checked)
                  }
                  className="mr-2 mt-0.5"
                />
                <div>
                  <span className="text-sm font-medium">
                    似ている記号を除外
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    除外: {'{}'}, [], (), /\, '"`~
                  </div>
                </div>
              </label>

              {/* 連続文字除外 */}
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={criteria.excludeSequential || false}
                  onChange={e =>
                    handleCriteriaChange('excludeSequential', e.target.checked)
                  }
                  className="mr-2 mt-0.5"
                />
                <div>
                  <span className="text-sm font-medium">連続文字を避ける</span>
                  <div className="text-xs text-gray-500 mt-1">
                    abc, 123 などの連続を回避
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* 生成ボタン */}
          <div className="flex items-end">
            <ActionButton
              type="generate"
              onClick={generatePasswords}
              disabled={isGenerating}
              loading={isGenerating}
              variant="primary"
              size="lg"
              fullWidth={true}
              className="w-full"
            />
          </div>

          {/* プログレスバー */}
          <ProgressBar />
        </div>

        {/* 高度な設定ボタン */}
        <div className="flex justify-center">
          <ActionButton
            type="generate"
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="secondary"
            size="md"
            className="flex items-center gap-2"
          >
            <Settings2 className="w-4 h-4" />
            {showAdvanced ? '高度な設定を隠す' : '高度な設定を表示'}
          </ActionButton>
        </div>

        {/* 高度な設定パネル */}
        {showAdvanced && (
          <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg space-y-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              ⚙️ 高度な設定
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 文字品質設定 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">🔍 文字品質</h4>

                {/* 最小エントロピー設定 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    最小エントロピー（ビット）
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={criteria.minEntropy || 50}
                    onChange={e =>
                      handleCriteriaChange(
                        'minEntropy',
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-500 mt-1">
                    {criteria.minEntropy || 50}ビット
                  </div>
                </div>

                {/* 辞書攻撃対策 */}
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={criteria.avoidDictionary || false}
                    onChange={e =>
                      handleCriteriaChange('avoidDictionary', e.target.checked)
                    }
                    className="mr-2 mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-medium">辞書攻撃対策</span>
                    <div className="text-xs text-gray-500 mt-1">
                      一般的な単語パターンを避ける
                    </div>
                  </div>
                </label>
              </div>

              {/* 生成オプション */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">⚡ 生成オプション</h4>

                {/* 重複チェック */}
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={criteria.noDuplicates || false}
                    onChange={e =>
                      handleCriteriaChange('noDuplicates', e.target.checked)
                    }
                    className="mr-2 mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-medium">
                      重複パスワード除去
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      同じパスワードが生成されないよう保証
                    </div>
                  </div>
                </label>

                {/* 再試行回数 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    生成再試行回数
                  </label>
                  <select
                    value={criteria.maxRetries || 100}
                    onChange={e =>
                      handleCriteriaChange(
                        'maxRetries',
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value={10}>10回（高速）</option>
                    <option value={50}>50回（標準）</option>
                    <option value={100}>100回（推奨）</option>
                    <option value={1000}>1000回（最大品質）</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 詳細設定（カスタムプリセット用） */}
        {(selectedPresetId === 'custom-symbols' ||
          selectedPresetId === 'custom-charsets') && (
          <div className="border-t border-gray-200 pt-6">
            {/* カスタム記号設定 */}
            {selectedPresetId === 'custom-symbols' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  🎨 カスタム記号を設定
                </label>
                <CustomSymbolsInput
                  value={customSymbols}
                  onChange={setCustomSymbols}
                  showSuggestions={true}
                />
              </div>
            )}

            {/* カスタム文字種エディター */}
            {selectedPresetId === 'custom-charsets' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <CustomCharsetsEditor
                  charsets={customCharsets}
                  onChange={setCustomCharsets}
                  visible={true}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* エラー表示 */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600 mr-2">❌</div>
            <div>
              <h3 className="font-medium text-red-800">エラー</h3>
              <p className="text-red-700 text-sm">{apiError}</p>
            </div>
          </div>
        </div>
      )}

      {/* 生成結果（下部にフル幅表示） */}
      {result && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">🔐 生成結果</h2>
            <div className="flex items-center gap-2">
              <ActionButton
                type="replace"
                onClick={() => setShowPasswords(!showPasswords)}
                variant="secondary"
                size="sm"
              >
                {showPasswords ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </ActionButton>
              <ActionButton
                type="copy"
                onClick={copyAllPasswords}
                variant="primary"
                size="sm"
              />
            </div>
          </div>

          {/* 強度表示 */}
          <div className="mb-4">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                getStrengthInfo(result.strength).bg
              } ${getStrengthInfo(result.strength).color}`}
            >
              <span className="mr-1">
                {getStrengthInfo(result.strength).icon}
              </span>
              強度: {getStrengthInfo(result.strength).label}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              推定解読時間: {result.estimatedCrackTime}
            </p>
          </div>

          {/* パスワードリスト（グリッドレイアウト） */}
          <OptimizedPasswordDisplay passwords={result.passwords} />

          {/* 構成プリセット情報表示 */}
          {(result as any).composition && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <h4 className="font-medium text-blue-900 mb-2">
                ✅ 構成要件チェック
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {(result as any).composition.appliedRequirements.map(
                  (req: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm bg-white p-2 rounded"
                    >
                      <span className="text-blue-800">{req.name}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          req.satisfied
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {req.satisfied ? '✓ 満足' : '✗ 不足'} ({req.actualCount}
                        /{req.requiredCount})
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500">
            生成日時: {new Date(result.generatedAt).toLocaleString()}
          </div>

          {/* コピー完了メッセージ（結果エリア下部） */}
          {copyMessage && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center">
                <span className="text-green-800 font-medium">
                  {copyMessage}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
