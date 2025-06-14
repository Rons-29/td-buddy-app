'use client';

import {
  CheckSquare,
  Copy,
  Database,
  Download,
  HelpCircle,
  Link,
  Search,
  Square,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { allDataSets, PracticalDataSet } from '../../data/practicalDataSets';

export default function PracticalDataPage() {
  const [selectedDataSet, setSelectedDataSet] =
    useState<PracticalDataSet | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showGuide, setShowGuide] = useState(false);
  const [brewMessage, setBrewMessage] = useState(
    '🔗 実用データ接合工具の準備完了！ビジネスデータを接合・結合できます♪'
  );

  // カテゴリ一覧
  const categories = [
    'all',
    'game',
    'ecommerce',
    'business',
    'design',
    'region',
    'web-dev',
    'marketing',
  ];

  // カテゴリ表示名
  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'all':
        return '全カテゴリ';
      case 'game':
        return '🎮 ゲーム';
      case 'ecommerce':
        return '🛒 ECサイト';
      case 'business':
        return '💼 ビジネス';
      case 'design':
        return '🎨 デザイン';
      case 'region':
        return '🌐 地域・言語';
      case 'web-dev':
        return '💻 Web開発';
      case 'marketing':
        return '📊 マーケティング';
      default:
        return category;
    }
  };

  // フィルタリング済みデータセット
  const filteredDataSets = allDataSets.filter(dataSet => {
    const matchesCategory =
      selectedCategory === 'all' || dataSet.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      dataSet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataSet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataSet.items.some(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesCategory && matchesSearch;
  });

  // データセット選択
  const handleDataSetSelect = (dataSet: PracticalDataSet) => {
    setSelectedDataSet(dataSet);
    setSelectedItems([]);
    setBrewMessage(
      `🔗 「${dataSet.name}」データセットを接合対象に選択しました - ${dataSet.description}`
    );
  };

  // アイテム選択切り替え
  const toggleItemSelection = (item: string) => {
    setSelectedItems(prev => {
      const newSelection = prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item];

      if (newSelection.length === 0) {
        setBrewMessage(
          'アイテムを選択してください。接合したいデータにチェックを入れてくださいね♪'
        );
      } else if (newSelection.length === 1) {
        setBrewMessage(
          `「${newSelection[0]}」を接合対象に選択中です。他にも接合したいアイテムがあれば追加してください♪`
        );
      } else {
        setBrewMessage(
          `${newSelection.length}件のアイテムを接合対象に選択中です。一括接合で効率的に結合しましょう♪`
        );
      }

      return newSelection;
    });
  };

  // 全選択/全解除
  const toggleAllSelection = () => {
    if (!selectedDataSet) {
      return;
    }

    const allSelected = selectedItems.length === selectedDataSet.items.length;
    const newSelection = allSelected ? [] : [...selectedDataSet.items];

    setSelectedItems(newSelection);

    if (newSelection.length === 0) {
      setBrewMessage(
        '全てのアイテムの選択を解除しました。接合したいアイテムを個別に選択してください♪'
      );
    } else {
      setBrewMessage(
        `${selectedDataSet.name}の全${newSelection.length}件を接合対象に選択しました！一括接合をお試しください♪`
      );
    }
  };

  // 一括コピー
  const handleCopySelected = () => {
    if (selectedItems.length === 0) {
      return;
    }

    const text = selectedItems.join('\n');
    navigator.clipboard.writeText(text);
    setBrewMessage(
      `✅ 選択した${selectedItems.length}件のアイテムを接合してクリップボードにコピーしました！`
    );
  };

  // CSV出力
  const handleDownloadCSV = () => {
    if (selectedItems.length === 0 || !selectedDataSet) {
      return;
    }

    const csvContent = selectedItems
      .map(
        (item, index) => `${index + 1},"${item}","${selectedDataSet.category}"`
      )
      .join('\n');
    const csvHeader = 'No,Item,Category\n';
    const fullCsv = csvHeader + csvContent;

    const blob = new Blob([fullCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDataSet.id}_joined_${
      new Date().toISOString().split('T')[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setBrewMessage(
      `📥 「${selectedDataSet.name}」の接合アイテム（${selectedItems.length}件）をCSVファイルでダウンロードしました！`
    );
  };

  return (
    <div className="min-h-screen wb-workbench-bg">
      {/* ワークベンチヘッダー */}
      <Card workbench className="mb-6 bg-green-50 border-green-200">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Link className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-800">
                🔗 実用データ接合工具
              </h1>
              <p className="text-green-600 mt-1">
                ビジネス向けデータの選択・接合・結合
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-green-100 text-green-700 border-green-300"
            >
              接合工具
            </Badge>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              workbench
              onClick={() => setShowGuide(!showGuide)}
              className={`${
                showGuide
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              {showGuide ? 'ガイドを閉じる' : '接合ガイド'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Brewメッセージ */}
      <Card workbench className="mb-6 bg-green-50 border-green-200">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🍺</div>
            <div>
              <div className="font-medium text-green-800">
                Brew からのメッセージ
              </div>
              <div className="text-green-700 mt-1">{brewMessage}</div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* データセット選択パネル */}
        <Card workbench className="lg:col-span-1 bg-green-50 border-green-200">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Database className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-green-800">
                データセット選択
              </h2>
            </div>

            {/* 検索・フィルタ */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  データセット検索
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                  <Input
                    workbench
                    type="text"
                    placeholder="データセット名で検索..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  カテゴリフィルタ
                </label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-green-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {getCategoryDisplayName(category)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* データセット一覧 */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredDataSets.map(dataSet => (
                <button
                  key={dataSet.id}
                  onClick={() => handleDataSetSelect(dataSet)}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-all hover:shadow-md ${
                    selectedDataSet?.id === dataSet.id
                      ? 'border-green-500 bg-green-100'
                      : 'border-green-200 hover:border-green-300 bg-green-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-green-800">
                      {dataSet.name}
                    </h3>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-700 border-green-300 text-xs"
                    >
                      {dataSet.items.length}件
                    </Badge>
                  </div>
                  <p className="text-sm text-green-600 mb-2">
                    {dataSet.description}
                  </p>
                  <div className="text-xs text-green-500">
                    カテゴリ: {getCategoryDisplayName(dataSet.category)}
                  </div>
                </button>
              ))}
            </div>

            {filteredDataSets.length === 0 && (
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <p className="text-green-600">
                  該当するデータセットが見つかりません
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* データ接合パネル */}
        <Card workbench className="lg:col-span-2 bg-green-50 border-green-200">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Link className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-green-800">
                データ接合・結合
              </h2>
            </div>

            {selectedDataSet ? (
              <div className="space-y-6">
                {/* 選択されたデータセット情報 */}
                <div className="p-4 bg-green-100 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-green-800">
                      {selectedDataSet.name}
                    </h3>
                    <Badge
                      variant="outline"
                      className="bg-green-200 text-green-800 border-green-400"
                    >
                      {selectedDataSet.items.length}件のデータ
                    </Badge>
                  </div>
                  <p className="text-sm text-green-700">
                    {selectedDataSet.description}
                  </p>
                </div>

                {/* 接合統計 */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-100 rounded-lg">
                    <div className="text-2xl font-bold text-green-800">
                      {selectedDataSet.items.length}
                    </div>
                    <div className="text-sm text-green-600">総アイテム数</div>
                  </div>
                  <div className="text-center p-4 bg-green-100 rounded-lg">
                    <div className="text-2xl font-bold text-green-800">
                      {selectedItems.length}
                    </div>
                    <div className="text-sm text-green-600">接合対象</div>
                  </div>
                  <div className="text-center p-4 bg-green-100 rounded-lg">
                    <div className="text-2xl font-bold text-green-800">
                      {selectedItems.length > 0
                        ? Math.round(
                            (selectedItems.length /
                              selectedDataSet.items.length) *
                              100
                          )
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-green-600">接合率</div>
                  </div>
                </div>

                {/* 一括接合アクション */}
                <div className="flex items-center justify-between p-4 bg-green-100 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Button
                      workbench
                      onClick={toggleAllSelection}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      {selectedItems.length === selectedDataSet.items.length ? (
                        <>
                          <Square className="h-4 w-4 mr-2" />
                          全解除
                        </>
                      ) : (
                        <>
                          <CheckSquare className="h-4 w-4 mr-2" />
                          全選択
                        </>
                      )}
                    </Button>

                    {selectedItems.length > 0 && (
                      <>
                        <Button
                          workbench
                          onClick={handleCopySelected}
                          className="bg-green-100 text-green-700 hover:bg-green-200"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          接合してコピー
                        </Button>
                        <Button
                          workbench
                          onClick={handleDownloadCSV}
                          className="bg-green-100 text-green-700 hover:bg-green-200"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          接合してダウンロード
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* アイテム一覧 */}
                <div className="max-h-96 overflow-y-auto border border-green-300 rounded-lg bg-white">
                  <div className="p-4">
                    <h3 className="font-medium text-green-800 mb-3">
                      接合アイテム一覧 ({selectedDataSet.items.length}件)
                    </h3>
                    <div className="space-y-2">
                      {selectedDataSet.items.map((item, index) => (
                        <label
                          key={index}
                          className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedItems.includes(item)
                              ? 'bg-green-100 border border-green-300'
                              : 'bg-green-50 hover:bg-green-100 border border-green-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item)}
                            onChange={() => toggleItemSelection(item)}
                            className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
                          />
                          <span className="text-green-800 flex-1">{item}</span>
                          {selectedItems.includes(item) && (
                            <Badge
                              variant="outline"
                              className="bg-green-200 text-green-800 border-green-400 text-xs"
                            >
                              接合対象
                            </Badge>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Link className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-green-800 mb-2">
                  データセットを選択してください
                </h3>
                <p className="text-green-600">
                  左側のパネルからデータセットを選択すると、接合・結合操作が可能になります
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* 接合ガイド */}
      {showGuide && (
        <Card workbench className="mt-6 bg-green-50 border-green-200">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <HelpCircle className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-green-800">
                実用データ接合工具ガイド
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-green-800 mb-3">
                  🔗 データ接合機能
                </h3>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• ビジネス向け実用データの選択</li>
                  <li>• カテゴリ別データセット分類</li>
                  <li>• 複数アイテムの一括接合</li>
                  <li>• CSV形式での結合出力</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-green-800 mb-3">
                  📊 活用シーン
                </h3>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• ECサイトの商品データ作成</li>
                  <li>• ゲーム開発のアイテムリスト</li>
                  <li>• マーケティング資料の準備</li>
                  <li>• Web開発のテストデータ</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-100 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">💡</span>
                <span className="font-medium text-green-800">Brewのヒント</span>
              </div>
              <p className="text-sm text-green-700">
                データセットを選択後、必要なアイテムにチェックを入れて「接合してコピー」または「接合してダウンロード」で効率的にデータを結合できます。
                全選択機能を使えば、データセット全体を一度に接合することも可能です。
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
