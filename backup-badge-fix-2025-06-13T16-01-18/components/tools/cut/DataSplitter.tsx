'use client';

import React, { useCallback, useState } from 'react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';

interface SplitResult {
  originalData: string;
  splitData: string[];
  totalParts: number;
  method: 'delimiter' | 'length' | 'lines' | 'custom';
  statistics: {
    avgLength: number;
    maxLength: number;
    minLength: number;
    emptyParts: number;
  };
}

interface FilterResult {
  originalData: string[];
  filteredData: string[];
  removedData: string[];
  filterType: 'contains' | 'startsWith' | 'endsWith' | 'regex' | 'length';
  filterValue: string;
  statistics: {
    originalCount: number;
    filteredCount: number;
    removedCount: number;
    filterRate: number;
  };
}

export const DataSplitter: React.FC = () => {
  const [inputData, setInputData] = useState('');
  const [splitMethod, setSplitMethod] = useState<
    'delimiter' | 'length' | 'lines' | 'custom'
  >('delimiter');
  const [delimiter, setDelimiter] = useState(',');
  const [splitLength, setSplitLength] = useState(10);
  const [customPattern, setCustomPattern] = useState('');

  const [filterType, setFilterType] = useState<
    'contains' | 'startsWith' | 'endsWith' | 'regex' | 'length'
  >('contains');
  const [filterValue, setFilterValue] = useState('');
  const [minLength, setMinLength] = useState(1);
  const [maxLength, setMaxLength] = useState(100);

  const [splitResult, setSplitResult] = useState<SplitResult | null>(null);
  const [filterResult, setFilterResult] = useState<FilterResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'split' | 'filter'>('split');

  const handleSplit = useCallback(() => {
    if (!inputData.trim()) {
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      let splitData: string[] = [];

      switch (splitMethod) {
        case 'delimiter':
          splitData = inputData.split(delimiter);
          break;
        case 'length':
          const chunks = [];
          for (let i = 0; i < inputData.length; i += splitLength) {
            chunks.push(inputData.slice(i, i + splitLength));
          }
          splitData = chunks;
          break;
        case 'lines':
          splitData = inputData.split('\n');
          break;
        case 'custom':
          try {
            const regex = new RegExp(customPattern);
            splitData = inputData.split(regex);
          } catch (e) {
            splitData = [inputData]; // fallback if regex is invalid
          }
          break;
      }

      // Calculate statistics
      const lengths = splitData.map(part => part.length);
      const avgLength =
        lengths.reduce((sum, len) => sum + len, 0) / lengths.length;
      const maxLength = Math.max(...lengths);
      const minLength = Math.min(...lengths);
      const emptyParts = splitData.filter(part => part.trim() === '').length;

      setSplitResult({
        originalData: inputData,
        splitData,
        totalParts: splitData.length,
        method: splitMethod,
        statistics: {
          avgLength,
          maxLength,
          minLength,
          emptyParts,
        },
      });

      setIsProcessing(false);
    }, 500);
  }, [inputData, splitMethod, delimiter, splitLength, customPattern]);

  const handleFilter = useCallback(() => {
    if (!inputData.trim()) {
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const lines = inputData.split('\n').filter(line => line.trim() !== '');
      let filteredData: string[] = [];

      switch (filterType) {
        case 'contains':
          filteredData = lines.filter(line =>
            line.toLowerCase().includes(filterValue.toLowerCase())
          );
          break;
        case 'startsWith':
          filteredData = lines.filter(line =>
            line.toLowerCase().startsWith(filterValue.toLowerCase())
          );
          break;
        case 'endsWith':
          filteredData = lines.filter(line =>
            line.toLowerCase().endsWith(filterValue.toLowerCase())
          );
          break;
        case 'regex':
          try {
            const regex = new RegExp(filterValue, 'i');
            filteredData = lines.filter(line => regex.test(line));
          } catch (e) {
            filteredData = lines; // fallback if regex is invalid
          }
          break;
        case 'length':
          filteredData = lines.filter(
            line => line.length >= minLength && line.length <= maxLength
          );
          break;
      }

      const removedData = lines.filter(line => !filteredData.includes(line));
      const filterRate = (filteredData.length / lines.length) * 100;

      setFilterResult({
        originalData: lines,
        filteredData,
        removedData,
        filterType,
        filterValue:
          filterType === 'length' ? `${minLength}-${maxLength}` : filterValue,
        statistics: {
          originalCount: lines.length,
          filteredCount: filteredData.length,
          removedCount: removedData.length,
          filterRate,
        },
      });

      setIsProcessing(false);
    }, 500);
  }, [inputData, filterType, filterValue, minLength, maxLength]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  return (
    <div className="wb-workbench-bg min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ✂️ データ切断工具
          </h1>
          <p className="text-gray-600">
            データを精密に分割・フィルタリングする職人の工具
          </p>
        </div>

        {/* Input Data */}
        <Card workbench className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-700">
              📝 データ入力工具
            </h2>
            <textarea
              value={inputData}
              onChange={e => setInputData(e.target.value)}
              className="w-full h-40 p-4 border-2 border-red-200 rounded-lg focus:border-red-400 focus:outline-none"
              placeholder="切断・フィルタリングするデータを入力してください..."
            />
            <div className="mt-2 text-sm text-gray-600">
              文字数: {inputData.length} | 行数: {inputData.split('\n').length}
            </div>
          </div>
        </Card>

        {/* Tool Tabs */}
        <div className="flex space-x-4 mb-6">
          <Button
            workbench
            onClick={() => setActiveTab('split')}
            className={
              activeTab === 'split'
                ? 'bg-red-600 text-white'
                : 'bg-red-100 text-red-700'
            }
          >
            ✂️ データ分割
          </Button>
          <Button
            workbench
            onClick={() => setActiveTab('filter')}
            className={
              activeTab === 'filter'
                ? 'bg-red-600 text-white'
                : 'bg-red-100 text-red-700'
            }
          >
            🔍 データフィルター
          </Button>
        </div>

        {/* Split Tool */}
        {activeTab === 'split' && (
          <Card workbench className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-red-700">
                ✂️ データ分割設定
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    分割方法
                  </label>
                  <select
                    value={splitMethod}
                    onChange={e => setSplitMethod(e.target.value as any)}
                    className="w-full p-3 border-2 border-red-200 rounded-lg focus:border-red-400"
                  >
                    <option value="delimiter">区切り文字で分割</option>
                    <option value="length">文字数で分割</option>
                    <option value="lines">行で分割</option>
                    <option value="custom">カスタムパターン</option>
                  </select>
                </div>

                <div>
                  {splitMethod === 'delimiter' && (
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-2">
                        区切り文字
                      </label>
                      <Input
                        workbench
                        value={delimiter}
                        onChange={e => setDelimiter(e.target.value)}
                        placeholder="例: , | ; | \t"
                      />
                    </div>
                  )}

                  {splitMethod === 'length' && (
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-2">
                        分割文字数
                      </label>
                      <Input
                        workbench
                        type="number"
                        value={splitLength}
                        onChange={e =>
                          setSplitLength(parseInt(e.target.value) || 10)
                        }
                        min={1}
                      />
                    </div>
                  )}

                  {splitMethod === 'custom' && (
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-2">
                        正規表現パターン
                      </label>
                      <Input
                        workbench
                        value={customPattern}
                        onChange={e => setCustomPattern(e.target.value)}
                        placeholder="例: \d+ | [a-zA-Z]+"
                      />
                    </div>
                  )}
                </div>
              </div>

              <Button
                workbench
                onClick={handleSplit}
                disabled={!inputData.trim() || isProcessing}
                className="w-full mt-4"
              >
                {isProcessing ? '✂️ 分割中...' : '✂️ データを分割'}
              </Button>
            </div>
          </Card>
        )}

        {/* Filter Tool */}
        {activeTab === 'filter' && (
          <Card workbench className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-red-700">
                🔍 データフィルター設定
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    フィルター方法
                  </label>
                  <select
                    value={filterType}
                    onChange={e => setFilterType(e.target.value as any)}
                    className="w-full p-3 border-2 border-red-200 rounded-lg focus:border-red-400"
                  >
                    <option value="contains">含む</option>
                    <option value="startsWith">開始文字</option>
                    <option value="endsWith">終了文字</option>
                    <option value="regex">正規表現</option>
                    <option value="length">文字数範囲</option>
                  </select>
                </div>

                <div>
                  {filterType !== 'length' ? (
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-2">
                        フィルター値
                      </label>
                      <Input
                        workbench
                        value={filterValue}
                        onChange={e => setFilterValue(e.target.value)}
                        placeholder="フィルター条件を入力"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-red-700 mb-2">
                        文字数範囲
                      </label>
                      <div className="flex space-x-2">
                        <Input
                          workbench
                          type="number"
                          value={minLength}
                          onChange={e =>
                            setMinLength(parseInt(e.target.value) || 1)
                          }
                          placeholder="最小"
                        />
                        <Input
                          workbench
                          type="number"
                          value={maxLength}
                          onChange={e =>
                            setMaxLength(parseInt(e.target.value) || 100)
                          }
                          placeholder="最大"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button
                workbench
                onClick={handleFilter}
                disabled={!inputData.trim() || isProcessing}
                className="w-full mt-4"
              >
                {isProcessing
                  ? '🔍 フィルタリング中...'
                  : '🔍 データをフィルター'}
              </Button>
            </div>
          </Card>
        )}

        {/* Split Results */}
        {splitResult && activeTab === 'split' && (
          <Card workbench className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-red-700">
                📊 分割結果
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {splitResult.totalParts}
                  </div>
                  <div className="text-sm text-gray-600">分割数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {Math.round(splitResult.statistics.avgLength)}
                  </div>
                  <div className="text-sm text-gray-600">平均文字数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {splitResult.statistics.maxLength}
                  </div>
                  <div className="text-sm text-gray-600">最大文字数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {splitResult.statistics.emptyParts}
                  </div>
                  <div className="text-sm text-gray-600">空の部分</div>
                </div>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {splitResult.splitData.map((part, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-red-50 rounded"
                  >
                    <span className="text-sm font-mono truncate flex-1">
                      {part || '(空)'}
                    </span>
                    <div className="flex items-center space-x-2 ml-2">
                      <Badge variant="cut">{part.length}文字</Badge>
                      <Button
                        workbench
                        onClick={() => copyToClipboard(part)}
                        className="text-xs py-1 px-2"
                      >
                        コピー
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                workbench
                onClick={() =>
                  copyToClipboard(splitResult.splitData.join('\n'))
                }
                className="w-full mt-4"
              >
                📋 全体をコピー
              </Button>
            </div>
          </Card>
        )}

        {/* Filter Results */}
        {filterResult && activeTab === 'filter' && (
          <Card workbench className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-red-700">
                📊 フィルター結果
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {filterResult.statistics.originalCount}
                  </div>
                  <div className="text-sm text-gray-600">元データ数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filterResult.statistics.filteredCount}
                  </div>
                  <div className="text-sm text-gray-600">抽出データ数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {filterResult.statistics.removedCount}
                  </div>
                  <div className="text-sm text-gray-600">除外データ数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {Math.round(filterResult.statistics.filterRate)}%
                  </div>
                  <div className="text-sm text-gray-600">抽出率</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-green-700 mb-2">
                    ✅ 抽出されたデータ
                  </h3>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {filterResult.filteredData.map((item, index) => (
                      <div
                        key={index}
                        className="p-2 bg-green-50 rounded text-sm font-mono"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  <Button
                    workbench
                    onClick={() =>
                      copyToClipboard(filterResult.filteredData.join('\n'))
                    }
                    className="mt-2"
                  >
                    📋 抽出データをコピー
                  </Button>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    ❌ 除外されたデータ
                  </h3>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {filterResult.removedData.map((item, index) => (
                      <div
                        key={index}
                        className="p-2 bg-gray-50 rounded text-sm font-mono"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Tool Footer */}
        <div className="text-center text-gray-600 mt-8">
          <p className="mb-2">
            🍺 <strong>Brew</strong>からのメッセージ:
          </p>
          <p className="text-sm italic">
            「データ切断工具だ！精密な分割とフィルタリングでデータを思い通りに加工しよう。
            切断は加工の基本技術だからな！✂️🔧」
          </p>
        </div>
      </div>
    </div>
  );
};
