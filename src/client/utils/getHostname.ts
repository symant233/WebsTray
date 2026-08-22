export default function getHostname(url: string): string | undefined {
  try {
    const { hostname } = new URL(url);
    return hostname;
  } catch {
    return undefined;
  }
}
