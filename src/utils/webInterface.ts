import {
  CallAppTypes,
  CallAppLogTypes,
  CallWebTypes,
  CustomEventMappedTypes,
  SignInCompletedParams,
  ReissueCompletedParams,
  AlertMessageClosedParams,
  SearchValuesTypes,
  SubscriptionStatusUpdatedOptions,
  ScheduleFollowStatusUpdatedOptions,
  ShowroomBannerClosedParams,
  WishItemUpdatedParams,
  SalesNotificationUpdatedParams,
  ShowLiveActivityParams,
  CartItemUpdatedParams,
  GenerateHapticFeedbackParams,
  GenerateHapticFeedbackType,
  ToolbarButtonTappedParams,
  ShowroomFollowStatusUpdatedParams,
  ShowroomFollowStatusUpdatedExtendParams,
  NotificationStatusParams,
  CardScanCompletedParams,
} from '@constants/webInterface';
import { LogEventAppParams, LogUserAppParams } from '@models/LogModel';
import { createDebug } from '@utils/debug';
import { userAgent } from '@utils/ua';
import { callApp, callAppLog, isAppVersionLatestCheck, stringifyPayload } from '@utils/web2App';

const debug = createDebug('utils:webInterface');
const { isApp } = userAgent();

/** Custom Event Option Types */
interface PrizmEventOptions<T> extends AddEventListenerOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  convert?: (payload: T) => any;
}

// once events queue
const queueOnceEvents: Array<{
  type: CustomEventMappedTypes;
  listener: (e: Event) => void;
  options: AddEventListenerOptions;
}> = [];

/**
 * Custom Event Handler
 */
function handlePrizmEvent<T, R = T>(type: CustomEventMappedTypes, options: PrizmEventOptions<T>): Promise<R> {
  return new Promise((resolve) => {
    // Custom Event Listener
    const listener = (e: Event) => {
      const { detail } = e as CustomEvent<T>;
      resolve(options?.convert?.(detail) ?? detail);
    };

    // Once Event를 단일로 처리하기 위한 방어 코드
    if (options?.once) {
      // 해당 CustomEvent Type의 Listener와 Queue 모두 제거
      queueOnceEvents.forEach((elem, idx) => {
        if (elem.type === type) {
          // EventListener 제거
          window.removeEventListener(elem.type, elem.listener, elem.options);
          // Queue 제거
          queueOnceEvents.splice(idx, 1);

          debug.log('once event removed', elem);
        }
      });

      // Once Event Queue 추가
      queueOnceEvents.push({ type, listener, options });
    }

    // Add Listener
    window.addEventListener(type, listener, options);
  });
}

/** Message Event Emitter Option Types */
interface PrizmEventEmitterOptions {
  target?: Window;
}

/**
 * Message Event Emitter
 */
function handlePrizmEventEmitter<T>(type: CallWebTypes, payload: T, options: PrizmEventEmitterOptions = {}): void {
  // target 기본값: window
  const { target = window } = options;

  target.postMessage({ event: type, payload: JSON.stringify(payload) }, window.location.origin);
}

/**
 * openShare Types
 * @see https://www.notion.so/rxc/openShare-221b5248e5df42eaafc090fba2dfc444
 */
// 기본 공유 타입
export type OpenShareType = 'CONTENT' | 'SHOWROOM' | 'GOODS' | 'LIVEGOODS' | 'THRILL' | 'LIVE';

// 'CONTENT' 타입의 경우 contentType 필드가 필수
type OpenShareContentType<T extends OpenShareType> = T extends 'CONTENT'
  ? {
      contentType: 'STORY' | 'TEASER' | 'COLLABORATION' | 'EXCLUSIVE' | 'EVENT';
    }
  : unknown;

// 'LIVE' 타입의 경우 id 필드가 필수
// 나머지 타입의 경우 code 필드가 필수
type OpenShareIdentifier<T extends OpenShareType> = T extends 'LIVE'
  ? {
      id: number;
    }
  : {
      code: string;
    };

