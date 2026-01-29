import { useEffect, type DependencyList } from 'react';

export default function useHotKey(
  key: string,
  cb: () => void,
  deps: DependencyList = [],
) {
  useEffect(() => {
    if (!key || !cb) return;
    const listener = (event: KeyboardEvent) => {
      if (event.key === key) cb();
    };

    document.addEventListener('keyup', listener);
    return () => document.removeEventListener('keyup', listener);
  }, [...deps]);
}

export function useHotKeyContainer(
  key: string,
  container: HTMLElement | null,
  cb: () => void,
  deps: DependencyList = [],
) {
  useEffect(() => {
    if (!key || !container || !cb) return;
    const listener = (event: KeyboardEvent) => {
      if (event.key === key) cb();
    };

    container.addEventListener('keyup', listener);
    return () => container.removeEventListener('keyup', listener);
  }, [container, ...deps]);
}
