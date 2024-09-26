import { useEffect, useState, useRef } from 'react';

interface Props {
  children: React.ReactNode;
  context: { text: string; cb: () => void }[];
}

export default function MenuContext({ children, context }: Props) {
  const insideRef = useRef<HTMLDivElement>(null);
  const [showContext, setShowContext] = useState(false);
  const [point, setPoint] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        insideRef.current &&
        insideRef.current?.contains(e.target as HTMLElement)
      )
        return;
      setShowContext(false);
    };
    // click outside
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  });

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        let pageX = e.pageX;
        let pageY = e.pageY;
        if (window.innerWidth - 155 < pageX) pageX -= 155;
        if (window.innerHeight - 62 < pageY) pageY -= 62;
        setPoint({ x: pageX, y: pageY });
        setShowContext(true);
      }}
    >
      {children}
      {showContext && (
        <div
          className="fixed bg-white rounded-lg p-2 shadow-lg border-solid border z-50"
          style={{ top: point.y, left: point.x }}
          ref={insideRef}
        >
          {context &&
            context.map((i) => {
              return (
                <div
                  onClick={() => {
                    setShowContext(false);
                    i.cb();
                  }}
                  className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg text-sm w-32 cursor-pointer transition-colors"
                  key={i.text}
                >
                  {i.text}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
