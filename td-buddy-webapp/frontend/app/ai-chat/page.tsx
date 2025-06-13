'use client';

import { Brain, Download, RefreshCw, Send } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import { useWebSocket } from '../../components/hooks/useWebSocket';
import { DataGenerationSteps } from '../../components/ui/DataGenerationSteps';
import { ProgressIndicator } from '../../components/ui/ProgressIndicator';

// BrewCharacterを動的インポートしてSSRエラーを回避
const BrewCharacter = dynamic(() => import('../../components/BrewCharacter'), {
  ssr: false,
  loading: () => (
    <div className="w-10 h-10 bg-wb-tool-polish-200 rounded-full animate-pulse"></div>
  ),
});

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: any;
}

interface ParsedParams {
  count: number;
  locale: string;
  includeFields: string[];
  filters?: {
    ageRange?: { min: number; max: number };
    gender?: 'male' | 'female' | 'both';
    jobCategory?: string;
    location?: string;
  };
}

interface GeneratedData {
  id: string;
  count: number;
  data: any[];
  generatedAt: Date;
}

interface GenerationProgress {
  progress: number;
  status: string;
  currentStep: string;
  totalSteps: number;
  isActive: boolean;
  error?: string;
}

interface GenerationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  duration?: number;
}

// 自動保存機能のユーティリティ
const AUTO_SAVE_KEYS = {
  CHAT_HISTORY: 'td-buddy-chat-history',
  LAST_GENERATED_DATA: 'td-buddy-last-data',
  USER_PREFERENCES: 'td-buddy-preferences',
  SESSION_STATE: 'td-buddy-session',
} as const;

const saveToLocalStorage = (key: string, data: any) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    console.log(`💾 Auto-saved: ${key}`);
  } catch (error) {
    console.warn('💾 Auto-save failed:', error);
  }
};

const loadFromLocalStorage = (key: string, defaultValue: any = null) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log(`📂 Auto-loaded: ${key}`);
      return parsed;
    }
  } catch (error) {
    console.warn('📂 Auto-load failed:', error);
  }
  return defaultValue;
};

const clearAutoSavedData = (key?: string) => {
  try {
    if (key) {
      localStorage.removeItem(key);
      console.log(`🗑️ Cleared: ${key}`);
    } else {
      Object.values(AUTO_SAVE_KEYS).forEach(k => localStorage.removeItem(k));
      console.log('🗑️ Cleared all auto-saved data');
    }
  } catch (error) {
    console.warn('🗑️ Clear failed:', error);
  }
};

