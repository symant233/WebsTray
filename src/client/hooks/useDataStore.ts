import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IData } from '../types';

interface State {
  recent: IData[];
  favorite: IData[];
  addRecent: (value: IData) => void;
  clearRecent: () => void;
  updateRecent: (url: string, obj: Partial<IData>) => void;
}

const useDataStore = create<State>()(
  persist(
    (set) => ({
      recent: [],
      favorite: [],
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
