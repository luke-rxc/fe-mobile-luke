import { useDrawerInModal } from '@hooks/useDrawerInModal';
import { useWebInterface } from '@hooks/useWebInterface';
import { Button } from '@pui/button';
import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { ModalWrapperRenderProps } from '@pui/modal';
import isEmpty from 'lodash/isEmpty';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { CALL_WEB_EVENT } from '../constants';
import { useEmailLogin, useRedirectUrl } from '../hooks';
import { UserJoinSchema } from '../schemas';
import { useLogService } from '../services';
import { CertificationFormFields } from '../types';
import { updateTokenLocalStorage } from '../utils';
import { ConfirmAgreements } from './ConfirmAgreements';

export type DrawerOrdererAuthContainerProps = ModalWrapperRenderProps;

export const DrawerAgreements = ({ onClose, transitionState }: DrawerOrdererAuthContainerProps) => {
  const history = useHistory();
  const { redirectUrl } = useRedirectUrl();
  const { initialValues } = useWebInterface();
  const { drawerProps: base } = useDrawerInModal({
    onClose,
    transitionState,
  });
  const { alert, showToastMessage } = useWebInterface();
  const method = useForm<CertificationFormFields & { email: string }>({
    defaultValues: {
      isAll: false,
      isAgeAgree: false,
      isServiceAgree: false,
      isPrivacyAgree: false,
      isAdAgree: false,
      verifyCode: '',
      email: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const {
    handleSubmit,
    getValues,
    setValue,
    formState: { isValid, isSubmitting },
  } = method;
  const { join } = useEmailLogin();
  const { logCompleteSignUp, logUserProperties } = useLogService();

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

  const submit = handleSubmit(async () => {
    const { email, verifyCode: code, isAgeAgree: isJoinAgeRequirement, isAdAgree: isAdReceiveAgree } = getValues();

    try {
      const result = await join({
        email,
        code,
        isJoinAgeRequirement,
        isAdReceiveAgree,
      });

      if (result) {
        updateTokenLocalStorage(result);
        logUserProperties(result as UserJoinSchema);
        logCompleteSignUp('email');
        if (result.noticeMessage) {
          showNoticeMessageAndRedirect(result.noticeMessage);
          return;
        }
        window.location.href = redirectUrl ?? '/';
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e?.data?.code === 'E500212' || e?.data?.code === 'E500214') {
        await alert({ message: e.data.message });
        history.replace('/member/login');
        return;
      }

      await alert({ message: e?.data?.message });
    }
  });

  const drawerProps = {
    ...base,
    fullHeight: window.screen.height <= 667,
    dragging: true,
    draggingProps: {
      closeConfirm: {
        title: '약관 동의를 취소하시겠습니까?',
        message: '가입 시 필수 정보입니다',
        disableForceClose: true,
        cb: () => {
          base.onClose();
        },
      },
    },
    title: {
      label: '이용약관',
    },
  };

  useEffect(() => {
    if (!isEmpty(initialValues)) {
      const { type, data } = initialValues;

      if (type === CALL_WEB_EVENT.ON_INIT_AGREEMENT) {
        const { email, code: verifyCode } = data;
        setValue('email', email);
        setValue('verifyCode', verifyCode);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  return (
    <Drawer {...drawerProps}>
      <FormProvider {...method}>
        <ContainerStyled>
          <form onSubmit={submit}>
            <div className="agree-box">
              <ConfirmAgreements />
            </div>
            <div className="button-box">
              <Button type="submit" variant="primary" size="large" block disabled={!isValid || isSubmitting}>
                확인
              </Button>
            </div>
          </form>
        </ContainerStyled>
      </FormProvider>
    </Drawer>
  );
};

const ContainerStyled = styled.div`
  & .button-box {
    padding: 0 2.4rem;
    padding-top: 3.4rem;
    padding-bottom: 2.4rem;
  }
`;
