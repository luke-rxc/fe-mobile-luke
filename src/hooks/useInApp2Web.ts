import { useCallback, useEffect } from 'react';
import { CallWebEvent } from '@constants/link';
import { useDeviceDetect } from './useDeviceDetect';

export type AppMessageFunction<T, R = unknown> = (payload?: T) => void | Promise<R> | R;

/**
 * 앱 → 웹간 postMessage를 구독
 *
 * @param eventType 이벤트 타입
 * @param handleAppMessage 이벤트 받았을 때 callback 함수. payload 값을 받음
 * @example
 * ```
 * import { useInApp2Web } from '@hooks/useInApp2Web';
 * import { CallWebEvent } from '@constants/link';
 *
 * useInApp2Web(CallWebEvent.SendLoginStatus, (payload?: unknown) => {
 *   debug.log(payload);
 * });
 *
 * ```
 * @references
 *  https://www.notion.so/Web-Interface-b55be04d1f4a4013851b6534f56d5a78 (Call Web 참고)
 */
export function useInApp2Web<T, R = unknown>(
  eventType: ValueOf<CallWebEvent>,
  handleAppMessage: AppMessageFunction<T, R>,
) {
  const { isApp } = useDeviceDetect();

  const handleEventMessage = useCallback(
    (event: AppBridgeMessageEvent<T>) => {
      const { origin, data } = event;

      if (origin !== window.location.origin) {
        return;
      }

      if (data?.event !== eventType) {
        return;
      }

      handleAppMessage(data?.payload);
    },
    [handleAppMessage, eventType],
  );

  useEffect(() => {
    if (!isApp) {
      return;
    }

    window.addEventListener('message', handleEventMessage);

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('message', handleEventMessage);
    };
  }, [isApp, handleEventMessage]);
}
