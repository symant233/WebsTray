import { session } from 'electron';
import { getUserAgent, type UserAgentType } from './helper';

let currentUserAgent: string | null = null;

export function setUserAgent(type: UserAgentType) {
  currentUserAgent = getUserAgent(type);
  console.log(
    `[session.ts]: setting user agent to ${type}`,
    currentUserAgent || 'Electron default',
  );
}

export default function sessionHandler() {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    if (currentUserAgent) {
      details.requestHeaders['User-Agent'] = currentUserAgent;
    }
    callback({ requestHeaders: details.requestHeaders });
  });

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
