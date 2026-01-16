import { Icon } from '@mdi/react';
import { mdiLink } from '@mdi/js';
import { useRef } from 'react';
import urlValidator from '@client/utils/urlValidator';
import getHostname from '@client/utils/getHostname';
import useDataStore from '@client/hooks/useDataStore';

export default function AppInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const addRecent = useDataStore((state) => state.addRecent);

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const href = urlValidator(inputRef.current?.value);
      if (href) {
        addRecent({ url: href, hostname: getHostname(href) }); // add recent url
        window.electron.openWindow(href);
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-72 p-1 bg-white dark:bg-neutral-700 border border-b-[1.5px] border-solid border-gray-200 dark:border-neutral-600 border-b-gray-400 dark:border-b-neutral-500 rounded shadow-sm flex flex-row items-center hover:bg-gray-50 dark:hover:bg-neutral-600 has-[:focus]:bg-white dark:has-[:focus]:bg-neutral-700 has-[:focus]:border-b-blue-400 dark:has-[:focus]:border-b-blue-500 transition-colors">
      <Icon path={mdiLink} size={'1rem'} className="mx-1 pointer-events-auto text-gray-700 dark:text-neutral-200" />
      <input
        type="url"
        name="url"
        className="w-full text-sm p-1 focus-visible:outline-none bg-transparent text-gray-900 dark:text-neutral-100 placeholder:text-gray-500 dark:placeholder:text-neutral-400"
        placeholder="Enter URL to Start"
        ref={inputRef}
        onKeyUp={handleEnter}
        spellCheck={false}
      />
    </div>
  );
}
