import { useEffect, useRef, useState } from 'react';
import CloseButton from './common/CloseButton';

type Props = {
  url: string;
};

// type IIframeInfo = {
//   title?: string;
//   icon?: string;
// };

export default function TrayContent({ url }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // const [iframeInfo, setIframeInfo] = useState<IIframeInfo>({});

  useEffect(() => {
    console.log(iframeRef.current.contentDocument.title);
  }, [iframeRef.current]);

  return (
    <div className="w-screen h-screen p-1 pb-3">
      <div className="w-full h-full bg-gray-100 shadow p-2 pb-8 rounded-lg relative after:content-[''] after:absolute after:-bottom-[12px] after:left-1/2 after:-translate-x-1/2 after:border-x-[12px] after:border-transparent after:border-t-[12px] after:border-t-gray-100">
        <iframe
          ref={iframeRef}
          src={url}
          className="w-full h-full rounded-lg border border-solid"
        ></iframe>
        <div className="select-none pt-1 text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis w-full flex flex-row justify-between">
          <span className="w-64">
            {iframeRef.current?.contentDocument?.title || url}
          </span>
          <CloseButton />
        </div>
      </div>
    </div>
  );
}
