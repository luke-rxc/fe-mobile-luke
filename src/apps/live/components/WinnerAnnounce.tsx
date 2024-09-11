import classnames from 'classnames';
import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { transitionDuration } from '../constants';
import { WinnerAnnounceProps } from '../hooks';

interface Props
  extends Omit<WinnerAnnounceProps, 'onClose' | 'list' | 'inputFocused' | 'nickname' | 'transitionDuration'> {
  isReady: boolean;
  // Close status
  closed: boolean;
  children: React.ReactNode;
  className?: string;
}

export const WinnerAnnounce = styled(
  forwardRef<HTMLDivElement, Props>(({ isReady, closed, children, className, ...props }, ref) => {
    const classNames = classnames(className, {
      'is-open': isReady,
      'is-closed': closed,
    });

    return (
      <div ref={ref} className={classNames} {...props}>
        <div className="header-area" />
        {children}
      </div>
    );
  }),
)`
  width: 100%;
  // header 6.4 + wowdraw 29.2
  height: 35.6rem;
  background-color: ${({ theme }) => theme.light.color.white};
  ${({ theme }) => theme.mixin.absolute({ t: '0' })};
  visibility: hidden;
  transform: translateY(-35.6rem);
  border-radius: 0 0 0.8rem 0.8rem;
  z-index: 3;

  &.is-open {
    visibility: visible;
    transform: translateY(0);
    transition: transform ${transitionDuration}ms ease-in;
  }

  &.is-closed {
    transform: translateY(-35.6rem);
    transition: transform ${transitionDuration}ms ease-in;
  }

  .header-area {
    width: 100%;
    height: 6.4rem;
  }
`;
