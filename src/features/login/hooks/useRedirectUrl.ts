import { useQueryString } from '@hooks/useQueryString';

type QueryParams = {
  redirect_url?: string;
  /**
   * 카카오 로그인 예외처리
   * redirect url 뒤에 query string을 유지할 수 없어
   * state key에 매핑해서 redirect 해줌
   */
  state?: string;
};

export const useRedirectUrl = () => {
  const { redirect_url: url, state } = useQueryString<QueryParams>();

  const getRedirectUrl = () => {
    const encoded = (state || url) ?? '';
    return decodeURIComponent(encoded);
  };

  return { redirectUrl: getRedirectUrl() };
};
