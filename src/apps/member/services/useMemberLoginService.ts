import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import qs from 'qs';
import {
  useAppleLogin,
  useEmailLogin,
  useKakaoLogin,
  usePostTask,
  useRedirectUrl,
  useSocialLogin,
} from '@features/login/hooks';
import { JoinErrorCode } from '@features/login/schemas';
import {
  isKakaoLoginExceptionBrowser,
  isValidEmail,
  toConfirmParams,
  updateTokenLocalStorage,
} from '@features/login/utils';
import { useQuery } from '@hooks/useQuery';
import { useAuth } from '@hooks/useAuth';
import { SocialParams } from '@features/login/types';
import { getImageLink } from '@utils/link';
import { useQueryClient } from 'react-query';
import { toLoginBannerModel } from '@features/login/models';
import { getDisplayContentList } from '@features/login/apis';
import { useWebInterface } from '@hooks/useWebInterface';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useLogService } from '@features/login/services';
import { mixPanel } from '@utils/log';
import { LoginFormFields, PageLoadType, PAGE_LOAD_TYPE } from '../types';

export const useMemberLoginService = () => {
  const [pageLoad, setPageLoad] = useState<PageLoadType>(PAGE_LOAD_TYPE.LOADING);
  const { isLogin } = useAuth();
  const { redirectUrl } = useRedirectUrl();
  const history = useHistory();
  const method = useForm<LoginFormFields>({
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });
  const { getValues, handleSubmit, setError } = method;
  const { sendAuthMail } = useEmailLogin();
  const { login: loginBySocial } = useSocialLogin();
  const { login: loginByApple } = useAppleLogin('/member/login');
  const { login: loginByKakao, socialParams: kakaoSocialParams, authorize } = useKakaoLogin();
  const queryClient = useQueryClient();
  const { showToastMessage, alert } = useWebInterface();
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
      redirectToConfirm({
        ...rest,
        method: 'email',
        profileImageUrl: profileImage?.path && getImageLink(profileImage?.path),
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      alert(toConfirmParams(e.data?.message ?? '일시적인 오류가 발생하였습니다'));
    }
  });

  const showNoticeMessageAndRedirect = (message: string, options: { latency?: number } = {}) => {
    const { latency = 2000 } = options;

    showToastMessage(
      { message },
      {
        autoDismiss: latency,
        direction: 'bottom',
      },
    );
    setTimeout(() => {
      window.location.href = redirectUrl ?? '/';
    }, latency);
  };

  const verify = async (param: SocialParams) => {
    try {
      const data = await loginBySocial(param);
      updateTokenLocalStorage(data);
      logCompleteSignIn(param.ssoType.toLocaleLowerCase());
      mixPanel.identify(data.userId);
      const isAsync = param.ssoType === 'KAKAO' && isIOS;

      if (data.noticeMessage) {
        execute(
          () => {
            data.noticeMessage && showNoticeMessageAndRedirect(data.noticeMessage);
          },
          { async: isAsync },
        );
        return;
      }

      window.location.href = redirectUrl ?? '/';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      // 등록되지 않은 사용자
      if (e.data?.code === JoinErrorCode.NO_USER) {
        redirectToConfirm({ ...param, type: 'join', method: param.ssoType.toLowerCase() });
        return;
      }
      alert(toConfirmParams(e.data?.message ?? '일시적인 오류가 발생하였습니다'));
    }
  };

  const handleKakao = async () => {
    if (!window.Kakao) {
      showToastMessage({
        message: `오류가 발생되어
      페이지를 새로고침 해야 합니다`,
      });
      return;
    }

    if (isKakaoLoginExceptionBrowser(etcInAppBrowser)) {
      authorize();
      return;
    }

    const result = await loginByKakao();
    result && verify(result);
  };

  const handleApple = async () => {
    const result = await loginByApple();
    result && verify(result);
  };

  const handleSocial = useCallback((sns: string) => {
    if (sns === 'kakao') {
      handleKakao();
    }

    if (sns === 'apple') {
      handleApple();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const redirectToConfirm = (state?: unknown) => {
    const url = [`/member/confirm`, qs.stringify({ redirect_url: redirectUrl })].join('?');
    history.push(url, state);
  };

  useEffect(() => {
    if (isFetched) {
      logViewSignIn();
      setPageLoad(PAGE_LOAD_TYPE.SUCCESS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched]);

  useEffect(() => {
    if (kakaoSocialParams) {
      verify(kakaoSocialParams);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kakaoSocialParams]);

  return {
    onSubmit,
    handleSocial,
    method,
    banners: banners ?? [],
    pageLoad,
  };
};