export type OpenShareParams<T extends OpenShareType> = OpenShareContentType<T> &
  OpenShareIdentifier<T> & {
    type: T;
  };

type OpenShareOptions = { doWeb?: () => void };
export function openShare<T extends OpenShareType>(params: OpenShareParams<T>, options: OpenShareOptions = {}): void {
  const { doWeb } = options;

  if (!isApp) {
    doWeb?.();
    return;
  }

  callApp(CallAppTypes.OpenShare, params);
}

/**
 * Sign In Types
 *
 * addListener: 이벤트 리스너로 반환받을지 여부
 * * signIn의 반환값으로 리스너를 받아야하는 경우 (모웹 모달형, 앱 로그인)
 * */
type SignInOptions = { doWeb?: () => void; addListener?: boolean };

/**
 * Sign In
 */
export function signIn(options: SignInOptions = {}) {
  const {
    doWeb = () => {
      window.location.href = '/member/login';
    },
    addListener = isApp,
  } = options;

  if (!isApp) {
    doWeb();
  } else {
    callApp(CallAppTypes.SignIn);
  }

  if (!addListener) {
    return Promise.resolve(false);
  }

  return handlePrizmEvent<SignInCompletedParams, boolean>(CustomEventMappedTypes.signinCompleted, {
    once: true,
    convert: ({ isCancelled }) => !isCancelled,
  });
}

/**
 * SignIn Emitter
 */
export function emitSignIn(isOK: boolean) {
  handlePrizmEventEmitter<SignInCompletedParams>(CallWebTypes.SignInCompleted, { isCancelled: !isOK, receiveData: {} });
}

/** ReIssue Types */
type ReIssueOptions = { doWeb?: () => Promise<ReissueCompletedParams> };

/**
 * ReIssue Token
 */
export function reIssue(options: ReIssueOptions = {}) {
  const {
    doWeb = () => {
      /** @todo Web 처리시 기본 로직이 필요한 경우 추가 */
      return Promise.resolve({
        isSuccess: false,
        errorMessage: '정의되지 않은 처리입니다.',
      });
    },
  } = options;

  if (!isApp) {
    return doWeb?.();
  }

  callApp(CallAppTypes.ReissueToken);

  return handlePrizmEvent<ReissueCompletedParams>(CustomEventMappedTypes.reissueCompleted, {
    once: true,
  });
}

/** InvalidatedToken Types */
type InvalidatedTokenOptions = { doWeb?: () => void };

/**
 * Invalidated token
 * 웹뷰에서 토큰 invalid 에러가 발생했음
 */
export function invalidatedToken(options: InvalidatedTokenOptions = {}) {
  const { doWeb } = options;

  if (!isApp) {
    doWeb?.();
    return;
  }

  callApp(CallAppTypes.InvalidatedToken);
}

/** Alert Types */
export type AlertParams = {
  title?: string;
  message: string;
  buttonTitle?: string;
};

/**
 * Alert
 */
export function alert(params: AlertParams, options: { doWeb?: (params: AlertParams) => void } = {}) {
  const { title = '', message, buttonTitle: primaryButtonTitle } = params;
  const { doWeb } = options;

  // 모웹 기본 alert
  // TODO: window alert 사용되는 부분 고려하지 않을 경우 제거
  if (!isApp && !doWeb) {
    window.alert(message);
    return true;
  }

  if (isApp) {
    callApp(CallAppTypes.ShowAlertMessage, {
      title,
      message,
      primaryButtonTitle,
      type: 'alert',
    });
  } else {
    doWeb?.(params);
  }

  return handlePrizmEvent<AlertMessageClosedParams, boolean>(CustomEventMappedTypes.alertMessageClosed, {
    once: true,
    convert: ({ isOK }) => isOK,
  });
}

/**
 * Alert Emitter
 */
export function emitAlert() {
  handlePrizmEventEmitter<AlertMessageClosedParams>(CallWebTypes.AlertMessageClosed, { isOK: true });
}

