import { IData } from '../types';

export type IManifest = {
  name: string;
  short_name: string;
  icons: { src: string; sizes: string }[];
};

function manifestHelper(manifest: IManifest): Partial<IData> {
  if (!manifest || !manifest.icons) {
    return undefined;
  }

  let largestIcon: { src: string; sizes: string } | undefined = undefined;
  for (const icon of manifest.icons) {
    const [width, height] = icon.sizes.split('x').map(Number);
    const area = width * height;

    if (
      !largestIcon ||
      area >
        parseInt(largestIcon.sizes.split('x')[0]) *
          parseInt(largestIcon.sizes.split('x')[1])
    ) {
      largestIcon = icon;
    }
  }

  return { icon: largestIcon?.src, title: manifest.short_name };
}

export default manifestHelper;
