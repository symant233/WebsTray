import { useCallback, useEffect, useState } from 'react';
import eventManager from '../utils/eventManager';

const PREFIX = 'update_storage';

export default function useStorage<T>(key: string) {
  const EVENT_UPDATE = PREFIX + key;
  const [storageList, setStorageList] = useState<T[]>([]);

  useEffect(() => {
    const rs = localStorage.getItem(key);
    if (rs) setStorageList(JSON.parse(rs));

    const handleUpdate = (newData: T[]) => {
      setStorageList(newData);
    };

    eventManager.on(EVENT_UPDATE, handleUpdate);

    return () => {
      eventManager.off(EVENT_UPDATE, handleUpdate);
    };
  }, []);

  const addStorageItem = useCallback(
    (value: T) => {
      const current = [value, ...storageList];
      setStorageList(current);
      localStorage.setItem(key, JSON.stringify(current));
      eventManager.emit(EVENT_UPDATE, current);
    },
    [storageList],
  );

  const clear = useCallback(() => {
    setStorageList([]);
    localStorage.removeItem(key);
    eventManager.emit(EVENT_UPDATE, []);
  }, []);

  return { storageList, addStorageItem, clear };
}
