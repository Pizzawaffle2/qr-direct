// src/hooks/use-element-size.ts
import { useState, useEffect, useRef, useCallback } from 'react';

interface Size {
  width: number | undefined;
  height: number | undefined;
}

export const useElementSize = (): [Size, (node: HTMLElement | null) => void] => {
  const [size, setSize] = useState<Size>({
    width: undefined,
    height: undefined,
  });

  const ref = useRef<HTMLElement | null>(null);

  const resizeObserver = useRef<ResizeObserver | null>(
    typeof window === 'undefined'
      ? null
      : new ResizeObserver((entries) => {
          if (!Array.isArray(entries)) {
            return;
          }

          // Since we only observe the one element, we don't need to loop over the array
          if (!entries.length) {
            return;
          }

          const entry = entries[0];

          setSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        })
  );

  const setRef = useCallback((node: HTMLElement | null) => {
    if (ref.current) {
      resizeObserver.current?.unobserve(ref.current);
    }

    if (node) {
      resizeObserver.current?.observe(node);
    }

    ref.current = node;
  }, []);

  useEffect(() => {
    return () => {
      if (ref.current) {
        resizeObserver.current?.unobserve(ref.current);
      }

      resizeObserver.current?.disconnect();
    };
  }, []);

  return [size, setRef];
};
