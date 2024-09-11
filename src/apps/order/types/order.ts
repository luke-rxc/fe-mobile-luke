import { CheckoutOrderSchema, CheckoutPaymentGateWaySchema } from '../schemas';

export const ORDER_COMPLETE_STATUS = {
  SUCCESS: 'success',
  FAIL: 'fail',
  USER_PAY_CANCEL: 'USER_PAY_CANCEL',
  PAY_TIME_OUT: 'PAY_TIME_OUT',
  ERROR: 'ERROR',
} as const;
export type OrderCompleteStatus = typeof ORDER_COMPLETE_STATUS[keyof typeof ORDER_COMPLETE_STATUS];

export const OrderStatus = {
  // 주문 진행중
  LOADING: 'LOADING',
  // 주문 성공
  SUCCESS: 'SUCCESS',
  // 주문 실패
  ERROR: 'ERROR',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const OrderCompleteErrorType = {
  // 사용자 결제 취소
  USER_PAY_CANCEL: 'USER_PAY_CANCEL',
  // 주문 API 폴링 타임 아웃
  PAY_TIME_OUT: 'PAY_TIME_OUT',
  // 주문 실패 - 상품 구매 제한
  OVER_ORDER_QUANTITY: 'OVER_ORDER_QUANTITY',
  // 주문 실패 - 좌석 점유 시간 만료
  LOCK_TIMEOUT: 'LOCK_TIMEOUT',
  // 주문 실패
  FAIL: 'FAIL',
  // 취소, 교환, 반품 등 주문 진행 외 상태
  NOT_FOUND: 'NOT_FOUND',
  // API 오류
  API: 'API',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderCompleteErrorType = typeof OrderCompleteErrorType[keyof typeof OrderCompleteErrorType];

/**
 * 주문 완료 페이지 쿼리 파라미터 정보
 */
export interface OrderQueryStringFields {
  // 아임포트 결제 성공 여부
  imp_success: string;
  error_msg: string;
  checkout_id?: string;
  goods_id?: string;
}

export interface PGOptions extends Omit<CheckoutOrderSchema, 'paymentGatewayParameter'> {
  paymentGatewayParameter: CheckoutPaymentGateWaySchema;
  type?: CheckoutType;
}

export const ORDER_COMPLETE_REDIRECT_TARGET_PATH = {
  MyOrders: '/mypage/orders',
  // 브라우저 기반의 경우는 추후 상의가 필요함
  Home: '/',
} as const;

export type OrderCompleteRedirectTargetType =
  typeof ORDER_COMPLETE_REDIRECT_TARGET_PATH[keyof typeof ORDER_COMPLETE_REDIRECT_TARGET_PATH];

export const CHECKOUT_TYPE = {
  DEFAULT: 'default',
  LIVE: 'live',
} as const;

export type CheckoutType = typeof CHECKOUT_TYPE[keyof typeof CHECKOUT_TYPE];

export const CREATE_ORDER_ERROR = {
  // 주문시 본인인증 오류
  NOT_IDENTIFIED: 'E500217',
};
