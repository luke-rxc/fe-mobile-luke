/** 요일 */
export type DayOfWeekSchema = '월' | '화' | '수' | '목' | '금' | '토' | '일' | '오늘';

/** 달력 정보 (일단위) */
export interface CalendarDaysSchema {
  /** 일자 */
  day: number;
  /** 요일 */
  dayOfWeek: DayOfWeekSchema;
  /** 활성화 여부 */
  enable: boolean;
  /** 체크아웃만 가능 여부 */
  checkoutOnly: boolean;
  /** 구매가능 수량 */
  purchasableStock: number;
  /** 최소 가격 */
  minPrice?: number;
  /** 최대 가격 */
  maxPrice?: number;
}

/** 달력 정보 (월단위) */
export interface MonthsSchema {
  /** 년 정보 */
  year: number;
  /** 월 정보 */
  month: number;
  /** 일단위 정보 */
  days: CalendarDaysSchema[];
}

/** 달력 스키마 */
export interface CalendarSchema {
  /** 달력 정보 (월단위) */
  months: MonthsSchema[];
  /** 달력 시작일 */
  startDate: number;
  /** 달력 종료일 */
  endDate: number;
  /** 연박 정보 (박수) */
  stayNights: number;
  /** 연박 정보 (일수) */
  stayDays?: number;
  /**
   * @todos V2 로 마이그레이션시 userMaxPurchaseEa, userFixedPurcahaseEa 를 GoodsCalendarSchema 에서 정의
   * */
  /** 최대 구매가능 수량 */
  userMaxPurchaseEa?: number;
  /** 고정 구매 수량 */
  userFixedPurchaseEa?: number;
}
