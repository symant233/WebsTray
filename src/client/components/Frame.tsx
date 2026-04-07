import { memo, type ReactNode } from 'react';
import { Icon } from '@mdi/react';
import { mdiMinus } from '@mdi/js';
import { CloseButton } from './common/IconButtons';
import DevLabel from './common/DevLabel';
import ThemeToggle from './common/ThemeToggle';
import useDataStore from '@client/hooks/useDataStore';
import { getNextThemeMode } from '@client/hooks/useTheme';

type Props = {
  children: ReactNode;
};

const Frame = ({ children }: Props) => {
  const { theme } = useDataStore((state) => state.config);
  const setConfig = useDataStore((state) => state.setConfig);
  const config = useDataStore((state) => state.config);

  const handleThemeToggle = () => {
    const nextTheme = getNextThemeMode(theme);
    setConfig({ ...config, theme: nextTheme });
  };

  const isMac = window.electron.isMac;

  return (
    <div
      id="frame"
      className="select-none w-full h-14 flex flex-row items-center bg-gray-50 dark:bg-neutral-800 border border-solid border-gray-200 dark:border-neutral-900 p-4 shadow-sm z-50 transition-colors"
    >
      <div className={`font-bold text-sm mx-2 cursor-grab active:cursor-grabbing dark:text-white shrink-0 ${isMac ? 'ml-16' : ''}`}>
        WebsTray
        <DevLabel />
      </div>
      <div className="flex-1 flex justify-center"><div className="no-drag">{children}</div></div>
      <div className="flex flex-row no-drag gap-2 text-gray-600 dark:text-neutral-300 shrink-0">
        <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
        {!isMac && (
          <>
            <div
              className="hover:bg-gray-200 dark:hover:bg-neutral-700 p-1 rounded active:bg-gray-300 dark:active:bg-neutral-600 transition-colors cursor-pointer"
              onClick={() => window.electron.minimize()}
            >
              <Icon path={mdiMinus} size={'1rem'} horizontal vertical />
            </div>
            <CloseButton />
          </>
        )}
      </div>
    </div>
  );
};

export default memo(Frame);
