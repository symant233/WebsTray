export default function getHostname(url: string): string | null {
  try {
    const { hostname } = new URL(url);
    return hostname;
  } catch (_) {
    return null;
  }
}
