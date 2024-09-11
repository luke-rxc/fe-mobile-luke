import { env } from '@env';

export const ORDER_COMPLETE_PATH = '/order/complete';
export const ORDER_COMPLETE_URL = `${env.endPoint.baseUrl}${ORDER_COMPLETE_PATH}`;

// 주문 정보 조회 폴링 파라미터
export const ORDER_RE_FETCH_INTERVAL = 1000;
export const ORDER_POLLING_TIMEOUT = 30000;

// 결제 모듈로 부터 받는 값
export const PAY_FAIL = 'false';

// 정책상 기본 최저 할부 금액
export const DEFAULT_MINIMUM_INSTALLMENT_AMOUNT = 50000;

export const ActionType = {
  /** 배송 */
  DEFAULT: 'DEFAULT',
  /** 비배송 - 기본 */
  NOT_ADDRESS: 'NOT_ADDRESS',
  /** 항공권  */
  AIRLINE_TICKET: 'AIRLINE_TICKET',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ActionType = ValueOf<typeof ActionType>;

export const ActionBottom: { [key in ActionType]: string } = {
  DEFAULT: '10.4rem',
  NOT_ADDRESS: '10.4rem',
  AIRLINE_TICKET: '14.8rem',
};

export const Navigation = {
  TICKET_DETAIL: 'TICKET_DETAIL',
  HOME: 'HOME',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Navigation = ValueOf<typeof Navigation>;

export const ORDER_COMPLETE_DEFAULT_TITLE = '결제를 완료했습니다';

/**
 * 주문서 가이드 메세지 노출 delay
 */
export const GUIDE_MESSAGE_DELAY = 1500;
/**
 * AOS/MWeb slide duration
 */
export const GUIDE_AOS_MESSAGES_DURATION = 800;
/**
 * 그외 slide duration
 */
export const GUIDE_DEFAULT_MESSAGES_DURATION = 500;
/**
 * slide 수치
 */
export const GUIDE_DISTANCE = 36;
