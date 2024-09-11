/**
 * close 이벤트 파라미터 type
 */
export const CALL_WEB_EVENT = {
  /** 좌석 점유 시간 만료 이벤트 */
  ON_EXPIRED: 'onExpired',
};

/**
 * 좌석 점유 타이머 AOS APP duration
 */
export const APP_AOS_SEAT_TIMER_DURATION = 800;
/**
 * 좌석 점유 타이머 기본 duration
 */
export const DEFAULT_SEAT_TIMER_DURATION = 500;
/**
 * 좌석 점유 시간이 3초 미만으로 남는 경우 transition 정지 처리를 위한 제약 시간
 */
export const TRANSITION_STOP_TIME = 3000;
/**
 * 좌석 점유 타이머 딜레이 시간
 */
export const SEAT_TIMER_DELAY = 1500;
/**
 * 좌석 점유 타이머 slide 수치
 */
export const SEAT_TIMER_DISTANCE = 36;
/**
 * 좌석 점유 타이머 slide 횟수
 */
export const SEAT_TIMER_SLIDE_COUNT = 2;
/**
 * 좌석 점유 타이머 prefix
 */
export const SEAT_TIMER_PREFIX = '좌석 선점';
/**
 * 좌석 점유 타이머 안내 문구
 */
export const SEAT_TIMER_DESCRIPTION_MESSAGE = '시간 내에 결제해주세요';
