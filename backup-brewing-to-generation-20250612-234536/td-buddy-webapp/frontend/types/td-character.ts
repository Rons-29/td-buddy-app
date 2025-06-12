// Brewキャラクターの感情状態
export type BrewEmotion = 
  | 'happy'      // 😊 嬉しい・満足
  | 'excited'    // 🤩 興奋・やる気
  | 'thinking'   // 🤔 考え中・処理中
  | 'working'    // 😤 作業中・集中
  | 'success'    // 😎 成功・達成
  | 'warning'    // 😟 警告・注意
  | 'error'      // 😅 エラー・困った
  | 'sleepy'     // 😴 待機中・お休み
  | 'curious'    // 🤨 興味深い・観察
  | 'friendly';  // 😄 親しみやすい・歓迎

// Brewキャラクターのアニメーションタイプ
export type TDAnimation = 
  | 'none'       // アニメーションなし
  | 'bounce'     // 上下バウンス
  | 'wiggle'     // 左右ゆらゆら
  | 'pulse'      // 拡大縮小
  | 'spin'       // 回転
  | 'heartbeat'  // 心臓の鼓動
  | 'float';     // ふわふわ浮遊

// Brewキャラクターのサイズ
export type TDSize = 'small' | 'medium' | 'large' | 'xlarge';

// TDの状態管理用インターフェース
export interface TDState {
  emotion: BrewEmotion;
  animation: TDAnimation;
  message: string;
  isActive: boolean;
  lastActivity: Date;
}

// ブリューからのメッセージ定義
export interface TDMessage {
  id: string;
  emotion: BrewEmotion;
  text: string;
  timestamp: Date;
  duration?: number; // 表示時間（ミリ秒）
}

// Brewキャラクターのプロパティ
export interface TDCharacterProps {
  emotion?: BrewEmotion;
  animation?: TDAnimation;
  size?: TDSize;
  message?: string;
  showSpeechBubble?: boolean;
  className?: string;
  onClick?: () => void;
}

// 感情と絵文字のマッピング
export const EMOTION_EMOJIS: Record<BrewEmotion, string> = {
  happy: '😊',
  excited: '🤩',
  thinking: '🤔',
  working: '😤',
  success: '😎',
  warning: '😟',
  error: '😅',
  sleepy: '😴',
  curious: '🤨',
  friendly: '🍺'
};

// 感情と日本語ラベルのマッピング
export const EMOTION_LABELS: Record<BrewEmotion, string> = {
  happy: 'ハッピー',
  excited: '興奮',
  thinking: '思考中',
  working: '作業中',
  success: '成功',
  warning: '注意',
  error: 'エラー',
  sleepy: '待機中',
  curious: '興味深い',
  friendly: 'フレンドリー'
};

// デフォルトメッセージ
export const DEFAULT_MESSAGES: Record<BrewEmotion, string[]> = {
  happy: [
    '嬉しいです！一緒に頑張りましょう♪',
    'いい感じですね！このまま進めましょう',
    '順調に進んでいますね！'
  ],
  excited: [
    'やったー！素晴らしい結果です！',
    'これは期待できそうですね！',
    'ワクワクしてきました！'
  ],
  thinking: [
    'ちょっと考えさせてください...',
    '最適な方法を検討中です',
    'うーん、どうしましょうか？'
  ],
  working: [
    '作業中です！少々お待ちください',
    '一生懸命処理しています',
    '集中して取り組んでいます'
  ],
  success: [
    '成功しました！お疲れさまです',
    'パーフェクトな結果です！',
    'ミッション完了です！'
  ],
  warning: [
    'ちょっと注意が必要かもしれません',
    '念のため確認してみましょう',
    '少し気になることがあります'
  ],
  error: [
    '申し訳ありません！何かエラーが...',
    'うまくいかないようです',
    '一緒に解決策を考えましょう'
  ],
  sleepy: [
    'お疲れさまです。少し休憩しませんか？',
    'のんびり待機中です',
    'いつでもお声がけください'
  ],
  curious: [
    '興味深いですね！詳しく教えてください',
    'もう少し詳細を知りたいです',
    'どんな結果になるでしょうか？'
  ],
  friendly: [
    'こんにちは！TDです。よろしくお願いします♪',
    '何かお手伝いできることはありますか？',
    '一緒に素晴らしいものを作りましょう！'
  ]
}; 