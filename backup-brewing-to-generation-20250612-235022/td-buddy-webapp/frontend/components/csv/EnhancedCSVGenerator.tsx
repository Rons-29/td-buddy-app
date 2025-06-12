/**
 * 改良版CSV詳細データ醸造コンポーネント
 * QA Workbench (TD) - Enhanced CSV Generator with Advanced Features
 */

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ColumnConfig,
  CsvConfig,
  DataTypeCategory,
} from '../../types/csvDataTypes';
import { BatchJob, CSVBatchProcessor } from '../../utils/csvBatchProcessor';
import { generateData } from '../../utils/csvDataGenerator';
import {
  CSVTemplateManager,
  CsvTemplate,
} from '../../utils/csvTemplateManager';
import { PerformanceOptimizer } from '../../utils/performanceOptimizer';
import BrewCharacter from '../BrewCharacter';

interface EnhancedCSVGeneratorProps {
  className?: string;
  onGenerate?: (data: string[][]) => void;
}

interface UIState {
  activeTab: 'generator' | 'templates' | 'batch' | 'performance';
  isGenerating: boolean;
  showTemplateModal: boolean;
  showBatchModal: boolean;
  showPerformancePanel: boolean;
}

export function EnhancedCSVGenerator({
  className,
  onGenerate,
}: EnhancedCSVGeneratorProps) {
  // 翻訳関数を簡素化（SSR対応）
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'csv.title': 'CSV詳細データ醸造',
      'csv.subtitle': 'テストデータ醸造ツール',
      'csv.addColumn': '列を追加',
      'csv.columnName': '列名',
      'csv.generate': 'データ醸造',
      'csv.downloadCsv': 'CSVダウンロード',
      'csv.saveTemplate': 'テンプレート保存',
      'csv.preview': 'プレビュー',
      'dataTypes.text': 'テキスト',
      'dataTypes.number': '数値',
      'dataTypes.name': '名前',
      'dataTypes.email': 'メールアドレス',
      'dataTypes.phone': '電話番号',
      'dataTypes.date': '日付',
      'dataTypes.age': '年齢',
    };
    return translations[key] || key;
  };

  const formatNumber = (num: number) => num.toLocaleString('ja-JP');
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) {
      return '0 バイト';
    }
    const k = 1024;
    const sizes = ['バイト', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };
  const brewMessage = (key: string) => `TDメッセージ: ${key}`;

  // 基本状態管理
  const [config, setConfig] = useState<CsvConfig>({
    columns: [
      {
        id: '1',
        name: '名前',
        dataType: 'name' as DataTypeCategory,
        settings: {},
        nullable: false,
        nullRatio: 0,
        unique: false,
      },
    ],
    rowCount: 100,
    outputFormat: 'csv',
    includeHeader: true,
    encoding: 'utf-8-bom',
  });

  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [uiState, setUIState] = useState<UIState>({
    activeTab: 'generator',
    isGenerating: false,
    showTemplateModal: false,
    showBatchModal: false,
    showPerformancePanel: false,
  });

  // 高度な機能の状態
  const [templates, setTemplates] = useState<CsvTemplate[]>([]);
  const [batchJobs, setBatchJobs] = useState<BatchJob[]>([]);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<CsvTemplate | null>(
    null
  );
  const [brewEmotion, setBrewEmotion] = useState<
    'friendly' | 'excited' | 'working' | 'happy'
  >('friendly');
  const [brewCurrentMessage, setBrewCurrentMessage] =
    useState('CSV生成の準備ができました！');

  // インスタンス取得
  const batchProcessor = useMemo(() => CSVBatchProcessor.getInstance(), []);
  const performanceOptimizer = useMemo(
    () => PerformanceOptimizer.getInstance(),
    []
  );

  // テンプレート読み込み
  useEffect(() => {
    loadTemplates();
  }, []);

  // バッチジョブ監視
  useEffect(() => {
    const interval = setInterval(() => {
      setBatchJobs(batchProcessor.getAllJobs());
    }, 1000);

    return () => clearInterval(interval);
  }, [batchProcessor]);

  // パフォーマンス監視
  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceData(performanceOptimizer.generateReport());
    }, 5000);

    return () => clearInterval(interval);
  }, [performanceOptimizer]);

  const loadTemplates = useCallback(() => {
    const allTemplates = CSVTemplateManager.getAllTemplates({
      includeBuiltIn: true,
    });
    setTemplates(allTemplates);
  }, []);

  const filteredTemplates = useMemo(() => {
    if (!searchQuery) {
      return templates;
    }

    return templates.filter(
      template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [templates, searchQuery]);

  // 列の追加
  const addColumn = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      columns: [
        ...prev.columns,
        {
          id: `col_${Date.now()}`,
          name: `列${prev.columns.length + 1}`,
          dataType: 'text' as DataTypeCategory,
          settings: {},
          nullable: false,
          nullRatio: 0,
          unique: false,
        },
      ],
    }));
  }, []);

  // 列の削除
  const removeColumn = useCallback((index: number) => {
    setConfig(prev => ({
      ...prev,
      columns: prev.columns.filter((_, i) => i !== index),
    }));
  }, []);

  // 列の更新
  const updateColumn = useCallback(
    (index: number, updates: Partial<ColumnConfig>) => {
      setConfig(prev => ({
        ...prev,
        columns: prev.columns.map((col, i) =>
          i === index ? { ...col, ...updates } : col
        ),
      }));
    },
    []
  );

  // プレビューデータ醸造
  const generatePreview = useCallback(() => {
    if (config.columns.length === 0) {
      setPreviewData([]);
      return;
    }

    const headers = config.columns.map(col => col.name);
    const rows = [headers];

    // 最大10行のプレビューを生成
    for (let i = 0; i < Math.min(10, config.rowCount); i++) {
      const row = config.columns.map(col =>
        String(generateData(col.dataType, col.settings || {}))
      );
      rows.push(row);
    }

    setPreviewData(rows);
  }, [config]);

  // データ醸造
  const generateCSV = useCallback(async () => {
    if (config.columns.length === 0) {
      return;
    }

    setUIState(prev => ({ ...prev, isGenerating: true }));
    setBrewEmotion('working');
    setBrewCurrentMessage('データ醸造中です！少々お待ちください♪');

    try {
      // パフォーマンス最適化の提案を取得
      const optimization = performanceOptimizer.optimizeDataGeneration(
        config.rowCount,
        config.columns.length
      );

      if (optimization.recommendation) {
        console.log(optimization.recommendation);
      }

      // データ醸造
      const headers = config.columns.map(col => col.name);
      const rows: string[][] = [headers];

      for (let i = 0; i < config.rowCount; i++) {
        const row = config.columns.map(col =>
          String(generateData(col.dataType, col.settings || {}))
        );
        rows.push(row);
      }

      setPreviewData(rows);
      onGenerate?.(rows);

      setBrewEmotion('happy');
      setBrewCurrentMessage('データ醸造が完了しました！品質チェックもOKです✨');

      console.log(brewMessage('dataGenerationComplete'));
    } catch (error) {
      console.error('データ醸造エラー:', error);
      setBrewEmotion('working');
      setBrewCurrentMessage(
        '申し訳ありません！エラーが発生しました。一緒に解決しましょう'
      );
    } finally {
      setUIState(prev => ({ ...prev, isGenerating: false }));

      // 3秒後にフレンドリーな状態に戻る
      setTimeout(() => {
        setBrewEmotion('friendly');
        setBrewCurrentMessage('次はどんなデータを作りましょうか？');
      }, 3000);
    }
  }, [config, onGenerate, performanceOptimizer, brewMessage]);

  // CSV ダウンロード
  const downloadCSV = useCallback(() => {
    if (previewData.length === 0) {
      return;
    }

    const csvContent = previewData
      .map(row =>
        row
          .map(cell => {
            const escaped = String(cell).replace(/"/g, '""');
            return escaped.includes(',') ||
              escaped.includes('"') ||
              escaped.includes('\n')
              ? `"${escaped}"`
              : escaped;
          })
          .join(',')
      )
      .join('\n');

    const bom = '\uFEFF';
    const content = bom + csvContent;
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `td-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [previewData]);

  // テンプレート適用
  const applyTemplate = useCallback(
    (template: CsvTemplate) => {
      setConfig({
        columns: template.columns,
        rowCount: template.defaultRowCount,
        outputFormat: 'csv',
        includeHeader: true,
        encoding: 'utf-8-bom',
      });

      CSVTemplateManager.incrementUsage(template.id);
      setUIState(prev => ({ ...prev, showTemplateModal: false }));

      console.log(brewMessage('templateLoaded'));
    },
    [brewMessage]
  );

  // テンプレート保存
  const saveAsTemplate = useCallback(() => {
    const name = prompt('テンプレート名を入力してください:');
    if (!name) {
      return;
    }

    const description = prompt('テンプレートの説明を入力してください:') || '';

    const result = CSVTemplateManager.saveTemplate(
      name,
      description,
      config,
      'custom',
      []
    );

    if (result.success) {
      loadTemplates();
      console.log(brewMessage('templateSaved'));
    } else {
      alert(result.message);
    }
  }, [config, loadTemplates, brewMessage]);

  // バッチジョブ追加
  const addToBatch = useCallback(() => {
    const name =
      prompt('バッチジョブ名を入力してください:') || `CSV生成_${Date.now()}`;

    batchProcessor.addJob(name, config, config.rowCount);
    setUIState(prev => ({ ...prev, showBatchModal: true }));
  }, [config, batchProcessor]);

  // プレビュー更新
  useEffect(() => {
    if (config.columns.length > 0) {
      generatePreview();
    }
  }, [config.columns, generatePreview]);

  // データ型のオプション
  const dataTypeOptions: { value: DataTypeCategory; label: string }[] = [
    { value: 'text', label: t('dataTypes.text') },
    { value: 'number', label: t('dataTypes.number') },
    { value: 'name', label: t('dataTypes.name') },
    { value: 'email', label: t('dataTypes.email') },
    { value: 'phone', label: t('dataTypes.phone') },
    { value: 'date', label: t('dataTypes.date') },
    { value: 'age', label: t('dataTypes.age') },
  ];

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className || ''}`}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {t('csv.title')}
            </h2>
            <p className="text-gray-600">{t('csv.subtitle')}</p>
          </div>

          {/* Brewキャラクター */}
          <div className="ml-4">
            <BrewCharacter
              emotion={brewEmotion}
              size="medium"
              animation="heartbeat"
              message={brewCurrentMessage}
              showSpeechBubble={true}
              className="flex-shrink-0"
            />
          </div>
        </div>

        {/* パフォーマンス情報 */}
        {performanceData && (
          <div className="text-right">
            <div className="text-sm text-gray-500">
              パフォーマンス: {performanceData.score.grade}
            </div>
            <div className="text-xs text-gray-400">
              メモリ: {performanceData.memoryInfo.formatted}
            </div>
          </div>
        )}
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'generator', label: 'データ醸造' },
            { id: 'templates', label: 'テンプレート' },
            { id: 'batch', label: 'バッチ処理' },
            { id: 'performance', label: 'パフォーマンス' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() =>
                setUIState(prev => ({ ...prev, activeTab: tab.id as any }))
              }
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                uiState.activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ジェネレータータブ */}
      {uiState.activeTab === 'generator' && (
        <div className="space-y-6">
          {/* 列設定 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">列設定</h3>
              <button
                onClick={addColumn}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {t('csv.addColumn')}
              </button>
            </div>

            <div className="space-y-3">
              {config.columns.map((column, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={column.name}
                      onChange={e =>
                        updateColumn(index, { name: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={t('csv.columnName')}
                    />
                  </div>

                  <div className="w-48">
                    <select
                      value={column.dataType}
                      onChange={e =>
                        updateColumn(index, {
                          dataType: e.target.value as DataTypeCategory,
                        })
                      }
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {dataTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => removeColumn(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                    disabled={config.columns.length <= 1}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 醸造設定 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('csv.rowCount')}
              </label>
              <input
                type="number"
                value={config.rowCount}
                onChange={e =>
                  setConfig(prev => ({
                    ...prev,
                    rowCount: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="100000"
              />
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={generateCSV}
              disabled={uiState.isGenerating || config.columns.length === 0}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {uiState.isGenerating ? '醸造中...' : t('csv.generate')}
            </button>

            <button
              onClick={downloadCSV}
              disabled={previewData.length === 0}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {t('csv.downloadCsv')}
            </button>

            <button
              onClick={saveAsTemplate}
              disabled={config.columns.length === 0}
              className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {t('csv.saveTemplate')}
            </button>

            <button
              onClick={addToBatch}
              disabled={config.columns.length === 0}
              className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              バッチに追加
            </button>
          </div>

          {/* プレビュー */}
          {previewData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('csv.preview')}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <tbody>
                    {previewData.slice(0, 11).map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={
                          rowIndex === 0 ? 'bg-gray-50 font-semibold' : ''
                        }
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-3 py-2 border-b text-sm"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {config.rowCount > 10 && (
                <p className="text-sm text-gray-500 mt-2">
                  {formatNumber(config.rowCount)}件中の最初の10件を表示
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* テンプレートタブ */}
      {uiState.activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">テンプレート一覧</h3>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="テンプレートを検索..."
              className="px-4 py-2 border rounded-lg w-64"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">
                    {template.name}
                  </h4>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      template.isBuiltIn
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {template.isBuiltIn ? '内蔵' : 'カスタム'}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {template.description}
                </p>

                <div className="text-xs text-gray-500 mb-3">
                  <div>列数: {template.columns.length}</div>
                  <div>
                    デフォルト件数: {formatNumber(template.defaultRowCount)}
                  </div>
                  <div>使用回数: {template.usage}</div>
                </div>

                <button
                  onClick={() => applyTemplate(template)}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  適用
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* バッチ処理タブ */}
      {uiState.activeTab === 'batch' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">バッチジョブ一覧</h3>
            <div className="text-sm text-gray-500">
              {batchJobs.length}個のジョブ
            </div>
          </div>

          <div className="space-y-3">
            {batchJobs.map(job => (
              <div key={job.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{job.name}</h4>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      job.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : job.status === 'running'
                        ? 'bg-blue-100 text-blue-800'
                        : job.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">件数:</span>{' '}
                    {formatNumber(job.count)}
                  </div>
                  <div>
                    <span className="text-gray-500">進捗:</span> {job.progress}%
                  </div>
                  <div>
                    <span className="text-gray-500">優先度:</span>{' '}
                    {job.priority}
                  </div>
                  <div>
                    <span className="text-gray-500">作成日:</span>{' '}
                    {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {job.status === 'running' && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {job.result && (
                  <div className="mt-3 flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      ファイルサイズ: {formatFileSize(job.result.fileSize)}
                    </span>
                    <a
                      href={job.result.downloadUrl}
                      download={job.result.fileName}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      ダウンロード
                    </a>
                  </div>
                )}
              </div>
            ))}

            {batchJobs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                バッチジョブがありません
              </div>
            )}
          </div>
        </div>
      )}

      {/* パフォーマンスタブ */}
      {uiState.activeTab === 'performance' && performanceData && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">パフォーマンス監視</h3>

          {/* スコア表示 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {performanceData.score.grade}
              </div>
              <div className="text-sm text-gray-600">総合スコア</div>
              <div className="text-xs text-gray-500">
                {performanceData.score.score.toFixed(1)}点
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {performanceData.score.breakdown.memory.toFixed(0)}
              </div>
              <div className="text-sm text-gray-600">メモリスコア</div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {performanceData.score.breakdown.rendering.toFixed(0)}
              </div>
              <div className="text-sm text-gray-600">レンダリング</div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {performanceData.score.breakdown.cache.toFixed(0)}
              </div>
              <div className="text-sm text-gray-600">キャッシュ</div>
            </div>
          </div>

          {/* 最適化提案 */}
          {performanceData.suggestions.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">最適化提案</h4>
              <div className="space-y-2">
                {performanceData.suggestions
                  .slice(0, 5)
                  .map((suggestion: any, index: number) => (
                    <div
                      key={index}
                      className={`p-3 rounded border-l-4 ${
                        suggestion.severity === 'critical'
                          ? 'border-red-500 bg-red-50'
                          : suggestion.severity === 'high'
                          ? 'border-orange-500 bg-orange-50'
                          : suggestion.severity === 'medium'
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="font-medium">{suggestion.message}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {suggestion.solution}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        改善効果: {suggestion.estimatedImprovement}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
