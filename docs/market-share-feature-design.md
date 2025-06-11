# 📊 市場シェア率・デバイス情報機能 設計ドキュメント

## 🎯 機能概要

### 機能名：「Tech Insights Dashboard」
QAエンジニアが現実に即したテストデータを生成するために、リアルタイムの市場シェア率とデバイス情報を提供する機能です。

### 🌟 コンセプト
```
📊 リアルタイム市場データの可視化
🎯 テストデータ生成時の現実的な比率適用
🌐 グローバル & 日本市場の両方対応
📱 デベロッパーフレンドリーな情報提供
```

**TDからのメッセージ**: 「現実に即したテストデータで、よりリアルなテスト環境を作りましょう！」

---

## 🔧 解決する課題

### 現在の課題
- ❌ User-Agent生成が古いデータベース依存
- ❌ ブラウザ比率が現実と乖離
- ❌ モバイルデバイス情報が不足
- ❌ 地域特性を考慮できない
- ❌ 手動でのデータ調査が必要

### 解決後の効果
- ✅ **リアルタイムデータ**: 常に最新の市場動向を反映
- ✅ **精度向上**: 実際の使用環境に近いテストデータ
- ✅ **地域対応**: 日本・アジア・グローバル市場に対応
- ✅ **開発効率化**: データ調査時間の大幅短縮
- ✅ **統合機能**: 既存のデータ生成機能との連携

---

## 📋 実装計画

### **Phase 1: データ基盤構築 (Week 1-2)**

#### バックエンド実装
```typescript
📁 td-buddy-webapp/backend/src/
├── 📄 types/MarketShareTypes.ts           // 型定義
├── 📄 services/MarketShareService.ts      // ビジネスロジック
├── 📄 routes/market-share.ts              // APIエンドポイント
├── 📄 utils/market-data-fetcher.ts        // データ取得ユーティリティ
└── 📄 utils/cache-manager.ts              // キャッシュ管理
```

#### データソース
- **StatCounter**: 無料API、リアルタイム統計
- **Statista**: 高品質データ（一部有料）
- **Kantar**: モバイル専門データ
- **自社データ**: 日本市場特化データ

### **Phase 2: フロントエンド UI (Week 2-3)**

#### コンポーネント設計
```typescript
📁 td-buddy-webapp/frontend/
├── 📄 app/tech-insights/page.tsx          // メインページ
├── 📄 components/TechInsightsDashboard.tsx // ダッシュボード
├── 📄 components/MarketShareChart.tsx      // チャート表示
├── 📄 components/DeviceRankingTable.tsx   // デバイスランキング
├── 📄 components/ui/RegionSelector.tsx    // 地域選択
└── 📄 components/ui/DataExportButton.tsx  // データエクスポート
```

### **Phase 3: 既存機能統合 (Week 3-4)**

#### 連携機能
```typescript
// 既存機能との連携
├── 📄 components/PersonalInfoGenerator.tsx (更新)
├── 📄 components/UserAgentGenerator.tsx (新規)
├── 📄 services/RealisticDataService.ts (新規)
└── 📄 hooks/useMarketData.ts (新規)
```

---

## 🎨 デザインシステム準拠のUI設計

