import { useAuth } from '@hooks/useAuth';
import { IS_LOGIN_EVENT } from '@schemas/authTokenSchema';
import { getLoginRedirectUrl } from '@utils/redirectToLogin';
import { signIn, close } from '@utils/webInterface';
import { ComponentType, useEffect, useState } from 'react';

interface Props {
  children: JSX.Element[] | JSX.Element;
}

interface WithAuthOptions {
  enabled?: boolean;
}

const withAuth = (WrappedComponent: ComponentType, options: WithAuthOptions = {}) => {
  const { enabled = true } = options;
  const Authentication = (props: Props) => {
    const { isLogin } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [isCompleted, setIsCompleted] = useState(enabled ? isLogin : true);

    async function init() {
      const signInResult = await signIn({
        doWeb: () => {
          const url = getLoginRedirectUrl();
          window.location.replace(url);
        },
      });
      dispatch(signInResult);

      if (signInResult) {
        mounted && setIsCompleted(true);
      } else {
        close();
      }
    }

    useEffect(() => {
      if (mounted && !isCompleted) {
        init();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCompleted, mounted]);

    useEffect(() => {
      setMounted(true);

      return () => {
        setMounted(false);
      };
    }, []);

    if (!isCompleted) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return Authentication;
};

function dispatch(isLogin: boolean) {
  window.dispatchEvent(new CustomEvent(IS_LOGIN_EVENT, { detail: { isLogin } }));
}

export default withAuth;
