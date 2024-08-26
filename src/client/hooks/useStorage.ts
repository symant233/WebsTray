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

  const _setter = (current: T[]) => {
    setStorageList(current);
    localStorage.setItem(key, JSON.stringify(current));
    eventManager.emit(EVENT_UPDATE, current);
  };

  const addStorageItem = useCallback(
    (value: T) => {
      const current = [value, ...storageList];
      _setter(current);
    },
    [storageList],
  );

  const removeStorageItem = useCallback(
    (value: T) => {
      const current = storageList.filter((item) => item !== value);
      _setter(current);
    },
    [storageList],
  );

  const clear = useCallback(() => {
    setStorageList([]);
    localStorage.removeItem(key);
    eventManager.emit(EVENT_UPDATE, []);
  }, []);

  return { storageList, _setter, addStorageItem, removeStorageItem, clear };
}
