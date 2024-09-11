/**
 * Web App Interface
 * @deprecated 사용하지 않습니다.
 * @link https://www.notion.so/rxc/Webview-App-7120dce78ef44aa1af1f61d368e1fd00
 */

/** **********************************************************
 * Call App Command (Web -> App)
 *********************************************************** */
/**
 * @deprecated 사용하지 않습니다.
 * @link https://www.notion.so/rxc/Webview-App-7120dce78ef44aa1af1f61d368e1fd00
 */
export interface CallAppSignInParams {
  receiveData?: string;
}

/**
 * @deprecated 사용하지 않습니다.
 * @link https://www.notion.so/rxc/Webview-App-7120dce78ef44aa1af1f61d368e1fd00
 */
export interface CallAppOpenPageParams {
  deepLinkUrl: string;
  initialData: string;
}

/**
 * @deprecated 사용하지 않습니다.
 * @link https://www.notion.so/rxc/Webview-App-7120dce78ef44aa1af1f61d368e1fd00
 */
export interface CallAppClosePageParams {
  receiveData?: string;
}

/**
 * @deprecated 사용하지 않습니다.
 * @link https://www.notion.so/rxc/Webview-App-7120dce78ef44aa1af1f61d368e1fd00
 */
export interface CallAppSetTopBarParams {
  title: string;
  titleImage: string;
}

/**
 * @deprecated 사용하지 않습니다.
 * @link https://www.notion.so/rxc/Webview-App-7120dce78ef44aa1af1f61d368e1fd00
 */
export interface CallAppSubscriptionStatusUpdatedParams {
  showroomId: number;
  isSubscribed: boolean;
}

/**
 * @deprecated 사용하지 않습니다.
 * @link https://www.notion.so/rxc/Webview-App-7120dce78ef44aa1af1f61d368e1fd00
 */
export interface CallAppWishItemUpdatedParams {
  goodsId: number;
  isAdded: boolean;
}

/**
 * @deprecated 사용하지 않습니다.
 * @link https://www.notion.so/rxc/Webview-App-7120dce78ef44aa1af1f61d368e1fd00
 */
export interface CallAppShowAlertMessageParams {
  title?: string;
  message?: string;
  type: 'alert' | 'confirm' | 'prompt_num' | 'prompt_text';
  placeholder?: string;
  receiveData?: string;
}
/**
 * @deprecated 사용하지 않습니다.
 * @link https://www.notion.so/rxc/Webview-App-7120dce78ef44aa1af1f61d368e1fd00
 */
export interface CallAppShowSnackbarParams {
  title: string;
  message?: string;
  image?: string;
  deepLinkUrl?: string;
  isHighlighted?: boolean;
  isAutoClose: boolean;
}

/**
 * @deprecated 사용하지 않습니다.
 * @link https://www.notion.so/rxc/Webview-App-7120dce78ef44aa1af1f61d368e1fd00
 */
export interface CallAppShowToastMessageParams {
  message: string;
}

/**
 * @deprecated 사용하지 않습니다. CallAppTypes 에서 선언
 * @link https://www.notion.so/rxc/Webview-App-7120dce78ef44aa1af1f61d368e1fd00
 */
