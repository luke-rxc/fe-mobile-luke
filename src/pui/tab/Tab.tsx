import React, { forwardRef } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

export interface TabProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'type' | 'role' | 'onClick'> {
  label: string | number;
  value: string | number;
  type?: 'underline' | 'bubble';
  selected?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: string | number) => void;
}

const TabComponent = forwardRef<HTMLButtonElement, TabProps>(
  ({ type = 'underline', label, value, selected, className, onClick, ...props }, ref) => {
    const classNames = classnames(className, `is-${type}`);

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      onClick?.(e, value);
    };

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        className={classNames}
        aria-selected={!!selected}
        onClick={handleClick}
        {...props}
      >
        <span className="tab-label is-default">{label}</span>
        <span className="tab-label is-select">{label}</span>
      </button>
    );
  },
);

/**
 * figma tab
 */
export const Tab = styled(TabComponent)`
  ${({ theme }) => theme.mixin.centerItem(true)};
  box-sizing: border-box;
  position: relative;

  .tab-label {
    max-width: 12.8rem;
    ${({ theme }) => theme.ellipsis()};

    &.is-default {
      ${({ theme }) => theme.mixin.center()};
      visibility: visible;
      width: 100%;
    }

    &.is-select {
      visibility: hidden;
      font-weight: bold;
    }
  }

  &[aria-selected='true'] {
    .tab-label.is-default {
      visibility: hidden;
    }

    .tab-label.is-select {
      visibility: visible;
    }
  }

  &.is-underline {
    flex: 1 0 auto;
    height: 4.8rem;
    padding: ${({ theme }) => `0 ${theme.spacing.s12}`};
    color: ${({ theme }) => theme.color.text.textTertiary};
    font: ${({ theme }) => theme.fontType.medium};

    &:before {
      ${({ theme }) => theme.mixin.absolute({ b: 0, l: 0 })};
      display: none;
      width: 100%;
      height: 0.2rem;
      background: ${({ theme }) => theme.color.brand.tint};
      content: '';
    }

    &[aria-selected='false']:active {
      opacity: 0.5;
    }

    &[aria-selected='true'] {
      color: ${({ theme }) => theme.color.brand.tint};

      &:before {
        display: block;
      }
    }
  }

  &.is-bubble {
    flex: 0 0 auto;
    height: 3.2rem;
    padding: ${({ theme }) => `0 ${theme.spacing.s16}`};
    border-radius: 2rem;
    color: ${({ theme }) => theme.color.text.textTertiary};
    font: ${({ theme }) => theme.fontType.small};

    &[aria-selected='false']:active {
      opacity: 0.5;
    }

    &[aria-selected='true'] {
      background: ${({ theme }) => theme.color.brand.tint};
      color: ${({ theme }) => theme.color.white};
    }
  }
`;
