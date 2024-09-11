import { useEffect, useLayoutEffect, useRef } from 'react';
import type { FC } from 'react';
import styled from 'styled-components';
import { Conditional } from '@pui/conditional';
import { useIntersection } from '../../hooks';
import type { AppearTransitionProps } from '../../models';

/**
 * element 등장모션 처리 컴포넌트
 */
export const AppearTransition: FC<AppearTransitionProps> = ({
  className,
  transition = true,
  transitionTime = 600,
  children,
}) => {
  const { sectionRef, sectionElRef, inView, handleDisconnect } = useIntersection({
    options: {
      threshold: 0.2,
    },
  });
  const timeId = useRef<NodeJS.Timeout | null>(null);
  const handleTransition = () => {
    handleDisconnect();

    if (sectionElRef.current) {
      sectionElRef.current.style.transform = 'translate3d(0, 5rem, 0)';

      setTimeout(() => {
        if (sectionElRef.current) {
          sectionElRef.current.style.transition = `all ${transitionTime}ms cubic-bezier(0.42, 0, 0.58, 1)`;
          sectionElRef.current.style.transform = 'translate3d(0, 0rem, 0)';
          sectionElRef.current.style.opacity = '1';
        }
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  useEffect(() => {
    // 네비게이션 탭으로 스크롤이 빠르게 이동 할 경우 모션 효과가 보여지지 않는 케이스로 timeout 처리
    if (timeId.current) clearTimeout(timeId.current);
    if (inView) {
      timeId.current = setTimeout(handleTransition, 10);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useLayoutEffect(() => {}, []);

  return (
    <div className={className}>
      <Conditional condition={transition} trueExp={<TransitionBox ref={sectionRef} />}>
        {children}
      </Conditional>
    </div>
  );
};

const TransitionBox = styled.div.attrs(({ transitionTime }: { transitionTime: number }) => {
  return {
    transitionTime,
  };
})`
  position: relative;
  opacity: 0;
`;