/** Confirm Types */
export type ConfirmParams = {
  title: string;
  message?: string;
  confirmButtonTitle?: string;
  cancelButtonTitle?: string;
};

/**
 * Confirm
 */
export function confirm(params: ConfirmParams, options: { doWeb?: (params: ConfirmParams) => void } = {}) {
  const {
    title = '',
    message,
    confirmButtonTitle: primaryButtonTitle,
    cancelButtonTitle: secondaryButtonTitle,
  } = params;
  const { doWeb } = options;

  // 모웹 기본 confirm
  // TODO: window confirm 사용되는 부분 고려하지 않을 경우 제거
  if (!isApp && !doWeb) {
    return window.confirm(message);
  }

  if (isApp) {
    callApp(CallAppTypes.ShowAlertMessage, {
      title,
      message,
      primaryButtonTitle,
      secondaryButtonTitle,
      type: 'confirm',
    });
  } else {
    doWeb?.(params);
  }

  return handlePrizmEvent<AlertMessageClosedParams, boolean>(CustomEventMappedTypes.alertMessageClosed, {
    once: true,
    convert: ({ isOK }) => isOK,
  });
}

/**
 * Confirm Emitter
 */
export function emitConfirm(params: Pick<AlertMessageClosedParams, 'isOK'>) {
  handlePrizmEventEmitter<AlertMessageClosedParams>(CallWebTypes.AlertMessageClosed, params);
}

/** Prompt Types */
export type PromptParams = {
  title?: string;
  message: string;
  placeholder?: string;
  confirmButtonTitle?: string;
  cancelButtonTitle?: string;
};

export type PromptOptions = {
  numeric?: boolean;
  doWeb?: (params: PromptParams, options: PromptOptions) => void;
};

/**
 * Prompt
 */
export function prompt(params: PromptParams, options: PromptOptions = {}) {
  const {
    title = '',
    placeholder,
    message,
    confirmButtonTitle: primaryButtonTitle,
    cancelButtonTitle: secondaryButtonTitle,
  } = params;
  const { numeric = true, doWeb } = options;

  // 모웹 기본 prompt
  // TODO: window prompt 사용되는 부분 고려하지 않을 경우 제거
  if (!isApp && !doWeb) {
    return window.prompt(message);
  }

  if (isApp) {
    callApp(CallAppTypes.ShowAlertMessage, {
      title,
      message,
      placeholder,
      primaryButtonTitle,
      secondaryButtonTitle,
      type: numeric ? 'prompt_num' : 'prompt_text',
    });
  } else {
    doWeb?.(params, { numeric });
  }

  return handlePrizmEvent<AlertMessageClosedParams, number | string | boolean | null>(
    CustomEventMappedTypes.alertMessageClosed,
    {
      once: true,
      convert: ({ isOK, value }) => (isOK ? value : isOK),
    },
  );
}

/**
 * Confirm Emitter
 */
export function emitPrompt(params: Omit<AlertMessageClosedParams, 'receiveData'>) {
  handlePrizmEventEmitter<AlertMessageClosedParams>(CallWebTypes.AlertMessageClosed, params);
}

/**
 * showroomBannerClosed
 * @returns
 */
export function showroomBannerClosed() {
  return handlePrizmEvent<ShowroomBannerClosedParams>(CustomEventMappedTypes.showroomBannerClosed, {});
}

export function signinCompleted() {
  return handlePrizmEvent<SignInCompletedParams, boolean>(CustomEventMappedTypes.signinCompleted, {
    once: true,
    convert: ({ isCancelled }) => !isCancelled,
  });
}

/** Open Page Types */
export type OpenParams = { url: string; initialData: Record<string, unknown> };
export type OpenOptions = { doWeb?: () => void };

/**
 * Open Page
 */
export function open(params: OpenParams, options: OpenOptions = {}): void {
  const { url, initialData } = params;
  const { doWeb } = options;

  if (!isApp) {
    doWeb?.();
    return;
  }

  callApp(CallAppTypes.OpenPage, {
    deepLinkUrl: url,
    initialData: stringifyPayload(initialData),
  });
}

