'use client';

import { useEffect, useState } from 'react';
import BrewCharacter from '../../components/BrewCharacter';
import {
  LightweightProgressBar,
  LightweightStatsDisplay,
  PerformanceAwareNotification,
  useAdaptiveGaming,
} from '../../components/gaming/LightweightGamingSystem';

export default function GamingPage() {
  const config = useAdaptiveGaming();
  const [stats, setStats] = useState({
    count: 1250,
    streak: 7,
    level: 15,
    score: 87,
  });
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState({
    title: 'データマスター',
    icon: '🏆',
    rarity: 'epic' as const,
  });

  useEffect(() => {
    // 初回表示時にアチーブメント表示
    const timer = setTimeout(() => {
      setShowAchievement(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-wb-wood-50">
      {/* ワークベンチヘッダー */}
      <div className="sticky top-0 z-10 bg-wb-wood-100 border-b-2 border-wb-wood-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎨</span>
              <div>
                <h1 className="text-lg font-bold text-wb-wood-800">
                  ゲーミング工具
                </h1>
                <p className="text-sm text-wb-wood-600">
                  🎨 研磨工具 - ゲーミング・エンターテイメント専用
                </p>
              </div>
            </div>
            <div className="text-sm text-wb-wood-500">Quality Workbench</div>
          </div>
        </div>
      </div>

      {/* ワークベンチメインエリア */}
      <div className="wb-workbench-surface max-w-7xl mx-auto px-4 py-6 lg:px-8">
        <div className="space-y-6">
          {/* ワークベンチヘッダー */}
          <div className="wb-workbench-header">
            <div className="flex items-center justify-center space-x-4">
              <div className="p-3 bg-wb-tool-polish-500 rounded-full shadow-lg">
                <span className="text-2xl text-white">🎨</span>
              </div>
              <div className="text-center">
                <h1 className="wb-tool-title text-wb-wood-800">
                  🎨 ゲーミング工具
                </h1>
                <p className="wb-tool-description text-wb-wood-600">
                  ゲーミング要素とエンターテイメント機能で体験を向上させます
                </p>
              </div>
            </div>
          </div>

          {/* Brewキャラクターセクション */}
          <div className="wb-character-section">
            <BrewCharacter
              emotion="happy"
              size="large"
              animation="float"
              message="ゲーミング機能で楽しく作業しましょう！"
              showSpeechBubble={true}
            />
          </div>

          {/* ゲーミング統計パネル */}
          <div className="wb-tool-panel wb-tool-polish">
            <div className="wb-tool-panel-header">
              <h3 className="wb-tool-panel-title">ゲーミング統計</h3>
            </div>
            <LightweightStatsDisplay stats={stats} config={config} />
          </div>

          {/* プログレス表示 */}
          <div className="wb-tool-panel">
            <div className="wb-tool-panel-header">
              <h3 className="wb-tool-panel-title">進捗状況</h3>
            </div>
            <div className="space-y-4">
              <LightweightProgressBar
                current={stats.count}
                max={2000}
                label="データ生成マスター"
                enableGlow={config.enableAnimations}
              />
              <LightweightProgressBar
                current={stats.level}
                max={20}
                label="TDレベル"
                enableGlow={config.enableAnimations}
              />
              <LightweightProgressBar
                current={stats.score}
                max={100}
                label="効率スコア"
                enableGlow={config.enableAnimations}
              />
            </div>
          </div>

          {/* ゲーミング設定 */}
          <div className="wb-tool-panel">
            <div className="wb-tool-panel-header">
              <h3 className="wb-tool-panel-title">ゲーミング設定</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="wb-tool-control">
                <label className="wb-tool-label">パフォーマンスモード</label>
                <select
                  className="wb-select w-full"
                  defaultValue={config.performanceMode}
                >
                  <option value="low">低 (軽量)</option>
                  <option value="medium">中 (バランス)</option>
                  <option value="high">高 (フル機能)</option>
                </select>
              </div>
              <div className="wb-tool-control">
                <label className="wb-tool-label">エフェクト設定</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.enableAnimations}
                      className="wb-checkbox"
                      readOnly
                    />
                    <span className="text-sm text-wb-wood-700">
                      アニメーション
                    </span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.enableParticles}
                      className="wb-checkbox"
                      readOnly
                    />
                    <span className="text-sm text-wb-wood-700">
                      パーティクル
                    </span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.enableSounds}
                      className="wb-checkbox"
                      readOnly
                    />
                    <span className="text-sm text-wb-wood-700">サウンド</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* アチーブメント表示 */}
          <PerformanceAwareNotification
            achievement={currentAchievement}
            isVisible={showAchievement}
            onClose={() => setShowAchievement(false)}
          />
        </div>
      </div>

      {/* 工具説明フッター */}
      <div className="bg-wb-wood-100 border-t border-wb-wood-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-lg font-medium text-wb-wood-800 mb-2">
            🎨 ゲーミング工具について
          </h3>
          <p className="text-wb-wood-600 max-w-3xl mx-auto">
            この工具は、ゲーミング要素とエンターテイメント機能を提供します。研磨ツールとして、
            ユーザー体験の向上と楽しさの追求に特化した機能を提供します。
          </p>
        </div>
      </div>
    </div>
  );
}
