'use client';

import { Copy, Download, Plus, Settings, Table } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';

interface ColumnConfig {
  id: string;
  name: string;
  type: 'text' | 'number' | 'email' | 'phone' | 'date' | 'name';
  settings: any;
}

const CSVDetailedGenerator = () => {
  const [columns, setColumns] = useState<ColumnConfig[]>([
    {
      id: '1',
      name: 'ID',
      type: 'number',
      settings: { min: 1, max: 1000 }
    }
  ]);
  
  const [rowCount, setRowCount] = useState(100);
  const [generatedData, setGeneratedData] = useState<string[][]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const addColumn = () => {
    const newColumn: ColumnConfig = {
      id: Date.now().toString(),
      name: `Column${columns.length + 1}`,
      type: 'text',
      settings: {}
    };
    setColumns([...columns, newColumn]);
  };

  const removeColumn = (id: string) => {
    setColumns(columns.filter(col => col.id !== id));
  };

  const updateColumn = (id: string, field: string, value: any) => {
    setColumns(columns.map(col => 
      col.id === id ? { ...col, [field]: value } : col
    ));
  };

  const generateData = () => {
    setIsGenerating(true);
    const data: string[][] = [];
    
    // ヘッダー
    data.push(columns.map(col => col.name));
    
    // データ行
    for (let i = 0; i < rowCount; i++) {
      const row: string[] = [];
      for (const col of columns) {
        let value = '';
        
        switch (col.type) {
          case 'number':
            const min = col.settings.min || 1;
            const max = col.settings.max || 100;
            value = (Math.floor(Math.random() * (max - min + 1)) + min).toString();
            break;
          case 'text':
            value = `テキスト${i + 1}`;
            break;
          case 'email':
            value = `user${i + 1}@example.com`;
            break;
          case 'name':
            const names = ['田中太郎', '佐藤花子', '山田一郎', '鈴木美咲', '高橋健太'];
            value = names[Math.floor(Math.random() * names.length)];
            break;
          case 'phone':
            value = `090-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
            break;
          case 'date':
            const randomDate = new Date(2020 + Math.random() * 5, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
            value = randomDate.toLocaleDateString('ja-JP');
            break;
        }
        
        row.push(value);
      }
      data.push(row);
    }
    
    setGeneratedData(data);
    setIsGenerating(false);
  };

  const downloadCSV = () => {
    const csvContent = generatedData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Table className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">CSV詳細データ生成</h1>
            </div>
            <Button
              onClick={generateData}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              {isGenerating ? '生成中...' : 'データ生成'}
            </Button>
          </div>

          {/* 基本設定 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              生成件数
            </label>
            <input
              type="number"
              min="1"
              max="10000"
              value={rowCount}
              onChange={(e) => setRowCount(parseInt(e.target.value) || 100)}
              className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* カラム設定 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">カラム設定</h2>
            <Button
              onClick={addColumn}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              カラム追加
            </Button>
          </div>

          <div className="space-y-4">
            {columns.map((column) => (
              <div key={column.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      カラム名
                    </label>
                    <input
                      type="text"
                      value={column.name}
                      onChange={(e) => updateColumn(column.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      データタイプ
                    </label>
                    <select
                      value={column.type}
                      onChange={(e) => updateColumn(column.id, 'type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="text">テキスト</option>
                      <option value="number">数値</option>
                      <option value="email">メールアドレス</option>
                      <option value="phone">電話番号</option>
                      <option value="date">日付</option>
                      <option value="name">氏名</option>
                    </select>
                  </div>

                  {column.type === 'number' && (
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        範囲
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="最小値"
                          value={column.settings.min || ''}
                          onChange={(e) => updateColumn(column.id, 'settings', { 
                            ...column.settings, 
                            min: parseInt(e.target.value) || 1 
                          })}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="number"
                          placeholder="最大値"
                          value={column.settings.max || ''}
                          onChange={(e) => updateColumn(column.id, 'settings', { 
                            ...column.settings, 
                            max: parseInt(e.target.value) || 100 
                          })}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-end">
                    <Button
                      onClick={() => removeColumn(column.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      削除
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* データプレビュー */}
        {generatedData.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">データプレビュー</h2>
              <div className="flex gap-3">
                <Button
                  onClick={() => navigator.clipboard.writeText(
                    generatedData.map(row => row.join(',')).join('\n')
                  )}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  コピー
                </Button>
                <Button
                  onClick={downloadCSV}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  ダウンロード
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {generatedData[0]?.map((header, index) => (
                      <th
                        key={index}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {generatedData.slice(1, 11).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {generatedData.length > 11 && (
              <div className="mt-4 text-sm text-gray-600">
                {generatedData.length - 1}件中10件を表示
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CSVDetailedGenerator; 