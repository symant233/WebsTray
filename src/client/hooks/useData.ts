import { useCallback } from 'react';
import { IData, STORAGE_RECENT } from '../types';
import useStorage from './useStorage';

export default function useData() {
  const { storageList, addStorageItem, _setter } =
    useStorage<IData>(STORAGE_RECENT);

  const updateStorageItem = useCallback(
    (url: string, obj: Partial<IData>) => {
      console.log(obj);
      const current = storageList.map((i) => {
        if (i.url === url) return { ...i, ...obj };
        return i;
      });
      _setter(current);
    },
    [storageList],
  );

  return { storageList, addStorageItem, updateStorageItem };
}
