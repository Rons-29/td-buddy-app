// データベースエンティティの型定義

// 1. 生成されたパスワードエンティティ
export interface GeneratedPassword {
  id: number;
  password_hash: string;
  criteria: string; // JSON文字列
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  estimated_crack_time: string;
  created_at: string;
  expires_at: string;
  user_session_id?: string;
  ip_address?: string;
  user_agent?: string;
}

// パスワード挿入用の型
export interface InsertGeneratedPassword {
  password_hash: string;
  criteria: string;
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  estimated_crack_time: string;
  expires_at: string;
  user_session_id?: string;
  ip_address?: string;
  user_agent?: string;
}

// 2. 生成された個人情報エンティティ
export interface GeneratedPersonalInfo {
  id: number;
  data_json: string; // JSON文字列
  criteria: string; // JSON文字列
  locale: string;
  record_count: number;
  created_at: string;
  expires_at: string;
  user_session_id?: string;
  ip_address?: string;
}

// 個人情報挿入用の型
export interface InsertGeneratedPersonalInfo {
  data_json: string;
  criteria: string;
  locale: string;
  record_count: number;
  expires_at: string;
  user_session_id?: string;
  ip_address?: string;
}

// 3. Claude AI生成データエンティティ
export interface ClaudeGeneratedData {
  id: number;
  prompt: string;
  generated_data: string; // JSON文字列
  data_type: 'text' | 'json' | 'csv' | 'sql' | 'xml';
  token_usage_input: number;
  token_usage_output: number;
  processing_time_ms: number;
  created_at: string;
  expires_at: string;
  user_session_id?: string;
  claude_model: string;
}

// Claude AI データ挿入用の型
export interface InsertClaudeGeneratedData {
  prompt: string;
  generated_data: string;
  data_type: 'text' | 'json' | 'csv' | 'sql' | 'xml';
  token_usage_input: number;
  token_usage_output: number;
  processing_time_ms: number;
  expires_at: string;
  user_session_id?: string;
  claude_model: string;
}

// 4. システム設定エンティティ
export interface SystemSetting {
  id: number;
  key: string;
  value: string;
  description?: string;
  updated_at: string;
}

// システム設定挿入・更新用の型
export interface UpsertSystemSetting {
  key: string;
  value: string;
  description?: string;
}

// 5. API使用統計エンティティ
export interface ApiUsageStat {
  id: number;
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms: number;
  user_session_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// API統計挿入用の型
export interface InsertApiUsageStat {
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms: number;
  user_session_id?: string;
  ip_address?: string;
  user_agent?: string;
}

// 6. エラーログエンティティ
export interface ErrorLog {
  id: number;
  error_code: string;
  error_message: string;
  stack_trace?: string;
  request_path?: string;
  request_method?: string;
  user_session_id?: string;
  ip_address?: string;
  created_at: string;
}

// エラーログ挿入用の型
export interface InsertErrorLog {
  error_code: string;
  error_message: string;
  stack_trace?: string;
  request_path?: string;
  request_method?: string;
  user_session_id?: string;
  ip_address?: string;
}

// データベース統計情報
export interface DatabaseStats {
  passwords: { count: number };
  personalInfo: { count: number };
  claudeData: { count: number };
  apiCalls: { count: number };
  errors: { count: number };
  dbSize: number;
}

// クリーンアップ結果
export interface CleanupResult {
  passwords: number;
  personalInfo: number;
  claudeData: number;
  totalDeleted: number;
}

// データ保持設定
export interface DataRetentionSettings {
  passwordRetentionHours: number;
  personalInfoRetentionHours: number;
  claudeDataRetentionHours: number;
  logRetentionDays: number;
}

// クエリ結果の共通型
export interface QueryResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  rowsAffected?: number;
  lastInsertId?: number | bigint;
}

// ページネーション用クエリパラメータ
export interface DatabasePaginationParams {
  limit: number;
  offset: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  where?: Record<string, any>;
}

// ページネーション結果
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// データベース接続設定
export interface DatabaseConfig {
  path: string;
  maxConnections?: number;
  timeout?: number;
  readonly?: boolean;
  verbose?: boolean;
}

// マイグレーション用の型
export interface Migration {
  version: number;
  name: string;
  sql: string;
  rollback?: string;
  description?: string;
}

// バックアップ設定
export interface BackupConfig {
  enabled: boolean;
  schedule: string; // cron形式
  retentionDays: number;
  compressionEnabled: boolean;
  backupPath: string;
}

// トランザクション設定
export interface TransactionOptions {
  timeout?: number;
  retries?: number;
  isolationLevel?: 'READ_UNCOMMITTED' | 'READ_COMMITTED' | 'REPEATABLE_READ' | 'SERIALIZABLE';
}

// TDシステム用の特別な型
export interface TDSystemInfo {
  version: string;
  environment: string;
  databaseVersion: string;
  totalRecords: number;
  storageUsed: number;
  lastCleanup: string;
  status: 'healthy' | 'warning' | 'error';
  brewMessage: string;
}

// ==================================================
// 🆕 Step 14: 新データタイプ - UUID/GUID 生成用データベース型
// ==================================================

// 生成されたUUIDエンティティ
export interface GeneratedUuid {
  id: number;
  uuid_value: string;               // 生成されたUUID値
  version: string;                  // UUIDバージョン (v1, v4, v6, v7)
  format: string;                   // 出力フォーマット
  criteria: string;                 // 生成条件（JSON文字列）
  metadata: string;                 // メタデータ（JSON文字列）
  created_at: string;
  expires_at: string;
  user_session_id?: string;
  ip_address?: string;
  user_agent?: string;
}

// UUID挿入用の型
export interface InsertGeneratedUuid {
  uuid_value: string;
  version: string;
  format: string;
  criteria: string;
  metadata: string;
  expires_at: string;
  user_session_id?: string;
  ip_address?: string;
  user_agent?: string;
} 