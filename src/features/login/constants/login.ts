import { env } from '@env';

export const REDIRECT_SERVICE_URL = '/member/confirm';
export const MODAL_CALLBACK_URL = `${env.endPoint.baseUrl}/member/oauth/popup`;
export const PAGE_CALLBACK_URL = `${env.endPoint.baseUrl}/member/login`;
export const NAVER_BUTTON_ELEMENT_ID = 'naverIdLogin';
export const KAKAO_CALLBACK_URL = PAGE_CALLBACK_URL;

export const CALL_WEB_EVENT = {
  ON_INIT_AGREEMENT: 'onInitAgreement',
};

export const KAKAO_LOGIN_EXCEPTION_BROWSERS = ['instagram'];

export const EMAIL_REG_EXP = /^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,64}/;
