import {
  BrewsConfig,
  BrewsEmotion,
  BrewsRole,
  BrewsRoleConfig,
} from '@/types/brews';

// 各役割の設定データ
export const BREWS_ROLE_CONFIGS: BrewsRoleConfig = {
  password: {
    name: 'パスワード醸造',
    icon: 'Shield',
    color: 'blue',
    description: 'セキュアなパスワード生成',
    messages: {
      happy: 'Brews のパスワード担当です！安全なパスワードを生成しますよ',
      excited: '強力なパスワードを醸造中です！🛡️',
      working: 'セキュアなパスワードを生成しています...',
      thinking: 'どんな強度のパスワードにしましょうか？',
      success: '完璧に安全なパスワードができました！',
      error: 'パスワード生成でエラーが発生しました',
      warning: 'パスワード設定にご注意ください',
      sleepy: 'セキュリティチェック中です...💤',
      brewing: '🛡️ パスワードを醸造中...',
      completed: 'パスワード生成完了です！',
    },
  },
  personal: {
    name: '個人情報醸造',
    icon: 'User',
    color: 'green',
    description: '個人情報データ生成',
    messages: {
      happy: 'Brews の個人情報担当です！リアルなデータを生成します',
      excited: '個人情報データを醸造中です！👤',
      working: '個人情報データを生成しています...',
      thinking: 'どんな個人情報が必要でしょうか？',
      success: 'リアルな個人情報データができました！',
      error: '個人情報生成でエラーが発生しました',
      warning: '個人情報の取り扱いにご注意ください',
      sleepy: 'データ整理中です...💤',
      brewing: '👤 個人情報を醸造中...',
      completed: '個人情報生成完了です！',
    },
  },
  csv: {
    name: 'CSV醸造',
    icon: 'FileSpreadsheet',
    color: 'purple',
    description: 'CSV形式データ生成',
    messages: {
      happy: 'Brews の CSV 担当です！構造化データを生成します',
      excited: 'CSV データを醸造中です！📊',
      working: 'CSV ファイルを生成しています...',
      thinking: 'どんな CSV 構造にしましょうか？',
      success: 'きれいな CSV データができました！',
      error: 'CSV 生成でエラーが発生しました',
      warning: 'CSV フォーマットにご注意ください',
      sleepy: 'データ整列中です...💤',
      brewing: '📊 CSV を醸造中...',
      completed: 'CSV 生成完了です！',
    },
  },
  json: {
    name: 'JSON醸造',
    icon: 'FileText',
    color: 'indigo',
    description: 'JSON形式データ生成',
    messages: {
      happy: 'Brews の JSON 担当です！構造化データを生成します',
      excited: 'JSON データを醸造中です！📄',
      working: 'JSON データを生成しています...',
      thinking: 'どんな JSON 構造にしましょうか？',
      success: '完璧な JSON データができました！',
      error: 'JSON 生成でエラーが発生しました',
      warning: 'JSON フォーマットにご注意ください',
      sleepy: 'データ構造化中です...💤',
      brewing: '📄 JSON を醸造中...',
      completed: 'JSON 生成完了です！',
    },
  },
  text: {
    name: 'テキスト醸造',
    icon: 'Type',
    color: 'yellow',
    description: 'テキストデータ生成',
    messages: {
      happy: 'Brews のテキスト担当です！文章データを生成します',
      excited: 'テキストデータを醸造中です！✏️',
      working: 'テキストデータを生成しています...',
      thinking: 'どんなテキストにしましょうか？',
      success: '素晴らしいテキストができました！',
      error: 'テキスト生成でエラーが発生しました',
      warning: 'テキスト設定にご注意ください',
      sleepy: '文章作成中です...💤',
      brewing: '✏️ テキストを醸造中...',
      completed: 'テキスト生成完了です！',
    },
  },
  number: {
    name: '数値醸造',
    icon: 'Calculator',
    color: 'red',
    description: '数値データ生成',
    messages: {
      happy: 'Brews の数値担当です！計算データを生成します',
      excited: '数値データを醸造中です！🧮',
      working: '数値データを生成しています...',
      thinking: 'どんな数値範囲にしましょうか？',
      success: '正確な数値データができました！',
      error: '数値生成でエラーが発生しました',
      warning: '数値範囲にご注意ください',
      sleepy: '計算中です...💤',
      brewing: '🧮 数値を醸造中...',
      completed: '数値生成完了です！',
    },
  },
  datetime: {
    name: '日時醸造',
    icon: 'Calendar',
    color: 'pink',
    description: '日付・時刻データ生成',
    messages: {
      happy: 'Brews の日時担当です！時間データを生成します',
      excited: '日時データを醸造中です！📅',
      working: '日時データを生成しています...',
      thinking: 'どんな時間範囲にしましょうか？',
      success: '正確な日時データができました！',
      error: '日時生成でエラーが発生しました',
      warning: '日時フォーマットにご注意ください',
      sleepy: '時間調整中です...💤',
      brewing: '📅 日時を醸造中...',
      completed: '日時生成完了です！',
    },
  },
  uuid: {
    name: 'UUID醸造',
    icon: 'Hash',
    color: 'teal',
    description: 'UUID・識別子生成',
    messages: {
      happy: 'Brews の UUID 担当です！ユニークな識別子を生成します',
      excited: 'UUID データを醸造中です！#️⃣',
      working: 'UUID を生成しています...',
      thinking: 'どんな UUID フォーマットにしましょうか？',
      success: 'ユニークな UUID ができました！',
      error: 'UUID 生成でエラーが発生しました',
      warning: 'UUID フォーマットにご注意ください',
      sleepy: '識別子生成中です...💤',
      brewing: '#️⃣ UUID を醸造中...',
      completed: 'UUID 生成完了です！',
    },
  },
  security: {
    name: 'セキュリティ担当',
    icon: 'Lock',
    color: 'gray',
    description: 'セキュリティチェック',
    messages: {
      happy: 'Brews のセキュリティ担当です！安全性をチェックします',
      excited: 'セキュリティ強化中です！🔒',
      working: 'セキュリティチェック中です...',
      thinking: 'セキュリティ設定を確認しましょう',
      success: 'セキュリティチェック完了！安全です',
      error: 'セキュリティ問題を検出しました',
      warning: 'セキュリティにご注意ください',
      sleepy: '監視中です...💤',
      brewing: '🔒 セキュリティを醸造中...',
      completed: 'セキュリティチェック完了です！',
    },
  },
  quality: {
    name: '品質管理担当',
    icon: 'CheckCircle',
    color: 'emerald',
    description: 'データ品質管理',
    messages: {
      happy: 'Brews の品質管理担当です！データ品質をチェックします',
      excited: '品質向上中です！✅',
      working: '品質チェック中です...',
      thinking: '品質基準を確認しましょう',
      success: '品質チェック完了！完璧です',
      error: '品質問題を検出しました',
      warning: '品質にご注意ください',
      sleepy: '品質監視中です...💤',
      brewing: '✅ 品質を醸造中...',
      completed: '品質チェック完了です！',
    },
  },
  ai: {
    name: 'AI連携担当',
    icon: 'Bot',
    color: 'violet',
    description: 'AI機能との連携',
    messages: {
      happy: 'Brews の AI 連携担当です！AI 機能を活用します',
      excited: 'AI パワー全開です！🤖',
      working: 'AI 処理中です...',
      thinking: 'AI にどう指示しましょうか？',
      success: 'AI 処理完了！素晴らしい結果です',
      error: 'AI 処理でエラーが発生しました',
      warning: 'AI 設定にご注意ください',
      sleepy: 'AI 学習中です...💤',
      brewing: '🤖 AI を醸造中...',
      completed: 'AI 処理完了です！',
    },
  },
  support: {
    name: 'サポート担当',
    icon: 'Coffee',
    color: 'orange',
    description: '全般サポート',
    messages: {
      happy: 'Brews のサポート担当です！何でもお手伝いします',
      excited: 'お手伝いできることがあって嬉しいです！☕',
      working: 'サポート対応中です...',
      thinking: 'どのようにお手伝いしましょうか？',
      success: '問題解決できました！お役に立てて嬉しいです',
      error: '申し訳ありません。サポートいたします',
      warning: '何か心配なことがあればお聞かせください',
      sleepy: '待機中です...☕',
      brewing: '☕ サポートを醸造中...',
      completed: 'サポート完了です！',
    },
  },
};

