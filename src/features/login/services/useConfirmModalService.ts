import { useAuth } from '@hooks/useAuth';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useModal } from '@hooks/useModal';
import { useWebInterface } from '@hooks/useWebInterface';
import { emitSignIn } from '@utils/webInterface';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { mixPanel } from '@utils/log';
import { useEmailLogin, usePostTask, useSocialLogin } from '../hooks';
import { UserJoinSchema } from '../schemas';
import { CertificationFormFields, SignUser } from '../types';
import { updateTokenLocalStorage } from '../utils';
import { useLogService } from './useLogService';

export const useConfirmModalService = ({ type, method, ...user }: SignUser, onPrev: () => void) => {
  const formMethod = useForm<CertificationFormFields>({
    defaultValues: {
      verifyCode: '',
      isAll: false,
      isAgeAgree: false,
      isServiceAgree: false,
      isPrivacyAgree: false,
      isAdAgree: false,
    },
    mode: 'onChange',
  });
  const { getValues, setError, setValue } = formMethod;

  const { refetchUserInfo } = useAuth();
  const { closeModal } = useModal();
  const { login: loginByEmail, join: joinByEmail } = useEmailLogin();
  const { join: joinBySocial, updateUserProfileImage } = useSocialLogin();
  const { alert, showToastMessage } = useWebInterface();
  const { execute } = usePostTask();
  const { isIOS } = useDeviceDetect();
  const { logCompleteSignUp, logCompleteSignIn, logViewVerificationCode, logUserProperties } = useLogService();

  const byEmail = useCallback(() => {
    const { verifyCode: code, isAgeAgree: isJoinAgeRequirement, isAdAgree: isAdReceiveAgree } = getValues();
    if (type === 'login') {
      return loginByEmail({ email: user.email, code });
    }

    return joinByEmail({
      email: user.email,
      code,
      isJoinAgeRequirement,
      isAdReceiveAgree,
    });
  }, [type, user, getValues, loginByEmail, joinByEmail]);

  const bySocial = useCallback(() => {
    if (user && user.ssoType && user.ssoId && type === 'join') {
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
  }, [type, user, getValues, joinBySocial]);

  const submit = useCallback(() => {
    if (method === 'email') {
      return byEmail();
    }

    if (method === 'kakao') {
      return bySocial();
    }

    if (method === 'apple') {
      return bySocial();
    }

    const errObj = { data: { message: '지원되지 않는 인증 방식 입니다' } };
    return Promise.reject(errObj);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, bySocial]);

  const handleSubmit = formMethod.handleSubmit(async () => {
    try {
      const result = await submit();
      if (result) {
        updateTokenLocalStorage(result);

        switch (type) {
          case 'join':
            user.profileImageUrl && (await updateUserProfileImage(user.profileImageUrl));
            logUserProperties(result as UserJoinSchema, user.ssoAccountInfo);
            logCompleteSignUp(method);
            break;
          case 'login':
            logCompleteSignIn(method);
            mixPanel.identify(result.userId);
            break;
          default:
        }

        const isAsync = method === 'kakao' && isIOS && !!result.noticeMessage;

        await execute(
          () => {
            result.noticeMessage &&
              showToastMessage(
                { message: result.noticeMessage },
                {
                  autoDismiss: 2000,
                  direction: 'bottom',
                },
              );
          },
          { async: isAsync },
        );

        await refetchUserInfo();
        closeModal('');
        emitSignIn(true);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (method === 'email') {
        if (e?.data?.code === 'E500211') {
          setError('verifyCode', { type: 'manual' });
          return;
        }

        if (e?.data?.code === 'E500212' || e?.data?.code === 'E500214') {
          await alert({ message: e.data.message });
          onPrev();
          return;
        }
      }

      await alert({ message: e?.data?.message ?? '일시적인 오류가 발생했습니다' });
    }
  });

  useEffect(() => {
    if (method === 'kakao' && type === 'join') {
      setValue('isAdAgree', user.isAdAgree ?? false);
      setValue('isAgeAgree', true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (method === 'email') {
      logViewVerificationCode(type);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    formMethod,
    handleSubmit,
  };
};
