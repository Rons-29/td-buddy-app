// 🔐 ローカルパスワード醸造ユーティリティ

export interface LocalPasswordOptions {
  length: number;
  count: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
  customSymbols?: string;
}

export interface LocalPasswordResult {
  passwords: string[];
  strength: 'very-strong' | 'strong' | 'medium' | 'weak';
  estimatedCrackTime: string;
  criteria: any;
  generatedAt: string;
}

// 文字セット定義
const CHARSET = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  ambiguous: '0O1lI|',
};

// 強度計算
function calculateStrength(
  length: number,
  charsetSize: number
): 'very-strong' | 'strong' | 'medium' | 'weak' {
  const entropy = length * Math.log2(charsetSize);

  if (entropy >= 60) {
    return 'very-strong';
  }
  if (entropy >= 40) {
    return 'strong';
  }
  if (entropy >= 25) {
    return 'medium';
  }
  return 'weak';
}

// クラック時間推定
function estimateCrackTime(length: number, charsetSize: number): string {
  const combinations = Math.pow(charsetSize, length);
  const secondsToTry = combinations / 2 / 1000000; // 1秒間に100万回試行と仮定

  if (secondsToTry > 365 * 24 * 3600 * 1000) {
    return '1000年以上';
  }
  if (secondsToTry > 365 * 24 * 3600) {
    return '1年以上';
  }
  if (secondsToTry > 30 * 24 * 3600) {
    return '1ヶ月以上';
  }
  if (secondsToTry > 24 * 3600) {
    return '1日以上';
  }
  if (secondsToTry > 3600) {
    return '1時間以上';
  }
  if (secondsToTry > 60) {
    return '1分以上';
  }
  return '1分未満';
}

// セキュアな乱数生成
function getSecureRandom(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

// ローカルパスワード醸造
export function generatePasswordsLocal(
  options: LocalPasswordOptions
): LocalPasswordResult {
  const {
    length,
    count,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeAmbiguous,
    customSymbols,
  } = options;

  // 文字セット構築
  let charset = '';
  if (includeUppercase) {
    charset += CHARSET.uppercase;
  }
  if (includeLowercase) {
    charset += CHARSET.lowercase;
  }
  if (includeNumbers) {
    charset += CHARSET.numbers;
  }
  if (includeSymbols) {
    charset += customSymbols || CHARSET.symbols;
  }

  // 曖昧文字を除外
  if (excludeAmbiguous) {
    for (const char of CHARSET.ambiguous) {
      charset = charset.replace(new RegExp(char, 'g'), '');
    }
  }

  if (charset.length === 0) {
    charset = CHARSET.lowercase; // 最低限の文字セット
  }

  // パスワード醸造
  const passwords: string[] = [];
  for (let i = 0; i < count; i++) {
    let password = '';
    for (let j = 0; j < length; j++) {
      const randomIndex = getSecureRandom(charset.length);
      password += charset[randomIndex];
    }
    passwords.push(password);
  }

  // 強度・時間計算
  const strength = calculateStrength(length, charset.length);
  const estimatedCrackTime = estimateCrackTime(length, charset.length);

  return {
    passwords,
    strength,
    estimatedCrackTime,
    criteria: {
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
      excludeAmbiguous,
      charsetSize: charset.length,
    },
    generatedAt: new Date().toISOString(),
  };
}
