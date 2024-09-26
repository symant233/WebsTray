import { useState } from 'react';
import Button from '@client/components/common/Button';
import Tabs, { ITabOption } from '@client/components/common/Tabs';
import SettingButton from './SettingButton';
import GeneralSetting from './GeneralSetting';
import About from './About';
import useDataStore from '@client/hooks/useDataStore';

export default function Setting(): React.ReactNode {
  const [open, setOpen] = useState(false);

  const config = useDataStore((state) => state.config);
  const setConfig = useDataStore((state) => state.setConfig);
  const [tmpConfig, setTmpConfig] = useState(config);

  const options: ITabOption[] = [
    {
      label: 'General',
      render: <GeneralSetting config={tmpConfig} setConfig={setTmpConfig} />,
    },
    {
      label: 'About',
      render: <About />,
    },
  ];

  const handleAccept = () => {
    console.log(config, tmpConfig);
    setConfig(tmpConfig);
    setOpen(false);
  };

  if (!open)
    return (
      <SettingButton
        cb={() => {
          setTmpConfig(config);
          setOpen(true);
        }}
      />
    );
  return (
    <div className="absolute inset-0 w-full h-full flex bg-white z-30">
      <Tabs options={options}></Tabs>
      <div className="flex justify-end absolute bottom-0 w-full gap-2 p-4 bg-white border-t shadow-md">
        <Button cb={handleAccept} label="Accept" type="primary" />
        <Button cb={() => setOpen(false)} label="Cancel" type="secondary" />
      </div>
    </div>
  );
}
