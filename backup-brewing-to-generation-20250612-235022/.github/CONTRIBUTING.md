# 🤖 TestData Buddy (TD) 貢献ガイドライン

**TD からのメッセージ**: 「プロジェクトに貢献していただき、ありがとうございます！一緒に素晴らしいツールを作りましょう ♪」

## 🎯 貢献の種類

### 📝 機能要望・アイデア提案

- **推奨**: [GitHub Discussions](https://github.com/your-org/td-buddy-app/discussions)
- **理由**: コミュニティで議論してから実装方針を決定
- **テンプレート**: 機能要望テンプレートを使用

### 🐛 バグ報告

- **場所**: [GitHub Issues](https://github.com/your-org/td-buddy-app/issues)
- **テンプレート**: バグ報告テンプレートを使用
- **緊急度**: 致命的なバグは最優先で対応

### 📚 ドキュメント改善

- **場所**: GitHub Issues または直接 Pull Request
- **対象**: README、API 仕様、使い方ガイドなど

### 💻 コード貢献

- **事前準備**: Issues または Discussions で議論済みであること
- **ブランチ**: `feature/TD-123-feature-name` 形式

## 🚀 貢献の流れ

### 1. 事前準備

```bash
# リポジトリをフォーク
git clone https://github.com/your-username/td-buddy-app.git
cd td-buddy-app

# 開発環境のセットアップ
npm install
cp env.example .env
npm run setup
```

### 2. 課題の特定・議論

1. **既存 Issue 確認**: 同様の要望がないかチェック
2. **Discussion 開始**: 新機能の場合は議論から開始
3. **Issue 作成**: バグや明確な改善点の場合

### 3. 開発・実装

```bash
# 最新のdevelopブランチを取得
git checkout develop
git pull origin develop

# 機能ブランチを作成
git checkout -b feature/TD-123-your-feature

# 開発実行
npm run dev

# テスト実行
npm run test
npm run lint
```

### 4. Pull Request 作成

- **タイトル**: `feat: 機能名を追加` または `fix: バグ修正内容`
- **説明**: 変更内容、テスト結果、スクリーンショット
- **関連 Issue**: `Closes #123` でリンク

## 📋 品質基準

### コード品質

- [ ] TypeScript strict mode でエラーなし
- [ ] ESLint ルール準拠
- [ ] テストカバレッジ 90% 以上
- [ ] セキュリティチェック通過

### ドキュメント

- [ ] 新機能にはドキュメント追加
- [ ] API の変更は仕様書を更新
- [ ] README の関連箇所を更新

### テスト

- [ ] 単体テスト追加
- [ ] 統合テスト追加（必要に応じて）
- [ ] 手動テスト完了

## 🛡️ セキュリティガイドライン

### 機密情報の取り扱い

- **禁止**: API キー、パスワード等をコードに含める
- **必須**: 環境変数での管理
- **推奨**: .env.example の更新

### データの取り扱い

- **テストデータ**: 実データは絶対に使用しない
- **個人情報**: 仮データのみ使用
- **削除機能**: 24 時間後の自動削除を考慮

## 📊 ラベル・分類

### Issue ラベル

| ラベル            | 説明               |
| ----------------- | ------------------ |
| `bug`             | バグ報告           |
| `enhancement`     | 機能改善           |
| `feature-request` | 新機能要望         |
| `documentation`   | ドキュメント関連   |
| `security`        | セキュリティ関連   |
| `performance`     | パフォーマンス改善 |
| `ui/ux`           | UI/UX 改善         |

### 優先度ラベル

| ラベル              | 説明         |
| ------------------- | ------------ |
| `priority/critical` | 致命的・緊急 |
| `priority/high`     | 高優先度     |
| `priority/medium`   | 中優先度     |
| `priority/low`      | 低優先度     |

## 💬 コミュニケーション

### 質問・相談

- **技術的質問**: GitHub Issues
- **機能議論**: GitHub Discussions
- **緊急問題**: メンテナーへ直接連絡

### レビュープロセス

1. **自動チェック**: CI/CD パイプライン
2. **コードレビュー**: メンテナーによるレビュー
3. **テストレビュー**: 品質チェック
4. **最終承認**: マージ前の最終確認

## 🎉 貢献者への謝辞

### 認識・表彰

- **Contributors**: README に名前を掲載
- **Special Thanks**: 大きな貢献への特別感謝
- **Release Notes**: リリースノートに貢献内容を記載

### コミュニティ

- **情報共有**: 成功事例や Tips の共有
- **メンタリング**: 新しい貢献者のサポート
- **イベント**: 定期的な開発者ミーティング

## 📚 参考資料

### 開発環境

- [開発環境セットアップガイド](docs/setup.md)
- [アーキテクチャドキュメント](docs/architecture.md)
- [API 仕様書](docs/api.md)

### コーディング規約

- [TypeScript スタイルガイド](docs/typescript-style.md)
- [コミットメッセージ規約](docs/commit-conventions.md)
- [セキュリティガイドライン](docs/security.md)

---

## 🤖 TD からの最終メッセージ

「あなたの貢献が、世界中の QA エンジニアの業務を改善します！

一緒に：
✨ 使いやすいツールを作り
🛡️ 安全なシステムを構築し  
🚀 効率的な開発を実現しましょう

困ったときは、いつでも TD にご相談ください。
コミュニティ全体でサポートします！」

---

**最終更新**: 2024-12-20
**バージョン**: v1.0.0
