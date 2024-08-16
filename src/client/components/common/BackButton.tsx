import Icon from '@mdi/react';
import { mdiArrowLeft } from '@mdi/js';

export default function CloseButton() {
  return (
    <div
      className="hover:bg-gray-200 p-1 rounded active:bg-gray-300"
      onClick={() => history.back()}
    >
      <Icon path={mdiArrowLeft} size={'1rem'} />
    </div>
  );
}
