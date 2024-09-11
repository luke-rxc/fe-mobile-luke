/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

/**
 * IntersectionObserver와 document visibilitychange 이벤트를 통해
 * 특정 타겟이 화면에 보여지고 있는지 체크하기 위한 Hook
 */
export const useInView = <T extends HTMLElement = HTMLElement>(target: React.RefObject<T>): boolean => {
  const [inView, setInViewState] = useState<{ document: boolean; observer: boolean }>({
    document: !document.hidden,
    observer: false,
  });

  /**
   * IntersectionObserver
   */
  useEffect(() => {
    let observer: IntersectionObserver;

    const handleIntersectionObserver = ([entry]: IntersectionObserverEntry[]) => {
      setInViewState((prev) => ({ ...prev, observer: entry.isIntersecting }));
    };

    if (target.current) {
      observer = new IntersectionObserver(handleIntersectionObserver, { threshold: 0 });
      observer.observe(target.current);
    }

    return () => observer && observer.disconnect();
  }, [target.current]);

  /**
   * document visibilitychange
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      setInViewState((prev) => ({ ...prev, document: !document.hidden }));
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return inView.document && inView.observer;
};
