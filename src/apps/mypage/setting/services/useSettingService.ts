import { useLogout } from '@features/login/hooks';
import { useWebInterface } from '@hooks/useWebInterface';
import { redirectToLogin } from '@utils/redirectToLogin';

export const useSettingService = () => {
  const { logout } = useLogout();
  const { reload, confirm } = useWebInterface();

  const handleLogin = () => {
    redirectToLogin();
  };

  const handleLogout = async () => {
    const result = await confirm({ title: '로그아웃할까요?' });
    if (result) {
      logout().then(() => {
        reload();
      });
    }
  };

  return { handleLogin, handleLogout };
};
