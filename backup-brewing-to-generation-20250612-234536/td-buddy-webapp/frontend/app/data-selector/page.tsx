'use client';

import { Database, Plus, RefreshCw } from 'lucide-react';
import { useCallback, useState } from 'react';
import DataSelector, { SelectableDataItem } from '../../components/DataSelector';
import { Button } from '../../components/ui/Button';

// サンプルデータ醸造
const generateSampleData = (): SelectableDataItem[] => {
  const data: SelectableDataItem[] = [];

  // CSVデータサンプル
  const csvSamples = [
    { value: 'user001,田中太郎,tanaka@example.com,30,男性', category: 'ecommerce', preview: 'ユーザーID: user001' },
    { value: 'user002,佐藤花子,sato@example.com,25,女性', category: 'ecommerce', preview: 'ユーザーID: user002' },
    { value: 'product001,ノートパソコン,98000,電子機器', category: 'business', preview: '商品ID: product001' },
    { value: 'order001,2024-01-15,user001,product001,1', category: 'ecommerce', preview: '注文ID: order001' },
  ];

  csvSamples.forEach((sample, index) => {
    data.push({
      id: `csv-${index}`,
      value: sample.value,
      category: sample.category,
      type: 'csv-row',
      metadata: { format: 'CSV', encoding: 'UTF-8' },
      preview: sample.preview,
      selected: false
    });
  });

  // カラーデータサンプル
  const colorSamples = [
    { value: '#FF5733', category: 'warm', preview: 'オレンジレッド' },
    { value: '#33B5FF', category: 'cool', preview: 'スカイブルー' },
    { value: '#FF33F1', category: 'bright', preview: 'マゼンタ' },
    { value: '#33FF57', category: 'bright', preview: 'ライムグリーン' },
    { value: '#FFE333', category: 'warm', preview: '黄色' },
    { value: '#A633FF', category: 'cool', preview: '紫' },
  ];

  colorSamples.forEach((sample, index) => {
    data.push({
      id: `color-${index}`,
      value: sample.value,
      category: sample.category,
      type: 'color',
      metadata: { format: 'HEX', hasAlpha: false },
      preview: sample.preview,
      selected: false
    });
  });

  // 日時データサンプル
  const datetimeSamples = [
    { value: '2024-01-15T10:30:00Z', category: 'system', preview: '2024年1月15日' },
    { value: '2024-06-20T15:45:30Z', category: 'system', preview: '2024年6月20日' },
    { value: '2024-12-31T23:59:59Z', category: 'system', preview: '2024年12月31日' },
    { value: '1704164400000', category: 'system', preview: 'タイムスタンプ' },
  ];

  datetimeSamples.forEach((sample, index) => {
    data.push({
      id: `datetime-${index}`,
      value: sample.value,
      category: sample.category,
      type: 'datetime',
      metadata: { format: 'ISO8601', timezone: 'UTC' },
      preview: sample.preview,
      selected: false
    });
  });

  // パスワードサンプル
  const passwordSamples = [
    { value: 'K9#mX7@pL2!vQ8', category: 'security', preview: '強力（14文字）' },
    { value: 'Abc123!@#', category: 'security', preview: '標準（9文字）' },
    { value: 'SecureP@ssw0rd2024', category: 'security', preview: '非常に強力（18文字）' },
  ];

  passwordSamples.forEach((sample, index) => {
    data.push({
      id: `password-${index}`,
      value: sample.value,
      category: sample.category,
      type: 'password',
      metadata: { strength: 'high', hasSymbols: true },
      preview: sample.preview,
      selected: false
    });
  });

  // 個人情報サンプル
  const personalSamples = [
    { value: '田中太郎,tanaka@example.com,090-1234-5678', category: 'user', preview: '田中太郎' },
    { value: '佐藤花子,sato@example.com,080-9876-5432', category: 'user', preview: '佐藤花子' },
    { value: '鈴木一郎,suzuki@example.com,070-1111-2222', category: 'user', preview: '鈴木一郎' },
  ];

  personalSamples.forEach((sample, index) => {
    data.push({
      id: `personal-${index}`,
      value: sample.value,
      category: sample.category,
      type: 'personal',
      metadata: { locale: 'ja-JP', fake: true },
      preview: sample.preview,
      selected: false
    });
  });

  return data;
};

