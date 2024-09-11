/* eslint-disable @typescript-eslint/no-explicit-any */
import isNumber from 'lodash/isNumber';
import styled from 'styled-components';
import classnames from 'classnames';
import { forwardRef } from 'react';
import { Action, ActionProps } from '@pui/action';
import { Spinner } from '@pui/spinner';

export type ButtonProps = ActionProps & {
  /** 누름효과 사용여부 */
  noPress?: boolean;
  /** 블록요소 여부 */
  block?: boolean;
  /** font weight의 볼드여부 */
  bold?: boolean;
  /** 선택 여부 체크 */
  selected?: boolean;
  /** 로딩 여부에 따른 Spinner 표시 */
  loading?: boolean;
  /** 활성화 여부 */
  disabled?: boolean;
  /** 사이즈 (디자인 가이드에 따라 bubble | squircle는 사이즈에 포함) */
  size?: 'small' | 'medium' | 'regular' | 'large' | 'bubble' | 'squircle';
  /** 스타일 */
  variant?: 'none' | 'primary' | 'secondary' | 'tertiaryline' | 'tertiaryfill';
  /** 텍스트 앞에 붙는 아이콘을 위한 props */
  prefix?: React.ReactNode;
  /** 텍스트 뒤에 붙는 아이콘을 위한 props */
  suffix?: React.ReactNode;
  /** Description */
  description?: React.ReactNode;
};

const ButtonComponent = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      block,
      bold,
      loading,
      selected,
      disabled,
      noPress,
      size,
      variant,
      prefix,
      suffix,
      description,
      children,
      ...props
    },
    ref,
  ) => {
    const classNames = classnames(className, `is-${size || 'small'}`, `is-${variant || 'none'}`, {
      'is-press': !noPress,
      'is-bold': bold,
      'is-block': block,
      'is-loading': loading,
      'is-disabled': disabled,
      'is-selected': selected,
      'is-description': description || isNumber(description),
    });

    return (
      <Action ref={ref} className={classNames} disabled={disabled} {...(props as any)}>
        <span className="button-press" />
        <span className="button-content-wrapper">
          {prefix && <span className="button-prefix">{prefix}</span>}
          <span className="button-content-inner">
            <span className="button-content">{children}</span>
            <span className="button-desc">{description}</span>
          </span>
          {suffix && <span className="button-suffix">{suffix}</span>}
        </span>
        {loading && <span className="button-spinner" children={<Spinner size="small" />} />}
      </Action>
    );
  },
);

/**
 * Figma의 Button 마스터 컴포넌트
 */
