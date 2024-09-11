import { useEffect, useState, RefObject } from 'react';
import { useIntersection } from '@hooks/useIntersection';
import type { ScrollTriggerModel } from '../models';
import { getOffsetTop } from '../utils';

/**
 * 화면 뷰 내에 요소ref(top,left 기준)가 특정 % 위치에 도달시 이벤트 처리
 * @param ref
 * @param onTrigger
 * @param options
 * @returns
 */
export const useScrollTrigger = (
  elRef: RefObject<HTMLElement>,
  onTrigger: (isAttached: boolean) => void,
  options?: ScrollTriggerModel,
) => {
  const { inView, scrollY, subscribe, unsubscribe } = useIntersection({ scrollable: true });
  const { viewRatio = 1, isToggle = false } = options ?? {
    viewRatio: 1,
    isToggle: false,
  };
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: document.body.offsetWidth,
    height: window.innerHeight,
  });
  const [currentRatio, setCurrentRatio] = useState(0);
  const handleResize = () => {
    setWindowSize({
      width: document.body.offsetWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    if (elRef.current) {
      subscribe(elRef.current);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elRef]);

  useEffect(() => {
    if (inView) {
      const { current } = elRef;
      if (current) {
        // 영역 안으로 들어올때, 실제 스크롤 위치 기반으로 화면뷰에 대한 퍼센테이지 위치 계산
        const offsetTop = getOffsetTop(current).top;
        // let ratio = Math.round(((offsetTop - scrollY) / windowSize.height) * 100) / 100; // 화면기준 요소가 위치하고 있는 값. 소수 둘째자리(0: 상단 ~1: 하단)
        let ratio = (offsetTop - scrollY) / windowSize.height; // 화면기준 요소가 위치하고 있는 값. 소수 둘째자리(0: 상단 ~1: 하단)
        ratio = Math.min(Math.max(ratio, 0), 1); // 0~1 사이값으로 고정
        setCurrentRatio(ratio);
        if (Array.isArray(viewRatio) && viewRatio.length === 2) {
          if (viewRatio[0] <= ratio && ratio <= viewRatio[1]) {
            onTrigger(true);
          } else {
            if (!isToggle) {
              return;
            }
            onTrigger(false);
          }
        } else if (!Array.isArray(viewRatio) && ratio <= viewRatio) {
          onTrigger(true);
        } else {
          if (!isToggle) {
            return;
          }
          onTrigger(false);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, scrollY]);

  return {
    viewRatio: currentRatio,
    unsubscribe,
  };
};
