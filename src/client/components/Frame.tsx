import { memo } from 'react';
import Icon from '@mdi/react';
import { mdiWindowClose, mdiMinus } from '@mdi/js';

type Props = {
  children: React.ReactNode;
};

const Frame = ({ children }: Props) => {
  return (
    <div
      id="frame"
      className="select-none w-full h-14 flex flex-row items-center bg-gray-50 border border-solid p-4 justify-between"
    >
      <div className="font-bold text-sm mx-2">WebsTray</div>
      <div className="no-drag">{children}</div>
      <div className="flex flex-row no-drag pl-8 gap-2 text-gray-600">
        <div
          className="hover:bg-gray-200 p-1 rounded active:bg-gray-300"
          onClick={() => window.electron.minimize()}
        >
          <Icon path={mdiMinus} size={'1rem'} horizontal vertical />
        </div>
        <div
          className="hover:bg-gray-200 p-1 rounded active:bg-gray-300"
          onClick={() => window.close()}
        >
          <Icon path={mdiWindowClose} size={'1rem'} horizontal vertical />
        </div>
      </div>
    </div>
  );
};

export default memo(Frame);
