import type { AnimationSection, AnimationSet, AnimationSetForScroll } from '../models';

/**
 * offset top, left 조회 (body기준)
 * @param element
 * @returns
 */
export const getOffsetTop = (element: HTMLElement): { top: number; left: number } => {
  if (!element) {
    return { top: 0, left: 0 };
  }

  const box = element.getBoundingClientRect();
  const x = window.pageXOffset + box.left;
  const y = window.pageYOffset + box.top;
  return { top: y, left: x };
};

/**
 * 컨텐츠 스크롤 범위 startRange -> endRange
 * 밸류 startValue -> endValue 로 변경되어야 할때
 * 현재 range에서 필요한 value 값 계산
 * @param animationSection
 * @param scrollRatio
 * @returns
 */
export const getSectionValueForScroll = (animationSection: AnimationSection, scrollRatio: number): number => {
  const { startRange, endRange, startValue, endValue } = animationSection;
  let value = 0;

  if (startRange <= scrollRatio && scrollRatio <= endRange) {
    const targetValue = ((scrollRatio - startRange) * (endValue - startValue)) / (endRange - startRange) + startValue;
    // value = Math.round(targetValue * 100) / 100; // 소수 두자리까지
    value = targetValue; // 소수 두자리까지
  } else if (scrollRatio < startRange) {
    value = startValue;
  } else if (scrollRatio > endRange) {
    value = endValue;
  }

  return value;
};

/**
 * 애니메이션 구간이 여러개 정의 되어 있을때, 현재 스크롤 기준 어떤 구간으로 값을 처리 할지 조회
 * ex)범위 0.38~0.5, 0.7~0.9로 구간 정의 되어 있을때
 * - scroll이 0.8인 경우 0.7~0.9 범위의 값으로 처리.
 * - scroll이 0.6인 경우 기존 값 유지를 위해 0.38~0.5 범위의 값으로 처리.
 * @param anims
 * @param scrollRatio
 */
export const getSectionIndex = (animationSection: AnimationSection[], scrollRatio: number) => {
  let matchIndex = 0;
  animationSection.forEach((animation: AnimationSection, idx: number) => {
    const { startRange, endRange } = animation;

    // 현재 스크롤이 정의된 구간 내에 있을 경우
    if (startRange <= scrollRatio && scrollRatio <= endRange) {
      matchIndex = idx;
      return;
    }

    // 스크롤이 현재 구간과 다음 구간 사이 값인지 체크. 사이의 값이면 현재구간 정보를 넘겨준다.
    if (
      idx !== animationSection.length - 1 &&
      endRange < scrollRatio &&
      scrollRatio < animationSection[idx + 1].startRange
    ) {
      matchIndex = idx;
    }

    // 스크롤이 마지막 구간보다 큰 경우, 마지막 구간 정보를 넘겨준다.
    if (idx === animationSection.length - 1 && endRange < scrollRatio) {
      matchIndex = idx;
    }
  });

  return matchIndex;
};

/**
 * 애니메이션 구간 정보 업데이트
 * @param
 * @returns
 */
export const updateAnimationSet = ({
  animationSet,
  animId,
  sectionIdx,
  sectionKey,
  sectionValue,
}: {
  animationSet: AnimationSet[];
  animId: string; // 업데이트 타겟 애니메이션 아이디
  sectionIdx: number; // 구간 인덱스 넘버 (동일 키값에 대한 애니메이션 정보가 여러개 있는 경우, 해당 index 구간에 대한 업데이트 진행)
  sectionKey: string; // 업데이트 타겟 키
  sectionValue: number; // 업데이트 타겟 값
}) => {
  return animationSet.map((anim: AnimationSet) => {
    if (anim.id === animId) {
      const animSet = anim.animations.map((aniSection, idx) => {
        return {
          ...aniSection,
          ...(sectionIdx === idx && { [sectionKey]: sectionValue }),
        };
      });
      return {
        ...anim,
        animations: animSet,
      };
    }
    return anim;
  });
};

/**
 * 현재 스크롤에 해당되는 애니메이션 결과값을 easeing 값으로 계산하여 smooth하게 처리
 * @param animResultValue
 * @param animationKey
 * @param prevValue
 * @returns
 */
export const getEasingValue = (
  animResultValue: AnimationSetForScroll[],
  animationKey: string,
  prevValue: number,
  easingValue = 0.1,
) => {
  let result = 0;
  // 해당되는 애니메이션 value 조회
  const targetAnimValue = animResultValue.find(
    (target: AnimationSetForScroll) => target.id === animationKey,
  ) as AnimationSetForScroll;
  const targetValue = Math.round((targetAnimValue.value - prevValue) * 100) / 100; // 소수 두자리
  result = prevValue + targetValue * easingValue; // ease 처리
  return result;
};

/**
 * sticky 비디오 플레이 재생을 위한 컨텐츠 길이 처리
 * @param videoDuration 비디오 길이
 * @param defaultHt  기본 컨텐츠 길이는 화면 뷰 2배로 시작
 * @returns
 */
export const getHeightForVideoFrame = (videoDuration: number | undefined, defaultHt = 200): number => {
  let ht = 0;
  if (videoDuration) {
    const duration = Math.ceil(videoDuration / 5);
    ht = duration * 150; // 듀레이션에 따라 풀뷰 높이 설정. 5초당 화면 1.5배만큼 컨텐츠 길이 +처리
  }
  return defaultHt + ht;
};
