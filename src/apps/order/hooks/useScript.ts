import { useEffect, useRef } from 'react';

export const useScript = () => {
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlerRef = useRef<(this: HTMLScriptElement, ev: Event) => any>(() => {});

  const load = (src: string): Promise<HTMLScriptElement> => {
    const script = document.createElement('script');

    return new Promise((resolve, reject) => {
      const onHandle = (e: Event | string) => {
        if (typeof e === 'string' || e.type === 'error') {
          reject();
        }

        resolve(script);
      };
      handlerRef.current = onHandle;
      script.src = src;
      script.async = true;
      script.onload = onHandle;
      script.onerror = onHandle;
      document.body.appendChild(script);
    });
  };

  const unload = () => {
    scriptRef.current?.removeEventListener('load', handlerRef.current);
    scriptRef.current?.removeEventListener('error', handlerRef.current);
    scriptRef.current?.remove();
  };

  useEffect(() => {
    return () => {
      unload();
    };
  }, []);

  return {
    load,
  };
};
