import Icon from '@mdi/react';
import { mdiLink } from '@mdi/js';
import { useRef } from 'react';
import { urlValidator } from '../utils/urlValidator';
import useStorage from '../hooks/useStorage';
import { IData, STORAGE_RECENT } from '../types';

export default function AppInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { addStorageItem } = useStorage<IData>(STORAGE_RECENT);

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const href = urlValidator(inputRef.current?.value);
      if (href) {
        addStorageItem({ url: href }); // add recent url
        window.electron.openWindow(href);
      }
    }
  };

  return (
    <div className="w-72 p-1 bg-white border border-b-[1.5px] border-solid border-b-gray-400 rounded shadow-sm flex flex-row items-center hover:bg-gray-50 has-[:focus]:bg-white has-[:focus]:border-b-blue-400">
      <Icon path={mdiLink} size={'1rem'} className="mx-1 pointer-events-auto" />
      <input
        type="url"
        name="url"
        className="w-full text-sm p-1"
        placeholder="Enter URL to Start"
        ref={inputRef}
        onKeyUp={handleEnter}
        spellCheck={false}
      />
    </div>
  );
}
