import { useCallback, useContext, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { AuthenticationForm } from '@features/authentication/components';
import { AUTH_ERROR_CODE } from '@features/authentication/constants';
import { AuthenticationFormFields } from '@features/authentication/types';
import { phoneNumberToString } from '@features/delivery/utils';
import { ErrorModel } from '@utils/api/createAxios';
import { CheckoutInvalidContext } from '../../contexts/CheckoutInvalidContext';
import { CheckoutOrdererInfoModel } from '../../models';

interface Props {
  orderer: CheckoutOrdererInfoModel;
  isSendAuthNumber: boolean;
  isDisabledAuthNumber: boolean;
  onSendSMS: (formValues: AuthenticationFormFields) => Promise<void>;
  handleAuth: (formValues: AuthenticationFormFields) => Promise<void>;
}

export const CheckoutAuth = ({ orderer, isSendAuthNumber, isDisabledAuthNumber, onSendSMS, handleAuth }: Props) => {
  const { setValue } = useFormContext();
  const { updateIsAuthValid } = useContext(CheckoutInvalidContext);

  const handleSendSMS = useCallback(
    async (formValues: AuthenticationFormFields) => {
      return onSendSMS(formValues).catch((err: ErrorModel) => {
        if (err.data?.code === AUTH_ERROR_CODE.SAME_PHONE) {
          const error = { type: 'SAME_PHONE' };
          setValue('phone', phoneNumberToString(orderer.phone ?? ''));
          updateIsAuthValid(true);
          return Promise.reject(error);
        }

        return Promise.reject(err);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderer],
  );

  const handleEdit = useCallback(() => {
    updateIsAuthValid(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateIsAuthValid(orderer.isIdentify);

    if (orderer.isIdentify) {
      setValue('name', orderer.name);
      setValue('phone', phoneNumberToString(orderer.phone ?? ''));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderer, setValue]);

  return (
    <ContainerStyled>
      <AuthenticationForm
        isSend={isSendAuthNumber}
        onSendAuthenticationNumber={handleSendSMS}
        onAuthentication={handleAuth}
        editable={orderer.isIdentify}
        isDisabledAuthenticationNumberSending={isDisabledAuthNumber}
        onEdit={handleEdit}
      />
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  width: 100%;
  padding: 0 2.4rem;

  .text-field-box,
  .text-field {
    width: 100%;
  }

  .form-field-container {
    margin-bottom: ${({ theme }) => theme.spacing.s12};

    &:last-child {
      padding-bottom: ${({ theme }) => theme.spacing.s24};
    }
  }
`;
