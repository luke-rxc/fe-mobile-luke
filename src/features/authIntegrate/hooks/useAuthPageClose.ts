import { useCallback } from 'react';
import { useWebInterface } from '@hooks/useWebInterface';
import { AuthCloseWebAppType } from '../constants';
import { AuthAdultReceiveProps, AuthAdultReceiveDataProps } from '../types';

export const useAuthPageClose = () => {
  const { close } = useWebInterface();
  const closePage = useCallback((params: AuthAdultReceiveDataProps) => {
    const closeParams = {
      type: AuthCloseWebAppType.AUTH_ADULT,
      data: params,
    } as AuthAdultReceiveProps;

    close({
      ...closeParams,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    closePage,
  };
};
