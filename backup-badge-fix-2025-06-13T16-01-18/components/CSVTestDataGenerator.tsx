'use client';

import {
  Database,
  Download,
  FileText,
  GripVertical,
  Plus,
  Target,
  Trash2,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { csvPresets, getPresetById } from '../data/csvPresets';
import BrewCharacter from './BrewCharacter';
import { Button } from './ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/Card';

// 型定義
export interface CSVColumn {
  id: string;
  name: string;
  dataType: // Name系
  | 'firstName'
    | 'lastName'
    | 'fullName'
    // Address系
    | 'country'
    | 'state'
    | 'city'
    | 'street'
    | 'zipCode'
    // Number系
    | 'randomNumber'
    | 'phoneNumber'
    // Internet系
    | 'email'
    | 'username'
    | 'domainName'
    | 'ipAddress'
    // Text系
    | 'words'
    | 'sentences'
    | 'paragraphs'
    // Utilities系
    | 'autoIncrement'
    | 'dateTime'
    | 'date'
    | 'time'
    | 'md5Hash'
    // Legacy (既存との互換性)
    | 'text'
    | 'number'
    | 'phone'
    | 'custom';
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

// データタイプのカテゴリ分け
export const DATA_TYPE_CATEGORIES = {
  name: {
    label: 'Name',
    emoji: '👤',
    types: [
      { value: 'firstName', label: 'First Name', description: '名前（名）' },
      { value: 'lastName', label: 'Last Name', description: '名前（姓）' },
      { value: 'fullName', label: 'Full Name', description: 'フルネーム' },
    ],
  },
  address: {
    label: 'Address',
    emoji: '🏠',
    types: [
      { value: 'country', label: 'Country', description: '国名' },
      { value: 'state', label: 'State', description: '都道府県' },
      { value: 'city', label: 'City', description: '市区町村' },
      { value: 'street', label: 'Street', description: '番地・町名' },
      { value: 'zipCode', label: 'Zip Code', description: '郵便番号' },
    ],
  },
  number: {
    label: 'Number',
    emoji: '🔢',
    types: [
      {
        value: 'randomNumber',
        label: 'Random Number',
        description: 'ランダム数値',
      },
      { value: 'phoneNumber', label: 'Phone Number', description: '電話番号' },
    ],
  },
  internet: {
    label: 'Internet',
    emoji: '🌐',
    types: [
      { value: 'email', label: 'Email', description: 'メールアドレス' },
      { value: 'username', label: 'Username', description: 'ユーザー名' },
      { value: 'domainName', label: 'Domain Name', description: 'ドメイン名' },
      { value: 'ipAddress', label: 'IP Address', description: 'IPアドレス' },
    ],
  },
  text: {
    label: 'Text',
    emoji: '📝',
    types: [
      { value: 'words', label: 'Words', description: '単語' },
      { value: 'sentences', label: 'Sentences', description: '文章' },
      { value: 'paragraphs', label: 'Paragraphs', description: '段落' },
    ],
  },
  utilities: {
    label: 'Utilities',
    emoji: '⚙️',
    types: [
      { value: 'autoIncrement', label: 'Auto-increment', description: '連番' },
      { value: 'dateTime', label: 'DateTime', description: '日時' },
      { value: 'date', label: 'Date', description: '日付' },
      { value: 'time', label: 'Time', description: '時刻' },
      { value: 'md5Hash', label: 'MD5 Hash', description: 'MD5ハッシュ' },
    ],
  },
} as const;

const CSVTestDataGenerator: React.FC = () => {
  // State管理
  const [columns, setColumns] = useState<CSVColumn[]>([]);
  const [rows, setRows] = useState<CSVRow[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rowCount, setRowCount] = useState<number>(100);
  const [outputFormat, setOutputFormat] = useState<'csv' | 'json' | 'tsv'>(
    'csv'
  );
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    encoding: 'utf-8-bom',
    delimiter: ',',
    includeHeader: true,
    filename: 'test_data',
  });

  // モーダル状態
  const [showPresetManager, setShowPresetManager] = useState(false);
  const [showDataTable, setShowDataTable] = useState(false);

  // プリセット関連状態
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  // ドラッグ&ドロップ状態
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  // Brewキャラクター状態
  const [brewMessage, setBrewMessage] = useState(
    'CSVテスト用データ生成の準備完了です！カラムを追加またはプリセットを選択してください♪'
  );

  // Brewキャラクター状態を追加
  const [brewMood, setBrewMood] = useState<string>('happy');

  // データ生成用の基本データ
  const JAPANESE_DATA = {
    lastNames: [
      '佐藤',
      '鈴木',
      '高橋',
      '田中',
      '渡辺',
      '伊藤',
      '山本',
      '中村',
      '小林',
      '加藤',
    ],
    firstNames: [
      '太郎',
      '次郎',
      '花子',
      '美咲',
      '翔太',
      '優子',
      '健太',
      '真理',
      '涼子',
      '大輔',
    ],
    companies: [
      '株式会社サンプル',
      'テストコーポレーション',
      '例示商事',
      'ダミー技研',
      'テスト工業',
    ],
    prefectures: [
      '東京都',
      '大阪府',
      '神奈川県',
      '愛知県',
      '埼玉県',
      '千葉県',
      '兵庫県',
      '北海道',
      '福岡県',
      '静岡県',
    ],
    cities: [
      '千代田区',
      '中央区',
      '港区',
      '新宿区',
      '文京区',
      '台東区',
      '墨田区',
      '江東区',
      '品川区',
      '目黒区',
    ],
    words: [
      'テスト',
      'サンプル',
      'データ',
      '例示',
      'ダミー',
      '検証',
      '確認',
      '実験',
      '試作',
      '模擬',
    ],
    domains: [
      'example.com',
      'test.co.jp',
      'sample.org',
      'dummy.net',
      'mock.jp',
    ],
  };

  // 自動インクリメント用の参照
  const autoIncrementRefs = new Map<string, number>();

  // プリセット適用
  const applyPreset = useCallback((presetId: string) => {
    const preset = getPresetById(presetId);
    if (!preset) {
      setBrewMessage('プリセットが見つかりませんでした');
      return;
    }

    const newColumns: CSVColumn[] = preset.columns.map((col, index) => ({
      id: `preset_col_${Date.now()}_${index}`,
      name: col.name,
      dataType: col.dataType,
      customPattern: col.customPattern,
      required: col.required,
      order: index,
    }));

    setColumns(newColumns);
    setSelectedPresetId(presetId);
    setShowPresetManager(false);
    setBrewMessage(
      `${preset.name}プリセットを適用しました！${preset.brewMessage}`
    );
  }, []);

  // フィルタされたプリセット
  const filteredPresets = csvPresets.filter(
    preset => selectedCategory === 'all' || preset.category === selectedCategory
  );

  // カラム追加
  const addColumn = useCallback(() => {
    const newColumn: CSVColumn = {
      id: `col_${Date.now()}`,
      name: `column_${columns.length + 1}`,
      dataType: 'text',
      required: true,
      order: columns.length,
    };
    setColumns(prev => [...prev, newColumn]);
    setBrewMessage(
      '新しいカラムを追加しました！データタイプを選択してくださいね♪'
    );
  }, [columns.length]);

  // カラム削除
  const deleteColumn = useCallback(
    (columnId: string) => {
      const updatedColumns = columns.filter(col => col.id !== columnId);
      setColumns(updatedColumns);
      setBrewMessage('カラムを削除しました');
    },
    [columns]
  );

  // カラム更新
  const updateColumn = useCallback(
    (columnId: string, updates: Partial<CSVColumn>) => {
      setColumns(prev =>
        prev.map(col => (col.id === columnId ? { ...col, ...updates } : col))
      );
    },
    []
  );

  // ドラッグ&ドロップ処理
  const handleDragStart = useCallback(
    (e: React.DragEvent, columnId: string) => {
      setDraggedColumnId(columnId);
      e.dataTransfer.effectAllowed = 'move';
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setDraggedColumnId(null);
    setDragOverColumnId(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumnId(columnId);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetColumnId: string) => {
      e.preventDefault();

      if (!draggedColumnId || draggedColumnId === targetColumnId) {
        return;
      }

      const sortedColumns = [...columns].sort((a, b) => a.order - b.order);
      const draggedIndex = sortedColumns.findIndex(
        col => col.id === draggedColumnId
      );
      const targetIndex = sortedColumns.findIndex(
        col => col.id === targetColumnId
      );

      if (draggedIndex === -1 || targetIndex === -1) {
        return;
      }

      // カラムの順序を再配置
      const newColumns = [...sortedColumns];
      const [draggedColumn] = newColumns.splice(draggedIndex, 1);
      newColumns.splice(targetIndex, 0, draggedColumn);

      // order を再設定
      const updatedColumns = newColumns.map((col, index) => ({
        ...col,
        order: index,
      }));

      setColumns(updatedColumns);
      setBrewMessage('カラムの順序を変更しました');
    },
    [draggedColumnId, columns]
  );

  // データ生成
  const generateData = useCallback(() => {
    if (columns.length === 0) {
      setBrewMessage('まずカラムを定義またはプリセットを選択してください');
      return;
    }

    setIsGenerating(true);
    setBrewMessage(`${rowCount}件のテストデータを生成中...`);

    // 自動インクリメントカウンターをリセット
    autoIncrementRefs.clear();

    // 改良されたダミーデータ生成
    const generatedRows: CSVRow[] = [];
    for (let i = 0; i < rowCount; i++) {
      const rowData: Record<string, any> = {};
      columns.forEach(col => {
        switch (col.dataType) {
          // Name系
          case 'firstName':
            rowData[col.id] =
              JAPANESE_DATA.firstNames[
                Math.floor(Math.random() * JAPANESE_DATA.firstNames.length)
              ];
            break;
          case 'lastName':
            rowData[col.id] =
              JAPANESE_DATA.lastNames[
                Math.floor(Math.random() * JAPANESE_DATA.lastNames.length)
              ];
            break;
          case 'fullName':
            const lastName =
              JAPANESE_DATA.lastNames[
                Math.floor(Math.random() * JAPANESE_DATA.lastNames.length)
              ];
            const firstName =
              JAPANESE_DATA.firstNames[
                Math.floor(Math.random() * JAPANESE_DATA.firstNames.length)
              ];
            rowData[col.id] = `${lastName} ${firstName}`;
            break;

          // Address系
          case 'country':
            const countries = [
              '日本',
              'アメリカ',
              'イギリス',
              'ドイツ',
              'フランス',
              '韓国',
              '中国',
              'オーストラリア',
            ];
            rowData[col.id] =
              countries[Math.floor(Math.random() * countries.length)];
            break;
          case 'state':
            rowData[col.id] =
              JAPANESE_DATA.prefectures[
                Math.floor(Math.random() * JAPANESE_DATA.prefectures.length)
              ];
            break;
          case 'city':
            rowData[col.id] =
              JAPANESE_DATA.cities[
                Math.floor(Math.random() * JAPANESE_DATA.cities.length)
              ];
            break;
          case 'street':
            const streetNum = Math.floor(Math.random() * 999) + 1;
            const chome = Math.floor(Math.random() * 9) + 1;
            const ban = Math.floor(Math.random() * 99) + 1;
            rowData[col.id] = `${chome}-${ban}-${streetNum}`;
            break;
          case 'zipCode':
            const zip1 = String(Math.floor(Math.random() * 900) + 100);
            const zip2 = String(Math.floor(Math.random() * 9000) + 1000);
            rowData[col.id] = `${zip1}-${zip2}`;
            break;

          // Number系
          case 'randomNumber':
            rowData[col.id] = Math.floor(Math.random() * 100000);
            break;
          case 'phoneNumber':
            const phoneType = Math.random() > 0.5 ? '090' : '080';
            const phone1 = String(Math.floor(Math.random() * 9000) + 1000);
            const phone2 = String(Math.floor(Math.random() * 9000) + 1000);
            rowData[col.id] = `${phoneType}-${phone1}-${phone2}`;
            break;

          // Internet系
          case 'email':
            const username = `user${i + 1}`;
            const domain =
              JAPANESE_DATA.domains[
                Math.floor(Math.random() * JAPANESE_DATA.domains.length)
              ];
            rowData[col.id] = `${username}@${domain}`;
            break;
          case 'username':
            rowData[col.id] = `user_${String(i + 1).padStart(4, '0')}`;
            break;
          case 'domainName':
            rowData[col.id] =
              JAPANESE_DATA.domains[
                Math.floor(Math.random() * JAPANESE_DATA.domains.length)
              ];
            break;
          case 'ipAddress':
            const ip = [
              Math.floor(Math.random() * 255),
              Math.floor(Math.random() * 255),
              Math.floor(Math.random() * 255),
              Math.floor(Math.random() * 255),
            ];
            rowData[col.id] = ip.join('.');
            break;

          // Text系
          case 'words':
            const wordCount = Math.floor(Math.random() * 3) + 1;
            const selectedWords = [];
            for (let j = 0; j < wordCount; j++) {
              selectedWords.push(
                JAPANESE_DATA.words[
                  Math.floor(Math.random() * JAPANESE_DATA.words.length)
                ]
              );
            }
            rowData[col.id] = selectedWords.join(' ');
            break;
          case 'sentences':
            const sentenceCount = Math.floor(Math.random() * 2) + 1;
            const sentences = [];
            for (let j = 0; j < sentenceCount; j++) {
              const word1 =
                JAPANESE_DATA.words[
                  Math.floor(Math.random() * JAPANESE_DATA.words.length)
                ];
              const word2 =
                JAPANESE_DATA.words[
                  Math.floor(Math.random() * JAPANESE_DATA.words.length)
                ];
              sentences.push(`${word1}の${word2}を実行しました。`);
            }
            rowData[col.id] = sentences.join(' ');
            break;
          case 'paragraphs':
            const paragraphText = `これは${
              JAPANESE_DATA.words[
                Math.floor(Math.random() * JAPANESE_DATA.words.length)
              ]
            }のサンプル段落です。テストデータとして使用されており、実際の内容ではありません。データ生成の確認用として作成されています。`;
            rowData[col.id] = paragraphText;
            break;

          // Utilities系
          case 'autoIncrement':
            if (!autoIncrementRefs.has(col.id)) {
              autoIncrementRefs.set(col.id, 1);
            }
            rowData[col.id] = autoIncrementRefs.get(col.id);
            autoIncrementRefs.set(
              col.id,
              (autoIncrementRefs.get(col.id) || 1) + 1
            );
            break;
          case 'dateTime':
            const dateTime = new Date();
            dateTime.setTime(
              dateTime.getTime() -
                Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
            );
            rowData[col.id] = dateTime
              .toISOString()
              .replace('T', ' ')
              .split('.')[0];
            break;
          case 'date':
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 365));
            rowData[col.id] = date.toISOString().split('T')[0];
            break;
          case 'time':
            const hour = String(Math.floor(Math.random() * 24)).padStart(
              2,
              '0'
            );
            const minute = String(Math.floor(Math.random() * 60)).padStart(
              2,
              '0'
            );
            const second = String(Math.floor(Math.random() * 60)).padStart(
              2,
              '0'
            );
            rowData[col.id] = `${hour}:${minute}:${second}`;
            break;
          case 'md5Hash':
            // 簡易的なハッシュ風文字列生成
            const chars = '0123456789abcdef';
            let hash = '';
            for (let j = 0; j < 32; j++) {
              hash += chars[Math.floor(Math.random() * chars.length)];
            }
            rowData[col.id] = hash;
            break;

          // Legacy系 (既存との互換性)
          case 'text':
            if (col.name.toLowerCase().includes('name')) {
              rowData[col.id] = `テストユーザー${i + 1}`;
            } else if (col.name.toLowerCase().includes('category')) {
              const categories = ['カテゴリA', 'カテゴリB', 'カテゴリC'];
              rowData[col.id] =
                categories[Math.floor(Math.random() * categories.length)];
            } else if (col.name.toLowerCase().includes('status')) {
              const statuses = ['処理中', '完了', '保留中'];
              rowData[col.id] =
                statuses[Math.floor(Math.random() * statuses.length)];
            } else {
              rowData[col.id] = `Sample${i + 1}`;
            }
            break;
          case 'number':
            if (
              col.name.toLowerCase().includes('price') ||
              col.name.toLowerCase().includes('amount')
            ) {
              rowData[col.id] = Math.floor(Math.random() * 100000) + 1000;
            } else if (
              col.name.toLowerCase().includes('count') ||
              col.name.toLowerCase().includes('quantity')
            ) {
              rowData[col.id] = Math.floor(Math.random() * 100) + 1;
            } else if (col.name.toLowerCase().includes('age')) {
              rowData[col.id] = Math.floor(Math.random() * 60) + 18;
            } else {
              rowData[col.id] = Math.floor(Math.random() * 1000);
            }
            break;
          case 'phone':
            rowData[col.id] = `090-${String(
              Math.floor(Math.random() * 10000)
            ).padStart(4, '0')}-${String(
              Math.floor(Math.random() * 10000)
            ).padStart(4, '0')}`;
            break;
          case 'custom':
            rowData[col.id] = col.customPattern || `カスタム${i + 1}`;
            break;
          default:
            rowData[col.id] = `Value${i + 1}`;
        }
      });

      generatedRows.push({
        id: `row_${i}`,
        data: rowData,
      });
    }

    setRows(generatedRows);
    setShowDataTable(true);
    setBrewMessage(`✅ ${rowCount}件のテストデータを生成しました！`);
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

    setBrewMessage(
      `${outputFormat.toUpperCase()}ファイルをダウンロードしました！`
    );
  }, [rows, columns, outputFormat, exportSettings, generateData]);

  return (
    <div className="space-y-6">
      {/* ヘッダーセクション */}
      <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Database className="h-8 w-8 text-orange-600" />
            <CardTitle className="text-2xl font-bold text-orange-800">
              📋 CSV テストデータ生成
            </CardTitle>
          </div>
          <CardDescription className="text-orange-700">
            QAテスト用の高品質なCSVデータを簡単生成。日本語対応、豊富なデータタイプ対応
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Brewキャラクター */}
      <Card className="border-orange-200">
        <CardContent className="pt-6">
          <BrewCharacter message={brewMessage} />
        </CardContent>
      </Card>

      {/* カラム設定セクション */}
      <Card className="border-orange-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg text-orange-800">
                カラム設定
              </CardTitle>
            </div>
            <Button
              onClick={addColumn}
              className="bg-orange-600 hover:bg-orange-700 text-white"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              カラム追加
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {columns.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>カラムが設定されていません</p>
              <p className="text-sm">
                「カラム追加」ボタンでカラムを追加してください
              </p>
            </div>
          ) : (
            columns.map((column, index) => (
              <div
                key={column.id}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors"
              >
                {/* ドラッグハンドル */}
                <div className="cursor-move text-gray-400 hover:text-gray-600">
                  <GripVertical className="h-5 w-5" />
                </div>

                {/* カラム名入力 */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={column.name}
                    onChange={e =>
                      updateColumn(column.id, { name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="カラム名を入力"
                  />
                </div>

                {/* データタイプ選択 */}
                <div className="w-48">
                  <select
                    value={column.dataType}
                    onChange={e =>
                      updateColumn(column.id, {
                        dataType: e.target.value as CSVColumn['dataType'],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                  >
                    {Object.entries(DATA_TYPE_CATEGORIES).map(
                      ([categoryKey, category]) => (
                        <optgroup
                          key={categoryKey}
                          label={`${category.emoji} ${category.label}`}
                        >
                          {category.types.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label} - {type.description}
                            </option>
                          ))}
                        </optgroup>
                      )
                    )}
                    {/* Legacy options */}
                    <optgroup label="🔧 Legacy">
                      <option value="text">テキスト</option>
                      <option value="number">数値</option>
                      <option value="phone">電話番号</option>
                      <option value="custom">カスタム</option>
                    </optgroup>
                  </select>
                </div>

                {/* 削除ボタン */}
                <Button
                  onClick={() => deleteColumn(column.id)}
                  variant="danger"
                  size="sm"
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* データ生成設定セクション */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
            <Database className="h-5 w-5" />
            データ生成設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 行数設定 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                生成行数
              </label>
              <input
                type="number"
                value={rowCount}
                onChange={e => setRowCount(parseInt(e.target.value) || 100)}
                min="1"
                max="10000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* 出力形式 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                出力形式
              </label>
              <select
                value={outputFormat}
                onChange={e =>
                  setOutputFormat(e.target.value as 'csv' | 'json' | 'tsv')
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
                <option value="tsv">TSV</option>
              </select>
            </div>

            {/* エンコーディング */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                エンコーディング
              </label>
              <select
                value={exportSettings.encoding}
                onChange={e =>
                  setExportSettings(prev => ({
                    ...prev,
                    encoding: e.target.value as ExportSettings['encoding'],
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="utf-8">UTF-8</option>
                <option value="utf-8-bom">UTF-8 (BOM付き)</option>
                <option value="shift_jis">Shift_JIS</option>
              </select>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Button
              onClick={generateData}
              disabled={isGenerating || columns.length === 0}
              className="bg-orange-600 hover:bg-orange-700 text-white"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  生成中...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  データ生成
                </>
              )}
            </Button>

            <Button
              onClick={downloadData}
              disabled={rows.length === 0}
              variant="secondary"
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              <Download className="h-4 w-4 mr-2" />
              CSVダウンロード
            </Button>

            <Button
              onClick={() => setShowDataTable(true)}
              disabled={rows.length === 0}
              variant="secondary"
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              <FileText className="h-4 w-4 mr-2" />
              データ確認
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* データ表示セクション */}
      {rows.length > 0 && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-lg text-orange-800">
              📊 生成データプレビュー ({rows.length}件)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-orange-50">
                    {columns.map(column => (
                      <th
                        key={column.id}
                        className="px-4 py-2 text-left text-sm font-medium text-orange-800 border border-orange-200"
                      >
                        {column.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 10).map((row, index) => (
                    <tr
                      key={row.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      {columns.map(column => (
                        <td
                          key={column.id}
                          className="px-4 py-2 text-sm text-gray-700 border border-gray-200"
                        >
                          {row.data[column.name]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length > 10 && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  最初の10件を表示中。全{rows.length}
                  件のデータが生成されています。
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CSVTestDataGenerator;