/** Open Emitter Types */
export type EmitOpenParams = Omit<OpenParams, 'url'>;
export type EmitOpenOptions = { target?: Window };

/**
 * Open Emitter (InitialData)
 */
export function emitOpen(params: EmitOpenParams, options: EmitOpenOptions = {}) {
  const { target } = options;

  handlePrizmEventEmitter<EmitOpenParams>(CallWebTypes.InitialData, params, { target });
}

/** Reload Page Types */
type ReloadOptions = { doWeb?: () => void };

/**
 * Reload Page
 */
export function reload(options: ReloadOptions = {}): void {
  const {
    doWeb = () => {
      window.location.reload();
    },
  } = options;

  if (!isApp) {
    doWeb?.();
    return;
  }

  callApp(CallAppTypes.ReloadPage);
}

/** Close Page Types */
export type CloseReceiveData = Record<string, unknown>;
export type CloseOptions = { doWeb?: () => void; isError?: boolean; isModalDismiss?: boolean };

/**
 * Close Page
 */
export function close(receiveData: CloseReceiveData = {}, options: CloseOptions = {}): void {
  const { doWeb, isError = false, isModalDismiss = false } = options;

  if (!isApp) {
    doWeb?.();
    return;
  }

  /**
   * 2023.11.20
   * 점유 시간 만료 시 close interface 의 호출 값으로
   * receiveData = '' 로 보내기로 정해 '' 값으로 보내기 위한 boolean 값 추가
   */
  callApp(CallAppTypes.ClosePage, {
    receiveData: isError ? '' : stringifyPayload(receiveData),
    isModalDismiss,
  });
}

/** Close Emitter Types */
export type EmitCloseParams = CloseReceiveData;
export type EmitCloseOptions = { target?: Window };

/**
 * Close Emitter (ReceiveData)
 */
export function emitClose(params: EmitCloseParams, options: EmitCloseOptions = {}) {
  const { target } = options;

  handlePrizmEventEmitter<CloseReceiveData>(CallWebTypes.ReceiveData, params, { target });
}

/** Set Top Bar Types */
/* Cspell:disable */
type SetTopBarCommentInfoProps = {
  /** 코멘트 갯수 */
  count: number;
  /** noti&event 영역 타이틀 (optional) */
  notiTitle?: string;
  /** noti&event 영역 디스크립션 (optional) */
  notiDescription?: string;
};

export type SetTopBarParams = {
  title: string;
  titleImagePath?: string;
  showroomCode?: string;
  /** commentInfo 필드가 내려올 때에 상단 앱바에 댓글 아이콘 노출처리 */
  commentInfo?: SetTopBarCommentInfoProps;
  /** reviewInfo 필드가 내려올 때에 상단 앱바에 리뷰 더보기 아이콘 노출처리 리뷰 */
  reviewInfo?: {
    reviewId: number;
  };
  /** TopBar 배경효과 세팅 */
  backgroundEffectType?: 'default' | 'none' | 'transparent';
  /** 상단 앱바의 공유 버튼 및 동작 변경 */
  shareInfo?: {
    type: 'referrals';
  };
};
/* Cspell:enable */

/**
 * Set Top Bar
 */
export function setTopBar(params: SetTopBarParams): void {
  if (!isApp) {
    return;
  }

  callApp(CallAppTypes.SetTopBar, params);
}

/** Subscription Status Updated Types */
type SubscriptionStatusUpdatedParams = { showroomId: number; showroomCode: string; isSubscribed: boolean };

/**
 * Subscription Status Updated
 *
 * @deprecated showroomFollowStatusUpdated로 대체
 */
export function subscriptionStatusUpdated(params: SubscriptionStatusUpdatedParams): void {
  if (!isApp) {
    return;
  }

  callApp(CallAppTypes.SubscriptionStatusUpdated, params);
}

