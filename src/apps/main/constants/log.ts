export const LogEventTypes = {
  /** 홈 화면 방문(진입) 시 */
  HomeViewHome: 'home.view_home',

  /** 배너영역 편성 콘텐츠 노출 시 */
  HomeImpressionTopbanner: 'home.impression_topbanner',
  /** 배너영역 편성 콘텐츠 탭 시 */
  HomeTabTopbanner: 'home.tab_topbanner',
  /** 배너영역 편성 콘텐츠 내 쇼룸 프로필 탭 시 */
  HomeTabTopbannerShowroom: 'home.tab_topbanner_showroom',

  /** 숏컷 배너 노출시 */
  HomeImpressionShortcutbanner: 'home.impression_shortcutbanner',
  /** 숏컷 배너 탭시 */
  HomeTabShortcutbanner: 'home.tab_shortcutbanner',

  /** 카테고리 숏컷 배너 노출시 */
  HomeImpressionCategoryshortcut: 'home.impression_categoryshortcut',
  /** 카테고리 숏컷 배너 탭시 */
  HomeTabCategoryshortcut: 'home.tab_categoryshortcut',

  /** 홈 섹션 영역의 노출 시 */
  HomeImpressionSection: 'home.impression_section',
  /** 홈 섹션 영역의 더보기 탭 시 */
  HomeTabSectionMore: 'home.tab_section_more',

  /** 홈 섹션 영역의 상품 노출 시 */
  HomeImpressionSectionGoodsThumbnail: 'home.impression_section_goods_thumbnail',
  /** 홈 섹션 영역의 상품 탭 시 */
  HomeTabSectionGoodsThumbnail: 'home.tab_section_goods_thumbnail',

  /** 홈 섹션 영역의 콘텐츠 노출 시 */
  HomeImpressionSectionContentsThumbnail: 'home.impression_section_contents_thumbnail',
  /** 홈 섹션 영역의 콘텐츠 탭 시 */
  HomeTabSectionContentsThumbnail: 'home.tab_section_contents_thumbnail',

  /** 홈 섹션 영역의 쇼룸 노출 시 */
  HomeImpressionSectionShowroomThumbnail: 'home.impression_section_showroom_thumbnail',
  /** 홈 섹션 영역의 쇼룸 탭 시 */
  HomeTabSectionShowroomThumbnail: 'home.tab_section_showroom_thumbnail',
  /** 홈 섹션 영역의 쇼룸 팔로우 완료 (로그인 유저 Only) */
  HomeCompleteSectionShowroomFollow: 'home.complete_section_showroom_follow',
  /** 홈 섹션 영역의 쇼룸 팔로우 취소 완료 (로그인 유저 Only) */
  HomeCompleteSectionShowroomUnfollow: 'home.complete_section_showroom_unfollow',

  /** 홈 섹션 영역의 라이브 편성표 콘텐츠 노출 시 */
  HomeImpressionSectionScheduleThumbnail: 'home.impression_section_schedule_thumbnail',
  /** 홈 섹션 영역의 라이브 편성표 콘텐츠 탭 시 */
  HomeTabSectionScheduleThumbnail: 'home.tab_section_schedule_thumbnail',
  /** 섹션 영역의 개별방송 알림 신청 완료 시 (로그인 유저 only) */
  HomeCompleteSectionScheduleNotiOptIn: 'home.complete_section_schedule_noti_opt_in',
  /** 섹션 영역의 개별방송 알림 신청 취소 완료 시 (로그인 유저 only) */
  HomeCompleteSectionScheduleNotiOptOut: 'home.complete_section_schedule_noti_opt_out',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventTypes = ValueOf<typeof LogEventTypes>;
