import { useCallback, useEffect, useRef } from 'react';

export const usePostTask = () => {
  const postTasksRef = useRef<(() => void)[]>([]);

  const add = (fn: () => void) => {
    postTasksRef.current.push(fn);
  };

  const execute = useCallback((task: () => void, options: { async?: boolean } = {}) => {
    const { async = false } = options;

    return new Promise((resolve) => {
      if (async) {
        add(() => {
          task();
          resolve(true);
        });
      } else {
        task();
        resolve(true);
      }
    });
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      while (postTasksRef.current.length > 0) {
        const fn = postTasksRef.current.pop();
        fn?.();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      postTasksRef.current = [];
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    execute,
  };
};
