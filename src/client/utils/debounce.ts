/* eslint-disable @typescript-eslint/no-explicit-any */
export default function debounce<F extends (...args: any[]) => void>(
  func: F,
  wait: number,
) {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    const context = this as ThisParameterType<F>;

    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}
