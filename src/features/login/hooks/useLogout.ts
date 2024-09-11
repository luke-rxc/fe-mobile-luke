import { useAuth } from '@hooks/useAuth';
import { useMutation } from '@hooks/useMutation';
import { LOGIN_TYPE } from '@schemas/userSchema';
import { createDebug } from '@utils/debug';
import { mixPanel } from '@utils/log';
import { logout as logoutApi } from '../apis';
import { updateTokenLocalStorage } from '../utils';
import { useKakaoLogin } from './useKakaoLogin';

const debug = createDebug('features:login:hooks:useLogout');

export const useLogout = () => {
  const { mutateAsync: executeLogout } = useMutation(logoutApi);
  const { logout: logoutKakao, status } = useKakaoLogin();
  // const {logout, unlink} = useAppleLogin();
  const { userInfo } = useAuth();

  /**
   * 로그아웃 처리
   *  - 소셜 로그아웃 성공여부 무시
   *  - API 호출 성공여부 무시
   *  - 로컬 스토리지 clear
   */
  const logout = async (): Promise<boolean> => {
    try {
      if (userInfo?.loginType === LOGIN_TYPE.KAKAO) {
        await logoutKakao();
      }

      await executeLogout();
      return true;
    } catch (e) {
      debug.error(e);
      return true;
    } finally {
      updateTokenLocalStorage();
      mixPanel.reset();
    }
  };

  return {
    logout,
    status,
  };
};
