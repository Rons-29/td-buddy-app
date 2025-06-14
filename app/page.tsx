"use client";

import {
  Activity,
  BarChart3,
  HelpCircle,
  Settings,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export default function Home() {
  const [showGuide, setShowGuide] = useState(false);
  const [brewMessage, setBrewMessage] = useState(
    "🔧 統合ダッシュボード工具の準備完了！全ての工具を統合管理できます♪"
  );

  // 工具統計データ（実際の使用状況に基づいて動的に更新可能）
  const toolStats = {
    totalTools: 12,
    activeUsers: 1,
    generatedData: 0,
    uptime: "99.9%",
  };

  return (
    <div className="min-h-screen wb-workbench-bg">
      {/* ワークベンチヘッダー */}
      <Card
        workbench
        className="mb-6"
        style={{
          backgroundColor: "var(--wb-wood-50)",
          borderColor: "var(--wb-wood-200)",
        }}
      >
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: "var(--wb-wood-100)",
              }}
            >
              <Settings
                className="h-6 w-6"
                style={{ color: "var(--wb-wood-600)" }}
              />
            </div>
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: "var(--wb-wood-800)" }}
              >
                🔧 統合ダッシュボード工具
              </h1>
              <p className="mt-1" style={{ color: "var(--wb-wood-600)" }}>
                全工具の統合管理・監視・分析
              </p>
            </div>
            <Badge
              variant="outline"
              className="border"
              style={{
                backgroundColor: "var(--wb-metal-100)",
                color: "var(--wb-metal-700)",
                borderColor: "var(--wb-metal-300)",
              }}
            >
              統合工具
            </Badge>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              workbench
              onClick={() => setShowGuide(!showGuide)}
              className={`${showGuide ? "text-white" : ""}`}
              style={{
                backgroundColor: showGuide
                  ? "var(--wb-wood-600)"
                  : "var(--wb-wood-100)",
                color: showGuide ? "white" : "var(--wb-wood-700)",
              }}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              {showGuide ? "ガイドを閉じる" : "統合ガイド"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Brewメッセージ */}
      <Card
        workbench
        className="mb-6"
        style={{
          backgroundColor: "var(--wb-wood-50)",
          borderColor: "var(--wb-wood-200)",
        }}
      >
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🍺</div>
            <div>
              <div
                className="font-medium"
                style={{ color: "var(--wb-wood-800)" }}
              >
                Brew からのメッセージ
              </div>
              <div className="mt-1" style={{ color: "var(--wb-wood-700)" }}>
                {brewMessage}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 工房統計ダッシュボード */}
      <Card
        workbench
        className="mb-6"
        style={{
          backgroundColor: "var(--wb-metal-50)",
          borderColor: "var(--wb-metal-200)",
        }}
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3
              className="h-5 w-5"
              style={{ color: "var(--wb-metal-600)" }}
            />
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--wb-metal-800)" }}
            >
              工房統計ダッシュボード
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              className="text-center p-4 rounded-lg"
              style={{ backgroundColor: "var(--wb-metal-100)" }}
            >
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--wb-metal-800)" }}
              >
                {toolStats.totalTools}
              </div>
              <div
                className="text-sm flex items-center justify-center mt-1"
                style={{ color: "var(--wb-metal-600)" }}
              >
                <Zap className="h-3 w-3 mr-1" />
                利用可能工具
              </div>
            </div>
            <div
              className="text-center p-4 rounded-lg"
              style={{ backgroundColor: "var(--wb-metal-100)" }}
            >
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--wb-metal-800)" }}
              >
                {toolStats.activeUsers}
              </div>
              <div
                className="text-sm flex items-center justify-center mt-1"
                style={{ color: "var(--wb-metal-600)" }}
              >
                <Users className="h-3 w-3 mr-1" />
                アクティブユーザー
              </div>
            </div>
            <div
              className="text-center p-4 rounded-lg"
              style={{ backgroundColor: "var(--wb-metal-100)" }}
            >
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--wb-metal-800)" }}
              >
                {toolStats.generatedData}
              </div>
              <div
                className="text-sm flex items-center justify-center mt-1"
                style={{ color: "var(--wb-metal-600)" }}
              >
                <Activity className="h-3 w-3 mr-1" />
                生成データ数
              </div>
            </div>
            <div
              className="text-center p-4 rounded-lg"
              style={{ backgroundColor: "var(--wb-metal-100)" }}
            >
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--wb-metal-800)" }}
              >
                {toolStats.uptime}
              </div>
              <div
                className="text-sm flex items-center justify-center mt-1"
                style={{ color: "var(--wb-metal-600)" }}
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                稼働率
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