/**
 * Emitting Subscription Status Updated (Web -> Web)
 *
 * @deprecated emitShowroomFollowStatusUpdated로 대체
 */
export function emitSubscriptionStatusUpdated(
  params: SubscriptionStatusUpdatedParams,
  options?: SubscriptionStatusUpdatedOptions,
) {
  handlePrizmEventEmitter<SubscriptionStatusUpdatedParams>(CallWebTypes.SubscriptionStatusUpdated, {
    ...params,
    ...(options && { options: { ...options } }),
  });
}

/**
 * Showroom Follow Status Updated
 *
 * @since App v1.29.0
 */
export function showroomFollowStatusUpdated(params: ShowroomFollowStatusUpdatedParams): void {
  if (!isApp) {
    return;
  }

  callApp(CallAppTypes.ShowroomFollowStatusUpdated, { ...params });
}

/**
 * Emitting Showroom Follow Status Updated (Web -> Web)
 */
export function emitShowroomFollowStatusUpdated(params: ShowroomFollowStatusUpdatedExtendParams): void {
  handlePrizmEventEmitter<ShowroomFollowStatusUpdatedExtendParams>(CallWebTypes.ShowroomFollowStatusUpdated, params);
}

/** Cart Item Updated (Web -> Web) */
export function emitCartItemUpdated(params: CartItemUpdatedParams): void {
  handlePrizmEventEmitter<CartItemUpdatedParams | null>(CallWebTypes.CartItemUpdated, params);
}

/**
 * Wish Item Updated
 */
/**
 * Emitting Wish Item Updated (Web -> Web)
 */
export function emitWishItemUpdated(params: WishItemUpdatedParams | null): void {
  handlePrizmEventEmitter<WishItemUpdatedParams | null>(CallWebTypes.WishItemUpdated, params);
}

/**
 * Emitting Tollbar Button Tapped (Web -> Web)
 */
export function emitToolbarButtonTapped(params: ToolbarButtonTappedParams | null): void {
  handlePrizmEventEmitter<ToolbarButtonTappedParams | null>(CallWebTypes.ToolbarButtonTapped, params);
}

/**
 * App Update Wish Item
 */
export function wishItemUpdated(params: WishItemUpdatedParams): void {
  if (!isApp) {
    return;
  }

  callApp(CallAppTypes.WishItemUpdated, params);
}

/**
 * App Update Notification
 */
export function salesNotificationUpdated(params: SalesNotificationUpdatedParams): void {
  if (!isApp) {
    return;
  }

  callApp(CallAppTypes.SaleNotificationStatusUpdated, params);
}
/**
 * IOS Show LiveActivity
 */
export function showLiveActivity(params: ShowLiveActivityParams): void {
  if (!isApp) {
    return;
  }

  callApp(CallAppTypes.ShowLiveActivity, params);
}

type CartUpdatedParams = {
  /** 쇼핑백 내 전체 상품 개수 */
  itemCount: number;
};
type CartUpdatedOptions = { doWeb?: () => void };

/**
 * 쇼핑백 페이지에서 아이템 개수 변화가 있을때 호출
 */
export function cartUpdated(params: CartUpdatedParams, options: CartUpdatedOptions = {}): void {
  const { doWeb } = options;

  if (!isApp) {
    doWeb?.();
    return;
  }

  callApp(CallAppTypes.CartUpdated, params);
}

/**
 * coupon Download 이후 App 동기화
 */
export function couponUpdated(): void {
  if (!isApp) {
    return;
  }

  callApp(CallAppTypes.CouponUpdated);
}

/** Show Toast Message Types */
export type ShowToastMessageParams = { message: string };
type ShowToastMessageOptions = { doWeb?: () => void };

/**
 * Show Toast Message
 */
export function showToastMessage(params: ShowToastMessageParams, options: ShowToastMessageOptions = {}): void {
  const { doWeb } = options;

  if (!isApp) {
    doWeb?.();
    return;
  }

  callApp(CallAppTypes.ShowToastMessage, params);
}

