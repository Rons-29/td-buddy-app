'use client';

import { CheckSquare, Copy, Download, List, Search, Square } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { allDataSets, PracticalDataSet } from '../../data/practicalDataSets';

export default function PracticalDataPage() {
  const [selectedDataSet, setSelectedDataSet] = useState<PracticalDataSet | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [brewMessage, setTdMessage] = useState('実用的なデータリストへようこそ！ビジネスで実際に使用されるデータから選択できます♪');

  // カテゴリ一覧
  const categories = ['all', 'game', 'ecommerce', 'business', 'design', 'region', 'web-dev', 'marketing'];
  
  // カテゴリ表示名
  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'all': return '全カテゴリ';
      case 'game': return '🎮 ゲーム';
      case 'ecommerce': return '🛒 ECサイト';
      case 'business': return '💼 ビジネス';
      case 'design': return '🎨 デザイン';
      case 'region': return '🌐 地域・言語';
      case 'web-dev': return '💻 Web開発';
      case 'marketing': return '📊 マーケティング';
      default: return category;
    }
  };

  // フィルタリング済みデータセット
  const filteredDataSets = allDataSets.filter(dataSet => {
    const matchesCategory = selectedCategory === 'all' || dataSet.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      dataSet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataSet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataSet.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // データセット選択
  const handleDataSetSelect = (dataSet: PracticalDataSet) => {
    setSelectedDataSet(dataSet);
    setSelectedItems([]);
    setTdMessage(dataSet.brewMessage);
  };

  // アイテム選択切り替え
  const toggleItemSelection = (item: string) => {
    setSelectedItems(prev => {
      const newSelection = prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item];
      
      if (newSelection.length === 0) {
        setTdMessage('アイテムを選択してください。必要なデータにチェックを入れてくださいね♪');
      } else if (newSelection.length === 1) {
        setTdMessage(`「${newSelection[0]}」を選択中です。他にも必要なアイテムがあれば追加してください♪`);
      } else {
        setTdMessage(`${newSelection.length}件のアイテムを選択中です。一括操作で効率的に活用しましょう♪`);
      }
      
      return newSelection;
    });
  };

  // 全選択/全解除
  const toggleAllSelection = () => {
    if (!selectedDataSet) return;
    
    const allSelected = selectedItems.length === selectedDataSet.items.length;
    const newSelection = allSelected ? [] : [...selectedDataSet.items];
    
    setSelectedItems(newSelection);
    
    if (newSelection.length === 0) {
      setTdMessage('全てのアイテムの選択を解除しました。必要なアイテムを個別に選択してください♪');
    } else {
      setTdMessage(`${selectedDataSet.name}の全${newSelection.length}件を選択しました！一括操作をお試しください♪`);
    }
  };

  // 一括コピー
  const handleCopySelected = () => {
    if (selectedItems.length === 0) return;
    
    const text = selectedItems.join('\n');
    navigator.clipboard.writeText(text);
    setTdMessage(`✅ 選択した${selectedItems.length}件のアイテムをクリップボードにコピーしました！`);
  };

  // CSV出力
  const handleDownloadCSV = () => {
    if (selectedItems.length === 0 || !selectedDataSet) return;
    
    const csvContent = selectedItems.map((item, index) => `${index + 1},"${item}","${selectedDataSet.category}"`).join('\n');
    const csvHeader = 'No,Item,Category\n';
    const fullCsv = csvHeader + csvContent;
    
    const blob = new Blob([fullCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDataSet.id}_selected_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setTdMessage(`📥 「${selectedDataSet.name}」の選択アイテム（${selectedItems.length}件）をCSVファイルでダウンロードしました！`);
  };

  return (
    <div className="min-h-screen bg-td-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-td-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <List className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-td-gray-900">実用的データ選択</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                ビジネス向けリスト
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TDメッセージ */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🍺</div>
            <p className="text-blue-800 font-medium">{brewMessage}</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* 左側: データセット一覧 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-td-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-td-gray-800 mb-4">📂 データセット一覧</h2>
              
              {/* 検索・フィルタ */}
              <div className="mb-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-td-gray-400" />
                  <input
                    type="text"
                    placeholder="データセットを検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-td-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-td-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {getCategoryDisplayName(cat)}
                    </option>
                  ))}
                </select>
              </div>

              {/* データセットリスト */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredDataSets.map((dataSet) => (
                  <div
                    key={dataSet.id}
                    onClick={() => handleDataSetSelect(dataSet)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedDataSet?.id === dataSet.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-td-gray-200 hover:bg-td-gray-50'
                    }`}
                  >
                    <div className="font-medium text-td-gray-800 text-sm">{dataSet.name}</div>
                    <div className="text-xs text-td-gray-500 mt-1">{dataSet.description}</div>
                    <div className="text-xs text-blue-600 mt-1">{dataSet.items.length}件のアイテム</div>
                  </div>
                ))}
              </div>

              {filteredDataSets.length === 0 && (
                <div className="text-center py-8 text-td-gray-500">
                  <p>条件に一致するデータセットがありません</p>
                  <p className="text-sm mt-1">検索条件を変更してお試しください</p>
                </div>
              )}
            </div>
          </div>

          {/* 右側: アイテム選択 */}
          <div className="lg:col-span-2">
            {selectedDataSet ? (
              <div className="bg-white rounded-xl p-6 border border-td-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-td-gray-800">{selectedDataSet.name}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-td-gray-500">
                      {selectedItems.length}件選択中 / {selectedDataSet.items.length}件
                    </span>
                  </div>
                </div>

                <p className="text-td-gray-600 text-sm mb-4">{selectedDataSet.description}</p>
                
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-sm text-green-800">
                    <strong>活用場面:</strong> {selectedDataSet.useCase}
                  </div>
                </div>

                {/* 選択操作 */}
                <div className="mb-4 flex items-center justify-between">
                  <Button
                    onClick={toggleAllSelection}
                    icon={selectedItems.length === selectedDataSet.items.length ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                    variant={selectedItems.length === selectedDataSet.items.length ? "primary" : "secondary"}
                    size="sm"
                  >
                    {selectedItems.length === selectedDataSet.items.length ? '全解除' : '全選択'}
                  </Button>

                  {selectedItems.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleCopySelected}
                        icon={<Copy className="h-4 w-4" />}
                        variant="primary"
                        size="sm"
                      >
                        コピー ({selectedItems.length})
                      </Button>
                      <Button
                        onClick={handleDownloadCSV}
                        icon={<Download className="h-4 w-4" />}
                        variant="primary"
                        size="sm"
                      >
                        CSV出力
                      </Button>
                    </div>
                  )}
                </div>

                {/* アイテム一覧 */}
                <div className="grid gap-2 max-h-96 overflow-y-auto">
                  {selectedDataSet.items.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => toggleItemSelection(item)}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedItems.includes(item)
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-white border-td-gray-200 hover:bg-td-gray-50'
                      }`}
                    >
                      <div className="flex-shrink-0 mr-3">
                        {selectedItems.includes(item) ? (
                          <CheckSquare className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Square className="h-5 w-5 text-td-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="text-td-gray-800 font-medium">{item}</span>
                      </div>
                      <div className="flex-shrink-0">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(item);
                            setTdMessage(`✅ 「${item}」をクリップボードにコピーしました！`);
                          }}
                          icon={<Copy className="h-3 w-3" />}
                          variant="secondary"
                          size="sm"
                        >
                          コピー
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 border border-td-gray-200 shadow-sm">
                <div className="text-center py-12">
                  <List className="h-12 w-12 text-td-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-td-gray-800 mb-2">データセットを選択してください</h3>
                  <p className="text-td-gray-600">
                    左側のリストからデータセットを選択すると、アイテムの一覧が表示されます
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 選択済みアイテムの詳細 */}
        {selectedItems.length > 0 && selectedDataSet && (
          <div className="mt-8 bg-white rounded-xl p-6 border border-td-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-td-gray-800 mb-4">
              📋 選択済みアイテム ({selectedItems.length}件)
            </h3>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {selectedItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-td-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {index + 1}
                    </span>
                    <span className="text-sm text-td-gray-800">{item}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 使い方ガイド */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-td-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-td-gray-800 mb-4">💡 使い方ガイド</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-td-gray-800 mb-2">🎯 効率的な選択方法</h4>
              <ul className="space-y-1 text-sm text-td-gray-600">
                <li>• 検索バーでデータセットを絞り込み</li>
                <li>• カテゴリフィルタで分野を選択</li>
                <li>• 必要なアイテムにチェック</li>
                <li>• 全選択で一括選択も可能</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-td-gray-800 mb-2">⚡ 活用例</h4>
              <ul className="space-y-1 text-sm text-td-gray-600">
                <li>• ゲーム施策の同時リリース計画</li>
                <li>• ECサイトのカテゴリ設定</li>
                <li>• Web系メンテナンス時間調整</li>
                <li>• マーケティング施策の計画</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 