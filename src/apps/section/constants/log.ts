export const LogEventTypes = {
  /** 상품 리스트 > 페이지 진입 시 */
  LogGoodsListViewPage: 'goods_list.view_page',
  /** 상품 리스트 > 상품 노출 시 */
  LogGoodsListImpressionGoods: 'goods_list.impression_goods',
  /** 상품 리스트 > 상품 탭 시 */
  LogGoodsListTabGoods: 'goods_list.tab_goods',
  /** 상품 리스트 > Filter 클릭 시 */
  LogGoodsListTabFilter: 'goods_list.tab_filter',
  /** 상품 리스트 > Sorting 변경 시 */
  LogGoodsListTabSorting: 'goods_list.tab_sorting',

  /** 쇼룸 지역/날짜 리스트 > 타이틀의 지역/날짜 선택 시 */
  LogGoodsListTabFixedInfo: 'goods_list.tab_fixed_info',
  /** 쇼룸 지역/날짜 리스트 > 브릿지 모달 > 완료 클릭(탭) 시 */
  LogGoodsListTabRegionDatePicker: 'goods_list.tab_region_date_picker',
  /** 쇼룸 지역/날짜 리스트 > 필터 모달 > 진입 시 */
  LogGoodsListViewTagFilter: 'goods_list.view_tag_filter',
  /** 쇼룸 지역/날짜 리스트 > 필터 모달 > 완료 클릭(탭) 시 */
  LogGoodsListCompleteTagFilter: 'goods_list.complete_tag_filter',
  /** 쇼룸 지역/날짜 리스트 > 필터 모달 > 초기화 버튼 클릭(탭) 시 */
  LogGoodsListTabTagFilterReset: 'goods_list.tab_tag_filter_reset',

  /** 쇼룸(브랜드) 리스트 > 페이지 진입 시 */
  LogShowroomListViewPage: 'brands_list.view_page',
  /** 쇼룸(브랜드) 리스트 > 팔로우 */
  LogShowroomListFollowShowroom: 'brands_list.complete_showroom_follow',
  /** 쇼룸(브랜드) 리스트 > 언팔로우 */
  LogShowroomListUnfollowShowroom: 'brands_list.complete_showroom_unfollow',
  /** 쇼룸(브랜드) 리스트 > 상품 이미지 노출 시 */
  LogShowroomListImpressionGoods: 'brands_list.impression_goods',
  /** 쇼룸(브랜드) 리스트 > 쇼룸 이미미 노출 시 */
  LogShowroomListImpressionShowroom: 'brands_list.impression_showroom',
  /** 쇼룸(브랜드) 리스트 > 상품 클릭(탭) 시 */
  LogShowroomListTabGoods: 'brands_list.tab_goods',
  /** 쇼룸(브랜드) 리스트 > 쇼룸 클릭(탭) 시 */
  LogShowroomListTabShowroom: 'brands_list.tab_showroom',

  /** 콘텐츠 리스트 > 페이지 진입 시 */
  LogContentListViewPage: 'content_list.view_page',
  /** 콘텐츠 리스트 > 콘텐츠 클릭(탭) 시 */
  LogContentListTabContent: 'content_list.tab_content',
  /** 콘텐츠 리스트 > 콘텐츠 이미지 노출 시 */
  LogContentListImpression: 'content_list.impression_content',

  /** 라이브 리스트 > 페이지 진입 시 */
  LogLiveListViewPage: 'live_list.view_page',
  /** 라이브 리스트 > 알림 신청 시 */
  LogLiveListOptIn: 'live_list.complete_schedule_noti_opt_in',
  /** 라이브 리스트 > 알림 신청 해제 시 */
  LogLiveListOptOut: 'live_list.complete_schedule_noti_opt_out',
  /** 라이브 리스트 > 라이브 클릭(탭) 시 */
  LogLiveListTabThumbnail: 'live_list.tab_thumbnail',
  /** 라이브 리스트 > 라이브품 이미지 노출 시 */
  LogLiveListImpressionThumbnail: 'live_list.impression_thumbnail',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventTypes = ValueOf<typeof LogEventTypes>;
