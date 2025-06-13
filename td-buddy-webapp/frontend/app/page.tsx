'use client';

import {
  Activity,
  BarChart3,
  HelpCircle,
  Settings,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  MobileQuickAccess,
  MobileToolCard,
} from '../components/ui/mobile-navigation';

export default function Home() {
  const [showGuide, setShowGuide] = useState(false);
  const [brewMessage, setBrewMessage] = useState(
    '🔧 統合ダッシュボード工具の準備完了！全ての工具を統合管理できます♪'
  );

  // 工具統計データ（実際の使用状況に基づいて動的に更新可能）
  const toolStats = {
    totalTools: 12,
    activeUsers: 1,
    generatedData: 0,
    uptime: '99.9%',
  };

  return (
    <div className="min-h-screen wb-workbench-bg">
      {/* ワークベンチヘッダー */}
      <Card workbench className="mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-800">
                🔧 統合ダッシュボード工具
              </h1>
              <p className="text-blue-600 mt-1">全工具の統合管理・監視・分析</p>
            </div>
            <Badge
              variant="outline"
              className="bg-blue-100 text-blue-700 border-blue-300"
            >
              統合工具
            </Badge>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              workbench
              onClick={() => setShowGuide(!showGuide)}
              className={`${
                showGuide
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              {showGuide ? 'ガイドを閉じる' : '統合ガイド'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Brewメッセージ */}
      <Card workbench className="mb-6 bg-blue-50 border-blue-200">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🍺</div>
            <div>
              <div className="font-medium text-blue-800">
                Brew からのメッセージ
              </div>
              <div className="text-blue-700 mt-1">{brewMessage}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 工房統計ダッシュボード */}
      <Card workbench className="mb-6 bg-blue-50 border-blue-200">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-blue-800">
              工房統計ダッシュボード
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">
                {toolStats.totalTools}
              </div>
              <div className="text-sm text-blue-600 flex items-center justify-center mt-1">
                <Zap className="h-3 w-3 mr-1" />
                利用可能工具
              </div>
            </div>
            <div className="text-center p-4 bg-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">
                {toolStats.activeUsers}
              </div>
              <div className="text-sm text-blue-600 flex items-center justify-center mt-1">
                <Users className="h-3 w-3 mr-1" />
                アクティブユーザー
              </div>
            </div>
            <div className="text-center p-4 bg-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">
                {toolStats.generatedData.toLocaleString()}
              </div>
              <div className="text-sm text-blue-600 flex items-center justify-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                生成データ数
              </div>
            </div>
            <div className="text-center p-4 bg-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">
                {toolStats.uptime}
              </div>
              <div className="text-sm text-blue-600 flex items-center justify-center mt-1">
                <Activity className="h-3 w-3 mr-1" />
                稼働率
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* モバイル専用クイックアクセス */}
      <div className="md:hidden mb-6">
        <MobileQuickAccess />
      </div>

      {/* 工具カテゴリ紹介 */}
      <Card workbench className="mb-6 bg-blue-50 border-blue-200">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-blue-800">
              🛠️ 5つの専門工具カテゴリ
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-100 rounded-lg border border-blue-300">
              <div className="text-3xl mb-2">🔍</div>
              <div className="font-medium text-blue-800 mb-1">検査工具</div>
              <div className="text-sm text-blue-600">セキュリティ・認証</div>
            </div>
            <div className="text-center p-4 bg-green-100 rounded-lg border border-green-300">
              <div className="text-3xl mb-2">🔗</div>
              <div className="font-medium text-green-800 mb-1">接合工具</div>
              <div className="text-sm text-green-600">データ統合・組立</div>
            </div>
            <div className="text-center p-4 bg-orange-100 rounded-lg border border-orange-300">
              <div className="text-3xl mb-2">📏</div>
              <div className="font-medium text-orange-800 mb-1">測定工具</div>
              <div className="text-sm text-orange-600">数値・構造・計測</div>
            </div>
            <div className="text-center p-4 bg-purple-100 rounded-lg border border-purple-300">
              <div className="text-3xl mb-2">✨</div>
              <div className="font-medium text-purple-800 mb-1">仕上げ工具</div>
              <div className="text-sm text-purple-600">AI・品質向上</div>
            </div>
            <div className="text-center p-4 bg-red-100 rounded-lg border border-red-300">
              <div className="text-3xl mb-2">✂️</div>
              <div className="font-medium text-red-800 mb-1">切断工具</div>
              <div className="text-sm text-red-600">データ分離・選択</div>
            </div>
          </div>
        </div>
      </Card>

      {/* メイン工具カード */}
      <Card workbench className="bg-blue-50 border-blue-200">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Zap className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-blue-800">
              🔧 利用可能な工具
            </h2>
          </div>

          {/* デスクトップ・タブレット用グリッド */}
          <div className="hidden md:block">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* 検査工具 */}
              <Link
                href="/password"
                className="block p-6 bg-blue-100 border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-3 text-center">🔐</div>
                <h3 className="font-semibold text-blue-800 mb-2 text-center">
                  パスワード生成
                </h3>
                <p className="text-sm text-blue-700 mb-3 text-center">
                  セキュアで強力なパスワードを生成。文字種・長さ・複雑さを自由に設定できます。
                </p>
                <Badge
                  variant="outline"
                  className="w-full justify-center bg-blue-200 text-blue-800 border-blue-400"
                >
                  🔍 検査工具
                </Badge>
              </Link>

              <Link
                href="/uuid"
                className="block p-6 bg-blue-100 border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-3 text-center">🆔</div>
                <h3 className="font-semibold text-blue-800 mb-2 text-center">
                  UUID生成
                </h3>
                <p className="text-sm text-blue-700 mb-3 text-center">
                  一意識別子（UUID）を各バージョン形式で生成。システム間連携に最適です。
                </p>
                <Badge
                  variant="outline"
                  className="w-full justify-center bg-blue-200 text-blue-800 border-blue-400"
                >
                  🔍 検査工具
                </Badge>
              </Link>

              {/* 接合工具 */}
              <Link
                href="/personal"
                className="block p-6 bg-green-100 border-2 border-green-300 rounded-lg hover:border-green-500 hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-3 text-center">👤</div>
                <h3 className="font-semibold text-green-800 mb-2 text-center">
                  個人情報生成
                </h3>
                <p className="text-sm text-green-700 mb-3 text-center">
                  テスト用の個人情報データを生成。GDPR準拠で安全なダミーデータを提供します。
                </p>
                <Badge
                  variant="outline"
                  className="w-full justify-center bg-green-200 text-green-800 border-green-400"
                >
                  🔗 接合工具
                </Badge>
              </Link>

              <Link
                href="/practical-data"
                className="block p-6 bg-green-100 border-2 border-green-300 rounded-lg hover:border-green-500 hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-3 text-center">📊</div>
                <h3 className="font-semibold text-green-800 mb-2 text-center">
                  実用データ生成
                </h3>
                <p className="text-sm text-green-700 mb-3 text-center">
                  実際のテストで使える実用的なデータセットを生成。業務シナリオに対応します。
                </p>
                <Badge
                  variant="outline"
                  className="w-full justify-center bg-green-200 text-green-800 border-green-400"
                >
                  🔗 接合工具
                </Badge>
              </Link>

              {/* 測定工具 */}
              <Link
                href="/number-boolean"
                className="block p-6 bg-orange-100 border-2 border-orange-300 rounded-lg hover:border-orange-500 hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-3 text-center">🔢</div>
                <h3 className="font-semibold text-orange-800 mb-2 text-center">
                  数値・真偽値
                </h3>
                <p className="text-sm text-orange-700 mb-3 text-center">
                  数値データと真偽値を生成。統計的分布や範囲指定に対応しています。
                </p>
                <Badge
                  variant="outline"
                  className="w-full justify-center bg-orange-200 text-orange-800 border-orange-400"
                >
                  📏 測定工具
                </Badge>
              </Link>

              <Link
                href="/csv-detailed"
                className="block p-6 bg-orange-100 border-2 border-orange-300 rounded-lg hover:border-orange-500 hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-3 text-center">📋</div>
                <h3 className="font-semibold text-orange-800 mb-2 text-center">
                  CSV生成
                </h3>
                <p className="text-sm text-orange-700 mb-3 text-center">
                  構造化されたCSVデータを生成。カスタムスキーマとデータ型に対応します。
                </p>
                <Badge
                  variant="outline"
                  className="w-full justify-center bg-orange-200 text-orange-800 border-orange-400"
                >
                  📏 測定工具
                </Badge>
              </Link>

              <Link
                href="/datetime"
                className="block p-6 bg-orange-100 border-2 border-orange-300 rounded-lg hover:border-orange-500 hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-3 text-center">📅</div>
                <h3 className="font-semibold text-orange-800 mb-2 text-center">
                  日時生成
                </h3>
                <p className="text-sm text-orange-700 mb-3 text-center">
                  日付・時刻データを生成。タイムゾーン・フォーマット・範囲指定に対応します。
                </p>
                <Badge
                  variant="outline"
                  className="w-full justify-center bg-orange-200 text-orange-800 border-orange-400"
                >
                  📏 測定工具
                </Badge>
              </Link>

              {/* 仕上げ工具 */}
              <Link
                href="/ai-chat"
                className="block p-6 bg-purple-100 border-2 border-purple-300 rounded-lg hover:border-purple-500 hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-3 text-center">🤖</div>
                <h3 className="font-semibold text-purple-800 mb-2 text-center">
                  AI チャット
                </h3>
                <p className="text-sm text-purple-700 mb-3 text-center">
                  AI
                  を活用したインテリジェントなデータ生成とQA支援を提供します。
                </p>
                <Badge
                  variant="outline"
                  className="w-full justify-center bg-purple-200 text-purple-800 border-purple-400"
                >
                  ✨ 仕上げ工具
                </Badge>
              </Link>

              <Link
                href="/text-tools"
                className="block p-6 bg-purple-100 border-2 border-purple-300 rounded-lg hover:border-purple-500 hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-3 text-center">📝</div>
                <h3 className="font-semibold text-purple-800 mb-2 text-center">
                  テキストツール
                </h3>
                <p className="text-sm text-purple-700 mb-3 text-center">
                  テキスト生成、文字数カウント、文字種解析など包括的な文字処理機能。
                </p>
                <Badge
                  variant="outline"
                  className="w-full justify-center bg-purple-200 text-purple-800 border-purple-400"
                >
                  ✨ 仕上げ工具
                </Badge>
              </Link>

              <Link
                href="/colors"
                className="block p-6 bg-purple-100 border-2 border-purple-300 rounded-lg hover:border-purple-500 hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-3 text-center">🎨</div>
                <h3 className="font-semibold text-purple-800 mb-2 text-center">
                  カラー生成
                </h3>
                <p className="text-sm text-purple-700 mb-3 text-center">
                  美しいカラーパレットとカラーコードを生成。デザイン作業に最適です。
                </p>
                <Badge
                  variant="outline"
                  className="w-full justify-center bg-purple-200 text-purple-800 border-purple-400"
                >
                  ✨ 仕上げ工具
                </Badge>
              </Link>

              <Link
                href="/export"
                className="block p-6 bg-purple-100 border-2 border-purple-300 rounded-lg hover:border-purple-500 hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-3 text-center">📤</div>
                <h3 className="font-semibold text-purple-800 mb-2 text-center">
                  エクスポート
                </h3>
                <p className="text-sm text-purple-700 mb-3 text-center">
                  生成したデータを様々な形式で高品質出力。大量データにも対応します。
                </p>
                <Badge
                  variant="outline"
                  className="w-full justify-center bg-purple-200 text-purple-800 border-purple-400"
                >
                  ✨ 仕上げ工具
                </Badge>
              </Link>

              {/* 切断工具 */}
              <Link
                href="/data-selector"
                className="block p-6 bg-red-100 border-2 border-red-300 rounded-lg hover:border-red-500 hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-3 text-center">✂️</div>
                <h3 className="font-semibold text-red-800 mb-2 text-center">
                  データ選択
                </h3>
                <p className="text-sm text-red-700 mb-3 text-center">
                  大量データから必要な部分を選択・分離・切り出し。効率的なデータ管理。
                </p>
                <Badge
                  variant="outline"
                  className="w-full justify-center bg-red-200 text-red-800 border-red-400"
                >
                  ✂️ 切断工具
                </Badge>
              </Link>
            </div>
          </div>

          {/* モバイル用カード */}
          <div className="md:hidden space-y-4">
            <MobileToolCard
              href="/password"
              icon="🔐"
              title="パスワード生成"
              description="セキュアなパスワード生成"
              category="🔍 検査工具"
              categoryColor="bg-blue-100 text-blue-800"
            />
            <MobileToolCard
              href="/personal"
              icon="👤"
              title="個人情報生成"
              description="テスト用個人情報データ"
              category="🔗 接合工具"
              categoryColor="bg-green-100 text-green-800"
            />
            <MobileToolCard
              href="/csv-detailed"
              icon="📋"
              title="CSV生成"
              description="構造化CSVデータ生成"
              category="📏 測定工具"
              categoryColor="bg-orange-100 text-orange-800"
            />
            <MobileToolCard
              href="/ai-chat"
              icon="🤖"
              title="AI チャット"
              description="AI支援データ生成"
              category="✨ 仕上げ工具"
              categoryColor="bg-purple-100 text-purple-800"
            />
            <MobileToolCard
              href="/data-selector"
              icon="✂️"
              title="データ選択"
              description="データ選択・分離"
              category="✂️ 切断工具"
              categoryColor="bg-red-100 text-red-800"
            />
          </div>
        </div>
      </Card>

      {/* 統合ガイド */}
      {showGuide && (
        <Card workbench className="mt-6 bg-blue-50 border-blue-200">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-blue-800">
                統合ダッシュボード工具ガイド
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-blue-800 mb-3">
                  🔧 統合管理機能
                </h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• 全12工具の統合ダッシュボード</li>
                  <li>• リアルタイム工房統計表示</li>
                  <li>• カテゴリ別工具分類・管理</li>
                  <li>• クイックアクセス・効率的ナビゲーション</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-blue-800 mb-3">
                  📊 5つの工具カテゴリ
                </h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• 🔍 検査工具: セキュリティ・認証（パスワード・UUID）</li>
                  <li>
                    • 🔗 接合工具: データ統合・組立（個人情報・実用データ）
                  </li>
                  <li>• 📏 測定工具: 数値・構造・計測（CSV・数値・日時）</li>
                  <li>
                    • ✨ 仕上げ工具:
                    AI・品質向上（チャット・テキスト・カラー・エクスポート）
                  </li>
                  <li>• ✂️ 切断工具: データ分離・選択（データセレクタ）</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-100 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">💡</span>
                <span className="font-medium text-blue-800">Brewのヒント</span>
              </div>
              <p className="text-sm text-blue-700">
                統合ダッシュボードでは、全ての工具を効率的に管理できます。
                工房統計で使用状況を確認し、カテゴリ別に整理された工具から最適なものを選択してください。
                モバイルではクイックアクセス機能で素早く目的の工具にアクセスできます。
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
