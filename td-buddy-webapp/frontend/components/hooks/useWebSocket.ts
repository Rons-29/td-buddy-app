import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketEvent {
  id: string;
  type: 'ai_analysis_start' | 'ai_analysis_progress' | 'ai_analysis_complete' | 'ai_analysis_error' |
        'data_generation_start' | 'data_generation_progress' | 'data_generation_complete' | 'data_generation_error' |
        'system_notification';
  message: string;
  timestamp: string;
  data?: any;
}

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastMessage: any;
  error: string | null;
  events: WebSocketEvent[];
  progressData: ProgressData | null;
  stepData: StepData | null;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (event: string, data: any) => void;
  joinRoom: (room: 'ai_chat' | 'data_generation') => void;
  leaveRoom: (room: string) => void;
  resetProgress: () => void;
}

interface WebSocketState {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastMessage: any;
  error: string | null;
}

interface ProgressData {
  progress: number;
  status: string;
  currentStep: string;
  totalSteps: number;
  isActive: boolean;
  error?: string;
  timestamp: string;
}

interface StepData {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  duration?: number;
  timestamp: string;
}

/**
 * WebSocket接続とリアルタイム通信を管理するカスタムHook
 */
export function useWebSocket(url?: string): UseWebSocketReturn {
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    connectionStatus: 'disconnected',
    lastMessage: null,
    error: null
  });

  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [stepData, setStepData] = useState<StepData | null>(null);
  const [events, setEvents] = useState<WebSocketEvent[]>([]);
  
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    // WebSocket接続の確立
    const socketUrl = url || (
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.td-buddy.com'
        : 'http://localhost:3001'
    );

    console.log('🔌 WebSocket接続試行:', socketUrl);

    socketRef.current = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000
    });

    const socket = socketRef.current;

    // 接続イベント
    socket.on('connect', () => {
      console.log('✅ WebSocket接続確立:', socket.id);
      setState(prev => ({
        ...prev,
        isConnected: true,
        connectionStatus: 'connected',
        error: null
      }));
      reconnectAttempts.current = 0;

      // AIチャットルームに参加
      socket.emit('join_ai_chat', { timestamp: new Date().toISOString() });
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket切断:', reason);
      setState(prev => ({
        ...prev,
        isConnected: false,
        connectionStatus: 'disconnected'
      }));

      // 自動再接続
      if (reason === 'io server disconnect') {
        // サーバーが切断した場合は手動で再接続
        attemptReconnect();
      }
    });

    socket.on('connect_error', (error) => {
      console.error('❌ WebSocket接続エラー:', error);
      setState(prev => ({
        ...prev,
        isConnected: false,
        connectionStatus: 'error',
        error: error.message
      }));
      attemptReconnect();
    });

    // AI解析関連イベント
    socket.on('ai_analysis_start', (data) => {
      console.log('🧠 AI解析開始:', data);
      setProgressData({
        progress: 10,
        status: 'AI解析中...',
        currentStep: '自然言語解析',
        totalSteps: 3,
        isActive: true,
        timestamp: data.timestamp
      });
      addEvent('ai_analysis_start', data.message, data);
    });

    socket.on('ai_analysis_progress', (data) => {
      console.log('🔄 AI解析進行:', data);
      setProgressData({
        progress: data.progress,
        status: data.message,
        currentStep: data.stage,
        totalSteps: 3,
        isActive: true,
        timestamp: data.timestamp
      });
    });

    socket.on('ai_analysis_complete', (data) => {
      console.log('✅ AI解析完了:', data);
      setProgressData({
        progress: 40,
        status: 'AI解析完了',
        currentStep: 'データ生成準備',
        totalSteps: 3,
        isActive: true,
        timestamp: data.timestamp
      });
    });

    socket.on('ai_analysis_error', (data) => {
      console.error('❌ AI解析エラー:', data);
      setProgressData({
        progress: 0,
        status: 'エラー発生',
        currentStep: 'AI解析',
        totalSteps: 3,
        isActive: false,
        error: data.error,
        timestamp: data.timestamp
      });
    });

    // データ生成関連イベント
    socket.on('data_generation_start', (data) => {
      console.log('📊 データ生成開始:', data);
      setProgressData({
        progress: 50,
        status: 'データ生成中...',
        currentStep: 'データ生成',
        totalSteps: 3,
        isActive: true,
        timestamp: data.timestamp
      });
    });

    socket.on('data_generation_progress', (data) => {
      console.log('📈 データ生成進行:', data);
      const progress = 50 + (data.progress * 0.4); // 50-90%の範囲
      setProgressData({
        progress: Math.round(progress),
        status: data.message,
        currentStep: 'データ生成',
        totalSteps: 3,
        isActive: true,
        timestamp: data.timestamp
      });
    });

    socket.on('data_generation_complete', (data) => {
      console.log('🎉 データ生成完了:', data);
      setProgressData({
        progress: 100,
        status: 'データ生成完了',
        currentStep: '完了',
        totalSteps: 3,
        isActive: false,
        timestamp: data.timestamp
      });
    });

    socket.on('data_generation_error', (data) => {
      console.error('❌ データ生成エラー:', data);
      setProgressData({
        progress: 50,
        status: 'エラー発生',
        currentStep: 'データ生成',
        totalSteps: 3,
        isActive: false,
        error: data.error,
        timestamp: data.timestamp
      });
    });

    // システム通知
    socket.on('system_notification', (data) => {
      console.log('📢 システム通知:', data);
      setState(prev => ({ ...prev, lastMessage: data }));
    });

    // エラーハンドリング
    socket.on('error_occurred', (data) => {
      console.error('❌ WebSocketエラー:', data);
      setState(prev => ({ ...prev, error: data.error }));
    });

    // 進捗更新イベント
    socket.on('progress_update', (data: ProgressData) => {
      console.log('📊 進捗更新受信:', data);
      setProgressData(data);
    });

    // ステップ更新イベント
    socket.on('step_update', (data: StepData) => {
      console.log('📋 ステップ更新受信:', data);
      setStepData(data);
    });

    // クリーンアップ
    return () => {
      console.log('🧹 WebSocket接続をクリーンアップ');
      socket.disconnect();
    };
  }, [url]);

  // イベント追加ヘルパー
  const addEvent = (type: WebSocketEvent['type'], message: string, data?: any) => {
    const event: WebSocketEvent = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date().toISOString(),
      data
    };
    
    setEvents(prev => [event, ...prev].slice(0, 50));
  };

  // イベントクリア
  const clearEvents = () => {
    setEvents([]);
    setProgressData(null);
    setStepData(null);
  };

  const attemptReconnect = () => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.error('❌ 最大再接続試行回数に達しました');
      setState(prev => ({
        ...prev,
        connectionStatus: 'error',
        error: '接続に失敗しました。ページを再読み込みしてください。'
      }));
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
    console.log(`🔄 ${delay}ms後に再接続を試行します (${reconnectAttempts.current + 1}/${maxReconnectAttempts})`);

    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectAttempts.current++;
      connect();
    }, delay);
  };

  const connect = () => {
    if (socketRef.current?.connected) {
      return;
    }

    setState(prev => ({ ...prev, connectionStatus: 'connecting', error: null }));

    socketRef.current = io(url || (
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.td-buddy.com'
        : 'http://localhost:3001'
    ), {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      forceNew: true
    });

    const socket = socketRef.current;

    // 接続成功
    socket.on('connect', () => {
      console.log('🔌 WebSocket接続成功:', socket.id);
      setState(prev => ({
        ...prev,
        isConnected: true,
        connectionStatus: 'connected',
        error: null
      }));
      reconnectAttempts.current = 0;

      // AIチャットルームに参加
      socket.emit('join_ai_chat', { timestamp: new Date().toISOString() });
    });

    // 接続確立通知
    socket.on('connection_established', (data) => {
      console.log('✅ 接続確立:', data);
      setState(prev => ({ ...prev, lastMessage: data }));
    });

    // 進捗更新イベント
    socket.on('progress_update', (data: ProgressData) => {
      console.log('📊 進捗更新受信:', data);
      setProgressData(data);
    });

    // ステップ更新イベント
    socket.on('step_update', (data: StepData) => {
      console.log('📋 ステップ更新受信:', data);
      setStepData(data);
    });

    // AI解析関連イベント
    socket.on('ai_analysis_start', (data) => {
      console.log('🧠 AI解析開始:', data);
      setProgressData({
        progress: 10,
        status: 'AI解析中...',
        currentStep: '自然言語解析',
        totalSteps: 3,
        isActive: true,
        timestamp: data.timestamp
      });
    });

    socket.on('ai_analysis_progress', (data) => {
      console.log('🔄 AI解析進行:', data);
      setProgressData({
        progress: data.progress,
        status: data.message,
        currentStep: data.stage,
        totalSteps: 3,
        isActive: true,
        timestamp: data.timestamp
      });
    });

    socket.on('ai_analysis_complete', (data) => {
      console.log('✅ AI解析完了:', data);
      setProgressData({
        progress: 40,
        status: 'AI解析完了',
        currentStep: 'データ生成準備',
        totalSteps: 3,
        isActive: true,
        timestamp: data.timestamp
      });
    });

    socket.on('ai_analysis_error', (data) => {
      console.error('❌ AI解析エラー:', data);
      setProgressData({
        progress: 0,
        status: 'エラー発生',
        currentStep: 'AI解析',
        totalSteps: 3,
        isActive: false,
        error: data.error,
        timestamp: data.timestamp
      });
    });

    // データ生成関連イベント
    socket.on('data_generation_start', (data) => {
      console.log('📊 データ生成開始:', data);
      setProgressData({
        progress: 50,
        status: 'データ生成中...',
        currentStep: 'データ生成',
        totalSteps: 3,
        isActive: true,
        timestamp: data.timestamp
      });
    });

    socket.on('data_generation_progress', (data) => {
      console.log('📈 データ生成進行:', data);
      const progress = 50 + (data.progress * 0.4); // 50-90%の範囲
      setProgressData({
        progress: Math.round(progress),
        status: data.message,
        currentStep: 'データ生成',
        totalSteps: 3,
        isActive: true,
        timestamp: data.timestamp
      });
    });

    socket.on('data_generation_complete', (data) => {
      console.log('🎉 データ生成完了:', data);
      setProgressData({
        progress: 100,
        status: 'データ生成完了',
        currentStep: '完了',
        totalSteps: 3,
        isActive: false,
        timestamp: data.timestamp
      });
    });

    socket.on('data_generation_error', (data) => {
      console.error('❌ データ生成エラー:', data);
      setProgressData({
        progress: 50,
        status: 'エラー発生',
        currentStep: 'データ生成',
        totalSteps: 3,
        isActive: false,
        error: data.error,
        timestamp: data.timestamp
      });
    });

    // システム通知
    socket.on('system_notification', (data) => {
      console.log('📢 システム通知:', data);
      setState(prev => ({ ...prev, lastMessage: data }));
    });

    // エラーハンドリング
    socket.on('error_occurred', (data) => {
      console.error('❌ WebSocketエラー:', data);
      setState(prev => ({ ...prev, error: data.error }));
    });

    // 進捗更新イベント
    socket.on('progress_update', (data: ProgressData) => {
      console.log('📊 進捗更新受信:', data);
      setProgressData(data);
    });

    // ステップ更新イベント
    socket.on('step_update', (data: StepData) => {
      console.log('📋 ステップ更新受信:', data);
      setStepData(data);
    });
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setState({
      isConnected: false,
      connectionStatus: 'disconnected',
      lastMessage: null,
      error: null
    });
  };

  const sendMessage = (event: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
      console.log(`📤 メッセージ送信: ${event}`, data);
    } else {
      console.warn('⚠️ WebSocket未接続のため送信できません');
    }
  };

  const joinRoom = (room: 'ai_chat' | 'data_generation') => {
    sendMessage('join_room', room);
  };

  const leaveRoom = (room: string) => {
    sendMessage('leave_room', room);
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [url]);

  return {
    ...state,
    progressData,
    stepData,
    connect,
    disconnect,
    sendMessage,
    joinRoom,
    leaveRoom,
    resetProgress: clearEvents,
    socket: socketRef.current,
    events
  };
} 