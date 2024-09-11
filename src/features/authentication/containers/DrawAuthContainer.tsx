import { FormProvider } from 'react-hook-form';
import styled from 'styled-components';
import { useDrawService } from '@features/authentication/services';
import { Button } from '@pui/button';
import { AuthenticationForm, DrawAuthFooter } from '../components';

export const DrawAuthContainer = () => {
  const {
    formMethods,
    formWrapperRef,
    isSend,
    isDisabledAuthenticationNumberSending,
    isIdentifiedAuthForm,
    isDisabledConfirm,
    handleAuth,
    handleSendSMS,
    handleRegisterDraw,
  } = useDrawService();

  return (
    <FormProvider {...formMethods}>
      <ContainerStyled>
        <div className="form-wrapper" ref={formWrapperRef}>
          <AuthenticationForm
            isSend={isSend}
            onSendAuthenticationNumber={handleSendSMS}
            onAuthentication={handleAuth}
            editable={false}
            isDisabledAuthenticationNumberSending={isDisabledAuthenticationNumberSending}
            isIdentifiedAuthForm={isIdentifiedAuthForm}
            bottomArea={
              <>
                <DrawAuthFooter />
                <div className="button-wrapper">
                  <Button
                    bold
                    block
                    variant="primary"
                    size="large"
                    onClick={handleRegisterDraw}
                    disabled={isIdentifiedAuthForm ? !isIdentifiedAuthForm : isDisabledConfirm}
                  >
                    완료
                  </Button>
                </div>
              </>
            }
          />
        </div>
      </ContainerStyled>
    </FormProvider>
  );
};

const ContainerStyled = styled.div`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s24} ${theme.spacing.s24} ${theme.spacing.s24}`};
`;
