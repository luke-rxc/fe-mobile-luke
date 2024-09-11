import { deleteSeatLock } from '../apis';
import { SEAT_LOCK_ID_REGEX, SEAT_LOCK_KEY } from '../constants';

/**
 * 점유 해제를 위한 파라미터 저장
 */
export const setSeatLockId = (checkoutId: number, expiredDate: number) => {
  const expires = new Date(expiredDate);
  document.cookie = `${SEAT_LOCK_KEY}=${checkoutId.toString()}; expires=${expires.toUTCString()}; path=/`;
};

/**
 * 점유 해제를 위한 파라미터 조회
 */
export const getSeatLockId = () => {
  return document.cookie.match(SEAT_LOCK_ID_REGEX)?.[0];
};

/**
 * 점유 해제 관련 파라미터 제거
 */
export const clearSeatLockId = () => {
  document.cookie = `${SEAT_LOCK_KEY}=; max-age=0; path=/`;
};

/**
 * 주문서 id 조회
 */
export const getCheckoutId = () => {
  const seatLockId = getSeatLockId();

  if (!seatLockId) {
    return undefined;
  }

  const [, value] = seatLockId.split('=');
  return Number(value);
};

/**
 * 좌석 점유 해제
 */
export const unlockSeat = async () => {
  const checkoutId = getCheckoutId();

  if (!checkoutId) {
    return;
  }

  const result = await deleteSeatLock({ checkoutId })
    .then(() => true)
    .catch(() => false);

  if (!result) {
    return;
  }

  clearSeatLockId();
};
