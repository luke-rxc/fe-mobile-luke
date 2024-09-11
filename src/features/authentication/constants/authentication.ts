import { PHONE_PATTERN_REX } from '@features/delivery/utils';

export const AUTHENTICATION_NUMBER_LIMIT_TIME_MS = 10 * 60 * 1000;

export const AUTH_ERROR_CODE = {
  // 문자 재발송 제한 횟수 초과
  SMS_OVER_COUNT: 'E500230',
  // 다른 계정에 해당 핸드폰 번호로 인증이 되어있는 케이스
  OTHER_ACCOUNT: 'E500219',
  // 인증번호 입력 제한 횟수 초과
  AUTH_OVER_COUNT: 'E500214',
  // 동일 번호 인증 요청
  SAME_PHONE: 'E500218',
  // 인증코드 불일치
  AUTH_FAIL: 'E500211',
  // 유효하지 않은 인증 코드
  AUTH_INVALID_CODE: 'E500213',
};

export const CALL_WEB_EVENT_TYPE = {
  isOtherUserDelete: 'isOtherUserDelete',
  ON_SMS_AUTH_CLOSE: 'onSMSAuthClose',
  SET_TITLE: 'SET_TITLE',
};

export const AUTH_FORM_NAME_REQUIRED_MESSAGE = '이름을 정확히 입력해주세요';
export const AUTH_FORM_NAME_PATTERN_MESSAGE = AUTH_FORM_NAME_REQUIRED_MESSAGE;
export const AUTH_FORM_NAME_PATTERN_REGEXP = /^([가-힣a-zA-Z\s]){2,20}$/;

export const AUTH_FORM_PHONE_REQUIRED_MESSAGE = '연락처를 정확히 입력해주세요';
export const AUTH_FORM_PHONE_PATTERN_MESSAGE = AUTH_FORM_PHONE_REQUIRED_MESSAGE;

export const AUTH_FORM_AUTH_NUMBER_REQUIRED_MESSAGE = '인증번호를 입력해주세요';
export const AUTH_FORM_AUTH_NUMBER_PATTERN_MESSAGE = AUTH_FORM_AUTH_NUMBER_REQUIRED_MESSAGE;

export const AUTH_FORM_NAME_RULE = {
  required: {
    value: true,
    message: AUTH_FORM_NAME_REQUIRED_MESSAGE,
  },
  pattern: {
    value: AUTH_FORM_NAME_PATTERN_REGEXP,
    message: AUTH_FORM_NAME_PATTERN_MESSAGE,
  },
  validate: {
    empty: (v: string) => v.trim().length > 0 || AUTH_FORM_NAME_REQUIRED_MESSAGE,
  },
};

export const AUTH_FORM_PHONE_RULE = {
  required: {
    value: true,
    message: AUTH_FORM_PHONE_REQUIRED_MESSAGE,
  },
  pattern: {
    value: PHONE_PATTERN_REX,
    message: AUTH_FORM_PHONE_PATTERN_MESSAGE,
  },
};

export const AUTH_FORM_AUTH_NUMBER_RULE = {
  required: {
    value: true,
    message: AUTH_FORM_AUTH_NUMBER_REQUIRED_MESSAGE,
  },
  pattern: {
    value: /^(\d){6}$/,
    message: AUTH_FORM_AUTH_NUMBER_PATTERN_MESSAGE,
  },
};

export const AUTH_DEFAULT_ERROR_MESSAGE = {
  ORDER: '주문자 인증 오류가 발생하였습니다',
  DRAW: '본인 인증 오류가 발생하였습니다',
};
