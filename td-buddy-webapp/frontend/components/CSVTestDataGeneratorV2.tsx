'use client';

import {
  Database,
  Download,
  FileText,
  GripVertical,
  Plus,
  RefreshCw,
  Target,
  Trash2,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { ActionButton } from './ui/ActionButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/Card';
import { EnhancedTDCharacter, TDMood } from './ui/EnhancedTDCharacter';

// 型定義
interface CSVColumn {
  id: string;
  name: string;
  dataType: DataType;
  required: boolean;
  order: number;
}

type DataType =
  // Name系
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
  // Legacy
  | 'text'
  | 'number'
  | 'phone'
  | 'custom';

interface CSVRow {
  id: string;
  data: Record<string, any>;
}

interface ExportSettings {
  encoding: 'utf-8' | 'utf-8-bom' | 'shift_jis';
  delimiter: ',' | ';' | '\t';
  includeHeader: boolean;
  filename: string;
}

// データタイプカテゴリ
const DATA_TYPE_CATEGORIES = {
  name: {
    label: 'Name',
    emoji: '👤',
    types: [
      {
        value: 'firstName' as const,
        label: 'First Name',
        description: '名前（名）',
      },
      {
        value: 'lastName' as const,
        label: 'Last Name',
        description: '名前（姓）',
      },
      {
        value: 'fullName' as const,
        label: 'Full Name',
        description: 'フルネーム',
      },
    ],
  },
  address: {
    label: 'Address',
    emoji: '🏠',
    types: [
      { value: 'country' as const, label: 'Country', description: '国名' },
      { value: 'state' as const, label: 'State', description: '都道府県' },
      { value: 'city' as const, label: 'City', description: '市区町村' },
      { value: 'street' as const, label: 'Street', description: '番地・町名' },
      { value: 'zipCode' as const, label: 'Zip Code', description: '郵便番号' },
    ],
  },
  number: {
    label: 'Number',
    emoji: '🔢',
    types: [
      {
        value: 'randomNumber' as const,
        label: 'Random Number',
        description: 'ランダム数値',
      },
      {
        value: 'phoneNumber' as const,
        label: 'Phone Number',
        description: '電話番号',
      },
    ],
  },
  internet: {
    label: 'Internet',
    emoji: '🌐',
    types: [
      {
        value: 'email' as const,
        label: 'Email',
        description: 'メールアドレス',
      },
      {
        value: 'username' as const,
        label: 'Username',
        description: 'ユーザー名',
      },
      {
        value: 'domainName' as const,
        label: 'Domain Name',
        description: 'ドメイン名',
      },
      {
        value: 'ipAddress' as const,
        label: 'IP Address',
        description: 'IPアドレス',
      },
    ],
  },
  text: {
    label: 'Text',
    emoji: '📝',
    types: [
      { value: 'words' as const, label: 'Words', description: '単語' },
      { value: 'sentences' as const, label: 'Sentences', description: '文章' },
      {
        value: 'paragraphs' as const,
        label: 'Paragraphs',
        description: '段落',
      },
    ],
  },
  utilities: {
    label: 'Utilities',
    emoji: '⚙️',
    types: [
      {
        value: 'autoIncrement' as const,
        label: 'Auto-increment',
        description: '連番',
      },
      { value: 'dateTime' as const, label: 'DateTime', description: '日時' },
      { value: 'date' as const, label: 'Date', description: '日付' },
      { value: 'time' as const, label: 'Time', description: '時刻' },
      {
        value: 'md5Hash' as const,
        label: 'MD5 Hash',
        description: 'MD5ハッシュ',
      },
    ],
  },
} as const;

// データタイプ情報を取得するヘルパー関数
const getDataTypeInfo = (dataType: DataType) => {
  const dataTypeMap: Record<
    DataType,
    { label: string; suggestedName: string }
  > = {
    // Name系
    firstName: { label: '名前（名）', suggestedName: 'first_name' },
    lastName: { label: '名前（姓）', suggestedName: 'last_name' },
    fullName: { label: 'フルネーム', suggestedName: 'full_name' },
    // Address系
    country: { label: '国名', suggestedName: 'country' },
    state: { label: '都道府県', suggestedName: 'prefecture' },
    city: { label: '市区町村', suggestedName: 'city' },
    street: { label: '番地・町名', suggestedName: 'street_address' },
    zipCode: { label: '郵便番号', suggestedName: 'postal_code' },
    // Number系
    randomNumber: { label: 'ランダム数値', suggestedName: 'random_number' },
    phoneNumber: { label: '電話番号', suggestedName: 'phone_number' },
    // Internet系
    email: { label: 'メールアドレス', suggestedName: 'email_address' },
    username: { label: 'ユーザー名', suggestedName: 'username' },
    domainName: { label: 'ドメイン名', suggestedName: 'domain_name' },
    ipAddress: { label: 'IPアドレス', suggestedName: 'ip_address' },
    // Text系
    words: { label: '単語', suggestedName: 'sample_words' },
    sentences: { label: '文章', suggestedName: 'sample_text' },
    paragraphs: { label: '段落', suggestedName: 'description' },
    // Utilities系
    autoIncrement: { label: '連番', suggestedName: 'id' },
    dateTime: { label: '日時', suggestedName: 'created_at' },
    date: { label: '日付', suggestedName: 'date' },
    time: { label: '時刻', suggestedName: 'time' },
    md5Hash: { label: 'MD5ハッシュ', suggestedName: 'hash_value' },
    // Legacy
    text: { label: 'テキスト', suggestedName: 'text_value' },
    number: { label: '数値', suggestedName: 'number_value' },
    phone: { label: '電話番号', suggestedName: 'phone' },
    custom: { label: 'カスタム', suggestedName: 'custom_value' },
  };

  return dataTypeMap[dataType] || null;
};

// プリセットデータ
const CSV_PRESETS = [
  {
    id: 'user_basic',
    name: '👤 ユーザー基本情報',
    description: 'ユーザー管理システム用の基本的なユーザー情報',
    columns: [
      { dataType: 'autoIncrement' as DataType, name: 'user_id' },
      { dataType: 'lastName' as DataType, name: 'last_name' },
      { dataType: 'firstName' as DataType, name: 'first_name' },
      { dataType: 'email' as DataType, name: 'email_address' },
      { dataType: 'phoneNumber' as DataType, name: 'phone_number' },
    ],
  },
  {
    id: 'address_full',
    name: '🏠 住所情報',
    description: '配送・住所管理システム用の詳細住所データ',
    columns: [
      { dataType: 'autoIncrement' as DataType, name: 'address_id' },
      { dataType: 'country' as DataType, name: 'country' },
      { dataType: 'state' as DataType, name: 'prefecture' },
      { dataType: 'city' as DataType, name: 'city' },
      { dataType: 'street' as DataType, name: 'street_address' },
      { dataType: 'zipCode' as DataType, name: 'postal_code' },
    ],
  },
  {
    id: 'product_catalog',
    name: '📦 商品カタログ',
    description: 'ECサイト・商品管理システム用のサンプルデータ',
    columns: [
      { dataType: 'autoIncrement' as DataType, name: 'product_id' },
      { dataType: 'words' as DataType, name: 'product_name' },
      { dataType: 'randomNumber' as DataType, name: 'price' },
      { dataType: 'sentences' as DataType, name: 'description' },
      { dataType: 'date' as DataType, name: 'release_date' },
    ],
  },
  {
    id: 'log_data',
    name: '📊 ログデータ',
    description: 'システムログ・アクセスログ用のサンプルデータ',
    columns: [
      { dataType: 'autoIncrement' as DataType, name: 'log_id' },
      { dataType: 'dateTime' as DataType, name: 'timestamp' },
      { dataType: 'ipAddress' as DataType, name: 'client_ip' },
      { dataType: 'username' as DataType, name: 'username' },
      { dataType: 'words' as DataType, name: 'action' },
    ],
  },
  {
    id: 'employee_data',
    name: '👔 従業員データ',
    description: '人事・勤怠管理システム用の従業員情報',
    columns: [
      { dataType: 'autoIncrement' as DataType, name: 'employee_id' },
      { dataType: 'fullName' as DataType, name: 'full_name' },
      { dataType: 'email' as DataType, name: 'work_email' },
      { dataType: 'randomNumber' as DataType, name: 'department_id' },
      { dataType: 'date' as DataType, name: 'hire_date' },
    ],
  },
] as const;

// 日本語データセット
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
    '雄一',
    '由美',
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
    '新宿区',
    '渋谷区',
    '港区',
    '千代田区',
    '中央区',
    '品川区',
    '目黒区',
    '世田谷区',
    '杉並区',
    '練馬区',
  ],
  countries: [
    '日本',
    'アメリカ',
    'イギリス',
    'ドイツ',
    'フランス',
    '中国',
    '韓国',
    'オーストラリア',
    'カナダ',
    'ブラジル',
  ],
  emailDomains: [
    'example.com',
    'test.co.jp',
    'demo.jp',
    'sample.net',
    'example.org',
  ],
  words: [
    'テスト',
    'サンプル',
    'データ',
    '生成',
    '確認',
    '検証',
    '品質',
    '開発',
    'システム',
    'プロジェクト',
  ],
};

