/**
 * Call Web (App -> Web)
 *
 * @see {@link https://www.notion.so/Web-Interface-b55be04d1f4a4013851b6534f56d5a78#f7e8cfb2cf72403aacd60b82279db7a8}
 */
export const CallWebTypes = {
  SignInCompleted: 'signinCompleted',
  ReissueCompleted: 'reissueCompleted',
  AlertMessageClosed: 'alertMessageClosed',
  ReceiveData: 'receiveData',
  InitialData: 'initialData',
  Search: 'search',
  /** @deprecated ShowroomFollowStatusUpdated로 대체 */
  SubscriptionStatusUpdated: 'subscriptionStatusUpdated',
  ShowroomFollowStatusUpdated: 'showroomFollowStatusUpdated',
  ScheduleFollowStatusUpdated: 'scheduleFollowStatusUpdated',
  ShowroomBannerClosed: 'showroomBannerClosed',
  BottomSafeAreaUpdated: 'bottomSafeAreaUpdated',
  AddedToCart: 'addedToCart',
  FloatingLivePlayerStatus: 'floatingLivePlayerStatus',
  ToolbarButtonTapped: 'toolbarButtonTapped',
  // Mweb Only
  WebStatusCompleted: 'WebStatusCompleted',
  CartItemUpdated: 'CartItemUpdated',
  WishItemUpdated: 'WishItemUpdated',
  Initialize: 'initialize',
  PageActivated: 'pageActivated',
  NotificationStatus: 'notificationStatus',
  CardScanCompleted: 'cardScanCompleted',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CallWebTypes = ValueOf<typeof CallWebTypes>;

export const CustomEventMappedTypes = {
  [CallWebTypes.SignInCompleted]: 'prizmSigninCompleted',
  [CallWebTypes.ReissueCompleted]: 'prizmReissueCompleted',
  [CallWebTypes.AlertMessageClosed]: 'prizmAlertMessageClosed',
  [CallWebTypes.ReceiveData]: 'prizmReceiveData',
  [CallWebTypes.InitialData]: 'prizmInitialData',
  [CallWebTypes.Search]: 'prizmSearch',
  [CallWebTypes.SubscriptionStatusUpdated]: 'prizmSubscriptionStatusUpdated',
  [CallWebTypes.ShowroomFollowStatusUpdated]: 'prizmShowroomFollowStatusUpdated',
  [CallWebTypes.ScheduleFollowStatusUpdated]: 'prizmScheduleFollowStatusUpdated',
  [CallWebTypes.ShowroomBannerClosed]: 'prizmShowroomBannerClosed',
  [CallWebTypes.BottomSafeAreaUpdated]: 'prizmBottomSafeAreaUpdated',
  [CallWebTypes.AddedToCart]: 'prizmAddedToCart',
  [CallWebTypes.FloatingLivePlayerStatus]: 'prizmFloatingLivePlayerStatus',
  [CallWebTypes.ToolbarButtonTapped]: 'prizmToolbarButtonTapped',
  //
  [CallWebTypes.WebStatusCompleted]: 'prizmWebStatusCompleted',
  [CallWebTypes.CartItemUpdated]: 'prizmCartItemUpdated',
  [CallWebTypes.WishItemUpdated]: 'prizmWishItemUpdated',
  [CallWebTypes.Initialize]: 'prizmInitialize',
  [CallWebTypes.PageActivated]: 'prizmPageActivated',
  [CallWebTypes.NotificationStatus]: 'prizmNotificationStatus',
  [CallWebTypes.CardScanCompleted]: 'prizmCardScanCompleted',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CustomEventMappedTypes = ValueOf<typeof CustomEventMappedTypes>;

/**
 * Call App (Web -> App)
 *
 * @see {@link https://www.notion.so/Web-Interface-b55be04d1f4a4013851b6534f56d5a78#f3f9368ba29c420caec4e4563b7962bd}
 */
export const CallAppTypes = {
  OpenShare: 'openShare',
  SignIn: 'signIn',
  ReissueToken: 'reissueToken',
  InvalidatedToken: 'invalidatedToken',
  OpenPage: 'openPage',
  ReloadPage: 'reloadPage',
  ClosePage: 'closePage',
  SetTopBar: 'setTopBar',
  /** @deprecated ShowroomFollowStatusUpdated로 대체 */
  SubscriptionStatusUpdated: 'subscriptionStatusUpdated',
  ShowroomFollowStatusUpdated: 'showroomFollowStatusUpdated',
  WishItemUpdated: 'wishItemUpdated',
  SaleNotificationStatusUpdated: 'saleNotificationStatusUpdated',
  ShowLiveActivity: 'showLiveActivity',
  CartUpdated: 'cartUpdated',
  CouponUpdated: 'couponUpdated',
  ShowAlertMessage: 'showAlertMessage',
  ShowToastMessage: 'showToastMessage',
  ShowSnackbar: 'showSnackbar',
  ShowShowroomBanner: 'showShowroomBanner',
  OpenGoodsOption: 'openGoodsOption',
  FloatingLivePlayerStatus: 'floatingLivePlayerStatus',
  CloseFloatingLivePlayer: 'closeFloatingLivePlayer',
  MuteFloatingLivePlayer: 'muteFloatingLivePlayer',
  Purchase: 'purchase',
  /** @deprecated PurchaseStatusUpdated 대체 */
  PurchaseCancelled: 'purchaseCancelled',
  PurchaseStatusUpdated: 'purchaseStatusUpdated',
  PaymentInfoRegistrationCompleted: 'paymentInfoRegistrationCompleted',
  searchInfoUpdated: 'searchInfoUpdated',
  WebStatus: 'webStatus',
  ScheduleFollowStatusUpdated: 'scheduleFollowStatusUpdated',
  PrizmPayUpdated: 'prizmPayUpdated',
  ShippingAddressUpdated: 'shippingAddressUpdated',
  GeneratieHapticFeedback: 'generateHapticFeedback',
  OrderInfo: 'orderInfo',
  SetDismissConfirm: 'setDismissConfirm',
  OpenSystemService: 'openSystemService',
  NotificationStatus: 'notificationStatus',
  SetSystemNavigation: 'setSystemNavigation',
  OpenCardScanner: 'openCardScanner',
  SetToolbarButton: 'setToolbarButton',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CallAppTypes = ValueOf<typeof CallAppTypes>;

export const CallAppLogTypes = {
  LogEvent: 'logEvent',
  LogUser: 'logUser',
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CallAppLogTypes = ValueOf<typeof CallAppLogTypes>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReceiveData = Record<string, any>;

export interface SignInCompletedParams {
  isCancelled: boolean;
  receiveData: ReceiveData;
}

export interface ReissueCompletedParams {
  isSuccess: boolean;
  errorMessage?: string;
  errorCode?: number;
}

export interface AlertMessageClosedParams {
  isOK: boolean;
  value?: string | number;
  receiveData?: ReceiveData;
}

export interface SearchValuesTypes {
  query: string;
  /** @deprecated v1.15.0 */
  filter?: {
    section: 'all' | 'goods' | 'showrooms' | 'content' | 'live';
  };
}

export interface SubscriptionStatusUpdatedParams {
  showroomId: number;
  showroomCode: string;
  isSubscribed: boolean;
  // 인터페이스에 정의하지 않은 별도 처리를 위한 Web용 Options
  options?: SubscriptionStatusUpdatedOptions;
}

export interface SubscriptionStatusUpdatedOptions {
  onlyState?: boolean;
}

interface ShowroomFollowStatusItemType {
  id: number;
  code: string;
  isFollowed: boolean;
}

export interface ShowroomFollowStatusUpdatedParams {
  showroomList: ShowroomFollowStatusItemType[];
}

/**
 * Web용 Options를 확장한 타입
 *
 * @todo CallApp과 CallWeb 분리 필요
 */
interface ShowroomFollowStatusItemExtendType extends ShowroomFollowStatusItemType {
  options?: {
    onlyState?: boolean;
  };
}

/**
 * Web용 Options를 확장한 타입
 *
 * @todo CallApp과 CallWeb 분리 필요
 */
export interface ShowroomFollowStatusUpdatedExtendParams {
  showroomList: ShowroomFollowStatusItemExtendType[];
}

export interface ScheduleFollowStatusUpdatedParams {
  type: 'live';
  id: number;
  isFollowed: boolean;
  // 인터페이스에 정의하지 않은 별도 처리를 위한 Web용 Options
  options?: ScheduleFollowStatusUpdatedOptions;
}

export interface ScheduleFollowStatusUpdatedOptions {
  onlyState?: boolean;
}

export interface ShowroomBannerClosedParams {
  showroomId: number;
  showroomName: string;
  isFollowed: boolean;
}

export interface FloatingLivePlayerStatusParams {
  liveId?: number;
}

/** open interface MWeb Only */
export interface WebStatusParams {
  listenerStatus: 'ready' | 'unready';
}

/** Cart Item Updated Types */
export type CartItemUpdatedParams = { isAdded: boolean };

/** Wish Item Updated Types */
export type WishItemUpdatedParams = { goodsId: number; goodsCode: string; isAdded: boolean };

/** Sale Notification Updated Types */
export type SalesNotificationUpdatedParams = { goodsId: number; goodsCode: string; isOn: boolean };

/** Show LiveActivity Types */
export type ShowLiveActivityParams = {
  type: 'GOODS';
  id: number;
  title: string;
  imagePath: string;
  startDate: number;
  deepLinkUrl: string;
};

/** 시스템 영역을 포함한 값 조회 */
export type InitializeParams = { topInset: number };

/** Native bottomBar show/hide status Types */
export type BottomSafeAreaUpdated = { inset: number; isAnimated: boolean };

/** Generate Haptic Feedback Types */
export const GenerateHapticFeedbackType = {
  TapLight: 'tapLight',
  TapMedium: 'tapMedium',
  InformDelete: 'informDelete',
  InformLongPress: 'informLongPress',
  Confirm: 'confirm',
  Success: 'success',
  Error: 'error',
  Custom: 'custom',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GenerateHapticFeedbackType = ValueOf<typeof GenerateHapticFeedbackType>;

export const GenerateHapticFeedbackCustomKey = {
  /**
   * Custom Key 정의: https://www.notion.so/rxc/HapticFeedback-Custom-Key-ac638b0e9b3e45279d879cb6d98d1bac?pvs=4
   * 문서에서 정의된 케이스 중, Webview 케이스에 해당하는 Custom key만 정의
   */
  MainShowroomShortcutCollisionFirst: 'mainShowroomShortcutCollisionFirst', // 예시용. Webview 케이스에 해당되지 않아 해당 Custom key는 실제로 사용하진 않음
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GenerateHapticFeedbackCustomKey = ValueOf<typeof GenerateHapticFeedbackCustomKey>;

export type GenerateHapticFeedbackParams = {
  type: GenerateHapticFeedbackType;
  /**
   * type이 custom인 경우, 아래 customKey를 포함하여 호출
   */
  customKey?: GenerateHapticFeedbackCustomKey;
};

/** Native Modal Toolbar Action Types */
export type ToolbarButtonTappedParams = { type: 'refresh' | 'view' | 'selectAll' | 'clear' };

/** 시스템 알림 설정 상태 값 */
export interface NotificationStatusParams {
  isAllowed: boolean;
}

export interface CardScanCompletedParams {
  /** 인식된 카드번호 */
  number: string;
  /** 카드 만료 일자 mm/yy or "" */
  expiredDate?: string;
}
