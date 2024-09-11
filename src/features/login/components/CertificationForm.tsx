import { Button } from '@pui/button';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import classnames from 'classnames';
import { VerifyCodeInput } from '@features/login/components';
import { useEffect, useRef } from 'react';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { ConfirmAgreements } from './ConfirmAgreements';

interface Props {
  type: string;
  method: string;
  autoSubmit: boolean;
  isShowAgreement: boolean;
  onSubmit: () => void;
}

export const CertificationForm = ({ type, method, autoSubmit, isShowAgreement, onSubmit }: Props) => {
  const {
    register,
    setFocus,
    formState: { errors, isValid, isSubmitting },
    clearErrors,
    trigger,
  } = useFormContext();
  const isShowVerifyCode = method === 'email';
  const { isIOS, isAndroid } = useDeviceDetect();
  const verifyCodeRef = useRef<HTMLInputElement | null>(null);
  const { ref, ...rest } = isShowVerifyCode
    ? register('verifyCode', {
        validate: {
          len: (val) => val.length === 4,
        },
        required: true,
      })
    : { ref: undefined };

  const verifyContainerClassName = classnames('verify-container', {
    error: errors.verifyCode && errors.verifyCode.type === 'manual',
    login: type === 'login',
  });

  const buttonClassName = classnames('btn-box', {
    disabled: !isValid,
  });

  const handleConfirm = async () => {
    verifyCodeRef.current?.blur();
    await onSubmit();
  };

  useEffect(() => {
    const handleContextMenu = (evt: MouseEvent) => {
      evt.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu, false);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, false);
    };
  }, []);

  useEffect(() => {
    if (isValid && autoSubmit) {
      handleConfirm();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isAndroid) {
        if (e.key === 'Enter') {
          e.preventDefault();
          verifyCodeRef.current?.blur();
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isIOS || !(isValid && autoSubmit)) {
      return undefined;
    }

    const el = verifyCodeRef.current;
    let start = 0;

    const handleTouchStart = () => {
      start = performance.now();
    };

    const handleFocus = () => {
      const delta = Math.abs(performance.now() - start);

      if (delta > 200) {
        handleConfirm();
      }
    };

    window?.addEventListener('touchstart', handleTouchStart);
    el?.addEventListener('blur', handleFocus);

    return () => {
      window?.removeEventListener('touchstart', handleTouchStart);
      el?.removeEventListener('blur', handleFocus);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  useEffect(() => {
    if (method === 'kakao' && type === 'join') {
      trigger();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ContainerStyled onSubmit={onSubmit} className={method}>
      {isShowVerifyCode && (
        <VerifyCodeInput
          {...rest}
          ref={(e) => {
            ref?.(e);
            verifyCodeRef.current = e;
          }}
          className={verifyContainerClassName}
          onClick={() => {
            setFocus('verifyCode');
            clearErrors();
          }}
          autoFocus
          allowClear={false}
          // eslint-disable-next-line jsx-a11y/tabindex-no-positive
          tabIndex={1}
        />
      )}
      {isShowAgreement && (
        <div className="agreement-box">
          <ConfirmAgreements />
        </div>
      )}
      {!autoSubmit && (
        <div className={buttonClassName}>
          <Button
            type="submit"
            className="submit"
            disabled={!isValid || isSubmitting}
            variant="primary"
            size="large"
            block
            bold
          >
            확인
          </Button>
        </div>
      )}
    </ContainerStyled>
  );
};

const ContainerStyled = styled.form`
  width: 100%;

  .btn-box {
    opacity: 1;
    transition: opacity 0.5s;
    margin-top: 1.2rem;
    padding: 1.2rem 2.4rem;

    &.disabled {
      opacity: 0;
    }
  }

  &.email {
    .verify {
      display: block;
      width: 100%;
      padding: 0 5.6rem;
    }
  }

  & .agreement-box {
    padding-bottom: 0;
    padding-top: 4.8rem;
  }
`;
