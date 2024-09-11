import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { SeatTimer } from '@features/seat/components';
import { SlideHandle } from '@features/seat/types';
import { ExpiredInfoType } from '../types';
import { OptionDrawerOpenDuration } from '../constants';

interface Props {
  expired?: ExpiredInfoType;
  onExpired?: () => void;
}

export const ExpiredCountDown = ({ expired, onExpired: handleExpired }: Props) => {
  const popupRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<SlideHandle | null>(null);

  const handleTranitionEnd = (e: React.TransitionEvent) => {
    if (e.target !== popupRef.current) {
      return;
    }

    timerRef.current?.play();
  };

  useEffect(() => {
    if (!expired) {
      popupRef.current?.classList.remove('active');
      return;
    }

    /**
     * @issue transition 이 간헐적으로 실행이 되지 않는 이슈가 있어서 settimeout 으로 대체
     * drawer 가 닫히는 transition duration(300ms) 만큼 delay
     */
    setTimeout(() => {
      popupRef.current?.classList.add('active');
    }, OptionDrawerOpenDuration);
  }, [expired]);

  return (
    <Wrapper ref={popupRef} onTransitionEnd={handleTranitionEnd}>
      {expired && <SeatTimer ref={timerRef} expiredDate={expired.expiredDate} onExpired={handleExpired} />}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  transform: translateY(3.6rem);
  transition: transform 0.2s;

  &.active {
    transform: translateY(0);
  }
`;
