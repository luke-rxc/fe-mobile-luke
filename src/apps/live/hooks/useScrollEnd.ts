import { useState, useRef, useEffect } from 'react';

interface Props {
  element: HTMLElement | null;
  callback?: {
    scrollCb?: () => void;
    touchStartCb?: () => void;
    touchEndCb?: () => void;
    touchCancelCb?: () => void;
  };
}

export const useScrollEnd = ({ element, callback }: Props) => {
  const [scrollEnd, setScrollEnd] = useState<boolean>(false);
  const touching = useRef<boolean>(false);
  const scrollTimer = useRef<number | null>(null);

  const scrollY = element?.scrollTop || 0;

  const handleScrollEnd = () => {
    if (scrollTimer.current) {
      window.clearTimeout(scrollTimer.current);
    }

    if (!touching.current) {
      scrollTimer.current = window.setTimeout(() => {
        setScrollEnd(true);
      }, 200);
    }
    callback?.scrollCb?.();
  };

  const handleTouchStart = () => {
    touching.current = true;
    callback?.touchStartCb?.();
  };

  const handleTouchEnd = () => {
    touching.current = false;
    callback?.touchEndCb?.();
    handleScrollEnd();
  };

  const handleTouchCancel = () => {
    callback?.touchCancelCb?.();
    handleTouchEnd();
  };

  useEffect(() => {
    scrollEnd && setScrollEnd(false);
  }, [scrollEnd]);

  useEffect(() => {
    if (element) {
      element.addEventListener('scroll', handleScrollEnd);
      element.addEventListener('touchstart', handleTouchStart);
      element.addEventListener('touchend', handleTouchEnd);
      element.addEventListener('touchcancel', handleTouchCancel);
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScrollEnd);
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchend', handleTouchEnd);
        element.removeEventListener('touchcancel', handleTouchCancel);

        scrollTimer.current && window.clearTimeout(scrollTimer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element]);

  return { scrollEnd, scrollY };
};