/** Show Toast Message Types */
export type ShowSnackbarParams = {
  title: string;
  message?: string;
  imagePath?: string;
  deepLinkUrl?: string;
  isHighlighted?: boolean;
  isAutoClose: boolean;
};
type ShowSnackbarOptions = { doWeb?: () => void };

/**
 * Show Toast Message
 */
export function showSnackbar(params: ShowSnackbarParams, options: ShowSnackbarOptions = {}): void {
  const { doWeb } = options;

  if (!isApp) {
    doWeb?.();
    return;
  }

  callApp(CallAppTypes.ShowSnackbar, params);
}

/** Show Showroom Snackbar */
export type ShowShowroomBannerParams = {
  id: number;
  code: string;
  name: string;
  imagePath: string;
  backgroundColor?: string;
  contentColor?: string;
  textColor: string;
  tintColor: string;
  isFollowed: boolean;
  liveId?: number;
};

/**
 * Show Showroom Banner
 */
export function showShowroomBanner(params: ShowShowroomBannerParams): void {
  if (!isApp) {
    return;
  }

  const { backgroundColor, tintColor } = params;

  /**
   * 콘셉트 쇼룸 컬러 정책 변경(backgroundColor -> tintColor로 대체) 관련 수정
   * 구버전 (1.4.1) 이하에서 backgroundColor를 tintColor로 치환하는 작업이 필요함.
   */
  const parameters = {
    ...params,
    backgroundColor: isAppVersionLatestCheck('1.4.1') ? tintColor : backgroundColor,
  };

  callApp(CallAppTypes.ShowShowroomBanner, parameters);
}

/** Open Goods Option Types */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OpenGoodsOptionParams = Record<string, any>;
export type OpenGoodsOptionOptions = { doWeb?: () => void };

/**
 * Open Goods Option
 */
export function openGoodsOption(params: OpenGoodsOptionParams, options: OpenGoodsOptionOptions = {}): void {
  const { doWeb } = options;

  if (!isApp) {
    doWeb?.();
    return;
  }

  callApp(CallAppTypes.OpenGoodsOption, params);
}

/**
 * Floating Live Player Status
 */
export function floatingLivePlayerStatus(): void {
  if (!isApp) {
    return;
  }

  callApp(CallAppTypes.FloatingLivePlayerStatus);
}

/**
 * Close Floating Live Player
 */
export function closeFloatingLivePlayer(): void {
  if (!isApp) {
    return;
  }

  callApp(CallAppTypes.CloseFloatingLivePlayer);
}

/**
 * Mute Floating Live Player
 */
export function muteFloatingLivePlayer(): void {
  if (!isApp) {
    return;
  }

  callApp(CallAppTypes.MuteFloatingLivePlayer);
}

/** Purchase Types */
type PurchaseParams = {
  status: 'success' | 'request' | 'failure';
  goodsList?: Array<{ goodsId: number; goodsCode: string }>;
};

/**
 * Purchase Completed
 */
export function purchase({ status, goodsList = [] }: PurchaseParams) {
  if (!isApp) {
    return;
  }

  callApp(CallAppTypes.Purchase, { status, goodsList });
}

/** Purchase Cancelled Types */
type PurchaseCancelledParams = {
  orderId: number;
  type: 'exchange' | 'cancel' | 'return';
};

/**
 * Purchase Cancelled
 * @deprecated purchaseStatusUpdated 대체
 */
export function purchaseCancelled(params: PurchaseCancelledParams) {
  if (!isApp) {
    return;
  }

  callApp(CallAppTypes.PurchaseCancelled, params);
}

/** PurchaseStatusUpdated Types */
type PurchaseStatusUpdatedParams = {
  orderId: number;
  type: 'exchange' | 'cancel' | 'return' | 'confirm';
};

/**
 * Purchase Status Updated
 */
export function purchaseStatusUpdated(params: PurchaseStatusUpdatedParams) {
  if (!isApp) {
    return;
  }

  callApp(CallAppTypes.PurchaseStatusUpdated, params);
}

