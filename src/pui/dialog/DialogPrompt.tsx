import React, { useState, useEffect, useRef, forwardRef } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Button, ButtonProps } from '@pui/button';
import { TextField, TextFieldProps } from '@pui/textfield';
import { ButtonActionProps, ConfirmProps, DialogToModalProps, DialogType, fadeIn, fadeOut } from './Dialog';

/** Dialog 기본 Props */
export interface DialogPromptBaseProps {
  /** Title */
  title: string;
  /** Description */
  desc: string;
  /** DialogType: 'confirm' or 'alert' */
  type?: DialogType;
  /** DialogType이 'confirm' 일 경우 세팅 */
  confirm?: ConfirmProps;
  /** Cancel 버튼 세팅 */
  cancel?: ButtonActionProps;
  /** TextField Props */
  textField?: TextFieldProps;
  /** Dialog가 활성화 될시의 FadeTime, (Parent 인 Modal 활성화는 hook에서 조절) */
  fadeTime?: number;
  /** Dialog가 Mount될시의 이벤트 */
  onMount?: () => void;
}

/** Dialog Props */
export type DialogPromptProps = React.HTMLAttributes<HTMLDivElement> & DialogToModalProps & DialogPromptBaseProps;

const DialogPromptComponent = forwardRef<HTMLDivElement, DialogPromptProps>(
  (
    {
      transitionState,
      onClose: handleClose,
      title,
      desc,
      type = 'alert',
      confirm,
      cancel,
      textField,
      fadeTime,
      onMount: handleMount,
      className,
      ...rest
    },
    ref,
  ) => {
    const { isIOSWebChrome } = useDeviceDetect();
    const [active, setActive] = useState(true);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const textFieldRef = useRef<HTMLInputElement>(null);
    const { cb: confirmCb, label: confirmOriginLabel, variant } = confirm ?? {};
    const { cb: cancelCb, label: cancelLabel } = cancel ?? {};
    const confirmLabel = confirmOriginLabel ?? 'OK';
    const wrapperClassName = classnames(className, {
      'in-active': !active,
      'ios-web-chrome': isIOSWebChrome,
    });

    const handleConfirm = () => {
      const value = textFieldRef?.current?.value ?? '';
      confirmCb?.(value);
      handleClose();
    };

    const handleCancel = () => {
      cancelCb?.();
      handleClose();
    };

    const handleTextFieldChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
      const textValueLength = evt.target?.value?.length ?? 0;
      if (!!textValueLength && buttonDisabled) {
        setButtonDisabled(false);
      }

      if (!textValueLength && !buttonDisabled) {
        setButtonDisabled(true);
      }
    };

    const confirmProps = {
      bold: true,
      variant: variant ?? 'primary',
      shape: 'round',
      size: 'large',
      children: confirmLabel,
      onClick: handleConfirm,
      className: 'button-action',
    } as ButtonProps;

    useEffect(() => {
      if (transitionState === 'exiting') {
        setActive(false);
      }
    }, [transitionState]);

    useEffect(() => {
      handleMount?.();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className={wrapperClassName} ref={ref} {...rest}>
        <div className="text">
          <p className="text-inner title">{title}</p>
          <p className="text-inner description">{desc}</p>
        </div>
        <div className="text-input">
          <TextField ref={textFieldRef} onChange={handleTextFieldChange} {...textField} />
        </div>
        <div className="button">
          {type === 'confirm' && (
            <Button
              bold
              size="large"
              children={cancelLabel ?? 'Cancel'}
              onClick={handleCancel}
              className="button-action button-action-cancel"
            />
          )}
          <Button {...confirmProps} disabled={buttonDisabled} />
        </div>
      </div>
    );
  },
);

/**
 * #### Figma Dialog(비 Alert성 Dialog) 컴포넌트
 * ##### [Guide 문서](https://www.notion.so/rxc/DialogPrompt-2ef6717cea214da994954ec74a958c06)
 */
export const DialogPrompt = styled(DialogPromptComponent).attrs(({ fadeTime }) => {
  return {
    fadeTime: fadeTime ?? 0.25,
  };
})`
  background-color: ${({ theme }) => theme.color.background.surface};
  width: 28rem;
  border-radius: ${({ theme }) => theme.radius.r12};
  padding: ${({ theme }) => theme.spacing.s24};

  /** Transition */
  animation: ${fadeIn} ease-out forwards;
  animation-duration: ${({ fadeTime }) => `${fadeTime}s`};

  &.in-active {
    animation: ${fadeOut} ease-out forwards;
    animation-duration: ${({ fadeTime }) => `${fadeTime}s`};
  }

  /** Transition : iOS Web Chrome */
  &.ios-web-chrome {
    animation: none;
    animation-duration: 0s;
    &.in-active {
      animation: none;
      animation-duration: 0s;
    }
  }

  /* Text */
  .text {
    /* padding: 0 2.4rem; */
    .text-inner {
      /* Text: Title */
      &.title {
        ${({ theme }) => theme.mixin.multilineEllipsis(2, 21)};
        font: ${({ theme }) => theme.fontType.largeB};
        color: ${({ theme }) => theme.color.text.textPrimary};
        margin-bottom: 0.8rem;
        letter-spacing: -0.01rem;
      }

      /* Text: Description */
      &.description {
        ${({ theme }) => theme.mixin.multilineEllipsis(2, 17)};
        font: ${({ theme }) => theme.fontType.small};
        color: ${({ theme }) => theme.color.text.textTertiary};
      }
    }
  }

  /* Text Field */
  .text-input {
    margin: ${({ theme }) => `${theme.spacing.s24} 0`};
  }

  /* Button */
  .button {
    display: flex;

    .button-action {
      width: 100%;
      height: 4.8rem;
      display: flex;
      flex-shrink: 1;
    }

    .button-action-cancel {
      color: ${({ theme }) => theme.color.text.textTertiary};
      margin-right: 0.8rem;
    }
  }
`;
