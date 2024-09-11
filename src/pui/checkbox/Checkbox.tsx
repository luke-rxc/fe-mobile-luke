import React, { createElement, useCallback, forwardRef } from 'react';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import styled from 'styled-components';
import classnames from 'classnames';
import { GenerateHapticFeedbackParams, GenerateHapticFeedbackType } from '@constants/webInterface';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useWebInterface } from '@hooks/useWebInterface';
import { Icon, CheckboxCheckAos, CheckboxCheckIos } from '@pui/icon';

export type HapticType = GenerateHapticFeedbackParams | GenerateHapticFeedbackType | false;

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
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
  haptic?: HapticType | ((e: React.ChangeEvent<HTMLInputElement>, value: boolean) => HapticType);
}

const CheckboxComponent = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ is = 'label', block, label, readOnly, className, children, haptic, onChange, ...props }, ref) => {
    const { isIOS } = useDeviceDetect();
    const { generateHapticFeedback } = useWebInterface();
    const classNames = classnames(className, isIOS ? 'is-ios' : 'is-aos', readOnly && 'is-readonly');

    const RootEl = useCallback(
      (rootProps: Pick<CheckboxProps, 'className' | 'children'>) => createElement(is, rootProps),
      [is],
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);

      if (isString(haptic)) {
        generateHapticFeedback({ type: haptic });
        return;
      }

      if (isFunction(haptic)) {
        const hapticType = haptic(e, e.target.checked);
        hapticType && generateHapticFeedback(isString(hapticType) ? { type: hapticType } : hapticType);
        return;
      }

      if (isObject(haptic)) {
        generateHapticFeedback(haptic);
      }
    };

    return (
      <RootEl className={classNames}>
        <input type="checkbox" ref={ref} onChange={handleChange} {...props} />
        <span className="checkbox-handler">{isIOS ? <CheckboxCheckIos /> : <CheckboxCheckAos />}</span>
        {(label || children) && <span className="checkbox-label">{label || children}</span>}
      </RootEl>
    );
  },
);

/**
 * Figma Checkbox 컴포넌트
 */
export const Checkbox = styled(CheckboxComponent)`
  display: ${({ block }) => (block ? 'flex' : 'inline-flex')};
  align-items: ${({ align = 'center' }) => align};
  position: relative;
  overflow: hidden;

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

  .checkbox-label {
    flex: 1 1 auto;
    font-size: ${({ theme }) => theme.fontSize.s12};
    line-height: 1.4rem;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }

  .checkbox-handler {
    flex: 0 0 auto;
    box-sizing: border-box;
    position: relative;
    width: 4rem;
    height: 4rem;
    font-size: 0;
    color: ${({ theme }) => theme.color.white};

    &:before {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      border: 0.15rem solid ${({ theme }) => theme.color.gray50};
      background: transparent;
      content: '';
    }

    ${Icon} {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      opacity: 0;
    }
  }

  input:checked + .checkbox-handler {
    &:before {
      border-color: transparent;
      background: ${({ theme }) => theme.color.brand.tint};
    }

    ${Icon} {
      opacity: 1;
    }
  }

  input:disabled + .checkbox-handler {
    &:before {
      border-color: ${({ theme }) => theme.color.gray20};
    }
  }

  input:checked:disabled + .checkbox-handler {
    &:before {
      border-color: transparent;
      background: ${({ theme }) => theme.color.gray20};
    }
  }

  &.is-readonly {
    pointer-events: none;
    touch-action: none;
  }

  &.is-aos {
    .checkbox-handler:before {
      width: 1.8rem;
      height: 1.8rem;
      border-radius: 0.2rem;
    }
  }

  &.is-ios {
    .checkbox-handler:before {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
    }
  }
`;
