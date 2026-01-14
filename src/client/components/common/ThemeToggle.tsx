import { memo } from 'react';
import { Icon } from '@mdi/react';
import { mdiWeatherNight, mdiWeatherSunny, mdiThemeLightDark } from '@mdi/js';
import type { ThemeMode } from '@client/types';

type Props = {
  theme: ThemeMode;
  onToggle: () => void;
  className?: string;
};

const ThemeToggle = ({ theme, onToggle, className = '' }: Props) => {
  const getIcon = () => {
    switch (theme) {
      case 'light':
        return mdiWeatherSunny;
      case 'dark':
        return mdiWeatherNight;
      case 'system':
        return mdiThemeLightDark;
    }
  };

  const getTitle = () => {
    switch (theme) {
      case 'light':
        return '亮色主题';
      case 'dark':
        return '暗色主题';
      case 'system':
        return '跟随系统';
    }
  };

  return (
    <div
      className={`hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded active:bg-gray-300 dark:active:bg-gray-600 transition-colors cursor-pointer ${className}`}
      onClick={onToggle}
      title={getTitle()}
    >
      <Icon path={getIcon()} size={'1rem'} />
    </div>
  );
};

export default memo(ThemeToggle);
