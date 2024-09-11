import { useState, useRef } from 'react';
import { useBoolean, useInterval } from 'react-use';

interface Props {
  // 카운팅 수치
  countDown: number;
  // 변화량
  delta?: number;
  // 간격
  interval?: number;
}
const DEFAULT_INTERVAL_MS = 1000;
const DEFAULT_DELTA_MS = 1000;

/**
 * @see {@link https://github.com/streamich/react-use/blob/master/docs/useInterval.md}
 * @example
 * // 1분(ms) 카운트
 * const {countDown} = useCountDownService({countDown: 60 * 1000});
 * 60000, 59000, 58000, ...
 *
 * // 10부터 카운트
 * const { countDown } = useCountDownService({ countDown: 10, delta: 1 });
 * 10, 9, 8, ...
 */
export const useCountDownService = ({ countDown, interval = DEFAULT_INTERVAL_MS, delta = DEFAULT_DELTA_MS }: Props) => {
  const countDownRef = useRef(countDown);
  const [leftCount, setLeftCount] = useState(0);
  const [isRunning, setIsRunning] = useBoolean(true);

  const isTimeout = () => leftCount >= countDownRef.current;

  useInterval(
    () => {
      if (isTimeout()) {
        setIsRunning(false);
        return;
      }

      setLeftCount((prev) => prev + delta);
    },
    isRunning ? interval : null,
  );

  function reset(count: number) {
    countDownRef.current = count;
    setLeftCount(0);
    setIsRunning(true);
  }

  function pause() {
    setIsRunning(false);
  }

  function resume() {
    if (isTimeout()) {
      return;
    }

    setIsRunning(true);
  }

  return {
    countDown: countDownRef.current - leftCount,
    reset,
    pause,
    resume,
  };
};
