# 🌍 DateTime機能 世界標準時間対応仕様書

## 📋 機能概要

**TestData Buddy DateTime機能 - 世界標準時間対応版**

### 🎯 主要機能
1. **基本日時生成** - 日付・時刻・タイムスタンプ等
2. **世界標準時間確認** - 日本からの時差表示・変換 ⭐ 新機能
3. **多言語フォーマット** - 国際化対応
4. **タイムゾーン変換** - リアルタイム変換・比較

---

## 🌐 世界標準時間確認機能

### 新機能の詳細

#### A. 時差計算・表示機能
```typescript
interface WorldTimeComparison {
  baseTime: string;           // 基準時間（日本時間）
  targetTimezone: string;     // 対象タイムゾーン
  timeDifference: string;     // "JST+9時間先", "JST-5時間遅れ"
  localTime: string;          // 現地時間
  businessHours: boolean;     // 営業時間内かどうか
  seasonalInfo?: string;      // サマータイム情報
}
```

#### B. 対応タイムゾーン一覧
```typescript
const WORLD_TIMEZONES = {
  // アジア・太平洋
  'Asia/Tokyo': { name: '日本標準時', offset: '+09:00', region: 'アジア' },
  'Asia/Seoul': { name: '韓国標準時', offset: '+09:00', region: 'アジア' },
  'Asia/Shanghai': { name: '中国標準時', offset: '+08:00', region: 'アジア' },
  'Asia/Kolkata': { name: 'インド標準時', offset: '+05:30', region: 'アジア' },
  'Asia/Dubai': { name: 'UAE標準時', offset: '+04:00', region: '中東' },
  
  // ヨーロッパ
  'Europe/London': { name: 'グリニッジ標準時', offset: '+00:00', region: 'ヨーロッパ' },
  'Europe/Paris': { name: '中央ヨーロッパ時間', offset: '+01:00', region: 'ヨーロッパ' },
  'Europe/Moscow': { name: 'モスクワ標準時', offset: '+03:00', region: 'ヨーロッパ' },
  
  // アメリカ大陸
  'America/New_York': { name: '東部標準時', offset: '-05:00', region: 'アメリカ' },
  'America/Chicago': { name: '中部標準時', offset: '-06:00', region: 'アメリカ' },
  'America/Denver': { name: '山地標準時', offset: '-07:00', region: 'アメリカ' },
  'America/Los_Angeles': { name: '太平洋標準時', offset: '-08:00', region: 'アメリカ' },
  'America/Sao_Paulo': { name: 'ブラジル標準時', offset: '-03:00', region: '南アメリカ' },
  
  // オセアニア・アフリカ
  'Australia/Sydney': { name: 'オーストラリア東部標準時', offset: '+10:00', region: 'オセアニア' },
  'Pacific/Auckland': { name: 'ニュージーランド標準時', offset: '+12:00', region: 'オセアニア' },
  'Africa/Cairo': { name: 'エジプト標準時', offset: '+02:00', region: 'アフリカ' },
  'Africa/Johannesburg': { name: '南アフリカ標準時', offset: '+02:00', region: 'アフリカ' },
};
```

#### C. 日本からの時差表示例
```
📍 現在の日本時間: 2025年6月11日 13:54 (JST)

🌍 世界の時間：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🇺🇸 ニューヨーク    | 06月11日 00:54 | 🟢 13時間遅れ
🇬🇧 ロンドン        | 06月11日 05:54 | 🟡 8時間遅れ
🇨🇳 上海          | 06月11日 12:54 | 🟡 1時間遅れ
🇰🇷 ソウル         | 06月11日 13:54 | ✅ 同じ時間
🇦🇺 シドニー       | 06月11日 14:54 | 🔵 1時間進み
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💼 営業時間チェック：
ニューヨーク: 🌙 夜間（営業時間外）
ロンドン: 🌅 早朝（営業時間前）
上海: ✅ 営業時間内
ソウル: ✅ 営業時間内
シドニー: ✅ 営業時間内
```

---

## 🛠️ 技術実装仕様

### A. バックエンドAPI設計

