export const LogEventTypes = {
  // 상품 상세 진입 시
  LogGoodsInit: 'goods.view_goods_detail',
  // 요금표 버튼 탭 시
  LogGoodsTabPriceList: 'goods.tab_price_list',
  // 요금표 모달 > 정렬기준 탭 시
  LogGoodsTabPriceListSorting: 'goods.tab_price_list_sorting',
  // 배너 탭 시
  LogGoodsTabBanner: 'goods.tab_banner',
  // Content Page (더보기) 클릭시
  LogTabContentsMore: 'goods.tab_contents_more',
  // Content List 클릭시
  LogTabContentsThumbnail: 'goods.tab_contents_thumbnail',
  // Reivew shortcut 영역 탭시
  LogTabReviewShortcut: 'goods.tab_review_shortcut',
  // Reivew 전체보기 탭시
  LogTabReviewMore: 'goods.tab_review_more',
  // 상품상세 > 리뷰 리스트 영역 노출시
  LogImpressionReview: 'goods.impression_review',
  // 상품상세 > 리뷰 썸네일 이미지 탭시
  LogTabReviewThumbnail: 'goods.tab_review_thumbnail',
  // 상품상세 > 추천영역 노출시
  LogImpressionSectionGoods: 'goods.impression_section_goods',
  // 상품상세 > 추천영역 썸네일 노출시
  LogImpressionSectionGoodsThumbnail: 'goods.impression_section_goods_thumbnail',
  // 상품상세 > 추천영역 썸네일 이미지 탭시
  LogTabSectionGoodsThumbnail: 'goods.tab_section_goods_thumbnail',
  // 상품상세 > 추천영역 더보기 탭시
  LogTabSectionMore: 'goods.tab_section_more',
  // cover swiper 시
  LogCoverSwiper: 'goods.swipe_main_media',
  // showroom 로고 탭시 (헤더 상단 바)
  LogShowroomLogoTabOnTopBar: 'goods.tab_showroom_on_topbar',
  // showroom 로고 탭시 (상단)
  LogShowroomLogoTabOnTop: 'goods.tab_showroom_on_top',
  // showroom 로고 탭시 (하단)
  LogShowroomLogoTabOnBottom: 'goods.tab_showroom_on_bottom',
  // 구매하기 탭시
  LogPurchaseTab: 'goods.tab_purchase',
  // 위시리스트에 상품을 담았을때
  LogAddToWish: 'goods.add_to_wish',
  // 쿠폰 다운로드 시
  LogCompleteCouponDownload: 'goods.complete_coupon__download',
  // 판매 예정 상품의 판매알림 신청 완료시
  LogCompleteSalesNotificationIn: 'goods.complete_sell_noti_opt_in',
  // 판매 예정 상품의 판매알림 신청 취소 완료시
  LogCompleteSalesNotificationOut: 'goods.complete_sell_noti_opt_out',
  // 쇼룸 내 상품 탭시
  LogTabGoodsInShowroom: 'goods.tab_goods',
  // 상품 문의 탭시
  LogTabQnA: 'goods.tab_qna',
  // 상세 이미지 탭 시
  LogTabContent: 'goods.tab_contents',
  // 이용 안내 탭 시
  LogTabDetailInfo: 'goods.tab_detail_info',
  // 교환/반품 안내 탭 시
  LogTabRefundInfo: 'goods.tab_refund_info',
  // 상품고시/판매자 정보 탭 시
  LogTabProviderInfo: 'goods.tab_provider_info',
  // 티켓 상품고시 탭 시
  LogTabTicketProviderInfo: 'goods.tab_ticket_provider_info',
  // 연령인증 화면 진입 시
  LogViewIdentifyAdult: 'goods.view_identify_adult',
  // 연령인증 완료 시
  LogCompleteIdentifyAdult: 'goods.complete_identify_adult',
  // 상품상세 > 장바구니에 상품 추가 시
  LogAddToCart: 'goods.add_to_cart',
  // 상품상세 > 구매하기(주문서) 시
  LogTabToCheckout: 'goods.tab_to_checkout',
  // 혜택 안내 더보기 탭 시
  LogTabBenefitMore: 'goods.tab_benefit_more',
  // 취소환불 규정 더보기 탭 시
  LogTabCancelPolicyMore: 'goods.tab_cancel_policy_more',
  // 상품설명 더보기 탭 시
  LogTabDescriptionMore: 'goods.tab_description_more',
  // 모델명 복사하기
  LogTabCodeCopy: 'goods.tab_code_copy',
  // 상품 상세 > 태그 정보 스와이프 시
  LogSwipeTagInfo: 'goods.swipe_tag_info',
  // 이용정보 > 탭 메뉴 탭 시
  LogTabDetailInfoTab: 'goods.tab_detail_info_tab',
  // 상품상세 > 지도 탭 시
  LogTabMap: 'goods.tab_map',
  // 상품상세 > 주소 복사 탭 시
  LogTabAddressCopy: 'goods.tab_address_copy',
  // 날짜선택 모달 진입 시
  LogViewDatePicker: 'goods.view_date_picker',
  // 날짜선택 완료 시
  LogCompleteDatePicker: 'goods.complete_date_picker',
  // 날짜/회차 선택 모달 진입 시
  LogViewDateTimePicker: 'goods.view_date_time_picker',
  // 날짜/회차 선택 완료 시
  LogCompleteDateTimePicker: 'goods.complete_date_time_picker',
  // 좌석선택 모달 진입 시
  LogViewSeatPicker: 'goods.view_seat_picker',
  // 좌석 새로고침 탭 시
  LogTabSeatReset: 'goods.tab_seat_reset',
  // 좌석도 (이미지) 탭 시
  LogTabSeatMap: 'goods.tab_seat_map',
  // 좌석선택 완료 시
  LogCompleteSeatPicker: 'goods.complete_seat_picker',
  // 권종선택 모달 진입 시
  LogViewPricePicker: 'goods.view_price_picker',
  // 권종선택 완료 시
  LogCompletePricePicker: 'goods.complete_price_picker',
  // 좌석 선점 시간 종료 시 뜨는 confirm message 노출 시
  LogImpressionTimeoutConfirm: 'goods.impression_timeout_confirm',
  // option 1 탭 시
  LogTabOption1: 'goods.tab_option1',
  // option 2 탭 시
  LogTabOption2: 'goods.tab_option2',
  // option 3 탭 시
  LogTabOption3: 'goods.tab_option3',
  // 옵션블록 삭제 시
  LogTabDeleteOptionBlock: 'goods.tab_delete_option_block',
  // 옵션블록 생성 후 날짜선택 탭 시 뜨는 confirm message 확인 시
  LogTabReselectConfirm: 'goods.tab_reselect_confirm',
  // 옵션블록 생성 후 날짜선택 탭 시 뜨는 confirm message 취소 시
  LogTabReselectConfirmClose: 'goods.tab_reselect_confirm_close',
  // 옵션 모달 이탈 시
  LogCloseOptionModal: 'goods.close_opt_modal',
} as const;

export const LogEventWebBranchTypes = {
  // 상품 상세 진입 시
  LogGoodsInit: 'VIEW_ITEM',
  // 위시리스트에 상품을 담았을때(Branch)
  LogAddToWish: 'ADD_TO_WISHLIST',
  // 상품상세 > 장바구니에 상품 추가 시(Branch)
  LogAddToCart: 'ADD_TO_CART',
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventTypes = ValueOf<typeof LogEventTypes>;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventWebBranchTypes = ValueOf<typeof LogEventWebBranchTypes>;

export const LogEventWebFacebookTypes = {
  LogAddToCart: 'AddToCart',
  LogGoodsInit: 'ViewContent',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventWebFacebookTypes = typeof LogEventWebFacebookTypes[keyof typeof LogEventWebFacebookTypes];
