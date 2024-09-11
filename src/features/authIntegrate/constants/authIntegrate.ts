/** 메세지 */
export const AdultMessage = {
  PROGRESS_AUTH: '연령인증이 진행중입니다',
  REQUIRED_AUTH: '연령인증이 필요한 상품입니다',
  CANCEL_AUTH: '연령인증을 완료하지 못했습니다',

  // DeepLink 활성화시에 initialValue가 제대로 들어오지 않은 경우
  ERROR_AUTH_INFO: '인증정보가 올바르지 않습니다',
  // Complete 단계에서의 오류 기본 메시지
  ERROR_AUTH_FAIL: '인증정보 확인중 오류가 발생하였습니다',
};

/** Auth 진행 상태 */
export const AuthStatusType = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  LOADING: 'LOADING',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AuthStatusType = ValueOf<typeof AuthStatusType>;

/** 오류코드 */
export const AuthErrorCode = {
  /** Server Code : 만19세 미만인 경우 */
  UNDER_AGE: 'E500246',
  /** Front Code : 취소한 경우 */
  CANCEL_AUTH: 'CANCEL_AUTH',
};

/** Auth close webApp Interface 'receiveValues' Type */
export const AuthCloseWebAppType = {
  AUTH_ADULT: 'AUTH_ADULT',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AuthCloseWebAppType = ValueOf<typeof AuthCloseWebAppType>;
