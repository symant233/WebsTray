import { memo } from 'react';
import { Icon } from '@mdi/react';
import { mdiWeatherNight, mdiWeatherSunny, mdiThemeLightDark } from '@mdi/js';
import type { ThemeMode } from '@client/types';

type Props = {
  theme: ThemeMode;
  onToggle: () => void;
  className?: string;
};

const THEME_CONFIG: Record<ThemeMode, { icon: string; title: string }> = {
  light: { icon: mdiWeatherSunny, title: 'Light Theme' },
  dark: { icon: mdiWeatherNight, title: 'Dark Theme' },
  system: { icon: mdiThemeLightDark, title: 'Follow System' },
};

const ThemeToggle = ({ theme, onToggle, className = '' }: Props) => {
  const { icon, title } = THEME_CONFIG[theme] || THEME_CONFIG.system;

  return (
    <div
      className={`hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded active:bg-gray-300 dark:active:bg-gray-600 transition-colors cursor-pointer ${className}`}
      onClick={onToggle}
      title={title}
    >
      <Icon path={icon} size={'1rem'} />
    </div>
  );
};

export default memo(ThemeToggle);
