import { useEffect, useRef } from 'react';

export const useDebounce = () => {
  const timeRef = useRef<number | null>(null);

  const debounce = (delay: number): Promise<boolean> => {
    if (timeRef.current) {
      window.clearTimeout(timeRef.current);
    }

    return new Promise((resolve) => {
      timeRef.current = window.setTimeout(() => {
        resolve(true);
      }, delay);
    });
  };

  useEffect(() => {
    return () => {
      timeRef.current = null;
    };
  }, []);

  return { debounce };
};
