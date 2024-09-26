import { createRoot } from 'react-dom/client';
import useDataStore from './hooks/useDataStore';
import './global.css';

import { useEffect } from 'react';
import Frame from './components/Frame';
import Content from './components/Content';
import TrayContent from './components/TrayContent';
import AppInput from './components/AppInput';
import useHotKey from './hooks/useHotkey';

const App = () => {
  const { proxy } = useDataStore((state) => state.config);

  useEffect(() => {
    if (proxy) {
      window.electron.setProxy(proxy);
    }
  }, []);

  if (location.hash) {
    return <TrayContent url={location.hash.slice(1)} />;
  }

  useHotKey('F5', () => {
    window.location?.reload();
  });

  return (
    <div className="h-screen w-screen bg-white flex flex-col border border-solid border-black">
      <Frame>
        <AppInput />
      </Frame>
      <Content />
    </div>
  );
};

const root = createRoot(document.querySelector('#app'));

root.render(<App />);
