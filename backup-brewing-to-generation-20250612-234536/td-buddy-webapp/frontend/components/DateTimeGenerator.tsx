'use client';

import {
  Calendar,
  Globe,
  HelpCircle,
  RefreshCw,
  Settings,
  Users,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useButtonState } from '../hooks/useButtonState';
import {
  RegionConfig,
  TimeZoneInfo,
  WorldTimeComparator,
  WorldTimeComparison,
} from '../utils/worldTimeComparator';
import { ActionButton } from './ui/ActionButton';
import { Button } from './ui/Button';

// 型定義
export interface DateTimeSettings {
  format: 'iso' | 'timestamp' | 'date' | 'time' | 'datetime' | 'custom';
  timezone: string;
  customFormat?: string;
  locale: 'ja' | 'en';
  count: number;
  rangeStart?: Date;
  rangeEnd?: Date;
}

const DateTimeGenerator: React.FC = () => {
  // ボタン状態管理フック
  const { buttonStates, setButtonActive } = useButtonState(2000);

  // 個別コピー用の状態管理（アイテムごと）
  const [individualCopyStates, setIndividualCopyStates] = useState<{
    [key: number]: boolean;
  }>({});

  // State管理
  const [settings, setSettings] = useState<DateTimeSettings>({
    format: 'iso',
    timezone: 'Asia/Tokyo',
    locale: 'ja',
    count: 10,
  });

  const [generatedData, setGeneratedData] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showDataGenerator, setShowDataGenerator] = useState(false);

  // 世界時間比較機能の状態（常に表示）
  const [worldTimeComparison, setWorldTimeComparison] =
    useState<WorldTimeComparison | null>(null);
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>([
    'Asia/Tokyo',
    'America/New_York',
    'Europe/London',
  ]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRealTimeMode, setIsRealTimeMode] = useState(true); // リアルタイムモード管理

  // リージョン選択関連の状態
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [availableRegions, setAvailableRegions] = useState<RegionConfig[]>([]);
  const [customTime, setCustomTime] = useState('');

  // Brewキャラクター状態
  const [brewMessage, setBrewMessage] = useState(
    '🌍 時差確認・世界時間比較の準備完了です！リアルタイムで世界各地の時間をチェックできます♪'
  );

  // プリセットフォーマット
  const formatPresets = {
    iso: 'ISO 8601形式 (2024-01-01T00:00:00.000Z)',
    timestamp: 'タイムスタンプ (1704067200000)',
    date: '日付のみ (2024-01-01)',
    time: '時刻のみ (12:30:45)',
    datetime: '日付時刻 (2024-01-01 12:30:45)',
    custom: 'カスタム形式',
  };

  // タイムゾーンプリセット
  const timezonePresets = [
    { value: 'Asia/Tokyo', label: '日本標準時 (JST)' },
    { value: 'UTC', label: '協定世界時 (UTC)' },
    { value: 'America/New_York', label: 'アメリカ東部時間 (EST/EDT)' },
    { value: 'Europe/London', label: 'イギリス時間 (GMT/BST)' },
    { value: 'Asia/Shanghai', label: '中国標準時 (CST)' },
  ];

  // リージョンデータの初期化と時差確認の自動開始
  useEffect(() => {
    const regions = WorldTimeComparator.getAvailableRegions();
    setAvailableRegions(regions);

    // 時差確認を自動で開始
    const now = new Date();
    setCurrentTime(now);
    updateWorldTimeComparison(now);
  }, []);

  // 世界時間比較の更新（リージョン対応）
  const updateWorldTimeComparison = useCallback(
    (time: Date) => {
      const comparison = WorldTimeComparator.compareWorldTimesByRegion(
        time,
        settings.timezone,
        selectedRegion
      );
      setWorldTimeComparison(comparison);
    },
    [settings.timezone, selectedRegion]
  );

  // リアルタイム更新（isRealTimeModeがtrueの時のみ動作）
  useEffect(() => {
    if (isRealTimeMode) {
      const interval = setInterval(() => {
        const now = new Date();
        setCurrentTime(now);
        updateWorldTimeComparison(now);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [updateWorldTimeComparison, isRealTimeMode]);

  // リージョン変更ハンドラ
  const handleRegionChange = useCallback(
    (regionId: string) => {
      setSelectedRegion(regionId);

      const region = availableRegions.find(r => r.id === regionId);
      if (region) {
        setBrewMessage(
          `📍 表示地域を「${region.displayName}」に変更しました - ${region.description}`
        );
        updateWorldTimeComparison(currentTime);
      }
    },
    [availableRegions, currentTime, updateWorldTimeComparison]
  );

  // カスタム時間での比較
  const compareCustomTime = useCallback(() => {
    if (!customTime) {
      setBrewMessage('カスタム時間を入力してください');
      return;
    }

    const targetTime = new Date(customTime);
    if (isNaN(targetTime.getTime())) {
      setBrewMessage('有効な日時を入力してください');
      return;
    }

    updateWorldTimeComparison(targetTime);
    setBrewMessage(
      `🕐 指定時間「${targetTime.toLocaleString('ja-JP')}」での時差比較を表示中`
    );
  }, [customTime, updateWorldTimeComparison]);

  // 最適な会議時間を提案
  const suggestMeetingTime = useCallback(() => {
    if (selectedTimezones.length < 2) {
      setBrewMessage('会議時間の提案には2つ以上のタイムゾーンを選択してください');
      return;
    }

    const suggestions =
      WorldTimeComparator.suggestOptimalMeetingTime(selectedTimezones);
    const bestSuggestion = suggestions[0];

    if (bestSuggestion) {
      setBrewMessage(
        `💡 最適な会議時間提案：${bestSuggestion.suggestedTime} | 適合率：${bestSuggestion.score}% | ${bestSuggestion.reasoning}`
      );
    } else {
      setBrewMessage(
        '会議時間の提案でエラーが発生しました。タイムゾーンを確認してください'
      );
    }
  }, [selectedTimezones]);

  // タイムゾーン選択の更新
  const updateSelectedTimezones = useCallback((timezones: string[]) => {
    setSelectedTimezones(timezones);
    if (timezones.length >= 2) {
      setBrewMessage(
        `${timezones.length}個のタイムゾーンを選択しました。会議時間提案ボタンをクリックしてください！`
      );
    }
  }, []);

  // 現在時刻リセット機能
  const resetToCurrentTime = useCallback(() => {
    const now = new Date();
    setCurrentTime(now);
    setIsRealTimeMode(true); // リアルタイムモードを再開
    updateWorldTimeComparison(now);
    setBrewMessage('🔄 現在時刻にリセットしました！リアルタイム更新を再開します');
  }, [updateWorldTimeComparison]);

  // カスタム時間設定
  const setCustomTimeMode = useCallback(
    (timeString: string) => {
      if (timeString) {
        setIsRealTimeMode(false); // リアルタイムモード停止
        setCustomTime(timeString);
        const targetTime = new Date(timeString);
        if (!isNaN(targetTime.getTime())) {
          updateWorldTimeComparison(targetTime);
          setBrewMessage(
            `⏱️ カスタム時間モードに切り替えました: ${targetTime.toLocaleString(
              'ja-JP'
            )}`
          );
        }
      }
    },
    [updateWorldTimeComparison]
  );

  // データ醸造（改良版）
  const generateDateTime = useCallback(() => {
    if (settings.count < 1 || settings.count > 1000) {
      setBrewMessage('生成件数は1〜1000件の範囲で設定してください');
      return;
    }

    setIsGenerating(true);
    setBrewMessage(`${settings.count}件の日付・時刻データを醸造中...`);

    // 非同期で生成処理を実行
    setTimeout(() => {
      const results: string[] = [];
      const now = new Date();
      const startRange =
        settings.rangeStart ||
        new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); // 1年前
      const endRange =
        settings.rangeEnd ||
        new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1年後

      for (let i = 0; i < settings.count; i++) {
        // ランダムな日時を生成
        const randomTime =
          startRange.getTime() +
          Math.random() * (endRange.getTime() - startRange.getTime());
        const randomDate = new Date(randomTime);

        let formatted = '';

        switch (settings.format) {
          case 'iso':
            formatted = randomDate.toISOString();
            break;
          case 'timestamp':
            formatted = randomDate.getTime().toString();
            break;
          case 'date':
            formatted = randomDate.toLocaleDateString(
              settings.locale === 'ja' ? 'ja-JP' : 'en-US'
            );
            break;
          case 'time':
            formatted = randomDate.toLocaleTimeString(
              settings.locale === 'ja' ? 'ja-JP' : 'en-US'
            );
            break;
          case 'datetime':
            formatted = randomDate.toLocaleString(
              settings.locale === 'ja' ? 'ja-JP' : 'en-US'
            );
            break;
          case 'custom':
            // 簡単なカスタムフォーマット
            const year = randomDate.getFullYear();
            const month = String(randomDate.getMonth() + 1).padStart(2, '0');
            const day = String(randomDate.getDate()).padStart(2, '0');
            const hours = String(randomDate.getHours()).padStart(2, '0');
            const minutes = String(randomDate.getMinutes()).padStart(2, '0');
            const seconds = String(randomDate.getSeconds()).padStart(2, '0');

            formatted =
              settings.customFormat ||
              `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            formatted = formatted
              .replace(/YYYY/g, year.toString())
              .replace(/MM/g, month)
              .replace(/DD/g, day)
              .replace(/HH/g, hours)
              .replace(/mm/g, minutes)
              .replace(/SS/g, seconds);
            break;
          default:
            formatted = randomDate.toISOString();
        }

        results.push(formatted);
      }

      setGeneratedData(results);
      setBrewMessage(`✅ ${settings.count}件の日付・時刻データを醸造しました！`);
      setIsGenerating(false);
      setButtonActive('generate'); // ボタン状態を更新
      setIndividualCopyStates({}); // 個別コピー状態をリセット
    }, 100);
  }, [settings, setButtonActive]);

  // 全データをコピー（改良版）
  const copyAllData = useCallback(() => {
    const text = generatedData.join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setBrewMessage(
        `📋 全データ(${generatedData.length}件)をクリップボードにコピーしました`
      );
      setButtonActive('copy');
    });
  }, [generatedData, setButtonActive]);

  // データをダウンロード（改良版）
  const downloadData = useCallback(() => {
    const content = generatedData.join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `datetime_data_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setBrewMessage(
      `💾 日付・時刻データ(${generatedData.length}件)をダウンロードしました！`
    );
    setButtonActive('download');
  }, [generatedData, setButtonActive]);

  // 個別コピー（改良版）
  const copyIndividualData = useCallback((data: string, index: number) => {
    navigator.clipboard.writeText(data).then(() => {
      setBrewMessage(`📋 ${index + 1}番目の日時をコピーしました: ${data}`);

      // 個別コピー状態を更新（該当インデックスのみ）
      setIndividualCopyStates(prev => ({ ...prev, [index]: true }));

      // 2秒後にリセット
      setTimeout(() => {
        setIndividualCopyStates(prev => ({ ...prev, [index]: false }));
      }, 2000);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      {/* ヘッダー */}
      <div className="bg-white border-b border-td-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Globe className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-td-gray-900">
                時差確認・世界時間比較
              </h1>
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  isRealTimeMode
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {isRealTimeMode ? 'リアルタイム更新中' : 'カスタム時間設定中'}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowDataGenerator(!showDataGenerator)}
                icon={<Calendar className="h-4 w-4" />}
                variant={showDataGenerator ? 'primary' : 'secondary'}
                size="sm"
              >
                {showDataGenerator
                  ? 'データ醸造を閉じる'
                  : '日付・時刻データ醸造'}
              </Button>

              <Button
                onClick={() => setShowGuide(!showGuide)}
                icon={<HelpCircle className="h-4 w-4" />}
                variant={showGuide ? 'primary' : 'secondary'}
                size="sm"
              >
                {showGuide ? 'ガイドを閉じる' : '活用ガイド'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Brewキャラクターメッセージ */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🍺</div>
            <p className="text-green-800 font-medium">{brewMessage}</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* メインコンテンツ（世界時間比較を常に表示） */}
          <div
            className={`${
              showGuide ? 'lg:col-span-8' : 'lg:col-span-12'
            } space-y-6`}
          >
            {/* 世界時間比較パネル（常に表示） */}
            {worldTimeComparison && (
              <div className="bg-white rounded-xl p-6 border border-td-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-td-gray-900 flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    時差確認・世界時間比較
                  </h2>
                  <div className="flex items-center gap-2">
                    <input
                      type="datetime-local"
                      value={(() => {
                        // 表示されている基準時間と同じ形式でカレンダーに表示
                        const displayTime =
                          worldTimeComparison.baseTime.toLocaleString('sv-SE', {
                            timeZone: worldTimeComparison.baseTimeZone,
                          });
                        return displayTime.replace(' ', 'T').slice(0, 16);
                      })()}
                      onChange={e => {
                        const inputValue = e.target.value;
                        if (inputValue) {
                          // 入力値を「表示されている基準タイムゾーンでの時間」として扱う
                          // 例: カレンダーで12:00を選択 → 基準時間も12:00になる

                          // 現在の基準時間のUTC時間を取得
                          const currentBaseUTC = worldTimeComparison.baseTime;

                          // 基準タイムゾーンでの現在時刻
                          const currentBaseLocal =
                            currentBaseUTC.toLocaleString('sv-SE', {
                              timeZone: worldTimeComparison.baseTimeZone,
                            });

                          // 入力された時間と現在の基準時間の差を計算
                          const currentBaseDate = new Date(currentBaseLocal);
                          const inputDate = new Date(inputValue);
                          const timeDifference =
                            inputDate.getTime() - currentBaseDate.getTime();

                          // UTC時間に差分を適用
                          const newUTCTime = new Date(
                            currentBaseUTC.getTime() + timeDifference
                          );

                          if (!isNaN(newUTCTime.getTime())) {
                            setCustomTimeMode(newUTCTime.toISOString());
                          }
                        }
                      }}
                      className="px-3 py-1 text-sm border border-td-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <Button
                      onClick={suggestMeetingTime}
                      icon={<Users className="h-4 w-4" />}
                      variant="secondary"
                      size="sm"
                    >
                      会議時間提案
                    </Button>
                  </div>
                </div>

                {/* 基準時間表示 */}
                <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 mb-1 flex items-center gap-2">
                        📍 基準時間
                        {!isRealTimeMode && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                            カスタム設定
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-mono font-bold text-blue-900">
                          {worldTimeComparison.baseTime.toLocaleString(
                            'ja-JP',
                            {
                              timeZone: worldTimeComparison.baseTimeZone,
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            }
                          )}
                        </span>
                        <div className="text-sm text-blue-700">
                          <div>
                            {worldTimeComparison.baseTime.toLocaleString(
                              'ja-JP',
                              {
                                timeZone: worldTimeComparison.baseTimeZone,
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                              }
                            )}
                          </div>
                          <div className="font-medium">
                            {worldTimeComparison.comparisons.find(
                              tz => tz.id === worldTimeComparison.baseTimeZone
                            )?.displayName || worldTimeComparison.baseTimeZone}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm text-blue-600 mb-1">
                          タイムゾーン
                        </div>
                        <div className="text-sm font-medium text-blue-800">
                          {worldTimeComparison.comparisons.find(
                            tz => tz.id === worldTimeComparison.baseTimeZone
                          )?.offset || 'UTC+09:00'}
                        </div>
                        {worldTimeComparison.comparisons.find(
                          tz => tz.id === worldTimeComparison.baseTimeZone
                        )?.isDST && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded mt-1 inline-block">
                            サマータイム
                          </span>
                        )}
                      </div>

                      <Button
                        onClick={resetToCurrentTime}
                        icon={<RefreshCw className="h-4 w-4" />}
                        variant={isRealTimeMode ? 'secondary' : 'primary'}
                        size="sm"
                      >
                        {isRealTimeMode ? '現在時刻' : 'リアルタイムに戻す'}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* リージョン選択 */}
                <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                    🌏 表示地域の選択
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {availableRegions.map(region => (
                      <button
                        key={region.id}
                        onClick={() => handleRegionChange(region.id)}
                        className={`p-3 text-left rounded-lg border transition-all ${
                          selectedRegion === region.id
                            ? 'bg-purple-100 border-purple-400 shadow-sm'
                            : 'bg-white border-purple-200 hover:bg-purple-50 hover:border-purple-300'
                        }`}
                      >
                        <div
                          className={`font-medium text-sm ${
                            selectedRegion === region.id
                              ? 'text-purple-900'
                              : 'text-purple-800'
                          }`}
                        >
                          {region.displayName}
                        </div>
                        <div className="text-xs text-purple-600 mt-1">
                          {region.description}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 text-sm text-purple-700">
                    💡 <strong>チーム開発に最適</strong>:
                    メンバーの居住地域に合わせて表示地域を絞り込めます
                  </div>
                </div>

                {/* 比較時間リスト */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-td-gray-900 mb-4 flex items-center gap-2">
                    🌍 各地域の対応時間（時差確認）
                  </h3>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {worldTimeComparison.comparisons
                      .filter(tz => tz.id !== worldTimeComparison.baseTimeZone) // 基準時間は除外
                      .map((tz: TimeZoneInfo) => (
                        <div
                          key={tz.id}
                          className="flex items-center justify-between p-4 bg-td-gray-50 rounded-lg border hover:bg-td-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-24 flex-shrink-0">
                              <span className="font-mono text-xl font-bold text-td-gray-900">
                                {tz.currentTime.split(' ')[1]}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-td-gray-800 mb-1">
                                {tz.displayName}
                              </div>
                              <div className="text-sm text-td-gray-600 flex items-center gap-2">
                                <span>{tz.currentTime.split(' ')[0]}</span>
                                <span>•</span>
                                <span>{tz.offset}</span>
                                {tz.isDST && (
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                    DST
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0 ml-4">
                            <div
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                tz.timeDifference === '同じ時刻'
                                  ? 'bg-blue-100 text-blue-800'
                                  : tz.timeDifference.includes('進んでいる')
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}
                            >
                              {tz.timeDifference}
                            </div>
                            <div className="text-xs text-td-gray-500 mt-1">
                              基準時間との差
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* 簡易時差表 */}
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                      ⏰ 時差早見表
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                      {worldTimeComparison.comparisons
                        .filter(
                          tz => tz.id !== worldTimeComparison.baseTimeZone
                        )
                        .slice(0, 9) // 上位9件のみ表示
                        .map((tz: TimeZoneInfo) => (
                          <div
                            key={tz.id}
                            className="flex items-center justify-between p-3 bg-white rounded border hover:bg-amber-25 transition-colors"
                          >
                            <span className="font-medium text-amber-800 truncate pr-2">
                              {tz.displayName}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded whitespace-nowrap flex-shrink-0 ${
                                tz.timeDifference === '同じ時刻'
                                  ? 'bg-blue-100 text-blue-800'
                                  : tz.timeDifference.includes('進んでいる')
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}
                            >
                              {tz.timeDifference}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* ビジネスアワー分析 */}
                {worldTimeComparison && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                      ビジネスアワー分析
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                      {WorldTimeComparator.analyzeBusinessHours(
                        worldTimeComparison
                      ).map((analysis, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-white rounded border hover:bg-green-25 transition-colors"
                        >
                          <div
                            className={`w-3 h-3 rounded-full flex-shrink-0 ${
                              analysis.isBusinessHours
                                ? 'bg-green-500'
                                : 'bg-gray-400'
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-green-800 truncate">
                              {analysis.timezone}
                            </div>
                            <div
                              className={`text-xs ${
                                analysis.isBusinessHours
                                  ? 'text-green-600'
                                  : 'text-gray-600'
                              }`}
                            >
                              {analysis.isBusinessHours
                                ? '営業中 (9:00-18:00)'
                                : '営業外'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* データ醸造セクション（切り替え可能） */}
            {showDataGenerator && (
              <>
                {/* 設定パネル */}
                <div className="bg-white rounded-xl p-6 border border-td-gray-200 shadow-sm">
                  <h2 className="text-xl font-semibold text-td-gray-900 mb-6 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    日付・時刻データ醸造設定
                  </h2>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* 出力形式 */}
                    <div>
                      <label className="block text-sm font-medium text-td-gray-700 mb-2">
                        出力形式
                      </label>
                      <select
                        value={settings.format}
                        onChange={e =>
                          setSettings({
                            ...settings,
                            format: e.target
                              .value as DateTimeSettings['format'],
                          })
                        }
                        className="w-full px-4 py-2 border border-td-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {Object.entries(formatPresets).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* タイムゾーン */}
                    <div>
                      <label className="block text-sm font-medium text-td-gray-700 mb-2">
                        タイムゾーン
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={e =>
                          setSettings({ ...settings, timezone: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-td-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {timezonePresets.map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 生成件数 */}
                    <div>
                      <label className="block text-sm font-medium text-td-gray-700 mb-2">
                        生成件数
                      </label>
                      <input
                        type="number"
                        value={settings.count}
                        onChange={e =>
                          setSettings({
                            ...settings,
                            count: Math.max(
                              1,
                              Math.min(1000, parseInt(e.target.value) || 1)
                            ),
                          })
                        }
                        className="w-full px-4 py-2 border border-td-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        min="1"
                        max="1000"
                      />
                    </div>

                    {/* ロケール */}
                    <div>
                      <label className="block text-sm font-medium text-td-gray-700 mb-2">
                        言語・地域
                      </label>
                      <select
                        value={settings.locale}
                        onChange={e =>
                          setSettings({
                            ...settings,
                            locale: e.target.value as 'ja' | 'en',
                          })
                        }
                        className="w-full px-4 py-2 border border-td-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="ja">日本語</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    {/* カスタムフォーマット */}
                    {settings.format === 'custom' && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-td-gray-700 mb-2">
                          カスタムフォーマット
                        </label>
                        <input
                          type="text"
                          value={settings.customFormat || ''}
                          onChange={e =>
                            setSettings({
                              ...settings,
                              customFormat: e.target.value,
                            })
                          }
                          placeholder="YYYY-MM-DD HH:mm:SS"
                          className="w-full px-4 py-2 border border-td-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <p className="text-xs text-td-gray-500 mt-1">
                          YYYY: 年, MM: 月, DD: 日, HH: 時, mm: 分, SS: 秒
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 操作ボタン */}
                  <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-td-gray-200">
                    <ActionButton
                      type="generate"
                      onClick={generateDateTime}
                      isActive={buttonStates.generate}
                      disabled={isGenerating}
                      size="md"
                    >
                      {isGenerating ? '醸造中...' : undefined}
                    </ActionButton>
                  </div>
                </div>

                {/* 醸造結果 */}
                {generatedData.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-td-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-td-gray-800">
                        醸造結果 ({generatedData.length}件)
                      </h3>
                      <div className="flex gap-2">
                        <ActionButton
                          type="copy"
                          onClick={copyAllData}
                          isActive={buttonStates.copy}
                          size="sm"
                        />
                        <ActionButton
                          type="download"
                          onClick={downloadData}
                          isActive={buttonStates.download}
                          size="sm"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {generatedData.slice(0, 12).map((dateTime, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-td-gray-50 rounded-lg border hover:bg-td-gray-100 transition-colors"
                        >
                          <span className="font-mono text-sm text-td-gray-800">
                            {dateTime}
                          </span>
                          <button
                            onClick={() => copyIndividualData(dateTime, index)}
                            className={`px-3 py-1 text-xs rounded transition-all duration-200 font-medium ${
                              individualCopyStates[index]
                                ? 'bg-green-500 text-white'
                                : 'bg-td-gray-200 text-td-gray-700 hover:bg-td-gray-300'
                            }`}
                          >
                            <span className="flex items-center space-x-1">
                              <span>
                                {individualCopyStates[index] ? '✅' : '📋'}
                              </span>
                              <span>
                                {individualCopyStates[index]
                                  ? 'コピー済み'
                                  : 'コピー'}
                              </span>
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>

                    {generatedData.length > 12 && (
                      <p className="text-sm text-td-gray-500 mt-4">
                        プレビューは最初の12件のみ表示されています。全データはダウンロードでご確認ください。
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* サイドパネル（ガイド） */}
          {showGuide && (
            <div className="lg:col-span-4">
              <div className="sticky top-24 bg-white rounded-xl p-6 border border-td-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-td-gray-800 mb-4">
                  🚀 活用ガイド
                </h3>

                <div className="space-y-4 text-sm text-td-gray-600">
                  <div>
                    <h4 className="font-medium text-td-gray-800 mb-2">
                      🌍 時差確認・世界時間比較
                    </h4>
                    <ul className="space-y-1">
                      <li>• リアルタイム世界時計表示</li>
                      <li>• 各地域との時差自動計算</li>
                      <li>• ビジネスアワー分析</li>
                      <li>• 最適な会議時間提案</li>
                      <li>• 夏時間(DST)自動判定</li>
                      <li>• 地域別表示で見やすく整理</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-td-gray-800 mb-2">
                      📅 日付・時刻データ醸造
                    </h4>
                    <ul className="space-y-1">
                      <li>• 出力形式を選択</li>
                      <li>• タイムゾーンを設定</li>
                      <li>• 生成件数を指定</li>
                      <li>• データを生成・コピー</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-td-gray-800 mb-2">
                      🎯 フォーマット例
                    </h4>
                    <ul className="space-y-1">
                      <li>• ISO: 2024-01-01T00:00:00.000Z</li>
                      <li>• タイムスタンプ: 1704067200000</li>
                      <li>• 日付: 2024/01/01</li>
                      <li>• 時刻: 12:30:45</li>
                      <li>• カスタム: 自由なフォーマット</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-td-gray-800 mb-2">
                      🌍 対応タイムゾーン
                    </h4>
                    <ul className="space-y-1">
                      <li>• 日本標準時 (JST)</li>
                      <li>• 協定世界時 (UTC)</li>
                      <li>• 主要都市の時間に対応</li>
                      <li>• 夏時間自動考慮</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-td-gray-800 mb-2">
                      💡 効率化Tips
                    </h4>
                    <ul className="space-y-1">
                      <li>• 個別・全データコピー可能</li>
                      <li>• ファイルダウンロード対応</li>
                      <li>• 最大1,000件まで生成</li>
                      <li>• グローバル会議の時間調整に便利</li>
                      <li>• リアルタイム更新で正確</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateTimeGenerator;
