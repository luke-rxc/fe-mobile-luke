import { env } from '@env';
import { useScript } from '@hooks/useScript';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { NAVER_BUTTON_ELEMENT_ID } from '../constants';

interface Props {
  redirectUrl?: string;
  options?: { callbackUrl: string };
}

export const useNaverLogin = ({ redirectUrl, options }: Props) => {
  const { status } = useScript('https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js');
  const history = useHistory();
  const { access_token: accessToken } = history.location.hash
    .slice(1)
    .split('&')
    .reduce<{ access_token?: string }>((acc, item) => {
      const [key, value] = item.split('=');
      return { ...acc, [key]: value };
    }, {});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [naverUser, setNaverUser] = useState<any>(null);

  const login = () => {
    const el = document.getElementById(NAVER_BUTTON_ELEMENT_ID);

    if (el) {
      const child = el.firstChild as HTMLAnchorElement;
      if (child) {
        child.click();
        window.history.replaceState({}, '', window.location.href.slice(0, -1));
      }
    }
  };

  useEffect(() => {
    if (status === 'ready') {
      const { naver } = window;

      if (!accessToken && !document.getElementById('naverIdLogin')) {
        alert('잘못된 접근입니다. 메인화면으로 이동합니다.');
        history.replace('/');
        return;
      }

      const naverIdLogin = new naver.LoginWithNaverId({
        clientId: env.authKey.naver,
        isPopup: false,
        ...(!accessToken && { loginButton: { color: 'green', type: 1, height: 50 } }),
        ...options,
      });

      naverIdLogin.init();

      if (accessToken) {
        naverIdLogin.getLoginStatus((isLogin: boolean) => {
          if (isLogin) {
            const { user } = naverIdLogin;

            if (!user.email) {
              naverIdLogin.reprompt();
              return;
            }

            if (!user.profile_image) {
              naverIdLogin.reprompt();
              return;
            }

            setNaverUser(user);
          }
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, accessToken, history, redirectUrl]);

  return {
    login,
    naverUser,
  };
};
