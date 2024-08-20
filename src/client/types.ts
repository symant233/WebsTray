export type IData = {
  url: string;
  title?: string;
  icon?: string; // use `${url}/favicon.ico` instead
};

export const STORAGE_RECENT = 'wt-recent';
export const STORAGE_FAVORITE = 'wt-favorite';
