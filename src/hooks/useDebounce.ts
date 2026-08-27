import { useCallback, useRef } from "react";

export function useDebounce<Args extends unknown[], R>(
  callback: (...args: Args) => R | Promise<R>,
  delayMs: number,
): (...args: Args) => Promise<R> {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Args) =>
      new Promise<R>((resolve) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          Promise.resolve(callback(...args)).then(resolve);
        }, delayMs);
      }),
    [callback, delayMs],
  );
}
