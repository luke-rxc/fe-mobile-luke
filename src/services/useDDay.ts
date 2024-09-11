import { useCallback, useEffect, useState } from 'react';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import differenceInHours from 'date-fns/differenceInHours';
import { useCountDownService } from './useCountDownService';

type DdayProps = {
  time: number; // 타겟 시간
  enabled?: boolean;
};
export const useDDay = ({ time, enabled = true }: DdayProps) => {
  const [isEnd, setIsEnd] = useState(false);
  const [remainDay, setRemainDay] = useState(-1);
  const { countDown, reset } = useCountDownService({ countDown: 0, delta: 1000 });
  const DAY_SECONDES = 60 * 60 * 24 * 1000;
  const now = new Date().getTime();
  const caluRemainDay = differenceInCalendarDays(time, now);
  const caluRemainHours = differenceInHours(time, now);

  const handleReset = useCallback(() => {
    if (enabled) {
      const distance = time - new Date().getTime();
      reset(distance);
    }
  }, [enabled, reset, time]);

  useEffect(() => {
    if (enabled) {
      // TODO: 날짜단위로 카운트다운?
      const distance = time - now;
      if (distance < 0) {
        setIsEnd(true);
      } else {
        /**
         * 24시간이 넘을 경우 일수를 계산하여 저장
         * 24시간 이내일 경우 Countdown (remainDay 는 0 으로 지정)
         */
        const refreshRemainDay = caluRemainHours < 24 ? 0 : caluRemainDay;
        setRemainDay(refreshRemainDay);
        if (distance < DAY_SECONDES) {
          reset(distance);
        }
      }
    }
  }, [DAY_SECONDES, reset, time, enabled, now, caluRemainHours, caluRemainDay]);

  useEffect(() => {
    if (enabled) {
      const distance = time - now;
      setIsEnd(distance <= 0 && countDown <= 0);
    }
  }, [countDown, enabled, time, now]);

  return {
    remainDay,
    isEnd,
    countDown,
    handleReset,
  };
};
