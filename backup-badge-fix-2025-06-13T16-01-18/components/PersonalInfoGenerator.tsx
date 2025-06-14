'use client';

import {
  Building,
  Calendar,
  Grid,
  Mail,
  MapPin,
  Phone,
  Settings2,
  Table,
  User,
  Users,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import BrewCharacter, { BrewEmotion } from './BrewCharacter';
import { ActionButton } from './ui/ActionButton';
import { DataTable } from './ui/DataTable';
import { FieldOption, FieldSelector } from './ui/FieldSelector';

// 簡易版の型定義
interface PersonalInfo {
  id: string;
  fullName?: { kanji: string; firstName: string; lastName: string };
  kanaName?: string; // カナ専用フィールド
  email?: string;
  phone?: string;
  address?: { full: string };
  age?: number;
  gender?: string;
  company?: string;
  jobTitle?: string;
}

const FIELD_OPTIONS: FieldOption[] = [
  {
    id: 'fullName',
    label: '氏名',
    icon: '👤',
    description: '日本語の姓名（漢字）',
    selected: true,
  },
  {
    id: 'kanaName',
    label: 'カナ氏名',
    icon: '🔤',
    description: 'カタカナ氏名（CSV：氏名（カナ）列）',
    selected: false,
  },
  {
    id: 'email',
    label: 'メールアドレス',
    icon: '📧',
    description: '実用的なメールアドレス形式',
    selected: true,
  },
  {
    id: 'phone',
    label: '電話番号',
    icon: '☎️',
    description: '固定電話・携帯電話番号',
    selected: true,
  },
  {
    id: 'address',
    label: '住所',
    icon: '🏠',
    description: '日本の住所（都道府県・市区町村）',
    selected: false,
  },
  {
    id: 'age',
    label: '年齢',
    icon: '🔢',
    description: '18〜80歳の範囲で生成',
    selected: false,
  },
  {
    id: 'gender',
    label: '性別',
    icon: '⚧️',
    description: '男性・女性・その他',
    selected: false,
  },
  {
    id: 'company',
    label: '会社名',
    icon: '🏢',
    description: '日本の企業名（実在・架空）',
    selected: false,
  },
  {
    id: 'jobTitle',
    label: '職種',
    icon: '💼',
    description: '業界に応じた職種・役職',
    selected: false,
  },
];

export const PersonalInfoGenerator: React.FC = React.memo(() => {
  const [count, setCount] = useState(5);
  const [fieldOptions, setFieldOptions] =
    useState<FieldOption[]>(FIELD_OPTIONS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<PersonalInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [brewMood, setBrewMood] = useState<BrewEmotion>('happy');
  const [brewMessage, setBrewMessage] =
    useState('個人情報生成の準備ができました！');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isCopied, setIsCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleFieldToggle = useCallback((fieldId: string) => {
    setFieldOptions(prev =>
      prev.map(option =>
        option.id === fieldId
          ? { ...option, selected: !option.selected }
          : option
      )
    );
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setBrewMood('success');
      setBrewMessage('クリップボードにコピーしました！');
      setTimeout(() => {
        setBrewMood('happy');
        setBrewMessage('他にもお手伝いできることはありますか？');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }, []);

  const copyAllData = useCallback(async () => {
    if (result.length === 0) {
      return;
    }

    setIsCopied(true); // コピー開始時にtrueにセット
    const selectedFields = fieldOptions.filter(f => f.selected);

    try {
      // データをテキスト形式で整形（絵文字付き）
      let allDataText = `🍺 QA Workbench - 生成データ (${result.length}件)\n`;
      allDataText += `📅 生成日時: ${new Date().toLocaleString('ja-JP')}\n`;
      allDataText += `${'='.repeat(60)}\n\n`;

      result.forEach((person, index) => {
        allDataText += `📋 === ${index + 1}件目 ===\n`;

        selectedFields.forEach(field => {
          const emoji =
            field.id === 'fullName'
              ? '👤'
              : field.id === 'kanaName'
              ? '🔤'
              : field.id === 'email'
              ? '📧'
              : field.id === 'phone'
              ? '📞'
              : field.id === 'address'
              ? '🏠'
              : field.id === 'age'
              ? '🎂'
              : field.id === 'gender'
              ? '⚧️'
              : field.id === 'company'
              ? '🏢'
              : field.id === 'jobTitle'
              ? '💼'
              : '📝';

          switch (field.id) {
            case 'fullName':
              if (person.fullName) {
                allDataText += `${emoji} 氏名: ${person.fullName.kanji}\n`;
              }
              break;
            case 'kanaName':
              if (person.kanaName) {
                allDataText += `${emoji} カナ氏名: ${person.kanaName}\n`;
              }
              break;
            case 'email':
              if (person.email) {
                allDataText += `${emoji} メールアドレス: ${person.email}\n`;
              }
              break;
            case 'phone':
              if (person.phone) {
                allDataText += `${emoji} 電話番号: ${person.phone}\n`;
              }
              break;
            case 'address':
              if (person.address) {
                allDataText += `${emoji} 住所: ${person.address.full}\n`;
              }
              break;
            case 'age':
              if (person.age) {
                allDataText += `${emoji} 年齢: ${person.age}歳\n`;
              }
              break;
            case 'gender':
              if (person.gender) {
                const genderText =
                  person.gender === 'male'
                    ? '男性'
                    : person.gender === 'female'
                    ? '女性'
                    : person.gender;
                allDataText += `${emoji} 性別: ${genderText}\n`;
              }
              break;
            case 'company':
              if (person.company) {
                allDataText += `${emoji} 会社名: ${person.company}\n`;
              }
              break;
            case 'jobTitle':
              if (person.jobTitle) {
                allDataText += `${emoji} 職種: ${person.jobTitle}\n`;
              }
              break;
          }
        });
        allDataText += '\n';
      });

      allDataText += `${'='.repeat(60)}\n`;
      allDataText += `✨ ブリューからのメッセージ: データのご利用ありがとうございます！\n`;
      allDataText += `🔧 生成ツール: QA Workbench\n`;

      await navigator.clipboard.writeText(allDataText);
      setBrewMood('success');
      setBrewMessage(
        `🎉 ${result.length}件のデータを全体コピーしました！クリップボードに保存済みです♪`
      );

      // 3秒後にコピー状態をリセット
      setTimeout(() => {
        setIsCopied(false);
        setBrewMood('happy');
        setBrewMessage(
          'コピーしたデータを活用してくださいね♪ 他にもお手伝いできることがあれば、いつでもお声かけください！'
        );
      }, 3000);
    } catch (err) {
      console.error('Failed to copy all data: ', err);
      setIsCopied(false); // エラー時はすぐにリセット
      setBrewMood('error');
      setBrewMessage(
        '❌ コピーに失敗しました。ブラウザの設定を確認してもう一度お試しください。'
      );
      setTimeout(() => {
        setBrewMood('thinking');
        setBrewMessage('お手伝いできることはありますか？');
      }, 2000);
    }
  }, [result, fieldOptions]);

  const exportToCsv = async () => {
    if (result.length === 0) {
      return;
    }

    setIsExporting(true); // エクスポート開始
    const selectedFields = fieldOptions.filter(f => f.selected).map(f => f.id);

    try {
      const response = await fetch(
        'http://localhost:3001/api/personal/export/csv',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            persons: result,
            includeFields: selectedFields,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('CSV export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `personal_info_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setBrewMood('success');
      setBrewMessage('CSVファイルのダウンロードが完了しました！');

      // 2秒後にエクスポート状態をリセット
      setTimeout(() => {
        setIsExporting(false);
      }, 2000);
    } catch (error) {
      setIsExporting(false); // エラー時はすぐにリセット
      setBrewMood('error');
      setBrewMessage('CSVエクスポートでエラーが発生しました');
    }
  };

  const generatePersonalInfo = async () => {
    const selectedFields = fieldOptions.filter(f => f.selected);

    if (selectedFields.length === 0) {
      setError('フィールドを最低1つ選択してください');
      setBrewMood('thinking');
      setBrewMessage('どのフィールドを生成しますか？');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setBrewMood('working');
    setBrewMessage(`${count}件の個人情報を生成中です...`);

    try {
      const response = await fetch(
        'http://localhost:3001/api/personal/generate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            count,
            locale: 'ja',
            includeFields: selectedFields.map(f => f.id),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API エラー: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setResult(data.data.persons);
        setBrewMood('success');
        setBrewMessage(
          `✨ ${data.data.persons.length}件の個人情報を生成しました！`
        );
      } else {
        throw new Error('API レスポンスエラー');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '不明なエラー';
      setError(errorMessage);
      setBrewMood('error');
      setBrewMessage(`エラーが発生しました: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedFieldCount = fieldOptions.filter(f => f.selected).length;

  // テーブル表示用のカラム定義
  const tableColumns = useMemo(() => {
    const selectedFields = fieldOptions.filter(f => f.selected);
    return selectedFields.map(field => ({
      key: field.id,
      label: field.label,
      icon: field.icon,
      width:
        field.id === 'fullName'
          ? '200px'
          : field.id === 'address'
          ? '300px'
          : field.id === 'email'
          ? '250px'
          : undefined,
      render:
        field.id === 'fullName'
          ? (value: any) =>
              value?.kanji ? (
                <span className="font-medium text-gray-900">{value.kanji}</span>
              ) : null
          : field.id === 'address'
          ? (value: any) =>
              value?.full ? (
                <span className="text-sm text-gray-700">{value.full}</span>
              ) : null
          : field.id === 'gender'
          ? (value: any) =>
              value ? (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    value === 'male'
                      ? 'bg-blue-100 text-blue-800'
                      : value === 'female'
                      ? 'bg-pink-100 text-pink-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {value === 'male'
                    ? '男性'
                    : value === 'female'
                    ? '女性'
                    : value}
                </span>
              ) : null
          : undefined,
    }));
  }, [fieldOptions]);

  return (
    <div className="space-y-6">
      {/* ワークベンチヘッダー */}
      <div className="wb-workbench-header">
        <div className="flex items-center justify-center space-x-4">
          <div className="p-3 bg-wb-tool-join-500 rounded-full shadow-lg">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div className="text-center">
            <h1 className="wb-tool-title text-wb-wood-800">
              🔧 個人情報生成工具
            </h1>
            <p className="wb-tool-description text-wb-wood-600">
              QAテスト用のリアルで実用的な個人情報データを安全に生成します
            </p>
          </div>
        </div>
      </div>

      {/* Brewキャラクターセクション */}
      <div className="wb-character-section">
        <BrewCharacter
          emotion={brewMood}
          message={brewMessage}
          animation={isGenerating ? 'spin' : 'float'}
          size="large"
          showSpeechBubble={true}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* 左カラム: 設定エリア */}
        <div className="xl:col-span-3 space-y-6">
          {/* 基本設定パネル */}
          <div className="wb-tool-panel wb-tool-join">
            <div className="wb-tool-panel-header">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-wb-tool-join-500 rounded-lg">
                  <Settings2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="wb-tool-panel-title">基本設定</h3>
                  <p className="wb-tool-panel-description">
                    生成するデータの件数と種類を設定してください
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* 生成件数設定 */}
              <div className="wb-tool-control">
                <label className="wb-tool-label">生成数</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={count}
                    onChange={e =>
                      setCount(
                        Math.max(
                          1,
                          Math.min(1000, parseInt(e.target.value) || 1)
                        )
                      )
                    }
                    className="wb-number-input w-24"
                  />
                  <span className="wb-unit-label">件 (最大1000件)</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCount(5)}
                      className={`wb-quick-button ${
                        count === 5
                          ? 'wb-quick-button-active'
                          : 'wb-quick-button-inactive'
                      }`}
                    >
                      5件
                    </button>
                    <button
                      onClick={() => setCount(50)}
                      className={`wb-quick-button ${
                        count === 50
                          ? 'wb-quick-button-active'
                          : 'wb-quick-button-inactive'
                      }`}
                    >
                      50件
                    </button>
                    <button
                      onClick={() => setCount(100)}
                      className={`wb-quick-button ${
                        count === 100
                          ? 'wb-quick-button-active'
                          : 'wb-quick-button-inactive'
                      }`}
                    >
                      100件
                    </button>
                    <button
                      onClick={() => setCount(500)}
                      className={`wb-quick-button ${
                        count === 500
                          ? 'wb-quick-button-active'
                          : 'wb-quick-button-inactive'
                      }`}
                    >
                      500件
                    </button>
                  </div>
                </div>
                {count > 100 && (
                  <p className="wb-tool-hint text-wb-warning">
                    ⚠️ 大量データ生成により処理時間が長くなる場合があります
                  </p>
                )}
              </div>

              {/* フィールド選択 */}
              <div className="wb-tool-control">
                <div className="flex items-center justify-between mb-4">
                  <label className="wb-tool-label">生成フィールド選択</label>
                  <div className="flex items-center space-x-2 text-sm text-wb-wood-500">
                    <span>{selectedFieldCount}個選択中</span>
                    {selectedFieldCount === 0 && (
                      <span className="wb-badge wb-badge-warning">要選択</span>
                    )}
                  </div>
                </div>

                <div className="wb-tool-grid wb-grid-5">
                  <FieldSelector
                    options={fieldOptions}
                    onToggle={handleFieldToggle}
                    className="contents"
                  />
                </div>
              </div>

              {/* 生成ボタン */}
              <div className="pt-4">
                <ActionButton
                  type="generate"
                  onClick={generatePersonalInfo}
                  disabled={isGenerating || selectedFieldCount === 0}
                  loading={isGenerating}
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="wb-action-button wb-action-primary"
                >
                  {isGenerating
                    ? '🔧 個人情報を組み立て中...'
                    : '🔧 個人情報を生成'}
                </ActionButton>
              </div>
            </div>
          </div>

          {/* 結果表示パネル */}
          {result.length > 0 && (
            <div className="wb-result-panel">
              <div className="wb-result-header">
                <div className="wb-result-title-section">
                  <h3 className="wb-result-title">生成結果</h3>
                  <p className="wb-result-subtitle">
                    {result.length}件の個人情報データ
                  </p>
                </div>
                <div className="wb-result-actions">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'cards'
                          ? 'bg-wb-tool-join-500 text-white'
                          : 'bg-wb-wood-100 text-wb-wood-600 hover:bg-wb-wood-200'
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'table'
                          ? 'bg-wb-tool-join-500 text-white'
                          : 'bg-wb-wood-100 text-wb-wood-600 hover:bg-wb-wood-200'
                      }`}
                    >
                      <Table className="h-4 w-4" />
                    </button>
                  </div>
                  <ActionButton
                    type="copy"
                    onClick={copyAllData}
                    disabled={isCopied}
                    variant="secondary"
                    size="sm"
                    className="wb-result-action-button"
                  >
                    {isCopied ? '✅ コピー済み' : '📋 全データコピー'}
                  </ActionButton>
                  <ActionButton
                    type="generate"
                    onClick={exportToCsv}
                    disabled={isExporting}
                    variant="secondary"
                    size="sm"
                    className="wb-result-action-button"
                  >
                    {isExporting ? '⏳ エクスポート中...' : '💾 CSV出力'}
                  </ActionButton>
                </div>
              </div>

              {/* カード表示 */}
              {viewMode === 'cards' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {result.map((person, index) => (
                    <div
                      key={person.id}
                      className="group relative p-4 bg-white border border-wb-wood-200 rounded-lg hover:bg-wb-wood-50 transition-all duration-300 hover:shadow-md"
                    >
                      {/* アイテム番号 */}
                      <div className="absolute top-2 right-2 bg-wb-tool-join-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        #{index + 1}
                      </div>

                      <div className="space-y-2 text-sm">
                        {person.fullName && (
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-wb-tool-join-500" />
                            <span className="font-medium text-wb-wood-900">
                              {person.fullName.kanji}
                            </span>
                          </div>
                        )}
                        {person.kanaName && (
                          <div className="flex items-center space-x-2">
                            <span className="text-wb-tool-join-600 font-bold text-xs">
                              🔤
                            </span>
                            <span className="font-medium text-wb-tool-join-900">
                              {person.kanaName}
                            </span>
                          </div>
                        )}
                        {person.email && (
                          <div className="flex items-center space-x-2 group/email">
                            <Mail className="h-4 w-4 text-wb-tool-join-500" />
                            <span className="flex-1 truncate text-wb-wood-700">
                              {person.email}
                            </span>
                            <ActionButton
                              type="copy"
                              onClick={() =>
                                person.email && copyToClipboard(person.email)
                              }
                              variant="secondary"
                              size="sm"
                              className="opacity-0 group-hover/email:opacity-100 transition-opacity p-1"
                            />
                          </div>
                        )}
                        {person.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-wb-tool-measure-500" />
                            <span className="text-wb-wood-700">
                              {person.phone}
                            </span>
                          </div>
                        )}
                        {person.address && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-wb-tool-cut-500" />
                            <span className="text-xs text-wb-wood-600">
                              {person.address.full}
                            </span>
                          </div>
                        )}
                        {person.age && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-wb-tool-polish-500" />
                            <span className="text-wb-wood-700">
                              {person.age}歳 ({person.gender})
                            </span>
                          </div>
                        )}
                        {person.company && (
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-wb-tool-inspect-500" />
                            <span className="text-xs text-wb-wood-600">
                              {person.company} - {person.jobTitle}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* テーブル表示 */}
              {viewMode === 'table' && (
                <DataTable
                  columns={tableColumns}
                  data={result}
                  showRowNumbers={true}
                  sortable={true}
                  exportable={false}
                  maxHeight="max-h-96"
                />
              )}

              {/* 結果メタデータ */}
              <div className="wb-result-metadata">
                <span className="wb-result-timestamp">
                  生成時刻: {new Date().toLocaleTimeString('ja-JP')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 右カラム: サイドバーエリア */}
        <div className="space-y-6">
          {/* エラー表示 */}
          {error && (
            <div className="wb-error-panel">
              <div className="wb-error-content">
                <div className="wb-error-icon">⚠️</div>
                <div className="wb-error-text">
                  <div className="wb-error-title">エラー</div>
                  <div className="wb-error-message">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* 統計情報 */}
          {result.length > 0 && (
            <div className="wb-tool-panel">
              <div className="wb-tool-panel-header">
                <h3 className="wb-tool-panel-title">生成統計</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-wb-wood-600">総件数</span>
                  <span className="font-semibold text-wb-wood-800">
                    {result.length}件
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-wb-wood-600">フィールド数</span>
                  <span className="font-semibold text-wb-wood-800">
                    {selectedFieldCount}種類
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-wb-wood-600">生成時刻</span>
                  <span className="font-semibold text-xs text-wb-wood-700">
                    {new Date().toLocaleTimeString('ja-JP')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 成功メッセージ */}
          {result.length > 0 && !error && (
            <div className="wb-success-message">
              <div className="wb-success-content">
                <span className="wb-success-text">
                  ✅ {result.length}件の個人情報データを生成しました
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

PersonalInfoGenerator.displayName = 'PersonalInfoGenerator';
