import { useForm } from 'react-hook-form';
import { useAuthService, useMutationDrawService } from '@features/authentication/services';
import { AuthenticationFormFields } from '@features/authentication/types';
import { useWebInterface } from '@hooks/useWebInterface';
import { ErrorModel, ErrorDataModel } from '@utils/api/createAxios';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { phoneNumberToString } from '@features/delivery/utils';
import { DrawEventType, DrawReceiveProps } from '@constants/content';
import { useInputBlur } from '../hooks';
import { AUTH_DEFAULT_ERROR_MESSAGE, DRAW_AUTH_STRING } from '../constants';
import { DrawAuthSchema } from '../schemas';

export interface DrawParams {
  eventId: string;
}

export const useDrawService = () => {
  const { isSend, disabled, handleSendSMS: onSendSMS, handleAuth: onAuth } = useAuthService();
  const { alert, close, showToastMessage, initialValues } = useWebInterface();

  const formWrapperRef = useInputBlur<HTMLDivElement>();
  const formMethods = useForm<AuthenticationFormFields>({
    defaultValues: {
      name: '',
      phone: '',
      authenticationNumber: '',
    },
    mode: 'onChange',
  });
  const { setValue } = formMethods;
  const { eventId } = useParams<DrawParams>();
  const { userInfo } = useAuth();
  const [isDisabledConfirm, setDisabledConfirm] = useState(true);

  const handleSendSMS = useCallback(
    async (formValues: AuthenticationFormFields) => {
      return onSendSMS(formValues, AUTH_DEFAULT_ERROR_MESSAGE.DRAW).catch((err: ErrorModel) => {
        return Promise.reject(err);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleAuth = useCallback(async (formValues: AuthenticationFormFields) => {
    await onAuth(formValues, AUTH_DEFAULT_ERROR_MESSAGE.DRAW);
    showToastMessage(
      { message: DRAW_AUTH_STRING.COMPLETE_MESSAGE.AUTH },
      {
        autoDismiss: 2000,
        direction: 'bottom',
      },
    );

    setDisabledConfirm(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 응모 모달 닫기 호출
   */
  const closeDrawAuthModal = (params: DrawReceiveProps) => {
    const { isLimit } = initialValues;
    showToastMessage(
      { message: isLimit ? DRAW_AUTH_STRING.COMPLETE_MESSAGE.LIMIT_DRAW : DRAW_AUTH_STRING.COMPLETE_MESSAGE.DRAW },
      {
        autoDismiss: 2000,
        direction: 'bottom',
      },
    );
    close({ ...params });
  };

  /**
   * 응모 API 호출
   */
  const { mutateAsync: updateRegisterDraw } = useMutationDrawService({
    onError: (error: ErrorModel<ErrorDataModel>) => {
      alert({ message: error.data?.message ?? '' });
    },
  });

  /**
   * 응모 완료 이후 동작
   */
  const handleCompleteDraw = async (data: DrawAuthSchema) => {
    const receiveParams = {
      type: DrawEventType.GOODS,
      data: {
        eventId: data.id,
        isComplete: true,
      },
    } as DrawReceiveProps;

    // 마케팅 동의
    if (data.isAgreeNow) {
      if (await alert({ message: DRAW_AUTH_STRING.MKT_AGREE_MESSAGE })) {
        closeDrawAuthModal(receiveParams);
      }
    } else {
      closeDrawAuthModal(receiveParams);
    }
  };

  /**
   * 응모 확인 버튼 클릭 - 응모 API 호출
   */
  const handleRegisterDraw = async () => {
    const { code } = initialValues;
    const drawResponseData = await updateRegisterDraw({ code, eventId });
    await handleCompleteDraw(drawResponseData);
  };

  useEffect(() => {
    if (userInfo && userInfo?.name && userInfo?.phoneNumber) {
      setValue('name', userInfo?.name);
      setValue('phone', phoneNumberToString(userInfo?.phoneNumber));
    }
  }, [setValue, userInfo]);

  return {
    formMethods,
    formWrapperRef,
    isDisabledAuthenticationNumberSending: disabled,
    isSend,
    isIdentifiedAuthForm: userInfo?.isIdentify,
    isDisabledConfirm,
    handleSendSMS,
    handleAuth,
    handleRegisterDraw,
    updateRegisterDraw,
  };
};
