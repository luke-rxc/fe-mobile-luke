import React, { HTMLAttributes, TransitionEvent, useEffect, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';

export interface SlideProps extends HTMLAttributes<HTMLDivElement> {
  /** slide 횟수 */
  count?: number;
  /** slide 이동 거리 */
  distance?: number;
  /** slide 지연 시간 */
  delay?: number;
  /** slide 효과 소요 시간 */
  duration?: number;
  /** slide 완료 이벤트 */
  onSlideComplete?: (index: number) => void;
}

const SlideComponent = React.forwardRef(
  (
    { count = 0, distance = 0, delay = 0, children, onSlideComplete: handleSlideComplete, ...rest }: SlideProps,
    ref,
  ) => {
    const listElRef = useRef<HTMLDivElement | null>(null);
    const currentPositionRef = useRef<number>(0);
    const iterationRef = useRef<number>(0);
    const countRef = useRef<number>(count);
    const directionRef = useRef<number>(-1);
    const getEndPosition = () => Math.min((React.Children.count(children) - 1) * distance * directionRef.current, 0);
    const endPositionRef = useRef(getEndPosition());

    const moveTo = (position: number) => {
      if (!listElRef.current) {
        return;
      }
      listElRef.current.style.transform = `translate3d(0, ${position}px, 0)`;
    };

    const switchDirection = () => {
      // eslint-disable-next-line operator-assignment
      directionRef.current *= -1;
      endPositionRef.current = getEndPosition();
    };

    const next = () => {
      const isOver = iterationRef.current >= countRef.current;

      if (isOver) {
        return;
      }

      iterationRef.current += 1;
      currentPositionRef.current += distance * directionRef.current;
      moveTo(currentPositionRef.current);

      const isSwitchDirection =
        currentPositionRef.current === endPositionRef.current || currentPositionRef.current === 0;

      isSwitchDirection && switchDirection();
    };

    const play = () => {
      iterationRef.current = 0;
      countRef.current = count;
      setTimeout(next, delay);
    };

    const handleTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName !== 'transform') {
        return;
      }

      handleSlideComplete?.(currentPositionRef.current / distance);
      setTimeout(next, delay);
    };

    useImperativeHandle(ref, () => ({ play }));

    useEffect(() => {
      countRef.current = count;
    }, [count]);

    return (
      <div {...rest}>
        <div className="list" ref={listElRef} onTransitionEnd={handleTransitionEnd}>
          {React.Children.map(children, (child, index) => (
            <div key={index.toString()} className="item">
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  },
);

export const Slide = styled(SlideComponent).attrs(({ distance, duration }) => ({
  distance: distance ?? 0,
  duration: duration ?? 0,
}))`
  width: 100%;
  height: ${({ distance }) => `${distance / 10}rem`};
  overflow: hidden;
  position: relative;

  &:before {
    position: absolute;
    top: 0;
    content: '';
    height: 0.8rem;
    background: ${({ theme }) =>
      `linear-gradient(180deg, ${theme.color.whiteVariant1} 0%, rgba(255, 255, 255, 0) 100%)`};
    width: 100%;
    z-index: 1;
  }

  &:after {
    position: absolute;
    bottom: 0;
    content: '';
    height: 0.8rem;
    background: ${({ theme }) =>
      `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${theme.color.whiteVariant1} 100%)`};
    width: 100%;
    z-index: 1;
  }

  & .list {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    transition: ${({ duration }) => `transform ${duration}ms ease-in-out`};
  }

  & .item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: ${({ distance }) => `${distance / 10}rem`};
    background: ${({ theme }) => theme.color.whiteVariant1};
  }
`;
