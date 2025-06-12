'use client';

import React, { useEffect, useState } from 'react';

// ブリューの感情状態
export type BrewEmotion =
  | 'happy' // 😊 嬉しい・満足
  | 'excited' // 🤩 興奮・醸造中
  | 'thinking' // 🤔 考え中・レシピ検討
  | 'working' // 😤 醸造中・集中
  | 'success' // 😎 醸造成功・達成
  | 'warning' // 😟 警告・品質注意
  | 'error' // 😅 醸造失敗・困った
  | 'sleepy' // 😴 待機中・休憩
  | 'curious' // 🤨 興味深い・分析中
  | 'friendly' // 😄 親しみやすい・歓迎
  | 'sad' // 😢 悲しい・失敗
  | 'confused' // 😕 混乱・レシピ困惑
  | 'worried'; // 😰 心配・品質心配

// アニメーションタイプ
export type BrewAnimation =
  | 'none' // アニメーションなし
  | 'bounce' // 上下バウンス
  | 'wiggle' // 左右ゆらゆら
  | 'pulse' // 拡大縮小
  | 'spin' // 回転（醸造タンクのように）
  | 'heartbeat' // 心臓の鼓動
  | 'float'; // ふわふわ浮遊

interface BrewCharacterProps {
  emotion?: BrewEmotion;
  animation?: BrewAnimation;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  message?: string;
  showSpeechBubble?: boolean;
  className?: string;
  onClick?: () => void;
}

const BrewCharacter: React.FC<BrewCharacterProps> = ({
  emotion = 'friendly',
  animation = 'heartbeat',
  size = 'medium',
  message = '',
  showSpeechBubble = false,
  className = '',
  onClick,
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
  const emotionEmojis: Record<BrewEmotion, string> = {
    happy: '😊',
    excited: '🤩',
    thinking: '🤔',
    working: '😤',
    success: '😎',
    warning: '😟',
    error: '😅',
    sleepy: '😴',
    curious: '🤨',
    friendly: '🍺', // ブリューらしい醸造のシンボル
    sad: '😢',
    confused: '😕',
    worried: '😰',
  };

  // サイズクラスマッピング
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl',
    xlarge: 'text-8xl',
  };

  // アニメーションクラスマッピング
  const animationClasses = {
    none: '',
    bounce: 'animate-bounce',
    wiggle: 'brew-wiggle',
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    heartbeat: 'brew-heartbeat',
    float: 'brew-float',
  };

  // 感情に応じたメッセージ生成（ブリュー助手らしい表現）
  const getDefaultMessage = (emotion: BrewEmotion): string => {
    const messages: Record<BrewEmotion, string[]> = {
      happy: [
        '嬉しいです！一緒に醸造しましょう♪',
        'いい感じに醸造できていますね！',
        '順調に品質チェックが進んでいます！',
      ],
      excited: [
        'やったー！素晴らしい醸造結果です！',
        'この品質は期待できそうですね！',
        'ワクワクする醸造プロセスです！',
      ],
      thinking: [
        'ちょっとレシピを考えさせてください...',
        '最適な醸造方法を検討中です',
        'うーん、どの配合にしましょうか？',
      ],
      working: [
        'データ醸造中です！少々お待ちください',
        '一生懸命品質チェックしています',
        '集中して醸造に取り組んでいます',
      ],
      success: [
        '醸造成功しました！お疲れさまです',
        'パーフェクトな品質です！',
        '醸造ミッション完了です！',
      ],
      warning: [
        'ちょっと品質に注意が必要かもしれません',
        '念のため醸造プロセスを確認してみましょう',
        '少し気になる品質データがあります',
      ],
      error: [
        '申し訳ありません！醸造でエラーが...',
        'うまく醸造できないようです',
        '一緒に解決策を醸造しましょう',
      ],
      sleepy: [
        'お疲れさまです。少し醸造を休憩しませんか？',
        'のんびり次の醸造を待機中です',
        'いつでも醸造のお声がけください',
      ],
      curious: [
        '興味深い品質データですね！詳しく教えてください',
        'もう少し醸造の詳細を知りたいです',
        'どんな醸造結果になるでしょうか？',
      ],
      friendly: [
        'こんにちは！ブリューです。醸造のお手伝いをします♪',
        '何か醸造でお手伝いできることはありますか？',
        '一緒に素晴らしい品質を醸造しましょう！',
      ],
      sad: [
        '醸造がうまくいかなくて悲しいです...',
        '残念な品質結果になってしまいました',
        '次は上手く醸造できるよう頑張りましょう',
      ],
      confused: [
        'ちょっと醸造プロセスで混乱しています...',
        'レシピがよく分からなくなってしまいました',
        '一緒に醸造手順を整理してみませんか？',
      ],
      worried: [
        '少し品質が心配になってきました',
        '醸造は大丈夫でしょうか...',
        '注意深く醸造を進めましょう',
      ],
    };

    const messageList = messages[emotion];
    return messageList[Math.floor(Math.random() * messageList.length)];
  };

  const displayMessage = currentMessage || getDefaultMessage(emotion);

  return (
    <div className={`brew-character-container ${className}`}>
      {/* 吹き出し */}
      {showSpeechBubble && displayMessage && (
        <div className="speech-bubble mb-4 relative">
          <div className="bg-white border-2 border-amber-200 rounded-lg p-3 shadow-lg max-w-xs">
            <p className="text-sm text-amber-800 font-medium">
              {displayMessage}
            </p>
          </div>
          {/* 吹き出しの三角形 */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-amber-200"></div>
            <div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white absolute top-[-6px] left-1/2 transform -translate-x-1/2"></div>
          </div>
        </div>
      )}

      {/* ブリューキャラクター本体 */}
      <div
        className={`
          brew-character 
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
        aria-label={`ブリューキャラクター - 現在の感情: ${emotion}, メッセージ: ${displayMessage}`}
        onKeyDown={e => {
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
        <div
          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            emotion === 'success'
              ? 'bg-amber-100 text-amber-800'
              : emotion === 'error'
              ? 'bg-red-100 text-red-800'
              : emotion === 'warning'
              ? 'bg-orange-100 text-orange-800'
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          {emotion === 'happy' && '😊 ハッピー'}
          {emotion === 'excited' && '🤩 醸造興奮'}
          {emotion === 'thinking' && '🤔 レシピ思考中'}
          {emotion === 'working' && '😤 醸造中'}
          {emotion === 'success' && '😎 醸造成功'}
          {emotion === 'warning' && '😟 品質注意'}
          {emotion === 'error' && '😅 醸造エラー'}
          {emotion === 'sleepy' && '😴 醸造待機中'}
          {emotion === 'curious' && '🤨 品質分析中'}
          {emotion === 'friendly' && '🍺 醸造フレンドリー'}
        </div>
      </div>
    </div>
  );
};

export default BrewCharacter;
