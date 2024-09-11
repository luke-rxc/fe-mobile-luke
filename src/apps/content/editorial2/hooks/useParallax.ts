import { useRef } from 'react';
import type { AnimationSet, AnimationSetForScroll } from '../models';
import { getSectionIndex, getSectionValueForScroll } from '../utils';

/**
 * 애니메이션 구간 정보를 기준으로, 스크롤 위치에 따라 각 value 계산
 * @param animationSet
 * @returns
 */
export const useParallax = (animationSet: AnimationSet[]) => {
  const animationData = useRef<AnimationSet[]>(animationSet);
  const animationResultValue = useRef<AnimationSetForScroll[]>([]); // 현재 스크롤 기준으로 처리 되어야 할 애니메이션 결과 정보들

  const changeScrollForParallax = (contentRatio: number) => {
    const { current: animData } = animationData;
    // 현재 스크롤 기준으로 애니메이션 값 계산 처리
    const animationSetForScroll: AnimationSetForScroll[] = animData.map((animSet: AnimationSet) => {
      const { id, animations } = animSet;
      if (!animations.length) {
        return {
          id,
          value: 0,
          contentRatio,
        };
      }
      // 스크롤에 맞춰 계산할 애니메이션 섹션 구간 index 정보 조회
      const sectionIdx = getSectionIndex(animations, contentRatio);
      // 스크롤에 따라 애니메이션 값 계산
      const sectionAnimResult = getSectionValueForScroll(animations[sectionIdx], contentRatio);

      return {
        id,
        value: sectionAnimResult,
        contentRatio,
      };
    });

    animationResultValue.current = animationSetForScroll;
    return animationResultValue.current;
  };

  /**
   * 애니메이션 정보가 동적으로 변경 될때 업데이트
   * @param data
   */
  const updateAnimationData = (animData: AnimationSet[]) => {
    animationData.current = [...animData];
  };

  return {
    changeScrollForParallax,
    updateAnimationData,
  };
};
