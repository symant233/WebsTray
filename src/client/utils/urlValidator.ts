export const urlValidator = (url: string): string | null => {
  const regex = new RegExp(
    '^(https?:\\/\\/)?' + // 可选的协议头
      '([a-zA-Z0-9-]+\\.)+' + // 至少一个域名部分，且包含'.'
      '[a-zA-Z]{2,}', // 顶级域名部分，至少2个字符
  );
  if (regex.test(url)) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    return url;
  }
  return null;
};
