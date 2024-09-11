import { createElement, useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useEmailLogin, usePostTask, useRedirectUrl, useSignUser, useSocialLogin } from '@features/login/hooks';
import { updateTokenLocalStorage } from '@features/login/utils';
import { useWebInterface } from '@hooks/useWebInterface';
import { useModal } from '@hooks/useModal';
import { DrawerAgreements } from '@features/login/components/DrawerAgreements';
import { CALL_WEB_EVENT } from '@features/login/constants';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useLogService } from '@features/login/services';
import { UserJoinSchema } from '@features/login/schemas';
import { mixPanel } from '@utils/log';
import { getLoginRedirectUrl } from '@utils/redirectToLogin';
import { CertificationFormFields } from '../types';

export const useMemberConfirmService = () => {
  const { redirectUrl } = useRedirectUrl();
  const history = useHistory();
  const { user } = useSignUser();
  const method = useForm<CertificationFormFields>({
    defaultValues: {
      verifyCode: '',
      isAll: false,
      isAgeAgree: false,
      isServiceAgree: false,
      isPrivacyAgree: false,
      isAdAgree: false,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const { getValues, handleSubmit, setError, setValue } = method;
  const modalIdRef = useRef<string>('');
  const { login: loginByEmail, verify } = useEmailLogin();
  const { join: joinBySocial, updateUserProfileImage } = useSocialLogin();
  const { alert, showToastMessage } = useWebInterface();
  const { openModal, closeModal } = useModal();
  const { execute } = usePostTask();
  const { isIOS } = useDeviceDetect();
  const { logViewVerificationCode, logCompleteSignUp, logCompleteSignIn, logUserProperties } = useLogService();

  const byEmail = useCallback(() => {
    if (user) {
      const { verifyCode: code } = getValues();
      return loginByEmail({ email: user.email, code });
    }

    return Promise.resolve(null);
  }, [user, getValues, loginByEmail]);

  const bySocial = useCallback(() => {
    if (user && user.ssoType && user.ssoId && user?.type === 'join') {
      const { isAgeAgree: isJoinAgeRequirement, isAdAgree: isAdReceiveAgree } = getValues();
      return joinBySocial({
        ssoType: user.ssoType,
        ssoId: user.ssoId,
        email: user.email,
        isJoinAgeRequirement,
        isAdReceiveAgree,
        ...(user.ssoAccountInfo && { ssoAccountInfo: user.ssoAccountInfo }),
      });
    }

    return Promise.resolve(null);
  }, [user, getValues, joinBySocial]);

  const openAgreements = async (email: string, code: string) => {
    modalIdRef.current = await openModal(
      {
        nonModalWrapper: true,
        render: (props) => createElement(DrawerAgreements, { ...props }),
      },
      {
        type: CALL_WEB_EVENT.ON_INIT_AGREEMENT,
        data: { email, code },
      },
    );
  };

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

  const submit = useCallback(() => {
    if (user?.method === 'email') {
      return byEmail();
    }

    if (user?.method === 'kakao') {
      return bySocial();
    }

    if (user?.method === 'apple') {
      return bySocial();
    }

    const errObj = { data: { message: '지원되지 않는 인증 방식 입니다' } };
    return Promise.reject(errObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, byEmail, bySocial]);

  const onSubmit = handleSubmit(async () => {
    try {
      if (user?.method === 'email' && user?.type === 'join') {
        const { verifyCode: code } = getValues();
        await verify({ email: user.email, code });
        await openAgreements(user.email, code);
        return;
      }

      const result = await submit();
      if (result) {
        updateTokenLocalStorage(result);

        switch (user?.type) {
          case 'join':
            user.profileImageUrl && (await updateUserProfileImage(user.profileImageUrl));
            logUserProperties(result as UserJoinSchema, user.ssoAccountInfo);
            logCompleteSignUp(user?.method);
            break;
          case 'login':
            logCompleteSignIn(user?.method);
            mixPanel.identify(result.userId);
            break;
          default:
        }

        const isAsync = user?.method === 'kakao' && isIOS;

        if (result.noticeMessage) {
          execute(
            () => {
              result.noticeMessage && showNoticeMessageAndRedirect(result.noticeMessage);
            },
            { async: isAsync },
          );
          return;
        }

        window.location.href = redirectUrl ?? '/';
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (user?.method === 'email') {
        if (e?.data?.code === 'E500211') {
          setError('verifyCode', { type: 'manual' });
          return;
        }

        if (e?.data?.code === 'E500212' || e?.data?.code === 'E500214') {
          await alert({ message: e.data.message });
          const url = getLoginRedirectUrl(redirectUrl);
          history.replace(url);
          return;
        }
      }

      await alert({ message: e?.data?.message ?? '일시적인 오류가 발생했습니다' });
    }
  });

  useEffect(() => {
    if (!window.history.state) {
      history.replace('/member/login');
      return;
    }

    if (user && user.method === 'kakao' && user.type === 'join') {
      setValue('isAdAgree', user.isAdAgree ?? false);
      setValue('isAgeAgree', true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    return () => {
      if (modalIdRef.current) {
        closeModal(modalIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?.method === 'email') {
      logViewVerificationCode(user.type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return {
    user,
    method,
    onSubmit,
  };
};
