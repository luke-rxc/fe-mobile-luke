export const LogEventTypes = {
  /** 쇼룸 진입 */
  LogShowroomInit: 'showroom.view_showroom',
  /** 쇼룸 브랜드 언팔로우 완료 */
  LogBrandUnfollowComplete: 'showroom.complete_unfollow',
  /** 쇼룸 브랜드 팔로우 완료 */
  LogBrandFollowComplete: 'showroom.complete_follow',
  /** 쇼룸 설명영역의 링크 요소 클릭 */
  LogDescriptionLinkTab: 'showroom.tab_description_link',
  /** 쇼룸 콘텐츠 아이템 클릭시 */
  LogContentsThumbnailTab: 'showroom.tab_contents_thumbnail',
  /** 쇼룸 상품 아이템 클릭시 */
  LogGoodsThumbnailTab: 'showroom.tab_goods_thumbnail',
  /** 쇼룸 상품 리스트 추가로드시 */
  LogGoodsLoadMore: 'showroom.view_goods_thumbnail',
  /** 쇼룸 쿠폰 다운로드 성공시 */
  LogCouponDownload: 'showroom.complete_coupon_download',
  /** 쇼룸 스토리 전체 보기 클릭시 */
  LogStoryMoreTab: 'showroom.tab_contents_more',
  /** 쇼룸 프로필 클릭시 */
  LogShowroomProfileTab: 'showroom.tab_showroom_thumbnail',
  /** 쇼룸 섹션 Load more 시 */
  LogShowroomSectionLoadMore: 'showroom.impression_section',
  /** 쇼룸 섹션 내 상품 클릭 시 */
  LogShowroomSectionGoodsTab: 'showroom.tab_section_goods_thumbnail',
  /** 쇼룸 섹션 전체 보기 클릭 시 */
  LogShowroomSectionMoreTab: 'showroom.tab_section_more',
  /** 일반 쇼룸 내 Filter 클릭 시 */
  LogShowroomTabFilter: 'showroom.tab_filter',
  /** 일반 쇼룸 내 Sorting 변경 시 */
  LogShowroomTabSorting: 'showroom.tab_sorting',
  /** 콘셉트 쇼룸 내 섹션 헤더 클릭 시 */
  LogShowroomTabSectionHeader: 'showroom.tab_section_header',
  /** 쇼룸 내 리뷰 터보기 탭 */
  LogShowroomTabReviewMore: 'showroom.tab_review_more',
  /** 쇼룸 내 리뷰 썸네일 탭 */
  LogShowroomTabReviewThumbnail: 'showroom.tab_review_thumbnail',
  /** 쇼룸 내 리뷰 노출 */
  LogShowroomImpressionReview: 'showroom.impression_review',
  /** 쇼룸 내 지도 클릭 */
  LogShowroomTabMap: 'showroom.tab_map',
  /** 쇼룸 내 주소복사 클릭 */
  LogShowroomTabAddressCopy: 'showroom.tab_address_copy',
  /** 쇼룸 내 검색 숏컷 노출 시 */
  LogImpressionSearchShortcut: 'showroom.impression_search_shortcut',
  /** 쇼룸 내 검색 숏컷 탭 시	*/
  LogTabSearchShortcut: 'showroom.tab_search_shortcut',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventTypes = ValueOf<typeof LogEventTypes>;

export const LogEventWebFacebookTypes = {
  LogShowroomInit: 'ViewContent',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventWebFacebookTypes = typeof LogEventWebFacebookTypes[keyof typeof LogEventWebFacebookTypes];
