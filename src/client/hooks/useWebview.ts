import type Electron from 'electron';
import { useEffect, type RefObject } from 'react';

/**
 * Execute JavaScript code and apply CSS style in the webview. Run callback function after execution.
 * @param webview (react ref) webview tag
 * @param callback
 * @returns {void}
 */
export default function useWebview(
  webview: RefObject<Electron.WebviewTag>,
  callback: () => void,
): void {
  useEffect(() => {
    const element = webview.current;
    if (!element) return;

    const handleWillNavigate = (event: Electron.Event & { url: string }) => {
      event.preventDefault();
      element.loadURL(event.url);
    };

    const handleDomReady = () => {
      element.executeJavaScript(`
        const style = document.createElement('style');
        //style.innerHTML = '::-webkit-scrollbar { display: none; }';
        document.head.appendChild(style);
        const base = document.createElement('base');
        base.target = '_self';
        document.head.appendChild(base);
        window.orientation = 1;
        document.addEventListener('mouseup', (e) => {
          if (e.button === 3) window.history.back();
        });
      `);
      element.insertCSS(`
        iframe {
          border-radius: 16px;
        }
      `);
      const iframe = element.shadowRoot?.querySelector('iframe');
      if (iframe instanceof HTMLIFrameElement) {
        iframe.style.borderRadius = '0.5rem';
      }
      callback();
    };

    element.addEventListener('dom-ready', handleDomReady);
    element.addEventListener('will-navigate', handleWillNavigate);
    return () => {
      element.removeEventListener('dom-ready', handleDomReady);
      element.removeEventListener('will-navigate', handleWillNavigate);
    };
  }, [webview, callback]);
}