#### 1. DateTimeService.ts
```typescript
export class DateTimeService {
  // 基本日時生成
  async generateDateTime(options: DateTimeOptions): Promise<DateTimeData[]> {
    // 既存の日時生成ロジック
  }
  
  // 🌍 世界標準時間確認機能（新規）
  async getWorldTimeComparison(baseTime?: string, timezones?: string[]): Promise<WorldTimeComparison[]> {
    const base = baseTime ? new Date(baseTime) : new Date();
    const japanTime = this.convertToTimezone(base, 'Asia/Tokyo');
    
    const comparisons = timezones?.map(tz => {
      const localTime = this.convertToTimezone(base, tz);
      const difference = this.calculateTimeDifference('Asia/Tokyo', tz);
      
      return {
        baseTime: japanTime.toISOString(),
        targetTimezone: tz,
        timeDifference: this.formatTimeDifference(difference),
        localTime: localTime.toISOString(),
        businessHours: this.isBusinessHours(localTime),
        seasonalInfo: this.getDaylightSavingInfo(tz, base)
      };
    });
    
    return comparisons || [];
  }
  
  // タイムゾーン変換
  private convertToTimezone(date: Date, timezone: string): Date {
    return utcToZonedTime(date, timezone);
  }
  
  // 時差計算
  private calculateTimeDifference(fromTz: string, toTz: string): number {
    const now = new Date();
    const fromTime = this.convertToTimezone(now, fromTz);
    const toTime = this.convertToTimezone(now, toTz);
    return (toTime.getTime() - fromTime.getTime()) / (1000 * 60 * 60); // 時間単位
  }
  
  // 営業時間判定
  private isBusinessHours(date: Date): boolean {
    const hour = date.getHours();
    const dayOfWeek = date.getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 9 && hour <= 17;
  }
  
  // サマータイム情報
  private getDaylightSavingInfo(timezone: string, date: Date): string | undefined {
    // サマータイム適用地域の判定ロジック
    const dstRegions = ['America/New_York', 'Europe/London', 'Europe/Paris'];
    if (dstRegions.includes(timezone)) {
      return this.isDaylightSavingTime(date, timezone) ? 'サマータイム適用中' : '標準時間';
    }
    return undefined;
  }
}
```

#### 2. APIエンドポイント
```typescript
// /api/datetime/worldtime
router.get('/worldtime', async (req: Request, res: Response) => {
  try {
    const { baseTime, timezones } = req.query;
    const service = new DateTimeService();
    
    const defaultTimezones = [
      'America/New_York', 'Europe/London', 'Asia/Shanghai', 
      'Asia/Seoul', 'Australia/Sydney'
    ];
    
    const result = await service.getWorldTimeComparison(
      baseTime as string,
      timezones ? (timezones as string).split(',') : defaultTimezones
    );
    
    res.json({
      success: true,
      data: result,
      japanTime: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
      tdMessage: '世界の時間を確認しました！グローバルな視点でデータ管理をサポートします🌍'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '世界標準時間の取得に失敗しました',
      tdMessage: 'TDが時間の調整をしています。少しお待ちください⏰'
    });
  }
});
```

### B. フロントエンド実装

#### 1. WorldTimeDisplay.tsx
```typescript
import { useState, useEffect } from 'react';

interface WorldTimeDisplayProps {
  baseTime?: Date;
  selectedTimezones?: string[];
}

export function WorldTimeDisplay({ baseTime, selectedTimezones }: WorldTimeDisplayProps) {
  const [worldTimes, setWorldTimes] = useState<WorldTimeComparison[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchWorldTimes();
    const interval = setInterval(fetchWorldTimes, 60000); // 1分毎に更新
    return () => clearInterval(interval);
  }, [baseTime, selectedTimezones]);
  
  const fetchWorldTimes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (baseTime) params.append('baseTime', baseTime.toISOString());
      if (selectedTimezones) params.append('timezones', selectedTimezones.join(','));
      
      const response = await fetch(`/api/datetime/worldtime?${params}`);
      const data = await response.json();
      setWorldTimes(data.data);
    } catch (error) {
      console.error('世界時間の取得に失敗:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="td-world-time-container">
      <h3 className="text-lg font-bold mb-4">🌍 世界標準時間確認</h3>
      
      <div className="japan-time-display mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🇯🇵</span>
          <div>
            <p className="text-sm text-gray-600">現在の日本時間</p>
            <p className="text-xl font-bold text-blue-600">
              {new Date().toLocaleString('ja-JP', { 
                timeZone: 'Asia/Tokyo',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>
      
      <div className="world-times-grid">
        {worldTimes.map((time, index) => (
          <WorldTimeCard key={index} timeData={time} />
        ))}
      </div>
      
      {loading && (
        <div className="loading-indicator">
          <span className="animate-spin text-2xl">⏰</span>
          <p>TDが世界の時間を確認中...</p>
        </div>
      )}
    </div>
  );
}

// 個別の時間表示カード
function WorldTimeCard({ timeData }: { timeData: WorldTimeComparison }) {
  const timezone = WORLD_TIMEZONES[timeData.targetTimezone];
  const localTime = new Date(timeData.localTime);
  
  return (
    <div className="world-time-card p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getCountryFlag(timeData.targetTimezone)}</span>
          <div>
            <p className="font-semibold">{timezone?.name}</p>
            <p className="text-sm text-gray-500">{timezone?.region}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">
            {localTime.toLocaleString('ja-JP', {
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <p className="text-sm text-gray-600">{timeData.timeDifference}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-sm">
        <span className={`inline-block w-2 h-2 rounded-full ${
          timeData.businessHours ? 'bg-green-500' : 'bg-gray-400'
        }`}></span>
        <span>{timeData.businessHours ? '営業時間内' : '営業時間外'}</span>
        
        {timeData.seasonalInfo && (
          <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
            {timeData.seasonalInfo}
          </span>
        )}
      </div>
    </div>
  );
}
```

