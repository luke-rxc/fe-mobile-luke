import { getLocalStorage, removeLocalStorage, setLocalStorage } from '@utils/storage';

/**
 * 주문 완료 페이지에 접근할때 마다 주문 완료와 관련된 로깅이 동작하므로,
 * 한번 로깅이 처리된 이후에는 해당 동작을 막기 위함 (재접근, 새로고침과 같은 동작시)
 */
const KEY = 'order-logging-mark';

/**
 * order-logging-mark 생성
 * orderId 저장
 */
export const setOrderLoggingMark = (orderId: number) => {
  setLocalStorage(KEY, orderId);
};

/**
 * order-logging-mark 제거
 */
export const deleteOrderLoggingMark = () => {
  removeLocalStorage(KEY);
};

/**
 * order-logging-mark 반환
 */
export const getOrderLoggingMark = () => {
  return getLocalStorage(KEY)?.toString();
};

/**
 * 중복 로깅 여부 확인
 */
export const verifyOrderLoggingMark = (id: string) => {
  const mark = getOrderLoggingMark();
  return mark && mark === id;
};
