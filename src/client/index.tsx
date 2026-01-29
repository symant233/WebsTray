import { createRoot } from 'react-dom/client';
import useDataStore from './hooks/useDataStore';
import './global.css';

import { useEffect } from 'react';
import Frame from './components/Frame';
import Content from './components/Content';
import TrayContent from './components/TrayContent';
import AppInput from './components/AppInput';
import useHotKey from './hooks/useHotkey';
import { useTheme } from './hooks/useTheme';

const App = () => {
  const { proxy, theme: globalTheme } = useDataStore((state) => state.config);

  useEffect(() => {
    if (proxy) {
      window.electron.setProxy(proxy);
    }
  }, []);

  if (location.hash) {
    return <TrayContent url={location.hash.slice(1)} />;
  }

  // Apply global theme to main window
  useTheme(globalTheme);

  useHotKey('F5', () => {
    window.location?.reload();
  });

  return (
    <div className="h-screen w-screen bg-white dark:bg-gray-900 flex flex-col border border-solid border-black dark:border-gray-700 transition-colors">
      <Frame>
        <AppInput />
      </Frame>
      <Content />
    </div>
  );
};

const root = createRoot(document.querySelector('#app')!);

root.render(<App />);
