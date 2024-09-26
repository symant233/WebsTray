import { Icon } from '@mdi/react';
import { mdiCog } from '@mdi/js';
import { useState } from 'react';
import Button from '@client/components/common/Button';

export function SettingButton({ cb }: { cb: () => void }) {
  return (
    <div
      className="fixed bottom-4 right-4 cursor-pointer hover:bg-slate-100 active:bg-slate-200 transition-colors p-3 rounded-full"
      onClick={cb}
    >
      <Icon path={mdiCog} size={'1.25rem'} />
    </div>
  );
}

export default function Setting() {
  const [open, setOpen] = useState(false);

  if (!open) return <SettingButton cb={() => setOpen(true)} />;

  return (
    <div className="absolute inset-0 w-full h-full bg-white z-30">
      <div className="flex justify-end absolute bottom-0 w-full gap-2 p-4">
        <Button cb={() => setOpen(false)} label="Accept" type="primary" />
        <Button cb={() => setOpen(false)} label="Cancel" type="secondary" />
      </div>
    </div>
  );
}
