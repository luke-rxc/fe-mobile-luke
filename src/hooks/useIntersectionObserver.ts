import { useCallback, useEffect, useRef, useState } from 'react';
import { useDeepCompareEffect } from 'react-use';

type Result<T> = [(node: T | null) => void, () => void];

export function useIntersectionObserver<T extends HTMLElement>(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit,
): Result<T> {
  const [target, setTarget] = useState<T | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const subscribe = useCallback(
    (node: T | null) => {
      if (node) {
        observer.current?.observe(node);
        setTarget(node);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [observer.current],
  );

  const unsubscribe = useCallback(() => {
    if (observer.current) {
      observer.current.disconnect();
      observer.current = null;
      setTarget(null);
    }
  }, []);

  useEffect(() => {
    return () => {
      unsubscribe();
    };
  });

  useDeepCompareEffect(() => {
    observer.current = new IntersectionObserver(callback, options);
    subscribe(target);

    return () => {
      observer.current?.disconnect();
      observer.current = null;
    };
  }, [callback, options]);

  return [subscribe, unsubscribe];
}
