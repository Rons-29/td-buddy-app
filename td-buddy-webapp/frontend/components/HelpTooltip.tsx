'use client';

import { HelpCircle } from 'lucide-react';
import React, { useState } from 'react';

interface HelpTooltipProps {
  title: string;
  content: string | string[];
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  title,
  content,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    console.log('🔍 HelpTooltip: マウスエンター', { title, isVisible });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    console.log('🔍 HelpTooltip: マウスリーブ', { title, isVisible });
    setIsVisible(false);
  };

  const contentArray = Array.isArray(content) ? content : [content];

  console.log('🔍 HelpTooltip: レンダリング', { title, isVisible, position });

  return (
    <div className={`wb-help-tooltip-wrapper ${className}`}>
      <button
        className="wb-help-tooltip-trigger"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        onClick={() => {
          console.log('🔍 HelpTooltip: クリック', { title, isVisible });
          setIsVisible(!isVisible);
        }}
        type="button"
        aria-label={`ヘルプ: ${title}`}
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {isVisible && (
        <div
          className={`wb-help-tooltip-content wb-help-tooltip-${position}`}
          style={{
            position: 'absolute',
            zIndex: 9999,
            pointerEvents: 'auto',
          }}
        >
          <div className="wb-help-tooltip-arrow"></div>
          <div className="wb-help-tooltip-inner">
            <h5 className="wb-help-tooltip-title">{title}</h5>
            <div className="wb-help-tooltip-body">
              {contentArray.map((item, index) => (
                <p key={index} className="wb-help-tooltip-text">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ヘルプコンテンツ定数
export const HELP_CONTENT = {
  passwordLength: {
    title: 'パスワード長',
    content: [
      '8文字以上を推奨、12文字以上が理想的です',
      '長いパスワードほど破られにくくなりますが、記憶しにくくなります',
      '企業環境では14文字以上が要求されることがあります',
    ],
  },
  passwordCount: {
    title: '生成数',
    content: [
      '一度に生成するパスワードの数を指定します',
      '50個以下：即座に生成、51個以上：チャンク処理で順次生成',
      '大量生成時は進捗バーで状況を確認できます',
    ],
  },
  includeUppercase: {
    title: '大文字 (A-Z)',
    content: [
      '英語の大文字を含めます',
      'セキュリティ強化のため、他の文字種と組み合わせることを推奨',
      '一部システムでは大文字が必須の場合があります',
    ],
  },
  includeLowercase: {
    title: '小文字 (a-z)',
    content: [
      '英語の小文字を含めます',
      'パスワードの基本構成要素です',
      '読みやすさと入力しやすさのバランスを考慮',
    ],
  },
  includeNumbers: {
    title: '数字 (0-9)',
    content: [
      '数字を含めてパスワードの複雑性を向上',
      'よく使用される数字（誕生日など）の使用は避けましょう',
      '文字種の多様性でセキュリティが大幅に向上します',
    ],
  },
  includeSymbols: {
    title: '記号 (!@#$%...)',
    content: [
      '特殊記号を含めて最高レベルのセキュリティを実現',
      'システムによっては使用できない記号があるので注意',
      'カスタム記号設定で使用する記号を制限できます',
    ],
  },
  excludeAmbiguous: {
    title: '紛らわしい文字の除外',
    content: [
      '0とO、1とlとIなど、見分けがつきにくい文字を除外',
      '手書きや口頭での共有時のエラーを防止',
      'ユーザビリティとセキュリティのバランスを考慮した設定',
    ],
  },
  customCharacters: {
    title: 'カスタム文字',
    content: [
      '特定の文字のみを使用したい場合に指定',
      '他の文字種設定よりも優先されます',
      'システムの制約に合わせたパスワード生成が可能',
    ],
  },
  vulnerabilityType: {
    title: '脆弱性タイプ',
    content: [
      'テスト用の脆弱なパスワードを意図的に生成',
      'セキュリティ監査やペネトレーションテストで使用',
      '実際のシステムでは絶対に使用しないでください',
    ],
  },
  compositionPreset: {
    title: '構成プリセット',
    content: [
      '用途に応じて最適化されたパスワード設定',
      'セキュリティレベルと使いやすさのバランスを考慮',
      'カスタムプリセットで独自の設定も可能',
    ],
  },
};
