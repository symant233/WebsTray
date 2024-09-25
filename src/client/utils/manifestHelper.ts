import { fetchJsonData } from '@client/services/api';
import { IData } from '@client/types';
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
  let smallestIcon: { src: string; sizes: string } | undefined = undefined;

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

    if (
      !smallestIcon ||
      area <
        parseInt(smallestIcon.sizes.split('x')[0]) *
          parseInt(smallestIcon.sizes.split('x')[1])
    ) {
      smallestIcon = icon;
    }
  }

  if (largestIcon?.src.startsWith('/')) {
    largestIcon.src = `https://${getHostname(url)}${largestIcon.src}`;
  }

  if (smallestIcon?.src.startsWith('/')) {
    smallestIcon.src = `https://${getHostname(url)}${smallestIcon.src}`;
  }

  return {
    icon: largestIcon?.src,
    altIcon: smallestIcon?.src,
    title: manifest?.short_name || manifest?.name,
  };
}

export default manifestHelper;
