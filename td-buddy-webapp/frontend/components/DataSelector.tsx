'use client';

import { CheckSquare, Copy, Download, Filter, RefreshCw, Search, Square, X } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { Button } from './ui/Button';

// 型定義
export interface SelectableDataItem {
  id: string;
  value: string;
  category: string;
  type: 'csv-row' | 'color' | 'datetime' | 'password' | 'personal' | 'custom';
  metadata?: Record<string, any>;
  preview?: string;
  selected: boolean;
}

export interface DataSelectorProps {
  data: SelectableDataItem[];
  title: string;
  onSelectionChange: (selectedItems: SelectableDataItem[]) => void;
  onBulkAction?: (action: 'copy' | 'download' | 'delete', items: SelectableDataItem[]) => void;
  enableBulkActions?: boolean;
  enableSearch?: boolean;
  enableFiltering?: boolean;
  maxDisplayItems?: number;
  tdMessage?: string;
}

const DataSelector: React.FC<DataSelectorProps> = ({
  data,
  title,
  onSelectionChange,
  onBulkAction,
  enableBulkActions = true,
  enableSearch = true,
  enableFiltering = true,
  maxDisplayItems = 50,
  tdMessage = "データを選択してください♪"
}) => {
  // State管理
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [localData, setLocalData] = useState<SelectableDataItem[]>(data);
  const [isAllSelected, setIsAllSelected] = useState(false);

  // カテゴリ・タイプの抽出
  const categories = useMemo(() => {
    const cats = Array.from(new Set(localData.map(item => item.category)));
    return ['all', ...cats];
  }, [localData]);

  const types = useMemo(() => {
    const typeSet = Array.from(new Set(localData.map(item => item.type)));
    return ['all', ...typeSet];
  }, [localData]);

  // フィルタリング済みデータ
  const filteredData = useMemo(() => {
    let filtered = localData;

    // 検索フィルタ
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // カテゴリフィルタ
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // タイプフィルタ
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    return filtered.slice(0, maxDisplayItems);
  }, [localData, searchQuery, selectedCategory, selectedType, maxDisplayItems]);

  // 選択済みアイテム
  const selectedItems = useMemo(() => {
    return localData.filter(item => item.selected);
  }, [localData]);

  // 個別選択の切り替え
  const toggleItemSelection = useCallback((itemId: string) => {
    const updatedData = localData.map(item => 
      item.id === itemId ? { ...item, selected: !item.selected } : item
    );
    setLocalData(updatedData);
    
    const selectedItems = updatedData.filter(item => item.selected);
    onSelectionChange(selectedItems);
  }, [localData, onSelectionChange]);

  // 全選択・全解除
  const toggleAllSelection = useCallback(() => {
    const newSelectState = !isAllSelected;
    const updatedData = filteredData.map(item => ({ ...item, selected: newSelectState }));
    
    // localDataも更新
    const newLocalData = localData.map(localItem => {
      const filteredItem = updatedData.find(item => item.id === localItem.id);
      return filteredItem || localItem;
    });
    
    setLocalData(newLocalData);
    setIsAllSelected(newSelectState);
    
    const selectedItems = newLocalData.filter(item => item.selected);
    onSelectionChange(selectedItems);
  }, [isAllSelected, filteredData, localData, onSelectionChange]);

  // カテゴリ別選択
  const selectByCategory = useCallback((category: string) => {
    const updatedData = localData.map(item => 
      item.category === category ? { ...item, selected: true } : item
    );
    setLocalData(updatedData);
    
    const selectedItems = updatedData.filter(item => item.selected);
    onSelectionChange(selectedItems);
  }, [localData, onSelectionChange]);

  // 一括アクション
  const handleBulkAction = useCallback((action: 'copy' | 'download' | 'delete') => {
    if (onBulkAction && selectedItems.length > 0) {
      onBulkAction(action, selectedItems);
    }
  }, [onBulkAction, selectedItems]);

  // 選択解除
  const clearSelection = useCallback(() => {
    const updatedData = localData.map(item => ({ ...item, selected: false }));
    setLocalData(updatedData);
    setIsAllSelected(false);
    onSelectionChange([]);
  }, [localData, onSelectionChange]);

  // データタイプアイコン
  const getTypeIcon = useCallback((type: string) => {
    switch (type) {
      case 'csv-row': return '📊';
      case 'color': return '🎨';
      case 'datetime': return '📅';
      case 'password': return '🔐';
      case 'personal': return '👤';
      default: return '📝';
    }
  }, []);

  // カテゴリ表示名
  const getCategoryDisplayName = useCallback((category: string) => {
    switch (category) {
      case 'all': return '全カテゴリ';
      case 'ecommerce': return 'ECサイト';
      case 'user': return 'ユーザー';
      case 'business': return 'ビジネス';
      case 'system': return 'システム';
      case 'warm': return 'ウォーム';
      case 'cool': return 'クール';
      case 'pastel': return 'パステル';
      default: return category;
    }
  }, []);

  return (
    <div className="bg-white rounded-xl p-6 border border-td-gray-200 shadow-sm">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-td-gray-900">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-td-gray-500">
            {selectedItems.length}件選択中 / {filteredData.length}件表示
          </span>
        </div>
      </div>

      {/* TDメッセージ */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="text-lg">🤖</div>
          <p className="text-blue-800 text-sm">{tdMessage}</p>
        </div>
      </div>

      {/* 検索・フィルタエリア */}
      <div className="mb-6 space-y-4">
        {/* 検索バー */}
        {enableSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-td-gray-400" />
            <input
              type="text"
              placeholder="データを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-td-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-td-gray-400 hover:text-td-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* フィルタ */}
        {enableFiltering && (
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-td-gray-700 mb-1">
                カテゴリ
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-td-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {getCategoryDisplayName(cat)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-td-gray-700 mb-1">
                データタイプ
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-td-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? '全タイプ' : `${getTypeIcon(type)} ${type}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedType('all');
                }}
                icon={<RefreshCw className="h-4 w-4" />}
                variant="secondary"
                size="sm"
              >
                リセット
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 一括操作エリア */}
      <div className="mb-4 p-4 bg-td-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* 全選択チェックボックス */}
            <Button
              onClick={toggleAllSelection}
              icon={isAllSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
              variant={isAllSelected ? "primary" : "secondary"}
              size="sm"
            >
              {isAllSelected ? '全解除' : '全選択'}
            </Button>

            {/* カテゴリ別選択 */}
            {selectedCategory !== 'all' && (
              <Button
                onClick={() => selectByCategory(selectedCategory)}
                icon={<Filter className="h-4 w-4" />}
                variant="secondary"
                size="sm"
              >
                {getCategoryDisplayName(selectedCategory)}を全選択
              </Button>
            )}

            {/* 選択解除 */}
            {selectedItems.length > 0 && (
              <Button
                onClick={clearSelection}
                icon={<X className="h-4 w-4" />}
                variant="secondary"
                size="sm"
              >
                選択解除
              </Button>
            )}
          </div>

          {/* 一括アクション */}
          {enableBulkActions && selectedItems.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleBulkAction('copy')}
                icon={<Copy className="h-4 w-4" />}
                variant="primary"
                size="sm"
              >
                コピー ({selectedItems.length})
              </Button>
              <Button
                onClick={() => handleBulkAction('download')}
                icon={<Download className="h-4 w-4" />}
                variant="primary"
                size="sm"
              >
                ダウンロード
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* データ一覧 */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredData.length === 0 ? (
          <div className="text-center py-8 text-td-gray-500">
            <p>条件に一致するデータがありません</p>
            <p className="text-sm mt-1">検索条件を変更してお試しください</p>
          </div>
        ) : (
          filteredData.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                item.selected 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-white border-td-gray-200 hover:bg-td-gray-50'
              }`}
              onClick={() => toggleItemSelection(item.id)}
            >
              <div className="flex items-center space-x-3">
                {/* 選択チェックボックス */}
                <div className="flex-shrink-0">
                  {item.selected ? (
                    <CheckSquare className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Square className="h-5 w-5 text-td-gray-400" />
                  )}
                </div>

                {/* データ表示 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getTypeIcon(item.type)}</span>
                    <span className="font-mono text-sm text-td-gray-800 truncate">
                      {item.value.length > 50 ? `${item.value.substring(0, 50)}...` : item.value}
                    </span>
                  </div>
                  
                  {/* メタデータ表示 */}
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs px-2 py-1 bg-td-gray-100 text-td-gray-600 rounded">
                      {getCategoryDisplayName(item.category)}
                    </span>
                    <span className="text-xs text-td-gray-500">
                      {item.type}
                    </span>
                    {item.preview && (
                      <span className="text-xs text-td-gray-500">
                        {item.preview}
                      </span>
                    )}
                  </div>
                </div>

                {/* 個別アクション */}
                <div className="flex-shrink-0">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(item.value);
                    }}
                    icon={<Copy className="h-3 w-3" />}
                    variant="secondary"
                    size="sm"
                  >
                    コピー
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 表示制限メッセージ */}
      {localData.length > maxDisplayItems && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            📋 表示制限: {maxDisplayItems}件まで表示されています。
            検索・フィルタ機能を使用してデータを絞り込んでください。
          </p>
        </div>
      )}

      {/* 統計情報 */}
      <div className="mt-4 pt-4 border-t border-td-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{localData.length}</div>
            <div className="text-xs text-td-gray-500">総データ数</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{selectedItems.length}</div>
            <div className="text-xs text-td-gray-500">選択済み</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{categories.length - 1}</div>
            <div className="text-xs text-td-gray-500">カテゴリ数</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{types.length - 1}</div>
            <div className="text-xs text-td-gray-500">データタイプ</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSelector; 