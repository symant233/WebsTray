import { useEffect, useRef } from 'react';
import { WebviewTag } from 'electron';
import {
  BackButton,
  CloseButton,
  DevtoolButton,
  HomeButton,
  RefreshButton,
} from './common/IconButtons';

type Props = {
  url: string;
};

export default function TrayContent({ url }: Props) {
  const webview = useRef<WebviewTag>(null);

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
      // webview.current.openDevTools();
    });
  }, [webview]);

  return (
    <div className="w-screen h-screen p-1 pb-3">
      <div className="w-full h-full bg-gray-100 shadow p-2 pb-8 rounded-lg relative after:content-[''] after:absolute after:-bottom-[12px] after:left-1/2 after:-translate-x-1/2 after:border-x-[12px] after:border-transparent after:border-t-[12px] after:border-t-gray-100">
        <webview
          // disablewebsecurity
          useragent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
          ref={webview}
          src={url}
          className="w-full h-full rounded-lg border border-solid shadow"
        ></webview>
        <div className="select-none pt-1 text-sm text-gray-600 whitespace-nowrap w-full flex flex-row items-center">
          <BackButton onClick={() => webview.current.goBack()} />
          <span className="overflow-hidden text-ellipsis w-64">
            {webview.current?.title || url}
          </span>
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
