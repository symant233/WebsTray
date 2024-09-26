import type { IConfig } from '@/client/hooks/useDataStore';

type Props = {
  config: IConfig;
  setConfig: React.Dispatch<React.SetStateAction<IConfig>>;
};

const GeneralSetting: React.FC<Props> = ({ config, setConfig }) => {
  return (
    <div className="w-full mt-2">
      <div className="p-4 text-lg font-bold">General Settings</div>

      <div className="px-4 flex flex-col *:p-2">
        <div className="font-bold before:content-['#'] before:pr-2">
          Proxy Setting
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
          <label htmlFor="proxy-direct">Direct</label>
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
          <label htmlFor="proxy-system">System proxy</label>
        </div>

        <div>
          <input
            type="radio"
            id="proxy-custom"
            value="custom"
            checked={!!config.proxy && config.proxy !== 'system'}
            className="ml-4 mr-2 inline-block"
            onClick={() =>
              setConfig({ ...config, proxy: 'socks5:127.0.0.1:1080' })
            }
            readOnly
          />
          <label htmlFor="proxy-custom">Custom</label>
          <input
            className="border border-solid ml-2 shadow-sm rounded w-64 focus-within:outline-blue-300"
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
