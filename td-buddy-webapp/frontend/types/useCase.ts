/**
 * 活用例表示UI機能の型定義
 * TD Buddy - UseCase Showcase Types
 * 
 * @description UseCaseShowcaseコンポーネントで使用する型定義
 * @version 1.0.0
 * @created 2024-12-19
 */

export type ExportFormat = 'csv' | 'json' | 'xml' | 'yaml' | 'sql';

export type UseCaseCategory = 'security' | 'performance' | 'automation' | 'integration' | 'debug';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UseCaseConfig {
  format: ExportFormat;
  count: number;
  options?: Record<string, any>;
}

export interface UseCaseExample {
  id: string;
  title: string;
  description: string;
  category: UseCaseCategory;
  format: ExportFormat;
  scenario: string;
  config: UseCaseConfig;
  codeExample: string;
  benefits: string[];
  difficulty: DifficultyLevel;
}

export interface CategoryInfo {
  icon: any; // Lucide Icon component
  label: string;
  color: string;
}

export interface DifficultyInfo {
  label: string;
  color: string;
}

export interface UseCaseState {
  activeCategory: string;
  currentIndex: number;
  copiedCode: string | null;
  isConfigApplying: boolean;
}

export interface ApplyConfigEvent extends CustomEvent {
  detail: UseCaseConfig;
}

// カテゴリ情報の定数
export const CATEGORY_COLORS = {
  security: 'red',
  performance: 'yellow',
  automation: 'blue',
  integration: 'green',
  debug: 'purple'
} as const;

// 難易度情報の定数
export const DIFFICULTY_COLORS = {
  beginner: 'green',
  intermediate: 'yellow',
  advanced: 'red'
} as const; 