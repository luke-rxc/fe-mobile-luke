export const LogEventTypes = {
  // 상단 > 햄버거 버튼 클릭 시
  LogMyTabHamburgerBtn: 'my.tab_hamburger_btn',
  // 상단 > 알림 버튼 클릭 시
  LogMyTabNotification: 'my.tab_notification',

  // 메뉴 > 홈 클릭 시
  LogMyTabHome: 'my.tab_home',
  // 메뉴 > 검색 클릭 시
  LogMyTabSearch: 'my.tab_search',
  // 메뉴 > 쇼핑백 클릭 시
  LogMyTabCart: 'my.tab_cart',
  // 메뉴 > 위시리스트 클릭 시
  LogMyTabWish: 'my.tab_wish',
  // 메뉴 > 로그인 클릭 시
  LogMyTabSignIn: 'my.tab_sign_in',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventTypes = ValueOf<typeof LogEventTypes>;
