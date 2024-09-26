import getHostname from '@client/utils/getHostname';
import LazyImage from '@client/components/common/LazyImage';
import type { IData } from '@client/types';

export type IContentItemProps = {
  item: IData;
};

export default function ContentItem({ item }: IContentItemProps) {
  const hostname = getHostname(item.url);
  const iconURL =
    item?.icon ||
    item?.altIcon ||
    item.favicon ||
    `https://${hostname}/favicon.ico`;

  return (
    <div
      className="hover:bg-gray-100 rounded-lg flex flex-col items-center justify-center p-4 gap-2 cursor-pointer active:bg-gray-200 transition-colors"
      onClick={() => window.electron.openWindow(item.url)}
    >
      <LazyImage src={iconURL} width={64} height={64} className="rounded-lg" />
      <span className="w-20 overflow-hidden overflow-ellipsis text-nowrap whitespace-nowrap text-center">
        {item?.title || hostname}
      </span>
    </div>
  );
}
