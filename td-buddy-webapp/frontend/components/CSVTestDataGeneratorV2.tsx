'use client';

import { FileText, GripVertical, Trash2 } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useButtonState } from '../hooks/useButtonState';
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

// ユーザープリセット型定義
interface UserPreset {
  id: string;
  name: string;
  description: string;
  columns: { dataType: DataType; name: string }[];
  createdAt: Date;
  isCustom: true;
}

// テンプレート型定義
interface Template {
  id: string;
  name: string;
  description: string;
  settings: {
    columns: CSVColumn[];
    rowCount: number;
    exportSettings: ExportSettings;
  };
  createdAt: Date;
  lastUsed: Date;
}

// 一括編集型定義
interface BulkEditOperation {
  columnIds: string[];
  operation: 'rename' | 'changeType' | 'toggleRequired' | 'delete';
  value?: any;
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

// プリセット型定義
interface CSVPreset {
  id: string;
  name: string;
  description: string;
  columns: { dataType: DataType; name: string }[];
}

interface PresetCategory {
  name: string;
  emoji: string;
  description: string;
  presets: CSVPreset[];
}

// プリセットカテゴリとデータ
const CSV_PRESET_CATEGORIES: Record<string, PresetCategory> = {
  business: {
    name: '💼 ビジネス・業務',
    emoji: '💼',
    description: 'ビジネスシステム・業務管理用',
    presets: [
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
      {
        id: 'financial_data',
        name: '💰 金融データ',
        description: '会計・財務管理システム用のデータ',
        columns: [
          { dataType: 'autoIncrement' as DataType, name: 'transaction_id' },
          { dataType: 'randomNumber' as DataType, name: 'account_id' },
          { dataType: 'words' as DataType, name: 'transaction_type' },
          { dataType: 'randomNumber' as DataType, name: 'amount' },
          { dataType: 'sentences' as DataType, name: 'description' },
          { dataType: 'dateTime' as DataType, name: 'created_at' },
        ],
      },
    ],
  },
  ecommerce: {
    name: '🛒 EC・販売',
    emoji: '🛒',
    description: 'Eコマース・販売システム用',
    presets: [
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
        id: 'order_data',
        name: '🛒 注文データ',
        description: 'ECサイト・注文管理システム用のデータ',
        columns: [
          { dataType: 'autoIncrement' as DataType, name: 'order_id' },
          { dataType: 'randomNumber' as DataType, name: 'customer_id' },
          { dataType: 'words' as DataType, name: 'product_name' },
          { dataType: 'randomNumber' as DataType, name: 'quantity' },
          { dataType: 'randomNumber' as DataType, name: 'price' },
          { dataType: 'dateTime' as DataType, name: 'order_date' },
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
    ],
  },
  content: {
    name: '📝 コンテンツ・メディア',
    emoji: '📝',
    description: 'CMS・メディア・コンテンツ管理用',
    presets: [
      {
        id: 'blog_post',
        name: '📝 ブログ記事',
        description: 'CMS・ブログシステム用のコンテンツデータ',
        columns: [
          { dataType: 'autoIncrement' as DataType, name: 'post_id' },
          { dataType: 'sentences' as DataType, name: 'title' },
          { dataType: 'paragraphs' as DataType, name: 'content' },
          { dataType: 'username' as DataType, name: 'author' },
          { dataType: 'words' as DataType, name: 'category' },
          { dataType: 'dateTime' as DataType, name: 'published_at' },
        ],
      },
      {
        id: 'social_media',
        name: '📱 SNS投稿',
        description: 'ソーシャルメディア・投稿管理システム用のデータ',
        columns: [
          { dataType: 'autoIncrement' as DataType, name: 'post_id' },
          { dataType: 'username' as DataType, name: 'username' },
          { dataType: 'sentences' as DataType, name: 'post_content' },
          { dataType: 'randomNumber' as DataType, name: 'likes_count' },
          { dataType: 'randomNumber' as DataType, name: 'shares_count' },
          { dataType: 'dateTime' as DataType, name: 'posted_at' },
        ],
      },
    ],
  },
  entertainment: {
    name: '🎮 エンターテイメント',
    emoji: '🎮',
    description: 'ゲーム・イベント・エンタメ用',
    presets: [
      {
        id: 'game_scores',
        name: '🎮 ゲームスコア',
        description: 'ゲーム・スコア管理システム用のデータ',
        columns: [
          { dataType: 'autoIncrement' as DataType, name: 'score_id' },
          { dataType: 'username' as DataType, name: 'player_name' },
          { dataType: 'words' as DataType, name: 'game_mode' },
          { dataType: 'randomNumber' as DataType, name: 'score' },
          { dataType: 'randomNumber' as DataType, name: 'level' },
          { dataType: 'dateTime' as DataType, name: 'played_at' },
        ],
      },
      {
        id: 'event_tickets',
        name: '🎫 イベントチケット',
        description: 'イベント管理・チケット販売システム用のデータ',
        columns: [
          { dataType: 'autoIncrement' as DataType, name: 'ticket_id' },
          { dataType: 'words' as DataType, name: 'event_name' },
          { dataType: 'fullName' as DataType, name: 'attendee_name' },
          { dataType: 'email' as DataType, name: 'attendee_email' },
          { dataType: 'randomNumber' as DataType, name: 'seat_number' },
          { dataType: 'date' as DataType, name: 'event_date' },
        ],
      },
    ],
  },
  education: {
    name: '🎓 教育・ヘルスケア',
    emoji: '🎓',
    description: '教育・医療・ヘルスケア用',
    presets: [
      {
        id: 'education_data',
        name: '🎓 教育データ',
        description: '学習管理・教育システム用のデータ',
        columns: [
          { dataType: 'autoIncrement' as DataType, name: 'student_id' },
          { dataType: 'fullName' as DataType, name: 'student_name' },
          { dataType: 'words' as DataType, name: 'course_name' },
          { dataType: 'randomNumber' as DataType, name: 'grade' },
          { dataType: 'email' as DataType, name: 'student_email' },
          { dataType: 'date' as DataType, name: 'enrollment_date' },
        ],
      },
      {
        id: 'healthcare_data',
        name: '🏥 医療データ',
        description: '医療管理・ヘルスケアシステム用のデータ',
        columns: [
          { dataType: 'autoIncrement' as DataType, name: 'patient_id' },
          { dataType: 'fullName' as DataType, name: 'patient_name' },
          { dataType: 'randomNumber' as DataType, name: 'age' },
          { dataType: 'words' as DataType, name: 'diagnosis' },
          { dataType: 'words' as DataType, name: 'treatment' },
          { dataType: 'date' as DataType, name: 'visit_date' },
        ],
      },
    ],
  },
  technical: {
    name: '🔧 技術・システム',
    emoji: '🔧',
    description: 'システム・技術・IoT用',
    presets: [
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
        id: 'iot_sensor',
        name: '📡 IoTセンサー',
        description: 'IoT・センサーデータ監視システム用のデータ',
        columns: [
          { dataType: 'autoIncrement' as DataType, name: 'sensor_id' },
          { dataType: 'words' as DataType, name: 'device_name' },
          { dataType: 'randomNumber' as DataType, name: 'temperature' },
          { dataType: 'randomNumber' as DataType, name: 'humidity' },
          { dataType: 'ipAddress' as DataType, name: 'device_ip' },
          { dataType: 'dateTime' as DataType, name: 'recorded_at' },
        ],
      },
    ],
  },
};

// 後方互換性のため全プリセットのフラットリストも保持
const CSV_PRESETS: CSVPreset[] = Object.values(CSV_PRESET_CATEGORIES).flatMap(
  category => category.presets
);

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