export default function AIChatPage() {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastGeneratedData, setLastGeneratedData] =
    useState<GeneratedData | null>(null);
  const [lastParsedParams, setLastParsedParams] = useState<ParsedParams | null>(
    null
  );
  const [sessionState, setSessionState] = useState({
    lastActiveTime: new Date(),
    totalSessions: 0,
    totalDataGenerated: 0,
    preferredSettings: {
      autoSave: true,
      notifications: true,
      theme: 'default',
    },
  });
  const [showAdvancedView, setShowAdvancedView] = useState(false);
  const [generationProgress, setGenerationProgress] =
    useState<GenerationProgress>({
      progress: 0,
      status: '待機中',
      currentStep: '',
      totalSteps: 3,
      isActive: false,
    });
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([
    {
      id: 'parse',
      title: '自然言語解析',
      description: 'ユーザーの要求を分析してパラメータを抽出',
      status: 'pending',
    },
    {
      id: 'generate',
      title: 'データ生成',
      description: '指定された条件に基づいてテストデータを生成',
      status: 'pending',
    },
    {
      id: 'validate',
      title: '品質検証',
      description: '生成されたデータの品質と整合性をチェック',
      status: 'pending',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isConnected,
    progressData: wsProgressData,
    stepData: wsStepData,
    resetProgress: wsResetProgress,
  } = useWebSocket();

  // 💾 自動保存: チャット履歴の復元（初期化時）
  useEffect(() => {
    setMounted(true);

    // チャット履歴の復元
    const savedMessages = loadFromLocalStorage(AUTO_SAVE_KEYS.CHAT_HISTORY, []);
    if (savedMessages.length > 0) {
      // timestampを Date オブジェクトに復元
      const restoredMessages = savedMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
      setMessages(restoredMessages);
      console.log(
        `🔄 Restored ${restoredMessages.length} messages from auto-save`
      );

      // 復元完了メッセージを追加
      setTimeout(() => {
        addMessage(
          'system',
          `💾 前回のチャット履歴を復元しました（${restoredMessages.length}件のメッセージ）`
        );
      }, 500);
    } else {
      // 初回利用時のウェルカムメッセージ
      addMessage(
        'assistant',
        '🍺 こんにちは！QA Workbench AI アシスタントです。\n\n自然言語でテストデータの生成をお手伝いします。例えば：\n\n• "100人分の個人情報を生成して"\n• "20代の男性エンジニア50人のデータが欲しい"\n• "東京在住の女性100人分のCSVを作って"\n\nお気軽にお声がけください！'
      );
    }

    // 最後に生成されたデータの復元
    const savedData = loadFromLocalStorage(AUTO_SAVE_KEYS.LAST_GENERATED_DATA);
    if (savedData) {
      setLastGeneratedData({
        ...savedData,
        generatedAt: new Date(savedData.generatedAt),
      });
    }

    // セッション状態の復元
    const savedSession = loadFromLocalStorage(AUTO_SAVE_KEYS.SESSION_STATE);
    if (savedSession) {
      setSessionState({
        ...savedSession,
        lastActiveTime: new Date(savedSession.lastActiveTime),
      });
    }

    // セッション開始時の統計更新
    setSessionState(prev => ({
      ...prev,
      totalSessions: prev.totalSessions + 1,
      lastActiveTime: new Date(),
    }));
  }, []);

  // 💾 自動保存: メッセージが更新されるたびに保存
  useEffect(() => {
    if (mounted && messages.length > 0) {
      saveToLocalStorage(AUTO_SAVE_KEYS.CHAT_HISTORY, messages);
    }
  }, [messages, mounted]);

  // 💾 自動保存: 生成データが更新されるたびに保存
  useEffect(() => {
    if (mounted && lastGeneratedData) {
      saveToLocalStorage(AUTO_SAVE_KEYS.LAST_GENERATED_DATA, lastGeneratedData);
    }
  }, [lastGeneratedData, mounted]);

  // 💾 自動保存: セッション状態が更新されるたびに保存
  useEffect(() => {
    if (mounted) {
      saveToLocalStorage(AUTO_SAVE_KEYS.SESSION_STATE, sessionState);
    }
  }, [sessionState, mounted]);

  // WebSocket進捗データの同期
  useEffect(() => {
    if (wsProgressData) {
      setGenerationProgress(prev => ({
        ...prev,
        ...wsProgressData,
      }));
    }
  }, [wsProgressData]);

  // WebSocketステップデータの同期
  useEffect(() => {
    if (wsStepData && 'id' in wsStepData) {
      setGenerationSteps(prev =>
        prev.map(step =>
          step.id === wsStepData.id
            ? {
                ...step,
                status: wsStepData.status,
                duration: wsStepData.duration,
              }
            : step
        )
      );
    }
  }, [wsStepData]);

  // 自動スクロール
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const addMessage = (
    type: 'user' | 'assistant' | 'system',
    content: string,
    metadata?: any
  ) => {
    const newMessage: Message = {
      id: generateUniqueId(),
      type,
      content,
      timestamp: new Date(),
      metadata,
    };

    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  };

  const updateStepStatus = (
    stepId: string,
    status: GenerationStep['status'],
    duration?: number
  ) => {
    setGenerationSteps(prev =>
      prev.map(step =>
        step.id === stepId ? { ...step, status, duration } : step
      )
    );
  };

  const updateProgress = (
    progress: number,
    status: string,
    currentStep: string,
    isActive: boolean,
    error?: string
  ) => {
    setGenerationProgress({
      progress,
      status,
      currentStep,
      totalSteps: 3,
      isActive,
      error,
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) {
      return;
    }

    const userMessage = inputValue.trim();
    setInputValue('');
    addMessage('user', userMessage);
    setIsLoading(true);

    // 進捗リセット
    wsResetProgress();
    updateProgress(0, '処理開始', '自然言語解析', true);
    setGenerationSteps(prev =>
      prev.map(step => ({ ...step, status: 'pending' }))
    );

    try {
      // ステップ1: 自然言語解析
      updateStepStatus('parse', 'active');
      updateProgress(10, '自然言語解析中...', '自然言語解析', true);

      await new Promise(resolve => setTimeout(resolve, 1000));

      // 簡易的なパラメータ解析
      const parsedParams: ParsedParams = {
        count: extractNumber(userMessage) || 10,
        locale: 'ja-JP',
        includeFields: extractFields(userMessage),
        filters: extractFilters(userMessage),
      };

      setLastParsedParams(parsedParams);
      updateStepStatus('parse', 'completed', 1000);
      updateProgress(33, '解析完了', 'データ生成', true);

      // ステップ2: データ生成
      updateStepStatus('generate', 'active');
      updateProgress(40, 'データ生成中...', 'データ生成', true);

      await new Promise(resolve => setTimeout(resolve, 2000));

      // モックデータ生成
      const generatedData = generateMockData(parsedParams);
      const newGeneratedData: GeneratedData = {
        id: generateUniqueId(),
        count: generatedData.length,
        data: generatedData,
        generatedAt: new Date(),
      };

      setLastGeneratedData(newGeneratedData);
      updateStepStatus('generate', 'completed', 2000);
      updateProgress(66, '生成完了', '品質検証', true);

      // ステップ3: 品質検証
      updateStepStatus('validate', 'active');
      updateProgress(70, '品質検証中...', '品質検証', true);

      await new Promise(resolve => setTimeout(resolve, 1000));

      updateStepStatus('validate', 'completed', 1000);
      updateProgress(100, '完了', '完了', false);

      // 統計更新
      setSessionState(prev => ({
        ...prev,
        totalDataGenerated: prev.totalDataGenerated + newGeneratedData.count,
        lastActiveTime: new Date(),
      }));

      // 結果メッセージ
      const resultMessage = `✅ **データ生成完了！**\n\n📊 **生成結果:**\n• 件数: ${
        newGeneratedData.count
      }件\n• フィールド: ${parsedParams.includeFields.join(
        ', '
      )}\n• 生成時刻: ${newGeneratedData.generatedAt.toLocaleString(
        'ja-JP'
      )}\n\n💾 データはダウンロード可能です。`;

      addMessage('assistant', resultMessage, {
        type: 'generation_result',
        data: newGeneratedData,
        params: parsedParams,
      });
    } catch (error) {
      console.error('データ生成エラー:', error);
      updateProgress(0, 'エラー', 'エラー', false, 'データ生成に失敗しました');
      updateStepStatus('generate', 'error');
      addMessage(
        'assistant',
        '❌ 申し訳ありません。データ生成中にエラーが発生しました。もう一度お試しください。'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 数値抽出ヘルパー
  const extractNumber = (text: string): number | null => {
    const matches = text.match(/(\d+)(?:人|件|個|行)/);
    return matches ? parseInt(matches[1], 10) : null;
  };

  // フィールド抽出ヘルパー
  const extractFields = (text: string): string[] => {
    const fields = [];
    if (
      text.includes('名前') ||
      text.includes('氏名') ||
      text.includes('個人情報')
    ) {
      fields.push('name');
    }
    if (text.includes('メール') || text.includes('email')) {
      fields.push('email');
    }
    if (text.includes('電話') || text.includes('phone')) {
      fields.push('phone');
    }
    if (text.includes('住所') || text.includes('address')) {
      fields.push('address');
    }
    if (text.includes('年齢') || text.includes('age')) {
      fields.push('age');
    }
    if (text.includes('性別') || text.includes('gender')) {
      fields.push('gender');
    }
    if (text.includes('職業') || text.includes('job')) {
      fields.push('job');
    }

    return fields.length > 0 ? fields : ['name', 'email', 'phone'];
  };

  // フィルター抽出ヘルパー
  const extractFilters = (text: string) => {
    const filters: any = {};

    // 年齢範囲
    const ageMatch = text.match(/(\d+)(?:代|歳)/);
    if (ageMatch) {
      const age = parseInt(ageMatch[1], 10);
      if (age >= 10 && age <= 90) {
        filters.ageRange = { min: age, max: age + 9 };
      }
    }

    // 性別
    if (text.includes('男性')) {
      filters.gender = 'male';
    } else if (text.includes('女性')) {
      filters.gender = 'female';
    }

    // 職業
    if (text.includes('エンジニア')) {
      filters.jobCategory = 'engineer';
    } else if (text.includes('営業')) {
      filters.jobCategory = 'sales';
    } else if (text.includes('デザイナー')) {
      filters.jobCategory = 'designer';
    }

    // 地域
    if (text.includes('東京')) {
      filters.location = 'tokyo';
    } else if (text.includes('大阪')) {
      filters.location = 'osaka';
    } else if (text.includes('名古屋')) {
      filters.location = 'nagoya';
    }

    return Object.keys(filters).length > 0 ? filters : undefined;
  };

  // モックデータ生成
  const generateMockData = (params: ParsedParams) => {
    const data = [];
    for (let i = 0; i < params.count; i++) {
      const person: any = { id: i + 1 };

      if (params.includeFields.includes('name')) {
        person.name = `田中 太郎${i + 1}`;
      }
      if (params.includeFields.includes('email')) {
        person.email = `user${i + 1}@example.com`;
      }
      if (params.includeFields.includes('phone')) {
        person.phone = `090-1234-${String(5678 + i).padStart(4, '0')}`;
      }
      if (params.includeFields.includes('address')) {
        person.address = `東京都渋谷区${i + 1}-${i + 1}-${i + 1}`;
      }
      if (params.includeFields.includes('age')) {
        const baseAge = params.filters?.ageRange?.min || 25;
        person.age = baseAge + Math.floor(Math.random() * 10);
      }
      if (params.includeFields.includes('gender')) {
        person.gender =
          params.filters?.gender || (i % 2 === 0 ? 'male' : 'female');
      }
      if (params.includeFields.includes('job')) {
        person.job = params.filters?.jobCategory || 'エンジニア';
      }

      data.push(person);
    }
    return data;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDownloadCSV = async () => {
    if (!lastGeneratedData) {
      return;
    }

    try {
      const headers = Object.keys(lastGeneratedData.data[0] || {});
      const csvContent = [
        headers.join(','),
        ...lastGeneratedData.data.map(row =>
          headers.map(header => row[header] || '').join(',')
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `generated_data_${new Date().toISOString().slice(0, 10)}.csv`
      );
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addMessage(
        'system',
        `💾 CSVファイルをダウンロードしました（${lastGeneratedData.count}件）`
      );
    } catch (error) {
      console.error('CSV download error:', error);
      addMessage('system', '❌ CSVダウンロードに失敗しました');
    }
  };

  const regenerateData = async () => {
    if (!lastParsedParams) {
      return;
    }

    addMessage('user', '前回と同じ条件でデータを再生成してください');
    setIsLoading(true);

    try {
      updateProgress(0, '再生成開始', 'データ生成', true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const generatedData = generateMockData(lastParsedParams);
      const newGeneratedData: GeneratedData = {
        id: generateUniqueId(),
        count: generatedData.length,
        data: generatedData,
        generatedAt: new Date(),
      };

      setLastGeneratedData(newGeneratedData);
      updateProgress(100, '再生成完了', '完了', false);

      setSessionState(prev => ({
        ...prev,
        totalDataGenerated: prev.totalDataGenerated + newGeneratedData.count,
        lastActiveTime: new Date(),
      }));

      addMessage(
        'assistant',
        `🔄 **データ再生成完了！**\n\n📊 新しく${newGeneratedData.count}件のデータを生成しました。`
      );
    } catch (error) {
      console.error('Regeneration error:', error);
      addMessage('assistant', '❌ データ再生成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChatHistory = () => {
    setMessages([]);
    clearAutoSavedData(AUTO_SAVE_KEYS.CHAT_HISTORY);
    addMessage(
      'system',
      '🗑️ チャット履歴をクリアしました。新しい会話を開始できます。'
    );
  };

  const clearAllData = () => {
    setMessages([]);
    setLastGeneratedData(null);
    setLastParsedParams(null);
    clearAutoSavedData();
    addMessage(
      'system',
      '🗑️ すべてのデータをクリアしました。新しいセッションを開始します。'
    );
  };

  const exportAllData = () => {
    const exportData = {
      messages,
      lastGeneratedData,
      sessionState,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `td-buddy-export-${new Date().toISOString().slice(0, 10)}.json`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addMessage('system', '📤 セッションデータをエクスポートしました');
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const importedData = JSON.parse(e.target?.result as string);

        if (importedData.messages) {
          const restoredMessages = importedData.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          setMessages(restoredMessages);
        }

        if (importedData.lastGeneratedData) {
          setLastGeneratedData({
            ...importedData.lastGeneratedData,
            generatedAt: new Date(importedData.lastGeneratedData.generatedAt),
          });
        }

        if (importedData.sessionState) {
          setSessionState({
            ...importedData.sessionState,
            lastActiveTime: new Date(importedData.sessionState.lastActiveTime),
          });
        }

        addMessage('system', '📥 データをインポートしました');
      } catch (error) {
        console.error('Import error:', error);
        addMessage('system', '❌ データのインポートに失敗しました');
      }
    };
    reader.readAsText(file);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-wb-wood-50 flex items-center justify-center">
        <div className="wb-loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wb-wood-50">
      {/* ワークベンチヘッダー */}
      <div className="sticky top-0 z-10 bg-wb-wood-100 border-b-2 border-wb-wood-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">✨</span>
              <div>
                <h1 className="text-lg font-bold text-wb-wood-800">
                  AI連携工具
                </h1>
                <p className="text-sm text-wb-wood-600">
                  ✨ 仕上げ工具 - AI連携・品質向上専用
                </p>
              </div>
            </div>
            <div className="text-sm text-wb-wood-500">Quality Workbench</div>
          </div>
        </div>
      </div>

      {/* ワークベンチメインエリア */}
      <div className="wb-workbench-surface max-w-7xl mx-auto px-4 py-6 lg:px-8">
        <div className="space-y-6">
          {/* ワークベンチヘッダー */}
          <div className="wb-workbench-header">
            <div className="flex items-center justify-center space-x-4">
              <div className="p-3 bg-wb-tool-polish-500 rounded-full shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div className="text-center">
                <h1 className="wb-tool-title text-wb-wood-800">
                  ✨ AI連携工具
                </h1>
                <p className="wb-tool-description text-wb-wood-600">
                  自然言語でテストデータを生成・品質向上をサポートします
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* メインチャットエリア */}
            <div className="xl:col-span-3 space-y-6">
              {/* チャットメッセージエリア */}
              <div className="wb-tool-panel wb-tool-polish">
                <div className="wb-tool-panel-header">
                  <div className="flex items-center justify-between">
                    <h3 className="wb-tool-panel-title">AI チャット</h3>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isConnected
                            ? 'bg-wb-tool-join-500'
                            : 'bg-wb-tool-cut-500'
                        }`}
                      ></div>
                      <span className="text-xs text-wb-wood-500">
                        {isConnected ? '接続中' : '未接続'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* メッセージ表示エリア */}
                <div className="h-96 overflow-y-auto space-y-4 p-4 bg-wb-wood-25 rounded-lg">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.type === 'user'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-wb-tool-polish-500 text-white'
                            : message.type === 'system'
                            ? 'bg-wb-wood-200 text-wb-wood-700'
                            : 'bg-white text-wb-wood-800 border border-wb-wood-200'
                        }`}
                      >
                        <div className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </div>
                        <div className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString('ja-JP')}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* 入力エリア */}
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="自然言語でテストデータの生成を依頼してください..."
                    className="wb-text-input flex-1"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    className="wb-action-button wb-action-primary px-4"
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* 進捗表示 */}
              {generationProgress.isActive && (
                <div className="wb-tool-panel">
                  <div className="wb-tool-panel-header">
                    <h3 className="wb-tool-panel-title">生成進捗</h3>
                  </div>
                  <div className="space-y-4">
                    <ProgressIndicator
                      progress={generationProgress.progress}
                      status={generationProgress.status}
                      currentStep={generationProgress.currentStep}
                      totalSteps={generationProgress.totalSteps}
                      isActive={generationProgress.isActive}
                      error={generationProgress.error}
                    />
                    <DataGenerationSteps steps={generationSteps} />
                  </div>
                </div>
              )}

              {/* 生成結果 */}
              {lastGeneratedData && (
                <div className="wb-result-panel">
                  <div className="wb-result-header">
                    <div className="wb-result-title-section">
                      <h3 className="wb-result-title">最新の生成結果</h3>
                      <p className="wb-result-subtitle">
                        {lastGeneratedData.count}件のデータ
                      </p>
                    </div>
                    <div className="wb-result-actions">
                      <button
                        onClick={handleDownloadCSV}
                        className="wb-result-action-button"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        CSV出力
                      </button>
                      <button
                        onClick={regenerateData}
                        disabled={isLoading}
                        className="wb-result-action-button"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        再生成
                      </button>
                    </div>
                  </div>

                  {/* データプレビュー */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-wb-wood-300">
                      <thead>
                        <tr className="bg-wb-wood-50">
                          {Object.keys(lastGeneratedData.data[0] || {}).map(
                            key => (
                              <th
                                key={key}
                                className="px-3 py-2 border-b border-wb-wood-200 text-left text-sm font-medium text-wb-wood-700"
                              >
                                {key}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {lastGeneratedData.data
                          .slice(0, 5)
                          .map((row, index) => (
                            <tr key={index} className="hover:bg-wb-wood-25">
                              {Object.values(row).map((value, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="px-3 py-2 border-b border-wb-wood-200 text-sm text-wb-wood-700"
                                >
                                  {String(value)}
                                </td>
                              ))}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {lastGeneratedData.data.length > 5 && (
                    <div className="wb-result-metadata">
                      <span className="wb-result-timestamp">
                        他 {lastGeneratedData.data.length - 5}{' '}
                        行のデータがあります
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* サイドバー */}
            <div className="space-y-6">
              {/* Brewキャラクター */}
              <div className="wb-character-section">
                <BrewCharacter
                  emotion={isLoading ? 'working' : 'happy'}
                  size="large"
                  animation={isLoading ? 'spin' : 'float'}
                  message={
                    isLoading ? 'AI処理中です...' : 'お気軽にお声がけください！'
                  }
                  showSpeechBubble={true}
                />
              </div>

              {/* セッション統計 */}
              <div className="wb-tool-panel">
                <div className="wb-tool-panel-header">
                  <h3 className="wb-tool-panel-title">セッション統計</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-wb-wood-600">総セッション数</span>
                    <span className="font-semibold text-wb-wood-800">
                      {sessionState.totalSessions}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-wb-wood-600">生成データ数</span>
                    <span className="font-semibold text-wb-wood-800">
                      {sessionState.totalDataGenerated}件
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-wb-wood-600">最終活動</span>
                    <span className="font-semibold text-xs text-wb-wood-700">
                      {sessionState.lastActiveTime.toLocaleTimeString('ja-JP')}
                    </span>
                  </div>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="wb-tool-panel">
                <div className="wb-tool-panel-header">
                  <h3 className="wb-tool-panel-title">アクション</h3>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={clearChatHistory}
                    className="w-full wb-action-button wb-action-secondary text-sm"
                  >
                    チャット履歴クリア
                  </button>
                  <button
                    onClick={exportAllData}
                    className="w-full wb-action-button wb-action-secondary text-sm"
                  >
                    データエクスポート
                  </button>
                  <label className="w-full wb-action-button wb-action-secondary text-sm cursor-pointer block text-center">
                    データインポート
                    <input
                      type="file"
                      accept=".json"
                      onChange={importData}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={clearAllData}
                    className="w-full wb-action-button wb-action-warning text-sm"
                  >
                    全データクリア
                  </button>
                </div>
              </div>

              {/* 高度な表示切り替え */}
              <div className="wb-tool-panel">
                <div className="wb-tool-panel-header">
                  <h3 className="wb-tool-panel-title">表示設定</h3>
                </div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showAdvancedView}
                    onChange={e => setShowAdvancedView(e.target.checked)}
                    className="wb-checkbox"
                  />
                  <span className="text-sm text-wb-wood-700">高度な表示</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 工具説明フッター */}
      <div className="bg-wb-wood-100 border-t border-wb-wood-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-lg font-medium text-wb-wood-800 mb-2">
            ✨ AI連携工具について
          </h3>
          <p className="text-wb-wood-600 max-w-3xl mx-auto">
            この工具は、自然言語でテストデータ生成を依頼できるAI連携機能です。仕上げツールとして、
            データの品質向上と効率的な生成をサポートします。
          </p>
        </div>
      </div>
    </div>
  );
}
