import useStorage from '../hooks/useStorage';
import { IData, STORAGE_FAVORITE, STORAGE_RECENT } from '../types';
import getHostname from '../utils/getHostname';

type IContentItemProps = {
  item: IData;
};

function ContentItem({ item }: IContentItemProps) {
  const hostname = getHostname(item.url);

  return (
    <div
      className="hover:bg-gray-200 rounded-lg flex flex-col items-center justify-center p-4 gap-2 cursor-pointer"
      onClick={() => window.electron.openWindow(item.url)}
    >
      <img
        src={item?.icon || `https://${hostname}/favicon.ico`}
        width={64}
        height={64}
      />
      <span className="w-20 overflow-hidden overflow-ellipsis text-nowrap whitespace-nowrap">
        {item?.title || hostname}
      </span>
    </div>
  );
}

export default function Content() {
  const { storageList } = useStorage<IData>(STORAGE_RECENT);
  const { storageList: favoriteList } = useStorage<IData>(STORAGE_FAVORITE);

  return (
    <div className="w-full h-full p-6 select-none gap-2">
      <div className="font-bold text-lg mb-2">Recent</div>
      <div className="flex flex-row flex-wrap">
        {storageList.length ? (
          storageList.map((i) => {
            return <ContentItem item={i} key={i.url} />;
          })
        ) : (
          <p className="font-bold text-gray-500 pb-2">
            No recently accessed web apps.
          </p>
        )}
      </div>

      <div className="font-bold text-lg my-2">Favorite</div>
      <div className="flex flex-row flex-wrap">
        {favoriteList.length ? (
          favoriteList.map((i) => {
            return <ContentItem item={i} key={i.url} />;
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
