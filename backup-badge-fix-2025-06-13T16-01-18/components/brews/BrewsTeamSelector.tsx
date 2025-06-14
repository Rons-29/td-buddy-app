'use client';

import { BrewsRole } from '@/types/brews';
import { BREWS_ROLE_CONFIGS } from '@/utils/brewsHelpers';
import React from 'react';
import BrewsIcon from './BrewsIcon';

interface BrewsTeamSelectorProps {
  currentRole: BrewsRole;
  onRoleSelect: (role: BrewsRole) => void;
  showLabels?: boolean;
  size?: 'small' | 'medium' | 'large';
  layout?: 'grid' | 'horizontal' | 'vertical';
  className?: string;
}

const BrewsTeamSelector: React.FC<BrewsTeamSelectorProps> = ({
  currentRole,
  onRoleSelect,
  showLabels = true,
  size = 'small',
  layout = 'grid',
  className = '',
}) => {
  const roles = Object.keys(BREWS_ROLE_CONFIGS) as BrewsRole[];

  const layoutClasses = {
    grid: 'grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2',
    horizontal: 'flex flex-wrap gap-2',
    vertical: 'flex flex-col gap-2',
  };

  const getItemClasses = (role: BrewsRole) => {
    const isSelected = role === currentRole;
    return `
      transition-all duration-200
      ${
        isSelected
          ? 'ring-2 ring-blue-500 ring-offset-2 scale-105'
          : 'hover:scale-105 hover:shadow-md'
      }
      ${layout === 'vertical' ? 'w-full' : ''}
    `;
  };

  return (
    <div className={`brews-team-selector ${className}`}>
      {showLabels && (
        <div className="mb-4 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Brews チーム選択
          </h3>
          <p className="text-sm text-gray-600">
            どの専門分野のBrewsにお手伝いしてもらいますか？
          </p>
        </div>
      )}

      <div className={layoutClasses[layout]}>
        {roles.map(role => (
          <div
            key={role}
            className={getItemClasses(role)}
            onClick={() => onRoleSelect(role)}
          >
            <BrewsIcon
              role={role}
              emotion={role === currentRole ? 'excited' : 'happy'}
              size={size}
              showBubble={false}
              className="cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* 現在選択中のBrews情報 */}
      {showLabels && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
          <div className="text-sm font-medium text-gray-800">
            選択中: {BREWS_ROLE_CONFIGS[currentRole].name}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {BREWS_ROLE_CONFIGS[currentRole].description}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrewsTeamSelector;
