'use client';

import { useEffect, useState } from 'react';
import { GeneratedNumberBoolean } from '../types/numberboolean';

interface NumberBooleanTDCardProps {
  generatedData: GeneratedNumberBoolean[];
  isGenerating: boolean;
  selectedType: string;
}

const tdTips = {
  integer: [
    '🔢 整数は計算の基本！カウンターやID生成に最適ですよ',
    '✨ 境界値テストには最小値・最大値周辺の数字がお勧めです',
    '🎯 負の数も含めると、より実用的なテストができますね',
  ],
  float: [
    '🌊 小数点数は精密な計算に欠かせません！',
    '📊 測定値やスコアの表現に最適な数値ですね',
    '🎵 桁数を調整して、用途に合わせてカスタマイズしましょう',
  ],
  percentage: [
    '📈 パーセンテージは進捗管理に大活躍します！',
    '🎪 0-100%の範囲で、直感的な表現ができますよ',
    '⚖️ 成功率や完了率の可視化にぴったりです',
  ],
  currency: [
    '💰 通貨表示で、より現実的なテストデータが作れます！',
    '🌍 各国の通貨形式に対応していますよ',
    '📱 ECサイトのテストには通貨データが必須ですね',
  ],
  scientific: [
    '🔬 科学記法は大きな数や小さな数を表現するのに便利！',
    '🚀 物理計算や工学計算でよく使われます',
    '⚗️ 実験データの表現にも最適ですよ',
  ],
  boolean: [
    '⚡ 真偽値はプログラムの制御に欠かせません！',
    '🎲 確率を調整して、リアルなシミュレーションができます',
    '🔀 A/Bテストのデータ醸造にも便利ですよ',
  ],
  special: [
    '🌟 特殊値でエッジケースをテストしましょう！',
    '🛡️ NaNやInfinityの処理確認は重要です',
    '🔍 堅牢なアプリケーション作りに役立ちますよ',
  ],
};

const tdReactions = [
  '数値生成、お任せください！💪',
  '完璧なデータができあがりました！✨',
  '統計的に美しい分布ですね～📊',
  'このデータでテストが捗りそうです♪',
  'TDも満足の仕上がりです！🎉',
  '品質の高い数値データをお届け！🚀',
];

