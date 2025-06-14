'use client';

import {
  Copy,
  Database,
  Download,
  Filter,
  Plus,
  RefreshCw,
  Scissors,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import DataSelector, {
  SelectableDataItem,
} from '../../components/DataSelector';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

// サンプルデータ生成
const generateSampleData = (): SelectableDataItem[] => {
  const data: SelectableDataItem[] = [];

  // CSVデータサンプル
  const csvSamples = [
    {
      value: 'user001,田中太郎,tanaka@example.com,30,男性',
      category: 'ecommerce',
      preview: 'ユーザーID: user001',
    },
    {
      value: 'user002,佐藤花子,sato@example.com,25,女性',
      category: 'ecommerce',
      preview: 'ユーザーID: user002',
    },
    {
      value: 'product001,ノートパソコン,98000,電子機器',
      category: 'business',
      preview: '商品ID: product001',
    },
    {
      value: 'order001,2024-01-15,user001,product001,1',
      category: 'ecommerce',
      preview: '注文ID: order001',
    },
  ];

  csvSamples.forEach((sample, index) => {
    data.push({
      id: `csv-${index}`,
      value: sample.value,
      category: sample.category,
      type: 'csv-row',
      metadata: { format: 'CSV', encoding: 'UTF-8' },
      preview: sample.preview,
      selected: false,
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
      selected: false,
    });
  });

  // 日時データサンプル
  const datetimeSamples = [
    {
      value: '2024-01-15T10:30:00Z',
      category: 'system',
      preview: '2024年1月15日',
    },
    {
      value: '2024-06-20T15:45:30Z',
      category: 'system',
      preview: '2024年6月20日',
    },
    {
      value: '2024-12-31T23:59:59Z',
      category: 'system',
      preview: '2024年12月31日',
    },
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
      selected: false,
    });
  });

  // パスワードサンプル
  const passwordSamples = [
    {
      value: 'K9#mX7@pL2!vQ8',
      category: 'security',
      preview: '強力（14文字）',
    },
    { value: 'Abc123!@#', category: 'security', preview: '標準（9文字）' },
    {
      value: 'SecureP@ssw0rd2024',
      category: 'security',
      preview: '非常に強力（18文字）',
    },
  ];

  passwordSamples.forEach((sample, index) => {
    data.push({
      id: `password-${index}`,
      value: sample.value,
      category: sample.category,
      type: 'password',
      metadata: { strength: 'high', hasSymbols: true },
      preview: sample.preview,
      selected: false,
    });
  });

  // 個人情報サンプル
  const personalSamples = [
    {
      value: '田中太郎,tanaka@example.com,090-1234-5678',
      category: 'user',
      preview: '田中太郎',
    },
    {
      value: '佐藤花子,sato@example.com,080-9876-5432',
      category: 'user',
      preview: '佐藤花子',
    },
    {
      value: '鈴木一郎,suzuki@example.com,070-1111-2222',
      category: 'user',
      preview: '鈴木一郎',
    },
  ];

  personalSamples.forEach((sample, index) => {
    data.push({
      id: `personal-${index}`,
      value: sample.value,
      category: sample.category,
      type: 'personal',
      metadata: { locale: 'ja-JP', fake: true },
      preview: sample.preview,
      selected: false,
    });
  });

  return data;
};

