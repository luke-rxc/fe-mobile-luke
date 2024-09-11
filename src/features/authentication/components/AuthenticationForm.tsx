import { TextField } from '@pui/textfield';
import { Button } from '@pui/button';
import { ReactNode } from 'react';
import { AuthenticationFormFields } from '../types';
import { PhoneNumberField } from './PhoneNumberField';
import { useAuthForm } from '../hooks';
import { ContainerStyled, CountDownStyled } from '../styles';
import { AuthFormSuffix } from './AuthFormSuffix';
import { AUTH_FORM_NAME_RULE, AUTH_FORM_PHONE_RULE, AUTH_FORM_AUTH_NUMBER_RULE } from '../constants';

export interface AuthenticationFormProps {
  isSend: boolean;
  editable?: boolean;
  isDisabledAuthenticationNumberSending?: boolean;
  onSendAuthenticationNumber: (formValues: AuthenticationFormFields) => Promise<void>;
  onAuthentication: (formValues: AuthenticationFormFields) => Promise<void>;
  onEdit?: () => void;
  isIdentifiedAuthForm?: boolean;
  bottomArea?: ReactNode;
}

export const AuthenticationForm = ({
  editable: editableProps = false,
  isSend: isSendProps = false,
  isDisabledAuthenticationNumberSending = false,
  onSendAuthenticationNumber,
  onAuthentication,
  onEdit,
  isIdentifiedAuthForm = false,
  bottomArea = false,
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
          disabled={isIdentifiedAuthForm}
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
          disabled={isIdentifiedAuthForm}
          suffix={
            <AuthFormSuffix
              editable={editable}
              isSend={isSend}
              disabled={
                !!errors.phone ||
                isDisabledAuthenticationNumberSending ||
                inputPhone?.length === 0 ||
                isIdentifiedAuthForm
              }
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
            suffix={
              <>
                <CountDownStyled>{toTimeText()}</CountDownStyled>
                <Button
                  className="auth-button"
                  bold
                  size="medium"
                  variant="primary"
                  onClick={handleAuth}
                  disabled={!!errors.authenticationNumber || !dirtyFields.authenticationNumber || countDown <= 0}
                >
                  확인
                </Button>
              </>
            }
            helperText={errors.authenticationNumber?.message ?? ''}
          />
        </div>
      )}
      {bottomArea && <div className="bottom-wrapper">{bottomArea}</div>}
    </ContainerStyled>
  );
};
