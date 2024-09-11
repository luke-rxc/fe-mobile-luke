/** 주문서, 주문완료 페이지 path */
export const ORDER_PATH_REGEX = /^\/order\//i;
/** 점유 해제 key */
export const SEAT_LOCK_KEY = 'seat-lock-id';
/** 점유 해제 id */
export const SEAT_LOCK_ID_REGEX = new RegExp(`${SEAT_LOCK_KEY}=\\d+`, 'i');
