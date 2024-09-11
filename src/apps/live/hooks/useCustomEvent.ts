/**
 * custom event hook
 */
export const useCustomEvent = <T extends unknown>() => {
  const subscribe = (eventName: string, listener: EventListenerOrEventListenerObject) => {
    document.addEventListener(eventName, listener);
  };

  const unsubscribe = (eventName: string, listener: EventListenerOrEventListenerObject) => {
    document.removeEventListener(eventName, listener);
  };

  const publish = (eventName: string, params?: T) => {
    const event = new CustomEvent<T>(eventName, { detail: params });
    document.dispatchEvent(event);
  };

  return { subscribe, unsubscribe, publish };
};