---

## 📊 データタイプ拡張

### 既存のDateTime機能 + 世界時間対応
```typescript
interface DateTimeGenerationOptions {
  // 基本設定
  type: 'date' | 'time' | 'datetime' | 'timestamp' | 'iso8601' | 'relative' | 'formatted' | 'calendar' | 'worldtime'; // 🌍 新追加
  count: number;
  
  // 日時範囲
  startDate?: string;
  endDate?: string;
  
  // フォーマット設定
  format?: string;
  locale?: string;
  timezone?: string;
  
  // 🌍 世界時間設定（新規）
  baseTimezone?: string;          // 基準タイムゾーン（デフォルト: Asia/Tokyo）
  targetTimezones?: string[];     // 比較対象タイムゾーン
  includeBusinessHours?: boolean; // 営業時間情報を含むか
  includeDST?: boolean;          // サマータイム情報を含むか
  
  // 日本固有設定
  includeJapaneseEra?: boolean;   // 和暦を含むか
  includeHolidays?: boolean;      // 祝日情報を含むか
}
```

---

## 🎯 実装スケジュール

### 週1 (現在): 基本DateTime + 世界時間機能
```
月: DateTimeService基本実装 + WorldTime API設計
火: 世界時間比較ロジック実装 + タイムゾーン処理
水: フロントエンドUI実装 + リアルタイム更新
木: 統合テスト + 多言語対応 + エラーハンドリング
金: ドキュメント整備 + パフォーマンステスト
```

### 実装優先順位
1. **高優先度**: 基本日時生成 + 世界時間比較表示
2. **中優先度**: 営業時間判定 + サマータイム対応
3. **低優先度**: 詳細なロケール対応 + 祝日情報

---

## 🧪 テスト計画

### A. 世界時間機能のテストケース
```typescript
describe('WorldTime機能', () => {
  test('日本時間からの時差計算', () => {
    // JST -> EST の時差計算テスト
    expect(calculateTimeDifference('Asia/Tokyo', 'America/New_York')).toBe(-14);
  });
  
  test('営業時間判定', () => {
    // 平日13時（営業時間内）
    const workingHours = new Date('2025-06-11T13:00:00+09:00');
    expect(isBusinessHours(workingHours)).toBe(true);
    
    // 土曜日（営業時間外）
    const weekend = new Date('2025-06-14T13:00:00+09:00');
    expect(isBusinessHours(weekend)).toBe(false);
  });
  
  test('サマータイム判定', () => {
    // 夏期（サマータイム適用）
    const summer = new Date('2025-07-15T12:00:00Z');
    expect(isDaylightSavingTime(summer, 'America/New_York')).toBe(true);
    
    // 冬期（標準時間）
    const winter = new Date('2025-01-15T12:00:00Z');
    expect(isDaylightSavingTime(winter, 'America/New_York')).toBe(false);
  });
});
```

### B. パフォーマンステスト
- **複数タイムゾーン同時処理**: 15ゾーン以下で < 100ms
- **リアルタイム更新**: 1分間隔でメモリリーク無し
- **大量データ生成**: 1000件の日時データを < 3秒で生成

---

## 🌟 期待される効果

### ユーザビリティ向上
1. **グローバル対応**: 国際プロジェクトでの利便性向上
2. **視覚的理解**: 時差を直感的に把握
3. **業務効率化**: 会議スケジュール調整の支援

### 技術的価値
1. **データ品質向上**: タイムゾーン考慮したテストデータ
2. **国際化対応**: 多国展開システムのテスト支援
3. **リアルタイム処理**: 時間に依存する機能のテスト

**TDからのメッセージ**: 
```
「世界標準時間機能、とても素晴らしいアイデアです！
地球のどこにいても、TDが時間の橋渡しをします。

日本から見た世界の時間、世界から見た日本の時間、
両方の視点でグローバルなデータを作りましょう！

時の流れは世界共通、でも時間の概念は文化それぞれ。
TDと一緒に、時空を超えたデータを生成しましょう🌍⏰✨」
```

---

**策定日**: 2025-06-11  
**対象機能**: DateTime + WorldTime  
**期待リリース**: 週内完成予定 