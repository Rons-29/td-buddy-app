'use client';

import { AlertTriangle, Check, Info, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface CustomSymbolsInputProps {
  value: string;
  onChange: (symbols: string) => void;
  className?: string;
  placeholder?: string;
  showSuggestions?: boolean;
}

// 推奨記号セット
const SYMBOL_PRESETS = {
  safe: {
    symbols: '$@_#&?',
    name: '安全',
    description: '入力しやすく、多くのシステムで使用可能',
  },
  standard: {
    symbols: '!@#$%^&*',
    name: '標準',
    description: '一般的なパスワード要件に対応',
  },
  extended: {
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    name: '拡張',
    description: '最大限の記号を使用（非互換性の可能性あり）',
  },
  minimal: {
    symbols: '@#$&',
    name: 'ミニマル',
    description: '最小限の安全な記号セット',
  },
};

// 危険な記号（システム依存の問題がある可能性）
const PROBLEMATIC_SYMBOLS = ['"', "'", '`', '\\', '/', ' ', '\t', '\n'];

export const CustomSymbolsInput: React.FC<CustomSymbolsInputProps> = ({
  value,
  onChange,
  className = '',
  placeholder = '例: $@_#&?',
  showSuggestions = true,
}) => {
  const [isValid, setIsValid] = useState(true);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [showPresets, setShowPresets] = useState(false);

  // 入力値の検証
  useEffect(() => {
    const newWarnings: string[] = [];

    // 空文字チェック
    if (!value.trim()) {
      setIsValid(false);
      return;
    }

    // 危険な文字チェック
    const problematicFound = PROBLEMATIC_SYMBOLS.filter(symbol =>
      value.includes(symbol)
    );
    if (problematicFound.length > 0) {
      newWarnings.push(
        `非推奨文字が含まれています: ${problematicFound.join(', ')}`
      );
    }

    // 重複文字チェック
    const uniqueSymbols = [...new Set(value)];
    if (uniqueSymbols.length !== value.length) {
      newWarnings.push('重複した記号があります');
    }

    // 英数字チェック
    const alphanumeric = value.match(/[a-zA-Z0-9]/g);
    if (alphanumeric) {
      newWarnings.push('英数字は記号として認識されません');
    }

    setWarnings(newWarnings);
    setIsValid(newWarnings.length === 0 && value.trim().length > 0);
  }, [value]);

  // プリセット適用
  const applyPreset = (presetKey: keyof typeof SYMBOL_PRESETS) => {
    const preset = SYMBOL_PRESETS[presetKey];
    onChange(preset.symbols);
    setShowPresets(false);
  };

  // 重複除去
  const removeDuplicates = () => {
    const uniqueSymbols = [...new Set(value)].join('');
    onChange(uniqueSymbols);
  };

  // 推奨記号のみに整理
  const cleanSymbols = () => {
    const safeSymbols = value
      .split('')
      .filter(char => !PROBLEMATIC_SYMBOLS.includes(char))
      .filter(char => !/[a-zA-Z0-9]/.test(char))
      .filter((char, index, array) => array.indexOf(char) === index)
      .join('');
    onChange(safeSymbols);
  };

  return (
    <div className={`custom-symbols-input ${className}`}>
      <div className="space-y-3">
        {/* メイン入力フィールド */}
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full p-3 pr-10 border-2 rounded-lg font-mono text-lg transition-all ${
              isValid
                ? 'border-gray-300 focus:border-blue-500'
                : 'border-red-300 focus:border-red-500'
            }`}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isValid ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            )}
          </div>
        </div>

        {/* 文字数・情報表示 */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              記号数:{' '}
              <span className="font-mono font-bold">
                {[...new Set(value)].length}
              </span>
            </span>
            <span className="text-gray-600">
              文字数:{' '}
              <span className="font-mono font-bold">{value.length}</span>
            </span>
          </div>
          <div className="flex gap-2">
            {value.length !== [...new Set(value)].length && (
              <button
                onClick={removeDuplicates}
                className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
              >
                重複除去
              </button>
            )}
            {warnings.length > 0 && (
              <button
                onClick={cleanSymbols}
                className="px-2 py-1 text-xs wb-badge-count rounded hover:bg-blue-200"
              >
                記号整理
              </button>
            )}
          </div>
        </div>

        {/* 警告表示 */}
        {warnings.length > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">注意事項</h4>
                <ul className="space-y-1">
                  {warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-yellow-700">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* プリセット選択 */}
        {showSuggestions && (
          <div className="space-y-2">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <RefreshCw className="w-4 h-4" />
              プリセットから選択
              {showPresets ? ' ▲' : ' ▼'}
            </button>

            {showPresets && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(SYMBOL_PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() =>
                      applyPreset(key as keyof typeof SYMBOL_PRESETS)
                    }
                    className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-800">
                        {preset.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {preset.symbols.length}文字
                      </span>
                    </div>
                    <div className="font-mono text-sm text-blue-600 mb-1">
                      {preset.symbols}
                    </div>
                    <div className="text-xs text-gray-600">
                      {preset.description}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ヘルプ情報 */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Info className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">💡 カスタム記号のコツ</p>
            <ul className="space-y-1 text-xs">
              <li>• 入力された記号から最低1文字は必ずパスワードに含まれます</li>
              <li>• 入力しやすい記号（$@_#&?）を推奨します</li>
              <li>• クォートやスペースは避けてください</li>
              <li>• 英数字は記号として扱われません</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
