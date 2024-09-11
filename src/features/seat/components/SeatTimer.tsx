import React, { HTMLAttributes, useEffect, useMemo, useState } from 'react';
import { toHHMMSS } from '@utils/toTimeformat';
import styled from 'styled-components';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useCountDownService } from '@services/useCountDownService';
import { Slide } from './Slide';
import {
  APP_AOS_SEAT_TIMER_DURATION,
  DEFAULT_SEAT_TIMER_DURATION,
  SEAT_TIMER_DELAY,
  SEAT_TIMER_DESCRIPTION_MESSAGE,
  SEAT_TIMER_DISTANCE,
  SEAT_TIMER_PREFIX,
  SEAT_TIMER_SLIDE_COUNT,
} from '../constants';
import { isTransitionStopTime } from '../utils';

export interface SeatTimerProps {
  /**
   * 만료 시간
   */
  expiredDate: number;
  /**
   * 만료시 이벤트
   */
  onExpired?: () => void;
}

export const SeatTimer = React.forwardRef(({ expiredDate, onExpired }: SeatTimerProps, ref) => {
  const { isApp, isAndroid } = useDeviceDetect();
  const duration = isApp && isAndroid ? APP_AOS_SEAT_TIMER_DURATION : DEFAULT_SEAT_TIMER_DURATION;
  const getCount = () => (isTransitionStopTime(expiredDate) ? 0 : SEAT_TIMER_SLIDE_COUNT);
  const [count, setCount] = useState(getCount());

  const handleSlideComplete = (index: number) => {
    index === 0 && setCount(getCount());
  };

  return (
    <Slide
      ref={ref}
      count={count}
      delay={SEAT_TIMER_DELAY}
      duration={duration}
      distance={SEAT_TIMER_DISTANCE}
      onSlideComplete={handleSlideComplete}
    >
      <Timer expiredDate={expiredDate} onExpired={onExpired} />
      <Description>{SEAT_TIMER_DESCRIPTION_MESSAGE}</Description>
    </Slide>
  );
});

interface TimerProps extends HTMLAttributes<HTMLDivElement> {
  expiredDate: number;
  onExpired?: () => void;
}

const TimerComponent = ({ expiredDate, onExpired: handleExpired, ...rest }: TimerProps) => {
  const expiredDateMS = expiredDate || -1;
  const remainedTime = useMemo(() => expiredDateMS - Date.now(), [expiredDateMS]);
  const { countDown, reset, pause, resume } = useCountDownService({ countDown: remainedTime, delta: 1000 });

  useEffect(() => {
    const handleVisible = () => {
      switch (document.visibilityState) {
        case 'visible':
          resume();
          reset(expiredDateMS - Date.now());
          break;
        case 'hidden':
          pause();
          break;
        default:
      }
    };

    window.addEventListener('visibilitychange', handleVisible);

    return () => {
      window.removeEventListener('visibilitychange', handleVisible);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const isEnd = countDown <= 0;

    if (!isEnd) {
      return;
    }

    handleExpired?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countDown]);

  return (
    <div {...rest} className={rest.className}>
      {SEAT_TIMER_PREFIX} <span className="count-down">{toHHMMSS(countDown)}</span>
    </div>
  );
};

const Timer = styled(TimerComponent)`
  & {
    text-align: center;
    padding: 0.9rem 0;
    font: ${({ theme }) => theme.fontType.miniB};
    color: ${({ theme }) => theme.color.black};

    & .count-down {
      color: ${({ theme }) => theme.color.semantic.error};
    }
  }
`;

const Description = styled.div`
  font: ${({ theme }) => theme.fontType.mini};
`;
