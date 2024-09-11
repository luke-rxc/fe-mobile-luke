import { GoodsType } from '@constants/goods';

/**
 * 상품상세 내에서 노출할 컨텐츠 최대 갯수
 */
export const ContentListLimit = 3;

/**
 * 상품상세 내에서 노출할 피드 최대 갯수
 */
export const FeedItemLimit = 8;

/**
 * 상품상세 > 추천 영역 피드 최소 노출 갯수
 */
export const RecommendationMinLimit = 5;

/**
 * 상품상세 > 리뷰 숏컷 애니메이션 초기 Delay 값 (단위: Second)
 */
export const ReviewShortcutDelay = 0.5;

/**
 * LiveActivity 노출 시간 (8시간)
 *
 * Timestamp: 밀리초 * 초 * 분 * 시간
 * */
export const ShowLiveActivityTime = 1000 * 60 * 60 * 8;

/**
 * 상품상세 swiper dynamic bullet 갯수
 */
export const DynamicBulletLimit = 8;

/**
 * 상품상세 swiper dynamic bullet size (width 8 + margin 10)
 */
export const DynamicBulletSize = 18;

/**
 * Query Keys
 */
export const QueryKeys = {
  GOODS: 'goods',
  CALENDAR: 'CALENDAR',
  CALENDAR_OPTIONS: 'CALENDAR_OPTIONS',
  DATETIMES: 'DATE_TIMES',
  LAYOUT_OPTIONS: 'LAYOUT_OPTIONS',
  INFORMATION: 'goods/information',
  DEALS: 'goods/deals',
  DETAIL: 'goods/detail',
  DETAIL_INFO: 'goods/detail/info',
  DETAIL_INFO_ONDA: 'goods/detail/info/onda',
  COUPON: 'goods/coupon',
  WISH: 'goods/wish',
  LIVE: 'goods/live',
  CONTENTS: 'goods/contents',
  NOTIFICATION: 'goods/notification',
  REVIEW: 'goods/review',
  REVIEW_SHORTCUT: 'goods/reviewShortcut',
  RECOMMENDATION: 'goods/recommendation',
  PRICE_LIST: 'goods/price-list',
};

/**
 * 상품 페이지 이름
 */
export const GoodsPageName = {
  DETAIL: '상세 이미지',
  DETAIL_INFO: '이용 안내',
  CS: '구매 배송/환불/교환 안내',
  INFO: '상품고시/판매자정보',
  INFO_TICKET: '상품고시/취소/환불 안내',
  PRICE_LIST: '날짜별 가격',
};

/**
 * Initialze
 */
export const PageLoadStatus = {
  LOADING: 'LOADING',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PageLoadStatus = ValueOf<typeof PageLoadStatus>;

export const GoodsMessage = {
  COUPON_DOWNLOADED: '쿠폰이 모두 다운로드 되었습니다',
  CART_SAVED: '쇼핑백에 추가했습니다',
  COPY_GOODS_MODEL: '모델명을 복사했습니다',
  ERROR_ORDER_CHECKOUT_ID: '주문 페이지 이동이 실패하였습니다',
  ERROR_NOTHING_LIST: '리스트가 없습니다',
  ERROR_NETWORK: '일시적인 오류가 발생하였습니다',
  ERROR_PAGE: '상품을 찾을 수 없습니다',
  ERROR_NOTHING_CONTENT: '등록된 컨텐츠가 없습니다',
};

/**
 * 웹뷰 내에서 Reload 시 Reload Type
 */
export const ReloadInfoType = {
  // wish list 재로드
  WISH: 'WISH',
  // coupon list 재로드
  COUPON: 'COUPON',
  // notification 재로드
  NOTIFICATION: 'NOTIFICATION',
  // wish + coupon + notification 재로드
  ALL: 'ALL',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ReloadInfoType = ValueOf<typeof ReloadInfoType>;

export const FeedType = {
  GOODS: 'GOODS',
  REVIEW: 'REVIEW',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type FeedType = ValueOf<typeof FeedType>;

/**
 * 추천 리스트 타입
 */
export const RecommendationType = {
  RELATION: 'relation',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type RecommendationType = ValueOf<typeof RecommendationType>;

/**
 * Drawer 타입
 */
export const GoodsDrawerType = {
  PRICE_LIST: 'PRICE_LIST',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GoodsDrawerType = ValueOf<typeof GoodsDrawerType>;

export const GoodsSalesSchedulerType = {
  PREORER: GoodsType.PREORDER,
  NORMAL: GoodsType.NORMAL,
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GoodsSalesSchedulerType = ValueOf<typeof GoodsSalesSchedulerType>;

/**
 * 이용 안내 타입
 */
export const GoodsDetailInfoType = {
  DEFAULT: 'DEFAULT',
  ONDA: 'ONDA',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GoodsDetailInfoType = ValueOf<typeof GoodsDetailInfoType>;

/**
 * 상품 객실 태그 영역 타이틀
 */
export const GoodsAccomInfoTitle = {
  CHECK_IN_OUT: '체크인 | 체크아웃',
  PERSON: '기준 인원 | 최대 인원',
  DETAIL: '구성',
  AMENITY: '객실 내 시설',
} as const;
