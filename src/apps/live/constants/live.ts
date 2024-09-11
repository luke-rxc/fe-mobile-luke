/**
 * 라이브 정보 query key
 */
export const liveInfoQueryKey = 'live/info';
/**
 * 라이브 구매인증 상태 query key
 */
export const LIVE_PURCHASE_VERIFICATION_QUERY_KEY = 'live/purchase/verification';
/**
 * preview 노출 시간
 */
export const previewLoadTime = 3000;
/**
 * 라이브 팔로우 요청 close time
 */
export const closeFollowTime = 10000;
/**
 * 라이브 팔로우 요청 delay time
 */
export const delayFollowTime = 8000;
/**
 * 라이브 당첨자 발표 delay time
 * default 8000
 */
export const delayRaffleWinnerTime = 8000;
/**
 * 구매인증 메타카운터 키
 */
export const LIVE_PURCHASE_VERIFICATION_METACOUNTER_KEY = 'purchaseVerification';
/**
 * 라이브 구매인증 Custom Event Name
 */
export const LIVE_PURCHASE_VERIFICATION_EVENT_NAME = 'purchaseVerificationEvent';
/**
 * 라이브 구매인증 영수증 리액션 Lottie 표시 갯수
 */
export const LIVE_PURCHASE_VERIFICATION_LOTTIE_VIEW_COUNT = 7;

// 채팅영역 스크롤 높이 offset
export const CHATAREA_SCROLL_HEIGHT_OFFSET = 10;
/**
 * 라이브 fnb Custom Event Name
 */
export const LIVE_FNB_EVENT_NAME = 'fnbEvent';

/**
 * ActionButtonType
 */
export const ActionButtonType = {
  CHAT: 'CHAT',
  AUCTION: 'AUCTION',
  ANCHOR: 'ANCHOR',
  EMPTY: 'EMPTY',
  SCHEDULE: 'SCHEDULE',
  FAQ: 'FAQ',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ActionButtonType = typeof ActionButtonType[keyof typeof ActionButtonType];

export const ActionButtonTypeIconName: {
  [k in ActionButtonType]: string;
} = {
  CHAT: 'bubble',
  AUCTION: 'price',
  ANCHOR: 'pin',
  EMPTY: 'close',
  SCHEDULE: 'schedule',
  FAQ: 'faq',
};

export const ActionButtonTypeButtonLabel: {
  [k in ActionButtonType]: string;
} = {
  CHAT: 'PRIZM에서 채팅 시작',
  AUCTION: '앱 다운받고 경매 참여',
  ANCHOR: '',
  EMPTY: '',
  SCHEDULE: '',
  FAQ: '',
};

/**
 * 라이브 뷰 모드
 */
export const LiveViewMode = {
  PREVIEW: 'PREVIEW',
  LIVE: 'LIVE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LiveViewMode = typeof LiveViewMode[keyof typeof LiveViewMode];

/**
 * message type
 */
export const MessageType = {
  DEAL: 'DEAL',
  USER: 'USER',
  AUCTION: 'AUCTION',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MessageType = typeof MessageType[keyof typeof MessageType];

/**
 * view status type
 */
export const ViewStatusType = {
  DEFAULT: 'default',
  SHOW: 'show',
  HIDE: 'hide',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ViewStatusType = typeof ViewStatusType[keyof typeof ViewStatusType];

/**
 * 라이브 헤더 animation status
 */
export const LiveHeaderAnimationStatus = {
  INIT: 'init',
  RUNNING: 'running',
  END: 'end',
  FIXED: 'fixed',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LiveHeaderAnimationStatus = typeof LiveHeaderAnimationStatus[keyof typeof LiveHeaderAnimationStatus];

/**
 * 라이브 action type
 */
export const LiveActionType = {
  LIVE_CHAT: 'LIVE_CHAT', // 라이브 채팅
  LIVE_AUCTION: 'LIVE_AUCTION', // 라이브 경매
  LIVE_SCHEDULE_ALL: 'LIVE_SCHEDULE_ALL', // 라이브 스케쥴 전체보기
  LIVE_FOLLOW: 'LIVE_FOLLOW', // 라이브 알림
  SHOWROOM_FOLLOW: 'SHOWROOM_FOLLOW', // 쇼룸 팔로우
  TAB_SHOWROOM_FOLLOW: 'TAB_SHOWROOM_FOLLOW', // 쇼룸 팔로우 프로필 탭
  TAB_PURCHASE_VERIFICATION: 'TAB_PURCHASE_VERIFICATION', // 구매인증 탭
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LiveActionType = typeof LiveActionType[keyof typeof LiveActionType];

/**
 * 라이브 배너 status
 */
export const LiveDealBannerStatus = {
  DEFAULT: 'default',
  IN: 'in',
  OUT: 'out',
  HIDE: 'hide',
  HIDE_OUT: 'hide-out',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LiveDealBannerStatus = typeof LiveDealBannerStatus[keyof typeof LiveDealBannerStatus];
