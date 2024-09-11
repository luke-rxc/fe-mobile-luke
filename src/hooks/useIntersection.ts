import { useRef, useCallback, useEffect, useState } from 'react';
import throttle from 'lodash/throttle';

type IntersectionProps = {
  /** 스크롤 이벤트 처리 여부 */
  scrollable?: boolean;
  /** 스크롤링 delay */
  scrollDelay?: number;
};
/** @deprecated */
export const useIntersection = (props?: IntersectionProps) => {
  const scrollable = props?.scrollable || false;
  const scrollDelay = props?.scrollDelay || 100;
  const [inView, setInView] = useState(false);
  const [scrollY, setScrollY] = useState(window.scrollY);
  const observer = useRef<IntersectionObserver | null>(null);

  const handleChangeScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  const handleScroll = throttle(handleChangeScroll, scrollDelay);

  const callback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (scrollable) {
          window.addEventListener('scroll', handleScroll);
        }
      } else {
        setInView(false);
        if (scrollable) {
          window.removeEventListener('scroll', handleScroll);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subscribe = useCallback((element: HTMLElement, options?: IntersectionObserverInit) => {
    if (!observer.current) {
      observer.current = new IntersectionObserver(callback, options);
      observer.current.observe(element);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unsubscribe = useCallback(() => {
    if (observer.current) {
      observer.current.disconnect();
      observer.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    inView,
    scrollY,
    subscribe,
    unsubscribe,
  };
};
