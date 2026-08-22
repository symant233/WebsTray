import { useEffect, useRef, useState } from 'react';
import { WebviewTag } from 'electron';
import {
  BackButton,
  CloseButton,
  DevtoolButton,
  HomeButton,
  RefreshButton,
} from './common/IconButtons';
import { resolvePageIcons } from '@client/utils/manifestHelper';
import useDataStore from '@client/hooks/useDataStore';
import DevLabel from './common/DevLabel';
import { convertImageToDataURL } from '@client/utils/imageConverter';
import { trayWindowBounds } from '@client/constant';
import useWebview from '../hooks/useWebview';
import ThemeToggle from './common/ThemeToggle';
import { getNextThemeMode, useTheme } from '@client/hooks/useTheme';
import { getWebviewPartition } from '@/shared/webPreferences';

type Props = {
  url: string;
};

export default function TrayContent({ url }: Props) {
  const webview = useRef<WebviewTag>(null);
  const [title, setTitle] = useState(url);
  const containerRef = useRef<HTMLDivElement>(null);

  const isMac = window.electron.isMac;

  const current = useDataStore((state) => state.getData(url));
  const updater = useDataStore((state) => state.updater);
  const globalTheme = useDataStore((state) => state.config.theme);

  const partition = getWebviewPartition(url);
  const effectiveTheme = current?.theme || globalTheme;
  useTheme(effectiveTheme);

  const handleThemeToggle = () => {
    const nextTheme = getNextThemeMode(effectiveTheme);
    updater(url, { theme: nextTheme });
  };

  async function applyTrayIcon(src: string) {
    try {
      // Prefer pre-inlined data URLs (already fetched via webview's session
      // and rasterized to PNG); fall back to canvas conversion on the
      // current renderer's session for plain URLs.
      const base64 = src.startsWith('data:')
        ? src
        : await convertImageToDataURL(src);
      window.electron.setTrayIcon(url, base64);
    } catch (err) {
      console.warn('TrayContent: failed to apply tray icon', err);
    }
  }

  async function handleManifest() {
    if (!webview.current) {
      return;
    }
    const webTitle = webview.current.getTitle();
    setTitle(webTitle);

    try {
      if (!current?.icon) {
        const manifestURL: string | null =
          await webview.current.executeJavaScript(
            `(document.querySelector('link[rel="manifest"]') || {}).href || null`,
          );

        const data = await resolvePageIcons(webview.current, manifestURL);
        if (!data.title) {
          data.title = webTitle;
        }
        data.manifest = manifestURL ?? undefined;
        updater(url, data);

        const trayIconSrc = data.altIcon || data.icon || data.favicon;
        if (trayIconSrc) {
          await applyTrayIcon(trayIconSrc);
        }
      } else {
        if (!current.title) {
          updater(url, { title: webTitle });
        }
        const trayIconSrc = current.altIcon || current.icon || current.favicon;
        if (trayIconSrc) {
          await applyTrayIcon(trayIconSrc);
        }
      }
    } catch (err) {
      console.error('TrayContent: handleManifest error', err);
    }
  }

  const handleReloadWebview = () => {
    webview.current?.reload();
  };

  useWebview(webview, handleManifest);

  useEffect(() => {
    const bounds = current?.bounds;
    if (bounds) {
      window.resizeTo(bounds.width, bounds.height);
    }
  }, []);

  useEffect(() => {
    return window.electron.onReloadTrayWebview(handleReloadWebview);
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

  const handleGoBack = () => {
    webview.current?.goBack();
  };

  const handleOpenDevTools = () => {
    webview.current?.openDevTools();
  };

  const handleLoadHome = () => {
    webview.current?.loadURL(url);
  };

  const triangleWin =
    "after:content-[''] after:absolute after:-bottom-[9px] after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-4 after:bg-gray-100 dark:after:bg-neutral-900 after:border-r after:border-b after:border-gray-200 dark:after:border-neutral-700 after:rotate-45";
  const triangleMac =
    "before:content-[''] before:absolute before:-top-[9px] before:left-1/2 before:-translate-x-1/2 before:w-4 before:h-4 before:bg-gray-100 dark:before:bg-neutral-900 before:border-l before:border-t before:border-gray-200 dark:before:border-neutral-700 before:rotate-45";

  const controlBar = (
    <div
      className={`select-none ${isMac ? 'pb-1' : 'pt-1'} text-sm text-gray-600 dark:text-neutral-300 whitespace-nowrap w-full flex flex-row items-center transition-colors`}
    >
      <BackButton onClick={handleGoBack} />
      <span className="overflow-hidden text-ellipsis pr-1 app-drag">
        {title}
      </span>
      <DevLabel />
      <div className="flex-1 p-0.5 min-h-5 app-drag"></div>
      <ThemeToggle theme={effectiveTheme} onToggle={handleThemeToggle} />
      <DevtoolButton onClick={handleOpenDevTools} />
      <HomeButton onClick={handleLoadHome} />
      <RefreshButton onClick={handleReloadWebview} />
      <CloseButton />
    </div>
  );

  return (
    <div
      className={`w-screen h-screen p-1 ${isMac ? 'pt-3' : 'pb-3'} bg-transparent`}
    >
      <div
        className={`w-full h-full bg-gray-100 dark:bg-neutral-900 drop-shadow-md border border-solid border-gray-200 dark:border-neutral-700 p-2 rounded-lg relative ${isMac ? triangleMac : triangleWin} transition-colors flex flex-col`}
        ref={containerRef}
      >
        {isMac && controlBar}
        <webview
          ref={webview}
          src={url}
          partition={partition}
          className="w-full flex-1 rounded-lg border border-solid border-gray-300 dark:border-neutral-800 shadow"
        ></webview>
        {!isMac && controlBar}
      </div>
    </div>
  );
}
