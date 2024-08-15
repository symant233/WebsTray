import Icon from '@mdi/react';
import { mdiWindowClose } from '@mdi/js';

export default function CloseButton() {
  return (
    <div
      className="hover:bg-gray-200 p-1 rounded active:bg-gray-300"
      onClick={() => window.close()}
    >
      <Icon path={mdiWindowClose} size={'1rem'} horizontal vertical />
    </div>
  );
}
