import { useEffect, useRef, useState } from 'react';
import { WebviewTag } from 'electron';
import {
  BackButton,
  CloseButton,
  DevtoolButton,
  HomeButton,
  RefreshButton,
} from './common/IconButtons';
import { fetchJsonData } from '../services/api';
import manifestHelper, { IManifest } from '../utils/manifestHelper';
import useDataStore from '../hooks/useDataStore';

type Props = {
  url: string;
};

export default function TrayContent({ url }: Props) {
  const webview = useRef<WebviewTag>(null);
  const [title, setTitle] = useState(url);

  const updateRecent = useDataStore((state) => state.updateRecent);

  async function handleManifest() {
    const manifest = await webview.current.executeJavaScript(
      `document.querySelector('link[rel="manifest"]')?.href;`,
    );
    try {
      const data = await fetchJsonData<IManifest>(manifest);
      const parsed = manifestHelper(data);
      updateRecent(url, { manifest, ...parsed });
    } catch (err) {
      console.log('TrayContent', err);
    }
  }

  useEffect(() => {
    webview.current.addEventListener('dom-ready', () => {
      webview.current.executeJavaScript(`
        const style = document.createElement('style');
        style.innerHTML = '::-webkit-scrollbar { display: none; }';
        document.head.appendChild(style);
        const base = document.createElement('base');
        base.target = '_self';
        document.head.appendChild(base);
        window.orientation = 0;
      `);
      webview.current.insertCSS(`
        iframe {
          border-radius: 16px;
        }
      `);
      webview.current.addEventListener('will-navigate', (event) => {
        event.preventDefault();
        webview.current.loadURL(event.url);
      });
      webview.current.shadowRoot.querySelector('iframe').style.borderRadius =
        '0.5rem';
      setTitle(webview.current?.getTitle());
      handleManifest();
    });
  }, [webview]);

  return (
    <div className="w-screen h-screen p-1 pb-3">
      <div className="w-full h-full bg-gray-100 shadow p-2 pb-8 rounded-lg relative after:content-[''] after:absolute after:-bottom-[12px] after:left-1/2 after:-translate-x-1/2 after:border-x-[12px] after:border-transparent after:border-t-[12px] after:border-t-gray-100">
        <webview
          disablewebsecurity
          ref={webview}
          src={url}
          className="w-full h-full rounded-lg border border-solid shadow"
        ></webview>
        <div className="select-none pt-1 text-sm text-gray-600 whitespace-nowrap w-full flex flex-row items-center">
          <BackButton onClick={() => webview.current.goBack()} />
          <span className="overflow-hidden text-ellipsis w-64">{title}</span>
          <div className="flex-1"></div>
          <DevtoolButton onClick={() => webview.current.openDevTools()} />
          <HomeButton />
          <RefreshButton onClick={() => webview.current.reload()} />
          <CloseButton />
        </div>
      </div>
    </div>
  );
}
