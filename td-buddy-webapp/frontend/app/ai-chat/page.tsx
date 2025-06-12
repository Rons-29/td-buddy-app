'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Brain, Database, Download, RefreshCw, AlertCircle, Check, Wifi, WifiOff } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useWebSocket } from '../../components/hooks/useWebSocket'
import { ProgressIndicator } from '../../components/ui/ProgressIndicator'
import { DataGenerationSteps } from '../../components/ui/DataGenerationSteps'

// TDCharacterを動的インポートしてSSRエラーを回避
const TDCharacter = dynamic(() => import BrewCharacter'), {
  ssr: false,
  loading: () => <div className="w-10 h-10 bg-td-primary-200 rounded-full animate-pulse"></div>
})

interface Message {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: any
}

interface ParsedParams {
  count: number
  locale: string
  includeFields: string[]
  filters?: {
    ageRange?: { min: number; max: number }
    gender?: 'male' | 'female' | 'both'
    jobCategory?: string
    location?: string
  }
}

interface GeneratedData {
  id: string
  count: number
  data: any[]
  generatedAt: Date
}

interface GenerationProgress {
  progress: number
  status: string
  currentStep: string
  totalSteps: number
  isActive: boolean
  error?: string
}

interface GenerationStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'active' | 'completed' | 'error'
  duration?: number
}

// 自動保存機能のユーティリティ
const AUTO_SAVE_KEYS = {
  CHAT_HISTORY: 'td-buddy-chat-history',
  LAST_GENERATED_DATA: 'td-buddy-last-data',
  USER_PREFERENCES: 'td-buddy-preferences',
  SESSION_STATE: 'td-buddy-session'
} as const

const saveToLocalStorage = (key: string, data: any) => {
  try {
    const serializedData = JSON.stringify(data)
    localStorage.setItem(key, serializedData)
    console.log(`💾 Auto-saved: ${key}`)
  } catch (error) {
    console.warn('💾 Auto-save failed:', error)
  }
}

const loadFromLocalStorage = (key: string, defaultValue: any = null) => {
  try {
    const saved = localStorage.getItem(key)
    if (saved) {
      const parsed = JSON.parse(saved)
      console.log(`📂 Auto-loaded: ${key}`)
      return parsed
    }
  } catch (error) {
    console.warn('📂 Auto-load failed:', error)
  }
  return defaultValue
}

const clearAutoSavedData = (key?: string) => {
  try {
    if (key) {
      localStorage.removeItem(key)
      console.log(`🗑️ Cleared: ${key}`)
    } else {
      Object.values(AUTO_SAVE_KEYS).forEach(k => localStorage.removeItem(k))
      console.log('🗑️ Cleared all auto-saved data')
    }
  } catch (error) {
    console.warn('🗑️ Clear failed:', error)
  }
}

