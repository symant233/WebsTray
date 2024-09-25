import useDataStore from '../hooks/useDataStore';
import type { IData } from '../types';
import getHostname from '../utils/getHostname';
import LazyImage from './common/LazyImage';
import MenuContext from './common/MenuContext';

type IContentItemProps = {
  item: IData;
};

function ContentItem({ item }: IContentItemProps) {
  const hostname = getHostname(item.url);
  const iconURL =
    item?.icon ||
    item?.altIcon ||
    item.favicon ||
    `https://${hostname}/favicon.ico`;

  return (
    <div
      className="hover:bg-gray-100 rounded-lg flex flex-col items-center justify-center p-4 gap-2 cursor-pointer active:bg-gray-200"
      onClick={() => window.electron.openWindow(item.url)}
    >
      <LazyImage src={iconURL} width={64} height={64} className="rounded-lg" />
      <span className="w-20 overflow-hidden overflow-ellipsis text-nowrap whitespace-nowrap text-center">
        {item?.title || hostname}
      </span>
    </div>
  );
}

function MenuContextItem({
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

export default function Content() {
  const recent = useDataStore((state) => state.recent);
  const favorite = useDataStore((state) => state.favorite);

  return (
    <div className="w-full h-full p-6 select-none gap-2">
      <div className="font-bold text-lg my-2">Favorite</div>
      <div className="flex flex-row flex-wrap gap-1">
        {favorite.length ? (
          favorite.map((i) => {
            return <MenuContextItem item={i} key={i.url} recent={false} />;
          })
        ) : (
          <p className="font-bold text-gray-500 pb-4 block">
            No favorited web apps found.
          </p>
        )}
      </div>

      <div className="font-bold text-lg my-2">Recent</div>
      <div className="flex flex-row flex-wrap gap-1">
        {recent.length ? (
          recent.map((i) => {
            return <MenuContextItem item={i} key={i.url} recent={true} />;
          })
        ) : (
          <p className="font-bold text-gray-500 pb-4 block">
            No recently accessed web apps.
          </p>
        )}
      </div>
    </div>
  );
}
