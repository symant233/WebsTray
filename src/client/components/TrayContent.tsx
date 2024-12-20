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

type Props = {
  url: string;
};

export default function TrayContent({ url }: Props) {
  const webview = useRef<WebviewTag>(null);
  const [title, setTitle] = useState(url);
  const containerRef = useRef<HTMLDivElement>(null);

  const current: IData = useDataStore((state) => state.getData(url));
  const updater = useDataStore((state) => state.updater);

  async function handleManifest() {
    const webTitle = webview.current?.getTitle();
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
    const listener = () => {
      const showTriangle = trayWindowBounds.width >= window.innerWidth - 10;
      if (showTriangle) {
        containerRef.current?.classList.remove('after:invisible');
      } else {
        containerRef.current?.classList.add('after:invisible');
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

  return (
    <div className="w-screen h-screen p-1 pb-3">
      <div
        className="w-full h-full bg-gray-100 drop-shadow-md border border-solid p-2 pb-8 rounded-lg relative after:content-[''] after:absolute after:-bottom-[12px] after:left-1/2 after:-translate-x-1/2 after:border-x-[12px] after:border-transparent after:border-t-[12px] after:border-t-gray-100"
        ref={containerRef}
      >
        <webview
          // disablewebsecurity
          ref={webview}
          src={url}
          className="w-full h-full rounded-lg border border-solid shadow"
        ></webview>
        <div className="select-none pt-1 text-sm text-gray-600 whitespace-nowrap w-full flex flex-row items-center">
          <BackButton onClick={() => webview.current.goBack()} />
          <span className="overflow-hidden text-ellipsis pr-1 app-drag">
            {title}
          </span>
          <DevLabel />
          <div className="flex-1 p-0.5 min-h-5 app-drag"></div>
          <DevtoolButton onClick={() => webview.current.openDevTools()} />
          <HomeButton />
          <RefreshButton onClick={() => webview.current.reload()} />
          <CloseButton />
        </div>
      </div>
    </div>
  );
}
