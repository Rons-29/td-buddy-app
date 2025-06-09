'use client';

import React, { useState } from 'react';
import { 
  User, Users, Download, Copy, RefreshCw, Settings2, 
  CheckCircle, Zap, Mail, Phone, MapPin, Calendar, Building, Sparkles
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { FieldSelector, FieldOption } from './ui/FieldSelector';
import { EnhancedTDCharacter, TDMood } from './ui/EnhancedTDCharacter';

// 簡易版の型定義
interface PersonalInfo {
  id: string;
  fullName?: { kanji: string; katakana: string };
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
    description: '日本語の姓名（漢字・カタカナ）',
    selected: true 
  },
  { 
    id: 'email', 
    label: 'メールアドレス', 
    icon: '📧', 
    description: '実用的なメールアドレス形式',
    selected: true 
  },
  { 
    id: 'phone', 
    label: '電話番号', 
    icon: '☎️', 
    description: '固定電話・携帯電話番号',
    selected: true 
  },
  { 
    id: 'address', 
    label: '住所', 
    icon: '🏠', 
    description: '日本の住所（都道府県・市区町村）',
    selected: false 
  },
  { 
    id: 'age', 
    label: '年齢', 
    icon: '🔢', 
    description: '18〜80歳の範囲で生成',
    selected: false 
  },
  { 
    id: 'gender', 
    label: '性別', 
    icon: '⚧️', 
    description: '男性・女性・その他',
    selected: false 
  },
  { 
    id: 'company', 
    label: '会社名', 
    icon: '🏢', 
    description: '日本の企業名（実在・架空）',
    selected: false 
  },
  { 
    id: 'jobTitle', 
    label: '職種', 
    icon: '💼', 
    description: '業界に応じた職種・役職',
    selected: false 
  }
];

export const PersonalInfoGenerator: React.FC = () => {
  const [count, setCount] = useState(5);
  const [fieldOptions, setFieldOptions] = useState<FieldOption[]>(FIELD_OPTIONS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<PersonalInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tdMood, setTdMood] = useState<TDMood>('happy');
  const [tdMessage, setTdMessage] = useState('個人情報生成の準備ができました！');

  const handleFieldToggle = (fieldId: string) => {
    setFieldOptions(prev => 
      prev.map(option => 
        option.id === fieldId 
          ? { ...option, selected: !option.selected }
          : option
      )
    );
  };

  const copyToClipboard = async (text: string) => {
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
  };

  const exportToCsv = async () => {
    if (result.length === 0) return;

    const selectedFields = fieldOptions.filter(f => f.selected).map(f => f.id);
    
    try {
      const response = await fetch('http://localhost:3001/api/personal/export/csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: result,
          includeFields: selectedFields
        })
      });

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
    } catch (error) {
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
      const response = await fetch('http://localhost:3001/api/personal/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          count,
          locale: 'ja',
          includeFields: selectedFields.map(f => f.id)
        })
      });

      if (!response.ok) {
        throw new Error(`API エラー: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setResult(data.data.persons);
        setTdMood('success');
        setTdMessage(`✨ ${data.data.persons.length}件の個人情報を生成しました！`);
      } else {
        throw new Error('API レスポンスエラー');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '不明なエラー';
      setError(errorMessage);
      setTdMood('error');
      setTdMessage(`エラーが発生しました: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedFieldCount = fieldOptions.filter(f => f.selected).length;

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
                  <span className="text-sm text-gray-600 font-medium">Powered by TD Buddy</span>
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                </div>
              </div>
            </div>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              QAテスト用のリアルで実用的な個人情報データを生成します。
              <br />
              <span className="text-blue-600 font-medium">安全・高速・日本語対応</span>
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
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      生成件数
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={count}
                        onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                        className="w-24 px-4 py-3 text-lg font-medium border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      />
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>件のデータを生成</span>
                        {count > 100 && (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                            大量生成
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* フィールド選択 */}
                  <div className="space-y-4">
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
                    <Button
                      onClick={generatePersonalInfo}
                      disabled={isGenerating || selectedFieldCount === 0}
                      loading={isGenerating}
                      size="lg"
                      fullWidth
                      icon={isGenerating ? <RefreshCw className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                      className="relative overflow-hidden"
                    >
                      <span className="relative z-10">
                        {isGenerating ? 'データ生成中...' : `${count}件の個人情報を生成`}
                      </span>
                      
                      {/* ボタン内のキラキラエフェクト */}
                      {!isGenerating && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                      )}
                    </Button>
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
                      <div className="flex space-x-2">
                        <Button
                          onClick={exportToCsv}
                          variant="secondary"
                          size="sm"
                          icon={<Download className="h-4 w-4" />}
                        >
                          CSV出力
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
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
                                <span className="font-medium">{person.fullName.kanji}</span>
                                <span className="text-gray-500">({person.fullName.katakana})</span>
                              </div>
                            )}
                            {person.email && (
                              <div className="flex items-center space-x-2 group/email">
                                <Mail className="h-4 w-4 text-emerald-500" />
                                <span className="flex-1 truncate">{person.email}</span>
                                                                 <button
                                   onClick={() => person.email && copyToClipboard(person.email)}
                                   className="opacity-0 group-hover/email:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                                 >
                                   <Copy className="h-3 w-3 text-gray-400" />
                                 </button>
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
                                <span className="text-xs">{person.address.full}</span>
                              </div>
                            )}
                            {person.age && (
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-purple-500" />
                                <span>{person.age}歳 ({person.gender})</span>
                              </div>
                            )}
                            {person.company && (
                              <div className="flex items-center space-x-2">
                                <Building className="h-4 w-4 text-indigo-500" />
                                <span className="text-xs">{person.company} - {person.jobTitle}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
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
                <Card variant="bordered" className="border-red-200 bg-red-50/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <p className="text-red-700 text-sm font-medium">{error}</p>
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
                      <span className="font-semibold">{selectedFieldCount}種類</span>
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
};
