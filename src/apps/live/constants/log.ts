/**
 * Live log type
 */
export const LogEventTypes = {
  // 라이브 페이지 진입시
  LogLivePageInit: 'live.view_live_player',
  // 채팅 탭 진입시
  LogLiveViewChat: 'live.view_chat',
  // 하이라이트 탭 진입시
  LogLiveViewAnchorPoint: 'live.view_anchorpoint',
  // 경매 탭 진입시
  LogLiveViewAuction: 'live.view_auction',
  // 쇼룸 프로필 이미지 클릭
  LogLiveTapShowroom: 'live.tab_showroom',
  // 쇼룸 svg 로고 탭 시 (상단 네비게이션 바 영역)
  LogLiveTapShowroomOnTopbar: 'live.tab_showroom_on_topbar',
  // 복수 상품 목록 모달뷰가 표시되었을 때
  LogLiveImpressionGoodsList: 'live.impression_goods_list',
  // 상품 배너 클릭 (하나의 상품만 표시하는 배너)
  LogLiveTabGoodsBanner: 'live.tab_goods_banner',
  // 상품 목록 내 특정 상품 클릭 (상품 상세 이동)
  LogLiveTabGoods: 'live.tab_goods',
  // 복수 상품 목록 > APP으로 경매참여 유도 배너 클릭
  LogLiveTabToAppBanner: 'live.tab_to_app_banner',
  // 하이라이트 콘텐츠 노출
  LogLiveImpressionAnchorPointBanner: 'live.impression_anchorpoint_banner',
  // 하이라이트 콘텐츠 클릭
  LogLiveTabAnchorPointBanner: 'live.tab_anchorpoint_banner',
  // 풀스크린 화면 재생시간
  LogLiveViewPlaytimeFullscreen: 'live.view_playtime_fullscreen',
  // 입찰 필수 정보 모달 노출
  LogLiveViewAuctionRequired: 'live.view_auction_required',
  // 입찰 필수 정보 모달 내 '주문자 정보' 버튼 클릭
  LogLiveTabAuctionRequiredIdentify: 'live.tab_auction_required_identify',
  // 입찰 필수 정보 모달 내 '배송지 추가' 버튼 클릭
  LogLiveTabAuctionRequiredShipping: 'live.tab_auction_required_shipping',
  // 입찰 필수 정보 모달 내 '카드 추가' 버튼 클릭
  LogLiveTabAuctionRequiredPrizmPay: 'live.tab_auction_required_prizm_pay',
  // 입찰 필수 정보 모달 내 '완료' 버튼 클릭
  LogLiveTabAuctionRequiredDone: 'live.tab_auction_required_done',
  // 라이브 시청 중 방송 종료 팝업 내 확인 버튼 클릭
  LogLiveTabAlertEndingConfirm: 'live.tab_alert_ending_confirm',
  // 라이브 시청 중 방송 종료 팝업 내 '브랜드 이동' 버튼 클릭
  LogLiveTabAlertEndingGotoShowroom: 'live.tab_alert_ending_gotoshowroom',
  // 종료된 라이브에 사후 진입 시 노출되는 팝업(또는 페이지)의 '브랜드 이동' 버튼 클릭
  LogLiveTabAlertEndedGotoShowroom: 'live.tab_alert_ended_gotoshowroom',
  // 편성표 모달 노출 시
  LogLiveViewModalSchedule: 'live.view_modal_schedule',
  // 편성표 모달 내 콘텐츠 탭 시
  LogLiveTabModalScheduleContents: 'live.tab_modal_schedule_contents',
  // 더보기 버튼 탭 시
  LogLiveTabModalScheduleMore: 'live.tab_modal_schedule_more',
  // 팔로우 유도 모달이 유저뷰에 표시되었을 때 (모달 노출 수)
  LogLiveImpressionFollowRequest: 'live.impression_follow_request',
  // 팔로우 유도 모달 내 쇼룸 팔로우 완료 시
  LogLiveCompleteFollowRequestFollow: 'live.complete_follow_request_follow',
  // 팔로우 유도 모달 내 쇼룸 프로필 이미지 영역 탭
  LogLiveTabFollowRequestShowroom: 'live.tab_follow_request_showroom',
  // 모달 내 개별방송 알림 신청 완료 시 (로그인된 유저 only)
  LogLiveCompleteScheduleNotiOptIn: 'live.complete_schedule_noti_opt_in',
  // 모달 내 개별방송 알림 신청 취소 완료 시 (로그인된 유저 Only)
  LogLiveCompleteScheduleNotiOptOut: 'live.complete_schedule_noti_opt_out',
  // 구매인증 버튼 노출시
  LiveImpressionPurchaseVerification: 'live.impression_purchase_verification',
  // 구매인증 버튼 탭 시
  LiveTabPurchaseVerification: 'live.tab_purchase_verification',
  // FAQ 모달 노출시
  LogLiveViewFaq: 'live.view_faq',
  // faq tab 버튼 클릭시
  LogLiveTabFaq: 'live.tab_faq',
  // faq 모달내 각 faq 항목(section) tap시
  LogLiveTabFaqSection: 'live.tab_faq_section',
  // 상품 리스트 모달내 쿠폰이 노출 되었을때
  LogLiveImpressionGoodsListCoupon: 'live.impression_goods_list_coupon',
  // 상품 리스트 모달내 쿠폰 다운로드 버튼 클릭시
  LogLiveTabGoodsListCouponDownload: 'live.tab_goods_list_coupon_download',
  // 상품 리스트 모달내 쿠폰 다운로드 완료시
  LogLiveCompleteGoodsListCouponDownload: 'live.complete_goods_list_coupon_download',

  // s종료된 라이브에 사후 진입후 종료 팝업 확인 버튼 클릭시 노출되는 라이브 종료 안내 페이지 노출시
  LogLiveViewEndpage: 'live.view_endpage',
  // 라이브 종료 안내 페이지내 쇼룸 이동 CTA버튼 클릭시
  LogLiveTabEndpageCtaGotoshowroom: 'live.tab_endpage_cta_gotoshowroom',
  // 라이브 종료 안내 페이지내 쿠폰 다운로드 버튼 클릭시
  LogLiveTabEndpageCouponDownload: 'live.tab_endpage_coupon_download',
  // s라이브 종료 안내 페이지내 쿠폰 노출시
  LogLiveImpressionEndpageCoupon: 'live.impression_endpage_coupon',
  // 라이브 종료 안내 페이지내 쿠폰 다운로드 완료시
  LogLiveCompleteEndpageCoupon: 'live.complete_endpage_coupon',
  // s라이브 종료 안내 페이지내 상품 썸네일 노출시
  LogLiveImpressionEndpageGoodsThumbnail: 'live.impression_endpage_goods_thumbnail',
  // s라이브 종료 안내 페이지내 상품 썸네일 클릭시
  LogLiveTabEndpageGoodsThumbnail: 'live.tab_endpage_goods_thumbnail',
  // 라이브 종료 안내 페이지내 상품 더보기 버튼 클릭시
  LogLiveTabEndpageGoodsMore: 'live.tab_endpage_goods_more',
  // 라이브 종료 안내 페이지내 예정된 라이브 알림신청 완료시 (앱 유도)
  LogLivecompleteEndpageScheduleNotiOptIn: 'live.complete_endpage_schedule_noti_opt_in',
  // 라이브 종료 안내 페이지내 예정된 라이브 알림해지 완료시 (앱 유도)
  LogLivecompleteEndpageScheduleNotiOptOut: 'live.complete_endpage_schedule_noti_opt_out',
  // 라이브 종료 안내 페이지내 예정된 라이브 콘텐츠 클릭시 (앱 유도)
  LogLiveTabEndpageSchedule: 'live.tab_endpage_schedule',
  // 라이브 종료 안내 페이지내 예정된 라이브 더보기 버튼 클릭시 (앱 유도)
  LogLiveTabEndpageScheduleMore: 'live.tab_endpage_schedule_more',
  // 라이브 종료 안내 페이지 > 더보기 > 상품 리스트 노출시
  LogLiveGoodsViewPage: 'goods_list.view_page',
  // 라이브 종료 안내 페이지 > 더보기 > 상품 리스트 내 상품 노출시
  LogLiveGoodsImpressionGoods: 'goods_list.impression_goods',
  // 라이브 종료 안내 페이지 > 더보기 > 상품 리스트 내 상품 노출시
  LogLiveGoodsTabGoods: 'goods_list.tab_goods',
  // 라이브 종료 안내 페이지 > 더보기 > 라이브 리스트 노출시
  LogLiveListViewPage: 'live_list.view_page',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventTypes = typeof LogEventTypes[keyof typeof LogEventTypes];
