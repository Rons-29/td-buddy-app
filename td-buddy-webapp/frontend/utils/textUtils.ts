/**
 * 文字・テキスト処理ユーティリティ
 * TestData Buddy - 文字・テキスト系ツール用
 */

// 文字種別の定義
export interface CharacterType {
  hiragana: number;
  katakana: number;
  kanji: number;
  alphabet: number;
  number: number;
  symbol: number;
  space: number;
  other: number;
}

// 文字統計の型定義
export interface TextStatistics {
  totalCharacters: number;
  totalBytes: number;
  totalLines: number;
  characterTypes: CharacterType;
  encoding: {
    utf8: number;
    shiftJis: number;
    eucJp: number;
  };
}

/**
 * 文字種別を判定
 */
export function getCharacterType(char: string): keyof CharacterType {
  const code = char.charCodeAt(0);
  
  // ひらがな (U+3040-U+309F)
  if (code >= 0x3040 && code <= 0x309F) {
    return 'hiragana';
  }
  
  // カタカナ (U+30A0-U+30FF)
  if (code >= 0x30A0 && code <= 0x30FF) {
    return 'katakana';
  }
  
  // 漢字 (U+4E00-U+9FAF)
  if (code >= 0x4E00 && code <= 0x9FAF) {
    return 'kanji';
  }
  
  // 英字
  if (/[a-zA-Z]/.test(char)) {
    return 'alphabet';
  }
  
  // 数字
  if (/[0-9]/.test(char)) {
    return 'number';
  }
  
  // 空白・改行
  if (/\s/.test(char)) {
    return 'space';
  }
  
  // 記号・特殊文字
  if (/[!-/:-@\[-`{-~]/.test(char) || /[！-／：-＠［-｀｛-～]/.test(char)) {
    return 'symbol';
  }
  
  return 'other';
}

/**
 * テキストの詳細統計を取得
 */
export function analyzeText(text: string): TextStatistics {
  const lines = text.split('\n');
  const characterTypes: CharacterType = {
    hiragana: 0,
    katakana: 0,
    kanji: 0,
    alphabet: 0,
    number: 0,
    symbol: 0,
    space: 0,
    other: 0
  };
  
  // 文字種別カウント
  for (const char of text) {
    const type = getCharacterType(char);
    characterTypes[type]++;
  }
  
  // バイト数計算（概算）
  const utf8Bytes = new TextEncoder().encode(text).length;
  const shiftJisBytes = text.length * 2; // 概算
  const eucJpBytes = text.length * 2; // 概算
  
  return {
    totalCharacters: text.length,
    totalBytes: utf8Bytes,
    totalLines: lines.length,
    characterTypes,
    encoding: {
      utf8: utf8Bytes,
      shiftJis: shiftJisBytes,
      eucJp: eucJpBytes
    }
  };
}

/**
 * ランダムテキスト生成用の文字セット
 */
export const CHARACTER_SETS = {
  hiragana: 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん',
  katakana: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン',
  kanji: '一二三四五六七八九十百千万円年月日時分秒人生活仕事会社学校家族友達愛情幸福夢希望未来過去現在',
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  number: '0123456789',
  symbol: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  symbolJp: '！＠＃＄％＾＆＊（）＿＋－＝［］｛｝｜；：，．＜＞？'
};

/**
 * 指定された文字セットからランダムテキストを生成
 */
export function generateRandomText(options: {
  length: number;
  includeHiragana?: boolean;
  includeKatakana?: boolean;
  includeKanji?: boolean;
  includeAlphabet?: boolean;
  includeNumber?: boolean;
  includeSymbol?: boolean;
  includeSpace?: boolean;
}): string {
  let charSet = '';
  
  if (options.includeHiragana) charSet += CHARACTER_SETS.hiragana;
  if (options.includeKatakana) charSet += CHARACTER_SETS.katakana;
  if (options.includeKanji) charSet += CHARACTER_SETS.kanji;
  if (options.includeAlphabet) charSet += CHARACTER_SETS.alphabet;
  if (options.includeNumber) charSet += CHARACTER_SETS.number;
  if (options.includeSymbol) charSet += CHARACTER_SETS.symbol + CHARACTER_SETS.symbolJp;
  if (options.includeSpace) charSet += '　 '; // 全角・半角スペース
  
  if (charSet.length === 0) {
    charSet = CHARACTER_SETS.alphabet; // デフォルト
  }
  
  let result = '';
  for (let i = 0; i < options.length; i++) {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    result += charSet[randomIndex];
  }
  
  return result;
}

/**
 * 改行で区切られたランダムテキストを生成
 */
export function generateRandomLines(options: {
  lineCount: number;
  minLength: number;
  maxLength: number;
  includeHiragana?: boolean;
  includeKatakana?: boolean;
  includeKanji?: boolean;
  includeAlphabet?: boolean;
  includeNumber?: boolean;
  includeSymbol?: boolean;
}): string {
  const lines: string[] = [];
  
  for (let i = 0; i < options.lineCount; i++) {
    const length = Math.floor(Math.random() * (options.maxLength - options.minLength + 1)) + options.minLength;
    const line = generateRandomText({ ...options, length });
    lines.push(line);
  }
  
  return lines.join('\n');
}

/**
 * 文字数制限チェック
 */
export function validateTextLength(text: string, maxLength: number): {
  isValid: boolean;
  currentLength: number;
  maxLength: number;
  exceededBy: number;
} {
  const currentLength = text.length;
  const isValid = currentLength <= maxLength;
  const exceededBy = Math.max(0, currentLength - maxLength);
  
  return {
    isValid,
    currentLength,
    maxLength,
    exceededBy
  };
}

/**
 * テキストフォーマット変換
 */
export function formatText(text: string, format: 'upper' | 'lower' | 'title' | 'sentence'): string {
  switch (format) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return text.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
    case 'sentence':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    default:
      return text;
  }
}

/**
 * Web系でよく使われる文字数制限プリセット
 */
export const WEB_TEXT_LENGTH_PRESETS = [
  // SNS・コメント系
  { name: 'X (Twitter) ツイート', length: 280, description: 'X（旧Twitter）の1ツイートの文字数制限' },
  { name: 'Instagram キャプション', length: 2200, description: 'Instagramの投稿キャプション' },
  { name: 'Facebook 投稿', length: 63206, description: 'Facebookの投稿文字数制限' },
  { name: 'YouTube コメント', length: 10000, description: 'YouTubeのコメント制限' },
  
  // フォーム・入力系
  { name: '一般的なタイトル', length: 60, description: 'ページタイトル・記事タイトル等' },
  { name: 'メタディスクリプション', length: 160, description: 'SEO用のページ説明文' },
  { name: '短いコメント', length: 255, description: '一般的なコメント欄' },
  { name: '長文コメント', length: 1000, description: 'レビュー・詳細コメント' },
  
  // データベース・システム系
  { name: 'VARCHAR(50)', length: 50, description: 'データベースの短い文字列フィールド' },
  { name: 'VARCHAR(100)', length: 100, description: 'ユーザー名・商品名等' },
  { name: 'VARCHAR(255)', length: 255, description: 'データベースの標準的な文字列制限' },
  { name: 'TEXT フィールド', length: 65535, description: 'MySQLのTEXTフィールド（約64KB）' },
  
  // メール・メッセージ系
  { name: 'メール件名', length: 78, description: 'メールの件名推奨文字数' },
  { name: 'SMS (日本語)', length: 70, description: 'SMS1通の日本語文字数' },
  { name: 'SMS (英語)', length: 160, description: 'SMS1通の英語文字数' },
  { name: 'プッシュ通知', length: 120, description: 'スマートフォンのプッシュ通知' },
  
  // ウェブ標準
  { name: 'Alt属性', length: 125, description: '画像のalt属性推奨文字数' },
  { name: 'URL', length: 2048, description: 'ブラウザのURL長制限（Internet Explorer基準）' },
  { name: 'Cookie値', length: 4096, description: 'HTTPクッキーの値制限' },
  
  // カスタム
  { name: 'カスタム', length: 500, description: '任意の文字数を設定' }
];

/**
 * プリセット名から設定を取得
 */
export function getTextLengthPreset(name: string): typeof WEB_TEXT_LENGTH_PRESETS[0] | undefined {
  return WEB_TEXT_LENGTH_PRESETS.find(preset => preset.name === name);
}

/**
 * 文字数に基づいてプリセットを推奨
 */
export function recommendTextLengthPreset(length: number): typeof WEB_TEXT_LENGTH_PRESETS[0] | null {
  // 完全一致を最優先
  const exactMatch = WEB_TEXT_LENGTH_PRESETS.find(preset => preset.length === length);
  if (exactMatch) return exactMatch;
  
  // 指定長より大きい最小のプリセットを推奨
  const candidates = WEB_TEXT_LENGTH_PRESETS
    .filter(preset => preset.length >= length)
    .sort((a, b) => a.length - b.length);
  
  return candidates[0] || null;
} 