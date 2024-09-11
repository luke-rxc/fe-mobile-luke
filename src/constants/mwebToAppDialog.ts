/**
 * 앱유도팝업 띄우는 시점관련 모드
 * - LANDING: 브랜치 스마트배너 띄우는 시점에 띄움 (한번 활성화 된 이후 동일세션기준 24시간내로는 활성화하지 않음)
 * - ACTION: 브랜치 스마트배너 띄우는 시점에 띄우지 않고, 직접 띄움
 */
export const AppPopupTypes = {
  LANDING: 'LANDING',
  ACTION: 'ACTION',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AppPopupTypes = ValueOf<typeof AppPopupTypes>;

export type AppPopupDataProps = {
  title: string;
  desc: string;
  confirmLabel: string;
};

/** 공통 메시지 */
export const AppPopupCommonMessage: AppPopupDataProps = {
  title: '앱 전용 기능을 확인해보세요',
  desc: '프로모션부터 라이브까지, 앱으로<br />알림을 받을 수 있습니다',
  confirmLabel: '앱 다운받기',
};

const AppPopupCommonPromotionMessage: AppPopupDataProps = {
  title: '15% 쿠폰을 확인해보세요',
  desc: '앱 신규 가입 전용 쿠폰, 놓치지 마세요',
  confirmLabel: '쿠폰 받으러 가기',
};

/** AppPopupTypes가 LANDING 인 케이스에서의 메시지 */
export const AppPopupLandingMessage: Record<string, AppPopupDataProps> = {
  DEFAULT: AppPopupCommonMessage,
  PROMOTION: AppPopupCommonPromotionMessage,
};

/** AppPopupTypes가 ACTION 인 케이스에서의 메시지 */
export const AppPopupActionKind = {
  GOODS_UPDATE_NOTIFY: 'GOODS_UPDATE_NOTIFY',
  CONTENT: 'CONTENT',
  LIVE_AUCTION: 'LIVE_AUCTION',
  LIVE_FOLLOW: 'LIVE_FOLLOW',
  SHOWROOM_FOLLOW: 'SHOWROOM_FOLLOW',
  SHOWROOM_FOLLOW_CANCEL: 'SHOWROOM_FOLLOW_CANCEL',
  AUTH_ADULT: 'AUTH_ADULT',
  PDP_PURCHASE: 'PDP_PURCHASE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AppPopupActionKind = ValueOf<typeof AppPopupActionKind>;

/** AppPopupActionKind 설정한 상태에서의 일반 메시지 */
const AppPopupActionBaseDefaultMessage = {
  ...AppPopupCommonMessage,
  title: '앱을 다운받아 주세요',
  confirmLabel: '지금 다운받기',
};

export const AppPopupActionBaseMessage: Record<AppPopupActionKind, AppPopupDataProps | null> = {
  [AppPopupActionKind.GOODS_UPDATE_NOTIFY]: {
    ...AppPopupActionBaseDefaultMessage,
    desc: '판매 알림은 앱에서만 받을 수 있습니다',
  },
  [AppPopupActionKind.CONTENT]: {
    ...AppPopupActionBaseDefaultMessage,
    desc: '앱에서만 참여할 수 있습니다',
  },
  [AppPopupActionKind.LIVE_AUCTION]: {
    ...AppPopupActionBaseDefaultMessage,
    desc: '경매는 앱에서만 참여할 수 있습니다',
  },
  [AppPopupActionKind.LIVE_FOLLOW]: {
    ...AppPopupActionBaseDefaultMessage,
    desc: '라이브 알림은 앱에서 받을 수 있습니다',
  },
  [AppPopupActionKind.SHOWROOM_FOLLOW]: {
    ...AppPopupActionBaseDefaultMessage,
    desc: '앱에서만 팔로우할 수 있습니다',
  },
  [AppPopupActionKind.SHOWROOM_FOLLOW_CANCEL]: {
    ...AppPopupActionBaseDefaultMessage,
    desc: '앱에서만 취소할 수 있습니다',
  },
  [AppPopupActionKind.AUTH_ADULT]: {
    ...AppPopupActionBaseDefaultMessage,
    desc: '성인 인증이 필요한 상품은<br />앱에서만 구매할 수 있습니다',
  },
  [AppPopupActionKind.PDP_PURCHASE]: null,
};

export const AppPopupActionPromotionMessage: Record<AppPopupActionKind, AppPopupDataProps | null> = {
  [AppPopupActionKind.GOODS_UPDATE_NOTIFY]: AppPopupActionBaseMessage.GOODS_UPDATE_NOTIFY,
  [AppPopupActionKind.CONTENT]: AppPopupActionBaseMessage.CONTENT,
  [AppPopupActionKind.LIVE_AUCTION]: AppPopupActionBaseMessage.LIVE_AUCTION,
  [AppPopupActionKind.LIVE_FOLLOW]: AppPopupActionBaseMessage.LIVE_FOLLOW,
  [AppPopupActionKind.SHOWROOM_FOLLOW]: AppPopupActionBaseMessage.SHOWROOM_FOLLOW,
  [AppPopupActionKind.SHOWROOM_FOLLOW_CANCEL]: AppPopupActionBaseMessage.SHOWROOM_FOLLOW_CANCEL,
  [AppPopupActionKind.AUTH_ADULT]: AppPopupActionBaseMessage.AUTH_ADULT,
  [AppPopupActionKind.PDP_PURCHASE]: {
    ...AppPopupCommonPromotionMessage,
    title: '15% 쿠폰 받으셨나요?',
    desc: '앱 신규 가입 전용 쿠폰, 구매 전 반드시<br />확인해보세요',
  },
};
