import { UuidPreset } from '../types/uuid';

// 🆔 UUID生成プリセット定義
export const DEFAULT_UUID_PRESETS: Record<string, UuidPreset> = {
  'v4-standard': {
    id: 'v4-standard',
    name: '標準UUID (v4)',
    description: '最も一般的なランダムUUID。データベースID、セッションIDに最適',
    icon: '🎲',
    criteria: {
      version: 'v4',
      format: 'standard',
      count: 5
    },
    useCase: 'データベースの主キー、API キー、セッション管理',
    examples: [
      'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
    ]
  },

  'v1-timestamp': {
    id: 'v1-timestamp',
    name: 'タイムスタンプUUID (v1)',
    description: '時系列順序が保証されるUUID。ログ管理、監査証跡に最適',
    icon: '⏰',
    criteria: {
      version: 'v1',
      format: 'standard',
      count: 3,
      includeTimestamp: true
    },
    useCase: 'ログ管理、監査証跡、時系列データ',
    examples: [
      '550e8400-e29b-41d4-a716-446655440000',
      '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
    ]
  },

  'v7-modern': {
    id: 'v7-modern',
    name: 'モダンUUID (v7)',
    description: '最新のUUID標準。高性能で時系列順序も保証',
    icon: '🚀',
    criteria: {
      version: 'v7',
      format: 'standard',
      count: 5,
      includeTimestamp: true
    },
    useCase: '新規システム開発、高性能アプリケーション',
    examples: [
      '018f4b94-59b2-7000-8000-000000000000',
      '018f4b94-59b3-7000-8000-000000000001'
    ]
  },

  'compact-format': {
    id: 'compact-format',
    name: 'コンパクト形式',
    description: 'ハイフンなしの32文字UUID。URL短縮、ファイル名に最適',
    icon: '📏',
    criteria: {
      version: 'v4',
      format: 'compact',
      count: 10
    },
    useCase: 'URL短縮、ファイル名、トークン生成',
    examples: [
      'f47ac10b58cc4372a5670e02b2c3d479',
      '6ba7b8109dad11d180b400c04fd430c8'
    ]
  },

  'sql-ready': {
    id: 'sql-ready',
    name: 'SQL対応形式',
    description: 'シングルクォート付きでSQL文に直接使用可能',
    icon: '🗄️',
    criteria: {
      version: 'v4',
      format: 'sql-friendly',
      count: 5
    },
    useCase: 'SQLクエリ、データベース挿入文',
    examples: [
      "'f47ac10b-58cc-4372-a567-0e02b2c3d479'",
      "'6ba7b810-9dad-11d1-80b4-00c04fd430c8'"
    ]
  },

  'prefixed-ids': {
    id: 'prefixed-ids',
    name: 'プレフィックス付きID',
    description: 'カスタムプレフィックス付きUUID。システム識別に便利',
    icon: '🏷️',
    criteria: {
      version: 'v4',
      format: 'with-prefix',
      count: 3,
      customPrefix: 'user_'
    },
    useCase: 'ユーザーID、リソース識別子',
    examples: [
      'user_f47ac10b-58cc-4372-a567-0e02b2c3d479',
      'order_6ba7b810-9dad-11d1-80b4-00c04fd430c8'
    ]
  },

  'bulk-generation': {
    id: 'bulk-generation',
    name: '大量醸造',
    description: '一度に大量のUUIDを生成。テストデータ作成に最適',
    icon: '📦',
    criteria: {
      version: 'v4',
      format: 'standard',
      count: 100
    },
    useCase: 'テストデータ作成、負荷テスト、一括処理',
    examples: [
      '大量のUUIDを効率的に生成',
      'テストデータベースの初期化'
    ]
  },

  'mixed-versions': {
    id: 'mixed-versions',
    name: 'ミックス生成',
    description: '複数バージョンをランダムに混合。多様性が必要な場合に',
    icon: '🎭',
    criteria: {
      version: 'mixed',
      format: 'standard',
      count: 10
    },
    useCase: 'システムテスト、多様性の確保',
    examples: [
      'v1, v4, v6, v7 が混在',
      '異なる特性のUUIDを取得'
    ]
  },

  'uppercase-format': {
    id: 'uppercase-format',
    name: '大文字フォーマット',
    description: '大文字のUUID。一部システムの要件に対応',
    icon: '🔤',
    criteria: {
      version: 'v4',
      format: 'uppercase',
      count: 5
    },
    useCase: 'レガシーシステム連携、特定の形式要件',
    examples: [
      'F47AC10B-58CC-4372-A567-0E02B2C3D479',
      '6BA7B810-9DAD-11D1-80B4-00C04FD430C8'
    ]
  },

  'testing-suite': {
    id: 'testing-suite',
    name: 'テストスイート',
    description: 'テスト用に最適化された設定。様々なパターンを生成',
    icon: '🧪',
    criteria: {
      version: 'v4',
      format: 'standard',
      count: 20
    },
    useCase: 'ユニットテスト、結合テスト、QA作業',
    examples: [
      'テストケース用の一意ID',
      'モックデータの生成'
    ]
  }
};

// プリセット順序定義
export const PRESET_ORDER = [
  'v4-standard',
  'v1-timestamp', 
  'v7-modern',
  'compact-format',
  'sql-ready',
  'prefixed-ids',
  'bulk-generation',
  'mixed-versions',
  'uppercase-format',
  'testing-suite'
];

// カテゴリ別プリセット
export const PRESET_CATEGORIES = {
  '基本形式': ['v4-standard', 'v1-timestamp', 'v7-modern'],
  'フォーマット': ['compact-format', 'sql-ready', 'prefixed-ids', 'uppercase-format'],
  '用途別': ['bulk-generation', 'mixed-versions', 'testing-suite']
};

// プリセット取得ヘルパー
export function getPresetById(id: string): UuidPreset | undefined {
  return DEFAULT_UUID_PRESETS[id];
}

export function getAllPresets(): UuidPreset[] {
  return PRESET_ORDER.map(id => DEFAULT_UUID_PRESETS[id]);
}

export function getPresetsByCategory(category: string): UuidPreset[] {
  const presetIds = PRESET_CATEGORIES[category as keyof typeof PRESET_CATEGORIES] || [];
  return presetIds.map(id => DEFAULT_UUID_PRESETS[id]);
} 