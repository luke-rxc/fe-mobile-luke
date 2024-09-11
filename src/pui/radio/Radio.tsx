import React, { createElement, useCallback, forwardRef } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import isString from 'lodash/isString';
import { GenerateHapticFeedbackParams, GenerateHapticFeedbackType } from '@constants/webInterface';
import { useWebInterface } from '@hooks/useWebInterface';

export type HapticType = GenerateHapticFeedbackParams | GenerateHapticFeedbackType | false;

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * wrapper element tag
   * @default label
   */
  is?: keyof React.ReactHTML;
  /** 블록요소 여부 */
  block?: boolean;
  /** 체크박스 라벨 */
  label?: React.ReactNode;
  /** css align-items 속성 (default: center) */
  align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  /** haptic */
  haptic?: HapticType;
}

const RadioComponent = forwardRef<HTMLInputElement, RadioProps>(
  ({ is = 'label', block, label, readOnly, className, children, haptic, onChange, ...props }, ref) => {
    const classNames = classnames(className, readOnly && 'is-readonly');
    const { generateHapticFeedback } = useWebInterface();

    const RootEl = useCallback(
      (rootProps: Pick<RadioProps, 'className' | 'children'>) => createElement(is, rootProps),
      [is],
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      haptic && generateHapticFeedback(isString(haptic) ? { type: haptic } : haptic);
      onChange?.(e);
    };

    return (
      <RootEl className={classNames}>
        <input type="radio" ref={ref} onChange={handleChange} {...props} />
        <span className="radio-handler" />
        {(label || children) && <span className="radio-label">{label || children}</span>}
      </RootEl>
    );
  },
);

/**
 * Figma Radio 컴포넌트
 */
export const Radio = styled(RadioComponent)`
  display: ${({ block }) => (block ? 'flex' : 'inline-flex')};
  align-items: ${({ align = 'center' }) => align};
  position: relative;
  overflow: hidden;

  &.is-readonly {
    pointer-events: none;
    touch-action: none;
  }

  input {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 0;
    height: 0;
    font-size: 1px;
    opacity: 0;
  }

  .radio-label {
    flex: 1 1 auto;
    font-size: ${({ theme }) => theme.fontSize.s12};
    line-height: 1.4rem;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }

  .radio-handler {
    flex: 0 0 auto;
    box-sizing: border-box;
    position: relative;
    width: 4rem;
    height: 4rem;
    font-size: 0;

    &:before,
    &:after {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      border-radius: 50%;
      content: '';
    }

    &:before {
      width: 2.2rem;
      height: 2.2rem;
      border: 0.2rem solid ${({ theme }) => theme.color.gray50};
    }

    &:after {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      background: transparent;
    }
  }

  input:checked + .radio-handler {
    &:before {
      border-color: ${({ theme }) => theme.color.brand.tint};
    }
    &:after {
      background: ${({ theme }) => theme.color.brand.tint};
    }
  }

  input:disabled + .radio-handler {
    &:before {
      border-color: ${({ theme }) => theme.color.gray20};
    }
  }

  input:checked:disabled + .radio-handler {
    &:after {
      background: ${({ theme }) => theme.color.gray20};
    }
  }
`;
