export type BrewsRole =
  | 'password'
  | 'personal'
  | 'csv'
  | 'json'
  | 'text'
  | 'number'
  | 'datetime'
  | 'uuid'
  | 'security'
  | 'quality'
  | 'ai'
  | 'support';

export type BrewsEmotion =
  | 'happy'
  | 'excited'
  | 'working'
  | 'thinking'
  | 'success'
  | 'error'
  | 'warning'
  | 'sleepy'
  | 'brewing'
  | 'completed';

export type BrewsSize = 'small' | 'medium' | 'large';

export type BrewsAnimation =
  | 'bounce'
  | 'wiggle'
  | 'pulse'
  | 'spin'
  | 'heartbeat'
  | 'float'
  | 'none';

export interface BrewsConfig {
  name: string;
  icon: string;
  color: string;
  description: string;
  messages: Record<BrewsEmotion, string>;
}

export interface BrewsState {
  role: BrewsRole;
  emotion: BrewsEmotion;
  message: string;
  isActive: boolean;
  lastAction: Date;
}

export interface BrewsIconProps {
  role?: BrewsRole;
  emotion?: BrewsEmotion;
  size?: BrewsSize;
  animation?: BrewsAnimation;
  message?: string;
  showBubble?: boolean;
  className?: string;
  onClick?: () => void;
}

// 既存のBrewCharacterとの互換性のためのtype alias
export type BrewEmotion = BrewsEmotion;
export type BrewAnimation = BrewsAnimation;

// 各役割のデフォルト設定
export interface BrewsRoleConfig {
  [key: string]: BrewsConfig;
}
