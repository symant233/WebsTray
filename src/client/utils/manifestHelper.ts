import type { WebviewTag } from 'electron';
import type { IData } from '@client/types';
import getHostname from './getHostname';

export type IManifest = {
  name?: string;
  short_name?: string;
  icons?: { src: string; sizes?: string; type?: string }[];
};

type IconCandidate = {
  src: string;
  size: number;
};

function parseIconSize(sizes?: string): number {
  if (!sizes || sizes === 'any') return 0;
  const match = sizes.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function resolveURL(src: string, baseURL: string): string {
  try {
    return new URL(src, baseURL).href;
  } catch {
    return src;
  }
}

/**
 * Fetch a URL inside the webview's context and rasterize to PNG data URL.
 * Critical: this uses the webview's partition session (page proxy, UA, cookies),
 * which is required for sites that are only reachable via per-page proxy.
 */
async function fetchAsPngDataURL(
  webview: WebviewTag,
  url: string,
): Promise<string | null> {
  try {
    const script = `
      (function() {
        return (async function() {
          try {
            var response = await fetch(${JSON.stringify(url)}, { credentials: 'include' });
            if (!response.ok) return null;
            var blob = await response.blob();
            var dataURL = await new Promise(function(resolve, reject) {
              var reader = new FileReader();
              reader.onload = function() { resolve(reader.result); };
              reader.onerror = function() { reject(reader.error); };
              reader.readAsDataURL(blob);
            });
            // Rasterize to PNG via canvas so callers (including nativeImage on
            // the main process) get a uniformly-supported format regardless of
            // whether the source was webp/svg/ico/jpeg/png.
            var img = new Image();
            await new Promise(function(resolve, reject) {
              img.onload = resolve;
              img.onerror = reject;
              img.src = dataURL;
            });
            var w = img.naturalWidth || img.width || 256;
            var h = img.naturalHeight || img.height || 256;
            var canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            var ctx = canvas.getContext('2d');
            if (!ctx) return null;
            ctx.drawImage(img, 0, 0, w, h);
            return canvas.toDataURL('image/png');
          } catch (e) {
            return null;
          }
        })();
      })()
    `;
    const result = await webview.executeJavaScript(script);
    return typeof result === 'string' && result.startsWith('data:')
      ? result
      : null;
  } catch {
    return null;
  }
}

async function collectIconsFromHTML(
  webview: WebviewTag,
): Promise<IconCandidate[]> {
  try {
    const linkIcons: { href: string; sizes: string; rel: string }[] =
      await webview.executeJavaScript(`
        (function() {
          var els = document.querySelectorAll(
            'link[rel~="icon"], link[rel*="icon"], link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]'
          );
          return Array.from(els).map(function(el) {
            return {
              href: el.href || '',
              sizes: el.getAttribute('sizes') || '',
              rel: el.rel || ''
            };
          });
        })()
      `);

    const icons: IconCandidate[] = [];
    for (const link of linkIcons) {
      if (!link.href) continue;
      const size = parseIconSize(link.sizes);
      const effectiveSize =
        size || (link.rel.includes('apple-touch-icon') ? 180 : 32);
      icons.push({ src: link.href, size: effectiveSize });
    }
    return icons;
  } catch {
    return [];
  }
}

async function collectIconsFromManifest(
  webview: WebviewTag,
  manifestURL: string,
): Promise<{ icons: IconCandidate[]; title?: string }> {
  try {
    // Fetch manifest in webview context so it picks up the page's session
    // (per-page proxy + cookies), which some sites require.
    const result: { json: IManifest | null } = await webview.executeJavaScript(`
      (function() {
        return fetch(${JSON.stringify(manifestURL)}, { credentials: 'include' })
          .then(function(r) { return r.ok ? r.json() : null; })
          .then(function(j) { return { json: j }; })
          .catch(function() { return { json: null }; });
      })()
    `);

    const manifest = result?.json;
    if (!manifest) return { icons: [] };

    const title = manifest.short_name || manifest.name;
    if (!manifest.icons || manifest.icons.length === 0) {
      return { icons: [], title };
    }

    const icons: IconCandidate[] = manifest.icons.map((icon) => ({
      src: resolveURL(icon.src, manifestURL),
      size: parseIconSize(icon.sizes),
    }));

    return { icons, title };
  } catch {
    return { icons: [] };
  }
}

export async function resolvePageIcons(
  webview: WebviewTag,
  manifestURL: string | null,
): Promise<Partial<IData>> {
  const candidates: IconCandidate[] = [];
  let title: string | undefined;

  // 1. HTML <link> icons
  const htmlIcons = await collectIconsFromHTML(webview);
  candidates.push(...htmlIcons);

  // 2. Manifest icons (fetched via webview session)
  if (manifestURL) {
    const manifestResult = await collectIconsFromManifest(webview, manifestURL);
    candidates.push(...manifestResult.icons);
    title = manifestResult.title;
  }

  // 3. Hostname-based fallback favicon
  const pageURL = webview.getURL();
  const hostname = getHostname(pageURL);
  const fallbackFavicon = hostname
    ? `https://${hostname}/favicon.ico`
    : undefined;

  if (candidates.length === 0 && fallbackFavicon) {
    candidates.push({ src: fallbackFavicon, size: 16 });
  }

  // Deduplicate by src
  const seen = new Set<string>();
  const unique = candidates.filter((c) => {
    if (seen.has(c.src)) return false;
    seen.add(c.src);
    return true;
  });

  // Sort descending by size (largest first); ties broken by insertion order
  unique.sort((a, b) => b.size - a.size);

  const largestCandidate = unique[0];
  const smallestCandidate =
    unique.length > 1 ? unique[unique.length - 1] : undefined;

  // Inline icons via webview's session so they survive per-page proxy/UA
  // and so the main window can display them without another network call.
  const [iconData, altIconData] = await Promise.all([
    largestCandidate
      ? fetchAsPngDataURL(webview, largestCandidate.src)
      : Promise.resolve(null),
    smallestCandidate
      ? fetchAsPngDataURL(webview, smallestCandidate.src)
      : Promise.resolve(null),
  ]);

  return {
    icon: iconData ?? largestCandidate?.src,
    altIcon: altIconData ?? smallestCandidate?.src,
    favicon: fallbackFavicon,
    title,
  };
}
