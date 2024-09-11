/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from 'styled-components';
import classnames from 'classnames';
import { forwardRef } from 'react';
import { Action, ActionProps } from '@pui/action';
import { Spinner } from '@pui/spinner';

export type BubbleButtonProps = ActionProps & {
  /** 누름효과 사용여부 */
  noPress?: boolean;
  /** 블록요소 여부 */
  block?: boolean;
  /** font weight의 볼드여부 */
  bold?: boolean;
  /**  */
  selected?: boolean;
  /** 로딩 여부에 따른 Spinner 표시 */
  loading?: boolean;
  /** 활성화 여부 */
  disabled?: boolean;
  /** 스타일 */
  variant?: 'primary' | 'secondary' | 'tertiaryline' | 'tertiaryfill';
};

/**
 * Figma의 Button(bubble) 컴포넌트
 *
 * @TODO mobileweb v1 작업이후 migration
 */
export const BubbleButton = styled(
  forwardRef<HTMLAnchorElement | HTMLButtonElement, BubbleButtonProps>(
    ({ className, block, bold, loading, selected, disabled, noPress, variant, children, ...props }, ref) => {
      const classNames = classnames(className, `is-${variant || 'primary'}`, {
        'is-press': !noPress,
        'is-bold': bold,
        'is-block': block,
        'is-loading': loading,
        'is-disabled': disabled,
        'is-selected': selected,
      });

      return (
        <Action ref={ref} className={classNames} disabled={disabled} {...(props as any)}>
          <span className="button-press" />
          <span className="button-content">{children}</span>
          {loading && <span className="button-spinner" children={<Spinner size="small" />} />}
        </Action>
      );
    },
  ),
)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  transition: all 0.2s;
  vertical-align: middle;
  user-select: none;
  height: 4rem;
  padding: 0 2.4rem;
  border-radius: 2rem;
  font: ${({ theme }) => theme.fontType.t15B};

  .button-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    opacity: 0;
    line-height: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.2s;
  }
  .button-press {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
    border-radius: inherit;
    transition: opacity 0.2s;
  }
  .button-content {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    opacity: 1;
    transition: opacity 0.2s;
  }

  &.is-block {
    display: flex;
    width: 100%;
  }

  &.is-disabled {
    pointer-events: none;
  }

  &.is-loading {
    pointer-events: none;

    .button-content {
      opacity: 0;
    }
    .button-spinner {
      opacity: 1;
    }
  }

  &.is-none {
    &.is-press:active {
      opacity: 0.5;
    }
  }
  &.is-primary {
    color: ${({ theme }) => theme.color.white};
    background: ${({ theme }) => theme.color.tint};
    transform: scale(1);
    ${Spinner} {
      color: inherit;
    }
    &.is-press:active {
      transform: scale(0.96);
      .button-press {
        opacity: 0.2;
        background: ${({ theme }) => theme.color.white};
      }
    }
    &.is-selected {
      color: ${({ theme }) => theme.color.tint};
      background: ${({ theme }) => theme.color.dimmed};
    }
    &.is-disabled {
      color: ${({ theme }) => theme.color.gray20};
      background: ${({ theme }) => theme.color.dimmed};
    }
  }
  &.is-secondary {
    color: ${({ theme }) => theme.color.tint};
    box-shadow: ${({ theme }) => `0 0 0 1px ${theme.color.tint} inset`};
    background: ${({ theme }) => theme.color.surface};
    &.is-press:active {
      transform: scale(0.96);
      .button-press {
        opacity: 0.03;
        background: ${({ theme }) => theme.color.black};
      }
    }
    &.is-selected {
      color: ${({ theme }) => theme.color.dimmed};
      box-shadow: ${({ theme }) => `0 0 0 1px ${theme.color.dimmed} inset`};
    }
    &.is-disabled {
      color: ${({ theme }) => theme.color.dimmed};
      box-shadow: ${({ theme }) => `0 0 0 1px ${theme.color.dimmed} inset`};
    }
  }
  &.is-tertiaryline {
    color: ${({ theme }) => theme.color.tint};
    box-shadow: ${({ theme }) => `0 0 0 1px ${theme.color.gray8} inset`};
    background: ${({ theme }) => theme.color.surface};
    &.is-press:active {
      .button-press {
        opacity: 0.03;
        background: ${({ theme }) => theme.color.black};
      }
    }
    &.is-selected {
      color: ${({ theme }) => theme.color.dimmed};
      box-shadow: ${({ theme }) => `0 0 0 1px ${theme.color.dimmed} inset`};
    }
    &.is-disabled {
      color: ${({ theme }) => theme.color.dimmed};
      box-shadow: ${({ theme }) => `0 0 0 1px ${theme.color.dimmed} inset`};
    }
  }
  &.is-tertiaryfill {
    color: ${({ theme }) => theme.color.tint};
    background: ${({ theme }) => theme.color.gray3};
    &.is-press:active {
      .button-press {
        opacity: 0.03;
        background: ${({ theme }) => theme.color.black};
      }
    }
    &.is-selected {
      color: ${({ theme }) => theme.color.gray20};
      background: ${({ theme }) => theme.color.dimmed};
    }
    &.is-disabled {
      color: ${({ theme }) => theme.color.gray20};
      background: ${({ theme }) => theme.color.gray3};
    }
  }
` as React.ForwardRefExoticComponent<BubbleButtonProps & React.RefAttributes<HTMLButtonElement | HTMLAnchorElement>> &
  string;
