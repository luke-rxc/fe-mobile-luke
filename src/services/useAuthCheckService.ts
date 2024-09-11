import { useCallback, useEffect, useState } from 'react';
import { getUser } from '@apis/user';
import { ACCESS_TOKEN } from '@constants/auth';
import { userQueryKey } from '@constants/user';
import { useQuery } from '@hooks/useQuery';
import { toUserModel, UserModel } from '@models/UserModel';
import { UserSchema } from '@schemas/userSchema';
import { ErrorModel } from '@utils/api/createAxios';
import { getLocalStorage } from '@utils/storage';
import { IS_LOGIN_EVENT } from '@schemas/authTokenSchema';
import { userAgent } from '@utils/ua';
import isEmpty from 'lodash/isEmpty';

const { isApp } = userAgent();

export const useAuthCheckService = () => {
  const [userInfo, setUserInfo] = useState<UserModel | null>(null);
  const token = getLocalStorage(ACCESS_TOKEN) ?? '';
  const [isComplete, setIsComplete] = useState<boolean>(token === '');
  const [isLogin, setIsLogin] = useState(token !== '');

  const { refetch, isFetched } = useQuery<UserSchema, ErrorModel>(userQueryKey, getUser, {
    onSuccess: (res) => {
      const user = toUserModel(res);
      setUserInfo(user);
      setIsLogin(true);
    },
    onError: () => {
      setIsLogin(false);
      setUserInfo(null);
    },
    onSettled: () => {
      setIsComplete(true);
    },
    enabled: token !== '',
  });

  const getIsLogin = () => {
    return !isEmpty(getLocalStorage(ACCESS_TOKEN));
  };

  const handleIsLoginEvent = useCallback((e: Event) => {
    const { detail } = e as CustomEvent<{ isLogin: boolean }>;

    setIsLogin(getIsLogin() && detail.isLogin);
  }, []);

  /**
   * 커스텀 이벤트 선언
   */
  isApp &&
    useEffect(() => {
      window.addEventListener(IS_LOGIN_EVENT, handleIsLoginEvent);

      return () => {
        window.removeEventListener(IS_LOGIN_EVENT, handleIsLoginEvent);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  return {
    isLoading: !((token === '' || isFetched) && isComplete),
    isLogin,
    userInfo,
    getIsLogin,
    refetchUserInfo: refetch,
  };
};