/**
 * PaymentInfo Registration Completed
 */
export function paymentInfoRegistrationCompleted() {
  if (!isApp) {
    return;
  }

  callApp(CallAppTypes.PaymentInfoRegistrationCompleted);
}

/** Search Updated Types */
type SearchInfoUpdatedParams = {
  query: string;
  filter?: {
    section?: string;
  };
  path: string;
};

/**
 * Search Updated
 */
export function searchInfoUpdated(params: SearchInfoUpdatedParams) {
  if (!isApp) {
    return;
  }

  callApp(CallAppTypes.searchInfoUpdated, params);
}

/**
 * Emitting Search (Web -> Web)
 */
export function emitSearch(params: SearchValuesTypes) {
  handlePrizmEventEmitter<SearchValuesTypes>(CallWebTypes.Search, params);
}

/** Web Status Types */
type WebStatusParams = {
  listenerStatus: 'ready' | 'unready';
};

/**
 * Web Status
 */
export function webStatus(params: WebStatusParams) {
  if (!isApp) {
    // 부모창이 있는 경우 현재의 상태를 부모창에 전달
    window.opener &&
      handlePrizmEventEmitter<WebStatusParams>(CallWebTypes.WebStatusCompleted, params, { target: window.opener });
    return;
  }

  callApp(CallAppTypes.WebStatus, params);
}

/** Schedule Follow Status Updated Types */
export type ScheduleFollowStatusUpdatedParams = {
  type: 'live';
  id: number;
  isFollowed: boolean;
};

/**
 * Schedule Follow Status Updated
 */
export function scheduleFollowStatusUpdated(params: ScheduleFollowStatusUpdatedParams) {
  if (!isApp) {
    return;
  }

  callApp(CallAppTypes.ScheduleFollowStatusUpdated, params);
}

/**
 * Emitting Schedule Follow Status Updated (Web -> Web)
 */
export function emitScheduleFollowStatusUpdated(
  params: ScheduleFollowStatusUpdatedParams,
  options?: ScheduleFollowStatusUpdatedOptions,
) {
  handlePrizmEventEmitter<ScheduleFollowStatusUpdatedParams>(CallWebTypes.ScheduleFollowStatusUpdated, {
    ...params,
    ...(options && { options: { ...options } }),
  });
}

/** LogEvent Types */
type LogEventOptions = { doWeb?: () => void };

/**
 * LogEvent
 */
export function logEvent(params: LogEventAppParams, options: LogEventOptions = {}): void {
  const { doWeb } = options;
  if (!isApp) {
    doWeb?.();
    return;
  }

  callAppLog(CallAppLogTypes.LogEvent, params);
}

/** LogUser Types */
type LogUserOptions = { doWeb?: () => void };

/**
 * LogUser
 */
export function logUser(params: LogUserAppParams, options: LogUserOptions = {}): void {
  const { doWeb } = options;
  if (!isApp) {
    doWeb?.();
    return;
  }

  callAppLog(CallAppLogTypes.LogUser, params);
}

/**
 * clear Receive data
 */
export function emitClearReceiveValues() {
  handlePrizmEventEmitter(CallWebTypes.ReceiveData, {});
}

/** PrizmPayUpdated Types */
type PrizmPayUpdatedOptions = { doWeb?: () => void };

type PrizmPayUpdatedParams = {
  status: 'added' | 'removed' | 'edited';
};

export function prizmPayUpdated(params: PrizmPayUpdatedParams, options: PrizmPayUpdatedOptions = {}) {
  const { doWeb } = options;
  if (!isApp) {
    doWeb?.();
    return;
  }

  callApp(CallAppTypes.PrizmPayUpdated, params);
}

/** ShippingAddressUpdated Types */
type ShippingAddressUpdatedOptions = { doWeb?: () => void };

type ShippingAddressUpdatedParams = {
  status: 'added' | 'removed' | 'edited';
};

