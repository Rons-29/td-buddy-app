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
<<<<<<< HEAD
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
    '🔀 A/Bテストのデータ生成にも便利ですよ',
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
=======
    "🔢 整数は計算の基本！カウンターやID生成に最適ですよ",
    "✨ 境界値テストには最小値・最大値周辺の数字がお勧めです",
    "🎯 負の数も含めると、より実用的なテストができますね"
  ],
  float: [
    "🌊 小数点数は精密な計算に欠かせません！",
    "📊 測定値やスコアの表現に最適な数値ですね",
    "🎵 桁数を調整して、用途に合わせてカスタマイズしましょう"
  ],
  percentage: [
    "📈 パーセンテージは進捗管理に大活躍します！",
    "🎪 0-100%の範囲で、直感的な表現ができますよ",
    "⚖️ 成功率や完了率の可視化にぴったりです"
  ],
  currency: [
    "💰 通貨表示で、より現実的なテストデータが作れます！",
    "🌍 各国の通貨形式に対応していますよ",
    "📱 ECサイトのテストには通貨データが必須ですね"
  ],
  scientific: [
    "🔬 科学記法は大きな数や小さな数を表現するのに便利！",
    "🚀 物理計算や工学計算でよく使われます",
    "⚗️ 実験データの表現にも最適ですよ"
  ],
  boolean: [
    "⚡ 真偽値はプログラムの制御に欠かせません！",
    "🎲 確率を調整して、リアルなシミュレーションができます",
    "🔀 A/Bテストのデータ生成にも便利ですよ"
  ],
  special: [
    "🌟 特殊値でエッジケースをテストしましょう！",
    "🛡️ NaNやInfinityの処理確認は重要です",
    "🔍 堅牢なアプリケーション作りに役立ちますよ"
  ]
};

const tdReactions = [
  "数値生成、お任せください！💪",
  "完璧なデータができあがりました！✨",
  "統計的に美しい分布ですね～📊",
  "このデータでテストが捗りそうです♪",
  "TDも満足の仕上がりです！🎉",
  "品質の高い数値データをお届け！🚀"
];

