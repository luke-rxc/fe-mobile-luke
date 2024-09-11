import styled from 'styled-components';
import { ContainerStyled as Container, CountDownStyled } from '@features/authentication/styles';
import { TextField } from '@pui/textfield';
import { AuthFormSuffix, PhoneNumberField } from '@features/authentication/components';
import type { AuthenticationFormProps } from '@features/authentication/components';
import { Button } from '@pui/button';
import { useAuthForm } from '@features/authentication/hooks';
import {
  AUTH_FORM_NAME_RULE,
  AUTH_FORM_PHONE_RULE,
  AUTH_FORM_AUTH_NUMBER_RULE,
} from '@features/authentication/constants';
import isEmpty from 'lodash/isEmpty';

export const OrdererAuthForm = ({
  editable: editableProps = false,
  isSend: isSendProps = false,
  isDisabledAuthenticationNumberSending = false,
  onSendAuthenticationNumber,
  onAuthentication,
  onEdit,
}: AuthenticationFormProps) => {
  const {
    countDown,
    editable,
    isSend,
    formState: { errors, dirtyFields, touchedFields },
    inputPhone,
    handleSend,
    handleAuth,
    handleEdit,
    toTimeText,
    register,
  } = useAuthForm({
    editable: editableProps,
    isSend: isSendProps,
    onSendAuthenticationNumber,
    onAuthentication,
    onEdit,
  });

  return (
    <ContainerStyled disabled={editable}>
      <div className="form-field-container">
        <TextField
          className="text-field"
          {...register('name', AUTH_FORM_NAME_RULE)}
          type="text"
          placeholder="이름"
          error={!!errors.name && touchedFields.name}
          helperText={errors.name?.message ?? ''}
        />
      </div>
      <div className="form-field-container field-with-button auth-phone">
        <PhoneNumberField
          className="text-field"
          {...register('phone', AUTH_FORM_PHONE_RULE)}
          type="tel"
          maxLength={13}
          placeholder="010-0000-0000"
          error={!!errors.phone && touchedFields.phone}
          helperText={errors.phone?.message ?? ''}
          suffix={
            <AuthFormSuffix
              editable={editable}
              isSend={isSend}
              disabled={!!errors.phone || isDisabledAuthenticationNumberSending || inputPhone.length === 0}
              onEdit={handleEdit}
              onSend={handleSend}
            />
          }
        />
      </div>
      {isSend && (
        <div className="form-field-container field-with-button">
          <TextField
            className="text-field"
            {...register('authenticationNumber', AUTH_FORM_AUTH_NUMBER_RULE)}
            type="tel"
            placeholder="인증번호 6자리"
            error={!!errors.authenticationNumber && touchedFields.authenticationNumber}
            allowClear={false}
            suffix={<CountDownStyled>{toTimeText()}</CountDownStyled>}
            helperText={errors.authenticationNumber?.message ?? ''}
          />
        </div>
      )}
      <div className="button-wrapper">
        <Button
          className="auth-button"
          size="large"
          variant="primary"
          onClick={handleAuth}
          block
          bold
          disabled={!isEmpty(errors) || !dirtyFields.authenticationNumber || countDown <= 0}
        >
          완료
        </Button>
      </div>
    </ContainerStyled>
  );
};

const ContainerStyled = styled(Container)`
  .form-wrapper {
    padding: ${({ theme }) => `0 ${theme.spacing.s24}`};
  }
  .form-field-container {
    margin-bottom: ${({ theme }) => theme.spacing.s12};
  }

  .button-wrapper {
    padding-top: ${({ theme }) => theme.spacing.s12};
  }

  .auth-button {
    margin-left: 0;
  }
`;