export function shippingAddressUpdated(
  params: ShippingAddressUpdatedParams,
  options: ShippingAddressUpdatedOptions = {},
) {
  const { doWeb } = options;
  if (!isApp) {
    doWeb?.();
    return;
  }

  callApp(CallAppTypes.ShippingAddressUpdated, params);
}

/** Generate Haptic Feedback */
export function generateHapticFeedback(params: GenerateHapticFeedbackParams): void {
  const { type, customKey } = params;

  // type이 custom이고, customKey 값이 입력되지 않은 경우 callApp 미호출
  const isValidErrorCustomType = type === GenerateHapticFeedbackType.Custom && !customKey;

  if (!isApp || isValidErrorCustomType) {
    return;
  }

  callApp(CallAppTypes.GeneratieHapticFeedback, params);
}

/** OrderInfo Types */
type OrderInfoParams = {
  goodsIds: number[];
  goodsKind: string;
  checkoutId: number;
  expiredDate?: number;
};

/** 주문서 페이지가 cancel 될때 expirationTime 값이 있을 경우 checkoutId 값으로 lock 해제 처리 */
export function orderInfo(params: OrderInfoParams): void {
  if (!isApp) {
    return;
  }

  callApp(CallAppTypes.OrderInfo, params);
}

/** SetDismissConfirm Types */
type SetDismissConfirmParams = {
  isConfirmable: boolean;
  title: string;
  message: string;
  confirmButtonTitle?: string;
  cancelButtonTitle?: string;
};

export function setDismissConfirm(params: SetDismissConfirmParams): void {
  if (!isApp) {
    return;
  }
  const { title, message, isConfirmable, confirmButtonTitle: okButtonTitle, cancelButtonTitle } = params;
  callApp(CallAppTypes.SetDismissConfirm, {
    title,
    message,
    isConfirmable,
    okButtonTitle,
    cancelButtonTitle,
  });
}

/** OpenSystemService Types */
type OpenSystemServiceParams = {
  type: 'notificationSettings';
};

export function openSystemService(params: OpenSystemServiceParams): void {
  if (!isApp) {
    return;
  }

  callApp(CallAppTypes.OpenSystemService, params);
}

/**
 * 알림 설정 상태
 */
export function notificationStatus() {
  if (!isApp) {
    return true;
  }

  callApp(CallAppTypes.NotificationStatus);

  return handlePrizmEvent<NotificationStatusParams, boolean>(CustomEventMappedTypes.notificationStatus, {
    once: true,
    convert: ({ isAllowed }) => isAllowed,
  });
}

/** SetSystemNavigation Types */
type SetSystemNavigationParams = {
  isPopAllowed?: boolean;
  isDismissAllowed?: boolean;
};

/**
 * 웹 페이지 뒤로가기 및 모달 dismiss 허용 여부 변경
 */
export function setSystemNavigation(params: SetSystemNavigationParams): void {
  if (!isApp) {
    return;
  }
  const { isPopAllowed, isDismissAllowed } = params;
  callApp(CallAppTypes.SetSystemNavigation, {
    isPopAllowed,
    isDismissAllowed,
  });
}

/**
 * Open Card Scanner Types
 * */
type OpenCardScannerParams = { doWeb?: () => Promise<CardScanCompletedParams> };

/**
 * 신용카드 스캐너 호출
 * */
export function openCardScanner(params: OpenCardScannerParams = {}) {
  const { doWeb } = params;

  if (!isApp) {
    return doWeb?.();
  }
  callApp(CallAppTypes.OpenCardScanner);

  return handlePrizmEvent<CardScanCompletedParams>(CustomEventMappedTypes.cardScanCompleted, {
    once: true,
  });
}

/** setToolbarButton Types */
type SetToolbarButtonParams = {
  type: 'refresh' | 'view' | 'selectAll' | 'clear';
  isEnabled?: boolean;
};

/**
 * Toolbar 버튼 상태 변경
 */
export function setToolbarButton(params: SetToolbarButtonParams): void {
  if (!isApp) {
    return;
  }

  callApp(CallAppTypes.SetToolbarButton, params);
}
