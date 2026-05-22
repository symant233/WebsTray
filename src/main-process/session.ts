import { session, type Session } from 'electron';
import { getUserAgent } from './helper';
import {
  getWebviewPartition,
  type PageWebPreferences,
  type ProxySetting,
  type UserAgentType,
} from '@/shared/webPreferences';

let currentUserAgent: string | null = null;
const userAgentByPartition = new Map<string, string | null>();
const registeredUserAgentPartitions = new Set<string>();

function registerUserAgentHandler(targetSession: Session, partition?: string) {
  const key = partition ?? 'default';
  if (registeredUserAgentPartitions.has(key)) return;

  targetSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const nextUserAgent = partition
      ? userAgentByPartition.get(partition)
      : currentUserAgent;

    if (nextUserAgent) {
      details.requestHeaders['User-Agent'] = nextUserAgent;
    }
    callback({ requestHeaders: details.requestHeaders });
  });
  registeredUserAgentPartitions.add(key);
}

export function setUserAgent(type: UserAgentType, partition?: string) {
  const nextUserAgent = getUserAgent(type);
  if (partition) {
    userAgentByPartition.set(partition, nextUserAgent);
    registerUserAgentHandler(session.fromPartition(partition), partition);
  } else {
    currentUserAgent = nextUserAgent;
    registerUserAgentHandler(session.defaultSession);
  }
  console.log(
    `[session.ts]: setting user agent to ${type}`,
    nextUserAgent || 'Electron default',
  );
}

export async function setProxy(proxy: ProxySetting, partition?: string) {
  const targetSession = partition
    ? session.fromPartition(partition)
    : session.defaultSession;

  await targetSession.setProxy({
    ...(proxy === 'system'
      ? { mode: 'system' as const }
      : proxy
        ? { mode: 'fixed_servers' as const, proxyRules: proxy }
        : { mode: 'direct' as const }),
    proxyBypassRules: 'localhost',
  });
  console.log(
    `[session.ts]: setting proxy ${proxy || 'direct'}`,
    partition ? `for ${partition}` : 'for default session',
  );
}

export async function applyWebPreferences(
  url: string,
  preferences: PageWebPreferences,
) {
  const partition = getWebviewPartition(url);
  setUserAgent(preferences.userAgent, partition);
  await setProxy(preferences.proxy, partition);
}

export default function sessionHandler() {
  registerUserAgentHandler(session.defaultSession);

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const headers = details.responseHeaders;
    if (!headers) {
      callback({});
      return;
    }

    if (
      !headers['Access-Control-Allow-Credentials'] &&
      !headers['access-control-allow-credentials']
    ) {
      delete headers['access-control-allow-origin'];
      delete headers['Access-Control-Allow-Origin'];
      headers['Access-Control-Allow-Origin'] = ['*'];
    }

    callback({ responseHeaders: headers });
  });
}
