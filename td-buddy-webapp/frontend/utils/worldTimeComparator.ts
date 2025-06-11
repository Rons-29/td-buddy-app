export interface TimeZoneInfo {
  id: string;
  name: string;
  displayName: string;
  offset: string;
  currentTime: string;
  timeDifference: string;
  isDST: boolean;
  country: string;
  city: string;
}

export interface WorldTimeComparison {
  baseTime: Date;
  baseTimeZone: string;
  comparisons: TimeZoneInfo[];
  generatedAt: Date;
}

export class WorldTimeComparator {
  // 主要タイムゾーンの定義
  private static readonly MAJOR_TIMEZONES = [
    { id: 'UTC', name: 'UTC', displayName: '協定世界時', country: '国際', city: 'UTC' },
    { id: 'Asia/Tokyo', name: 'JST', displayName: '日本標準時', country: '日本', city: '東京' },
    { id: 'America/New_York', name: 'EST/EDT', displayName: 'アメリカ東部時間', country: 'アメリカ', city: 'ニューヨーク' },
    { id: 'America/Los_Angeles', name: 'PST/PDT', displayName: 'アメリカ西部時間', country: 'アメリカ', city: 'ロサンゼルス' },
    { id: 'America/Chicago', name: 'CST/CDT', displayName: 'アメリカ中部時間', country: 'アメリカ', city: 'シカゴ' },
    { id: 'Europe/London', name: 'GMT/BST', displayName: 'イギリス時間', country: 'イギリス', city: 'ロンドン' },
    { id: 'Europe/Paris', name: 'CET/CEST', displayName: '中央ヨーロッパ時間', country: 'フランス', city: 'パリ' },
    { id: 'Europe/Berlin', name: 'CET/CEST', displayName: 'ドイツ時間', country: 'ドイツ', city: 'ベルリン' },
    { id: 'Asia/Shanghai', name: 'CST', displayName: '中国標準時', country: '中国', city: '上海' },
    { id: 'Asia/Seoul', name: 'KST', displayName: '韓国標準時', country: '韓国', city: 'ソウル' },
    { id: 'Asia/Hong_Kong', name: 'HKT', displayName: '香港時間', country: '香港', city: '香港' },
    { id: 'Asia/Singapore', name: 'SGT', displayName: 'シンガポール時間', country: 'シンガポール', city: 'シンガポール' },
    { id: 'Asia/Bangkok', name: 'ICT', displayName: 'インドシナ時間', country: 'タイ', city: 'バンコク' },
    { id: 'Asia/Mumbai', name: 'IST', displayName: 'インド標準時', country: 'インド', city: 'ムンバイ' },
    { id: 'Asia/Dubai', name: 'GST', displayName: '湾岸標準時', country: 'UAE', city: 'ドバイ' },
    { id: 'Europe/Moscow', name: 'MSK', displayName: 'モスクワ時間', country: 'ロシア', city: 'モスクワ' },
    { id: 'Africa/Cairo', name: 'EET', displayName: '東ヨーロッパ時間', country: 'エジプト', city: 'カイロ' },
    { id: 'Australia/Sydney', name: 'AEST/AEDT', displayName: 'オーストラリア東部時間', country: 'オーストラリア', city: 'シドニー' },
    { id: 'Pacific/Auckland', name: 'NZST/NZDT', displayName: 'ニュージーランド時間', country: 'ニュージーランド', city: 'オークランド' },
    { id: 'America/Toronto', name: 'EST/EDT', displayName: 'カナダ東部時間', country: 'カナダ', city: 'トロント' },
    { id: 'America/Mexico_City', name: 'CST/CDT', displayName: 'メキシコ時間', country: 'メキシコ', city: 'メキシコシティ' },
    { id: 'America/Sao_Paulo', name: 'BRT', displayName: 'ブラジル時間', country: 'ブラジル', city: 'サンパウロ' },
    { id: 'America/Argentina/Buenos_Aires', name: 'ART', displayName: 'アルゼンチン時間', country: 'アルゼンチン', city: 'ブエノスアイレス' }
  ];

