import { useState, type ReactNode } from 'react';
import Button from '@client/components/common/Button';
import Tabs, { ITabOption } from '@client/components/common/Tabs';
import SettingButton from './SettingButton';
import GeneralSetting from './GeneralSetting';
import PageSetting from './PageSetting';
import About from './About';
import useDataStore from '@client/hooks/useDataStore';
import type { IData } from '@client/types';

export default function Setting(): ReactNode {
  const [open, setOpen] = useState(false);

  const config = useDataStore((state) => state.config);
  const setConfig = useDataStore((state) => state.setConfig);
  const updater = useDataStore((state) => state.updater);
  const favorite = useDataStore((state) => state.favorite);
  const recent = useDataStore((state) => state.recent);

  const [tmpConfig, setTmpConfig] = useState(config);
  const [tmpPages, setTmpPages] = useState<IData[]>([]);
  const [pageSnapshot, setPageSnapshot] = useState<Map<string, IData>>(
    new Map(),
  );

  const options: ITabOption[] = [
    {
      label: 'General',
      render: <GeneralSetting config={tmpConfig} setConfig={setTmpConfig} />,
    },
    {
      label: 'Pages',
      render: <PageSetting pages={tmpPages} setPages={setTmpPages} />,
    },
    {
      label: 'About',
      render: <About />,
    },
  ];

  const handleAccept = () => {
    setConfig(tmpConfig);

    for (const next of tmpPages) {
      const before = pageSnapshot.get(next.url);
      if (!before) continue;

      const overrideChanged =
        before.proxy !== next.proxy || before.userAgent !== next.userAgent;
      if (overrideChanged) {
        updater(next.url, {
          proxy: next.proxy,
          userAgent: next.userAgent,
        });
      }

      const effBefore = {
        proxy: before.proxy ?? config.proxy,
        userAgent: before.userAgent ?? config.userAgent,
      };
      const effAfter = {
        proxy: next.proxy ?? tmpConfig.proxy,
        userAgent: next.userAgent ?? tmpConfig.userAgent,
      };
      const effectiveChanged =
        effBefore.proxy !== effAfter.proxy ||
        effBefore.userAgent !== effAfter.userAgent;
      if (effectiveChanged) {
        window.electron.applyPagePreferences(next.url, effAfter);
      }
    }

    setOpen(false);
  };

  const openSetting = () => {
    setTmpConfig(config);
    const all = [...favorite, ...recent];
    setTmpPages(all);
    setPageSnapshot(new Map(all.map((p) => [p.url, p])));
    setOpen(true);
  };

  if (!open) return <SettingButton cb={openSetting} />;
  return (
    <div className="inset-0 w-full h-full flex bg-white dark:bg-neutral-900 z-30 fixed pt-14 transition-colors">
      <Tabs options={options}></Tabs>
      <div className="flex justify-end absolute bottom-0 w-full gap-2 p-4 bg-white dark:bg-neutral-800 border-t border-neutral-300 dark:border-neutral-700 shadow-md transition-colors">
        <Button cb={handleAccept} label="Accept" type="primary" />
        <Button cb={() => setOpen(false)} label="Cancel" type="secondary" />
      </div>
    </div>
  );
}
