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
    const onlineImg = document.createElement('img');
    onlineImg.src = src;

    onlineImg.onload = () => {
      setSource(src);
    };
  }, []);

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
