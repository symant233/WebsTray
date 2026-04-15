import { useEffect, useRef, useState } from 'react';
import { WebviewTag } from 'electron';
import {
  BackButton,
  CloseButton,
  DevtoolButton,
  HomeButton,
  RefreshButton,
} from './common/IconButtons';
import manifestHelper from '@client/utils/manifestHelper';
import useDataStore from '@client/hooks/useDataStore';
import DevLabel from './common/DevLabel';
import { convertImageToDataURL } from '@client/utils/imageConverter';
import type { IData } from '@client/types';
import { trayWindowBounds } from '@client/constant';
import useWebview from '../hooks/useWebview';
import ThemeToggle from './common/ThemeToggle';
import { getNextThemeMode, useTheme } from '@client/hooks/useTheme';

type Props = {
  url: string;
};

export default function TrayContent({ url }: Props) {
  const webview = useRef<WebviewTag>(null);
  const [title, setTitle] = useState(url);
  const containerRef = useRef<HTMLDivElement>(null);

  const isMac = window.electron.isMac;

  const current: IData = useDataStore((state) => state.getData(url));
  const updater = useDataStore((state) => state.updater);
  const globalTheme = useDataStore((state) => state.config.theme);

  const effectiveTheme = current?.theme || globalTheme;
  useTheme(effectiveTheme);

  const handleThemeToggle = () => {
    const nextTheme = getNextThemeMode(effectiveTheme);
    updater(url, { theme: nextTheme });
  };

  async function handleManifest() {
    if (!webview.current) return;
    const webTitle = webview.current.getTitle();
    setTitle(webTitle);
    // * start of manifest handler
    const manifest = await webview.current.executeJavaScript(
      `document.querySelector('link[rel="manifest"]')?.href;`,
    );
    const favicon = await webview.current.executeJavaScript(
      `document.querySelector('link[rel*="icon"]')?.href;`,
    );
    try {
      let altIcon = current.altIcon;
      if (!current.icon) {
        const data = await manifestHelper(manifest);
        if (!data.title) data.title = webTitle;
        altIcon = data.altIcon;
        updater(url, { manifest, ...data, favicon });
      }
      if (favicon || altIcon) {
        const base64 = await convertImageToDataURL(favicon || altIcon);
        window.electron.setTrayIcon(url, base64);
      }
    } catch (err) {
      console.error('TrayContent', err);
    }
    if (!current.icon) window.electron.reload();
  }

  useWebview(webview, handleManifest);

  useEffect(() => {
    if (current.bounds) {
      window.resizeTo(current.bounds.width, current.bounds.height);
    }
  }, []);

  useEffect(() => {
    const pseudoClass = isMac ? 'before:invisible' : 'after:invisible';
    const listener = () => {
      const showTriangle = trayWindowBounds.width >= window.innerWidth - 10;
      if (showTriangle) {
        containerRef.current?.classList.remove(pseudoClass);
      } else {
        containerRef.current?.classList.add(pseudoClass);
      }
      updater(url, {
        bounds: { width: window.innerWidth, height: window.innerHeight },
      });
    };
    window.addEventListener('resize', listener);
    return () => {
      window.removeEventListener('resize', listener);
    };
  }, []);

  const triangleWin =
    "after:content-[''] after:absolute after:-bottom-[9px] after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-4 after:bg-gray-100 dark:after:bg-neutral-900 after:border-r after:border-b after:border-gray-200 dark:after:border-neutral-700 after:rotate-45";
  const triangleMac =
    "before:content-[''] before:absolute before:-top-[9px] before:left-1/2 before:-translate-x-1/2 before:w-4 before:h-4 before:bg-gray-100 dark:before:bg-neutral-900 before:border-l before:border-t before:border-gray-200 dark:before:border-neutral-700 before:rotate-45";

  const controlBar = (
    <div className={`select-none ${isMac ? 'pb-1' : 'pt-1'} text-sm text-gray-600 dark:text-neutral-300 whitespace-nowrap w-full flex flex-row items-center transition-colors`}>
      <BackButton onClick={() => webview.current.goBack()} />
      <span className="overflow-hidden text-ellipsis pr-1 app-drag">
        {title}
      </span>
      <DevLabel />
      <div className="flex-1 p-0.5 min-h-5 app-drag"></div>
      <ThemeToggle theme={effectiveTheme} onToggle={handleThemeToggle} />
      <DevtoolButton onClick={() => webview.current.openDevTools()} />
      <HomeButton />
      <RefreshButton onClick={() => webview.current.reload()} />
      <CloseButton />
    </div>
  );

  return (
    <div className={`w-screen h-screen p-1 ${isMac ? 'pt-3' : 'pb-3'} bg-transparent`}>
      <div
        className={`w-full h-full bg-gray-100 dark:bg-neutral-900 drop-shadow-md border border-solid border-gray-200 dark:border-neutral-700 p-2 ${isMac ? '' : 'pb-8'} rounded-lg relative ${isMac ? triangleMac : triangleWin} transition-colors flex flex-col`}
        ref={containerRef}
      >
        {isMac && controlBar}
        <webview
          ref={webview}
          src={url}
          className="w-full flex-1 rounded-lg border border-solid border-gray-300 dark:border-neutral-800 shadow"
        ></webview>
        {!isMac && controlBar}
      </div>
    </div>
  );
}
