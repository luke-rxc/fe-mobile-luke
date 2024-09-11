import React, { forwardRef } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { Action, ActionProps } from '@pui/action';

export type ButtonTextProps = ActionProps & {
  /** 활성화 여부 */
  disabled?: boolean;
};

export const ButtonTextComponent = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonTextProps>(
  ({ disabled, className, ...props }, ref) => {
    const classNames = classnames(className, { 'is-disabled': disabled });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <Action ref={ref} className={classNames} {...(props as any)} />;
  },
);

/**
 * ButtonText Component
 */
export const ButtonText = styled(ButtonTextComponent)`
  display: inline-flex;
  align-items: center;
  height: 3.2rem;
  padding: ${({ theme }) => `0 ${theme.spacing.s12}`};
  border-radius: ${({ theme }) => theme.radius.r6};
  background: transparent;
  transition: background 200ms;
  font: ${({ theme }) => theme.fontType.small};
  color: ${({ theme }) => theme.color.text.textTertiary};

  &:active {
    background: ${({ theme }) => theme.color.states.pressedCell};
  }

  &.is-disabled {
    pointer-events: none;
    color: ${({ theme }) => theme.color.text.textDisabled};
  }
` as React.ForwardRefExoticComponent<ButtonTextProps & React.RefAttributes<HTMLButtonElement | HTMLAnchorElement>> &
  string;
