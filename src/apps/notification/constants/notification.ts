/**
 * Query Keys
 */
export const NOTIFICATION_QUERY_KEY = 'NOTIFICATION_QUERY_KEY';

/**
 * 도메인 유형
 *
 * @see {@link https://www.notion.so/a2e90ae56c0f444fa913a0b11674134a?v=8228ebd244ed420c95c44cc32ff7fe6d}
 */
export const DomainTypes = {
  // 클레임
  CLAIM: 'CLAIM',
  // 팔로잉
  FOLLOWING: 'FOLLOWING',
  // 라이브 (경매_낙찰)
  LIVE: 'LIVE',
  // 주문 / 배송
  ORDER_SHIPPING: 'ORDER_SHIPPING',
  // 쿠폰 / 적립금
  COUPON_POINT: 'COUPON_POINT',
  // 이벤트
  EVENT: 'EVENT',
  // 기타 (커스텀)
  ETC: 'ETC',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DomainTypes = ValueOf<typeof DomainTypes>;

/**
 * 알림 유형
 *
 * @see {@link https://www.notion.so/5f33bf84a8b94126ab88b7ee8c4991e4?v=3169c467028c4ea68121347bdabad0c6}
 */
export const TemplateTypes = {
  // 낙찰 상품 자동 결제 성공 안내
  AUCTION_PAYMENT_COMPLETED: 'AUCTION_PAYMENT_COMPLETED',
  // 낙찰 상품 결제 실패 안내
  AUCTION_PAYMENT_FAILED: 'AUCTION_PAYMENT_FAILED',
  // 낙찰 축하 안내 (수동결제)
  AUCTION_PAYMENT_INFO: 'AUCTION_PAYMENT_INFO',
  // 라이브 시작 알림
  LIVE_ON_AIR: 'LIVE_ON_AIR',
  // 라이브 드로우 당첨 축하 안내
  DRAW_WINNER_INFO: 'DRAW_WINNER_INFO',
  // 라이브 드로우 당첨 상품 구매 (상품상세)
  DRAW_WINNER_TO_GOODS: 'DRAW_WINNER_TO_GOODS',
  // 라이브 드로우 추가 정보 수집 (외부링크)
  DRAW_WINNER_TO_EXTERNAL: 'DRAW_WINNER_TO_EXTERNAL',
  // 라이브 드로우 기본 (이벤트 탭)
  DRAW_WINNER_TO_EVENT: 'DRAW_WINNER_TO_EVENT',
  // 주문 전체 취소 완료
  ORDER_CANCELED: 'ORDER_CANCELED',
  // 주문 완료
  ORDER_COMPLETED: 'ORDER_COMPLETED',
  // 주문 부분 취소 신청
  ORDER_PARTIAL_CANCEL_APPLIED: 'ORDER_PARTIAL_CANCEL_APPLIED',
  // 주문 부분 취소 완료
  ORDER_PARTIAL_CANCEL_COMPLETED: 'ORDER_PARTIAL_CANCEL_COMPLETED',
  // 반품 신청 (v1 spec out)
  RETURN_APPLIED: 'RETURN_APPLIED',
  // 반품 접수
  RETURN_CONFIRMED: 'RETURN_CONFIRMED',
  // 반품 완료
  RETURN_COMPLETED: 'RETURN_COMPLETED',
  // 교환 신청 (v1 spec out)
  EXCHANGE_APPLIED: 'EXCHANGE_APPLIED',
  // 교환 접수
  EXCHANGE_CONFIRMED: 'EXCHANGE_CONFIRMED',
  // 교환 완료
  EXCHANGE_COMPLETED: 'EXCHANGE_COMPLETED',
  // 배송 시작
  SHIPPING_STARTED: 'SHIPPING_STARTED',
  // 배송 완료
  SHIPPING_COMPLETED: 'SHIPPING_COMPLETED',
  // 콘텐츠 공개 알림 (프리즘 스토리, 라이브 티저)
  SHOWCASE_CONTENTS: 'SHOWCASE_CONTENTS',
  // 1:1 문의 답변 알림
  CLAIM_QNA: 'QNA',
  // 상품 판매 시작 알림
  SALES_GOODS: 'SALES_GOODS',
  // 상품 판매 시작 1시간 전 알림
  REMIND_GOODS: 'REMIND_GOODS',
  // 리뷰 알림
  WRITABLE_REVIEW: 'WRITABLE_REVIEW',
  // Welcome 쿠폰 지급 완료
  WELCOME_COUPON: 'WELCOME_COUPON',
  // 쿠폰 만료 리마인드
  REMIND_COUPON: 'REMIND_COUPON',
  // 친구 초대 적립금 지급
  INVITED_FRIEND_BENEFIT: 'INVITED_FRIEND_BENEFIT',
  // 항공권 주문 완료시
  INPUT_FORM_DEADLINE: 'INPUT_FORM_DEADLINE',
  // 탑승자 정보 입력 독려 (마감 하루전)
  INPUT_FORM_REMIND: 'INPUT_FORM_REMIND',
  // 응모하기 완료
  ENTERED_EVENT: 'ENTERED_EVENT',
  // 체크인 날짜 선택
  CHECK_IN_SELECT: 'CHECK_IN_SELECT',
  // 체크인 날짜 선택 기한 n일 남음
  CHECK_IN_BEFORE_N_DAYS: 'CHECK_IN_BEFORE_N_DAYS',
  // 체크인 날짜 선택 기한 하루 전
  CHECK_IN_BEFORE_1_DAY: 'CHECK_IN_BEFORE_1_DAY',
  // 체크인 하루 전
  CHECK_IN_BEFORE_1_DAY_BY_DATED: 'CHECK_IN_BEFORE_1_DAY_BY_DATED',
  // 예약 확정
  RESERVATION_CONFIRMED: 'RESERVATION_CONFIRMED',
  // 예약 요청
  RESERVATION_REQUEST: 'RESERVATION_REQUEST',
  // 예약 취소
  RESERVATION_CANCEL: 'RESERVATION_CANCEL',
  // 커스텀
  CUSTOM: 'CUSTOM',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type TemplateTypes = ValueOf<typeof TemplateTypes>;

/**
 * 프로필 아이콘 유형
 */
export const ProfileIconTypes = {
  ARROW_RIGHT: 'ARROW_RIGHT',
  CALENDAR: 'CALENDAR',
  CHECKMARK: 'CHECKMARK',
  CLAIM: 'CLAIM',
  CLOSE: 'CLOSE',
  COUPON: 'COUPON',
  DELIVERY: 'DELIVERY',
  EDIT: 'EDIT',
  LUGGAGE: 'LUGGAGE',
  ORDER: 'ORDER',
  PRICE: 'PRICE',
  TAG: 'TAG',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ProfileIconTypes = ValueOf<typeof ProfileIconTypes>;
