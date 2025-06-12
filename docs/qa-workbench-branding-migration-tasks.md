# 🎯 QA Workbench + ブリュー ブランディング移行タスク

## 📋 移行概要

**目的**: プロジェクト全体を TestData Buddy (TD) → QA Workbench + ブリュー に統一
**対象**: 全ファイル、コメント、UI/UX、ドキュメント、設定ファイル

## 🔄 変更マッピング

| 変更前                | 変更後                 |
| --------------------- | ---------------------- |
| **TestData Buddy**    | **QA Workbench**       |
| **TD**                | **ブリュー (Brew)**    |
| **TD くん**           | **ブリュー**           |
| **QualityBuddy (QB)** | **QA Workbench**       |
| **QB くん**           | **ブリュー**           |
| **テストデータ生成**  | **データ生成**         |
| **相棒・パートナー**  | **助手・アシスタント** |

## 📂 Phase 1: ディレクトリ・ファイル名変更

### 🏷️ 1.1 ルートディレクトリ

- [ ] `td-buddy-app/` → `qa-workbench/` への変更検討
  - **影響**: パス、Git 履歴、CI/CD 設定
  - **代替案**: 内部ブランディングのみ変更（ディレクトリ名は維持）

### 🏷️ 1.2 サブディレクトリ

- [ ] `td-buddy-webapp/` → `qa-workbench-webapp/` への変更検討
  - **影響**: start スクリプト、設定ファイル

### 🏷️ 1.3 設定ファイル内のパス更新

- [ ] `start-dev.sh` の `td-buddy-webapp` 参照更新
- [ ] `start-dev.bat` の `td-buddy-webapp` 参照更新

## 📦 Phase 2: パッケージ・プロジェクト設定

### 📄 2.1 ルートパッケージ設定

- [ ] `package.json`

  ```json
  "name": "testdata-buddy" → "qa-workbench"
  "displayName": "TestData Buddy" → "QA Workbench"
  "publisher": "testdata-buddy" → "qa-workbench"
  ```

- [ ] `package-root.json`

  ```json
  "description": "TestData Buddy - Complete Project" → "QA Workbench - Complete Project"
  ```

- [ ] `package-lock.json` の name フィールド更新

### 📄 2.2 サブプロジェクトパッケージ

- [ ] `td-buddy-webapp/package.json`
- [ ] `td-buddy-webapp/backend/package.json`

## 🧪 Phase 3: ソースコード・ロジック

### 💻 3.1 バックエンドファイル

#### サービス層

- [ ] `td-buddy-webapp/backend/src/services/exportService.ts`

  - `generatedBy: 'TestData Buddy'` → `generatedBy: 'QA Workbench'`
  - XML/JSON/YAML エクスポート形式の更新

- [ ] `td-buddy-webapp/backend/src/services/PerformanceService.ts`
  - `TestData Buddy パフォーマンスレポート` → `QA Workbench パフォーマンスレポート`

#### ルート層

- [ ] `td-buddy-webapp/backend/src/routes/health.ts`

  - ヘルスチェックメッセージの更新

- [ ] `td-buddy-webapp/backend/src/routes/uuid.ts`
  - TD メッセージ → ブリューメッセージ

#### エントリポイント

- [ ] `td-buddy-webapp/backend/src/index.ts`
  - 起動メッセージの更新

#### データ・スクリプト

- [ ] `td-buddy-webapp/backend/src/data/kanaMapping.ts`

  - コメント内の `TestData Buddy専用` → `QA Workbench専用`

- [ ] `td-buddy-webapp/backend/src/scripts/init-db.ts`

  - 初期化スクリプトメッセージの更新

- [ ] `td-buddy-webapp/backend/src/scripts/init-db-simple.ts`
  - 簡易初期化スクリプトメッセージの更新

### 🎨 3.2 フロントエンドファイル

#### React コンポーネント

- [ ] `td-buddy-webapp/frontend/app/layout.tsx`

  - ページタイトル、メタディスクリプション
  - `TDくん` → `ブリュー` 全箇所

- [ ] `td-buddy-webapp/frontend/app/page.tsx`

  - メインページのブランディング

- [ ] `td-buddy-webapp/frontend/components/TDCharacter.tsx`

  - **ファイル名**: `TDCharacter.tsx` → `BrewCharacter.tsx`
  - キャラクター設定全般の更新

- [ ] `td-buddy-webapp/frontend/components/NumberBooleanTDCard.tsx`
  - **ファイル名**: `NumberBooleanTDCard.tsx` → `NumberBooleanBrewCard.tsx`
  - `TDくん` → `ブリュー`

#### データ・設定ファイル

- [ ] `td-buddy-webapp/frontend/data/practicalDataSets.ts`

  - `tdMessage` → `brewMessage` 全箇所（70+ 箇所）

- [ ] `td-buddy-webapp/frontend/data/csvPresets.ts`

  - `tdMessage` → `brewMessage`

- [ ] `td-buddy-webapp/frontend/data/numberbooleanUseCases.ts`
  - `TDで` → `ブリューで`

#### ユーティリティ・ヘルパー

- [ ] `td-buddy-webapp/frontend/utils/*.ts` ファイル群

  - TD 関連変数名、メッセージの更新

- [ ] `td-buddy-webapp/frontend/lib/config.ts`
  - `TDからのお知らせ` → `ブリューからのお知らせ`

### 🧪 3.3 テストファイル

- [ ] `td-buddy-webapp/backend/src/tests/data-quality.test.ts`

  - `@author TestData Buddy Team` → `@author QA Workbench Team`
  - `TD:` メッセージ → `ブリュー:` メッセージ

