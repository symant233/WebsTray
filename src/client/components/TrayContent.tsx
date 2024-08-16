import { useEffect, useRef } from 'react';
import CloseButton from './common/CloseButton';
import BackButton from './common/BackButton';
import RefreshButton from './common/RefreshButton';

type Props = {
  url: string;
};

export default function TrayContent({ url }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    iframeRef.current.contentWindow.open = (
      url?: string | URL,
      _target?: string,
      _features?: string,
    ): Window => {
      iframeRef.current.src = url as string;
      return iframeRef.current.contentWindow;
    };
  }, [iframeRef.current]);

  return (
    <div className="w-screen h-screen p-1 pb-3">
      <div className="w-full h-full bg-gray-100 shadow p-2 pb-8 rounded-lg relative after:content-[''] after:absolute after:-bottom-[12px] after:left-1/2 after:-translate-x-1/2 after:border-x-[12px] after:border-transparent after:border-t-[12px] after:border-t-gray-100">
        <iframe
          ref={iframeRef}
          src={url}
          className="w-full h-full rounded-lg border border-solid shadow"
        ></iframe>
        <div className="select-none pt-1 text-sm text-gray-600 whitespace-nowrap w-full flex flex-row items-center">
          <BackButton />
          <span className="overflow-hidden text-ellipsis w-64">
            {iframeRef.current?.contentDocument?.title || url}
          </span>
          <div className="flex-1"></div>
          <RefreshButton />
          <CloseButton />
        </div>
      </div>
    </div>
  );
}
