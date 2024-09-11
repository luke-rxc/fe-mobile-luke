/**
 * 상품 상태
 * @references
 * - https://www.notion.so/Service-4b067f1d19934b19b981cdf3ec175258#5911497017b84b469c285818f3fd65fc
 */
/**
 * 상품 타입 : 일반상품, 경매상품, 프리오더상품
 */
export const GoodsType = {
  /** 일반 상품 */
  NORMAL: 'NORMAL',
  /** 경매 상품 */
  AUCTION: 'AUCTION',
  /** 프리 오더 */
  PREORDER: 'PREORDER',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GoodsType = ValueOf<typeof GoodsType>;

/**
 * 상품 상태 - 프리오더
 */
export const GoodsPreOrderStatusType = {
  /** 판매 예정 */
  PREORDER_WAIT: 'PREORDER_WAIT',
  /** 프리오더 진행중 */
  PREORDER: 'PREORDER',
  /** 프리오더 종료 - 판매 종료 : 구매가능 재고수량이 없거나 상품의 상태가 품절 */
  PREORDER_RUNOUT: 'PREORDER_RUNOUT',
  /** 프리오더 종료 : 구매가능 수량이 있지만 판매종료일시가 지나서 판매종료된 상태 */
  PREORDER_CLOSE: 'PREORDER_CLOSE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GoodsPreOrderStatusType = ValueOf<typeof GoodsPreOrderStatusType>;

/**
 * 상품 상태 - 경매
 */
export const GoodsAuctionStatusType = {
  /** 판매 예정 */
  BID_WAIT: 'BID_WAIT',
  /** 경매 진행중 */
  BID: 'BID',
  /** 판매 종료 */
  BID_RUNOUT: 'BID_RUNOUT',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GoodsAuctionStatusType = ValueOf<typeof GoodsAuctionStatusType>;

/**
 * 상품 상태 - 일반
 */
export const GoodsNormalStatusType = {
  /** 판매 예정 */
  WAIT: 'WAIT',
  /** 판매중 */
  NORMAL: 'NORMAL',
  /** 품절 */
  RUNOUT: 'RUNOUT',
  /** 판매 중지 */
  UNSOLD: 'UNSOLD',
  /** 판매 종료 */
  CLOSE: 'CLOSE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GoodsNormalStatusType = ValueOf<typeof GoodsNormalStatusType>;

/**
 * 상품 상태 - 전체
 */
export type GoodsStatusType = GoodsPreOrderStatusType | GoodsAuctionStatusType | GoodsNormalStatusType;

/**
 * 상품분류
 */
export const GoodsKind = {
  /** 실물 상품 */
  REAL: 'REAL',
  /** 티켓 연동 */
  TICKET_NORMAL: 'TICKET_NORMAL',
  /** 티켓 일반 */
  TICKET_AGENT: 'TICKET_AGENT',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GoodsKind = typeof GoodsKind[keyof typeof GoodsKind];

/**
 * 티켓분류
 */
export const TikcetKind = {
  /** 숙박 */
  STAY: 'STAY',
  /** 문화 */
  CULTURE: 'CULTURE',
  /** 여행 */
  TRAVEL: 'TRAVEL',
  /** 바우처 */
  VOCHER: 'VOCHER',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type TikcetKind = ValueOf<typeof TikcetKind>;

/**
 * 웹 내에서 로그인 이후 Action
 */
export const WebLoginActionType = {
  // wish list 재로드
  WISH: 'WISH',
  // coupon list 재로드
  COUPON: 'COUPON',
  // 구매하기, 장바구니 버튼
  BUY: 'BUY',
  // 1:1 문의
  CS: 'CS',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type WebLoginActionType = ValueOf<typeof WebLoginActionType>;

/**
 * 상품 Sorting 기준
 */
export const GoodsSortingType = {
  // 추천순
  RECOMMENDATION: 'RECOMMENDATION',
  // 인기순
  POPULARITY: 'POPULARITY',
  // 최신순
  NEWEST: 'NEWEST',
  // 낮은 가격순
  PRICE_LOW: 'PRICE_LOW',
  // 높은 가격순
  PRICE_HIGH: 'PRICE_HIGH',
  // 높은 할인율순
  DISCOUNT_HIGH: 'DISCOUNT_HIGH',
} as const;

/**
 * 옵션 Sorting 기준
 */
export const OptionSortingType = {
  // 낮은 가격순
  PRICE_LOW: 'PRICE_LOW',
  // 최신 날짜순
  LATEST_DATE: 'LATEST_DATE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OptionSortingType = ValueOf<typeof OptionSortingType>;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GoodsSortingType = ValueOf<typeof GoodsSortingType> | OptionSortingType;

/**
 * 상품 Sorting 옵션
 */
export const SortingOptions: Array<{ label: string; value: GoodsSortingType }> = [
  { label: '추천순', value: GoodsSortingType.RECOMMENDATION },
  { label: '인기순', value: GoodsSortingType.POPULARITY },
  { label: '최신순', value: GoodsSortingType.NEWEST },
  { label: '낮은 가격순', value: GoodsSortingType.PRICE_LOW },
  { label: '높은 가격순', value: GoodsSortingType.PRICE_HIGH },
  { label: '높은 할인율순', value: GoodsSortingType.DISCOUNT_HIGH },
];

/**
 * FloatingBanner Type
 */
export const FloatingBannerType = {
  GOODS_CTA: 'GOODS_CTA',
  LIVE_SNACKBAR: 'LIVE_SNACKBAR',
  CART_SNACKBAR: 'CART_SNACKBAR',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type FloatingBannerType = ValueOf<typeof FloatingBannerType>;

/**
 * FloatingBanner 순서
 */
export const FloatingBannerOrder = {
  TOP: 1,
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type FloatingBannerOrder = ValueOf<typeof FloatingBannerOrder>;
