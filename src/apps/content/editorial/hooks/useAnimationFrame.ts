import { RefObject, useEffect, useRef, useState } from 'react';
import { useIntersection } from '@hooks/useIntersection';
import type { AnimationSet, AnimationSetForScroll } from '../models';
import { getOffsetTop } from '../utils';
import { useParallax } from './useParallax';

export type ContentRatioInfo = {
  contentRatio: number; // 컨텐츠 진행률
  elOffsetTop: number; // 바디 기준 offsetTop
  elHeight: number; // 컨텐츠 높이
  contentOffsetY: number; // 컨텐츠 스크롤 진행량 Ypx
  scrollY: number;
};
/**
 * 컨텐츠 진행률에 따라 애니메이션 프레임 처리
 */
type Props = {
  sectionRef: RefObject<HTMLElement>; // 컨텐츠 wrapper - 바운더리 Element
  animationData?: AnimationSet[];
  onRequestFrame?: (aniResult: AnimationSetForScroll[], contentRatio: ContentRatioInfo) => void; // requestAnimationFrame 사용할 경우 callback 함수
  intersectionOptions?: IntersectionObserverInit; // intersectionObserver 옵션
  viewRatio?: number; // 0~1 - 0 : 요소가 뷰포트 "최상단"에 도달 시 부터 진행률 계산 1: 요소가 뷰포트 "하단"에서 노출 될때 부터 진행률 계산
  viewEndRatio?: number; // 0~1 - 0: 요소의 마지막 영역이 뷰포트 "하단"을 기준으로 위로 이동 될때 부터 진행률 계산 1 : 요소의 마지막 영역이 뷰포트 "최상단"을 기준으로 위로 이동 될때부터 진행률 계산
  scrollDiff?: number; // 스크롤시 diff
};
export const useAnimationFrame = (props: Props) => {
  const {
    sectionRef,
    onRequestFrame = null,
    animationData,
    intersectionOptions = {},
    viewRatio = 1,
    viewEndRatio = 1,
    scrollDiff = 0,
  } = props;
  const { inView, scrollY, subscribe, unsubscribe } = useIntersection({ scrollable: true }); // 뷰포트 교차 체크
  const { changeScrollForParallax, updateAnimationData } = useParallax(animationData ?? []); // 애니메이션 패럴럭스 처리
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: document.body.offsetWidth,
    height: window.innerHeight,
  });
  const scrollSpeedY = useRef<number>(0);
  const requestAnimId = useRef<number | null>(null);
  const contentRatioInfo = useRef<ContentRatioInfo>({
    contentRatio: 0,
    elOffsetTop: 0,
    elHeight: 0,
    contentOffsetY: 0,
    scrollY: 0,
  });

  const handleResize = () => {
    setWindowSize({
      width: document.body.offsetWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    if (sectionRef.current) {
      subscribe(sectionRef.current, intersectionOptions);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionRef.current]);

  // 스크롤 변경시 컨텐츠 진행률 체크
  useEffect(() => {
    if (inView) {
      const { current } = sectionRef;
      if (current) {
        // 영역 안으로 들어올때, 컨텐츠 진행률 계산
        const elOffsetTop = getOffsetTop(current).top;
        const elHeight = current.offsetHeight;
        const { height: winHeight } = windowSize;
        const sectionHeight = elHeight + winHeight * viewRatio - (viewEndRatio === 1 ? 0 : winHeight);
        if (scrollY + scrollDiff > elOffsetTop - winHeight * viewRatio) {
          const currentYOffset = Math.min(scrollY + scrollDiff - elOffsetTop + winHeight * viewRatio, sectionHeight); // 스크롤 빨리 넘어갈때 컨텐츠 높이보다 더 커지는 경우에 대해 min 처리
          const ratio = currentYOffset / sectionHeight;
          contentRatioInfo.current = {
            contentRatio: ratio,
            elOffsetTop,
            elHeight,
            contentOffsetY: currentYOffset,
            scrollY,
          };
        } else {
          contentRatioInfo.current = {
            contentRatio: 0,
            elOffsetTop: 0,
            elHeight: 0,
            contentOffsetY: 0,
            scrollY: 0,
          };
        }
      }
      if (onRequestFrame && !requestAnimId.current) {
        requestAnimId.current = requestAnimationFrame(playAnimation);
      }
    } else if (requestAnimId.current) {
      cancelAnimationFrame(requestAnimId.current);
      requestAnimId.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, scrollY]);

  const playAnimation = () => {
    // 스크롤이 움직이는 일정 구간만 애니메이션 프레임 처리
    scrollSpeedY.current += (scrollY - scrollSpeedY.current) * 0.1;
    if (Math.abs(scrollY - scrollSpeedY.current) < 0.2) {
      scrollSpeedY.current = scrollY;
      if (requestAnimId.current) {
        cancelAnimationFrame(requestAnimId.current);
        requestAnimId.current = null;
        return;
      }
    }

    if (onRequestFrame) {
      const animResultValue: AnimationSetForScroll[] = changeScrollForParallax(
        contentRatioInfo.current.contentRatio ?? 0,
      );

      onRequestFrame(animResultValue, contentRatioInfo.current);
    }
    requestAnimId.current = requestAnimationFrame(playAnimation);
  };

  return {
    inView,
    contentRatioInfo: contentRatioInfo.current,
    updateAnimationDataForFrame: updateAnimationData, // 애니메이션 구간정보가 동적으로 변경될 경우 업데이트
  };
};
