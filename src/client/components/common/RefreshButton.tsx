import Icon from '@mdi/react';
import { mdiRefresh } from '@mdi/js';

export default function CloseButton() {
  return (
    <div
      className="hover:bg-gray-200 p-1 rounded active:bg-gray-300"
      onClick={() => window.location.reload()}
    >
      <Icon path={mdiRefresh} size={'1rem'} />
    </div>
  );
}
