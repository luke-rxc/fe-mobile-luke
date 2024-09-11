import { useLogout } from '@features/login/hooks';
import { useAuth } from '@hooks/useAuth';
import { useWebInterface } from '@hooks/useWebInterface';
import { useEffect } from 'react';

/**
 * 로그아웃 위치 선정되면 삭제할 예정입니다.
 */
const MemberLogoutPage = () => {
  const { logout } = useLogout();
  const { getIsLogin } = useAuth();
  const { alert } = useWebInterface();

  useEffect(() => {
    const complete = async () => {
      await alert({ message: '로그아웃 되었습니다' });
      window.location.href = '/';
    };

    if (!getIsLogin()) {
      complete();
    } else {
      logout().then(() => {
        complete();
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default MemberLogoutPage;
