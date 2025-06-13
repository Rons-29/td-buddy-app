'use client';

import React, { useCallback, useState } from 'react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';

interface MergeResult {
  originalSets: string[][];
  mergedData: string[];
  mergeMethod:
    | 'union'
    | 'intersection'
    | 'sequential'
    | 'interleave'
    | 'custom';
  statistics: {
    totalOriginalItems: number;
    mergedCount: number;
    duplicatesRemoved: number;
    mergingRate: number;
  };
}

interface JoinResult {
  leftData: string[];
  rightData: string[];
  joinedData: Array<{ left: string; right: string; combined: string }>;
  joinMethod: 'inner' | 'left' | 'right' | 'outer';
  joinKey: string;
  statistics: {
    leftCount: number;
    rightCount: number;
    joinedCount: number;
    unmatchedLeft: number;
    unmatchedRight: number;
  };
}

export const DataMerger: React.FC = () => {
  const [inputData1, setInputData1] = useState('');
  const [inputData2, setInputData2] = useState('');
  const [inputData3, setInputData3] = useState('');

  const [mergeMethod, setMergeMethod] = useState<
    'union' | 'intersection' | 'sequential' | 'interleave' | 'custom'
  >('union');
  const [joinMethod, setJoinMethod] = useState<
    'inner' | 'left' | 'right' | 'outer'
  >('inner');
  const [joinSeparator, setJoinSeparator] = useState(' | ');
  const [customDelimiter, setCustomDelimiter] = useState('\n');
  const [removeDuplicates, setRemoveDuplicates] = useState(true);

  const [mergeResult, setMergeResult] = useState<MergeResult | null>(null);
  const [joinResult, setJoinResult] = useState<JoinResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'merge' | 'join'>('merge');

  const handleMerge = useCallback(() => {
    const dataSets = [inputData1, inputData2, inputData3]
      .filter(data => data.trim())
      .map(data => data.split('\n').filter(line => line.trim()));

    if (dataSets.length < 2) {
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      let mergedData: string[] = [];
      const originalSets = dataSets;

      switch (mergeMethod) {
        case 'union':
          // すべてのデータを結合、重複除去
          const allItems = dataSets.flat();
          mergedData = removeDuplicates ? [...new Set(allItems)] : allItems;
          break;

        case 'intersection':
          // 共通部分のみ
          mergedData = dataSets[0].filter(item =>
            dataSets.slice(1).every(set => set.includes(item))
          );
          break;

        case 'sequential':
          // 順次結合
          mergedData = dataSets.flat();
          if (removeDuplicates) {
            mergedData = [...new Set(mergedData)];
          }
          break;

        case 'interleave':
          // 交互に結合
          const maxLength = Math.max(...dataSets.map(set => set.length));
          for (let i = 0; i < maxLength; i++) {
            dataSets.forEach(set => {
              if (i < set.length) {
                mergedData.push(set[i]);
              }
            });
          }
          if (removeDuplicates) {
            mergedData = [...new Set(mergedData)];
          }
          break;

        case 'custom':
          // カスタム区切り文字で結合
          mergedData = dataSets.map(set => set.join(customDelimiter));
          break;
      }

      const totalOriginalItems = dataSets.flat().length;
      const duplicatesRemoved = totalOriginalItems - mergedData.length;
      const mergingRate = (mergedData.length / totalOriginalItems) * 100;

      setMergeResult({
        originalSets,
        mergedData,
        mergeMethod,
        statistics: {
          totalOriginalItems,
          mergedCount: mergedData.length,
          duplicatesRemoved,
          mergingRate,
        },
      });

      setIsProcessing(false);
    }, 500);
  }, [
    inputData1,
    inputData2,
    inputData3,
    mergeMethod,
    customDelimiter,
    removeDuplicates,
  ]);

  const handleJoin = useCallback(() => {
    const leftData = inputData1.split('\n').filter(line => line.trim());
    const rightData = inputData2.split('\n').filter(line => line.trim());

    if (leftData.length === 0 || rightData.length === 0) {
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const joinedData: Array<{
        left: string;
        right: string;
        combined: string;
      }> = [];
      const usedRight = new Set<number>();

      leftData.forEach(leftItem => {
        rightData.forEach((rightItem, rightIndex) => {
          if (
            joinMethod === 'inner' ||
            joinMethod === 'left' ||
            joinMethod === 'outer'
          ) {
            // 単純に順番でマッチング（実際のJOINキーの実装は複雑になるため簡略化）
            if (
              !usedRight.has(rightIndex) &&
              joinedData.length < Math.min(leftData.length, rightData.length)
            ) {
              joinedData.push({
                left: leftItem,
                right: rightItem,
                combined: `${leftItem}${joinSeparator}${rightItem}`,
              });
              usedRight.add(rightIndex);
              return;
            }
          }
        });
      });

      // outer join の場合は残りも追加
      if (joinMethod === 'outer' || joinMethod === 'left') {
        leftData.forEach((leftItem, index) => {
          if (index >= joinedData.length) {
            joinedData.push({
              left: leftItem,
              right: '',
              combined: `${leftItem}${joinSeparator}`,
            });
          }
        });
      }

      if (joinMethod === 'outer' || joinMethod === 'right') {
        rightData.forEach((rightItem, index) => {
          if (!usedRight.has(index)) {
            joinedData.push({
              left: '',
              right: rightItem,
              combined: `${joinSeparator}${rightItem}`,
            });
          }
        });
      }

      const unmatchedLeft =
        leftData.length - joinedData.filter(j => j.left).length;
      const unmatchedRight =
        rightData.length - joinedData.filter(j => j.right).length;

      setJoinResult({
        leftData,
        rightData,
        joinedData,
        joinMethod,
        joinKey: 'position', // simplified
        statistics: {
          leftCount: leftData.length,
          rightCount: rightData.length,
          joinedCount: joinedData.length,
          unmatchedLeft,
          unmatchedRight,
        },
      });

      setIsProcessing(false);
    }, 500);
  }, [inputData1, inputData2, joinMethod, joinSeparator]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  return (
    <div className="wb-workbench-bg min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🔧 データ接合工具
          </h1>
          <p className="text-gray-600">
            複数のデータを精密に結合・マージする職人の工具
          </p>
        </div>

        {/* Tool Tabs */}
        <div className="flex space-x-4 mb-6">
          <Button
            onClick={() => setActiveTab('merge')}
            className={
              activeTab === 'merge'
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-700'
            }
          >
            🔧 データマージ
          </Button>
          <Button
            onClick={() => setActiveTab('join')}
            className={
              activeTab === 'join'
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-700'
            }
          >
            🔗 データジョイン
          </Button>
        </div>

        {/* Input Data Sets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="border-green-200">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-green-700">
                📋 データセット 1
              </h3>
              <textarea
                value={inputData1}
                onChange={e => setInputData1(e.target.value)}
                className="w-full h-32 p-3 border-2 border-green-200 rounded-lg focus:border-green-400 focus:outline-none text-sm"
                placeholder="第1のデータセットを入力..."
              />
              <div className="mt-2 text-xs text-gray-600">
                {inputData1.split('\n').filter(l => l.trim()).length} 行
              </div>
            </div>
          </Card>

          <Card className="border-green-200">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-green-700">
                📋 データセット 2
              </h3>
              <textarea
                value={inputData2}
                onChange={e => setInputData2(e.target.value)}
                className="w-full h-32 p-3 border-2 border-green-200 rounded-lg focus:border-green-400 focus:outline-none text-sm"
                placeholder="第2のデータセットを入力..."
              />
              <div className="mt-2 text-xs text-gray-600">
                {inputData2.split('\n').filter(l => l.trim()).length} 行
              </div>
            </div>
          </Card>

          {activeTab === 'merge' && (
            <Card className="border-green-200">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-3 text-green-700">
                  📋 データセット 3 (オプション)
                </h3>
                <textarea
                  value={inputData3}
                  onChange={e => setInputData3(e.target.value)}
                  className="w-full h-32 p-3 border-2 border-green-200 rounded-lg focus:border-green-400 focus:outline-none text-sm"
                  placeholder="第3のデータセットを入力..."
                />
                <div className="mt-2 text-xs text-gray-600">
                  {inputData3.split('\n').filter(l => l.trim()).length} 行
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Merge Tool */}
        {activeTab === 'merge' && (
          <Card className="mb-6 border-green-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-green-700">
                🔧 データマージ設定
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    マージ方法
                  </label>
                  <select
                    value={mergeMethod}
                    onChange={e => setMergeMethod(e.target.value as any)}
                    className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-400"
                  >
                    <option value="union">和集合（すべて結合）</option>
                    <option value="intersection">積集合（共通部分のみ）</option>
                    <option value="sequential">順次結合</option>
                    <option value="interleave">交互結合</option>
                    <option value="custom">カスタム結合</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="removeDuplicates"
                      checked={removeDuplicates}
                      onChange={e => setRemoveDuplicates(e.target.checked)}
                      className="rounded border-green-300 text-green-600 focus:ring-green-500"
                    />
                    <label
                      htmlFor="removeDuplicates"
                      className="text-sm text-green-700"
                    >
                      重複を除去
                    </label>
                  </div>

                  {mergeMethod === 'custom' && (
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-2">
                        カスタム区切り文字
                      </label>
                      <Input
                        value={customDelimiter}
                        onChange={e => setCustomDelimiter(e.target.value)}
                        placeholder="例: , | ; | \n"
                        className="border-green-200 focus:border-green-400"
                      />
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={handleMerge}
                disabled={
                  !inputData1.trim() || !inputData2.trim() || isProcessing
                }
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
              >
                {isProcessing ? '🔧 マージ中...' : '🔧 データをマージ'}
              </Button>
            </div>
          </Card>
        )}

        {/* Join Tool */}
        {activeTab === 'join' && (
          <Card className="mb-6 border-green-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-green-700">
                🔗 データジョイン設定
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    ジョイン方法
                  </label>
                  <select
                    value={joinMethod}
                    onChange={e => setJoinMethod(e.target.value as any)}
                    className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-400"
                  >
                    <option value="inner">
                      INNER JOIN（一致するもののみ）
                    </option>
                    <option value="left">LEFT JOIN（左側をすべて含む）</option>
                    <option value="right">
                      RIGHT JOIN（右側をすべて含む）
                    </option>
                    <option value="outer">OUTER JOIN（すべて含む）</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    結合区切り文字
                  </label>
                  <Input
                    value={joinSeparator}
                    onChange={e => setJoinSeparator(e.target.value)}
                    placeholder="例: | | , | -"
                    className="border-green-200 focus:border-green-400"
                  />
                </div>
              </div>

              <Button
                onClick={handleJoin}
                disabled={
                  !inputData1.trim() || !inputData2.trim() || isProcessing
                }
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
              >
                {isProcessing ? '🔗 ジョイン中...' : '🔗 データをジョイン'}
              </Button>
            </div>
          </Card>
        )}

        {/* Merge Results */}
        {mergeResult && activeTab === 'merge' && (
          <Card className="mb-6 border-green-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-green-700">
                📊 マージ結果
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {mergeResult.statistics.totalOriginalItems}
                  </div>
                  <div className="text-sm text-gray-600">元データ数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {mergeResult.statistics.mergedCount}
                  </div>
                  <div className="text-sm text-gray-600">マージ後</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {mergeResult.statistics.duplicatesRemoved}
                  </div>
                  <div className="text-sm text-gray-600">重複除去数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(mergeResult.statistics.mergingRate)}%
                  </div>
                  <div className="text-sm text-gray-600">効率性</div>
                </div>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                {mergeResult.mergedData.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-green-50 rounded"
                  >
                    <span className="text-sm font-mono truncate flex-1">
                      {item}
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-700 border-green-300"
                    >
                      {index + 1}
                    </Badge>
                  </div>
                ))}
              </div>

              <Button
                onClick={() =>
                  copyToClipboard(mergeResult.mergedData.join('\n'))
                }
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                📋 マージ結果をコピー
              </Button>
            </div>
          </Card>
        )}

        {/* Join Results */}
        {joinResult && activeTab === 'join' && (
          <Card className="mb-6 border-green-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-green-700">
                📊 ジョイン結果
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {joinResult.statistics.leftCount}
                  </div>
                  <div className="text-sm text-gray-600">左データ数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {joinResult.statistics.rightCount}
                  </div>
                  <div className="text-sm text-gray-600">右データ数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {joinResult.statistics.joinedCount}
                  </div>
                  <div className="text-sm text-gray-600">ジョイン後</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {joinResult.statistics.unmatchedLeft}
                  </div>
                  <div className="text-sm text-gray-600">未マッチ(左)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {joinResult.statistics.unmatchedRight}
                  </div>
                  <div className="text-sm text-gray-600">未マッチ(右)</div>
                </div>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                {joinResult.joinedData.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-2 p-2 bg-green-50 rounded text-sm"
                  >
                    <div className="font-mono truncate text-blue-600">
                      {item.left || '(空)'}
                    </div>
                    <div className="font-mono truncate text-purple-600">
                      {item.right || '(空)'}
                    </div>
                    <div className="font-mono truncate font-bold text-green-600">
                      {item.combined}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() =>
                  copyToClipboard(
                    joinResult.joinedData.map(j => j.combined).join('\n')
                  )
                }
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                📋 ジョイン結果をコピー
              </Button>
            </div>
          </Card>
        )}

        {/* Tool Footer */}
        <div className="text-center text-gray-600 mt-8">
          <p className="mb-2">
            🍺 <strong>Brew</strong>からのメッセージ:
          </p>
          <p className="text-sm italic">
            「データ接合工具だ！複数のデータを適切に結合して新しい価値を生み出そう。
            接合は職人技の見せ所だからな！🔧✨」
          </p>
        </div>
      </div>
    </div>
  );
};
