export const LogEventTypes = {
  /**
   * 1depth 페이지 로그
   */
  // 최근 검색어 탭 시
  LogTabRecentWord: 'search.tab_recent_word',
  // 추천 검색어 노출 시
  LogImpressionRecommendWord: 'search.impression_recommend_word',
  // 추천 검색어 탭 시
  LogTabRecommendWord: 'search.tab_recommend_word',
  // 검색 메인 > 상품 섹션 노출 시
  LogImpressionSectionGoods: 'search.impression_section_goods',
  // 검색 메인 > 섹션 내 상품 탭 시
  LogTabSectionGoodsThumbnail: 'search.tab_section_goods_thumbnail',
  // 최근 본 상품 탭 시
  LogTabRecentGoods: 'search.tab_recent_goods',
  // 검색 완료시
  LogViewInResult: 'search.view_in_result',
  // 검색 결과 대상 탭 시 (Goods)
  LogTabInResultGoods: 'search.tab_in_result_goods',
  // 검색 결과 대상 탭 시 (Brand)
  LogTabInResultBrand: 'search.tab_in_result_brand',
  // 검색 결과 대상 탭 시 (Content)
  LogTabInResultContent: 'search.tab_in_result_content',
  // 검색 결과 대상 탭 시 (Live)
  LogTabInResultSchedule: 'search.tab_in_result_schedule',
  // 검색 결과 브랜드 팔로우 완료
  LogCompleteSectionShowroomFollow: 'search.complete_section_showroom_follow',
  // 검색 결과 브랜드 팔로우 취소 완료
  LogCompleteSectionShowroomUnfollow: 'search.complete_section_showroom_unfollow',
  // 검색 결과 라이브 팔로우 완료
  LogCompleteSectionScheduleNotiOptIn: 'search.complete_section_schedule_noti_opt_in',
  // 검색 결과 라이브 팔로우 취소 완료
  LogCompleteSectionScheduleNotiOptout: 'search.complete_section_schedule_noti_opt_out',

  /**
   * 2depth 페이지 로그
   */
  // 상품 리스트 페이지 진입시 (2 depth page)
  LogGoodsListViewPage: 'goods_list.view_page',
  // 상품 리스트 페이지내 상품 노출 시
  LogGoodsListImpressionGoods: 'goods_list.impression_goods',
  // 상품 리스트 페이지내 상품 탭 시
  LogGoodsListTabGoods: 'goods_list.tab_goods',
  // 상품 리스트 페이지내 상품 필터 숏컷 버튼 탭시
  LogGoodsListTabFilter: 'goods_list.tab_filter',
  // 쇼룸내 상품리스트의 특정 소팅 항목 탭시
  LogGoodsListTabSorting: 'goods_list.tab_sorting',
  // 콘텐츠 리스트 페이지 진입시 (2 depth page)
  LogContentListViewPage: 'content_list.view_page',
  // 콘텐츠 리스트 페이지내 콘텐츠 노출 시
  LogContentListImpressionContent: 'content_list.impression_content',
  // 콘텐츠 리스트 페이지내 콘텐츠 탭 시
  LogContentListTabContent: 'content_list.tab_content',
  // 브랜드(쇼룸) 리스트 페이지 진입시 (2 depth page)
  LogBrandsListViewPage: 'brands_list.view_page',
  // 브랜드(쇼룸) 리스트 페이지내 쇼룸 노출 시
  LogBrandsListImpressionShowroom: 'brands_list.impression_showroom',
  // 브랜드(쇼룸) 리스트 페이지내 쇼룸 탭 시
  LogBrandsListTabShowroom: 'brands_list.tab_showroom',
  // 브랜드(쇼룸) 리스트 페이지내  상품 노출 시
  LogBrandsListImpressionGoods: 'brands_list.impression_goods',
  // 브랜드(쇼룸) 리스트 페이지내  상품 탭 시
  LogBrandsListTabGoods: 'brands_list.tab_goods',
  // 브랜드(쇼룸) 리스트 페이지내 쇼룸 팔로우 완료 (로그인 유저 Only)
  LogBrandsListCompleteShowroomFollow: 'brands_list.complete_showroom_follow',
  // 브랜드(쇼룸) 리스트 페이지내 쇼룸 팔로우 취소 완료 (로그인 유저 Only)
  LogBrandsListCompleteShowroomUnfollow: 'brands_list.complete_showroom_unfollow',
  // 라이브 리스트 페이지 진입시 (2 depth page)
  LogLiveListViewPage: 'live_list.view_page',
  // 라이브 리스트 페이지내 라이브 편성표 콘텐츠 노출 시
  LogLiveListImpressionThumbnail: 'live_list.impression_thumbnail',
  // 라이브 리스트 페이지내 라이브 편성표 콘텐츠 탭 시
  LogLiveListTabThumbnail: 'live_list.tab_thumbnail',
  // 라이브 리스트 페이지내 라이브 알림 신청 완료 시 (*로그인 유저 only)
  LogLiveListCompleteScheduleNotiOptIn: 'live_list.complete_schedule_noti_opt_in',
  // 라이브 리스트 페이지내 라이브 알림 신청 취소 완료 시 (*로그인 유저 only)
  LogLiveListCompleteScheduleNotiOptOut: 'live_list.complete_schedule_noti_opt_out',
} as const;

export const LogEventWebBranchTypes = {
  // 검색 완료시
  LogViewInResult: 'SEARCH',
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventTypes = ValueOf<typeof LogEventTypes>;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventWebBranchTypes = ValueOf<typeof LogEventWebBranchTypes>;

export const LogEventWebFacebookTypes = {
  LogViewInResult: 'Search',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventWebFacebookTypes = typeof LogEventWebFacebookTypes[keyof typeof LogEventWebFacebookTypes];
