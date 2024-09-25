import useDataStore from '@client/hooks/useDataStore';
import MenuContextItem from './MenuContextItem';

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