export default function AIChatPage() {
  const [mounted, setMounted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [lastGeneratedData, setLastGeneratedData] = useState<GeneratedData | null>(null)
  const [lastParsedParams, setLastParsedParams] = useState<ParsedParams | null>(null)
  const [sessionState, setSessionState] = useState({
    lastActiveTime: new Date(),
    totalSessions: 0,
    totalDataGenerated: 0,
    preferredSettings: {
      autoSave: true,
      notifications: true,
      theme: 'default'
    }
  })
  const [showAdvancedView, setShowAdvancedView] = useState(false)
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({
    progress: 0,
    status: '待機中',
    currentStep: '',
    totalSteps: 3,
    isActive: false
  })
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([
    {
      id: 'parse',
      title: '自然言語解析',
      description: 'ユーザーの要求を分析してパラメータを抽出',
      status: 'pending'
    },
    {
      id: 'generate',
      title: 'データ醸造',
      description: '指定された条件に基づいてテストデータを生成',
      status: 'pending'
    },
    {
      id: 'validate',
      title: '品質検証',
      description: '生成されたデータの品質と整合性をチェック',
      status: 'pending'
    }
  ])
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { 
    isConnected, 
    progressData: wsProgressData, 
    stepData: wsStepData,
    resetProgress: wsResetProgress 
  } = useWebSocket()

  // 💾 自動保存: チャット履歴の復元（初期化時）
  useEffect(() => {
    setMounted(true)
    
    // チャット履歴の復元
    const savedMessages = loadFromLocalStorage(AUTO_SAVE_KEYS.CHAT_HISTORY, [])
    if (savedMessages.length > 0) {
      // timestampを Date オブジェクトに復元
      const restoredMessages = savedMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
      setMessages(restoredMessages)
      console.log(`🔄 Restored ${restoredMessages.length} messages from auto-save`)
      
      // 復元完了メッセージを追加
      setTimeout(() => {
        addMessage('system', `💾 前回のチャット履歴を復元しました（${restoredMessages.length}件のメッセージ）`)
      }, 500)
    } else {
      // 初回アクセス時のウェルカムメッセージ
      setTimeout(() => {
        addMessage('system', 
          '🎉 QA Workbench AI へようこそ！\n\n' +
          '🍺 TDです♪ 自然な日本語でテストデータの生成要求をお聞かせください！\n\n' +
          '✨ 新機能：自動保存\n' +
          '💾 チャット履歴と生成データが自動的に保存されます\n' +
          '🔄 次回アクセス時に前回の続きから始められます\n\n' +
          '例：「30代の男性エンジニア10人、連絡先付きで生成して」'
        )
      }, 300)
    }

    // 最後に生成されたデータの復元
    const savedData = loadFromLocalStorage(AUTO_SAVE_KEYS.LAST_GENERATED_DATA)
    if (savedData) {
      const restoredData = {
        ...savedData,
        generatedAt: new Date(savedData.generatedAt)
      }
      setLastGeneratedData(restoredData)
      console.log('🔄 Restored last generated data from auto-save')
    }

    // セッション状態の復元
    const savedSession = loadFromLocalStorage(AUTO_SAVE_KEYS.SESSION_STATE)
    if (savedSession) {
      const restoredSession = {
        ...savedSession,
        lastActiveTime: new Date(savedSession.lastActiveTime),
        totalSessions: savedSession.totalSessions + 1 // セッション数をインクリメント
      }
      setSessionState(restoredSession)
      console.log('🔄 Restored session state from auto-save')
    } else {
      // 初回セッション
      setSessionState(prev => ({
        ...prev,
        totalSessions: 1
      }))
    }

    // 入力フォーカス
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // 💾 自動保存: チャット履歴の保存（メッセージ変更時）
  useEffect(() => {
    if (mounted && messages.length > 0) {
      saveToLocalStorage(AUTO_SAVE_KEYS.CHAT_HISTORY, messages)
    }
  }, [messages, mounted])

  // 💾 自動保存: 生成データの保存（データ変更時）
  useEffect(() => {
    if (mounted && lastGeneratedData) {
      saveToLocalStorage(AUTO_SAVE_KEYS.LAST_GENERATED_DATA, lastGeneratedData)
      
      // データ醸造数を更新
      setSessionState(prev => ({
        ...prev,
        totalDataGenerated: prev.totalDataGenerated + lastGeneratedData.count,
        lastActiveTime: new Date()
      }))
    }
  }, [lastGeneratedData, mounted])

  // 💾 自動保存: セッション状態の保存
  useEffect(() => {
    if (mounted) {
      saveToLocalStorage(AUTO_SAVE_KEYS.SESSION_STATE, sessionState)
    }
  }, [sessionState, mounted])

  // WebSocketからの進捗データを監視
  useEffect(() => {
    if (mounted && wsProgressData) {
      setGenerationProgress({
        progress: wsProgressData.progress,
        status: wsProgressData.status,
        currentStep: wsProgressData.currentStep,
        totalSteps: wsProgressData.totalSteps,
        isActive: wsProgressData.isActive,
        error: wsProgressData.error
      })
    }
  }, [mounted, wsProgressData])

  // WebSocketからのステップデータを監視
  useEffect(() => {
    if (mounted && wsStepData) {
      setGenerationSteps(prev => prev.map(step => 
        step.id === wsStepData.id 
          ? { 
              ...step, 
              status: wsStepData.status, 
              duration: wsStepData.duration 
            }
          : step
      ))
    }
  }, [mounted, wsStepData])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 一意のID生成関数
  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  const addMessage = (type: 'user' | 'assistant' | 'system', content: string, metadata?: any) => {
    const newMessage: Message = {
      id: generateUniqueId(),
      type,
      content,
      timestamp: new Date(),
      metadata
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage
  }

  const updateStepStatus = (stepId: string, status: GenerationStep['status'], duration?: number) => {
    setGenerationSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, duration }
        : step
    ))
  }

  const updateProgress = (progress: number, status: string, currentStep: string, isActive: boolean, error?: string) => {
    setGenerationProgress({
      progress,
      status,
      currentStep,
      totalSteps: 3,
      isActive,
      error
    })
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = inputValue.trim()
    setInputValue('')
    setIsLoading(true)

    // 進捗リセット
    setGenerationSteps(prev => prev.map(step => ({ ...step, status: 'pending' })))
    updateProgress(0, '処理開始', '', true)

    // ユーザーメッセージ追加
    addMessage('user', userMessage)

    try {
      // Step 1: AI解析リクエスト
      updateStepStatus('parse', 'active')
      updateProgress(10, 'AI解析中...', '自然言語解析', true)
      addMessage('system', '🍺 自然言語を解析中...')
      
      const parseStartTime = Date.now()
      
      const parseResponse = await fetch('/api/ai/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: userMessage,
        }),
      })

      const parseResult = await parseResponse.json()
      const parseDuration = Date.now() - parseStartTime

      if (!parseResult.success) {
        updateStepStatus('parse', 'error', parseDuration)
        updateProgress(0, 'エラー発生', '自然言語解析でエラー', false, parseResult.error)
        if (parseResult.result?.clarificationNeeded) {
          addMessage('assistant', 
            `申し訳ございません。もう少し詳しく教えてください:\n\n${parseResult.result.clarificationQuestions?.join('\n') || '具体的な要求内容をお聞かせください。'}`
          )
        } else {
          addMessage('assistant', 
            `エラーが発生しました: ${parseResult.error || '不明なエラー'}`
          )
        }
        return
      }

      updateStepStatus('parse', 'completed', parseDuration)
      updateProgress(35, 'AI解析完了', '自然言語解析', true)

      const parsedParams = parseResult.result.params
      setLastParsedParams(parsedParams)

      // 解析結果の表示
      addMessage('assistant', 
        `✅ 解析完了！以下の条件でデータを醸造します:\n\n` +
        `📊 醸造数: ${parsedParams.count}件\n` +
        `🏷️ 含めるフィールド: ${parsedParams.includeFields.join(', ')}\n` +
        (parsedParams.filters?.ageRange ? `👤 年齢: ${parsedParams.filters.ageRange.min}-${parsedParams.filters.ageRange.max}歳\n` : '') +
        (parsedParams.filters?.gender && parsedParams.filters.gender !== 'both' ? `⚥ 性別: ${parsedParams.filters.gender}\n` : '') +
        (parsedParams.filters?.jobCategory ? `💼 職業: ${parsedParams.filters.jobCategory}\n` : ''),
        { parsedParams }
      )

      // Step 2: データ醸造リクエスト
      updateStepStatus('generate', 'active')
      updateProgress(40, 'データ醸造中...', 'データ醸造', true)
      addMessage('system', '⚡ データ醸造中...')

      const generateStartTime = Date.now()
      const generateResponse = await fetch('/api/personal/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          count: parsedParams.count,
          locale: parsedParams.locale,
          includeFields: parsedParams.includeFields,
          ageRange: parsedParams.filters?.ageRange,
          gender: parsedParams.filters?.gender === 'both' ? 'random' : parsedParams.filters?.gender,
        }),
      })

      const generateResult = await generateResponse.json()
      const generateDuration = Date.now() - generateStartTime

      if (!generateResult.success) {
        updateStepStatus('generate', 'error', generateDuration)
        updateProgress(40, 'エラー発生', 'データ醸造でエラー', false, generateResult.error)
        addMessage('assistant', `データ醸造エラー: ${generateResult.error}`)
        return
      }

      updateStepStatus('generate', 'completed', generateDuration)
      updateProgress(70, 'データ醸造完了', 'データ醸造', true)

      // Step 3: 品質検証
      updateStepStatus('validate', 'active')
      updateProgress(80, '品質検証中...', '品質検証', true)

      const generatedData: GeneratedData = {
        id: generateUniqueId(),
        count: generateResult.data.length,
        data: generateResult.data,
        generatedAt: new Date()
      }
      setLastGeneratedData(generatedData)

      // 検証完了
      setTimeout(() => {
        updateStepStatus('validate', 'completed', 500)
        updateProgress(100, '完了', 'すべての処理が完了', false)
      }, 500)

      // 醸造完了メッセージ
      addMessage('assistant', 
        `🎉 データ醸造完了！\n\n` +
        `✅ ${generatedData.count}件のテストデータを醸造しました\n` +
        `📈 生成時間: ${generateResult.metadata?.duration || 'N/A'}ms\n` +
        `🚀 スループット: ${generateResult.metadata?.throughput || 'N/A'} items/sec\n\n` +
        `下記のプレビューまたはダウンロードボタンからデータをご確認ください。`,
        { generatedData }
      )

    } catch (error) {
      console.error('Chat error:', error)
      updateProgress(0, 'エラー発生', '通信エラー', false, String(error))
      setGenerationSteps(prev => prev.map(step => 
        step.status === 'active' ? { ...step, status: 'error' } : step
      ))
      addMessage('assistant', `通信エラーが発生しました: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleDownloadCSV = async () => {
    if (!lastGeneratedData) return

    try {
      const response = await fetch('/api/personal/export/csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: lastGeneratedData.data,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `testdata_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        
        addMessage('system', '📋 CSVファイルをダウンロードしました！')
      }
    } catch (error) {
      addMessage('assistant', `ダウンロードエラー: ${error}`)
    }
  }

  const regenerateData = async () => {
    if (!lastParsedParams) return

    addMessage('user', '同じ条件でデータを再生成')
    addMessage('system', '🔄 データ再醸造中...')
    setIsLoading(true)

    try {
      const generateResponse = await fetch('/api/personal/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          count: lastParsedParams.count,
          locale: lastParsedParams.locale,
          includeFields: lastParsedParams.includeFields,
          ageRange: lastParsedParams.filters?.ageRange,
          gender: lastParsedParams.filters?.gender === 'both' ? 'random' : lastParsedParams.filters?.gender,
        }),
      })

      const generateResult = await generateResponse.json()

      if (generateResult.success) {
        const generatedData: GeneratedData = {
          id: generateUniqueId(),
          count: generateResult.data.length,
          data: generateResult.data,
          generatedAt: new Date()
        }
        setLastGeneratedData(generatedData)

        addMessage('assistant', 
          `🔄 データ再醸造完了！\n\n` +
          `✅ ${generatedData.count}件の新しいテストデータを醸造しました`
        )
      } else {
        addMessage('assistant', `再生成エラー: ${generateResult.error}`)
      }
    } catch (error) {
      addMessage('assistant', `再生成通信エラー: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  // 💾 チャット履歴クリア機能
  const clearChatHistory = () => {
    if (confirm('🗑️ チャット履歴をクリアしますか？この操作は元に戻せません。')) {
      setMessages([])
      clearAutoSavedData(AUTO_SAVE_KEYS.CHAT_HISTORY)
      addMessage('system', '🧹 チャット履歴をクリアしました')
    }
  }

  // 💾 全データクリア機能
  const clearAllData = () => {
    if (confirm('🗑️ すべての保存データ（チャット履歴・生成データ・設定）をクリアしますか？\nこの操作は元に戻せません。')) {
      setMessages([])
      setLastGeneratedData(null)
      setLastParsedParams(null)
      clearAutoSavedData()
      addMessage('system', '🧹 すべてのデータをクリアしました')
    }
  }

  // 💾 データエクスポート機能
  const exportAllData = () => {
    try {
      const exportData = {
        chatHistory: messages,
        lastGeneratedData,
        lastParsedParams,
        sessionState,
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      }
      
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `td-buddy-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      addMessage('system', '💾 データのエクスポートが完了しました')
    } catch (error) {
      console.error('エクスポートエラー:', error)
      addMessage('system', '❌ データのエクスポートに失敗しました')
    }
  }

  // 💾 データインポート機能
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string)
        
        // バージョン確認
        if (importedData.version !== '1.0.0') {
          addMessage('system', '⚠️ 互換性のないバックアップファイルです')
          return
        }

        // データの復元
        if (importedData.chatHistory) {
          const restoredMessages = importedData.chatHistory.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
          setMessages(restoredMessages)
        }

        if (importedData.lastGeneratedData) {
          const restoredData = {
            ...importedData.lastGeneratedData,
            generatedAt: new Date(importedData.lastGeneratedData.generatedAt)
          }
          setLastGeneratedData(restoredData)
        }

        if (importedData.lastParsedParams) {
          setLastParsedParams(importedData.lastParsedParams)
        }

        if (importedData.sessionState) {
          const restoredSession = {
            ...importedData.sessionState,
            lastActiveTime: new Date(importedData.sessionState.lastActiveTime)
          }
          setSessionState(restoredSession)
        }

        addMessage('system', 
          `📂 バックアップデータのインポートが完了しました\n` +
          `📅 バックアップ日時: ${new Date(importedData.exportedAt).toLocaleString()}`
        )

      } catch (error) {
        console.error('インポートエラー:', error)
        addMessage('system', '❌ バックアップファイルの読み込みに失敗しました')
      }
    }

    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-td-primary-50 via-white to-td-secondary-50">
      <div className="container mx-auto px-4 py-6">
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-td-primary-500 to-td-accent-500 rounded-xl shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-td-primary-600 to-td-accent-600 bg-clip-text text-transparent">
              AI Chat Generator
            </h1>
            <div className="p-3 bg-gradient-to-r from-td-secondary-500 to-td-primary-500 rounded-xl shadow-lg">
              <Database className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-td-primary-600 text-lg max-w-2xl mx-auto">
            自然な日本語でテストデータ醸造を依頼してください。AIが要求を理解して最適なデータを醸造します
          </p>
        </div>

        <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* チャットエリア */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-td-primary-100 overflow-hidden h-full flex flex-col">
              {/* チャットヘッダー */}
              <div className="bg-gradient-to-r from-td-primary-500 to-td-accent-500 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                    <span className="text-white text-lg font-bold">TD</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">QA Workbench AI</h3>
                    <p className="text-td-primary-100 text-sm">自然言語データ醸造アシスタント</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    {mounted && isConnected ? (
                      <>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white text-sm">接続中</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="text-white text-sm">待機中</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* メッセージエリア */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-td-primary-25">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-td-primary-500 to-td-secondary-500 text-white ml-auto' 
                        : message.type === 'system'
                        ? 'bg-td-accent-100 text-td-accent-800 border border-td-accent-200'
                        : 'bg-white text-td-primary-800 border border-td-primary-200 shadow-sm'
                    }`}>
                      <div className="flex items-start gap-2">
                        {message.type === 'assistant' && (
                          <div className="w-6 h-6 bg-gradient-to-r from-td-primary-400 to-td-accent-400 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                            <span className="text-white text-xs font-bold">TD</span>
                          </div>
                        )}
                        {message.type === 'system' && (
                          <Sparkles className="w-5 h-5 mt-1 flex-shrink-0 text-td-accent-500" />
                        )}
                        <div className="flex-1">
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.content}
                          </p>
                          {mounted && (
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-td-primary-800 border border-td-primary-200 rounded-2xl px-4 py-2 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-td-primary-400 to-td-accent-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">TD</span>
                        </div>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-td-primary-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-td-primary-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-td-primary-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* 入力エリア */}
              <div className="p-4 border-t border-td-primary-100 bg-white">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="例：30代の女性エンジニア5人、連絡先付きで生成して"
                      className="w-full px-4 py-3 border border-td-primary-300 rounded-xl focus:ring-2 focus:ring-td-primary-500 focus:border-transparent outline-none transition-all"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-td-primary-500 to-td-accent-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    送信
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-4 h-full overflow-y-auto">
            {/* 処理状況 */}
            {(isLoading || generationProgress.progress > 0) && (
              <div className="space-y-3">
                <ProgressIndicator
                  progress={generationProgress.progress}
                  status={generationProgress.status}
                  currentStep={generationProgress.currentStep}
                  totalSteps={generationProgress.totalSteps}
                  isActive={generationProgress.isActive}
                  error={generationProgress.error}
                />
                
                {generationSteps.some(step => step.status !== 'pending') && (
                  <DataGenerationSteps steps={generationSteps} />
                )}
              </div>
            )}

            {/* 接続状況 */}
            <div className="bg-white rounded-xl shadow-sm border border-td-primary-100 p-4">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                {isConnected ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-td-primary-800">🔗 接続状況</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-red-600">🔗 接続状況</span>
                  </>
                )}
              </h3>
              <p className="text-xs text-td-primary-600">
                {isConnected 
                  ? '✅ リアルタイム更新有効' 
                  : '❌ サーバー未接続'
                }
              </p>
            </div>

            {/* クイックアクション */}
            {lastGeneratedData && (
              <div className="bg-white rounded-xl shadow-sm border border-td-primary-100 p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Database className="w-4 h-4 text-td-primary-500" />
                  生成データ
                </h3>
                
                <div className="space-y-3">
                  <div className="bg-td-primary-50 rounded-lg p-3">
                    <p className="text-xs text-td-primary-600">生成件数</p>
                    <p className="text-xl font-bold text-td-primary-600">{lastGeneratedData.count}件</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadCSV}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-td-accent-500 text-white rounded-lg hover:bg-td-accent-600 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      CSV
                    </button>
                    <button
                      onClick={regenerateData}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-td-secondary-500 text-white rounded-lg hover:bg-td-secondary-600 transition-colors text-sm"
                      disabled={isLoading}
                    >
                      <RefreshCw className="w-4 h-4" />
                      再生成
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* データプレビュー */}
            {lastGeneratedData && (
              <div className="bg-white rounded-xl shadow-sm border border-td-primary-100 p-4">
                <h3 className="text-sm font-semibold mb-3 text-td-primary-800">データプレビュー</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {lastGeneratedData.data.slice(0, 3).map((item, index) => (
                    <div key={index} className="bg-td-primary-50 rounded-lg p-2 text-xs">
                      <div className="font-medium text-td-primary-900">
                        {item.fullName?.kanji || item.fullName || 'N/A'}
                      </div>
                      <div className="text-td-primary-600 truncate">
                        {item.email || 'メールなし'} • {item.phone || '電話なし'}
                      </div>
                    </div>
                  ))}
                  {lastGeneratedData.data.length > 3 && (
                    <div className="text-center text-td-primary-500 text-xs py-1">
                      他 {lastGeneratedData.data.length - 3} 件...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 💾 自動保存コントロールパネル */}
            <div className="bg-white rounded-xl shadow-sm border border-td-primary-100 p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse"></div>
                💾 自動保存
              </h3>
              
              <div className="space-y-3">
                {/* 保存状況表示 */}
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">保存状況</span>
                  </div>
                  <div className="space-y-1 text-xs text-green-700">
                    <div>💬 チャット履歴: {messages.length}件</div>
                    <div>📊 生成データ: {lastGeneratedData ? '1件' : '0件'}</div>
                    <div>🎯 累計生成: {sessionState.totalDataGenerated.toLocaleString()}件</div>
                    <div>🔄 セッション: {sessionState.totalSessions}回目</div>
                    <div>⚙️ 設定: 自動保存有効</div>
                  </div>
                </div>

                {/* 操作ボタン */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={exportAllData}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      出力
                    </button>
                    <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm cursor-pointer">
                      <input
                        type="file"
                        accept=".json"
                        onChange={importData}
                        className="hidden"
                      />
                      📂 読込
                    </label>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={clearChatHistory}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-xs"
                    >
                      🗑️ 履歴
                    </button>
                    <button
                      onClick={clearAllData}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs"
                    >
                      🗑️ 全て
                    </button>
                  </div>
                </div>

                {/* 自動保存の説明 */}
                <div className="bg-td-primary-50 rounded-lg p-2 border border-td-primary-200">
                  <p className="text-xs text-td-primary-600">
                    💡 チャット履歴と生成データは自動的に保存され、次回アクセス時に復元されます
                  </p>
                </div>
              </div>
            </div>

            {/* ヘルプ */}
            <div className="bg-gradient-to-r from-td-primary-50 to-td-accent-50 rounded-xl border border-td-primary-100 p-4">
              <h3 className="text-sm font-semibold mb-3 text-td-primary-800">💡 使い方のヒント</h3>
              <div className="space-y-2 text-xs text-td-primary-700">
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 mt-0.5 text-td-accent-500 flex-shrink-0" />
                  <span>「20代の男性5人」のように年齢と性別を指定</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 mt-0.5 text-td-accent-500 flex-shrink-0" />
                  <span>「連絡先付き」で電話・メール情報を含める</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 mt-0.5 text-td-accent-500 flex-shrink-0" />
                  <span>「エンジニア」「営業」など職業も指定可能</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3 h-3 mt-0.5 text-td-accent-500 flex-shrink-0" />
                  <span>「詳細情報で」と言えば住所等も含まれます</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 