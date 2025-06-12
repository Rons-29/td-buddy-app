'use client';

import React from 'react';
import { Download, FileDown, Database, Settings } from 'lucide-react';
import { AdvancedExportContainer } from '@/components/AdvancedExportContainer';
import UseCaseShowcase from '@/components/UseCaseShowcase';

export default function ExportPage() {
  return (
    <main className="min-h-screen bg-td-background">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-td-primary-500 rounded-full flex items-center justify-center">
              <FileDown className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-td-primary-900">
              ファイル出力機能強化
            </h1>
          </div>
          <p className="text-lg text-td-gray-600 max-w-2xl mx-auto">
            JSON/XML/YAML/SQL形式での高度なデータエクスポート機能。
            大量データの効率的な処理とストリーミング出力に対応。
          </p>
        </div>

        {/* ブリューからのメッセージ */}
        <div className="bg-td-accent-50 border border-td-accent-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-td-accent-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              TD
            </div>
            <div>
              <h3 className="text-lg font-semibold text-td-accent-800 mb-2">
                🚀 Step 12: ファイル出力機能が大幅パワーアップ！
              </h3>
              <ul className="text-td-accent-700 space-y-1">
                <li>• <strong>多形式対応</strong>: JSON, XML, YAML, SQL出力</li>
                <li>• <strong>大量データ処理</strong>: 100万件でもサクサク処理</li>
                <li>• <strong>ストリーミング出力</strong>: メモリ効率を最適化</li>
                <li>• <strong>リアルタイム進捗</strong>: 処理状況をリアルタイム表示</li>
                <li>• <strong>カスタマイズ可能</strong>: 出力形式を細かく調整</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 機能選択カード */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-td-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-8 h-8 text-td-primary-500" />
              <h3 className="text-lg font-semibold text-td-primary-800">データエクスポート</h3>
            </div>
            <p className="text-td-gray-600 mb-4">
              生成済みデータを様々な形式でエクスポート。バッチ処理と進捗表示対応。
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-td-primary-100 text-td-primary-700 rounded text-sm">JSON</span>
              <span className="px-2 py-1 bg-td-secondary-100 text-td-secondary-700 rounded text-sm">XML</span>
              <span className="px-2 py-1 bg-td-accent-100 text-td-accent-700 rounded text-sm">YAML</span>
              <span className="px-2 py-1 bg-td-success-100 text-td-success-700 rounded text-sm">SQL</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-td-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="w-8 h-8 text-td-secondary-500" />
              <h3 className="text-lg font-semibold text-td-secondary-800">カスタム設定</h3>
            </div>
            <p className="text-td-gray-600 mb-4">
              文字エンコーディング、バッチサイズ、フォーマット詳細設定など。
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-td-gray-100 text-td-gray-700 rounded text-sm">UTF-8</span>
              <span className="px-2 py-1 bg-td-gray-100 text-td-gray-700 rounded text-sm">Shift_JIS</span>
              <span className="px-2 py-1 bg-td-gray-100 text-td-gray-700 rounded text-sm">批量処理</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-td-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <Download className="w-8 h-8 text-td-accent-500" />
              <h3 className="text-lg font-semibold text-td-accent-800">大量データ対応</h3>
            </div>
            <p className="text-td-gray-600 mb-4">
              100万件以上の大量データも安全に処理。メモリ効率とパフォーマンスを最適化。
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-td-warning-100 text-td-warning-700 rounded text-sm">ストリーミング</span>
              <span className="px-2 py-1 bg-td-info-100 text-td-info-700 rounded text-sm">進捗表示</span>
            </div>
          </div>
        </div>

        {/* 🆕 活用例表示セクション */}
        <div className="mb-8">
          <UseCaseShowcase />
        </div>

        {/* メインコンテナ */}
        <AdvancedExportContainer />
      </div>
    </main>
  );
} 