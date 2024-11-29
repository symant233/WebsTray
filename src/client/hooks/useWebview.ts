import { useEffect } from 'react';

/**
 * Execute JavaScript code and apply CSS style in the webview. Run callback function after execution.
 * @param webview (react ref) webview tag
 * @param callback
 * @returns {void}
 */
export default function useWebview(
  webview: React.MutableRefObject<Electron.WebviewTag>,
  callback: () => void,
): void {
  useEffect(() => {
    webview.current.addEventListener('dom-ready', () => {
      webview.current.executeJavaScript(`
        const style = document.createElement('style');
        style.innerHTML = '::-webkit-scrollbar { display: none; }';
        document.head.appendChild(style);
        const base = document.createElement('base');
        base.target = '_self';
        document.head.appendChild(base);
        window.orientation = 1;
        document.addEventListener('mouseup', (e) => {
          if (e.button === 3) window.history.back();
        });
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
      callback();
    });
  }, [webview]);
}
