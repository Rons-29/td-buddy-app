'use client';

import React, { useState } from 'react';
import { Copy, Check, DownloadIcon, Table, List, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './Button';
// import { cn } from '../../utils/cn';

interface DataTableColumn {
  key: string;
  label: string;
  icon?: React.ReactNode;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: DataTableColumn[];
  data: Record<string, any>[];
  className?: string;
  showRowNumbers?: boolean;
  sortable?: boolean;
  exportable?: boolean;
  maxHeight?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  className,
  showRowNumbers = true,
  sortable = true,
  exportable = true,
  maxHeight = 'max-h-96'
}) => {
  const [copiedCell, setCopiedCell] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // ソート機能
  const handleSort = (key: string) => {
    if (!sortable) return;
    
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  // コピー機能
  const copyToClipboard = async (text: string, cellId?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCell(cellId || 'generic');
      setTimeout(() => setCopiedCell(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // 全体をTSV形式でコピー
  const copyAllAsTSV = () => {
    const headers = columns.map(col => col.label).join('\t');
    const rows = sortedData.map(row => 
      columns.map(col => {
        const value = row[col.key];
        if (typeof value === 'object' && value !== null) {
          // オブジェクトの場合は適切に文字列化
          if (value.kanji && value.katakana) return `${value.kanji} (${value.katakana})`;
          if (value.full) return value.full;
          return JSON.stringify(value);
        }
        return value || '';
      }).join('\t')
    ).join('\n');
    
    const tsvContent = `${headers}\n${rows}`;
    copyToClipboard(tsvContent, 'all-tsv');
  };

  // CSV形式でエクスポート
  const exportAsCSV = () => {
    const headers = columns.map(col => `"${col.label}"`).join(',');
    const rows = sortedData.map(row => 
      columns.map(col => {
        const value = row[col.key];
        if (typeof value === 'object' && value !== null) {
          if (value.kanji && value.katakana) return `"${value.kanji} (${value.katakana})"`;
          if (value.full) return `"${value.full}"`;
          return `"${JSON.stringify(value)}"`;
        }
        return `"${value || ''}"`;
      }).join(',')
    ).join('\n');
    
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `data_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 行の展開/折りたたみ
  const toggleRowExpansion = (rowIndex: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowIndex)) {
      newExpanded.delete(rowIndex);
    } else {
      newExpanded.add(rowIndex);
    }
    setExpandedRows(newExpanded);
  };

  // 値のレンダリング
  const renderCellValue = (column: DataTableColumn, value: any, row: any) => {
    if (column.render) return column.render(value, row);
    
    if (typeof value === 'object' && value !== null) {
      if (value.kanji && value.katakana) {
        return (
          <div className="space-y-1">
            <div className="font-medium">{value.kanji}</div>
            <div className="text-xs text-gray-500">{value.katakana}</div>
          </div>
        );
      }
      if (value.full) return value.full;
      return JSON.stringify(value);
    }
    
    return value || '-';
  };

  // セルの文字列値を取得
  const getCellStringValue = (column: DataTableColumn, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (value.kanji && value.katakana) return `${value.kanji} (${value.katakana})`;
      if (value.full) return value.full;
      return JSON.stringify(value);
    }
    return value ? String(value) : '';
  };

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {/* ツールバー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Table className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">
            データテーブル ({data.length}件)
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {exportable && (
            <Button
              onClick={exportAsCSV}
              variant="secondary"
              size="sm"
              icon={<DownloadIcon className="h-4 w-4" />}
            >
              CSV出力
            </Button>
          )}
        </div>
      </div>

      {/* テーブル */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-xl overflow-hidden shadow-lg">
        <div className={`overflow-auto custom-scrollbar ${maxHeight}`}>
          <table className="w-full">
            {/* ヘッダー */}
            <thead className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
              <tr>
                {showRowNumbers && (
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-16">
                    #
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider ${column.width || ''} ${sortable ? 'cursor-pointer hover:bg-blue-100/50 transition-colors' : ''}`}
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-2">
                      {column.icon && <span className="text-sm">{column.icon}</span>}
                      <span>{column.label}</span>
                      {sortable && sortConfig?.key === column.key && (
                        <span className="text-blue-500">
                          {sortConfig.direction === 'asc' ? 
                            <ChevronUp className="h-3 w-3" /> : 
                            <ChevronDown className="h-3 w-3" />
                          }
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-20">
                  操作
                </th>
              </tr>
            </thead>

            {/* ボディ */}
            <tbody className="divide-y divide-gray-100">
              {sortedData.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <tr className="hover:bg-blue-50/30 transition-colors group">
                    {showRowNumbers && (
                      <td className="px-4 py-4 text-sm font-medium text-gray-500">
                        {rowIndex + 1}
                      </td>
                    )}
                    
                    {columns.map((column) => {
                      const cellId = `${rowIndex}-${column.key}`;
                      const cellValue = getCellStringValue(column, row[column.key]);
                      
                      return (
                        <td
                          key={column.key}
                          className="px-4 py-4 text-sm text-gray-800 group-hover:bg-blue-50/20 transition-colors relative"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              {renderCellValue(column, row[column.key], row)}
                            </div>
                            
                            {cellValue && (
                              <button
                                onClick={() => copyToClipboard(cellValue, cellId)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:bg-gray-200 rounded"
                                title={`${column.label}をコピー`}
                              >
                                {copiedCell === cellId ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3 text-gray-400" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    
                    {/* 行操作 */}
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => toggleRowExpansion(rowIndex)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="詳細表示の切り替え"
                      >
                        {expandedRows.has(rowIndex) ? (
                          <ChevronUp className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                  </tr>
                  
                  {/* 展開された詳細行 */}
                  {expandedRows.has(rowIndex) && (
                    <tr className="bg-gray-50/50">
                      <td colSpan={columns.length + (showRowNumbers ? 2 : 1)} className="px-4 py-3">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          {columns.map((column) => {
                            const value = row[column.key];
                            if (!value) return null;
                            
                            return (
                              <div key={column.key} className="space-y-1">
                                <div className="flex items-center space-x-1 text-xs font-medium text-gray-600">
                                  {column.icon && <span>{column.icon}</span>}
                                  <span>{column.label}</span>
                                </div>
                                <div className="text-gray-800">
                                  {renderCellValue(column, value, row)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* フッター統計 */}
      <div className="flex items-center justify-between text-sm text-gray-600 bg-white/50 backdrop-blur-sm rounded-lg px-4 py-2">
        <span>総件数: {data.length}件</span>
        <span>表示フィールド: {columns.length}項目</span>
      </div>
    </div>
  );
}; 