export const getBrewsConfig = (role: BrewsRole): BrewsConfig => {
  return BREWS_ROLE_CONFIGS[role] || BREWS_ROLE_CONFIGS.support;
};

export const getDefaultMessage = (
  role: BrewsRole,
  emotion: BrewsEmotion
): string => {
  const config = getBrewsConfig(role);
  return config.messages[emotion] || config.messages.happy;
};

export const getColorClasses = (
  color: string,
  emotion: BrewsEmotion
): string => {
  const baseColors: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
    green: 'text-green-600 bg-green-50 border-green-200',
    purple: 'text-purple-600 bg-purple-50 border-purple-200',
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    red: 'text-red-600 bg-red-50 border-red-200',
    pink: 'text-pink-600 bg-pink-50 border-pink-200',
    teal: 'text-teal-600 bg-teal-50 border-teal-200',
    gray: 'text-gray-600 bg-gray-50 border-gray-200',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    violet: 'text-violet-600 bg-violet-50 border-violet-200',
    orange: 'text-orange-600 bg-orange-50 border-orange-200',
  };

  const emotionOverrides: Partial<Record<BrewsEmotion, string>> = {
    error: 'text-red-600 bg-red-50 border-red-200',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    success: 'text-green-600 bg-green-50 border-green-200',
  };

  return emotionOverrides[emotion] || baseColors[color] || baseColors.orange;
};

export const getAnimationClasses = (animation: string): string => {
  const animations: Record<string, string> = {
    bounce: 'brews-bounce',
    wiggle: 'brews-wiggle',
    pulse: 'brews-pulse',
    spin: 'animate-spin',
    heartbeat: 'brews-heartbeat',
    float: 'brews-float',
    none: '',
  };

  return animations[animation] || '';
};

export const getSizeClasses = (size: string): string => {
  const sizes: Record<string, string> = {
    small: 'w-8 h-8 text-lg flex items-center justify-center rounded-full',
    medium: 'w-12 h-12 text-xl flex items-center justify-center rounded-full',
    large: 'w-16 h-16 text-2xl flex items-center justify-center rounded-full',
  };

  return sizes[size] || sizes.medium;
};
