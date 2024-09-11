/**
 * 인증 TOKEN schema
 */
export interface AuthTokenSchema {
  email: string;
  loginType: string;
  refreshToken: string;
  token: string;
  userId: number;
}

/**
 * TOKEN 인증에러 코드
 */
export enum AuthTokenErrorCode {
  NO_AUTH = 'E401001', // 미인증
  INVALID_TOKEN = 'E401002', // 토큰이 유효하지 않음
  TOKEN_EXPIRED = 'E401003', // 토큰 만료
  INVALID_REFRESH_TOKEN = 'E401004', // 갱신 토큰이 유효하지 않음
  REFRESH_TOKEN_EXPIRED = 'E401005', // 갱신 토큰 만료
}

export const IS_LOGIN_EVENT = 'isLoginEvent';