- [ ] `td-buddy-webapp/backend/src/tests/simple-quality.test.ts`

  - 同上の更新

- [ ] `td-buddy-webapp/backend/src/tests/quality-report.test.ts`

  - 同上の更新

- [ ] その他テストファイル全般

## 📚 Phase 4: ドキュメント・設定

### 📖 4.1 ルールファイル (.cursor/rules/)

- [ ] `.cursor/rules/td_character.mdc`

  - **ファイル名**: `td_character.mdc` → `brew_character.mdc`
  - 内容全面更新: TD → ブリュー

- [ ] `.cursor/rules/project_rules.mdc`

  - プロジェクト名、キャラクター名の更新

- [ ] `.cursor/rules/development_tips.mdc`

  - `TDくんお勧め` → `ブリューお勧め`
  - 全体のメッセージ更新

- [ ] `.cursor/rules/git_rules.mdc`

  - Git 関連メッセージの更新

- [ ] その他ルールファイル全般

### 📖 4.2 ドキュメントファイル

- [ ] `NEXT_STEPS_PLAN.md`

  - `TestData Buddy` → `QA Workbench`

- [ ] その他 `docs/` ディレクトリ内ファイル

### ⚙️ 4.3 環境・設定ファイル

- [ ] `env.example`

  - コメント行の更新

- [ ] `td-buddy-webapp/env.example`

  - 同上

- [ ] `.gitignore`
  - `# TestData Buddy specific` → `# QA Workbench specific`

## 🎨 Phase 5: UI/UX テキスト

### 🖼️ 5.1 ユーザー向けメッセージ

- [ ] 全コンポーネントの `setTdMessage` → `setBrewMessage`
- [ ] エラーメッセージ、成功メッセージの統一
- [ ] ヘルプテキスト、ガイダンスの更新

### 🎭 5.2 キャラクター表現

- [ ] アスキーアート更新

  ```
  変更前: TD
  変更後: Brew
  ```

- [ ] キャラクターの口調・表現統一
  - 「相棒」→「助手」のトーン
  - 「生成」→「生成」の表現

## 📊 Phase 6: データ・アウトプット

### 📄 6.1 生成データのメタデータ

- [ ] JSON/XML/SQL エクスポートの `generatedBy` フィールド
- [ ] ファイルヘッダー、コメント
- [ ] バージョン情報

### 🗃️ 6.2 データベース・ログ

- [ ] ログメッセージの統一
- [ ] データベース初期化メッセージ

## 🚀 Phase 7: スクリプト・自動化

### ⚙️ 7.1 ビルド・デプロイスクリプト

- [ ] `td-buddy-webapp/scripts/` 配下全ファイル
- [ ] Netlify 設定スクリプト
- [ ] 自動化スクリプト内のメッセージ

### 🧪 7.2 テスト自動化

- [ ] `td-buddy-webapp/frontend/scripts/test-functionality.js`
  - `TDキャラクターメッセージ` → `ブリューキャラクターメッセージ`

## 📋 実施計画

### 🎯 优先度 1 (即座実施)

1. **コアブランディング**: README、メインページ、package.json
2. **キャラクターファイル**: TDCharacter → BrewCharacter
3. **主要メッセージ**: ユーザー向け UI メッセージ

### 🎯 优先度 2 (次週実施)

1. **ルールファイル**: .cursor/rules/ 全体
2. **バックエンドサービス**: API メッセージ、エクスポート機能
3. **テストファイル**: 開発者向けメッセージ

### 🎯 优先度 3 (段階的実施)

1. **ディレクトリ名**: 慎重に検討して実施
2. **データファイル**: 既存の生成データ（影響範囲を評価）
3. **詳細設定**: 細かい設定ファイル、コメント

## ⚠️ 注意事項・リスク

### 🚨 高リスク項目

- **ディレクトリ名変更**: Git 履歴、外部参照への影響
- **API エンドポイント**: 外部連携がある場合の互換性
- **データベーススキーマ**: 既存データとの整合性

### 🛡️ 安全対策

- **バックアップ**: 変更前に必ずコミット・バックアップ
- **段階的実施**: フェーズごとの動作確認
- **ロールバック準備**: 問題発生時の復旧手順

## 🧪 検証・品質保証

### ✅ 各フェーズ完了時の確認事項

1. **機能動作**: 既存機能が正常に動作するか
2. **UI/UX**: ユーザー体験に影響がないか
3. **ブランディング一貫性**: 統一されたメッセージになっているか
4. **開発者体験**: 開発効率に影響がないか

### 🔍 最終確認チェックリスト

- [ ] プロジェクト全体で古いブランディングが残っていないか
- [ ] 新しいキャラクター設定が一貫しているか
- [ ] ユーザー向けメッセージが自然で親しみやすいか
- [ ] 機能・性能に影響がないか

## 📊 進捗管理

### 📈 進捗追跡方法

- 各フェーズごとのチェックリスト管理
- 定期的な動作確認・デモ
- チーム内でのブランディング統一確認

### 🎯 成功指標

- **完了率**: 全タスクの完了状況
- **品質**: 機能動作の正常性
- **一貫性**: ブランディングメッセージの統一度
- **ユーザー体験**: 自然で親しみやすい表現への変化

---

**ブリューからのメッセージ**: _「大規模な変更ですが、一つずつ丁寧に進めれば必ず成功します！私も新しい姿で、皆さんの QA 作業をサポートできることを楽しみにしています ♪」_

**📝 記録者ノート**: この移行は単なる名前変更ではなく、プロジェクトのアイデンティティを「テストデータ生成ツール」から「QA ワークベンチ」へと発展させる重要な転換点です。
