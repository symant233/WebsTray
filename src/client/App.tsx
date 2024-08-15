import Frame from './components/Frame';
import Icon from '@mdi/react';
import { mdiLink } from '@mdi/js';
import { useRef, useState } from 'react';
import Content from './components/Content';
import TrayContent from './components/TrayContent';

export default function App() {
  if (location.hash) {
    return <TrayContent url={location.hash.slice(1)} />;
  }

  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.startsWith('http')) {
      window.electron.openWindow(`/#${value}`);
    }
  };

  return (
    <div className="h-screen w-screen bg-white flex flex-col border border-solid border-black">
      <Frame>
        <div className="w-72 p-1 bg-white border border-solid border-b-gray-400 rounded shadow-sm flex flex-row items-center hover:bg-gray-50 has-[:focus]:bg-white has-[:focus]:border-b-blue-400">
          <Icon
            path={mdiLink}
            size={'1rem'}
            className="mx-1 pointer-events-auto"
          />
          <input
            type="url"
            name="url"
            className="w-full text-sm p-1"
            placeholder="Enter URL to Start"
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            onKeyUp={handleEnter}
            spellCheck={false}
          />
        </div>
      </Frame>
      <Content />
    </div>
  );
}
