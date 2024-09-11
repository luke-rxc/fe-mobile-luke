/**
 * Web Link
 */

/** @todo Types로 사용이 필요할지 논의 후 결정 */
export const WebLinkTypes = {
  CHECKOUT: 'CHECKOUT',
  AUTH_SMS: 'AUTH_SMS',
  GOODS: 'GOODS',
  GOODS_CONTENT: 'GOODS_CONTENT',
  GOODS_DETAIL: 'GOODS_DETAIL',
  GOODS_DETAIL_INFO: 'GOODS_DETAIL_INFO',
  GOODS_INFO: 'GOODS_INFO',
  GOODS_INFO_TICKET: 'GOODS_INFO_TICKET',
  GOODS_CS: 'GOODS_CS',
  CONTENT: 'CONTENT',
  CONTENT_VOTE: 'CONTENT_VOTE',
  LIVE: 'LIVE',
  LIVE_AUTH_AUCTION: 'LIVE_AUTH_AUCTION',
  CART: 'CART',
  MYPAGE: 'MYPAGE',
  MYPAGE_SETTING: 'MYPAGE_SETTING',
  MYPAGE_ACCOUNT: 'MYPAGE_ACCOUNT',
  MYPAGE_WITHDRAW: 'MYPAGE_WITHDRAW',
  MYPAGE_WITHDRAW_CONFIRM: 'MYPAGE_WITHDRAW_CONFIRM',
  ORDER_HISTORY: 'ORDER_HISTORY',
  ORDER_DETAIL: 'ORDER_DETAIL',
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
  CS_QNA_REGISTER_ADDITIONAL: 'CS_QNA_REGISTER_ADDITIONAL',
  NOTIFICATIONS: 'NOTIFICATIONS',
  COUPON: 'COUPON',
  COUPON_REGISTER: 'COUPON_REGISTER',
  SHOWROOM: 'SHOWROOM',
  POINT: 'POINT',
  MANAGE_PAY: 'MANAGE_PAY',
  MANAGE_DELIVERY: 'MANAGE_DELIVERY',
  POLICY_TERM: 'POLICY_TERM',
  POLICY_PRIVACY: 'POLICY_PRIVACY',
  POLICY_PRIVACY_PROVIDER: 'POLICY_PRIVACY_PROVIDER',
  AUCTION_POLICY: 'AUCTION_POLICY',
  FINANCE_POLICY: 'FINANCE_POLICY',
  SEARCH: 'SEARCH',
  /** @deprecated 검색 v2 전환 후 제거 예정 */
  SEARCH_RESULT: 'SEARCH_RESULT',
  SEARCH_GOODS_LIST: 'SEARCH_GOODS_LIST',
  SEARCH_SHOWROOM_LIST: 'SEARCH_SHOWROOM_LIST',
  SEARCH_CONTENT_LIST: 'SEARCH_CONTENT_LIST',
  SEARCH_SCHEDULE_LIVE_LIST: 'SEARCH_SCHEDULE_LIVE_LIST',
  HOME: 'HOME',
  SECTION_DISCOVER: 'SECTION_DISCOVER',
  SECTION_CATEGORY: 'SECTION_CATEGORY',
  PROFILE: 'PROFILE',
  FOLLOWING: 'FOLLWING',
  WISH_LIST: 'WISH_LIST',
  MEMBER_AUTH_ADULT: 'MEMBER_AUTH_ADULT',
  CONTENTS_HISTORY: 'CONTENTS_HISTORY',
  GOODS_HISTORY: 'GOODS_HISTORY',
  SECTION_SHOWROOM: 'SECTION_SHOWROOM',
  REVIEW_GOODS_LIST: 'REVIEW_GOODS_LIST',
  REVIEW_LIST: 'REVIEW_LIST',
  REVIEW_DETAIL: 'REVIEW_DETAIL',
  DRAW_GOODS: 'DRAW_GOODS',
  ADDITIONAL_INFO: 'ADDITIONAL_INFO',
  SECTION_GOODS_RECOMMENDATION: 'SECTION_GOODS_RECOMMENDATION',
  SECTION_REGION_SCHEDULE: 'SECTION_REGION_SCHEDULE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type WebLinkTypes = ValueOf<typeof WebLinkTypes>;

export const WebLink: {
  [k in WebLinkTypes]: string;
} = {
  // 주문
  [WebLinkTypes.CHECKOUT]: '/order/checkout/:checkoutId\\?goodsCode=:goodsCode?',
  // 문자 인증
  [WebLinkTypes.AUTH_SMS]: '/mypage/auth/order',
  // 상품
  [WebLinkTypes.GOODS]: '/goods/:goodsCode',
  // 상품 > 컨텐츠 리스트
  [WebLinkTypes.GOODS_CONTENT]: '/goods/content/:showroomId',
  // 상품 > 상품상세
  [WebLinkTypes.GOODS_DETAIL]: '/goods/detail/:goodsId',
  // 상품 > 이용 안내
  [WebLinkTypes.GOODS_DETAIL_INFO]: '/goods/detail/info/:goodsId{\\?type=:type}?',
  // 상품 > 상품고시
  [WebLinkTypes.GOODS_INFO]: '/goods/information/:goodsId',
  // 상품 > 상품고시/환불/취소 (티켓)
  [WebLinkTypes.GOODS_INFO_TICKET]: '/goods/information/ticket/:goodsId',
  // 상품 > 배송, 교환, 환불 정보
  [WebLinkTypes.GOODS_CS]: '/goods/cs/:goodsId',
  // 콘텐츠
  [WebLinkTypes.CONTENT]: '/:contentType(story|teaser|exclusive|collaboration|event)/:contentCode',
  // 콘텐츠 > 투표 인증뷰
  [WebLinkTypes.CONTENT_VOTE]: '/:contentType(story|teaser|exclusive|collaboration|event)/:contentCode/vote/:voteId',
  [WebLinkTypes.LIVE]: '/live/:liveId',
  // Live 경매 인증
  [WebLinkTypes.LIVE_AUTH_AUCTION]: '/live/auth/auction',
  [WebLinkTypes.CART]: '/bag/cart',
  // MyPage > Main
  [WebLinkTypes.MYPAGE]: '/mypage',
  // MyPage > 주문 내역
  [WebLinkTypes.ORDER_HISTORY]: '/mypage/orders',
  // MyPage > 주문 상세
  [WebLinkTypes.ORDER_DETAIL]: '/mypage/orders/:orderId\\?section=:section?',
  // 고객센터 > 공지사항 목록
  [WebLinkTypes.CS_NOTICE_LIST]: '/cs/notice{\\?sectionId=:sectionId}?',
  // 고객센터 > 공지사항 상세
  [WebLinkTypes.CS_NOTICE_DETAIL]: '/cs/notice/:articleId',
  // 고객센터 > 이벤트 목록 (DeepLink 매핑을 위한 추가)
  [WebLinkTypes.CS_EVENT_LIST]: '/cs/notice\\?sectionId=4407753226265',
  // 고객센터 > 이벤트 상세 (DeepLink 매핑을 위한 추가)
  [WebLinkTypes.CS_EVENT_DETAIL]: '/cs/notice/:articleId',
  // 고객센터 > FAQ 목록
  [WebLinkTypes.CS_FAQ_LIST]: '/cs/faq{\\?sectionId=:sectionId}?',
  // 고객센터 > FAQ 상세
  [WebLinkTypes.CS_FAQ_DETAIL]: '/cs/faq/:articleId',
  // 고객센터 > 1:1 문의 목록
  [WebLinkTypes.CS_QNA_LIST]: '/cs/qna',
  // 고객센터 > 1:1 문의 상세
  [WebLinkTypes.CS_QNA_DETAIL]: '/cs/qna/:requestId',
  // 고객센터 > QNA 등록 (일반 문의)
  [WebLinkTypes.CS_QNA_REGISTER_GENERAL]: '/cs/qna-register\\?type=general',
  // 고객센터 > QNA 등록 (상품 문의)
  [WebLinkTypes.CS_QNA_REGISTER_GOODS]: '/cs/qna-register\\?type=goods&goodsId=:goodsId',
  // 고객센터 > QNA 등록 (주문 문의)
  [WebLinkTypes.CS_QNA_REGISTER_ORDER]: '/cs/qna-register\\?type=order&orderId=:orderId&optionId=:optionId',
  // 고객센터 > QNA 등록 (문의 추가)
  [WebLinkTypes.CS_QNA_REGISTER_ADDITIONAL]: '/cs/qna-register\\?type=additional&requestId=:requestId',
  // 알림
  [WebLinkTypes.NOTIFICATIONS]: '/notifications',
  // MyPage > 쿠폰
  [WebLinkTypes.COUPON]: '/mypage/coupon',
  // MyPage > 쿠폰 > 쿠폰 등록
  [WebLinkTypes.COUPON_REGISTER]: '/mypage/coupon/register\\?couponCode=:couponCode',
  // 쇼룸
  [WebLinkTypes.SHOWROOM]: '/showroom/:showroomCode',
  // MyPage > Point List
  [WebLinkTypes.POINT]: '/mypage/reward',
  // MyPage > 결제 카드 관리
  [WebLinkTypes.MANAGE_PAY]: '/mypage/manage-pay',
  // MyPage > 배송지 관리
  [WebLinkTypes.MANAGE_DELIVERY]: '/mypage/manage-delivery',
  // 이용약관
  [WebLinkTypes.POLICY_TERM]: '/policy/term',
  // 개인정보 처리방침
  [WebLinkTypes.POLICY_PRIVACY]: '/policy/privacy\\?section=:section?',
  // MyPage > 설정
  [WebLinkTypes.MYPAGE_SETTING]: '/mypage/setting',
  // MyPage > 설정 > 계정 정보
  [WebLinkTypes.MYPAGE_ACCOUNT]: '/mypage/account',
  // MyPage > 설정 > 계정 정보 > 회원 탈퇴
  [WebLinkTypes.MYPAGE_WITHDRAW]: '/mypage/withdraw',
  // MyPage > 설정 > 계정 정보 > 회원 탈퇴 > 완료
  [WebLinkTypes.MYPAGE_WITHDRAW_CONFIRM]: '/mypage/withdraw-confirm',
  // 개인정보 처리방침 > 입점사 정보
  [WebLinkTypes.POLICY_PRIVACY_PROVIDER]: '/policy/privacy-provider',
  // 경매 약관
  [WebLinkTypes.AUCTION_POLICY]: '/policy/auction',
  // 금융 이용약관
  [WebLinkTypes.FINANCE_POLICY]: '/policy/finance-term',
  // 검색 메인 & 전체 결과
  [WebLinkTypes.SEARCH]: '/search\\?query=:query?',
  // 검색 결과
  [WebLinkTypes.SEARCH_RESULT]: '/search\\?query=:query&section=:section?',
  // 검색 결과 > Goods 목록
  [WebLinkTypes.SEARCH_GOODS_LIST]: '/search/goodslist\\?query=:query',
  // 검색 결과 > Showroom 목록
  [WebLinkTypes.SEARCH_SHOWROOM_LIST]: '/search/showroomlist\\?query=:query',
  // 검색 결과 > Content 목록
  [WebLinkTypes.SEARCH_CONTENT_LIST]: '/search/contentlist\\?query=:query',
  // 검색 결과 > Live 목록
  [WebLinkTypes.SEARCH_SCHEDULE_LIVE_LIST]: '/search/schedulelivelist\\?query=:query',
  // 홈(메인)
  [WebLinkTypes.HOME]: '/',
  // 피드 > 디스커버섹션
  [WebLinkTypes.SECTION_DISCOVER]: '/section/discover/:sectionId/:sectionType(goods|content|showroom|live)?',
  // 피드 > 카테고리섹션
  [WebLinkTypes.SECTION_CATEGORY]: '/section/category/:categoryId',
  // MyPage > 프로필 편집
  [WebLinkTypes.PROFILE]: '/mypage/profile',
  // MyPage > 팔로잉
  [WebLinkTypes.FOLLOWING]: '/mypage/following',
  // MyPage > 위시리스트
  [WebLinkTypes.WISH_LIST]: '/mypage/wish',
  // Member > 성인인증
  [WebLinkTypes.MEMBER_AUTH_ADULT]: '/member/auth/adult',
  // MyPage > 최근 본 콘텐츠
  [WebLinkTypes.CONTENTS_HISTORY]: '/mypage/contents-history',
  // MyPage > 최근 본 상품
  [WebLinkTypes.GOODS_HISTORY]: '/mypage/goods-history',
  // 콘셉트 쇼룸 > 섹션
  [WebLinkTypes.SECTION_SHOWROOM]:
    '/section/showroom/:sectionId/:sectionType(goods|content|showroom|live|region)?\\?rootPlace=:rootPlace?&startDate=:startDate?&endDate=:endDate?',
  // 리뷰 리스트
  [WebLinkTypes.REVIEW_GOODS_LIST]: '/review/list/:goodsId',
  [WebLinkTypes.REVIEW_LIST]: '/review/list/:type/:id',
  // 리뷰 상세
  [WebLinkTypes.REVIEW_DETAIL]: '/review/detail/:reviewId',
  // 이벤트 응모
  [WebLinkTypes.DRAW_GOODS]: '/draw/goods/:eventId',
  // 구매상품 부가정보
  [WebLinkTypes.ADDITIONAL_INFO]: '/mypage/orders/additional-info/:type(airlineticket)',
  // 연관 상품 섹션 리스트
  [WebLinkTypes.SECTION_GOODS_RECOMMENDATION]: '/section/goods/recommendation/:goodsId/goods\\?type=:type',
  // 쇼룸 > 섹션 지역/날짜 브릿지 모달 > 날짜 선택
  [WebLinkTypes.SECTION_REGION_SCHEDULE]: '/section/showroom/region/schedule',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type WebLink = ValueOf<typeof WebLink>;