### カラーパレット
- **Primary**: `td-primary-500` (#3B82F6) - メインUI
- **Secondary**: `td-secondary-500` (#10B981) - 成功・データ表示
- **Accent**: `td-accent-500` (#8B5CF6) - チャート・ハイライト
- **Warning**: `td-warning` (#F59E0B) - 注意喚起
- **Error**: `td-error-500` (#EF4444) - エラー表示

### レイアウト構成

#### 1. ヘッダーセクション
```
🤖 TDキャラクター (EnhancedTDCharacter)
📊 "Tech Insights Dashboard" タイトル
📝 説明文とTDメッセージ
```

#### 2. 制御パネル
```
🌐 地域選択 (日本/グローバル)
🔄 データ更新ボタン
📅 最終更新時刻表示
```

#### 3. タブナビゲーション
```
📊 概要 - 基本統計とチャート
📱 モバイルデバイス - デバイスランキング
🌐 ブラウザ - ブラウザシェア詳細
⚡ データ生成連携 - 既存機能との統合
```

#### 4. データ表示エリア
```
📈 円グラフ・棒グラフ (Recharts)
📋 ランキングテーブル
📊 統計サマリーカード
🔗 関連機能へのリンク
```

### アニメーション・インタラクション
- **ローディング**: `td-pulse` アニメーション
- **ホバー**: カード hover:shadow-lg transition
- **チャート**: 数値カウントアップアニメーション
- **TDキャラクター**: mood変更時のアニメーション

---

## 📊 データ構造設計

### MarketShareData型定義
```typescript
interface MarketShareData {
  os: {
    android: number;      // Android シェア率
    ios: number;          // iOS シェア率
    windows: number;      // Windows シェア率
    macos: number;        // macOS シェア率
    linux: number;        // Linux シェア率
    other: number;        // その他
  };
  browsers: {
    chrome: number;       // Chrome シェア率
    safari: number;       // Safari シェア率
    edge: number;         // Edge シェア率
    firefox: number;      // Firefox シェア率
    opera: number;        // Opera シェア率
    other: number;        // その他
  };
  devices: {
    mobile: number;       // モバイル比率
    desktop: number;      // デスクトップ比率
    tablet: number;       // タブレット比率
  };
  mobileDevices: Array<{
    brand: string;        // ブランド名 (Apple, Samsung, etc.)
    model: string;        // 機種名 (iPhone 15, Galaxy S24, etc.)
    share: number;        // 市場シェア率
    userAgent: string;    // 実際のUser-Agent文字列
  }>;
  lastUpdated: string;    // 最終更新日時
  region: string;         // 地域コード (jp, global, us, eu, etc.)
}
```

### API エンドポイント設計
```typescript
// 市場データ取得
GET /api/market-share?region=jp
GET /api/market-share?region=global

// デバイス詳細情報
GET /api/market-share/devices?region=jp&category=mobile

// User-Agent生成（重み付き）
POST /api/market-share/generate-user-agent
{
  "region": "jp",
  "deviceType": "mobile",
  "count": 10
}

// データエクスポート
GET /api/market-share/export?format=csv&region=jp
GET /api/market-share/export?format=json&region=global
```

---

## 🔄 既存機能との連携

### 1. 個人情報生成機能との連携
```typescript
// デバイス所有者の傾向を反映
interface EnhancedPersonalInfo {
  device: {
    preferredOS: 'iOS' | 'Android' | 'Windows';
    deviceBrand: string;
    browserUsage: string[];
  };
  demographics: {
    ageGroup: string;
    techSavviness: 'low' | 'medium' | 'high';
  };
}

// 実装例
const generatePersonWithDevice = async (region: string) => {
  const marketData = await getMarketData(region);
  const devicePreference = weightedRandom(marketData.os);
  
  return {
    ...generatePersonalInfo(),
    device: generateDeviceProfile(devicePreference),
  };
};
```

### 2. User-Agent生成機能
```typescript
interface RealisticUserAgent {
  userAgent: string;
  browser: string;
  os: string;
  device: string;
  marketShare: number;
  isPopular: boolean;
}

// 重み付きランダム生成
const generateRealisticUserAgent = (region: string = 'jp') => {
  const weights = getMarketShareWeights(region);
  
  return weightedRandom([
    { ua: 'Mobile Safari/iOS', weight: weights.ios },
    { ua: 'Chrome/Android', weight: weights.android },
    { ua: 'Chrome/Windows', weight: weights.windows }
  ]);
};
```

### 3. ログデータ生成機能
```typescript
// アクセスログの現実味向上
interface RealisticAccessLog {
  timestamp: string;
  ip: string;
  userAgent: string;
  referer: string;
  region: string;
  deviceCategory: 'mobile' | 'desktop' | 'tablet';
  browserEngine: string;
  marketShareRank: number;
}

// 地域特性を考慮したログ生成
const generateAccessLogs = (count: number, region: string) => {
  const marketData = getMarketData(region);
  
  return Array.from({ length: count }, () => ({
    ...generateBaseLog(),
    userAgent: generateWeightedUserAgent(marketData),
    deviceCategory: selectDeviceByRegion(region),
  }));
};
```

---

## 📱 モバイル対応・レスポンシブデザイン

### ブレイクポイント設計
```css
/* モバイル First デザイン */
.tech-insights-dashboard {
  /* Mobile: ~768px */
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  /* Tablet: 768px~ */
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  
  /* Desktop: 1024px~ */
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2rem;
  }
}
```

### タッチインターフェース
- **タブ切り替え**: スワイプジェスチャー対応
- **チャート操作**: ピンチズーム、パン操作
- **テーブル**: 横スクロール、固定ヘッダー
- **ボタンサイズ**: 最小44px（アクセシビリティ準拠）

---

## ⚡ パフォーマンス最適化

### データキャッシュ戦略
```typescript
// Redis キャッシュ設定
const CACHE_SETTINGS = {
  marketData: {
    ttl: 3600,        // 1時間キャッシュ
    key: 'market_share_{region}',
  },
  deviceData: {
    ttl: 86400,       // 24時間キャッシュ
    key: 'device_ranking_{region}',
  },
};

// レスポンス時間目標
const PERFORMANCE_TARGETS = {
  apiResponse: '< 500ms',
  chartRender: '< 200ms',
  dataUpdate: '< 1000ms',
  pageLoad: '< 2000ms',
};
```

### 遅延読み込み
- **チャートライブラリ**: Dynamic import
- **画像リソース**: Lazy loading
- **データ**: 必要時にAPI呼び出し
- **地域データ**: ユーザー選択時に取得

---

## 🛡️ セキュリティ・プライバシー

### データ保護
- **API キー**: 環境変数で管理
- **キャッシュデータ**: 定期的な自動削除
- **ログ**: 個人識別情報の除去
- **CORS**: 適切なオリジン制限

### レート制限
```typescript
// API使用制限
const RATE_LIMITS = {
  marketData: '100 requests/hour',
  deviceData: '50 requests/hour',
  export: '10 requests/hour',
};
```

---

## 🧪 テスト戦略

### 単体テスト
```typescript
// MarketShareService.test.ts
describe('MarketShareService', () => {
  test('日本市場データの取得', async () => {
    const data = await service.getMarketData('jp');
    expect(data.region).toBe('jp');
    expect(data.os.android + data.os.ios).toBeGreaterThan(80);
  });
  
  test('重み付きUser-Agent生成', () => {
    const uas = service.generateWeightedUserAgents(100, 'jp');
    const iosCount = uas.filter(ua => ua.includes('iPhone')).length;
    expect(iosCount).toBeGreaterThan(30); // 日本のiOSシェアを反映
  });
});
```

### 統合テスト
- **API エンドポイント**: 全エンドポイントの動作確認
- **データ整合性**: キャッシュとリアルタイムデータの一致
- **パフォーマンス**: 応答時間の測定
- **エラーハンドリング**: 外部API障害時の動作

### E2Eテスト
- **ユーザーフロー**: 地域選択→データ表示→エクスポート
- **レスポンシブ**: 各デバイスサイズでの表示確認
- **アクセシビリティ**: スクリーンリーダー対応確認

---

## 📈 段階的展開・ロードマップ

### MVP (Minimum Viable Product)
- [ ] 基本的な市場シェア表示
- [ ] 日本・グローバルの2地域対応
- [ ] 円グラフでの可視化
- [ ] CSV エクスポート機能

### Phase 1 拡張
- [ ] デバイスランキングテーブル
- [ ] User-Agent生成連携
- [ ] リアルタイムデータ更新
- [ ] キャッシュ機能

### Phase 2 拡張
- [ ] 地域選択の拡充（アジア、欧州等）
- [ ] 時系列データ・トレンド分析
- [ ] AI予測機能
- [ ] カスタムフィルター

### Phase 3 拡張
- [ ] 管理者ダッシュボード
- [ ] データ品質監視
- [ ] アラート機能
- [ ] 外部API連携

---

## 💡 今後の発展可能性

### 機能拡張アイデア
1. **AIトレンド予測**: 機械学習による市場予測
2. **リアルタイム監視**: WebSocket による即座のデータ更新
3. **カスタムデータセット**: ユーザー独自のデータ追加
4. **比較分析**: 複数地域・期間の比較機能
5. **レポート生成**: 定期的な市場レポート自動作成

### 他システム連携
- **Analytics Tools**: Google Analytics との連携
- **CI/CD Pipeline**: テストデータ自動生成
- **Monitoring**: システム監視ツールとの統合
- **Documentation**: 自動ドキュメント生成

---

## 📞 実装時のサポート・注意事項

### 開発時の注意点
1. **外部API依存**: 障害時の代替データ準備
2. **データ精度**: 複数ソースでの検証
3. **更新頻度**: リアルタイム性と負荷のバランス
4. **地域特性**: 文化的差異の考慮

### TDからのメッセージ
```
🤖 「市場データ機能の実装、とても楽しみです！
    現実に即したテストデータで、
    より良いソフトウェアを作りましょう。
    
    実装中に困ったことがあれば、
    いつでもTDに相談してくださいね♪
    
    一緒に素晴らしい機能を作り上げましょう！」
```

---

## 📊 完成イメージ

### UI/UX フロー
```
1. ページアクセス
   ↓ (TDキャラクターが挨拶)
2. 地域選択 (日本/グローバル)
   ↓ (ローディングアニメーション)
3. データ表示
   ├─ 概要タブ: 基本統計
   ├─ モバイルタブ: デバイスランキング
   ├─ ブラウザタブ: ブラウザシェア
   └─ 連携タブ: 他機能との統合
4. データ活用
   ├─ エクスポート機能
   ├─ 他機能での利用
   └─ リアルタイム更新
```

### 成功指標 (KPI)
- **利用率**: 月間アクティブユーザー数
- **データ精度**: 実際の市場データとの乖離率 < 5%
- **パフォーマンス**: ページ読み込み時間 < 2秒
- **ユーザー満足度**: 評価スコア 4.5/5.0以上

---

**TDからの最終メッセージ**: 
```
「この設計ドキュメントを基に、
 素晴らしい市場データ機能を実装しましょう！
 
 データ駆動な開発で、より良いテスト環境を作り、
 QAエンジニアの皆さんに価値を提供できると確信しています。
 
 実装の際は、このドキュメントを参考に、
 一歩ずつ着実に進めていきましょう！
 
 TDも一緒に頑張ります！ 🚀✨」
``` 