export function NumberBooleanTDCard({ 
  generatedData, 
  isGenerating, 
  selectedType 
>>>>>>> feature/TD-616-number-boolean-generation
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

  // 生成完了時のリアクション
  useEffect(() => {
    if (generatedData.length > 0) {
<<<<<<< HEAD
      const randomReaction =
        tdReactions[Math.floor(Math.random() * tdReactions.length)];
=======
      const randomReaction = tdReactions[Math.floor(Math.random() * tdReactions.length)];
>>>>>>> feature/TD-616-number-boolean-generation
      setCurrentReaction(randomReaction);
    }
  }, [generatedData.length]);

  // 統計情報の計算
  const calculateStats = () => {
    if (generatedData.length === 0) return null;

<<<<<<< HEAD
    // 数値のみをフィルタリング
    const numericValues = generatedData
      .map(item => item.rawValue)
      .filter((val): val is number => typeof val === 'number');
=======
    const numericValues = generatedData
      .map(item => item.rawValue)
      .filter(val => typeof val === 'number' && !isNaN(val));
>>>>>>> feature/TD-616-number-boolean-generation

    if (numericValues.length === 0) {
      return {
        total: generatedData.length,
        type: 'non-numeric',
<<<<<<< HEAD
        summary: `${generatedData.length}件の${selectedType}データを生成しました`,
=======
        summary: `${generatedData.length}件の${selectedType}データを生成しました`
>>>>>>> feature/TD-616-number-boolean-generation
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
<<<<<<< HEAD
      type: 'numeric',
=======
      type: 'numeric'
>>>>>>> feature/TD-616-number-boolean-generation
    };
  };

  const stats = calculateStats();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 space-y-4">
      {/* TDキャラクター */}
      <div className="flex items-center gap-3">
        <div className="text-4xl">🤖</div>
        <div>
          <h3 className="font-bold text-blue-900">TDくん</h3>
          <p className="text-sm text-blue-700">
            {isGenerating ? '数値生成中...' : '数値生成の専門家'}
          </p>
        </div>
      </div>

      {/* 生成中のアニメーション */}
      {isGenerating && (
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <div>
              <p className="font-medium text-blue-900">精密な数値を計算中...</p>
<<<<<<< HEAD
              <p className="text-sm text-blue-700">
                統計的に美しい分布を生成しています✨
              </p>
=======
              <p className="text-sm text-blue-700">統計的に美しい分布を生成しています✨</p>
>>>>>>> feature/TD-616-number-boolean-generation
            </div>
          </div>
        </div>
      )}

      {/* TDのヒント */}
      <div className="bg-white border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          💡 TDからのヒント
        </h4>
        <p className="text-sm text-blue-800">{currentTip}</p>
      </div>

      {/* 生成完了時のリアクション */}
      {generatedData.length > 0 && currentReaction && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎉</span>
            <p className="font-medium text-green-900">{currentReaction}</p>
          </div>
        </div>
      )}

      {/* 統計情報 */}
      {stats && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-blue-900 flex items-center gap-2">
              📊 生成統計
            </h4>
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {showStats ? '折りたたむ' : '詳細表示'}
            </button>
          </div>

          <div className="bg-white border border-blue-200 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">生成件数:</span>
<<<<<<< HEAD
                <span className="font-medium text-blue-900 ml-2">
                  {stats.total}件
                </span>
              </div>
              <div>
                <span className="text-gray-600">データ型:</span>
                <span className="font-medium text-blue-900 ml-2">
                  {selectedType}
                </span>
=======
                <span className="font-medium text-blue-900 ml-2">{stats.total}件</span>
              </div>
              <div>
                <span className="text-gray-600">データ型:</span>
                <span className="font-medium text-blue-900 ml-2">{selectedType}</span>
>>>>>>> feature/TD-616-number-boolean-generation
              </div>
            </div>

            {showStats && stats.type === 'numeric' && (
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">平均値:</span>
<<<<<<< HEAD
                    <span className="font-mono text-blue-900 ml-2">
                      {stats.average}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">合計値:</span>
                    <span className="font-mono text-blue-900 ml-2">
                      {stats.sum}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">最小値:</span>
                    <span className="font-mono text-blue-900 ml-2">
                      {stats.min}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">最大値:</span>
                    <span className="font-mono text-blue-900 ml-2">
                      {stats.max}
                    </span>
=======
                    <span className="font-mono text-blue-900 ml-2">{stats.average}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">合計値:</span>
                    <span className="font-mono text-blue-900 ml-2">{stats.sum}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">最小値:</span>
                    <span className="font-mono text-blue-900 ml-2">{stats.min}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">最大値:</span>
                    <span className="font-mono text-blue-900 ml-2">{stats.max}</span>
>>>>>>> feature/TD-616-number-boolean-generation
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TDからの応援メッセージ */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💪</span>
          <div>
            <p className="font-medium text-indigo-900 mb-1">TDからの応援</p>
            <p className="text-sm text-indigo-800">
<<<<<<< HEAD
              {generatedData.length > 0
                ? '素晴らしいデータが生成できました！このデータでテストを頑張ってください♪'
                : '数値生成の準備は万端です！どんな数値でもTDにお任せください！'}
=======
              {generatedData.length > 0 
                ? "素晴らしいデータが生成できました！このデータでテストを頑張ってください♪"
                : "数値生成の準備は万端です！どんな数値でもTDにお任せください！"
              }
>>>>>>> feature/TD-616-number-boolean-generation
            </p>
          </div>
        </div>
      </div>

      {/* 使用例のヒント */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
          🎯 活用のヒント
        </h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          {selectedType === 'integer' && (
            <>
              <li>• ユーザーIDやカウンターのテストに</li>
              <li>• データベースの主キー生成に</li>
              <li>• 年齢や数量のバリデーションテストに</li>
            </>
          )}
          {selectedType === 'float' && (
            <>
              <li>• スコアや評価値のテストに</li>
              <li>• 測定データのシミュレーションに</li>
              <li>• 計算精度の検証に</li>
            </>
          )}
          {selectedType === 'percentage' && (
            <>
              <li>• プログレスバーのテストに</li>
              <li>• 完了率・成功率の表示に</li>
              <li>• 統計レポートの生成に</li>
            </>
          )}
          {selectedType === 'currency' && (
            <>
              <li>• ECサイトの価格テストに</li>
              <li>• 売上データの分析に</li>
              <li>• 多国籍対応の検証に</li>
            </>
          )}
          {selectedType === 'boolean' && (
            <>
              <li>• フラグ管理のテストに</li>
              <li>• 条件分岐の確認に</li>
              <li>• A/Bテストのシミュレーションに</li>
            </>
          )}
<<<<<<< HEAD
          {!['integer', 'float', 'percentage', 'currency', 'boolean'].includes(
            selectedType
          ) && (
=======
          {!['integer', 'float', 'percentage', 'currency', 'boolean'].includes(selectedType) && (
>>>>>>> feature/TD-616-number-boolean-generation
            <>
              <li>• 高度な数値処理のテストに</li>
              <li>• エッジケースの検証に</li>
              <li>• 特殊な計算の確認に</li>
            </>
          )}
        </ul>
      </div>

      {/* TDのパフォーマンス指標 */}
      {generatedData.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
            ⚡ TDのパフォーマンス
          </h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl text-purple-600">⭐</div>
              <div className="text-sm font-medium text-purple-900">品質</div>
              <div className="text-xs text-purple-700">最高レベル</div>
            </div>
            <div>
              <div className="text-2xl text-purple-600">⚡</div>
              <div className="text-sm font-medium text-purple-900">速度</div>
              <div className="text-xs text-purple-700">高速生成</div>
            </div>
            <div>
              <div className="text-2xl text-purple-600">🎯</div>
              <div className="text-sm font-medium text-purple-900">精度</div>
              <div className="text-xs text-purple-700">完璧</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
<<<<<<< HEAD
}
=======
} 
>>>>>>> feature/TD-616-number-boolean-generation
