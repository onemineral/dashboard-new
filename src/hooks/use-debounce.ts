import { useEffect, useRef } from "react";

export function useDebounce<T extends (...args: any[]) => void>(
  fn: T,
  deps: any[],
  delay = 500
) {
  const timeout = useRef<number | undefined>(undefined);

  useEffect(() => {
    window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => {
      fn();
    }, delay);

    return () => {
      window.clearTimeout(timeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
}