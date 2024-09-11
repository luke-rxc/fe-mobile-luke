import { useEffect } from 'react';

declare global {
  interface CustomEventMap {
    'prizm:region:filter:click': CustomEvent<{ id: number; name: string; selected: boolean }>;
    'prizm:region:filter:clear': CustomEvent;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface WindowEventMap extends CustomEventMap {}
}

export const useRegionEventListeners = <T extends keyof WindowEventMap>(
  type: T,
  handler: (event: WindowEventMap[T]) => void,
  options?: boolean | AddEventListenerOptions,
): void => {
  useEffect(() => {
    window.addEventListener(type, handler, options);

    return () => {
      window.removeEventListener(type, handler, options);
    };
  }, [type, handler, options]);
};
