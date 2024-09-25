import type { IContentItemProps } from './ContentItem';
import MenuContext from '@client/components/common/MenuContext';
import useDataStore from '@client/hooks/useDataStore';
import ContentItem from './ContentItem';

export default function MenuContextItem({
  item,
  recent = true,
}: IContentItemProps & { recent?: boolean }) {
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

  return (
    <MenuContext context={menu}>
      <ContentItem item={item} />
    </MenuContext>
  );
}
