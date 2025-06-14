'use client';

import { AdvancedExportContainer } from '@/components/AdvancedExportContainer';
import UseCaseShowcase from '@/components/UseCaseShowcase';
import {
  Database,
  Download,
  FileDown,
  HelpCircle,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function ExportPage() {
  const [showGuide, setShowGuide] = useState(false);
  const [brewMessage, setBrewMessage] = useState(
    '✨ エクスポート仕上げ工具の準備完了！データを美しく仕上げて出力できます♪'
  );

  return (
    <div className="min-h-screen wb-workbench-bg">
      {/* ワークベンチヘッダー */}
      <Card workbench className="mb-6 bg-purple-50 border-purple-200">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileDown className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-purple-800">
                ✨ エクスポート仕上げ工具
              </h1>
              <p className="text-purple-600 mt-1">
                データの高品質出力・多形式エクスポート
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-purple-100 text-purple-700 border-purple-300"
            >
              仕上げ工具
            </Badge>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              workbench
              onClick={() => setShowGuide(!showGuide)}
              className={`${
                showGuide
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-700'
              }`}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              {showGuide ? 'ガイドを閉じる' : '仕上げガイド'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Brewメッセージ */}
      <Card workbench className="mb-6 bg-purple-50 border-purple-200">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🍺</div>
            <div>
              <div className="font-medium text-purple-800">
                Brew からのメッセージ
              </div>
              <div className="text-purple-700 mt-1">{brewMessage}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 仕上げ機能概要 */}
      <Card workbench className="mb-6 bg-purple-50 border-purple-200">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-purple-800">
              エクスポート仕上げ機能
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-purple-100 rounded-lg border border-purple-300">
              <div className="flex items-center space-x-3 mb-4">
                <Database className="w-8 h-8 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-800">
                  多形式仕上げ
                </h3>
              </div>
              <p className="text-purple-700 mb-4">
                生成済みデータを様々な形式で美しく仕上げ。バッチ処理と進捗表示対応。
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="bg-purple-200 text-purple-800 border-purple-400"
                >
                  JSON
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-purple-200 text-purple-800 border-purple-400"
                >
                  XML
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-purple-200 text-purple-800 border-purple-400"
                >
                  YAML
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-purple-200 text-purple-800 border-purple-400"
                >
                  SQL
                </Badge>
              </div>
            </div>

            <div className="p-4 bg-purple-100 rounded-lg border border-purple-300">
              <div className="flex items-center space-x-3 mb-4">
                <Settings className="w-8 h-8 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-800">
                  カスタム仕上げ
                </h3>
              </div>
              <p className="text-purple-700 mb-4">
                文字エンコーディング、バッチサイズ、フォーマット詳細設定など。
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="bg-purple-200 text-purple-800 border-purple-400"
                >
                  UTF-8
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-purple-200 text-purple-800 border-purple-400"
                >
                  Shift_JIS
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-purple-200 text-purple-800 border-purple-400"
                >
                  批量処理
                </Badge>
              </div>
            </div>

            <div className="p-4 bg-purple-100 rounded-lg border border-purple-300">
              <div className="flex items-center space-x-3 mb-4">
                <Download className="w-8 h-8 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-800">
                  大量データ仕上げ
                </h3>
              </div>
              <p className="text-purple-700 mb-4">
                100万件以上の大量データも安全に仕上げ。メモリ効率とパフォーマンスを最適化。
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="bg-purple-200 text-purple-800 border-purple-400"
                >
                  ストリーミング
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-purple-200 text-purple-800 border-purple-400"
                >
                  進捗表示
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 活用例表示セクション */}
      <Card workbench className="mb-6 bg-purple-50 border-purple-200">
        <div className="p-6">
          <UseCaseShowcase />
        </div>
      </Card>

      {/* メインエクスポートコンテナ */}
      <Card workbench className="bg-purple-50 border-purple-200">
        <div className="p-6">
          <AdvancedExportContainer />
        </div>
      </Card>

      {/* 仕上げガイド */}
      {showGuide && (
        <Card workbench className="mt-6 bg-purple-50 border-purple-200">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <HelpCircle className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-purple-800">
                エクスポート仕上げ工具ガイド
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-purple-800 mb-3">
                  ✨ 仕上げ機能
                </h3>
                <ul className="space-y-2 text-sm text-purple-700">
                  <li>• JSON/XML/YAML/SQL形式での高品質出力</li>
                  <li>• 大量データの効率的な処理</li>
                  <li>• ストリーミング出力でメモリ最適化</li>
                  <li>• リアルタイム進捗表示</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-purple-800 mb-3">
                  🎯 活用シーン
                </h3>
                <ul className="space-y-2 text-sm text-purple-700">
                  <li>• API開発用のテストデータ作成</li>
                  <li>• データベース初期化スクリプト</li>
                  <li>• 設定ファイルの自動生成</li>
                  <li>• 大規模システムのデータ移行</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-purple-100 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">💡</span>
                <span className="font-medium text-purple-800">
                  Brewのヒント
                </span>
              </div>
              <p className="text-sm text-purple-700">
                エクスポート仕上げ工具では、データの品質を保ちながら効率的に出力できます。
                大量データの場合はストリーミング出力を選択し、進捗を確認しながら安全に処理しましょう。
                カスタム設定で文字エンコーディングやフォーマットを細かく調整することも可能です。
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