  /**
   * 指定された基準時間に対する世界各地の時間を比較
   */
  static compareWorldTimes(baseTime: Date, baseTimeZone: string = 'Asia/Tokyo'): WorldTimeComparison {
    const comparisons: TimeZoneInfo[] = [];

    for (const timezone of this.MAJOR_TIMEZONES) {
      try {
        // 基準時間をタイムゾーンに変換
        const timeInZone = new Date(baseTime.toLocaleString('en-US', { timeZone: timezone.id }));
        const baseInZone = new Date(baseTime.toLocaleString('en-US', { timeZone: baseTimeZone }));
        
        // 時差を計算
        const timeDiffMs = timeInZone.getTime() - baseInZone.getTime();
        const timeDiffHours = timeDiffMs / (1000 * 60 * 60);
        
        // UTC オフセットを取得
        const offset = this.getUTCOffset(timezone.id, baseTime);
        
        // 夏時間判定
        const isDST = this.isDaylightSavingTime(timezone.id, baseTime);
        
        // 時差文字列を生成
        const timeDifference = this.formatTimeDifference(timeDiffHours);
        
        comparisons.push({
          id: timezone.id,
          name: timezone.name,
          displayName: timezone.displayName,
          offset: offset,
          currentTime: timeInZone.toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: timezone.id
          }),
          timeDifference,
          isDST,
          country: timezone.country,
          city: timezone.city
        });
      } catch (error) {
        console.warn(`Failed to process timezone ${timezone.id}:`, error);
      }
    }

    // 時差順にソート
    comparisons.sort((a, b) => {
      const aHours = this.parseTimeDifferenceHours(a.timeDifference);
      const bHours = this.parseTimeDifferenceHours(b.timeDifference);
      return aHours - bHours;
    });

    return {
      baseTime,
      baseTimeZone,
      comparisons,
      generatedAt: new Date()
    };
  }

  /**
   * リアルタイム世界時計を生成
   */
  static generateRealTimeWorldClock(): WorldTimeComparison {
    const now = new Date();
    return this.compareWorldTimes(now);
  }

  /**
   * 特定の時刻での世界時間を生成（過去・未来対応）
   */
  static generateWorldTimeAt(targetTime: Date, baseTimeZone: string = 'Asia/Tokyo'): WorldTimeComparison {
    return this.compareWorldTimes(targetTime, baseTimeZone);
  }

  /**
   * UTC オフセットを取得
   */
  private static getUTCOffset(timeZoneId: string, date: Date): string {
    try {
      // Intl.DateTimeFormat を使用してオフセットを取得
      const formatter = new Intl.DateTimeFormat('en', {
        timeZone: timeZoneId,
        timeZoneName: 'longOffset'
      });
      
      const parts = formatter.formatToParts(date);
      const offsetPart = parts.find(part => part.type === 'timeZoneName');
      
      if (offsetPart && offsetPart.value.startsWith('GMT')) {
        return offsetPart.value.replace('GMT', 'UTC');
      }
      
      // フォールバック: 手動計算
      const utcTime = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
      const localTime = new Date(date.toLocaleString('en-US', { timeZone: timeZoneId }));
      const diffMs = localTime.getTime() - utcTime.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      
      const sign = diffHours >= 0 ? '+' : '-';
      const hours = Math.floor(Math.abs(diffHours));
      const minutes = Math.round((Math.abs(diffHours) - hours) * 60);
      
      return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } catch (error) {
      return 'UTC+00:00';
    }
  }

  /**
   * 夏時間かどうかを判定
   */
  private static isDaylightSavingTime(timeZoneId: string, date: Date): boolean {
    try {
      // 1月と7月のオフセットを比較して夏時間を判定
      const january = new Date(date.getFullYear(), 0, 1);
      const july = new Date(date.getFullYear(), 6, 1);
      
      const janOffset = this.getTimezoneOffset(timeZoneId, january);
      const julOffset = this.getTimezoneOffset(timeZoneId, july);
      const currentOffset = this.getTimezoneOffset(timeZoneId, date);
      
      // 夏時間期間中は通常オフセットより小さくなる（西半球）または大きくなる（東半球）
      return currentOffset !== Math.max(janOffset, julOffset);
    } catch (error) {
      return false;
    }
  }

  /**
   * タイムゾーンオフセットを分単位で取得
   */
  private static getTimezoneOffset(timeZoneId: string, date: Date): number {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timeZoneId }));
    return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60);
  }

  /**
   * 時差を読みやすい形式でフォーマット
   */
  private static formatTimeDifference(hours: number): string {
    if (hours === 0) {
      return '同じ時刻';
    }
    
    const absHours = Math.abs(hours);
    const wholeHours = Math.floor(absHours);
    const minutes = Math.round((absHours - wholeHours) * 60);
    
    let timeStr = '';
    if (wholeHours > 0) {
      timeStr += `${wholeHours}時間`;
    }
    if (minutes > 0) {
      timeStr += `${minutes}分`;
    }
    
    if (hours > 0) {
      return `${timeStr}進んでいる`;
    } else {
      return `${timeStr}遅れている`;
    }
  }

  /**
   * 時差文字列から時間数を抽出（ソート用）
   */
  private static parseTimeDifferenceHours(timeDifference: string): number {
    if (timeDifference === '同じ時刻') return 0;
    
    const isAdvanced = timeDifference.includes('進んでいる');
    const hoursMatch = timeDifference.match(/(\d+)時間/);
    const minutesMatch = timeDifference.match(/(\d+)分/);
    
    let hours = 0;
    if (hoursMatch) hours += parseInt(hoursMatch[1]);
    if (minutesMatch) hours += parseInt(minutesMatch[1]) / 60;
    
    return isAdvanced ? hours : -hours;
  }

  /**
   * ビジネスアワー分析
   */
  static analyzeBusinessHours(comparison: WorldTimeComparison): {
    timezone: string;
    isBusinessHours: boolean;
    businessHoursStart: string;
    businessHoursEnd: string;
    recommendation: string;
  }[] {
    return comparison.comparisons.map(tz => {
      const time = new Date(tz.currentTime);
      const hour = time.getHours();
      
      // 一般的なビジネスアワー: 9:00-18:00
      const isBusinessHours = hour >= 9 && hour <= 18;
      
      let recommendation = '';
      if (isBusinessHours) {
        recommendation = '会議・商談に適した時間です';
      } else if (hour >= 19 && hour <= 23) {
        recommendation = '夜間のカジュアルな連絡に適しています';
      } else if (hour >= 6 && hour <= 8) {
        recommendation = '朝の簡単な連絡に適しています';
      } else {
        recommendation = '深夜・早朝のため、緊急時以外は避けましょう';
      }
      
      return {
        timezone: tz.displayName,
        isBusinessHours,
        businessHoursStart: '09:00',
        businessHoursEnd: '18:00',
        recommendation
      };
    });
  }

  /**
   * 最適な会議時間を提案
   */
  static suggestOptimalMeetingTime(timezones: string[]): {
    suggestedTime: string;
    participants: { timezone: string; localTime: string; isBusinessHours: boolean }[];
    score: number;
    reasoning: string;
  }[] {
    const suggestions: any[] = [];
    
    // 24時間を1時間刻みでチェック
    for (let hour = 0; hour < 24; hour++) {
      const baseTime = new Date();
      baseTime.setHours(hour, 0, 0, 0);
      
      const participants = timezones.map(tz => {
        const localTime = new Date(baseTime.toLocaleString('en-US', { timeZone: tz }));
        const localHour = localTime.getHours();
        const isBusinessHours = localHour >= 9 && localHour <= 18;
        
        return {
          timezone: tz,
          localTime: localTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
          isBusinessHours
        };
      });
      
      // スコア計算（ビジネスアワーに入っている参加者の割合）
      const businessHoursCount = participants.filter(p => p.isBusinessHours).length;
      const score = (businessHoursCount / participants.length) * 100;
      
      let reasoning = '';
      if (score === 100) {
        reasoning = '全参加者がビジネスアワー内です（最適）';
      } else if (score >= 75) {
        reasoning = '大部分の参加者がビジネスアワー内です（良好）';
      } else if (score >= 50) {
        reasoning = '半数以上の参加者がビジネスアワー内です（普通）';
      } else {
        reasoning = 'ビジネスアワー外の参加者が多いです（要調整）';
      }
      
      suggestions.push({
        suggestedTime: `${hour.toString().padStart(2, '0')}:00 (JST)`,
        participants,
        score,
        reasoning
      });
    }
    
    // スコア順にソートして上位を返す
    return suggestions.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  /**
   * 時差ボケ計算機
   */
  static calculateJetLag(fromTimezone: string, toTimezone: string, departureTime: Date): {
    timeDifference: number;
    direction: 'east' | 'west';
    jetLagSeverity: 'none' | 'mild' | 'moderate' | 'severe';
    recoveryDays: number;
    recommendations: string[];
  } {
    const fromOffset = this.getTimezoneOffset(fromTimezone, departureTime);
    const toOffset = this.getTimezoneOffset(toTimezone, departureTime);
    
    const timeDifferenceHours = Math.abs((toOffset - fromOffset) / 60);
    const direction = toOffset > fromOffset ? 'east' : 'west';
    
    let jetLagSeverity: 'none' | 'mild' | 'moderate' | 'severe';
    let recoveryDays: number;
    
    if (timeDifferenceHours <= 2) {
      jetLagSeverity = 'none';
      recoveryDays = 0;
    } else if (timeDifferenceHours <= 4) {
      jetLagSeverity = 'mild';
      recoveryDays = 1;
    } else if (timeDifferenceHours <= 8) {
      jetLagSeverity = 'moderate';
      recoveryDays = Math.ceil(timeDifferenceHours / 2);
    } else {
      jetLagSeverity = 'severe';
      recoveryDays = Math.ceil(timeDifferenceHours / 1.5);
    }
    
    const recommendations: string[] = [];
    
    if (jetLagSeverity !== 'none') {
      recommendations.push('出発前に睡眠スケジュールを調整しましょう');
      recommendations.push('機内では現地時間に合わせて過ごしましょう');
      recommendations.push('到着後は日光を浴びて体内時計をリセット');
      
      if (direction === 'east') {
        recommendations.push('東向きの移動：早寝早起きを心がけましょう');
      } else {
        recommendations.push('西向きの移動：夜更かしして朝遅く起きる準備を');
      }
      
      if (jetLagSeverity === 'severe') {
        recommendations.push('メラトニンサプリメントの使用を検討');
        recommendations.push('重要な会議は到着後2-3日後に設定');
      }
    }
    
    return {
      timeDifference: timeDifferenceHours,
      direction,
      jetLagSeverity,
      recoveryDays,
      recommendations
    };
  }

  /**
   * 休日・祝日情報を含む拡張比較（簡易版）
   */
  static getExtendedComparison(baseTime: Date, baseTimeZone: string = 'Asia/Tokyo'): WorldTimeComparison & {
    holidayInfo: { timezone: string; isHoliday: boolean; holidayName?: string }[];
  } {
    const comparison = this.compareWorldTimes(baseTime, baseTimeZone);
    
    // 簡易的な祝日判定（実際の実装では外部APIを使用することを推奨）
    const holidayInfo = comparison.comparisons.map(tz => {
      const date = new Date(tz.currentTime);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      let isHoliday = false;
      let holidayName: string | undefined;
      
      // 日本の主要な祝日（簡易版）
      if (tz.id === 'Asia/Tokyo') {
        if (month === 1 && day === 1) {
          isHoliday = true;
          holidayName = '元日';
        } else if (month === 5 && day === 3) {
          isHoliday = true;
          holidayName = '憲法記念日';
        } else if (month === 12 && day === 25) {
          isHoliday = true;
          holidayName = 'クリスマス';
        }
      }
      
      // アメリカの主要な祝日（簡易版）
      if (tz.id.startsWith('America/')) {
        if (month === 7 && day === 4) {
          isHoliday = true;
          holidayName = 'Independence Day';
        } else if (month === 12 && day === 25) {
          isHoliday = true;
          holidayName = 'Christmas Day';
        }
      }
      
      return {
        timezone: tz.id,
        isHoliday,
        holidayName
      };
    });
    
    return {
      ...comparison,
      holidayInfo
    };
  }
} 