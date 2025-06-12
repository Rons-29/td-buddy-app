// ==================================================
// 🆔 UUID/GUID 生成関連の型定義
// ==================================================

// UUID生成リクエスト
export interface UuidGenerateRequest {
  count: number; // 醸造個数 (1-10000)
  version: 'v1' | 'v4' | 'v6' | 'v7' | 'mixed'; // UUIDバージョン
  format: 'standard' | 'compact' | 'uppercase' | 'with-prefix' | 'sql-friendly'; // 出力フォーマット
  includeTimestamp?: boolean; // タイムスタンプ付きの場合 (v1, v6, v7)
  includeMacAddress?: boolean; // MACアドレス付きの場合 (v1)
  namespace?: string; // 名前空間指定 (v3, v5)
  customPrefix?: string; // カスタムプレフィックス
}

// UUID生成アイテム
export interface UuidItem {
  id: string; // 一意識別子
  uuid: string; // 生成されたUUID
  version: string; // 使用したバージョン
  format: string; // 適用したフォーマット
  timestamp?: string | undefined; // タイムスタンプ (該当する場合)
  macAddress?: string | undefined; // MACアドレス (該当する場合)
  namespace?: string | undefined; // 名前空間 (該当する場合)
  generatedAt: string; // 生成日時
  metadata: {
    isValid: boolean; // UUID形式の妥当性
    entropy: number; // エントロピー値
    randomness: 'low' | 'medium' | 'high' | 'cryptographic'; // ランダム性レベル
  };
}

// UUID生成レスポンス
export interface UuidGenerateResponse {
  uuids: UuidItem[];
  criteria: UuidGenerateRequest;
  statistics: {
    totalGenerated: number;
    versionDistribution: Record<string, number>;
    formatDistribution: Record<string, number>;
    averageEntropy: number;
  };
  metadata?: {
    isValid: boolean;
    entropy: number;
    randomness: 'low' | 'medium' | 'high' | 'cryptographic';
  };
  generatedAt: string;
  expiresAt: string;
}

// UUID検証リクエスト
export interface UuidValidateRequest {
  uuids: string[]; // 検証対象のUUID配列
  strictMode?: boolean; // 厳密検証モード
  checkDuplicates?: boolean; // 重複チェック
}

// UUID検証レスポンス
export interface UuidValidateResponse {
  results: Array<{
    uuid: string;
    isValid: boolean;
    version?: string | undefined;
    errors?: string[] | undefined;
    warnings?: string[] | undefined;
  }>;
  summary: {
    totalChecked: number;
    validCount: number;
    invalidCount: number;
    duplicateCount: number;
  };
}

// API共通レスポンス型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    statusCode: number;
    brewMessage: string;
    timestamp: string;
    path: string;
    method: string;
    stack?: string;
    details?: any;
  };
  message?: string;
  brewMessage?: string;
  timestamp: string;
  metadata?: {
    page?: number;
    limit?: number;
    total?: number;
    duration?: number;
  };
}

// Brewキャラクター状態
export interface TDState {
  emotion: 'happy' | 'excited' | 'thinking' | 'success' | 'curious' | 'error';
  animation: 'float' | 'bounce' | 'wiggle' | 'spin' | 'pulse';
  message: string;
  showSpeechBubble: boolean;
}

// UUIDプリセット
export interface UuidPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: Partial<UuidGenerateRequest>;
  useCase: string;
  examples: string[];
}

// UUID統計情報
export interface UuidStatistics {
  totalGenerated: number;
  versionDistribution: Record<string, number>;
  formatDistribution: Record<string, number>;
  recentActivity: Array<{
    version: string;
    format: string;
    created_at: string;
    count: number;
  }>;
}

// UUID履歴項目
export interface UuidHistoryItem {
  id: number;
  uuid_value: string;
  version: string;
  format: string;
  created_at: string;
  criteria: UuidGenerateRequest;
}

// UUID履歴レスポンス
export interface UuidHistoryResponse {
  history: UuidHistoryItem[];
  total: number;
}
