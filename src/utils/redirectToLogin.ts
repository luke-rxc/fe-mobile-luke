import qs from 'qs';

/**
 * 로그인 페이지(/member/login) 으로 location 이동
 */
export const redirectToLogin = (redirectUrl?: string) => {
  const url = getLoginRedirectUrl(redirectUrl);
  window.location.href = url;
};

/**
 * 로그인 페이지(/member/login) redirect url 조회
 */
export const getLoginRedirectUrl = (redirectUrl?: string) => {
  const base = '/member/login';
  const queryParams = !redirectUrl
    ? { redirect_url: `${window.location.pathname}${window.location.search}` }
    : { redirect_url: redirectUrl };
  const queryString = qs.stringify(queryParams);
  const url = [base, queryString].filter((i) => !!i).join('?');

  return url;
};
