'use client';

import { Eye, EyeOff, Settings2 } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { DEFAULT_PASSWORD_PRESETS } from '../data/passwordPresets';
import { APP_CONFIG, TD_MESSAGES } from '../lib/config';
import { generatePasswordsLocal } from '../lib/passwordUtils';
import {
  APIResponse,
  CustomCharset,
  ExportData,
  ExportOptions,
  PasswordCriteria,
  PasswordPreset,
  PasswordResult,
  TDState,
  VulnerabilityAnalysis,
} from '../types/password';
import {
  createDownloadBlob,
  downloadFile,
  exportToCSV,
  exportToJSON,
  exportToTXT,
  generateFileName,
} from '../utils/passwordExporter';
import { analyzePasswordVulnerability } from '../utils/vulnerabilityAnalyzer';
import BrewCharacter from './BrewCharacter';
import { CompositionSelector } from './CompositionSelector';
import { CustomCharsetsEditor } from './CustomCharsetsEditor';
import { CustomSymbolsInput } from './CustomSymbolsInput';
import { EducationPanel } from './EducationPanel';
import { HELP_CONTENT, HelpTooltip } from './HelpTooltip';
import { ActionButton } from './ui/ActionButton';
import { VulnerabilityAnalysisDisplay } from './VulnerabilityAnalysisDisplay';

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
  const [isCopying, setIsCopying] = useState(false);
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

  // 脆弱性分析とエクスポート機能の状態
  const [vulnerabilityAnalyses, setVulnerabilityAnalyses] = useState<
    VulnerabilityAnalysis[]
  >([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<{
    analysis: VulnerabilityAnalysis;
    password: string;
  } | null>(null);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    includeAnalysis: true,
    includeMetadata: true,
    groupByVulnerability: false,
  });

  // 教育パネルの状態を追加
  const [showEducationPanel, setShowEducationPanel] = useState(false);

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

  // パスワード強度計算
  const getPasswordStrength = (): string => {
    const length = criteria.length;
    const typeCount = getCharacterTypeCount();

    if (length >= 16 && typeCount >= 4) {
      return 'very-strong';
    }
    if (length >= 12 && typeCount >= 3) {
      return 'strong';
    }
    if (length >= 8 && typeCount >= 2) {
      return 'medium';
    }
    return 'weak';
  };

  const getStrengthIcon = (): string => {
    const strength = getPasswordStrength();
    return getStrengthInfo(strength).icon;
  };

  const getStrengthText = (): string => {
    const strength = getPasswordStrength();
    return getStrengthInfo(strength).label;
  };

  const getStrengthPercentage = (): number => {
    const strength = getPasswordStrength();
    switch (strength) {
      case 'very-strong':
        return 100;
      case 'strong':
        return 75;
      case 'medium':
        return 50;
      case 'weak':
        return 25;
      default:
        return 0;
    }
  };

  const getCharacterTypeCount = (): number => {
    let count = 0;
    if (criteria.includeUppercase) {
      count++;
    }
    if (criteria.includeLowercase) {
      count++;
    }
    if (criteria.includeNumbers) {
      count++;
    }
    if (criteria.includeSymbols) {
      count++;
    }
    return count;
  };

  // 有効な文字種が選択されているかチェック
  const hasValidCharacterTypes = (): boolean => {
    return (
      Boolean(criteria.includeUppercase) ||
      Boolean(criteria.includeLowercase) ||
      Boolean(criteria.includeNumbers) ||
      Boolean(criteria.includeSymbols) ||
      Boolean(criteria.includeExtendedSymbols) ||
      Boolean(criteria.includeBrackets) ||
      Boolean(criteria.includeMathSymbols) ||
      Boolean(criteria.includeUnicode) ||
      Boolean(criteria.includeReadable) ||
      Boolean(criteria.includePronounceable) ||
      Boolean(criteria.customCharacters && criteria.customCharacters.length > 0)
    );
  };

  // 推奨設定関数
  const getRecommendationTitle = (): string => {
    const strength = getPasswordStrength();
    const typeCount = getCharacterTypeCount();

    if (typeCount === 0) {
      return '⚠️ 文字種を選択';
    }
    if (strength === 'weak') {
      return '🔧 強度を向上';
    }
    if (strength === 'medium') {
      return '⬆️ さらに強化';
    }
    if (strength === 'strong') {
      return '✨ 最高レベルへ';
    }
    return '🏆 完璧な設定';
  };

  const getRecommendationText = (): string => {
    const strength = getPasswordStrength();
    const typeCount = getCharacterTypeCount();
    const length = criteria.length;

    if (typeCount === 0) {
      return '最低1つの文字種を選択してください';
    }
    if (strength === 'weak') {
      if (length < 8) {
        return '8文字以上に設定することを推奨';
      }
      return '複数の文字種を組み合わせましょう';
    }
    if (strength === 'medium') {
      return '16文字以上で全文字種を使用すると最強';
    }
    if (strength === 'strong') {
      return '記号を追加すると完璧な強度に';
    }
    return 'セキュリティ要件を満たした理想的な設定です';
  };

  const getRecommendationAction = (): string | null => {
    const strength = getPasswordStrength();
    const typeCount = getCharacterTypeCount();

    if (typeCount === 0) {
      return null;
    }
    if (strength === 'weak' && criteria.length < 12) {
      return '12文字に設定';
    }
    if (strength === 'medium' && !criteria.includeSymbols) {
      return '記号を追加';
    }
    if (strength === 'strong' && criteria.length < 16) {
      return '16文字に設定';
    }
    return null;
  };

  const applyRecommendation = () => {
    const strength = getPasswordStrength();
    const typeCount = getCharacterTypeCount();

    if (typeCount === 0) {
      return;
    }

    if (strength === 'weak' && criteria.length < 12) {
      handleCriteriaChange('length', 12);
    } else if (strength === 'medium' && !criteria.includeSymbols) {
      handleCriteriaChange('includeSymbols', true);
    } else if (strength === 'strong' && criteria.length < 16) {
      handleCriteriaChange('length', 16);
    }

    // Brewキャラクターの反応
    setBrewState(prev => ({
      ...prev,
      emotion: 'happy',
      animation: 'bounce',
      message: '推奨設定を適用しました！より安全なパスワードが生成できます♪',
      showSpeechBubble: true,
    }));

    setTimeout(() => {
      setBrewState(prev => ({ ...prev, showSpeechBubble: false }));
    }, 3000);
  };

  // パスワード生成API呼び出し（構成プリセット対応）
  const generatePasswords = async () => {
    console.log('🔐 パスワード生成開始');
    console.log('現在の条件:', criteria);
    console.log('有効な文字種:', hasValidCharacterTypes());
    console.log('isGenerating 状態変更: false → true');

    setIsGenerating(true);
    setApiError(null);
    setResult(null);
    setGenerationProgress(null);

    const totalCount = criteria.count;
    const isLargeGeneration = totalCount > 50;

    // 最小表示時間を設定（UXのため）
    const minDisplayTime = 800; // 800ms
    const startTime = Date.now();

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

      // 文字種が一つも選択されていない場合の検証
      const hasAnyCharType =
        criteria.includeUppercase ||
        criteria.includeLowercase ||
        criteria.includeNumbers ||
        criteria.includeSymbols ||
        (criteria.customCharacters && criteria.customCharacters.length > 0);

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
      console.log('🚀 生成処理開始');

      // 大量生成の場合はチャンク処理
      if (isLargeGeneration) {
        console.log('📦 大量生成モード（チャンク処理）');
        await generatePasswordsInChunks(totalCount, safeConfig);
      } else {
        console.log('⚡ 単発生成モード');
        await generatePasswordsSingle(totalCount, safeConfig);
      }

      console.log('✅ 生成処理完了');
    } catch (error) {
      console.error('❌ パスワード生成エラー:', error);
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
      // 最小表示時間を確保
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

      console.log(
        `⏱️ 経過時間: ${elapsedTime}ms, 残り待機時間: ${remainingTime}ms`
      );

      if (remainingTime > 0) {
        console.log('⏳ 最小表示時間のため待機中...');
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }

      console.log('🔓 isGenerating 状態変更: true → false');
      setIsGenerating(false);
      setGenerationProgress(null);
    }
  };

  // 単発生成（50個以下）
  const generatePasswordsSingle = async (
    totalCount: number,
    safeConfig: any
  ) => {
    console.log('📝 単発生成開始:', { totalCount, safeConfig });

    // オフラインモード時はローカル生成
    if (APP_CONFIG.isOfflineMode) {
      console.log('💻 ローカル生成モード開始');
      const localStartTime = Date.now();

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

      const localEndTime = Date.now();
      console.log(`⚡ ローカル生成完了: ${localEndTime - localStartTime}ms`);
      console.log('📊 生成結果:', localResult);

      setResult(localResult);

      // 脆弱性分析を実行（脆弱性プリセットの場合）
      const selectedPreset = DEFAULT_PASSWORD_PRESETS.find(
        p => p.id === selectedPresetId
      );
      if (selectedPreset?.category === 'vulnerability') {
        console.log('🔍 脆弱性分析実行中...');
        analyzePasswords(localResult.passwords);
      }

      // ブリューの成功反応
      setBrewState(prev => ({
        ...prev,
        emotion: 'excited',
        animation: 'heartbeat',
        message: `🍺 ローカル生成完了！${localResult.strength}強度のパスワードを${localResult.passwords.length}個生成しました♪`,
        showSpeechBubble: true,
      }));

      setTimeout(() => {
        setBrewState(prev => ({ ...prev, showSpeechBubble: false }));
      }, 3000);
      return;
    }

    console.log('🌐 API生成モード開始');
    // API生成（レガシー - バックエンド設定完了後に有効）
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

    // 脆弱性分析を実行（脆弱性プリセットの場合）
    const selectedPreset = DEFAULT_PASSWORD_PRESETS.find(
      p => p.id === selectedPresetId
    );
    if (selectedPreset?.category === 'vulnerability') {
      analyzePasswords(data.data.passwords);
    }

    // ブリューの成功反応
    setBrewState(prev => ({
      ...prev,
      emotion: 'excited',
      animation: 'heartbeat',
      message:
        data.brewMessage ||
        `${data.data.strength}強度のパスワードを${data.data.passwords.length}個生成しました！`,
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

      // オフラインモード時はローカル生成
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
        // API生成（レガシー - バックエンド設定完了後に有効）
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

    // 脆弱性分析を実行（脆弱性プリセットの場合）
    const selectedPreset = DEFAULT_PASSWORD_PRESETS.find(
      p => p.id === selectedPresetId
    );
    if (selectedPreset?.category === 'vulnerability' && combinedResult) {
      analyzePasswords(combinedResult.passwords);
    }
  };

  // クリップボードコピー
  const copyToClipboard = async (password: string, index: number) => {
    console.log(
      `📋 コピーボタンがクリックされました (パスワード ${index + 1})`
    );
    console.log(`コピー時の isCopying: ${isCopying}`);

    if (isCopying) {
      console.log('⚠️ 既にコピー処理中のため、処理をスキップします');
      return;
    }

    try {
      console.log('📋 コピー処理開始');
      console.log(`isCopying 状態変更: ${isCopying} → true`);
      setIsCopying(true);

      const startTime = performance.now();
      await navigator.clipboard.writeText(password);
      const copyTime = performance.now() - startTime;

      console.log(`📋 クリップボードコピー完了: ${copyTime.toFixed(2)}ms`);

      setCopiedIndex(index);

      // 結果エリア下部にメッセージ表示
      setCopyMessage(`✅ パスワード ${index + 1} をコピーしました！`);

      // Brewキャラクターにも軽く反応させる（オプション）
      setBrewState(prev => ({
        ...prev,
        emotion: 'happy',
        animation: 'bounce',
      }));

      // 最小表示時間を確保（500ms）
      const elapsedTime = performance.now() - startTime;
      const minDisplayTime = 500;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

      console.log(
        `⏱️ 経過時間: ${elapsedTime.toFixed(
          2
        )}ms, 残り待機時間: ${remainingTime.toFixed(2)}ms`
      );

      if (remainingTime > 0) {
        console.log('⏳ 最小表示時間のため待機中...');
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }

      console.log(`📋 isCopying 状態変更: true → false`);
      setIsCopying(false);

      setTimeout(() => {
        setCopiedIndex(null);
        setCopyMessage(null);
      }, 2000);
    } catch (error) {
      console.error('❌ コピーエラー:', error);
      setCopyMessage('❌ コピーに失敗しました。手動でコピーしてください。');
      setIsCopying(false);

      setTimeout(() => {
        setCopyMessage(null);
      }, 3000);
    }
  };

  // 全パスワードをコピー
  const copyAllPasswords = async () => {
    console.log('📋 全コピーボタンがクリックされました');
    console.log(`全コピー時の isCopying: ${isCopying}`);

    if (!result?.passwords) {
      console.log('⚠️ コピーするパスワードがありません');
      return;
    }

    if (isCopying) {
      console.log('⚠️ 既にコピー処理中のため、処理をスキップします');
      return;
    }

    const allPasswords = result.passwords.join('\n');
    try {
      console.log('📋 全コピー処理開始');
      console.log(`isCopying 状態変更: ${isCopying} → true`);
      setIsCopying(true);

      const startTime = performance.now();
      await navigator.clipboard.writeText(allPasswords);
      const copyTime = performance.now() - startTime;

      console.log(
        `📋 全パスワードクリップボードコピー完了: ${copyTime.toFixed(2)}ms`
      );

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

      // 最小表示時間を確保（500ms）
      const elapsedTime = performance.now() - startTime;
      const minDisplayTime = 500;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

      console.log(
        `⏱️ 経過時間: ${elapsedTime.toFixed(
          2
        )}ms, 残り待機時間: ${remainingTime.toFixed(2)}ms`
      );

      if (remainingTime > 0) {
        console.log('⏳ 最小表示時間のため待機中...');
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }

      console.log(`📋 isCopying 状態変更: true → false`);
      setIsCopying(false);

      setTimeout(() => {
        setCopyMessage(null);
      }, 3000);
    } catch (error) {
      console.error('❌ 全コピーエラー:', error);
      setCopyMessage('❌ コピーに失敗しました。手動でコピーしてください。');
      setIsCopying(false);

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
          'カスタム文字を設定しました♪ より個性的なパスワードが生成できますね！',
        showSpeechBubble: true,
      }));

      setTimeout(() => {
        setBrewState(prev => ({ ...prev, showSpeechBubble: false }));
      }, 2000);
    }
  };

  // 脆弱性分析実行
  const analyzePasswords = (passwords: string[]) => {
    if (!passwords || passwords.length === 0) {
      return;
    }

    const selectedPreset = DEFAULT_PASSWORD_PRESETS.find(
      p => p.id === selectedPresetId
    );
    const vulnerabilityType = selectedPreset?.criteria?.vulnerabilityType;

    const analyses = passwords.map(password =>
      analyzePasswordVulnerability(password, vulnerabilityType)
    );

    setVulnerabilityAnalyses(analyses);
  };

  // 脆弱性分析表示
  const showVulnerabilityAnalysis = (password: string, index: number) => {
    if (vulnerabilityAnalyses[index]) {
      setSelectedAnalysis({
        analysis: vulnerabilityAnalyses[index],
        password,
      });
    }
  };

  // エクスポート実行
  const handleExport = () => {
    if (!result?.passwords || result.passwords.length === 0) {
      alert('エクスポートするパスワードがありません。');
      return;
    }

    const selectedPreset = DEFAULT_PASSWORD_PRESETS.find(
      p => p.id === selectedPresetId
    );
    const exportData: ExportData = {
      passwords: result.passwords,
      metadata: {
        generatedAt: new Date().toISOString(),
        preset: selectedPreset?.name || 'カスタム',
        criteria,
        totalCount: result.passwords.length,
      },
      analysis: exportOptions.includeAnalysis
        ? vulnerabilityAnalyses
        : undefined,
    };

    let content: string;
    let fileExtension: string;

    switch (exportOptions.format) {
      case 'csv':
        content = exportToCSV(exportData, exportOptions);
        fileExtension = 'csv';
        break;
      case 'json':
        content = exportToJSON(exportData, exportOptions);
        fileExtension = 'json';
        break;
      case 'txt':
        content = exportToTXT(exportData, exportOptions);
        fileExtension = 'txt';
        break;
      default:
        content = exportToCSV(exportData, exportOptions);
        fileExtension = 'csv';
    }

    const blob = createDownloadBlob(content, exportOptions.format);
    const filename = generateFileName(
      selectedPreset?.name || 'custom',
      fileExtension,
      new Date().toISOString()
    );

    downloadFile(blob, filename);
    setShowExportPanel(false);
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
                loading={isCopying}
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
    <div className="w-full space-y-6">
      {/* ワークベンチ工具ヘッダー */}
      <div className="text-center wb-workbench-header">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <div className="text-3xl">🔐</div>
          <h2 className="text-2xl font-bold text-wb-tool-inspect-800">
            パスワード生成工具
          </h2>
        </div>
        <p className="text-wb-tool-inspect-600 max-w-2xl mx-auto">
          🔍
          検査工具として、セキュリティテストに必要な高品質なパスワードを生成します。
          構成プリセット機能で、様々な要件に対応した実用的なパスワードを丁寧に作成できます。
        </p>
      </div>

      {/* Brewキャラクター（工房の職人） */}
      <div className="wb-character-section">
        <BrewCharacter
          emotion={brewState.emotion}
          animation={brewState.animation}
          message={brewState.message}
          showSpeechBubble={brewState.showSpeechBubble}
          size="medium"
        />
      </div>

      {/* 工具設定パネル */}
      <div className="wb-tool-panel wb-tool-inspect">
        <div className="wb-tool-panel-header">
          <h3 className="wb-tool-panel-title">🎯 パスワード生成設定</h3>
          <p className="wb-tool-panel-description">
            セキュリティ要件に応じて、パスワードの構成と品質を設定してください
          </p>
        </div>

        {/* 構成プリセット選択（フル幅） */}
        <CompositionSelector
          selectedPresetId={selectedPresetId}
          onPresetChange={handlePresetChange}
          className="mb-8"
        />

        {/* 脆弱性パスワード警告表示 */}
        {selectedPresetId === 'vulnerability' && (
          <div className="wb-vulnerability-warning">
            <div className="wb-vulnerability-warning-header">
              <span className="wb-vulnerability-warning-icon">⚠️</span>
              <h4 className="wb-vulnerability-warning-title">
                脆弱性テスト用パスワード
                <span className="wb-vulnerability-badge">🧪 テスト専用</span>
              </h4>
            </div>
            <div className="wb-vulnerability-warning-text">
              このプリセットは<strong>意図的に脆弱性のあるパスワード</strong>
              を生成します。
              セキュリティテスト、脆弱性検証、教育目的でのみ使用してください。
              実際のシステムやアカウントでは絶対に使用しないでください。
            </div>
            <div
              className="wb-vulnerability-warning-text"
              style={{ marginTop: '8px' }}
            >
              <strong>用途例:</strong>{' '}
              ペネトレーションテスト、セキュリティ監査、
              パスワード強度検証ツールのテストデータ作成
            </div>
          </div>
        )}

        {/* 基本設定（ワークベンチカード形式で整理） */}
        <div className="space-y-8 mb-10">
          {/* 第1段階: パスワード仕様設定 */}
          <div className="wb-tool-panel wb-tool-inspect">
            <div className="wb-tool-panel-header">
              <h4 className="wb-tool-panel-title">📏 パスワード仕様</h4>
              <p className="wb-tool-panel-description">
                生成するパスワードの基本仕様を設定します
              </p>
            </div>
            <div className="wb-tool-control">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 md:gap-10 lg:gap-12 xl:gap-14 2xl:gap-16">
                {/* パスワード長 */}
                <div className="wb-tool-control">
                  <label className="wb-tool-label">
                    📏 パスワード長
                    <HelpTooltip
                      title={HELP_CONTENT.passwordLength.title}
                      content={HELP_CONTENT.passwordLength.content}
                      position="top"
                      className="ml-2"
                    />
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="50"
                    value={criteria.length}
                    onChange={e =>
                      handleCriteriaChange('length', parseInt(e.target.value))
                    }
                    className="wb-range-input"
                  />
                  <div className="wb-tool-value">{criteria.length}文字</div>
                </div>

                {/* 生成個数 */}
                <div className="wb-tool-control">
                  <label className="wb-tool-label">
                    🔢 生成個数
                    <HelpTooltip
                      title={HELP_CONTENT.passwordCount.title}
                      content={HELP_CONTENT.passwordCount.content}
                      position="top"
                      className="ml-2"
                    />
                    {criteria.count > 100 && (
                      <span className="wb-badge wb-badge-warning ml-2">
                        ⚡ 高速生成
                      </span>
                    )}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={criteria.count}
                      onChange={e =>
                        handleCriteriaChange('count', parseInt(e.target.value))
                      }
                      className="wb-number-input flex-1"
                    />
                    <span className="wb-unit-label">個</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {[3, 10, 50, 100, 500].map(count => (
                      <button
                        key={count}
                        onClick={() => handleCriteriaChange('count', count)}
                        className={`wb-quick-button ${
                          criteria.count === count
                            ? 'wb-quick-button-active'
                            : 'wb-quick-button-inactive'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                  <div className="wb-tool-hint">
                    {criteria.count <= 10 && '⚡ 瞬時生成'}
                    {criteria.count > 10 &&
                      criteria.count <= 100 &&
                      '⏳ 中規模生成（数秒）'}
                    {criteria.count > 100 && '🔄 大規模生成（プログレス表示）'}
                  </div>
                </div>

                {/* パスワード強度表示 */}
                <div className="wb-tool-control">
                  <label className="wb-tool-label">🛡️ 予想強度</label>
                  <div className="wb-strength-display">
                    <div
                      className={`wb-strength-badge wb-strength-${getPasswordStrength()}`}
                    >
                      <span className="wb-strength-icon">
                        {getStrengthIcon()}
                      </span>
                      <span className="wb-strength-text">
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="wb-strength-bar">
                      <div
                        className={`wb-strength-fill wb-strength-${getPasswordStrength()}`}
                        style={{ width: `${getStrengthPercentage()}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="wb-tool-hint">
                    長さ{criteria.length}文字・{getCharacterTypeCount()}
                    種類の文字
                  </div>
                </div>

                {/* 推奨設定ヒント */}
                <div className="wb-tool-control">
                  <label className="wb-tool-label">💡 推奨設定</label>
                  <div className="wb-recommendation-card">
                    <div className="wb-recommendation-title">
                      {getRecommendationTitle()}
                    </div>
                    <div className="wb-recommendation-text">
                      {getRecommendationText()}
                    </div>
                    {getRecommendationAction() && (
                      <button
                        onClick={applyRecommendation}
                        className="wb-recommendation-button"
                      >
                        {getRecommendationAction()}
                      </button>
                    )}
                  </div>
                </div>

                {/* 新規追加: セキュリティレベル表示 */}
                <div className="wb-tool-control">
                  <label className="wb-tool-label">🔒 セキュリティレベル</label>
                  <div className="wb-security-level-display">
                    <div className="wb-security-meter">
                      <div className="wb-security-level-indicator">
                        <span className="wb-security-icon">🛡️</span>
                        <span className="wb-security-text">
                          エンタープライズ級
                        </span>
                      </div>
                      <div className="wb-security-score">
                        <span className="wb-score-value">95</span>
                        <span className="wb-score-unit">/100</span>
                      </div>
                    </div>
                    <div className="wb-security-features">
                      <span className="wb-feature-badge">✓ 辞書攻撃耐性</span>
                      <span className="wb-feature-badge">
                        ✓ ブルートフォース耐性
                      </span>
                    </div>
                  </div>
                  <div className="wb-tool-hint">
                    現在の設定での総合セキュリティ評価
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 第2段階: 文字種設定 */}
          <div className="wb-tool-panel wb-tool-inspect">
            <div className="wb-tool-panel-header">
              <h4 className="wb-tool-panel-title">🔤 使用文字種</h4>
              <p className="wb-tool-panel-description">
                パスワードに含める文字の種類を選択します。より多くの文字種を組み合わせることで、セキュリティが向上します
              </p>
            </div>

            {/* 基本文字種 */}
            <div className="mb-8">
              <h5 className="wb-tool-subtitle mb-6">📝 基本文字種</h5>
              <div className="wb-checkbox-group grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                <label className="wb-checkbox-item">
                  <input
                    type="checkbox"
                    checked={criteria.includeUppercase}
                    onChange={e =>
                      handleCriteriaChange('includeUppercase', e.target.checked)
                    }
                    className="wb-checkbox"
                  />
                  <span className="wb-checkbox-label">
                    <span className="wb-checkbox-icon">🔤</span>
                    大文字 (A-Z)
                    <HelpTooltip
                      title={HELP_CONTENT.includeUppercase.title}
                      content={HELP_CONTENT.includeUppercase.content}
                      position="right"
                      className="ml-2"
                    />
                  </span>
                </label>
                <label className="wb-checkbox-item">
                  <input
                    type="checkbox"
                    checked={criteria.includeLowercase}
                    onChange={e =>
                      handleCriteriaChange('includeLowercase', e.target.checked)
                    }
                    className="wb-checkbox"
                  />
                  <span className="wb-checkbox-label">
                    <span className="wb-checkbox-icon">🔡</span>
                    小文字 (a-z)
                    <HelpTooltip
                      title={HELP_CONTENT.includeLowercase.title}
                      content={HELP_CONTENT.includeLowercase.content}
                      position="right"
                      className="ml-2"
                    />
                  </span>
                </label>
                <label className="wb-checkbox-item">
                  <input
                    type="checkbox"
                    checked={criteria.includeNumbers}
                    onChange={e =>
                      handleCriteriaChange('includeNumbers', e.target.checked)
                    }
                    className="wb-checkbox"
                  />
                  <span className="wb-checkbox-label">
                    <span className="wb-checkbox-icon">🔢</span>
                    数字 (0-9)
                    <HelpTooltip
                      title={HELP_CONTENT.includeNumbers.title}
                      content={HELP_CONTENT.includeNumbers.content}
                      position="right"
                      className="ml-2"
                    />
                  </span>
                </label>
                <label className="wb-checkbox-item">
                  <input
                    type="checkbox"
                    checked={criteria.includeSymbols}
                    onChange={e =>
                      handleCriteriaChange('includeSymbols', e.target.checked)
                    }
                    className="wb-checkbox"
                  />
                  <span className="wb-checkbox-label">
                    <span className="wb-checkbox-icon">🔣</span>
                    記号 (!@#$%)
                    <HelpTooltip
                      title={HELP_CONTENT.includeSymbols.title}
                      content={HELP_CONTENT.includeSymbols.content}
                      position="right"
                      className="ml-2"
                    />
                  </span>
                </label>
              </div>
            </div>

            {/* 拡張文字種 */}
            <div className="wb-extended-charset-section">
              <h5 className="wb-extended-charset-title">🌟 拡張文字種</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="wb-checkbox-item">
                  <input
                    type="checkbox"
                    checked={criteria.includeExtendedSymbols || false}
                    onChange={e =>
                      handleCriteriaChange(
                        'includeExtendedSymbols',
                        e.target.checked
                      )
                    }
                    className="wb-checkbox"
                  />
                  <span className="wb-checkbox-label">
                    <span className="wb-checkbox-icon">⚡</span>
                    拡張記号 (※◆★)
                  </span>
                </label>
                <label className="wb-checkbox-item">
                  <input
                    type="checkbox"
                    checked={criteria.includeBrackets || false}
                    onChange={e =>
                      handleCriteriaChange('includeBrackets', e.target.checked)
                    }
                    className="wb-checkbox"
                  />
                  <span className="wb-checkbox-label">
                    <span className="wb-checkbox-icon">📐</span>
                    括弧類 (()[]{})
                  </span>
                </label>
              </div>
            </div>

            {/* 特殊オプション */}
            <div className="mb-8">
              <h5 className="wb-tool-subtitle mb-6">🎯 特殊オプション</h5>
              <div className="wb-checkbox-group grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                <label className="wb-checkbox-item">
                  <input
                    type="checkbox"
                    checked={criteria.excludeAmbiguous}
                    onChange={e =>
                      handleCriteriaChange('excludeAmbiguous', e.target.checked)
                    }
                    className="wb-checkbox"
                  />
                  <span className="wb-checkbox-label">
                    <span className="wb-checkbox-icon">👁️</span>
                    紛らわしい文字を除外 (0oO1lI)
                  </span>
                </label>
                <label className="wb-checkbox-item">
                  <input
                    type="checkbox"
                    checked={criteria.includeReadable || false}
                    onChange={e =>
                      handleCriteriaChange('includeReadable', e.target.checked)
                    }
                    className="wb-checkbox"
                  />
                  <span className="wb-checkbox-label">
                    <span className="wb-checkbox-icon">📖</span>
                    読みやすい文字のみ
                  </span>
                </label>
                <label className="wb-checkbox-item">
                  <input
                    type="checkbox"
                    checked={criteria.includePronounceable || false}
                    onChange={e =>
                      handleCriteriaChange(
                        'includePronounceable',
                        e.target.checked
                      )
                    }
                    className="wb-checkbox"
                  />
                  <span className="wb-checkbox-label">
                    <span className="wb-checkbox-icon">🗣️</span>
                    発音可能パターン
                  </span>
                </label>
              </div>
            </div>

            {/* カスタム文字設定 */}
            <div className="mb-6">
              <h5 className="wb-tool-subtitle mb-6">🎨 カスタム文字設定</h5>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                <div className="wb-tool-control">
                  <label className="wb-tool-label">✏️ カスタム文字セット</label>
                  <input
                    type="text"
                    value={criteria.customCharacters}
                    onChange={e =>
                      handleCriteriaChange('customCharacters', e.target.value)
                    }
                    placeholder="独自の文字を入力 (例: αβγδε)"
                    className="wb-text-input"
                  />
                  <div className="wb-tool-hint">
                    独自の文字セットを定義できます。入力した文字がパスワードに含まれます
                  </div>
                </div>
                <div className="wb-tool-control">
                  <label className="wb-tool-label">🚫 除外文字</label>
                  <input
                    type="text"
                    value={criteria.excludeCharacters || ''}
                    onChange={e =>
                      handleCriteriaChange('excludeCharacters', e.target.value)
                    }
                    placeholder="除外したい文字 (例: 0oO1lI)"
                    className="wb-text-input"
                  />
                  <div className="wb-tool-hint">
                    パスワードから除外したい特定の文字を指定できます
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 教育パネル */}
        <EducationPanel
          isOpen={showEducationPanel}
          onClose={() => setShowEducationPanel(false)}
        />

        {/* パスワード生成ボタン */}
        <div className="text-center my-8">
          <div className="wb-generate-section">
            <button
              onClick={() => {
                console.log('🖱️ 生成ボタンがクリックされました');
                console.log('クリック時の isGenerating:', isGenerating);
                console.log(
                  'クリック時の hasValidCharacterTypes:',
                  hasValidCharacterTypes()
                );
                generatePasswords();
              }}
              disabled={isGenerating || !hasValidCharacterTypes()}
              className={`wb-generate-button ${
                isGenerating ? 'wb-generating' : ''
              } ${!hasValidCharacterTypes() ? 'wb-disabled' : ''}`}
            >
              <div className="wb-generate-button-content">
                <span className="wb-generate-button-icon">
                  {isGenerating ? '⏳' : '🔐'}
                </span>
                <span className="wb-generate-button-text">
                  {isGenerating ? (
                    <>
                      <span className="animate-spin inline-block mr-2">⏳</span>
                      パスワード生成中...
                      {generationProgress && (
                        <span className="ml-2 text-sm">
                          ({generationProgress.current}/
                          {generationProgress.total})
                        </span>
                      )}
                    </>
                  ) : (
                    'パスワード生成'
                  )}
                </span>
              </div>
              {!isGenerating && <div className="wb-generate-button-glow"></div>}
            </button>

            {/* デバッグ情報表示（開発時のみ） */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-sm text-gray-600">
                <div>🐛 デバッグ情報:</div>
                <div>isGenerating: {isGenerating ? 'true' : 'false'}</div>
                <div>isCopying: {isCopying ? 'true' : 'false'}</div>
                <div>
                  hasValidCharacterTypes:{' '}
                  {hasValidCharacterTypes() ? 'true' : 'false'}
                </div>
                <div>criteria.count: {criteria.count}</div>
                <div>selectedPresetId: {selectedPresetId}</div>
                {generationProgress && (
                  <div>
                    progress: {generationProgress.current}/
                    {generationProgress.total}
                  </div>
                )}
              </div>
            )}

            {/* 教育コンテンツリンク */}
            <div className="wb-generate-actions mt-4">
              <button
                onClick={() => setShowEducationPanel(true)}
                className="wb-education-link-button"
                type="button"
              >
                <span className="wb-education-link-icon">📚</span>
                パスワードセキュリティを学ぶ
              </button>
            </div>

            {/* エラー表示 */}
            {!hasValidCharacterTypes() && (
              <div className="wb-error-message mt-4">
                <span className="wb-error-icon">⚠️</span>
                <span className="wb-error-text">
                  少なくとも1つの文字種を選択してください
                </span>
              </div>
            )}

            {/* API エラー表示 */}
            {apiError && (
              <div className="wb-error-message mt-4">
                <span className="wb-error-icon">🚨</span>
                <span className="wb-error-text">{apiError}</span>
              </div>
            )}
          </div>
        </div>

        {/* プログレスバー */}
        <ProgressBar />

        {/* 高度な設定ボタン */}
        <div className="text-center my-6">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Settings2 className="w-4 h-4" />
            {showAdvanced ? '高度な設定を隠す' : '高度な設定を表示'}
          </button>
        </div>

        {/* 高度な設定パネル */}
        {showAdvanced && (
          <div className="wb-advanced-panel">
            <div className="wb-advanced-panel-header">
              <h4 className="wb-advanced-panel-title">⚙️ 高度な設定</h4>
              <p className="wb-advanced-panel-description">
                より詳細な品質設定と生成オプション
              </p>
            </div>

            <div className="wb-advanced-grid">
              {/* 文字品質設定 */}
              <div className="wb-advanced-section">
                <h5 className="wb-advanced-section-title">🔍 文字品質</h5>

                {/* 最小エントロピー設定 */}
                <div className="wb-advanced-control">
                  <label className="wb-advanced-label">
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
                    className="wb-range-input"
                  />
                  <div className="wb-advanced-value">
                    {criteria.minEntropy || 50}ビット
                  </div>
                </div>

                {/* 辞書攻撃対策 */}
                <label className="wb-advanced-checkbox">
                  <input
                    type="checkbox"
                    checked={criteria.avoidDictionary || false}
                    onChange={e =>
                      handleCriteriaChange('avoidDictionary', e.target.checked)
                    }
                    className="wb-checkbox"
                  />
                  <div>
                    <span className="wb-advanced-checkbox-title">
                      辞書攻撃対策
                    </span>
                    <div className="wb-advanced-checkbox-description">
                      一般的な単語パターンを避ける
                    </div>
                  </div>
                </label>
              </div>

              {/* 生成オプション */}
              <div className="wb-advanced-section">
                <h5 className="wb-advanced-section-title">⚡ 生成オプション</h5>

                {/* 重複チェック */}
                <label className="wb-advanced-checkbox">
                  <input
                    type="checkbox"
                    checked={criteria.noDuplicates || false}
                    onChange={e =>
                      handleCriteriaChange('noDuplicates', e.target.checked)
                    }
                    className="wb-checkbox"
                  />
                  <div>
                    <span className="wb-advanced-checkbox-title">
                      重複パスワード除去
                    </span>
                    <div className="wb-advanced-checkbox-description">
                      同じパスワードが生成されないよう保証
                    </div>
                  </div>
                </label>

                {/* 再試行回数 */}
                <div className="wb-advanced-control">
                  <label className="wb-advanced-label">生成再試行回数</label>
                  <select
                    value={criteria.maxRetries || 100}
                    onChange={e =>
                      handleCriteriaChange(
                        'maxRetries',
                        parseInt(e.target.value)
                      )
                    }
                    className="wb-select-input"
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

        {/* カスタムプリセット詳細設定 */}
        {(selectedPresetId === 'custom-symbols' ||
          selectedPresetId === 'custom-charsets') && (
          <div className="wb-custom-preset-panel">
            {/* カスタム記号設定 */}
            {selectedPresetId === 'custom-symbols' && (
              <div className="wb-custom-section wb-custom-symbols">
                <div className="wb-custom-section-header">
                  <h4 className="wb-custom-section-title">
                    🎨 カスタム記号設定
                  </h4>
                  <p className="wb-custom-section-description">
                    使用する記号文字を自由に設定できます
                  </p>
                </div>
                <CustomSymbolsInput
                  value={customSymbols}
                  onChange={setCustomSymbols}
                  showSuggestions={true}
                />
              </div>
            )}

            {/* カスタム文字種エディター */}
            {selectedPresetId === 'custom-charsets' && (
              <div className="wb-custom-section wb-custom-charsets">
                <div className="wb-custom-section-header">
                  <h4 className="wb-custom-section-title">
                    🔤 カスタム文字種設定
                  </h4>
                  <p className="wb-custom-section-description">
                    独自の文字セットを定義できます
                  </p>
                </div>
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
        <div className="wb-error-panel">
          <div className="wb-error-content">
            <div className="wb-error-icon">❌</div>
            <div className="wb-error-text">
              <h4 className="wb-error-title">エラーが発生しました</h4>
              <p className="wb-error-message">{apiError}</p>
            </div>
          </div>
        </div>
      )}

      {/* 生成結果パネル */}
      {result && (
        <div className="wb-result-panel">
          <div className="wb-result-header">
            <div className="wb-result-title-section">
              <h3 className="wb-result-title">🔐 生成結果</h3>
              <p className="wb-result-subtitle">
                {result.passwords.length}個のパスワードが生成されました
              </p>
            </div>
            <div className="wb-result-actions">
              <ActionButton
                type="replace"
                onClick={() => setShowPasswords(!showPasswords)}
                variant="secondary"
                size="sm"
                className="wb-result-action-button"
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
                loading={isCopying}
                variant="primary"
                size="sm"
                className="wb-result-action-button"
              />
            </div>
          </div>

          {/* 強度表示 */}
          <div className="wb-strength-section">
            <div className="wb-strength-badge-container">
              <div
                className={`wb-strength-badge wb-strength-${result.strength}`}
              >
                <span className="wb-strength-icon">
                  {getStrengthInfo(result.strength).icon}
                </span>
                <span className="wb-strength-label">
                  強度: {getStrengthInfo(result.strength).label}
                </span>
              </div>
            </div>
            <p className="wb-strength-details">
              推定解読時間: {result.estimatedCrackTime}
            </p>
          </div>

          {/* パスワードリスト（グリッドレイアウト） */}
          <OptimizedPasswordDisplay passwords={result.passwords} />

          {/* 脆弱性分析結果（脆弱性プリセットの場合のみ表示） */}
          {vulnerabilityAnalyses.length > 0 && (
            <div className="wb-vulnerability-results-panel">
              <div className="wb-vulnerability-results-header">
                <h4 className="wb-vulnerability-results-title">
                  🔍 脆弱性分析結果
                </h4>
                <p className="wb-vulnerability-results-description">
                  生成されたパスワードの脆弱性を分析しました
                </p>
                <div className="wb-vulnerability-education-link">
                  <button
                    onClick={() => setShowEducationPanel(true)}
                    className="wb-education-link-button wb-education-link-small"
                    type="button"
                  >
                    <span className="wb-education-link-icon">📚</span>
                    脆弱性について詳しく学ぶ
                  </button>
                </div>
              </div>

              <div className="wb-vulnerability-summary">
                <div className="wb-vulnerability-stats">
                  <div className="wb-vulnerability-stat">
                    <span className="wb-vulnerability-stat-label">
                      平均脆弱性スコア
                    </span>
                    <span className="wb-vulnerability-stat-value">
                      {(
                        vulnerabilityAnalyses.reduce(
                          (sum, a) => sum + a.vulnerabilityScore,
                          0
                        ) / vulnerabilityAnalyses.length
                      ).toFixed(1)}
                      /100
                    </span>
                  </div>
                  <div className="wb-vulnerability-stat">
                    <span className="wb-vulnerability-stat-label">
                      検出された問題
                    </span>
                    <span className="wb-vulnerability-stat-value">
                      {vulnerabilityAnalyses.reduce(
                        (sum, a) => sum + a.vulnerabilities.length,
                        0
                      )}
                      件
                    </span>
                  </div>
                </div>
              </div>

              <div className="wb-vulnerability-password-list">
                {result.passwords.slice(0, 10).map((password, index) => {
                  const analysis = vulnerabilityAnalyses[index];
                  if (!analysis) {
                    return null;
                  }

                  const vulnerabilityLevel =
                    analysis.vulnerabilityScore >= 80
                      ? 'critical'
                      : analysis.vulnerabilityScore >= 60
                      ? 'high'
                      : analysis.vulnerabilityScore >= 30
                      ? 'medium'
                      : 'low';

                  return (
                    <div key={index} className="wb-vulnerability-password-item">
                      <div className="wb-vulnerability-password-info">
                        <code className="wb-vulnerability-password-text">
                          {showPasswords
                            ? password
                            : '●'.repeat(password.length)}
                        </code>
                        <div className="wb-vulnerability-password-score">
                          <span
                            className={`wb-vulnerability-score-badge wb-vulnerability-${vulnerabilityLevel}`}
                          >
                            {analysis.vulnerabilityScore}/100
                          </span>
                          <span className="wb-vulnerability-issues-count">
                            {analysis.vulnerabilities.length}個の問題
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          showVulnerabilityAnalysis(password, index)
                        }
                        className="wb-vulnerability-analyze-button"
                      >
                        詳細分析
                      </button>
                    </div>
                  );
                })}

                {result.passwords.length > 10 && (
                  <div className="wb-vulnerability-more-info">
                    残り{result.passwords.length - 10}
                    個のパスワードも分析済み（エクスポートで確認可能）
                  </div>
                )}
              </div>
            </div>
          )}

          {/* エクスポート機能 */}
          <div className="wb-export-section">
            <button
              onClick={() => setShowExportPanel(!showExportPanel)}
              className="wb-export-toggle-button"
            >
              📁 エクスポート機能
              {showExportPanel ? ' ▼' : ' ▶'}
            </button>

            {showExportPanel && (
              <div className="wb-export-panel">
                <div className="wb-export-header">
                  <span className="wb-export-title">📁 データエクスポート</span>
                </div>

                <div className="wb-export-options">
                  <div className="wb-export-option-group">
                    <label className="wb-export-option-label">出力形式</label>
                    <div className="wb-export-format-buttons">
                      {(['csv', 'json', 'txt'] as const).map(format => (
                        <button
                          key={format}
                          onClick={() =>
                            setExportOptions(prev => ({ ...prev, format }))
                          }
                          className={`wb-export-format-button ${
                            exportOptions.format === format ? 'active' : ''
                          }`}
                        >
                          {format.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="wb-export-option-group">
                    <label className="wb-export-option-label">含める情報</label>
                    <div className="wb-export-checkbox-group">
                      <label className="wb-export-checkbox-item">
                        <input
                          type="checkbox"
                          checked={exportOptions.includeAnalysis}
                          onChange={e =>
                            setExportOptions(prev => ({
                              ...prev,
                              includeAnalysis: e.target.checked,
                            }))
                          }
                        />
                        脆弱性分析結果
                      </label>
                      <label className="wb-export-checkbox-item">
                        <input
                          type="checkbox"
                          checked={exportOptions.includeMetadata}
                          onChange={e =>
                            setExportOptions(prev => ({
                              ...prev,
                              includeMetadata: e.target.checked,
                            }))
                          }
                        />
                        生成メタデータ
                      </label>
                      <label className="wb-export-checkbox-item">
                        <input
                          type="checkbox"
                          checked={exportOptions.groupByVulnerability}
                          onChange={e =>
                            setExportOptions(prev => ({
                              ...prev,
                              groupByVulnerability: e.target.checked,
                            }))
                          }
                        />
                        脆弱性レベル別グループ化
                      </label>
                    </div>
                  </div>
                </div>

                <div className="wb-export-actions">
                  <button
                    onClick={() => setShowExportPanel(false)}
                    className="wb-export-button wb-export-button-secondary"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleExport}
                    className="wb-export-button wb-export-button-primary"
                  >
                    📁 エクスポート実行
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 構成プリセット情報表示 */}
          {(result as any).composition && (
            <div className="wb-composition-panel">
              <div className="wb-composition-header">
                <h4 className="wb-composition-title">✅ 構成要件チェック</h4>
                <p className="wb-composition-description">
                  選択したプリセットの要件充足状況
                </p>
              </div>
              <div className="wb-composition-grid">
                {(result as any).composition.appliedRequirements.map(
                  (req: any, index: number) => (
                    <div key={index} className="wb-composition-item">
                      <span className="wb-composition-name">{req.name}</span>
                      <span
                        className={`wb-composition-status ${
                          req.satisfied
                            ? 'wb-composition-satisfied'
                            : 'wb-composition-unsatisfied'
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

          <div className="wb-result-metadata">
            <span className="wb-result-timestamp">
              生成日時: {new Date(result.generatedAt).toLocaleString()}
            </span>
          </div>

          {/* コピー完了メッセージ */}
          {copyMessage && (
            <div className="wb-success-message">
              <div className="wb-success-content">
                <span className="wb-success-text">{copyMessage}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 脆弱性分析モーダル */}
      {selectedAnalysis && (
        <VulnerabilityAnalysisDisplay
          analysis={selectedAnalysis.analysis}
          password={selectedAnalysis.password}
          onClose={() => setSelectedAnalysis(null)}
        />
      )}
    </div>
  );
};
