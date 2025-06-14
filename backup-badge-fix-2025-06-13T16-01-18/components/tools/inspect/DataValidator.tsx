'use client';

import React, { useCallback, useState } from 'react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';

interface ValidationRule {
  id: string;
  name: string;
  pattern: string;
  description: string;
  isRegex: boolean;
}

interface ValidationResult {
  rule: ValidationRule;
  valid: string[];
  invalid: string[];
  validCount: number;
  invalidCount: number;
  validRate: number;
}

interface PreviewResult {
  originalData: string[];
  previewFormat: 'json' | 'csv' | 'xml' | 'table' | 'list';
  formattedData: string;
  statistics: {
    totalLines: number;
    emptyLines: number;
    avgLineLength: number;
    maxLineLength: number;
    encoding: string;
  };
}

const defaultRules: ValidationRule[] = [
  {
    id: 'email',
    name: 'メールアドレス',
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    description: '有効なメールアドレス形式をチェック',
    isRegex: true,
  },
  {
    id: 'phone',
    name: '電話番号',
    pattern: '^\\d{10,11}$',
    description: '10-11桁の数字のみの電話番号',
    isRegex: true,
  },
  {
    id: 'zipcode',
    name: '郵便番号',
    pattern: '^\\d{3}-\\d{4}$',
    description: '日本の郵便番号形式（123-4567）',
    isRegex: true,
  },
  {
    id: 'url',
    name: 'URL',
    pattern: "^https?://[\\w\\-._~:/?#\\[\\]@!$&'()*+,;=.]+$",
    description: 'HTTP/HTTPSのURL形式',
    isRegex: true,
  },
  {
    id: 'length',
    name: '文字数チェック',
    pattern: '10',
    description: '指定した文字数以上かチェック',
    isRegex: false,
  },
];

