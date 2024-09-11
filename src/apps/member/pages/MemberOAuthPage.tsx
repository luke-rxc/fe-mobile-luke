import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

/**
 * 소셜 서비스 리다이렉트 페이지
 *
 * 카카오, 애플 호출시 redirect url 명시하라고 되어있으나,
 * 해당 페이지로 이동하는 케이스는 없음 (새창 방식이므로)
 * 현재 연동되는 소셜 서비스 중에는 해당 페이지로 리다이렉트 되지 않음
 * 혹시나 해당 페이지로 들어올 경우 로그인 페이지로 redirect 처리
 */
const MemberOAuthPage = () => {
  const history = useHistory();

  useEffect(() => {
    history.replace('/');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default MemberOAuthPage;