export default function DataSelectorPage() {
  const [sampleData, setSampleData] =
    useState<SelectableDataItem[]>(generateSampleData);
  const [selectedItems, setSelectedItems] = useState<SelectableDataItem[]>([]);
  const [brewMessage, setBrewMessage] = useState(
    '✂️ データ切断工具の準備完了！データを選択・分離・切り出しできます♪'
  );

  // 選択変更ハンドラ
  const handleSelectionChange = useCallback((items: SelectableDataItem[]) => {
    setSelectedItems(items);
    if (items.length === 0) {
      setBrewMessage(
        'データを選択してください。チェックボックスをクリックして切り出し対象を指定できます♪'
      );
    } else if (items.length === 1) {
      setBrewMessage(
        `1件のデータを切り出し選択中です。種類: ${items[0].type}, カテゴリ: ${items[0].category}`
      );
    } else {
      setBrewMessage(
        `${items.length}件のデータを切り出し選択中です。一括切断・分離が可能です♪`
      );
    }
  }, []);

  // 一括アクション処理
  const handleBulkAction = useCallback(
    (action: 'copy' | 'download' | 'delete', items: SelectableDataItem[]) => {
      switch (action) {
        case 'copy':
          const text = items.map(item => item.value).join('\n');
          navigator.clipboard.writeText(text);
          setBrewMessage(
            `✅ ${items.length}件のデータを切り出してクリップボードにコピーしました！`
          );
          break;

        case 'download':
          const content = items
            .map(item => `${item.type},${item.category},${item.value}`)
            .join('\n');
          const blob = new Blob([`type,category,value\n${content}`], {
            type: 'text/csv;charset=utf-8;',
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `cut_data_${new Date().toISOString().split('T')[0]}.csv`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          setBrewMessage(
            `📥 ${items.length}件のデータを切り出してCSVファイルでダウンロードしました！`
          );
          break;

        case 'delete':
          const updatedData = sampleData.filter(
            item => !items.some(selectedItem => selectedItem.id === item.id)
          );
          setSampleData(updatedData);
          setSelectedItems([]);
          setBrewMessage(`✂️ ${items.length}件のデータを切断・削除しました。`);
          break;
      }
    },
    [sampleData]
  );

  // データ再生成
  const regenerateData = useCallback(() => {
    const newData = generateSampleData();
    setSampleData(newData);
    setSelectedItems([]);
    setBrewMessage(
      '🔄 サンプルデータを再生成しました！新しいデータを切り出してください♪'
    );
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
      selected: false,
    };

    setSampleData(prev => [...prev, customItem]);
    setBrewMessage(
      '➕ カスタムデータを追加しました！切り出し対象が増えました♪'
    );
  }, []);

  return (
    <div className="min-h-screen wb-workbench-bg">
      {/* ワークベンチヘッダー */}
      <Card workbench className="mb-6 bg-red-50 border-red-200">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Scissors className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-red-800">
                ✂️ データ切断工具
              </h1>
              <p className="text-red-600 mt-1">
                データの選択・分離・切り出し・フィルタリング
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-red-100 text-red-700 border-red-300"
            >
              切断工具
            </Badge>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              workbench
              onClick={regenerateData}
              className="bg-red-100 text-red-700 hover:bg-red-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              データ再生成
            </Button>
            <Button
              workbench
              onClick={addCustomData}
              className="bg-red-100 text-red-700 hover:bg-red-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              データ追加
            </Button>
          </div>
        </div>
      </Card>

      {/* Brewメッセージ */}
      <Card workbench className="mb-6 bg-red-50 border-red-200">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🍺</div>
            <div>
              <div className="font-medium text-red-800">
                Brew からのメッセージ
              </div>
              <div className="text-red-700 mt-1">{brewMessage}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 切断統計 */}
      <Card workbench className="mb-6 bg-red-50 border-red-200">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Filter className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-semibold text-red-800">切断統計</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-100 rounded-lg">
              <div className="text-2xl font-bold text-red-800">
                {sampleData.length}
              </div>
              <div className="text-sm text-red-600">総データ数</div>
            </div>
            <div className="text-center p-4 bg-red-100 rounded-lg">
              <div className="text-2xl font-bold text-red-800">
                {selectedItems.length}
              </div>
              <div className="text-sm text-red-600">選択中</div>
            </div>
            <div className="text-center p-4 bg-red-100 rounded-lg">
              <div className="text-2xl font-bold text-red-800">
                {new Set(sampleData.map(item => item.type)).size}
              </div>
              <div className="text-sm text-red-600">データ種類</div>
            </div>
            <div className="text-center p-4 bg-red-100 rounded-lg">
              <div className="text-2xl font-bold text-red-800">
                {new Set(sampleData.map(item => item.category)).size}
              </div>
              <div className="text-sm text-red-600">カテゴリ数</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 一括切断アクション */}
      {selectedItems.length > 0 && (
        <Card workbench className="mb-6 bg-red-50 border-red-200">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Scissors className="h-5 w-5 text-red-600" />
              <h2 className="text-lg font-semibold text-red-800">
                一括切断アクション ({selectedItems.length}件選択中)
              </h2>
            </div>

            <div className="flex space-x-3">
              <Button
                workbench
                onClick={() => handleBulkAction('copy', selectedItems)}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                <Copy className="h-4 w-4 mr-2" />
                切り出してコピー
              </Button>
              <Button
                workbench
                onClick={() => handleBulkAction('download', selectedItems)}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                <Download className="h-4 w-4 mr-2" />
                切り出してダウンロード
              </Button>
              <Button
                workbench
                onClick={() => handleBulkAction('delete', selectedItems)}
                className="bg-red-100 text-red-700 hover:bg-red-200"
              >
                <Scissors className="h-4 w-4 mr-2" />
                切断・削除
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* データ選択・切断パネル */}
      <Card workbench className="bg-red-50 border-red-200">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Database className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-semibold text-red-800">
              データ選択・切断パネル
            </h2>
          </div>

          <DataSelector
            data={sampleData}
            title="データ選択・切断"
            onSelectionChange={handleSelectionChange}
            onBulkAction={handleBulkAction}
          />
        </div>
      </Card>
    </div>
  );
}
