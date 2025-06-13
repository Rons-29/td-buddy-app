// Brews Icon System Components
export { default as BrewsDemo } from './BrewsDemo';
export { default as BrewsIcon } from './BrewsIcon';
export { default as BrewsTeamSelector } from './BrewsTeamSelector';
export { BrewCharacter, default as BrewsWrapper } from './BrewsWrapper';

// Hooks
export { useBrewsTeam } from '@/hooks/useBrewsTeam';

// Types
export type {
  BrewsAnimation,
  BrewsConfig,
  BrewsEmotion,
  BrewsIconProps,
  BrewsRole,
  BrewsSize,
  BrewsState,
} from '@/types/brews';

// Utils
export {
  BREWS_ROLE_CONFIGS,
  getAnimationClasses,
  getBrewsConfig,
  getColorClasses,
  getDefaultMessage,
  getSizeClasses,
} from '@/utils/brewsHelpers';
