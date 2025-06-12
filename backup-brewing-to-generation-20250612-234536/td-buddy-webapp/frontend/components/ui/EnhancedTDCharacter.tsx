import React, { useState, useEffect } from 'react';
import { cn } from '../utils/cn';

export type BrewMood = 'happy' | 'excited' | 'working' | 'thinking' | 'success' | 'error' | 'sleeping';
export type TDAnimation = 'bounce' | 'pulse' | 'wiggle' | 'float' | 'spin' | 'none';

interface EnhancedTDCharacterProps {
  mood?: BrewMood;
  message?: string;
  animation?: TDAnimation;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  showSpeechBubble?: boolean;
  className?: string;
}

const EnhancedTDCharacter: React.FC<EnhancedTDCharacterProps> = ({
  mood = 'happy',
  message = '',
  animation = 'none',
  size = 'md',
  interactive = true,
  showSpeechBubble = true,
  className
}) => {
  const [currentMood, setCurrentMood] = useState<string>(mood);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    setCurrentMood(mood);
  }, [mood]);

  const handleClick = () => {
    if (!interactive) return;
    
    setIsClicked(true);
    setCurrentMood('excited');
    
    setTimeout(() => {
      setIsClicked(false);
      setCurrentMood(mood);
    }, 1000);
  };

  const moodEmojis: Record<BrewMood, string> = {
    happy: '😊',
    excited: '🤩',
    working: '🔧',
    thinking: '🤔',
    success: '🎉',
    error: '😅',
    sleeping: '😴'
  };

  const sizes = {
    sm: 'w-16 h-16 text-3xl',
    md: 'w-24 h-24 text-4xl',
    lg: 'w-32 h-32 text-5xl',
    xl: 'w-40 h-40 text-6xl'
  };

  const animations = {
    bounce: 'animate-bounce',
    pulse: 'animate-pulse',
    wiggle: 'animate-wiggle',
    float: 'animate-float',
    spin: 'animate-spin',
    none: ''
  };

  const moodMessages: Record<BrewMood, string[]> = {
    happy: [
      'データ醸造の準備ができました！',
      '今日も一緒に頑張りましょう♪',
      'TDがサポートします！'
    ],
    excited: [
      'やったー！素晴らしいですね！',
      'ワクワクします！',
      '最高のデータを作りましょう！'
    ],
    working: [
      'データ醸造中です...',
      'もう少しお待ちください',
      '品質の高いデータを作成中'
    ],
    thinking: [
      'うーん、考え中です...',
      '最適な方法を検討しています',
      'どうしましょうか？'
    ],
    success: [
      '完璧です！成功しました！',
      'お疲れさまでした！',
      '素晴らしい結果ですね！'
    ],
    error: [
      '申し訳ありません...',
      '一緒に解決しましょう',
      'もう一度試してみましょう'
    ],
    sleeping: [
      'zzz... お休み中',
      '準備中です...',
      'しばらくお待ちください'
    ]
  };

  const currentMessage = message || moodMessages[currentMood][0];

  return (
    <div className={cn('relative flex flex-col items-center', className)}>
      {/* Speech Bubble */}
      {showSpeechBubble && currentMessage && (
        <div className="relative mb-4 max-w-xs">
          <div className="bg-white/95 backdrop-blur-sm border-2 border-orange-200 rounded-2xl p-4 shadow-lg">
            <p className="text-sm text-orange-800 font-medium text-center">
              {currentMessage}
            </p>
          </div>
          {/* Speech bubble tail */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-td-primary-200" />
            <div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white/95 absolute top-[-6px] left-1/2 transform -translate-x-1/2" />
          </div>
        </div>
      )}

      {/* TD Character */}
      <div
        onClick={handleClick}
        className={cn(
          'relative flex items-center justify-center rounded-full',
          'bg-gradient-to-br from-orange-100 to-td-primary-200',
          'border-4 border-orange-300 shadow-xl',
          'transition-all duration-300 ease-in-out',
          sizes[size],
          animations[animation],
          interactive && 'cursor-pointer hover:scale-110 hover:shadow-2xl',
          isClicked && 'scale-125',
          'group'
        )}
      >
        {/* Character emoji */}
        <span className="transition-all duration-200">
          {moodEmojis[currentMood]}
        </span>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400/20 to-td-accent-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Sparkles for success mood */}
        {currentMood === 'success' && (
          <>
            <div className="absolute -top-2 -right-2 text-yellow-400 animate-ping">✨</div>
            <div className="absolute -bottom-2 -left-2 text-yellow-400 animate-ping delay-100">⭐</div>
            <div className="absolute -top-2 -left-2 text-yellow-400 animate-ping delay-200">💫</div>
          </>
        )}

        {/* Working indicator */}
        {currentMood === 'working' && (
          <div className="absolute -top-1 -right-1">
            <div className="w-3 h-3 bg-td-accent-500 rounded-full animate-pulse" />
          </div>
        )}
      </div>

      {/* Mood indicator */}
      <div className={cn(
        'mt-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200',
        'bg-orange-100 text-orange-800 border border-orange-200'
      )}>
        {currentMood === 'happy' && '😊 ハッピー'}
        {currentMood === 'excited' && '🤩 エキサイト'}
        {currentMood === 'working' && '🔧 作業中'}
        {currentMood === 'thinking' && '🤔 考え中'}
        {currentMood === 'success' && '🎉 成功'}
        {currentMood === 'error' && '😅 エラー'}
        {currentMood === 'sleeping' && '😴 休憩中'}
      </div>
    </div>
  );
};

export { EnhancedTDCharacter }; 