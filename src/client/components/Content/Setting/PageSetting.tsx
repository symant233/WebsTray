import type { Dispatch, FC, SetStateAction } from 'react';
import getHostname from '@client/utils/getHostname';
import LazyImage from '@client/components/common/LazyImage';
import type { IData, ProxySetting, UserAgentType } from '@client/types';

type Props = {
  pages: IData[];
  setPages: Dispatch<SetStateAction<IData[]>>;
};

type ProxyMode = 'global' | 'direct' | 'system' | 'custom';

const getProxyMode = (proxy: ProxySetting | undefined): ProxyMode => {
  if (proxy === undefined) return 'global';
  if (proxy === '') return 'direct';
  if (proxy === 'system') return 'system';
  return 'custom';
};

const selectClass =
  'rounded border border-solid border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 dark:text-neutral-100 px-1 py-1 text-sm shadow-sm focus-visible:outline-blue-300 dark:focus-visible:outline-blue-500';

const inputClass =
  'border border-solid border-neutral-300 dark:border-neutral-600 shadow-sm rounded focus-within:outline-blue-300 dark:focus-within:outline-blue-500 px-1 py-1 bg-white dark:bg-neutral-700 text-gray-900 dark:text-neutral-100 text-sm transition-colors';

const PageSetting: FC<Props> = ({ pages, setPages }) => {
  const updatePage = (url: string, patch: Partial<IData>) => {
    setPages((prev) =>
      prev.map((p) => (p.url === url ? { ...p, ...patch } : p)),
    );
  };

  const handleUserAgentChange = (url: string, value: string) => {
    const next = value === 'global' ? undefined : (value as UserAgentType);
    updatePage(url, { userAgent: next });
  };

  const handleProxyModeChange = (page: IData, mode: ProxyMode) => {
    let next: ProxySetting | undefined;
    switch (mode) {
      case 'global':
        next = undefined;
        break;
      case 'direct':
        next = '';
        break;
      case 'system':
        next = 'system';
        break;
      case 'custom':
        next =
          page.proxy && page.proxy !== 'system'
            ? page.proxy
            : 'socks://127.0.0.1:1080';
        break;
    }
    updatePage(page.url, { proxy: next });
  };

  const handleCustomProxyChange = (url: string, proxy: string) => {
    updatePage(url, { proxy });
  };

  const handleReset = (url: string) => {
    updatePage(url, { proxy: undefined, userAgent: undefined });
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="p-4 text-lg font-bold dark:text-white shrink-0">
        Page Settings
      </div>
      <div className="px-4 pb-2 text-sm text-gray-500 dark:text-neutral-400 shrink-0">
        Override User Agent and Proxy per page. Choose{' '}
        <span className="font-semibold">Default</span> to follow the global
        setting. Changes apply on Accept.
      </div>

      {pages.length === 0 ? (
        <div className="px-4 py-8 text-gray-500 dark:text-neutral-400">
          No saved pages yet. Open a website to configure per-page settings.
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar px-4 pb-24 flex flex-col gap-2">
          {pages.map((page) => {
            const hostname = getHostname(page.url) || page.hostname;
            const iconURL =
              page.icon ||
              page.altIcon ||
              page.favicon ||
              (hostname ? `https://${hostname}/favicon.ico` : '');
            const proxyMode = getProxyMode(page.proxy);
            const hasOverride =
              page.userAgent !== undefined || page.proxy !== undefined;

            return (
              <div
                key={page.url}
                className="border border-solid border-neutral-200 dark:border-neutral-700 rounded-lg p-3 flex flex-col gap-2 bg-white dark:bg-neutral-800 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {iconURL ? (
                    <LazyImage
                      src={iconURL}
                      width={32}
                      height={32}
                      className="rounded shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 shrink-0 rounded bg-neutral-200 dark:bg-neutral-700"></div>
                  )}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-bold dark:text-white truncate">
                      {page.title || hostname || page.url}
                    </span>
                    <span
                      className="text-xs text-gray-500 dark:text-neutral-400 truncate"
                      title={page.url}
                    >
                      {page.url}
                    </span>
                  </div>
                  {hasOverride && (
                    <button
                      type="button"
                      className="text-xs px-2 py-1 rounded border border-solid border-neutral-300 dark:border-neutral-600 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 active:bg-neutral-200 dark:active:bg-neutral-600 transition-colors shrink-0"
                      onClick={() => handleReset(page.url)}
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <label className="text-sm dark:text-neutral-200 w-20 shrink-0">
                    User Agent
                  </label>
                  <select
                    className={selectClass}
                    value={page.userAgent ?? 'global'}
                    onChange={(e) =>
                      handleUserAgentChange(page.url, e.target.value)
                    }
                  >
                    <option value="global">Default (use global)</option>
                    <option value="electron">Electron</option>
                    <option value="pc">PC (Chrome Windows)</option>
                    <option value="android">Android</option>
                    <option value="ios">iOS (Safari)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <label className="text-sm dark:text-neutral-200 w-20 shrink-0">
                    Proxy
                  </label>
                  <select
                    className={selectClass}
                    value={proxyMode}
                    onChange={(e) =>
                      handleProxyModeChange(page, e.target.value as ProxyMode)
                    }
                  >
                    <option value="global">Default (use global)</option>
                    <option value="direct">Direct</option>
                    <option value="system">System proxy</option>
                    <option value="custom">Custom</option>
                  </select>
                  {proxyMode === 'custom' && (
                    <input
                      className={`${inputClass} flex-1 min-w-0`}
                      value={
                        page.proxy && page.proxy !== 'system' ? page.proxy : ''
                      }
                      onChange={(e) =>
                        handleCustomProxyChange(page.url, e.target.value)
                      }
                      placeholder="socks://127.0.0.1:1080"
                      spellCheck={false}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PageSetting;
