import { session } from 'electron';
import { userAgent } from './helper';

export default function sessionHandler() {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = userAgent;
    callback({ requestHeaders: details.requestHeaders });
  });
}
