import { Icon } from '@mdi/react';
import { mdiCog } from '@mdi/js';

const SettingButton: React.FC<{ cb: () => void }> = ({ cb }) => {
  return (
    <div
      className="fixed bottom-4 right-4 cursor-pointer hover:bg-slate-100 active:bg-slate-200 transition-colors p-3 rounded-full"
      onClick={cb}
    >
      <Icon path={mdiCog} size={'1.25rem'} />
    </div>
  );
};

export default SettingButton;
