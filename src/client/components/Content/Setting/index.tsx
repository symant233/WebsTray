import { useState } from 'react';
import Button from '@client/components/common/Button';
import Tabs, { ITabOption } from '@client/components/common/Tabs';
import SettingButton from './SettingButton';
import GeneralSetting from './GeneralSetting';
import About from './About';

export default function Setting(): React.ReactNode {
  const [open, setOpen] = useState(false);
  if (!open) return <SettingButton cb={() => setOpen(true)} />;

  const options: ITabOption[] = [
    {
      label: 'General',
      render: <GeneralSetting />,
    },
    {
      label: 'About',
      render: <About />,
    },
  ];

  return (
    <div className="absolute inset-0 w-full h-full flex bg-white z-30">
      <Tabs options={options}></Tabs>
      <div className="flex justify-end absolute bottom-0 w-full gap-2 p-4 bg-white border-t shadow-md">
        <Button cb={() => setOpen(false)} label="Accept" type="primary" />
        <Button cb={() => setOpen(false)} label="Cancel" type="secondary" />
      </div>
    </div>
  );
}
