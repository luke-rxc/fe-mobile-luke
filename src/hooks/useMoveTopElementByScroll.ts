/**
 * 공통 Hooks
 * - 상단 TOP 영역과 나머지 영역의 Parallax 처리
 *
 * @requires
 *  - 상단 TOP 영역과 나머지 영역의 Position 기준은 absolute
 */

import React, { useEffect } from 'react';
import { useWindowScroll } from 'react-use';
import { linearEquation } from '@utils/linearEquation';

interface Props {
  /** 이동해야 하는 Top Element Ref */
  elementRef: React.RefObject<HTMLElement>;
  /**
   * 기본 스크롤 올라가는 부분에서 조절해야 하는 비율 (숫자가 커질 수록 적게 올라감)
   * - 기본값 5
   * - 0을 넣게 되면 1로 변환
   */
  ratio?: number;
}

export const useMoveTopElementByScroll = ({ elementRef, ratio = 5 }: Props) => {
  const { y: scrollY } = useWindowScroll();

  useEffect(() => {
    if (elementRef && elementRef.current) {
      const finishValue = elementRef.current.offsetHeight;
      const ratioValue = ratio > 0 ? ratio : 1;
      const expectFinishValue = finishValue / ratioValue;
      const value = linearEquation(scrollY, 0, finishValue, 0, expectFinishValue);
      const valueRem = value / 10;
      // eslint-disable-next-line no-param-reassign
      elementRef.current.style.transform = `translate3d(0, ${valueRem}rem, 0)`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollY]);
};