export const CSVTestDataGeneratorV2: React.FC = React.memo(() => {
  const [columns, setColumns] = useState<CSVColumn[]>([]);
  const [rows, setRows] = useState<CSVRow[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rowCount, setRowCount] = useState(100);
  const [error, setError] = useState<string | null>(null);
  const [tdMood, setTdMood] = useState<TDMood>('happy');
  const [tdMessage, setTdMessage] = useState(
    'CSVテストデータ生成の準備ができました！'
  );
  const [isCopied, setIsCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    encoding: 'utf-8-bom',
    delimiter: ',',
    includeHeader: true,
    filename: 'test_data',
  });

  // プリセット機能
  const [showPresets, setShowPresets] = useState(false);

  // プリセット適用
  const applyPreset = useCallback((presetId: string) => {
    const preset = CSV_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    const newColumns: CSVColumn[] = preset.columns.map((col, index) => ({
      id: `preset_${presetId}_${index}_${Date.now()}`,
      name: col.name,
      dataType: col.dataType,
      required: true,
      order: index,
    }));

    setColumns(newColumns);
    setShowPresets(false);
    setTdMood('success');
    setTdMessage(
      `✨ 「${preset.name}」プリセットを適用しました！すぐにデータ生成できます♪`
    );
  }, []);

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
    setTdMessage(
      '新しいカラムを追加しました！データタイプを選択してくださいね♪'
    );
  }, [columns.length]);

  // カラム削除
  const removeColumn = useCallback((columnId: string) => {
    setColumns(prev => prev.filter(col => col.id !== columnId));
    setTdMessage(
      'カラムを削除しました。他にも調整が必要でしたらお知らせください！'
    );
  }, []);

  // カラム更新（データタイプ変更時にカラム名も自動更新）
  const updateColumn = useCallback(
    (columnId: string, updates: Partial<CSVColumn>) => {
      setColumns(prev =>
        prev.map(col => {
          if (col.id === columnId) {
            const updatedCol = { ...col, ...updates };

            // データタイプが変更された場合、適切なカラム名を自動設定
            if (updates.dataType && updates.dataType !== col.dataType) {
              const dataTypeInfo = getDataTypeInfo(updates.dataType);
              if (dataTypeInfo) {
                updatedCol.name = dataTypeInfo.suggestedName;
                setTdMessage(
                  `データタイプを「${dataTypeInfo.label}」に変更し、カラム名を「${dataTypeInfo.suggestedName}」に自動設定しました！`
                );
              }
            }

            return updatedCol;
          }
          return col;
        })
      );
    },
    []
  );

  // データ生成関数
  const generateDataValue = useCallback(
    (dataType: DataType, rowIndex: number): any => {
      switch (dataType) {
        case 'firstName':
          return JAPANESE_DATA.firstNames[
            Math.floor(Math.random() * JAPANESE_DATA.firstNames.length)
          ];

        case 'lastName':
          return JAPANESE_DATA.lastNames[
            Math.floor(Math.random() * JAPANESE_DATA.lastNames.length)
          ];

        case 'fullName':
          const lastName =
            JAPANESE_DATA.lastNames[
              Math.floor(Math.random() * JAPANESE_DATA.lastNames.length)
            ];
          const firstName =
            JAPANESE_DATA.firstNames[
              Math.floor(Math.random() * JAPANESE_DATA.firstNames.length)
            ];
          return `${lastName} ${firstName}`;

        case 'country':
          return JAPANESE_DATA.countries[
            Math.floor(Math.random() * JAPANESE_DATA.countries.length)
          ];

        case 'state':
          return JAPANESE_DATA.prefectures[
            Math.floor(Math.random() * JAPANESE_DATA.prefectures.length)
          ];

        case 'city':
          return JAPANESE_DATA.cities[
            Math.floor(Math.random() * JAPANESE_DATA.cities.length)
          ];

        case 'street':
          return `${Math.floor(Math.random() * 9 + 1)}-${Math.floor(
            Math.random() * 20 + 1
          )}-${Math.floor(Math.random() * 20 + 1)}`;

        case 'zipCode':
          return `${String(Math.floor(Math.random() * 900) + 100)}-${String(
            Math.floor(Math.random() * 9000) + 1000
          )}`;

        case 'randomNumber':
          return Math.floor(Math.random() * 1000) + 1;

        case 'phoneNumber':
          const phonePrefix = ['090', '080', '070'][
            Math.floor(Math.random() * 3)
          ];
          return `${phonePrefix}-${String(
            Math.floor(Math.random() * 9000) + 1000
          )}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

        case 'email':
          const firstNameForEmail =
            JAPANESE_DATA.firstNames[
              Math.floor(Math.random() * JAPANESE_DATA.firstNames.length)
            ];
          const domain =
            JAPANESE_DATA.emailDomains[
              Math.floor(Math.random() * JAPANESE_DATA.emailDomains.length)
            ];
          return `${firstNameForEmail.toLowerCase()}${Math.floor(
            Math.random() * 100
          )}@${domain}`;

        case 'username':
          const username =
            JAPANESE_DATA.firstNames[
              Math.floor(Math.random() * JAPANESE_DATA.firstNames.length)
            ];
          return `${username.toLowerCase()}${Math.floor(Math.random() * 1000)}`;

        case 'domainName':
          return JAPANESE_DATA.emailDomains[
            Math.floor(Math.random() * JAPANESE_DATA.emailDomains.length)
          ];

        case 'ipAddress':
          return `${Math.floor(Math.random() * 256)}.${Math.floor(
            Math.random() * 256
          )}.${Math.floor(Math.random() * 256)}.${Math.floor(
            Math.random() * 256
          )}`;

        case 'words':
          const wordCount = Math.floor(Math.random() * 5) + 1;
          return Array.from(
            { length: wordCount },
            () =>
              JAPANESE_DATA.words[
                Math.floor(Math.random() * JAPANESE_DATA.words.length)
              ]
          ).join(' ');

        case 'sentences':
          const sentenceCount = Math.floor(Math.random() * 3) + 1;
          return Array.from({ length: sentenceCount }, () => {
            const words = Array.from(
              { length: Math.floor(Math.random() * 8) + 3 },
              () =>
                JAPANESE_DATA.words[
                  Math.floor(Math.random() * JAPANESE_DATA.words.length)
                ]
            );
            return words.join('') + '。';
          }).join(' ');

        case 'paragraphs':
          const paragraphCount = Math.floor(Math.random() * 3) + 1;
          return Array.from({ length: paragraphCount }, () => {
            const sentenceCount = Math.floor(Math.random() * 4) + 2;
            const sentences = Array.from({ length: sentenceCount }, () => {
              const words = Array.from(
                { length: Math.floor(Math.random() * 8) + 3 },
                () =>
                  JAPANESE_DATA.words[
                    Math.floor(Math.random() * JAPANESE_DATA.words.length)
                  ]
              );
              return words.join('') + '。';
            });
            return sentences.join(' ');
          }).join('\n\n');

        case 'autoIncrement':
          return rowIndex + 1;

        case 'dateTime':
          const date = new Date();
          date.setDate(date.getDate() - Math.floor(Math.random() * 365));
          return date.toISOString();

        case 'date':
          const dateOnly = new Date();
          dateOnly.setDate(
            dateOnly.getDate() - Math.floor(Math.random() * 365)
          );
          return dateOnly.toISOString().split('T')[0];

        case 'time':
          const hours = String(Math.floor(Math.random() * 24)).padStart(2, '0');
          const minutes = String(Math.floor(Math.random() * 60)).padStart(
            2,
            '0'
          );
          const seconds = String(Math.floor(Math.random() * 60)).padStart(
            2,
            '0'
          );
          return `${hours}:${minutes}:${seconds}`;

        case 'md5Hash':
          const chars = '0123456789abcdef';
          return Array.from(
            { length: 32 },
            () => chars[Math.floor(Math.random() * chars.length)]
          ).join('');

        // Legacy compatibility
        case 'text':
          return JAPANESE_DATA.words[
            Math.floor(Math.random() * JAPANESE_DATA.words.length)
          ];

        case 'number':
          return Math.floor(Math.random() * 100) + 1;

        case 'phone':
          const legacyPrefix = ['090', '080'][Math.floor(Math.random() * 2)];
          return `${legacyPrefix}-${String(
            Math.floor(Math.random() * 9000) + 1000
          )}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

        case 'custom':
          return 'カスタム値';

        default:
          return 'デフォルト値';
      }
    },
    []
  );

  // データ生成
  const generateData = useCallback(async () => {
    if (columns.length === 0) {
      setTdMessage('まずはカラムを追加してくださいね！');
      setTdMood('thinking');
      return;
    }

    setIsGenerating(true);
    setTdMood('working');
    setTdMessage(`${rowCount}件のテストデータを生成中です...お待ちください！`);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const generatedRows: CSVRow[] = Array.from(
        { length: rowCount },
        (_, index) => ({
          id: `row_${index}`,
          data: columns.reduce((acc, column) => {
            acc[column.name] = generateDataValue(column.dataType, index);
            return acc;
          }, {} as Record<string, any>),
        })
      );

      setRows(generatedRows);
      setTdMood('success');
      setTdMessage(
        `🎉 ${rowCount}件のテストデータを生成完了しました！データをご確認ください♪`
      );
    } catch (error) {
      console.error('Data generation failed:', error);
      setTdMood('error');
      setTdMessage(
        'データ生成中にエラーが発生しました。もう一度お試しください。'
      );
    } finally {
      setIsGenerating(false);
    }
  }, [columns, rowCount, generateDataValue]);

  // CSVエクスポート
  const exportToCSV = useCallback(() => {
    if (rows.length === 0) {
      setTdMessage('まずはデータを生成してくださいね！');
      return;
    }

    try {
      setIsExporting(true);
      let csvContent = '';

      // ヘッダー行
      if (exportSettings.includeHeader) {
        const headers = columns.map(col => col.name);
        csvContent += headers.join(exportSettings.delimiter) + '\n';
      }

      // データ行
      rows.forEach(row => {
        const values = columns.map(col => {
          const value = row.data[col.name];
          if (
            typeof value === 'string' &&
            (value.includes(',') || value.includes('"') || value.includes('\n'))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        });
        csvContent += values.join(exportSettings.delimiter) + '\n';
      });

      // ファイルダウンロード
      const blob = new Blob([csvContent], {
        type:
          exportSettings.encoding === 'utf-8-bom'
            ? 'text/csv;charset=utf-8-bom'
            : 'text/csv;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${exportSettings.filename}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setTdMood('success');
      setTdMessage('CSVファイルのダウンロードが完了しました！');
    } catch (error) {
      console.error('CSV export failed:', error);
      setTdMood('error');
      setTdMessage('CSVエクスポート中にエラーが発生しました。');
    } finally {
      setIsExporting(false);
    }
  }, [rows, columns, exportSettings]);

  return (
    <div className="space-y-6">
      {/* ヘッダーセクション */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Database className="h-8 w-8 text-blue-600" />
            <CardTitle className="text-2xl font-bold text-blue-800">
              📋 CSV テストデータ生成
            </CardTitle>
          </div>
          <CardDescription className="text-blue-700">
            QAテスト用の高品質なCSVデータを簡単生成。日本語対応、豊富なデータタイプ対応
          </CardDescription>
        </CardHeader>
      </Card>

      {/* TDキャラクター */}
      <Card className="border-blue-200">
        <CardContent className="pt-6">
          <EnhancedTDCharacter mood={tdMood} message={tdMessage} />
        </CardContent>
      </Card>

      {/* カラム設定セクション */}
      <Card className="border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg text-blue-800">
                カラム設定
              </CardTitle>
            </div>
            <div className="flex gap-2">
              <ActionButton
                type="generate"
                onClick={() => setShowPresets(true)}
                variant="accent"
                size="sm"
              >
                ⭐ プリセット
              </ActionButton>
              <ActionButton
                type="generate"
                onClick={addColumn}
                variant="primary"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                カラム追加
              </ActionButton>
            </div>
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
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="カラム名を入力"
                  />
                </div>

                {/* データタイプ選択 */}
                <div className="w-48">
                  <select
                    value={column.dataType}
                    onChange={e =>
                      updateColumn(column.id, {
                        dataType: e.target.value as DataType,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                <ActionButton
                  type="clear"
                  onClick={() => removeColumn(column.id)}
                  variant="danger"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </ActionButton>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* プリセット選択モーダル */}
      {showPresets && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-blue-800">
                  ⭐ プリセット選択
                </h3>
                <ActionButton
                  type="clear"
                  onClick={() => setShowPresets(false)}
                  variant="secondary"
                  size="sm"
                >
                  ✕
                </ActionButton>
              </div>

              <div className="grid gap-4">
                {CSV_PRESETS.map(preset => (
                  <div
                    key={preset.id}
                    className="border border-blue-200 rounded-lg p-4 hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-800 mb-2">
                          {preset.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {preset.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {preset.columns.map((col, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md"
                            >
                              {col.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ActionButton
                        type="generate"
                        onClick={() => applyPreset(preset.id)}
                        variant="primary"
                        size="sm"
                      >
                        適用
                      </ActionButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* データ生成設定セクション */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="utf-8">UTF-8</option>
                <option value="utf-8-bom">UTF-8 (BOM付き)</option>
                <option value="shift_jis">Shift_JIS</option>
              </select>
            </div>

            {/* ファイル名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ファイル名
              </label>
              <input
                type="text"
                value={exportSettings.filename}
                onChange={e =>
                  setExportSettings(prev => ({
                    ...prev,
                    filename: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="test_data"
              />
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex flex-wrap gap-3 pt-4">
            <ActionButton
              type="generate"
              onClick={generateData}
              disabled={isGenerating || columns.length === 0}
              loading={isGenerating}
              variant="primary"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  データ生成
                </>
              )}
            </ActionButton>

            <ActionButton
              type="download"
              onClick={exportToCSV}
              disabled={rows.length === 0 || isExporting}
              loading={isExporting}
              variant="secondary"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  エクスポート中...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  CSVダウンロード
                </>
              )}
            </ActionButton>
          </div>
        </CardContent>
      </Card>

      {/* データ表示セクション */}
      {rows.length > 0 && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg text-blue-800">
              📊 生成データプレビュー ({rows.length}件)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    {columns.map(column => (
                      <th
                        key={column.id}
                        className="px-4 py-2 text-left text-sm font-medium text-blue-800 border border-blue-200"
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
});

export default CSVTestDataGeneratorV2;
