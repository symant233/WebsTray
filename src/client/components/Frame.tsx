import { memo } from 'react';
import Icon from '@mdi/react';
import { mdiMinus } from '@mdi/js';
import { CloseButton } from './common/IconButtons';

type Props = {
  children: React.ReactNode;
};

const Frame = ({ children }: Props) => {
  const isDev = process.env.NODE_ENV === 'development';
  return (
    <div
      id="frame"
      className="select-none w-full h-14 flex flex-row items-center bg-gray-50 border border-solid p-4 justify-between shadow-sm"
    >
      <div className="font-bold text-sm mx-2">
        WebsTray
        {isDev && <span className="bg-blue-500 text-white text-xs">DEV</span>}
      </div>
      <div className="no-drag">{children}</div>
      <div className="flex flex-row no-drag pl-8 gap-2 text-gray-600">
        <div
          className="hover:bg-gray-200 p-1 rounded active:bg-gray-300"
          onClick={() => window.electron.minimize()}
        >
          <Icon path={mdiMinus} size={'1rem'} horizontal vertical />
        </div>
        <CloseButton />
      </div>
    </div>
  );
};

export default memo(Frame);
