/**
 * Deep Link
 *
 * @see {@link https://www.notion.so/Deep-Link-URI-ad48103d06f346c8847b9342ca8d299c}
 */

export const AppLinkTypes = {
  AUTH_SMS: 'AUTH_SMS',
  SIGN_IN: 'SIGN_IN',
  VERIFICATION_CODE: 'VERIFICATION_CODE',
  HOME: 'HOME',
  DISCOVER: 'DISCOVER',
  MEMBER_AUTH_ADULT: 'MEMBER_AUTH_ADULT',
  BAG: 'BAG',
  MYPAGE: 'MYPAGE',
  ORDER_HISTORY: 'ORDER_HISTORY',
  ORDER_DETAIL: 'ORDER_DETAIL',
  CONTENT: 'CONTENT',
  LIVE: 'LIVE',
  LIVE_AUTH_AUCTION: 'LIVE_AUTH_AUCTION',
  SHOWROOM: 'SHOWROOM',
  GOODS: 'GOODS',
  GOODS_CONTENT: 'GOODS_CONTENT',
  GOODS_DETAIL: 'GOODS_DETAIL',
  GOODS_INFO: 'GOODS_INFO',
  GOODS_INFO_TICKET: 'GOODS_INFO_TICKET',
  GOODS_CS: 'GOODS_CS',
  SHOWROOM_LIST: 'SHOWROOM_LIST',
  SUBSCRIBED_SHOWROOM: 'SUBSCRIBED_SHOWROOM',
  CHECKOUT: 'CHECKOUT',
  CHECKOUT_AUCTION: 'CHECKOUT_AUCTION',
  PAY: 'PAY',
  NOTIFICATIONS: 'NOTIFICATIONS',
  COUPON: 'COUPON',
  COUPON_REGISTER: 'COUPON_REGISTER',
  RECENT_GOODS_LIST: 'RECENT_GOODS_LIST',
  WISHLIST: 'WISHLIST',
  POINT: 'POINT',
  MANAGE_PAY: 'MANAGE_PAY',
  MANAGE_PAY_REGISTER: 'MANAGE_PAY_REGISTER',
  MANAGE_PAY_EDIT: 'MANAGE_PAY_EDIT',
  MANAGE_DELIVERY: 'MANAGE_DELIVERY',
  MANAGE_DELIVERY_EDIT: 'MANAGE_DELIVERY_EDIT',
  MANAGE_DELIVERY_REGISTER: 'MANAGE_DELIVERY_REGISTER',
  MANAGE_DELIVERY_SELECTED: 'MANAGE_DELIVERY_SELECTED',
  SEARCH_ADDRESS: 'SEARCH_ADDRESS',
  CS_NOTICE_LIST: 'CS_NOTICE_LIST',
  CS_NOTICE_DETAIL: 'CS_NOTICE_DETAIL',
  CS_EVENT_LIST: 'CS_EVENT_LIST',
  CS_EVENT_DETAIL: 'CS_EVENT_DETAIL',
  CS_FAQ_LIST: 'CS_FAQ_LIST',
  CS_FAQ_DETAIL: 'CS_FAQ_DETAIL',
  CS_QNA_LIST: 'CS_QNA_LIST',
  CS_QNA_DETAIL: 'CS_QNA_DETAIL',
  CS_QNA_REGISTER_GENERAL: 'CS_QNA_REGISTER_GENERAL',
  CS_QNA_REGISTER_GOODS: 'CS_QNA_REGISTER_GOODS',
  CS_QNA_REGISTER_ORDER: 'CS_QNA_REGISTER_ORDER',
  SETTING: 'SETTING',
  NOTIFICATION_SETTING: 'NOTIFICATION_SETTING',
  PROFILE_SETTING: 'PROFILE_SETTING',
  ACCOUNT_SETTING: 'ACCOUNT_SETTING',
  SHARE: 'SHARE',
  WEB: 'WEB',
  EXTERNAL_WEB: 'EXTERNAL_WEB',
  POLICY_TERM: 'POLICY_TERM',
  POLICY_PRIVACY: 'POLICY_PRIVACY',
  POLICY_PRIVACY_PROVIDER: 'POLICY_PRIVACY_PROVIDER',
  AUCTION_POLICY: 'AUCTION_POLICY',
  FINANCE_POLICY: 'FINANCE_POLICY',
  SCHEDULE: 'SCHEDULE',
  SCHEDULE_TEASER: 'SCHEDULE_TEASER',
  SCHEDULE_LIVE: 'SCHEDULE_LIVE',
  SEARCH: 'SEARCH',
  /** @deprecated 검색 v2 전환 후 제거 예정 */
  SEARCH_RESULT: 'SEARCH_RESULT',
  SEARCH_GOODS_LIST: 'SEARCH_GOODS_LIST',
  SEARCH_SHOWROOM_LIST: 'SEARCH_SHOWROOM_LIST',
  SEARCH_CONTENT_LIST: 'SEARCH_CONTENT_LIST',
  SEARCH_SCHEDULE_LIVE_LIST: 'SEARCH_SCHEDULE_LIVE_LIST',
  SECTION_SHOWROOM: 'SECTION_SHOWROOM',
  SECTION_SHOWROOM_REGION: 'SECTION_SHOWROOM_REGION',
  REVIEW_WRITE: 'REVIEW_WRITE',
  REVIEW_GOODS_LIST: 'REVIEW_GOODS_LIST',
  REVIEW_LIST: 'REVIEW_LIST',
  REVIEW_DETAIL: 'REVIEW_DETAIL',
  DRAW_GOODS: 'DRAW_GOODS',
  ADDITIONAL_INFO: 'ADDITIONAL_INFO',
  THRILL: 'THRILL',
  THRILL_KEYWORD: 'THRILL_KEYWORD',
  SECTION_GOODS_RECOMMENDATION: 'SECTION_GOODS_RECOMMENDATION',
  SECTION_DISCOVER: 'SECTION_DISCOVER',
  MANAGE_ORDER_TICKET_CALENDER: 'MANAGE_ORDER_TICKET_CALENDER',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AppLinkTypes = ValueOf<typeof AppLinkTypes>;

export const AppLink: {
  [k in AppLinkTypes]: string;
} = {
  // 문자 인증
  [AppLinkTypes.AUTH_SMS]: '/smsauthentication\\?modalStyle=:modalStyle?',
  // 로그인, 회원 가입
  [AppLinkTypes.SIGN_IN]: '/signin',
  // 인증 코드
  [AppLinkTypes.VERIFICATION_CODE]: '/verificationcode/:verificationCode',
  // Home Tab
  [AppLinkTypes.HOME]: '/home',
  // Discover Tab
  [AppLinkTypes.DISCOVER]: '/discover',
  // Member > 성인인증
  [AppLinkTypes.MEMBER_AUTH_ADULT]: '/adultauthentication',
  // Bag Tab
  [AppLinkTypes.BAG]: '/bag',
  // MyPage Tab
  [AppLinkTypes.MYPAGE]: '/mypage\\?reload=:isReload?',
  // MyPage > 주문 내역
  [AppLinkTypes.ORDER_HISTORY]: '/orders',
  // MyPage > 주문 상세
  [AppLinkTypes.ORDER_DETAIL]: '/orders/:orderId\\?section=:section?',
  // CONTENT
  [AppLinkTypes.CONTENT]: '/content/:contentType(story|teaser|exclusive|collaboration|event)/:contentCode',
  // Live
  [AppLinkTypes.LIVE]: '/live/:liveId',
  // Live 경매 인증
  [AppLinkTypes.LIVE_AUTH_AUCTION]: '/registerauctionrequiredinfo',
  // Showroom
  [AppLinkTypes.SHOWROOM]: '/showroom/:showroomCode',
  // 상품
  [AppLinkTypes.GOODS]: '/goods/:goodsCode',
  // 상품 > 컨텐츠 리스트
  [AppLinkTypes.GOODS_CONTENT]: '/showroom/storylist/:showroomId',
  // 상품 > 상품상세
  [AppLinkTypes.GOODS_DETAIL]: '/goodsdetail/:goodsId',
  // 상품 > 상품고시
  [AppLinkTypes.GOODS_INFO]: '/goodsinfo/:goodsId',
  // 상품 > 상품고시/환불/취소 (티켓)
  [AppLinkTypes.GOODS_INFO_TICKET]: '/ticketgoodsinfo/:goodsId',
  // 상품 > 배송, 교환, 환불 정보
  [AppLinkTypes.GOODS_CS]: '/goodscs/:goodsId',
  // List : Showroom
  [AppLinkTypes.SHOWROOM_LIST]: '/showroomlist/:keywordId?',
  // List : 상품
  [AppLinkTypes.SECTION_DISCOVER]: '/goodslist/:sectionId?',
  // Subscribed Showroom
  [AppLinkTypes.SUBSCRIBED_SHOWROOM]: '/subscribedshowroom',
  // 주문
  [AppLinkTypes.CHECKOUT]: '/checkout/:checkoutId',
  // 주문(경매)
  [AppLinkTypes.CHECKOUT_AUCTION]: '/auctioncheckout/:auctionId',
  // 결제
  [AppLinkTypes.PAY]: '/pay/:checkoutId',
  // 알림
  [AppLinkTypes.NOTIFICATIONS]: '/notifications',
  // 쿠폰
  [AppLinkTypes.COUPON]: '/coupon',
  // 쿠폰 등록
  [AppLinkTypes.COUPON_REGISTER]: '/registercoupon\\?code=:encodedCouponCode?',
  // 최근 본 상품
  [AppLinkTypes.RECENT_GOODS_LIST]: '/recentgoodslist',
  // Wish List
  [AppLinkTypes.WISHLIST]: '/wishlist',
  // Point List
  [AppLinkTypes.POINT]: '/point',
  // 결제 카드 관리
  [AppLinkTypes.MANAGE_PAY]: '/managepay',
  // 결제 카드 등록
  [AppLinkTypes.MANAGE_PAY_REGISTER]: '/registerpay',
  // 결제 카드 별칭 수정
  [AppLinkTypes.MANAGE_PAY_EDIT]: '/editpay/:payId',
  // 배송지 관리
  [AppLinkTypes.MANAGE_DELIVERY]: '/managedelivery',
  // 배송지 수정
  [AppLinkTypes.MANAGE_DELIVERY_EDIT]: '/editdelivery/:shippingId',
  // 배송지 관리
  [AppLinkTypes.MANAGE_DELIVERY_REGISTER]: '/registerdelivery',
  // 배송지 관리 - 선택
  [AppLinkTypes.MANAGE_DELIVERY_SELECTED]: '/selectdelivery',
  // 배송지 우편번호 검색
  [AppLinkTypes.SEARCH_ADDRESS]: '/searchaddress',
  // 고객센터 > 공지사항 목록
  [AppLinkTypes.CS_NOTICE_LIST]: '/notice',
  // 고객센터 > 공지사항 상세
  [AppLinkTypes.CS_NOTICE_DETAIL]: '/notice/:articleId',
  // 고객센터 > 이벤트 목록
  [AppLinkTypes.CS_EVENT_LIST]: '/event',
  // 고객센터 > 이벤트 상세
  [AppLinkTypes.CS_EVENT_DETAIL]: '/event/:articleId',
  // 고객센터 > FAQ 목록
  [AppLinkTypes.CS_FAQ_LIST]: '/faq',
  // 고객센터 > FAQ 상세
  [AppLinkTypes.CS_FAQ_DETAIL]: '/faq/:articleId',
  // 고객센터 > 1:1 문의 목록
  [AppLinkTypes.CS_QNA_LIST]: '/qna',
  // 고객센터 > 1:1 문의 상세
  [AppLinkTypes.CS_QNA_DETAIL]: '/qna/:requestId',
  // 고객센터 > 1:1 문의 등록 (일반 문의)
  [AppLinkTypes.CS_QNA_REGISTER_GENERAL]: '/registerqna\\?type=general',
  // 고객센터 > 1:1 문의 등록 (상품 문의)
  [AppLinkTypes.CS_QNA_REGISTER_GOODS]: '/registerqna\\?type=goods&goodsId=:goodsId',
  // 고객센터 > 1:1 문의 등록 (주문 문의)
  [AppLinkTypes.CS_QNA_REGISTER_ORDER]: '/registerqna\\?type=order&orderId=:orderId&optionId=:optionId',
  // 설정
  [AppLinkTypes.SETTING]: '/setting',
  // 알림 설정
  [AppLinkTypes.NOTIFICATION_SETTING]: '/notificationsetting',
  // 프로필 설정
  [AppLinkTypes.PROFILE_SETTING]: '/profilesetting',
  // Account 설정
  [AppLinkTypes.ACCOUNT_SETTING]: '/accountsetting',
  // 공유하기
  [AppLinkTypes.SHARE]: '/share',
  // Web
  [AppLinkTypes.WEB]:
    '/web/:landingType(push|modal)\\?link=:url&topBarHidden=:topBarHidden?&rootNavigation=:rootNavigation?',
  // External Web
  [AppLinkTypes.EXTERNAL_WEB]: '/externalweb\\?link=:url&barCollapsingEnabled=:barCollapsingEnabled?',
  // 이용약관
  [AppLinkTypes.POLICY_TERM]: '/termpolicy',
  // 개인정보 처리방침
  [AppLinkTypes.POLICY_PRIVACY]: '/privacypolicy\\?section=:section?',
  // 개인정보 처리방침 > 입점사 정보
  [AppLinkTypes.POLICY_PRIVACY_PROVIDER]: '/privacyProvider',
  // 경매 약관
  [AppLinkTypes.AUCTION_POLICY]: '/auctionpolicy',
  // 금융 이용약관
  [AppLinkTypes.FINANCE_POLICY]: '/financepolicy',
  // 편성표
  [AppLinkTypes.SCHEDULE]: '/schedule',
  // 편성표 티저
  [AppLinkTypes.SCHEDULE_TEASER]: '/scheduleteaser/:contentsScheduleId',
  // 라이브 편성표
  [AppLinkTypes.SCHEDULE_LIVE]: '/schedulelive',
  // 검색 메인 & 전체 결과
  [AppLinkTypes.SEARCH]: '/search\\?query=:query?',
  // 검색 결과
  [AppLinkTypes.SEARCH_RESULT]: '/search/:query\\?section=:section?',
  // 검색 결과 > Goods 목록
  [AppLinkTypes.SEARCH_GOODS_LIST]: '/search/goodslist\\?query=:query',
  // 검색 결과 > Showroom 목록
  [AppLinkTypes.SEARCH_SHOWROOM_LIST]: '/search/showroomlist\\?query=:query',
  // 검색 결과 > Content 목록
  [AppLinkTypes.SEARCH_CONTENT_LIST]: '/search/storylist\\?query=:query',
  // 검색 결과 > Live 목록
  [AppLinkTypes.SEARCH_SCHEDULE_LIVE_LIST]: '/search/schedulelivelist\\?query=:query',
  // 쇼룸 섹션 > 상세
  [AppLinkTypes.SECTION_SHOWROOM]: '/showroom/:sectionType(goodslist)/:sectionId',
  // 쇼룸 섹션 > 지역 PLP 상세
  [AppLinkTypes.SECTION_SHOWROOM_REGION]:
    '/showroom/:showroomId/accom/goodslist\\?rootPlace=:rootPlace&startDate=:startDate?&endDate=:endDate?',
  // 리뷰 작성
  [AppLinkTypes.REVIEW_WRITE]: '/review/write/:odrerItemOptionId',
  // 리뷰 리스트 v1.39.0 미만
  [AppLinkTypes.REVIEW_GOODS_LIST]: '/reviewlist/:goodsId',
  // 리뷰 리스트 v1.39.0 이상
  [AppLinkTypes.REVIEW_LIST]: '/reviewlist/:type/:id',
  // 리뷰 상세
  [AppLinkTypes.REVIEW_DETAIL]: '/review/:reviewId',
  // 이벤트 응모
  [AppLinkTypes.DRAW_GOODS]: '/applyevent/:eventId',
  // 구매상품 부가정보
  [AppLinkTypes.ADDITIONAL_INFO]: '/orderadditionalinfo/:type/:mode',
  // 숏폼 (뜨릴 단일)
  [AppLinkTypes.THRILL]: '/thrill/:thrillCode',
  // 숏폼 (뜨릴 키워드)
  [AppLinkTypes.THRILL_KEYWORD]: '/thrill/keyword/:keywordId',
  // 연관 상품 섹션 리스트
  [AppLinkTypes.SECTION_GOODS_RECOMMENDATION]: '/goods/:goodsId/recommendation/goodslist\\?type=:type',
  // 주문상세 > 날짜 지정 캘린더(모달)
  [AppLinkTypes.MANAGE_ORDER_TICKET_CALENDER]: '/mypage/orders/ticket-calendar/:exportId',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AppLink = ValueOf<typeof AppLink>;
