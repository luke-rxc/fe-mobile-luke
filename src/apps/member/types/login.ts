export interface LoginFormFields {
  email: string;
}

export interface CertificationFormFields {
  verifyCode: string;
  isAll: boolean;
  isAgeAgree: boolean;
  isServiceAgree: boolean;
  isPrivacyAgree: boolean;
  isAdAgree: boolean;
}

export const LOGIN_TYPES = {
  NAVER: 'naver',
  KAKAO: 'kakao',
  APPLE: 'apple',
} as const;

export type LoginType = typeof LOGIN_TYPES[keyof typeof LOGIN_TYPES];

export const PAGE_LOAD_TYPE = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
} as const;

export type PageLoadType = typeof PAGE_LOAD_TYPE[keyof typeof PAGE_LOAD_TYPE];
