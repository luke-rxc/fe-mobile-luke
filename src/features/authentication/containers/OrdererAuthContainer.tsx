import { CALL_WEB_EVENT_TYPE } from '@features/authentication/constants';
import { useAuthService } from '@features/authentication/services';
import { AuthenticationFormFields } from '@features/authentication/types';
import { useModal } from '@hooks/useModal';
import { useWebInterface } from '@hooks/useWebInterface';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { OrdererAuthForm } from '../components';
import { useInputBlur } from '../hooks';

export const OrdererAuthContainer = () => {
  const { isSend, disabled, handleSendSMS: onSendSMS, handleAuth: onAuth } = useAuthService();
  const { close, initialValues, setTopBar } = useWebInterface();
  const elRef = useInputBlur<HTMLDivElement>();
  const method = useForm<AuthenticationFormFields>({
    defaultValues: {
      name: '',
      phone: '',
      authenticationNumber: '',
    },
    mode: 'onChange',
  });
  const { closeModal } = useModal();

  const handleSendSMS = useCallback(
    async (formValues: AuthenticationFormFields) => {
      return onSendSMS(formValues).catch((err: ErrorModel) => {
        return Promise.reject(err);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleAuth = useCallback(
    async (formValues: AuthenticationFormFields) => {
      await onAuth(formValues);
      const params = {
        type: CALL_WEB_EVENT_TYPE.ON_SMS_AUTH_CLOSE,
        data: { ...initialValues.data },
      };

      close(params, {
        doWeb: () => {
          closeModal('', params);
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialValues],
  );

  useEffect(() => {
    if (isEmpty(initialValues)) {
      return;
    }

    const { type } = initialValues;

    switch (type) {
      case CALL_WEB_EVENT_TYPE.SET_TITLE:
        setTopBar({ title: initialValues.data?.title });
        break;
      default:
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  return (
    <FormProvider {...method}>
      <ContainerStyled>
        <div className="form-wrapper" ref={elRef}>
          <OrdererAuthForm
            isSend={isSend}
            onSendAuthenticationNumber={handleSendSMS}
            onAuthentication={handleAuth}
            editable={false}
            isDisabledAuthenticationNumberSending={disabled}
          />
        </div>
      </ContainerStyled>
    </FormProvider>
  );
};

const ContainerStyled = styled.div`
  width: 100%;
  padding: 0 2.4rem;
  padding-top: 1.2rem;
`;
