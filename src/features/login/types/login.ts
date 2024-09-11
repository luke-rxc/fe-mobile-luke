import { SSOType } from '../schemas';

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

export interface SocialParams {
  ssoId: string;
  email: string;
  ssoType: SSOType;
  profileImageUrl?: string;
  isAdAgree?: boolean;
  ssoAccountInfo?: SSOAccountInfo;
}

export interface SSOAccountInfo {
  ageRange: string | null;
  birthDay: string | null;
  birthYear: string | null;
  gender: string | null;
  name: string | null;
  phone: string | null;
}

export interface SignUser {
  // 로그인/가입 수단 - 이메일, 소셜 (카카오, 애플 ...)
  method: string;
  // 로그인 or 가입
  type: string;
  email: string;
  name?: string;
  ssoId?: string;
  ssoType?: SSOType;
  profileImageUrl?: string;
  isAdAgree?: boolean;
  ssoAccountInfo?: SSOAccountInfo;
}

export interface NaverResponse {
  email: string;
  id: string;
  profile_image: string;
}

export interface ConfirmUserProps {
  email: string;
  ssoId?: string;
  ssoType?: SSOType;
  name?: string;
  profileImageUrl?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    naver: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AppleID: any;
    receiveUser?: (user: { email: string; id: string } | null) => void;
  }
}

export const PAGE_LOAD_TYPE = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
} as const;

export type PageLoadType = typeof PAGE_LOAD_TYPE[keyof typeof PAGE_LOAD_TYPE];
