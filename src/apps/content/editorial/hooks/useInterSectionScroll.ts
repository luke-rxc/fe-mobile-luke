import { useRef, useCallback, useEffect, useState } from 'react';
import throttle from 'lodash/throttle';
/**
 * 뷰포트 교차 구독하여 스크롤 이벤트 처리
 * @returns
 */
/** @deprecated */
export const useInterSectionScroll = () => {
  const [inView, setInView] = useState(false);
  const [scrollY, setScrollY] = useState(window.pageYOffset);
  const observer = useRef<IntersectionObserver | null>(null);

  const callback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        setInView(true);
        window.addEventListener('scroll', throttledScroll);
      } else {
        setInView(false);
        window.removeEventListener('scroll', throttledScroll);
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
    window.removeEventListener('scroll', changeScroll);
  };

  const changeScroll = useCallback(() => {
    setScrollY(window.pageYOffset);
  }, []);

  const throttledScroll = throttle(changeScroll, 100);

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
