import { createContext, useEffect, useState } from 'react';
import { UserModel } from '@models/UserModel';
import { useAuthCheckService } from '@services/useAuthCheckService';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useABTestService } from '@services/useABTestService';
import { datadogRum, mixPanel } from '@utils/log';
import { syncDistinctId } from '@utils/log/mixPanel';
import { QueryObserverResult, RefetchOptions } from 'react-query/types/core/types';
import { UserSchema } from '@schemas/userSchema';
import { ErrorDataModel, ErrorModel } from '@utils/api/createAxios';
import { useSeatUnlock } from '@features/seat/hooks';

interface Props {
  children: JSX.Element[] | JSX.Element;
}

interface AuthContextProps {
  isLogin: boolean;
  isLoading: boolean;
  isReady: boolean;
  userInfo: UserModel | null;
  getIsLogin: () => boolean;
  refetchUserInfo: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<UserSchema, ErrorModel<ErrorDataModel>>> | null;
}

const initial = {
  isLogin: false,
  isLoading: false,
  isReady: false,
  userInfo: null,
  getIsLogin: () => false,
  refetchUserInfo: () => null,
};
export const AuthContext = createContext<AuthContextProps>(initial);
export const AuthProvider = ({ children }: Props) => {
  const { isLoading, isLogin, userInfo, getIsLogin, refetchUserInfo } = useAuthCheckService();
  const { isApp } = useDeviceDetect();
  const { setABTest } = useABTestService();
  const [isReady, setIsReady] = useState(!isLoading);
  const userId = userInfo?.userId ?? null;

  /** 주문 좌석 점유 해제 */
  useSeatUnlock(isLogin);

  const config = async () => {
    if (!isApp) {
      if (userId) {
        mixPanel.identify(userId);
      } else {
        syncDistinctId();
      }
      await setABTest();
    }
    setIsReady(true);
  };

  useEffect(() => {
    if (!isLoading) {
      config();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, userId]);

  useEffect(() => {
    if (userInfo?.userId) {
      // Datadog User Session 정보 설정
      datadogRum.setUser({
        id: `${userInfo.userId}`,
        name: userInfo.nickname,
        email: userInfo.email,
      });
    } else {
      // Datadog User Session 정보 제거
      datadogRum.clearUser();
    }
  }, [userInfo]);

  return (
    <AuthContext.Provider value={{ isLogin, isLoading, isReady, userInfo, getIsLogin, refetchUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
