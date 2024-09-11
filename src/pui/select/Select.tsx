import { ChevronDown } from '@pui/icon';
import classnames from 'classnames';
import React, { Attributes, forwardRef, SelectHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { GenerateHapticFeedbackType, GenerateHapticFeedbackParams } from '@constants/webInterface';
import { useWebInterface } from '@hooks/useWebInterface';
import { OptionProps, Option } from './Option';

type Props = SelectHTMLAttributes<HTMLSelectElement> & Attributes;

export interface SelectProps extends Omit<Props, 'size'> {
  /** select box 우측 커스터마이징 영역 */
  suffix?: React.ReactNode;
  /** placeholder */
  placeholder?: string;
  /** placeholder props */
  placeholderStyleProps?: OptionProps;
  /** 에러 상태 유무 */
  error?: boolean;
  /** 안내문구 */
  helperText?: string;
  /** 활성화 유무 */
  disabled?: boolean;
  /** 사이즈 */
  size?: 'large' | 'medium';
  /** 햅틱 인터렉션 */
  haptic?: false | GenerateHapticFeedbackType | GenerateHapticFeedbackParams;
}

const paddingCss = css<SelectProps>`
  padding: ${({ size }) => (size === 'large' ? '1.9rem 3.6rem 1.9rem 1.6rem' : '1.15rem 3.6rem 1.15rem 1.6rem')};
`;

const SelectComponent = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className: classNameProps,
      children,
      suffix,
      placeholder,
      placeholderStyleProps,
      error,
      helperText,
      disabled,
      size = 'large',
      haptic,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const { generateHapticFeedback } = useWebInterface();
    const className = classnames(classNameProps, { disabled, error });

    const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
      if (haptic) {
        const hapticParams = typeof haptic === 'string' ? { type: haptic } : haptic;
        generateHapticFeedback(hapticParams);
      }

      onChange?.(e);
    };

    return (
      <div className={className}>
        <div className="select-box">
          <select {...rest} ref={ref} onChange={handleChange} className="select-native">
            {placeholder && (
              <Option
                disabled
                hidden
                aria-label="none"
                value=""
                className="select-placeholder"
                {...placeholderStyleProps}
              >
                {placeholder}
              </Option>
            )}
            {children}
          </select>
          <div className="suffix-box">
            {suffix ?? <ChevronDown className="icon" color="gray50" size={size === 'large' ? '2.4rem' : '1.6rem'} />}
          </div>
        </div>
        {error && helperText && <p className="helper-text">{helperText}</p>}
      </div>
    );
  },
);

/**
 * Figma Select 컴포넌트
 */
export const Select = styled(SelectComponent).attrs(({ size }) => ({ size: size ?? 'large' }))`
  display: inline-flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  position: relative;
  outline: none;
  border-radius: ${({ theme }) => theme.radius.r8};
  background: none;

  .select-native {
    position: relative;
    z-index: 1;
    appearance: none;
    width: 100%;
    font: ${({ size, theme }) => (size === 'large' ? theme.fontType.medium : theme.fontType.small)};
    ${paddingCss}
    border: none;
    color: ${({ theme }) => theme.color.text.textPrimary};
    overflow: hidden;
    text-overflow: ellipsis;

    &:visited,
    &:focus,
    &:hover,
    &:active {
      outline: none;
    }

    .select-placeholder {
      font: ${({ theme }) => theme.fontType.small};
      color: ${({ theme }) => theme.color.text.textPrimary};
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      ${paddingCss}
    }
  }

  .select-box {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: ${({ size }) => (size === 'large' ? '5.6rem' : '4rem')};
    box-sizing: border-box;
    background: ${({ theme }) => theme.color.background.surface};
    border-radius: ${({ theme }) => theme.radius.r8};

    &::after {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border: 1px solid ${({ theme }) => theme.color.gray8};
      border-radius: ${({ theme }) => theme.radius.r8};
      content: '';
      pointer-events: none;
    }
  }

  .suffix-box {
    position: absolute;
    right: 1.2rem;
    height: ${({ size }) => (size === 'large' ? '2.4rem' : '1.6rem')};
    .icon {
      transition: transform 0.2s ease-out;
    }
  }

  .helper-text {
    margin-top: ${({ theme }) => theme.spacing.s8};
    font: ${({ theme }) => theme.fontType.mini};
    color: ${({ theme }) => theme.color.red};
  }

  &:focus-within {
    .select-box {
      &::after {
        border: 1px solid ${({ theme }) => theme.color.black};
      }
    }
    .suffix-box {
      .icon {
        transform: rotate(180deg);
        transition: transform 0.2s ease-in;
      }
      svg *[fill] {
        fill: ${({ theme }) => theme.color.black} !important;
      }
    }
  }

  &.error {
    select {
      color: ${({ theme }) => theme.color.gray50};
    }
    .select-box {
      &::after {
        border: 1px solid ${({ theme }) => theme.color.semantic.error};
      }
    }
  }

  &.disabled {
    touch-action: none;
    pointer-events: none;
    select {
      color: ${({ theme }) => theme.color.text.textDisabled};
    }
    .select-box {
      background: ${({ theme }) => theme.color.gray3};
      &::after {
        border: 1px solid ${({ theme }) => theme.color.backgroundLayout.line};
      }
    }
    .suffix-box {
      .icon {
      }
      svg *[fill] {
        fill: ${({ theme }) => theme.color.gray20} !important;
      }
    }
  }
`;
