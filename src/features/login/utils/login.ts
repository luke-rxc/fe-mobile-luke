import { EMAIL_REG_EXP, KAKAO_LOGIN_EXCEPTION_BROWSERS } from '../constants';

/**
 * 카카오 로그인 예외처리 대상 브라우저 여부
 */
export const isKakaoLoginExceptionBrowser = (browser: string) => {
  return KAKAO_LOGIN_EXCEPTION_BROWSERS.includes(browser);
};

/**
 * 이메일 규격 체크
 */
export const isValidEmail = (email: string) => {
  return EMAIL_REG_EXP.test(email);
};
/**
 * 메세지 내 개행 구문을 기준으로 title, message 영역 구분하여 파라미터 반환
 * message영역의 값이 없는 경우 value값 자체를 파라미터로 사용한다.
 */
export const toConfirmParams = (value: string) => {
  const [title, message] = value.split('\n');
  return !message ? { message: title } : { title, message };
};
