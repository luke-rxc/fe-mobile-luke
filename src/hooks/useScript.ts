import { useEffect, useState } from 'react';

const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  READY: 'ready',
  ERROR: 'error',
} as const;

type Status = typeof STATUS[keyof typeof STATUS];

/**
 * @reference https://usehooks.com/useScript/
 */
export const useScript = (src: string) => {
  const [status, setStatus] = useState<Status>(STATUS.IDLE);

  useEffect(() => {
    const script = document.createElement('script');
    const onHandle = (e: Event | string) => {
      if (typeof e === 'string' || e.type === 'error') {
        setStatus(STATUS.ERROR);
        return;
      }

      setStatus(STATUS.READY);
    };
    script.src = src;
    script.async = true;
    setStatus(STATUS.LOADING);
    script.onload = onHandle;
    script.onerror = onHandle;
    document.body.appendChild(script);

    return () => {
      if (script) {
        script.removeEventListener('load', onHandle);
        script.removeEventListener('error', onHandle);
        script.remove();
      }
    };
  }, [src]);

  return {
    status,
  };
};
