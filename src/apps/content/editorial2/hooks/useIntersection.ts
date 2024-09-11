import { useEffect, useRef, useState } from 'react';

export const useIntersection = ({
  options = {
    threshold: 0,
    rootMargin: '0px 0px 0px 0px',
  },
  once = false,
  onIntersection = () => {},
}: {
  options?: IntersectionObserverInit;
  /** 뷰 교차 1회만 체크 */
  once?: boolean;
  onIntersection?: (entry: IntersectionObserverEntry) => void;
}) => {
  const sectionElRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const [inView, setInView] = useState(false);

  const handleIntersectionObserver = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      setInView(entry.isIntersecting);
      onIntersection?.(entry);
      if (entry.isIntersecting && once) {
        observer.current && observer.current.disconnect();
      }
    });
  };

  const sectionRef = (el: HTMLDivElement) => {
    if (!el || sectionElRef.current) return;

    observer.current = new IntersectionObserver(handleIntersectionObserver, options);
    observer.current.observe(el);
    sectionElRef.current = el;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const handleDisconnect = () => {
    observer.current && observer.current.disconnect();
  };

  useEffect(() => {
    const obs = observer.current;
    return () => {
      obs && obs.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    sectionRef,
    sectionElRef,
    inView,
    handleDisconnect,
  };
};
