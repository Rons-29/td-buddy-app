/**
 * 改良版CSV詳細データ生成コンポーネント
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
      'csv.title': 'CSV詳細データ生成',
      'csv.subtitle': 'テストデータ生成ツール',
      'csv.addColumn': '列を追加',
      'csv.columnName': '列名',
      'csv.generate': 'データ生成',
      'csv.downloadCsv': 'CSVダウンロード',
      'csv.saveTemplate': 'テンプレート保存',
      'csv.preview': 'プレビュー',
      'csv.rowCount': '行数',
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

  // データタイプオプション
  const dataTypeOptions = useMemo(
    () => [
      { value: 'text', label: t('dataTypes.text') },
      { value: 'number', label: t('dataTypes.number') },
      { value: 'name', label: t('dataTypes.name') },
      { value: 'email', label: t('dataTypes.email') },
      { value: 'phone', label: t('dataTypes.phone') },
      { value: 'date', label: t('dataTypes.date') },
      { value: 'age', label: t('dataTypes.age') },
    ],
    [t]
  );

  // CSV生成
  const generateCSV = useCallback(async () => {
    if (config.columns.length === 0) return;

    setUIState(prev => ({ ...prev, isGenerating: true }));
    setBrewEmotion('working');
    setBrewCurrentMessage('CSV データを生成中です...');

    try {
      // モックデータ生成
      const headers = config.columns.map(col => col.name);
      const rows: string[][] = [headers];

      for (let i = 0; i < config.rowCount; i++) {
        const row = config.columns.map(col => {
          switch (col.dataType) {
            case 'name':
              return `田中 太郎${i + 1}`;
            case 'email':
              return `user${i + 1}@example.com`;
            case 'phone':
              return `090-1234-${String(5678 + i).padStart(4, '0')}`;
            case 'number':
              return String(Math.floor(Math.random() * 1000));
            case 'age':
              return String(20 + Math.floor(Math.random() * 60));
            case 'date':
              return new Date().toISOString().split('T')[0];
            default:
              return `サンプルテキスト${i + 1}`;
          }
        });
        rows.push(row);
      }

      setPreviewData(rows);
      onGenerate?.(rows);

      setBrewEmotion('excited');
      setBrewCurrentMessage(
        `${formatNumber(rows.length - 1)}行のCSVデータを生成しました！`
      );
    } catch (error) {
      console.error('CSV生成エラー:', error);
      setBrewEmotion('friendly');
      setBrewCurrentMessage('生成に失敗しました。設定を確認してください。');
    } finally {
      setUIState(prev => ({ ...prev, isGenerating: false }));
    }
  }, [config, onGenerate, formatNumber]);

  // CSV ダウンロード
  const downloadCSV = useCallback(() => {
    if (previewData.length === 0) return;

    const csvContent = previewData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `generated_data_${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setBrewEmotion('happy');
    setBrewCurrentMessage('CSVファイルをダウンロードしました！');
  }, [previewData]);

  // テンプレート保存
  const saveAsTemplate = useCallback(() => {
    if (config.columns.length === 0) return;

    const templateName = prompt('テンプレート名を入力してください:');
    if (!templateName) return;

    const template: CsvTemplate = {
      id: `template_${Date.now()}`,
      name: templateName,
      description: `${config.columns.length}列のカスタムテンプレート`,
      columns: config.columns,
      defaultRowCount: config.rowCount,
      tags: ['カスタム'],
      category: 'custom',
      isBuiltIn: false,
      usage: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // テンプレート保存の簡易実装
    try {
      const existingTemplates = JSON.parse(
        localStorage.getItem('csvTemplates') || '[]'
      );
      existingTemplates.push(template);
      localStorage.setItem('csvTemplates', JSON.stringify(existingTemplates));
    } catch (error) {
      console.error('テンプレート保存エラー:', error);
    }
    loadTemplates();

    setBrewEmotion('happy');
    setBrewCurrentMessage(`テンプレート「${templateName}」を保存しました！`);
  }, [config, loadTemplates]);

  // テンプレート適用
  const applyTemplate = useCallback(
    (template: CsvTemplate) => {
      setConfig(prev => ({
        ...prev,
        columns: template.columns,
        rowCount: template.defaultRowCount,
      }));

      // 使用回数増加の簡易実装
      try {
        const existingTemplates = JSON.parse(
          localStorage.getItem('csvTemplates') || '[]'
        );
        const updatedTemplates = existingTemplates.map((t: any) =>
          t.id === template.id ? { ...t, usage: t.usage + 1 } : t
        );
        localStorage.setItem('csvTemplates', JSON.stringify(updatedTemplates));
      } catch (error) {
        console.error('使用回数更新エラー:', error);
      }
      loadTemplates();

      setBrewEmotion('excited');
      setBrewCurrentMessage(`テンプレート「${template.name}」を適用しました！`);
    },
    [loadTemplates]
  );

  // バッチに追加
  const addToBatch = useCallback(() => {
    if (config.columns.length === 0) return;

    const jobName = prompt('バッチジョブ名を入力してください:');
    if (!jobName) return;

    // バッチジョブ追加の簡易実装
    try {
      const job = {
        id: `job_${Date.now()}`,
        name: jobName,
        config,
        status: 'pending' as const,
        progress: 0,
        count: config.rowCount,
        priority: 'normal' as const,
        createdAt: Date.now(),
        result: null,
      };

      const existingJobs = JSON.parse(
        localStorage.getItem('csvBatchJobs') || '[]'
      );
      existingJobs.push(job);
      localStorage.setItem('csvBatchJobs', JSON.stringify(existingJobs));
    } catch (error) {
      console.error('バッチジョブ追加エラー:', error);
    }

    setBrewEmotion('excited');
    setBrewCurrentMessage(`バッチジョブ「${jobName}」を追加しました！`);
  }, [config, batchProcessor]);

  return (
    <div className="space-y-6">
      {/* ワークベンチヘッダー */}
      <div className="wb-workbench-header">
        <div className="flex items-center justify-center space-x-4">
          <div className="p-3 bg-wb-tool-measure-500 rounded-full shadow-lg">
            <span className="text-2xl text-white">📏</span>
          </div>
          <div className="text-center">
            <h1 className="wb-tool-title text-wb-wood-800">📏 CSV生成工具</h1>
            <p className="wb-tool-description text-wb-wood-600">
              構造化されたCSVデータを精密に生成・計測・分析します
            </p>
          </div>
        </div>
      </div>

      {/* Brewキャラクターセクション */}
      <div className="wb-character-section">
        <BrewCharacter
          emotion={brewEmotion}
          size="large"
          animation="heartbeat"
          message={brewCurrentMessage}
          showSpeechBubble={true}
        />
      </div>

      {/* パフォーマンス情報 */}
      {performanceData && (
        <div className="wb-tool-panel">
          <div className="wb-tool-panel-header">
            <h3 className="wb-tool-panel-title">パフォーマンス監視</h3>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-wb-wood-600">
              スコア: {performanceData.score.grade}
            </span>
            <span className="text-wb-wood-600">
              メモリ: {performanceData.memoryInfo.formatted}
            </span>
          </div>
        </div>
      )}

      {/* タブナビゲーション */}
      <div className="wb-tool-panel wb-tool-measure">
        <div className="border-b border-wb-wood-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'generator', label: 'データ生成' },
              { id: 'templates', label: 'テンプレート' },
              { id: 'batch', label: 'バッチ処理' },
              { id: 'performance', label: 'パフォーマンス' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() =>
                  setUIState(prev => ({ ...prev, activeTab: tab.id as any }))
                }
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  uiState.activeTab === tab.id
                    ? 'border-wb-tool-measure-500 text-wb-tool-measure-600'
                    : 'border-transparent text-wb-wood-500 hover:text-wb-wood-700 hover:border-wb-wood-300'
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
            <div className="wb-tool-control">
              <div className="flex items-center justify-between mb-4">
                <label className="wb-tool-label">列設定</label>
                <button
                  onClick={addColumn}
                  className="wb-action-button wb-action-primary"
                >
                  📏 {t('csv.addColumn')}
                </button>
              </div>

              <div className="space-y-3">
                {config.columns.map((column, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-white border border-wb-wood-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        value={column.name}
                        onChange={e =>
                          updateColumn(index, { name: e.target.value })
                        }
                        className="wb-text-input w-full"
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
                        className="wb-select w-full"
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
                      className="text-wb-tool-cut-500 hover:text-wb-tool-cut-700 p-2 transition-colors"
                      disabled={config.columns.length <= 1}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 生成設定 */}
            <div className="wb-tool-control">
              <label className="wb-tool-label">{t('csv.rowCount')}</label>
              <input
                type="number"
                value={config.rowCount}
                onChange={e =>
                  setConfig(prev => ({
                    ...prev,
                    rowCount: parseInt(e.target.value) || 0,
                  }))
                }
                className="wb-number-input w-32"
                min="1"
                max="100000"
              />
              <span className="wb-unit-label">行 (最大100,000行)</span>
            </div>

            {/* アクションボタン */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={generateCSV}
                disabled={uiState.isGenerating || config.columns.length === 0}
                className="wb-action-button wb-action-primary"
              >
                {uiState.isGenerating
                  ? '📏 生成中...'
                  : `📏 ${t('csv.generate')}`}
              </button>

              <button
                onClick={downloadCSV}
                disabled={previewData.length === 0}
                className="wb-action-button wb-action-secondary"
              >
                💾 {t('csv.downloadCsv')}
              </button>

              <button
                onClick={saveAsTemplate}
                disabled={config.columns.length === 0}
                className="wb-action-button wb-action-secondary"
              >
                📋 {t('csv.saveTemplate')}
              </button>

              <button
                onClick={addToBatch}
                disabled={config.columns.length === 0}
                className="wb-action-button wb-action-secondary"
              >
                ⚡ バッチに追加
              </button>
            </div>

            {/* プレビュー */}
            {previewData.length > 0 && (
              <div className="wb-result-panel">
                <div className="wb-result-header">
                  <div className="wb-result-title-section">
                    <h3 className="wb-result-title">{t('csv.preview')}</h3>
                    <p className="wb-result-subtitle">
                      {previewData.length - 1}行のデータ
                    </p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-wb-wood-300">
                    <tbody>
                      {previewData.slice(0, 11).map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className={
                            rowIndex === 0
                              ? 'bg-wb-wood-50 font-semibold'
                              : 'hover:bg-wb-wood-25'
                          }
                        >
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-3 py-2 border-b border-wb-wood-200 text-sm text-wb-wood-700"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {previewData.length > 11 && (
                  <div className="wb-result-metadata">
                    <span className="wb-result-timestamp">
                      他 {previewData.length - 11} 行のデータがあります
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* テンプレートタブ */}
        {uiState.activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="wb-tool-panel-title">テンプレート一覧</h3>
              <input
                type="text"
                placeholder="テンプレートを検索..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="wb-text-input w-64"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  className="p-4 bg-white border border-wb-wood-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-wb-wood-800">
                      {template.name}
                    </h4>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        template.isBuiltIn
                          ? 'bg-wb-tool-measure-100 text-wb-tool-measure-800'
                          : 'bg-wb-tool-join-100 text-wb-tool-join-800'
                      }`}
                    >
                      {template.isBuiltIn ? '内蔵' : 'カスタム'}
                    </span>
                  </div>

                  <p className="text-sm text-wb-wood-600 mb-3">
                    {template.description}
                  </p>

                  <div className="text-xs text-wb-wood-500 mb-3">
                    <div>列数: {template.columns.length}</div>
                    <div>
                      デフォルト件数: {formatNumber(template.defaultRowCount)}
                    </div>
                    <div>使用回数: {template.usage}</div>
                  </div>

                  <button
                    onClick={() => applyTemplate(template)}
                    className="w-full wb-action-button wb-action-primary"
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
              <h3 className="wb-tool-panel-title">バッチジョブ一覧</h3>
              <div className="text-sm text-wb-wood-500">
                {batchJobs.length}個のジョブ
              </div>
            </div>

            <div className="space-y-3">
              {batchJobs.map(job => (
                <div
                  key={job.id}
                  className="p-4 bg-white border border-wb-wood-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-wb-wood-800">
                      {job.name}
                    </h4>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        job.status === 'completed'
                          ? 'bg-wb-tool-join-100 text-wb-tool-join-800'
                          : job.status === 'running'
                          ? 'bg-wb-tool-measure-100 text-wb-tool-measure-800'
                          : job.status === 'failed'
                          ? 'bg-wb-tool-cut-100 text-wb-tool-cut-800'
                          : 'bg-wb-wood-100 text-wb-wood-800'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-wb-wood-500">件数:</span>{' '}
                      {formatNumber(job.count)}
                    </div>
                    <div>
                      <span className="text-wb-wood-500">進捗:</span>{' '}
                      {job.progress}%
                    </div>
                    <div>
                      <span className="text-wb-wood-500">優先度:</span>{' '}
                      {job.priority}
                    </div>
                    <div>
                      <span className="text-wb-wood-500">作成日:</span>{' '}
                      {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {job.status === 'running' && (
                    <div className="mt-3">
                      <div className="w-full bg-wb-wood-200 rounded-full h-2">
                        <div
                          className="bg-wb-tool-measure-600 h-2 rounded-full transition-all"
                          style={{ width: `${job.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {job.result && (
                    <div className="mt-3 flex items-center space-x-4">
                      <span className="text-sm text-wb-wood-500">
                        ファイルサイズ: {formatFileSize(job.result.fileSize)}
                      </span>
                      <a
                        href={job.result.downloadUrl}
                        download={job.result.fileName}
                        className="text-wb-tool-measure-500 hover:text-wb-tool-measure-700 text-sm transition-colors"
                      >
                        ダウンロード
                      </a>
                    </div>
                  )}
                </div>
              ))}

              {batchJobs.length === 0 && (
                <div className="text-center py-8 text-wb-wood-500">
                  バッチジョブがありません
                </div>
              )}
            </div>
          </div>
        )}

        {/* パフォーマンスタブ */}
        {uiState.activeTab === 'performance' && performanceData && (
          <div className="space-y-6">
            <h3 className="wb-tool-panel-title">パフォーマンス監視</h3>

            {/* スコア表示 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-wb-tool-measure-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-wb-tool-measure-600">
                  {performanceData.score.grade}
                </div>
                <div className="text-sm text-wb-wood-600">総合スコア</div>
                <div className="text-xs text-wb-wood-500">
                  {performanceData.score.score.toFixed(1)}点
                </div>
              </div>

              <div className="bg-wb-tool-join-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-wb-tool-join-600">
                  {performanceData.score.breakdown.memory.toFixed(0)}
                </div>
                <div className="text-sm text-wb-wood-600">メモリスコア</div>
              </div>

              <div className="bg-wb-tool-polish-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-wb-tool-polish-600">
                  {performanceData.score.breakdown.rendering.toFixed(0)}
                </div>
                <div className="text-sm text-wb-wood-600">レンダリング</div>
              </div>

              <div className="bg-wb-tool-inspect-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-wb-tool-inspect-600">
                  {performanceData.score.breakdown.cache.toFixed(0)}
                </div>
                <div className="text-sm text-wb-wood-600">キャッシュ</div>
              </div>
            </div>

            {/* 最適化提案 */}
            {performanceData.suggestions.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-wb-wood-800">
                  最適化提案
                </h4>
                <div className="space-y-2">
                  {performanceData.suggestions
                    .slice(0, 5)
                    .map((suggestion: any, index: number) => (
                      <div
                        key={index}
                        className={`p-3 rounded border-l-4 ${
                          suggestion.severity === 'critical'
                            ? 'border-wb-tool-cut-500 bg-wb-tool-cut-50'
                            : suggestion.severity === 'high'
                            ? 'border-wb-tool-polish-500 bg-wb-tool-polish-50'
                            : suggestion.severity === 'medium'
                            ? 'border-wb-tool-measure-500 bg-wb-tool-measure-50'
                            : 'border-wb-tool-inspect-500 bg-wb-tool-inspect-50'
                        }`}
                      >
                        <div className="font-medium text-wb-wood-800">
                          {suggestion.message}
                        </div>
                        <div className="text-sm text-wb-wood-600 mt-1">
                          {suggestion.solution}
                        </div>
                        <div className="text-xs text-wb-wood-500 mt-1">
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
    </div>
  );
}
