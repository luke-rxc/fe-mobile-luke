export interface LoginFormValues {
  email: string;
  code?: string;
}

export type LoginFormNames = keyof LoginFormValues;

/**
 * 프로필 picture schema
 */
export interface ProfilePictureSchema {
  originalHeight: number;
  originalWidth: number;
  path: string;
}

/**
 * 로그인 메일인증 schema
 */
export interface LoginMailAuthSchema {
  email: string;
  nickname: string;
  profileImage?: ProfilePictureSchema;
  type: string;
}

export interface UserLoginSchema {
  email: string;
  loginType: string;
  refreshToken: string;
  token: string;
  userId: number;
  hasPrizmPay: boolean;
  hasShippingAddress: boolean;
  isAdult: boolean;
  isIdentify: boolean;
  nickname: string;
  isPrizmPayReRegistrationRequired?: boolean;
  noticeMessage?: string;
}

export const LoginErrorCode = {
  RETIRE_30: 'E501001',
} as const;
export type LoginErrorType = keyof typeof LoginErrorCode;

export const JoinErrorCode = {
  NO_USER: 'E500215',
} as const;

export const SSO = {
  NAVER: 'NAVER',
  KAKAO: 'KAKAO',
  APPLE: 'APPLE',
} as const;

export type SSOType = keyof typeof SSO;
