 Server as SocketIOServer } 
 Server as HTTPServer } 

/**
 * WebSocketサービスクラス
 * リアルタイム通信でAI処理状況やデータ生成進行を配信
 */
export class WebSocketService {
  private io: SocketIOServer;
  private static instance: WebSocketService;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.FRONTEND_URL || 'https://td-buddy.com'
          : ['http://localhost:3000', 'http://127.0.0.1:3000'],
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.setupEventHandlers();
    WebSocketService.instance = this;
  }

  static getInstance(): WebSocketService {
    return WebSocketService.instance;
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      logger.log('🔌 WebSocket接続確立:', socket.id);

      // クライアント接続時の初期化
      socket.emit('connection_established', {
        socketId: socket.id,
        timestamp: new Date().toISOString(),
        message: 'TDのリアルタイム通信が開始されました'
      });

      // AIチャットルームに参加
      socket.on('join_ai_chat', (data) => {
        socket.join('ai_chat');
        logger.log('🍺 AIチャットルーム参加:', socket.id);
        
        socket.emit('joined_ai_chat', {
          message: 'AIチャットルームに参加しました',
          timestamp: new Date().toISOString()
        });
      });

      // データ生成ルームに参加
      socket.on('join_data_generation', (data) => {
        socket.join('data_generation');
        logger.log('📊 データ生成ルーム参加:', socket.id);
        
        socket.emit('joined_data_generation', {
          message: 'データ生成ルームに参加しました',
          timestamp: new Date().toISOString()
        });
      });

      // 切断時の処理
      socket.on('disconnect', (reason) => {
        logger.log('❌ WebSocket切断:', socket.id, '理由:', reason);
      });

      // エラーハンドリング
      socket.on('error', (error) => {
        logger.error('❌ WebSocketエラー:', error);
        socket.emit('error_occurred', {
          error: 'WebSocket通信エラーが発生しました',
          timestamp: new Date().toISOString()
        });
      });
    });
  }

  /**
   * AI解析開始の通知
   */
  notifyAIAnalysisStart(sessionId: string, userInput: string) {
    this.io.to('ai_chat').emit('ai_analysis_start', {
      sessionId,
      userInput,
      message: '🧠 AIが自然言語を解析中...',
      timestamp: new Date().toISOString(),
      stage: 'parsing'
    });
  }

  /**
   * AI解析中の進行状況
   */
  notifyAIAnalysisProgress(sessionId: string, stage: string, progress: number, message: string) {
    this.io.to('ai_chat').emit('ai_analysis_progress', {
      sessionId,
      stage, // 'parsing', 'parameter_extraction', 'validation'
      progress, // 0-100
      message,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * AI解析完了の通知
   */
  notifyAIAnalysisComplete(sessionId: string, parsedParams: Record<string, unknown>) {
    this.io.to('ai_chat').emit('ai_analysis_complete', {
      sessionId,
      parsedParams,
      message: '✅ AI解析が完了しました',
      timestamp: new Date().toISOString(),
      stage: 'complete'
    });
  }

  /**
   * AI解析エラーの通知
   */
  notifyAIAnalysisError(sessionId: string, error: string) {
    this.io.to('ai_chat').emit('ai_analysis_error', {
      sessionId,
      error,
      message: '❌ AI解析中にエラーが発生しました',
      timestamp: new Date().toISOString(),
      stage: 'error'
    });
  }

  /**
   * データ生成開始の通知
   */
  notifyDataGenerationStart(sessionId: string, params: Record<string, unknown>) {
    this.io.to('data_generation').emit('data_generation_start', {
      sessionId,
      params,
      message: `📊 ${params.count}件のデータ生成を開始...`,
      timestamp: new Date().toISOString(),
      totalCount: params.count
    });
  }

  /**
   * データ生成進行状況の通知
   */
  notifyDataGenerationProgress(sessionId: string, currentCount: number, totalCount: number, sampleData?: Record<string, unknown>) {
    const progress = Math.round((currentCount / totalCount) * 100);
    
    this.io.to('data_generation').emit('data_generation_progress', {
      sessionId,
      currentCount,
      totalCount,
      progress,
      sampleData,
      message: `📈 データ生成中... ${currentCount}/${totalCount} (${progress}%)`,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * データ生成完了の通知
   */
  notifyDataGenerationComplete(sessionId: string, generatedData: Record<string, unknown>, stats: Record<string, unknown>) {
    this.io.to('data_generation').emit('data_generation_complete', {
      sessionId,
      generatedData,
      stats, // 生成時間、性能指標など
      message: `🎉 データ生成完了！${generatedData.length}件のデータが生成されました`,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * データ生成エラーの通知
   */
  notifyDataGenerationError(sessionId: string, error: string) {
    this.io.to('data_generation').emit('data_generation_error', {
      sessionId,
      error,
      message: '❌ データ生成中にエラーが発生しました',
      timestamp: new Date().toISOString()
    });
  }

  /**
   * システム通知の送信
   */
  notifySystemMessage(room: string, message: string, type: 'info' | 'warning' | 'error' = 'info') {
    this.io.to(room).emit('system_notification', {
      type,
      message,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * 特定のクライアントへのメッセージ送信
   */
  sendToClient(socketId: string, event: string) {
    this.io.to(socketId).emit(event, data);
  }

  /**
   * 接続中のクライアント数を取得
   */
  getConnectedClientsCount(): number {
    return this.io.sockets.sockets.size;
  }

  /**
   * 特定ルームのクライアント数を取得
   */
  async getRoomClientsCount(room: string): Promise<number> {
    const sockets = await this.io.in(room).fetchSockets();
    return sockets.length;
  }

  /**
   * 進捗更新の送信
   */
  broadcastProgress(progressData: {
    progress: number;
    status: string;
    currentStep: string;
    totalSteps: number;
    isActive: boolean;
    error?: string;
  }, room: string = 'ai_chat') {
    this.io.to(room).emit('progress_update', {
      ...progressData,
      timestamp: new Date().toISOString()
    });
    logger.log(`📊 進捗更新をブロードキャスト (${room}):`, progressData);
  }

  /**
   * ステップ更新の送信
   */
  broadcastStepUpdate(stepData: {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'active' | 'completed' | 'error';
    duration?: number;
  }, room: string = 'ai_chat') {
    this.io.to(room).emit('step_update', {
      ...stepData,
      timestamp: new Date().toISOString()
    });
    logger.log(`📋 ステップ更新をブロードキャスト (${room}):`, stepData);
  }

  /**
   * WebSocketサーバーを取得
   */
  getIO(): SocketIOServer {
    return this.io;
  }
}

/**
 * WebSocketイベント型定義
 */
export interface WebSocketEvents {
  // AI解析関連
  ai_analysis_start: { sessionId: string; userInput: string; message: string; timestamp: string; stage: string };
  ai_analysis_progress: { sessionId: string; stage: string; progress: number; message: string; timestamp: string };
  ai_analysis_complete: { sessionId: string; parsedParams: Record<string, unknown>; message: string; timestamp: string; stage: string };
  ai_analysis_error: { sessionId: string; error: string; message: string; timestamp: string; stage: string };

  // データ生成関連
  data_generation_start: { sessionId: string; params: Record<string, unknown>; message: string; timestamp: string; totalCount: number };
  data_generation_progress: { sessionId: string; currentCount: number; totalCount: number; progress: number; sampleData?: Record<string, unknown>; message: string; timestamp: string };
  data_generation_complete: { sessionId: string; generatedData: Record<string, unknown>; stats: Record<string, unknown>; message: string; timestamp: string };
  data_generation_error: { sessionId: string; error: string; message: string; timestamp: string };

  // システム通知
  system_notification: { type: 'info' | 'warning' | 'error'; message: string; timestamp: string };
  connection_established: { socketId: string; timestamp: string; message: string };
  joined_ai_chat: { message: string; timestamp: string };
  joined_data_generation: { message: string; timestamp: string };
  error_occurred: { error: string; timestamp: string };
} 
