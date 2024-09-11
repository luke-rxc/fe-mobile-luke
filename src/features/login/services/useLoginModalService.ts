import { useAuth } from '@hooks/useAuth';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useModal } from '@hooks/useModal';
import { useQuery } from '@hooks/useQuery';
import { useWebInterface } from '@hooks/useWebInterface';
import { getImageLink } from '@utils/link';
import { emitSignIn } from '@utils/webInterface';
import omit from 'lodash/omit';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { mixPanel } from '@utils/log';
import { getDisplayContentList, SocialLoginParam } from '../apis';
import { useEmailLogin, useKakaoLogin, usePostTask, useSocialLogin } from '../hooks';
import { useAppleLogin } from '../hooks/useAppleLogin';
import { toLoginBannerModel } from '../models';
import { JoinErrorCode } from '../schemas';
import { LoginFormFields, PageLoadType, PAGE_LOAD_TYPE, SignUser } from '../types';
import { isKakaoLoginExceptionBrowser, isValidEmail, toConfirmParams, updateTokenLocalStorage } from '../utils';
import { useLogService } from './useLogService';

export interface UseLoginModalServiceProps {
  onNext: (user: SignUser) => void;
}

export const useLoginModalService = ({ onNext }: UseLoginModalServiceProps) => {
  const [pageLoad, setPageLoad] = useState<PageLoadType>(PAGE_LOAD_TYPE.LOADING);
  const { login: loginBySocial } = useSocialLogin();
  const { login: loginByApple } = useAppleLogin('/member/oauth/popup');
  const { login: loginByKakao, authorize } = useKakaoLogin();
  const [socialUserInfo, setSocialUserInfo] = useState<SocialLoginParam | null>(null);
  const { refetchUserInfo, isLogin } = useAuth();
  const { closeModal } = useModal();
  const method = useForm<LoginFormFields>({
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });
  const { getValues, handleSubmit, setError } = method;
  const { sendAuthMail } = useEmailLogin();
  const queryClient = useQueryClient();
  const { alert, showToastMessage } = useWebInterface();
  const { execute } = usePostTask();
  const { isIOS, etcInAppBrowser } = useDeviceDetect();
  const { logViewSignIn, logCompleteSignIn } = useLogService();

  const { data: banners, isFetched } = useQuery(['login', 'display-contents'], () => getDisplayContentList(), {
    select: (res) => res.map(toLoginBannerModel),
    enabled: !isLogin,
    onError: () => {
      queryClient.setQueryData(['login', 'display-contents'], []);
    },
  });

  const onSubmit = handleSubmit(async () => {
    const { email } = getValues();

    if (!isValidEmail(email)) {
      setError('email', { type: 'manual' });
      alert({ message: '이메일 형식이 맞지 않습니다' });
      return;
    }

    try {
      const { profileImage, ...rest } = await sendAuthMail(email);
      onNext({
        ...omit(rest, 'nickname'),
        name: rest.nickname,
        type: rest.type,
        method: 'email',
        profileImageUrl: profileImage?.path && getImageLink(profileImage?.path),
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      alert(toConfirmParams(e.data?.message ?? '일시적인 오류가 발생하였습니다'));
    }
  });

  const verify = async (param: SocialLoginParam) => {
    try {
      const data = await loginBySocial(param);
      updateTokenLocalStorage(data);
      logCompleteSignIn(param.ssoType.toLocaleLowerCase());
      mixPanel.identify(data.userId);

      const isAsync = param.ssoType === 'KAKAO' && isIOS && !!data.noticeMessage;

      await execute(
        () => {
          data.noticeMessage &&
            showToastMessage(
              { message: data.noticeMessage },
              {
                autoDismiss: 2000,
                direction: 'bottom',
              },
            );
        },
        { async: isAsync },
      );

      refetchUserInfo();
      closeModal('');
      emitSignIn(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      // 등록되지 않은 사용자
      if (e.data?.code === JoinErrorCode.NO_USER) {
        onNext({ ...param, type: 'join', method: param.ssoType.toLowerCase() });
        return;
      }
      alert(toConfirmParams(e.data?.message ?? '일시적인 오류가 발생하였습니다'));
    }
  };

  const getSocialUserInfo = async (type: string) => {
    if (type === 'apple') {
      return loginByApple();
    }

    if (type === 'kakao') {
      if (isKakaoLoginExceptionBrowser(etcInAppBrowser)) {
        authorize();
        return Promise.resolve();
      }

      return loginByKakao();
    }

    return Promise.reject(new Error('지원되지 않는 소셜 로그인'));
  };

  const handleLogin = useCallback(async (type: string) => {
    if (type === 'kakao') {
      if (!window.Kakao) {
        showToastMessage({
          message: `오류가 발생되어
      페이지를 새로고침 해야 합니다`,
        });
        return;
      }
    }

    const user = await getSocialUserInfo(type);
    if (user) {
      setSocialUserInfo(user);
      verify(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFetched) {
      logViewSignIn();
      setPageLoad(PAGE_LOAD_TYPE.SUCCESS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched]);

  return {
    handleLogin,
    onSubmit,
    user: socialUserInfo,
    method,
    banners: banners ?? [],
    pageLoad,
  };
};