  // ドラッグ&ドロップ状態
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  // 新機能の状態管理
  const [userPresets, setUserPresets] = useState<UserPreset[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [bulkEditDataType, setBulkEditDataType] = useState<DataType>('text');
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [templatePreview, setTemplatePreview] = useState<Template | null>(null);
  const [showExportPreview, setShowExportPreview] = useState(false);
  const [showPresetImportExport, setShowPresetImportExport] = useState(false);

  // ボタン状態管理
  const { buttonStates, setButtonActive } = useButtonState();

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

      if (draggedIndex === -1 || targetIndex === -1) return;

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
      setTdMood('success');
      setTdMessage(
        '✨ カラムの順序を変更しました！ドラッグ&ドロップ便利ですね♪'
      );
    },
    [draggedColumnId, columns]
  );

  // ユーザープリセット保存機能
  const saveUserPreset = useCallback(
    (name: string, description: string) => {
      if (columns.length === 0) {
        setTdMessage(
          'カラムが設定されていません。まずはカラムを追加してくださいね！'
        );
        return;
      }

      const newPreset: UserPreset = {
        id: `user_preset_${Date.now()}`,
        name,
        description,
        columns: columns.map(col => ({
          dataType: col.dataType,
          name: col.name,
        })),
        createdAt: new Date(),
        isCustom: true,
      };

      setUserPresets(prev => [...prev, newPreset]);
      setTdMood('success');
      setTdMessage(
        `🎉 ユーザープリセット「${name}」を保存しました！いつでも再利用できます♪`
      );
    },
    [columns]
  );

  // プリセット適用（システム・ユーザー両対応）
  const applyPreset = useCallback(
    (presetId: string) => {
      // システムプリセットをチェック
      let preset = CSV_PRESETS.find(p => p.id === presetId);
      // ユーザープリセットもチェック
      if (!preset) {
        preset = userPresets.find(p => p.id === presetId);
      }

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
    },
    [userPresets]
  );

  // カラム複製機能
  const duplicateColumn = useCallback(
    (columnId: string) => {
      const originalColumn = columns.find(col => col.id === columnId);
      if (!originalColumn) return;

      const duplicatedColumn: CSVColumn = {
        id: `copy_${Date.now()}`,
        name: `${originalColumn.name}_copy`,
        dataType: originalColumn.dataType,
        required: originalColumn.required,
        order: columns.length, // 最後に追加
      };

      setColumns(prev => [...prev, duplicatedColumn]);
      setTdMood('success');
      setTdMessage(
        `✨ 「${originalColumn.name}」カラムを複製しました！設定もそのままコピーされています♪`
      );
    },
    [columns]
  );

  // 一括編集機能
  const performBulkEdit = useCallback((operation: BulkEditOperation) => {
    const { columnIds, operation: op, value } = operation;

    setColumns(prev => {
      let newColumns = [...prev];

      switch (op) {
        case 'delete':
          newColumns = newColumns.filter(col => !columnIds.includes(col.id));
          break;
        case 'changeType':
          newColumns = newColumns.map(col =>
            columnIds.includes(col.id) ? { ...col, dataType: value } : col
          );
          break;
        case 'toggleRequired':
          newColumns = newColumns.map(col =>
            columnIds.includes(col.id)
              ? { ...col, required: !col.required }
              : col
          );
          break;
        case 'rename':
          // 複数カラムの一括リネーム（連番付き）
          let counter = 1;
          newColumns = newColumns.map(col =>
            columnIds.includes(col.id)
              ? { ...col, name: `${value}_${counter++}` }
              : col
          );
          break;
      }

      return newColumns;
    });

    setSelectedColumns([]);
    setShowBulkEdit(false);
    setTdMood('success');
    setTdMessage(
      `✨ ${columnIds.length}個のカラムに一括編集を適用しました！効率的ですね♪`
    );
  }, []);

  // カラム選択状態の切り替え
  const toggleColumnSelection = useCallback((columnId: string) => {
    setSelectedColumns(prev =>
      prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
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

  // テンプレート機能
  const saveTemplate = useCallback(
    (name: string, description: string) => {
      if (columns.length === 0) {
        setTdMessage(
          'カラムが設定されていません。まずはカラムを追加してくださいね！'
        );
        return;
      }

      const newTemplate: Template = {
        id: `template_${Date.now()}`,
        name,
        description,
        settings: {
          columns: [...columns],
          rowCount,
          exportSettings: { ...exportSettings },
        },
        createdAt: new Date(),
        lastUsed: new Date(),
      };

      setTemplates(prev => [...prev, newTemplate]);
      setShowTemplateManager(false);
      setTdMood('success');
      setTdMessage(
        `🎉 テンプレート「${name}」を保存しました！設定がすべて保存されています♪`
      );
    },
    [columns, rowCount, exportSettings]
  );

  const loadTemplate = useCallback(
    (templateId: string) => {
      const template = templates.find(t => t.id === templateId);
      if (!template) return;

      // 設定をすべて復元
      setColumns(template.settings.columns);
      setRowCount(template.settings.rowCount);
      setExportSettings(template.settings.exportSettings);

      // 最終使用日を更新
      setTemplates(prev =>
        prev.map(t =>
          t.id === templateId ? { ...t, lastUsed: new Date() } : t
        )
      );

      setShowTemplateManager(false);
      setTdMood('success');
      setTdMessage(
        `✨ テンプレート「${template.name}」を読み込みました！すべての設定が復元されています♪`
      );
    },
    [templates]
  );

  // プリセットエクスポート機能
  const exportPresets = useCallback(() => {
    const presetsToExport = {
      userPresets,
      templates,
      exportedAt: new Date().toISOString(),
      version: '2.1.0',
    };

    const dataStr = JSON.stringify(presetsToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `td-buddy-presets-${
      new Date().toISOString().split('T')[0]
    }.json`;
    link.click();

    URL.revokeObjectURL(url);
    setTdMood('success');
    setTdMessage(
      '🎉 プリセット・テンプレートをエクスポートしました！ファイルをダウンロードしています♪'
    );
  }, [userPresets, templates]);

  // プリセットインポート機能
  const importPresets = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = e => {
        try {
          const importedData = JSON.parse(e.target?.result as string);

          // データ形式の検証
          if (!importedData.userPresets || !importedData.templates) {
            throw new Error('無効なファイル形式です');
          }

          // インポート実行
          if (importedData.userPresets.length > 0) {
            setUserPresets(prev => [
              ...prev,
              ...importedData.userPresets.map((preset: UserPreset) => ({
                ...preset,
                id: `imported_${Date.now()}_${preset.id}`,
                createdAt: new Date(preset.createdAt),
              })),
            ]);
          }

          if (importedData.templates.length > 0) {
            setTemplates(prev => [
              ...prev,
              ...importedData.templates.map((template: Template) => ({
                ...template,
                id: `imported_${Date.now()}_${template.id}`,
                createdAt: new Date(template.createdAt),
                lastUsed: new Date(template.lastUsed),
              })),
            ]);
          }

          setTdMood('success');
          setTdMessage(
            `✨ インポート完了！プリセット${importedData.userPresets.length}個、テンプレート${importedData.templates.length}個を追加しました♪`
          );
        } catch (error) {
          setTdMood('error');
          setTdMessage(
            '❌ ファイルの読み込みに失敗しました。正しいファイルを選択してください。'
          );
        }
      };
      reader.readAsText(file);

      // ファイル入力をリセット
      event.target.value = '';
    },
    []
  );

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

      // 生成ボタンの状態を「生成完了」に変更
      setButtonActive('generate');
    } catch (error) {
      console.error('Data generation failed:', error);
      setTdMood('error');
      setTdMessage(
        'データ生成中にエラーが発生しました。もう一度お試しください。'
      );
    } finally {
      setIsGenerating(false);
    }
  }, [columns, rowCount, generateDataValue, setButtonActive]);

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

      // ダウンロードボタンの状態を「ダウンロード済み」に変更
      setButtonActive('download');
    } catch (error) {
      console.error('CSV export failed:', error);
      setTdMood('error');
      setTdMessage('CSVエクスポート中にエラーが発生しました。');
    } finally {
      setIsExporting(false);
    }
  }, [rows, columns, exportSettings, setButtonActive]);

  return (
    <div className="space-y-6">
      {/* ヘッダーセクション */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <FileText className="h-8 w-8 text-blue-600" />
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
              <FileText className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg text-blue-800">
                カラム設定
              </CardTitle>
            </div>
            <div className="flex flex-wrap gap-2">
              <ActionButton
                type="generate"
                onClick={() => setShowPresets(true)}
                variant="accent"
                size="sm"
              >
                ⭐ プリセット
              </ActionButton>

              <ActionButton
                type="copy"
                onClick={() => setShowTemplateManager(true)}
                variant="secondary"
                size="sm"
              >
                📁 テンプレート
              </ActionButton>

              <ActionButton
                type="replace"
                onClick={() => setShowBulkEdit(true)}
                variant="secondary"
                size="sm"
                disabled={columns.length === 0}
              >
                ✏️ 一括編集
              </ActionButton>

              <ActionButton
                type="generate"
                onClick={addColumn}
                variant="primary"
                size="sm"
              >
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
            columns
              .sort((a, b) => a.order - b.order)
              .map((column, index) => (
                <div
                  key={column.id}
                  draggable
                  onDragStart={e => handleDragStart(e, column.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={e => handleDragOver(e, column.id)}
                  onDrop={e => handleDrop(e, column.id)}
                  className={`flex items-center gap-3 p-4 bg-gray-50 rounded-lg border transition-colors ${
                    draggedColumnId === column.id
                      ? 'border-blue-500 bg-blue-50 opacity-50 cursor-move'
                      : dragOverColumnId === column.id
                      ? 'border-blue-400 bg-blue-50 cursor-move'
                      : 'border-gray-200 hover:border-blue-300 cursor-move'
                  }`}
                >
                  {/* ドラッグハンドル */}
                  <div className="cursor-move text-gray-400 hover:text-blue-600 transition-colors">
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

                  {/* 複製ボタン */}
                  <ActionButton
                    type="copy"
                    onClick={() => duplicateColumn(column.id)}
                    variant="secondary"
                    size="sm"
                  >
                    📋
                  </ActionButton>

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
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-blue-800">
                  ⭐ プリセット選択
                </h3>
                <div className="flex items-center gap-2">
                  <ActionButton
                    type="copy"
                    onClick={() => setShowPresetImportExport(true)}
                    variant="secondary"
                    size="sm"
                  >
                    📥📤 インポート・エクスポート
                  </ActionButton>
                  <ActionButton
                    type="clear"
                    onClick={() => setShowPresets(false)}
                    variant="secondary"
                    size="sm"
                  >
                    ✕
                  </ActionButton>
                </div>
              </div>

              <div className="space-y-6">
                {Object.entries(CSV_PRESET_CATEGORIES).map(
                  ([categoryKey, category]) => (
                    <div
                      key={categoryKey}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      {/* カテゴリヘッダー */}
                      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                        <span className="text-2xl">{category.emoji}</span>
                        <div>
                          <h4 className="text-lg font-bold text-gray-800">
                            {category.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {category.description}
                          </p>
                        </div>
                      </div>

                      {/* プリセット一覧 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {category.presets.map(preset => (
                          <div
                            key={preset.id}
                            className="border border-blue-200 rounded-lg p-3 hover:border-blue-400 transition-colors bg-gradient-to-r from-blue-50 to-indigo-50"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-semibold text-blue-800 mb-1 text-sm">
                                  {preset.name}
                                </h5>
                                <p className="text-xs text-gray-600 mb-2">
                                  {preset.description}
                                </p>
                                <div className="flex flex-wrap gap-1">
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
                  )
                )}
              </div>

              {/* TDからのメッセージ */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 text-center">
                  🤖 <strong>TDからのTip:</strong>{' '}
                  プリセットを適用後も、カラムの追加・削除・並び替えが可能です。お気軽にカスタマイズしてくださいね♪
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* データ生成設定セクション */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
            <FileText className="h-5 w-5" />
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
              type="copy"
              onClick={() => setShowExportPreview(true)}
              disabled={columns.length === 0}
              variant="secondary"
              size="lg"
            >
              👁️ プレビュー
            </ActionButton>

            <ActionButton
              type="generate"
              onClick={generateData}
              disabled={isGenerating || columns.length === 0}
              loading={isGenerating}
              isActive={buttonStates.generate}
              variant="primary"
              size="lg"
            />

            <ActionButton
              type="download"
              onClick={exportToCSV}
              disabled={rows.length === 0 || isExporting}
              loading={isExporting}
              isActive={buttonStates.download}
              variant="accent"
            />
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
                    {columns
                      .sort((a, b) => a.order - b.order)
                      .map(column => (
                        <th
                          key={column.id}
                          draggable
                          onDragStart={e => handleDragStart(e, column.id)}
                          onDragEnd={handleDragEnd}
                          onDragOver={e => handleDragOver(e, column.id)}
                          onDrop={e => handleDrop(e, column.id)}
                          className={`px-4 py-2 text-left text-sm font-medium text-blue-800 border border-blue-200 cursor-move transition-colors ${
                            draggedColumnId === column.id
                              ? 'bg-blue-200 opacity-50'
                              : dragOverColumnId === column.id
                              ? 'bg-blue-100'
                              : 'hover:bg-blue-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-3 w-3 text-blue-600" />
                            {column.name}
                          </div>
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
                      {columns
                        .sort((a, b) => a.order - b.order)
                        .map(column => (
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

      {/* 一括編集モーダル */}
      {showBulkEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-blue-800">✏️ 一括編集</h3>
                <ActionButton
                  type="clear"
                  onClick={() => setShowBulkEdit(false)}
                  variant="secondary"
                  size="sm"
                >
                  ✕
                </ActionButton>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    対象カラム選択
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {columns.map(column => (
                      <label key={column.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedColumns.includes(column.id)}
                          onChange={() => toggleColumnSelection(column.id)}
                          className="mr-2"
                        />
                        <span className="text-sm">
                          {column.name} (
                          {getDataTypeInfo(column.dataType)?.label})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {selectedColumns.length > 0 && (
                  <div className="space-y-3 pt-3 border-t">
                    <p className="text-sm text-blue-600">
                      {selectedColumns.length}個のカラムが選択されています
                    </p>

                    {/* データタイプ変更セクション */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          📝 一括データタイプ変更
                        </label>
                        <select
                          value={bulkEditDataType}
                          onChange={e =>
                            setBulkEditDataType(e.target.value as DataType)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                        </select>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <ActionButton
                          type="replace"
                          onClick={() =>
                            performBulkEdit({
                              columnIds: selectedColumns,
                              operation: 'changeType',
                              value: bulkEditDataType,
                            })
                          }
                          variant="primary"
                          size="sm"
                        >
                          🔄 データタイプ変更
                        </ActionButton>

                        <ActionButton
                          type="replace"
                          onClick={() =>
                            performBulkEdit({
                              columnIds: selectedColumns,
                              operation: 'toggleRequired',
                            })
                          }
                          variant="secondary"
                          size="sm"
                        >
                          ✅ 必須切替
                        </ActionButton>

                        <ActionButton
                          type="clear"
                          onClick={() =>
                            performBulkEdit({
                              columnIds: selectedColumns,
                              operation: 'delete',
                            })
                          }
                          variant="danger"
                          size="sm"
                        >
                          🗑️ 削除
                        </ActionButton>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* テンプレート管理モーダル */}
      {showTemplateManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-blue-800">
                  📁 テンプレート管理
                </h3>
                <ActionButton
                  type="clear"
                  onClick={() => setShowTemplateManager(false)}
                  variant="secondary"
                  size="sm"
                >
                  ✕
                </ActionButton>
              </div>

              <div className="space-y-6">
                {/* 新規テンプレート保存 */}
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <h4 className="font-semibold text-blue-800 mb-3">
                    💾 新規テンプレート保存
                  </h4>
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      const formData = new FormData(
                        e.target as HTMLFormElement
                      );
                      const name = formData.get('templateName') as string;
                      const description = formData.get(
                        'templateDescription'
                      ) as string;
                      if (name.trim()) {
                        saveTemplate(name.trim(), description.trim());
                      }
                    }}
                  >
                    <div className="flex gap-3">
                      <input
                        type="text"
                        name="templateName"
                        placeholder="テンプレート名"
                        required
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        name="templateDescription"
                        placeholder="説明（任意）"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ActionButton
                        type="generate"
                        onClick={() => {}}
                        variant="primary"
                        size="sm"
                        disabled={columns.length === 0}
                      >
                        💾 保存
                      </ActionButton>
                    </div>
                  </form>
                </div>

                {/* 既存テンプレート一覧 */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">
                    保存済みテンプレート
                  </h4>
                  {templates.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      まだテンプレートが保存されていません
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {templates
                        .sort(
                          (a, b) => b.lastUsed.getTime() - a.lastUsed.getTime()
                        )
                        .map(template => (
                          <div
                            key={template.id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-800 mb-1">
                                  {template.name}
                                </h5>
                                <p className="text-sm text-gray-600 mb-2">
                                  {template.description ||
                                    'テンプレートの説明なし'}
                                </p>
                                <div className="text-xs text-gray-500">
                                  <span>
                                    カラム数: {template.settings.columns.length}{' '}
                                    |{' '}
                                  </span>
                                  <span>
                                    行数: {template.settings.rowCount} |{' '}
                                  </span>
                                  <span>
                                    最終使用:{' '}
                                    {template.lastUsed.toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <ActionButton
                                  type="copy"
                                  onClick={() => setTemplatePreview(template)}
                                  variant="secondary"
                                  size="sm"
                                >
                                  👁️ プレビュー
                                </ActionButton>
                                <ActionButton
                                  type="generate"
                                  onClick={() => loadTemplate(template.id)}
                                  variant="primary"
                                  size="sm"
                                >
                                  📂 読込
                                </ActionButton>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* テンプレートプレビューモーダル */}
      {templatePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-blue-800">
                  👁️ テンプレートプレビュー: {templatePreview.name}
                </h3>
                <ActionButton
                  type="clear"
                  onClick={() => setTemplatePreview(null)}
                  variant="secondary"
                  size="sm"
                >
                  ✕
                </ActionButton>
              </div>

              <div className="space-y-6">
                {/* テンプレート詳細情報 */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    📋 テンプレート情報
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">説明:</span>{' '}
                      {templatePreview.description || '説明なし'}
                    </div>
                    <div>
                      <span className="font-medium">作成日:</span>{' '}
                      {templatePreview.createdAt.toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">カラム数:</span>{' '}
                      {templatePreview.settings.columns.length}個
                    </div>
                    <div>
                      <span className="font-medium">行数設定:</span>{' '}
                      {templatePreview.settings.rowCount}行
                    </div>
                    <div>
                      <span className="font-medium">エンコード:</span>{' '}
                      {templatePreview.settings.exportSettings.encoding}
                    </div>
                    <div>
                      <span className="font-medium">区切り文字:</span>{' '}
                      {templatePreview.settings.exportSettings.delimiter === ','
                        ? 'カンマ'
                        : templatePreview.settings.exportSettings.delimiter ===
                          ';'
                        ? 'セミコロン'
                        : 'タブ'}
                    </div>
                  </div>
                </div>

                {/* カラム構成プレビュー */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">
                    📊 カラム構成
                  </h4>
                  <div className="space-y-2">
                    {templatePreview.settings.columns
                      .sort((a, b) => a.order - b.order)
                      .map((column, index) => (
                        <div
                          key={column.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border"
                        >
                          <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <span className="font-medium">{column.name}</span>
                            <span className="ml-2 text-sm text-gray-600">
                              ({getDataTypeInfo(column.dataType)?.label})
                            </span>
                          </div>
                          {column.required && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                              必須
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <ActionButton
                    type="generate"
                    onClick={() => {
                      loadTemplate(templatePreview.id);
                      setTemplatePreview(null);
                    }}
                    variant="primary"
                    size="sm"
                    className="flex-1"
                  >
                    📂 このテンプレートを読み込む
                  </ActionButton>
                  <ActionButton
                    type="clear"
                    onClick={() => setTemplatePreview(null)}
                    variant="secondary"
                    size="sm"
                  >
                    キャンセル
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* エクスポートプレビューモーダル */}
      {showExportPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-blue-800">
                  📊 エクスポートプレビュー
                </h3>
                <ActionButton
                  type="clear"
                  onClick={() => setShowExportPreview(false)}
                  variant="secondary"
                  size="sm"
                >
                  ✕
                </ActionButton>
              </div>

              <div className="space-y-6">
                {/* エクスポート設定 */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">
                    ⚙️ エクスポート設定
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">ファイル名:</span>{' '}
                      {exportSettings.filename}
                    </div>
                    <div>
                      <span className="font-medium">エンコード:</span>{' '}
                      {exportSettings.encoding}
                    </div>
                    <div>
                      <span className="font-medium">区切り文字:</span>{' '}
                      {exportSettings.delimiter === ','
                        ? 'カンマ (,)'
                        : exportSettings.delimiter === ';'
                        ? 'セミコロン (;)'
                        : 'タブ'}
                    </div>
                    <div>
                      <span className="font-medium">ヘッダー:</span>{' '}
                      {exportSettings.includeHeader ? '含む' : '含まない'}
                    </div>
                  </div>
                </div>

                {/* サンプルデータプレビュー */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">
                    📋 サンプルデータ (最初の5行)
                  </h4>
                  <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm font-mono">
                      {(() => {
                        const sampleRows = [];
                        const delimiter = exportSettings.delimiter;

                        // ヘッダー行
                        if (exportSettings.includeHeader) {
                          sampleRows.push(
                            columns.map(col => col.name).join(delimiter)
                          );
                        }

                        // サンプルデータ行 (5行)
                        for (let i = 0; i < Math.min(5, rowCount); i++) {
                          const row = columns.map(col => {
                            const dataTypeInfo = getDataTypeInfo(col.dataType);
                            return `[${dataTypeInfo?.label || 'データ'}${
                              i + 1
                            }]`;
                          });
                          sampleRows.push(row.join(delimiter));
                        }

                        return sampleRows.join('\n');
                      })()}
                    </pre>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <ActionButton
                    type="generate"
                    onClick={() => {
                      generateData();
                      setShowExportPreview(false);
                    }}
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    disabled={columns.length === 0}
                  >
                    🚀 データ生成実行
                  </ActionButton>
                  <ActionButton
                    type="clear"
                    onClick={() => setShowExportPreview(false)}
                    variant="secondary"
                    size="sm"
                  >
                    閉じる
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* プリセット・テンプレート インポート・エクスポートモーダル */}
      {showPresetImportExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-blue-800">
                  📥📤 プリセット・テンプレート管理
                </h3>
                <ActionButton
                  type="clear"
                  onClick={() => setShowPresetImportExport(false)}
                  variant="secondary"
                  size="sm"
                >
                  ✕
                </ActionButton>
              </div>

              <div className="space-y-6">
                {/* エクスポートセクション */}
                <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    📤 エクスポート
                  </h4>
                  <p className="text-sm text-green-700 mb-4">
                    現在のプリセットとテンプレートをJSONファイルとしてダウンロードします。
                    バックアップや他の環境への移行に使用できます。
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-medium">ユーザープリセット:</span>{' '}
                      {userPresets.length}個
                    </div>
                    <div>
                      <span className="font-medium">テンプレート:</span>{' '}
                      {templates.length}個
                    </div>
                  </div>
                  <ActionButton
                    type="download"
                    onClick={exportPresets}
                    variant="primary"
                    size="sm"
                    disabled={
                      userPresets.length === 0 && templates.length === 0
                    }
                  >
                    📦 エクスポート実行
                  </ActionButton>
                </div>

                {/* インポートセクション */}
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    📥 インポート
                  </h4>
                  <p className="text-sm text-blue-700 mb-4">
                    他の環境でエクスポートされたJSONファイルを読み込みます。
                    既存のプリセット・テンプレートに追加されます。
                  </p>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".json"
                      onChange={importPresets}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                    />
                    <div className="text-xs text-blue-600">
                      ⚠️
                      インポート時は既存データと重複チェックを行い、安全にマージします
                    </div>
                  </div>
                </div>

                {/* 注意事項 */}
                <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                  <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                    ⚠️ 注意事項
                  </h4>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    <li>• エクスポートデータには機密情報は含まれません</li>
                    <li>• インポート時は既存データは上書きされません</li>
                    <li>
                      • 同名のプリセット・テンプレートは自動的にリネームされます
                    </li>
                    <li>
                      • 定期的なエクスポートによるバックアップを推奨します
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <ActionButton
                  type="clear"
                  onClick={() => setShowPresetImportExport(false)}
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                >
                  閉じる
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default CSVTestDataGeneratorV2;
