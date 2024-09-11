import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { MutableRefObject, useEffect, useRef } from 'react';

export const useInputBlur = <T extends HTMLElement>() => {
  const { isApp, isIOSSafari } = useDeviceDetect();
  const elRef = useRef<T | null>();

  const isAllowBlurTargets = (el: HTMLInputElement) => {
    return el?.tagName.toLowerCase() === 'input' || el?.tagName.toLowerCase() === 'textarea' || el?.isContentEditable;
  };

  useEffect(() => {
    if (isApp || !isIOSSafari) {
      return () => {};
    }

    function handleTouchMove() {
      const { activeElement: el } = document;

      if (isAllowBlurTargets(el as HTMLInputElement)) {
        (el as HTMLInputElement).blur?.();
      }
    }
    const el = elRef.current;

    el?.addEventListener('touchmove', handleTouchMove);

    return () => {
      el?.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isApp, isIOSSafari]);

  return elRef as MutableRefObject<T>;
};
