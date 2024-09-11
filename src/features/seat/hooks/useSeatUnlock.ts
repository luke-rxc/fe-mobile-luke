import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { clearSeatLockId, unlockSeat } from '../utils';
import { ORDER_PATH_REGEX } from '../constants';

/**
 * 모웹 주문 프로세스 좌석 점유 해제 처리
 */
export const useSeatUnlock = (isLogin: boolean) => {
  const { pathname } = useLocation();
  const { isApp } = useDeviceDetect();

  useEffect(() => {
    if (isApp) {
      return;
    }

    if (!isLogin) {
      clearSeatLockId();
      return;
    }

    if (ORDER_PATH_REGEX.test(pathname)) {
      return;
    }

    unlockSeat();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isLogin]);
};
