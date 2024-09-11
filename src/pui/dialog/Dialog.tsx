import React, { useState, useEffect, forwardRef } from 'react';
import styled, { keyframes } from 'styled-components';
import classnames from 'classnames';
import type { TransitionStatus } from 'react-transition-group';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Button, ButtonProps } from '@pui/button';
import { Icon, IconProps } from '@pui/icon';

export interface ButtonActionProps {
  /** 버튼 누를시의 Callback */
  cb?: (value?: string) => void;
  /** 버튼 Label */
  label?: string;
}

export type DialogType = 'confirm' | 'alert';
type ButtonDirectionType = 'horizontal' | 'vertical';

/**
 * Logo Type
 * 1. icon (SVG 파일 규격, 36*36, icon component 기준, 다크모드 지원가능)
 * 2. image (JPG, PNG, SVG 파일 규격, 48 * 48, 다크모드 지원불가)
 * 3. image (JPG, PNG, SVG 파일규격, 최대 280 * 160 안에서 운용, 다크모드 지원불가)
 */
type LogoImageSizeType = '48' | 'free';

export interface LogoImageProps {
  /**
   * @description
   * - size48, sizeFree 내에, url 값을 안받고, 해당 Element를 사용하는 이유는
   *   1. 즉각적으로 활성화되어야 하는 Dialog 특성상, 해당 리소스가 내부에 존재해야 하는 케이스가 있을 수 있음(asset 이용)
   *   2. 1번의 이슈로 인해 통일성있게 element 로 받는 것으로 진행
   */
  element: React.ReactNode;
  size?: LogoImageSizeType;
}

type LogoIconProps = Pick<IconProps, 'icon' | 'size' | 'minSize' | 'maxSize' | 'color'>;

export interface ConfirmProps extends ButtonActionProps {
  variant?: ButtonProps['variant'];
}

/** Hook 기반(useDialog)으로 Dialog 호출시 Modal에서 내려주는 기본 Props */
export interface DialogToModalProps {
  /** (Modal 전용 Props) react-transition-group 내 이벤트 State (Hook 기반(useDialog)으로 진행시 Modal에서 제공) */
  transitionState: TransitionStatus;
  /** (Modal 전용 Props) Dialog(Modal) 닫는 Callback (Hook 기반(useDialog)으로 진행시 Modal에서 제공) */
  onClose: () => void;
}

/** Dialog 기본 Props */
export interface DialogBaseProps {
  /** Logo영역: Icon */
  logoIcon?: LogoIconProps;
  /** Logo영역: Image */
  logoImage?: LogoImageProps;
  /** Title */
  title?: string;
  /** Description */
  desc?: string;
  /** DialogType: 'confirm' or 'alert' */
  type?: DialogType;
  /** 버튼 방향: 'horizontal'(가로형) | 'vertical'(세로형) */
  buttonDirection?: ButtonDirectionType;
  /** DialogType이 'confirm' 일 경우 세팅 */
  confirm?: ConfirmProps;
  /** Cancel 버튼 세팅 */
  cancel?: ButtonActionProps;
  /** Dialog가 활성화 될시의 FadeTime, (Parent 인 Modal 활성화는 hook에서 조절) */
  fadeTime?: number;
  /** Dialog가 Mount될시의 이벤트 */
  onMount?: () => void;
}

/** Dialog Props */
export type DialogProps = React.HTMLAttributes<HTMLDivElement> & DialogToModalProps & DialogBaseProps;

/** Normal Transition */
export const fadeIn = keyframes`
  0% { transform: scale( 0.75 ); opacity: 0}

  90% { opacity: 1;}

  100% { transform: scale( 1 ); opacity: 1}
`;

export const fadeOut = keyframes`
  0% { transform: scale( 1 ); opacity: 1}

  90% { opacity: 0;}

  100% { transform: scale( 0.75 ); opacity: 0}
`;

const getLogoClassName = (logoIcon?: DialogProps['logoIcon'], logoImage?: DialogProps['logoImage']) => {
  if (logoIcon) {
    return 'logo-icon';
  }

  if (logoImage) {
    return logoImage.size ? `logo-image-${logoImage.size}` : 'logo-image-48';
  }

  return '';
};

/**
 * Figma Dialog 컴포넌트
 */
