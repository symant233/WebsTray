export type UserAgentType = 'electron' | 'pc' | 'android' | 'ios';

export type ProxySetting = '' | 'system' | string;

export type PageWebPreferences = {
  proxy: ProxySetting;
  userAgent: UserAgentType;
};

export const DEFAULT_PROXY: ProxySetting = '';
export const DEFAULT_USER_AGENT: UserAgentType = 'electron';

export function getWebviewPartition(url: string): string {
  return `persist:webs-tray-${encodeURIComponent(url)}`;
}
