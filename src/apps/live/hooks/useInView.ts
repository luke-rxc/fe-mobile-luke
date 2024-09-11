import { useRef, useCallback, useEffect, useState } from 'react';
/**
 * 구독하는 요소의 뷰포트 노출 관련 hook
 */
export const useInView = () => {
  const [inView, setInView] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const callback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        setInView(true);
      } else {
        setInView(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subscribe = (element: HTMLElement, options?: IntersectionObserverInit) => {
    if (!observer.current) {
      observer.current = new IntersectionObserver(callback, options);
      observer.current.observe(element);
    }
  };

  const unsubscribe = () => {
    if (observer.current) {
      observer.current.disconnect();
      observer.current = null;
    }
  };

  const resetInView = () => {
    setInView(false);
  };

  useEffect(() => {
    return () => {
      setInView(false);
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    inView,
    subscribe,
    unsubscribe,
    resetInView,
  };
};
