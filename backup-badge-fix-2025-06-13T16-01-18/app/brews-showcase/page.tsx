'use client';

import BrewsIcon from '@/components/brews/BrewsIcon';
import BrewsTeamManager from '@/components/brews/BrewsTeamManager';
import '@/styles/brews-animations.css';
import { BrewsAnimation, BrewsEmotion, BrewsRole } from '@/types/brews';
import * as LucideIcons from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface DemoState {
  selectedRole: BrewsRole;
  selectedEmotion: BrewsEmotion;
  selectedAnimation: BrewsAnimation;
  selectedSize: 'small' | 'medium' | 'large';
  showMessage: boolean;
  message: string;
  autoPlay: boolean;
}

const BrewsShowcasePage: React.FC = () => {
  const [demoState, setDemoState] = useState<DemoState>({
    selectedRole: 'support',
    selectedEmotion: 'happy',
    selectedAnimation: 'none',
    selectedSize: 'medium',
    showMessage: true,
    message: '',
    autoPlay: false,
  });

  const [teamMembers, setTeamMembers] = useState([
    {
      id: '1',
      role: 'support' as BrewsRole,
      emotion: 'happy' as BrewsEmotion,
      animation: 'heartbeat' as BrewsAnimation,
      message: 'サポートします！',
      isActive: true,
    },
    {
      id: '2',
      role: 'ai' as BrewsRole,
      emotion: 'thinking' as BrewsEmotion,
      animation: 'pulse' as BrewsAnimation,
      message: 'AI分析中...',
      isActive: true,
    },
    {
      id: '3',
      role: 'security' as BrewsRole,
      emotion: 'working' as BrewsEmotion,
      animation: 'none' as BrewsAnimation,
      message: 'セキュリティチェック',
      isActive: true,
    },
  ]);

  const [performanceMetrics, setPerformanceMetrics] = useState({
    renderTime: 0,
    animationCount: 0,
    memoryUsage: 0,
  });

  const allRoles: BrewsRole[] = [
    'support',
    'ai',
    'security',
    'quality',
    'password',
    'personal',
    'csv',
    'json',
    'text',
    'number',
    'datetime',
    'uuid',
  ];

  const allEmotions: BrewsEmotion[] = [
    'happy',
    'excited',
    'working',
    'thinking',
    'success',
    'error',
    'warning',
    'sleepy',
    'brewing',
    'completed',
  ];

  const allAnimations: BrewsAnimation[] = [
    'none',
    'bounce',
    'wiggle',
    'pulse',
    'spin',
    'heartbeat',
    'float',
  ];

  // 自動プレイ機能
  useEffect(() => {
    if (!demoState.autoPlay) {
      return;
    }

    const interval = setInterval(() => {
      setDemoState(prev => ({
        ...prev,
        selectedEmotion:
          allEmotions[Math.floor(Math.random() * allEmotions.length)],
        selectedAnimation:
          allAnimations[Math.floor(Math.random() * allAnimations.length)],
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [demoState.autoPlay, allEmotions, allAnimations]);

  // パフォーマンス測定
  useEffect(() => {
    const measurePerformance = () => {
      const startTime = performance.now();

      requestAnimationFrame(() => {
        const endTime = performance.now();
        setPerformanceMetrics(prev => ({
          ...prev,
          renderTime: Math.round((endTime - startTime) * 100) / 100,
          animationCount: document.querySelectorAll('[class*="animate-"]')
            .length,
        }));
      });
    };

    measurePerformance();
  }, [demoState, teamMembers]);

  const handleTeamChange = (newTeam: any[]) => {
    setTeamMembers(newTeam);
  };

  const handleMemberClick = (member: any) => {
    console.log('Member clicked:', member);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* ヘッダー */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          🎨 Brews Icon System - Showcase
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
          新しいBrews
          Iconシステムの全機能をインタラクティブに体験できるデモページです。
          アニメーション、チーム管理、カスタマイゼーション機能をお試しください。
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左サイド: コントロールパネル */}
        <div className="lg:col-span-1 space-y-6">
          {/* 基本設定 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <LucideIcons.Settings size={20} />
              基本設定
            </h2>

            {/* 役割選択 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                役割 (Role)
              </label>
              <select
                value={demoState.selectedRole}
                onChange={e =>
                  setDemoState(prev => ({
                    ...prev,
                    selectedRole: e.target.value as BrewsRole,
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {allRoles.map(role => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* 感情選択 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                感情 (Emotion)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {allEmotions.map(emotion => (
                  <button
                    key={emotion}
                    onClick={() =>
                      setDemoState(prev => ({
                        ...prev,
                        selectedEmotion: emotion,
                      }))
                    }
                    className={`p-2 text-xs rounded-md transition-colors ${
                      demoState.selectedEmotion === emotion
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
            </div>

            {/* アニメーション選択 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                アニメーション
              </label>
              <select
                value={demoState.selectedAnimation}
                onChange={e =>
                  setDemoState(prev => ({
                    ...prev,
                    selectedAnimation: e.target.value as BrewsAnimation,
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {allAnimations.map(animation => (
                  <option key={animation} value={animation}>
                    {animation}
                  </option>
                ))}
              </select>
            </div>

            {/* サイズ選択 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                サイズ
              </label>
              <div className="flex gap-2">
                {['small', 'medium', 'large'].map(size => (
                  <button
                    key={size}
                    onClick={() =>
                      setDemoState(prev => ({
                        ...prev,
                        selectedSize: size as any,
                      }))
                    }
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      demoState.selectedSize === size
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* メッセージ設定 */}
            <div className="mb-4">
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={demoState.showMessage}
                  onChange={e =>
                    setDemoState(prev => ({
                      ...prev,
                      showMessage: e.target.checked,
                    }))
                  }
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  メッセージを表示
                </span>
              </label>
              {demoState.showMessage && (
                <input
                  type="text"
                  value={demoState.message}
                  onChange={e =>
                    setDemoState(prev => ({ ...prev, message: e.target.value }))
                  }
                  placeholder="カスタムメッセージ"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>

            {/* 自動プレイ */}
            <div className="mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={demoState.autoPlay}
                  onChange={e =>
                    setDemoState(prev => ({
                      ...prev,
                      autoPlay: e.target.checked,
                    }))
                  }
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  自動プレイ
                </span>
              </label>
            </div>
          </div>

          {/* パフォーマンス指標 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <LucideIcons.Activity size={20} />
              パフォーマンス
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">レンダリング時間:</span>
                <span className="font-mono">
                  {performanceMetrics.renderTime}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">アニメーション数:</span>
                <span className="font-mono">
                  {performanceMetrics.animationCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">チームメンバー数:</span>
                <span className="font-mono">{teamMembers.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 中央・右サイド: デモエリア */}
        <div className="lg:col-span-2 space-y-8">
          {/* 単体アイコンデモ */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              単体アイコンデモ
            </h2>
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="flex flex-col items-center justify-center">
                <BrewsIcon
                  role={demoState.selectedRole}
                  emotion={demoState.selectedEmotion}
                  animation={demoState.selectedAnimation}
                  size={demoState.selectedSize}
                  message={demoState.message || undefined}
                  showBubble={demoState.showMessage}
                  onClick={() => console.log('Demo icon clicked!')}
                />
              </div>
            </div>
          </div>

          {/* 全サイズ比較 */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              サイズバリエーション
            </h2>
            <div className="flex justify-center items-end gap-8">
              {['small', 'medium', 'large'].map(size => (
                <div
                  key={size}
                  className="text-center flex flex-col items-center"
                >
                  <BrewsIcon
                    role={demoState.selectedRole}
                    emotion={demoState.selectedEmotion}
                    animation={demoState.selectedAnimation}
                    size={size as any}
                  />
                  <p className="mt-2 text-sm text-gray-600">{size}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 全役割デモ */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              全役割ギャラリー
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {allRoles.map(role => (
                <div
                  key={role}
                  className="text-center flex flex-col items-center"
                >
                  <BrewsIcon
                    role={role}
                    emotion="happy"
                    animation="none"
                    size="medium"
                  />
                  <p className="mt-2 text-xs text-gray-600">{role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* チーム管理デモ */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              チーム管理デモ
            </h2>
            <BrewsTeamManager
              teamMembers={teamMembers}
              maxTeamSize={8}
              animated={true}
              showMessages={true}
              layout="grid"
              onMemberClick={handleMemberClick}
              onTeamChange={handleTeamChange}
            />
          </div>

          {/* アニメーションギャラリー */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              アニメーションギャラリー
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {allAnimations
                .filter(anim => anim !== 'none')
                .map(animation => (
                  <div
                    key={animation}
                    className="text-center flex flex-col items-center"
                  >
                    <BrewsIcon
                      role="support"
                      emotion="happy"
                      animation={animation}
                      size="medium"
                    />
                    <p className="mt-2 text-sm text-gray-600">{animation}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* フッター */}
      <div className="max-w-7xl mx-auto mt-12 text-center text-gray-500">
        <p>🎉 Brews Icon System Phase 3 - 統合・テスト完了</p>
        <p className="text-sm mt-2">
          **TDからのメッセージ**:
          アニメーション、チーム管理、デモページすべて準備完了です！✨
        </p>
      </div>
    </div>
  );
};

export default BrewsShowcasePage;
