import Icon from '@mdi/react';
import {
  mdiArrowLeft,
  mdiConsoleLine,
  mdiPound,
  mdiRefresh,
  mdiWindowClose,
} from '@mdi/js';

type IconButtonProps = {
  onClick?: () => void;
  icon: string;
};

const IconButton = ({ onClick, icon }: IconButtonProps) => {
  return (
    <div
      className="hover:bg-gray-200 p-1 rounded active:bg-gray-300"
      onClick={onClick}
    >
      <Icon path={icon} size={'1rem'} />
    </div>
  );
};

type Props = {
  onClick?: () => void;
};

export function BackButton({ onClick }: Props) {
  return (
    <IconButton
      onClick={() => (onClick ? onClick() : history.back())}
      icon={mdiArrowLeft}
    />
  );
}

export function CloseButton() {
  return <IconButton onClick={() => window.close()} icon={mdiWindowClose} />;
}

export function HomeButton({ onClick }: Props) {
  return (
    <IconButton
      onClick={() => (onClick ? onClick() : window.location.reload())}
      icon={mdiPound}
    />
  );
}

export function RefreshButton({ onClick }: Props) {
  return (
    <IconButton
      onClick={() => (onClick ? onClick() : window.location.reload())}
      icon={mdiRefresh}
    />
  );
}

export function DevtoolButton({ onClick }: Props) {
  return <IconButton onClick={onClick} icon={mdiConsoleLine} />;
}
