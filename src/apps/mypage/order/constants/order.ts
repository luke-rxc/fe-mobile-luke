/** 주문목록 Query Key */
export const MYPAGE_ORDER_LIST_QUERY_KEY = 'MYPAGE_ORDER_LIST_QUERY_KEY';
/** 주문상세 Query Key */
export const MYPAGE_ORDER_DETAILS_QUERY_KEY = 'MYPAGE_ORDER_DETAILS_QUERY_KEY';
/** 주문상세 티켓 예약 캘린더 조회 Query Key */
export const MYPAGE_ORDER_TICKET_CALENDER_QUERY_KEY = 'MYPAGE_ORDER_TICKET_CALENDER_QUERY_KEY';

/**
 * 티켓 날짜 지정 관련 initialValues/ReceiveValues Event Type
 */
export const TicketReservationEventType = {
  // datepicker calendar open(for initialValues)
  ON_CALENDAR_OPEN: 'onTicketReservationCalendarOpen',
  // datepicker calendar close(for ReceiveValues)
  ON_CALENDAR_CLOSE: 'onTicketReservationCalendarClose',
} as const;

/** 티켓 타입 */
export const TicketType = {
  // 숙박권_날짜지정
  BOOKING_DATED: 'BOOKING_DATED',
  // 숙박권_날짜미지정
  BOOKING_UNDATED: 'BOOKING_UNDATED',
  // 금액권
  MONEY: 'MONEY',
  // 교환권
  EXCHANGE: 'EXCHANGE',
} as const;

/** 티켓 확정 타입 */
export const TicketConfirmType = {
  /** 날짜 결정시 확인 후 확정되는 티켓 */
  WAIT: 'WAIT',
  /** 날짜 결정시 바로 확정되는 티켓 */
  CONFIRMED: 'CONFIRMED',
  /** 기타 => 레거시로 인한 타입으로 숙박 예약 프로젝트 이전에 구매한 티켓 */
  NONE: 'NONE',
} as const;

/** TicketConfirmType에 따른 라벨값을 가지는 오브젝트 */
export const TicketConfirmTypeText = {
  [TicketConfirmType.WAIT]: '요청',
  [TicketConfirmType.CONFIRMED]: '확정',
} as const;

/**
 * Error Code - 티켓 확정 요청
 * @see - https://www.notion.so/rxc/Service-23ceca2fc159488ba232a46d32c79994?pvs=4#79a6ac4c0c4947c382b99ec68980f167
 */
export const TicketReservationErrorCode = {
  /** 기한 만료 */
  EXPIRED: 'E500K02',
  /** 중복 요청 */
  REQUESTED: 'E500K03',
  /** 취소된 주문 */
  CANCELLED: 'E500K04',
  /** 선택 불가능 날짜 */
  INVALID: 'E500K05',
} as const;

/**
 * Error Code - 티켓(숙박) 예약 캘린더 조회
 */
export const TicketCalendarErrorCode = {
  /** 재고 없음 */
  EMPTY: 'E500K01',
} as const;
