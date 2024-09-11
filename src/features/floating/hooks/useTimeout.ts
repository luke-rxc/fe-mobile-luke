import { useRef } from 'react';

export const useTimeout = () => {
  const timeRef = useRef<number | null>(null);

  /**
   * setTimeout설정
   * 기존에 설정된 setTimeout이 있다면 해당 setTimeout은 clear한다.
   */
  const set = (cb: () => void, delay?: number) => {
    clear();

    timeRef.current = window.setTimeout(() => {
      cb();
      timeRef.current = null;
    }, delay || 0);

    return timeRef.current;
  };

  /**
   * setTimeout clear
   */
  const clear = () => {
    if (!timeRef.current) {
      return false;
    }

    window.clearTimeout(timeRef.current);
    timeRef.current = null;

    return true;
  };

  return { set, clear };
};
