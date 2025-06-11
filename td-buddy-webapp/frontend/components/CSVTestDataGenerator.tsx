'use client';

import { Download, GripVertical, HelpCircle, Plus, Upload } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { Button } from './ui/Button';

// 型定義
export interface CSVColumn {
  id: string;
  name: string;
  dataType: 'text' | 'number' | 'email' | 'phone' | 'date' | 'custom';
  preset?: string;
  customPattern?: string;
  required: boolean;
  order: number;
}

export interface CSVRow {
  id: string;
  data: Record<string, any>;
}

export interface ExportSettings {
  encoding: 'utf-8' | 'utf-8-bom' | 'shift_jis';
  delimiter: ',' | ';' | '\t';
  includeHeader: boolean;
  filename: string;
}

const CSVTestDataGenerator: React.FC = () => {
  // State管理
  const [columns, setColumns] = useState<CSVColumn[]>([]);
  const [rows, setRows] = useState<CSVRow[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rowCount, setRowCount] = useState<number>(100);
  const [outputFormat, setOutputFormat] = useState<'csv' | 'json' | 'tsv'>('csv');
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    encoding: 'utf-8-bom',
    delimiter: ',',
    includeHeader: true,
    filename: 'test_data'
  });
  
  // モーダル状態
  const [showPresetManager, setShowPresetManager] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showDataTable, setShowDataTable] = useState(false);
  const [showFileImporter, setShowFileImporter] = useState(false);
  
  // ドラッグ&ドロップ状態
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  
  // TDキャラクター状態
  const [tdMessage, setTdMessage] = useState('CSVテスト用データ生成の準備完了です！カラムを追加してください♪');

  // カラム追加
  const addColumn = useCallback(() => {
    const newColumn: CSVColumn = {
      id: `col_${Date.now()}`,
      name: `Column${columns.length + 1}`,
      dataType: 'text',
      required: false,
      order: columns.length
    };
    
    setColumns([...columns, newColumn]);
    setTdMessage('新しいカラムを追加しました！データタイプを設定してください♪');
  }, [columns]);

  // カラム削除
  const deleteColumn = useCallback((columnId: string) => {
    const updatedColumns = columns.filter(col => col.id !== columnId);
    setColumns(updatedColumns);
    setTdMessage('カラムを削除しました');
  }, [columns]);

  // ドラッグ&ドロップ処理
  const handleDragStart = useCallback((e: React.DragEvent, columnId: string) => {
    setDraggedColumnId(columnId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedColumnId(null);
    setDragOverColumnId(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumnId(columnId);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    
    if (!draggedColumnId || draggedColumnId === targetColumnId) {
      return;
    }

    const sortedColumns = [...columns].sort((a, b) => a.order - b.order);
    const draggedIndex = sortedColumns.findIndex(col => col.id === draggedColumnId);
    const targetIndex = sortedColumns.findIndex(col => col.id === targetColumnId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // カラムの順序を再配置
    const newColumns = [...sortedColumns];
    const [draggedColumn] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedColumn);

    // order を再設定
    const updatedColumns = newColumns.map((col, index) => ({
      ...col,
      order: index
    }));

    setColumns(updatedColumns);
    setTdMessage('カラムの順序を変更しました');
  }, [draggedColumnId, columns]);

  // データ生成
  const generateData = useCallback(() => {
    if (columns.length === 0) {
      setTdMessage('まずカラムを定義してください');
      return;
    }

    setIsGenerating(true);
    setTdMessage(`${rowCount}件のテストデータを生成中...`);

    // 簡単なダミーデータ生成
    const generatedRows: CSVRow[] = [];
    for (let i = 0; i < rowCount; i++) {
      const rowData: Record<string, any> = {};
      columns.forEach(col => {
        switch (col.dataType) {
          case 'text':
            rowData[col.id] = `Sample${i + 1}`;
            break;
          case 'number':
            rowData[col.id] = Math.floor(Math.random() * 1000);
            break;
          case 'email':
            rowData[col.id] = `user${i + 1}@example.com`;
            break;
          case 'phone':
            rowData[col.id] = `090-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
            break;
          case 'date':
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 365));
            rowData[col.id] = date.toISOString().split('T')[0];
            break;
          default:
            rowData[col.id] = `Value${i + 1}`;
        }
      });
      
      generatedRows.push({
        id: `row_${i}`,
        data: rowData
      });
    }

    setRows(generatedRows);
    setShowDataTable(true);
    setTdMessage(`✅ ${rowCount}件のテストデータを生成しました！`);
    setIsGenerating(false);
  }, [columns, rowCount]);

  // データダウンロード
  const downloadData = useCallback(() => {
    if (rows.length === 0) {
      generateData();
      return;
    }

    const sortedColumns = [...columns].sort((a, b) => a.order - b.order);
    let content = '';
    let mimeType = '';
    let extension = '';

    switch (outputFormat) {
      case 'csv':
        mimeType = 'text/csv;charset=utf-8;';
        extension = 'csv';
        if (exportSettings.includeHeader) {
          content += sortedColumns.map(col => col.name).join(',') + '\n';
        }
        rows.forEach(row => {
          const rowValues = sortedColumns.map(col => row.data[col.id] || '');
          content += rowValues.join(',') + '\n';
        });
        break;
      case 'json':
        mimeType = 'application/json;charset=utf-8;';
        extension = 'json';
        const jsonData = rows.map(row => {
          const obj: Record<string, any> = {};
          sortedColumns.forEach(col => {
            obj[col.name] = row.data[col.id] || '';
          });
          return obj;
        });
        content = JSON.stringify(jsonData, null, 2);
        break;
      case 'tsv':
        mimeType = 'text/tab-separated-values;charset=utf-8;';
        extension = 'tsv';
        if (exportSettings.includeHeader) {
          content += sortedColumns.map(col => col.name).join('\t') + '\n';
        }
        rows.forEach(row => {
          const rowValues = sortedColumns.map(col => row.data[col.id] || '');
          content += rowValues.join('\t') + '\n';
        });
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportSettings.filename}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTdMessage(`${outputFormat.toUpperCase()}ファイルをダウンロードしました！`);
  }, [rows, columns, outputFormat, exportSettings, generateData]);

  return (
    <div className="min-h-screen bg-td-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-td-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-td-gray-900">CSV テストデータ生成</h1>
              <span className="px-3 py-1 bg-td-primary-100 text-td-primary-800 text-sm rounded-full">
                ドラッグ&ドロップ対応
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowFileImporter(true)}
                icon={<Upload className="h-4 w-4" />}
                variant="secondary"
                size="sm"
              >
                CSVインポート
              </Button>
              
              <Button
                onClick={() => setShowGuide(!showGuide)}
                icon={<HelpCircle className="h-4 w-4" />}
                variant={showGuide ? "primary" : "secondary"}
                size="sm"
              >
                {showGuide ? 'ガイドを閉じる' : '活用ガイド'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TDキャラクターメッセージ */}
        <div className="mb-6 p-4 bg-td-primary-50 border border-td-primary-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🤖</div>
            <p className="text-td-primary-800 font-medium">{tdMessage}</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* メインコンテンツ */}
          <div className={`${showGuide ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6`}>
            {/* 設定パネル */}
            <div className="bg-white rounded-xl p-6 border border-td-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-td-gray-900 mb-6">テストデータ設定</h2>
              
              {/* データ生成設定 */}
              <div className="grid gap-6 md:grid-cols-2 mb-6">
                <div>
                  <label className="block text-sm font-medium text-td-gray-700 mb-2">
                    生成件数
                  </label>
                  <input
                    type="number"
                    value={rowCount}
                    onChange={(e) => setRowCount(Math.max(1, Math.min(10000, parseInt(e.target.value) || 1)))}
                    className="w-full px-4 py-2 border border-td-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-td-primary-500 focus:border-transparent"
                    min="1"
                    max="10000"
                  />
                  <p className="text-xs text-td-gray-500 mt-1">1〜10,000件まで生成可能</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-td-gray-700 mb-2">
                    出力形式
                  </label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value as 'csv' | 'json' | 'tsv')}
                    className="w-full px-4 py-2 border border-td-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-td-primary-500 focus:border-transparent"
                  >
                    <option value="csv">CSV (.csv)</option>
                    <option value="json">JSON (.json)</option>
                    <option value="tsv">TSV (.tsv)</option>
                  </select>
                </div>
              </div>

              {/* カラム管理 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-td-gray-800">
                    カラム設定 ({columns.length}個)
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={addColumn}
                      icon={<Plus className="h-4 w-4" />}
                      variant="primary"
                      size="sm"
                    >
                      カラム追加
                    </Button>
                  </div>
                </div>
                
                {/* カラム一覧 */}
                {columns.length === 0 ? (
                  <div className="text-center py-8 text-td-gray-500">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-lg font-medium">カラムが定義されていません</p>
                    <p className="text-sm">「カラム追加」ボタンから始めましょう</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-sm text-td-gray-600 mb-2 flex items-center gap-2">
                      <GripVertical className="h-4 w-4" />
                      <span>カラムをドラッグ&ドロップで並び替えできます</span>
                    </div>
                    
                    {columns
                      .sort((a, b) => a.order - b.order)
                      .map((column, index) => (
                        <div
                          key={column.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, column.id)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => handleDragOver(e, column.id)}
                          onDrop={(e) => handleDrop(e, column.id)}
                          className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-move ${
                            draggedColumnId === column.id
                              ? 'bg-td-primary-100 border-td-primary-300 opacity-50'
                              : dragOverColumnId === column.id
                              ? 'bg-td-primary-50 border-td-primary-200 border-dashed'
                              : 'bg-td-gray-50 border-td-gray-200 hover:bg-td-gray-100'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <GripVertical className="h-4 w-4 text-td-gray-400 cursor-move flex-shrink-0" />
                            <span className="font-medium text-td-gray-600 min-w-[30px]">{index + 1}.</span>
                            
                            <div className="flex items-center space-x-3">
                              <input
                                type="text"
                                value={column.name}
                                onChange={(e) => {
                                  const updatedColumns = columns.map(col => 
                                    col.id === column.id ? { ...col, name: e.target.value } : col
                                  );
                                  setColumns(updatedColumns);
                                }}
                                className="px-3 py-1 border border-td-gray-300 rounded text-sm"
                                placeholder="カラム名"
                              />
                              
                              <select
                                value={column.dataType}
                                onChange={(e) => {
                                  const updatedColumns = columns.map(col => 
                                    col.id === column.id ? { ...col, dataType: e.target.value as CSVColumn['dataType'] } : col
                                  );
                                  setColumns(updatedColumns);
                                }}
                                className="px-3 py-1 border border-td-gray-300 rounded text-sm"
                              >
                                <option value="text">テキスト</option>
                                <option value="number">数値</option>
                                <option value="email">メールアドレス</option>
                                <option value="phone">電話番号</option>
                                <option value="date">日付</option>
                              </select>
                            </div>
                          </div>
                          
                          <Button
                            onClick={() => deleteColumn(column.id)}
                            variant="danger"
                            size="sm"
                          >
                            削除
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* 操作ボタン */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-td-gray-200">
                <Button
                  onClick={generateData}
                  icon={<HelpCircle className="h-4 w-4" />}
                  variant="secondary"
                  disabled={columns.length === 0 || isGenerating}
                >
                  {isGenerating ? 'データ生成中...' : 'プレビュー'}
                </Button>
                <Button
                  onClick={downloadData}
                  icon={<Download className="h-4 w-4" />}
                  variant="primary"
                  disabled={columns.length === 0 || isGenerating}
                >
                  {isGenerating ? 'データ生成中...' : 'ダウンロード'}
                </Button>
              </div>
            </div>

            {/* データテーブル表示 */}
            {showDataTable && rows.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-td-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-td-gray-800 mb-4">
                  生成データプレビュー ({rows.length}件)
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-td-gray-200">
                    <thead className="bg-td-gray-50">
                      <tr>
                        {columns
                          .sort((a, b) => a.order - b.order)
                          .map((column) => (
                            <th key={column.id} className="border border-td-gray-200 px-4 py-2 text-left text-xs font-medium text-td-gray-500 uppercase">
                              {column.name}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-td-gray-200">
                      {rows.slice(0, 10).map((row, rowIndex) => (
                        <tr key={row.id}>
                          {columns
                            .sort((a, b) => a.order - b.order)
                            .map((column) => (
                              <td key={column.id} className="border border-td-gray-200 px-4 py-2 text-sm text-td-gray-900">
                                {row.data[column.id] || '-'}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {rows.length > 10 && (
                  <p className="text-sm text-td-gray-500 mt-4">
                    プレビューは最初の10件のみ表示されています。全データはダウンロードでご確認ください。
                  </p>
                )}
              </div>
            )}
          </div>

          {/* サイドパネル（ガイド） */}
          {showGuide && (
            <div className="lg:col-span-4">
              <div className="sticky top-24 bg-white rounded-xl p-6 border border-td-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-td-gray-800 mb-4">🚀 活用ガイド</h3>
                
                <div className="space-y-4 text-sm text-td-gray-600">
                  <div>
                    <h4 className="font-medium text-td-gray-800 mb-2">📊 基本的な使い方</h4>
                    <ul className="space-y-1">
                      <li>• カラム追加でデータ構造を定義</li>
                      <li>• データタイプで生成内容を設定</li>
                      <li>• ドラッグ&ドロップで順序変更</li>
                      <li>• プレビューで内容確認</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-td-gray-800 mb-2">🎯 データタイプ</h4>
                    <ul className="space-y-1">
                      <li>• テキスト: Sample1, Sample2...</li>
                      <li>• 数値: ランダムな整数</li>
                      <li>• メール: user1@example.com</li>
                      <li>• 電話: 090-xxxx-xxxx</li>
                      <li>• 日付: YYYY-MM-DD形式</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-td-gray-800 mb-2">💡 効率化Tips</h4>
                    <ul className="space-y-1">
                      <li>• CSVインポートで既存構造活用</li>
                      <li>• 複数フォーマット出力対応</li>
                      <li>• 最大10,000件まで生成可能</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSVTestDataGenerator; 