export const Button = styled(ButtonComponent)`
  display: inline-flex;
  box-sizing: border-box;
  position: relative;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  transition: all 0.2s;
  user-select: none;

  .button-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    line-height: 0;
    transition: opacity 0.2s;
  }

  .button-press {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .button-content-wrapper {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    opacity: 1;
    transition: opacity 0.2s;
  }

  .button-content-inner {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .button-content {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    /** .button-desc요소의 (height + marginTop)를 2로 나눈 값만큰 아래로 내림 */
    transform: translate3d(0, 0.8rem, 0);
  }

  .button-desc {
    display: block;
    height: 1.4rem;
    margin-top: 0.2rem;
    opacity: 0;
    font: ${({ theme }) => theme.fontType.miniB};
  }

  .button-prefix,
  .button-suffix {
    display: inline-block;
    transform: translate3d(0, 0, 0); /** press시 미세하게 떠리는 현상이 있어 추가 */
    line-height: 0; /** icon 사용시 수직정렬을 위해 추가 */
    vertical-align: middle;
  }

  .button-prefix {
    margin-right: 0.8rem;
  }

  .button-suffix {
    margin-left: 0.8rem;
  }

  &.is-description {
    .button-content {
      transform: translate3d(0, 0, 0);
      transition: transform 0.5s;
    }

    .button-desc {
      opacity: 1;
      transition: opacity 0.5s;
    }
  }

  &.is-block {
    display: flex;
    width: 100%;
  }

  &.is-bold {
    font-weight: bold !important;
  }

  &.is-disabled {
    pointer-events: none;
  }

  &.is-loading {
    pointer-events: none;

    .button-content-wrapper {
      opacity: 0;
    }

    .button-spinner {
      opacity: 1;
    }
  }

  &.is-small {
    height: 3.2rem;
    padding: 0 1.2rem;
    border-radius: ${({ theme }) => theme.radius.r6};
    font: ${({ theme }) => theme.fontType.small};
  }

  &.is-medium {
    height: 4rem;
    padding: 0 1.2rem;
    border-radius: ${({ theme }) => theme.radius.r6};
    font: ${({ theme }) => theme.fontType.small};
  }

  &.is-regular {
    height: 4.8rem;
    padding: 0 1.2rem;
    border-radius: ${({ theme }) => theme.radius.r8};
    font: ${({ theme }) => theme.fontType.medium};
  }

  &.is-large {
    height: 5.6rem;
    padding: 0 1rem;
    border-radius: ${({ theme }) => theme.radius.r8};
    font: ${({ theme }) => theme.fontType.medium};
  }

  &.is-bubble {
    min-width: 4rem;
    height: 3.2rem;
    padding: 0 1.6rem;
    border-radius: 1.6rem;
    font: ${({ theme }) => theme.fontType.small};
  }

  &.is-squircle {
    min-width: 4rem;
    height: 3.2rem;
    padding: 0 1.2rem;
    border-radius: ${({ theme }) => theme.radius.r6};
    font: ${({ theme }) => theme.fontType.small};
  }

  &.is-none {
    &.is-press:active {
      opacity: 0.5;
    }
  }

  &.is-primary {
    background: ${({ theme }) => theme.color.brand.tint};
    transform: scale(1);
    color: ${({ theme }) => theme.color.white};
    ${Spinner} {
      color: inherit;
    }

    &.is-press:active {
      transform: scale(0.96);

      .button-press {
        background: ${({ theme }) => theme.color.white};
        opacity: 0.2;
      }
    }

    &.is-selected {
      background: ${({ theme }) => theme.color.gray8Filled};
      color: ${({ theme }) => theme.color.brand.tint};
    }

    &.is-disabled {
      background: ${({ theme }) => theme.color.gray8Filled};
      color: ${({ theme }) => theme.color.gray20};
    }
  }

  &.is-secondary {
    background: ${({ theme }) => theme.color.whiteVariant1};
    box-shadow: ${({ theme }) => `0 0 0 1px ${theme.color.brand.tint} inset`};
    color: ${({ theme }) => theme.color.brand.tint};

    &.is-press:active {
      transform: scale(0.96);

      .button-press {
        background: ${({ theme }) => theme.color.black};
        opacity: 0.03;
      }
    }

    &.is-selected {
      box-shadow: ${({ theme }) => `0 0 0 1px ${theme.color.gray8Filled} inset`};
      color: ${({ theme }) => theme.color.gray8Filled};
    }

    &.is-disabled {
      box-shadow: ${({ theme }) => `0 0 0 1px ${theme.color.gray8Filled} inset`};
      color: ${({ theme }) => theme.color.gray8Filled};
    }
  }

  &.is-tertiaryline {
    background: ${({ theme }) => theme.color.whiteVariant1};
    box-shadow: ${({ theme }) => `0 0 0 1px ${theme.color.gray8} inset`};
    color: ${({ theme }) => theme.color.brand.tint};

    &.is-press:active {
      .button-press {
        background: ${({ theme }) => theme.color.black};
        opacity: 0.03;
      }
    }

    &.is-selected {
      box-shadow: ${({ theme }) => `0 0 0 1px ${theme.color.gray8Filled} inset`};
      color: ${({ theme }) => theme.color.gray8Filled};
    }

    &.is-disabled {
      box-shadow: ${({ theme }) => `0 0 0 1px ${theme.color.gray8Filled} inset`};
      color: ${({ theme }) => theme.color.gray8Filled};
    }
  }

  &.is-tertiaryfill {
    background: ${({ theme }) => theme.color.gray3};
    color: ${({ theme }) => theme.color.brand.tint};

    .button-desc {
      color: ${({ theme }) => theme.color.gray50};
      font-weight: normal;
    }

    &.is-press:active {
      .button-press {
        background: ${({ theme }) => theme.color.black};
        opacity: 0.03;
      }
    }

    &.is-selected {
      background: ${({ theme }) => theme.color.gray8Filled};
      color: ${({ theme }) => theme.color.gray20};
    }

    &.is-disabled {
      background: ${({ theme }) => theme.color.gray3};
      color: ${({ theme }) => theme.color.gray20};
    }
  }
` as React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement | HTMLAnchorElement>> & string;
