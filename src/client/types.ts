export type ThemeMode = 'light' | 'dark' | 'system';

export type IData = {
  /** webview url */
  url: string;
  /** webview url hostname */
  hostname?: string;
  /** webview title */
  title?: string;
  /** webview icon (the most clear) */
  icon?: string;
  /** webview icon (alternative) */
  altIcon?: string;
  /** webview favicon */
  favicon?: string;
  /** webview manifest link */
  manifest?: string;
  /** trayWindow memorized bounds */
  bounds?: {
    width: number;
    height: number;
  };
  /** per-page theme override */
  theme?: ThemeMode;
};