export default function DataSelectorPage() {
  const [sampleData, setSampleData] = useState<SelectableDataItem[]>(generateSampleData);
  const [selectedItems, setSelectedItems] = useState<SelectableDataItem[]>([]);
  const [brewMessage, setBrewMessage] = useState('データ選択デモページへようこそ！様々なテストデータから自由に選択できます♪');

  // 選択変更ハンドラ
  const handleSelectionChange = useCallback((items: SelectableDataItem[]) => {
    setSelectedItems(items);
    if (items.length === 0) {
      setBrewMessage('データを選択してください。チェックボックスをクリックするか、全選択ボタンをお試しください♪');
    } else if (items.length === 1) {
      setBrewMessage(`1件のデータを選択中です。種類: ${items[0].type}, カテゴリ: ${items[0].category}`);
    } else {
      setBrewMessage(`${items.length}件のデータを選択中です。一括コピーやダウンロードが可能です♪`);
    }
  }, []);

  // 一括アクション処理
  const handleBulkAction = useCallback((action: 'copy' | 'download' | 'delete', items: SelectableDataItem[]) => {
    switch (action) {
      case 'copy':
        const text = items.map(item => item.value).join('\n');
        navigator.clipboard.writeText(text);
        setBrewMessage(`✅ ${items.length}件のデータをクリップボードにコピーしました！`);
        break;

      case 'download':
        const content = items.map(item => `${item.type},${item.category},${item.value}`).join('\n');
        const blob = new Blob([`type,category,value\n${content}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `selected_data_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setBrewMessage(`📥 ${items.length}件のデータをCSVファイルでダウンロードしました！`);
        break;

      case 'delete':
        const updatedData = sampleData.filter(item => !items.some(selectedItem => selectedItem.id === item.id));
        setSampleData(updatedData);
        setSelectedItems([]);
        setBrewMessage(`🗑️ ${items.length}件のデータを削除しました。`);
        break;
    }
  }, [sampleData]);

  // データ再生成
  const regenerateData = useCallback(() => {
    const newData = generateSampleData();
    setSampleData(newData);
    setSelectedItems([]);
    setBrewMessage('🔄 サンプルデータを再生成しました！新しいデータをお試しください♪');
  }, []);

  // 新しいデータ追加
  const addCustomData = useCallback(() => {
    const customItem: SelectableDataItem = {
      id: `custom-${Date.now()}`,
      value: `カスタムデータ-${Math.floor(Math.random() * 1000)}`,
      category: 'custom',
      type: 'custom',
      metadata: { generated: new Date().toISOString() },
      preview: 'ユーザー追加データ',
      selected: false
    };

    setSampleData(prev => [...prev, customItem]);
    setBrewMessage('➕ カスタムデータを追加しました！');
  }, []);

  return (
    <div className="min-h-screen bg-td-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-td-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Database className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-td-gray-900">データ選択デモ</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                選択・フィルタ・一括操作
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={addCustomData}
                icon={<Plus className="h-4 w-4" />}
                variant="secondary"
                size="sm"
              >
                データ追加
              </Button>
              
              <Button
                onClick={regenerateData}
                icon={<RefreshCw className="h-4 w-4" />}
                variant="primary"
                size="sm"
              >
                データ再生成
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Brewキャラクターメッセージ */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🍺</div>
            <p className="text-blue-800 font-medium">{brewMessage}</p>
          </div>
        </div>

        {/* 機能説明 */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg border border-td-gray-200">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-td-gray-800 mb-2">検索・フィルタ</h3>
            <p className="text-td-gray-600 text-sm">
              テキスト検索、カテゴリ別フィルタ、データタイプ別フィルタで目的のデータを素早く見つけられます。
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-td-gray-200">
            <div className="text-3xl mb-3">☑️</div>
            <h3 className="text-lg font-semibold text-td-gray-800 mb-2">選択機能</h3>
            <p className="text-td-gray-600 text-sm">
              個別選択、全選択、カテゴリ別選択など、柔軟な選択方法でデータを管理できます。
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-td-gray-200">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-td-gray-800 mb-2">一括操作</h3>
            <p className="text-td-gray-600 text-sm">
              選択したデータをまとめてコピー、ダウンロード、削除などの操作が可能です。
            </p>
          </div>
        </div>

        {/* データセレクター */}
        <DataSelector
          data={sampleData}
          title="🎯 テストデータ選択機能"
          onSelectionChange={handleSelectionChange}
          onBulkAction={handleBulkAction}
          enableBulkActions={true}
          enableSearch={true}
          enableFiltering={true}
          maxDisplayItems={50}
          brewMessage={brewMessage}
        />

        {/* 選択済みデータの詳細 */}
        {selectedItems.length > 0 && (
          <div className="mt-8 bg-white rounded-xl p-6 border border-td-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-td-gray-800 mb-4">
              📋 選択済みデータ詳細 ({selectedItems.length}件)
            </h3>
            
            <div className="grid gap-4">
              {/* サマリー */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">📊 選択データ統計</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {['csv-row', 'color', 'datetime', 'password', 'personal', 'custom'].map(type => {
                    const count = selectedItems.filter(item => item.type === type).length;
                    if (count === 0) return null;
                    return (
                      <div key={type}>
                        <div className="font-bold text-green-700">{count}件</div>
                        <div className="text-green-600">{type}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* プレビュー */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedItems.slice(0, 10).map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-td-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {index + 1}
                      </span>
                      <span className="font-mono text-sm text-td-gray-800 truncate">
                        {item.value.length > 40 ? `${item.value.substring(0, 40)}...` : item.value}
                      </span>
                    </div>
                    <span className="text-xs text-td-gray-500">{item.type}</span>
                  </div>
                ))}
                
                {selectedItems.length > 10 && (
                  <p className="text-sm text-td-gray-500 text-center">
                    ...他 {selectedItems.length - 10}件
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 活用ガイド */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-td-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-td-gray-800 mb-4">💡 活用方法</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-td-gray-800 mb-2">🎯 効率的な選択方法</h4>
              <ul className="space-y-1 text-sm text-td-gray-600">
                <li>• 検索バーでキーワード検索</li>
                <li>• カテゴリ・タイプでフィルタリング</li>
                <li>• 全選択で一括選択</li>
                <li>• カテゴリ別選択で条件絞り込み</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-td-gray-800 mb-2">⚡ 一括操作活用</h4>
              <ul className="space-y-1 text-sm text-td-gray-600">
                <li>• 複数データを一度にコピー</li>
                <li>• CSV形式でまとめてダウンロード</li>
                <li>• 不要なデータを一括削除</li>
                <li>• 統計情報で選択内容を確認</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 