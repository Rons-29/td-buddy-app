import { PasswordPreset } from '../types/password';

export const DEFAULT_PASSWORD_PRESETS: PasswordPreset[] = [
  // セキュリティ重視
  {
    id: 'high-security',
    name: '高セキュリティ',
    description: '銀行・金融機関レベルの高セキュリティパスワード',
    icon: '🛡️',
    category: 'security',
    isDefault: true,
    criteria: {
      length: 16,
      count: 1,
      mustIncludeCharTypes: ['numbers', 'uppercase', 'lowercase', 'symbols']
    }
  },
  {
    id: 'num-upper-lower-symbol',
    name: '数字・大文字・小文字・記号',
    description: '0-9、A-Z、a-z、記号 から各1文字以上',
    icon: '🔐',
    category: 'security',
    isDefault: true,
    criteria: {
      length: 16,
      count: 3,
      mustIncludeCharTypes: ['numbers', 'uppercase', 'lowercase', 'symbols']
    }
  },
  
  // カスタム
  {
    id: 'custom-symbols',
    name: 'カスタム記号',
    description: '数字・大文字・小文字・カスタム記号を必ず含む',
    icon: '🎨',
    category: 'custom',
    isDefault: true,
    criteria: {
      length: 14,
      count: 5,
      mustIncludeCharTypes: ['numbers', 'uppercase', 'lowercase'],
      customSymbols: '$@_#&?'
    }
  },
  {
    id: 'custom-charsets',
    name: 'カスタム文字種',
    description: '文字種を自由に指定',
    icon: '⚡',
    category: 'custom',
    isDefault: true,
    criteria: {
      length: 16,
      count: 10,
      customCharacters: ''
    }
  },
  
  // Web・アプリ
  {
    id: 'web-standard',
    name: 'Web標準',
    description: 'Webサービスでよく使われる標準的なパスワード',
    icon: '🌐',
    category: 'web',
    isDefault: true,
    criteria: {
      length: 12,
      count: 3,
      mustIncludeCharTypes: ['numbers', 'uppercase', 'lowercase']
    }
  },
  {
    id: 'num-upper-lower',
    name: '数字・大文字・小文字',
    description: '0-9、A-Z、a-z から各1文字以上',
    icon: '🔤',
    category: 'web',
    isDefault: true,
    criteria: {
      length: 12,
      count: 3,
      mustIncludeCharTypes: ['numbers', 'uppercase', 'lowercase']
    }
  },
  
  // エンタープライズ
  {
    id: 'enterprise-policy',
    name: 'エンタープライズポリシー',
    description: '企業のパスワードポリシーに準拠',
    icon: '🏢',
    category: 'enterprise',
    isDefault: true,
    criteria: {
      length: 14,
      count: 5,
      mustIncludeCharTypes: ['numbers', 'uppercase', 'lowercase', 'symbols']
    }
  },
  
  // その他
  {
    id: 'none',
    name: 'デフォルト',
    description: '選択された文字種からランダム生成',
    icon: '⚙️',
    category: 'other',
    isDefault: true,
    criteria: {
      length: 12,
      count: 1
    }
  }
];

export const PRESET_CATEGORIES = {
  security: {
    label: 'セキュリティ重視',
    description: '高いセキュリティが求められる用途',
    color: 'red',
    icon: '🛡️'
  },
  custom: {
    label: 'カスタム',
    description: '柔軟な設定が可能',
    color: 'green',
    icon: '🎨'
  },
  web: {
    label: 'Web・アプリ',
    description: 'Webサービスやアプリケーション用',
    color: 'blue',
    icon: '🌐'
  },
  enterprise: {
    label: 'エンタープライズ',
    description: '企業・組織での利用',
    color: 'purple',
    icon: '🏢'
  },
  other: {
    label: 'その他',
    description: '自由入力・その他の設定',
    color: 'gray',
    icon: '📝'
  }
} as const;

// よく使用される記号セット
export const COMMON_SYMBOL_SETS = [
  {
    name: '基本記号',
    symbols: '!@#$%^&*()',
    description: 'キーボードで入力しやすい基本的な記号'
  },
  {
    name: '安全記号',
    symbols: '$@_#&?',
    description: 'URLやファイル名でも安全に使用できる記号'
  },
  {
    name: '数学記号',
    symbols: '+-=/*<>',
    description: '数学的な記号を含む'
  },
  {
    name: 'フル記号',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    description: 'すべての一般的な記号'
  }
];

// 除外したい文字セット
export const EXCLUSION_SETS = {
  ambiguous: {
    name: '紛らわしい文字',
    chars: 'il1Lo0O',
    description: '見た目が似ていて間違いやすい文字'
  },
  similar: {
    name: '似ている文字',
    chars: 'il1Lo0O69qbdpPG8B',
    description: 'フォントによっては区別が困難な文字'
  }
} as const; 