import { useEffect, useState } from 'react';
import { appIconBase64 } from '@client/constant';

type Props = {
  src: string;
  width?: number;
  height?: number;
  [key: string]: unknown;
};

export default function LazyImage({
  src,
  width = 64,
  height = 64,
  ...props
}: Props) {
  const [source, setSource] = useState(appIconBase64);

  useEffect(() => {
    let cancelled = false;
    const onlineImg = document.createElement('img');
    onlineImg.src = src;

    onlineImg.onload = () => {
      if (!cancelled) setSource(src);
    };
    onlineImg.onerror = () => {
      if (!cancelled) setSource(appIconBase64);
    };

    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <img
      width={width}
      height={height}
      src={source}
      {...props}
      draggable="false"
    />
  );
}
