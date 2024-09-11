import { useState, useRef, useEffect, useCallback } from 'react';
import copy from 'copy-to-clipboard';
import { WebLinkTypes } from '@constants/link';
import { useErrorService } from '@features/exception/services';
import { useAppleLogin, useKakaoLogin } from '@features/login/hooks';
import { useMutation } from '@hooks/useMutation';
import { useQuery } from '@hooks/useQuery';
import { useWebInterface } from '@hooks/useWebInterface';
import { ErrorModel } from '@utils/api/createAxios';
import { getWebLink } from '@utils/link';
import { useHistory } from 'react-router-dom';
import { SSOType } from '@features/login/schemas';
import { deleteSocialAccount, getSocialList, putSocialAccount } from '../apis';

export const useAccountService = () => {
  const history = useHistory();
  const { login: kakaoLogin } = useKakaoLogin();
  // appleLogin redirectURL로 /mypage/account 등록되어있지 않음
  const { login: appleLogin } = useAppleLogin('/member/login');
  const { handleError } = useErrorService();
  const { confirm, showToastMessage } = useWebInterface();
  const [isCheckedKakao, setIsCheckedKakao] = useState<boolean>(false);
  const [isCheckedApple, setIsCheckedApple] = useState<boolean>(false);
  const isConnecting = useRef<boolean>(false);

  const { isLoading } = useQuery(['SSO-connect-list'], getSocialList, {
    onSuccess: (res) => {
      res.forEach((value) => {
        if (value.ssoType === 'KAKAO') {
          setIsCheckedKakao(true);
        } else if (value.ssoType === 'APPLE') {
          setIsCheckedApple(true);
        }
      });
    },
    onError: (error: ErrorModel) => {
      handleError({
        error,
      });
    },
    cacheTime: 0,
  });

  const { mutate: socialConnectMutate } = useMutation(putSocialAccount, {
    onSuccess: (res, props) => {
      if (props.ssoType === 'KAKAO') {
        setIsCheckedKakao(true);
      } else if (props.ssoType === 'APPLE') {
        setIsCheckedApple(true);
      }
    },
    onError: (error: ErrorModel) => {
      handleError({
        error,
      });
    },
  });

  const { mutate: socialUnconnectMutate } = useMutation(deleteSocialAccount, {
    onSuccess: (res, { ssoType }) => {
      if (ssoType === 'KAKAO') {
        setIsCheckedKakao(false);
      } else if (ssoType === 'APPLE') {
        setIsCheckedApple(false);
      }
    },
    onError: (error: ErrorModel) => {
      handleError({
        error,
      });
    },
  });

  const handleClickEmail = (email: string) => {
    copy(email);
    showToastMessage({ message: '이메일 주소를 복사했습니다' });
  };

  const resetIsConnecting = useCallback(() => {
    isConnecting.current = false;
  }, []);

  // 카카오는 try catch에 잡히지 않음
  useEffect(() => {
    window.addEventListener('focus', resetIsConnecting);

    return () => {
      window.removeEventListener('focus', resetIsConnecting);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnectSocial = async (type: string) => {
    isConnecting.current = true;
    try {
      const { ssoType, ssoId, ssoAccountInfo } = await (type === 'KAKAO' ? kakaoLogin() : appleLogin());
      socialConnectMutate({ ssoType, ssoId, ssoAccountInfo });
    } catch {
      isConnecting.current = false;
    }
    isConnecting.current = false;
  };

  const handleUnconnectSocial = async (ssoType: string) => {
    const result = await confirm({
      title: '계정 연동을 해제할까요?',
      message: '해제 후 다시 연동할 수 있습니다',
    });
    if (result) {
      socialUnconnectMutate({ ssoType: ssoType as SSOType });
    }
  };

  const handleWithdraw = () => {
    history.push(getWebLink(WebLinkTypes.MYPAGE_WITHDRAW));
  };

  return {
    isConnecting,
    isLoading,
    isCheckedKakao,
    isCheckedApple,
    handleClickEmail,
    handleConnectSocial,
    handleUnconnectSocial,
    handleWithdraw,
  };
};
