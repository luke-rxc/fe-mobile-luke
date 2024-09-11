import { useState, useEffect } from 'react';

/**
 * unmount delay hook
 */
export const useDelayUnmount = (isMounted: boolean, delayTime: number, useTimer: boolean) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isMounted && !shouldRender) {
      setShouldRender(true);
    } else if (!isMounted && shouldRender) {
      if (useTimer) {
        timeoutId = setTimeout(() => setShouldRender(false), delayTime);
      } else {
        setShouldRender(false);
      }
    }
    return () => clearTimeout(timeoutId);
  }, [isMounted, delayTime, shouldRender, useTimer]);
  return shouldRender;
};
