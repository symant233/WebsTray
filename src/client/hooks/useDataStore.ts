import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IData, ProxySetting, ThemeMode, UserAgentType } from '@client/types';
import { DEFAULT_PROXY, DEFAULT_USER_AGENT } from '@/shared/webPreferences';

export type IConfig = {
  proxy: ProxySetting;
  theme: ThemeMode;
  userAgent: UserAgentType;
};

const initialConfig: IConfig = {
  proxy: DEFAULT_PROXY,
  theme: 'system',
  userAgent: DEFAULT_USER_AGENT,
};

interface State {
  recent: IData[];
  favorite: IData[];
  getData: (url: string) => IData | undefined;
  getAllData: () => IData[];
  addRecent: (value: IData) => void;
  addFavorite: (value: IData) => void;
  updater: (url: string, obj: Partial<IData>) => void;
  removeRecent: (value: IData) => void;
  removeFavorite: (value: IData) => void;
  config: IConfig;
  setConfig: (value: IConfig) => void;
}

const STORAGE_KEY = 'webs-tray-storage';

const useDataStore = create<State>()(
  persist(
    (set, get) => ({
      recent: [] as IData[],
      favorite: [] as IData[],
      getData: (url: string) => {
        return (
          get().favorite.find((data) => data.url === url) ||
          get().recent.find((data) => data.url === url)
        );
      },
      getAllData: () => {
        return [...get().favorite, ...get().recent];
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
      config: initialConfig,
      setConfig: (value: IConfig) => {
        set((_) => ({ config: value }));
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        recent: state.recent,
        favorite: state.favorite,
        config: state.config,
      }),
    },
  ),
);

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return;
    void useDataStore.persist.rehydrate();
  });
}

export default useDataStore;
