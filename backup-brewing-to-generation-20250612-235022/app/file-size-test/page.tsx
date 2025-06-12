"use client";

import React from "react";
import FileSizeTestGenerator from "../../components/FileSizeTestGenerator";

export default function FileSizeTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            📁 ファイル容量テスト
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            指定したサイズのテストファイルを生成できます
          </p>
          <p className="text-sm text-gray-500">
            青空文庫の実際のテキストデータや、ランダムデータでファイルを埋めることができます
          </p>
        </div>

        {/* メインコンテンツ */}
        <FileSizeTestGenerator />

        {/* フッター */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <div className="border-t pt-6">
            <p>
              💡
              使用用途：アップロード制限のテスト、ストレージ容量の確認、パフォーマンステストなど
            </p>
            <p className="mt-2">
              🛡️
              安全性：生成されたファイルはローカルでのみ作成され、サーバーには送信されません
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
