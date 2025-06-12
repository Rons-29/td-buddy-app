'use client';

import React, { useState, useEffect } from 'react';

// TDの感情状態
export type TDEmotion = 
  | 'happy'      // 😊 嬉しい・満足
  | 'excited'    // 🤩 興奮・やる気
  | 'thinking'   // 🤔 考え中・処理中
  | 'working'    // 😤 作業中・集中
  | 'success'    // 😎 成功・達成
  | 'warning'    // 😟 警告・注意
  | 'error'      // 😅 エラー・困った
  | 'sleepy'     // 😴 待機中・お休み
  | 'curious'    // 🤨 興味深い・観察
  | 'friendly'   // 😄 親しみやすい・歓迎
  | 'sad'        // 😢 悲しい・落ち込み
  | 'confused'   // 😕 混乱・困惑
  | 'worried';   // 😰 心配・不安

// アニメーションタイプ
export type TDAnimation = 
  | 'none'       // アニメーションなし
  | 'bounce'     // 上下バウンス
  | 'wiggle'     // 左右ゆらゆら
  | 'pulse'      // 拡大縮小
  | 'spin'       // 回転
  | 'heartbeat'  // 心臓の鼓動
  | 'float';     // ふわふわ浮遊

interface TDCharacterProps {
  emotion?: TDEmotion;
  animation?: TDAnimation;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  message?: string;
  showSpeechBubble?: boolean;
  className?: string;
  onClick?: () => void;
}

const TDCharacter: React.FC<TDCharacterProps> = ({
  emotion = 'friendly',
  animation = 'heartbeat',
  size = 'medium',
  message = '',
  showSpeechBubble = false,
  className = '',
  onClick
}) => {
  const [currentMessage, setCurrentMessage] = useState(message);
  const [isAnimating, setIsAnimating] = useState(true);

  // メッセージが変わったときの処理
  useEffect(() => {
    if (message !== currentMessage) {
      setCurrentMessage(message);
    }
  }, [message, currentMessage]);

  // 感情に応じた絵文字マッピング
  const emotionEmojis: Record<TDEmotion, string> = {
    happy: '😊',
    excited: '🤩',
    thinking: '🤔',
    working: '😤',
    success: '😎',
    warning: '😟',
    error: '😅',
    sleepy: '😴',
    curious: '🤨',
    friendly: '🤖',
    sad: '😢',
    confused: '😕',
    worried: '😰'
  };

  // サイズクラスマッピング
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl',
    xlarge: 'text-8xl'
  };

  // アニメーションクラスマッピング
  const animationClasses = {
    none: '',
    bounce: 'animate-bounce',
    wiggle: 'td-wiggle',
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    heartbeat: 'td-heartbeat',
    float: 'td-float'
  };

  // 感情に応じたメッセージ生成
  const getDefaultMessage = (emotion: TDEmotion): string => {
    const messages: Record<TDEmotion, string[]> = {
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
      ],
      sad: [
        'うまくいかなくて悲しいです...',
        '残念な結果になってしまいました',
        '次は上手くいくよう頑張りましょう'
      ],
      confused: [
        'ちょっと混乱しています...',
        'よく分からなくなってしまいました',
        '一緒に整理してみませんか？'
      ],
      worried: [
        '少し心配になってきました',
        '大丈夫でしょうか...',
        '注意深く進めましょう'
      ]
    };
    
    const messageList = messages[emotion];
    return messageList[Math.floor(Math.random() * messageList.length)];
  };

  const displayMessage = currentMessage || getDefaultMessage(emotion);

  return (
    <div className={`td-character-container ${className}`}>
      {/* 吹き出し */}
      {showSpeechBubble && displayMessage && (
        <div className="speech-bubble mb-4 relative">
          <div className="bg-white border-2 border-td-primary-200 rounded-lg p-3 shadow-lg max-w-xs">
            <p className="text-sm text-td-primary-800 font-medium">
              {displayMessage}
            </p>
          </div>
          {/* 吹き出しの三角形 */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-td-primary-200"></div>
            <div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white absolute top-[-6px] left-1/2 transform -translate-x-1/2"></div>
          </div>
        </div>
      )}

      {/* TDキャラクター本体 */}
      <div 
        className={`
          td-character 
          ${sizeClasses[size]} 
          ${animationClasses[animation]} 
          cursor-pointer 
          select-none 
          transition-transform 
          duration-200 
          hover:scale-110 
          focus:scale-110 
          focus:outline-none
          ${onClick ? 'hover:opacity-80' : ''}
        `}
        onClick={onClick}
        role={onClick ? 'button' : 'img'}
        tabIndex={onClick ? 0 : -1}
        aria-label={`TDキャラクター - 現在の感情: ${emotion}, メッセージ: ${displayMessage}`}
        onKeyDown={(e) => {
          if (onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {emotionEmojis[emotion]}
      </div>

      {/* 簡易状態表示 */}
      <div className="mt-2 text-center">
        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
          emotion === 'success' ? 'bg-td-accent-100 text-td-accent-800' :
          emotion === 'error' ? 'bg-red-100 text-red-800' :
          emotion === 'warning' ? 'bg-td-secondary-100 text-td-secondary-800' :
          'bg-td-primary-100 text-td-primary-800'
        }`}>
          {emotion === 'happy' && '😊 ハッピー'}
          {emotion === 'excited' && '🤩 興奮'}
          {emotion === 'thinking' && '🤔 思考中'}
          {emotion === 'working' && '😤 作業中'}
          {emotion === 'success' && '😎 成功'}
          {emotion === 'warning' && '😟 注意'}
          {emotion === 'error' && '😅 エラー'}
          {emotion === 'sleepy' && '😴 待機中'}
          {emotion === 'curious' && '🤨 興味深い'}
          {emotion === 'friendly' && '🤖 フレンドリー'}
        </div>
      </div>
    </div>
  );
};

export default TDCharacter; 