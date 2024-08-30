import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IData } from '../types';

interface State {
  recent: IData[];
  favorite: IData[];
  getRecent: (url: string) => IData;
  addRecent: (value: IData) => void;
  clearRecent: () => void;
  updateRecent: (url: string, obj: Partial<IData>) => void;
  removeRecent: (value: IData) => void;
}

const useDataStore = create<State>()(
  persist(
    (set, get) => ({
      recent: [],
      favorite: [],
      getRecent: (url: string) => {
        return get().recent.find((data) => data.url === url);
      },
      addRecent: (value: IData) =>
        set((state) => ({ recent: [...state.recent, value] })),
      clearRecent: () => set({ recent: [] }),
      updateRecent: (url: string, obj: Partial<IData>) =>
        set((state) => ({
          recent: state.recent.map((r) => {
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
