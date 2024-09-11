export const CartLogEventTypes = {
  // 장바구니 진입
  LogViewCart: 'cart.view_cart',
  // 장바구니에서 상품 삭제 시
  LogRemoveFromCart: 'cart.remove_from_cart',
  // 장바구니 > 구매하기 버튼 탭 시
  LogTabPurchase: 'cart.tab_purchase',
  // 장바구니 -> 연령인증
  LogViewIdentifyAdult: 'cart.view_identify_adult',
  // 연령인증 -> 장바구니
  LogCompleteIdentifyAdult: 'cart.complete_identify_adult',
  // 최근본 상품 탭 시
  LogTabRecentGoods: 'cart.tab_recent_goods',
} as const;

export const CartLogWebBranchTypes = {
  // 장바구니 진입
  LogViewCart: 'VIEW_CART',
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CartEventTypes = ValueOf<typeof CartLogEventTypes>;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CartWebBranchTypes = ValueOf<typeof CartLogWebBranchTypes>;

export const OrderLogEventTypes = {
  // 주문서 진입 시
  LogViewCheckout: 'order.view_checkout',
  // 경매 주문서 진입 시
  LogViewAuctionCheckout: 'order.view_auction_checkout',
  // 주문자 정보 전화번호 변경완료 시
  LogCompleteIdentify: 'order.complete_identify',
  // 주문서에서 배송지 추가 시
  LogAddShippingAddress: 'order.add_shipping_address',
  // 주문서에서 간편결제 추가 시
  LogAddPrizmPay: 'order.add_prizm_pay',
  // 주문서에서 결제수단 선택 시
  LogTabPaymentType: 'order.tab_payment_type',
  // 주문서에서 결제하기 버튼 클릭시
  LogTabCheckout: 'order.tab_checkout',
  // 주문서에서 결제화면 진입 시
  LogViewCheckoutOnPG: 'order.view_checkout_on_pg',
  // 주문 완료 시
  LogCompleteOrder: 'order.complete_order',
  // 주문상세 버튼 탭 시
  LogTabToOrderDetail: 'order.tab_to_order_detail',
  // 홈으로이동 버튼 탭 시
  LogTabToHome: 'order.tab_to_home',
  // 	부가정보 입력 위해 주문상세로 이동 시
  LogTabToInputForm: 'order.tab_to_input_form',
  // 좌석 선점 시간 종료 시 뜨는 confirm message 노출 시
  LogImpressionTimeout: 'order.impression_timeout_confirm',
} as const;

export const OrderLogWebBranchTypes = {
  // 주문서에서 간편결제 추가 시
  LogAddPrizmPay: 'ADD_PAYMENT_INFO',
  // 주문 완료 시
  LogCompleteOrder: 'PURCHASE',
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderEventTypes = ValueOf<typeof OrderLogEventTypes>;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderWebBranchTypes = ValueOf<typeof OrderLogWebBranchTypes>;

export const LogEventWebFacebookTypes = {
  LogCompleteOrder: 'Purchase',
  LogTabCheckout: 'InitiateCheckout',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventWebFacebookTypes = typeof LogEventWebFacebookTypes[keyof typeof LogEventWebFacebookTypes];
