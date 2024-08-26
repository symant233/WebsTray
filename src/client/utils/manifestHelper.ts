import { fetchJsonData } from '../services/api';
import { IData } from '../types';
import getHostname from './getHostname';

export type IManifest = {
  name: string;
  short_name: string;
  icons: { src: string; sizes: string }[];
};

async function manifestHelper(url: string): Promise<Partial<IData>> {
  const manifest = await fetchJsonData<IManifest>(url);

  if (!manifest || !manifest.icons) {
    return { title: manifest?.short_name || manifest?.name };
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

  if (largestIcon?.src.startsWith('/')) {
    largestIcon.src = `https://${getHostname(url)}${largestIcon.src}`;
  }

  return {
    icon: largestIcon?.src,
    title: manifest?.short_name || manifest?.name,
  };
}

export default manifestHelper;
