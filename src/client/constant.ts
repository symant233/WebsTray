import { mainWindowBounds, trayWindowBounds } from '../main-process/constant';

export { mainWindowBounds, trayWindowBounds };

export const appIconBase64 =
  'data:image/png;base64,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';