export const DataValidator: React.FC = () => {
  const [inputData, setInputData] = useState('');
  const [selectedRules, setSelectedRules] = useState<string[]>(['email']);
  const [customRule, setCustomRule] = useState({
    name: '',
    pattern: '',
    description: '',
  });
  const [previewFormat, setPreviewFormat] = useState<
    'json' | 'csv' | 'xml' | 'table' | 'list'
  >('json');

  const [validationResults, setValidationResults] = useState<
    ValidationResult[]
  >([]);
  const [previewResult, setPreviewResult] = useState<PreviewResult | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'validate' | 'preview'>(
    'validate'
  );

  const handleValidation = useCallback(() => {
    if (!inputData.trim() || selectedRules.length === 0) {
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const lines = inputData.split('\n').filter(line => line.trim());
      const results: ValidationResult[] = [];

      selectedRules.forEach(ruleId => {
        const rule = defaultRules.find(r => r.id === ruleId);
        if (!rule) {
          return;
        }

        const valid: string[] = [];
        const invalid: string[] = [];

        lines.forEach(line => {
          let isValid = false;

          if (rule.isRegex) {
            try {
              const regex = new RegExp(rule.pattern);
              isValid = regex.test(line);
            } catch (e) {
              isValid = false;
            }
          } else {
            // 文字数チェックなどの非正規表現ルール
            if (rule.id === 'length') {
              const minLength = parseInt(rule.pattern);
              isValid = line.length >= minLength;
            }
          }

          if (isValid) {
            valid.push(line);
          } else {
            invalid.push(line);
          }
        });

        const validCount = valid.length;
        const invalidCount = invalid.length;
        const validRate = (validCount / (validCount + invalidCount)) * 100;

        results.push({
          rule,
          valid,
          invalid,
          validCount,
          invalidCount,
          validRate,
        });
      });

      setValidationResults(results);
      setIsProcessing(false);
    }, 500);
  }, [inputData, selectedRules]);

  const handlePreview = useCallback(() => {
    if (!inputData.trim()) {
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const lines = inputData.split('\n');
      const nonEmptyLines = lines.filter(line => line.trim());

      let formattedData = '';

      switch (previewFormat) {
        case 'json':
          formattedData = JSON.stringify(nonEmptyLines, null, 2);
          break;
        case 'csv':
          formattedData = nonEmptyLines
            .map(line => `"${line.replace(/"/g, '""')}"`)
            .join('\n');
          break;
        case 'xml':
          formattedData = `<?xml version="1.0" encoding="UTF-8"?>\n<data>\n${nonEmptyLines
            .map(
              line =>
                `  <item>${line
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')}</item>`
            )
            .join('\n')}\n</data>`;
          break;
        case 'table':
          const maxLength = Math.max(...nonEmptyLines.map(line => line.length));
          formattedData = `${'Index'.padEnd(8)} | ${'Data'.padEnd(
            maxLength
          )}\n${'='.repeat(8)} | ${'='.repeat(maxLength)}\n${nonEmptyLines
            .map(
              (line, index) =>
                `${String(index + 1).padEnd(8)} | ${line.padEnd(maxLength)}`
            )
            .join('\n')}`;
          break;
        case 'list':
          formattedData = nonEmptyLines
            .map((line, index) => `${index + 1}. ${line}`)
            .join('\n');
          break;
      }

      const lengths = nonEmptyLines.map(line => line.length);
      const avgLineLength =
        lengths.reduce((sum, len) => sum + len, 0) / lengths.length;
      const maxLineLength = Math.max(...lengths);

      setPreviewResult({
        originalData: lines,
        previewFormat,
        formattedData,
        statistics: {
          totalLines: lines.length,
          emptyLines: lines.length - nonEmptyLines.length,
          avgLineLength,
          maxLineLength,
          encoding: 'UTF-8',
        },
      });

      setIsProcessing(false);
    }, 500);
  }, [inputData, previewFormat]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  return (
    <div className="wb-workbench-bg min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🔍 データ検査工具
          </h1>
          <p className="text-gray-600">
            データの品質をチェック・プレビューする職人の工具
          </p>
        </div>

        {/* Input Data */}
        <Card className="mb-6 border-blue-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              📝 検査対象データ
            </h2>
            <textarea
              value={inputData}
              onChange={e => setInputData(e.target.value)}
              className="w-full h-40 p-4 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:outline-none"
              placeholder="検査・プレビューするデータを入力してください..."
            />
            <div className="mt-2 text-sm text-gray-600">
              文字数: {inputData.length} | 行数: {inputData.split('\n').length}{' '}
              | 非空行数: {inputData.split('\n').filter(l => l.trim()).length}
            </div>
          </div>
        </Card>

        {/* Tool Tabs */}
        <div className="flex space-x-4 mb-6">
          <Button
            onClick={() => setActiveTab('validate')}
            className={
              activeTab === 'validate'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-700'
            }
          >
            🔍 データ検証
          </Button>
          <Button
            onClick={() => setActiveTab('preview')}
            className={
              activeTab === 'preview'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-700'
            }
          >
            👁️ データプレビュー
          </Button>
        </div>

        {/* Validation Tool */}
        {activeTab === 'validate' && (
          <Card className="mb-6 border-blue-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-700">
                🔍 バリデーション設定
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">
                    検証ルール選択
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {defaultRules.map(rule => (
                      <div
                        key={rule.id}
                        className="flex items-start space-x-2 p-3 border border-blue-200 rounded"
                      >
                        <input
                          type="checkbox"
                          id={rule.id}
                          checked={selectedRules.includes(rule.id)}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedRules([...selectedRules, rule.id]);
                            } else {
                              setSelectedRules(
                                selectedRules.filter(id => id !== rule.id)
                              );
                            }
                          }}
                          className="mt-1 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={rule.id}
                            className="font-medium text-blue-700 cursor-pointer"
                          >
                            {rule.name}
                          </label>
                          <p className="text-xs text-gray-600 mt-1">
                            {rule.description}
                          </p>
                          <code className="text-xs bg-gray-100 px-1 rounded">
                            {rule.pattern}
                          </code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleValidation}
                  disabled={
                    !inputData.trim() ||
                    selectedRules.length === 0 ||
                    isProcessing
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isProcessing ? '🔍 検証中...' : '🔍 データを検証'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Preview Tool */}
        {activeTab === 'preview' && (
          <Card className="mb-6 border-blue-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-700">
                👁️ プレビュー設定
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">
                    出力フォーマット
                  </label>
                  <select
                    value={previewFormat}
                    onChange={e => setPreviewFormat(e.target.value as any)}
                    className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-400"
                  >
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                    <option value="xml">XML</option>
                    <option value="table">Table</option>
                    <option value="list">List</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={handlePreview}
                    disabled={!inputData.trim() || isProcessing}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isProcessing
                      ? '👁️ プレビュー中...'
                      : '👁️ データをプレビュー'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Validation Results */}
        {validationResults.length > 0 && activeTab === 'validate' && (
          <div className="space-y-4">
            {validationResults.map((result, index) => (
              <Card key={index} className="border-blue-200">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-blue-700">
                      🔍 {result.rule.name} 検証結果
                    </h3>
                    <Badge
                      variant="outline"
                      className={`${
                        result.validRate >= 80
                          ? 'bg-green-100 text-green-700 border-green-300'
                          : result.validRate >= 60
                          ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                          : 'bg-red-100 text-red-700 border-red-300'
                      }`}
                    >
                      {Math.round(result.validRate)}% 適合
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {result.validCount}
                      </div>
                      <div className="text-sm text-gray-600">適合データ</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {result.invalidCount}
                      </div>
                      <div className="text-sm text-gray-600">不適合データ</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {result.validCount + result.invalidCount}
                      </div>
                      <div className="text-sm text-gray-600">総データ数</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Valid Data */}
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">
                        ✅ 適合データ
                      </h4>
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {result.valid.slice(0, 10).map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2 bg-green-50 rounded text-sm font-mono"
                          >
                            {item}
                          </div>
                        ))}
                        {result.valid.length > 10 && (
                          <div className="text-xs text-gray-600 p-2">
                            ...他 {result.valid.length - 10} 件
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Invalid Data */}
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">
                        ❌ 不適合データ
                      </h4>
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {result.invalid.slice(0, 10).map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2 bg-red-50 rounded text-sm font-mono"
                          >
                            {item}
                          </div>
                        ))}
                        {result.invalid.length > 10 && (
                          <div className="text-xs text-gray-600 p-2">
                            ...他 {result.invalid.length - 10} 件
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button
                      onClick={() => copyToClipboard(result.valid.join('\n'))}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      📋 適合データをコピー
                    </Button>
                    <Button
                      onClick={() => copyToClipboard(result.invalid.join('\n'))}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      📋 不適合データをコピー
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Preview Results */}
        {previewResult && activeTab === 'preview' && (
          <Card className="mb-6 border-blue-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-700">
                📊 プレビュー結果
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {previewResult.statistics.totalLines}
                  </div>
                  <div className="text-sm text-gray-600">総行数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {previewResult.statistics.emptyLines}
                  </div>
                  <div className="text-sm text-gray-600">空行数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(previewResult.statistics.avgLineLength)}
                  </div>
                  <div className="text-sm text-gray-600">平均文字数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {previewResult.statistics.maxLineLength}
                  </div>
                  <div className="text-sm text-gray-600">最大文字数</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {previewResult.statistics.encoding}
                  </div>
                  <div className="text-sm text-gray-600">エンコーディング</div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-blue-700 mb-2">
                  📄 {previewResult.previewFormat.toUpperCase()} フォーマット
                  プレビュー
                </h3>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm font-mono overflow-x-auto max-h-80 overflow-y-auto border">
                  {previewResult.formattedData}
                </pre>
              </div>

              <Button
                onClick={() => copyToClipboard(previewResult.formattedData)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                📋 フォーマット済みデータをコピー
              </Button>
            </div>
          </Card>
        )}

        {/* Tool Footer */}
        <div className="text-center text-gray-600 mt-8">
          <p className="mb-2">
            🍺 <strong>Brew</strong>からのメッセージ:
          </p>
          <p className="text-sm italic">
            「データ検査工具だ！品質チェックとプレビューでデータの信頼性を確保しよう。
            検査は品質保証の要だからな！🔍✨」
          </p>
        </div>
      </div>
    </div>
  );
};
