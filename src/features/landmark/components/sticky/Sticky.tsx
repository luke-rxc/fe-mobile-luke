/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useMemo, useLayoutEffect } from 'react';
import styled from 'styled-components';
import isFunction from 'lodash/isFunction';
import classnames from 'classnames';
import { useWindowSize, useWindowScroll } from 'react-use';
import { useHeaderState } from '../../hooks/useHeader';

/**
 * stick의 기준이 되는 요소들의 교차지점을 설정하기 위한 값
 */
export type Offset = 'top' | 'bottom' | 'center';

/**
 * Sticky Child에 전달될 데이터
 */
export type StickyData = {
  /** 현재 Sticky 여부 */
  isSticky: boolean;
  /** Sticky 가능 여부 */
  stickable: boolean;
  /** */
  stickyPosY: number;
};

/**
 * Sticky Options
 */
export type StickyOptions = {
  /**
   * sticky의 기준이 되는 요소들의 교차지점
   * @default ['bottom', 'top'] => header의 아랫면과 sticky의 트리거 요소의 윗면이 교차하는 순간 sticky
   * offset[0] => header의 top/bottom/center
   * offset[1] => sticky의 트리거 요소의 top/bottom/center
   */
  offset: [Offset] | [Offset, Offset];
  /** sticky 지점에서 추가적인 조정값 */
  buffer: number;
  /** sticky의 트리거 요소 */
  target: React.RefObject<HTMLElement>;
};

/**
 * Sticky Props
 */
export interface StickyProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 상단에 고정될 요소 */
  children: React.ReactNode | ((stickyData: StickyData) => React.ReactNode);
  /** 처음부터 고정할지에 대한 값 (true시 위치와 상관없이 상단에 고정) */
  wasSticky?: boolean;
  /** sticky 기능 비활성화 여부 */
  disabled?: boolean;
  /** 상단에 고정시 기존 영역의 높이값 유지 여부 (true시 영역에 대한 높이값 유지 X)  */
  disableSafeArea?: boolean;
  /** 고정 시작점에 대한 옵션 */
  startOptions?: Partial<StickyOptions>;
}

/**
 * 특정요소를 페이지상단(혹은 Header밑)에 고정시기키 위한 유틸성 컴포넌트
 *
 * @todo stick가 끝나는 지점 설정 기능 추가
 * @todo 이미 설정된 stick 컨테이너외에 사용자 지정가능하도록 옵션 추가
 * @todo scroll 이벤트에 의존중인 코드를 Intersection Observer API를 활용할 수 있는 방법으로 대체
 */
export const Sticky = styled(
  ({ children, wasSticky = false, disabled, disableSafeArea, startOptions, ...props }: StickyProps) => {
    /** hooks */
    const { element } = useHeaderState();
    const size = useWindowSize();
    const scroll = useWindowScroll();

    /** state */
    const [isSticky, setSticky] = useState<boolean>(wasSticky);
    const [stickyTop, setStickyTop] = useState<number>(-1);
    const [startLine, setStartLine] = useState<number>(-1);

    /** refs */
    const container = useRef<HTMLDivElement>(null);
    const content = useRef<HTMLDivElement>(null);

    /**
     * start/finish 지점을 계산시 사용되는 offset(top|bottom|center) 비율값
     */
    const offsetRatio: { [key in Offset]: number } = { top: 0, center: 0.5, bottom: 1 } as const;

    /**
     * content가 append되는 element
     */
    const stickyRoot = useMemo(() => {
      return element?.stickyContainer || (document.querySelector('#sticky-root') as HTMLElement | null);
    }, [element]);

    const child = useMemo(() => {
      return isFunction(children)
        ? children({ isSticky: isSticky && !disabled, stickable: isSticky, stickyPosY: startLine })
        : children;
    }, [children, isSticky]);

    /**
     * 시작점에 대한 옵션 ()
     */
    const startOpt = { target: container, buffer: 0, offset: ['bottom', 'top'], ...(startOptions || {}) } as const;

    /**
     * Sticky 시작점 계산
     */
    const updateStartLine = () => {
      if (!stickyRoot || !startOpt.target?.current) {
        return;
      }

      const [rootOffset, targetOffset = rootOffset] = startOpt.offset;
      const { offsetTop: targetTop, offsetHeight: targetHeight } = startOpt.target.current;
      const { offsetTop: rootTop, offsetHeight: rootHeight } = stickyRoot;

      const stickyPoint = targetTop + targetHeight * offsetRatio[targetOffset];
      const buffer = startOpt.buffer - (rootTop + rootHeight * offsetRatio[rootOffset]);

      setStickyTop(Math.max(rootTop + rootHeight, 0));
      setStartLine(wasSticky ? -1 : Math.max(stickyPoint + buffer, 0));
    };

    /**
     * startLine 업데이트
     */
    useLayoutEffect(() => {
      updateStartLine();
    }, [stickyRoot, startOpt.buffer, startOpt.target, ...startOpt.offset]);

    /**
     * startLine값과 비교하여 isSticky값을 업데이트
     */
    useLayoutEffect(() => {
      if (startLine > -1 && !disabled) {
        const sticky = wasSticky || scroll.y >= startLine;
        sticky !== isSticky && setSticky(sticky);
      }
    }, [scroll.y, startLine, disabled]);

    /**
     * sticky시 기존 영역의 높이 값을 확보
     */
    useLayoutEffect(() => {
      if (container.current && content.current && !disabled && !disableSafeArea) {
        container.current?.setAttribute('style', `height: ${content.current?.offsetHeight}px`);
      }
    }, [size.width, disabled, children]);

    return (
      <div ref={container} {...props}>
        <div
          className={classnames('sticky', { 'is-sticky': isSticky })}
          style={{ top: isSticky ? stickyTop : 'initial' }}
        >
          <div ref={content}>{child}</div>
        </div>
      </div>
    );
  },
)`
  .sticky {
    z-index: ${({ theme }) => theme.zIndex.header + 1};

    &.is-sticky {
      position: fixed;
      left: 0;
      width: 100%;
      background: ${({ theme }) => theme.color.background.surfaceHigh};
    }
  }
`;
