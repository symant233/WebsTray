import type { IData } from '@client/types';
import MenuContext from '@client/components/common/MenuContext';
import useDataStore from '@client/hooks/useDataStore';

type Props = {
  item: IData;
  recent?: boolean;
  children: React.ReactNode;
};

const MenuContextItem: React.FC<Props> = ({
  item,
  children,
  recent = true,
}) => {
  const removeRecent = useDataStore((state) => state.removeRecent);
  const addFavorite = useDataStore((state) => state.addFavorite);
  const removeFavorite = useDataStore((state) => state.removeFavorite);

  const menu = [
    {
      text: 'Delete',
      cb: () => (recent ? removeRecent(item) : removeFavorite(item)),
    },
  ];

  if (recent) menu.unshift({ text: 'Favorite', cb: () => addFavorite(item) });

  return <MenuContext context={menu}>{children}</MenuContext>;
};

export default MenuContextItem;
