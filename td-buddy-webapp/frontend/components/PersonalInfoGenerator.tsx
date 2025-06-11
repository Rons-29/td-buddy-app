'use client';

import {
  Building,
  Calendar,
  CheckCircle,
  Grid,
  Mail,
  MapPin,
  Phone,
  Settings2,
  Sparkles,
  Table,
  User,
  Users,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { ActionButton } from './ui/ActionButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/Card';
import { DataTable } from './ui/DataTable';
import { EnhancedTDCharacter, TDMood } from './ui/EnhancedTDCharacter';
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
  const [tdMood, setTdMood] = useState<TDMood>('happy');
  const [tdMessage, setTdMessage] =
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
      setTdMood('success');
      setTdMessage('クリップボードにコピーしました！');
      setTimeout(() => {
        setTdMood('happy');
        setTdMessage('他にもお手伝いできることはありますか？');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }, []);

  const copyAllData = useCallback(async () => {
    if (result.length === 0) return;

    setIsCopied(true); // コピー開始時にtrueにセット
    const selectedFields = fieldOptions.filter(f => f.selected);

    try {
      // データをテキスト形式で整形（絵文字付き）
      let allDataText = `🤖 TestData Buddy - 生成データ (${result.length}件)\n`;
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
      allDataText += `✨ TDからのメッセージ: データのご利用ありがとうございます！\n`;
      allDataText += `🔧 生成ツール: TestData Buddy\n`;

      await navigator.clipboard.writeText(allDataText);
      setTdMood('success');
      setTdMessage(
        `🎉 ${result.length}件のデータを全体コピーしました！クリップボードに保存済みです♪`
      );

      // 3秒後にコピー状態をリセット
      setTimeout(() => {
        setIsCopied(false);
        setTdMood('happy');
        setTdMessage(
          'コピーしたデータを活用してくださいね♪ 他にもお手伝いできることがあれば、いつでもお声かけください！'
        );
      }, 3000);
    } catch (err) {
      console.error('Failed to copy all data: ', err);
      setIsCopied(false); // エラー時はすぐにリセット
      setTdMood('error');
      setTdMessage(
        '❌ コピーに失敗しました。ブラウザの設定を確認してもう一度お試しください。'
      );
      setTimeout(() => {
        setTdMood('thinking');
        setTdMessage('お手伝いできることはありますか？');
      }, 2000);
    }
  }, [result, fieldOptions]);

  const exportToCsv = async () => {
    if (result.length === 0) return;

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

      if (!response.ok) throw new Error('CSV export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `personal_info_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setTdMood('success');
      setTdMessage('CSVファイルのダウンロードが完了しました！');

      // 2秒後にエクスポート状態をリセット
      setTimeout(() => {
        setIsExporting(false);
      }, 2000);
    } catch (error) {
      setIsExporting(false); // エラー時はすぐにリセット
      setTdMood('error');
      setTdMessage('CSVエクスポートでエラーが発生しました');
    }
  };

  const generatePersonalInfo = async () => {
    const selectedFields = fieldOptions.filter(f => f.selected);

    if (selectedFields.length === 0) {
      setError('フィールドを最低1つ選択してください');
      setTdMood('thinking');
      setTdMessage('どのフィールドを生成しますか？');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setTdMood('working');
    setTdMessage(`${count}件の個人情報を生成中です...`);

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
        setTdMood('success');
        setTdMessage(
          `✨ ${data.data.persons.length}件の個人情報を生成しました！`
        );
      } else {
        throw new Error('API レスポンスエラー');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '不明なエラー';
      setError(errorMessage);
      setTdMood('error');
      setTdMessage(`エラーが発生しました: ${errorMessage}`);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-full blur-xl" />
        <div className="absolute top-80 right-20 w-60 h-60 bg-gradient-to-r from-emerald-300/20 to-blue-300/20 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-purple-300/10 to-pink-300/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full px-4 py-8 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* 美しいヘッダー */}
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center space-x-4 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-75 animate-pulse" />
                <div className="relative bg-white p-4 rounded-full shadow-xl">
                  <Users className="h-12 w-12 text-blue-600" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                  個人情報生成ツール
                </h1>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-600 font-medium">
                    Powered by TD Buddy
                  </span>
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                </div>
              </div>
            </div>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              QAテスト用のリアルで実用的な個人情報データを生成します。
              <br />
              <span className="text-blue-600 font-medium">
                安全・高速・日本語対応
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* 左カラム: 設定エリア */}
            <div className="xl:col-span-3 space-y-6">
              {/* 基本設定カード */}
              <Card variant="glass" className="backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                      <Settings2 className="h-5 w-5 text-white" />
                    </div>
                    <span>基本設定</span>
                  </CardTitle>
                  <CardDescription>
                    生成するデータの件数と種類を設定してください
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 生成件数設定 */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        生成数
                      </label>
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
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-td-primary-500 focus:border-transparent"
                        />
                        <span className="text-sm text-gray-500">
                          件 (最大1000件)
                        </span>
                        <div className="flex space-x-2">
                          <ActionButton
                            type="replace"
                            onClick={() => setCount(5)}
                            variant="secondary"
                            size="sm"
                            className="text-xs"
                          >
                            5件
                          </ActionButton>
                          <ActionButton
                            type="replace"
                            onClick={() => setCount(50)}
                            variant="secondary"
                            size="sm"
                            className="text-xs"
                          >
                            50件
                          </ActionButton>
                          <ActionButton
                            type="replace"
                            onClick={() => setCount(100)}
                            variant="secondary"
                            size="sm"
                            className="text-xs"
                          >
                            100件
                          </ActionButton>
                          <ActionButton
                            type="replace"
                            onClick={() => setCount(500)}
                            variant="secondary"
                            size="sm"
                            className="text-xs"
                          >
                            500件
                          </ActionButton>
                        </div>
                      </div>
                      {count > 100 && (
                        <p className="text-sm text-amber-600 mt-2">
                          ⚠️
                          大量データ生成により処理時間が長くなる場合があります
                        </p>
                      )}
                    </div>

                    {/* フィールド選択 */}
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-semibold text-gray-700">
                        生成フィールド選択
                      </label>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{selectedFieldCount}個選択中</span>
                        {selectedFieldCount === 0 && (
                          <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                            要選択
                          </span>
                        )}
                      </div>
                    </div>

                    <FieldSelector
                      options={fieldOptions}
                      onToggle={handleFieldToggle}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    />
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
                      className="relative overflow-hidden"
                    >
                      <span className="relative z-10">
                        {isGenerating
                          ? 'データ生成中...'
                          : `${count}件の個人情報を生成`}
                      </span>

                      {/* ボタン内のキラキラエフェクト */}
                      {!isGenerating && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                      )}
                    </ActionButton>
                  </div>
                </CardContent>
              </Card>

              {/* 結果表示エリア */}
              {result.length > 0 && (
                <Card variant="glass" className="backdrop-blur-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <span>生成結果 ({result.length}件)</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        {/* 表示モード切り替え */}
                        <div className="flex bg-white/50 rounded-lg p-1">
                          <ActionButton
                            type="replace"
                            onClick={() => setViewMode('cards')}
                            variant={
                              viewMode === 'cards' ? 'primary' : 'secondary'
                            }
                            size="sm"
                            className="rounded-md"
                          >
                            <Grid className="h-4 w-4 mr-1" />
                            カード表示
                          </ActionButton>
                          <ActionButton
                            type="replace"
                            onClick={() => setViewMode('table')}
                            variant={
                              viewMode === 'table' ? 'primary' : 'secondary'
                            }
                            size="sm"
                            className="rounded-md"
                          >
                            <Table className="h-4 w-4 mr-1" />
                            テーブル表示
                          </ActionButton>
                        </div>

                        {/* アクションボタン */}
                        <div className="flex items-center space-x-2">
                          <ActionButton
                            type="copy"
                            onClick={copyAllData}
                            isActive={isCopied}
                            variant={isCopied ? 'accent' : 'primary'}
                            size="sm"
                            disabled={isCopied}
                            className={`${
                              isCopied
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                                : 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600'
                            } text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                          >
                            <span className="flex items-center space-x-1">
                              <span>{isCopied ? '✅' : '📋'}</span>
                              <span>
                                {isCopied ? 'コピー済み' : '全体コピー'}
                              </span>
                            </span>
                          </ActionButton>

                          <ActionButton
                            type="generate"
                            onClick={exportToCsv}
                            loading={isExporting}
                            variant="secondary"
                            size="sm"
                            disabled={isExporting}
                            className={`${
                              isExporting
                                ? 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600'
                                : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'
                            } text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                          >
                            <span className="flex items-center space-x-1">
                              <span>{isExporting ? '⏳' : '💾'}</span>
                              <span>
                                {isExporting ? 'エクスポート中...' : 'CSV出力'}
                              </span>
                            </span>
                          </ActionButton>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* カード表示 */}
                    {viewMode === 'cards' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto custom-scrollbar">
                        {result.map((person, index) => (
                          <div
                            key={person.id}
                            className="group relative p-4 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl hover:bg-white/80 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                          >
                            {/* アイテム番号 */}
                            <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              #{index + 1}
                            </div>

                            <div className="space-y-2 text-sm">
                              {person.fullName && (
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4 text-blue-500" />
                                  <span className="font-medium">
                                    {person.fullName.kanji}
                                  </span>
                                </div>
                              )}
                              {person.kanaName && (
                                <div className="flex items-center space-x-2">
                                  <span className="text-blue-600 font-bold text-xs">
                                    🔤
                                  </span>
                                  <span className="font-medium text-blue-900">
                                    {person.kanaName}
                                  </span>
                                </div>
                              )}
                              {person.email && (
                                <div className="flex items-center space-x-2 group/email">
                                  <Mail className="h-4 w-4 text-emerald-500" />
                                  <span className="flex-1 truncate">
                                    {person.email}
                                  </span>
                                  <ActionButton
                                    type="copy"
                                    onClick={() =>
                                      person.email &&
                                      copyToClipboard(person.email)
                                    }
                                    variant="secondary"
                                    size="sm"
                                    className="opacity-0 group-hover/email:opacity-100 transition-opacity p-1"
                                  />
                                </div>
                              )}
                              {person.phone && (
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4 text-orange-500" />
                                  <span>{person.phone}</span>
                                </div>
                              )}
                              {person.address && (
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-red-500" />
                                  <span className="text-xs">
                                    {person.address.full}
                                  </span>
                                </div>
                              )}
                              {person.age && (
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4 text-purple-500" />
                                  <span>
                                    {person.age}歳 ({person.gender})
                                  </span>
                                </div>
                              )}
                              {person.company && (
                                <div className="flex items-center space-x-2">
                                  <Building className="h-4 w-4 text-indigo-500" />
                                  <span className="text-xs">
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
                  </CardContent>
                </Card>
              )}
            </div>

            {/* 右カラム: TDキャラクターエリア */}
            <div className="space-y-6">
              <Card variant="glass" className="backdrop-blur-xl sticky top-8">
                <CardContent className="p-6">
                  <EnhancedTDCharacter
                    mood={tdMood}
                    message={tdMessage}
                    animation={isGenerating ? 'spin' : 'float'}
                    size="lg"
                    interactive={!isGenerating}
                    showSpeechBubble={true}
                  />
                </CardContent>
              </Card>

              {/* エラー表示 */}
              {error && (
                <Card
                  variant="bordered"
                  className="border-red-200 bg-red-50/80 backdrop-blur-sm"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <p className="text-red-700 text-sm font-medium">
                        {error}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 統計情報 */}
              {result.length > 0 && (
                <Card variant="glass" className="backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-lg">生成統計</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">総件数</span>
                      <span className="font-semibold">{result.length}件</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">フィールド数</span>
                      <span className="font-semibold">
                        {selectedFieldCount}種類
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">生成時刻</span>
                      <span className="font-semibold text-xs">
                        {new Date().toLocaleTimeString('ja-JP')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* カスタムスクロールバーのスタイル */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </div>
  );
});
