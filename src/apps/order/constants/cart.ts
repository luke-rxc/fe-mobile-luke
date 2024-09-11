export const UN_SELECTED_PROVIDER_PRICE = {
  orderPrice: 0,
  totalSalesPrice: 0,
  totalShippingCost: 0,
};

export const UN_SELECTED_SHIPPING_GROUP_PRICE = {
  shippingCost: 0,
  totalSalesPrice: 0,
};

// 장바구니 수량선택 화면에 노출되는 셀렉트 박스 항목 갯수
export const SELECT_QUANTITY_LIMIT = 5;

export const CART_PAGE_LOAD_TYPE = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  NORMAL_ERROR: 'NORMAL_ERROR',
} as const;

export type CartPageLoadType = typeof CART_PAGE_LOAD_TYPE[keyof typeof CART_PAGE_LOAD_TYPE];

export const QUANTITY_TYPE = {
  SUCCESS: 'SUCCESS',
  LACK_STOCK_ERROR: 'LACK_STOCK',
  NORMAL_ERROR: 'NORMAL_ERROR',
} as const;

export type QuantityType = typeof QUANTITY_TYPE[keyof typeof QUANTITY_TYPE];

// 사용자 입력 가능 최대 수량
export const USER_PURCHASABLE_STOCK = 99;

// 구매시 성인인증 오류
export const ADULT_REQUIRED_ERROR = 'E500441';
