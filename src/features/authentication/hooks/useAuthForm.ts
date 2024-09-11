import { useWebInterface } from '@hooks/useWebInterface';
import { useCountDownService } from '@services/useCountDownService';
import { toMMSS } from '@utils/toTimeformat';
import { useCallback, useState, useRef, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { AUTHENTICATION_NUMBER_LIMIT_TIME_MS, AUTH_ERROR_CODE } from '../constants';
import { AuthenticationFormFields } from '../types';

interface UseAuthFormProps {
  editable: boolean;
  isSend: boolean;
  onSendAuthenticationNumber: (formValues: AuthenticationFormFields) => Promise<void>;
  onAuthentication: (formValues: AuthenticationFormFields) => Promise<void>;
  onEdit?: () => void;
}

export const useAuthForm = ({
  editable: editableProps,
  isSend: isSendProps,
  onSendAuthenticationNumber,
  onAuthentication,
  onEdit,
}: UseAuthFormProps) => {
  const { countDown, reset, pause } = useCountDownService({ countDown: 0 });
  const [editable, setEditable] = useState(editableProps);
  const [isSend, setIsSend] = useState(isSendProps);
  const {
    register,
    getValues,
    setError,
    clearErrors,
    trigger,
    reset: resetForm,
    formState,
  } = useFormContext<AuthenticationFormFields>();
  const { confirm } = useWebInterface();
  const inputPhone = useWatch({ name: 'phone' });
  const isLoadingRef = useRef(false);

  const setIsLoading = (loading: boolean) => {
    isLoadingRef.current = loading;
  };

  async function handleSendAuthenticationNumber() {
    const formValues = getValues();

    const isValid = await trigger(['name', 'phone']);

    if (isValid) {
      await onSendAuthenticationNumber(formValues)
        .then(() => {
          resetForm({ ...getValues(), authenticationNumber: '' });
          reset(AUTHENTICATION_NUMBER_LIMIT_TIME_MS);
          setIsSend(true);
        })
        .catch((err) => {
          if (err?.data?.code === AUTH_ERROR_CODE.SMS_OVER_COUNT) {
            setError('phone', {
              type: 'manual',
              message: err.data?.message ?? 'SMS 송신 횟수 초과',
            });
          }
          if (err.type === 'SAME_PHONE') {
            clearErrors('phone');
            setEditable(true);
            pause();
            setIsSend(false);
          }
        });
    }
  }

  async function handleAuthentication() {
    if (!isLoadingRef.current) {
      setIsLoading(true);
      await onAuthentication(getValues())
        .then(() => {
          setIsSend(false);
          setEditable(true);
          pause();
          clearErrors('authenticationNumber');
        })
        .catch((err) => {
          if (err.data?.code === AUTH_ERROR_CODE.OTHER_ACCOUNT) {
            return;
          }

          if (
            err.data?.code === AUTH_ERROR_CODE.AUTH_OVER_COUNT ||
            err.data?.code === AUTH_ERROR_CODE.AUTH_FAIL ||
            err.data?.code === AUTH_ERROR_CODE.AUTH_INVALID_CODE
          ) {
            setError('authenticationNumber', {
              type: 'manual',
              message: err.data?.message ?? '인증번호가 다릅니다',
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  const toTimeText = useCallback((): string => {
    return toMMSS(countDown);
  }, [countDown]);

  const handleEdit = useCallback(async () => {
    if (
      await confirm({
        title: '새로 인증할까요?',
        message: '기존 정보는 삭제됩니다',
      })
    ) {
      setEditable(false);
      resetForm({ ...getValues(), phone: '' });
      onEdit?.();
      await trigger(['name', 'phone']);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    pause();
    setEditable(editableProps);
    setIsSend(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editableProps]);

  return {
    countDown,
    editable,
    isSend,
    formState,
    inputPhone,
    handleSend: handleSendAuthenticationNumber,
    handleAuth: handleAuthentication,
    handleEdit,
    toTimeText,
    register,
  };
};