const DialogComponent = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      transitionState,
      onClose: handleClose,
      logoIcon,
      logoImage,
      title,
      desc,
      type = 'alert',
      buttonDirection = 'horizontal',
      confirm,
      cancel,
      fadeTime,
      onMount: handleMount,
      className,
      ...rest
    },
    ref,
  ) => {
    const { isIOSWebChrome } = useDeviceDetect();
    const [active, setActive] = useState(true);
    const { cb: confirmCb, label: confirmOriginLabel, variant } = confirm ?? {};
    const { cb: cancelCb, label: cancelLabel } = cancel ?? {};
    const confirmLabel = confirmOriginLabel ?? 'OK';
    const wrapperClassName = classnames(className, {
      'in-active': !active,
      'ios-web-chrome': isIOSWebChrome,
      'wrapper-vertical-confirm': buttonDirection === 'vertical' && type === 'confirm',
    });
    const logoClassName = getLogoClassName(logoIcon, logoImage);

    const handleConfirm = () => {
      confirmCb?.();
      handleClose();
    };

    const handleCancel = () => {
      cancelCb?.();
      handleClose();
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
        {/* Area: Logo (Optional) */}
        {(logoIcon || logoImage) && (
          <div className={`logo ${logoClassName}`}>
            {logoIcon && <Icon {...logoIcon} />}
            {logoImage && <>{logoImage.element}</>}
          </div>
        )}
        <div className="text">
          {title && <p className="text-inner title">{title}</p>}
          {desc && (
            <p
              className="text-inner description"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: desc }}
            />
          )}
        </div>
        <div className="button">
          {buttonDirection === 'vertical' && <Button {...confirmProps} />}
          {type === 'confirm' && (
            <Button
              bold
              size="large"
              children={cancelLabel ?? 'Cancel'}
              onClick={handleCancel}
              className="button-action button-action-cancel"
            />
          )}
          {buttonDirection === 'horizontal' && <Button {...confirmProps} />}
        </div>
      </div>
    );
  },
);

export const Dialog = styled(DialogComponent).attrs(({ fadeTime, buttonDirection }) => {
  return {
    fadeTime: fadeTime ?? 0.25,
    buttonDirection: buttonDirection ?? 'horizontal',
  };
})`
  width: 28rem;
  padding: ${({ theme }) => `${theme.spacing.s24} 0`};
  border-radius: ${({ theme }) => theme.radius.r12};
  background-color: ${({ theme }) => theme.color.background.surfaceHigh};

  /** Transition */
  animation: ${fadeIn} ease-out forwards;
  animation-duration: ${({ fadeTime }) => `${fadeTime}s`};

  &.wrapper-vertical-confirm {
    padding-bottom: ${({ theme }) => theme.spacing.s16};
  }

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

  /* Logo */
  .logo {
    overflow: hidden;
    border-radius: 1rem;

    /* ios safari border-radius bug fix */
    img {
      border-radius: 1rem;
    }

    &.logo-icon {
      width: 3.6rem;
      height: 3.6rem;
      margin: 0 auto 0.8rem auto;
    }

    &.logo-image-48 {
      width: 4.8rem;
      height: 4.8rem;
      margin: 0 auto 1.2rem auto;
    }

    &.logo-icon svg,
    &.logo-image-48 svg {
      width: 100%;
      height: 100%;
    }

    &.logo-image-free {
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 100%;
      max-height: 16rem;
      margin-bottom: 0.8rem;
    }
  }

  /* Text */
  .text {
    padding: ${({ theme }) => `0 ${theme.spacing.s24}`};

    .text-inner {
      text-align: center;

      /* Text: Title */
      &.title {
        ${({ theme }) => theme.mixin.multilineEllipsis(2, 21)};
        margin-bottom: 0.8rem;
        color: ${({ theme }) => theme.color.text.textPrimary};
        font: ${({ theme }) => theme.fontType.largeB};
        letter-spacing: -0.01rem;
      }

      /* Text: Description */
      &.description {
        ${({ theme }) => theme.mixin.multilineEllipsis(3, 17)};
        color: ${({ theme }) => theme.color.text.textTertiary};
        font: ${({ theme }) => theme.fontType.small};
      }
    }
  }

  /* Button */
  .button {
    margin-top: 2.4rem;
    padding: ${({ theme }) => `0 ${theme.spacing.s24}`};
    ${({ buttonDirection }) => {
      if (buttonDirection === 'horizontal') {
        return 'display: flex;';
      }
      return null;
    }};

    .button-action {
      width: 100%;
      height: 4.8rem;
      ${({ buttonDirection }) => {
        if (buttonDirection === 'horizontal') {
          return `
            display: flex;
            flex-shrink: 1;
          `;
        }
        return null;
      }};
    }

    .button-action-cancel {
      color: ${({ theme }) => theme.color.text.textTertiary};
      ${({ buttonDirection }) => {
        if (buttonDirection === 'horizontal') {
          return 'margin-right: 0.8rem;';
        }
        return 'margin-top: 0.8rem;';
      }};
    }
  }
`;
