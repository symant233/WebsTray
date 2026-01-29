import { session } from 'electron';
import { userAgent } from './helper';

export default function sessionHandler() {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = userAgent;
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
