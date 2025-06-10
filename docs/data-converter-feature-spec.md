# 🔄 データ形式相互変換機能 詳細仕様書

**🤖 TDからのメッセージ：**  
*「データ変換機能の設計書を作成しました！高品質で安全な変換を実現します♪」*

## 📋 機能概要

### 基本概念
TestData Buddy（TD）にデータ形式相互変換機能を追加し、CSV、JSON、XML、YAML等の主要データ形式間での高品質な変換を実現します。

### 対応形式
- **CSV** (Comma-Separated Values)
- **JSON** (JavaScript Object Notation)  
- **XML** (eXtensible Markup Language)
- **YAML** (YAML Ain't Markup Language)

### 変換パターン
```
CSV ⇄ JSON ⇄ XML ⇄ YAML
  ↕     ↕     ↕     ↕
全ての形式間で双方向変換をサポート（12パターン）
```

---

## 🎯 機能要件

### 1. 入力方式
#### 1.1 ファイルアップロード
- **ドラッグ&ドロップ対応**
- **複数ファイル一括変換**（最大10ファイル）
- **ファイルサイズ制限**：最大10MB/ファイル
- **対応拡張子**：`.csv`, `.json`, `.xml`, `.yaml`, `.yml`, `.txt`

#### 1.2 テキスト入力
- **大容量テキストエリア**（最大1MB）
- **シンタックスハイライト**
- **行番号表示**
- **入力形式自動検出**

### 2. 変換オプション

#### 2.1 CSV変換オプション
```typescript
interface CSVOptions {
  hasHeader: boolean;           // ヘッダー行の有無
  delimiter: ',' | ';' | '\t';  // 区切り文字
  quote: '"' | "'";             // 引用符文字
  encoding: 'UTF-8' | 'Shift_JIS' | 'EUC-JP';
  dataTypeDetection: boolean;   // データ型自動変換
  emptyValueHandling: 'null' | 'empty' | 'skip';
}
```

#### 2.2 JSON変換オプション
```typescript
interface JSONOptions {
  format: 'pretty' | 'minified'; // 整形形式
  indentSize: 2 | 4;             // インデントサイズ
  sortKeys: boolean;             // キーのソート
  escapeUnicode: boolean;        // Unicode文字のエスケープ
}
```

#### 2.3 XML変換オプション
```typescript
interface XMLOptions {
  rootElement: string;           // ルート要素名
  itemElement: string;           // 配列要素名
  attributePrefix: string;       // 属性プレフィックス
  textKey: string;              // テキストノードのキー名
  prettyPrint: boolean;         // 整形出力
  encoding: string;             // エンコーディング
}
```

#### 2.4 YAML変換オプション
```typescript
interface YAMLOptions {
  indentSize: 2 | 4;            // インデントサイズ
  flowStyle: boolean;           // フロースタイル使用
  sortKeys: boolean;            // キーのソート
  quotingType: 'single' | 'double' | 'auto';
}
```

### 3. プレビュー機能
- **変換前後の並列表示**
- **差分ハイライト**
- **変換統計情報**（レコード数、ファイルサイズ、変換時間）
- **エラー箇所の強調表示**

### 4. ダウンロード機能
- **適切な拡張子での保存**
- **ファイル名の自動生成**（元ファイル名 + 変換先拡張子）
- **一括ダウンロード**（ZIP形式）
- **変換履歴の管理**

---

## 🏗️ システム設計

### アーキテクチャ図
```
Frontend (React)
├── DataConverter.tsx          # メインコンポーネント
├── FileUploader.tsx          # ファイルアップロード
├── TextEditor.tsx            # テキスト入力エディタ
├── OptionsPanel.tsx          # 変換オプション設定
├── PreviewPanel.tsx          # プレビュー表示
└── DownloadManager.tsx       # ダウンロード管理

Backend (Express)
├── DataConverterService.ts   # 変換ロジック
├── FileValidator.ts          # ファイル検証
├── FormatDetector.ts         # 形式自動検出
└── QualityAssurance.ts       # 品質保証
```

### データフロー
```
1. ファイル/テキスト入力
   ↓
2. 形式検出・バリデーション
   ↓
3. 変換オプション設定
   ↓
4. データ変換処理
   ↓
5. 品質チェック・検証
   ↓
6. プレビュー表示
   ↓
7. ダウンロード/出力
```

---

## 🔧 技術仕様

### バックエンド実装

#### DataConverterService.ts
```typescript
export class DataConverterService {
  // CSV変換メソッド
  async csvToJson(data: string, options: CSVOptions): Promise<ConversionResult>;
  async csvToXml(data: string, options: CSVOptions & XMLOptions): Promise<ConversionResult>;
  async csvToYaml(data: string, options: CSVOptions & YAMLOptions): Promise<ConversionResult>;
  
  // JSON変換メソッド
  async jsonToCsv(data: string, options: JSONOptions & CSVOptions): Promise<ConversionResult>;
  async jsonToXml(data: string, options: JSONOptions & XMLOptions): Promise<ConversionResult>;
  async jsonToYaml(data: string, options: JSONOptions & YAMLOptions): Promise<ConversionResult>;
  
  // XML変換メソッド
  async xmlToCsv(data: string, options: XMLOptions & CSVOptions): Promise<ConversionResult>;
  async xmlToJson(data: string, options: XMLOptions & JSONOptions): Promise<ConversionResult>;
  async xmlToYaml(data: string, options: XMLOptions & YAMLOptions): Promise<ConversionResult>;
  
  // YAML変換メソッド
  async yamlToCsv(data: string, options: YAMLOptions & CSVOptions): Promise<ConversionResult>;
  async yamlToJson(data: string, options: YAMLOptions & JSONOptions): Promise<ConversionResult>;
  async yamlToXml(data: string, options: YAMLOptions & XMLOptions): Promise<ConversionResult>;
  
  // 品質保証メソッド
  async validateConversion(original: string, converted: string, format: DataFormat): Promise<ValidationResult>;
}
```

#### API エンドポイント
```typescript
// ファイルアップロード変換
POST /api/convert/upload
Content-Type: multipart/form-data
Body: {
  files: File[],
  sourceFormat: DataFormat,
  targetFormat: DataFormat,
  options: ConversionOptions
}

// テキスト変換
POST /api/convert/text
Content-Type: application/json
Body: {
  data: string,
  sourceFormat: DataFormat,
  targetFormat: DataFormat,
  options: ConversionOptions
}

// 対応形式一覧
GET /api/convert/formats
Response: {
  formats: DataFormat[],
  conversionMatrix: ConversionSupport[][]
}

// データ検証
POST /api/convert/validate
Content-Type: application/json
Body: {
  data: string,
  format: DataFormat
}
```

### フロントエンド実装

#### DataConverter.tsx
```typescript
interface DataConverterProps {
  onConversionComplete?: (result: ConversionResult) => void;
}

export const DataConverter: React.FC<DataConverterProps> = ({ onConversionComplete }) => {
  const [inputMethod, setInputMethod] = useState<'file' | 'text'>('file');
  const [sourceFormat, setSourceFormat] = useState<DataFormat>('csv');
  const [targetFormat, setTargetFormat] = useState<DataFormat>('json');
  const [conversionOptions, setConversionOptions] = useState<ConversionOptions>({});
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  
  const handleConvert = async () => {
    // 変換処理
  };
  
  return (
    <div className="data-converter">
      <InputMethodSelector value={inputMethod} onChange={setInputMethod} />
      <FormatSelector 
        sourceFormat={sourceFormat} 
        targetFormat={targetFormat}
        onSourceChange={setSourceFormat}
        onTargetChange={setTargetFormat}
      />
      <OptionsPanel 
        sourceFormat={sourceFormat}
        targetFormat={targetFormat}
        options={conversionOptions}
        onChange={setConversionOptions}
      />
      <ConvertButton onClick={handleConvert} />
      {conversionResult && (
        <PreviewPanel result={conversionResult} />
      )}
    </div>
  );
};
```

---

## ✅ 品質保証

### データ整合性チェック
1. **往復変換テスト**
   ```
   元データ → 変換1 → 変換2 → 元形式
   元データと最終結果の一致確認
   ```

2. **データ型保持テスト**
   - 文字列、数値、日付、真偽値の型保持
   - Null値の適切な処理
   - 特殊文字・Unicode文字の保持

3. **構造保持テスト**
   - ネストした構造の保持
   - 配列・オブジェクトの構造保持
   - メタデータの保持

### パフォーマンステスト
```typescript
// パフォーマンス目標
const PERFORMANCE_TARGETS = {
  smallFile: { size: '< 1MB', time: '< 1秒' },
  mediumFile: { size: '1-5MB', time: '< 5秒' },
  largeFile: { size: '5-10MB', time: '< 30秒' }
};
```

### セキュリティ検証
- **ファイルアップロード検証**
- **XXE攻撃対策**（XML処理時）
- **コードインジェクション対策**
- **メモリ制限・タイムアウト設定**

---

## 🚨 エラーハンドリング

### エラーカテゴリ
```typescript
enum ConversionErrorType {
  INVALID_FORMAT = 'INVALID_FORMAT',           // 不正な形式
  PARSING_ERROR = 'PARSING_ERROR',             // パース エラー
  CONVERSION_FAILED = 'CONVERSION_FAILED',     // 変換失敗
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',          // ファイルサイズ超過
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',             // タイムアウト
  MEMORY_LIMIT = 'MEMORY_LIMIT',               // メモリ制限
  VALIDATION_FAILED = 'VALIDATION_FAILED'      // 検証失敗
}
```

### エラーメッセージ
```typescript
const ERROR_MESSAGES = {
  [ConversionErrorType.INVALID_FORMAT]: '指定された形式が不正です。対応形式を確認してください。',
  [ConversionErrorType.PARSING_ERROR]: 'データの解析に失敗しました。形式が正しいか確認してください。',
  [ConversionErrorType.FILE_TOO_LARGE]: 'ファイルサイズが制限を超えています（最大10MB）。',
  // ... 他のエラーメッセージ
};
```

---

## 📊 運用監視

### 使用統計
```typescript
interface ConversionStats {
  conversionCount: number;      // 変換回数
  formatDistribution: Record<DataFormat, number>; // 形式別使用状況
  averageFileSize: number;      // 平均ファイルサイズ
  averageProcessingTime: number; // 平均処理時間
  errorRate: number;            // エラー率
}
```

### パフォーマンス監視
- **変換処理時間の監視**
- **メモリ使用量の監視**
- **エラー発生率の監視**
- **ユーザー満足度の追跡**

---

## 🎭 TDキャラクター連携

### 変換中のメッセージ
```typescript
const TD_MESSAGES = {
  converting: [
    "データを変換中です...TDがしっかり確認します♪",
    "高品質な変換を実行中...少々お待ちください✨",
    "データの整合性をチェックしながら変換します🔍"
  ],
  success: [
    "変換完了！期待通りの品質です🎉",
    "素晴らしい変換結果ができました✨",
    "TDが品質をチェック済み。安心してご利用ください♪"
  ],
  error: [
    "変換でエラーが発生しました。TDが原因を調査します",
    "問題が発生しましたが、一緒に解決しましょう",
    "TDがサポートします。再度お試しください"
  ]
};
```

---

## 🎯 実装優先度

### Phase 1: 基本機能（高優先度）
1. CSV ⇄ JSON 変換
2. 基本的なファイルアップロード
3. シンプルな変換オプション
4. 基本的なプレビュー機能

### Phase 2: 機能拡張（中優先度）  
1. XML、YAML対応
2. 高度な変換オプション
3. 品質検証機能
4. 一括変換機能

### Phase 3: 品質向上（低優先度）
1. パフォーマンス最適化
2. 詳細なエラーハンドリング
3. 運用監視機能
4. ユーザビリティ向上

---

**🤖 TDからの最終メッセージ：**  
*「データ変換機能の設計が完了しました！高品質で安全な変換を実現して、ユーザーの皆さんに喜んでもらえる機能にしましょう。Phase 1の完了後、一緒に素晴らしい変換機能を作り上げましょう♪」* 