export const LogEventTypes = {
  // 온보딩 페이지 진입 시
  LogOnboardingViewPage: 'onboarding.view_page',
  // 온보딩 CTA 동작 시
  LogOnboardingCompleteShowroomFollow: 'onboarding.complete_showroom_follow',
  // 온보딩 페이지 내 쇼룸 노출 시
  LogOnboardingImpressionShowroom: 'onboarding.impression_showroom',
  // 온보딩 페이지 내 전체 팔로우 탭 시
  LogOnboardingTabSelectAll: 'onboarding.tab_select_all',
  // 온보딩 페이지 내 쇼룸 탭 시
  LogOnboardingTabShowroom: 'onboarding.tab_showroom',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventTypes = ValueOf<typeof LogEventTypes>;
