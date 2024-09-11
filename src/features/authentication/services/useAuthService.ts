import { useCallback, useState } from 'react';
import { useMutation } from '@hooks/useMutation';
import { useWebInterface } from '@hooks/useWebInterface';
import { AuthenticationFormFields } from '../types';
import { authentication, sendAuthenticationNumber } from '../apis';
import { AUTH_ERROR_CODE, AUTH_DEFAULT_ERROR_MESSAGE } from '../constants';

export const useAuthService = () => {
  // 문자 발송 유무
  const [isSend, setIsSend] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { confirm, showToastMessage } = useWebInterface();

  const { mutateAsync: sendSMS } = useMutation(sendAuthenticationNumber, {
    onSettled: (_, err) => {
      setDisabled(err?.data?.code === AUTH_ERROR_CODE.SMS_OVER_COUNT);
    },
  });

  const { mutateAsync: auth } = useMutation(authentication);

  async function handleSendSMS(
    formValues: AuthenticationFormFields,
    defaultErrorMessage: ValueOf<typeof AUTH_DEFAULT_ERROR_MESSAGE> = AUTH_DEFAULT_ERROR_MESSAGE.ORDER,
  ) {
    const { name, phone } = formValues;
    try {
      await sendSMS({ param: { name, phone: phone.replace(/[-]/g, '') } });
      setIsSend(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err?.data?.code === AUTH_ERROR_CODE.SMS_OVER_COUNT) {
        await Promise.reject(err);
      } else {
        showToast(err.data?.message || defaultErrorMessage);
        await Promise.reject(err);
      }
    }
  }

  async function handleAuth(
    formValues: AuthenticationFormFields,
    defaultErrorMessage: ValueOf<typeof AUTH_DEFAULT_ERROR_MESSAGE> = AUTH_DEFAULT_ERROR_MESSAGE.ORDER,
  ) {
    const { name, phone, authenticationNumber: code } = formValues;

    if (!code) {
      return;
    }

    const param = {
      name,
      phone: phone.replace(/[-]/g, ''),
      code,
      isOtherUserDelete: false,
    };

    try {
      await auth({
        param,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (
        e.data?.code === AUTH_ERROR_CODE.AUTH_OVER_COUNT ||
        e.data?.code === AUTH_ERROR_CODE.AUTH_FAIL ||
        e.data?.code === AUTH_ERROR_CODE.AUTH_INVALID_CODE
      ) {
        await Promise.reject(e);
      }
      if (e.data?.code === AUTH_ERROR_CODE.OTHER_ACCOUNT) {
        const [title, description] = e.data?.message.split('\n');
        if (await showConfirm(title, description)) {
          await auth({
            param: {
              ...param,
              isOtherUserDelete: true,
            },
          });
        } else {
          await Promise.reject(e);
        }
      } else {
        showToast(e.data?.message || defaultErrorMessage);
        await Promise.reject(e);
      }
    }
  }

  const showToast = useCallback(
    (message: string) => {
      showToastMessage(
        { message },
        {
          autoDismiss: 2000,
          direction: 'bottom',
        },
      );
    },
    [showToastMessage],
  );

  const showConfirm = useCallback(async (title = '', message = '') => confirm({ title, message }), [confirm]);

  return { isSend, disabled, handleSendSMS, handleAuth };
};
