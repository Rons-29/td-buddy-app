'use client';

import { BrewsAnimation, BrewsEmotion, BrewsRole } from '@/types/brews';
import * as LucideIcons from 'lucide-react';
import React, { useEffect, useState } from 'react';
import BrewsIcon from './BrewsIcon';

interface TeamMember {
  id: string;
  role: BrewsRole;
  emotion: BrewsEmotion;
  animation: BrewsAnimation;
  message?: string;
  isActive: boolean;
}

interface BrewsTeamManagerProps {
  teamMembers: TeamMember[];
  maxTeamSize?: number;
  animated?: boolean;
  showMessages?: boolean;
  layout?: 'grid' | 'horizontal' | 'vertical' | 'circle';
  onMemberClick?: (member: TeamMember) => void;
  onTeamChange?: (team: TeamMember[]) => void;
  className?: string;
}

const BrewsTeamManager: React.FC<BrewsTeamManagerProps> = ({
  teamMembers,
  maxTeamSize = 6,
  animated = true,
  showMessages = true,
  layout = 'grid',
  onMemberClick,
  onTeamChange,
  className = '',
}) => {
  const [team, setTeam] = useState<TeamMember[]>(teamMembers);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    setTeam(teamMembers);
  }, [teamMembers]);

  // チームメンバー追加
  const addMember = (newMember: Omit<TeamMember, 'id'>) => {
    if (team.length >= maxTeamSize) {
      return;
    }

    const member: TeamMember = {
      ...newMember,
      id: `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const updatedTeam = [...team, member];
    setTeam(updatedTeam);
    onTeamChange?.(updatedTeam);

    // アニメーション実行
    if (animated) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 800);
    }
  };

  // チームメンバー削除
  const removeMember = (memberId: string) => {
    const updatedTeam = team.filter(member => member.id !== memberId);
    setTeam(updatedTeam);
    onTeamChange?.(updatedTeam);
  };

  // チームメンバーの感情更新
  const updateMemberEmotion = (memberId: string, emotion: BrewsEmotion) => {
    const updatedTeam = team.map(member =>
      member.id === memberId ? { ...member, emotion } : member
    );
    setTeam(updatedTeam);
    onTeamChange?.(updatedTeam);
  };

  // チーム全体の感情一斉変更
  const setTeamEmotion = (emotion: BrewsEmotion) => {
    const updatedTeam = team.map(member => ({ ...member, emotion }));
    setTeam(updatedTeam);
    onTeamChange?.(updatedTeam);

    // チーム協調アニメーション
    if (animated) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1200);
    }
  };

  // レイアウト用のCSSクラス
  const getLayoutClasses = () => {
    const layouts = {
      grid: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
      horizontal: 'flex flex-wrap gap-4 justify-center',
      vertical: 'flex flex-col gap-4 items-center',
      circle: 'grid grid-cols-3 gap-4 max-w-xs mx-auto', // 円形配置のベース
    };
    return layouts[layout] || layouts.grid;
  };

  // 円形配置の特別なスタイル
  const getCircleStyles = (index: number, total: number) => {
    if (layout !== 'circle' || total <= 1) {
      return {};
    }

    const angle = (360 / total) * index;
    const radius = 80;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;

    return {
      transform: `translate(${x}px, ${y}px)`,
      position: 'absolute' as const,
      left: '50%',
      top: '50%',
      marginLeft: '-24px',
      marginTop: '-24px',
    };
  };

  const containerClasses = [
    'brews-team-manager',
    layout === 'circle' ? 'relative h-48 w-48 mx-auto' : getLayoutClasses(),
    animated && isAnimating && 'brews-team-change',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const availableRoles: BrewsRole[] = [
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

  const availableEmotions: BrewsEmotion[] = [
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

  return (
    <div className="brews-team-manager-container">
      {/* チーム管理コントロール */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          チーム管理 ({team.length}/{maxTeamSize})
        </h3>

        {/* 全体感情変更 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            チーム全体の感情:
          </label>
          <div className="flex flex-wrap gap-2">
            {availableEmotions.slice(0, 5).map(emotion => (
              <button
                key={emotion}
                onClick={() => setTeamEmotion(emotion)}
                className="px-3 py-1 text-xs rounded-full wb-badge-count hover:bg-blue-200 transition-colors"
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>

        {/* 新しいメンバー追加 */}
        {team.length < maxTeamSize && (
          <div className="flex gap-2 items-center">
            <button
              onClick={() =>
                addMember({
                  role: availableRoles[
                    Math.floor(Math.random() * availableRoles.length)
                  ],
                  emotion: 'happy',
                  animation: 'none',
                  isActive: true,
                })
              }
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <LucideIcons.UserPlus size={16} />
              ランダム追加
            </button>
            <span className="text-sm text-gray-600">または個別設定で追加</span>
          </div>
        )}
      </div>

      {/* チームメンバー表示 */}
      <div className={containerClasses}>
        {team.map((member, index) => (
          <div
            key={member.id}
            className={`
              brews-member-container relative group
              ${animated ? 'brews-team-enter' : ''}
              ${layout === 'circle' ? 'absolute' : ''}
              flex flex-col items-center justify-center
            `}
            style={
              layout === 'circle' ? getCircleStyles(index, team.length) : {}
            }
          >
            <div className="relative flex items-center justify-center">
              <BrewsIcon
                role={member.role}
                emotion={member.emotion}
                animation={member.animation}
                message={member.message}
                showBubble={showMessages && Boolean(member.message)}
                size="medium"
                onClick={() => onMemberClick?.(member)}
                className="brews-icon-interactive"
              />

              {/* メンバー管理ボタン */}
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    removeMember(member.id);
                  }}
                  className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  title="メンバーを削除"
                >
                  <LucideIcons.X size={12} />
                </button>
              </div>

              {/* アクティブ状態インジケーター */}
              {member.isActive && (
                <div className="brews-status-indicator brews-status-online" />
              )}
            </div>
          </div>
        ))}

        {/* 空のスロット表示 */}
        {team.length < maxTeamSize && layout !== 'circle' && (
          <div
            className="brews-empty-slot border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() =>
              addMember({
                role: 'support',
                emotion: 'happy',
                animation: 'none',
                isActive: true,
              })
            }
          >
            <div className="text-center text-gray-500">
              <LucideIcons.Plus size={24} className="mx-auto mb-2" />
              <span className="text-sm">追加</span>
            </div>
          </div>
        )}
      </div>

      {/* チーム統計 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-md font-medium text-gray-800 mb-2">チーム統計</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">合計メンバー:</span>
            <span className="ml-2 font-semibold">{team.length}</span>
          </div>
          <div>
            <span className="text-gray-600">アクティブ:</span>
            <span className="ml-2 font-semibold text-green-600">
              {team.filter(m => m.isActive).length}
            </span>
          </div>
          <div>
            <span className="text-gray-600">ハッピー:</span>
            <span className="ml-2 font-semibold text-yellow-600">
              {team.filter(m => m.emotion === 'happy').length}
            </span>
          </div>
          <div>
            <span className="text-gray-600">作業中:</span>
            <span className="ml-2 font-semibold text-blue-600">
              {team.filter(m => m.emotion === 'working').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrewsTeamManager;
