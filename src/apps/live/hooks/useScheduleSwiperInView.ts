import { useRef, useEffect } from 'react';
import { useSwiper } from 'swiper/react/swiper-react';
import { useInView } from './useInView';

interface Props {
  opened: boolean;
}

/**
 * 편성표 스와이퍼 In View 처리 hook
 */
export const useScheduleSwiperInView = ({ opened }: Props) => {
  const swiper = useSwiper();
  const wrapperRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const { inView, subscribe, unsubscribe, resetInView } = useInView();

  useEffect(() => {
    if (wrapperRef.current) {
      subscribe(wrapperRef.current, { threshold: 1.0 });
    }
  }, [wrapperRef, subscribe]);

  useEffect(() => {
    if (inView) {
      unsubscribe();
    }
  }, [inView, unsubscribe]);

  useEffect(() => {
    if (!opened && inView) {
      resetInView();
      setTimeout(() => {
        if (!swiper.isBeginning) {
          swiper.slideTo(0);
        }
      }, 400);
    }
  }, [inView, opened, resetInView, swiper]);

  return { inView, wrapperRef };
};
