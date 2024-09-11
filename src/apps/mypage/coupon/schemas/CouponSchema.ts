/**
 * Coupon List Schema
 */
export type CouponsSchema = LoadMoreResponseSchema<CouponSchema, { count: number }>;

/**
 * Coupon Item Schema
 */
export interface CouponSchema {
  coupon: {
    couponId: number;
    display: {
      /** 쿠폰명 */
      name: string;
      /** 쿠폰 타이틀(할인내용) */
      title: string;
      /** 사용 조건 | 사용 제한 */
      label?: string;
      /** 쿠폰 이미지 */
      image?: ImageResponse;
    };
    /** 쿠폰 타입 */
    useType: 'CART' | 'GOODS';
    /** 쿠폰 사용금액 및 조건 */
    salePolicy: {
      /** 할인율 | 할인금액 */
      costType: 'PERCENT' | 'WON';
      /** 최대 할인액 */
      maxPrice: number;
      /** 최소 주문액 */
      minPrice: number;
      /** 할인율 */
      percent: number;
      /** 할인가격 */
      price: number;
    };
    issueType: 'DOWNLOAD' | 'KEYWORD' | 'WELCOME';
    issuePeriod: {
      issuePeriodType: 'DAY' | 'PERIOD';
      startDateTime: string;
      expiredDateTime: string;
      downloadAfterDay: number;
    };
  };
  /** 다운로드 아이디 */
  downloadId: number;
  /** 만료일(유효기간) */
  expiredDate: number;
}

/**
 * 이미지 데이터 Schema
 */
export interface ImageResponse {
  id: number;
  path: string;
  blurHash?: string;
  width?: number;
  height?: number;
}

/**
 * 무한스크롤을 위한 로드모어 API 데이터의 공통 Schema
 */
export interface LoadMoreResponseSchema<T = unknown, M = Record<string, unknown>> {
  content: T[];
  metadata: M;
  nextParameter: string | null;
}
