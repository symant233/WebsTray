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
      className="hover:bg-gray-200 rounded-lg flex flex-col items-center justify-center p-4 gap-2 cursor-pointer"
      onClick={() => window.electron.openWindow(item.url)}
    >
      <LazyImage src={iconURL} width={64} height={64} className="rounded-lg" />
      <span className="w-20 overflow-hidden overflow-ellipsis text-nowrap whitespace-nowrap text-center">
        {item?.title || hostname}
      </span>
    </div>
  );
}

function MenuContextItem({ item }: IContentItemProps) {
  const removeRecent = useDataStore((state) => state.removeRecent);

  const menu = [
    {
      text: '删除',
      cb: () => removeRecent(item),
    },
  ];

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
      <div className="font-bold text-lg mb-2">Recent</div>
      <div className="flex flex-row flex-wrap gap-1">
        {recent.length ? (
          recent.map((i) => {
            return <MenuContextItem item={i} key={i.url} />;
          })
        ) : (
          <p className="font-bold text-gray-500 pb-2">
            No recently accessed web apps.
          </p>
        )}
      </div>

      <div className="font-bold text-lg my-2">Favorite</div>
      <div className="flex flex-row flex-wrap gap-1">
        {favorite.length ? (
          favorite.map((i) => {
            return <MenuContextItem item={i} key={i.url} />;
          })
        ) : (
          <p className="font-bold text-gray-500">
            No favorited web apps found.
          </p>
        )}
      </div>
    </div>
  );
}