export function NumberBooleanTDCard({
  generatedData,
  isGenerating,
  selectedType,
}: NumberBooleanTDCardProps) {
  const [currentTip, setCurrentTip] = useState<string>('');
  const [currentReaction, setCurrentReaction] = useState<string>('');
  const [showStats, setShowStats] = useState<boolean>(false);

  // TDのヒント表示ロジック
  useEffect(() => {
    const tips = tdTips[selectedType as keyof typeof tdTips] || tdTips.integer;
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setCurrentTip(randomTip);
  }, [selectedType]);

  // 醸造完了時のリアクション
  useEffect(() => {
    if (generatedData.length > 0) {
      const randomReaction =
        tdReactions[Math.floor(Math.random() * tdReactions.length)];
      setCurrentReaction(randomReaction);
    }
  }, [generatedData.length]);

  // 統計情報の計算
  const calculateStats = () => {
    if (generatedData.length === 0) return null;

    // 数値のみをフィルタリング
    const numericValues = generatedData
      .map(item => item.rawValue)
      .filter((val): val is number => typeof val === 'number' && !isNaN(val));

    if (numericValues.length === 0) {
      return {
        total: generatedData.length,
        type: 'non-numeric',
        summary: `${generatedData.length}件の${selectedType}データを醸造しました`,
      };
    }

    const sum = numericValues.reduce((a, b) => a + b, 0);
    const average = sum / numericValues.length;
    const min = Math.min(...numericValues);
    const max = Math.max(...numericValues);

    return {
      total: generatedData.length,
      average: average.toFixed(3),
      min,
      max,
      sum: sum.toFixed(2),
      type: 'numeric',
    };
  };

  const stats = calculateStats();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 space-y-4">
      {/* Brewキャラクター */}
      <div className="flex items-center gap-3">
        <div className="text-4xl">🍺</div>
        <div>
          <h3 className="font-bold text-blue-900">ブリュー</h3>
          <p className="text-sm text-blue-700">
            {isGenerating ? '数値醸造中...' : '数値生成の専門家'}
          </p>
        </div>
      </div>

      {/* ローディング状態 */}
      {isGenerating && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-blue-700">
            <div className="animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
            <span className="text-sm">数値を醸造しています...</span>
          </div>
          <div className="bg-blue-100 p-3 rounded text-blue-800 text-sm">
            💡 {currentTip}
          </div>
        </div>
      )}

      {/* 醸造完了時の表示 */}
      {!isGenerating && generatedData.length > 0 && (
        <div className="space-y-4">
          {/* TDのリアクション */}
          <div className="bg-green-100 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-800">
              <span className="text-lg">🎉</span>
              <span className="text-sm font-medium">{currentReaction}</span>
            </div>
          </div>

          {/* 統計情報切り替えボタン */}
          <button
            onClick={() => setShowStats(!showStats)}
            className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            📊 統計情報 {showStats ? '隠す' : '表示'}
          </button>

          {/* 統計情報 */}
          {showStats && stats && (
            <div className="bg-white border border-blue-200 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                📈 生成データ統計
              </h4>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-blue-600 text-xs">総件数</div>
                  <div className="font-semibold text-blue-900">
                    {stats.total}件
                  </div>
                </div>

                {stats.type === 'numeric' && (
                  <>
                    <div className="bg-blue-50 p-2 rounded">
                      <div className="text-blue-600 text-xs">平均値</div>
                      <div className="font-semibold text-blue-900">
                        {stats.average}
                      </div>
                    </div>
                    <div className="bg-blue-50 p-2 rounded">
                      <div className="text-blue-600 text-xs">最小値</div>
                      <div className="font-semibold text-blue-900">
                        {stats.min}
                      </div>
                    </div>
                    <div className="bg-blue-50 p-2 rounded">
                      <div className="text-blue-600 text-xs">最大値</div>
                      <div className="font-semibold text-blue-900">
                        {stats.max}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {stats.type === 'non-numeric' && (
                <div className="text-blue-700 text-sm">{stats.summary}</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* アイドル状態 */}
      {!isGenerating && generatedData.length === 0 && (
        <div className="space-y-3">
          <div className="text-blue-700 text-sm">
            どのような数値データを醸造しましょうか？
          </div>
          <div className="bg-blue-100 p-3 rounded text-blue-800 text-sm">
            💡 {currentTip}
          </div>
        </div>
      )}

      {/* ブリューからの一言アドバイス */}
      <div className="border-t border-blue-200 pt-4">
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-lg">💬</span>
            <div className="text-blue-800 text-sm">
              <div className="font-medium mb-1">ブリューからのアドバイス</div>
              <div>
                数値データのテストでは、境界値（最小・最大値）と特殊値（0、負数、小数点など）を含めることが重要です。統計的な分布も考慮して、より実用的なテストデータを作成しましょう！
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* クイックガイド */}
      <div className="border-t border-blue-200 pt-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          🎯 クイックガイド
        </h4>
        <div className="space-y-2 text-sm text-blue-700">
          <div className="flex items-start gap-2">
            <span>•</span>
            <span>整数：カウンター、ID、年齢など</span>
          </div>
          <div className="flex items-start gap-2">
            <span>•</span>
            <span>小数：価格、重量、スコアなど</span>
          </div>
          <div className="flex items-start gap-2">
            <span>•</span>
            <span>パーセント：進捗率、成功率など</span>
          </div>
          <div className="flex items-start gap-2">
            <span>•</span>
            <span>真偽値：フラグ、状態管理など</span>
          </div>
        </div>
      </div>
    </div>
  );
}