export const CallAppCommand = {
  /**
   * 로그인/회원가입 페이지 열기
   * @returns [CallWeb] 사용자 인증 완료시 signinCompleted 리턴
   */
  SignIn: 'signIn',

  /**
   * 사용자 인증 토큰 업데이트
   * @returns [CallWeb] 업데이트 수행후 reissueCompleted 으로 성공여부 리턴
   */
  ReissueToken: 'reissueToken',

  /**
   * 딥링크 페이지를 열고 페이지 초기화를 위한 데이터를 initializeData 로 전달
   * @returns [CallWeb] initialData
   */
  OpenPage: 'openPage',

  /**
   * 현재 페이지 refresh
   */
  ReloadPage: 'reloadPage',

  /**
   * 현재 페이지 닫기
   * @returns [CallWeb] 이전 페이지에 전달할 데이터가 있을 경우 receiveData 로 전달
   */
  ClosePage: 'closePage',

  /**
   * 상단 네비게이션바 설정
   */
  SetTopBar: 'setTopBar',

  /**
   * 웹페이지 내에서 구독 설정이 변경됨
   */
  SubscriptionStatusUpdated: 'subscriptionStatusUpdated',

  /**
   * 웹페이지 내에서 위시 아이템 담기 or 제거 됨
   */
  WishItemUpdated: 'wishItemUpdated',

  /**
   * Alert, Confirm
   * @description isConfirm이 true일 경우는 "확인", "취소" 버튼이 노출됨. false일 경우에는 "확인" 버튼만 노출
   * @returns [CallWeb] 버튼 선택 결과가 alertMessageClosed 으로 리턴
   */
  ShowAlertMessage: 'showAlertMessage',

  /**
   * Toast
   */
  ShowToastMessage: 'showToastMessage',

  /**
   * Snackbar
   */
  ShowSnackbar: 'showSnackbar',

  /**
   * 상품 상세 옵션
   */
  OpenGoodsOption: 'openGoodsOption',

  /**
   * 플로팅 라이브 플레이어가 있으면 닫기처리
   */
  CloseFloatingLivePlayer: 'closeFloatingLivePlayer',

  /**
   * 플로팅 라이브 플레이어 오디오를 음소거 처리
   */
  MuteFloatingLivePlayer: 'muteFloatingLivePlayer',

  /**
   * 주문 성공시 시그널 전송
   */
  PurchaseCompleted: 'purchaseCompleted',
} as const;

/**
 * @deprecated 사용하지 않습니다.
 * @link https://www.notion.so/rxc/Webview-App-7120dce78ef44aa1af1f61d368e1fd00
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CallAppCommand = keyof typeof CallAppCommand;

/** **********************************************************
 * Call Web Event (App -> Web)
 *********************************************************** */
/**
 * @deprecated 사용하지 않습니다.
 * @link https://www.notion.so/rxc/Webview-App-7120dce78ef44aa1af1f61d368e1fd00
 */
export interface PayloadSigninCompleted {
  isCancelled: boolean;
  receiveData: string;
}

/**
 * @deprecated 사용하지 않습니다.
 * @link https://www.notion.so/rxc/Webview-App-7120dce78ef44aa1af1f61d368e1fd00
 */
export interface PayloadReissueCompleted {
  isSuccess: boolean;
  errorMessage?: string;
}

/**
 * @deprecated 사용하지 않습니다.
 * @link https://www.notion.so/rxc/Webview-App-7120dce78ef44aa1af1f61d368e1fd00
 */
export interface PayloadAlertMessageClosed {
  isOK: boolean;
  /** @todo number type 체크 */
  value: string | number;
  receiveData: string;
}

/**
 * @deprecated 사용하지 않습니다.
 * @link https://www.notion.so/rxc/Webview-App-7120dce78ef44aa1af1f61d368e1fd00
 */
export const CallWebEvent = {
  /**
   * 로그인/회원가입이 완료되었을 경우 호출
   */
  SigninCompleted: 'signinCompleted',

  /**
   * 실패한 경우는 false 와 함께 서버 에러메세지 전달
   */
  ReissueCompleted: 'reissueCompleted',

  /**
   * showAlertMessage 호출시
   * @description
   *  - (Confirm Case) isConfirm이 true인 경우 "확인" 버튼을 선택하면 isOk 값이 true
   *  - (Alert Case) isConfirm이 false인 경우 isOk는 항상 true
   */
  AlertMessageClosed: 'alertMessageClosed',

  /**
   * closePage 액션에서 전달받은 데이터를 Web으로 전달
   */
  ReceiveData: 'receiveData',

  /**
   * openPage 액션에서 전달받은 페이지 초기화용 데이터를 Web으로 전달
   */
  InitialData: 'initialData',
} as const;

/**
 * @deprecated 사용하지 않습니다.
 * @link https://www.notion.so/rxc/Webview-App-7120dce78ef44aa1af1f61d368e1fd00
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CallWebEvent = keyof typeof CallWebEvent;
