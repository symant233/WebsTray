import type { IConfig } from '@/client/hooks/useDataStore';
import type { Dispatch, SetStateAction, FC } from 'react';

type Props = {
  config: IConfig;
  setConfig: Dispatch<SetStateAction<IConfig>>;
};

const GeneralSetting: FC<Props> = ({ config, setConfig }) => {
  return (
    <div className="w-full mt-2">
      <div className="p-4 text-lg font-bold dark:text-white">General Settings</div>

      <div className="px-4 flex flex-col *:p-2">
        <div className="font-bold before:content-['#'] before:pr-2 dark:text-white">
          Proxy Setting&nbsp;
          <span className="text-gray-500 dark:text-neutral-400 text-sm">(restart to apply)</span>
        </div>
        <div>
          <input
            type="radio"
            id="proxy-direct"
            value={undefined}
            checked={!config.proxy}
            className="ml-4 mr-2 inline-block"
            onClick={() => setConfig({ ...config, proxy: '' })}
            readOnly
          />
          <label htmlFor="proxy-direct" className="dark:text-neutral-200">Direct</label>
        </div>

        <div>
          <input
            type="radio"
            id="proxy-system"
            value="system"
            checked={config.proxy === 'system'}
            className="ml-4 mr-2 inline-block"
            onClick={() => setConfig({ ...config, proxy: 'system' })}
            readOnly
          />
          <label htmlFor="proxy-system" className="dark:text-neutral-200">System proxy</label>
        </div>

        <div className="py-1">
          <input
            type="radio"
            id="proxy-custom"
            value="custom"
            checked={!!config.proxy && config.proxy !== 'system'}
            className="ml-4 mr-2 inline-block"
            onClick={() =>
              setConfig({ ...config, proxy: `socks://127.0.0.1:1080` })
            }
            readOnly
          />
          <label htmlFor="proxy-custom" className="dark:text-neutral-200">Custom</label>
          <input
            className="border border-solid dark:border-neutral-600 ml-2 shadow-sm rounded w-64 focus-within:outline-blue-300 dark:focus-within:outline-blue-500 px-2 py-1 bg-white dark:bg-neutral-700 text-gray-900 dark:text-neutral-100 transition-colors"
            value={config.proxy === 'system' ? '' : config.proxy}
            onChange={(e) => setConfig({ ...config, proxy: e.target.value })}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralSetting;
