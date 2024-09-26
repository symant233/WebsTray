import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IData } from '@client/types';

type IConfig = {
  proxy?: 'system' | string;
};

interface State {
  recent: IData[];
  favorite: IData[];
  getData: (url: string) => IData;
  addRecent: (value: IData) => void;
  addFavorite: (value: IData) => void;
  updater: (url: string, obj: Partial<IData>) => void;
  removeRecent: (value: IData) => void;
  removeFavorite: (value: IData) => void;
  config: IConfig;
}

const useDataStore = create<State>()(
  persist(
    (set, get) => ({
      recent: [],
      favorite: [],
      getData: (url: string) => {
        return (
          get().favorite.find((data) => data.url === url) ||
          get().recent.find((data) => data.url === url)
        );
      },
      addRecent: (value: IData) =>
        set((state) => ({ recent: [...state.recent, value] })),
      addFavorite: (value: IData) =>
        set((state) => ({
          favorite: [...state.favorite, value],
          recent: state.recent.filter((r) => {
            return r !== value;
          }), // addFavorite removes recent
        })),
      updater: (url: string, obj: Partial<IData>) =>
        set((state) => ({
          recent: state.recent.map((r) => {
            if (url === r.url) return { ...r, ...obj };
            return r;
          }),
          favorite: state.favorite.map((r) => {
            if (url === r.url) return { ...r, ...obj };
            return r;
          }),
        })),
      removeRecent: (value: IData) => {
        set((state) => ({
          recent: state.recent.filter((r) => {
            return r !== value;
          }),
        }));
      },
      removeFavorite: (value: IData) => {
        set((state) => ({
          favorite: state.favorite.filter((r) => {
            return r !== value;
          }),
        }));
      },
      config: {},
      setConfig: (value: IConfig) => {
        set((_) => ({ config: value }));
      },
    }),
    {
      name: 'webs-tray-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        recent: state.recent,
        favorite: state.favorite,
      }),
    },
  ),
);

export default useDataStore;
